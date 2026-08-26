const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: String,
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
    petType: {
      type: [String],
      enum: ['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'all'],
      default: ['all'],
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [String],
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
