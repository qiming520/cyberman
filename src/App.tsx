/**
 * App 入口 · M1-002 改造为 RouterProvider
 *
 * M1-001: 单页占位
 * M1-002: React Router 7 路由 + 4 个页面骨架
 */
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return <RouterProvider router={router} />;
}
