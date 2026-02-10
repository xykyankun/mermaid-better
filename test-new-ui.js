const { chromium } = require('playwright');

async function testNewUI() {
  console.log('🎨 Testing New UI Design\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // 1. Login Page
    console.log('1️⃣  Capturing New Login Page...');
    await page.goto('http://localhost:3001/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'screenshots/ui-01-login-new.png',
      fullPage: false
    });
    console.log('✅ New login page captured\n');

    // 2. Register Page
    console.log('2️⃣  Capturing New Register Page...');
    await page.goto('http://localhost:3001/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'screenshots/ui-02-register-new.png',
      fullPage: false
    });
    console.log('✅ New register page captured\n');

    // 3. Mobile Login
    console.log('3️⃣  Capturing Mobile Login...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3001/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'screenshots/ui-03-login-mobile.png',
      fullPage: true
    });
    console.log('✅ Mobile login captured\n');

    // 4. Mobile Register
    console.log('4️⃣  Capturing Mobile Register...');
    await page.goto('http://localhost:3001/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'screenshots/ui-04-register-mobile.png',
      fullPage: true
    });
    console.log('✅ Mobile register captured\n');

    console.log('🎉 All UI screenshots captured successfully!\n');
    console.log('📂 Screenshots saved:');
    console.log('   - ui-01-login-new.png');
    console.log('   - ui-02-register-new.png');
    console.log('   - ui-03-login-mobile.png');
    console.log('   - ui-04-register-mobile.png');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/ui-error.png' });
  } finally {
    await browser.close();
  }
}

testNewUI();
