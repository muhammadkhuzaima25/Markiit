import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentType: {
      type: String,
      enum: ['product', 'service', 'user', 'message'],
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'contentTypeModel',
    },
    contentTypeModel: {
      type: String,
      enum: ['Product', 'Service', 'User', 'Message'],
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason'],
      maxlength: [500, 'Reason cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Report', ReportSchema);
