const express = require('express');
const router = express.Router();
const db = require('../services/databaseService');
const { authMiddleware } = require('../middleware/authMiddleware');
router.use(authMiddleware);
router.get('/', async (req, res, next) => { try { res.json({ settings: await db.getSettings(req.userId) }); } catch (e) { next(e); } });
router.put('/', async (req, res, next) => { try { const allowed = ['temperature', 'maxTokens', 'darkMode', 'language', 'memoryEnabled', 'defaultAgent']; const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowed.includes(key))); res.json({ settings: await db.updateSettings(req.userId, updates) }); } catch (e) { next(e); } });
router.post('/reset', async (req, res, next) => { try { res.json({ settings: await db.updateSettings(req.userId, { temperature: 0.7, maxTokens: 2048, darkMode: true, language: 'en', memoryEnabled: true, defaultAgent: 'promptEngineer' }) }); } catch (e) { next(e); } });
module.exports = router;
