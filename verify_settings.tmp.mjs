import { chromium } from 'playwright'

const BASE = 'http://localhost:5183'

const browser = await chromium.launch()
const page = await browser.newPage()
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push(String(err)))

const shot = async (name) => page.screenshot({ path: `/private/tmp/claude-501/-Users-fakhrigajar-Desktop-codelingo/e8b8a31f-b789-4d41-996f-b82f145f1b4f/scratchpad/${name}.png` })

// 1. Sign up a fresh test user
await page.goto(`${BASE}/account`)
await page.click('.flex.gap-2 >> button:has-text("Sign up")')
await page.fill('input[type="text"][maxlength="30"]', 'Test User')
await page.fill('input[pattern="[A-Za-z0-9_]+"]', 'testuser1')
await page.selectOption('select', '10')
await page.fill('input[type="password"]', 'pass1234')
await page.click('button:has-text("Create account")')
await page.waitForURL('**/profile')
console.log('Signed up OK, on', page.url())

// 2. Open navbar dropdown, click Settings
await page.click('button[aria-haspopup="menu"]')
await page.waitForSelector('text=Settings')
await shot('01-dropdown-open')
await page.click('div[role="menu"] >> text=Settings')
await page.waitForURL('**/settings')
console.log('Navigated to settings, on', page.url())

// 3. Check prefilled fields
const displayNameVal = await page.inputValue('input[maxlength="30"]')
const usernameVal = await page.inputValue('input[pattern="[A-Za-z0-9_]+"]')
console.log('Prefilled displayName:', displayNameVal, '| username:', usernameVal)
await shot('02-settings-prefilled')

// 4. Try submitting without current password (should fail validation - browser required attr blocks, so instead fill wrong password)
await page.fill('input[type="email"]', 'test@example.com')
await page.fill('input[placeholder="Required to save changes"]', 'wrongpass')
await page.click('button:has-text("Save changes")')
await page.waitForTimeout(300)
const errText = await page.locator('.bg-\\[\\#FFEDEB\\]').textContent().catch(() => null)
console.log('Error with wrong current password:', errText)
await shot('03-wrong-password-error')

// 5. Now with correct current password, change display name + email
await page.fill('input[placeholder="Required to save changes"]', 'pass1234')
await page.fill('input[maxlength="30"]', 'Test User Updated')
await page.click('button:has-text("Save changes")')
await page.waitForURL('**/profile')
console.log('After save, on', page.url())
const profileName = await page.locator('h1').textContent()
console.log('Profile heading now:', profileName)
await shot('04-profile-after-update')

// 6. Log out via dropdown
await page.click('button[aria-haspopup="menu"]')
await page.waitForSelector('text=Logout')
await page.click('div[role="menu"] >> text=Logout')
await page.waitForTimeout(500)
console.log('After logout, on', page.url())
await shot('05-after-logout')
const loggedOutBtn = await page.locator('button:has-text("Log in / Sign up")').count()
console.log('Login button visible after logout:', loggedOutBtn > 0)

console.log('Console/page errors:', errors)

await browser.close()
