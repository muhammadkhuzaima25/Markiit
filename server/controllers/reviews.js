import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { targetUser, rating, comment, product, service, booking } = req.body;

    if (!targetUser || !rating) {
      return res.status(400).json({ message: 'Target user and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      user: req.user._id,
      targetUser,
      rating,
      comment,
      product: product || undefined,
      service: service || undefined,
      booking: booking || undefined,
    });

    if (product) {
      const productReviews = await Review.find({ product });
      const avgRating =
        productReviews.reduce((acc, r) => acc + r.rating, 0) /
        productReviews.length;
      await Product.findByIdAndUpdate(product, {
        averageRating: Math.round(avgRating * 10) / 10,
        numReviews: productReviews.length,
      });
    }

    if (service) {
      const serviceReviews = await Review.find({ service });
      const avgRating =
        serviceReviews.reduce((acc, r) => acc + r.rating, 0) /
        serviceReviews.length;
      await Service.findByIdAndUpdate(service, {
        averageRating: Math.round(avgRating * 10) / 10,
        numReviews: serviceReviews.length,
      });
    }

    await Notification.create({
      user: targetUser,
      type: 'review',
      title: 'New Review',
      message: `You received a ${rating}-star review`,
      reference: review._id,
      referenceModel: 'Review',
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${targetUser}`).emit('new_notification', {
        type: 'review',
        title: 'New Review',
        message: `You received a ${rating}-star review`,
      });
    }

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate({ path: 'user', select: 'name avatar' })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
export const getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate({ path: 'user', select: 'name avatar' })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews targeting a user
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ targetUser: req.params.userId })
      .populate({ path: 'user', select: 'name avatar' })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
