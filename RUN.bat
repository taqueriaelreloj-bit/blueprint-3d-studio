@echo off
title Blueprint 3D Studio - Run
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not available in PATH.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Dependencies are missing. Installing them now...
  call npm install
  if errorlevel 1 (
    echo Installation failed. Review the error above.
    pause
    exit /b 1
  )
)
echo Starting Blueprint 3D Studio...
echo Keep this window open while using the application.
call npm run dev -- --open
pause
