const { chromium } = require('playwright');

async function generateDemoScreenshots() {
  console.log('📸 Generating Complete Demo Screenshots\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // 1. Landing Page
    console.log('1️⃣  Capturing Landing Page...');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'screenshots/demo-01-landing-page.png',
      fullPage: true
    });
    console.log('✅ Landing page captured\n');

    // 2. Templates Library - Full Grid
    console.log('2️⃣  Capturing Templates Library...');
    await page.goto('http://localhost:3001/templates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for Mermaid rendering
    await page.screenshot({
      path: 'screenshots/demo-02-templates-library.png',
      fullPage: true
    });
    console.log('✅ Templates library captured\n');

    // 3. Templates - Filtered by Category
    console.log('3️⃣  Capturing Templates Filtering...');
    await page.selectOption('select', { index: 1 }); // Select first non-all category
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'screenshots/demo-03-templates-filtered.png',
      fullPage: true
    });
    console.log('✅ Filtered templates captured\n');

    // 4. Editor - Empty State
    console.log('4️⃣  Capturing Editor Empty State...');
    await page.goto('http://localhost:3001/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: 'screenshots/demo-04-editor-empty.png',
      fullPage: false
    });
    console.log('✅ Editor empty state captured\n');

    // 5. Login Page
    console.log('5️⃣  Capturing Login Page...');
    await page.goto('http://localhost:3001/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'screenshots/demo-05-login-page.png',
      fullPage: false
    });
    console.log('✅ Login page captured\n');

    // 6. Share Page - Invalid Token (Error State)
    console.log('6️⃣  Capturing Share Error State...');
    await page.goto('http://localhost:3001/share/invalid-token');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'screenshots/demo-06-share-error.png',
      fullPage: false
    });
    console.log('✅ Share error state captured\n');

    // 7. Mobile - Landing Page
    console.log('7️⃣  Capturing Mobile Landing Page...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'screenshots/demo-07-mobile-landing.png',
      fullPage: true
    });
    console.log('✅ Mobile landing captured\n');

    // 8. Mobile - Templates
    console.log('8️⃣  Capturing Mobile Templates...');
    await page.goto('http://localhost:3001/templates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: 'screenshots/demo-08-mobile-templates.png',
      fullPage: true
    });
    console.log('✅ Mobile templates captured\n');

    // 9. Tablet View - Editor
    console.log('9️⃣  Capturing Tablet Editor View...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3001/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: 'screenshots/demo-09-tablet-editor.png',
      fullPage: false
    });
    console.log('✅ Tablet editor captured\n');

    // 10. Desktop - Templates with Search
    console.log('🔟 Capturing Templates Search...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/templates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = await page.locator('input[placeholder*="Search"]');
    await searchInput.fill('flowchart');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'screenshots/demo-10-templates-search.png',
      fullPage: true
    });
    console.log('✅ Templates search captured\n');

    console.log('🎉 All demo screenshots generated successfully!\n');
    console.log('📂 Screenshots saved in screenshots/ directory:');
    console.log('   - demo-01-landing-page.png');
    console.log('   - demo-02-templates-library.png');
    console.log('   - demo-03-templates-filtered.png');
    console.log('   - demo-04-editor-empty.png');
    console.log('   - demo-05-login-page.png');
    console.log('   - demo-06-share-error.png');
    console.log('   - demo-07-mobile-landing.png');
    console.log('   - demo-08-mobile-templates.png');
    console.log('   - demo-09-tablet-editor.png');
    console.log('   - demo-10-templates-search.png');

  } catch (error) {
    console.error('\n❌ Screenshot generation failed:', error.message);
    await page.screenshot({ path: 'screenshots/demo-error.png' });
  } finally {
    await browser.close();
  }
}

generateDemoScreenshots();
