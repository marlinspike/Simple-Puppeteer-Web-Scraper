const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

async function scrape(url, container) {
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true 
    });

    try {
        const page = await browser.newPage();
        console.log(`Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        let content;
        if (container) {
            console.log(`Selecting content in container: ${container}`);
            content = await page.$eval(container, el => el.innerHTML);
        } else {
            content = await page.content();
        }

        console.log(`Successfully scraped content from ${url}`);
        await browser.close();
        return content;

    } catch (error) {
        console.error("Error during scraping:", error.message);
        console.error("Stack trace:", error.stack);
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
