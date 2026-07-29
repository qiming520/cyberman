/**
 * 首页 / 角色库（M1-002 占位）
 *
 * PRD §2.4 角色库 = 角色卡片列表 + 新建角色 + 导入角色
 * M1-002 阶段：仅占位 UI，M1-005 之后填充
 */
import { Users, Plus, Upload } from 'lucide-react';

export function HomePage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">角色库</h1>
          <p className="text-sm text-slate-400 mt-1">你的赛博机器人都在这里</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 text-slate-500 text-sm cursor-not-allowed"
            title="M1-005 启用"
          >
            <Upload size={16} />
            导入角色
          </button>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 text-slate-500 text-sm cursor-not-allowed"
            title="M1-005 启用"
          >
            <Plus size={16} />
            新建角色
          </button>
        </div>
      </header>

      <div className="border border-dashed border-slate-800 rounded-lg p-12 text-center bg-slate-900/40">
        <Users className="mx-auto mb-3 text-slate-600" size={40} />
        <p className="text-slate-400">还没有角色</p>
        <p className="text-xs text-slate-600 mt-2 font-mono">
          M1-005 启用 · 当前仅占位
        </p>
      </div>
    </div>
  );
}
