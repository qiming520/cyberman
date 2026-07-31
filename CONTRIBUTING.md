# 贡献指南 (CONTRIBUTING)

感谢你考虑为赛博机器人做贡献！本指南说明开发流程、代码规范和 PR 流程。

## 开发环境

- **Node.js**: 20.x LTS（推荐 20.18.3）
- **包管理**: npm（已配 `.npmrc` 默认指向公司内网镜像；外部访问需 `--registry https://registry.npmmirror.com`）
- **Playwright 浏览器**: `npm run e2e:install` 安装 chromium

## 开发流程

按 dev-process 强制 3 步：

### 1. 必读文档（开始任何工作前）

```bash
docs/
├── project-design-report.md   # PRD
├── tech-design.md             # 技术设计 + 6 个 ADR
├── dev-process.md             # 开发流程规范
├── dev-plan.md                # Sprint 计划
└── dev-log.md                 # 开发记录（每 Sprint 收尾 + 决策 + 教训）
```

### 2. Sprint 工作流

每个 Sprint 任务：
- ⚪ 待开始 → 🟡 进行中 → ✅ 已完成
- 每个任务结束前 → 强制执行 [dev-process §2.3 任务结束 checklist](docs/dev-process.md#23-任务结束-checklist)
- 三大必做：
  1. 写 Dev Log（✅ 进度 / 📌 决策 / 💡 教训）
  2. 更新 Dev Plan（状态变更）
  3. 自检（决策 / 教训 / 后续任务）

### 3. PR 流程

1. 从 `main` 创建 feature 分支：
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. 提交前必跑：
   ```bash
   npm run typecheck
   npm run build
   npm run e2e          # dev mode
   node e2e/verify-production.mjs --no-server  # production
   ```

3. 推送并创建 PR：
   ```bash
   git push origin feat/your-feature-name
   ```
   GitHub Actions 会自动跑 CI。必须全 pass 才能 merge。

4. PR 描述需包含：
   - 关联的 Sprint 任务（dev-plan.md 里的 Mxx-xxx）
   - 测试截图（如果涉及 UI）
   - 任何重大决策的引用（dev-log.md 条目）

## 代码规范

### TypeScript

- `strict: true` + `noUnusedLocals` + `noUnusedParameters`（已配）
- 避免 `any`；必要时用 `unknown` + 类型守卫
- 所有公共 API 需有 JSDoc 注释

### React

- 函数组件 + Hooks（无 class 组件）
- Props 用 TypeScript interface 定义（无 PropTypes）
- 避免 inline 函数 + 对象（用 useMemo / useCallback）
- 状态管理：本地 state + zustand（无 Redux）

### 文件命名

- 组件：`PascalCase.tsx`
- Hooks / Utils：`camelCase.ts`
- Stores：`camelCase.ts`（zustand `useXxxStore`）
- 测试：`xxx.spec.ts` 或 `xxx.test.ts`

### 提交信息（Conventional Commits）

```
feat(scope): 简明描述（新功能）
fix(scope): 简明描述（bug 修复）
docs(scope): 简明描述（仅文档）
chore(scope): 简明描述（构建/工具）
refactor(scope): 简明描述（重构）
test(scope): 简明描述（仅测试）

示例：
feat(scene): M5-001 精细化 3D 角色（脖子+面部细节）
fix(chat): 修复 stream chunk 重复问题
docs: 更新 CHANGELOG v0.1.0
```

## 测试

- **单元测试**：Vitest（每个 store / 关键 util 加 `xxx.test.ts`）
- **E2E 测试**：Playwright（`e2e/smoke.mjs` + `e2e/verify-production.mjs`）
- **视觉验证**：所有 UI 改动必须在 prod 截图证据

## 架构决策（ADR）

重大技术决策必须在 `docs/dev-log.md` 记录：
- 📌决策：为什么选 X 而不是 Y
- 💡教训：踩过什么坑
- 关联任务：Mxx-xxx

## 提交前 checklist

- [ ] `npm run typecheck` 通过
- [ ] `npm run build` 成功
- [ ] `npm run e2e` 全 pass（dev mode）
- [ ] `node e2e/verify-production.mjs` 全 pass（production）
- [ ] Dev Log 已写（新增决策 / 教训）
- [ ] Dev Plan 已更新（任务状态变更）
- [ ] Commit 信息符合 Conventional Commits
- [ ] PR 描述包含关联 Sprint 任务

## 发布流程

1. 更新 `package.json` 的 `version` 字段（语义化版本）
2. 更新 `CHANGELOG.md` 新增版本条目
3. 创建 git tag：`git tag -a vX.Y.Z -m "Release vX.Y.Z"`
4. 推送 tag：`git push origin vX.Y.Z`
5. GitHub Actions 自动创建 release

## 行为准则

- 尊重不同意见
- 优先考虑社区利益
- 接受建设性批评
- 关注对用户最有利的事

## 联系方式

- Issues：GitHub Issues
- Discussions：GitHub Discussions
- Email：通过 GitHub profile 联系维护者

---

再次感谢你的贡献！🚀
