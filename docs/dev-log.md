# 赛博机器人（Cyberman）开发记录

**文档版本**：v1.1
**编制日期**：2026-07-29
**配套文档**：[项目设计报告](project-design-report.md) · [技术设计文档](tech-design.md) · [开发流程规范](dev-process.md) · [开发计划表](dev-plan.md)

---

## 使用说明

按日期倒序排列（最新在上）。每次开发/决策/问题都按以下格式记录：

```markdown
## [YYYY-MM-DD] [一句话标题]

**类型**：📌决策 | ⚠️问题 | 💡教训 | ✅进度 | 📥需求 | 🔄同步
**相关任务**：[关联的 Dev Plan 任务 ID] 或 [无]
**相关文档**：[关联的 PRD/Tech Design 章节] 或 [无]

**背景**：[为什么会有这件事]
**决策/发现/进展**：[具体内容]
**影响**：[影响了哪些文件/计划]
```

---

## 2026-07-29

### 关联 GitHub 远程仓库
**类型**：🔄同步
**相关任务**：REPO-001（详见 [Dev Plan §Sprint #0 收尾](dev-plan.md#sprint-0-收尾仓库上线)）
**相关文档**：本文件 · [.gitignore（新增）](../.gitignore) · [dev-plan.md](dev-plan.md)

**背景**：
用户指示把本项目关联到 `https://github.com/qiming520/cyberman.git`，建立版本控制与远端备份。

**已完成（不依赖网络的本地部分）**：
- 新增项目根目录 [.gitignore](../.gitignore)，预置以下规则，避免 Sprint #1 引入 Vite/Node 后误提交：
  - `node_modules` / `dist`（构建依赖与产物）
  - `.env` / `.env.*`（防止 API Key 等敏感信息泄漏）
  - `.DS_Store`（macOS 干扰文件）
- `git init -b main` 初始化仓库，分支 `main`
- 一次 commit `39e0cfd` 落库：`docs: 初始化项目文档基建 (Sprint #0)`（.gitignore + 5 份文档，共 6 文件 / 3993 行）
- `git remote add origin https://github.com/qiming520/cyberman.git` 已配置

**⚠️ 问题：从此环境无法 push**
诊断：
```
$ git push -u origin main
fatal: unable to access 'https://github.com/qiming520/cyberman.git/':
SSL: no alternative certificate subject name matches target host name 'github.com'
```
根因：`/etc/hosts` 中 SwitchHosts/GitHub520 把 `github.com` 指向 `152.32.215.247`，但该 IP 实际返回的 TLS 证书 `CN=raw.hellogithub.com`，**不签给 github.com** —— curl 与 git 均死在 SSL 校验阶段。
这是 hosts 过期或被中间设备改写的环境问题，**不在本次任务范围**。

**影响**：
- 本地仓库已就绪、`origin` 已加；用户修复 hosts（重新拉 GitHub520 / 删除该块 / 临时注释掉 `github.com` 行）后只需 `git push -u origin main` 一次即可
- 若远端 `qiming520/cyberman` 已存在并有内容（如初始 README），push 会因非快进而失败；届时先 `git fetch origin` 看远端状态再决定 pull / rebase / `--force-with-lease`（**强推会覆盖远端，使用前请先确认远端无重要内容**）
- 已在 [dev-plan.md](../dev-plan.md) 新增 REPO-001 任务，状态 🔴，阻塞原因同上

**后续任务**：
- 用户修复 hosts 后执行 push；成功后在本文档追加 `## 2026-07-29 仓库上线确认` 条目归档
- 是否把「首次 push 失败」的处置写进 [dev-process.md](dev-process.md) 作为典型阻塞样例 —— 待用户决定

---

### 强化任务收尾流程：明确每次结束必须做的事
**类型**：📌决策
**相关任务**：无（流程规范强化）
**相关文档**：[dev-process.md §2.3](dev-process.md#23-任务结束-checklist) · [dev-plan.md §任务收尾提醒](dev-plan.md#-任务收尾提醒)

**背景**：
虽然 dev-process.md §3.1 与 §3.2 已经分别规定了 Dev Log 和 Dev Plan 的更新时机，但用户明确要求：**每次开发任务结束后，必须更新对应的开发计划表和开发记录**。
这个诉求本质上是把「任务结束」作为一个独立动作，明确其强制闭环。

**决策**：
新增 [dev-process.md §2.3 任务结束 checklist](dev-process.md#23-任务结束-checklist)，规定每个任务结束（无论成功/失败/阻塞/取消）必做 3 件事：
1. 写 Dev Log（✅进度 / ⚠️问题 / ❌取消）
2. 更新 Dev Plan（状态 → ✅/🔴/❌ + 验证结果）
3. 自检（补遗决策/问题/后续任务）

同步在 [dev-plan.md 顶部](dev-plan.md#-任务收尾提醒) 加一节「⚠️ 任务收尾提醒」引用 §2.3，让每个 Sprint 任务都继承这条规则。

**影响**：
- 所有后续任务（M1-001 起）执行完毕后，必须立即执行收尾 checklist；
- Sprint 任务行将逐步积累 ✅ 标记与验证结果；
- 不允许「做完就忘」。

---

### Sprint #0 完成：文档基建
**类型**：✅进度
**相关任务**：DOC-001 ~ DOC-007
**相关文档**：[开发计划表 §Sprint #0](dev-plan.md#sprint-0项目立项与文档基建)

**背景**：
Sprint #0 目标：完成全部 5 份文档，建立后续开发的文档基础。

**进展**：
- ✅ 项目设计报告（PRD）—— 8 章，灵魂/记忆/多模态/路线图/风险
- ✅ 技术设计文档 —— 13 章，6 个 ADR + API/Schema/算法/测试/部署
- ✅ PRD 中加上 tech-design 交叉引用
- ✅ 开发流程规范 —— 5 章，文档矩阵/读取流程/记录时机/变更控制
- ✅ 开发计划表 —— Sprint #0 与 Sprint #1 已规划
- ✅ 开发记录（含本条）—— 含立项 + 选型 + Sprint #0 启动记录
- ✅ PRD/Tech Design 中加新文档交叉引用

**影响**：
- 项目进入可实施状态
- 所有后续开发严格遵循 Dev Process §2 的读取流程
- Sprint #1（M1-001 ~ M1-004）等待用户启动

---

### 项目立项：确认目标平台与产品形态
**类型**：📥需求
**相关任务**：DOC-001
**相关文档**：[项目设计报告 §1.4](project-design-report.md#14-项目范围与边界)

**背景**：
用户提出做一个"赛博机器人"应用：用户可配置机器人的大脑/嘴巴/眼睛/耳朵，并定制灵魂（姓名/性别/年龄/性格/爱好/知识库），最终可与机器人进行多模态交流（女友/男友/小孩/宠物等）。

**决策**：
经与用户对齐 4 个关键方向：
1. **目标平台**：Web 端（PC 浏览器）
2. **模型策略**：BYOK（用户自带 API Key）
3. **MVP 角色**：通用多角色（女友/男友/朋友/宠物…）
4. **合规要求**：仅做技术 Demo / 个人项目，不上线商用

**影响**：
- 确定项目为纯前端 SPA
- 无需考虑合规审核、算法备案
- 用户自带 API Key，应用方不接触计费
- 决定技术栈向「轻量、灵活、易部署」倾斜

---

### 立项文档结构确定
**类型**：📌决策
**相关任务**：DOC-001, DOC-002, DOC-004, DOC-005, DOC-006
**相关文档**：本文件及全部 docs/

**背景**：
用户希望项目有完整的文档体系支撑实施。

**决策**：
确定 5 份核心文档的职责分工：
| 文档 | 回答的问题 |
|---|---|
| PRD（项目设计报告） | 做什么 & 为什么 |
| Tech Design（技术设计文档） | 怎么做 & 怎么做好 |
| Dev Process（开发流程规范） | 按什么流程做 |
| Dev Plan（开发计划表） | 现在做什么 & 做到哪了 |
| Dev Log（开发记录，本文件） | 过去发生了什么 & 为什么 |

**影响**：
- 后续每次开发都要先读 Dev Plan + 最近 10 条 Dev Log + 按需读 PRD/Tech Design
- 每次决策/问题/教训都要写 Dev Log
- PRD/Tech Design 的变更要在 Dev Log 留痕

---

### 技术栈选型
**类型**：📌决策
**相关任务**：DOC-002
**相关文档**：[技术设计文档 第二章 ADR](tech-design.md#第二章-架构决策记录-adr)

**背景**：
确定 Web 端 + BYOK + 通用多角色 + 个人 Demo 的技术方向后，需要选定具体技术栈。

**决策**（6 个 ADR）：
1. **Vite + React 18 + TypeScript**：生态成熟、HMR 体验好、AI 集成顺畅
2. **Vercel AI SDK**：统一多 provider 接口、流式原生、工具调用支持
3. **LanceDB (WASM)**：浏览器向量库、IndexedDB 后端、零外部依赖
4. **IndexedDB + LocalStorage**：双层存储，按数据特征分工
5. **不引入后端**：BYOK 直连，最大化本地化与开发速度
6. **Zustand**：轻量状态管理，TS 友好

**影响**：
- M1 任务 1.1 脚手架需安装上述依赖
- 未来扩展 LLM/TTS/ASR Provider 通过适配层对接 AI SDK
- 长期事实与对话历史持久化方案已锁定

---

### Sprint #0 完成：文档基建
**类型**：✅进度
**相关任务**：DOC-001 ~ DOC-007
**相关文档**：[开发计划表 §Sprint #0](dev-plan.md#sprint-0项目立项与文档基建)

**背景**：
Sprint #0 目标：完成全部 5 份文档，建立后续开发的文档基础。

**进展**：
- ✅ 项目设计报告（PRD）—— 8 章，灵魂/记忆/多模态/路线图/风险
- ✅ 技术设计文档 —— 13 章，6 个 ADR + API/Schema/算法/测试/部署
- ✅ PRD 中加上 tech-design 交叉引用
- ✅ 开发流程规范 —— 5 章，文档矩阵/读取流程/记录时机/变更控制
- ✅ 开发计划表 —— Sprint #0 + Sprint #1 已规划
- 🟡 开发记录（本文件）—— 含立项 + 选型 + Sprint 启动记录
- ⚪ 在 PRD/Tech Design 中加新文档交叉引用（同步进行）

**影响**：
- 项目进入可实施状态
- 所有后续开发严格遵循 Dev Process §2 的读取流程

---

## 文档变更记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-07-29 | 初版，含项目立项、文档结构、技术选型、Sprint #0 启动 |
| v1.1 | 2026-07-29 | 新增「关联 GitHub 远程仓库」同步记录；记录 hosts 阻塞与本地 commit 状态 |

---

**文档结束**

> 记录的代价很低，遗忘的代价很高。
> 一行记录，可能在三个月后救你一命。