@echo off
title A Day Back Then - Content Hub & Mobile Remote
cd /d "%~dp0"
cls
echo =====================================================================
echo    A DAY BACK THEN - LOCAL & MOBILE REMOTE DASHBOARD
echo =====================================================================
echo.
echo Starting Next.js Production Server on port 3100...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-hub.ps1"
pause
