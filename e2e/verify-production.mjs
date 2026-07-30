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

console.log(`Step 1: 注入 2 个测试灵魂到 IDB ...`);
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

const seedResult = await page.evaluate(async () => {
  const open = indexedDB.open('cyberman', 1);
  await new Promise((resolve, reject) => {
    open.onsuccess = resolve;
    open.onerror = reject;
  });
  const db = open.result;
  const tx = db.transaction(['kv'], 'readwrite');
  const store = tx.objectStore('kv');
  const now = Date.now();
  const souls = [
    {
      id: 'test-soul-1',
      identity: { name: '小柚', gender: 'female', age: 22, avatarSeed: 'a', pronouns: '她' },
      personality: { mbti: 'INFP', traits: ['温柔'], speakingStyle: '', emotionalBaseline: '温暖' },
      backstory: { story: '', hobbies: [], preferences: [] },
      relationship: { type: 'girlfriend', initialIntimacy: 70, currentIntimacy: 70, boundaries: [] },
      knowledge: { documents: [], manualFacts: [] },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'test-soul-2',
      identity: { name: '墨羽', gender: 'male', age: 24, avatarSeed: 'b', pronouns: '他' },
      personality: { mbti: 'INTJ', traits: ['理性'], speakingStyle: '', emotionalBaseline: '冷静' },
      backstory: { story: '', hobbies: [], preferences: [] },
      relationship: { type: 'friend', initialIntimacy: 40, currentIntimacy: 40, boundaries: [] },
      knowledge: { documents: [], manualFacts: [] },
      createdAt: now,
      updatedAt: now,
    },
  ];
  store.put({ state: { souls, activeSoulId: null }, version: 1 }, 'cyberman:souls');
  await new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = reject;
  });
  return souls.length;
});
console.log(`  ✓ 注入 ${seedResult} 个灵魂`);

console.log(`Step 2: 刷新页面看 3D 场景渲染多角色 ...`);
await page.reload({ waitUntil: 'domcontentloaded' });
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
check('Canvas 尺寸合理（>1000px 宽，证明渲染中）', canvasInfo[0]?.width > 1000);
check('无 page error', errors.length === 0);

// 浮层：点击「角色库」按钮 → Modal 打开
console.log(`Step 3: 验证浮层打开 ...`);
await page.click('button:has-text("角色库")');
await page.waitForTimeout(500);
const overlayTextCount = await page.locator('text=角色库').count();
check('浮层打开：Modal 显示「角色库」', overlayTextCount >= 2); // 至少 2 个：导航按钮 + Modal 标题
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

await page.screenshot({ path: 'e2e/screenshots/production-3d-verified.png', fullPage: false });
console.log(`📸 截图 1：e2e/screenshots/production-3d-verified.png`);

// 再截一张浮层打开的图
await page.click('button:has-text("角色库")');
await page.waitForTimeout(500);
await page.screenshot({ path: 'e2e/screenshots/production-overlay-opened.png', fullPage: false });
console.log(`📸 截图 2：e2e/screenshots/production-overlay-opened.png`);

await browser.close();
if (server) server.kill();

console.log(`\n===== Production 验证：${pass} pass, ${fail} fail =====`);
process.exit(fail > 0 ? 1 : 0);
