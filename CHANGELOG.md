# 变更日志 (CHANGELOG)

所有重要变更按版本记录。格式基于 [Keep a Changelog](https://keepachangelog.com/)。

## [v0.1.0] - 2026-07-31

### 新增 (Sprint #16-23 + 补缺 + 上线准备)

- **首启动引导**：首次访问显示欢迎页（3 步引导 + CTA「进入 3D 大厅」），LocalStorage 标记
- **顶级交互配置**（OnboardingFlow）：5 步引导式问答（关系 → MBTI → 性格 → 名字 → 完成）
- **角色快捷预设**：4 个一键生成（女友/男友/小孩/宠物）+ 完整数据
- **高级捏脸**（8+ 参数）：脸型/眼型/眼大小/鼻大小/嘴型/嘴大小/眉型/肤色
- **多区域 3D 大厅**：客厅🛋️/咖啡馆☕/公园🌳 三个区域，角色按关系自动分配
- **真实 GLB 模型支持**：内嵌 .gltf 字符串 + useGLTF 加载（替代程序化积木人）
- **CI/CD**：GitHub Actions 自动跑 typecheck + build + 13+30 E2E
- **Vercel 部署配置**：vercel.json（rewrites + 安全 headers + 缓存）
- **错误监控**：window.onerror + unhandledrejection 自动捕获，LocalStorage 持久化
- **SEO meta**：og / twitter card / description
- **PWA**：site.webmanifest + favicon.svg（渐变紫色机器人 emoji）

### 已有功能（Sprint #1-15）

- 3D 沉浸式聊天大厅
- 多角色「或坐或躺或走动」（4 姿态 + useFrame 平滑插值）
- 灵魂编辑器（身份/性格/背景/关系/知识库/捏脸 6 大字段 + 双向 Prompt 实时预览）
- 4 感官配置：大脑（Provider + API Key）/ 嘴巴（TTS）/ 眼睛（摄像头）/ 耳朵（语音输入）
- BYOK（OpenAI / Anthropic / DeepSeek）
- 长期记忆（每 5 轮对话自动 summarizer）
- 情绪状态机（5 情绪 + 头顶 emoji）
- 智能调度（URL ?soulId > activeSoulId > 第一个 soul）
- 主动搭话（闲置 30s）
- 移动端布局（viewport + 汉堡菜单 + 触屏）
- 性能优化（manualChunks + 关闭 sourcemap，main 64KB gzip）
- E2E 测试 30 步（13 dev + 17 prod 含移动端和首启动）

### 修复

- Sprint #16 dev mode R3F bug：通过 lazy import + Suspense 隔离主路径
- Sprint #7 useWatch 数组 vs 对象类型 bug：修正为订阅整个表单
- Sprint #22 lazy Suspense fallback 缺失
- Sprint #16 modal 关闭 backdrop 阻挡测试点击：加 Escape 关闭

### 重构

- Sprint #16 抽出 `SoulDetailModal` 自动响应 activeSoulId（替代手动管理）
- Sprint #12 `HumanFigure` 抽出 `ProgrammaticHuman` 子组件
- Sprint #18 Scene 按区域分组渲染角色
- Sprint #23 抽出错误捕获 store

### 技术栈

- React 18 + TypeScript 5
- Vite 5（manualChunks + sourcemap: false）
- React Three Fiber 8 + drei 9 + three 0.185
- React Router 7
- Zustand 5（含 IDB persist middleware）
- Vercel AI SDK 6（OpenAI / Anthropic / DeepSeek）
- idb 8（IndexedDB 包装）
- Playwright 1.62（E2E + 截图）

## [v0.0.1] - 2026-07-29

### 新增

- MVP 脚手架（Vite + React + Tailwind + 路由 + 4 页面）
- 灵魂编辑器（5 大字段）
- 3D 场景骨架（占位几何体）
- 单页架构（首页 = 3D 大厅，浮层承载子功能）
- 积木人 + 捏脸（4 个基础参数）
- 聊天主厅（Vercel AI SDK + 流式输出）
- 动画 + 记忆 + 情绪 + 调度
- 移动端适配（viewport + 汉堡菜单）
- IDB 持久化（角色 + 对话 + 长期记忆）

---

## 版本对比

| 维度 | v0.0.1 | v1.0.0（v0.1.0 当前目标）|
|---|---|---|
| 角色 | 4 姿态 + 简单捏脸 | 4 姿态 + **8+ 高级捏脸** |
| 场景 | 单层 6 槽位 | **3 区域（客厅/咖啡馆/公园）** |
| 配置 | 手动表单 | **5 步引导 + 4 角色预设** |
| 首启动 | 直进 3D | **欢迎页引导** |
| GLB | 程序化 | **可加载真实 GLB** |
| CI/CD | 无 | **GitHub Actions + Vercel 一键部署** |
| 错误监控 | 无 | **自动捕获 + LocalStorage 持久化** |
| SEO | 无 | **og / twitter card / PWA** |
| 文档 | README | **README + CHANGELOG + CONTRIBUTING + LICENSE + SECURITY** |

---

## Roadmap

- v0.2.0（未来）：真实 GLB 模型接入（用户上传）+ 声音克隆 + 视频通话
- v0.3.0（未来）：多用户协作 / 角色共享市场
- v1.0.0（稳定版）：长期稳定 + 完整文档 + Play Store / App Store 上架
