/**
 * 情绪状态（Sprint #7 · M7-003）
 *
 * 详见 tech-design.md §4.3
 *
 * 每个灵魂有独立的当前情绪：
 * - neutral: 中性（默认）
 * - happy: 开心 😊
 * - sad: 伤心 😢
 * - tender: 温柔 🥰
 * - angry: 生气 😠
 *
 * UI：SoulDetailModal 加「当前心情」section（5 个按钮）
 * 3D：HumanFigure 头顶显示对应 emoji（drei Text）
 * 数据：store 内 useEmotionStore.getState(soulId) → Emotion
 *
 * 简化：本 Sprint 不做 LLM 自动 emotion 提取（解析复杂）；
 * M2 末或 Sprint #8 可加「LLM 回复末尾加 <emotion>happy</emotion> 自动解析」
 */
import { create } from 'zustand';

export type Emotion = 'neutral' | 'happy' | 'sad' | 'tender' | 'angry';

export const ALL_EMOTIONS: Emotion[] = ['neutral', 'happy', 'sad', 'tender', 'angry'];

export const EMOTION_LABELS: Record<Emotion, string> = {
  neutral: '中性',
  happy: '开心',
  sad: '伤心',
  tender: '温柔',
  angry: '生气',
};

export const EMOTION_EMOJI: Record<Emotion, string> = {
  neutral: '😐',
  happy: '😊',
  sad: '😢',
  tender: '🥰',
  angry: '😠',
};

interface EmotionStore {
  /** soulId → 当前情绪 */
  emotions: Record<string, Emotion>;
  setEmotion: (soulId: string, emotion: Emotion) => void;
  getEmotion: (soulId: string) => Emotion;
}

export const useEmotionStore = create<EmotionStore>((set, get) => ({
  emotions: {},

  setEmotion: (soulId, emotion) =>
    set((s) => ({ emotions: { ...s.emotions, [soulId]: emotion } })),

  getEmotion: (soulId) => get().emotions[soulId] ?? 'neutral',
}));
