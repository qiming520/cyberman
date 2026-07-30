/**
 * 积木人组件（Sprint #7 · M7-001 加 4 状态动画）
 *
 * 详见 dev-log.md「Sprint #5」+ 「Sprint #7 M7-001」
 *
 * 4 状态姿态（Sprint #7 新增）：
 * - standing: 站立（默认）
 * - sitting: 坐下（整体下沉 0.35m）
 * - lying: 躺下（旋转 90° 沿 Z 轴，整体下沉 0.35m）
 * - walking: 走动（持续 X 轴小范围 ±0.4m 摆动 + Y 轴 ±0.05m 浮动）
 *
 * 切换用 useFrame 做位置/旋转插值（lerp + 时间因子 dt）。
 */
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { type Group, MathUtils } from 'three';
import { type SoulConfig } from '@/stores/souls';
import { type CharacterState } from '@/stores/characterState';

export interface HumanFigureProps {
  bodyColor: string;
  skinColor?: string;
  height?: number;
  bodyType?: number;
  hairStyle?: 'short' | 'long' | 'bald';
  hairColor?: string;
  state?: CharacterState;
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
  onClick,
}: HumanFigureProps) {
  const groupRef = useRef<Group>(null);
  const heightScale = 1.0 * height;
  const widthScale = 1.0 * bodyType;

  // 状态 → 目标 transform（不含 walking 的相位偏移）
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

  // 状态切换时记录目标（避免 walking 抖动用 useFrame 实时算）
  const targetRef = useRef(getTargetTransform(state));

  useEffect(() => {
    targetRef.current = getTargetTransform(state);
  }, [state]);

  // 每帧：lerp 当前位置/旋转到目标 + walking 摆动
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const t = targetRef.current;
    const k = 1 - Math.exp(-dt * 5);  // 平滑系数（时间无关）
    const g = groupRef.current;

    // 位置插值（Y）
    g.position.y = MathUtils.lerp(g.position.y, t.y, k);

    // 旋转插值（X / Z）
    g.rotation.x = MathUtils.lerp(g.rotation.x, t.rotX, k);
    g.rotation.z = MathUtils.lerp(g.rotation.z, t.rotZ, k);

    // walking 状态叠加相位偏移
    if (state === 'walking') {
      const time = performance.now() / 1000;
      g.position.x = Math.sin(time * 2) * 0.4;  // X 轴 ±0.4m 摆动
      g.position.y = t.y + Math.abs(Math.sin(time * 4)) * 0.05;  // Y 轴小浮动
    } else {
      // 非 walking 状态：X 也归零（防止之前 walking 残留）
      g.position.x = MathUtils.lerp(g.position.x, 0, k);
    }
  });

  return (
    <group ref={groupRef} scale={[widthScale, heightScale, widthScale]} onClick={onClick}>
      {/* 头部 */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* 头发 */}
      {hairStyle === 'short' && (
        <mesh position={[0, 1.55, 0]}>
          <sphereGeometry args={[0.235, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}
      {hairStyle === 'long' && (
        <mesh position={[0, 1.5, -0.02]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}

      {/* 眼睛 */}
      <mesh position={[-0.08, 1.48, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.08, 1.48, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* 嘴 */}
      <mesh position={[0, 1.39, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>

      {/* 身体 */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* 左手 */}
      <group position={[-0.35, 1.0, 0]}>
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.08, 0.3, 6, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[-0.05, -0.6, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        <mesh position={[-0.08, -0.8, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* 右手 */}
      <group position={[0.35, 1.0, 0]}>
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.08, 0.3, 6, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0.05, -0.6, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        <mesh position={[0.08, -0.8, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* 左腿 */}
      <group position={[-0.13, 0.3, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.1, 0.4, 8, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0, -0.55, 0.05]}>
          <boxGeometry args={[0.18, 0.06, 0.28]} />
          <meshStandardMaterial color="#0f172a" />
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
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
}

// 角色身体参数（从 SoulConfig 读；M5-003 捏脸）
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
