const mongoose = require('mongoose');
const SessionSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partner:         { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  date:            { type: String, required: true },
  time:            { type: String, default: '' },
  durationMin:     { type: Number, required: true, min: 1 },
  intensity:       { type: String, enum: ['light','medium','intense'], default: 'medium' },
  calories:        { type: Number, default: 0 },
  bodyWeightKg:    { type: Number, default: 70 },
  positions:       [{ type: String }],
  physicalTags:    [{ type: String }],
  physicalNotes:   { type: String, default: '' },
  mood:            { type: String, default: 'Good' },
  mentalTags:      [{ type: String }],
  mentalNotes:     { type: String, default: '' },
  anxietyLevel:    { type: Number, min:1, max:10, default: 5 },
  connectionLevel: { type: Number, min:1, max:10, default: 5 },
  healthTags:      [{ type: String }],
  periodFlow:      { type: String, enum: ['none','light','medium','heavy'], default: 'none' },
  orgasm:          { self: Boolean, partner: Boolean },
  rating:          { type: Number, min:1, max:5, default: 3 },
  location:        { type: String, default: '' },
  notes:           { type: String, default: '' },
}, { timestamps: true });

SessionSchema.pre('save', function(next) {
  const MET = { light:3.5, medium:5.0, intense:7.0 };
  let cal = ((MET[this.intensity]||5) * (this.bodyWeightKg||70) * (this.durationMin||30)) / 60;
  if (this.positions?.includes('Standing') || this.positions?.includes('Cowgirl')) cal *= 1.1;
  if (this.positions?.includes('Doggy Style') || this.positions?.includes('Reverse Cowgirl')) cal *= 1.05;
  this.calories = Math.round(cal);
  next();
});
module.exports = mongoose.model('Session', SessionSchema);
