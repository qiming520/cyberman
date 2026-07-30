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
| M1-006 | 单角色文本对话（Vercel AI SDK + 流式输出） | ⚪ | 4h | 真实 LLM 调用；流式回复；Provider/Model 选择 | 见 PRD §4.3 / Tech Design §4.2 |
| M1-007 | 对话历史持久化（IndexedDB） | ⚪ | 3h | 刷新后历史仍在；按 soulId 查询 | 见 Tech Design §5.1 / PRD §2.4 |

**Sprint 进度**：3/4 完成（75%）

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