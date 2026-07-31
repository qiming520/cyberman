/**
 * 灵魂引导式配置流程（Sprint #16 · M16-001）
 *
 * 用户原话："经过一些顶级交互的配置，生成了一个定制化赛博机器人"
 * → 5 步引导式问答，比直接填表更"顶级"
 *
 * 流程：
 * 1. 选关系（女友/男友/小孩/宠物/自定义）
 * 2. 选 MBTI（自动带性格预设）
 * 3. 选性格关键词（3-5 个）
 * 4. 填名字 + 选说话风格
 * 5. 完成 → 生成 SoulConfig
 *
 * 跳过：右上角"跳过引导"按钮
 */
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import {
  PRESET_TYPES, PRESET_LABELS, PRESET_EMOJI, PRESET_DESCRIPTIONS,
  createSoulFromPreset,
  type PresetType,
} from './presets';
import { useSoulsStore } from '@/stores/souls';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import type { Gender, MBTI } from '@/stores/souls';

interface OnboardingFlowProps {
  open: boolean;
  onClose: () => void;
  onComplete: (soulId: string) => void;
}

const ALL_MBTIS: MBTI[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const TRAITS_BY_MBTI: Record<MBTI, string[]> = {
  INTJ: ['理性', '独立', '战略思维'],
  INTP: ['好奇', '逻辑', '独立思考'],
  ENTJ: ['果断', '高效', '领导力'],
  ENTP: ['机智', '思辨', '创新'],
  INFJ: ['洞察', '理想主义', '共情'],
  INFP: ['温柔', '内省', '理想主义'],
  ENFJ: ['热情', '关怀', '善于引导'],
  ENFP: ['活力', '创意', '热情'],
  ISTJ: ['稳重', '可靠', '务实'],
  ISFJ: ['温和', '细致', '关怀'],
  ESTJ: ['直接', '务实', '组织力'],
  ESFJ: ['友善', '合作', '和谐'],
  ISTP: ['冷静', '动手', '逻辑'],
  ISFP: ['温和', '审美', '当下'],
  ESTP: ['直接', '行动', '活力'],
  ESFP: ['活泼', '感染力', '当下'],
};

const GENDER_BY_PRESET_UNUSED: Record<PresetType, Gender> = {
  girlfriend: 'female', boyfriend: 'male', child: 'female', pet: 'other',
};
void GENDER_BY_PRESET_UNUSED;  // 预留未来按 preset 决定性别

export function OnboardingFlow({ open, onClose, onComplete }: OnboardingFlowProps) {
  const createSoul = useSoulsStore((s) => s.createSoul);
  const [step, setStep] = useState(1);
  const [preset, setPreset] = useState<PresetType | null>(null);
  const [mbti, setMbti] = useState<MBTI | null>(null);
  const [traits, setTraits] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [speakingStyle, setSpeakingStyle] = useState('');

  const totalSteps = 5;

  const reset = () => {
    setStep(1); setPreset(null); setMbti(null);
    setTraits([]); setName(''); setSpeakingStyle('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleComplete = () => {
    if (!preset || !mbti) return;
    const base = createSoulFromPreset(preset, name);
    // 合并用户选择的 traits / speakingStyle
    const soulInput = {
      ...base,
      personality: {
        ...base.personality,
        mbti,
        traits: traits.length > 0 ? traits : base.personality.traits,
        speakingStyle: speakingStyle || base.personality.speakingStyle,
      },
    };
    const created = createSoul(soulInput);
    reset();
    onComplete(created.id);
  };

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleComplete();
  };
  const prev = () => step > 1 && setStep(step - 1);

  const canProceed = () => {
    if (step === 1) return preset !== null;
    if (step === 2) return mbti !== null;
    if (step === 3) return traits.length >= 1;
    if (step === 4) return name.trim().length > 0;
    return true;
  };

  const stepTitle = () => {
    const map: Record<number, string> = {
      1: '第 1 步：你想创造什么样的伙伴？',
      2: '第 2 步：选一个 MBTI',
      3: '第 3 步：选性格关键词（至少 1 个）',
      4: '第 4 步：给它起个名字 + 说话风格',
      5: '准备完成',
    };
    return map[step] ?? '';
  };

  return (
    <Modal open={open} onClose={handleClose} title="创建灵魂" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* 进度条 + 跳过 */}
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1.5">第 {step} / {totalSteps} 步</div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            跳过引导
          </button>
        </div>

        <h3 className="text-base font-medium text-slate-100">{stepTitle()}</h3>

        {/* Step 1: 选关系类型 */}
        {step === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_TYPES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPreset(p)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                  preset === p
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <span className="text-4xl">{PRESET_EMOJI[p]}</span>
                <span className="font-medium text-slate-100">{PRESET_LABELS[p]}</span>
                <span className="text-xs text-slate-500">{PRESET_DESCRIPTIONS[p]}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: 选 MBTI */}
        {step === 2 && (
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {ALL_MBTIS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMbti(m)}
                className={`px-2 py-2 rounded text-sm font-mono transition-colors ${
                  mbti === m
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
        {step === 2 && mbti && (
          <div className="text-xs text-slate-400 p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">{mbti}</span> ·{' '}
            {TRAITS_BY_MBTI[mbti].join('、')}
          </div>
        )}

        {/* Step 3: 性格关键词 */}
        {step === 3 && (
          <div className="space-y-2">
            {mbti && (
              <div className="text-xs text-slate-500">
                推荐：{TRAITS_BY_MBTI[mbti].slice(0, 3).join(' / ')}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {(mbti ? TRAITS_BY_MBTI[mbti] : ['温柔', '理性', '活泼', '沉稳', '好奇']).map((t) => {
                const selected = traits.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setTraits(prev =>
                        prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t],
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              已选：{traits.length > 0 ? traits.join('、') : '（点击上方 tag 添加）'}
            </div>
          </div>
        )}

        {/* Step 4: 名字 + 说话风格 */}
        {step === 4 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500">名字 *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：小柚、墨羽、塔塔..."
                maxLength={20}
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">说话风格（选填）</label>
              <input
                value={speakingStyle}
                onChange={(e) => setSpeakingStyle(e.target.value)}
                placeholder="例：用「嗯哼」和 emoji"
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>
        )}

        {/* Step 5: 准备完成 */}
        {step === 5 && preset && mbti && (
          <div className="text-center space-y-3 p-6 bg-slate-800/30 rounded-lg">
            <div className="text-5xl">{PRESET_EMOJI[preset]}</div>
            <div className="text-lg font-medium text-slate-100">{name || '未命名'}</div>
            <div className="text-sm text-slate-400">
              {PRESET_LABELS[preset]} · {mbti}
              {traits.length > 0 && ` · ${traits.join('/')}`}
            </div>
            <div className="text-xs text-slate-500 pt-3">
              <Sparkles size={12} className="inline mr-1" />
              完成后灵魂会立即出现在 3D 场景中
            </div>
          </div>
        )}

        {/* 底部导航 */}
        <div className="flex justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-400 hover:text-slate-100 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
            上一步
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canProceed()}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded text-sm transition-colors"
          >
            {step === totalSteps ? '✨ 完成创建' : '下一步'}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </Modal>
  );
}
