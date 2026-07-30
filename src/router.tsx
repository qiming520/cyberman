/**
 * 路由配置 · 见 tech-design.md §3.2
 *
 * 当前实现（v7.18.2）：与 Tech Design §3.2 规划的 v6 API 兼容；
 * 详见 Dev Log 2026-07-29「M1-002 启动」中的偏差说明。
 */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
// ScenePage 改 lazy import：避免 Vite 在初始 bundle 链入 R3F（dev mode 有 createReconciler bug）
// 用户访问 /scene 时才下载 + 初始化 R3F（production build 完全 OK）
const ScenePage = lazy(() =>
  import('./pages/ScenePage').then((m) => ({ default: m.ScenePage }))
);
import { HomePage } from './pages/HomePage';
import { WorkshopPage } from './pages/WorkshopPage';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';

function SceneFallback() {
  return (
    <div className="h-[calc(100vh-7rem)] flex items-center justify-center text-slate-500 text-sm">
      加载 3D 场景…
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Sprint #4：/ 改为 ScenePage（3D 沉浸式首页）
      // 旧页面仍可达（通过 /workshop / /chat / /settings 跳转）
      { index: true, element: <Suspense fallback={<SceneFallback />}><ScenePage /></Suspense> },
      { path: 'characters', element: <HomePage /> },
      { path: 'workshop', element: <WorkshopPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'chat/:soulId', element: <ChatPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
