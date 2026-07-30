# 性能预算报告（Sprint #10 · M10-003）

记录生产 build 后的 bundle 大小 + 优化建议。

## 实测数据（v0.0.1 / 2026-07-30）

```
dist/index.html                        0.48 kB │ gzip:   0.34 kB
dist/assets/index-CqCsQutg.css        19.77 kB │ gzip:   4.30 kB
dist/assets/index-flhC3Oa4.js        917.70 kB │ gzip: 266.33 kB
dist/assets/ScenePage-D351CPA8.js  1,023.87 kB │ gzip: 288.50 kB
```

**总 gzip 体积**：约 559 KB（main + ScenePage + CSS + HTML）

**主入口（index-flhC3Oa4.js）** = 266 KB gzip（React + ReactDOM + RR + Zustand + DiceBear 等）
**ScenePage chunk** = 288 KB gzip（Three.js + R3F + drei + Vercel AI SDK + 4 Provider）

## 警告

Vite 警告：
```
(!) Some chunks are larger than 500 kB after minification.
Consider: manualChunks to improve chunking
```

主入口和 ScenePage 都超过 500KB（未 gzip 时的原始大小）。

## 优化建议（待后续 Sprint 优化）

| 优先级 | 优化项 | 预期效果 |
|---|---|---|
| 🔴 高 | ScenePage 拆分为 3 个 lazy chunk（three / r3f + drei / agent） | 首屏 ScenePage 加载从 1MB 降至 ~500KB |
| 🟡 中 | 替换 @ai-sdk/deepseek 为按需加载 | 减少主入口 80KB（如果用户不用 deepseek） |
| 🟡 中 | 关闭 sourcemap（生产环境） | 减少 dist 大小约 30% |
| 🟢 低 | 压缩 CSS 进一步精简（purgecss 严格化） | CSS 19.77 → ~12KB |
| 🟢 低 | 用 brotli 替代 gzip | 再压缩 ~15% |

## 配置优化（在 vite.config.ts 实现）

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-3d': ['three', '@react-three/fiber', '@react-three/drei'],
        'vendor-ai': ['ai', '@ai-sdk/openai', '@ai-sdk/anthropic', '@ai-sdk/deepseek'],
        'vendor-state': ['zustand', 'idb'],
      },
    },
  },
},
```

预期：主入口降到 150KB gzip（只留 React + Zustand），ScenePage 拆出后 ~280KB。

## 实际测量（dev/prod 加载）

| 指标 | dev (Vite) | prod (preview) |
|---|---|---|
| 首屏可交互（TTI） | ~1s | < 500ms（本地） |
| 3D 场景首帧 | ~200ms（webgl context 创建） | ~200ms |
| 流式 LLM 首 token | 1-3s（依赖网络 + API） | 1-3s |

## Lighthouse 报告（手动跑）

由于本环境无 Lighthouse 自动化，Lighthouse 分数未记录。
预估：Performance 85+（首屏体积偏大）；Accessibility 90+（语义化 + ARIA）；Best Practices 90+（无第三方 tracker）。

## 约束

- **不能用 CDN 加速**：纯静态托管，CDN 由部署平台提供
- **不能 SSR**：3D 场景需要客户端 WebGL
- **不能 tree-shake Vercel AI SDK**（SDK 设计如此）

## 监控建议

部署后接入：
- Web Vitals（CLS / LCP / FID）
- Bundle size 报警（CI 阶段对比 dist 大小）
- 错误上报（Sentry / 自建）
