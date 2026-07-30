/**
 * 3D 场景（Sprint #3 · M2-MVP）
 *
 * 最小可验证版本：Canvas + 灯光 + 地板 + 1 个占位角色（几何体）。
 * 后续 Sprint：接 GLB 模型 + 角色动画 + 智能调度。
 *
 * 已知问题（Sprint #3 排查中）：
 * - R3F + headless chromium 在 page load 时报 "Cannot read properties of undefined (reading 'S')"
 * - 暂时只渲染最简 Canvas，OrbitControls/ContactShadows 留 M2 完整阶段加
 */
import { Canvas } from '@react-three/fiber';

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />

      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 占位角色（在场景中央，1.6m 高） */}
      <CharacterPlaceholder position={[0, 0, 0]} />
    </Canvas>
  );
}

function CharacterPlaceholder({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 身体 */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
      {/* 头部 */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
    </group>
  );
}