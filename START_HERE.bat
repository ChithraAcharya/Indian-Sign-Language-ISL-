@echo off
REM ========================================
REM INDIAN SIGN LANGUAGE CONVERTER
REM START HERE - Main Entry Point
REM ========================================

title Indian Sign Language Converter

color 0A
cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║     INDIAN SIGN LANGUAGE CONVERTER                       ║
echo ║     Speech → Letters → GIFs (Video Format)              ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo.

REM Change to script directory
cd /d "%~dp0"

REM Quick Python check
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Python is not installed!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting project setup...
echo.

REM Check if dependencies are installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing dependencies (first time setup)...
    echo This may take a minute...
    python -m pip install --upgrade pip --quiet
    python -m pip install Flask flask-cors --quiet
    if errorlevel 1 (
        color 0C
        echo [ERROR] Failed to install dependencies!
        echo Please check your internet connection.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed!
    echo.
)

REM Verify files
if not exist "app.py" (
    color 0C
    echo [ERROR] app.py not found!
    echo Please make sure all project files are present.
    pause
    exit /b 1
)

color 0A
echo [OK] All checks passed!
echo.
echo ═══════════════════════════════════════════════════════════
echo   Starting Server...
echo ═══════════════════════════════════════════════════════════
echo.
echo   Server URL: http://localhost:5000
echo   Browser will open automatically...
echo.
echo   Features:
echo     - Speech to Text
echo     - Letter-by-Letter Display
echo     - Phrase GIFs (Video Format)
echo     - Dark Mode
echo.
echo   Press Ctrl+C to stop the server
echo.
echo ═══════════════════════════════════════════════════════════
echo.

REM Open browser after delay
timeout /t 3 /nobreak >nul
start "" "http://localhost:5000" >nul 2>&1

REM Start the server
python app.py

REM If we get here, server stopped
echo.
color 0E
echo ═══════════════════════════════════════════════════════════
echo   Server Stopped
echo ═══════════════════════════════════════════════════════════
echo.
pause

