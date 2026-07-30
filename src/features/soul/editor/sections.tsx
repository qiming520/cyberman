/**
 * 灵魂编辑器 5 个 section 子组件（M1-005a）
 *
 * 每个 section 用 useFormContext 接入 react-hook-form。
 * Knowledge 暂为占位（M2 接 IndexedDB + 向量化）。
 */
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { RefreshCw, Sparkles } from 'lucide-react';
import type { SoulFormValues } from '../schema';
import { Section } from './Section';
import { TagInput } from './TagInput';
import { DiceBearAvatar } from './DiceBearAvatar';

// ─────────────────────────── 身份 ───────────────────────────

export function IdentitySection() {
  const { register, setValue, control, formState: { errors } } = useFormContext<SoulFormValues>();
  const avatarSeed = useWatch({ control, name: 'identity.avatarSeed' });

  const idErr = errors.identity;

  return (
    <Section title="身份" defaultOpen>
      <div className="flex gap-4">
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <DiceBearAvatar seed={avatarSeed} size={64} />
          <button
            type="button"
            onClick={() => setValue('identity.avatarSeed', crypto.randomUUID(), { shouldDirty: true })}
            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300"
          >
            <RefreshCw size={12} />
            换一换
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <Field label="姓名" error={idErr?.name?.message} required>
            <input
              {...register('identity.name')}
              className={inputCls(!!idErr?.name)}
              placeholder="例：小柚"
              autoComplete="off"
            />
          </Field>

          <Field label="性别" error={idErr?.gender?.message} required>
            <select {...register('identity.gender')} className={inputCls(!!idErr?.gender)}>
              <option value="female">女</option>
              <option value="male">男</option>
              <option value="non-binary">非二元</option>
              <option value="other">其他</option>
            </select>
          </Field>

          <Field label="年龄" error={idErr?.age?.message}>
            <input
              type="number"
              min={0}
              max={200}
              {...register('identity.age', { valueAsNumber: true })}
              className={inputCls(!!idErr?.age)}
            />
          </Field>

          <Field label="代词" error={idErr?.pronouns?.message}>
            <input
              {...register('identity.pronouns')}
              className={inputCls(!!idErr?.pronouns)}
              placeholder="她/他/它"
              autoComplete="off"
            />
          </Field>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────── 人格 ───────────────────────────

export function PersonalitySection() {
  const { control, register, formState: { errors } } = useFormContext<SoulFormValues>();
  const perErr = errors.personality;

  return (
    <Section title="人格" defaultOpen>
      <Field label="MBTI" error={perErr?.mbti?.message}>
        <select {...register('personality.mbti')} className={inputCls(!!perErr?.mbti)}>
          <option value="">未指定</option>
          {MBTI_OPTIONS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </Field>

      <Field label="性格特征" error={perErr?.traits?.message} hint="回车添加 · 最多 10 个">
        <Controller
          control={control}
          name="personality.traits"
          render={({ field }) => (
            <TagInput
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="温柔 / 毒舌 / 偶尔撒娇"
              max={10}
            />
          )}
        />
      </Field>

      <Field label="说话风格" error={perErr?.speakingStyle?.message}>
        <input
          {...register('personality.speakingStyle')}
          className={inputCls(!!perErr?.speakingStyle)}
          placeholder="用「嗯哼」和 emoji，偶尔动作描写"
          autoComplete="off"
        />
      </Field>

      <Field label="情绪基线" error={perErr?.emotionalBaseline?.message}>
        <input
          {...register('personality.emotionalBaseline')}
          className={inputCls(!!perErr?.emotionalBaseline)}
          placeholder="平静偏温暖"
          autoComplete="off"
        />
      </Field>
    </Section>
  );
}

const MBTI_OPTIONS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
] as const;

// ─────────────────────────── 背景 ───────────────────────────

export function BackstorySection() {
  const { control, register, formState: { errors } } = useFormContext<SoulFormValues>();
  const bsErr = errors.backstory;

  return (
    <Section title="背景故事" defaultOpen>
      <Field label="角色故事" error={bsErr?.story?.message} hint={`最多 2000 字`}>
        <textarea
          {...register('backstory.story')}
          rows={5}
          className={inputCls(!!bsErr?.story, 'resize-y')}
          placeholder="一位独立设计师，喜欢爵士乐和猫…"
        />
      </Field>

      <Field label="职业">
        <input
          {...register('backstory.occupation')}
          className={inputCls()}
          placeholder="设计师 / 程序员 / 学生"
          autoComplete="off"
        />
      </Field>

      <Field label="爱好" error={bsErr?.hobbies?.message} hint="回车添加 · 最多 20 个">
        <Controller
          control={control}
          name="backstory.hobbies"
          render={({ field }) => (
            <TagInput
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="听爵士 / 画画"
              max={20}
            />
          )}
        />
      </Field>

      <Field label="偏好" error={bsErr?.preferences?.message} hint="回车添加 · 最多 20 个">
        <Controller
          control={control}
          name="backstory.preferences"
          render={({ field }) => (
            <TagInput
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="喜欢下雨天 / 讨厌香菜"
              max={20}
            />
          )}
        />
      </Field>
    </Section>
  );
}

// ─────────────────────────── 关系 ───────────────────────────

const RELATIONSHIP_LABELS: Record<string, string> = {
  girlfriend: '女友',
  boyfriend: '男友',
  friend: '朋友',
  pet: '宠物',
  mentor: '导师',
  sibling: '兄妹 / 姐弟',
  custom: '自定义',
};

export function RelationshipSection() {
  const { control, register, watch, formState: { errors } } = useFormContext<SoulFormValues>();
  const relErr = errors.relationship;
  const relType = watch('relationship.type');

  return (
    <Section title="关系" defaultOpen>
      <Field label="关系类型" error={relErr?.type?.message}>
        <select {...register('relationship.type')} className={inputCls(!!relErr?.type)}>
          {Object.entries(RELATIONSHIP_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </Field>

      {relType === 'custom' && (
        <Field label="自定义关系名">
          <input
            {...register('relationship.customTypeName')}
            className={inputCls()}
            placeholder="青梅竹马 / 笔友"
            autoComplete="off"
          />
        </Field>
      )}

      <Field
        label="初始亲密度"
        hint="0=陌生 · 100=极亲密。当前亲密度等于此值起算，后续随对话变化"
        error={relErr?.initialIntimacy?.message}
      >
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            {...register('relationship.initialIntimacy', { valueAsNumber: true })}
            className="flex-1"
          />
          <span className="font-mono text-sm w-12 text-right text-slate-300">
            {watch('relationship.initialIntimacy')}
          </span>
        </div>
      </Field>

      <Field label="边界" error={relErr?.boundaries?.message} hint="不愿聊的话题 · 回车添加">
        <Controller
          control={control}
          name="relationship.boundaries"
          render={({ field }) => (
            <TagInput
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="不聊政治 / 拒绝成人话题"
              max={20}
            />
          )}
        />
      </Field>
    </Section>
  );
}

// ─────────────────────────── 知识库（占位） ───────────────────────────

export function KnowledgeSection() {
  return (
    <Section title="知识库" defaultOpen>
      <div className="border border-dashed border-slate-700 rounded-lg p-6 bg-slate-900/30 text-center text-sm text-slate-500 space-y-2">
        <Sparkles className="mx-auto text-slate-600" size={28} />
        <p>知识库管理（M2 启用）</p>
        <p className="text-xs text-slate-600 font-mono">
          文档上传 / URL 抓取 / 手动事实清单 / 向量化
        </p>
      </div>
    </Section>
  );
}

// ─────────────────────────── 复用 form 控件 ───────────────────────────

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-slate-400 flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-rose-400 ml-0.5">*</span>}
        </span>
        {hint && !error && <span className="text-slate-600">{hint}</span>}
      </span>
      {children}
      {error && <span className="text-xs text-rose-400 block">{error}</span>}
    </label>
  );
}

function inputCls(hasError?: boolean, extra = '') {
  return [
    'w-full bg-slate-950 border rounded px-3 py-1.5 text-sm text-slate-200',
    'placeholder:text-slate-600 focus:outline-none',
    hasError
      ? 'border-rose-500/70 focus:border-rose-400'
      : 'border-slate-700 focus:border-slate-500',
    extra,
  ].join(' ');
}