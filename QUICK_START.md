# Quick Start Guide - ISL Web Converter

## 🚀 Quick Start (3 Steps)

### Step 1: Open the Application
Simply open `index.html` in your web browser:
- **Chrome** (Recommended) - Best Web Speech API support
- **Edge** - Good support
- **Safari** - Good support on macOS/iOS

**Note**: For best results, use a local web server (see below).

### Step 2: Allow Microphone Access
When prompted, click "Allow" to grant microphone permissions.

### Step 3: Start Speaking
1. Click **"Start Voice Input"** button
2. Speak a sentence (e.g., "HELLO WORLD")
3. Watch the letters and ISL animations appear!

## 📁 File Structure

The application uses your existing folder structure:
```
ISL_Gifs/
  ├── A.jpg (or A.gif) ← Works with both!
  ├── B.jpg (or B.gif)
  ├── ...
  └── Z.jpg (or Z.gif)
```

**Current Status**: Your project has JPG files (A.jpg, B.jpg, etc.) which will work perfectly!

## 🌐 Running with Web Server (Recommended)

### Option 1: Python (Easiest)
```bash
cd "Automatic-Indian-Sign-Language-Translator-master"
python -m http.server 8000
```
Then open: http://localhost:8000

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

### Option 3: Node.js
```bash
npx http-server -p 8000
```

## ✨ Features

- ✅ **Speech-to-Text**: Real-time conversion
- ✅ **Letter Extraction**: Automatically extracts A-Z letters
- ✅ **ISL Animation**: Shows sign language for each letter
- ✅ **Dark Mode**: Toggle in top-right corner
- ✅ **Smooth Animations**: Beautiful transitions

## 🎯 Example Usage

1. Click "Start Voice Input"
2. Say: **"HELLO"**
3. See:
   - Detected: "HELLO"
   - Letters: H → E → L → L → O
   - GIFs: Shows ISL sign for each letter in sequence

## 🔧 Troubleshooting

**Microphone not working?**
- Check browser permissions
- Use Chrome/Edge for best support
- Ensure you're on HTTPS or localhost

**GIFs not showing?**
- Check that `ISL_Gifs/A.jpg`, `B.jpg`, etc. exist
- The app works with both .gif and .jpg files
- Check browser console (F12) for errors

**Speech not recognized?**
- Speak clearly
- Check internet connection (required for Google Speech API)
- Try Chrome browser

## 📝 Notes

- The app works with your existing JPG files
- For animated GIFs, you can convert JPGs using `convert_letters_to_gif.py`
- Dark mode preference is saved automatically
- Each letter displays for 2 seconds (configurable in script.js)

## 🎨 Customization

Edit `script.js` to customize:
- Display duration per letter
- Animation speed
- Folder paths

Enjoy using the Indian Sign Language Converter! 🎉

