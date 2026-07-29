/**
 * 角色工坊（M1-002 占位）
 *
 * PRD §2.4 角色工坊 = 灵魂编辑器 + Prompt 预览 + 测试对话
 * M1-002 阶段：仅占位 UI；M2-001 之后填充
 */
import { Hammer } from 'lucide-react';

export function WorkshopPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">角色工坊</h1>
        <p className="text-sm text-slate-400 mt-1">配置灵魂的每一个维度</p>
      </header>

      <div className="border border-dashed border-slate-800 rounded-lg p-12 text-center bg-slate-900/40">
        <Hammer className="mx-auto mb-3 text-slate-600" size={40} />
        <p className="text-slate-400">灵魂编辑器（待 M2-001 启用）</p>
        <p className="text-xs text-slate-600 mt-2 font-mono">
          身份 / 人格 / 背景 / 关系 / 知识
        </p>
      </div>
    </div>
  );
}
