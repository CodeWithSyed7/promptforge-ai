import type { 
  GenerationResponse, 
  VideoScriptResponse, 
  HistoryEntry, 
  UserSettings,
  UsageStats,
  VideoContext 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Default user ID for demo (in production, from auth)
const USER_ID = 'default';

class ApiService {
  private async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': USER_ID,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response;
  }

  // ========== AI GENERATION ==========

  async generatePrompt(input: string, context?: Record<string, unknown>, settings?: Partial<UserSettings>): Promise<GenerationResponse> {
    const response = await this.fetch('/ai/generate-prompt', {
      method: 'POST',
      body: JSON.stringify({ input, context, settings }),
    });
    return response.json();
  }

  async generateWithAgent(
    agentId: string, 
    input: string, 
    context?: Record<string, unknown>,
    settings?: Partial<UserSettings>
  ): Promise<GenerationResponse> {
    const response = await this.fetch('/ai/generate-with-agent', {
      method: 'POST',
      body: JSON.stringify({ agentId, input, context, settings }),
    });
    return response.json();
  }

  async generateVideoScript(
    hook: string, 
    context: VideoContext,
    settings?: Partial<UserSettings>
  ): Promise<VideoScriptResponse> {
    const response = await this.fetch('/ai/generate-video', {
      method: 'POST',
      body: JSON.stringify({ hook, ...context, settings }),
    });
    return response.json();
  }

  async chat(message: string, history: { role: string; content: string }[], settings?: Partial<UserSettings>): Promise<{ response: string }> {
    const response = await this.fetch('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history, settings }),
    });
    return response.json();
  }

  async getAgents(): Promise<{ agents: { id: string; name: string; description: string }[] }> {
    const response = await this.fetch('/ai/agents');
    return response.json();
  }

  // ========== HISTORY ==========

  async getHistory(limit = 20, offset = 0): Promise<{ history: HistoryEntry[]; count: number }> {
    const response = await this.fetch(`/history?limit=${limit}&offset=${offset}`);
    return response.json();
  }

  async deleteHistory(id: string): Promise<{ success: boolean }> {
    const response = await this.fetch(`/history/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  async exportHistory(format: 'json' | 'txt' = 'json'): Promise<Blob> {
    const response = await this.fetch(`/history/export?format=${format}`);
    return response.blob();
  }

  async getUsage(): Promise<{ usage: UsageStats }> {
    const response = await this.fetch('/history/usage');
    return response.json();
  }

  // ========== SETTINGS ==========

  async getSettings(): Promise<{ settings: UserSettings }> {
    const response = await this.fetch('/settings');
    return response.json();
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<{ settings: UserSettings }> {
    const response = await this.fetch('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response.json();
  }

  async resetSettings(): Promise<{ settings: UserSettings }> {
    const response = await this.fetch('/settings/reset', {
      method: 'POST',
    });
    return response.json();
  }

  // ========== HEALTH ==========

  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;
