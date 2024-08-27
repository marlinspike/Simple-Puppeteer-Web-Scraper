# Use an x86-compatible slim Node.js image
FROM --platform=linux/amd64 node:20-slim

# Install necessary dependencies for Puppeteer and Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    wget \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install Node.js dependencies
COPY package.json ./
RUN npm install

# Copy the web scraper script
COPY web_scraper.js ./

# Expose the desired port
EXPOSE 5129

# Run the application
CMD ["node", "web_scraper.js"]
