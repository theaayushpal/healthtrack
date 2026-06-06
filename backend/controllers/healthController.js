const HealthLog = require('../models/HealthLog');

exports.getLogs = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.partner) filter.partner = req.query.partner;
    const data = await HealthLog.find(filter).populate('partner','name color').sort({ date:-1 });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createLog = async (req, res) => {
  try {
    const log = await HealthLog.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: log });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteLog = async (req, res) => {
  try {
    await HealthLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Log deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
