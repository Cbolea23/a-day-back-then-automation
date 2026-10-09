@echo off
REM ========================================================
REM   A Day Back Then - TikTok Daily Automation Runner
REM ========================================================

cd /d "d:\DESKTOP\automation antigravity youtube"
echo [%date% %time%] Running TikTok 2-per-day safe automation... >> "out\tiktok-task.log"

node scripts\upload-tiktok-queue.mjs >> "out\tiktok-task.log" 2>&1

echo [%date% %time%] Run finished. >> "out\tiktok-task.log"
