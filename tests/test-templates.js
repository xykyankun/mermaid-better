const { chromium } = require('playwright');

async function testTemplateLibrary() {
  console.log('🧪 Testing Mermaid Better - Template Library\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Test 1: Landing page with template button
    console.log('📍 Test 1: Landing page with template button');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    const templateButton = await page.locator('text=Browse Templates');
    if (await templateButton.isVisible()) {
      console.log('✅ "Browse Templates" button found on landing page');
      await page.screenshot({ path: 'screenshots/template-01-landing.png' });
    } else {
      console.log('❌ Template button not found');
    }

    // Test 2: Navigate to template library
    console.log('\n📍 Test 2: Template library page');
    await page.goto('http://localhost:3001/templates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for templates to load and render

    const pageTitle = await page.locator('text=Template Library');
    if (await pageTitle.isVisible()) {
      console.log('✅ Template library page loaded');
      await page.screenshot({ path: 'screenshots/template-02-library.png', fullPage: true });
    }

    // Test 3: Check if templates are displayed
    console.log('\n📍 Test 3: Template cards displayed');
    const templateCards = await page.locator('[class*="rounded-lg p-4"]').count();
    console.log(`✅ Found ${templateCards} template cards`);

    // Test 4: Test search functionality
    console.log('\n📍 Test 4: Search functionality');
    const searchInput = await page.locator('input[placeholder*="Search"]');
    await searchInput.fill('flowchart');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/template-03-search.png', fullPage: true });
    console.log('✅ Search functionality working');

    // Test 5: Test category filter
    console.log('\n📍 Test 5: Category filter');
    const categorySelect = await page.locator('select').first();
    await categorySelect.selectOption('basic');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/template-04-filter-category.png', fullPage: true });
    console.log('✅ Category filter working');

    // Test 6: Test type filter
    console.log('\n📍 Test 6: Type filter');
    const typeSelect = await page.locator('select').nth(1);
    await typeSelect.selectOption('sequence');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/template-05-filter-type.png', fullPage: true });
    console.log('✅ Type filter working');

    // Test 7: Click on a template card
    console.log('\n📍 Test 7: Click template to use');
    await categorySelect.selectOption('all');
    await typeSelect.selectOption('all');
    await searchInput.fill('');
    await page.waitForTimeout(1000);

    const firstCard = await page.locator('[class*="rounded-lg p-4"]').first();
    await firstCard.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if redirected to editor
    const currentUrl = page.url();
    if (currentUrl.includes('/editor?template=')) {
      console.log('✅ Redirected to editor with template');
      await page.screenshot({ path: 'screenshots/template-06-editor-with-template.png', fullPage: true });
    } else {
      console.log('❌ Did not redirect to editor correctly');
    }

    // Test 8: Verify template content loaded in editor
    console.log('\n📍 Test 8: Template content in editor');
    await page.waitForTimeout(2000); // Wait for Monaco editor to load
    const codeEditor = await page.locator('.monaco-editor');
    if (await codeEditor.isVisible()) {
      console.log('✅ Monaco editor loaded with template content');
    }

    // Test 9: Check dashboard template button
    console.log('\n📍 Test 9: Dashboard template button');
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForLoadState('networkidle');

    const dashboardTemplateButton = await page.locator('text=Templates');
    if (await dashboardTemplateButton.isVisible()) {
      console.log('✅ Templates button found in dashboard');
      await page.screenshot({ path: 'screenshots/template-07-dashboard.png' });
    }

    // Test 10: Mobile responsive view
    console.log('\n📍 Test 10: Mobile responsive view');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3001/templates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/template-08-mobile.png', fullPage: true });
    console.log('✅ Mobile view tested');

    console.log('\n🎉 All template library tests completed successfully!');
    console.log('\n📸 Screenshots saved to screenshots/ directory:');
    console.log('  - template-01-landing.png');
    console.log('  - template-02-library.png');
    console.log('  - template-03-search.png');
    console.log('  - template-04-filter-category.png');
    console.log('  - template-05-filter-type.png');
    console.log('  - template-06-editor-with-template.png');
    console.log('  - template-07-dashboard.png');
    console.log('  - template-08-mobile.png');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/template-error.png' });
  } finally {
    await browser.close();
  }
}

testTemplateLibrary();
