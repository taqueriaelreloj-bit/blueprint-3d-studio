@echo off
title Blueprint 3D Studio - Install
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not available in PATH.
  echo Install Node.js, then run this file again.
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
echo Installation complete. You can now double-click RUN.bat.
pause
