const mongoose = require('mongoose');

const groomingBookingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groomer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    package: { type: String, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    price: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    beforePhotos: [{ url: String, publicId: String }],
    afterPhotos: [{ url: String, publicId: String }],
  },
  { timestamps: true }
);

groomingBookingSchema.index({ groomer: 1, status: 1 });

module.exports = mongoose.model('GroomingBooking', groomingBookingSchema);
