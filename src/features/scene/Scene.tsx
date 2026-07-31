/**
 * 3D 场景（Sprint #18 · 多区域版本）
 *
 * 详解 dev-log.md「Sprint #7 M7-001」+ 「Sprint #8 M8-001」+ 「Sprint #18 M18-001」
 *
 * 多区域（Sprint #18）：
 * - 3 个区域（客厅/咖啡馆/公园）有不同颜色地板 + 装饰
 * - 角色按 soulConfig.relationship 自动分配区域
 * - 区域内多角色随机站位（不重叠）
 *
 * 4 状态姿态 + 5 情绪头顶 emoji + 选中环
 */
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useSoulsStore } from '@/stores/souls';
import { useCharacterStateStore } from '@/stores/characterState';
import { useEmotionStore, EMOTION_EMOJI } from '@/stores/emotion';
import { HumanFigure, getHumanParams } from './HumanFigure';
import { ZONES, assignZoneForRelationship, type ZoneType } from './zones';
import type { SoulConfig } from '@/stores/souls';

interface SceneProps {
  onCharacterClick?: (soulId: string) => void;
}

/** 按 zone 内的角色索引（zone 内多角色站位） */
function getPositionInZone(zone: ZoneType, indexInZone: number): [number, number, number] {
  const config = ZONES[zone];
  const totalSlots = 4;  // 每区最多 4 个角色
  const slot = indexInZone % totalSlots;
  // 在 zone 中心 + 小范围偏移
  const offsetX = ((slot % 2) - 0.5) * 1.2;
  const offsetZ = (Math.floor(slot / 2) - 0.5) * 1.2;
  return [config.center[0] + offsetX, 0, config.center[1] + offsetZ];
}

export function Scene({ onCharacterClick }: SceneProps = {}) {
  const souls = useSoulsStore((s) => s.souls);
  const activeSoulId = useSoulsStore((s) => s.activeSoulId);
  const setActiveSoul = useSoulsStore((s) => s.setActiveSoul);

  // 按 zone 分组角色
  const soulsByZone = souls.reduce<Record<ZoneType, SoulConfig[]>>(
    (acc, soul) => {
      const zone = assignZoneForRelationship(soul.relationship.type);
      acc[zone].push(soul);
      return acc;
    },
    { living: [], cafe: [], park: [] },
  );

  // 渲染角色（每区多角色）
  const renderSouls = (zone: ZoneType) =>
    soulsByZone[zone].map((soul, i) => (
      <CharacterGroup
        key={soul.id}
        soul={soul}
        position={getPositionInZone(zone, i)}
        isActive={activeSoulId === soul.id}
        onClick={() => {
          setActiveSoul(soul.id);
          onCharacterClick?.(soul.id);
        }}
      />
    ));

  return (
    <Canvas
      shadows
      camera={{ position: [0, 3, 7], fov: 50 }}
      style={{ width: '100%', height: '100%', background: '#0f172a' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <hemisphereLight args={['#a3b8ff', '#4a3b6e', 0.4]} />

      {/* 整体地板（深色背景） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* 网格地板（辅助感） */}
      <gridHelper args={[20, 20, '#334155', '#1e293b']} position={[0, 0.001, 0]} />

      {/* 3 区域地板（不同颜色区分） */}
      {(Object.keys(ZONES) as ZoneType[]).map((zone) => {
        const c = ZONES[zone];
        return (
          <group key={zone}>
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[c.center[0], 0.005, c.center[1]]}
              receiveShadow
            >
              <circleGeometry args={[c.radius, 32]} />
              <meshStandardMaterial color={c.floorColor} transparent opacity={0.6} />
            </mesh>
            {/* 区域标签（头顶 emoji） */}
            <Text
              position={[c.center[0], 3.2, c.center[1]]}
              fontSize={0.5}
              color={c.accent}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#0f172a"
            >
              {c.emoji} {c.name}
            </Text>
          </group>
        );
      })}

      {/* 角色们（按 zone 分布） */}
      {renderSouls('living')}
      {renderSouls('cafe')}
      {renderSouls('park')}

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
  const emotion = useEmotionStore((s) => s.getEmotion(soul.id));

  // 走动时小幅摆动（受 M18-002 简化）
  const time = performance.now() / 1000;
  const walkOffset = state === 'walking'
    ? [Math.sin(time * 0.8) * 0.3, 0, Math.cos(time * 0.6) * 0.2]
    : [0, 0, 0];

  return (
    <group position={[
      position[0] + walkOffset[0],
      position[1] + walkOffset[1],
      position[2] + walkOffset[2],
    ]} onClick={onClick}>
      {/* 选中标记：红色环形 */}
      {isActive && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 32]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      )}

      {/* 积木人（带 4 状态 + 8 捏脸 + 5 情绪） */}
      <HumanFigure
        bodyColor={params.bodyColor}
        skinColor={params.skinColor}
        hairColor={params.hairColor}
        hairStyle={params.hairStyle}
        height={params.height}
        bodyType={params.bodyType}
        state={state}
        emotion={emotion}
        face={soul.face}
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

      {/* 状态标签 */}
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

      {/* 情绪 emoji */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.35}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#0f172a"
      >
        {EMOTION_EMOJI[emotion]}
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
