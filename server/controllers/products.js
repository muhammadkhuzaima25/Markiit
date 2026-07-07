import Product from '../models/Product.js';

// @desc    Get all active products with filtering, search, pagination, sorting
// @route   GET /api/products
export const getProducts = async (req, res) => {
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

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('user', 'name avatar locationName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'name avatar bio locationName phone');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const images = req.files && req.files.length > 0
      ? req.files.map((file) => file.path)
      : ['https://res.cloudinary.com/dbf5ifbd8/image/upload/v1/markiit/placeholder']; // fallback

    const productData = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      condition: req.body.condition || 'Good',
      locationName: req.body.locationName || '',
      user: req.user._id,
      images,
      status: 'active',
    };

    const product = await Product.create(productData);

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price ? Number(req.body.price) : undefined,
      category: req.body.category,
      condition: req.body.condition || undefined,
      locationName: req.body.locationName || undefined,
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path);
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite on a product
// @route   POST /api/products/:id/favorite
export const toggleFavorite = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const userId = req.user._id;
    const index = product.favorites.indexOf(userId);

    if (index === -1) {
      product.favorites.push(userId);
    } else {
      product.favorites.splice(index, 1);
    }

    await product.save();

    res.status(200).json({
      success: true,
      favorited: index === -1,
      favoritesCount: product.favorites.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get products favorited by current user
// @route   GET /api/products/favorites
export const getMyFavorites = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({
      favorites: req.user._id,
      status: 'active',
    });
    const products = await Product.find({
      favorites: req.user._id,
      status: 'active',
    })
      .populate('user', 'name avatar locationName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get products by current user (any status)
// @route   GET /api/products/my
export const getMyProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('user', 'name avatar locationName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
