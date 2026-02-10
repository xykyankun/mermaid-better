const { chromium } = require('playwright');

async function testPhase2() {
  console.log('🚀 开始第二阶段 UI 测试...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. 测试分享页面（错误状态）
    console.log('📸 [1/3] 捕获分享页面（错误状态）...');
    await page.goto('http://localhost:3001/share/invalid-token', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'screenshots/phase2-01-share-error.png', fullPage: false });
    console.log('✅ 分享页面（错误状态）完成\n');

    // 2. 测试 404 页面
    console.log('📸 [2/3] 捕获 404 错误页面...');
    await page.goto('http://localhost:3001/non-existent-page', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/phase2-02-404.png', fullPage: false });
    console.log('✅ 404 页面完成\n');

    // 3. 测试首页完整滚动
    console.log('📸 [3/3] 捕获首页完整视图...');
    await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'screenshots/phase2-03-homepage-full.png', fullPage: true });
    console.log('✅ 首页完整视图完成\n');

    console.log('🎉 第二阶段所有截图生成成功！\n');
    console.log('📁 截图保存位置：screenshots/ 目录\n');
    console.log('生成的文件：');
    console.log('  1. phase2-01-share-error.png - 分享页面（错误状态）');
    console.log('  2. phase2-02-404.png - 404 错误页面');
    console.log('  3. phase2-03-homepage-full.png - 首页完整视图');

  } catch (error) {
    console.error('❌ 测试过程中出错:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

testPhase2().catch(console.error);
