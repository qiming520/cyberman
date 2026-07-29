/**
 * 聊天主厅（M1-002 占位）
 *
 * PRD §2.4 聊天主厅 = 对话窗口 + 多模态控制 + 灵魂面板抽屉
 * M1-002 阶段：仅占位 UI；M1-005 之后填充
 *
 * 路由：/chat 与 /chat/:soulId 共用此组件（M1-005 后 soulId 用于载入特定角色）
 */
import { MessageCircle } from 'lucide-react';

export function ChatPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">聊天主厅</h1>
        <p className="text-sm text-slate-400 mt-1">与你的赛博灵魂对话</p>
      </header>

      <div className="border border-dashed border-slate-800 rounded-lg p-12 text-center bg-slate-900/40 min-h-[400px] flex flex-col items-center justify-center">
        <MessageCircle className="mb-3 text-slate-600" size={40} />
        <p className="text-slate-400">对话窗口（待 M1-005 启用）</p>
        <p className="text-xs text-slate-600 mt-2 font-mono">
          多模态控制 · 灵魂面板 · 历史记录
        </p>
      </div>
    </div>
  );
}
