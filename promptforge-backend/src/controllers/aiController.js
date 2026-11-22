const gemini = require('../services/geminiService');
const engine = require('../services/promptEngineService');
const db = require('../services/databaseService');

const safeOptions = (settings = {}) => {
  const rawTemperature = Number(settings.temperature ?? 0.7);
  const rawTokens = Number(settings.maxTokens ?? 2048);
  return {
    temperature: Math.min(1, Math.max(0, Number.isFinite(rawTemperature) ? rawTemperature : 0.7)),
    maxOutputTokens: Math.min(8192, Math.max(128, Number.isFinite(rawTokens) ? Math.round(rawTokens) : 2048)),
  };
};
const text = (value) => typeof value === 'string' ? value.trim() : '';

async function save(req, type, input, output, agent) {
  await db.saveHistory({ userId: req.userId, type, title: input.slice(0, 60), input, output, agent });
  await db.trackUsage(req.userId, { type, inputLength: input.length, outputLength: output.length });
}

exports.generatePrompt = async (req, res, next) => {
  try {
    const input = text(req.body.input);
    if (!input) return res.status(400).json({ error: 'Input is required' });
    if (input.length > 12000) return res.status(413).json({ error: 'Input is too long' });
    const built = engine.buildAgentPrompt('promptEngineer', input, req.body.context || {});
    const result = await gemini.generateWithSystemInstruction(built.systemInstruction, built.userPrompt, safeOptions(req.body.settings));
    await save(req, 'prompt', input, result, 'promptEngineer');
    res.json({ success: true, result, agent: 'promptEngineer', timestamp: new Date().toISOString() });
  } catch (error) { next(error); }
};

exports.generateWithAgent = async (req, res, next) => {
  try {
    const agentId = text(req.body.agentId);
    const input = text(req.body.input);
    if (!input) return res.status(400).json({ error: 'Input is required' });
    if (!engine.getAgent(agentId)) return res.status(400).json({ error: 'Unknown agent ID' });
    const built = engine.buildAgentPrompt(agentId, input, req.body.context || {});
    const result = await gemini.generateWithSystemInstruction(built.systemInstruction, built.userPrompt, safeOptions(req.body.settings));
    const agent = engine.getAgent(agentId);
    await save(req, 'agent', input, result, agentId);
    res.json({ success: true, result, agent: agentId, agentName: agent.name, timestamp: new Date().toISOString() });
  } catch (error) { next(error); }
};

exports.generateVideoScript = async (req, res, next) => {
  try {
    const hook = text(req.body.hook);
    if (!hook) return res.status(400).json({ error: 'Hook is required' });
    const context = { platform: req.body.platform, duration: req.body.duration, tone: req.body.tone };
    const built = engine.buildAgentPrompt('videoScript', hook, context);
    const result = await gemini.generateWithSystemInstruction(built.systemInstruction, built.userPrompt, safeOptions(req.body.settings));
    await save(req, 'video', hook, result, 'videoScript');
    res.json({ success: true, result, script: result, timestamp: new Date().toISOString() });
  } catch (error) { next(error); }
};

exports.chat = async (req, res, next) => {
  try {
    const message = text(req.body.message);
    if (!message) return res.status(400).json({ error: 'Message is required' });
    if (message.length > 12000) return res.status(413).json({ error: 'Message is too long' });
    const history = Array.isArray(req.body.history) ? req.body.history.slice(-12) : [];
    const transcript = history.map(item => `${item.role === 'assistant' || item.role === 'model' ? 'Assistant' : 'User'}: ${text(item.content)}`).join('\n');
    const prompt = `You are PromptForge, a helpful AI assistant. Use the conversation context when relevant.\n\n${transcript}\nUser: ${message}\nAssistant:`;
    const response = await gemini.generateContent(prompt, safeOptions(req.body.settings));
    await save(req, 'chat', message, response, 'chatAssistant');
    res.json({ response, timestamp: new Date().toISOString() });
  } catch (error) { next(error); }
};

exports.getAgents = (_req, res) => res.json({ agents: engine.getAllAgents() });
