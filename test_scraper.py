import requests
import sys

def test_puppeteer_scraper(url, container=None, port=5129):
    base_url = f"http://localhost:{port}/scrape"
    params = {'url': url}
    
    if container:
        params['container'] = container

    try:
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            print("Scraped content:")
            print(response.text)
        else:
            print(f"Failed to scrape. Status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Get the URL and container from command line arguments, or use defaults
    url = sys.argv[1] if len(sys.argv) > 1 else "https://www.example.com"
    container = sys.argv[2] if len(sys.argv) > 2 else None
    test_puppeteer_scraper(url, container)
