import chromium from "@sparticuz/chromium";
import { generate } from 'critical';
import puppeteer from 'puppeteer';

export async function generateCriticalCss(urls) {
  const results = [];
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromium.path, // use bundled Chromium
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    ignoreDefaultArgs: ['--disable-extensions']
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
}
