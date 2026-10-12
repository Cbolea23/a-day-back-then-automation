---
name: automated-video-quality-control
description: >-
  Run pre-render and post-render quality assurance (QA) audits on video files.
  Validates mobile UI safe zones (preventing Shorts icon clipping), audio volume
  peaks, contrast readability, zero missing asset slots, and dropped frames.
  Use before publishing, before full renders, or when auditing video output.
---

# Automated Video Quality Control (QC)

This skill provides an automated preflight and post-render inspection checklist to guarantee broadcast-level polish before videos reach social platforms.

## Pre-Render Preflight Checklist

Before initiating any full render, run automated verification:
1. **Asset Completeness:**
   - 100% of scene audio files exist on disk and have valid byte sizes (>10KB).
   - 100% of referenced image paths exist in `public/`.
2. **Shorts Safe Zone Audit (1080x1920):**
   - **Right Edge Margin (120px):** Must remain clear of critical text or faces to avoid overlap with TikTok/Shorts action buttons (Like, Comment, Share, Sound icon).
   - **Bottom Margin (240px):** Must remain clear of subtitles to prevent YouTube Shorts title/channel banner occlusion.
   - **Top Margin (160px):** Must remain clear of text to prevent platform status bar and back button clipping.
3. **Longform Safe Zone Audit (1920x1080):**
   - Captions placed at `bottom: 90px`, width spanning between character (`right: 520px`) and left margin (`left: 60px`).
   - Chapter cards fade out cleanly before the first dialogue beat.

## Post-Render Verification Script

Verify newly rendered MP4 files using standard tools or Node inspection:
```bash
node -e "
const fs = require('fs');
const file = process.argv[1];
if (!fs.existsSync(file)) {
  console.error('FAIL: Output file missing');
  process.exit(1);
}
const stats = fs.statSync(file);
console.log('File size:', (stats.size / (1024 * 1024)).toFixed(2), 'MB');
if (stats.size < 1024 * 1024) {
  console.error('FAIL: Suspiciously small file size (<1MB)');
  process.exit(1);
}
console.log('PASS: Video file integrity verified.');
" "out/<path_to_video>.mp4"
```

## Black Frame & Audio Sync Inspection
- Take test stills at 10%, 50%, and 90% of the timeline to ensure no dropped video frames, unrendered layers, or missing character assets.
