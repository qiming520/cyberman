/**
 * AgentOrchestrator（Sprint #6 · M6-002）
 *
 * 详见 tech-design.md §4.2 / project-design-report.md §4.3
 *
 * 核心：
 * - 接收 SoulConfig + userInput + history
 * - 编译 System Prompt（M1-005b 的 promptCompiler）
 * - 调 Vercel AI SDK streamText（流式）
 * - 触发 onEvent 回调（text / error / done）
 * - BYOK：从 useSettingsStore 读 apiKey + provider + model
 * - cancel() 用 AbortController 中断流
 *
 * 错误类型（友好提示）：
 * - NO_API_KEY：未配置 API Key
 * - AUTH：401 / 403（Key 错误）
 * - RATE_LIMIT：429（限流）
 * - NETWORK：网络/超时
 * - UNKNOWN：其它
 */
import { streamText, type LanguageModelUsage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { compileSystemPrompt, type CompiledPrompt } from '@/features/soul/compiler/promptCompiler';
import { useSettingsStore, type KnownProvider, type Provider } from '@/stores/settings';
import type { SoulConfig } from '@/stores/souls';

// ─────────────────────────── 类型 ───────────────────────────

export interface AgentRequest {
  soul: SoulConfig;
  userInput: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export type AgentStreamEvent =
  | { type: 'text'; data: string }
  | { type: 'done'; data: { usage?: LanguageModelUsage } }
  | { type: 'error'; data: AgentError };

export class AgentError extends Error {
  constructor(
    public code: 'NO_API_KEY' | 'NETWORK' | 'AUTH' | 'RATE_LIMIT' | 'BAD_REQUEST' | 'UNKNOWN',
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

// ─────────────────────────── Orchestrator ───────────────────────────

export class AgentOrchestrator {
  private abortController: AbortController | null = null;

  /**
   * 流式调用 LLM
   * - 抛出 AgentError（NO_API_KEY 等）
   * - 通过 onEvent 推送 text / done / error
   * - cancel() 后 onEvent 推送 done（视为正常停止）
   */
  async stream(req: AgentRequest, onEvent: (e: AgentStreamEvent) => void): Promise<void> {
    const settings = useSettingsStore.getState();
    const provider = settings.currentProvider;
    const modelId = settings.currentModel;
    const apiKey = settings.getApiKey(provider);

    // BYOK 检查
    if (!apiKey) {
      const err = new AgentError(
        'NO_API_KEY',
        `未配置 ${provider} API Key。请在「设置」中填入。`,
      );
      onEvent({ type: 'error', data: err });
      throw err;
    }

    // 编译 Prompt
    const compiled: CompiledPrompt = compileSystemPrompt({ soul: req.soul });
    const model = this.buildModel(provider, apiKey, modelId);
    const messages = this.buildMessages(req);

    // 流式调用
    this.abortController = new AbortController();
    try {
      const result = await streamText({
        model,
        system: compiled.systemPrompt,
        messages,
        abortSignal: this.abortController.signal,
        // 温度略高增加生动性
        temperature: 0.85,
      });

      for await (const chunk of result.textStream) {
        if (chunk) onEvent({ type: 'text', data: chunk });
      }

      onEvent({ type: 'done', data: { usage: await result.usage } });
    } catch (err: any) {
      if (err?.name === 'AbortError' || this.abortController?.signal.aborted) {
        onEvent({ type: 'done', data: {} });
        return;
      }
      const mapped = this.mapError(err, provider);
      onEvent({ type: 'error', data: mapped });
      throw mapped;
    } finally {
      this.abortController = null;
    }
  }

  /** 中断流式调用 */
  cancel(): void {
    this.abortController?.abort();
  }

  // ─────────────────────────── helpers ───────────────────────────

  private buildModel(provider: Provider, apiKey: string, modelId: string) {
    switch (provider as KnownProvider) {
      case 'openai':
        return createOpenAI({ apiKey })(modelId);
      case 'anthropic':
        return createAnthropic({ apiKey })(modelId);
      case 'deepseek':
        return createDeepSeek({ apiKey })(modelId);
      case 'google':
        throw new AgentError('UNKNOWN', 'Google Provider 待 Sprint #7 接入');
      case 'zhipu':
        throw new AgentError('UNKNOWN', '智谱 Provider 包 @ai-sdk/zhipu 不在 npm registry');
      default:
        // 自定义 Provider：当作 OpenAI 兼容
        return createOpenAI({ apiKey, baseURL: provider })(modelId);
    }
  }

  private buildMessages(req: AgentRequest) {
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    for (const h of req.history ?? []) {
      messages.push({ role: h.role, content: h.content });
    }
    messages.push({ role: 'user', content: req.userInput });
    return messages;
  }

  private mapError(err: any, provider: Provider): AgentError {
    const status = err?.statusCode ?? err?.status;
    const msg = err?.message ?? '未知错误';

    if (status === 401 || status === 403) {
      return new AgentError('AUTH', `${provider} API Key 无效或已过期`, err);
    }
    if (status === 429) {
      return new AgentError('RATE_LIMIT', `${provider} 限流，请稍后重试`, err);
    }
    if (status === 400) {
      return new AgentError('BAD_REQUEST', `请求格式错误：${msg}`, err);
    }
    if (err?.name === 'APIConnectionError' || err?.name === 'TimeoutError' || err?.code === 'ENOTFOUND') {
      return new AgentError('NETWORK', `网络错误：${msg}`, err);
    }
    return new AgentError('UNKNOWN', msg, err);
  }
}

// 单例（避免重复创建）
let _orchestrator: AgentOrchestrator | null = null;
export function getAgentOrchestrator(): AgentOrchestrator {
  if (!_orchestrator) _orchestrator = new AgentOrchestrator();
  return _orchestrator;
}
