/**
 * Production build E2E 验证（Sprint #3）
 *
 * 用途：Vite dev mode + R3F v8 有已知兼容 bug（page error in createReconciler）
 * 但 production build 正常。本脚本验证 production 模式下 3D 真实渲染。
 *
 * 跑法：先 `npm run build`，然后 `node e2e/verify-production.mjs`（会自启 preview server）
 * 或：用 `node e2e/verify-production.mjs --no-server`（假定 preview server 已在 4173 跑）
 */
import { chromium } from 'playwright';

const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;
const shouldStartServer = !process.argv.includes('--no-server');

let server = null;
if (shouldStartServer) {
  // 用 spawn 启动 vite preview
  const { spawn } = await import('node:child_process');
  server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT)], {
    stdio: 'pipe',
  });
  // 等 server 起来
  await new Promise((resolve) => {
    let output = '';
    server.stdout.on('data', (d) => {
      output += d.toString();
      if (output.includes('Local:')) resolve();
    });
    setTimeout(resolve, 5000);  // fallback
  });
  console.log('✓ vite preview 已启动');
}

const browser = await chromium.launch({
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on('pageerror', err => errors.push(err.message));

console.log(`访问 ${BASE}/scene ...`);
await page.goto(BASE + '/scene', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

let pass = 0, fail = 0;
const check = (name, ok) => {
  console.log(`  ${ok ? '✓' : '✗'} ${name}`);
  if (ok) pass++; else fail++;
};

const canvasInfo = await page.evaluate(() => {
  const canvases = document.querySelectorAll('canvas');
  return Array.from(canvases).map(c => ({ width: c.width, height: c.height }));
});
check('Canvas 元素已创建（>=1）', canvasInfo.length >= 1);
// ScenePage 嵌在 AppLayout 里，受 padding/margin 影响，Canvas 尺寸 < 1440 但应 > 1000
check('Canvas 尺寸合理（>1000px 宽，证明渲染中）', canvasInfo[0]?.width > 1000);
check('无 page error', errors.length === 0);

await page.screenshot({ path: 'e2e/screenshots/production-3d-verified.png' });
console.log(`📸 截图：e2e/screenshots/production-3d-verified.png`);

await browser.close();
if (server) server.kill();

console.log(`\n===== Production 验证：${pass} pass, ${fail} fail =====`);
process.exit(fail > 0 ? 1 : 0);
