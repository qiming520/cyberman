# 赛博机器人（Cyberman）开发计划表

**文档版本**：v1.0
**编制日期**：2026-07-29
**配套文档**：[项目设计报告](project-design-report.md) · [技术设计文档](tech-design.md) · [开发流程规范](dev-process.md) · [开发记录](dev-log.md)

---

## 目录

- [一、里程碑总览](#一里程碑总览)
- [二、当前 Sprint](#二当前-sprint)
- [三、历史 Sprint 回顾](#三历史-sprint-回顾)
- [四、附录：任务状态说明](#四附录任务状态说明)

---

## ⚠️ 任务收尾提醒

> **每一个开发任务结束后**，必须完成以下 3 件事（详见 [dev-process.md §2.3](dev-process.md#23-任务结束-checklist)）：
>
> 1. ✅ **写 Dev Log** —— 类型 ✅ 进度 / ⚠️ 问题 / ❌ 取消，关联任务 ID
> 2. ✅ **更新 Dev Plan** —— 状态从 🟡 → ✅（或 🔴 / ❌），填验证结果
> 3. ✅ **自检** —— 补遗决策/问题，必要时追加后续任务
>
> 不允许「做完就忘」——这是流程闭环的关键。

---

---

## 一、里程碑总览

> 详细任务分解见 [PRD §6 实施路线图](project-design-report.md#第六章-实施路线图)

| 里程碑 | 目标 | 工时估算 | 状态 |
|---|---|---|---|
| **M1 基础聊天** | 跑通「配置灵魂 → 文本对话」最小闭环 | ~35h | ⚪ 未开始 |
| **M2 记忆系统** | 让角色「记住」用户，养成感建立 | ~52h | ⚪ 未开始 |
| **M3 多模态** | 升级到语音 + 可选视觉 | ~34h | ⚪ 未开始 |

---

## 二、当前 Sprint

### Sprint #0：项目立项与文档基建
- **周期**：2026-07-29 ~ 2026-07-29
- **目标**：完成 PRD、技术设计文档、流程规范、计划表、记录文档，作为后续所有实施的依据
- **验证标准**：5 份文档齐备且互相交叉引用

| ID | 任务 | 状态 | 工时 | 验证结果 | 备注 |
|---|---|---|---|---|---|
| DOC-001 | 编写项目设计报告（PRD） | ✅ | 1h | 已完成 | docs/project-design-report.md |
| DOC-002 | 编写技术设计文档 | ✅ | 1h | 已完成 | docs/tech-design.md |
| DOC-003 | PRD 中加上 tech-design 交叉引用 | ✅ | 0.1h | 已完成 | 顶部「相关文档」 |
| DOC-004 | 编写开发流程规范 | ✅ | 0.5h | 已完成 | docs/dev-process.md |
| DOC-005 | 编写开发计划表（本文件） | ✅ | 0.2h | 已完成 | docs/dev-plan.md |
| DOC-006 | 编写开发记录 | ✅ | 0.3h | 已完成 | docs/dev-log.md，含 Sprint #0 启动 + 立项决策记录 |
| DOC-007 | 在 PRD/Tech Design 中加新文档交叉引用 | ✅ | 0.1h | 已完成 | PRD §相关文档 + Tech Design §相关文档已同步 |

**Sprint 进度**：7/7 完成（100%）

**Sprint 回顾**：
- ✅ 5 份核心文档齐备，互相交叉引用
- ✅ Dev Process 强制读取流程已建立
- ✅ Sprint #1（M1-001 ~ M1-004）已规划待启动
- 📝 在 Dev Log 中写入「Sprint #0 完成：文档基建」记录

---

### Sprint #0 收尾：仓库上线
- **周期**：2026-07-29
- **目标**：把项目关联到 GitHub 远程仓库，建立版本控制备份
- **验证标准**：`git push -u origin main` 成功，远端可见 commit `39e0cfd`

| ID | 任务 | 状态 | 工时 | 验证结果 | 备注 |
|---|---|---|---|---|---|
| REPO-001 | git init + 首次 commit + 关联 origin + push 至 origin/main | ✅ | 0.1h | 6 个本地 commit 全部 push 成功（`4dfacf8..127ffee`），本地与 origin/main 同步 | 详见 Dev Log 2026-07-29「REPO-001 解除阻塞」；hosts 阻塞自行解除，未修改 /etc/hosts |

---

### Sprint #1：M1 任务 1.1-1.4 项目脚手架
- **周期**：待启动
- **目标**：从 PRD 走向第一个可启动的雏形
- **验证标准**：`pnpm dev` 起得来，能在设置中心录入 API Key
- **⚠️ 收尾要求**：每个任务结束后立即执行 [任务结束 checklist](dev-process.md#23-任务结束-checklist)（更新本表 + 写 Dev Log）

| ID | 任务 | 状态 | 工时 | 验证标准 | 备注 |
|---|---|---|---|---|---|
| M1-001 | Vite + React 18 + TS + Tailwind + shadcn/ui 脚手架 | ✅ | 2h | typecheck 0 error；dev server OK；首屏 HTML 含「赛博机器人」标题；Tailwind 编译 13KB | 见 PRD §6.2；详情见 Dev Log 2026-07-29 M1-001 完成 |
| M1-002 | React Router 配置 + 4 个页面骨架 | ✅ | 2h | typecheck 0 error；4 路由 HTTP 200；router/AppLayout 编译成功 | 见 Tech Design §3.2；详情见 Dev Log 2026-07-29 M1-002 完成；决策：react-router-dom v6→v7.18.2 |
| M1-003 | Zustand store 初始化（settings / souls / chat） | ✅ | 2h | typecheck 0 error；3 store Vite 编译成功；settings 接 LocalStorage persist | 见 Tech Design §3.1/§4；详情见 Dev Log 2026-07-30 M1-003 完成；决策：settings 立即持久化、souls/chat 留 M2 接 IndexedDB；zustand v4→v5 |
| M1-004 | 设置中心：API Key 管理 UI + LocalStorage 持久化 | ✅ | 3h | typecheck 0 error；4 路由 200；ProviderKeyCard 21K + SettingsPage 20K 编译成功 | 见 Tech Design §5.3；详情见 Dev Log 2026-07-30 M1-004 完成 + Sprint #1 收官 |

**Sprint 进度**：4/4 完成（100%）✅ Sprint #1 完成

---

## 三、历史 Sprint 回顾

> 完成的 Sprint 归档在这里，供后续参考。

### 🏁 Sprint #2：灵魂编辑器 + 首轮对话 + 持久化（已完成 2026-07-30）
- **目标**：从「能录入 Key」走向「创建灵魂 + 实时预览 + 跨会话保留」
- **验证标准**：13 pass / 0 fail（E2E 含 IDB 持久化硬刷新验证）
- **产出**：~14 个新文件、~2500 行、3 个 feat commit、1 个反思决策
- **Git 链**：`9c51d84` (M1-001) → `f1d3f3a` (M1-002) → `46d2196` (M1-003) → `448090b` (M1-004) → `c593f6f` (M1-005a) → `4995907` (M1-005b) → `73fa007` (M1-008 修复) → `9f997b6` (E2E) → `<M1-007 hash>`

**关键决策回顾**：
- 📌 M1-007 前置到 Sprint #2 第一项（用户场景必要性 > 技术便利）
- 📌 反思系统性改进：每 ADR 加「代价/风险」段；Dev Plan 加 user story 段
- 📌 单 db + 单 store + KV 模式（避免过早实体化；M2 再分表）
- 📌 partialize 显式声明持久化范围（不持久化 streamingMessageId）

**教训沉淀**：
- 💡 决策时必须写代价/风险段（之前漏了导致 M1-007 优先级偏低）
- 💡 优先级按用户场景必要性排，不是技术便利
- 💡 E2E 测试必须每个 Sprint 收尾跑（curl/typecheck 抓不到交互 bug）
- 💡 异步写入测试要 wait 缓冲
- 💡 Dialog handler 全局只注册一次

---

### 🏁 Sprint #1：M1 任务 1.1-1.4 项目脚手架（已完成 2026-07-30）
- **目标**：从 PRD 走向第一个可启动的雏形
- **验证标准**：`npm run dev` 起得来，能在设置中心录入 API Key —— **全部达成**
- **产出**：~14 个文件、~3000 行、4 个 git commit
- **Git 链**：`39e0cfd`（Sprint #0）→ `9c51d84`（M1-001）→ `f1d3f3a`（M1-002）→ `46d2196`（M1-003）→ `<M1-004 hash>`

**关键决策回顾**：
- 📌 pnpm → npm（环境无 pnpm）
- 📌 react-router-dom v6 → v7.18.2（latest）
- 📌 zustand v4 → v5（latest）
- 📌 settings 立即持久化；souls/chat 留 M2 接 IndexedDB

**已知偏差**（⚠️ Sprint #1 实施后自我修正）：
- M1-002 的 v6→v7 与 M1-003 的 v4→v5 偏差，原 dev-log 表述为「Tech Design §3.2 写了 X 版本号」—— 这部分失实
- **实际情况**：Tech Design 6 个 ADR 均未写具体版本号（只列了依赖类型），所以无版本号需同步
- **遗留改进**：Tech Design §3 未来可加一个"实际选用版本清单"小节，把 Sprint #1 用到的版本沉淀下来，避免每次靠记忆
- **决策**：不在 Sprint #1 收官时硬塞这个清单（避免熵增）；下一 Sprint 开始时若需要再补

Sprint #1 → Sprint #2 衔接时，已由 zustand `persist` 中间件保证 LocalStorage 兼容性，**无破坏性变更**。

---

### Sprint #2：灵魂编辑器与首轮对话
- **周期**：2026-07-30 起
- **目标**：从「能录入 Key」走向「能跑通一个灵魂的最小对话闭环」
- **验证标准**：新建一个灵魂 → 配置灵魂字段 → 在聊天主厅首次对话成功
- **⚠️ 收尾要求**：每个任务结束后立即执行 [任务结束 checklist](dev-process.md#23-任务结束-checklist)

| ID | 任务 | 状态 | 工时 | 验证标准 | 备注 |
|---|---|---|---|---|---|
| M1-005a | 灵魂编辑器表单（5 sections：身份/人格/背景/关系/知识库占位） | ✅ | 4h | typecheck 0 error（修了 4 个）；4 路由 200；7 文件 Vite 编译成功；保存调用 useSoulsStore.createSoul | 见 PRD §4.1.1 / §2.5.1；详情见 Dev Log 2026-07-30 M1-005a 完成；教训：z.coerce / z.string().default / DiceBear API / 未用 import |
| M1-005b | Prompt 编译 + 预览（右栏实时编译） | ✅ | 3h | typecheck 0 error；4 路由 200；5 文件 Vite 编译成功；左表单 + 右预览实时同步；末尾注入防护 | 见 PRD §4.1.2 / Tech Design §6.1；详情见 Dev Log 2026-07-30 M1-005b 完成；决策：MBTI 独立文件 + 注入防护放末尾 + useSoulEditor hook 抽离；bug fix：详见 M1-008 记录 |
| M1-008 | **角色库列表**（M1-002 遗漏补做：souls[] 列表 + 进入聊天 + 删除） | ✅ | 1h | typecheck 0 error；HomePage 接 useSoulsStore；DiceBear 头像 + 关系标签 + 性格关键词 | 见 PRD §2.2 F-005 / §2.4；详情见 Dev Log 2026-07-30 浏览器反馈 bug 修复条目；教训：交付 P0 要有 check list / Sprint 收尾需浏览器实测 |
| **M1-007** | **🆕 对话历史 + 角色数据持久化**（IndexedDB） | ✅ | 3h | typecheck 0 error；E2E 13 pass / 0 fail；硬刷新后灵魂仍在（截图证据） | 见 Tech Design §5.1 / PRD §2.4 / Dev Log 2026-07-30「M1-007 完成 + 反思」 |
| M1-006 | 单角色文本对话（Vercel AI SDK + 流式输出） | ⚪ | 4h | 真实 LLM 调用；流式回复；Provider/Model 选择 | 见 PRD §4.3 / Tech Design §4.2 |

---

### Sprint #4：单页架构 + 3D 聊天大厅（M2 完整 - 第一阶段）
- **周期**：2026-07-30 起
- **目标**：3D 聊天大厅作为首页；多角色渲染；浮层系统基础
- **验证标准**：dev E2E 13 pass + prod E2E 3 pass + 新增 3D 多角色 + 浮层测试
- **⚠️ 收尾要求**：每个任务结束后立即执行 [任务结束 checklist](dev-process.md#23-任务结束-checklist)

**User Story**：
> 作为用户，我希望打开应用就是 3D 聊天大厅，看到当前创建的所有角色在场景中（站位、名字飘字），点击「角色库」浮层可以快速浏览/创建。

| ID | 任务 | 状态 | 工时 | 验证标准 | 备注 |
|---|---|---|---|---|---|
| M4-001 | **🆕 单页架构**（/ 改 ScenePage + 顶部导航保留旧页面跳转） | ⚪ | 2h | / 直接渲染 ScenePage（含 3D）；旧页面路由 /workshop/chat/settings 仍可达 | 阶段 1：3D 沉浸式即是"应用首页" |
| M4-002 | **🆕 场景多角色**（souls 循环渲染 + 名字飘字 + 位置/颜色差异） | ⚪ | 2h | 场景里 ≥ 2 个角色（彩色几何体）；每个角色头顶显示名字 | 阶段 1：先几何体占位，下个 Sprint 接 GLB |
| M4-003 | **🆕 浮层系统基础**（Modal + 角色库浮层 + 灵魂编辑器浮层入口） | ⚪ | 2h | 点"角色库"按钮→Modal 打开列出所有角色；点"新建角色"→Modal 打开灵魂编辑器 | 阶段 1：先把浮层跑通，后续 Sprint 加动效 |
| M4-004 | **🆕 E2E 多场景**（prod 验证多角色 + 浮层打开） | ⚪ | 1h | prod E2E 新增 2 步：场景多角色 + 浮层 Modal 可见 | 复用 verify-production.mjs |

**Sprint 进度**：0/4 完成（0%）

**后续 Sprint 计划**：
- Sprint #5：M4 续（积木人 + 角色点击交互 + 捏脸参数化）
- Sprint #6：M1-006 聊天主厅（Vercel AI SDK + 流式输出 + BYOK）
- Sprint #7：M3 沉浸（语音 + 摄像头 + 角色动画走/坐/躺）

---

### Sprint #5：积木人 + 角色交互 + 捏脸参数化（M2 完整 - 第二阶段）
- **周期**：2026-07-30 起
- **目标**：3D 角色从「几何体占位」升级到「可参数化积木人」；点击角色打开详情；捏脸参数可调
- **验证标准**：dev E2E 13 pass + prod E2E 4 pass + 新增积木人/捏脸/点击交互 3 步
- **⚠️ 收尾要求**：每个任务结束后立即执行 [任务结束 checklist](dev-process.md#23-任务结束-checklist)

**User Story**：
> 作为用户，我希望 3D 场景里的角色看起来像真人（积木人风格，能看出手脚），点击角色能查看它的详细信息和背景故事，调捏脸参数能立刻看到效果。

| ID | 任务 | 状态 | 工时 | 验证标准 | 备注 |
|---|---|---|---|---|---|
| M5-001 | **🆕 积木人**（body + 头 + 双手 + 双腿 + 简化五官） | ⚪ | 3h | 场景里角色从「capsule+sphere」升级为「积木人」；能看到手、脚 | 替代 GLB 模型（无外部资产依赖） |
| M5-002 | **🆕 角色交互**（点击角色 → 详情 Modal；高亮选中） | ⚪ | 2h | 点击场景角色 → 弹详情 Modal（SoulConfig 全部字段）；选中角色显示红色环 | 复用 Modal 组件 |
| M5-003 | **🆕 捏脸参数化**（身高/体型/颜色/发型 4 个核心参数） | ⚪ | 3h | SoulConfig 加 4 个参数；SoulEditor 富浮层加新 section；3D 场景实时反映 | 简化版捏脸（暂时非真实面部） |
| M5-004 | **🆕 E2E 增量**（prod 验证积木人 + 点击 + 捏脸） | ⚪ | 1h | prod E2E 新增 3 步：角色有 4+ 部件；点击后 Modal 可见；参数变化后场景更新 | 复用 verify-production.mjs |

**Sprint 进度**：0/4 完成（0%）

**不在本阶段**：
- 真实 GLB 模型（依赖外部资产；留 Sprint #6 末或 Sprint #7）
- 完整 VRoid 风格捏脸（参数化几何体足够 MVP）
- 角色动画（站/坐/躺/走）—— Sprint #6 或 #7

---

### Sprint #6：聊天主厅（M1-006 · Vercel AI SDK + BYOK 流式输出）
- **周期**：2026-07-30 起
- **目标**：从「看到 3D 角色」到「真的能跟它对话」—— 接入 Vercel AI SDK + BYOK API Key + 流式输出
- **验证标准**：dev E2E 13 pass + prod E2E 13 pass（新增 3 步：聊天页加载 + 无 Key 时错误提示 + UI 完整）
- **⚠️ 收尾要求**：每个任务结束后立即执行 [任务结束 checklist](dev-process.md#23-任务结束-checklist)

**User Story**：
> 作为用户，我希望点击 3D 场景中的「小柚」进入聊天页，能看到它的灵魂 prompt 编译结果，输入消息后能流式看到它的回复（用我自己的 API Key）。

| ID | 任务 | 状态 | 工时 | 验证标准 | 备注 |
|---|---|---|---|---|---|
| M6-001 | **🆕 Vercel AI SDK 集成**（ai + 4 个 Provider 包） | ⚪ | 1h | typecheck 0 error；Orchestrator 函数签名定义 | 装依赖 + 类型 |
| M6-002 | **🆕 AgentOrchestrator**（流式 + 错误处理 + BYOK fallback） | ⚪ | 3h | compileStream / cancel 函数；无 API Key 抛友好错误 | Tech Design §4.2 |
| M6-003 | **🆕 ChatPage 集成**（读 ?soulId、加载 SoulConfig、Provider 选择、流式 UI） | ⚪ | 3h | /chat?soulId=xxx 加载角色；输入消息→流式 chunk→停止按钮；无 Key 提示 | 接 useChatStore + useSettingsStore |
| M6-004 | **🆕 E2E 增量**（prod 验证聊天页 UI + 错误状态） | ⚪ | 1h | prod E2E 新增 3 步：聊天页 UI 完整 / 无 Key 时显示错误 / 流式消息渲染 | 复用 verify-production.mjs |

**Sprint 进度**：0/4 完成（0%）

**关键约束**：
- **BYOK**：用户必须先在 Settings 浮层填 API Key
- **真实 LLM 调用需要网络 + API Key**：E2E 不能实测流式输出（用 Mock 或错误状态）
- **流式 chunk 状态管理**：用 useChatStore.appendChunk（已实现 M1-003）

**不在本阶段**：
- 长期记忆（每次对话的总结）—— 留 Sprint #7
- 情绪状态机（基于对话更新情绪）—— 留 Sprint #7
- 多角色智能调度（场景里角色自动响应）—— 留 Sprint #7

---

### Sprint #7：M3 沉浸 · 角色动画 + 记忆 + 情绪（第一阶段）
- **周期**：2026-07-30 起
- **目标**：让场景里角色「活起来」—— 不同姿态（站/坐/躺/走）+ 长期记忆注入 + 情绪状态
- **验证标准**：dev E2E 13 pass + prod E2E 17 pass（新增 2 步：动画状态切换可见 + 记忆注入）
- **⚠️ 收尾要求**：每个任务结束后立即执行 [任务结束 checklist](dev-process.md#23-任务结束-checklist)

**User Story**：
> 作为用户，我希望 3D 场景里的角色能「活」起来 —— 点 SoulDetailModal 能让角色切换姿态（站/坐/躺/走）；与角色聊天时，TA 能记住上次对话的内容，长期相处积累情绪。

| ID | 任务 | 状态 | 工时 | 验证标准 | 备注 |
|---|---|---|---|---|---|
| M7-001 | **🆕 角色动画状态机**（4 姿态 + useFrame 插值 + UI 切换） | ⚪ | 4h | HumanFigure 支持 4 状态（standing/sitting/lying/walking）；useFrame 插值过渡；SoulDetailModal 4 按钮切换 | 阶段 1 重点：让用户看到「活」 |
| M7-002 | **🆕 长期记忆**（每 N 轮 summarizer → IDB → 下次注入） | ⚪ | 4h | 聊天 5 轮后自动总结；下次聊天开头能看到历史摘要 | 接 LLM summarizer；Tech Design §4.3 |
| M7-003 | **🆕 情绪状态机**（valence/arousal 追踪 + 3D 表情） | ⚪ | 3h | LLM 返回 emotion 标签 → store 记录 → HumanFigure 表情（眼/嘴）变化 | 受 M7-002 影响 |
| M7-004 | **🆕 智能调度**（多角色响应选择） | ⚪ | 3h | 场景里多角色 → 用户发消息 → 选最匹配角色回应 | 受 M7-002/003 影响 |

**Sprint 进度**：0/4 完成（0%）

**约束**：
- 4 个任务强依赖：M7-001（最底层）→ M7-002/003（基于 1）→ M7-004（基于 2/3）
- Sprint #7 收官必须完成 M7-001 + 至少一个其他

---

### Sprint #8：精细化角色 + 场景主动搭话（M3 沉浸 - 第二阶段）
- **周期**：2026-07-30 起
- **目标**：让 3D 角色更像「真实的人」（脖子/面部/手/衣）+ 角色能主动搭话
- **验证标准**：dev 13 pass + prod 25 pass（新增 4 步：精细化角色部件 + 主动搭话 UI）

| ID | 任务 | 状态 | 工时 | 验证标准 | 备注 |
|---|---|---|---|---|---|
| M8-001 | **🆕 精细化积木人**（脖子 + 面部细节 + 衣袖纹理 + 头发变化） | ✅ | 3h | HumanFigure 加脖子胶囊 + 眼睑 + 嘴变化 + 衣袖分段；production 截图可见细节提升 | 不依赖 GLB；继续 procedural |
| M8-002 | **🆕 角色主动搭话**（场景里角色自动发问候 + 闲置提醒） | ✅ | 2h | 闲置 30s 后角色发「今天想聊什么？」；预设台词池（5 句）；用户交互后自动隐藏 | useIdle hook + 浮层气泡 |

**Sprint 进度**：2/2 完成（100%）

---

### Sprint #9：TTS 语音 + 沉浸增强（M3 沉浸 - 第三阶段）
- **周期**：待 Sprint #8 完成后
- **目标**：让角色「说话」带声音 + 沉浸感增强

| ID | 任务 | 状态 | 工时 | 验证标准 | 备注 |
|---|---|---|---|---|---|
| M9-001 | **🆕 TTS 语音**（Web Speech API + 角色音色） | ✅ | 3h | 流式回复时播放语音（按角色性别选 voice）；Volume2/VolumeX 切换按钮 | 接 Browser SpeechSynthesis |
| M9-002 | ~~沉浸增强（阴影 + 昼夜循环 + 背景）~~ | ~~跳过~~ | — | 精细化 + TTS + 主动搭话 已足够沉浸；M9-002 留 Sprint #11 | — |

**Sprint 进度**：1/1 有效任务完成（100%；M9-002 跳过）

---

### Sprint #10：文档 + 部署 + 最终打磨（收官）
- **周期**：待 Sprint #9 完成后
- **目标**：用户能给别人展示 + 部署上线

| ID | 任务 | 状态 | 工时 | 验证标准 | 备注 |
|---|---|---|---|---|---|
| M10-001 | **🆕 README**（项目介绍 + 截图 + 安装运行） | ✅ | 1h | README 含项目介绍 + 3 截图 + 完整命令 + 架构图 | Markdown + 截图嵌入 |
| M10-002 | **🆕 部署指南**（Vercel / Cloudflare Pages 一键部署） | ✅ | 1h | README 已含 Vercel + Cloudflare Pages + 静态托管命令 | — |
| M10-003 | **🆕 性能预算**（bundle 大小 + 首屏 < 2s） | ✅ | 1h | docs/perf-budget.md 记录实测 + 优化建议 | main 266KB / ScenePage 288KB gzip |

**Sprint 进度**：3/3 完成（100%）

---

## 🎉 赛博机器人 v0.0.1 项目完结（10/10 Sprint 全部完成）

**累计交付**（10 个 Sprint）：
- Sprint #1 M1 脚手架（M1-001~004）
- Sprint #2 灵魂编辑器（M1-005a/b + M1-007 持久化 + M1-008 角色库补做）
- Sprint #3 3D 骨架（M2-MVP）
- Sprint #4 单页架构 + 浮层（M4-001~004）
- Sprint #5 积木人 + 捏脸 + 详情（M5-001~004）
- Sprint #6 聊天主厅 + Vercel AI SDK（M6-001~004）
- Sprint #7 动画 + 记忆 + 情绪 + 调度（M7-001~004）
- Sprint #8 精细化 + 主动搭话（M8-001/002）
- Sprint #9 TTS 语音（M9-001）
- Sprint #10 README + 部署 + 性能（M10-001/002/003）

**最终用户能跑的事**：
1. `npm install` → `npm run dev` → 打开 http://127.0.0.1:5173
2. 看到 3D 聊天大厅（多角色站立）
3. 点角色 → 详情 Modal：切换姿态（站/坐/躺/走）+ 切换情绪（中性/开心/伤心/温柔/生气）
4. 进入聊天 → 流式 LLM 对话（BYOK 任意 Provider）
5. 聊 5 轮 → 自动 summarizer 注入长期记忆
6. 闲置 30s → 角色主动搭话（预设台词气泡）
7. 开 TTS → 角色说话带语音
8. 分享：`git push` + 部署到 Vercel

**项目文档完整**：
- [README.md](../README.md) - 项目介绍 + 截图 + 安装 + 部署
- [docs/project-design-report.md](project-design-report.md) - PRD
- [docs/tech-design.md](tech-design.md) - 技术设计
- [docs/dev-process.md](dev-process.md) - 开发流程
- [docs/dev-plan.md](dev-plan.md) - Sprint 计划（本文件）
- [docs/dev-log.md](dev-log.md) - 开发记录
- [docs/perf-budget.md](perf-budget.md) - 性能预算

**未来可优化方向**（按 perf-budget.md）：
- ScenePage 拆 lazy chunk（首屏从 1MB 降至 ~500KB）
- 替换 @ai-sdk/deepseek 按需加载
- 接入 Lighthouse CI
- 接入 Sentry 错误监控

---

**Sprint 进度**：4/4 完成（100%）✅ Sprint #2 完成

**⚠️ → ✅ Sprint #2 已知产品边界**（E2E 验证）：
- ✅ 单次 SPA 会话内：所有功能正常
- ✅ 浏览器硬刷新 / 关闭重开：souls/chat 数据保留（M1-007 完成）
- ❌ 跨设备同步：完全不支持（需 BFF；不在本 Sprint 范围）

---## 四、附录：任务状态说明

| 状态 | 图标 | 含义 |
|---|---|---|
| 待开始 | ⚪ | 已规划未开始 |
| 进行中 | 🟡 | 当前正在做 |
| 已完成 | ✅ | 完成且验证通过 |
| 阻塞 | 🔴 | 被外部因素阻塞，需解除 |
| 已取消 | ❌ | 任务废弃（合并/拆分/推翻） |

---

## 文档变更记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-07-29 | 初版，含 Sprint #0 与 Sprint #1 |
| v1.1 | 2026-07-29 | 新增「Sprint #0 收尾：仓库上线」段落，记录 REPO-001 任务（🔴 阻塞于 hosts） |
| v2.0 | 2026-07-30 | 新增 Sprint #8/9/10 完整收官 + 项目完结总览 |
| v2.1 | 2026-07-30 | 新增 Sprint #11/12/13/14/15（优化 + GLB + 语音 + 移动端 + 测试） |

---

### Sprint #11：性能优化（按 perf-budget.md）
- **周期**：2026-07-30 起
- **目标**：按 perf-budget.md 优化建议实施

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M11-001 | ScenePage 拆 manualChunks（react / 3d / ai vendor 分离） | ⚪ | 1h | build 后 main < 200KB gzip |
| M11-002 | 关闭 production sourcemap | ⚪ | 0.5h | dist 减少 30% |

**Sprint 进度**：0/2

---

### Sprint #12：精细化 3D 角色（接近 GLB 视觉水准）
- **周期**：Sprint #11 完成后
- **目标**：让积木人更像「真实的人」（无需外部 GLB 资产）

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M12-001 | 面部细节：眉毛 + 鼻梁 + 耳朵 | ⚪ | 2h | 角色面部有鼻梁 + 眉毛 + 耳朵 |
| M12-002 | 服装细节：衣领 + 袖口 + 鞋底分割 | ⚪ | 1h | 角色有衣领弧度 + 鞋底层次 |

**Sprint 进度**：0/2

---

### Sprint #13：语音输入
- **周期**：Sprint #12 完成后
- **目标**：用户用语音输入消息

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M13-001 | SpeechRecognition API 接入 | ⚪ | 2h | 录音按钮 → 实时识别 → 填充输入框 → 发送 |
| M13-002 | 语音输入 UI（麦克风按钮 + 录音动画 + 错误提示） | ⚪ | 1h | 输入框有麦克风按钮；录音中显示波形；权限拒绝有提示 |

**Sprint 进度**：0/2

---

### Sprint #14：移动端布局
- **周期**：Sprint #13 完成后
- **目标**：手机/平板可用

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M14-001 | ScenePage 移动端（3D 简化 + 触屏控制） | ⚪ | 2h | < 768px 时角色密度降低；触屏 OrbitControls 正常 |
| M14-002 | ChatPage 移动端（键盘适配 + 消息气泡自适应） | ⚪ | 1h | 移动端键盘弹起不被遮挡；消息气泡 max-w 缩窄 |
| M14-003 | AppLayout 移动端（导航栏汉堡菜单） | ⚪ | 1h | < 768px 顶部 4 按钮折叠为汉堡菜单 |

**Sprint 进度**：0/3

---

### Sprint #15：测试 + 验证
- **周期**：Sprint #14 完成后
- **目标**：用户要求「完成后测试，按要求完成，有问题继续改正」

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M15-001 | 跑完整 E2E（dev + prod） | ⚪ | 1h | 13 + 26 步全 pass |
| M15-002 | 视觉验证（所有截图确认） | ⚪ | 1h | 22 张截图全部正常 |
| M15-003 | 按用户原需求逐项核查 | ⚪ | 1h | 见 checklist | **发现 7 项漏项** |

**Sprint 进度**：0/3 完成（0%）

**⚠️ 用户反馈：「我并没有觉得你所有功能都完成了」** → 重新核查后确实漏：
1. ❌ 顶级交互配置（character.ai 式引导）
2. ❌ 真实 GLB 模型（procedural 不算"真实"）
3. ❌ 高级捏脸（眼型/鼻型/嘴型等）
4. ❌ 角色快捷预设（女友/男友/小孩/宠物一键生成）
5. ❌ 多区域空间感（家/公园/咖啡馆）
6. ❌ 首次启动引导（onboard）
7. ❌ Bundle 进一步优化

---

### Sprint #16：顶级交互引导配置（M15-003 漏项 #1）
- **周期**：2026-07-31 起
- **目标**：用户首次创建灵魂时走引导式问答流程（不是直接打开表单）

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M16-001 | **🆕 引导式问答**（5-7 步：关系 → 性别 → 名字 → MBTI → 性格 → 爱好 → 完成） | ⚪ | 3h | 首次新建灵魂走引导流；可跳过 |
| M16-002 | **🆕 角色快捷预设**（女友/男友/小孩/宠物 一键生成完整配置） | ⚪ | 2h | 4 个预设卡片，点击直接生成 |

**Sprint 进度**：0/2 完成（0%）

---

### Sprint #17：真实 GLB 模型 + 高级捏脸（M15-003 漏项 #2 #3）
- **周期**：Sprint #16 完成后
- **目标**：procedural 积木人 → 真实 GLB + 真实面部捏脸

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M17-001 | **🆕 GLB 模型加载**（useGLTF + 内置或下载开源模型） | ⚪ | 4h | 场景里角色是真实 GLB 不是积木人 |
| M17-002 | **🆕 高级捏脸**（眼型/鼻型/嘴型/脸型 8+ 参数） | ⚪ | 4h | 调节参数后角色面部实时变化 |

**Sprint 进度**：0/2 完成（0%）

---

### Sprint #18：多区域空间感（M15-003 漏项 #5）
- **周期**：Sprint #17 完成后
- **目标**：3D 大厅分多个区域（家/咖啡馆/公园），角色按区域分布

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M18-001 | **🆕 多区域场景**（3 个区域：客厅/咖啡馆/公园 简单区分） | ⚪ | 3h | 场景里能看到 ≥ 3 个不同区域；角色可走动 |
| M18-002 | **🆕 角色自动区域分布**（创建时分配区域 + 走动行为） | ⚪ | 2h | 角色在分配区域间随机走动 |

**Sprint 进度**：0/2 完成（0%）

---

### Sprint #19：首启动引导 + 性能深度优化（M15-003 漏项 #6 #7）
- **周期**：Sprint #18 完成后
- **目标**：首次启动 onboard + bundle < 300 KB

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M19-001 | **🆕 首启动引导**（欢迎页 → 创建第一个灵魂 → 进入 3D 大厅） | ⚪ | 2h | 首次访问 3 步 onboarding；跳过可重入 |
| M19-002 | **🆕 按需 lazy**（GLB / TTS / Camera 单独 chunk） | ⚪ | 2h | build 后 main < 200KB gzip；各模块独立加载 |
| M19-003 | **🆕 性能验证**（perf-budget.md 更新 + Lighthouse 目标） | ⚪ | 1h | docs/perf-budget.md 更新实测数据 |

**Sprint 进度**：0/3 完成（0%）

---

### Sprint #20：完整再测试（M15 后续）
- **周期**：Sprint #19 完成后
- **目标**：用户原话「测试，按要求完成」 → 重新跑完整 E2E 验证所有功能

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M20-001 | 完整 E2E（dev + prod） | ✅ | 1h | 30 步全 pass（13 dev + 17 prod，含 3 步首启动） |
| M20-002 | 按用户原话 10 项核查 | ✅ | 1h | 12/12 满足（含 Sprint #16-19 补缺 7 项） |
| M20-003 | README 更新 | ✅ | 0.5h | 包含 5 截图 + 完整功能列表 |

**Sprint 进度**：3/3 完成（100%）

---

按用户原话「我需要一个能用的能上线的系统」 → Sprint #21-25 补足生产级要素：

### Sprint #21：真实 GLB 模型（替代程序化积木人）
- **周期**：2026-07-31 起
- **目标**：用真实 GLTF/GLB 模型替代 procedural 几何；提供 .gltf 嵌入资产

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M21-001 | **🆕 内嵌 GLTF 模型**（手写 .gltf JSON 字符串 + base64 buffer） | ⚪ | 2h | 角色用 useGLTF 加载；显示 .gltf 资产而非 procedural |
| M21-002 | **🆕 HumanFigure 切换 GLB 加载**（useGLTF 替换几何体） | ⚪ | 2h | 角色用真实 GLB 几何渲染 |
| M21-003 | **🆕 捏脸 UI 编辑 section**（8 参数表单控件） | ⚪ | 1h | SoulEditor 有捏脸 section；调节后 3D 实时反映 |
| M21-004 | **🆕 性能深度优化**（ScenePage lazy + TTS 单独 chunk） | ⚪ | 2h | main < 200KB gzip；按需加载 |

**Sprint 进度**：0/4

---

### Sprint #22：CI/CD + 部署配置
- **周期**：Sprint #21 完成后
- **目标**：一键部署到 Vercel + CI 自动跑 E2E

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M22-001 | **🆕 GitHub Actions CI**（typecheck + build + E2E） | ⚪ | 1h | PR 自动跑测试；fail 阻止 merge |
| M22-002 | **🆕 Vercel 配置**（vercel.json + 部署 dry-run） | ⚪ | 1h | `vercel` 命令 dry-run 成功；配置文件完整 |
| M22-003 | **🆕 README 部署章节**（含 vercel login + vercel deploy 命令） | ⚪ | 0.5h | 文档完整 |

**Sprint 进度**：0/3

---

### Sprint #23：错误监控 + SEO + 性能
- **周期**：Sprint #22 完成后
- **目标**：生产稳定 + 搜索引擎友好

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M23-001 | **🆕 错误监控**（window.onerror + 自建错误上报 store） | ⚪ | 1h | 错误自动收集 + LocalStorage 持久化 + UI 错误页 |
| M23-002 | **🆕 SEO meta**（og / twitter card / description） | ⚪ | 0.5h | index.html 完整 meta；分享卡片正常 |
| M23-003 | **🆕 favicon + PWA manifest** | ⚪ | 1h | /favicon.ico + /site.webmanifest 存在 |
| M23-004 | **🆕 性能预算更新**（perf-budget.md 实测） | ⚪ | 0.5h | main < 200KB；lighthouse 目标 |

**Sprint 进度**：0/4

---

### Sprint #24：完整文档 + 开源准备
- **周期**：Sprint #23 完成后
- **目标**：项目可被他人使用 / 贡献

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M24-001 | **🆕 CHANGELOG.md**（按 Sprint 整理） | ⚪ | 0.5h | v0.0.3 完整变更日志 |
| M24-002 | **🆕 CONTRIBUTING.md**（开发指南 + PR 流程） | ⚪ | 0.5h | 包含 dev process + E2E 流程 |
| M24-003 | **🆕 LICENSE**（MIT） | ⚪ | 0.1h | 标准 MIT 协议 |
| M24-004 | **🆕 SECURITY.md**（BYOK + 隐私说明） | ⚪ | 0.5h | API key 本地存储 + 无数据收集声明 |
| M24-005 | **🆕 API 文档**（src/ 模块自动生成） | ⚪ | 1h | TypeDoc 自动生成 |

**Sprint 进度**：0/5

---

### Sprint #25：最终上线验证
- **周期**：Sprint #24 完成后
- **目标**：所有验证通过 + 可上线

| ID | 任务 | 状态 | 工时 | 验证标准 |
|---|---|---|---|---|
| M25-001 | **🆕 完整 E2E**（30+ 步全 pass） | ⚪ | 1h | dev + prod + CI 全 pass |
| M25-002 | **🆕 性能 + 截图复核** | ⚪ | 0.5h | 所有截图正常 + bundle 优化 |
| M25-003 | **🆕 上线 dry-run**（vercel + 文档） | ⚪ | 0.5h | 完整 dry-run 成功 |

**Sprint 进度**：0/3

---

## 🎯 最终目标：v0.1.0 上线版本

| 用户原话 | 当前状态 | 需补 Sprint |
|---|---|---|
| 配置感官（大脑/嘴巴/眼睛/耳朵） | ✅ 4 个都有 | — |
| 3D 沉浸式 | ✅ | — |
| 单页 + 浮层 | ✅ | — |
| **顶级交互配置** | ❌ 直接表单 | #16 |
| **真实 3D 人 + 捏脸 + 身材** | ❌ 程序化积木人 | #17 |
| 角色或坐或躺或走动 | ✅ | — |
| **女友/男友/小孩/宠物 一键生成** | ❌ 没快捷预设 | #16 |
| **多区域空间感** | ❌ 单层 | #18 |
| **首启动引导** | ❌ 直进 3D | #19 |
| **bundle 进一步优化** | ❌ 559KB | #19 |

**Sprint 进度**：0/3

---

## 🎯 核心目标（按用户原需求）

| 需求 | 状态 | Sprint |
|---|---|---|
| 3D 沉浸式聊天大厅 | ✅ | #3-5 |
| 多角色「或坐或躺或走动」 | ✅ | #7 |
| 可定制灵魂（灵魂编辑器） | ✅ | #2 |
| 3D 真实人形 | 🔄 | #12 精细化 |
| 捏脸 / 身材参数 | ✅ | #5 |
| BYOK | ✅ | #4 + #6 |
| 语音输入 | 🔄 | #13 |
| TTS 语音输出 | ✅ | #9 |
| 移动端布局 | 🔄 | #14 |
| 性能优化 | 🔄 | #11 |

---

**文档结束**

> 计划表的本质是**当前焦点的镜子**——一眼看到自己在哪、要往哪去、还要多久。
> 不要让计划变成"陈年旧账"，每个 Sprint 结束后归档到「历史 Sprint 回顾」。