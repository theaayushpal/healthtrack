const Partner = require('../models/Partner');
const Session = require('../models/Session');

exports.getPartners = async (req, res) => {
  try {
    const data = await Partner.find({ user: req.user._id }).sort({ ordinal: 1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createPartner = async (req, res) => {
  try {
    const count   = await Partner.countDocuments({ user: req.user._id });
    const partner = await Partner.create({ ...req.body, user: req.user._id, ordinal: count + 1 });
    res.status(201).json({ success: true, data: partner });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.getPartner = async (req, res) => {
  try {
    const partner = await Partner.findOne({ _id: req.params.id, user: req.user._id });
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true });
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    await Session.deleteMany({ partner: req.params.id });
    res.json({ success: true, message: 'Partner and sessions deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPartnerStats = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id, partner: req.params.id });
    res.json({ success: true, data: {
      totalSessions: sessions.length,
      totalCalories: sessions.reduce((s,x) => s+(x.calories||0), 0),
      totalMinutes:  sessions.reduce((s,x) => s+(x.durationMin||0), 0),
      avgRating:     sessions.length ? +(sessions.reduce((s,x)=>s+(x.rating||3),0)/sessions.length).toFixed(1) : 0,
      avgDuration:   sessions.length ? Math.round(sessions.reduce((s,x)=>s+(x.durationMin||0),0)/sessions.length) : 0,
    }});
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
