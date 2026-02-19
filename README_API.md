# 🚀 Quick Start - API Server

## ✅ API Server Added Successfully!

Your project now has a **Flask API server** that serves GIFs through API endpoints.

## 🎯 How to Run

### Method 1: Double-click the batch file (Easiest)
1. Double-click **`start_api_server.bat`**
2. Wait for server to start
3. Open browser: **http://localhost:5000**

### Method 2: Command Line
```bash
cd "Automatic-Indian-Sign-Language-Translator-master"
python app.py
```

Then open: **http://localhost:5000**

## 📡 API Endpoints

### Main Application
- **GET** `http://localhost:5000/` → Opens the web app

### Get GIF for Letter
- **GET** `http://localhost:5000/api/gif/A` → Returns GIF for letter A
- **GET** `http://localhost:5000/api/gif/B` → Returns GIF for letter B
- Works for any letter A-Z

### List All Available GIFs
- **GET** `http://localhost:5000/api/gif/list` → JSON list of all available letters

### Health Check
- **GET** `http://localhost:5000/api/health` → Server status

## 🔧 What Changed

1. ✅ **Created `app.py`** - Flask API server
2. ✅ **Updated `script.js`** - Now uses API endpoints instead of direct file access
3. ✅ **Added `requirements.txt`** - Dependencies (Flask, flask-cors)
4. ✅ **Created batch files** - Easy server startup

## ✨ Benefits

- ✅ **No more 404 errors** - API handles file paths correctly
- ✅ **Better error handling** - Clear error messages
- ✅ **CORS enabled** - Works from any origin
- ✅ **Automatic file format detection** - Tries .gif and .jpg
- ✅ **Case-insensitive** - Works with uppercase/lowercase letters

## 🎨 Usage

1. Start the API server: `start_api_server.bat`
2. Open browser: `http://localhost:5000`
3. Click "Start Voice Input"
4. Speak a sentence
5. Watch GIFs load via API! 🎉

## 📝 Example API Calls

```javascript
// In browser console or your code:
fetch('/api/gif/A')
  .then(response => response.blob())
  .then(blob => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
  });
```

## 🐛 Troubleshooting

**Server won't start?**
- Make sure Flask is installed: `pip install Flask flask-cors`
- Or run: `install_dependencies.bat`

**Port 5000 already in use?**
- Edit `app.py` and change `port=5000` to another port (e.g., `port=5001`)

**GIFs not loading?**
- Check that `ISL_Gifs/` folder exists
- Verify letter files exist (A.jpg, B.jpg, etc.)
- Check browser console (F12) for errors

## 📚 Full Documentation

See `API_DOCUMENTATION.md` for complete API reference.

---

**Your API server is ready! 🎉**

