@echo off
title Blueprint 3D Studio v0.23.0 - Verify
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not available in PATH.
  pause
  exit /b 1
)

echo Restoring canonical source and applying upgrades...
node scripts\restore-source.cjs
if errorlevel 1 (
  echo RESTORE FAILED.
  pause
  exit /b 1
)

echo.
echo Validating recovered and upgraded source...
node scripts\validate-source.cjs
if errorlevel 1 (
  echo VALIDATION FAILED.
  pause
  exit /b 1
)

echo.
echo =====================================================
echo Blueprint 3D Studio v0.23.0 verification PASSED.
echo =====================================================
pause
