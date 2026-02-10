const { chromium } = require('playwright');

async function testHomepage() {
  console.log('🚀 Starting homepage UI test...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Desktop homepage
    console.log('📸 Capturing desktop homepage...');
    await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Wait for animations
    await page.screenshot({ path: 'screenshots/ui-03-homepage-desktop.png', fullPage: true });
    console.log('✅ Desktop homepage captured');

    // Test 2: Mobile homepage
    console.log('📸 Capturing mobile homepage...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/ui-04-homepage-mobile.png', fullPage: true });
    console.log('✅ Mobile homepage captured');

    console.log('🎉 All homepage screenshots captured successfully!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

testHomepage().catch(console.error);
