@echo off
REM ========================================
REM ISL Web Converter API Server
REM ========================================

title ISL Converter - API Server

cd /d "%~dp0"

echo ========================================
echo Starting ISL Web Converter API Server
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found!
    pause
    exit /b 1
)

echo Installing dependencies (if needed)...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    pip install Flask flask-cors --quiet
)

echo.
echo Server will start on: http://localhost:5000
echo.
echo API Endpoints:
echo   - GET /                        → Main application
echo   - GET /api/letter/^<letter^>     → Get letter image
echo   - GET /api/phrase/^<phrase^>     → Get phrase GIF (video format)
echo   - GET /api/phrase/list         → List all phrases
echo   - GET /api/health              → Health check
echo.
echo Press Ctrl+C to stop the server
echo.

REM Open browser
timeout /t 2 /nobreak >nul
start "" "http://localhost:5000" >nul 2>&1

python app.py
pause

