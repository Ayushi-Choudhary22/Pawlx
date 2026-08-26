const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true },
    frequency: {
      type: String,
      enum: ['once_daily', 'twice_daily', 'thrice_daily', 'weekly', 'as_needed'],
      default: 'once_daily',
    },
    times: [String], // e.g. ["08:00", "20:00"]
    startDate: { type: Date, required: true },
    endDate: Date,
    isActive: { type: Boolean, default: true },
    notes: String,
  },
  { timestamps: true }
);

medicineSchema.index({ pet: 1, isActive: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
