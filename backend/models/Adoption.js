const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema(
  {
    listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: String,
    gender: { type: String, enum: ['male', 'female', 'unknown'], default: 'unknown' },
    age: { years: Number, months: Number },
    location: {
      city: String,
      state: String,
    },
    photos: [{ url: String, publicId: String }],
    description: { type: String, required: true },
    healthStatus: String,
    isVaccinated: { type: Boolean, default: false },
    isNeutered: { type: Boolean, default: false },
    // Whether this listing is a permanent adoption or a temporary foster placement —
    // set once by the person listing the pet, shown as a badge everywhere the pet appears.
    adoptionType: {
      type: String,
      enum: ['permanent', 'foster'],
      default: 'permanent',
    },
    // Extra context an owner giving up their own pet can provide, so an adopter/foster
    // has a full picture before applying — all optional since shelters/admins listing
    // a found or surrendered pet may not have this information.
    reasonForRehoming: String,
    dietInfo: String, // food/feeding habits
    behaviorNotes: String, // toys, play habits, temperament
    medicalHistory: String, // past checkups, hospital visits, ongoing conditions
    contactNumber: String, // direct number for the person listing, in addition to their account
    status: {
      type: String,
      enum: ['available', 'pending', 'adopted'],
      default: 'available',
    },
  },
  { timestamps: true }
);

const adoptionApplicationSchema = new mongoose.Schema(
  {
    adoption: { type: mongoose.Schema.Types.ObjectId, ref: 'Adoption', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: String,
    // Adopter verification details — collected so the listing owner/admin has enough
    // information to make a responsible placement decision. None of this can be
    // cryptographically verified by the app itself; it's collected for manual review.
    fullName: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emergencyContactName: String,
    emergencyContactNumber: String,
    idProof: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    previousPetExperience: String,
    responsibilityAcknowledged: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

adoptionSchema.index({ status: 1, species: 1 });
adoptionSchema.index({ adoptionType: 1 });

const Adoption = mongoose.model('Adoption', adoptionSchema);
const AdoptionApplication = mongoose.model('AdoptionApplication', adoptionApplicationSchema);

module.exports = { Adoption, AdoptionApplication };
