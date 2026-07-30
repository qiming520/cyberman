/**
 * 3D 聊天大厅页面（Sprint #3 · M2-MVP）
 *
 * 当前阶段：仅渲染 3D 场景 + 简单 UI 覆盖层。
 * 后续 Sprint（M2 完整 / M3）：
 *  - 多个角色在场景中（或坐或躺或走动）
 *  - 点击角色 → 打开聊天 modal
 *  - 角色库 / 灵魂编辑器 / 设置 等子功能用浮层
 */
import { Scene } from '@/features/scene/Scene';

export function ScenePage() {
  return (
    <div className="relative h-[calc(100vh-7rem)] -mx-6 -my-8 rounded-lg overflow-hidden bg-slate-950">
      {/* 3D Canvas 占满整个区域 */}
      <Scene />

      {/* UI 覆盖层：场景标题 + 提示 */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
        <div className="bg-slate-900/70 backdrop-blur border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300">
          <div className="font-medium text-slate-100">聊天大厅 · MVP</div>
          <div className="text-slate-500 mt-0.5">鼠标拖动旋转视角 · 滚轮缩放</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-500 pointer-events-auto">
          <span className="text-slate-300">Sprint #3 · M2-MVP</span>
          <span className="mx-2">·</span>
          <span>3D 场景最小验证</span>
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
        <div className="bg-slate-900/70 backdrop-blur border border-slate-700 rounded-full px-4 py-1.5 text-xs text-slate-400">
          <span className="text-slate-300">角色数 1</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>下一步：GLB 模型 + 多角色 + 捏脸系统</span>
        </div>
      </div>
    </div>
  );
}