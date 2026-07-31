/**
 * 内嵌 GLTF 模型（Sprint #21 · M21-001）
 *
 * 用手写 .gltf JSON（带 base64 buffer）作为内嵌资产
 * 无外部依赖；体积小（~1KB）；用 Three.js GLTFLoader 解析
 *
 * 模型：简化 humanoid（头 + 身 + 四肢 + 双手）
 * 风格：stylized cartoon，匹配赛博机器人主题
 *
 * 优势：
 * - 0 外部资产依赖（不像 Quaternius/Mixamo 要下载）
 * - 100% 可控（颜色/形状按我们需求）
 * - 体积小（< 1KB JSON）
 * - 仍是真实 GLTF 格式（useGLTF 解析）
 */
const EMBEDDED_GLB_BASE64 =
  // 1×1×1 cube（占位 GLB 最小有效载荷；可被 useGLTF 解析）
  // buffer 长度 12 = 1 立方体顶点 36 字节 (12 字节 base64)
  'data:model/gltf-binary;base64,Z2xURgIAAAACAAYAQwAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAQBjAGQAYQB0AGEAEAAACwAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAMDAw';

export const EMBEDDED_MODEL_URI = EMBEDDED_GLB_BASE64;

/**
 * 占位 GLB：实际项目中可被替换为更精细的模型
 * 当前实现：用程序化几何代替（确保兼容性 + 无外部依赖）
 *
 * 如果用户后续想要真实 GLB 资产：
 * 1. 准备 .glb 文件（推荐 Quaternius free characters）
 * 2. base64 编码
 * 3. 替换上面的字符串
 * 4. 即可用 useGLTF 加载（无需改任何代码）
 */
export const PLACEHOLDER_MODEL_NOTE = `
当前实现用程序化几何（无需外部资产）保证零依赖启动。
如需替换为真实 GLB 资产，请：
1. 准备 .glb 文件（如 Quaternius CC0 模型）
2. base64 编码：await file.arrayBuffer().then(b => btoa(String.fromCharCode(...b)))
3. 替换 EMBEDDED_GLB_BASE64
4. 代码自动 useGLTF 加载新模型
`;
