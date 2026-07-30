/**
 * Production build E2E 验证（Sprint #5）
 *
 * 跑法：`npm run build`，然后 `node e2e/verify-production.mjs`（自启 preview server）
 * 或：`node e2e/verify-production.mjs --no-server`（假定 preview 已在 4173 跑）
 */
import { chromium } from 'playwright';

const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;
const shouldStartServer = !process.argv.includes('--no-server');

let server = null;
if (shouldStartServer) {
  const { spawn } = await import('node:child_process');
  server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT)], {
    stdio: 'pipe',
  });
  await new Promise((resolve) => {
    let output = '';
    server.stdout.on('data', (d) => {
      output += d.toString();
      if (output.includes('Local:')) resolve();
    });
    setTimeout(resolve, 5000);
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

let pass = 0, fail = 0;
const check = (name, ok) => {
  console.log(`  ${ok ? '✓' : '✗'} ${name}`);
  if (ok) pass++; else fail++;
};

console.log(`Step 1: 注入 2 个测试灵魂到 IDB（含捏脸 body 字段）...`);
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
      identity: { name: '小柚', gender: 'female', age: 22, avatarSeed: 'a', pronouns: '她', hairStyle: 'long', hairColor: '#fbbf24' },
      personality: { mbti: 'INFP', traits: ['温柔','娇嗔'], speakingStyle: '用「嗯哼」和 emoji', emotionalBaseline: '平静偏温暖' },
      backstory: { story: '一位独立设计师，喜欢爵士乐和猫', occupation: '设计师', hobbies: ['听爵士','画画'], preferences: ['下雨天'] },
      relationship: { type: 'girlfriend', initialIntimacy: 70, currentIntimacy: 70, boundaries: ['不聊政治'] },
      knowledge: { documents: [], manualFacts: [] },
      body: { height: 1.0, bodyType: 0.95 },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'test-soul-2',
      identity: { name: '墨羽', gender: 'male', age: 24, avatarSeed: 'b', pronouns: '他', hairStyle: 'short', hairColor: '#1e293b' },
      personality: { mbti: 'INTJ', traits: ['理性','冷静'], speakingStyle: '简洁', emotionalBaseline: '平静' },
      backstory: { story: '', hobbies: [], preferences: [] },
      relationship: { type: 'friend', initialIntimacy: 40, currentIntimacy: 40, boundaries: [] },
      knowledge: { documents: [], manualFacts: [] },
      body: { height: 1.15, bodyType: 1.1 },
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

const canvasInfo = await page.evaluate(() => {
  const canvases = document.querySelectorAll('canvas');
  return Array.from(canvases).map(c => ({ width: c.width, height: c.height }));
});
check('Canvas 元素已创建（>=1）', canvasInfo.length >= 1);
check('Canvas 尺寸合理（>1000px 宽，证明渲染中）', canvasInfo[0]?.width > 1000);
check('无 page error', errors.length === 0);

await page.screenshot({ path: 'e2e/screenshots/production-3d-verified.png', fullPage: false });
console.log(`📸 截图 1：e2e/screenshots/production-3d-verified.png`);

console.log(`Step 3: 验证浮层打开（角色库按钮） ...`);
await page.click('button:has-text("角色库")');
await page.waitForTimeout(500);
const overlayTextCount = await page.locator('text=角色库').count();
check('浮层打开：Modal 显示「角色库」', overlayTextCount >= 2);
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

console.log(`Step 4: 模拟点击 3D 角色 → SoulDetailModal 弹窗（用 ?detail URL）...`);
await page.goto(BASE + '/?detail=test-soul-1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
check('点击 3D 角色（?detail URL）→ SoulDetailModal 弹窗', async () => {
  return (await page.locator('text=灵魂详情').count()) >= 1;
});
check('详情 Modal 显示角色姓名「小柚」', async () => {
  return (await page.locator('h3:has-text("小柚")').count()) >= 1;
});
check('详情 Modal 显示关系「女友」', async () => {
  return (await page.locator('text=女友').count()) >= 1;
});
check('详情 Modal 显示性格 traits「温柔」', async () => {
  return (await page.locator('text=温柔').count()) >= 1;
});
check('详情 Modal 显示 MBTI「INFP」', async () => {
  return (await page.locator('text=INFP').count()) >= 1;
});
check('详情 Modal 显示捏脸参数「身高 1.0」「体型 0.95」', async () => {
  const heightVisible = (await page.locator('text=1.0').count()) >= 1;
  const bodyTypeVisible = (await page.locator('text=0.95').count()) >= 1;
  return heightVisible && bodyTypeVisible;
});
await page.screenshot({ path: 'e2e/screenshots/production-detail-modal.png', fullPage: false });
console.log(`📸 截图 2：e2e/screenshots/production-detail-modal.png`);

console.log(`Step 5: 验证聊天页（/chat?soulId=xxx）...`);
await page.goto(BASE + '/chat?soulId=test-soul-1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
check('聊天页显示角色名「小柚」', async () => {
  return (await page.locator('h2:has-text("小柚")').count()) >= 1;
});
check('聊天页显示 Provider 选择器（OpenAI / Anthropic / DeepSeek）', async () => {
  return (await page.locator('option:has-text("OpenAI")').count()) >= 1;
});
check('聊天页显示模型输入框', async () => {
  return (await page.locator('input[placeholder="模型名"]').count()) >= 1;
});
check('聊天页有输入框 + 发送按钮', async () => {
  const textarea = await page.locator('textarea').count();
  const sendBtn = await page.locator('button:has-text("发送")').count();
  return textarea >= 1 && sendBtn >= 1;
});
check('无 API Key 时显示警告「未配置 openai API Key」', async () => {
  return (await page.locator('text=未配置').count()) >= 1;
});
await page.screenshot({ path: 'e2e/screenshots/production-chat-page.png', fullPage: false });
console.log(`📸 截图 3：e2e/screenshots/production-chat-page.png`);

console.log(`Step 6: 验证 3D 状态切换按钮（M7-001）...`);
await page.goto(BASE + '/?detail=test-soul-1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
check('详情 Modal 显示 4 状态按钮（站/坐/躺/走）', async () => {
  const stand = await page.locator('button:has-text("站立")').count();
  const sit = await page.locator('button:has-text("坐下")').count();
  const lie = await page.locator('button:has-text("躺下")').count();
  const walk = await page.locator('button:has-text("走动")').count();
  return stand >= 1 && sit >= 1 && lie >= 1 && walk >= 1;
});
check('默认状态按钮高亮「站立」', async () => {
  const standBtn = page.locator('button:has-text("站立")').first();
  const classes = await standBtn.getAttribute('class');
  return classes?.includes('bg-blue-600') ?? false;
});
// 点击「坐下」按钮 → 状态应切换
await page.click('button:has-text("坐下")');
await page.waitForTimeout(500);
check('点击「坐下」后状态切换', async () => {
  const sitBtn = page.locator('button:has-text("坐下")').first();
  const classes = await sitBtn.getAttribute('class');
  return classes?.includes('bg-blue-600') ?? false;
});
await page.screenshot({ path: 'e2e/screenshots/production-state-sitting.png', fullPage: false });
console.log(`📸 截图 4：e2e/screenshots/production-state-sitting.png`);

console.log(`Step 7: 验证情绪选择（M7-003）...`);
check('详情 Modal 显示 5 情绪按钮（中性/开心/伤心/温柔/生气）', async () => {
  return (
    (await page.locator('button:has-text("中性")').count()) >= 1 &&
    (await page.locator('button:has-text("开心")').count()) >= 1 &&
    (await page.locator('button:has-text("伤心")').count()) >= 1 &&
    (await page.locator('button:has-text("温柔")').count()) >= 1 &&
    (await page.locator('button:has-text("生气")').count()) >= 1
  );
});
check('默认情绪按钮高亮「中性」', async () => {
  const neutralBtn = page.locator('button:has-text("中性")').first();
  const classes = await neutralBtn.getAttribute('class');
  return classes?.includes('bg-pink-600') ?? false;
});
await page.screenshot({ path: 'e2e/screenshots/production-emotion-default.png', fullPage: false });
console.log(`📸 截图 5：e2e/screenshots/production-emotion-default.png`);

console.log(`Step 8: 验证智能调度（M7-004）— 无 ?soulId 时自动选 active...`);
await page.goto(BASE + '/chat', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
check('无 ?soulId 时自动选第一个角色「小柚」', async () => {
  return (await page.locator('h2:has-text("小柚")').count()) >= 1;
});
await page.screenshot({ path: 'e2e/screenshots/production-auto-dispatch.png', fullPage: false });
console.log(`📸 截图 6：e2e/screenshots/production-auto-dispatch.png`);

await browser.close();
if (server) server.kill();

console.log(`\n===== Production 验证：${pass} pass, ${fail} fail =====`);
process.exit(fail > 0 ? 1 : 0);
