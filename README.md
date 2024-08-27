# Puppeteer Web Scraper with Docker
This project provides a Dockerized web scraping solution using Puppeteer, running on a Linux x86 architecture with the ability to emulate x86 on ARM platforms. It includes a Python client for testing the scraping functionality.

# Getting Started
## Prerequisites
- Docker installed on your system
- Python 3.x installed on your system

## Installation
Clone the repository to your local machine:

```git clone https://github.com/yourusername/puppeteer-web-scraper.git```

#### Build the Docker image:

`docker build --platform linux/amd64 -t puppeteer-web-scraper .`

#### Running the Docker Container
To run the Docker container, use the following command:

`docker run --rm --platform linux/amd64 -e PORT=5129 -p 5129:5129 puppeteer-web-scraper`

This command starts the web scraper server on port 5129.

#### Python Client Usage
The Python client script test_scraper.py is used to test the scraping functionality.

#### Command-Line Arguments
- URL: The URL to scrape (optional, defaults to https://www.example.com).
- Container: The CSS selector of the container to scrape (optional).

#### Running the Python Client
Using the Default URL and No Container:

`python test_scraper.py`

#### Passing a URL and Using No Container:

`python test_scraper.py "https://www.google.com"`

#### Passing Both a URL and a Container:

`python test_scraper.py "https://www.example.com" ".main-content"`


#### Building the Docker Image

`docker build --platform linux/amd64 -t puppeteer-web-scraper .`

#### Running the Docker Container
`docker run --rm --platform linux/amd64 -e PORT=5129 -p 5129:5129 puppeteer-web-scraper`

#### Running the Python Client
`python test_scraper.py "https://www.example.com" ".main-content"`

### Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss changes.