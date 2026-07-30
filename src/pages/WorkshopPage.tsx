/**
 * 角色工坊页（M1-005a 启用）
 *
 * 本期（M1-005a）：新增灵魂（编辑器表单占 100% 宽；M1-005b 加右栏 Prompt 预览）
 * 后续（M2 路由参数）：支持通过 URL `/workshop?soul=xxx` 编辑现有灵魂
 */
import { SoulEditor } from '@/features/soul/editor/SoulEditor';
import { useNavigate } from 'react-router-dom';

export function WorkshopPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">角色工坊</h1>
        <p className="text-sm text-slate-400 mt-1">配置灵魂的每一个维度</p>
      </header>

      <SoulEditor onSaved={(soulId) => navigate(`/chat?soulId=${soulId}`)} />
    </div>
  );
}