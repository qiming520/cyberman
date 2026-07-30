/**
 * DiceBear 头像组件（M1-005a）
 *
 * PRD §3.2 选型：DiceBear（SVG 头像生成；无需外部图片资源）。
 * 风格固定为「bottts」（可爱机器人头像，符合项目主题）。
 */
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

export interface DiceBearAvatarProps {
  seed: string;
  size?: number;
}

export function DiceBearAvatar({ seed, size = 64 }: DiceBearAvatarProps) {
  const avatar = createAvatar(bottts, {
    seed,
    radius: 50,
  });
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;

  return (
    <img
      src={dataUrl}
      alt={`角色头像`}
      width={size}
      height={size}
      className="rounded-full bg-slate-800"
      style={{ width: size, height: size }}
    />
  );
}