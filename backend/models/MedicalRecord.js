const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    recordType: {
      type: String,
      enum: ['diagnosis', 'surgery', 'checkup', 'lab_result', 'growth', 'other'],
      default: 'checkup',
    },
    title: { type: String, required: true },
    description: String,
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    weight: Number,
    attachments: [
      {
        url: String,
        publicId: String,
        fileName: String,
      },
    ],
    recordDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

medicalRecordSchema.index({ pet: 1, recordDate: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
