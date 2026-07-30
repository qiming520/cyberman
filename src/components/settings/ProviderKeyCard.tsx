/**
 * ProviderKeyCard · 单个 Provider API Key 输入卡
 *
 * 详见 tech-design.md §5.3 / PRD §2.4 设置中心 / M1-004
 *
 * 行为：
 * - 始终显示一个输入框（受控），便于随时新增/修改
 * - type 默认 password，点眼睛图标切换明文
 * - 「保存」写入 store + LocalStorage（zustand persist 自动）
 * - 「删除」清空（仅当 store 已有该 provider 的 key 时显示）
 * - 状态徽章：未设置 / 已设置（保留前 4 + 后 4 字符做预览）
 */
import { useState } from 'react';
import { Eye, EyeOff, Trash2, Save, CheckCircle2 } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings';

const KNOWN_PROVIDERS = ['openai', 'anthropic', 'google', 'deepseek', 'zhipu'] as const;
type KnownProvider = (typeof KNOWN_PROVIDERS)[number];

function isKnown(p: string): p is KnownProvider {
  return (KNOWN_PROVIDERS as readonly string[]).includes(p);
}

function maskKey(key: string | undefined): string {
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

export interface ProviderKeyCardProps {
  provider: string;
  label: string;
  description?: string;
  placeholder?: string;
}

export function ProviderKeyCard({
  provider,
  label,
  description,
  placeholder = 'sk-...',
}: ProviderKeyCardProps) {
  const apiKeys = useSettingsStore((s) => s.apiKeys);
  const setApiKey = useSettingsStore((s) => s.setApiKey);
  const removeApiKey = useSettingsStore((s) => s.removeApiKey);

  const currentKey = isKnown(provider) ? apiKeys[provider] : apiKeys.custom?.[provider];
  const hasKey = !!currentKey;

  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setApiKey(provider, trimmed);
    setInputValue('');
  };

  const handleRemove = () => {
    removeApiKey(provider);
    setInputValue('');
  };

  return (
    <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-slate-200">{label}</h3>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        {hasKey ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
            <CheckCircle2 size={14} />
            已设置
          </span>
        ) : (
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
            未设置
          </span>
        )}
      </div>

      {hasKey && !inputValue && (
        <div className="text-xs text-slate-500 font-mono">
          {maskKey(currentKey)}
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) handleSave();
            }}
            placeholder={hasKey ? '输入新 Key 覆盖现有' : placeholder}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500 font-mono"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowKey((v) => !v)}
          className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
          title={showKey ? '隐藏' : '显示'}
          disabled={!inputValue}
        >
          {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!inputValue.trim()}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded text-sm transition-colors"
        >
          <Save size={14} />
          保存
        </button>
        {hasKey && (
          <button
            type="button"
            onClick={handleRemove}
            className="px-2.5 py-2 bg-slate-800 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 rounded transition-colors"
            title="删除"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}