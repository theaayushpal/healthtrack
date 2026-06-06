const Session = require('../models/Session');
const Partner = require('../models/Partner');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId   = req.user._id;
    const sessions = await Session.find({ user: userId }).populate('partner','name color');
    const partners = await Partner.find({ user: userId });

    const totalCalories = sessions.reduce((s,x) => s+(x.calories||0), 0);
    const totalMinutes  = sessions.reduce((s,x) => s+(x.durationMin||0), 0);
    const avgRating     = sessions.length ? +(sessions.reduce((s,x)=>s+(x.rating||3),0)/sessions.length).toFixed(1) : 0;
    const avgDuration   = sessions.length ? Math.round(totalMinutes/sessions.length) : 0;

    const moodMap = {};
    sessions.forEach(s => { moodMap[s.mood] = (moodMap[s.mood]||0)+1; });

    const posMap = {};
    sessions.forEach(s => (s.positions||[]).forEach(p => { posMap[p] = (posMap[p]||0)+1; }));

    const byPartner = {};
    sessions.forEach(s => {
      const pid = s.partner?._id?.toString();
      if (!pid) return;
      if (!byPartner[pid]) byPartner[pid] = { name:s.partner.name, color:s.partner.color, count:0, calories:0 };
      byPartner[pid].count++;
      byPartner[pid].calories += (s.calories||0);
    });

    const now = new Date();
    const monthly = Array.from({length:6}, (_,i) => {
      const d   = new Date(now.getFullYear(), now.getMonth()-5+i, 1);
      const key = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      const ss  = sessions.filter(s => s.date?.startsWith(key));
      return { label: d.toLocaleString('default',{month:'short',year:'2-digit'}), count: ss.length, calories: ss.reduce((a,b)=>a+(b.calories||0),0) };
    });

    res.json({ success: true, data: {
      totals:      { sessions:sessions.length, partners:partners.length, calories:totalCalories, minutes:totalMinutes },
      averages:    { rating:avgRating, duration:avgDuration },
      moods:       Object.entries(moodMap).sort((a,b)=>b[1]-a[1]),
      positions:   Object.entries(posMap).sort((a,b)=>b[1]-a[1]).slice(0,6),
      byPartner:   Object.values(byPartner),
      monthly,
      orgasmRates: {
        self:    sessions.length ? Math.round((sessions.filter(s=>s.orgasm?.self).length/sessions.length)*100) : 0,
        partner: sessions.length ? Math.round((sessions.filter(s=>s.orgasm?.partner).length/sessions.length)*100) : 0,
      },
    }});
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
