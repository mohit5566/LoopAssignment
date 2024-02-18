const { chromium } = require('playwright');

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

  const history = await page.waitForSelector('//a[contains(@href , "stores")]');
  await history.click();
  await page.waitForTimeout(30000);
  
  const totalColumns = 8;
  const totalRows = 12;
  const sums = Array.from({ length: totalColumns }, () => 0);

  // Fetch table headers
  const headers = await page.$$eval('table tr th', ths => ths.map(th => th.textContent.trim()));

  for (let columnIndex = 1; columnIndex <= totalColumns; columnIndex++) {
    const columnValues = await page.$$eval(`table tr td:nth-child(${columnIndex})`, cells => cells.map(cell => parseFloat(cell.textContent.trim().replace(/\$|,/g, ''))));

    // Exclude the first column
    if (columnIndex === 1) continue;

    // Calculate the sum for the first 10 rows
    for (let rowIndex = 0; rowIndex < totalRows - 2; rowIndex++) {
      sums[columnIndex - 1] += columnValues[rowIndex];
    }

    // Check if the sum matches the value in the 12th row
    const calculatedSum = sums[columnIndex - 1];
    const sumInRow12 = columnValues[totalRows - 2]; // Row index 11 (12th row)
    const result = calculatedSum === sumInRow12 ? 'Match' : 'Mismatch';

    console.log(`\n ${headers[columnIndex - 1]}: \n Calculated Sum: ${calculatedSum} \n Final Sum: ${sumInRow12} \n Result: ${result} \n ___________________________________________________________ \n`);

    // Reset the sum for the next column
    sums[columnIndex - 1] = 0;
  }


  
  // Close the browser
  await browser.close();
})();