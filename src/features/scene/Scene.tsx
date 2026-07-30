/**
 * 3D 场景（Sprint #4 · 多角色版本）
 *
 * 详解 dev-log.md「Sprint #4 M4-002」
 *
 * 当前实现：
 * - Canvas + 灯光 + 地板 + 相机
 * - 从 useSoulsStore 读所有灵魂，循环渲染（每角色一个 character group）
 * - 角色按创建顺序沿 X 轴分布（-3m 到 +3m，6 个槽位）
 * - 角色颜色根据 identity 哈希派生（确定性但有区分度）
 * - 角色头顶显示名字飘字（用 drei <Text>，自动朝向相机）
 * - 选中角色环形标记（红色 ring，活跃反白）
 *
 * 下个 Sprint：useGLTF 加载真实 GLB 模型
 */
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useSoulsStore } from '@/stores/souls';
import type { SoulConfig } from '@/stores/souls';

// 角色位置布局：6 个槽位，沿 X 轴均布
function getPositionByIndex(index: number): [number, number, number] {
  const slots = [-3, -1.8, -0.6, 0.6, 1.8, 3];
  const x = slots[index % slots.length] ?? 0;
  return [x, 0, 0];
}

// 颜色由 identity.name 哈希派生（紫色色调，避撞性别）
function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const hue = (Math.abs(hash) % 60) + 250;  // 250-310 紫色调
  const sat = 65 + (Math.abs(hash) % 20);  // 65-85%
  const light = 55 + (Math.abs(hash) % 10);  // 55-65%
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

export function Scene() {
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
          color={colorFromName(soul.identity.name)}
          isActive={activeSoulId === soul.id}
          onClick={() => setActiveSoul(soul.id)}
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
  color: string;
  isActive: boolean;
  onClick: () => void;
}

function CharacterGroup({ soul, position, color, isActive, onClick }: CharacterGroupProps) {
  const name = soul.identity.name || '未命名';

  return (
    <group position={position} onClick={onClick}>
      {/* 选中标记：红色环形 */}
      {isActive && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 32]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      )}

      {/* 身体（capsule） */}
      <mesh position={[0, 0.7, 0]} castShadow onClick={onClick}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* 头部（sphere） */}
      <mesh position={[0, 1.45, 0]} castShadow onClick={onClick}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>

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

      {/* 关系标签（名字下） */}
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
    </group>
  );
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
