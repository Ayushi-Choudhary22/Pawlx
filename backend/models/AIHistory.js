const mongoose = require('mongoose');

const aiMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);

const aiHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    topic: {
      type: String,
      enum: ['general', 'breed_info', 'diet_planner', 'symptom_checker', 'emergency'],
      default: 'general',
    },
    messages: [aiMessageSchema],
  },
  { timestamps: true }
);

aiHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('AIHistory', aiHistorySchema);
