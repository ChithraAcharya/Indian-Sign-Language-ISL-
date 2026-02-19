# Indian Sign Language Converter - Web Feature

## Overview
This web-based feature converts speech to text, splits it into individual letters, and displays corresponding Indian Sign Language (ISL) GIF animations for each letter.

## Features
- ✅ **Speech-to-Text**: Uses Web Speech API for real-time speech recognition
- ✅ **Letter Extraction**: Automatically extracts letters (A-Z) from spoken sentences
- ✅ **ISL GIF Display**: Shows animated ISL signs for each letter sequentially
- ✅ **Modern UI**: Clean, center-aligned, responsive design
- ✅ **Dark Mode**: Toggle between light and dark themes
- ✅ **Smooth Animations**: Transitions between letters and GIFs

## File Structure

```
Automatic-Indian-Sign-Language-Translator-master/
├── index.html          # Main HTML file
├── styles.css          # Styling and dark mode
├── script.js           # Web Speech API and GIF display logic
├── ISL_Gifs/           # ISL GIF/Image files for letters
│   ├── A.gif (or A.jpg)
│   ├── B.gif (or B.jpg)
│   ├── ...
│   └── Z.gif (or Z.jpg)
└── FEATURE_README.md   # This file
```

## ISL GIFs Folder Structure

The application looks for letter images in the `ISL_Gifs/` folder (using the existing folder structure).

### Supported Formats
- **Preferred**: `.gif` files (animated GIFs)
- **Fallback**: `.jpg` files (static images)

### Naming Convention
- Uppercase letters: `A.gif`, `B.gif`, `C.gif`, ..., `Z.gif`
- Lowercase letters: `a.gif`, `b.gif`, `c.gif`, ..., `z.gif` (also supported)

### Current Status
The existing `ISL_Gifs/` folder contains:
- `A.jpg`, `B.jpg`, `C.jpg`, `D.jpg`, `E.jpg`, `F.jpg`, `G.jpg`, `H.jpg`, `L.jpg`, `M.jpg`, `P.jpg`, `T.jpg`, `Y.jpg`, `Z.jpg`

**Note**: The application will work with these `.jpg` files, but for better animation, consider converting them to `.gif` format.

## How to Use

1. **Open the Application**
   - Open `index.html` in a modern web browser (Chrome, Edge, or Safari recommended)
   - For best results, use a local web server (see "Running with a Web Server" below)

2. **Start Voice Input**
   - Click the "Start Voice Input" button
   - Allow microphone access when prompted
   - Speak a sentence clearly

3. **View Results**
   - The detected sentence will appear in the "Detected Sentence" section
   - Letters will be extracted and displayed sequentially
   - Each letter's ISL sign animation will play automatically
   - The letter sequence is shown at the bottom with the active letter highlighted

4. **Stop Recognition**
   - Click "Stop" to stop the current recognition session
   - Or wait for the recognition to complete automatically

5. **Dark Mode**
   - Click the moon/sun icon in the top-right corner to toggle dark mode
   - Your preference is saved in browser localStorage

## Browser Compatibility

### Supported Browsers
- ✅ **Chrome** (Recommended)
- ✅ **Edge** (Chromium-based)
- ✅ **Safari** (macOS/iOS)
- ⚠️ **Firefox** (Limited support - may require additional setup)

### Requirements
- Modern browser with Web Speech API support
- Microphone access permission
- HTTPS or localhost (required for microphone access in most browsers)

## Running with a Web Server

For best results and to avoid CORS issues, run the application using a local web server:

### Option 1: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open: `http://localhost:8000`

### Option 2: Node.js HTTP Server
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```
Then open: `http://localhost:8000`

### Option 3: VS Code Live Server
- Install "Live Server" extension in VS Code
- Right-click on `index.html` and select "Open with Live Server"

## Configuration

You can modify the following settings in `script.js`:

```javascript
const CONFIG = {
    ISL_GIFS_DIR: 'ISL_Gifs',           // Folder containing ISL GIFs
    LETTER_DISPLAY_DURATION: 2000,      // Time to display each letter (ms)
    ANIMATION_DURATION: 500,            // Animation duration (ms)
};
```

## Troubleshooting

### Microphone Not Working
- Check browser permissions for microphone access
- Ensure you're using HTTPS or localhost
- Try a different browser (Chrome recommended)

### GIFs Not Loading
- Verify that letter GIFs/JPGs exist in `ISL_Gifs/` folder
- Check browser console for errors
- Ensure file names match: `A.gif`, `B.gif`, etc. (uppercase)
- Try using a web server instead of opening file directly

### Speech Recognition Not Working
- Use Chrome, Edge, or Safari for best support
- Check internet connection (Google Speech API requires internet)
- Speak clearly and ensure microphone is working
- Check browser console for error messages

### Letters Not Displaying
- Ensure you're speaking words with letters (A-Z)
- Numbers and special characters are automatically ignored
- Check that letter images exist in `ISL_Gifs/` folder

## Integration with Existing Project

This web feature is designed to work alongside the existing Python-based application (`main2.py`). Both can coexist:

- **Python App**: Desktop application using Tkinter
- **Web App**: Browser-based application using Web Speech API

The web app uses the same `ISL_Gifs/` folder structure, so no file reorganization is needed.

## Future Enhancements

Potential improvements:
- [ ] Support for word-level ISL signs (not just letters)
- [ ] Customizable display duration per letter
- [ ] Export functionality (save as video/GIF)
- [ ] Multiple language support
- [ ] Offline speech recognition support
- [ ] Letter-by-letter playback controls

## License

Same as the main project.

