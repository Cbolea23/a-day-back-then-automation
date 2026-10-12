#!/usr/bin/env python3
"""Voice all scenes of halloween-real-history with the bundled tts CLI (Brooding Boulder)."""
import json, subprocess, sys, os

ROOT = os.path.expanduser("~/workspace/a-day-back-then-automation")
slug = "halloween-real-history"
script_file = os.path.join(ROOT, "long-out", f"{slug}.json")
audio_dir = os.path.join(ROOT, "public", "audio", "long", slug)
os.makedirs(audio_dir, exist_ok=True)

VOICE = "avocado_v2:qvd_01376"  # Brooding Boulder: masculine, American, gravelly, dramatic
PAD = 0.35

script = json.load(open(script_file))
made = kept = 0
for i, scene in enumerate(script["scenes"]):
    rel = f"audio/long/{slug}/{i+1}.mp3"
    abs_path = os.path.join(ROOT, "public", rel)
    if (not False and scene.get("audio") == rel and scene.get("voicedText") == scene["text"]
            and scene.get("seconds") and os.path.exists(abs_path)):
        kept += 1
        continue
    r = subprocess.run(
        ["/opt/hatch/bin/tts", "speak", "--voice", VOICE, "--speed", "95",
         "--output", abs_path, "--text-stdin"],
        input=scene["text"].encode(), capture_output=True, timeout=300)
    if r.returncode != 0:
        print(f"SCENE {i+1} FAILED: {r.stderr.decode()[-300:]}", flush=True)
        sys.exit(1)
    d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", abs_path], capture_output=True, text=True)
    seconds = float(d.stdout.strip())
    scene["audio"] = rel
    scene["voicedText"] = scene["text"]
    scene["seconds"] = round((seconds + PAD) * 10) / 10
    made += 1
    json.dump(script, open(script_file, "w"), indent=2)
    print(f"scene {i+1}/{len(script['scenes'])}: {seconds:.1f}s", flush=True)

total = sum(s.get("seconds", 0) for s in script["scenes"])
print(f"DONE: {made} new, {kept} kept, total {total:.1f}s = {total/60:.1f} min")
