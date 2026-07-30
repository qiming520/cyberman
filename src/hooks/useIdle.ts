/**
 * useIdle hook（Sprint #8 · M8-002）
 *
 * 检测用户在页面上的「闲置」状态：
 * - 监听 mousemove / keydown / click / scroll
 * - 超过指定 idleMs（默认 30s）没动 → 返回 true
 * - 任一交互触发 → 重置定时器
 *
 * 用于「主动搭话」功能：闲置 30s 后，角色在 SoulDetailModal 显示搭话提示
 */
import { useEffect, useState } from 'react';

export function useIdle(idleMs: number = 30_000): boolean {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const reset = () => {
      setIsIdle(false);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), idleMs);
    };

    // 初始化 timer
    reset();

    // 监听交互事件
    const events: Array<keyof DocumentEventMap> = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const opts = { passive: true } as AddEventListenerOptions;
    events.forEach(e => document.addEventListener(e, reset, opts));

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(e => document.removeEventListener(e, reset, opts));
    };
  }, [idleMs]);

  return isIdle;
}
