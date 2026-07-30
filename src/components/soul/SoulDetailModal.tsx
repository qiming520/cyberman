/**
 * 灵魂详情 Modal（Sprint #5 · M5-002）
 *
 * 显示选中角色的完整 SoulConfig 信息：
 * - DiceBear 头像 + 姓名 + 关系 + 亲密度
 * - 性格关键词（traits）+ 说话风格 + 情绪基线
 * - 背景故事 + 职业 + 爱好 + 偏好
 * - 边界（用户设置）
 * - 知识库（暂占位）
 * - 占位：进入聊天（待 Sprint #6）+ 编辑
 *
 * 模式：
 * - controlled（外部传 soulId）：父组件管理开关
 * - auto（不传 soulId）：自动响应 store.activeSoulId（点 3D 角色自动开）
 */
import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { DiceBearAvatar } from '@/features/soul/editor/DiceBearAvatar';
import { useSoulsStore } from '@/stores/souls';
import { MessageCircle, Hammer, Sparkles } from 'lucide-react';

export interface SoulDetailModalProps {
  soulId?: string | null;
  onClose?: () => void;
}

export function SoulDetailModal({ soulId: externalSoulId, onClose: externalOnClose }: SoulDetailModalProps) {
  const activeSoulId = useSoulsStore((s) => s.activeSoulId);
  const setActiveSoul = useSoulsStore((s) => s.setActiveSoul);
  const getSoul = useSoulsStore((s) => s.getSoul);

  // auto 模式：响应 activeSoulId
  const [autoSoulId, setAutoSoulId] = useState<string | null>(null);
  useEffect(() => {
    if (externalSoulId === undefined) {
      // auto 模式：同步 activeSoulId
      setAutoSoulId(activeSoulId);
    }
  }, [activeSoulId, externalSoulId]);

  const soulId = externalSoulId !== undefined ? externalSoulId : autoSoulId;
  const soul = soulId ? getSoul(soulId) : null;

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      // auto 模式：清空 activeSoulId
      setActiveSoul(null);
      setAutoSoulId(null);
    }
  };

  if (!soul) return null;

  const id = soul.identity;
  const p = soul.personality;
  const bs = soul.backstory;
  const rel = soul.relationship;

  return (
    <Modal open={!!soul} onClose={handleClose} title={`灵魂详情 · ${id.name || '未命名'}`} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* 头部：头像 + 姓名 + 关系 + 亲密度 */}
        <header className="flex items-start gap-4">
          <DiceBearAvatar seed={id.avatarSeed} size={80} />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-slate-100">{id.name || '未命名'}</h3>
            <p className="text-sm text-slate-400 mt-1">
              {id.gender === 'female' ? '女' : id.gender === 'male' ? '男' : id.gender === 'non-binary' ? '非二元' : '其他'}
              {' · '}
              {id.age} 岁
              {id.pronouns && ` · ${id.pronouns}`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">
                {relationshipLabel(rel.type)}
              </span>
              <span className="text-xs text-slate-500">
                亲密度 {rel.currentIntimacy}/100
              </span>
            </div>
          </div>
        </header>

        {/* 性格 */}
        <Section title="性格" icon="✨">
          {p.mbti && (
            <div className="mb-2">
              <span className="text-xs text-slate-500">MBTI</span>
              <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-mono">
                {p.mbti}
              </span>
            </div>
          )}
          {p.traits.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {p.traits.map((t) => (
                <span key={t} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}
          {p.speakingStyle && (
            <DetailRow label="说话风格" value={p.speakingStyle} />
          )}
          {p.emotionalBaseline && (
            <DetailRow label="情绪基线" value={p.emotionalBaseline} />
          )}
        </Section>

        {/* 背景 */}
        {bs.story && (
          <Section title="背景故事" icon="📖">
            <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {bs.story}
            </p>
            {bs.occupation && <DetailRow label="职业" value={bs.occupation} />}
            {bs.hobbies.length > 0 && (
              <DetailRow label="爱好" value={bs.hobbies.join(' · ')} />
            )}
            {bs.preferences.length > 0 && (
              <DetailRow label="偏好" value={bs.preferences.join(' · ')} />
            )}
          </Section>
        )}

        {/* 边界 */}
        {rel.boundaries.length > 0 && (
          <Section title="行为边界" icon="🚫">
            <div className="flex flex-wrap gap-1.5">
              {rel.boundaries.map((b) => (
                <span key={b} className="px-2 py-1 bg-amber-500/10 text-amber-300 rounded text-xs border border-amber-500/30">
                  {b}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* 知识库（占位） */}
        <Section title="知识库" icon="📚">
          <div className="text-xs text-slate-500 border border-dashed border-slate-700 rounded p-4 text-center">
            {bs.story
              ? `已记忆 ${bs.story.length} 字符背景 · 自动用于对话上下文`
              : '上传文档 / 粘贴文本 · 角色会在对话中引用（M2 启用）'}
          </div>
        </Section>

        {/* 操作按钮 */}
        <footer className="flex gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveSoul(soul.id);
              handleClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors"
          >
            <MessageCircle size={16} />
            进入聊天
          </button>
          <button
            type="button"
            onClick={() => {
              // 留给 Sprint #5 末：导航到 /workshop?soulId=xxx
              alert('编辑灵魂（待 Sprint #5 末）');
            }}
            className="flex items-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm transition-colors"
          >
            <Hammer size={14} />
            编辑
          </button>
        </footer>

        <p className="text-xs text-slate-600 text-center">
          <Sparkles size={12} className="inline mr-1" />
          灵魂被点击 → 自动设为「活跃」+ 详情 Modal
        </p>
      </div>
    </Modal>
  );
}

// ─────────────────────────── 子组件 ───────────────────────────

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1.5">
        <span>{icon}</span>
        <span>{title}</span>
      </h4>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="ml-2 text-slate-300">{value}</span>
    </div>
  );
}

function relationshipLabel(type: string): string {
  const map: Record<string, string> = {
    girlfriend: '女友',
    boyfriend: '男友',
    friend: '朋友',
    pet: '宠物',
    mentor: '导师',
    sibling: '兄妹',
    custom: '自定义',
  };
  return map[type] ?? '其他';
}
