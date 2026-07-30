/**
 * 长期记忆 summarizer（Sprint #7 · M7-002）
 *
 * 详见 tech-design.md §4.3
 *
 * 功能：把 N 轮对话浓缩成 1-3 条「事实摘要」存入 IDB。
 *
 * 触发：ChatPage 启动时检测上次会话有 >= 5 条消息 → 自动 summarizer
 * 输出：memoryRepo.add(...) 1-3 条
 * 检索：ChatPage 启动时取最近 5 条注入 system prompt
 *
 * 简化：本次会话结束（页面卸载 / 切换角色）不立即 summarizer；
 * 而是下次会话开始时发现上次消息 >= 5 条就 summarizer。
 */
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { memoryRepo, type Memory } from './memoryRepo';
import { useSettingsStore } from '@/stores/settings';
import type { SoulConfig } from '@/stores/souls';

const SUMMARY_PROMPT = `你是一个记忆整理助手。请根据以下对话，提取值得长期记忆的事实。
规则：
- 用户明确表达的个人偏好、习惯、重要信息
- 用户的家庭、工作、情感状态
- 重要事件、计划、承诺
- 角色与用户互动的关键时刻

输出 JSON 数组（不要 Markdown 代码块）：
[{ "text": "自然语言事实", "importance": 0.7 }]

importance 0.9-1.0 = 核心个人信息
importance 0.6-0.8 = 一般偏好/日常
importance 0-0.5 = 可忽略

最多 3 条。只输出用户角度的事实（关于用户或用户经历）。`;

/** 触发 summarizer：上次会话消息 >= 5 条时调用 */
export async function maybeSummarize(
  soul: SoulConfig,
  recentMessages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>,
): Promise<Memory[]> {
  if (recentMessages.length < 5) return [];

  const settings = useSettingsStore.getState();
  const apiKey = settings.getApiKey(settings.currentProvider);
  if (!apiKey) return [];  // BYOK 缺失时跳过

  // 构造 messages 文本
  const conversationText = recentMessages
    .map(m => `${m.role === 'user' ? '用户' : '角色'}：${m.content}`)
    .join('\n');

  try {
    // 简单用 OpenAI 兼容（其它 provider 后续可加）
    if (settings.currentProvider !== 'openai' && settings.currentProvider !== 'deepseek') {
      // 暂只支持 OpenAI 兼容
      return [];
    }
    const openai = createOpenAI({ apiKey });
    const result = await generateText({
      model: openai(settings.currentModel),
      system: SUMMARY_PROMPT,
      prompt: conversationText,
      temperature: 0.3,
    });

    // 解析 JSON
    const text = result.text.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    // 存入 IDB
    const saved: Memory[] = [];
    for (const item of parsed.slice(0, 3)) {
      if (typeof item?.text !== 'string' || item.text.length === 0) continue;
      const memory = await memoryRepo.add({
        soulId: soul.id,
        summary: item.text,
        sourceMessageIds: recentMessages.map(m => m.id),
      });
      saved.push(memory);
    }
    return saved;
  } catch (err) {
    console.warn('[summarizer] 失败:', err);
    return [];
  }
}

/** 取 memory 摘要文本（注入 system prompt 用） */
export async function getMemoryContext(soulId: string, limit = 5): Promise<string> {
  const memories = await memoryRepo.getRecent(soulId, limit);
  if (memories.length === 0) return '';
  return memories
    .map((m, i) => `${i + 1}. ${m.summary}`)
    .join('\n');
}
