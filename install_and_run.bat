@echo off
REM ========================================
REM Install Dependencies and Run Project
REM ========================================

title ISL Converter - Install and Run

color 0B
echo.
echo ========================================
echo   Installing Dependencies
echo ========================================
echo.

cd /d "%~dp0"

REM Check Python
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

echo [INFO] Python found
echo.

REM Upgrade pip
echo [1/3] Upgrading pip...
python -m pip install --upgrade pip --quiet
echo [OK] pip upgraded
echo.

REM Install requirements
echo [2/3] Installing project dependencies...
if exist "requirements.txt" (
    python -m pip install -r requirements.txt
) else (
    echo [INFO] requirements.txt not found, installing manually...
    python -m pip install Flask flask-cors
)
echo.

if errorlevel 1 (
    color 0C
    echo [ERROR] Failed to install dependencies!
    echo.
    echo Please try manually:
    echo   pip install Flask flask-cors
    echo.
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

REM Verify installation
echo [3/3] Verifying installation...
python -c "import flask; import flask_cors; print('[OK] Flask:', flask.__version__); print('[OK] Flask-CORS installed')" 2>nul
if errorlevel 1 (
    color 0C
    echo [ERROR] Installation verification failed!
    pause
    exit /b 1
)
echo.

color 0A
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Starting server...
echo.

REM Open browser after delay
timeout /t 3 /nobreak >nul
start "" "http://localhost:5000"

REM Start server
python app.py

pause

