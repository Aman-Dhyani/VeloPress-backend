// generateCriticalCss.js
import { generate } from 'critical';
import puppeteer from 'puppeteer';
import chromium from "@sparticuz/chromium";
import 'dotenv/config';

export async function generateCriticalCss(urls) {
  try {
    const results = [];
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || await chromium.executablePath,
      args: ["--no-sandbox"],
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