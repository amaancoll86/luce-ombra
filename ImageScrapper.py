import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

def download_images(url, save_folder="downloaded_images"):
    os.makedirs(save_folder, exist_ok=True)

    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    img_tags = soup.find_all("img")
    urls = [urljoin(url, img.get("src")) for img in img_tags if img.get("src")]

    print(f"Found {len(urls)} images. Downloading...")

    for i, img_url in enumerate(urls):
        try:
            img_data = requests.get(img_url, headers=headers, timeout=10).content
            ext = os.path.splitext(urlparse(img_url).path)[-1] or ".jpg"
            filename = os.path.join(save_folder, f"image_{i+1}{ext}")
            with open(filename, "wb") as f:
                f.write(img_data)
            print(f"Saved: {filename}")
        except Exception as e:
            print(f"Failed to download {img_url}: {e}")

# Usage
download_images("https://www.luceandombra.com")