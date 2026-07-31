/**
 * 3D 聊天大厅页面（Sprint #4 · 单页架构 + 浮层第一阶段）
 *
 * 当前范围（M4-001/002/003）：
 * - 渲染 3D Scene（多角色，详见 Scene.tsx）
 * - 顶部导航栏：场景 / 角色库 / 新建角色 / 设置（4 个按钮触发浮层）
 * - 3 个浮层：角色库 / 灵魂编辑器 / 设置
 * - 跳转到旧页面（workshop / chat）作为后续 Sprint 的过渡
 *
 * 不在本阶段：
 * - 角色点击交互（点击 3D 角色 → 打开聊天）—— Sprint #5
 * - GLB 模型加载 —— Sprint #5
 * - 真实的灵魂编辑器浮层（暂时用 iframe 嵌入 WorkshopPage）
 */
import { useState, useEffect } from 'react';
import { Scene } from '@/features/scene/Scene';
import { Modal } from '@/components/ui/Modal';
import { SoulDetailModal } from '@/components/soul/SoulDetailModal';
import { OnboardingFlow } from '@/features/soul/OnboardingFlow';
import { HomePage } from '@/pages/HomePage';
import { WorkshopPage } from '@/pages/WorkshopPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Users, Hammer, Settings as SettingsIcon, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSoulsStore } from '@/stores/souls';

type OverlayType = 'characters' | 'workshop' | 'settings' | 'onboarding' | null;

export function ScenePage() {
  const [overlay, setOverlay] = useState<OverlayType>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setActiveSoul = useSoulsStore((s) => s.setActiveSoul);

  // URL 参数 ?detail=soulId 直接打开详情 Modal（E2E / 深链接）
  useEffect(() => {
    const detailId = searchParams.get('detail');
    if (detailId) {
      setActiveSoul(detailId);
    }
  }, [searchParams, setActiveSoul]);

  const close = () => setOverlay(null);

  return (
    <div className="relative h-[calc(100vh-7rem)] -mx-6 -my-8 rounded-lg overflow-hidden bg-slate-950">
      {/* 3D 场景（占满全区域） · 角色点击 → store.setActiveSoul → SoulDetailModal 自动打开 */}
      <Scene />

      {/* 顶部导航栏（浮在 3D 上） */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/70 backdrop-blur border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300">
          <div className="font-medium text-slate-100">聊天大厅</div>
          <div className="text-slate-500 mt-0.5">鼠标拖动旋转 · 滚轮缩放 · 点击角色</div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <NavButton
            icon={<Users size={16} />}
            label="角色库"
            onClick={() => setOverlay('characters')}
          />
          <NavButton
            icon={<Sparkles size={16} />}
            label="新建角色"
            onClick={() => setOverlay('onboarding')}
          />
          <NavButton
            icon={<Hammer size={16} />}
            label="高级编辑"
            onClick={() => setOverlay('workshop')}
            title="高级模式：所有字段手动编辑"
          />
          <NavButton
            icon={<SettingsIcon size={16} />}
            label="设置"
            onClick={() => setOverlay('settings')}
          />
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
        <BackToMvpHint />
      </div>

      {/* 浮层 1：角色库（嵌入 HomePage 复用） */}
      <Modal
        open={overlay === 'characters'}
        onClose={close}
        title="角色库"
        maxWidth="max-w-4xl"
      >
        <HomePage />
      </Modal>

      {/* 浮层 2：灵魂编辑器（嵌入 WorkshopPage 复用） */}
      <Modal
        open={overlay === 'workshop'}
        onClose={close}
        title="新建角色"
        maxWidth="max-w-5xl"
      >
        <WorkshopPage />
      </Modal>

      {/* 浮层 3：设置（嵌入 SettingsPage 复用） */}
      <Modal
        open={overlay === 'settings'}
        onClose={close}
        title="设置"
        maxWidth="max-w-3xl"
      >
        <SettingsPage />
      </Modal>

      {/* 浮层 4：引导式创建灵魂（M16-001） */}
      <OnboardingFlow
        open={overlay === 'onboarding'}
        onClose={close}
        onComplete={(soulId) => {
          close();
          // 创建后跳到聊天
          navigate(`/chat?soulId=${soulId}`);
        }}
      />

      {/* 浮层 4：角色详情（auto 模式 · 响应 store.activeSoulId）*/}
      <SoulDetailModal />

      {/* 旧页面跳转（开发期过渡） */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="bg-slate-900/70 backdrop-blur border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          旧版聊天页
        </button>
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex items-center gap-2 px-3 py-2 bg-slate-900/70 backdrop-blur border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-100 rounded-lg text-sm transition-colors"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function BackToMvpHint() {
  return (
    <div className="bg-slate-900/70 backdrop-blur border border-slate-700 rounded-full px-4 py-1.5 text-xs text-slate-400">
      🌟 Sprint #4 · 3D 沉浸式 · 角色下方拖动相机
    </div>
  );
}
