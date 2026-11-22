const rateLimit = require('express-rate-limit');
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const generalLimiter = rateLimit({
  windowMs,
  limit: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
const generationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: Number(process.env.AI_RATE_LIMIT_MAX || 20),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'AI generation limit reached. Please try again later.' },
});
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Chat rate limit reached. Slow down and try again.' },
});
module.exports = { generalLimiter, generationLimiter, chatLimiter };
