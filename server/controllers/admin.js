import User from '../models/User.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import Report from '../models/Report.js';

const emitNotification = (req, userId, notification) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`user_${userId}`).emit('new_notification', notification);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalProducts,
      totalServices,
      totalBookings,
      activeProducts,
      activeServices,
      newUsersThisMonth,
      newProductsThisMonth,
      newServicesThisMonth,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Service.countDocuments({ status: 'active' }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Product.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Service.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalServices,
      totalBookings,
      totalActiveListings: activeProducts + activeServices,
      newUsersThisMonth,
      newListingsThisMonth: newProductsThisMonth + newServicesThisMonth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activity
// @route   GET /api/admin/recent-activity
// @access  Private (Admin)
export const getRecentActivity = async (req, res) => {
  try {
    const [users, products, services, bookings] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select('name email avatar createdAt'),
      Product.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select('title price images status createdAt'),
      Service.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select('title price images status createdAt'),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select('status date time createdAt'),
    ]);

    const activity = [
      ...users.map((u) => ({ type: 'user', data: u, date: u.createdAt })),
      ...products.map((p) => ({ type: 'product', data: p, date: p.createdAt })),
      ...services.map((s) => ({ type: 'service', data: s, date: s.createdAt })),
      ...bookings.map((b) => ({ type: 'booking', data: b, date: b.createdAt })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);

    res.json({ activity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user suspend
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin)
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: user.isActive ? 'User activated' : 'User suspended',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private (Admin)
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status ? { status } : {};

    const products = await Product.find(filter)
      .populate({ path: 'user', select: 'name email avatar' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product status
// @route   PUT /api/admin/products/:id/status
// @access  Private (Admin)
export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'rejected', 'pending', 'removed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.status = status;
    await product.save();

    await Notification.create({
      user: product.user,
      type: 'listing_update',
      title: 'Product Status Update',
      message: `Your product "${product.title}" has been ${status}`,
      reference: product._id,
      referenceModel: 'Product',
    });

    emitNotification(req, product.user, {
      type: 'listing_update',
      title: 'Product Status Update',
      message: `Your product "${product.title}" has been ${status}`,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private (Admin)
export const getServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status ? { status } : {};

    const services = await Service.find(filter)
      .populate({ path: 'user', select: 'name email avatar' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    res.json({
      services,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service status
// @route   PUT /api/admin/services/:id/status
// @access  Private (Admin)
export const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'rejected', 'pending', 'removed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.status = status;
    await service.save();

    await Notification.create({
      user: service.user,
      type: 'listing_update',
      title: 'Service Status Update',
      message: `Your service "${service.title}" has been ${status}`,
      reference: service._id,
      referenceModel: 'Service',
    });

    emitNotification(req, service.user, {
      type: 'listing_update',
      title: 'Service Status Update',
      message: `Your service "${service.title}" has been ${status}`,
    });

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status ? { status } : {};

    const reports = await Report.find(filter)
      .populate('reporter', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments(filter);

    res.json({
      reports,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve report
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private (Admin)
export const resolveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = 'resolved';
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    await report.save();

    res.json({ message: 'Report resolved', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
