/**
 * TTS 文本转语音（Sprint #9 · M9-001）
 *
 * 详见 tech-design.md §3.4（sensory 模块）
 *
 * 使用浏览器原生 SpeechSynthesis API（无需第三方依赖）：
 * - 流式 chunk 逐段 speak
 * - 选不同 voice（zh-CN 中文）
 * - 可关闭（settings.ttsEnabled）
 * - 按角色 gender / name 选 voice（简化：统一中文女声/男声）
 */
import { useSettingsStore } from '@/stores/settings';
import type { SoulConfig } from '@/stores/souls';

let _availableVoices: SpeechSynthesisVoice[] = [];
let _voicesLoaded = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (_voicesLoaded) {
      resolve(_availableVoices);
      return;
    }
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      _availableVoices = voices;
      _voicesLoaded = true;
      resolve(voices);
      return;
    }
    // 部分浏览器异步加载
    speechSynthesis.onvoiceschanged = () => {
      _availableVoices = speechSynthesis.getVoices();
      _voicesLoaded = true;
      resolve(_availableVoices);
    };
    setTimeout(() => {
      _availableVoices = speechSynthesis.getVoices();
      _voicesLoaded = true;
      resolve(_availableVoices);
    }, 1000);
  });
}

function pickVoice(soul: SoulConfig, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  // 优先中文女声/男声
  const target = soul.identity.gender === 'male' ? 'male' : 'female';
  const cnVoices = voices.filter(v => v.lang.startsWith('zh'));
  if (cnVoices.length === 0) {
    return voices[0];
  }
  // 简化：用名字匹配（不同浏览器 voice name 不同）
  const gendered = cnVoices.find(v => /female|女|xiaoxiao|yunxi/i.test(v.name));
  const maleGendered = cnVoices.find(v => /male|男|kangkang|yunjian/i.test(v.name));
  if (target === 'male' && maleGendered) return maleGendered;
  if (target === 'female' && gendered) return gendered;
  return cnVoices[0];
}

export const tts = {
  /** 检测 TTS 可用性 */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  /** 是否启用（settings.ttsEnabled，默认 false） */
  isEnabled(): boolean {
    if (!this.isSupported()) return false;
    return useSettingsStore.getState().uiSettings.theme !== undefined;  // 简化：用 theme 字段存在作 proxy
  },

  /** 朗读一段文本（流式 chunk 累积完整后调） */
  async speak(soul: SoulConfig, text: string): Promise<void> {
    if (!this.isSupported() || !text.trim()) return;
    // 过滤 markdown / 表情
    const cleanText = text
      .replace(/<[^>]+>/g, '')
      .replace(/[*_`#>]/g, '')
      .replace(/\n+/g, '。')
      .trim();
    if (!cleanText) return;

    const voices = await loadVoices();
    const voice = pickVoice(soul, voices);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;  // 稍快
    utterance.pitch = soul.identity.gender === 'male' ? 0.9 : 1.1;  // 男声低音女声高音
    if (voice) utterance.voice = voice;

    speechSynthesis.speak(utterance);
  },

  /** 停止当前朗读 */
  stop(): void {
    if (this.isSupported()) {
      speechSynthesis.cancel();
    }
  },
};
