const { chromium } = require('playwright');

async function testAllUI() {
  console.log('🚀 开始测试所有 UI 页面...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. 测试首页 (桌面)
    console.log('📸 [1/8] 捕获首页 (桌面)...');
    await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'screenshots/final-01-homepage-desktop.png', fullPage: true });
    console.log('✅ 首页 (桌面) 完成\n');

    // 2. 测试首页 (移动端)
    console.log('📸 [2/8] 捕获首页 (移动端)...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/final-02-homepage-mobile.png', fullPage: true });
    console.log('✅ 首页 (移动端) 完成\n');

    // 恢复桌面视图
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 3. 测试登录页面
    console.log('📸 [3/8] 捕获登录页面...');
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/final-03-login.png', fullPage: false });
    console.log('✅ 登录页面完成\n');

    // 4. 测试注册页面
    console.log('📸 [4/8] 捕获注册页面...');
    await page.goto('http://localhost:3001/register', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/final-04-register.png', fullPage: false });
    console.log('✅ 注册页面完成\n');

    // 5. 测试模板库页面
    console.log('📸 [5/8] 捕获模板库页面...');
    await page.goto('http://localhost:3001/templates', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/final-05-templates.png', fullPage: true });
    console.log('✅ 模板库页面完成\n');

    // 6. 测试编辑器页面
    console.log('📸 [6/8] 捕获编辑器页面...');
    await page.goto('http://localhost:3001/editor', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/final-06-editor.png', fullPage: false });
    console.log('✅ 编辑器页面完成\n');

    // 7. 测试 Dashboard (需要登录，这里只测试未登录跳转到登录页的情况)
    console.log('📸 [7/8] 捕获 Dashboard 页面...');
    await page.goto('http://localhost:3001/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'screenshots/final-07-dashboard.png', fullPage: true });
    console.log('✅ Dashboard 页面完成\n');

    // 8. 测试模板卡片悬停效果
    console.log('📸 [8/8] 捕获模板卡片悬停效果...');
    await page.goto('http://localhost:3001/templates', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 尝试悬停在第一个模板卡片上
    const firstCard = await page.locator('.group').first();
    if (await firstCard.count() > 0) {
      await firstCard.hover();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'screenshots/final-08-template-hover.png', fullPage: false });
    console.log('✅ 模板卡片悬停效果完成\n');

    console.log('🎉 所有截图生成成功！\n');
    console.log('📁 截图保存位置：screenshots/ 目录\n');
    console.log('生成的文件：');
    console.log('  1. final-01-homepage-desktop.png - 首页 (桌面)');
    console.log('  2. final-02-homepage-mobile.png - 首页 (移动端)');
    console.log('  3. final-03-login.png - 登录页面');
    console.log('  4. final-04-register.png - 注册页面');
    console.log('  5. final-05-templates.png - 模板库页面');
    console.log('  6. final-06-editor.png - 编辑器页面');
    console.log('  7. final-07-dashboard.png - Dashboard 页面');
    console.log('  8. final-08-template-hover.png - 模板卡片悬停效果');

  } catch (error) {
    console.error('❌ 测试过程中出错:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

testAllUI().catch(console.error);
