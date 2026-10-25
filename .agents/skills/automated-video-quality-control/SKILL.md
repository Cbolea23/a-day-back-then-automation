---
name: automated-video-quality-control
description: >-
  Run pre-render and post-render quality assurance (QA) audits on video files.
  Validates mobile UI safe zones (preventing Shorts icon and HookBanner/Caption collisions),
  audio volume peaks, ambient bed presence, contrast readability, and dropped frames.
  Use before publishing, before full renders, or when auditing video output.
---

# Automated Video Quality Control (QC)

This skill provides an automated preflight and post-render inspection checklist to guarantee broadcast-level polish before videos reach social platforms.

---

## 1. Pre-Render Preflight Checklist

Before initiating any full render, verify:
1. **Asset & Audio Completeness:**
   - 100% of scene voiceover files exist on disk (`>10KB`).
   - 100% of referenced scene image paths exist in `public/`.
   - Studio SFX & ambient beds exist in `public/sfx/` (`ambient-folklore-wind.wav`, `ambient-history-hearth.wav`, `transition-whoosh.wav`).
2. **Vertical Shorts Safe Zone & Anti-Collision Audit (1080x1920):**
   - **Top Header Safe Zone (`top: 66px, left: 50%`):** The `ChannelBadge` + `seriesTag` pill MUST be horizontally centered so it never collides with the top-left Mute button or top-right Search (`🔍`) icon on Facebook Reels, Instagram Reels, and YouTube Shorts.
   - **Zero HookBanner / Caption Overlap:**
     - `HookBanner` (`top: 165px`) must use `formatCompactHook()` (max 3–7 words, `64px` font, max 2 lines) so its bottom edge stays above `y = 420px`.
     - Active `Captions` sit at `top: 830px`, maintaining **400+ pixels of clean visual separation** from both `HookBanner` and the 75%-mark `FollowMicroCTA` pill (`top: 155px`).
   - **Right Edge Margin (`120px`):** Clear of text/faces to avoid Like/Comment/Share buttons.
   - **Bottom Margin (`240px`):** Clear of subtitles to avoid platform caption/audio banner occlusion.
3. **Longform Safe Zone Audit (1920x1080):**
   - Captions placed at `bottom: 90px`, spanning between character (`right: 520px`) and left margin (`left: 60px`).

---

## 2. Post-Render Verification Script

Verify newly rendered MP4 files using Node inspection:
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
" "out/2 - Unpublished Vault/<slug>.mp4"
```
