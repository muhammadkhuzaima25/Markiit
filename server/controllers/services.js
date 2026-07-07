import Service from '../models/Service.js';

// @desc    Get all active services with filtering, search, pagination, sorting
// @route   GET /api/services
export const getServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const filter = { status: 'active' };

    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.location) {
      filter.locationName = new RegExp(req.query.location, 'i');
    }

    if (req.query.minRating) {
      filter.ratings = { $gte: Number(req.query.minRating) };
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    else if (req.query.sort === 'price_desc') sort = { price: -1 };
    else if (req.query.sort === 'rating') sort = { ratings: -1 };

    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .populate('user', 'name avatar locationName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('user', 'name avatar bio locationName phone');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
export const createService = async (req, res) => {
  try {
    const files = req.files || {};

    const images = (files.images || []).map((f) => f.path);
    const portfolioImages = (files.portfolioImages || []).map((f) => f.path);

    const serviceData = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      priceType: req.body.priceType || 'fixed',
      category: req.body.category,
      deliveryTime: req.body.deliveryTime || '',
      serviceType: req.body.serviceType || 'in_person',
      locationName: req.body.locationName || '',
      user: req.user._id,
      images,
      portfolioImages,
      status: 'active',
    };

    const service = await Service.create(serviceData);

    res.status(201).json({ success: true, service });
  } catch (error) {
    console.error('Create service error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
export const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this service' });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price ? Number(req.body.price) : undefined,
      priceType: req.body.priceType || undefined,
      category: req.body.category,
      deliveryTime: req.body.deliveryTime || undefined,
      serviceType: req.body.serviceType || undefined,
      locationName: req.body.locationName || undefined,
    };

    const files = req.files || {};
    const newImages = files.images || [];
    const newPortfolioImages = files.portfolioImages || [];

    if (newImages.length > 0) {
      updateData.images = newImages.map((f) => f.path);
    }
    if (newPortfolioImages.length > 0) {
      updateData.portfolioImages = newPortfolioImages.map((f) => f.path);
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    service = await Service.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error('Update service error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this service' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get services by current user (any status)
// @route   GET /api/services/my
export const getMyServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .populate('user', 'name avatar locationName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
