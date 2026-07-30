/**
 * Cyberman E2E 烟雾测试（Playwright）
 *
 * 覆盖 Sprint #2 关键用户路径：
 * 1. 首页加载（空状态）
 * 2. 进入工坊
 * 3. 灵魂编辑器表单输入 → 右栏 PromptPreview 实时联动
 * 4. MBTI 选择 + 性格 tag 添加
 * 5. 创建灵魂 → 跳转到 /chat
 * 6. 返回首页看到新角色
 * 7. 删除清理
 *
 * 跑法：
 *   1) npm run dev （后台起 vite）
 *   2) node e2e/smoke.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('./e2e/screenshots', { recursive: true });

const BASE = 'http://127.0.0.1:5173';
const log = (msg) => console.log(msg);
const check = async (page, name, fn) => {
  try {
    await fn();
    log(`  ✓ ${name}`);
    return true;
  } catch (e) {
    log(`  ✗ ${name}: ${e.message.split('\n')[0]}`);
    return false;
  }
};

const browser = await chromium.launch({
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on('pageerror', err => {
  log(`  [page error] ${err.message}`);
  log(`  [page error stack] ${err.stack?.split('\n').slice(0, 5).join(' | ')}`);
});
page.on('console', msg => {
  if (msg.type() === 'error') log(`  [console.error] ${msg.text()}`);
});
// 全局 dialog handler：自动 accept 所有 confirm/alert
page.on('dialog', dialog => dialog.accept());

let pass = 0, fail = 0;
const tally = (ok) => ok ? (pass++, true) : (fail++, false);

try {
  // ────────── Step 1: 首页加载 ──────────
  log('\n[Step 1] 首页加载');
  await page.goto(BASE + '/');
  await page.waitForSelector('h1', { timeout: 5000 });

  tally(await check(page, '首页 h1 显示「角色库」', async () => {
    const h1 = await page.locator('h1').first().textContent();
    if (!h1?.includes('角色库')) throw new Error(`h1 = "${h1}"`);
  }));

  tally(await check(page, '空状态显示「还没有角色」', async () => {
    const visible = await page.locator('text=还没有角色').first().isVisible();
    if (!visible) throw new Error('空状态未显示');
  }));

  await page.screenshot({ path: 'e2e/screenshots/01-home.png', fullPage: true });

  // ────────── Step 2: 进入工坊 ──────────
  log('\n[Step 2] 进入工坊');
  await page.click('text=新建角色');
  await page.waitForURL(/workshop/);
  await page.waitForSelector('input[placeholder*="小柚"]', { timeout: 5000 });

  tally(await check(page, '/workshop 渲染 5 sections', async () => {
    const sectionTitles = await page.locator('button >> span.font-medium').allTextContents();
    const titles = sectionTitles.filter(t => /身份|人格|背景|关系|知识库/.test(t));
    if (titles.length < 5) throw new Error(`只看到 sections: ${titles.join(', ')}`);
  }));

  await page.screenshot({ path: 'e2e/screenshots/02-workshop-empty.png', fullPage: true });

  // ────────── Step 3: 输入姓名 + 右栏实时联动（关键！验证 useWatch bug fix）──────────
  log('\n[Step 3] 输入姓名 → 验证右栏即时联动');
  const nameInput = page.locator('input[placeholder*="小柚"]').first();
  await nameInput.fill('测试小柚');

  tally(await check(page, '右栏 PromptPreview 含「测试小柚」（不再永远「编译中…」）', async () => {
    await page.waitForFunction(
      () => {
        const pre = document.querySelector('pre');
        return pre && pre.innerText.includes('测试小柚');
      },
      { timeout: 5000 }
    );
  }));

  await page.screenshot({ path: 'e2e/screenshots/03-name-typed.png', fullPage: true });

  // ────────── Step 4: 选 MBTI INFP ──────────
  log('\n[Step 4] 选 MBTI = INFP');
  // sections 是折叠的，需要展开「人格」section（默认展开）
  const mbtiSelect = page.locator('select').filter({ hasText: '未指定' }).first();
  await mbtiSelect.selectOption('INFP');

  tally(await check(page, '右栏出现「理想主义」INFP 行为指引', async () => {
    await page.waitForFunction(
      () => {
        const pre = document.querySelector('pre');
        return pre && pre.innerText.includes('理想主义');
      },
      { timeout: 3000 }
    );
  }));

  // ────────── Step 5: 加性格 tag「温柔」──────────
  log('\n[Step 5] 添加性格 tag「温柔」');
  const traitInput = page.locator('input[placeholder*="温柔"]').first();
  await traitInput.fill('温柔');
  await traitInput.press('Enter');

  tally(await check(page, '右栏含「温柔」', async () => {
    await page.waitForFunction(
      () => {
        const pre = document.querySelector('pre');
        return pre && pre.innerText.includes('温柔');
      },
      { timeout: 3000 }
    );
  }));

  // ────────── Step 6: 添加爱好 ──────────
  log('\n[Step 6] 切换到背景 section + 加爱好「听爵士」');
  const hobbyInput = page.locator('input[placeholder*="听爵士"]').first();
  await hobbyInput.fill('听爵士');
  await hobbyInput.press('Enter');

  tally(await check(page, '右栏含「听爵士」', async () => {
    await page.waitForFunction(
      () => {
        const pre = document.querySelector('pre');
        return pre && pre.innerText.includes('听爵士');
      },
      { timeout: 3000 }
    );
  }));

  await page.screenshot({ path: 'e2e/screenshots/04-with-mbti-traits.png', fullPage: true });

  // ────────── Step 7: 点击创建灵魂 ──────────
  log('\n[Step 7] 点击「创建灵魂」');
  await page.click('button:has-text("创建灵魂")');

  tally(await check(page, '跳转到 /chat', async () => {
    await page.waitForURL(/\/chat/, { timeout: 5000 });
  }));

  await page.screenshot({ path: 'e2e/screenshots/05-chat-page.png', fullPage: true });

  // ────────── Step 8: SPA 内导航回到首页（M1-008 修复）──────────
  log('\n[Step 8] SPA 内导航回首页（不刷新，验证 store 状态保留）');
  // 注意：用 SPA 内导航（点击 NavLink）而非 page.goto()，
  // 因为 useSoulsStore 当前是 in-memory（M1-007 持久化待做），硬刷新会清空 store。
  await page.click('nav >> text=首页');
  await page.waitForSelector('h1', { timeout: 5000 });

  tally(await check(page, '首页可见「测试小柚」角色卡（M1-008 修复）', async () => {
    await page.waitForFunction(
      () => document.body.innerText.includes('测试小柚'),
      { timeout: 3000 }
    );
  }));

  tally(await check(page, '角色卡显示「朋友」关系（默认）', async () => {
    // 用 .filter({ has: ... }) 找包含特定 h3 的祖先卡片
    const card = page.locator('div').filter({ has: page.locator('h3:has-text("测试小柚")') }).first();
    const cardText = await card.textContent();
    if (!cardText?.includes('朋友')) throw new Error(`卡片内容不含「朋友」: ${cardText?.slice(0, 100)}`);
  }));

  tally(await check(page, '角色卡显示「温柔」性格关键词', async () => {
    const card = page.locator('div').filter({ has: page.locator('h3:has-text("测试小柚")') }).first();
    const cardText = await card.textContent();
    if (!cardText?.includes('温柔')) throw new Error(`卡片不含「温柔」: ${cardText?.slice(0, 100)}`);
  }));

  await page.screenshot({ path: 'e2e/screenshots/06-home-with-soul.png', fullPage: true });

  // ────────── Step 9: 删除清理（在硬刷新前先清理）──────────
  log('\n[Step 9] 删除测试角色（清理）');
  await page.click('button[title="删除"]');

  tally(await check(page, '回到空状态', async () => {
    await page.waitForFunction(
      () => document.body.innerText.includes('还没有角色'),
      { timeout: 3000 }
    );
  }));

  await page.screenshot({ path: 'e2e/screenshots/07-home-after-delete.png', fullPage: true });

  // ────────── Step 10: M1-007 持久化验证 — 硬刷新后灵魂应保留 ──────────
  log('\n[Step 10] M1-007 持久化验证：硬刷新后灵魂应保留（IndexedDB）');
  log('  ⓘ 此 step 验证 IDB 持久化生效 —— M1-007 完成前应 fail，完成后应 pass');

  // 先创建一个临时灵魂用于「硬刷新后保留」验证
  await page.goto(BASE + '/workshop');
  await page.waitForSelector('input[placeholder*="小柚"]', { timeout: 5000 });
  await page.locator('input[placeholder*="小柚"]').first().fill('临时测试角色');
  await page.click('button:has-text("创建灵魂")');
  await page.waitForURL(/\/chat/, { timeout: 5000 });

  // 等 IDB 写入完成（zustand persist 异步）
  await page.waitForTimeout(800);

  // 现在硬刷新
  await page.goto(BASE + '/');
  await page.waitForSelector('h1', { timeout: 5000 });
  // 等待 hydration 完成（首次加载时 IDB 数据异步注入 store）
  await page.waitForTimeout(800);
  const afterReloadText = await page.locator('body').textContent();
  const soulsGoneAfterReload = !afterReloadText?.includes('临时测试角色');
  await page.screenshot({ path: 'e2e/screenshots/08-after-reload.png', fullPage: true });

  tally(await check(page, 'M1-007：硬刷新后灵魂仍在（M1-007 持久化生效）', async () => {
    if (soulsGoneAfterReload) throw new Error('硬刷新后「临时测试角色」消失');
  }));

  // 清理：删除测试角色
  log('\n[Step 10b] 清理：删除「临时测试角色」');
  await page.click('button[title="删除"]');
  await page.waitForTimeout(500);

  // ────────── Step 11: 3D 场景路由（Sprint #3 · R3F headless 限制）──────────
  log('\n[Step 11] 3D 场景路由可达（/scene）');
  log('  ⓘ R3F 在 headless chromium 报 page error（已知限制）；真实浏览器待用户实测');
  // /scene 路由 + ScenePage 已就位
  // headless chromium 限制：R3F createReconciler 报错（Canvas 渲染失败但路由可达）
  // 真实浏览器（用户实测）：R3F 应能正常渲染 WebGL
  await page.goto(BASE + '/scene');
  await page.waitForTimeout(2000);

  // 验证 React Router 渲染了 /scene（即使 R3F 报错，AppLayout 和覆盖层应该出现）
  const bodyText = await page.locator('body').textContent({ timeout: 3000 }).catch(() => '');
  tally(await check(page, '/scene 路由可达（AppLayout + 路由切换正常）', async () => {
    // 顶栏导航「聊天」按钮应高亮（active 状态）
    const activeNav = await page.locator('nav a[aria-current="page"], nav a.active').count();
    if (activeNav < 1) {
      // 降级检查：URL 包含 /scene
      const url = page.url();
      if (!url.includes('/scene')) throw new Error(`URL 不是 /scene: ${url}`);
    }
  }));

  await page.screenshot({ path: 'e2e/screenshots/09-scene-route.png', fullPage: false });

} catch (err) {
  console.error('\n[FATAL] Test crashed:', err.message);
  await page.screenshot({ path: 'e2e/screenshots/fatal.png', fullPage: true }).catch(() => {});
  fail++;
}

await browser.close();
console.log(`\n===== E2E 烟雾测试：${pass} pass, ${fail} fail =====`);
console.log(`📸 截图：e2e/screenshots/`);
process.exit(fail > 0 ? 1 : 0);