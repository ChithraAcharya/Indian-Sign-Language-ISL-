@echo off
REM ========================================
REM Indian Sign Language Converter
REM Complete Project Runner
REM ========================================

title Indian Sign Language Converter - Server

color 0A
echo.
echo ========================================
echo   Indian Sign Language Converter
echo   Complete Project Runner
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Check if Python is installed
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo [OK] %PYTHON_VERSION% found
echo.

REM Check if required files exist
echo [2/5] Checking project files...
if not exist "app.py" (
    echo [ERROR] app.py not found!
    echo Please make sure you're running this from the project directory.
    pause
    exit /b 1
)
if not exist "index.html" (
    echo [ERROR] index.html not found!
    pause
    exit /b 1
)
if not exist "ISL_Gifs" (
    echo [WARNING] ISL_Gifs folder not found!
    echo Some features may not work.
) else (
    echo [OK] ISL_Gifs folder found
)
if not exist "letters" (
    echo [WARNING] letters folder not found!
    echo Letter images may not work.
) else (
    echo [OK] letters folder found
)
echo [OK] All required files found
echo.

REM Check and install dependencies
echo [3/5] Checking dependencies...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Flask not found. Installing dependencies...
    echo This may take a few moments...
    python -m pip install --upgrade pip --quiet
    python -m pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies!
        echo Trying manual installation...
        python -m pip install Flask flask-cors
        if errorlevel 1 (
            echo [ERROR] Could not install Flask. Please install manually:
            echo   pip install Flask flask-cors
            pause
            exit /b 1
        )
    )
    echo [OK] Dependencies installed successfully
) else (
    echo [OK] Flask is already installed
)
echo.

REM Check if port 5000 is available
echo [4/5] Checking server port...
netstat -ano | findstr :5000 >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Port 5000 is already in use!
    echo Another instance may be running, or another application is using this port.
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "%CONTINUE%"=="y" (
        echo Exiting...
        pause
        exit /b 1
    )
) else (
    echo [OK] Port 5000 is available
)
echo.

REM Display project information
echo [5/5] Project Information:
echo.
echo   Project Directory: %CD%
echo   Python Version: %PYTHON_VERSION%
echo   Server URL: http://localhost:5000
echo   API Endpoints:
echo     - GET /                    → Main application
echo     - GET /api/letter/^<letter^>  → Get letter image
echo     - GET /api/phrase/^<phrase^>  → Get phrase GIF
echo     - GET /api/phrase/list     → List all phrases
echo     - GET /api/health          → Health check
echo.
echo ========================================
echo   Starting Flask Server...
echo ========================================
echo.
echo   Press Ctrl+C to stop the server
echo   Server will open in your browser automatically
echo.
echo ========================================
echo.

REM Wait a moment, then open browser
start "" "http://localhost:5000" >nul 2>&1

REM Start the Flask server
python app.py

REM If server stops, show message
echo.
echo ========================================
echo   Server stopped
echo ========================================
echo.
pause

