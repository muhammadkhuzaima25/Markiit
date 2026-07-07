import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true, partialFilterExpression: { product: { $exists: true } } });
ReviewSchema.index({ user: 1, service: 1 }, { unique: true, partialFilterExpression: { service: { $exists: true } } });
ReviewSchema.index({ targetUser: 1, createdAt: -1 });

export default mongoose.model('Review', ReviewSchema);
