/**
 * 首页 / 角色库（M1-008 补做：M1-002 当时漏了 souls[] 列表）
 *
 * PRD §2.2 F-005 / §2.4：列出所有灵魂 + 新建按钮 + 进入聊天 + 删除
 * 当前范围：
 * - 卡片网格（头像 + 名字 + 关系类型 + 性格关键词预览 + 进入聊天 + 删除）
 * - 空状态保留
 * - 移动到首页 = setActiveSoul（准备 M2 多角色切换）
 *
 * 不在范围（M2）：
 * - IndexedDB 持久化（当前是 in-memory）
 * - 角色导入/导出
 */
import { Link } from 'react-router-dom';
import { Plus, Users, MessageCircle, Trash2 } from 'lucide-react';
import { useSoulsStore } from '@/stores/souls';
import { DiceBearAvatar } from '@/features/soul/editor/DiceBearAvatar';

const RELATIONSHIP_LABELS: Record<string, string> = {
  girlfriend: '女友',
  boyfriend: '男友',
  friend: '朋友',
  pet: '宠物',
  mentor: '导师',
  sibling: '兄弟姐妹',
  custom: '自定义',
};

function relationshipLabel(type: keyof typeof RELATIONSHIP_LABELS, custom?: string): string {
  if (type === 'custom' && custom) return custom;
  return RELATIONSHIP_LABELS[type] ?? '未知';
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function HomePage() {
  const souls = useSoulsStore((s) => s.souls);
  const setActiveSoul = useSoulsStore((s) => s.setActiveSoul);
  const deleteSoul = useSoulsStore((s) => s.deleteSoul);

  const handleEnter = (soulId: string) => {
    setActiveSoul(soulId);
  };

  const handleDelete = (soulId: string, name: string) => {
    if (confirm(`确定删除角色「${name || '未命名'}」吗？此操作不可撤销。`)) {
      deleteSoul(soulId);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">角色库</h1>
          <p className="text-sm text-slate-400 mt-1">
            你的赛博机器人（{souls.length} 个）
          </p>
        </div>
        <Link
          to="/workshop"
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors"
        >
          <Plus size={16} />
          新建角色
        </Link>
      </header>

      {souls.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-lg p-12 text-center bg-slate-900/40">
          <Users className="mx-auto mb-3 text-slate-600" size={40} />
          <p className="text-slate-400">还没有角色</p>
          <Link to="/workshop" className="inline-block mt-3 text-blue-400 hover:underline text-sm">
            立即新建一个 →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {souls.map((soul) => (
            <div
              key={soul.id}
              className="border border-slate-800 rounded-lg p-4 bg-slate-900/40 hover:border-slate-700 transition-colors space-y-3"
            >
              <div className="flex items-start gap-3">
                <DiceBearAvatar seed={soul.identity.avatarSeed} size={56} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-100 truncate">
                    {soul.identity.name || '（未命名）'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {relationshipLabel(soul.relationship.type, soul.relationship.customTypeName)}
                    {' · '}
                    亲密度 {soul.relationship.currentIntimacy}
                  </p>
                </div>
              </div>

              {soul.personality.traits.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {soul.personality.traits.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>创建于 {formatTime(soul.createdAt)}</span>
              </div>

              <div className="flex gap-2 pt-1">
                <Link
                  to={`/chat?soulId=${soul.id}`}
                  onClick={() => handleEnter(soul.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors"
                >
                  <MessageCircle size={14} />
                  进入聊天
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(soul.id, soul.identity.name)}
                  className="px-3 py-2 bg-slate-800 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 rounded text-sm transition-colors"
                  title="删除"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}