const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    name: { type: String, required: true, trim: true },
    dateAdministered: { type: Date, required: true },
    nextDueDate: Date,
    administeredBy: { type: String, trim: true },
    batchNumber: String,
    notes: String,
    reminderSent: { type: Boolean, default: false },
    document: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

vaccinationSchema.index({ pet: 1, nextDueDate: 1 });

module.exports = mongoose.model('Vaccination', vaccinationSchema);
