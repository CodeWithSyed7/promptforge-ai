// ===== AUTHENTICATION =====
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'pro' | 'team';
  createdAt: string;
  isGuest?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ===== CHAT =====
export type MessageRole = 'user' | 'model' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  isArchived?: boolean;
  category?: string;
  model?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'doc' | 'text' | 'csv' | 'json';
  name: string;
  url: string;
  size: number;
}

// ===== AI =====
export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  maxTokens: number;
  supportsVision: boolean;
  supportsFiles: boolean;
  isPremium: boolean;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  systemPrompt: string;
  temperature: number;
}

export interface GenerationResponse {
  success: boolean;
  result: string;
  agent?: string;
  agentName?: string;
  model?: string;
  tokensUsed?: number;
  timestamp: string;
}

// ===== SETTINGS =====
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserSettings {
  // AI
  temperature: number;
  maxTokens: number;
  defaultModel: string;
  defaultAgent: string;
  customInstructions: string;
  memoryEnabled: boolean;
  webSearchEnabled: boolean;
  
  // Appearance
  theme: ThemeMode;
  fontSize: FontSize;
  
  // Language
  language: string;
  
  // Notifications
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  
  // Privacy
  shareUsageData: boolean;
  saveHistory: boolean;
  
  // Accessibility
  reduceMotion: boolean;
  highContrast: boolean;
}

// ===== HISTORY =====
export interface HistoryEntry {
  id: string;
  type: 'prompt' | 'agent' | 'video' | 'chat' | 'file';
  title: string;
  input: string;
  output: string;
  agent?: string;
  model?: string;
  context?: Record<string, unknown>;
  createdAt: string;
}

// ===== VIDEO =====
export interface VideoContext {
  platform: string;
  duration: string;
  tone: string;
  style: string;
}

export interface VideoScriptResponse extends GenerationResponse {
  structuredOutput: {
    hook: string;
    scenes: string[];
    cameraInstructions: string;
    lighting: string;
    audioStyle: string;
    editingNotes: string;
  };
  context: VideoContext;
}

// ===== USAGE =====
export interface UsageStats {
  daily: number;
  limit: number;
  remaining: number;
  totalUsed: number;
}

// ===== NAVIGATION =====
export type Tab = 'home' | 'chat' | 'agents' | 'settings';
export type Screen = 'main' | 'profile' | 'about' | 'privacy' | 'terms' | 'help' | 'feedback' | 'customInstructions' | 'aiBehavior' | 'dataExport' | 'language' | 'notifications' | 'security' | 'appearance' | 'subscription';

// ===== NOTIFICATION =====
export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
