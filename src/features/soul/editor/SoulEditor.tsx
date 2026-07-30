/**
 * 灵魂编辑器主组件（M1-005a）
 *
 * 范围（本任务）：
 * - 5 sections 完整表单（身份/人格/背景/关系/知识库占位）
 * - react-hook-form + zod resolver
 * - 调用 useSoulsStore.createSoul 保存
 *
 * 不在本任务（M1-005b / M2）：
 * - Prompt 编译预览（右栏）
 * - 编辑现有灵魂（仅新建；M2 接入路由参数）
 * - IndexedDB 持久化（M2）
 */
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, RotateCcw, Sparkles } from 'lucide-react';
import {
  soulFormSchema,
  defaultSoulValues,
  type SoulFormValues,
} from '../schema';
import { useSoulsStore, type SoulConfig } from '@/stores/souls';
import {
  IdentitySection,
  PersonalitySection,
  BackstorySection,
  RelationshipSection,
  KnowledgeSection,
} from './sections';

export interface SoulEditorProps {
  /** 编辑现有灵魂的初始值；不传则新建 */
  initialSoul?: SoulConfig;
  /** 保存后回调（默认跳转到首页） */
  onSaved?: (soulId: string) => void;
}

export function SoulEditor({ initialSoul, onSaved }: SoulEditorProps) {
  const createSoul = useSoulsStore((s) => s.createSoul);
  const updateSoul = useSoulsStore((s) => s.updateSoul);

  const methods = useForm<SoulFormValues>({
    resolver: zodResolver(soulFormSchema),
    defaultValues: initialSoul
      ? soulToForm(initialSoul)
      : defaultSoulValues,
    mode: 'onBlur',
  });

  const { handleSubmit, reset, formState, watch } = methods;
  const isDirty = formState.isDirty;

  // 监听外部灵魂变化（如切换路由参数），重置表单
  useEffect(() => {
    if (initialSoul) reset(soulToForm(initialSoul));
  }, [initialSoul, reset]);

  const onSubmit = (values: SoulFormValues) => {
    if (initialSoul) {
      updateSoul(initialSoul.id, formToSoulPatch(values));
      onSaved?.(initialSoul.id);
    } else {
      const soul = createSoul(formToCreate(values));
      onSaved?.(soul.id);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-3xl">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              {initialSoul ? '编辑灵魂' : '定制新灵魂'}
              {isDirty && <span className="text-xs text-amber-500 font-mono">● 未保存</span>}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              字段随填随编 —— 右栏 Prompt 预览将在 M1-005b 启用
            </p>
          </div>
        </header>

        <IdentitySection />
        <PersonalitySection />
        <BackstorySection />
        <RelationshipSection />
        <KnowledgeSection />

        <footer className="flex items-center justify-end gap-2 pt-2 sticky bottom-0 bg-slate-950/80 backdrop-blur py-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors disabled:opacity-40"
          >
            <RotateCcw size={14} />
            重置
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
          >
            <Save size={14} />
            {initialSoul ? '保存修改' : '创建灵魂'}
          </button>
        </footer>

        {/* 静默 useWatch 引用，避免 lint 警告 */}
        <span className="hidden">{Object.keys(watch()).length}</span>
      </form>
    </FormProvider>
  );
}

// ─────────────────────────── 表单 ↔ SoulConfig 互转 ───────────────────────────

function soulToForm(soul: SoulConfig): SoulFormValues {
  return {
    identity: { ...soul.identity },
    personality: {
      mbti: soul.personality.mbti,
      traits: [...soul.personality.traits],
      speakingStyle: soul.personality.speakingStyle,
      emotionalBaseline: soul.personality.emotionalBaseline,
    },
    backstory: {
      story: soul.backstory.story,
      occupation: soul.backstory.occupation ?? '',
      hobbies: [...soul.backstory.hobbies],
      preferences: [...soul.backstory.preferences],
    },
    relationship: {
      type: soul.relationship.type,
      customTypeName: soul.relationship.customTypeName ?? '',
      initialIntimacy: soul.relationship.initialIntimacy,
      currentIntimacy: soul.relationship.currentIntimacy,
      boundaries: [...soul.relationship.boundaries],
    },
    knowledge: {
      documents: [...soul.knowledge.documents],
      manualFacts: [...soul.knowledge.manualFacts],
    },
  };
}

function formToCreate(form: SoulFormValues): Omit<SoulConfig, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    identity: { ...form.identity },
    personality: {
      mbti: form.personality.mbti || undefined,
      traits: form.personality.traits ?? [],
      speakingStyle: form.personality.speakingStyle,
      emotionalBaseline: form.personality.emotionalBaseline,
    },
    backstory: {
      story: form.backstory.story,
      occupation: form.backstory.occupation || undefined,
      hobbies: form.backstory.hobbies ?? [],
      preferences: form.backstory.preferences ?? [],
    },
    relationship: {
      type: form.relationship.type,
      customTypeName: form.relationship.customTypeName || undefined,
      initialIntimacy: form.relationship.initialIntimacy,
      currentIntimacy: form.relationship.currentIntimacy,
      boundaries: form.relationship.boundaries ?? [],
    },
    knowledge: {
      documents: form.knowledge.documents ?? [],
      manualFacts: form.knowledge.manualFacts ?? [],
    },
  };
}

function formToSoulPatch(form: SoulFormValues): Partial<SoulConfig> {
  // 编辑模式只更新业务字段（id/createdAt 由 store 维护）
  return {
    identity: { ...form.identity },
    personality: {
      mbti: form.personality.mbti || undefined,
      traits: form.personality.traits ?? [],
      speakingStyle: form.personality.speakingStyle,
      emotionalBaseline: form.personality.emotionalBaseline,
    },
    backstory: {
      story: form.backstory.story,
      occupation: form.backstory.occupation || undefined,
      hobbies: form.backstory.hobbies ?? [],
      preferences: form.backstory.preferences ?? [],
    },
    relationship: {
      type: form.relationship.type,
      customTypeName: form.relationship.customTypeName || undefined,
      initialIntimacy: form.relationship.initialIntimacy,
      currentIntimacy: form.relationship.currentIntimacy,
      boundaries: form.relationship.boundaries ?? [],
    },
    knowledge: {
      documents: form.knowledge.documents ?? [],
      manualFacts: form.knowledge.manualFacts ?? [],
    },
  };
}