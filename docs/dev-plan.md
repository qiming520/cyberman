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

---

**文档结束**

> 计划表的本质是**当前焦点的镜子**——一眼看到自己在哪、要往哪去、还要多久。
> 不要让计划变成"陈年旧账"，每个 Sprint 结束后归档到「历史 Sprint 回顾」。