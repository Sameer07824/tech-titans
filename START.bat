@echo off
echo ========================================
echo   TrustBound - Integrated Setup
echo ========================================
echo.
echo This script will help you start the application.
echo.
echo PREREQUISITES:
echo   1. Node.js installed (https://nodejs.org)
echo   2. MongoDB running locally or MongoDB Atlas URI
echo.
echo ========================================
echo.
echo Choose an option:
echo   1 - Start Backend Only (localhost:5000)
echo   2 - Start Backend + Show Frontend Instructions
echo   3 - Show Setup Instructions
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto start_backend
if "%choice%"=="2" goto start_backend_with_info
if "%choice%"=="3" goto show_setup
goto invalid

:start_backend
echo.
echo Starting Backend Server...
cd trustbound\backend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
call npm run dev
goto end

:start_backend_with_info
echo.
echo Starting Backend Server...
cd trustbound\backend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo.
echo ========================================
echo Backend: http://localhost:5000
echo API: http://localhost:5000/api
echo Health Check: http://localhost:5000/api/health
echo ========================================
echo.
echo After backend starts, open in another terminal:
echo   Frontend: Open frontend/index.html in your browser
echo ========================================
echo.
call npm run dev
goto end

:show_setup
echo.
echo ========================================
echo TRUSTBOUND SETUP INSTRUCTIONS
echo ========================================
echo.
echo 1. INSTALL DEPENDENCIES
echo    cd trustbound\backend
echo    npm install
echo.
echo 2. START MONGODB
echo    mongod
echo    (or use MongoDB Atlas: update MONGO_URI in .env)
echo.
echo 3. START BACKEND
echo    cd trustbound\backend
echo    npm run dev
echo    (Server runs on http://localhost:5000)
echo.
echo 4. OPEN FRONTEND
echo    Open frontend/index.html in your browser
echo    or use: python -m http.server 3000
echo.
echo 5. TEST LOGIN
echo    Email: arjun@example.com
echo    Password: password
echo.
echo 6. CREATE PROJECT
echo    - Go to Dashboard
echo    - Click "+ New Project"
echo    - Fill in title and budget
echo    - Watch AI generate milestones!
echo.
echo ========================================
echo.
pause
goto end

:invalid
echo Invalid choice. Please run again.
goto end

:end
pause
