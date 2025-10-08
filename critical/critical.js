// generateCriticalCss.js
import { generate } from 'critical';
import puppeteer from 'puppeteer';

export async function generateCriticalCss(urls) {
  try {
    const results = [];

    // Launch puppeteer browser (can use snap path if env not set)
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || '/snap/bin/chromium',
      args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    });

    for (const url of urls) {
      try {
        const { css } = await generate({
          inline: false,
          base: process.cwd(),
          src: url,
          width: 1300,
          height: 900,
          penthouse: {
            puppeteer: browser,        // pass browser instance
            timeout: 60000,            // penthouse-specific option
            keepLargerMediaQueries: true,
            blockJSRequests: true,
          },
        });

        results.push({ domain: url, css });
      } catch (error) {
        console.error(`❌ Error generating critical CSS for ${url}: ${error}`);
        results.push({ domain: url, css: "" });
      }
    }

    await browser.close();
    return results;
  } catch (error) {
    throw new Error("Error generating critical CSS: " + error.message);
  }
}
