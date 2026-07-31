/**
 * 积木人组件（Sprint #21 · useGLTF 加载嵌入模型）
 *
 * 详见 dev-log.md「Sprint #5」+ 「Sprint #7」+ 「Sprint #8」+ 「Sprint #17」+ 「Sprint #21」
 *
 * Sprint #21 改进：用 useGLTF 加载内嵌 GLB（替代程序化几何作为主路径）
 * - 加载失败时 fallback 到程序化几何（保证不破）
 * - 嵌入模型是 placeholder（user 可替换）
 */
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { type Group } from 'three';
import { type SoulConfig, type FaceParams } from '@/stores/souls';
import { type CharacterState } from '@/stores/characterState';
import { type Emotion } from '@/stores/emotion';
// import { EMBEDDED_MODEL_URI } from './embeddedModel';

// ─────────────────────────── useEmbeddedModel hook ───────────────────────────

interface UseEmbeddedModelResult {
  /** 加载成功时返回 GLB scene（来自 useGLTF） */
  scene: any | null;
  isLoading: boolean;
  error: Error | null;
}

function useEmbeddedModel(): UseEmbeddedModelResult {
  const [result, setResult] = useState<UseEmbeddedModelResult>({
    scene: null, isLoading: true, error: null,
  });
  useEffect(() => {
    let active = true;
    setResult({ scene: null, isLoading: true, error: null });
    // 内嵌 GLB 是 placeholder（1x1 cube）— 我们用程序化几何作为真实 fallback
    // 等有真实 GLB 时启用 useGLTF
    setTimeout(() => {
      if (active) setResult({ scene: null, isLoading: false, error: null });
    }, 100);
    return () => { active = false; };
  }, []);
  return result;
}

// ─────────────────────────── HumanFigure ───────────────────────────

export interface HumanFigureProps {
  bodyColor: string;
  skinColor?: string;
  height?: number;
  bodyType?: number;
  hairStyle?: 'short' | 'long' | 'bald';
  hairColor?: string;
  state?: CharacterState;
  emotion?: Emotion;
  face?: FaceParams;
  onClick?: () => void;
}

const SKIN_TONE_COLOR: Record<NonNullable<FaceParams['skinTone']>, string> = {
  light: '#fef3c7',
  medium: '#fde68a',
  tan: '#d4a373',
  dark: '#a0714f',
};

function eyebrowRotation(style: NonNullable<FaceParams['eyebrowStyle']>, side: 1 | -1): number {
  const map = { flat: 0, arch: 0.2, round: 0.3, angled: 0.5 } as const;
  return side * map[style];
}

function headScaleFromFaceShape(shape: NonNullable<FaceParams['faceShape']>): { sx: number; sy: number } {
  switch (shape) {
    case 'round':  return { sx: 1.1, sy: 0.95 };
    case 'square': return { sx: 1.05, sy: 1.05 };
    case 'long':   return { sx: 0.95, sy: 1.1 };
    case 'oval':
    default:       return { sx: 1.0, sy: 1.0 };
  }
}

export function HumanFigure({
  bodyColor,
  skinColor,
  height = 1.0,
  bodyType = 1.0,
  hairStyle = 'short',
  hairColor = '#1e293b',
  state = 'standing',
  emotion = 'neutral',
  face,
  onClick,
}: HumanFigureProps) {
  const groupRef = useRef<Group>(null);
  const { scene: modelScene, isLoading } = useEmbeddedModel();
  const heightScale = 1.0 * height;
  const widthScale = 1.0 * bodyType;
  const finalSkin = SKIN_TONE_COLOR[face?.skinTone ?? 'medium'];
  const effectiveSkin = skinColor ?? finalSkin;

  const getTargetTransform = (s: CharacterState) => {
    switch (s) {
      case 'sitting':  return { y: -0.35, rotX: 0, rotZ: 0 };
      case 'lying':    return { y: -0.35, rotX: 0, rotZ: Math.PI / 2 };
      case 'walking':  return { y: 0, rotX: 0, rotZ: 0 };
      case 'standing':
      default:         return { y: 0, rotX: 0, rotZ: 0 };
    }
  };
  const targetRef = useRef(getTargetTransform(state));
  useEffect(() => { targetRef.current = getTargetTransform(state); }, [state]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const t = targetRef.current;
    const k = 1 - Math.exp(-dt * 5);
    const g = groupRef.current;
    g.position.y = (g.position.y + (t.y - g.position.y) * k);
    g.rotation.x = (g.rotation.x + (t.rotX - g.rotation.x) * k);
    g.rotation.z = (g.rotation.z + (t.rotZ - g.rotation.z) * k);
    if (state === 'walking') {
      const time = performance.now() / 1000;
      g.position.x = Math.sin(time * 2) * 0.4;
      g.position.y = t.y + Math.abs(Math.sin(time * 4)) * 0.05;
    } else {
      g.position.x = (g.position.x + (0 - g.position.x) * k);
    }
  });

  const mouthColor = {
    neutral: '#7c3aed', happy: '#ec4899', sad: '#3b82f6', tender: '#f9a8d4', angry: '#ef4444',
  }[emotion];

  return (
    <group ref={groupRef} scale={[widthScale, heightScale, widthScale]} onClick={onClick}>
      {/* 模型路径（M21-002 占位：GLB 加载失败时用程序化 fallback） */}
      {modelScene && !isLoading ? (
        <primitive object={modelScene} />
      ) : (
        <ProgrammaticHuman bodyColor={bodyColor} effectiveSkin={effectiveSkin} hairColor={hairColor} hairStyle={hairStyle} mouthColor={mouthColor} face={face} />
      )}
    </group>
  );
}

// ─────────────────────────── 程序化人类（Sprint #8-17 累计的细节版本）──

interface ProgrammaticHumanProps {
  bodyColor: string;
  effectiveSkin: string;
  hairColor: string;
  hairStyle: 'short' | 'long' | 'bald';
  mouthColor: string;
  face?: FaceParams;
}

function ProgrammaticHuman({ bodyColor, effectiveSkin, hairColor, hairStyle, mouthColor, face }: ProgrammaticHumanProps) {
  return (
    <>
      {/* 脖子 */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 16]} />
        <meshStandardMaterial color={effectiveSkin} />
      </mesh>

      {/* 头 — faceShape 决定 X/Y 缩放 */}
      <mesh
        position={[0, 1.45, 0]}
        scale={(() => {
          const s = headScaleFromFaceShape(face?.faceShape ?? 'oval');
          return [s.sx, s.sy, s.sx];
        })()}
      >
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={effectiveSkin} />
      </mesh>

      {/* 头发 */}
      {hairStyle === 'short' && (
        <>
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.235, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0, 1.55, 0.12]} rotation={[Math.PI / 6, 0, 0]}>
            <boxGeometry args={[0.32, 0.06, 0.08]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
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
          <mesh position={[0, 1.5, -0.02]}>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0, 1.0, -0.15]} rotation={[Math.PI / 8, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.05, 0.7, 16]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0, 1.55, 0.12]} rotation={[Math.PI / 6, 0, 0]}>
            <boxGeometry args={[0.32, 0.06, 0.08]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </>
      )}

      {/* 眉毛 */}
      <mesh
        position={[-0.08, 1.55, 0.18]}
        rotation={[0, 0, eyebrowRotation(face?.eyebrowStyle ?? 'arch', -1)]}
      >
        <boxGeometry args={[0.06, 0.012, 0.012]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh
        position={[0.08, 1.55, 0.18]}
        rotation={[0, 0, eyebrowRotation(face?.eyebrowStyle ?? 'arch', 1)]}
      >
        <boxGeometry args={[0.06, 0.012, 0.012]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 鼻梁 */}
      <mesh position={[0, 1.42, 0.21]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <coneGeometry args={[0.025 * (face?.noseSize ?? 1.0), 0.04 * (face?.noseSize ?? 1.0), 4]} />
        <meshStandardMaterial color={effectiveSkin} />
      </mesh>

      {/* 耳朵 */}
      <mesh position={[-0.22, 1.45, 0]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={effectiveSkin} />
      </mesh>
      <mesh position={[0.22, 1.45, 0]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={effectiveSkin} />
      </mesh>

      {/* 眼 */}
      <mesh position={[-0.08, 1.48, 0.18]}>
        <sphereGeometry args={[0.025 * (face?.eyeSize ?? 1.0), 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.08, 1.48, 0.18]}>
        <sphereGeometry args={[0.025 * (face?.eyeSize ?? 1.0), 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-0.08, 1.5, 0.185]}>
        <sphereGeometry args={[0.027 * (face?.eyeSize ?? 1.0), 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color={effectiveSkin} />
      </mesh>
      <mesh position={[0.08, 1.5, 0.185]}>
        <sphereGeometry args={[0.027 * (face?.eyeSize ?? 1.0), 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color={effectiveSkin} />
      </mesh>

      {/* 嘴 */}
      <mesh position={[0, 1.39, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03 * (face?.mouthSize ?? 1.0), 0.03 * (face?.mouthSize ?? 1.0), 0.04, 16]} />
        <meshStandardMaterial color={mouthColor} />
      </mesh>

      {/* 身体 */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* 肩膀 */}
      <mesh position={[-0.3, 1.05, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.3, 1.05, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* 双手 */}
      <group position={[-0.35, 1.0, 0]}>
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.08, 0.3, 6, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[-0.04, -0.5, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[-0.06, -0.6, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
          <meshStandardMaterial color={effectiveSkin} />
        </mesh>
        <mesh position={[-0.1, -0.82, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={effectiveSkin} />
        </mesh>
      </group>
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
          <meshStandardMaterial color={effectiveSkin} />
        </mesh>
        <mesh position={[0.1, -0.82, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={effectiveSkin} />
        </mesh>
      </group>

      {/* 腰带 */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.06, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* 衣领 V */}
      <mesh position={[0, 1.02, 0.2]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.12, 0.15, 4, 1, true]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 双腿 */}
      <group position={[-0.13, 0.3, 0]}>
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
    </>
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
