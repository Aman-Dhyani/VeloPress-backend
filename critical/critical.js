// generateCriticalCss.js
import { generate } from 'critical';
import puppeteer from 'puppeteer';
import fs from "fs";

const possiblePaths = [
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium-browser"
];

export async function generateCriticalCss(urls) {
  try {
    const results = [];
    const browserPath = possiblePaths.find(p => fs.existsSync(p));
    if (!browserPath) throw new Error("No Chromium/Chrome binary found");
    
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: browserPath,
      args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
    });

    // Loop through each URL in the urls array
    for (const url of urls) {
      try {
        const { css } = await generate({
          inline: false,
          base: process.cwd(),
          src: url,
          width: 1300,
          height: 900,
          penthouse: {
            puppeteer: browser,
            timeout: 60000,
          },
        });
        results.push({ domain: url, css });
      } catch (error) {
        console.log(`Error generating critical CSS for ${url}: ${error}`);
        results.push({ domain: url, css: "" });
      }
    }
    await browser.close();
    return results;
  } catch (error) {
    throw new Error("Error generating critical CSS: " + error.message);
  }
}
