const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'cod', 'wallet'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    itemsPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
    },
    trackingHistory: [
      {
        status: String,
        note: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
