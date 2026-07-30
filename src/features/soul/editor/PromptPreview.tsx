/**
 * Prompt 预览组件（M1-005b 右栏）
 *
 * 输入：SoulConfig（表单实时值）
 * 输出：实时编译的 System Prompt + token 估算
 *
 * 设计：
 * - 使用 useWatch 订阅表单（不订阅整个表单；只订阅编译所需的字段）
 * - 编译失败（schema 不通过）时显示错误状态
 * - 默认显示「原始 Markdown」，可切换「分段视图」
 */
import { useState, useMemo } from 'react';
import { useWatch, useFormState, Control } from 'react-hook-form';
import { FileText, Code2, Copy, Check } from 'lucide-react';
import { compileSystemPrompt } from '../compiler/promptCompiler';
import type { SoulConfig } from '@/stores/souls';
import { defaultSoulValues, type SoulFormValues } from '../schema';

export interface PromptPreviewProps {
  control: Control<SoulFormValues>;
  soulId: string;            // 用于 metadata（新建时用临时 id）
}

export function PromptPreview({ control, soulId }: PromptPreviewProps) {
  const [view, setView] = useState<'raw' | 'sections'>('raw');
  const [copied, setCopied] = useState(false);

  // 订阅整个表单（useWatch 不带 name 时返回 DeepPartial<TFieldValues>）
  // 这是修好的 M1-005b bug：之前用 name: [...] 返回值是数组而非对象，导致编译永远 null
  const watched = useWatch({ control });

  // 表单脏状态用于显示「未通过验证」提示
  const { errors } = useFormState({ control });

  const compiled = useMemo(() => {
    if (!watched) return null;
    try {
      // 用 defaultSoulValues 深合并，避免 DeepPartial 导致的字段缺失
      const merged: SoulFormValues = mergeWithDefaults(watched);
      const soulLike = formToSoulPreview(merged, soulId);
      return compileSystemPrompt({ soul: soulLike });
    } catch (err) {
      console.error('Prompt 编译失败:', err);
      return null;
    }
  }, [watched, soulId]);

  const handleCopy = async () => {
    if (!compiled) return;
    try {
      await navigator.clipboard.writeText(compiled.systemPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 浏览器可能拒绝 clipboard 权限，忽略
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="border border-slate-800 rounded-lg bg-slate-900/40 overflow-hidden sticky top-20">
      <header className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-300">System Prompt 预览</span>
          {compiled && (
            <span className="text-xs text-slate-500 font-mono">
              ~{compiled.tokenEstimate} tokens
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <ViewToggle view={view} onChange={setView} />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!compiled}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded disabled:opacity-40 transition-colors"
            title="复制"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      </header>

      {hasErrors && (
        <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/30 text-xs text-amber-300">
          表单存在验证错误，编译结果可能不完整
        </div>
      )}

      <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
        {compiled ? (
          view === 'raw'
            ? <RawView text={compiled.systemPrompt} />
            : <SectionsView sections={compiled.sections} />
        ) : (
          <div className="p-4 text-xs text-slate-500">编译中…</div>
        )}
      </div>

      {compiled && (
        <footer className="px-3 py-2 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>{compiled.sections.length} 段 · 模板 v{compiled.metadata.templateVersion}</span>
          <span className="font-mono">事实 {compiled.metadata.factsIncluded} · 知识 {compiled.metadata.knowledgeIncluded}</span>
        </footer>
      )}
    </div>
  );
}

// ─────────────────────────── 子视图 ───────────────────────────

function ViewToggle({
  view,
  onChange,
}: {
  view: 'raw' | 'sections';
  onChange: (v: 'raw' | 'sections') => void;
}) {
  return (
    <div className="flex bg-slate-800 rounded text-xs">
      <button
        type="button"
        onClick={() => onChange('raw')}
        className={`px-2 py-1 rounded-l ${view === 'raw' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
      >
        原始
      </button>
      <button
        type="button"
        onClick={() => onChange('sections')}
        className={`px-2 py-1 rounded-r ${view === 'sections' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
      >
        分段
      </button>
    </div>
  );
}

function RawView({ text }: { text: string }) {
  return (
    <pre className="p-3 text-xs text-slate-300 whitespace-pre-wrap break-words font-mono leading-relaxed">
      {text}
    </pre>
  );
}

function SectionsView({ sections }: { sections: { title: string; body: string }[] }) {
  return (
    <div className="divide-y divide-slate-800">
      {sections.map((s, i) => (
        <details key={i} open={i < 3} className="group">
          <summary className="px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between">
            <span># {s.title}</span>
            <Code2 size={12} className="text-slate-500" />
          </summary>
          <pre className="px-3 pb-3 text-xs text-slate-400 whitespace-pre-wrap break-words font-mono leading-relaxed">
            {s.body}
          </pre>
        </details>
      ))}
    </div>
  );
}

// ─────────────────────────── 深合并：DeepPartial → 完整默认值 ───────────────────────────

/**
 * 把 useWatch 返回的 DeepPartial<SoulFormValues> 用 defaultSoulValues 合并，
 * 确保所有字段都有合理值（避免编译时 runtime 报错）。
 *
 * 接收 DeepPartial 而非 Partial，确保类型完全兼容 useWatch 的返回值。
 */
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

function mergeWithDefaults(
  watched: DeepPartial<SoulFormValues> | undefined,
): SoulFormValues {
  if (!watched) return defaultSoulValues;
  // DeepPartial 把数组元素也推为 T | undefined；运行时 zod 已保证数组元素非空
  // 用 filter(Boolean) 剔除可能的 undefined，再断言为 SoulFormValues
  const cleanArr = <T,>(arr: ReadonlyArray<T | undefined> | undefined): T[] =>
    (arr ?? []).filter((x): x is T => x !== undefined);

  return {
    identity: {
      ...defaultSoulValues.identity,
      ...(watched.identity ?? {}),
      avatarSeed: watched.identity?.avatarSeed ?? defaultSoulValues.identity.avatarSeed,
    },
    personality: {
      ...defaultSoulValues.personality,
      ...(watched.personality ?? {}),
      traits: cleanArr(watched.personality?.traits),
    },
    backstory: {
      ...defaultSoulValues.backstory,
      ...(watched.backstory ?? {}),
      hobbies: cleanArr(watched.backstory?.hobbies),
      preferences: cleanArr(watched.backstory?.preferences),
    },
    relationship: {
      ...defaultSoulValues.relationship,
      ...(watched.relationship ?? {}),
      boundaries: cleanArr(watched.relationship?.boundaries),
    },
    knowledge: {
      ...defaultSoulValues.knowledge,
      ...(watched.knowledge ?? {}),
      documents: watched.knowledge?.documents
        ? (watched.knowledge.documents as SoulFormValues['knowledge']['documents'])
        : defaultSoulValues.knowledge.documents,
      manualFacts: cleanArr(watched.knowledge?.manualFacts),
    },
  };
}

// ─────────────────────────── 表单 → SoulConfig 轻量转换 ───────────────────────────

/**
 * 把表单值转成 SoulConfig 的最小可用形态，仅用于编译预览。
 * 不写入 store，不持久化。
 */
function formToSoulPreview(form: SoulFormValues, soulId: string): SoulConfig {
  return {
    id: soulId,
    identity: { ...form.identity },
    personality: {
      mbti: (form.personality.mbti || undefined) as SoulConfig['personality']['mbti'],
      traits: form.personality.traits ?? [],
      speakingStyle: form.personality.speakingStyle ?? '',
      emotionalBaseline: form.personality.emotionalBaseline ?? '',
    },
    backstory: {
      story: form.backstory.story ?? '',
      occupation: form.backstory.occupation || undefined,
      hobbies: form.backstory.hobbies ?? [],
      preferences: form.backstory.preferences ?? [],
    },
    relationship: {
      type: form.relationship.type,
      customTypeName: form.relationship.customTypeName || undefined,
      initialIntimacy: form.relationship.initialIntimacy ?? 0,
      currentIntimacy: form.relationship.initialIntimacy ?? 0,
      boundaries: form.relationship.boundaries ?? [],
    },
    knowledge: {
      documents: [],
      manualFacts: [],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}