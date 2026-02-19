"""
Helper script to convert existing letter JPG files to GIF format
This script helps prepare letter images for the web-based ISL converter

Note: This script converts static JPG to static GIF (not animated).
For animated GIFs, you would need source animation files.
"""

import os
from PIL import Image

# Configuration
ISL_GIFS_DIR = "ISL_Gifs"
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def convert_jpg_to_gif():
    """Convert existing JPG letter files to GIF format"""
    if not os.path.isdir(ISL_GIFS_DIR):
        print(f"Error: {ISL_GIFS_DIR} directory not found!")
        return
    
    converted = 0
    skipped = 0
    errors = 0
    
    print(f"Scanning {ISL_GIFS_DIR} for letter images...")
    print("-" * 50)
    
    for letter in LETTERS:
        jpg_path = os.path.join(ISL_GIFS_DIR, f"{letter}.jpg")
        gif_path = os.path.join(ISL_GIFS_DIR, f"{letter}.gif")
        
        # Check if JPG exists
        if not os.path.exists(jpg_path):
            print(f"  {letter}: JPG not found, skipping")
            skipped += 1
            continue
        
        # Check if GIF already exists
        if os.path.exists(gif_path):
            print(f"  {letter}: GIF already exists, skipping")
            skipped += 1
            continue
        
        # Convert JPG to GIF
        try:
            img = Image.open(jpg_path)
            # Convert to RGB if necessary (GIF doesn't support RGBA)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background for transparency
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save as GIF
            img.save(gif_path, 'GIF')
            print(f"  {letter}: ✓ Converted {jpg_path} → {gif_path}")
            converted += 1
        except Exception as e:
            print(f"  {letter}: ✗ Error converting: {e}")
            errors += 1
    
    print("-" * 50)
    print(f"Summary: {converted} converted, {skipped} skipped, {errors} errors")
    
    if converted > 0:
        print(f"\n✓ Successfully converted {converted} letter images to GIF format!")
        print("  The web application will now use these GIF files.")
    else:
        print("\n⚠ No files were converted.")
        print("  The web application will use existing JPG files as fallback.")

if __name__ == "__main__":
    print("=" * 50)
    print("Letter Image Converter (JPG → GIF)")
    print("=" * 50)
    print()
    convert_jpg_to_gif()
    print()
    print("Note: This creates static GIFs from JPG files.")
    print("For animated GIFs, you need source animation files.")

