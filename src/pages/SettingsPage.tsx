/**
 * 设置中心（M1-002 占位）
 *
 * PRD §2.4 设置中心 = API Key 管理 + 模型选择 + 感官开关 + 隐私设置 + 关于
 * M1-002 阶段：仅占位 UI；M1-004 启用 API Key 管理
 */

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">设置中心</h1>
        <p className="text-sm text-slate-400 mt-1">配置感官、密钥与隐私</p>
      </header>

      <div className="space-y-3">
        <SettingItem
          title="API Key 管理"
          desc="OpenAI / Anthropic / DeepSeek / 智谱 多 Provider"
          status="M1-004 启用"
        />
        <SettingItem
          title="模型选择"
          desc="默认 Provider 与默认模型"
          status="M1-004 启用"
        />
        <SettingItem
          title="感官开关"
          desc="摄像头 / 麦克风 / TTS 按需启用"
          status="M3 启用"
        />
        <SettingItem
          title="隐私设置"
          desc="数据导出 / 清空"
          status="M2 启用"
        />
      </div>
    </div>
  );
}

function SettingItem({
  title,
  desc,
  status,
}: {
  title: string;
  desc: string;
  status: string;
}) {
  return (
    <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40 flex items-center justify-between">
      <div>
        <h3 className="font-medium text-slate-200">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
      <span className="text-xs text-slate-600 font-mono">{status}</span>
    </div>
  );
}
