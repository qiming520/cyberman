/**
 * 积木人组件（Sprint #5 · M5-001）
 *
 * 用 procedural 几何体组合出一个"积木人"（胶囊身体 + 球头 + 圆柱四肢 + 简单五官）。
 * 比 pure capsule+sphere 更"像人"，不依赖 GLB 资产。
 *
 * 约定（向上）：
 * - y=0 是地面
 * - 整体高度（含头）= 1.7m（参数化缩放）
 *
 * 后续（M5-003 捏脸参数）：
 * - props: height / bodyType / bodyColor / hairStyle / hairColor / skinColor
 */
import { type SoulConfig } from '@/stores/souls';

export interface HumanFigureProps {
  bodyColor: string;
  skinColor?: string;
  height?: number;       // 0.8 - 1.2（默认 1.0）
  bodyType?: number;     // 0.7 - 1.3（默认 1.0，胖瘦）
  hairStyle?: 'short' | 'long' | 'bald';  // 默认 'short'
  hairColor?: string;
  onClick?: () => void;
}

export function HumanFigure({
  bodyColor,
  skinColor = '#fde68a',
  height = 1.0,
  bodyType = 1.0,
  hairStyle = 'short',
  hairColor = '#1e293b',
  onClick,
}: HumanFigureProps) {
  // 整体缩放：基于 height 和 bodyType
  // 身高 = 1.7m * heightScale（默认 1.0）
  const heightScale = 1.0 * height;
  // 体型宽度缩放：bodyType 影响身体宽度（不改变高度）
  const widthScale = 1.0 * bodyType;

  return (
    <group scale={[widthScale, heightScale, widthScale]} onClick={onClick}>
      {/* 头部（球）*/}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* 头发（短 / 长 / 秃）*/}
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

      {/* 眼睛（两个小球）*/}
      <mesh position={[-0.08, 1.48, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.08, 1.48, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* 嘴（扁圆柱）*/}
      <mesh position={[0, 1.39, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>

      {/* 身体（capsule） */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* 左手（上臂 + 前臂）*/}
      <group position={[-0.35, 1.0, 0]}>
        {/* 上臂 */}
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.08, 0.3, 6, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        {/* 前臂 */}
        <mesh position={[-0.05, -0.6, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* 手（小球）*/}
        <mesh position={[-0.08, -0.8, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* 右手（对称）*/}
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
        {/* 脚（小 box）*/}
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
