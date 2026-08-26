const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
    },
    photo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    species: {
      type: String,
      required: true,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other'],
    },
    breed: { type: String, trim: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
    birthDate: Date,
    age: {
      years: { type: Number, default: 0 },
      months: { type: Number, default: 0 },
    },
    weight: {
      value: Number,
      unit: { type: String, enum: ['kg', 'lb'], default: 'kg' },
    },
    color: String,
    microchipId: { type: String, trim: true },
    medicalConditions: [String],
    allergies: [String],
    ownerNotes: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

petSchema.index({ owner: 1 });

module.exports = mongoose.model('Pet', petSchema);
