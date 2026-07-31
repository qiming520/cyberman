/**
 * 语音输入（Sprint #13 · M13-001）
 *
 * 详见 tech-design.md §3.4（sensory 模块）
 *
 * 使用浏览器原生 SpeechRecognition API（Web Speech API）：
 * - 连续识别（interimResults）
 * - 中文 zh-CN
 * - 错误处理（无权限 / 不支持 / 中断）
 *
 * 用法：
 * ```
 * const { transcript, isListening, start, stop, error, isSupported } = useVoiceInput();
 * ```
 */
import { useState, useRef, useCallback } from 'react';

declare global {
  // Web Speech API 浏览器类型（TypeScript 标准库未包含，需手动声明）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type SpeechRecognition = any;
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

function getSpeechRecognition(): any | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognition() !== null;
}

export interface UseVoiceInputResult {
  /** 当前识别文本（实时更新） */
  transcript: string;
  /** 是否正在录音 */
  isListening: boolean;
  /** 浏览器是否支持 */
  isSupported: boolean;
  /** 错误信息 */
  error: string | null;
  /** 开始录音 */
  start: () => void;
  /** 停止录音 */
  stop: () => void;
  /** 重置 transcript */
  reset: () => void;
}

export function useVoiceInput(): UseVoiceInputResult {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = isSpeechRecognitionSupported();

  const start = useCallback(() => {
    if (!isSupported) {
      setError('当前浏览器不支持语音识别');
      return;
    }
    if (isListening) return;

    const SpeechRecognition = getSpeechRecognition()!;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;  // 单次识别
    recognition.interimResults = true;  // 实时显示

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      const errorMessages: Record<string, string> = {
        'no-speech': '未检测到语音',
        'audio-capture': '无法访问麦克风',
        'not-allowed': '麦克风权限被拒绝',
        'network': '网络错误',
      };
      setError(errorMessages[event.error] || `语音识别错误: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setError(null);
    setTranscript('');
    recognition.start();
    setIsListening(true);
  }, [isSupported, isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const reset = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    start,
    stop,
    reset,
  };
}
