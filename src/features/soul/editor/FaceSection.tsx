/**
 * 捏脸编辑器 section（Sprint #21 · M21-003）
 *
 * 8 个高级捏脸参数（faceShape/eyeSize/eyeShape/noseSize/mouthSize/mouthShape/eyebrowStyle/skinTone）
 * + 「随机生成」按钮快速尝试不同配置
 */
import { useFormContext, useWatch } from 'react-hook-form';
import type { SoulFormValues } from '../schema';
import { Section } from './Section';
import { Shuffle, Sparkles } from 'lucide-react';

const FACE_SHAPES = ['oval', 'round', 'square', 'long'] as const;
const EYE_SHAPES = ['round', 'almond', 'narrow'] as const;
const MOUTH_SHAPES = ['thin', 'wide', 'full'] as const;
const EYEBROW_STYLES = ['flat', 'arch', 'round', 'angled'] as const;
const SKIN_TONES = ['light', 'medium', 'tan', 'dark'] as const;

type FaceShape = 'oval' | 'round' | 'square' | 'long';
type EyeShape = 'round' | 'almond' | 'narrow';
type MouthShape = 'thin' | 'wide' | 'full';
type EyebrowStyle = 'flat' | 'arch' | 'round' | 'angled';
type SkinTone = 'light' | 'medium' | 'tan' | 'dark';

const LABEL_MAP = {
  faceShape: { oval: '椭圆', round: '圆', square: '方', long: '长' } satisfies Record<FaceShape, string>,
  eyeShape: { round: '圆', almond: '杏', narrow: '窄' } satisfies Record<EyeShape, string>,
  mouthShape: { thin: '薄', wide: '宽', full: '厚' } satisfies Record<MouthShape, string>,
  eyebrowStyle: { flat: '平', arch: '弓', round: '圆', angled: '挑' } satisfies Record<EyebrowStyle, string>,
  skinTone: { light: '白', medium: '黄', tan: '棕', dark: '深' } satisfies Record<SkinTone, string>,
};

function randomBetween(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function FaceSection() {
  const { control, setValue } = useFormContext<SoulFormValues>();
  const face = useWatch({ control, name: 'face' });

  const randomize = () => {
    setValue('face.faceShape', pickRandom(FACE_SHAPES), { shouldDirty: true });
    setValue('face.eyeSize', randomBetween(0.85, 1.15), { shouldDirty: true });
    setValue('face.eyeShape', pickRandom(EYE_SHAPES), { shouldDirty: true });
    setValue('face.noseSize', randomBetween(0.85, 1.15), { shouldDirty: true });
    setValue('face.mouthSize', randomBetween(0.85, 1.15), { shouldDirty: true });
    setValue('face.mouthShape', pickRandom(MOUTH_SHAPES), { shouldDirty: true });
    setValue('face.eyebrowStyle', pickRandom(EYEBROW_STYLES), { shouldDirty: true });
    setValue('face.skinTone', pickRandom(SKIN_TONES), { shouldDirty: true });
  };

  const set = (path: keyof NonNullable<typeof face>, value: any) => {
    setValue(`face.${path}`, value, { shouldDirty: true });
  };

  return (
    <Section
      title="高级捏脸"
      defaultOpen
      badge={
        <button
          type="button"
          onClick={randomize}
          className="text-xs flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
        >
          <Shuffle size={10} />
          随机
        </button>
      }
    >
      <Field label="脸型">
        <EnumSelect
          value={face?.faceShape ?? 'oval'}
          options={FACE_SHAPES}
          labels={LABEL_MAP.faceShape}
          onChange={(v) => set('faceShape', v)}
        />
      </Field>

      <RangeField
        label="眼睛大小"
        value={face?.eyeSize ?? 1.0}
        min={0.7}
        max={1.3}
        onChange={(v) => set('eyeSize', v)}
      />
      <Field label="眼睛形状">
        <EnumSelect
          value={face?.eyeShape ?? 'round'}
          options={EYE_SHAPES}
          labels={LABEL_MAP.eyeShape}
          onChange={(v) => set('eyeShape', v)}
        />
      </Field>

      <RangeField
        label="鼻子大小"
        value={face?.noseSize ?? 1.0}
        min={0.7}
        max={1.3}
        onChange={(v) => set('noseSize', v)}
      />

      <RangeField
        label="嘴大小"
        value={face?.mouthSize ?? 1.0}
        min={0.7}
        max={1.3}
        onChange={(v) => set('mouthSize', v)}
      />
      <Field label="嘴形状">
        <EnumSelect
          value={face?.mouthShape ?? 'wide'}
          options={MOUTH_SHAPES}
          labels={LABEL_MAP.mouthShape}
          onChange={(v) => set('mouthShape', v)}
        />
      </Field>

      <Field label="眉型">
        <EnumSelect
          value={face?.eyebrowStyle ?? 'arch'}
          options={EYEBROW_STYLES}
          labels={LABEL_MAP.eyebrowStyle}
          onChange={(v) => set('eyebrowStyle', v)}
        />
      </Field>

      <Field label="肤色">
        <EnumSelect
          value={face?.skinTone ?? 'medium'}
          options={SKIN_TONES}
          labels={LABEL_MAP.skinTone}
          onChange={(v) => set('skinTone', v)}
        />
      </Field>

      <div className="text-xs text-slate-500 flex items-center gap-1">
        <Sparkles size={10} />
        调整后 3D 场景实时反映（取决于状态）
      </div>
    </Section>
  );
}

// ─────────────────────────── 子组件 ───────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-slate-400 block">{label}</span>
      {children}
    </label>
  );
}

function EnumSelect<T extends string>({
  value, options, labels, onChange,
}: {
  value: T; options: readonly T[]; labels: Record<T, string>; onChange: (v: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-slate-500"
    >
      {options.map((o) => (
        <option key={o} value={o}>{labels[o]}</option>
      ))}
    </select>
  );
}

function RangeField({
  label, value, min, max, onChange,
}: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={0.05}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="font-mono text-xs text-slate-300 w-10 text-right">{value.toFixed(2)}</span>
      </div>
    </Field>
  );
}
