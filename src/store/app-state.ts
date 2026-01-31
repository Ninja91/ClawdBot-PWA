import { createStore, produce } from 'solid-js/store';
import { AppState, Message } from '@/types';

export const [state, setState] = createStore<AppState>({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: "# Hello! I'm Jenny ✨\nI'm optimized for performance and ready to help. Try asking me for a chart or a table!",
      timestamp: new Date(),
    }
  ],
  isLoading: false,
  isListening: false,
  streamingContent: '',
  config: null
});

export const addMessage = (message: Message) => {
  setState(produce((s) => {
    s.messages.push(message);
  }));
};

export const setLoading = (loading: boolean) => setState('isLoading', loading);
export const setStreaming = (content: string) => setState('streamingContent', content);
export const setListening = (listening: boolean) => setState('isListening', listening);
export const setConfig = (config: any) => setState('config', config);
