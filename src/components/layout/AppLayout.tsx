/**
 * 应用布局 · 顶部导航 + 内容区（Outlet）
 *
 * M14-003 移动端：< 768px 时 4 个导航按钮折叠为汉堡菜单
 *
 * 4 个主导航对应 PRD §2.4 信息架构：
 * - 首页（/）
 * - 角色工坊（/workshop）
 * - 聊天主厅（/chat）
 * - 设置中心（/settings）
 */
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Hammer, MessageCircle, Settings, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: '首页', icon: Home },
  { to: '/workshop', label: '工坊', icon: Hammer },
  { to: '/chat', label: '聊天', icon: MessageCircle },
  { to: '/settings', label: '设置', icon: Settings },
] as const;

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl">🤖</span>
            <span className="hidden sm:inline">赛博机器人</span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">v0.0.1</span>
          </div>

          {/* 桌面端：横排 4 个按钮（≥ md 768） */}
          <nav className="hidden md:flex items-center gap-1">
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

          {/* 移动端：汉堡按钮（< md 768） */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* 移动端：展开菜单 */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur">
            <div className="px-4 py-2 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
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
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between">
          <span>Cyberman · Sprint #4</span>
          <span className="font-mono">本地优先 · BYOK</span>
        </div>
      </footer>
    </div>
  );
}
