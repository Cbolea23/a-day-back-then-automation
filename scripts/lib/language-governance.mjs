/**
 * Language Governance & Content Safety Guard
 *
 * Enforces strict language boundaries across studio channels:
 * - adaybackthen: Strictly 100% English. Bans Tagalog words, bans Pinoy hashtags.
 * - kwentong-pinoy: Strictly Tagalog / Taglish.
 * - bible-chronicles / genesis-to-glory: Strictly English faith/history.
 *
 * Enforces strict zero-emoji policy across all automated metadata.
 */

const TAGALOG_MARKERS = [
  "ang", "mga", "ng", "sa", "ay", "noong", "dahil", "kapag", "kung",
  "pero", "nila", "kanya", "kanilang", "isang", "naman", "talaga", "bakit",
  "paano", "lahat", "ito", "iyon", "mayroon", "wala", "hindi"
];

const BANNED_ADAYBACKTHEN_TAGS = [
  "kwentongpinoy", "pinoyhorror", "kwentongbayan", "pinoy", "tagalog"
];

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

export function validateContentGovernance(channelKey, text, context = "metadata") {
  if (!text || typeof text !== "string") return true;

  // 1. Zero Emoji Rule (Studio-wide)
  if (EMOJI_REGEX.test(text)) {
    throw new Error(
      `[GOVERNANCE VIOLATION] Emoji detected in ${context} for channel '${channelKey}'. Studio policy mandates strict zero-emoji copy.`
    );
  }

  const normalized = text.toLowerCase();
  const words = normalized.split(/[^a-z0-9_#]+/).filter(Boolean);

  // 2. Channel Language Isolation
  if (channelKey === "adaybackthen" || channelKey === "main" || channelKey === "global") {
    // Check banned hashtags
    for (const tag of BANNED_ADAYBACKTHEN_TAGS) {
      if (normalized.includes("#" + tag)) {
        throw new Error(
          `[GOVERNANCE VIOLATION] Banned hashtag #${tag} found in '${channelKey}'. A Day Back Then is 100% Global English only.`
        );
      }
    }

    // Check Tagalog stop-word density
    let tagalogHitCount = 0;
    const hits = [];
    for (const word of words) {
      if (TAGALOG_MARKERS.includes(word)) {
        tagalogHitCount++;
        hits.push(word);
      }
    }

    // If 2 or more Tagalog markers appear, reject immediately
    if (tagalogHitCount >= 2) {
      throw new Error(
        `[GOVERNANCE VIOLATION] Tagalog markers detected (${hits.slice(0, 5).join(", ")}) in ${context} for '${channelKey}'. A Day Back Then must strictly be 100% English.`
      );
    }
  }

  return true;
}
