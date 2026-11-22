const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dir = path.join(__dirname, '..', 'data');
const files = { history: path.join(dir, 'history.json'), settings: path.join(dir, 'settings.json'), users: path.join(dir, 'users.json') };
fs.mkdirSync(dir, { recursive: true });
for (const [key, file] of Object.entries(files)) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(key === 'history' ? { history: [] } : key === 'settings' ? { settings: {} } : { users: [] }, null, 2));
}
function read(file, fallback) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
function write(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2)); }
class DatabaseService {
  async saveHistory(entry) {
    const data = read(files.history, { history: [] });
    const item = { id: crypto.randomUUID(), ...entry, createdAt: new Date().toISOString() };
    data.history.unshift(item);
    data.history = data.history.slice(0, 1000);
    write(files.history, data);
    return item;
  }
  async getHistory(userId, limit = 20, offset = 0) {
    const all = read(files.history, { history: [] }).history.filter(item => item.userId === userId);
    return { history: all.slice(offset, offset + limit), count: all.length };
  }
  async deleteHistory(userId, id) {
    const data = read(files.history, { history: [] });
    const before = data.history.length;
    data.history = data.history.filter(item => !(item.userId === userId && item.id === id));
    write(files.history, data);
    return data.history.length !== before;
  }
  async getSettings(userId) {
    const data = read(files.settings, { settings: {} });
    return data.settings[userId] || { temperature: 0.7, maxTokens: 2048, darkMode: true, language: 'en' };
  }
  async updateSettings(userId, updates) {
    const data = read(files.settings, { settings: {} });
    const current = data.settings[userId] || await this.getSettings(userId);
    data.settings[userId] = { ...current, ...updates, updatedAt: new Date().toISOString() };
    write(files.settings, data);
    return data.settings[userId];
  }
  async trackUsage(userId, usage) {
    const data = read(files.users, { users: [] });
    let user = data.users.find(item => item.id === userId);
    if (!user) { user = { id: userId, usage: [] }; data.users.push(user); }
    user.usage.push({ ...usage, timestamp: new Date().toISOString() });
    user.usage = user.usage.slice(-1000);
    write(files.users, data);
  }
  async getDailyUsage(userId) {
    const user = read(files.users, { users: [] }).users.find(item => item.id === userId);
    const today = new Date().toISOString().slice(0, 10);
    return (user?.usage || []).filter(item => item.timestamp.startsWith(today)).length;
  }
  async exportHistory(userId, format = 'json') {
    const { history } = await this.getHistory(userId, 1000, 0);
    return format === 'txt' ? history.map(item => `[${item.createdAt}]\n${item.title}\n${item.output || ''}`).join('\n\n---\n\n') : JSON.stringify(history, null, 2);
  }
}
module.exports = new DatabaseService();
