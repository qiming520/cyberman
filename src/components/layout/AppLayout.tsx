/**
 * 应用布局 · 顶部导航 + 内容区（Outlet）
 *
 * 4 个主导航对应 PRD §2.4 信息架构：
 * - 首页 / 角色库（/）
 * - 角色工坊（/workshop）
 * - 聊天主厅（/chat）
 * - 设置中心（/settings）
 */
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Hammer, MessageCircle, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: '首页', icon: Home },
  { to: '/workshop', label: '工坊', icon: Hammer },
  { to: '/chat', label: '聊天', icon: MessageCircle },
  { to: '/settings', label: '设置', icon: Settings },
] as const;

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl">🤖</span>
            <span>赛博机器人</span>
            <span className="text-xs text-slate-500 font-mono">v0.0.1</span>
          </div>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60',
                  ].join(' ')
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between">
          <span>Cyberman · M1 / Sprint #1</span>
          <span className="font-mono">本地优先 · BYOK</span>
        </div>
      </footer>
    </div>
  );
}
