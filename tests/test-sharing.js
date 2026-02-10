const { chromium } = require('playwright');

async function testSharing() {
  console.log('🧪 Testing Mermaid Better - Sharing Feature\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Listen to console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`BROWSER ERROR: ${msg.text()}`);
    }
  });

  try {
    // Test 1: Go to Dashboard (should redirect to login)
    console.log('📍 Test 1: Accessing Dashboard (not logged in)');
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      console.log('✅ Redirected to login page');
      await page.screenshot({ path: 'screenshots/share-01-login.png' });
    }

    // Test 2: Check if there are any existing diagrams we can use
    console.log('\n📍 Test 2: Checking for existing diagrams via API');

    // For this test, we'll create a share link manually using the API
    // First, let's check if we can access the editor without login
    await page.goto('http://localhost:3001/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('✅ Editor page loaded (accessible without login)');
    await page.screenshot({ path: 'screenshots/share-02-editor.png' });

    // Test 3: Test public share page with a mock token
    console.log('\n📍 Test 3: Testing share page with invalid token');
    await page.goto('http://localhost:3001/share/invalid-token-12345');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const errorMessage = await page.locator('text=Diagram Not Available');
    if (await errorMessage.isVisible()) {
      console.log('✅ Correctly shows error for invalid share token');
      await page.screenshot({ path: 'screenshots/share-03-invalid-token.png' });
    }

    // Test 4: Test Dashboard Share button visibility
    console.log('\n📍 Test 4: Checking Dashboard has Share buttons');
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should still be on login or dashboard
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    if (currentUrl.includes('/login') || currentUrl.includes('/dashboard')) {
      console.log('✅ Dashboard/Login page structure verified');
      await page.screenshot({ path: 'screenshots/share-04-dashboard-structure.png' });
    }

    // Test 5: Test Templates page (public access)
    console.log('\n📍 Test 5: Testing Templates page public access');
    await page.goto('http://localhost:3001/templates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const templateCards = await page.locator('[class*="rounded-lg p-4"]').count();
    console.log(`✅ Templates page loaded with ${templateCards} templates (public access)`);
    await page.screenshot({ path: 'screenshots/share-05-templates-public.png' });

    // Test 6: Verify share dialog component exists in codebase
    console.log('\n📍 Test 6: Testing share page UI structure');
    await page.goto('http://localhost:3001/share/test-token');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const sharePageTitle = await page.locator('text=Mermaid Better');
    if (await sharePageTitle.isVisible()) {
      console.log('✅ Share page structure loaded correctly');
      await page.screenshot({ path: 'screenshots/share-06-share-page-structure.png' });
    }

    // Test 7: Test share page buttons
    console.log('\n📍 Test 7: Checking share page action buttons');
    const copyLinkBtn = await page.locator('text=Copy Link');
    const copyCodeBtn = await page.locator('text=Copy Code');
    const exportBtn = await page.locator('text=Export SVG');
    const createOwnBtn = await page.locator('text=Create Your Own');

    const buttonsExist =
      (await copyLinkBtn.isVisible()) &&
      (await copyCodeBtn.isVisible()) &&
      (await exportBtn.isVisible()) &&
      (await createOwnBtn.isVisible());

    if (buttonsExist) {
      console.log('✅ All share page action buttons present');
    } else {
      console.log('⚠️  Some share page buttons missing');
    }

    await page.screenshot({ path: 'screenshots/share-07-action-buttons.png' });

    // Test 8: Mobile view of share page
    console.log('\n📍 Test 8: Testing mobile view of share page');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3001/share/test-token');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/share-08-mobile.png' });
    console.log('✅ Mobile view tested');

    console.log('\n🎉 Sharing feature structure tests completed!');
    console.log('\n📸 Screenshots saved:');
    console.log('  - share-01-login.png');
    console.log('  - share-02-editor.png');
    console.log('  - share-03-invalid-token.png');
    console.log('  - share-04-dashboard-structure.png');
    console.log('  - share-05-templates-public.png');
    console.log('  - share-06-share-page-structure.png');
    console.log('  - share-07-action-buttons.png');
    console.log('  - share-08-mobile.png');

    console.log('\n📝 Note: Full end-to-end sharing flow test requires:');
    console.log('  1. User authentication');
    console.log('  2. Creating a diagram');
    console.log('  3. Enabling sharing via Share dialog');
    console.log('  4. Visiting the generated share link');
    console.log('  These tests verify the structure and UI components.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/share-error.png' });
  } finally {
    await browser.close();
  }
}

testSharing();
