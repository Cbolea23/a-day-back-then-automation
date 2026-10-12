#!/usr/bin/env python3
"""Voice every scene of a SHORTS script with the bundled tts CLI (no edge-tts: broken behind proxy).
Usage: python3 scripts/voice-batch.py <slug>
Reads scripts-out/<slug>.json, writes public/audio/<slug>/<n>.mp3,
sets scene.audio / voicedText / seconds (resumable: skips scenes already voiced)."""
import json, subprocess, os, sys

ROOT = os.path.expanduser("~/workspace/a-day-back-then-automation")
slug = sys.argv[1]
VOICE = "avocado_v2:qvd_01376"  # Brooding Boulder: masculine, American, gravelly, dramatic
SPEED = "95"
PAD = 0.35

script_file = os.path.join(ROOT, "scripts-out", f"{slug}.json")
audio_dir = os.path.join(ROOT, "public", "audio", slug)
os.makedirs(audio_dir, exist_ok=True)
script = json.load(open(script_file))
made = kept = 0
for i, scene in enumerate(script["scenes"]):
    rel = f"audio/{slug}/{i+1}.mp3"
    abs_p = os.path.join(ROOT, "public", rel)
    if (scene.get("audio") == rel and scene.get("voicedText") == scene["text"]
            and scene.get("seconds") and os.path.exists(abs_p)
            and os.path.getsize(abs_p) > 1000):
        kept += 1
        continue
    r = subprocess.run(["/opt/hatch/bin/tts", "speak", "--voice", VOICE, "--speed", SPEED,
                        "--output", abs_p, "--text-stdin"],
                       input=scene["text"].encode(), capture_output=True, timeout=300)
    if r.returncode != 0:
        print(f"SCENE {i+1} FAILED: {r.stderr.decode()[-300:]}", flush=True)
        sys.exit(1)
    d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", abs_p], capture_output=True, text=True)
    secs = float(d.stdout.strip())
    scene["audio"] = rel
    scene["voicedText"] = scene["text"]
    scene["seconds"] = round((secs + PAD) * 10) / 10
    made += 1
    json.dump(script, open(script_file, "w"), indent=2)
    print(f"scene {i+1}/{len(script['scenes'])}: {secs:.1f}s", flush=True)
total = sum(s.get("seconds", 0) for s in script["scenes"])
print(f"DONE {slug}: {made} new, {kept} kept, total {total:.1f}s")
