const mongoose = require('mongoose');
const PartnerSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:            { type: String, required: true, trim: true },
  nickname:        { type: String, default: '' },
  ordinal:         { type: Number },
  color:           { type: String, default: '#6C63FF' },
  birthday:        { type: String, default: '' },
  heightCm:        { type: Number },
  weightKg:        { type: Number },
  bloodType:       { type: String, enum: ['','A+','A-','B+','B-','AB+','AB-','O+','O-'], default: ''  },
  notes:           { type: String, default: '' },
  tags:            [{ type: String }],
  status:          { type: String, enum: ['active','past','complicated','other'], default: 'active'  },
  metOn:           { type: String, default: '' },
  periodTrack:     { type: Boolean, default: false },
  avgCycleLen:     { type: Number, default: 28 },
  lastPeriodStart: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Partner', PartnerSchema);
