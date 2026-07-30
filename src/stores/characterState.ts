/**
 * 角色动画状态（Sprint #7 · M7-001）
 *
 * 每个灵魂可以处于 4 个姿态之一：
 * - standing: 站立（默认）
 * - sitting: 坐下（整体下沉 + 腿折叠）
 * - lying: 躺下（整体水平旋转 90°）
 * - walking: 走动（持续在 X 轴小范围摆动 + 上下浮动）
 *
 * UI 在 SoulDetailModal 提供 4 个按钮切换。
 * 3D 场景中 HumanFigure 用 useFrame 插值过渡。
 */
import { create } from 'zustand';

export type CharacterState = 'standing' | 'sitting' | 'lying' | 'walking';

export const ALL_STATES: CharacterState[] = ['standing', 'sitting', 'lying', 'walking'];

export const STATE_LABELS: Record<CharacterState, string> = {
  standing: '站立',
  sitting: '坐下',
  lying: '躺下',
  walking: '走动',
};

export const STATE_ICONS: Record<CharacterState, string> = {
  standing: '🧍',
  sitting: '🪑',
  lying: '🛌',
  walking: '🚶',
};

interface CharacterStateStore {
  /** soulId → 当前姿态 */
  states: Record<string, CharacterState>;
  setState: (soulId: string, state: CharacterState) => void;
  getState: (soulId: string) => CharacterState;
  /** Cycle: 切换到下一个姿态（用于 SoulDetailModal 的「切换」按钮） */
  cycle: (soulId: string) => CharacterState;
}

export const useCharacterStateStore = create<CharacterStateStore>((set, get) => ({
  states: {},

  setState: (soulId, state) =>
    set((s) => ({ states: { ...s.states, [soulId]: state } })),

  getState: (soulId) => get().states[soulId] ?? 'standing',

  cycle: (soulId) => {
    const current = get().states[soulId] ?? 'standing';
    const idx = ALL_STATES.indexOf(current);
    const next = ALL_STATES[(idx + 1) % ALL_STATES.length];
    set((s) => ({ states: { ...s.states, [soulId]: next } }));
    return next;
  },
}));
