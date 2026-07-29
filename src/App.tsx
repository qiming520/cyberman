/**
 * M1-001 脚手架首屏
 *
 * 验证标准：
 * · dev server 能起得来（`npm run dev`）
 * · 首屏可见
 * · Tailwind 样式生效（深色背景 + 居中布局）
 */
export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">赛博机器人</h1>
        <p className="text-slate-400 text-lg">Cyberman · M1 脚手架运行中</p>
        <div className="text-sm text-slate-500 font-mono inline-block px-3 py-1 border border-slate-700 rounded">
          v0.0.1 · Sprint #1 / M1-001
        </div>
      </div>
    </main>
  );
}
