@echo off
echo Opening ISL Web Converter directly...
cd /d "%~dp0"
start "" "index.html"
echo.
echo Note: Opening directly may have limited functionality due to browser security.
echo For full features, use the web server (start_server.bat)
pause

