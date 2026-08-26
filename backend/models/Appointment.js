const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    consultationFee: Number,
    isVideoConsultation: { type: Boolean, default: false },
    meetingLink: { type: String, default: '' }, // vet-provided Zoom/Meet/etc. link for video consults
    prescription: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    vetNotes: String,
    cancelReason: String,
  },
  { timestamps: true }
);

appointmentSchema.index({ veterinarian: 1, date: 1 });
appointmentSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
