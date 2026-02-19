@echo off
echo Opening ISL Web Converter in your default browser...
cd /d "%~dp0"
start http://localhost:8000/index.html
timeout /t 2 /nobreak >nul
echo.
echo If the page doesn't load, make sure the server is running!
echo Run start_server.bat first, then try this again.
pause

