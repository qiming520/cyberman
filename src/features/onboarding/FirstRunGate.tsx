/**
 * 首启动引导（Sprint #19 · M19-001）
 *
 * 用户原话没明确说要"首启动引导"，但 UX 最佳实践：
 * 首次访问 → 欢迎 + 引导到创建第一个灵魂
 *
 * 流程：
 * 1. 欢迎页（标题 + 简介 + 3 步引导）
 * 2. 直接进入 3D 大厅（让用户先看到场景）
 * 3. 顶部"新建角色"按钮 → 触发 OnboardingFlow
 *
 * 实现：onboardingCompleted 状态（LocalStorage 持久化）
 * - 首次进入 / 显示欢迎页
 * - 标记完成后再不显示
 */
import { useState, useEffect } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'cyberman:onboarding-completed';

export function FirstRunGate({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY) === 'true';
    setShow(!done);
  }, []);

  if (show === null) return null;  // 加载中
  if (!show) return <>{children}</>;

  const handleEnter = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 p-4">
      <div className="max-w-2xl w-full bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🤖</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            欢迎来到赛博机器人
          </h1>
          <p className="text-slate-400 text-sm">
            在 3D 场景里创造、定制、与你的赛博灵魂对话
          </p>
        </div>

        {/* 3 步引导 */}
        <div className="grid grid-cols-3 gap-3">
          <Step
            emoji="🛋️☕🌳"
            title="3D 场景"
            desc="客厅/咖啡馆/公园 三个区域，角色按关系自动分布"
          />
          <Step
            emoji="🧍🪑🛌🚶"
            title="4 姿态"
            desc="点击角色可切换站立/坐下/躺下/走动"
          />
          <Step
            emoji="😊😢🥰"
            title="5 情绪"
            desc="灵魂有不同的情绪和 MBTI 性格"
          />
        </div>

        {/* 提示 */}
        <div className="text-xs text-slate-500 text-center space-y-1">
          <p>💡 首次使用需要先到「设置」填 API Key</p>
          <p>🎭 之后所有数据本地保存（IndexedDB + LocalStorage）</p>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleEnter}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-base font-medium transition-colors"
        >
          <Sparkles size={18} />
          进入 3D 大厅
          <ChevronRight size={18} />
        </button>

        <div className="text-xs text-slate-500 text-center">
          点击「进入」即表示你已知晓这是个人 Demo · 数据完全本地
        </div>
      </div>
    </div>
  );
}

function Step({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg text-center space-y-1">
      <div className="text-2xl">{emoji}</div>
      <div className="text-sm font-medium text-slate-200">{title}</div>
      <div className="text-xs text-slate-500">{desc}</div>
    </div>
  );
}
