import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('http://localhost:5183/account')
await page.click('.flex.gap-2 >> button:has-text("Sign up")')
await page.fill('input[type="text"][maxlength="30"]', 'Debug User')
await page.fill('input[pattern="[A-Za-z0-9_]+"]', 'debuguser2')
await page.selectOption('select', '10')
await page.fill('input[type="password"]', 'pass1234')
await page.click('button:has-text("Create account")')
await page.waitForURL('**/profile')
await page.click('button[aria-haspopup="menu"]')
await page.waitForSelector('text=Logout')
await page.click('div[role="menu"] >> text=Logout')
for (let i=0;i<10;i++){
  await page.waitForTimeout(150)
  console.log(i, page.url())
}
await browser.close()
