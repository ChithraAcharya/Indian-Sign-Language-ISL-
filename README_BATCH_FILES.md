# Batch Files for Running the Project

## 📁 Available Batch Files

### 1. `run_project.bat` ⭐ **RECOMMENDED**
**Complete project runner with full output and checks**

**Features:**
- ✅ Checks Python installation
- ✅ Verifies all project files exist
- ✅ Installs dependencies automatically
- ✅ Checks port availability
- ✅ Shows detailed output
- ✅ Opens browser automatically
- ✅ Displays API endpoints
- ✅ Error handling

**Usage:**
```bash
Double-click: run_project.bat
```

**What it does:**
1. Checks Python installation
2. Verifies project files (app.py, index.html, folders)
3. Installs Flask and dependencies if needed
4. Checks if port 5000 is available
5. Shows project information
6. Opens browser automatically
7. Starts Flask server

---

### 2. `run_project_simple.bat`
**Quick start - minimal output**

**Features:**
- ✅ Quick Python check
- ✅ Auto-install dependencies
- ✅ Opens browser
- ✅ Minimal output

**Usage:**
```bash
Double-click: run_project_simple.bat
```

**Best for:** Quick testing, when you know everything is set up

---

### 3. `install_and_run.bat`
**Install dependencies first, then run**

**Features:**
- ✅ Upgrades pip
- ✅ Installs all dependencies
- ✅ Verifies installation
- ✅ Then runs the server

**Usage:**
```bash
Double-click: install_and_run.bat
```

**Best for:** First-time setup or when dependencies need updating

---

### 4. `start_api_server.bat` (Existing)
**Original server starter**

**Features:**
- ✅ Basic server startup
- ✅ Shows API endpoints

---

## 🚀 Quick Start Guide

### For First Time Users:
1. **Double-click**: `install_and_run.bat`
   - This will install everything and start the server

### For Regular Use:
1. **Double-click**: `run_project.bat`
   - This checks everything and starts the server

### For Quick Testing:
1. **Double-click**: `run_project_simple.bat`
   - Fastest way to start

---

## 📋 What Each File Does

### run_project.bat (Detailed)
```
[1/5] Checking Python installation...
[2/5] Checking project files...
[3/5] Checking dependencies...
[4/5] Checking server port...
[5/5] Project Information...
Starting Flask Server...
```

### run_project_simple.bat (Quick)
```
Starting Indian Sign Language Converter...
Installing dependencies... (if needed)
Server starting on http://localhost:5000
```

### install_and_run.bat (Install First)
```
[1/3] Upgrading pip...
[2/3] Installing project dependencies...
[3/3] Verifying installation...
Installation Complete!
Starting server...
```

---

## 🔧 Requirements

All batch files require:
- ✅ Python 3.6+ installed
- ✅ Python added to PATH
- ✅ Internet connection (for pip install)

---

## 📂 Project Structure

The batch files expect this structure:
```
project/
├── app.py                    ← Required
├── index.html               ← Required
├── script.js                ← Required
├── styles.css               ← Required
├── requirements.txt         ← Required
├── ISL_Gifs/                ← Required (for GIFs)
├── letters/                 ← Required (for letters)
├── run_project.bat          ← Main runner
├── run_project_simple.bat   ← Quick start
└── install_and_run.bat      ← Install first
```

---

## ⚠️ Troubleshooting

### "Python is not installed"
- Install Python from: https://www.python.org/downloads/
- Make sure to check "Add Python to PATH"

### "Port 5000 is already in use"
- Another instance is running
- Close other instances or change port in app.py

### "Dependencies installation failed"
- Check internet connection
- Try: `pip install Flask flask-cors` manually
- Or use: `install_and_run.bat`

### "app.py not found"
- Make sure you're in the project directory
- Batch file should be in the same folder as app.py

---

## 🎯 Recommended Workflow

1. **First time**: Use `install_and_run.bat`
2. **Daily use**: Use `run_project.bat`
3. **Quick test**: Use `run_project_simple.bat`

---

## 📝 Notes

- All batch files change to their own directory automatically
- Browser opens automatically after a few seconds
- Server runs on: `http://localhost:5000`
- Press `Ctrl+C` to stop the server
- All files include error handling

---

## ✅ Success Indicators

When everything works, you'll see:
- ✅ Python version displayed
- ✅ Files found
- ✅ Dependencies installed/verified
- ✅ Server starting message
- ✅ Browser opens automatically
- ✅ Server running on http://localhost:5000

---

**Choose the batch file that fits your needs!** 🚀

