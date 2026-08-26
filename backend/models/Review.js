const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: {
      type: String,
      enum: ['product', 'veterinarian', 'pet_sitter', 'groomer'],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetTypeRef' },
    // Mongoose needs a concrete ref field name; we map targetType -> model manually in the service layer
    targetTypeRef: {
      type: String,
      enum: ['Product', 'User'],
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    images: [{ url: String, publicId: String }],
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
