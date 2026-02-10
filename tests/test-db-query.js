const { chromium } = require('playwright');

async function testDBQuery() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console messages
  page.on('console', msg => {
    console.log(`BROWSER ${msg.type()}: ${msg.text()}`);
  });

  try {
    await page.goto('http://localhost:3001/test-db');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for query to complete

    await page.screenshot({ path: 'screenshots/test-db.png' });
    console.log('Screenshot saved to screenshots/test-db.png');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testDBQuery();
