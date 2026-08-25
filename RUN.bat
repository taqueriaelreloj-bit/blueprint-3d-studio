@echo off
title Blueprint 3D Studio v0.22.0 - Run
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

echo Validating Blueprint 3D Studio source...
node scripts\validate-source.cjs
if errorlevel 1 (
  echo Source validation failed. Review the error above.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Dependencies are missing. Installing them now...
  call npm ci
  if errorlevel 1 (
    echo Installation failed. Review the error above.
    pause
    exit /b 1
  )
)

echo.
echo Building Blueprint 3D Studio production bundle...
call npm run build
if errorlevel 1 (
  echo.
  echo ============================================================
  echo BUILD FAILED - DO NOT CLOSE THIS WINDOW
  echo Take a screenshot of the FIRST red/error lines above and send it.
  echo ============================================================
  pause
  exit /b 1
)

echo.
echo Build passed. Starting Blueprint 3D Studio v0.22.0 stable preview...
echo Keep this window open while using the application.
call npm run preview -- --host 127.0.0.1 --port 5173 --strictPort --open
pause
