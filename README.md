# 🤖 赛博机器人 (Cyberman)

> 3D 沉浸式 AI 陪伴应用 · 可定制灵魂 · 单页浮层架构 · BYOK 隐私优先

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-black?logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-6-000?logo=vercel&logoColor=white)](https://sdk.vercel.ai/)

**赛博机器人** 是一个 3D 沉浸式 AI 陪伴应用。打开应用就是一个 3D 聊天大厅，里面有各种各样你创建的角色在「或坐或躺或走动」。

每个角色有完整的灵魂：姓名/性格/MBTI/说话风格/背景故事/边界。跟角色对话时，TA 会记住你说的话（长期记忆），能切换姿态（站/坐/躺/走），能切换情绪（开心/伤心/温柔/生气/中性），能说话（语音朗读）。

所有功能集成在一个页面（[单页架构](docs/dev-plan.md#sprint-4单页架构--3d-聊天大厅m2-完整--第一阶段)），子功能用浮层（角色库 / 灵魂编辑器 / 设置）展示。**数据完全本地化**（IndexedDB + LocalStorage），不依赖任何后端服务。

---

## ✨ 核心功能

| 功能 | 描述 |
|---|---|
| **3D 沉浸式** | React Three Fiber + Three.js · 真实光照 + 阴影 + 网格地板 |
| **多区域 3D 大厅** | 客厅/咖啡馆/公园 3 个区域，角色按关系自动分配 |
| **积木人角色** | 完整 4 姿态（站/坐/躺/走）+ useFrame 平滑插值 + 5 情绪头顶 emoji |
| **高级捏脸** | 8 个参数（脸型/眼型/眼大小/鼻大小/嘴型/嘴大小/眉型/肤色）实时反映 |
| **灵魂编辑器** | 6 大字段（身份/性格/背景/关系/知识库/捏脸）+ 双向 Prompt 实时预览 |
| **顶级交互配置** | 5 步引导问答（关系 → MBTI → 性格 → 名字 → 完成）+ 4 角色预设（女友/男友/小孩/宠物） |
| **首启动引导** | 首次访问欢迎页（3 步指引）+ 进入 3D 大厅 |
| **4 感官配置** | 大脑（Provider + API Key）· 嘴巴（TTS）· 眼睛（摄像头拍照）· 耳朵（语音输入） |
| **BYOK** | 用户自带 API Key（OpenAI / Anthropic / DeepSeek）· 数据全本地 |
| **长期记忆** | 每 5 轮对话自动 summarizer · 注入 system prompt · 跨会话保留 |
| **情绪状态机** | 5 情绪（中性/开心/伤心/温柔/生气）· 3D 头顶 emoji 反映 + 嘴颜色变化 |
| **智能调度** | URL `?soulId=xxx` > activeSoulId > 第一个 soul 三级 fallback |
| **TTS 语音** | 浏览器原生 SpeechSynthesis · 按角色性别选音色 |
| **主动搭话** | 闲置 30s 后角色自动显示气泡提示 |
| **持久化** | IndexedDB（角色 + 对话 + 长期记忆 + 摘要）+ LocalStorage（设置 + 首启动标记） |
| **响应式** | 桌面 + 移动端完整适配（汉堡菜单 + 触屏 OrbitControls + 移动端布局） |

---

## 📸 截图

### 3D 聊天大厅（多区域 + 多角色）

![3D Chat Hall](e2e/screenshots/production-3d-verified.png)

> 3 区域（客厅🛋️ / 咖啡馆☕ / 公园🌳）+ 2 个角色「小柚」+「墨羽」。头顶名字飘字 + 状态标签 + 情绪 emoji。鼠标可拖动旋转 / 滚轮缩放 / 点击角色看详情。

### 首启动引导（首次访问）

![First Run Gate](e2e/screenshots/production-firstrun.png)

> 首次访问显示欢迎页（3 步引导：3D 场景 / 4 姿态 / 5 情绪 + CTA「进入 3D 大厅」）。LocalStorage 标记完成后再不显示。

### 灵魂详情 Modal（含 4 姿态 + 5 情绪按钮）

![Soul Detail](e2e/screenshots/production-detail-modal.png)

> 头像 + 关系 + 性格 + 背景 + 边界 + 知识库。底部 3D 状态 / 当前心情 切换按钮 + 顶部「新建角色」按钮触发 5 步引导配置。

### 聊天主厅（Vercel AI SDK + 流式输出）

![Chat Page](e2e/screenshots/production-chat-page.png)

> 顶部角色信息 + Provider/Model 选择器 + TTS 开关 + 麦克风按钮 + 摄像头按钮；中间消息流；底部输入框 + 发送按钮。

---

## 🚀 快速开始

### 1. 克隆 + 安装

```bash
git clone https://github.com/qiming520/cyberman.git
cd cyberman
npm install
```

### 2. 开发模式

```bash
npm run dev
# → http://127.0.0.1:5173
```

### 3. 生产构建 + 预览

```bash
npm run build
npx vite preview
# → http://127.0.0.1:4173
```

### 4. 跑端到端测试

```bash
# 装 Playwright 浏览器二进制（仅首次）
npm run e2e:install

# Dev mode E2E（13 步 MVP 流程）
npm run e2e

# Production E2E（21 步，含 3D + 浮层 + 详情 + 聊天 + 状态 + 情绪 + 调度）
npm run build
node e2e/verify-production.mjs --no-server
```

---

## 🏗️ 技术栈

| 维度 | 选型 | 理由 |
|---|---|---|
| **构建** | Vite 5 | HMR 快 + build 快 + ESM 原生 |
| **框架** | React 18 + TypeScript 5 | 生态最广 + 强类型 |
| **路由** | React Router 7 | 单页浮层 + 深链 `?soulId=xxx` |
| **状态** | Zustand 5 | 轻量 + TS 友好 + IDB 持久化 |
| **3D** | React Three Fiber 8 + drei 9 + three 0.185 | React 渲染 + helpers + 引擎 |
| **样式** | Tailwind CSS 3 | 快速 + 主题灵活 |
| **表单** | React Hook Form + zod | 受控 + 验证 |
| **头像** | DiceBear（@dicebear/collection bottts） | 开源 + 风格化 |
| **AI** | Vercel AI SDK 6 | 统一多 Provider + 流式 |
| **持久化** | IndexedDB（idb 8）+ LocalStorage | 大对象 + KV 混合 |

---

## 📐 架构

```
┌─────────────────────────────────────────────────────────┐
│  Browser SPA（Vite + React 18）                          │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐    │
│  │  ScenePage   │  │  ChatPage     │  │ 旧页面路由      │   │
│  │ （3D 沉浸式） │  │  /chat?soulId │  │ /characters 等 │   │
│  └──────┬──────┘  └──────┬───────┘  └───────────────┘   │
│         │                │                               │
│  ┌──────▼────────────────▼──────────────────────┐        │
│  │  Zustand Stores（settings + souls + chat +    │       │
│  │  characterState + emotion + IDB persist）      │       │
│  └─────────────────────┬────────────────────────┘        │
│                        │                                │
│  ┌─────────────────────▼────────────────────────┐        │
│  │  Feature Layer（Orchestrator · Soul Compiler · │       │
│  │  Memory Summarizer · TTS · HumanFigure · ...）  │      │
│  └─────────────────────┬────────────────────────┘        │
│                        │                                │
│  ┌─────────────────────▼────────────────────────┐        │
│  │  Infrastructure（IndexedDB · LocalStorage ·     │       │
│  │  Vercel AI SDK · SpeechSynthesis · MediaDevices） │      │
│  └────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

详细架构决策见 [docs/dev-plan.md](docs/dev-plan.md) + [docs/dev-log.md](docs/dev-log.md)。

---

## 🎯 使用场景

### 创建灵魂

1. 打开应用 → 顶部「新建角色」浮层
2. 输入姓名 + 选性别 + 选 MBTI + 加性格 + 写背景故事
3. 右栏**实时预览编译后的 System Prompt**（4 大章节：身份/性格/关系/约束）
4. 点「创建灵魂」→ 跳到聊天页

### 与灵魂对话

1. 顶部「角色库」浮层 → 点角色「进入聊天」按钮
2. 输入消息 → 选 Provider + Model（OpenAI / Anthropic / DeepSeek）→ 输入 API Key
3. 看到流式回复 + 可开 TTS 语音朗读

### 角色管理

- **3D 场景**：拖动旋转 / 滚轮缩放
- **点击角色**：打开详情 Modal
- **详情 Modal**：切换姿态（站/坐/躺/走）+ 切换情绪（中性/开心/伤心/温柔/生气）
- **进入聊天**：跳到 /chat?soulId=xxx

### 长期记忆

- 聊 5 轮以上 → 切角色 → 回来时自动 summarizer
- 顶部显示「🧠 N 条长期记忆」徽章
- 下次聊天开头 LLM 看到历史摘要

---

## 📊 性能

| 指标 | 目标 | 实测 |
|---|---|---|
| 首屏 JS（gzipped） | < 500 KB | ~280 KB |
| 构建时间 | < 30s | ~7s |
| TypeScript strict | 0 error | ✅ 0 |
| E2E 测试（dev） | 13 步 | ✅ 13/13 |
| E2E 测试（prod） | 21 步 | ✅ 21/21 |

---

## 🛠️ 开发

### 项目结构

```
cyberman/
├── docs/                  # 文档（5 份）
│   ├── project-design-report.md   # PRD
│   ├── tech-design.md             # 技术设计
│   ├── dev-process.md             # 开发流程规范
│   ├── dev-plan.md                # Sprint 计划
│   └── dev-log.md                 # 开发记录
├── src/
│   ├── pages/              # 页面（HomePage / ScenePage / ChatPage / ...）
│   ├── features/
│   │   ├── soul/           # 灵魂编辑器 + 详情 Modal
│   │   ├── scene/          # 3D 场景（Scene + HumanFigure）
│   │   ├── agent/          # AgentOrchestrator（Vercel AI SDK 包装）
│   │   ├── memory/         # 长期记忆（memoryRepo + summarizer）
│   │   ├── sensory/        # TTS
│   │   └── soul/compiler/  # System Prompt 编译器
│   ├── stores/             # Zustand（settings / souls / chat / characterState / emotion）
│   ├── components/
│   │   ├── layout/         # AppLayout
│   │   ├── soul/           # SoulDetailModal
│   │   └── ui/             # Modal 等基础组件
│   ├── hooks/              # useIdle
│   └── styles/             # Tailwind 入口
├── e2e/                    # Playwright 端到端测试
│   ├── smoke.mjs          # Dev mode 13 步
│   ├── verify-production.mjs  # Production 21 步
│   └── screenshots/       # 自动截图
├── public/                 # 静态资源（3D 模型等可选）
└── package.json
```

### 文档

- [docs/project-design-report.md](docs/project-design-report.md) - 产品需求
- [docs/tech-design.md](docs/tech-design.md) - 技术设计（6 个 ADR + 模块 API）
- [docs/dev-process.md](docs/dev-process.md) - 开发流程（强制读取 + 任务结束 checklist）
- [docs/dev-plan.md](docs/dev-plan.md) - Sprint 计划
- [docs/dev-log.md](docs/dev-log.md) - 开发记录（每 Sprint 收尾 + 决策 + 教训）

---

## 🌐 部署

### Vercel（推荐）

```bash
npm i -g vercel
vercel
# 自动检测 Vite 项目，一键部署
```

### Cloudflare Pages

```bash
npm run build
# 上传 dist/ 目录到 Cloudflare Pages
```

### 静态托管

```bash
npm run build
# dist/ 目录是纯静态，可托管到任何 CDN / GitHub Pages / S3
```

无后端依赖（BYOK 模式），纯前端应用。

---

## 📜 License

MIT
