const { GoogleGenerativeAI } = require('@google/generative-ai');

function getModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    const error = new Error('GEMINI_API_KEY is not configured on the server');
    error.status = 503;
    throw error;
  }
  const client = new GoogleGenerativeAI(key);
  return client.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
}

async function generateContent(prompt, options = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    const error = new Error('Prompt must be a non-empty string');
    error.status = 400;
    throw error;
  }
  const model = getModel();
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: Number.isFinite(options.temperature) ? options.temperature : Number(process.env.DEFAULT_TEMPERATURE || 0.7),
      maxOutputTokens: Number.isFinite(options.maxOutputTokens) ? options.maxOutputTokens : Number(process.env.DEFAULT_MAX_TOKENS || 2048),
      topP: 0.95,
    },
  });
  return result.response.text();
}

async function generateWithSystemInstruction(systemInstruction, userPrompt, options = {}) {
  const model = getModel();
  const result = await model.generateContent({
    systemInstruction: { parts: [{ text: String(systemInstruction || '') }] },
    contents: [{ role: 'user', parts: [{ text: String(userPrompt || '') }] }],
    generationConfig: {
      temperature: Number.isFinite(options.temperature) ? options.temperature : 0.7,
      maxOutputTokens: Number.isFinite(options.maxOutputTokens) ? options.maxOutputTokens : 2048,
    },
  });
  return result.response.text();
}

module.exports = { generateContent, generateWithSystemInstruction };
