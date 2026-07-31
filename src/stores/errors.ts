/**
 * 错误监控 store（Sprint #23 · M23-001）
 *
 * 收集：
 * - window.onerror（同步 JS 错误）
 * - unhandledrejection（Promise 错误）
 * - 手动 reportError()
 *
 * 持久化到 LocalStorage（最近 50 条）
 * 不发送到远程（BYOK + 隐私优先原则；用户有顾虑可自接 Sentry）
 */
import { create } from 'zustand';

export interface CapturedError {
  id: string;
  message: string;
  stack?: string;
  source: 'window.onerror' | 'unhandledrejection' | 'manual';
  url?: string;
  timestamp: number;
}

interface ErrorStore {
  errors: CapturedError[];
  capture: (err: Omit<CapturedError, 'id' | 'timestamp'>) => void;
  clear: () => void;
}

const STORAGE_KEY = 'cyberman:errors';
const MAX_ERRORS = 50;

function newId(): string {
  return crypto.randomUUID();
}

function loadErrors(): CapturedError[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CapturedError[];
  } catch {
    return [];
  }
}

function saveErrors(errors: CapturedError[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(errors.slice(0, MAX_ERRORS)));
  } catch {
    // 忽略 quota exceeded 等错误
  }
}

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: loadErrors(),

  capture: (err) => {
    const entry: CapturedError = {
      ...err,
      id: newId(),
      timestamp: Date.now(),
    };
    set((s) => {
      const next = [entry, ...s.errors].slice(0, MAX_ERRORS);
      saveErrors(next);
      return { errors: next };
    });
    // eslint-disable-next-line no-console
    console.error('[ErrorStore]', entry);
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ errors: [] });
  },
}));

/** 全局错误捕获初始化（main.tsx 调用一次） */
export function installGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;
  // 同步 JS 错误
  window.addEventListener('error', (event) => {
    useErrorStore.getState().capture({
      message: event.message,
      stack: event.error?.stack,
      source: 'window.onerror',
      url: event.filename,
    });
  });
  // Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    useErrorStore.getState().capture({
      message: reason?.message ?? String(reason),
      stack: reason?.stack,
      source: 'unhandledrejection',
    });
  });
}
