@echo off
cd /d "%~dp0"
title TikTok Login Helper
echo ========================================================
echo   Opening TikTok Login Window...
echo ========================================================
node scripts\auth-tiktok.mjs
pause
