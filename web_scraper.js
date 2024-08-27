const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

async function scrape(url, container) {
    const browser = await puppeteer.launch({ 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Reduces RAM usage
            '--disable-gpu', // Disables GPU acceleration
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Runs browser in a single process, useful for low-resource environments
            '--disable-extensions'
        ],
        headless: true 
    });

    const page = await browser.newPage();

    // Block unnecessary resources like images and CSS
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
        await page.goto(url, { waitUntil: 'domcontentloaded' });

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
