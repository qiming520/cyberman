import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite 配置 · 见 tech-design.md §3.2 / §12 / docs/perf-budget.md
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    // Sprint #11 优化：按 perf-budget.md 建议拆分 vendor chunk
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
    // 关闭生产 sourcemap（perf-budget.md 优化建议）
    sourcemap: false,
  },
});
