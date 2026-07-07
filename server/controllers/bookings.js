import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const serviceId = req.body.serviceId || req.body.service;
    const { date, time, notes } = req.body;

    const service = await Service.findById(serviceId).populate('user', 'name');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own service' });
    }

    const booking = await Booking.create({
      service: serviceId,
      buyer: req.user._id,
      provider: service.user._id || service.user,
      date,
      time,
      notes,
    });

    const populated = await booking.populate([
      { path: 'service', select: 'title price images' },
      { path: 'buyer', select: 'name email avatar' },
      { path: 'provider', select: 'name email avatar' },
    ]);

    await Notification.create({
      user: service.user._id || service.user,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `New booking request for "${service.title}"`,
      reference: booking._id,
      referenceModel: 'Booking',
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${service.user._id || service.user}`).emit('new_notification', {
        type: 'booking_request',
        title: 'New Booking Request',
        message: `New booking request for "${service.title}"`,
      });
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings where buyer is current user
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ buyer: req.user._id })
      .populate({ path: 'service', select: 'title price images' })
      .populate({ path: 'provider', select: 'name email avatar' })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings where provider is current user
// @route   GET /api/bookings/received
// @access  Private
export const getReceivedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate({ path: 'service', select: 'title price images' })
      .populate({ path: 'buyer', select: 'name email avatar' })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id).populate('service', 'title');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isBuyer = booking.buyer.toString() === req.user._id.toString();
    const isProvider = booking.provider.toString() === req.user._id.toString();

    if (!isBuyer && !isProvider) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    const recipient = isBuyer ? booking.provider : booking.buyer;
    const actionUser = req.user.name || 'User';
    const serviceTitle = booking.service?.title || 'a service';

    let title = 'Booking Update';
    let message = '';
    switch (status) {
      case 'accepted':
        title = 'Booking Accepted';
        message = `Your booking for "${serviceTitle}" has been accepted by ${actionUser}`;
        break;
      case 'rejected':
        title = 'Booking Rejected';
        message = `Your booking for "${serviceTitle}" has been rejected by ${actionUser}`;
        break;
      case 'completed':
        title = 'Booking Completed';
        message = `Booking for "${serviceTitle}" has been marked as completed`;
        break;
      case 'cancelled':
        title = 'Booking Cancelled';
        message = `Booking for "${serviceTitle}" has been cancelled by ${actionUser}`;
        break;
      default:
        title = 'Booking Updated';
        message = `Booking status updated to ${status}`;
    }

    await Notification.create({
      user: recipient,
      type: 'booking_update',
      title,
      message,
      reference: booking._id,
      referenceModel: 'Booking',
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${recipient}`).emit('new_notification', {
        type: 'booking_update',
        title,
        message,
      });
    }

    const populated = await booking.populate([
      { path: 'service', select: 'title price images' },
      { path: 'buyer', select: 'name email avatar' },
      { path: 'provider', select: 'name email avatar' },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'service', select: 'title price images description' })
      .populate({ path: 'buyer', select: 'name email avatar' })
      .populate({ path: 'provider', select: 'name email avatar' });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isBuyer = booking.buyer._id.toString() === req.user._id.toString();
    const isProvider = booking.provider._id.toString() === req.user._id.toString();

    if (!isBuyer && !isProvider) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
