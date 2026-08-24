@echo off
title Blueprint 3D Studio v0.15.0 - Run
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not available in PATH.
  pause
  exit /b 1
)

if not exist package.json (
  echo ERROR: package.json was not found.
  pause
  exit /b 1
)

echo Restoring latest Blueprint 3D Studio source files...
node scripts\restore-source.cjs
if errorlevel 1 (
  echo Source restoration failed. Review the error above.
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

echo Starting Blueprint 3D Studio v0.15.0...
echo Keep this window open while using the application.
call npm run dev -- --open
pause
