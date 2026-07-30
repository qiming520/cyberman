/**
 * 设置中心 · M1-004 启用
 *
 * PRD §2.4 设置中心 = API Key 管理 + 模型选择 + 感官开关 + 隐私设置 + 关于
 * 当前实现（M1-004 第一阶段）：
 *  ✅ API Key 管理（5 个已知 Provider）
 *  ⏳ 自定义 Provider + 模型选择（M1-004 第二阶段 / 留 M2）
 *  ⏳ 感官开关（M3）
 *  ⏳ 隐私设置（M2）
 */
import { ShieldCheck } from 'lucide-react';
import { ProviderKeyCard } from '@/components/settings/ProviderKeyCard';

const PROVIDERS = [
  {
    provider: 'openai',
    label: 'OpenAI',
    description: 'GPT-4o / GPT-4 / GPT-3.5-turbo / o1 系列',
    placeholder: 'sk-...',
  },
  {
    provider: 'anthropic',
    label: 'Anthropic',
    description: 'Claude 4 / Claude 3.5 系列',
    placeholder: 'sk-ant-...',
  },
  {
    provider: 'google',
    label: 'Google AI',
    description: 'Gemini 2.0 / 1.5 Pro / Flash',
    placeholder: 'AIza...',
  },
  {
    provider: 'deepseek',
    label: 'DeepSeek',
    description: 'DeepSeek-V3 / R1 / 国产高性价比',
    placeholder: 'sk-...',
  },
  {
    provider: 'zhipu',
    label: '智谱 AI',
    description: 'GLM-4 / 国产合规',
    placeholder: '...',
  },
] as const;

export function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="text-2xl font-semibold">设置中心</h1>
        <p className="text-sm text-slate-400 mt-1">配置感官、密钥与隐私</p>
      </header>

      {/* ── API Key 管理 ───────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-slate-200">API Key 管理</h2>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            所有 Key 仅存储在本地浏览器（BYOK 模式），不上传任何服务器
          </p>
        </div>

        <div className="grid gap-3">
          {PROVIDERS.map((p) => (
            <ProviderKeyCard
              key={p.provider}
              provider={p.provider}
              label={p.label}
              description={p.description}
              placeholder={p.placeholder}
            />
          ))}
        </div>

        <p className="text-xs text-slate-600 text-center">
          自定义 Provider（OpenAI 兼容协议）· 待 M2 实现
        </p>
      </section>

      {/* ── 模型选择（占位） ────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-slate-200">模型选择</h2>
        <div className="border border-dashed border-slate-800 rounded-lg p-6 bg-slate-900/30 text-center text-sm text-slate-500">
          默认 Provider / 默认模型 · 待 M1-004 第二阶段
        </div>
      </section>

      {/* ── 感官开关（占位） ────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-slate-200">感官开关</h2>
        <div className="border border-dashed border-slate-800 rounded-lg p-6 bg-slate-900/30 text-center text-sm text-slate-500">
          摄像头 / 麦克风 / TTS · 待 M3 启用
        </div>
      </section>

      {/* ── 隐私设置（占位） ────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-slate-200">隐私设置</h2>
        <div className="border border-dashed border-slate-800 rounded-lg p-6 bg-slate-900/30 text-center text-sm text-slate-500">
          数据导出 / 清空 · 待 M2 启用
        </div>
      </section>

      {/* ── 关于 ──────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium text-slate-200">关于</h2>
        <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40 text-xs text-slate-500 space-y-1">
          <div>赛博机器人 Cyberman · v0.0.1</div>
          <div>本地优先 · BYOK · 仅供个人 Demo</div>
          <div className="font-mono text-slate-600">
            https://github.com/qiming520/cyberman
          </div>
        </div>
      </section>
    </div>
  );
}