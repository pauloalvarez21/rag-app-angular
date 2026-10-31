export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sources?: string[];
  timestamp: Date;
  error?: boolean;
}

export interface AskResponse {
  answer: string;
  sources: string[];
}
