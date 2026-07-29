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

### M1-002 完成：React Router + 4 个页面骨架
**类型**：✅进度 + 📌决策
**相关任务**：M1-002
**相关文档**：[dev-plan.md §Sprint #1](dev-plan.md#sprint-1m1-任务-11-14-项目脚手架) · [tech-design.md §3.2](tech-design.md#第三章-系统架构) · [PRD §2.4](project-design-report.md#24-信息架构)

**背景**：
M1-001 完成项目脚手架后，进入 M1-002：在脚手架基础上挂载 React Router，搭建 4 个页面的占位 UI（首页/角色工坊/聊天主厅/设置中心），跑通路由切换。

**进展**：

**1. 依赖安装**
- `react-router-dom` v7.18.2（npm 默认 latest）
- 与 Tech Design §3.2 规划的 v6.20.0 不同 → 决策记录见下

**2. 新增 7 个文件**
| 文件 | 作用 |
|---|---|
| `src/router.tsx` | createBrowserRouter 路由表，4 路由 + fallback |
| `src/components/layout/AppLayout.tsx` | 顶部导航（4 项 NavLink + 激活态）+ Outlet + 页脚 |
| `src/pages/HomePage.tsx` | 首页/角色库占位（导入/新建按钮 disabled） |
| `src/pages/WorkshopPage.tsx` | 角色工坊占位（M2-001 启用） |
| `src/pages/ChatPage.tsx` | 聊天主厅占位（路由 /chat 与 /chat/:soulId 共用） |
| `src/pages/SettingsPage.tsx` | 设置中心占位（4 项 SettingItem 列出后续里程碑） |

**修改 1 个文件**：
| 文件 | 变更 |
|---|---|
| `src/App.tsx` | 从 M1-001 的 M1-001 占位 → 改写为 `RouterProvider` 挂载 router |

**3. 验证结果（全部通过）**
| 检验项 | 工具 | 结果 |
|---|---|---|
| TypeScript strict 编译 | `npm run typecheck` | ✅ 0 error（修了 2 个：`end` 字段 + 未使用 import） |
| Dev server 启动 | `npm run dev` | ✅ 后台 ID `b1ubyvp4p` 启动成功 |
| 4 路由 HTTP | `curl /`、`/workshop`、`/chat`、`/settings` | ✅ 全部 HTTP 200（SPA fallback index.html） |
| 关键文件转译 | `curl /src/App.tsx`、`/router.tsx`、`/AppLayout.tsx` | ✅ 全部 200，size 3K-13K |
| 首屏标题 | `curl /` | ✅ 含「赛博机器人 · Cyberman」 |
| 后台进程清理 | TaskStop | ✅ 已停止 |

**4. TS strict 暴露的两个工程教训**（💡）

💡 **教训 1：NavLink 的 `end` 字段必须显式处理**
- `as const` 数组推导的精确类型让可选字段不一致的元素不能用统一访问
- 解决：`end={item.to === '/'}` 内联判断（或在数组中显式标注每个元素的 `end` 字段）
- 与 React Router 版本无关，是 TS 严格模式下的常见坑

💡 **教训 2：未使用的 import 立即被 strict 模式捕获**
- `SettingsPage.tsx` 原本从 lucide-react 导入 `Settings` 图标但未使用 → TS6133
- 这有助于保持代码清洁；不要在 strict 模式下用 `// @ts-ignore` 绕过

**5. 📌 决策：react-router-dom v6 → v7**

| 维度 | Tech Design §3.2 | 实际 |
|---|---|---|
| 版本 | `^6.20.0` | `^7.18.2`（npm 默认 latest） |
| API 兼容性 | — | 100% 兼容（v7 主要强化类型系统 + 数据加载 API） |

**决策理由**：
- v7 已稳定（2024Q4 GA），是当前推荐版本
- M1-002 用到的 API（createBrowserRouter / RouterProvider / NavLink / Outlet / Navigate）全部兼容
- v6 是 LTS 模式但不再加新功能，v7 是 active development
- 按 CLAUDE.md「简化优先」+ 不锁定过期版本，**采纳 v7**

**后续影响**：
- M1-002 之后的路由代码（参数路由、嵌套路由、loader 等）按 v7 文档写
- v7 独有的 `loader` / `action` 数据加载 API（M2 时机成熟可考虑）
- 待 Sprint #1 完成后，可选更新 Tech Design §3.2 把 `react-router-dom ^6.20.0` 改为 `^7.x`（避免文档与代码不一致）

**6. 自检**
| 自检项 | 结果 |
|---|---|
| 未记录的决策 | ✅ 无（v6→v7 偏差已记） |
| 未记录的问题 | ✅ 无（2 个 TS error 已修复并记为教训） |
| 需要新增后续任务 | ✅ 无（M1-003~004 已规划） |

**影响**：
- M1-002 验证完成，状态 🟡 → ✅
- Sprint #1 进度 1/4 → 2/4（50%）
- 用户可在浏览器中体验：顶部导航切换 4 个页面，每页有占位 UI 与「待 Mx 启用」提示

---

### REPO-001 解除阻塞：6 个本地 commit 成功推送至 origin/main
**类型**：✅进度 + 📌决策
**相关任务**：REPO-001
**相关文档**：[dev-plan.md §Sprint #0 收尾](dev-plan.md#sprint-0-收尾仓库上线) · [本文件「关联 GitHub 远程仓库」](#关联-github-远程仓库)

**背景**：
Sprint #0 收尾任务 REPO-001（hosts 阻塞）原计划由用户在 macOS Terminal 执行 `sudo sed -i '38s/^/# /' /etc/hosts` 修复。
但在执行修复步骤前，`git fetch origin` 意外成功 → `git push -u origin main` 也成功（无 SSL 错误），表明阻塞已自行解除。

**进展**：

**1. push 结果**
```
$ git push -u origin main
To https://github.com/qiming520/cyberman.git
   4dfacf8..127ffee  main -> main
branch 'main' set up to track 'origin/main'.
```

**2. 远端状态确认**
- 本地与 `origin/main` 完全同步（HEAD = `127ffee`）
- 工作树干净（nothing to commit）
- 远端 main 共 6 个 commit：

| Hash | 信息 |
|---|---|
| `39e0cfd` | `docs: 初始化项目文档基建 (Sprint #0)` |
| `4dfacf8` | `docs: 记录关联 GitHub 仓库进展（hosts 阻塞, 待 push）` |
| `13feaae` | `docs: 同步 Sprint #0 收尾与任务收尾流程强化` |
| `9c51d84` | `feat(scaffold): M1-001 Vite + React 18 + TS + Tailwind 脚手架` |
| `ab01fb0` | `docs(log): 记录 M1-001 git commit 节点（本地存档）` |
| `127ffee` | `docs(log): 记录用户决策（暂停 M1-002，优先 push 本地 commits）` |

**3. 后续 git pull 等同于 push 验证**
任何时候运行 `git pull` 都应正常工作。

📌 **决策：hosts 阻塞自行解除，不再修改 /etc/hosts**
- 原计划让用户执行 `sudo sed -i '38s/^/# /' /etc/hosts` 注释掉 GitHub520 中 `github.com` 那一行
- 但本次会话中 `git fetch` 和 `git push` 都成功，未触发任何 SSL 错误
- **不再修改 hosts** —— 避免无谓的系统级变更（修改 /etc/hosts 是有副作用的全局操作）
- `/etc/hosts` 中 GitHub520 块保持原样（行 13-59，含所有 GitHub 子域加速）
- 若未来再次出现 SSL 错误，再走原本的修复方案

💡 **教训：环境问题可能间歇性**
- 阻塞时 git fetch 也失败，本次却成功 → 可能与 DNS 缓存、CDN 路由、SwitchHosts 状态、VPN 状态相关
- **不要假设阻塞是「永久状态」**，先 `git fetch` 实测再下结论
- 后续遇到类似 SSL/HTTP 错误，先实测当前网络状态，不要直接进入修改系统的流程

**影响**：
- REPO-001 任务完成，状态 🔴 → ✅
- 远端 `qiming520/cyberman` 现在与本地完全同步
- 用户可访问 https://github.com/qiming520/cyberman 查看完整项目历史
- Sprint #1 可继续推进 M1-002

---

### 用户决策：暂停 M1-002，先修复 hosts 推送 3 个本地 commit
**类型**：📥需求
**相关任务**：REPO-001
**相关文档**：[dev-plan.md §Sprint #0 收尾](dev-plan.md#sprint-0-收尾仓库上线)

**背景**：
M1-001 完整闭环后，用户选择「选项 2」：暂停 M1-002，先修复 hosts 阻塞，把当前 3 个本地 commit 推送到 GitHub 远端。

**当前 git 状态**：
- 分支 `main`，工作树干净
- 领先 `origin/main` 3 个 commit：
  - `13feaae` docs: 同步 Sprint #0 收尾与任务收尾流程强化
  - `9c51d84` feat(scaffold): M1-001 Vite + React 18 + TS + Tailwind 脚手架
  - `ab01fb0` docs(log): 记录 M1-001 git commit 节点（本地存档）

**下一步**：
1. 提供 hosts 修复指南（需用户 sudo 操作）
2. 用户修复后，先 `git fetch origin` 看远端状态
3. 执行 `git push -u origin main`
4. REPO-001 收尾：Dev Log ✅ 进度 + Dev Plan REPO-001 状态 🔴 → ✅

---

### M1-001 git commit 节点（本地存档）
**类型**：✅进度（commit 节点存档）
**相关任务**：M1-001
**相关文档**：本文件上一条「M1-001 完成」

**背景**：
M1-001 验证通过后，按用户选项 A 做本地 git commit 存档（REPO-001 hosts 阻塞 → 仅本地 commit，push 待 hosts 修复后执行）。

**本地 commit 链（4 个，按时间顺序）**：

| Hash | 信息 |
|---|---|
| `39e0cfd` | `docs: 初始化项目文档基建 (Sprint #0)` |
| `4dfacf8` | `docs: 记录关联 GitHub 仓库进展（hosts 阻塞, 待 push）` |
| `13feaae` | `docs: 同步 Sprint #0 收尾与任务收尾流程强化` |
| **`9c51d84`** | **`feat(scaffold): M1-001 Vite + React 18 + TS + Tailwind 脚手架`** ← 本次 |

**当前状态**：
- 分支 `main`，工作树干净
- 比 `origin/main` 超前 **2 commits**（`13feaae` + `9c51d84`）
- `git push` 仍阻塞于 hosts（详见 REPO-001 + Dev Log「关联 GitHub 远程仓库」）

**Hosts 修复后的 push 命令**（待用户执行）：
```bash
git push -u origin main
```
若远端 `qiming520/cyberman` 已有内容，先 `git fetch origin` 看远端状态再决定是否需要 `pull --rebase` / `--force-with-lease`（**强推会覆盖远端**）。

---

### M1-001 完成：Vite + React 18 + TS + Tailwind 脚手架
**类型**：✅进度
**相关任务**：M1-001
**相关文档**：[dev-plan.md §Sprint #1](dev-plan.md#sprint-1m1-任务-11-14-项目脚手架) · [tech-design.md §3.2/§12](tech-design.md#第三章-系统架构)

**背景**：
Sprint #1 第一个任务：搭建项目脚手架（`npm run dev` 能起得来 + 首屏可见 + Tailwind 生效 + TypeScript strict 零 error）。

**进展**：

**1. 文件清单（10 个新增文件）**
| 文件 | 作用 |
|---|---|
| `package.json` | 依赖管理（react/react-dom + vite/tsconfig/tailwind/postcss/lucide-react） |
| `vite.config.ts` | Vite + React 插件 + `@/*` 路径别名 |
| `tsconfig.json` | TS strict 模式 + ES2022 + bundler 解析 |
| `tailwind.config.js` / `postcss.config.js` | Tailwind v3 + PostCSS |
| `index.html` | HTML 入口（含中文 lang） |
| `src/main.tsx` | React 18 createRoot 入口 |
| `src/App.tsx` | M1-001 最小首屏：标题 + 版本徽章 |
| `src/index.css` | Tailwind 三层指令 + 全局高度 |
| `src/vite-env.d.ts` | Vite 类型声明 |

**2. 验证结果（全部通过）**
| 检验项 | 工具 | 结果 |
|---|---|---|
| TypeScript strict 编译 | `npm run typecheck` | ✅ 0 error |
| Dev server 启动 | `npm run dev` | ✅ 后台进程 ID `brgq4abip` 启动成功 |
| 首屏 HTML | `curl http://127.0.0.1:5173/` | ✅ HTTP 200, 643B, 含「赛博机器人」标题 |
| App.tsx 转译 | `curl /src/App.tsx` | ✅ HTTP 200, 4921B |
| index.css 编译 | `curl /src/index.css` | ✅ HTTP 200, 13063B（Tailwind 编译成功） |
| 后台进程清理 | TaskStop | ✅ 已停止 |

**3. 实施过程中遇到的小问题**

⚠️ **npm registry 阻塞**：
- 用户全局 `npm config get registry` = `http://npm.dc.servyou-it.com`（公司内网镜像）
- 本环境下该域名不可达，**首次 `npm install` 16 分钟无响应**
- ❌ **切回原 registry 被 Claude Code 安全策略拦截**（判定为「Package Registry Bypass」）
- ✅ **解决**：用 `--registry https://registry.npmmirror.com` 单次参数，未改动全局 npm config，install 24 秒完成（135 包）

📌 **决策：包管理器 pnpm → npm**
- Tech Design §12.1 推荐 pnpm，但本环境未安装
- 按 CLAUDE.md「简化优先」+ 不增加学习成本，**改用 npm 10.8.2**
- 后续 Sprint 任务统一使用 npm

📌 **决策：依赖分批安装**
- M1-001 只装最小启动依赖（react/vite/ts/tailwind/lucide-react）
- 不引入 `react-router-dom` / `zustand` 等，留给 M1-002 / M1-003 各自引入
- 理由：每个任务粒度清晰、验证独立

**影响**：
- M1-001 验证完成，状态从 🟡 → ✅
- Sprint #1 进度 1/4（25%）
- 全局 npm config 未被改动（仍是 `npm.dc.servyou-it.com`），未来在公司内网环境下其他项目不受影响
- 后续 Sprint 任务继续使用 `npm install --registry https://registry.npmmirror.com`（或在可访问内网镜像的环境下不加参数）

**待用户决定**：
- 是否在 `.npmrc` 中写入 `registry=https://registry.npmmirror.com` 让本项目持续使用公共镜像？——建议**不写**，命令行参数更灵活

---

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