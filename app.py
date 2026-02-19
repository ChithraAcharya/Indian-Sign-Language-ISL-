"""
Flask API Server for Indian Sign Language Converter
Serves the web application and provides API endpoints for GIF files
"""

from flask import Flask, send_file, jsonify, send_from_directory
from flask_cors import CORS
import os
from pathlib import Path

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Configuration
ISL_GIFS_DIR = "ISL_Gifs"  # For phrase/word/sentence GIFs
LETTERS_DIR = "letters"    # For individual letter images
BASE_DIR = Path(__file__).parent

@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_file('index.html')

@app.route('/api/letter/<letter>')
def get_letter_image(letter):
    """
    API endpoint to get letter image from letters/ folder
    Returns the letter image (a.jpg, b.jpg, etc.)
    """
    letter = letter.lower()  # Normalize to lowercase (letters folder uses lowercase)
    
    # Try different file formats
    possible_paths = [
        os.path.join(LETTERS_DIR, f"{letter}.jpg"),
        os.path.join(LETTERS_DIR, f"{letter}.png"),
        os.path.join(LETTERS_DIR, f"{letter}.gif"),
        os.path.join(LETTERS_DIR, f"{letter.upper()}.jpg"),
        os.path.join(LETTERS_DIR, f"{letter.upper()}.png"),
        os.path.join(LETTERS_DIR, f"{letter.upper()}.gif"),
    ]
    
    for path in possible_paths:
        full_path = BASE_DIR / path
        if full_path.exists():
            try:
                return send_file(str(full_path))
            except Exception as e:
                return jsonify({
                    'error': f'Error serving file: {str(e)}',
                    'path': path
                }), 500
    
    # File not found
    return jsonify({
        'error': f'Letter image not found: {letter}',
        'searched_paths': possible_paths
    }), 404

@app.route('/api/gif/<letter>')
def get_gif(letter):
    """
    API endpoint to get GIF/image for a letter (deprecated - use /api/letter/)
    Kept for backward compatibility
    """
    return get_letter_image(letter)

@app.route('/api/phrase/<path:phrase>')
def get_phrase_gif(phrase):
    """
    API endpoint to get GIF for a phrase/word/sentence (Video-like format)
    Searches ISL_Gifs folder for matching GIF files
    Returns GIF that plays automatically like a video
    """
    phrase_clean = phrase.strip().lower()
    
    # Try different filename variations
    variations = [
        phrase_clean,  # Original
        phrase_clean.replace(' ', '_'),  # Spaces to underscores
        phrase_clean.replace(' ', '-'),  # Spaces to hyphens
        phrase_clean.replace(' ', ''),   # No spaces
    ]
    
    # Try with .gif extension
    for variant in variations:
        gif_path = os.path.join(ISL_GIFS_DIR, f"{variant}.gif")
        full_path = BASE_DIR / gif_path
        if full_path.exists():
            try:
                # Set proper headers for GIF/video-like playback
                response = send_file(str(full_path))
                response.headers['Content-Type'] = 'image/gif'
                response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
                response.headers['Pragma'] = 'no-cache'
                response.headers['Expires'] = '0'
                return response
            except Exception as e:
                return jsonify({
                    'error': f'Error serving file: {str(e)}',
                    'path': gif_path
                }), 500
    
    # If exact match not found, try partial matching
    if os.path.isdir(ISL_GIFS_DIR):
        words = phrase_clean.split()
        for filename in os.listdir(ISL_GIFS_DIR):
            if not filename.lower().endswith('.gif'):
                continue
            filename_no_ext = os.path.splitext(filename)[0].lower()
            # Check if all words in phrase are in filename
            if all(word in filename_no_ext for word in words if word):
                gif_path = os.path.join(ISL_GIFS_DIR, filename)
                full_path = BASE_DIR / gif_path
                if full_path.exists():
                    try:
                        response = send_file(str(full_path))
                        response.headers['Content-Type'] = 'image/gif'
                        return response
                    except Exception as e:
                        continue
    
    # File not found
    return jsonify({
        'error': f'GIF not found for phrase: {phrase}',
        'searched_variations': variations,
        'suggestion': 'Try checking available phrases with /api/phrase/list'
    }), 404

@app.route('/api/phrase/list')
def list_available_phrases():
    """API endpoint to list all available phrase/word GIFs"""
    phrases = []
    
    if not os.path.isdir(ISL_GIFS_DIR):
        return jsonify({
            'error': f'Directory {ISL_GIFS_DIR} not found',
            'phrases': []
        }), 404
    
    # List all GIF files (excluding letter files)
    for filename in os.listdir(ISL_GIFS_DIR):
        if filename.lower().endswith('.gif'):
            # Skip single letter files (they're in letters/ folder)
            name_no_ext = os.path.splitext(filename)[0]
            if len(name_no_ext) > 1 or not name_no_ext.isalpha():
                phrases.append({
                    'phrase': name_no_ext,
                    'filename': filename,
                    'url': f'/api/phrase/{name_no_ext}'
                })
    
    return jsonify({
        'phrases': sorted(phrases, key=lambda x: x['phrase']),
        'count': len(phrases)
    })

@app.route('/api/letter/list')
def list_available_letters():
    """API endpoint to list all available letter images"""
    available = {}
    
    if not os.path.isdir(LETTERS_DIR):
        return jsonify({
            'error': f'Directory {LETTERS_DIR} not found',
            'available': {}
        }), 404
    
    # Check for each letter
    for letter in "abcdefghijklmnopqrstuvwxyz":
        paths_to_check = [
            f"{letter}.jpg",
            f"{letter}.png",
            f"{letter}.gif",
        ]
        
        for filename in paths_to_check:
            filepath = os.path.join(LETTERS_DIR, filename)
            if os.path.exists(filepath):
                available[letter.upper()] = {
                    'letter': letter.upper(),
                    'filename': filename,
                    'path': filepath,
                    'url': f'/api/letter/{letter}'
                }
                break
    
    return jsonify({
        'available': available,
        'count': len(available)
    })

@app.route('/api/gif/list')
def list_available_gifs():
    """API endpoint to list all available letter GIFs (deprecated - use /api/letter/list)"""
    return list_available_letters()

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'isl_gifs_dir': ISL_GIFS_DIR,
        'isl_gifs_exists': os.path.isdir(ISL_GIFS_DIR),
        'letters_dir': LETTERS_DIR,
        'letters_exists': os.path.isdir(LETTERS_DIR)
    })

# Serve static files (CSS, JS)
@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    if os.path.isfile(path):
        return send_file(path)
    return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    print("=" * 50)
    print("Indian Sign Language Converter - API Server")
    print("=" * 50)
    print(f"ISL GIFs Directory: {ISL_GIFS_DIR}")
    print(f"Directory exists: {os.path.isdir(ISL_GIFS_DIR)}")
    print()
    print("Server starting on: http://localhost:5000")
    print("API Endpoints:")
    print("  - GET /                        → Main application")
    print("  - GET /api/letter/<letter>     → Get letter image from letters/ folder")
    print("  - GET /api/letter/list         → List all available letters")
    print("  - GET /api/phrase/<phrase>     → Get GIF for phrase/word/sentence")
    print("  - GET /api/phrase/list         → List all available phrases")
    print("  - GET /api/health              → Health check")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)

