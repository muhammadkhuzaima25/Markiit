import User from '../models/User.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';

// @desc    Get user by ID
// @route   GET /api/users/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        locationName: user.locationName,
        skills: user.skills,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, location, locationName, skills } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (phone !== undefined) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;
    if (locationName !== undefined) updateFields.locationName = locationName;
    if (skills !== undefined) updateFields.skills = skills;

    if (req.file) {
      updateFields.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public profile with products and services
// @route   GET /api/users/:id/public
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v -email -phone');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const products = await Product.find({ user: user._id, status: 'active' }).sort('-createdAt');
    const services = await Service.find({ user: user._id, status: 'active' }).sort('-createdAt');

    res.status(200).json({
      success: true,
      user,
      products,
      services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nearby users using GeoNear aggregation
// @route   POST /api/users/nearby
export const getNearbyUsers = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50000 } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide lat and lng' });
    }

    const users = await User.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: 'distance',
          maxDistance: parseInt(maxDistance),
          spherical: true,
          query: { isActive: true, _id: { $ne: req.user._id } },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
          bio: 1,
          skills: 1,
          locationName: 1,
          distance: 1,
        },
      },
      { $sort: { distance: 1 } },
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
