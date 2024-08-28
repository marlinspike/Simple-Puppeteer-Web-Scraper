const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

async function scrape(url, container) {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-extensions'
        ],
        headless: true,
        protocolTimeout: 60000 // 60 seconds protocol timeout
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000); // Sets navigation timeout to 60 seconds

    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
            req.abort();
        } else {
            req.continue();
        }
    });

    try {
        console.log("Navigating to URL:", url);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // Wait for network to be idle
        console.log("Page loaded successfully");

        let content;
        if (container) {
            content = await page.$eval(container, el => el.innerHTML);
        } else {
            content = await page.content();
        }

        await browser.close();
        return content;

    } catch (error) {
        console.error("Error during scraping:", error.message);
        await browser.close();
        throw error;
    }
}

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    const container = req.query.container;

    if (!url) {
        console.log("No URL provided");
        return res.status(400).send('URL parameter is required');
    }

    try {
        const content = await scrape(url, container);
        res.send(content);
    } catch (error) {
        console.log("Failed to scrape the content due to:", error.message);
        res.status(500).send('Error occurred while scraping');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
