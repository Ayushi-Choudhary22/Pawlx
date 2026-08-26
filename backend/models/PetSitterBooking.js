const mongoose = require('mongoose');

const petSitterBookingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalPrice: Number,
    instructions: String,
  },
  { timestamps: true }
);

petSitterBookingSchema.index({ sitter: 1, status: 1 });
petSitterBookingSchema.index({ owner: 1 });

module.exports = mongoose.model('PetSitterBooking', petSitterBookingSchema);
