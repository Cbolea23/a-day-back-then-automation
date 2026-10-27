export const runtime = 'edge';
import {NextResponse} from "next/server";
import fs from "node:fs";
import path from "node:path";
import {spawn} from "node:child_process";
import {pipelineRoot} from "@/lib/pipeline";
import {isWebMode} from "@/lib/mode";
import {queueIntent} from "@/lib/intents";

export async function GET() {
  if (isWebMode()) {
    return queueIntent("npc.info", {});
  }
  const root = pipelineRoot();
  const sampleVideo = path.join(root, "sample-dialogue-npc.mp4");
  const sampleGladiator = path.join(root, "sample-gladiator-npc.mp4");
  const ambientAudio = path.join(root, "public", "audio", "ambient", "gladiator-barracks.wav");
  const dialogueDir = path.join(root, "public", "audio", "dialogue-test");

  const audioFiles: string[] = [];
  if (fs.existsSync(dialogueDir)) {
    try {
      audioFiles.push(...fs.readdirSync(dialogueDir).filter((f) => f.endsWith(".mp3") || f.endsWith(".wav")));
    } catch {}
  }

  return NextResponse.json({
    hasSampleVideo: fs.existsSync(sampleVideo),
    sampleVideoSlug: "sample-dialogue-npc",
    hasGladiatorVideo: fs.existsSync(sampleGladiator),
    gladiatorVideoSlug: "sample-gladiator-npc",
    hasAmbientAudio: fs.existsSync(ambientAudio),
    dialogueAudioFiles: audioFiles,
    features: [
      {name: "Secondary NPC Component", status: "Active (src/NPC.tsx)"},
      {name: "Mouth-Movement Lock", status: "Active (mouthOpen 0 when not speaking)"},
      {name: "Seamless Grounding", status: "Active (No spawn/pop glitch on cuts)"},
      {name: "Sound Design & Ambience", status: "Active (Gladiator Barracks Soundscape)"},
      {name: "Speaker Badges & Dynamic Colors", status: "Active (Gold Narrator, Cyan NPC)"},
    ],
  });
}

/** Re-render dialogue sample scene */
export async function POST(): Promise<Response> {
  if (isWebMode()) {
    return queueIntent("npc.render", {});
  }
  const root = pipelineRoot();
  return new Promise<Response>((resolve) => {
    const child = spawn(
      "npx",
      [
        "remotion",
        "render",
        "src/index.ts",
        "DialogueScene",
        "sample-dialogue-npc.mp4",
        "--gl=angle",
      ],
      {
        cwd: root,
        shell: true,
      },
    );

    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => (stdout += d.toString()));
    child.stderr?.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      resolve(
        NextResponse.json({
          ok: code === 0,
          code,
          stdout: stdout.slice(-1000),
          stderr: stderr.slice(-1000),
        }),
      );
    });
  });
}
