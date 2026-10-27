export const runtime = 'edge';
import {NextResponse} from "next/server";
import fs from "node:fs";
import path from "node:path";
import {getStoredKeys, pipelineRoot, runScript, startRenderJob} from "@/lib/pipeline";
import {isWebMode} from "@/lib/mode";
import {queueIntent} from "@/lib/intents";

async function loadRouterModule() {
  const root = pipelineRoot();
  const routerPath = path.join(root, "scripts", "lib", "free-llm-router.mjs");
  const mtime = fs.existsSync(routerPath) ? fs.statSync(routerPath).mtimeMs : Date.now();
  const routerUrl = new URL(`file:///${routerPath.replace(/\\/g, "/")}?v=${mtime}`).href;
  return import(/* webpackIgnore: true */ routerUrl);
}

async function loadTtsModule() {
  const root = pipelineRoot();
  const ttsPath = path.join(root, "scripts", "tts.mjs");
  const mtime = fs.existsSync(ttsPath) ? fs.statSync(ttsPath).mtimeMs : Date.now();
  const ttsUrl = new URL(`file:///${ttsPath.replace(/\\/g, "/")}?v=${mtime}`).href;
  return import(/* webpackIgnore: true */ ttsUrl);
}

const NARRATOR_COSTUMES = [
  // Philippine Folklore & Cultural
  {id: "albularyo", name: "Albularyo (Folk Mystic)", group: "Philippine Folklore", defaultTunic: "#5c3d28", defaultAccent: "#9e2424"},
  {id: "barong", name: "Barong Tagalog", group: "Philippine Folklore", defaultTunic: "#f7f1e1", defaultAccent: "#ebe0c5"},
  {id: "katipunero", name: "Katipunero (1896)", group: "Philippine Folklore", defaultTunic: "#ece5d5", defaultAccent: "#b81d1d"},
  {id: "modern", name: "Modern Storyteller", group: "Modern & Urban", defaultTunic: "#1e293b", defaultAccent: "#38bdf8"},
  // Dark & Spooky
  {id: "witch", name: "Witch", group: "Dark & Spooky", defaultTunic: "#1b141f", defaultAccent: "#5b2d86"},
  {id: "vampire", name: "Vampire Lord", group: "Dark & Spooky", defaultTunic: "#181419", defaultAccent: "#7a1010"},
  {id: "werewolf", name: "Werewolf", group: "Dark & Spooky", defaultTunic: "#4d4438", defaultAccent: "#5a3d22"},
  {id: "ghost", name: "Spectral Ghost", group: "Dark & Spooky", defaultTunic: "#f2f4fa", defaultAccent: "#c9d2e4"},
  {id: "plague-doctor", name: "Plague Doctor", group: "Dark & Spooky", defaultTunic: "#1e1e24", defaultAccent: "#2d7f8d"},
  {id: "demon", name: "Shadow Demon", group: "Dark & Spooky", defaultTunic: "#3d0f0f", defaultAccent: "#e8641f"},
  {id: "gravedigger", name: "Gravedigger", group: "Dark & Spooky", defaultTunic: "#191619", defaultAccent: "#8a8f96"},
  {id: "druid", name: "Forest Druid", group: "Dark & Spooky", defaultTunic: "#4a5a3a", defaultAccent: "#a6813b"},
  {id: "executioner", name: "Executioner", group: "Dark & Spooky", defaultTunic: "#1e1b20", defaultAccent: "#5c3a1e"},
  {id: "nun", name: "Gothic Abbey Nun", group: "Dark & Spooky", defaultTunic: "#1c1a1e", defaultAccent: "#ece7db"},
  {id: "mummy", name: "Ancient Mummy", group: "Dark & Spooky", defaultTunic: "#d9cfbe", defaultAccent: "#b8ab93"},
  {id: "krampus", name: "Krampus", group: "Dark & Spooky", defaultTunic: "#2b1c12", defaultAccent: "#c9a227"},
  // World History
  {id: "roman", name: "Roman Citizen", group: "Ancient & Classical", defaultTunic: "#e8cf9a", defaultAccent: "#942626"},
  {id: "gladiator", name: "Roman Gladiator", group: "Ancient & Classical", defaultTunic: "#b87843", defaultAccent: "#8e2222"},
  {id: "egypt", name: "Ancient Egyptian", group: "Ancient & Classical", defaultTunic: "#f7f3e8", defaultAccent: "#187a82"},
  {id: "greek", name: "Ancient Greek", group: "Ancient & Classical", defaultTunic: "#fcfaf4", defaultAccent: "#234b7a"},
  {id: "mesoamerica", name: "Aztec / Maya Noble", group: "Ancient & Classical", defaultTunic: "#f2ebdc", defaultAccent: "#b83323"},
  {id: "viking", name: "Norse Viking", group: "Medieval & Warriors", defaultTunic: "#3d5639", defaultAccent: "#7d5d3b"},
  {id: "knight", name: "Crusader Knight", group: "Medieval & Warriors", defaultTunic: "#b82d23", defaultAccent: "#dfac26"},
  {id: "medieval", name: "Medieval Villager", group: "Medieval & Warriors", defaultTunic: "#8a532d", defaultAccent: "#5c381e"},
  {id: "ninja", name: "Shinobi Ninja", group: "Medieval & Warriors", defaultTunic: "#1b1b22", defaultAccent: "#8a1818"},
  {id: "asian", name: "East Asian Scholar", group: "Medieval & Warriors", defaultTunic: "#2d4f6c", defaultAccent: "#d4af37"},
  {id: "pirate", name: "Golden Age Pirate", group: "Early Modern", defaultTunic: "#1b263b", defaultAccent: "#8f1d1d"},
  {id: "ottoman", name: "Ottoman Chronicler", group: "Early Modern", defaultTunic: "#184363", defaultAccent: "#9e1e1e"},
  {id: "victorian", name: "Victorian Londoner", group: "Early Modern", defaultTunic: "#36312a", defaultAccent: "#962424"},
  {id: "wwii", name: "WWII Correspondent", group: "Early Modern", defaultTunic: "#4a473e", defaultAccent: "#782424"},
];

const TOPIC_PRESETS = [
  // 🇵🇭 Filipino / Tagalog Lore
  {label: "🌳 Kapre", category: "filipino", topic: "Kapre: The Giant Cigar-Smoking Tree Dweller Watching From the Balete Tree", theme: "albularyo", style: "dark-folklore"},
  {label: "🧙‍♀️ Mangkukulam", category: "filipino", topic: "Mangkukulam: The Terrifying Truth About Filipino Witchcraft and Barang", theme: "albularyo", style: "dark-folklore"},
  {label: "🦇 Manananggal", category: "filipino", topic: "Manananggal: The Self-Segmenting Winged Creature of Philippine Nightmares", theme: "albularyo", style: "dark-folklore"},
  {label: "👁️ Aswang", category: "filipino", topic: "Aswang: How Filipino Villages Survived the Shape-Shifting Monster of Capiz", theme: "albularyo", style: "dark-folklore"},
  {label: "🐴 Tikbalang", category: "filipino", topic: "Tikbalang: Why You Must Wear Your Shirt Inside Out When Lost in a Philippine Forest", theme: "albularyo", style: "dark-folklore"},
  {label: "🐉 Bakunawa", category: "filipino", topic: "Bakunawa: The Giant Moon-Eating Sea Serpent of Ancient Visayan Mythology", theme: "albularyo", style: "anime-cinematic"},
  {label: "👻 White Lady", category: "filipino", topic: "The White Lady of Balete Drive: Manila's Most Infamous Haunted Road", theme: "modern", style: "dark-folklore"},
  {label: "🏙️ Biringan City", category: "filipino", topic: "Biringan City: The Invisible Phantom Metropolis Hidden in Samar", theme: "modern", style: "anime-cinematic"},

  // 🕯️ Dark Folklore & Horror
  {label: "🐦‍⬛ Plague Doctor", category: "folklore", topic: "What Was Actually Inside a 17th-Century Plague Doctor's Beak Mask?", theme: "plague-doctor", style: "vintage-woodcut"},
  {label: "👹 Krampus", category: "folklore", topic: "Krampus: The Terrifying Alpine Demon That Punished Naughty Children", theme: "krampus", style: "dark-folklore"},
  {label: "🐺 Werewolf of Bedburg", category: "folklore", topic: "The Werewolf of Bedburg: 1589 Serial Terror in Medieval Germany", theme: "werewolf", style: "dark-folklore"},
  {label: "⚰️ Gravedigger Lore", category: "folklore", topic: "Why Victorian Gravediggers Put Bells on Coffins in London Cemeteries", theme: "gravedigger", style: "vintage-woodcut"},

  // 🏛️ Ancient Civilizations
  {label: "⚔️ Roman Gladiator", category: "ancient", topic: "A Day in the Life of a Roman Gladiator Before Entering the Colosseum", theme: "gladiator", style: "classic-cartoon"},
  {label: "🌋 Pompeii Eruption", category: "ancient", topic: "The Last 24 Hours in Pompeii Before Mount Vesuvius Unleashed Fire", theme: "roman", style: "dark-folklore"},
  {label: "⚱️ Pharaoh's Tomb", category: "ancient", topic: "The Deadly Curse Placed on Anyone Who Opened King Tut's Tomb", theme: "egypt", style: "cinematic-realism"},
  {label: "☀️ Aztec Sacrifice", category: "ancient", topic: "Why the Aztecs Believed the Sun Would Not Rise Without Human Blood", theme: "mesoamerica", style: "vintage-woodcut"},

  // ⚔️ Medieval & Warriors
  {label: "🪓 Viking Berserkers", category: "medieval", topic: "Viking Berserkers: The Drug-Fueled Bear Warriors of Norse Legend", theme: "viking", style: "comic-pulp"},
  {label: "🥷 Shinobi Night Raid", category: "medieval", topic: "How Sengoku-Era Ninja Slipped Past 500 Samurai Castle Guards", theme: "ninja", style: "anime-cinematic"},
  {label: "🛡️ Crusader Knights", category: "medieval", topic: "What Knights Templar Carried Into Battle in the Holy Land", theme: "knight", style: "classic-cartoon"},

  // 🎩 Early Modern & Curiosities
  {label: "🏴‍☠️ Pirate Code", category: "modern", topic: "The Brutal Pirate Code: How Captain Blackbeard Kept Mutineers in Line", theme: "pirate", style: "comic-pulp"},
  {label: "🌫️ Victorian London Smog", category: "modern", topic: "The Great Pea Souper Smog That Blinded 1880 London for Three Days", theme: "victorian", style: "vintage-woodcut"},
  {label: "🚢 WWII Ghost Blimp", category: "modern", topic: "The Ghost Blimp of 1942: The US Navy Airship That Landed Without Its Crew", theme: "wwii", style: "dark-folklore"},
];

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const slug = searchParams.get("slug");
  if (isWebMode()) {
    return queueIntent("studio.list", {slug});
  }
  const root = pipelineRoot();
  const scriptsDir = path.join(root, "scripts-out");
  const outDir = path.join(root, "out");

  const routerMod = await loadRouterModule();
  const ttsMod = await loadTtsModule();

  if (slug) {
    const file = path.join(scriptsDir, `${slug}.json`);
    if (!fs.existsSync(file)) {
      return NextResponse.json({error: `Story '${slug}' not found`}, {status: 404});
    }
    const script = JSON.parse(fs.readFileSync(file, "utf8"));
    const videoExists = fs.existsSync(path.join(outDir, `${slug}.mp4`));
    return NextResponse.json({
      script,
      videoExists,
      videoUrl: videoExists ? `/api/video/${slug}` : null,
    });
  }

  // List recent stories from scripts-out
  const stories: any[] = [];
  if (fs.existsSync(scriptsDir)) {
    const files = fs
      .readdirSync(scriptsDir)
      .filter((f) => f.endsWith(".json") && f !== "all-expansion-prompts.json");

    const withStats = files.map((f) => {
      const full = path.join(scriptsDir, f);
      const stat = fs.statSync(full);
      return {f, full, mtime: stat.mtimeMs};
    });
    withStats.sort((a, b) => b.mtime - a.mtime);

    for (const item of withStats.slice(0, 40)) {
      try {
        const data = JSON.parse(fs.readFileSync(item.full, "utf8"));
        const sSlug = data.slug || item.f.replace(/\.json$/, "");
        const scenes = Array.isArray(data.scenes) ? data.scenes : [];
        const imagesReady = scenes.filter(
          (s: any, idx: number) =>
            (s.image && fs.existsSync(path.join(root, "public", s.image))) ||
            fs.existsSync(path.join(root, "public", "images", sSlug, `${idx + 1}.jpg`)) ||
            fs.existsSync(path.join(root, "public", "images", sSlug, `${idx + 1}.png`)),
        ).length;
        const audioReady = scenes.filter(
          (s: any) => s.audio && fs.existsSync(path.join(root, "public", s.audio)),
        ).length;
        const videoReady = fs.existsSync(path.join(outDir, `${sSlug}.mp4`));

        stories.push({
          slug: sSlug,
          title: data.title || sSlug,
          hook: data.hook || "",
          scenesCount: scenes.length,
          imagesReady,
          audioReady,
          videoReady,
          artStyle: data.artStyle || "classic-cartoon",
          narratorTheme: data.narratorTheme || null,
          narratorTunic: data.narratorTunic || null,
          narratorAccent: data.narratorAccent || null,
          voice: data.voice || "en-US-ChristopherNeural",
          language: data.language || "en",
          updatedAt: item.mtime,
        });
      } catch {}
    }
  }

  return NextResponse.json({
    stories,
    artStyles: Object.values(routerMod.ART_STYLES),
    voices: ttsMod.VOICE_CATALOG,
    costumes: NARRATOR_COSTUMES,
    topicPresets: TOPIC_PRESETS,
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  const action = body.action || "generate-story";
  if (isWebMode()) {
    return queueIntent(`studio.${action}`, body);
  }
  const root = pipelineRoot();
  const scriptsDir = path.join(root, "scripts-out");
  fs.mkdirSync(scriptsDir, {recursive: true});

  const routerMod = await loadRouterModule();

  // 1. Generate a complete story from a topic (e.g. "mangkukulam", "manananggal", "aswang")
  if (action === "generate-story") {
    const topic = String(body.topic || "").trim();
    if (!topic) {
      return NextResponse.json({error: "Please enter a topic or story idea."}, {status: 400});
    }
    try {
      const script = await routerMod.generateStoryScript({
        topic,
        slug: body.slug || "",
        artStyle: body.artStyle || "classic-cartoon",
        narratorTheme: body.narratorTheme || "auto",
        narratorTunic: body.narratorTunic || "",
        narratorAccent: body.narratorAccent || "",
        voice: body.voice || "en-US-ChristopherNeural",
        language: body.language || "en",
        tone: body.tone || "spooky-curious",
        customKeys: getStoredKeys(),
      });
      return NextResponse.json({ok: true, script});
    } catch (err: any) {
      return NextResponse.json(
        {error: err?.message || "Failed to generate story"},
        {status: 500},
      );
    }
  }

  // 2. Save edits to an existing story (scenes, narrator dress, artStyle, voice, hook)
  if (action === "save-story") {
    const script = body.script;
    if (!script || !script.slug) {
      return NextResponse.json({error: "Invalid script payload"}, {status: 400});
    }
    const file = path.join(scriptsDir, `${script.slug}.json`);
    fs.writeFileSync(file, JSON.stringify(script, null, 2) + "\n");
    return NextResponse.json({ok: true, script});
  }

  // 3. Generate scene background image(s)
  if (action === "generate-image") {
    const {slug, sceneIndex, artStyle} = body as {
      slug?: string;
      sceneIndex?: number;
      artStyle?: string;
    };
    if (!slug) return NextResponse.json({error: "slug is required"}, {status: 400});
    const file = path.join(scriptsDir, `${slug}.json`);
    if (!fs.existsSync(file)) {
      return NextResponse.json({error: `Script ${slug} not found`}, {status: 404});
    }

    const script = JSON.parse(fs.readFileSync(file, "utf8"));
    if (artStyle) script.artStyle = artStyle;
    const activeStyle = script.artStyle || "classic-cartoon";
    const imgDir = path.join(root, "public", "images", slug);
    fs.mkdirSync(imgDir, {recursive: true});

    const indices =
      typeof sceneIndex === "number"
        ? [sceneIndex]
        : script.scenes.map((_: any, idx: number) => idx);

    const results: {sceneIndex: number; image: string; provider: string}[] = [];
    for (const idx of indices) {
      const scene = script.scenes[idx];
      if (!scene) continue;
      const prompt = scene.imagePrompt || `${script.title}, scene ${idx + 1}`;
      const {buffer, provider} = await routerMod.generateSceneImage({
        prompt,
        artStyle: activeStyle,
        aspectRatio: "9:16",
        seed: Math.floor(Math.random() * 1000000) + idx * 101,
        allowWait: true,
        customKeys: getStoredKeys(),
      });
      const rel = `images/${slug}/${idx + 1}.jpg`;
      fs.writeFileSync(path.join(root, "public", rel), buffer);
      scene.image = rel;
      results.push({sceneIndex: idx, image: rel, provider});
    }

    fs.writeFileSync(file, JSON.stringify(script, null, 2) + "\n");
    return NextResponse.json({ok: true, script, generated: results});
  }

  // 4. Generate voiceover for all scenes of a story
  if (action === "generate-voice") {
    const {slug, voice} = body as {slug?: string; voice?: string};
    if (!slug) return NextResponse.json({error: "slug is required"}, {status: 400});
    const args = [slug, "--force"];
    if (voice) args.push("--voice", voice);

    const stored = getStoredKeys();
    const {code, stdout, stderr} = await runScript("make-voice.mjs", args, {
      env: {
        ...(stored.GEMINI_API_KEY ? {GEMINI_API_KEY: stored.GEMINI_API_KEY} : {}),
        VOICE_PROVIDER: stored.VOICE_PROVIDER || "edge",
      },
    });
    if (code !== 0) {
      return NextResponse.json(
        {error: "Voiceover generation failed", details: stderr || stdout},
        {status: 500},
      );
    }
    const file = path.join(scriptsDir, `${slug}.json`);
    const script = JSON.parse(fs.readFileSync(file, "utf8"));
    return NextResponse.json({ok: true, script, log: stdout});
  }

  // 5. Render video (Local Remotion OR Laptop-Off GitHub Actions Cloud Worker)
  if (action === "render-video") {
    const {slug, mode} = body as {slug?: string; mode?: "local" | "cloud"};
    if (!slug) return NextResponse.json({error: "slug is required"}, {status: 400});

    const stored = getStoredKeys();
    const ghToken = process.env.GITHUB_TOKEN || stored.GITHUB_TOKEN;
    const ghRepo = process.env.GITHUB_REPO || stored.GITHUB_REPO;

    if (mode === "cloud" && ghToken && ghRepo) {
      // Trigger GitHub Actions Cloud Render Worker!
      const file = path.join(scriptsDir, `${slug}.json`);
      const scriptPayload = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "{}";
      const res = await fetch(
        `https://api.github.com/repos/${ghRepo}/actions/workflows/cloud-render.yml/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ref: "main",
            inputs: {
              slug,
              script_json: scriptPayload,
            },
          }),
        },
      );
      if (!res.ok) {
        const errTxt = await res.text();
        return NextResponse.json(
          {error: `GitHub Cloud Render dispatch failed (${res.status}): ${errTxt}`},
          {status: 500},
        );
      }
      return NextResponse.json({
        ok: true,
        cloudDispatched: true,
        message: `Dispatched to GitHub Actions Cloud Worker (${ghRepo}). Your video is rendering in the cloud!`,
      });
    }

    // Default: start local Remotion render job
    const job = startRenderJob(slug);
    return NextResponse.json({ok: true, job});
  }

  return NextResponse.json({error: `Unknown action: ${action}`}, {status: 400});
}
