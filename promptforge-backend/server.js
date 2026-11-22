require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const aiRoutes = require('./src/routes/aiRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const { generalLimiter } = require('./src/middleware/rateLimiter');

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map((value) => value.trim()).filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(generalLimiter);

app.get('/health', (_req, res) => res.json({
  status: 'ok',
  service: 'promptforge-api',
  timestamp: new Date().toISOString(),
}));

app.use('/api/ai', aiRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/settings', settingsRoutes);

app.use((err, _req, res, _next) => {
  const status = Number(err.status || 500);
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : err.message,
    timestamp: new Date().toISOString(),
  });
});
app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found' }));

if (require.main === module) {
  app.listen(port, () => console.log(`PromptForge API listening on port ${port}`));
}
module.exports = app;
