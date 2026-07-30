/**
 * 灵魂编辑器主组件（M1-005b 重构）
 *
 * 设计：
 * - `useSoulEditor({ onSaved })`：返回 `{ methods, onSubmit }`
 * - `<SoulEditor methods={methods} onSubmit={onSubmit} />`：渲染左栏表单 UI
 * - 父组件（WorkshopPage）用 `<FormProvider {...methods}>` 包裹两栏，
 *   让左栏表单和右栏 PromptPreview 共享同一个 form state
 */
import { useEffect } from 'react';
import {
  useForm,
  FormProvider,
  type UseFormReturn,
  type SubmitHandler,
} from 'react-hook-form';
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

// ─────────────────────────── Hook：useSoulEditor ───────────────────────────

export interface UseSoulEditorOptions {
  /** 编辑现有灵魂的初始值；不传则新建 */
  initialSoul?: SoulConfig;
  /** 保存后回调（默认无操作；父组件决定跳转） */
  onSaved?: (soulId: string) => void;
}

export interface UseSoulEditorReturn {
  methods: UseFormReturn<SoulFormValues>;
  onSubmit: SubmitHandler<SoulFormValues>;
}

export function useSoulEditor({
  initialSoul,
  onSaved,
}: UseSoulEditorOptions = {}): UseSoulEditorReturn {
  const createSoul = useSoulsStore((s) => s.createSoul);
  const updateSoul = useSoulsStore((s) => s.updateSoul);

  const methods = useForm<SoulFormValues>({
    resolver: zodResolver(soulFormSchema),
    defaultValues: initialSoul ? soulToForm(initialSoul) : defaultSoulValues,
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<SoulFormValues> = (values) => {
    if (initialSoul) {
      updateSoul(initialSoul.id, formToSoulPatch(values));
      onSaved?.(initialSoul.id);
    } else {
      const soul = createSoul(formToCreate(values));
      onSaved?.(soul.id);
    }
  };

  // 监听外部灵魂变化，重置表单
  useEffect(() => {
    if (initialSoul) methods.reset(soulToForm(initialSoul));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSoul]);

  return { methods, onSubmit };
}

// ─────────────────────────── 组件：SoulEditor（左栏） ───────────────────────────

export interface SoulEditorProps {
  methods: UseFormReturn<SoulFormValues>;
  onSubmit: SubmitHandler<SoulFormValues>;
  /** 提交按钮文案（新建 vs 编辑） */
  submitLabel?: string;
}

export function SoulEditor({ methods, onSubmit, submitLabel = '创建灵魂' }: SoulEditorProps) {
  const { handleSubmit, reset, formState } = methods;
  const isDirty = formState.isDirty;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-3xl">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              定制灵魂
              {isDirty && <span className="text-xs text-amber-500 font-mono">● 未保存</span>}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              字段随填随编 —— 右栏实时预览编译结果
            </p>
          </div>
        </header>

        <IdentitySection />
        <PersonalitySection />
        <BackstorySection />
        <RelationshipSection />
        <KnowledgeSection />

        <footer className="flex items-center justify-end gap-2 pt-2">
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
            {submitLabel}
          </button>
        </footer>
      </form>
    </FormProvider>
  );
}

// ─────────────────────────── 表单 ↔ SoulConfig 互转 ───────────────────────────

function soulToForm(soul: SoulConfig): SoulFormValues {
  return {
    identity: {
      ...soul.identity,
      hairStyle: soul.identity.hairStyle ?? 'short',
      hairColor: soul.identity.hairColor ?? '#1e293b',
    },
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
    body: soul.body ?? { height: 1.0, bodyType: 1.0 },
  };
}

function formToCreate(form: SoulFormValues): Omit<SoulConfig, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    identity: {
      ...form.identity,
      hairStyle: form.identity.hairStyle ?? 'short',
      hairColor: form.identity.hairColor ?? '#1e293b',
    },
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
    body: form.body ?? { height: 1.0, bodyType: 1.0 },
  };
}

function formToSoulPatch(form: SoulFormValues): Partial<SoulConfig> {
  return {
    identity: {
      ...form.identity,
      hairStyle: form.identity.hairStyle ?? 'short',
      hairColor: form.identity.hairColor ?? '#1e293b',
    },
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
    body: form.body ?? { height: 1.0, bodyType: 1.0 },
  };
}