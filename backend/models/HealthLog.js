const mongoose = require('mongoose');
const HealthLogSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partner:  { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  date:     { type: String, required: true },
  type:     { type: String, enum: ['sti_test','pill','checkup','symptom','vaccination','note'], required: true },
  result:   { type: String, enum: ['positive','negative','pending','N/A'], default: 'N/A' },
  notes:    { type: String, default: '' },
  remindAt: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('HealthLog', HealthLogSchema);
