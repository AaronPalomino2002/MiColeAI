import os
import json
import requests
import re
from pathlib import Path
from urllib.parse import urlparse

# Project configuration
PROJECT_ID = "8088926255099658878"
BASE_DIR = Path(r"c:\Users\Lenovo\Desktop\projectMoon\stitch-import")
IMAGES_ROOT = BASE_DIR / "images"
SCREENSHOTS_DIR = BASE_DIR / "screenshots"
# Path to the fresh screen list output
SCREENS_DATA_FILE = Path(r"C:\Users\Lenovo\.gemini\antigravity\brain\5c4f307a-d01d-4423-955d-96b70045a93e\.system_generated\steps\223\output.txt")

def sanitize_filename(name):
    # Remove chars that are not alphanumeric, spaces, underscores, or hyphens
    s = re.sub(r'[^\w\s-]', '', name).strip().replace(' ', '_')
    return s

def download_file(url, target_path):
    try:
        # User-agent to avoid being blocked if any
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, stream=True, timeout=30)
        response.raise_for_status()
        target_path.parent.mkdir(parents=True, exist_ok=True)
        with open(target_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"  FAILED to download {url}: {e}")
        return False

def is_image_url(url):
    # Very loose check for images, avoiding scripts and fonts
    # Stitch URLs often look like https://lh3.googleusercontent.com/aida/...
    # or https://contribution.usercontent.google.com/download?c=...
    parsed = urlparse(url)
    path = parsed.path.lower()
    query = parsed.query.lower()
    
    # Do not treat these as images
    if 'fonts.googleapis.com' in url or 'fonts.gstatic.com' in url:
        return False
    if path.endswith('.js') or path.endswith('.css'):
        return False
    # If it's a known image extension
    if any(path.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']):
        return True
    # If it's a Google Photos / Aida image URL (common in Stitch)
    if 'lh3.googleusercontent.com/aida' in url:
        return True
    
    return False

def process_screens():
    with open(SCREENS_DATA_FILE, 'r') as f:
        data = json.load(f)

    screens = data.get('screens', [])
    print(f"Found {len(screens)} screens to process.")
    
    for screen in screens:
        title = screen.get('title', 'Unknown_Screen')
        screen_id_full = screen.get('name', 'unknown')
        screen_id = screen_id_full.split('/')[-1]
        
        # Unique safe name per screen
        safe_name = f"{sanitize_filename(title)}_{screen_id[:6]}"
        print(f"--- Processing: {title} ({screen_id}) ---")
        
        # 1. Download Screenshot
        screenshot_url = screen.get('screenshot', {}).get('downloadUrl')
        if screenshot_url:
            ss_path = SCREENSHOTS_DIR / f"{safe_name}.png"
            if download_file(screenshot_url, ss_path):
                print(f"  Screenshot saved: {ss_path.name}")
        
        # 2. Download HTML
        html_url = screen.get('htmlCode', {}).get('downloadUrl')
        if not html_url:
            print(f"  SKIP: No HTML URL for {title}")
            continue
            
        html_path = BASE_DIR / f"{safe_name}.html"
        if download_file(html_url, html_path):
            print(f"  HTML saved: {html_path.name}")
            
            # 3. Process HTML for Images
            try:
                with open(html_path, 'r', encoding='utf-8') as f_h:
                    content = f_h.read()
                
                # Regex for src="..." or src='...'
                # I'll specifically look for tags like <img ... src="..."
                # to be safer, but the is_image_url check helps.
                
                # Find all src values
                matches = re.findall(r'src=["\']([^"\']+)["\']', content)
                # Also look for background-image in styles
                matches += re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', content)
                
                # Dedup and filter
                urls_to_download = list(set([u for u in matches if is_image_url(u)]))
                
                if urls_to_download:
                    screen_images_dir = IMAGES_ROOT / safe_name
                    screen_images_dir.mkdir(parents=True, exist_ok=True)
                    
                    for i, img_url in enumerate(urls_to_download):
                        # Determine extension or default to png
                        ext = '.png'
                        if '.svg' in img_url.lower(): ext = '.svg'
                        elif '.webp' in img_url.lower(): ext = '.webp'
                        
                        img_filename = f"image_{i}{ext}"
                        img_target = screen_images_dir / img_filename
                        
                        if download_file(img_url, img_target):
                            # Replace in content
                            # Use regex sub with escape to be safe
                            local_path = f"./images/{safe_name}/{img_filename}"
                            # Careful with escaping the URL for regex
                            escaped_url = re.escape(img_url)
                            content = re.sub(escaped_url, local_path, content)
                            print(f"    Asset saved: {img_filename}")
                
                # Save sanitized/localized HTML
                with open(html_path, 'w', encoding='utf-8') as f_h:
                    f_h.write(content)
                    
            except Exception as e:
                print(f"  ERROR processing HTML for {title}: {e}")

if __name__ == "__main__":
    process_screens()
