/**
 * souls store · 详见 tech-design.md §3.1 / §4.1（types 见 PRD §4.1.1）
 *
 * 当前范围（M1-003）：
 * - souls[] 数组 + 完整 SoulConfig 类型
 * - CRUD actions（createSoul / updateSoul / deleteSoul / getSoul）
 * - activeSoulId 标记当前选中角色
 *
 * 不在当前范围：
 * - IndexedDB 持久化（留 M2 接 idb 库）
 * - Prompt 编译（留 M2-001 接 soul/compiler 模块）
 * - 知识库 CRUD（留 M2）
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '@/features/storage/db';

export type Gender = 'male' | 'female' | 'non-binary' | 'other';
export type RelationshipType =
  | 'girlfriend'
  | 'boyfriend'
  | 'friend'
  | 'pet'
  | 'mentor'
  | 'sibling'
  | 'custom';
export type MBTI =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface IdentityConfig {
  name: string;
  gender: Gender;
  age: number;
  avatarSeed: string;
  pronouns?: string;
}

export interface PersonalityConfig {
  mbti?: MBTI;
  traits: string[];
  speakingStyle: string;
  emotionalBaseline: string;
}

export interface BackstoryConfig {
  story: string;
  occupation?: string;
  hobbies: string[];
  preferences: string[];
}

export interface RelationshipConfig {
  type: RelationshipType;
  customTypeName?: string;
  initialIntimacy: number;
  currentIntimacy: number;
  boundaries: string[];
}

export interface KnowledgeDoc {
  id: string;
  type: 'text' | 'url' | 'file';
  title: string;
  content?: string;
}

export interface KnowledgeConfig {
  documents: KnowledgeDoc[];
  manualFacts: string[];
}

export interface SoulConfig {
  id: string;
  identity: IdentityConfig;
  personality: PersonalityConfig;
  backstory: BackstoryConfig;
  relationship: RelationshipConfig;
  knowledge: KnowledgeConfig;
  createdAt: number;
  updatedAt: number;
}

interface SoulsState {
  souls: SoulConfig[];
  activeSoulId: string | null;

  // actions
  createSoul: (config: Omit<SoulConfig, 'id' | 'createdAt' | 'updatedAt'>) => SoulConfig;
  updateSoul: (id: string, patch: Partial<SoulConfig>) => void;
  deleteSoul: (id: string) => void;
  setActiveSoul: (id: string | null) => void;
  getSoul: (id: string) => SoulConfig | undefined;
  reset: () => void;
}

function newId(): string {
  return crypto.randomUUID();
}

export const useSoulsStore = create<SoulsState>()(
  persist(
    (set, get) => ({
      souls: [],
      activeSoulId: null,

      createSoul: (config) => {
        const now = Date.now();
        const soul: SoulConfig = {
          ...config,
          id: newId(),
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ souls: [...s.souls, soul] }));
        return soul;
      },

      updateSoul: (id, patch) =>
        set((s) => ({
          souls: s.souls.map((soul) =>
            soul.id === id ? { ...soul, ...patch, updatedAt: Date.now() } : soul,
          ),
        })),

      deleteSoul: (id) =>
        set((s) => ({
          souls: s.souls.filter((soul) => soul.id !== id),
          activeSoulId: s.activeSoulId === id ? null : s.activeSoulId,
        })),

      setActiveSoul: (id) => set({ activeSoulId: id }),

      getSoul: (id) => get().souls.find((soul) => soul.id === id),

      reset: () => set({ souls: [], activeSoulId: null }),
    }),
    {
      name: 'cyberman:souls',
      storage: createJSONStorage(() => idbStorage()),
      version: 1,
      // 只持久化数据字段；actions 是函数（zustand 默认已过滤，这里显式声明意图）
      partialize: (state) => ({
        souls: state.souls,
        activeSoulId: state.activeSoulId,
      }),
    },
  ),
);