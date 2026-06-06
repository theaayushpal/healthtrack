const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 6, select: false },
  bodyWeightKg: { type: Number, default: 70 },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};
UserSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};
module.exports = mongoose.model('User', UserSchema);
