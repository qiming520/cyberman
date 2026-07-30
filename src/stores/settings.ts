/**
 * settings store · 详见 tech-design.md §3.1 / §5.3
 *
 * 当前范围：
 * - apiKeys: 多 Provider API Key 管理（BYOK 模式）
 * - uiSettings: UI 偏好（主题、语言；M3 启用 TTS 设置）
 * - currentProvider / currentModel: Sprint #6 聊天主厅用（M1-006）
 * - 立即接 LocalStorage 持久化
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type KnownProvider = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'zhipu';
export type Provider = KnownProvider | (string & {});

export interface ApiKeysMap {
  openai?: string;
  anthropic?: string;
  google?: string;
  deepseek?: string;
  zhipu?: string;
  custom?: Record<string, string>;
}

export interface UiSettings {
  theme: 'dark' | 'light';
  language: 'zh-CN' | 'en-US';
}

interface SettingsState {
  apiKeys: ApiKeysMap;
  uiSettings: UiSettings;
  currentProvider: Provider;
  currentModel: string;

  // actions
  setApiKey: (provider: Provider, key: string) => void;
  removeApiKey: (provider: Provider) => void;
  getApiKey: (provider: Provider) => string | undefined;
  setCurrentProvider: (provider: Provider, model?: string) => void;
  setCurrentModel: (model: string) => void;
  updateUiSettings: (patch: Partial<UiSettings>) => void;
}

const KNOWN_PROVIDERS: ReadonlySet<KnownProvider> = new Set([
  'openai', 'anthropic', 'google', 'deepseek', 'zhipu',
]);

function isKnown(p: Provider): p is KnownProvider {
  return KNOWN_PROVIDERS.has(p as KnownProvider);
}

const INITIAL_UI: UiSettings = {
  theme: 'dark',
  language: 'zh-CN',
};

// Sprint #6：默认 OpenAI + 便宜模型
const INITIAL_PROVIDER: Provider = 'openai';
const INITIAL_MODEL = 'gpt-4o-mini';

/** 各 Provider 的默认模型 */
export const PROVIDER_DEFAULT_MODELS: Record<KnownProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20241022',
  google: 'gemini-1.5-pro',
  deepseek: 'deepseek-chat',
  zhipu: 'glm-4',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      apiKeys: {},
      uiSettings: INITIAL_UI,
      currentProvider: INITIAL_PROVIDER,
      currentModel: INITIAL_MODEL,

      setApiKey: (provider, key) =>
        set((s) => {
          if (isKnown(provider)) {
            return { apiKeys: { ...s.apiKeys, [provider]: key } };
          }
          return {
            apiKeys: {
              ...s.apiKeys,
              custom: { ...(s.apiKeys.custom ?? {}), [provider]: key },
            },
          };
        }),

      removeApiKey: (provider) =>
        set((s) => {
          if (isKnown(provider)) {
            const next = { ...s.apiKeys };
            delete next[provider];
            return { apiKeys: next };
          }
          const custom = { ...(s.apiKeys.custom ?? {}) };
          delete custom[provider];
          return { apiKeys: { ...s.apiKeys, custom } };
        }),

      getApiKey: (provider) => {
        const keys = get().apiKeys;
        if (isKnown(provider)) return keys[provider];
        return keys.custom?.[provider];
      },

      setCurrentProvider: (provider, model) =>
        set((s) => ({
          currentProvider: provider,
          currentModel: model ?? (isKnown(provider) ? PROVIDER_DEFAULT_MODELS[provider] : s.currentModel),
        })),

      setCurrentModel: (model) => set({ currentModel: model }),

      updateUiSettings: (patch) =>
        set((s) => ({ uiSettings: { ...s.uiSettings, ...patch } })),
    }),
    {
      name: 'cyberman:settings',
      version: 2,  // 升级到 v2：加 currentProvider/currentModel
      migrate: (persisted: any, version) => {
        // v1 → v2：补 currentProvider/currentModel
        if (version < 2) {
          persisted.currentProvider = INITIAL_PROVIDER;
          persisted.currentModel = INITIAL_MODEL;
        }
        return persisted;
      },
    },
  ),
);
