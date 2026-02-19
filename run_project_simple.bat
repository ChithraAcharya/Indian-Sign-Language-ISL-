@echo off
REM Simple version - Quick start
title ISL Converter - Quick Start

cd /d "%~dp0"

echo Starting Indian Sign Language Converter...
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python first.
    pause
    exit /b 1
)

REM Install dependencies if needed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install Flask flask-cors --quiet
)

REM Open browser
timeout /t 2 /nobreak >nul
start "" "http://localhost:5000"

REM Start server
echo Server starting on http://localhost:5000
echo Press Ctrl+C to stop
echo.
python app.py

pause

