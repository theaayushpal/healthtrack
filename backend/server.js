const express   = require('express');
const cors      = require('cors');
const morgan    = require('morgan');
const dotenv    = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/health',   require('./routes/healthRoutes'));
app.use('/api/stats',    require('./routes/statsRoutes'));

app.get('/', (_req, res) => res.json({ message: '✅ HealthTrack API running', version: '1.0.0' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
