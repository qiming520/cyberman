/**
 * 路由配置 · 见 tech-design.md §3.2
 *
 * 当前实现（v7.18.2）：与 Tech Design §3.2 规划的 v6 API 兼容；
 * 详见 Dev Log 2026-07-29「M1-002 启动」中的偏差说明。
 */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { WorkshopPage } from './pages/WorkshopPage';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'workshop', element: <WorkshopPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'chat/:soulId', element: <ChatPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
