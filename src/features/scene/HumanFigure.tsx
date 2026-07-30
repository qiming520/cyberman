/**
 * 积木人组件（Sprint #8 · M8-001 精细化）
 *
 * 详见 dev-log.md「Sprint #5」+ 「Sprint #7 M7-001」+ 「Sprint #8 M8-001」
 *
 * 精细化（Sprint #8 新增）：
 * - 脖子（capsule 连接头与身体）
 * - 头发形状：短发 = 头盖；长发 = 圆球 + 后延伸
 * - 衣袖分层：肩膀（box）+ 上臂（capsule, bodyColor）+ 前臂（capsule, skinColor）
 * - 面部：眼 + 眼睑（浅色覆盖上半部分）+ 嘴（cylinder，emotion 控制大小/颜色）
 * - 脚（box，深灰）
 *
 * 4 姿态（Sprint #7）+ 状态机驱动 transform
 */
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { type Group, MathUtils } from 'three';
import { type SoulConfig } from '@/stores/souls';
import { type CharacterState } from '@/stores/characterState';
import { type Emotion } from '@/stores/emotion';

export interface HumanFigureProps {
  bodyColor: string;
  skinColor?: string;
  height?: number;
  bodyType?: number;
  hairStyle?: 'short' | 'long' | 'bald';
  hairColor?: string;
  state?: CharacterState;
  emotion?: Emotion;  // M7-003 接入
  onClick?: () => void;
}

export function HumanFigure({
  bodyColor,
  skinColor = '#fde68a',
  height = 1.0,
  bodyType = 1.0,
  hairStyle = 'short',
  hairColor = '#1e293b',
  state = 'standing',
  emotion = 'neutral',
  onClick,
}: HumanFigureProps) {
  const groupRef = useRef<Group>(null);
  const heightScale = 1.0 * height;
  const widthScale = 1.0 * bodyType;

  const getTargetTransform = (s: CharacterState) => {
    switch (s) {
      case 'sitting':
        return { y: -0.35, rotX: 0, rotZ: 0 };
      case 'lying':
        return { y: -0.35, rotX: 0, rotZ: Math.PI / 2 };
      case 'walking':
        return { y: 0, rotX: 0, rotZ: 0 };
      case 'standing':
      default:
        return { y: 0, rotX: 0, rotZ: 0 };
    }
  };

  const targetRef = useRef(getTargetTransform(state));

  useEffect(() => {
    targetRef.current = getTargetTransform(state);
  }, [state]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const t = targetRef.current;
    const k = 1 - Math.exp(-dt * 5);
    const g = groupRef.current;
    g.position.y = MathUtils.lerp(g.position.y, t.y, k);
    g.rotation.x = MathUtils.lerp(g.rotation.x, t.rotX, k);
    g.rotation.z = MathUtils.lerp(g.rotation.z, t.rotZ, k);
    if (state === 'walking') {
      const time = performance.now() / 1000;
      g.position.x = Math.sin(time * 2) * 0.4;
      g.position.y = t.y + Math.abs(Math.sin(time * 4)) * 0.05;
    } else {
      g.position.x = MathUtils.lerp(g.position.x, 0, k);
    }
  });

  // 情绪 → 嘴颜色（happy 粉，sad 蓝，angry 红，neutral 默认紫，tender 粉嫩）
  const mouthColor = {
    neutral: '#7c3aed',
    happy: '#ec4899',
    sad: '#3b82f6',
    tender: '#f9a8d4',
    angry: '#ef4444',
  }[emotion];

  return (
    <group ref={groupRef} scale={[widthScale, heightScale, widthScale]} onClick={onClick}>
      {/* 脖子（连接头与身体） */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* 头 */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* 头发（短 = 头盖 / 长 = 圆球 + 后延伸） */}
      {hairStyle === 'short' && (
        <>
          {/* 头顶盖 */}
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.235, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          {/* 刘海（额头前） */}
          <mesh position={[0, 1.55, 0.12]} rotation={[Math.PI / 6, 0, 0]}>
            <boxGeometry args={[0.32, 0.06, 0.08]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          {/* M12-001 鬓角 */}
          <mesh position={[-0.22, 1.45, 0.05]} rotation={[0, 0, -0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.22, 1.45, 0.05]} rotation={[0, 0, 0.3]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </>
      )}
      {hairStyle === 'long' && (
        <>
          {/* 头顶 */}
          <mesh position={[0, 1.5, -0.02]}>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          {/* 背后长发（延伸到肩膀） */}
          <mesh position={[0, 1.0, -0.15]} rotation={[Math.PI / 8, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.05, 0.7, 16]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          {/* 鬓角 */}
          <mesh position={[-0.22, 1.45, 0.05]} rotation={[0, 0, -0.3]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.22, 1.45, 0.05]} rotation={[0, 0, 0.3]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </>
      )}

      {/* M12-001 眉毛 */}
      <mesh position={[-0.08, 1.55, 0.18]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.06, 0.012, 0.012]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.08, 1.55, 0.18]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.06, 0.012, 0.012]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* M12-001 鼻梁（小小三角鼻尖） */}
      <mesh position={[0, 1.42, 0.21]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <coneGeometry args={[0.025, 0.04, 4]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* M12-001 耳朵 */}
      <mesh position={[-0.22, 1.45, 0]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.22, 1.45, 0]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* 眼（黑球） */}
      <mesh position={[-0.08, 1.48, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.08, 1.48, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* 眼睑（白色半圆覆盖上半眼，营造眨眼感） */}
      <mesh position={[-0.08, 1.5, 0.185]}>
        <sphereGeometry args={[0.027, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.08, 1.5, 0.185]}>
        <sphereGeometry args={[0.027, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* 嘴（emotion 决定颜色） */}
      <mesh position={[0, 1.39, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
        <meshStandardMaterial color={mouthColor} />
      </mesh>

      {/* 身体（capsule） */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* 肩膀（左右各 1 个 box，比 capsule 圆滑） */}
      <mesh position={[-0.3, 1.05, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.3, 1.05, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* 左手（上臂 + 前臂 + 手） */}
      <group position={[-0.35, 1.0, 0]}>
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.08, 0.3, 6, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        {/* 肘关节球 */}
        <mesh position={[-0.04, -0.5, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[-0.06, -0.6, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* 手（5 指简化为 1 个椭圆） */}
        <mesh position={[-0.1, -0.82, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* 右手（对称） */}
      <group position={[0.35, 1.0, 0]}>
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.08, 0.3, 6, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0.04, -0.5, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0.06, -0.6, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        <mesh position={[0.1, -0.82, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* 腰带（细节） */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.06, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* M12-002 衣领（V 领） */}
      <mesh position={[0, 1.02, 0.2]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.12, 0.15, 4, 1, true]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 左腿 */}
      <group position={[-0.13, 0.3, 0]}>
        {/* 裤腿 */}
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.1, 0.4, 8, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        {/* M12-002 鞋底（双层：鞋帮 + 鞋底） */}
        <mesh position={[0, -0.55, 0.05]}>
          <boxGeometry args={[0.18, 0.06, 0.28]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, -0.6, 0.05]}>
          <boxGeometry args={[0.2, 0.02, 0.3]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
      </group>

      {/* 右腿 */}
      <group position={[0.13, 0.3, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.1, 0.4, 8, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0, -0.55, 0.05]}>
          <boxGeometry args={[0.18, 0.06, 0.28]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, -0.6, 0.05]}>
          <boxGeometry args={[0.2, 0.02, 0.3]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
      </group>
    </group>
  );
}

// 角色身体参数
export function getHumanParams(soul: SoulConfig) {
  const name = soul.identity.name || '未命名';
  return {
    bodyColor: colorFromName(name),
    skinColor: '#fde68a',
    hairColor: soul.identity.hairColor ?? '#1e293b',
    hairStyle: soul.identity.hairStyle ?? 'short',
    height: soul.body?.height ?? 1.0,
    bodyType: soul.body?.bodyType ?? 1.0,
  };
}

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const hue = (Math.abs(hash) % 60) + 250;
  const sat = 65 + (Math.abs(hash) % 20);
  const light = 55 + (Math.abs(hash) % 10);
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}
