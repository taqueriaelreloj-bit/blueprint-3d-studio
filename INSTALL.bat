@echo off
title Blueprint 3D Studio v0.18.0 - Install
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not available in PATH.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist package.json (
  echo ERROR: package.json was not found.
  pause
  exit /b 1
)

echo Restoring Blueprint 3D Studio source files...
node scripts\restore-source.cjs
if errorlevel 1 (
  echo Source restoration failed. Review the error above.
  pause
  exit /b 1
)

echo Validating Blueprint 3D Studio source...
node scripts\validate-source.cjs
if errorlevel 1 (
  echo Source validation failed. Review the error above.
  pause
  exit /b 1
)

echo Installing Blueprint 3D Studio dependencies...
call npm install
if errorlevel 1 (
  echo Installation failed. Review the error above.
  pause
  exit /b 1
)

echo.
echo Installation complete. Blueprint 3D Studio v0.18.0 is ready.
echo Double-click RUN.bat to start the program.
pause
