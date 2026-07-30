/**
 * 灵魂配置的 zod schema（M1-005a）
 *
 * 严格对应 PRD §4.1.1 的 SoulConfig 类型，但聚焦「灵魂编辑器表单」字段：
 * - 暂时忽略 knowledge.documents.chunks（向量块；M2 接 LanceDB 再用）
 * - 用 z.number() 而不是 number 类型推导，保持与 useSoulsStore 的 SoulConfig 一致
 */
import { z } from 'zod';

export const GenderEnum = z.enum(['male', 'female', 'non-binary', 'other']);
export type Gender = z.infer<typeof GenderEnum>;

export const RelationshipTypeEnum = z.enum([
  'girlfriend',
  'boyfriend',
  'friend',
  'pet',
  'mentor',
  'sibling',
  'custom',
]);
export type RelationshipType = z.infer<typeof RelationshipTypeEnum>;

export const MBTIEnum = z.enum([
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]);
export type MBTI = z.infer<typeof MBTIEnum>;

export const identitySchema = z.object({
  name: z.string().min(1, '请输入角色名').max(20, '不超过 20 字'),
  gender: GenderEnum,
  age: z.number().int().min(0).max(200),
  avatarSeed: z.string().min(1),
  pronouns: z.string().max(10).optional(),
});

export const personalitySchema = z.object({
  mbti: MBTIEnum.optional().or(z.literal('')),
  traits: z.array(z.string().min(1)).max(10, '最多 10 个'),
  speakingStyle: z.string().max(200),
  emotionalBaseline: z.string().max(100),
});

export const backstorySchema = z.object({
  story: z.string().max(2000),
  occupation: z.string().max(50),
  hobbies: z.array(z.string().min(1)).max(20, '最多 20 个'),
  preferences: z.array(z.string().min(1)).max(20, '最多 20 个'),
});

export const relationshipSchema = z.object({
  type: RelationshipTypeEnum,
  customTypeName: z.string().max(20).optional(),
  initialIntimacy: z.number().int().min(0).max(100),
  currentIntimacy: z.number().int().min(0).max(100),
  boundaries: z.array(z.string().min(1)).max(20, '最多 20 个'),
});

export const knowledgeSchema = z.object({
  documents: z.array(z.any()),
  manualFacts: z.array(z.string().min(1)).max(50, '最多 50 条'),
});

export const soulFormSchema = z.object({
  identity: identitySchema,
  personality: personalitySchema,
  backstory: backstorySchema,
  relationship: relationshipSchema,
  knowledge: knowledgeSchema,
});

export type SoulFormValues = z.infer<typeof soulFormSchema>;

/** 默认值（用于新建灵魂） */
export const defaultSoulValues: SoulFormValues = {
  identity: {
    name: '',
    gender: 'female',
    age: 20,
    avatarSeed: crypto.randomUUID(),
    pronouns: '她',
  },
  personality: {
    mbti: undefined,
    traits: [],
    speakingStyle: '',
    emotionalBaseline: '',
  },
  backstory: {
    story: '',
    occupation: '',
    hobbies: [],
    preferences: [],
  },
  relationship: {
    type: 'friend',
    customTypeName: '',
    initialIntimacy: 30,
    currentIntimacy: 30,
    boundaries: [],
  },
  knowledge: {
    documents: [],
    manualFacts: [],
  },
};