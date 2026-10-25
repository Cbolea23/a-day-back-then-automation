/**
 * FreeLLMAPI & Multi-Provider Smart Router + Zero-Cost Image & Folklore Story Engine
 *
 * Aggregates:
 *   1. Self-hosted FreeLLMAPI Gateway (http://localhost:3001/v1 or custom URL)
 *   2. Direct Free Provider Pool: Groq, Cerebras, Google Gemini, OpenRouter Free, Mistral
 *   3. Zero-Key Pollinations OpenAI Fallback (works with 0 keys out of the box!)
 *
 * Also handles:
 *   - Folklore & History full story generation (e.g. Mangkukulam, Manananggal, Aswang, Roman history)
 *   - 6 Visual Art Styles + Zero-Cost Background Image Generation (Gemini + HuggingFace + Pollinations Flux)
 */

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, "..", "..");

export const ART_STYLES = {
  "classic-cartoon": {
    id: "classic-cartoon",
    name: "Classic 2D Cartoon",
    badge: "Default Channel Style",
    description: "Thick dark outlines, warm muted palette, hand-painted 2D textures.",
    promptSuffix:
      "2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16 portrait, no people in the bottom center foreground, no text, no logos",
  },
  "dark-folklore": {
    id: "dark-folklore",
    name: "Dark Folklore & Gothic Ink",
    badge: "Best for Aswang / Horror",
    description: "Eerie moonlight, deep misty bamboo shadows, dramatic gothic horror comic ink.",
    promptSuffix:
      "dark folklore graphic novel illustration, eerie moonlight, misty shadows, deep crimson and midnight teal palette, dramatic horror ink outlines, atmospheric fog, vertical 9:16 portrait, no text, no logos",
  },
  "anime-cinematic": {
    id: "anime-cinematic",
    name: "Anime Painted Cinematic",
    badge: "Vibrant & Expressive",
    description: "Lush painted skies, atmospheric lighting inspired by anime feature films.",
    promptSuffix:
      "anime background art, Studio Ghibli and Makoto Shinkai inspired painted scenery, rich atmospheric lighting, detailed environment, vertical 9:16 portrait, no text, no logos",
  },
  "vintage-woodcut": {
    id: "vintage-woodcut",
    name: "Vintage Woodcut & Parchment",
    badge: "19th Century Lore",
    description: "Antique engraving lines over aged sepia parchment and classic book plates.",
    promptSuffix:
      "19th century antique woodcut engraving illustration on aged sepia parchment, intricate crosshatching, historical bookplate aesthetic, vertical 9:16 portrait, no text, no logos",
  },
  "comic-pulp": {
    id: "comic-pulp",
    name: "Pulp Comic Book",
    badge: "Bold & Dynamic",
    description: "Heavy ink shadows, halftone textures, punchy vintage comic colors.",
    promptSuffix:
      "vintage pulp horror comic book illustration, heavy black ink shadows, dramatic cel shading, bold retro colors, vertical 9:16 portrait, no text, no logos",
  },
  "cinematic-realism": {
    id: "cinematic-realism",
    name: "Dark Cinematic Realism",
    badge: "Photorealistic",
    description: "Moody film still lighting, volumetric mist, realistic textures.",
    promptSuffix:
      "cinematic dark historical film still, moody volumetric lighting, candlelit shadows, photorealistic environment, 35mm lens depth of field, vertical 9:16 portrait, no text, no logos",
  },
};

/**
 * Load all stored keys from dashboard/data/keys.json + environment variables.
 */
export function loadAllKeys() {
  const keysFile = process.env.DASH_DATA_DIR
    ? path.join(process.env.DASH_DATA_DIR, "keys.json")
    : path.join(ROOT_DIR, "dashboard", "data", "keys.json");

  let stored = {};
  try {
    if (fs.existsSync(keysFile)) {
      stored = JSON.parse(fs.readFileSync(keysFile, "utf8"));
    }
  } catch {}

  return {
    FREELLMAPI_URL: process.env.FREELLMAPI_URL || stored.FREELLMAPI_URL || "",
    FREELLMAPI_KEY: process.env.FREELLMAPI_KEY || stored.FREELLMAPI_KEY || "",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || stored.GEMINI_API_KEY || "",
    GROQ_API_KEY: process.env.GROQ_API_KEY || stored.GROQ_API_KEY || "",
    CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY || stored.CEREBRAS_API_KEY || "",
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || stored.OPENROUTER_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || stored.MISTRAL_API_KEY || "",
    HF_API_KEY: process.env.HF_API_KEY || stored.HF_API_KEY || "",
    IMAGE_PROVIDER: process.env.IMAGE_PROVIDER || stored.IMAGE_PROVIDER || "auto",
    VOICE_PROVIDER: process.env.VOICE_PROVIDER || stored.VOICE_PROVIDER || "edge",
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || stored.GITHUB_TOKEN || "",
    GITHUB_REPO: process.env.GITHUB_REPO || stored.GITHUB_REPO || "",
    RENDER_WORKER_URL: process.env.RENDER_WORKER_URL || stored.RENDER_WORKER_URL || "",
  };
}

/**
 * Build ordered list of LLM endpoints to try with automatic 429 failover.
 */
export function getActiveProviders(customKeys = {}) {
  const k = {...loadAllKeys(), ...customKeys};
  const providers = [];

  // 1. FreeLLMAPI Unified Gateway (if URL or Key is configured)
  if (k.FREELLMAPI_URL || k.FREELLMAPI_KEY) {
    const base = (k.FREELLMAPI_URL || "http://localhost:3001/v1").replace(/\/+$/, "");
    providers.push({
      name: "FreeLLMAPI Gateway",
      type: "openai",
      url: base.endsWith("/v1") ? `${base}/chat/completions` : `${base}/v1/chat/completions`,
      apiKey: k.FREELLMAPI_KEY || "freellmapi-local",
      models: ["auto", "llama-3.3-70b", "gemini-2.5-flash"],
    });
  }

  // 2. Cerebras (Ultra-fast 1800 tok/s free tier)
  if (k.CEREBRAS_API_KEY) {
    providers.push({
      name: "Cerebras Free Tier",
      type: "openai",
      url: "https://api.cerebras.ai/v1/chat/completions",
      apiKey: k.CEREBRAS_API_KEY,
      models: ["llama-3.3-70b", "llama3.1-8b"],
    });
  }

  // 3. Groq (Fast 800 tok/s free tier)
  if (k.GROQ_API_KEY) {
    providers.push({
      name: "Groq Free Tier",
      type: "openai",
      url: "https://api.groq.com/openai/v1/chat/completions",
      apiKey: k.GROQ_API_KEY,
      models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    });
  }

  // 4. Google Gemini AI Studio
  if (k.GEMINI_API_KEY) {
    providers.push({
      name: "Google Gemini AI Studio",
      type: "gemini",
      apiKey: k.GEMINI_API_KEY,
      models: [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-3.6-flash",
        "gemini-3.1-flash-lite",
      ],
    });
  }

  // 5. Mistral Free Tier
  if (k.MISTRAL_API_KEY) {
    providers.push({
      name: "Mistral AI",
      type: "openai",
      url: "https://api.mistral.ai/v1/chat/completions",
      apiKey: k.MISTRAL_API_KEY,
      models: ["mistral-small-latest", "open-mistral-nemo"],
    });
  }

  // 6. OpenRouter Free Models
  if (k.OPENROUTER_API_KEY) {
    providers.push({
      name: "OpenRouter Free Pool",
      type: "openai",
      url: "https://openrouter.ai/api/v1/chat/completions",
      apiKey: k.OPENROUTER_API_KEY,
      models: [
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemma-3-27b-it:free",
        "mistralai/mistral-small-3.1-24b-instruct:free",
      ],
    });
  }

  // 7. Zero-Key Pollinations OpenAI Fallback (Always available for $0 out-of-the-box!)
  providers.push({
    name: "Pollinations Free AI (Zero-Key)",
    type: "openai",
    url: "https://text.pollinations.ai/openai",
    apiKey: "free",
    models: ["openai-fast", "openai"],
  });

  return providers;
}

function extractJsonFromText(rawText) {
  let cleaned = String(rawText || "")
    // Strip DeepSeek / reasoning model thought tags
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^```json\s*/im, "")
    .replace(/^```\s*/im, "")
    .replace(/\s*```$/im, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try finding first { and last } or first [ and last ]
    const firstObj = cleaned.indexOf("{");
    const lastObj = cleaned.lastIndexOf("}");
    if (firstObj !== -1 && lastObj > firstObj) {
      try {
        return JSON.parse(cleaned.slice(firstObj, lastObj + 1));
      } catch {}
    }
    const firstArr = cleaned.indexOf("[");
    const lastArr = cleaned.lastIndexOf("]");
    if (firstArr !== -1 && lastArr > firstArr) {
      try {
        return JSON.parse(cleaned.slice(firstArr, lastArr + 1));
      } catch {}
    }
    throw new Error("Response was not valid JSON");
  }
}

/**
 * Call the FreeLLMAPI / multi-provider pool with automatic failover on 429 or network errors.
 */
export async function callSmartLLM({
  prompt,
  systemPrompt = "You are an expert folklore and history scriptwriter. Return valid JSON only.",
  json = true,
  temperature = 0.85,
  customKeys = {},
}) {
  const providers = getActiveProviders(customKeys);
  const errors = [];

  for (const provider of providers) {
    for (const model of provider.models) {
      try {
        if (provider.type === "gemini") {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
          const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": provider.apiKey,
            },
            body: JSON.stringify({
              contents: [{role: "user", parts: [{text: fullPrompt}]}],
              generationConfig: {
                ...(json ? {responseMimeType: "application/json"} : {}),
                temperature,
              },
            }),
            signal: AbortSignal.timeout(35000),
          });

          if (!res.ok) {
            errors.push(`${provider.name} (${model}): HTTP ${res.status}`);
            continue;
          }
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
          const parsed = json ? extractJsonFromText(text) : text;
          return {data: parsed, provider: provider.name, model};
        } else {
          // OpenAI-compatible (FreeLLMAPI, Groq, Cerebras, Mistral, OpenRouter, Pollinations)
          const headers = {"Content-Type": "application/json"};
          if (provider.apiKey && provider.apiKey !== "free") {
            headers["Authorization"] = `Bearer ${provider.apiKey}`;
          }
          const body = {
            model,
            messages: [
              ...(systemPrompt ? [{role: "system", content: systemPrompt}] : []),
              {role: "user", content: prompt},
            ],
            temperature,
          };
          if (json && provider.name !== "Pollinations Free AI (Zero-Key)") {
            body.response_format = {type: "json_object"};
          }

          const timeoutMs = provider.name.includes("Pollinations") ? 14000 : 25000;
          const res = await fetch(provider.url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(timeoutMs),
          });

          if (!res.ok) {
            errors.push(`${provider.name} (${model}): HTTP ${res.status}`);
            continue;
          }
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content ?? "";
          const parsed = json ? extractJsonFromText(text) : text;
          return {data: parsed, provider: provider.name, model};
        }
      } catch (err) {
        errors.push(`${provider.name} (${model}): ${err.message}`);
      }
    }
  }

  throw new Error(`All AI providers failed or timed out. Details: ${errors.join(" | ")}`);
}

/**
 * Built-in zero-fail Folklore & History Story Synthesizer.
 * Provides authentic, viral, culturally rich 5-scene scripts for all folklore & historical topics
 * if external AI providers fail, rate-limit (402), or are unreachable.
 */
export function synthesizeFolkloreScript({
  topic = "",
  cleanSlug,
  language = "en",
}) {
  const t = topic.toLowerCase();
  const isTl = language === "tl" || language === "taglish";

  if (t.includes("kapre")) {
    return {
      title: "Kapre: The Giant Tree Dweller of the Balete Tree",
      hook: "DO NOT LOOK UP INTO THE BALETE TREE",
      scenes: [
        {
          text: isTl
            ? "Kung may maamoy kang matamis na usok ng tabako sa madilim na gubat, hindi ka nag-iisa."
            : "If you smell sweet roll-your-own tobacco in an empty forest at twilight, you are not alone.",
          mood: "dark",
          imagePrompt: "Dense tropical Philippine rainforest at twilight with twisted balete tree roots and creeping thick mist",
          direction: {drift: "push-in", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Sa mataas na sanga ng sinaunang Balete nakatira ang Kapre: higanteng mabalahibo na may hawak na walang kupas na tabako."
            : "High in the gnarled branches of an ancient Balete tree sits the Kapre: a ten-foot giant covered in dark fur, blowing endless rings of thick grey smoke.",
          mood: "dark",
          imagePrompt: "Massive dark shadowy silhouette of a giant figure perched high on an ancient mossy tree branch with glowing red embers of a cigar",
          direction: {drift: "pull-back", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Hindi siya kumakain ng tao, pero hilig niyang lituhin ang mga biyahero para paulit-ulit na bumalik sa kanyang puno."
            : "He does not eat humans, but he loves confusing travelers, trapping them in endless loops where every path leads back to his roots.",
          mood: "cool",
          imagePrompt: "Winding jungle dirt path leading in an ominous circle beneath towering hanging vines and ancient banyan branches",
          direction: {drift: "push-in", atmosphere: "dust", warmFlicker: false},
        },
        {
          text: isTl
            ? "Sabi ng mga matatanda, kapag nakuha mo ang kumikinang niyang puting bato o agimat, susundin niya lahat ng utos mo habangbuhay."
            : "Old elders whisper that if you manage to acquire his glowing white agimat stone, the colossal beast becomes your sworn protector for life.",
          mood: "warm",
          imagePrompt: "Mystical glowing white stone pulsing with ethereal light resting among tangled ancient tree roots",
          direction: {drift: "push-in", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Kaya sa susunod na dumaan ka sa lumang Balete bago lumubog ang araw, bumulong ng 'Tabi-tabi po' at bilisan mo ang lakad."
            : "Next time you pass a giant Balete tree at dusk, whisper 'Tabi-tabi po' to show respect, and whatever you do, do not look up.",
          mood: "dark",
          imagePrompt: "Atmospheric Philippine country road passing beside an enormous ominous Balete tree under a dark starry sky",
          direction: {drift: "pull-back", atmosphere: "ember", warmFlicker: true},
        },
      ],
      claimsToVerify: [
        "Kapre folklore origins in pre-colonial and Spanish-era Philippine mythology",
        "Belief in Balete trees (Ficus balete) as sacred dwellings of nature spirits and engkanto",
      ],
    };
  }

  if (t.includes("mangkukulam") || t.includes("kulam") || t.includes("witchcraft")) {
    return {
      title: "Mangkukulam: The Terrifying Truth About Filipino Witchcraft",
      hook: "NEVER ANGER A MANGKUKULAM",
      scenes: [
        {
          text: isTl
            ? "Ang biglaang pananakit ng iyong tiyan na walang makitang lunas ay maaaring hindi karaniwang sakit."
            : "A sharp, unexplainable pain deep in your stomach might not be an ordinary illness.",
          mood: "dark",
          imagePrompt: "Dim candlelit wooden room in a rustic provincial bamboo hut with ancient bottles and dried herbs hanging",
          direction: {drift: "push-in", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Sa paniniwalang Pilipino, ang Mangkukulam ay gumagamit ng manika, hibla ng buhok, at karayom upang maghiganti."
            : "In Philippine folklore, the Mangkukulam uses strands of a victim's hair, a cloth doll, and black needles to inflict agonies from afar.",
          mood: "dark",
          imagePrompt: "Close-up of a rustic stitched rag doll pierced with iron pins resting beside cracked candlelight and crushed glass",
          direction: {drift: "pull-back", atmosphere: "dust", warmFlicker: true},
        },
        {
          text: isTl
            ? "Sa bawat tusok ng karayom o pagbaon sa lupa ng libingan, nararanasan ng biktima ang parehong matinding pasakit."
            : "By piercing the effigy with rusted pins or burying it in consecrated graveyard earth, the target suffers identical agony miles away.",
          mood: "cool",
          imagePrompt: "Overgrown provincial graveyard with weathered stone crosses under heavy dark storm clouds and creeping mist",
          direction: {drift: "push-in", atmosphere: "dust", warmFlicker: false},
        },
        {
          text: isTl
            ? "Tanging isang tunay na Albularyo na may hawak na buntot pagi at benditadong langis ang makakaputol sa sumpa."
            : "Only an authentic Albularyo carrying blessed holy coconut oil and a dried stingray tail whip can break the cursed hex.",
          mood: "warm",
          imagePrompt: "Altar of an Albularyo with small amber glass vials of bubbling herbal oil, candles, and braided palms",
          direction: {drift: "push-in", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Kaya palaging maging magalang sa baryo, dahil hindi mo alam kung sino ang nakatabi mo sa daan."
            : "Remember to always show respect when visiting remote rural villages, because you never truly know who walks beside you.",
          mood: "dark",
          imagePrompt: "Empty provincial dirt road flanked by dense banana leaves and bamboo fences illuminated only by fireflies at night",
          direction: {drift: "pull-back", atmosphere: "ember", warmFlicker: true},
        },
      ],
      claimsToVerify: [
        "Traditional Philippine beliefs regarding Kulam, Barang, and psychic revenge",
        "Role of the Albularyo folk healer as the cultural counter-measure to black magic",
      ],
    };
  }

  if (t.includes("manananggal")) {
    return {
      title: "Manananggal: The Self-Segmenting Winged Terror",
      hook: "HEAR THE TIK-TIK SOUND ABOVE YOUR ROOF?",
      scenes: [
        {
          text: isTl
            ? "Sa araw, siya ay isang tahimik at magandang dalaga sa inyong baryo."
            : "By day, she appears as a quiet, graceful villager living peacefully at the edge of the woods.",
          mood: "day",
          imagePrompt: "Quiet sunny Philippine provincial village with traditional nipa huts, coconut palms, and dirt footpaths",
          direction: {drift: "push-in", atmosphere: "dust", warmFlicker: false},
        },
        {
          text: isTl
            ? "Pagsapit ng hatinggabi, humihiwalay ang kanyang itaas na katawan at nagkakaroon ng malalaking pakpak ng paniki."
            : "At midnight, her torso detaches with a sickening tear, sprouting massive leathery bat wings into the moonlit sky.",
          mood: "dark",
          imagePrompt: "Silhouette of a winged demonic creature flying across a giant pale full moon above the canopy of banana trees",
          direction: {drift: "pull-back", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Nanghuhuli siya gamit ang mahabang hugis-tubong dila na sumusuot sa bubong ng mga bahay."
            : "She perches atop nipa roofs, lowering a needle-thin hollow tongue through the thatch while her Tik-tik bird distracts the household.",
          mood: "dark",
          imagePrompt: "Thatched nipa hut rooftop under a dark starlit sky with ominous shadows casting across the dry woven leaves",
          direction: {drift: "push-in", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Ang tanging paraan para talunin siya ay hanapin ang naiwang ibabang katawan at lagyan ito ng asin at bawang."
            : "The only way to defeat her is locating the standing severed lower torso hidden in the groves and rubbing crushed salt, garlic, and ash onto the open wound.",
          mood: "warm",
          imagePrompt: "A wooden mortar filled with crushed garlic cloves, coarse sea salt, and holy palm ashes beside an open flame",
          direction: {drift: "push-in", atmosphere: "dust", warmFlicker: true},
        },
        {
          text: isTl
            ? "Kapag inabutan siya ng sikat ng araw bago magkadikit, magiging abo ang buong katawan ng nilalang."
            : "If the morning sun breaks over the horizon before she can reunite with her lower half, the creature bursts into ash.",
          mood: "warm",
          imagePrompt: "First golden rays of morning sunrise breaking through mist over tropical palm trees and mountain peaks",
          direction: {drift: "pull-back", atmosphere: "dust", warmFlicker: false},
        },
      ],
      claimsToVerify: [
        "Myth of the Manananggal and its association with the Tik-tik decoy bird",
        "Salt and garlic as universal folkloric apotropaic wards in Visayan culture",
      ],
    };
  }

  if (t.includes("aswang")) {
    return {
      title: "Aswang: The Shape-Shifting Nightmare of Capiz",
      hook: "THE SHADOW OUTSIDE IS NOT A STRAY DOG",
      scenes: [
        {
          text: isTl
            ? "Isang pulang ibon ang dumapo sa bakod habang lumulubog ang araw, nagpapadala ng babala sa buong baryo."
            : "A crimson-feathered bird lands on your fence at twilight, crying out with a rhythmic, chilling shriek.",
          mood: "dark",
          imagePrompt: "A dark wooden fence line bordering wild tropical forest at sunset, with a solitary sinister black bird perched in shadow",
          direction: {drift: "push-in", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Ang Aswang ang pinakatanyag na nilalang: tao sa umaga, ngunit nagiging higanteng itim na aso o baboy-ramo sa gabi."
            : "The Aswang is the ultimate shape-shifter: living as an ordinary recluse by day, transforming into a giant black boar or canine after dark.",
          mood: "dark",
          imagePrompt: "Eerie moonlit forest clearing with deep glowing red predator eyes reflecting from dense tall reeds",
          direction: {drift: "pull-back", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Kapag may pinasok siyang bahay, pinapalitan niya ang biktima ng puno ng saging na mistulang bangkay."
            : "It stalks silent villages, replacing slumbering victims with carved banana tree trunks that mimic dead bodies to delay discovery.",
          mood: "cool",
          imagePrompt: "Interior of an empty rustic wooden cottage with moonlight streaming across woven bamboo floor mats",
          direction: {drift: "push-in", atmosphere: "dust", warmFlicker: false},
        },
        {
          text: isTl
            ? "Upang malaman kung may Aswang sa paligid, ang mga matatanda ay nagpapakulo ng espesyal na langis ng niyog."
            : "To detect an Aswang approaching, elders keep a vial of specially prepared coconut oil that boils violently whenever one draws near.",
          mood: "warm",
          imagePrompt: "Small clay lamp and an earthenware bowl containing bubbling herb-infused oil glowing warm over charcoal",
          direction: {drift: "push-in", atmosphere: "ember", warmFlicker: true},
        },
        {
          text: isTl
            ? "Kaya isara nang mahigpit ang inyong mga bintana bago matulog. May nagmamasid sa dilim."
            : "Fasten your wooden shutters tight tonight and keep sea salt by the doorway. Something is watching from the dark.",
          mood: "dark",
          imagePrompt: "Heavy wooden window shutters latched shut from the inside with warm candlelight flickering against dark timber walls",
          direction: {drift: "pull-back", atmosphere: "ember", warmFlicker: true},
        },
      ],
      claimsToVerify: [
        "Regional Aswang folklore in the Western Visayas and Panay island",
        "Use of boiling coconut oil and stingray tail (buntot pagi) as folk indicators",
      ],
    };
  }

  // Generic dynamic high-retention generator for any other topic
  const cleanTitle = topic
    .split(/[:\-\?]/)[0]
    .trim()
    .replace(/^the\s+/i, "");

  return {
    title: `${topic.slice(0, 60)}: The Hidden Truth`,
    hook: `WHAT THEY NEVER TOLD YOU ABOUT ${cleanTitle.toUpperCase()}`,
    scenes: [
      {
        text: isTl
          ? `Karamihan sa mga tao ay naniniwala sa karaniwang kwento tungkol sa ${cleanTitle}, ngunit may mas malalim na lihim sa likod nito.`
          : `Most people believe the popular stories told about ${cleanTitle}, but the real historical truth is far darker than you were taught.`,
        mood: "dark",
        imagePrompt: `Atmospheric mysterious historical setting related to ${cleanTitle}, dramatic dim lighting, ancient textures, no people in foreground`,
        direction: {drift: "push-in", atmosphere: "ember", warmFlicker: true},
      },
      {
        text: isTl
          ? `Noong unang panahon, ang mga taong nakasaksi rito ay may mahigpit na mga ritwal at paniniwala upang protektahan ang kanilang sarili.`
          : `Centuries ago, ancient records and eyewitnesses described terrifying encounters that terrified entire towns into taking extraordinary precautions.`,
        mood: "dark",
        imagePrompt: `Ancient archives with yellowed weathered parchment scrolls and historical artifacts related to ${cleanTitle}`,
        direction: {drift: "pull-back", atmosphere: "dust", warmFlicker: true},
      },
      {
        text: isTl
          ? `Ang pinakanakakakilabot na bahagi ay hindi ang kwento, kundi ang ebidensyang natagpuan ng mga mananaliksik.`
          : `What shocked modern investigators was not just the folklore, but physical evidence and regional legal records confirming widespread panic.`,
        mood: "cool",
        imagePrompt: `Dimly lit museum display case showing ancient iron tools, talismans, and stone inscriptions connected to ${cleanTitle}`,
        direction: {drift: "push-in", atmosphere: "dust", warmFlicker: false},
      },
      {
        text: isTl
          ? `Ayon sa mga lumang tala, may isang partikular na paraan kung paano nila ito napagtagumpayan sa huli.`
          : `Local survival lore dictated exact steps and rituals that ordinary citizens had to follow before nightfall to stay alive.`,
        mood: "warm",
        imagePrompt: `Historical stone town square or sanctuary surrounded by glowing torches and heavy fortified wooden gates`,
        direction: {drift: "push-in", atmosphere: "ember", warmFlicker: true},
      },
      {
        text: isTl
          ? `Hanggang ngayon, ang mga aral at babala mula sa nakaraan ay patuloy na naririnig sa mga liblib na lugar.`
          : `Even today in remote regions, elders still whisper warnings about this legend whenever the sun sinks below the horizon.`,
        mood: "dark",
        imagePrompt: `A solitary weathered cobblestone path disappearing into mist and ancient shadowed trees under a starry night sky`,
        direction: {drift: "pull-back", atmosphere: "ember", warmFlicker: true},
      },
    ],
    claimsToVerify: [
      `Historical documents and folklore archives regarding ${cleanTitle}`,
      "Cultural traditions and community survival practices documented in local lore",
    ],
  };
}

/**
 * Generates a full 6-8 scene story script from any topic (e.g., "mangkukulam", "manananggal", "aswang", etc.)
 */
export async function generateStoryScript({
  topic,
  slug,
  artStyle = "classic-cartoon",
  narratorTheme = "auto",
  narratorTunic = "",
  narratorAccent = "",
  voice = "en-US-ChristopherNeural",
  language = "en",
  tone = "spooky-curious",
  channelName = "A Day Back Then",
  customKeys = {},
}) {
  const cleanSlug =
    slug ||
    topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) ||
    `story-${Date.now()}`;

  const styleObj = ART_STYLES[artStyle] || ART_STYLES["classic-cartoon"];

  const langInstruction =
    language === "tl"
      ? "Write the spoken scene narration and hook in natural, engaging Filipino (Tagalog). Keep imagePrompt in English."
      : language === "taglish"
      ? "Write the spoken scene narration and hook in natural, conversational Taglish (Filipino + English mix used by great Pinoy storytellers). Keep imagePrompt in English."
      : "Write the spoken scene narration and hook in crisp, vivid English.";

  const systemPrompt = `You are a master folklore, mythology, and history storyteller for vertical 45-60 second Shorts.
Rules:
- ${langInstruction}
- Tone: ${tone}. Engaging, vivid, hook-first storytelling.
- Total length: 110-140 words split across 7 scenes.
- Scene 1 MUST be a powerful pattern-interrupt hook under 16 words. No "Hey guys" or greetings.
- If the topic is Philippine folklore or mythology (e.g., Mangkukulam, Manananggal, Aswang, Tikbalang, Kapre, Bakunawa, Tiyanak, White Lady, Biringan), include authentic regional lore, traditional beliefs, how people protected themselves (buntot pagi, calamansi, salt, garlic, albularyo rituals), and eerie cultural details.
- Include 1 or 2 scenes with a cameo NPC reaction or short comic speechBubble where appropriate.
- "hook" is 3-7 words of punchy on-screen banner text.
- "mood" is one of: "day", "night", "warm", "dark", "cool".
- "imagePrompt" describes ONLY the atmospheric setting/background for the scene in English (no text, no logos).

Return ONLY a valid JSON object matching this exact schema:
{
  "slug": "${cleanSlug}",
  "title": "Catchy Video Title",
  "hook": "3-7 Word On-Screen Hook",
  "scenes": [
    {
      "text": "Spoken narration for this scene...",
      "mood": "dark",
      "imagePrompt": "Detailed visual setting description...",
      "direction": {
        "drift": "push-in",
        "atmosphere": "ember",
        "warmFlicker": true
      }
    }
  ],
  "claimsToVerify": [
    "Folklore or historical origin note 1",
    "Folklore or historical origin note 2"
  ]
}`;

  const userPrompt = `Create a complete 7-scene Short script about: "${topic}".
Visual Art Style to keep in mind for scene prompts: ${styleObj.name} (${styleObj.description}).
Return ONLY valid JSON.`;

  let scriptData = null;
  let generatedBy = "Folklore Engine (Zero-Cost Synthesizer)";

  try {
    const result = await callSmartLLM({
      prompt: userPrompt,
      systemPrompt,
      json: true,
      temperature: 0.85,
      customKeys,
    });
    const parsed = Array.isArray(result.data) ? result.data[0] : result.data;
    if (parsed && Array.isArray(parsed.scenes) && parsed.scenes.length >= 3) {
      scriptData = parsed;
      generatedBy = `${result.provider} (${result.model})`;
    }
  } catch (err) {
    console.warn(`[StoryRouter] Live AI call bypassed (${err.message}). Activating built-in high-retention folklore synthesizer.`);
  }

  // If live AI failed, timed out, or returned invalid scenes, use the built-in high-retention synthesizer
  if (!scriptData || !Array.isArray(scriptData.scenes)) {
    scriptData = synthesizeFolkloreScript({
      topic,
      cleanSlug,
      language,
    });
  }

  const finalScript = {
    slug: cleanSlug,
    title: scriptData.title || topic,
    hook: scriptData.hook || topic,
    channelName,
    artStyle: styleObj.id,
    narratorTheme: narratorTheme === "auto" ? undefined : narratorTheme,
    narratorTunic: narratorTunic || undefined,
    narratorAccent: narratorAccent || undefined,
    voice,
    language,
    scenes: scriptData.scenes.map((s, idx) => {
      const basePrompt = s.imagePrompt || `${topic}, scene ${idx + 1} historical atmospheric setting`;
      const fullPrompt = basePrompt.toLowerCase().includes("9:16")
        ? basePrompt
        : `${basePrompt}, ${styleObj.promptSuffix}`;
      return {
        text: String(s.text || "").trim(),
        mood: ["day", "night", "warm", "dark", "cool"].includes(s.mood) ? s.mood : "dark",
        imagePrompt: fullPrompt,
        direction: s.direction || {
          drift: idx % 2 === 0 ? "push-in" : "pull-back",
          atmosphere: s.mood === "dark" || s.mood === "night" ? "ember" : "dust",
          warmFlicker: s.mood === "dark" || s.mood === "warm",
        },
        ...(s.npc ? {npc: s.npc} : {}),
      };
    }),
    claimsToVerify: Array.isArray(scriptData.claimsToVerify) ? scriptData.claimsToVerify : [],
    generatedBy,
  };

  // Save script to scripts-out/<slug>.json and prompts to scripts-out/<slug>.prompts.txt
  const outDir = path.join(ROOT_DIR, "scripts-out");
  fs.mkdirSync(outDir, {recursive: true});
  fs.writeFileSync(path.join(outDir, `${cleanSlug}.json`), JSON.stringify(finalScript, null, 2) + "\n");

  const promptsText = finalScript.scenes.map((s, i) => `${i + 1}. ${s.imagePrompt}`).join("\n\n");
  fs.writeFileSync(path.join(outDir, `${cleanSlug}.prompts.txt`), promptsText + "\n");

  return finalScript;
}

/**
 * Generates a single scene background image at $0.00 cost.
 * Multi-Tier Zero-Cost Image Pipeline:
 *   1. Google Gemini Image API (if GEMINI_API_KEY is configured in Settings)
 *   2. HuggingFace Free FLUX.1 (if HF_API_KEY is configured)
 *   3. Pollinations Sana/Flux 1080x1920 (100% Free, Zero Key Required)
 *   4. AI Horde Distributed GPU Cluster (100% Free, Zero Key Required, No Rate Limits)
 *   5. Curated Thematic Atmospheric Plate (Offline Emergency Fallback)
 */
export async function generateSceneImage({
  prompt,
  artStyle = "classic-cartoon",
  aspectRatio = "9:16",
  seed = Math.floor(Math.random() * 1000000),
  allowWait = false,
  customKeys = {},
}) {
  const k = {...loadAllKeys(), ...customKeys};
  const styleObj = ART_STYLES[artStyle] || ART_STYLES["classic-cartoon"];
  const fullPrompt = prompt.includes(styleObj.promptSuffix.slice(0, 25))
    ? prompt
    : `${prompt}, ${styleObj.promptSuffix}`;

  const width = aspectRatio === "16:9" ? 1920 : 1080;
  const height = aspectRatio === "16:9" ? 1080 : 1920;
  // Always constrain seed to safe 32-bit integer for Pollinations and APIs
  const safeSeed = Math.floor(Math.abs(Number(seed) || Math.random() * 1000000) % 2147483647);

  // 1. Try Gemini Image if explicitly selected or available
  if ((k.IMAGE_PROVIDER === "gemini" || k.IMAGE_PROVIDER === "auto") && k.GEMINI_API_KEY) {
    try {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": k.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          model: process.env.IMAGE_MODEL || "gemini-3.1-flash-lite-image",
          input: [{type: "text", text: fullPrompt}],
          response_format: {
            type: "image",
            mime_type: "image/jpeg",
            aspect_ratio: aspectRatio,
            image_size: "1K",
          },
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (res.ok) {
        const json = await res.json();
        const images = (json.steps || [])
          .filter((s) => s.type === "model_output")
          .flatMap((s) => s.content || [])
          .filter((c) => c.type === "image" && c.data);
        const last = images[images.length - 1];
        if (last?.data) {
          return {
            buffer: Buffer.from(last.data, "base64"),
            provider: "Google Gemini Image",
            ext: "jpg",
          };
        }
      }
    } catch {}
  }

  // 2. Try HuggingFace Flux.1-Schnell Free Inference API if key is present
  if (k.HF_API_KEY) {
    try {
      const res = await fetch(
        "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${k.HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({inputs: fullPrompt}),
          signal: AbortSignal.timeout(30000),
        },
      );
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        if (buf.length > 5000) {
          return {buffer: buf, provider: "HuggingFace FLUX.1", ext: "jpg"};
        }
      }
    } catch {}
  }

  // 3. Pollinations.ai (Free, Zero Key Required)
  const encoded = encodeURIComponent(fullPrompt);
  const pollUrl = `https://image.pollinations.ai/prompt/${encoded}?model=sana&width=${width}&height=${height}&seed=${safeSeed}&nologo=true`;
  try {
    const res = await fetch(pollUrl, {
      headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
      signal: AbortSignal.timeout(20000),
    });
    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      if (arrayBuf.byteLength > 5000) {
        return {
          buffer: Buffer.from(arrayBuf),
          provider: "Pollinations Sana (Free)",
          ext: "jpg",
        };
      }
    } else if (res.status === 402 && allowWait) {
      const errBody = await res.text().catch(() => "");
      const match = errBody.match(/Retry after (\d+)s/i);
      const waitSec = match ? Math.min(45, parseInt(match[1], 10) + 1) : 25;
      console.log(`[ImageRouter] Pollinations rate limit reached. Waiting ${waitSec}s for clean reset...`);
      await new Promise((r) => setTimeout(r, waitSec * 1000));
      const retryRes = await fetch(pollUrl, {
        headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
        signal: AbortSignal.timeout(25000),
      });
      if (retryRes.ok) {
        const ab = await retryRes.arrayBuffer();
        if (ab.byteLength > 5000) {
          return {
            buffer: Buffer.from(ab),
            provider: "Pollinations Sana (Free)",
            ext: "jpg",
          };
        }
      }
    }
  } catch (err) {
    console.warn(`[ImageRouter] Pollinations error: ${err.message}`);
  }

  // 4. AI Horde Distributed GPU Cluster (100% Free, Zero Key, No IP rate lock)
  try {
    const hordeRes = await fetch("https://aihorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        apikey: "0000000000",
        "Client-Agent": "ADayBackThenAutomation:1.0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${fullPrompt}, vertical 9:16 portrait, cinematic lighting, masterpiece`,
        params: {
          width: aspectRatio === "16:9" ? 768 : 512,
          height: aspectRatio === "16:9" ? 512 : 896,
          steps: 20,
          seed: safeSeed,
        },
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (hordeRes.ok) {
      const {id} = await hordeRes.json();
      if (id) {
        for (let poll = 0; poll < 8; poll++) {
          await new Promise((r) => setTimeout(r, 3000));
          const checkRes = await fetch(`https://aihorde.net/api/v2/generate/status/${id}`, {
            signal: AbortSignal.timeout(6000),
          });
          if (!checkRes.ok) continue;
          const status = await checkRes.json();
          if (status.done && status.generations && status.generations[0]?.img) {
            const imgRes = await fetch(status.generations[0].img, {signal: AbortSignal.timeout(12000)});
            if (imgRes.ok) {
              const buf = Buffer.from(await imgRes.arrayBuffer());
              if (buf.length > 5000) {
                return {
                  buffer: buf,
                  provider: "AI Horde GPU Cluster (Free)",
                  ext: "webp",
                };
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[ImageRouter] AI Horde error: ${err.message}`);
  }

  // 5. Zero-fail fallback: High-resolution curated art style atmospheric plate
  const styleFilePng = path.join(ROOT_DIR, "dashboard", "public", "styles", `${styleObj.id}.png`);
  const styleFileJpg = path.join(ROOT_DIR, "dashboard", "public", "styles", `${styleObj.id}.jpg`);
  const plateFile = fs.existsSync(styleFilePng)
    ? styleFilePng
    : fs.existsSync(styleFileJpg)
    ? styleFileJpg
    : null;

  if (plateFile) {
    return {
      buffer: fs.readFileSync(plateFile),
      provider: `Studio ${styleObj.name} Atmospheric Plate`,
      ext: path.extname(plateFile).replace(".", "") || "jpg",
    };
  }

  throw new Error("Unable to generate scene background image.");
}
