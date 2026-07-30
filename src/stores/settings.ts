/**
 * settings store · 详见 tech-design.md §3.1 / §5.3
 *
 * 当前范围（M1-003）：
 * - apiKeys: 多 Provider API Key 管理（BYOK 模式）
 * - uiSettings: UI 偏好（主题、语言；M3 启用 TTS 设置）
 * - 立即接 LocalStorage 持久化（M1-004 直接复用）
 *
 * 不在当前范围：
 * - 模型选择默认值（留 M1-004 单独实现）
 * - 感官开关（留 M3）
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type KnownProvider = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'zhipu';
export type Provider = KnownProvider | (string & {});  // 允许自定义 Provider

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

  // actions
  setApiKey: (provider: Provider, key: string) => void;
  removeApiKey: (provider: Provider) => void;
  getApiKey: (provider: Provider) => string | undefined;
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

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      apiKeys: {},
      uiSettings: INITIAL_UI,

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

      updateUiSettings: (patch) =>
        set((s) => ({ uiSettings: { ...s.uiSettings, ...patch } })),
    }),
    {
      name: 'cyberman:settings',
      version: 1,
    },
  ),
);