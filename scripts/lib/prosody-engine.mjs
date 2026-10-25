/**
 * Prosody & Emotional Pacing Engine
 *
 * Injects natural pauses, breath marks, dramatic cadence, and accent-topic synergy
 * so AI voiceovers sound like genuine dramatic storytellers rather than monotone text readers.
 */

// Accent-Topic Synergy Rules
export function matchAccentToTopic(topic = "", language = "en") {
  const t = topic.toLowerCase();

  // 1. Philippine Folklore & Culture -> Authentic Filipino Accent
  if (
    language === "tl" ||
    language === "taglish" ||
    t.includes("philippine") ||
    t.includes("filipino") ||
    t.includes("kapre") ||
    t.includes("aswang") ||
    t.includes("manananggal") ||
    t.includes("mangkukulam") ||
    t.includes("tikbalang") ||
    t.includes("bakunawa") ||
    t.includes("tiyanak") ||
    t.includes("balete") ||
    t.includes("biringan") ||
    t.includes("diwata") ||
    t.includes("engkanto") ||
    t.includes("duwende") ||
    t.includes("albularyo")
  ) {
    return {
      voice: "fil-PH-AngeloNeural",
      accentBadge: "🇵🇭 Filipino Storyteller",
      recommendedStyle: "dark-folklore",
      emotionPreset: "spooky-suspense",
      pacingProfile: { rate: "-4%", pitch: "-3Hz" },
      culturalContext: "Philippine Folklore"
    };
  }

  // 2. British History, Victorian & Museum Documentaries -> British Historian
  if (
    t.includes("london") ||
    t.includes("victorian") ||
    t.includes("british") ||
    t.includes("england") ||
    t.includes("plague doctor") ||
    t.includes("industrial revolution") ||
    t.includes("royal") ||
    t.includes("jack the ripper")
  ) {
    return {
      voice: "en-GB-RyanNeural",
      accentBadge: "🇬🇧 British Historian",
      recommendedStyle: "vintage-woodcut",
      emotionPreset: "documentary-reverent",
      pacingProfile: { rate: "-2%", pitch: "-2Hz" },
      culturalContext: "British & Museum History"
    };
  }

  // 3. Ancient Empires & Classical Battles -> Grand Baritone Narrator
  if (
    t.includes("rome") ||
    t.includes("gladiator") ||
    t.includes("colosseum") ||
    t.includes("greek") ||
    t.includes("sparta") ||
    t.includes("egypt") ||
    t.includes("pharaoh") ||
    t.includes("pompeii") ||
    t.includes("caesar")
  ) {
    return {
      voice: "en-US-ChristopherNeural",
      accentBadge: "🏛️ Ancient Chronicle Baritone",
      recommendedStyle: "classic-cartoon",
      emotionPreset: "intense-survival",
      pacingProfile: { rate: "-3%", pitch: "-4Hz" },
      culturalContext: "Classical Antiquity"
    };
  }

  // 4. Default: Deep Dark Mystery or Curious Host
  return {
    voice: "en-US-ChristopherNeural",
    accentBadge: "🎙️ Deep Mystery Baritone",
    recommendedStyle: "dark-folklore",
    emotionPreset: "spooky-suspense",
    pacingProfile: { rate: "-4%", pitch: "-4Hz" },
    culturalContext: "General Mystery"
  };
}

/**
 * Transforms plain sentence text into emotionally paced speech text.
 * Injects breath marks, dramatic ellipses, em-dashes, and cadence accents.
 */
export function formatEmotionalProsody(text = "", options = {}) {
  let str = String(text || "").trim();
  if (!str) return "";

  const {
    mood = "dark",
    emotionPreset = "spooky-suspense",
    isLastScene = false,
    language = "en"
  } = options;

  // Normalize duplicate spaces
  str = str.replace(/\s+/g, " ");

  // 1. Tagalog / Taglish specific breath pauses
  if (language === "tl" || language === "taglish") {
    str = str
      .replace(/\b(ngunit|subalit|datapwat)\b/gi, "... $1")
      .replace(/\b(kaya|dahil dito)\b/gi, "... $1")
      .replace(/\b(huwag na huwag|huwag kang)\b/gi, "... $1")
      .replace(/\b(pagsapit ng dilim|sa gabi)\b/gi, "$1... ")
      .replace(/\b(tabi-tabi po)\b/gi, "‘Tabi-tabi po’...");
  }

  // 2. English dramatic transition pauses
  str = str
    .replace(/\b(but|however|yet|until)\b/gi, "... $1")
    .replace(/\b(whatever you do|never)\b/gi, "... $1")
    .replace(/\b(you are not alone)\b/gi, "... you are NOT alone.")
    .replace(/\b(do not look up)\b/gi, "... do NOT look up.")
    .replace(/\b(and that is why)\b/gi, "... and that... is why");

  // 3. Convert harsh mechanical commas into natural storytelling pauses where appropriate
  // (e.g. "empty forest at twilight, you are not alone" -> "empty forest at twilight... you are not alone")
  str = str.replace(/,\s*(you are|they were|nothing could|it was|he was|she was)/gi, "... $1");

  // 4. If this is the final scene (the climax / warning), ensure a dramatic trailing cadence
  if (isLastScene) {
    if (!str.includes("...")) {
      const lastComma = str.lastIndexOf(",");
      if (lastComma > str.length * 0.5) {
        str = str.slice(0, lastComma) + "..." + str.slice(lastComma + 1);
      }
    }
  }

  // Clean up any double ellipses or strange punctuation artifacts
  str = str
    .replace(/\.{4,}/g, "...")
    .replace(/\s*\.\.\.\s*/g, "... ")
    .replace(/\s*,\s*\.\.\./g, "...")
    .trim();

  return str;
}

/**
 * Calculate dynamic pitch & rate based on voice persona, scene mood, and emotion preset.
 */
export function getAcousticParameters(voiceId, options = {}) {
  const {
    mood = "dark",
    emotionPreset = "spooky-suspense",
    isLastScene = false
  } = options;

  let baseRate = 0;   // percentage offset
  let basePitch = 0;  // Hz offset

  switch (emotionPreset) {
    case "spooky-suspense":
    case "dread":
      baseRate = -5;
      basePitch = -4;
      break;
    case "intense-survival":
    case "dramatic":
      baseRate = +1;
      basePitch = -2;
      break;
    case "documentary-reverent":
      baseRate = -2;
      basePitch = -2;
      break;
    case "curious-viral":
    case "witty":
      baseRate = +4;
      basePitch = +0;
      break;
    default:
      baseRate = -3;
      basePitch = -3;
  }

  // Modulate per scene mood
  if (mood === "dark" || mood === "night") {
    baseRate -= 1;
    basePitch -= 1;
  } else if (mood === "warm") {
    baseRate += 1;
  }

  // Final scene (the climax/warning) drops pitch and lingers slightly
  if (isLastScene) {
    baseRate -= 2;
    basePitch -= 2;
  }

  const rateSign = baseRate >= 0 ? `+${baseRate}%` : `${baseRate}%`;
  const pitchSign = basePitch >= 0 ? `+${basePitch}Hz` : `${basePitch}Hz`;

  return { rate: rateSign, pitch: pitchSign };
}
