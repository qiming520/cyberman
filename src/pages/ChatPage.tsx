/**
 * 聊天主厅页（Sprint #6 · M1-006）
 *
 * 详见 tech-design.md §4.2 / project-design-report.md §4.3
 *
 * 流程：
 * 1. 读 ?soulId=xxx 加载 SoulConfig（从 useSoulsStore）
 * 2. 显示历史消息 + 输入框 + 发送按钮
 * 3. 用户输入 → AgentOrchestrator.stream() → appendChunk 流式渲染
 * 4. 无 API Key → 显示「去设置」按钮（友好引导）
 * 5. 顶部 Provider/Model 选择器
 *
 * 不在本阶段：
 * - 长期记忆（每次对话后总结） —— Sprint #7
 * - 多模态附件（图片/语音）—— Sprint #7
 * - 情绪状态机 —— Sprint #7
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSoulsStore } from '@/stores/souls';
import { useChatStore } from '@/stores/chat';
import { useSettingsStore } from '@/stores/settings';
import { DiceBearAvatar } from '@/features/soul/editor/DiceBearAvatar';
import { getAgentOrchestrator } from '@/features/agent/orchestrator';
import { maybeSummarize, getMemoryContext } from '@/features/memory/summarizer';
import { tts } from '@/features/sensory/tts';
import { useVoiceInput } from '@/features/sensory/voiceInput';
import { useCamera } from '@/features/sensory/camera';
import { Send, Square, Settings as SettingsIcon, AlertCircle, Volume2, VolumeX, Mic, MicOff, Camera, CameraOff, X } from 'lucide-react';

export function ChatPage() {
  const [searchParams] = useSearchParams();
  const explicitSoulId = searchParams.get('soulId');

  // M7-004 智能调度：URL ?soulId > activeSoulId > 第一个 soul
  const activeSoulId = useSoulsStore((s) => s.activeSoulId);
  const allSouls = useSoulsStore((s) => s.souls);
  const soulId = useMemo(() => {
    if (explicitSoulId) return explicitSoulId;
    if (activeSoulId) return activeSoulId;
    if (allSouls.length > 0) return allSouls[0].id;
    return null;
  }, [explicitSoulId, activeSoulId, allSouls]);

  const soul = useSoulsStore((s) => (soulId ? s.getSoul(soulId) ?? null : null));
  const currentConversation = useChatStore((s) => s.currentConversation);
  const startConversation = useChatStore((s) => s.startConversation);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const appendChunk = useChatStore((s) => s.appendChunk);
  const finalizeMessage = useChatStore((s) => s.finalizeMessage);
  const streamingMessageId = useChatStore((s) => s.streamingMessageId);

  const currentProvider = useSettingsStore((s) => s.currentProvider);
  const currentModel = useSettingsStore((s) => s.currentModel);
  const apiKey = useSettingsStore((s) => s.getApiKey(s.currentProvider));
  const setCurrentProvider = useSettingsStore((s) => s.setCurrentProvider);
  const setCurrentModel = useSettingsStore((s) => s.setCurrentModel);

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [memoryCount, setMemoryCount] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // M13-001 语音输入
  const voice = useVoiceInput();

  // 录音结束时把识别结果填入输入框
  useEffect(() => {
    if (!voice.isListening && voice.transcript && !voice.error) {
      setInput(prev => prev + (prev ? ' ' : '') + voice.transcript);
      voice.reset();
    }
  }, [voice.isListening, voice.transcript, voice.error, voice]);

  // M16-001 摄像头（仅当 isCameraOpen 时启用）
  const camera = useCamera();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const openCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    await camera.startCamera();
  };

  const closeCamera = () => {
    camera.stopCamera();
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = camera.stream;
    }
    const photo = camera.takePhoto();
    if (photo) {
      setInput(prev => prev + (prev ? ' ' : '') + '[已拍照]');
      closeCamera();
    } else if (camera.error) {
      setCameraError(camera.error);
    }
  };

  // soulId 变化时：summarize 上次会话 + 启动新会话 + 加载 memory
  useEffect(() => {
    if (!soul) return;

    const oldConv = currentConversation;
    const newSoul = oldConv?.soulId !== soul.id;

    if (newSoul) {
      // 1. Summarize 上次会话（如果有 >= 5 条消息）
      if (oldConv && oldConv.messages.length >= 5) {
        maybeSummarize(
          useSoulsStore.getState().getSoul(oldConv.soulId) ?? soul,
          oldConv.messages.map(m => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ).then(() => {
          // 不 await；后台跑
        });
      }

      // 2. 启动新会话
      startConversation(soul.id);
    }

    // 3. 加载 memory 计数（用于显示）
    getMemoryContext(soul.id, 5).then(ctx => {
      setMemoryCount(ctx ? ctx.split('\n').filter(Boolean).length : 0);
    });
  }, [soul, currentConversation, startConversation]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages.length, streamingMessageId]);

  if (!soulId) {
    return <EmptyState message="未指定 soulId。在 3D 场景中点击角色进入聊天。" />;
  }
  if (!soul) {
    return <EmptyState message={`未找到灵魂 ${soulId}。请先在角色库中创建。`} />;
  }

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setError(null);
    setSending(true);

    // 1. 追加用户消息
    appendMessage({ role: 'user', content: text });

    // 2. 追加助手占位消息（流式填充）
    const assistantMsg = appendMessage({ role: 'assistant', content: '' });
    if (!assistantMsg) {
      setSending(false);
      setError('消息初始化失败');
      return;
    }

    // 3. 调 AgentOrchestrator 流式调用
    const orch = getAgentOrchestrator();
    const history = (currentConversation?.messages ?? [])
      .filter(m => m.id !== assistantMsg.id && m.role !== 'system')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    // 加载 memory context（M7-002）
    const memoryContext = await getMemoryContext(soul.id, 5);

    try {
      await orch.stream(
        { soul, userInput: text, history, memoryContext: memoryContext || undefined },
        (event) => {
          if (event.type === 'text') {
            appendChunk(assistantMsg.id, event.data);
          } else if (event.type === 'error') {
            setError(event.data.message);
          } else if (event.type === 'done') {
            finalizeMessage();
            // M9-001 TTS：流式结束朗读完整回复
            if (ttsEnabled) {
              const finalText = useChatStore.getState().currentConversation?.messages
                .find(m => m.id === assistantMsg.id)?.content;
              if (finalText) tts.speak(soul, finalText);
            }
          }
        },
      );
    } catch (err: any) {
      // error 已经在 onEvent 中处理；这里只是兜底
      if (err?.message) setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleStop = () => {
    getAgentOrchestrator().cancel();
    finalizeMessage();
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] -mx-4 sm:-mx-6 -my-4 sm:-my-8 bg-slate-950">
      {/* 顶部：角色信息 + Provider 选择 */}
      <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-3 flex items-center gap-4">
        <DiceBearAvatar seed={soul.identity.avatarSeed} size={40} />
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-slate-100 truncate">
            {soul.identity.name || '未命名'}
          </h2>
          <p className="text-xs text-slate-500 truncate">
            {soul.personality.mbti ? `${soul.personality.mbti} · ` : ''}
            {currentModel}
            {memoryCount > 0 && (
              <span className="ml-2 text-emerald-400">🧠 {memoryCount} 条长期记忆</span>
            )}
          </p>
        </div>
        <ProviderSelector
          currentProvider={currentProvider}
          currentModel={currentModel}
          onChangeProvider={setCurrentProvider}
          onChangeModel={setCurrentModel}
        />
        {/* M9-001 TTS 开关 */}
        <button
          type="button"
          onClick={() => {
            if (ttsEnabled) tts.stop();
            setTtsEnabled(!ttsEnabled);
          }}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
          title={ttsEnabled ? '关闭语音朗读' : '开启语音朗读'}
        >
          {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </header>

      {/* 消息区 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {!currentConversation || currentConversation.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-sm">
            开始跟 {soul.identity.name} 对话吧
          </div>
        ) : (
          currentConversation.messages.map((m) => (
            <MessageBubble
              key={m.id}
              role={m.role}
              content={m.content}
              isStreaming={streamingMessageId === m.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 错误提示 */}
      {voice.error && (
        <div className="mx-6 mb-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm text-amber-300">
          <MicOff size={16} />
          <span>{voice.error}</span>
          <button
            type="button"
            onClick={() => voice.reset()}
            className="ml-auto text-xs underline"
          >
            关闭
          </button>
        </div>
      )}

      {/* M16-002 摄像头浮层 */}
      {isCameraOpen && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-100 flex items-center gap-2">
                <Camera size={16} />
                拍照
              </h3>
              <button
                type="button"
                onClick={closeCamera}
                className="p-1 text-slate-400 hover:text-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            {/* 视频预览 */}
            <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden mb-3">
              <video
                ref={videoElementRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            {cameraError && (
              <div className="mb-2 text-xs text-rose-400">{cameraError}</div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={capturePhoto}
                disabled={!camera.stream}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded text-sm transition-colors"
              >
                <Camera size={14} />
                拍照
              </button>
              <button
                type="button"
                onClick={closeCamera}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="mx-6 mb-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-start gap-2 text-sm text-rose-300">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <div>{error}</div>
            {!apiKey && (
              <a href="/settings" className="text-blue-400 hover:underline mt-1 inline-block">
                <SettingsIcon size={12} className="inline mr-1" />
                去设置填 API Key
              </a>
            )}
          </div>
        </div>
      )}

      {/* 输入区 */}
      <footer className="border-t border-slate-800 bg-slate-900/40 px-6 py-4">
        {!apiKey && (
          <div className="mb-2 text-xs text-amber-400">
            ⚠️ 未配置 {currentProvider} API Key。请先到「设置」填入。
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              voice.isListening
                ? '正在聆听...'
                : apiKey
                ? `跟 ${soul.identity.name} 说点什么...（Enter 发送，Shift+Enter 换行）`
                : '请先在设置中填 API Key'
            }
            rows={1}
            disabled={!apiKey || sending || voice.isListening}
            className={`flex-1 bg-slate-950 border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none max-h-32 disabled:opacity-50 ${
              voice.isListening ? 'border-rose-500 animate-pulse' : 'border-slate-700 focus:border-slate-500'
            }`}
          />
          {/* M13-002 语音输入按钮 */}
          {voice.isSupported && (
            <button
              type="button"
              onClick={() => {
                if (voice.isListening) voice.stop();
                else voice.start();
              }}
              disabled={!apiKey || sending}
              className={`flex items-center justify-center p-2.5 rounded-lg transition-colors ${
                voice.isListening
                  ? 'bg-rose-600 text-white hover:bg-rose-500 animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50'
              }`}
              title={voice.isListening ? '停止录音' : '开始语音输入'}
            >
              {voice.isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}

          {/* M16-002 摄像头按钮（拍照） */}
          {camera.isSupported && (
            <button
              type="button"
              onClick={() => (isCameraOpen ? closeCamera() : openCamera())}
              disabled={!apiKey || sending}
              className={`flex items-center justify-center p-2.5 rounded-lg transition-colors ${
                isCameraOpen
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50'
              }`}
              title={isCameraOpen ? '关闭摄像头' : '拍照'}
            >
              {isCameraOpen ? <CameraOff size={16} /> : <Camera size={16} />}
            </button>
          )}
          {sending ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm transition-colors"
            >
              <Square size={14} />
              停止
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!apiKey || !input.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-sm transition-colors"
            >
              <Send size={14} />
              发送
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────── 子组件 ───────────────────────────

function MessageBubble({
  role,
  content,
  isStreaming,
}: {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming: boolean;
}) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-2xl rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-slate-100'
        }`}
      >
        {content || (isStreaming && <span className="text-slate-500">▍</span>)}
        {isStreaming && content && (
          <span className="inline-block w-1 h-3 ml-1 bg-slate-400 animate-pulse" />
        )}
      </div>
    </div>
  );
}

function ProviderSelector({
  currentProvider,
  currentModel,
  onChangeProvider,
  onChangeModel,
}: {
  currentProvider: string;
  currentModel: string;
  onChangeProvider: (p: string, m?: string) => void;
  onChangeModel: (m: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <select
        value={currentProvider}
        onChange={(e) => onChangeProvider(e.target.value)}
        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300"
      >
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
        <option value="deepseek">DeepSeek</option>
      </select>
      <input
        value={currentModel}
        onChange={(e) => onChangeModel(e.target.value)}
        placeholder="模型名"
        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 w-44"
      />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-7rem)] -mx-6 -my-8 text-slate-500">
      {message}
    </div>
  );
}
