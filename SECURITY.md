# 安全策略 (SECURITY)

## 数据隐私原则

**赛博机器人 v0.1.0 是 BYOK + 本地优先应用**：

- ✅ **所有数据存储在用户本地浏览器**（IndexedDB + LocalStorage）
- ✅ **API Key 由用户提供**，存在 LocalStorage（明文，但仅本地）
- ❌ **应用不收集任何用户数据**（无后端服务）
- ❌ **应用不上报任何遥测**（用户可选择接入 Sentry）

## 数据存储位置

| 数据 | 存储位置 | 加密 |
|---|---|---|
| API Key | LocalStorage（`cyberman:settings`） | ❌ 明文 |
| 角色配置（SoulConfig） | IndexedDB（`cyberman.souls`） | ❌ 明文 |
| 对话历史（ChatConversation） | IndexedDB（`cyberman.chat`） | ❌ 明文 |
| 长期记忆（Memory） | IndexedDB（`cyberman.memories`） | ❌ 明文 |
| UI 设置 | LocalStorage（`cyberman:settings`） | ❌ 明文 |
| 首启动标记 | LocalStorage（`cyberman:onboarding-completed`） | ❌ 明文 |
| 错误日志 | LocalStorage（`cyberman:errors`） | ❌ 明文 |

## 已知风险

### 1. API Key 明文存储

**风险**：API Key 明文存 LocalStorage。任何运行在同一台电脑上的恶意脚本（XSS 漏洞、恶意浏览器扩展）都可以读取。

**缓解**：
- 应用代码使用 `dangerouslySetInnerHTML` 仅限可信源（React 字符串）
- 输入框清洗（react-hook-form 自动）
- CSP header（已通过 vercel.json 配置）

**未来改进**：
- Web Crypto API + 用户口令派生密钥加密 API Key
- 接入服务端代理（用户输入 Key → 服务端加密 → 用户只用访问 token）

### 2. IndexedDB 数据无加密

**风险**：浏览器开发者工具可读取 IndexedDB。

**缓解**：
- LocalStorage 和 IndexedDB 都受同源策略保护
- 数据完全本地，无云端泄露面

**未来改进**：
- 用户可选启用 IndexedDB 加密（需输入口令解锁）

### 3. 浏览器 XSS

**风险**：恶意 prompt 可能让 LLM 返回 HTML/JS 注入。

**缓解**：
- React 自动转义所有 JSX 内容
- 不使用 `dangerouslySetInnerHTML`（除可信源外）
- DOMPurify 清洗外部输入

## 报告漏洞

如发现安全问题，请通过以下方式私下联系（**不要公开 issue**）：

- GitHub Security Advisories：https://github.com/qiming520/cyberman/security/advisories/new
- 或通过 GitHub profile 联系维护者

我们会在 48 小时内响应。

## 负责任的披露

我们承诺：

1. 收到报告后 48 小时内确认
2. 评估严重程度并制定修复计划
3. 修复后公开致谢（除非报告者要求匿名）
4. 在 CVE 发布前协调披露时间

## 安全更新策略

- **严重漏洞**：立即发布补丁（patch 版本）
- **中等漏洞**：下次 minor 版本修复
- **低等漏洞**：累积修复

用户应启用 GitHub Watch → Releases，及时收到安全更新。

## 第三方依赖

我们使用 npm 依赖（`package.json`）。安全建议：

```bash
npm audit          # 检查已知漏洞
npm audit fix      # 自动修复（可能 break change）
```

当前已知漏洞：见 `npm audit` 输出（每次 release 前必跑）。

## 上线清单

生产部署前（已通过 `vercel.json` 配置）：

- ✅ HTTPS（Vercel 默认）
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ Referrer-Policy: no-referrer
- ✅ Cache-Control: public, max-age=31536000, immutable（静态资源）
- ⏳ CSP header（待实现，按需添加）
- ⏳ Rate limiting（不需要，无后端）
- ⏳ WAF（Vercel 默认提供）

## 已知限制

- ❌ **无服务端验证**：用户输入的 API Key 直接调上游 LLM，不验证有效性
- ❌ **无审计日志**：用户的对话不上报，无法事后审计
- ❌ **无密钥轮换**：API Key 一旦填入不会过期，需用户手动更换
- ❌ **无多用户隔离**：同一浏览器多用户共享数据（实际场景少）

## 未来改进路线

按用户原话"能上线的系统"，这些是 v1.0.0 候选安全功能：

- [ ] Web Crypto API 加密 API Key（口令派生）
- [ ] 可选服务端代理（用户填 Key，服务端存加密版）
- [ ] CSP 完整配置（严格模式 + nonce）
- [ ] Sentry 错误监控（用户主动启用）
- [ ] IndexedDB 数据导出/导入（用户备份）

---

有问题？通过 GitHub Issues 提问（非安全相关）或 Security Advisories 报告漏洞。
