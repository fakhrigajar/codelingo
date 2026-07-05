import { chromium } from "playwright";
const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 900, height: 1200 } });
await desktop.goto("http://localhost:5175/courses/typing-ninjas", { waitUntil: "networkidle" });
await desktop.waitForTimeout(400);
await desktop.screenshot({ path: "scratch-desktop.png", fullPage: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:5175/courses/typing-ninjas", { waitUntil: "networkidle" });
await mobile.waitForTimeout(400);
const scrollWidth = await mobile.evaluate(() => document.documentElement.scrollWidth);
const clientWidth = await mobile.evaluate(() => document.documentElement.clientWidth);
console.log("mobile scrollWidth", scrollWidth, "clientWidth", clientWidth);
await mobile.screenshot({ path: "scratch-mobile2.png", fullPage: true });

await browser.close();
