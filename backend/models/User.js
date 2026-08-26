const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ROLES = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PET_OWNER,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    aadharNumber: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Role-specific professional fields (populated when role !== pet_owner)
    professionalProfile: {
      bio: String,
      experienceYears: Number,
      consultationFee: Number,
      city: String,
      clinicAddress: String, // full physical address for in-person visits
      offersVideoConsultation: { type: Boolean, default: false },
      availability: [
        {
          day: String,
          slots: [String],
        },
      ],
      rating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      isApproved: { type: Boolean, default: false },
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

// Hash password before saving if it was modified
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
