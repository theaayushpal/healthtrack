const Session = require('../models/Session');
const Partner = require('../models/Partner');

exports.getSessions = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.partner) filter.partner = req.query.partner;
    if (req.query.from) filter.date = { ...filter.date, $gte: req.query.from };
    if (req.query.to)   filter.date = { ...filter.date, $lte: req.query.to };
    const data = await Session.find(filter).populate('partner','name color nickname').sort({ date:-1, time:-1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createSession = async (req, res) => {
  try {
    const partner = await Partner.findOne({ _id: req.body.partner, user: req.user._id });
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    const session = await Session.create({ ...req.body, user: req.user._id });
    await session.populate('partner','name color nickname');
    res.status(201).json({ success: true, data: session });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id }).populate('partner');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true }
    ).populate('partner','name color nickname');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
