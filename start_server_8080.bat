@echo off
echo ========================================
echo Starting ISL Web Converter Server
echo ========================================
echo.
echo Server will start on: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
python -m http.server 8080
pause

