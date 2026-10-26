/**
 * Prosody & Emotional Pacing Engine
 *
 * Injects natural pauses, breath marks, dramatic cadence, and accent-topic synergy
 * so AI voiceovers sound like genuine dramatic storytellers rather than monotone text readers.
 */

export const PHILIPPINE_PHONETICS_MAP = [
  // Philippine regions & folklore terms: maps written text to phonetically accurate pronunciation for TTS
  { pattern: /\bbalete\b/gi, replacement: "ba-LEH-te" },
  { pattern: /\bbiringan\b/gi, replacement: "Bee-ring-gahn" },
  { pattern: /\bsamar\b/gi, replacement: "Sah-mar" },
  { pattern: /\baswang\b/gi, replacement: "ahs-wahng" },
  { pattern: /\bkapre\b/gi, replacement: "kahp-reh" },
  { pattern: /\btikbalang\b/gi, replacement: "tik-bah-lahng" },
  { pattern: /\btiyanak\b/gi, replacement: "ti-yah-nahk" },
  { pattern: /\bmanananggal\b/gi, replacement: "mah-nah-nahng-gahl" },
  { pattern: /\bmangkukulam\b/gi, replacement: "mahng-koo-koo-lahm" },
  { pattern: /\bengkanto\b/gi, replacement: "eng-kahn-toh" },
  { pattern: /\bdiwata\b/gi, replacement: "dee-wah-tah" },
  { pattern: /\balbularyo\b/gi, replacement: "ahl-boo-lar-yoh" },
  { pattern: /\bbarangay\b/gi, replacement: "bah-rahng-gahy" },
  { pattern: /\bbakunawa\b/gi, replacement: "bah-koo-nah-wah" },
  { pattern: /\bsigbin\b/gi, replacement: "sig-been" },
  { pattern: /\btiktik\b/gi, replacement: "tik-tik" },
  { pattern: /\bbatibat\b/gi, replacement: "bah-tee-baht" },
  { pattern: /\bnuno\b/gi, replacement: "noo-noh" },
  { pattern: /\bduwende\b/gi, replacement: "doo-wen-deh" },
  { pattern: /\bsantelmo\b/gi, replacement: "sahn-tel-moh" },
  { pattern: /\bpoblacion\b/gi, replacement: "pohb-lahs-yon" },
  { pattern: /\bvisayas\b/gi, replacement: "vee-sah-yahs" },
  { pattern: /\bluzon\b/gi, replacement: "loo-zohn" },
  { pattern: /\bmindanao\b/gi, replacement: "min-dah-now" },
  { pattern: /\btagalog\b/gi, replacement: "tah-gah-log" },
  { pattern: /\bintramuros\b/gi, replacement: "een-trah-moo-rohs" },
  { pattern: /\bcorregidor\b/gi, replacement: "koh-reh-hee-dor" },
];

/**
 * Replaces Philippine cultural and folklore terms with phonetic equivalents
 * so neural voices pronounce them with authentic native Filipino vowels and cadence
 * instead of butchered English phonetics (e.g. "ba-LEH-te" instead of "buh-leet").
 */
export function applyCulturalPhonetics(text = "", voiceId = "", language = "en") {
  let str = String(text || "");
  for (const { pattern, replacement } of PHILIPPINE_PHONETICS_MAP) {
    str = str.replace(pattern, replacement);
  }
  return str;
}

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

  // Preserve natural formant fidelity (0Hz offset prevents robotic DSP artifacts)
  let baseRate = 0;   // percentage offset
  let basePitch = 0;  // Hz offset (keep 0Hz for crystal clear studio timbre)

  switch (emotionPreset) {
    case "spooky-suspense":
    case "dread":
      baseRate = 0;
      basePitch = 0;
      break;
    case "intense-survival":
    case "dramatic":
      baseRate = +3;
      basePitch = 0;
      break;
    case "documentary-reverent":
      baseRate = +1;
      basePitch = 0;
      break;
    case "curious-viral":
    case "witty":
      baseRate = +5;
      basePitch = 0;
      break;
    default:
      baseRate = +2;
      basePitch = 0;
  }

  const rateSign = baseRate >= 0 ? `+${baseRate}%` : `${baseRate}%`;
  const pitchSign = basePitch >= 0 ? `+${basePitch}Hz` : `${basePitch}Hz`;

  return { rate: rateSign, pitch: pitchSign };
}
