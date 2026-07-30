/**
 * chat store · 详见 tech-design.md §3.1 / §4.2
 *
 * 当前范围（M1-003）：
 * - currentConversation: 当前会话（含消息流）
 * - streamingMessageId: 正在流式追加的助手消息 ID
 * - 基础 actions：startConversation / appendMessage / appendChunk / finalizeMessage / clearConversation
 *
 * 不在当前范围：
 * - IndexedDB 持久化（留 M2 接 idb 库）
 * - 多会话并行（当前模型：单 currentConversation）
 * - 多模态附件（图片/音频，留 M3）
 */
import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

export interface ChatConversation {
  id: string;
  soulId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  currentConversation: ChatConversation | null;
  streamingMessageId: string | null;

  // actions
  startConversation: (soulId: string, title?: string) => ChatConversation;
  appendMessage: (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => ChatMessage | null;
  appendChunk: (messageId: string, chunk: string) => void;
  finalizeMessage: () => void;
  setTitle: (title: string) => void;
  clearConversation: () => void;
}

function newId(): string {
  return crypto.randomUUID();
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentConversation: null,
  streamingMessageId: null,

  startConversation: (soulId, title) => {
    const now = Date.now();
    const conv: ChatConversation = {
      id: newId(),
      soulId,
      title: title ?? '新对话',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    set({ currentConversation: conv, streamingMessageId: null });
    return conv;
  },

  appendMessage: (msg) => {
    const conv = get().currentConversation;
    if (!conv) return null;

    const fullMsg: ChatMessage = {
      ...msg,
      id: newId(),
      createdAt: Date.now(),
    };

    set({
      currentConversation: {
        ...conv,
        messages: [...conv.messages, fullMsg],
        updatedAt: Date.now(),
      },
      streamingMessageId: msg.role === 'assistant' ? fullMsg.id : get().streamingMessageId,
    });

    return fullMsg;
  },

  appendChunk: (messageId, chunk) =>
    set((s) => {
      if (!s.currentConversation) return s;
      return {
        currentConversation: {
          ...s.currentConversation,
          messages: s.currentConversation.messages.map((m) =>
            m.id === messageId ? { ...m, content: m.content + chunk } : m,
          ),
          updatedAt: Date.now(),
        },
      };
    }),

  finalizeMessage: () => set({ streamingMessageId: null }),

  setTitle: (title) =>
    set((s) =>
      s.currentConversation
        ? {
            currentConversation: {
              ...s.currentConversation,
              title,
              updatedAt: Date.now(),
            },
          }
        : s,
    ),

  clearConversation: () => set({ currentConversation: null, streamingMessageId: null }),
}));