# Quick Reference - Updated API

## 🚀 Quick Start

1. **Start the server**: Double-click `start_api_server.bat` or run `python app.py`
2. **Open browser**: `http://localhost:5000`
3. **Speak**: Click "Start Voice Input" and speak!

## 📡 API Endpoints Summary

| Endpoint | Purpose | Example |
|----------|---------|---------|
| `GET /api/letter/A` | Get letter image | Returns A.jpg from letters/ folder |
| `GET /api/letter/list` | List all letters | JSON list of available letters |
| `GET /api/phrase/hello` | Get phrase GIF | Returns hello.gif from ISL_Gifs/ |
| `GET /api/phrase/list` | List all phrases | JSON list of available phrases |
| `GET /api/health` | Health check | Server status |

## 🎯 How It Works Now

### Example 1: Phrase Match
**You say**: "hello"  
**Result**: Shows "hello.gif" directly ✨

### Example 2: Word Match
**You say**: "good morning"  
**Result**: Shows "good morning.gif" directly ✨

### Example 3: Letter-by-Letter
**You say**: "HELLO" (if "hello" GIF not found or disabled)  
**Result**: Shows H → E → L → L → O letter images sequentially

### Example 4: Mixed
**You say**: "hello world"  
**Result**: Tries "hello world.gif", if not found, shows letters

## 📂 File Locations

- **Letter images**: `letters/a.jpg`, `letters/b.jpg`, etc.
- **Phrase GIFs**: `ISL_Gifs/hello.gif`, `ISL_Gifs/good morning.gif`, etc.

## ✅ What's New

1. ✅ Letter images now come from `letters/` folder
2. ✅ Phrase/word/sentence GIFs from `ISL_Gifs/` folder
3. ✅ Smart detection: tries phrases first, then letters
4. ✅ Multiple phrase variations supported
5. ✅ Better error handling

## 🧪 Test the API

Open these URLs in your browser:

- `http://localhost:5000/api/letter/A` - See letter A
- `http://localhost:5000/api/phrase/hello` - See "hello" GIF
- `http://localhost:5000/api/phrase/list` - See all available phrases
- `http://localhost:5000/api/letter/list` - See all available letters

## 🎉 Ready to Use!

The server should be running. Open `http://localhost:5000` and start speaking!

