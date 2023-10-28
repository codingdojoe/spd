const { mkdtemp } = require("fs/promises");
const { tmpdir } = require("os");
const { join } = require("path");
const puppeteer = require("puppeteer");

(async () => {
  // Create a temporary directory for downloads
  const downloadPath = await mkdtemp(join(tmpdir(), "download-"));

  // Launch the Puppeteer browser
  const browser = await puppeteer.launch({ headless: false });

  // Create a CDPSession
  const client = await browser.target().createCDPSession();

  // Set download location and enable events to track the download progress
  await client.send("Browser.setDownloadBehavior", {
    behavior: "allow", // Allows downloads without user interaction
    downloadPath,
    eventsEnabled: true, // Allows tracking downloads via events
  });

  // Code to generate the browser...
  const page = await browser.newPage();
  await page.goto('https://pgis.plantation.org/crime/index.html');

  // Click the first button
  await page.evaluate(() => {
    const firstButton = document.querySelector("#leftPane > div > button.tablinks.active");
    if (firstButton) {
      firstButton.click();
    }
  });

  // Wait for the first action to complete, or use waitForTimeout if necessary
  // For example: await page.waitForTimeout(1000); // Wait for 1 second

  // Click the second button
  await page.evaluate(() => {
    const secondButton = document.querySelector("#Exprot2CSV");
    if (secondButton) {
      secondButton.click();
    }
  });

  // Close the browser when done
  await browser.close();

  console.log(`Downloaded file to "${downloadPath}".`);
})();
