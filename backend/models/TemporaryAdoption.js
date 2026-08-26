const mongoose = require('mongoose');

const temporaryAdoptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // host_available: Traveler/host willing to sit a pet
    // sitter_needed: Pet owner needing a temporary host
    type: {
      type: String,
      enum: ['host_available', 'sitter_needed'],
      required: true,
    },
    petName: {
      type: String,
      default: '',
    },
    petSpecies: {
      type: String,
      default: '',
    },
    petBreed: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const temporaryAdoptionRequestSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TemporaryAdoption',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Indexes for faster querying
temporaryAdoptionSchema.index({ type: 1, status: 1 });
temporaryAdoptionSchema.index({ city: 1, state: 1 });

const TemporaryAdoption = mongoose.model('TemporaryAdoption', temporaryAdoptionSchema);
const TemporaryAdoptionRequest = mongoose.model('TemporaryAdoptionRequest', temporaryAdoptionRequestSchema);

module.exports = { TemporaryAdoption, TemporaryAdoptionRequest };
