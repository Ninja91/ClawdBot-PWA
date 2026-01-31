export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AppState {
  messages: Message[];
  isLoading: boolean;
  isListening: boolean;
  streamingContent: string;
  config: any;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
