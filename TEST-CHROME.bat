@echo off
title Blueprint 3D Studio - Chrome Test
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not available in PATH.
  pause
  exit /b 1
)

echo Installing/updating test dependencies...
call npm install
if errorlevel 1 goto :fail

echo Restoring application source...
call npm run restore
if errorlevel 1 goto :fail

echo Validating source...
call npm run validate
if errorlevel 1 goto :fail

echo Building application...
call npm run build
if errorlevel 1 goto :fail

echo Installing Playwright Chromium if needed...
call npx playwright install chromium
if errorlevel 1 goto :fail

echo Running automated Chrome checks...
call npm run test:e2e
if errorlevel 1 goto :fail

echo.
echo ===============================================
echo CHROME TEST PASSED
 echo Blueprint 3D Studio opened and controls checked.
echo ===============================================
pause
exit /b 0

:fail
echo.
echo ===============================================
echo CHROME TEST FAILED
 echo Review the error above or send a screenshot.
echo ===============================================
pause
exit /b 1
