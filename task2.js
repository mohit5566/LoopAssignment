const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Launch the browser
  const browser = await chromium.launch({ headless: false });

  // Create a new browser context
  const context = await browser.newContext();

  // Create a new page within the context
  const page = await context.newPage();

  // Navigate to the login page
  await page.goto('https://app.tryloop.ai/login/password');

  // Fill in the login form
  const emailInput = await page.waitForSelector('//input[@type="text"]');
  await emailInput.fill('qa-engineer-assignment@test.com');

  await page.waitForTimeout(3000);

  const passInput = await page.waitForSelector('//input[@type="password"]');
  await passInput.fill('QApassword123$');

  await page.waitForTimeout(3000);
  // Click on the login button
  const login = await page.waitForSelector('//button[text() = "Login"]');
  await login.click();

  // Wait for navigation to complete
//   await page.waitForNavigation();

  // Capture a screenshot for verification (optional)
  await page.screenshot({ path: 'login_success.png' });

  await page.waitForTimeout(5000);

  const skip = await page.waitForSelector('//button[text() = "Skip for now"]');
  await skip.click();


await page.waitForTimeout(5000);
  // Output success message
  console.log('Login successful!');


  const gp = await page.waitForSelector('//*[@data-testid="ExpandMoreIcon"]');
  await gp.click();
  await page.waitForTimeout(3000);

  const history = await page.waitForSelector('//a[contains(@href , "transactions")]');
  await history.click();
  await page.waitForTimeout(8000);

  const locations = await page.waitForSelector('//button[@data-testid="selectBtn"]/span[text() = "Locations"]');
  await locations.click();
  await page.waitForTimeout(3000);

  const clear = await page.waitForSelector('//button[text() = "Clear"]');
  await clear.click();
  await page.waitForTimeout(3000);

 
   const place1 = await page.waitForSelector('//*[@data-testid="optionItem" and div/@aria-label="Artisan Alchemy"]');
   await place1.click();

   const place2 = await page.waitForSelector('//*[@data-testid="optionItem" and div/@aria-label="Blissful Buffet"]');
   await place2.click();


  const apply = await page.waitForSelector('//*[@data-testid = "applyBtn"]');
  await apply.click();
  await page.waitForTimeout(3000);

  const market = await page.waitForSelector('//button[@data-testid="selectBtn"]/span[text() = "Marketplaces"]');
  await market.click();

  const clear1 = await page.waitForSelector('//button[text() = "Clear"]');
  await clear1.click();
  await page.waitForTimeout(3000);
  
  const markName = await page.waitForSelector('//*[@data-testid="optionItem" and div/@aria-label="Grubhub"]');
await markName.click();
await page.waitForTimeout(3000);

const apply1 = await page.waitForSelector('//*[@data-testid = "applyBtn"]');
 await apply1.click();
 await page.waitForTimeout(3000);

 

 await page.evaluate(() => {
    window.scrollBy(0, 500);
});
  await page.waitForTimeout(3000);

  

  await page.waitForSelector('.MuiTable-root.css-15i8i05-MuiTable-root tbody tr');
  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    return rows.map(row => {
      const columns = Array.from(row.querySelectorAll('td'));
      return columns.map(column => column.textContent.trim());
    });
  });

  // Converting data to CSV format
  let csvContent = 'Order ID,Location,Order State,Type,Lost Sale,Net Payout,Payout ID,Payout Date\n';
  data.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  // Writing data to CSV file
  fs.writeFileSync('table_data.csv', csvContent);

  console.log('CSV file generated successfully.');

await browser.close();

})();
