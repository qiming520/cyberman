/**
 * 3D 场景（Sprint #5 · 积木人版本）
 *
 * 详解 dev-log.md「Sprint #4 M4-002」+ 「Sprint #5 M5-001」
 *
 * 当前实现：
 * - Canvas + 灯光 + 地板 + 相机
 * - 从 useSoulsStore 读所有灵魂，循环渲染（每角色一个 character group）
 * - 角色用 HumanFigure 积木人组件（头 + 身 + 双臂 + 双腿 + 简单五官）
 * - 6 槽位 X 轴布局 + 名字飘字 + 关系标签 + 选中环
 * - 选中角色点击 → onClick 回调（ScenePage 接 → 弹详情 Modal）
 *
 * 下个 Sprint（M5-003）：捏脸参数化（身高/体型/颜色/发型 4 个参数可调）
 */
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useSoulsStore } from '@/stores/souls';
import { useCharacterStateStore } from '@/stores/characterState';
import { HumanFigure, getHumanParams } from './HumanFigure';
import type { SoulConfig } from '@/stores/souls';

// 角色位置布局：6 个槽位，沿 X 轴均布
function getPositionByIndex(index: number): [number, number, number] {
  const slots = [-3, -1.8, -0.6, 0.6, 1.8, 3];
  const x = slots[index % slots.length] ?? 0;
  return [x, 0, 0];
}

interface SceneProps {
  /** 角色点击回调（外部 ScenePage 注入 → 打开详情 Modal） */
  onCharacterClick?: (soulId: string) => void;
}

export function Scene({ onCharacterClick }: SceneProps = {}) {
  const souls = useSoulsStore((s) => s.souls);
  const activeSoulId = useSoulsStore((s) => s.activeSoulId);
  const setActiveSoul = useSoulsStore((s) => s.setActiveSoul);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.5, 6], fov: 50 }}
      style={{ width: '100%', height: '100%', background: '#0f172a' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <hemisphereLight args={['#a3b8ff', '#4a3b6e', 0.4]} />

      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 网格地板（辅助感） */}
      <gridHelper args={[20, 20, '#334155', '#1e293b']} position={[0, 0.001, 0]} />

      {/* 角色们 */}
      {souls.map((soul, i) => (
        <CharacterGroup
          key={soul.id}
          soul={soul}
          position={getPositionByIndex(i)}
          isActive={activeSoulId === soul.id}
          onClick={() => {
            setActiveSoul(soul.id);
            onCharacterClick?.(soul.id);
          }}
        />
      ))}

      {/* 视角控制 */}
      <OrbitControls
        enablePan
        enableZoom
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[0, 1, 0]}
      />
    </Canvas>
  );
}

// ─────────────────────────── 单角色 ───────────────────────────

interface CharacterGroupProps {
  soul: SoulConfig;
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}

function CharacterGroup({ soul, position, isActive, onClick }: CharacterGroupProps) {
  const name = soul.identity.name || '未命名';
  const params = getHumanParams(soul);
  const state = useCharacterStateStore((s) => s.getState(soul.id));

  return (
    <group position={position} onClick={onClick}>
      {/* 选中标记：红色环形 */}
      {isActive && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 32]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      )}

      {/* 积木人（带 4 状态动画） */}
      <HumanFigure
        bodyColor={params.bodyColor}
        skinColor={params.skinColor}
        hairColor={params.hairColor}
        hairStyle={params.hairStyle}
        height={params.height}
        bodyType={params.bodyType}
        state={state}
        onClick={onClick}
      />

      {/* 头顶名字飘字 */}
      <Text
        position={[0, 1.95, 0]}
        fontSize={0.18}
        color="#f1f5f9"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0f172a"
      >
        {name}
      </Text>

      {/* 关系标签 */}
      <Text
        position={[0, 1.75, 0]}
        fontSize={0.1}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#0f172a"
      >
        {relationshipLabel(soul.relationship.type)}
      </Text>

      {/* 状态标签（M7-001） */}
      <Text
        position={[0, 2.15, 0]}
        fontSize={0.08}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#0f172a"
      >
        [{stateLabel(state)}]
      </Text>
    </group>
  );
}

function stateLabel(state: string): string {
  return { standing: '站立', sitting: '坐下', lying: '躺下', walking: '走动' }[state] ?? state;
}

function relationshipLabel(type: string): string {
  const map: Record<string, string> = {
    girlfriend: '女友',
    boyfriend: '男友',
    friend: '朋友',
    pet: '宠物',
    mentor: '导师',
    sibling: '兄妹',
    custom: '自定义',
  };
  return map[type] ?? '其他';
}
