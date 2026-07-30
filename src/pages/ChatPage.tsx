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
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSoulsStore } from '@/stores/souls';
import { useChatStore } from '@/stores/chat';
import { useSettingsStore } from '@/stores/settings';
import { DiceBearAvatar } from '@/features/soul/editor/DiceBearAvatar';
import { getAgentOrchestrator } from '@/features/agent/orchestrator';
import { Send, Square, Settings as SettingsIcon, AlertCircle } from 'lucide-react';

export function ChatPage() {
  const [searchParams] = useSearchParams();
  const soulId = searchParams.get('soulId');

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // soulId 变化时启动新会话
  useEffect(() => {
    if (soul && (!currentConversation || currentConversation.soulId !== soul.id)) {
      startConversation(soul.id);
    }
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

    try {
      await orch.stream(
        { soul, userInput: text, history },
        (event) => {
          if (event.type === 'text') {
            appendChunk(assistantMsg.id, event.data);
          } else if (event.type === 'error') {
            setError(event.data.message);
          } else if (event.type === 'done') {
            finalizeMessage();
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
    <div className="flex flex-col h-[calc(100vh-7rem)] -mx-6 -my-8 bg-slate-950">
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
          </p>
        </div>
        <ProviderSelector
          currentProvider={currentProvider}
          currentModel={currentModel}
          onChangeProvider={setCurrentProvider}
          onChangeModel={setCurrentModel}
        />
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
            placeholder={apiKey ? `跟 ${soul.identity.name} 说点什么...（Enter 发送，Shift+Enter 换行）` : '请先在设置中填 API Key'}
            rows={1}
            disabled={!apiKey || sending}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500 resize-none max-h-32 disabled:opacity-50"
          />
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
        className={`max-w-2xl rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
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
