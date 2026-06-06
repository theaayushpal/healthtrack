const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });
    const user  = await User.create({ username, email, password });
    const token = user.getSignedJwtToken();
    res.status(201).json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = user.getSignedJwtToken();
    res.json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMe = (req, res) => res.json({ success: true, user: req.user });

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username: req.body.username, bodyWeightKg: req.body.bodyWeightKg },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
