import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Graphic Design',
        'Web Development',
        'Photography',
        'Home Services',
        'Tutoring',
        'Content Writing',
        'Digital Marketing',
        'Video Editing',
        'Other',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    priceType: {
      type: String,
      enum: ['fixed', 'hourly', 'starting_at'],
      default: 'fixed',
    },
    deliveryTime: {
      type: String,
    },
    serviceType: {
      type: String,
      enum: ['online', 'in_person'],
      default: 'in_person',
    },
    images: {
      type: [String],
    },
    portfolioImages: {
      type: [String],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    locationName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'paused', 'removed'],
      default: 'active',
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Service', ServiceSchema);
