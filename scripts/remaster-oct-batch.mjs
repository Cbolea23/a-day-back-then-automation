import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { EXTENSION, PROVIDER, durationSeconds, synth } from "./tts.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAD_SECONDS = 0.35;

// Definitions for the 12 topics with alive human copy & NPC cameo lines
export const TOPICS_DATA = {
  "spartan-training-day": {
    hook: "Spartan kids didn't go to school... they were thrown into survival camp.",
    scenes: [
      {
        text: "Spartan kids never sat at a school desk. The moment you turned seven, you were ripped from your parents and thrown into the agoge.",
        mood: "cool",
      },
      {
        text: "No shoes. No warm cloaks. You slept on sharp river reeds you had to rip out of the ground with your bare hands.",
        mood: "day",
      },
      {
        text: "The state deliberately starved you so you would learn how to sneak around and steal food from farms and pantries.",
        mood: "warm",
      },
      {
        text: "Stealing bread is fine, boy! Getting CAUGHT is treason! Ten laps in the dirt!",
        speaker: "npc",
        speakerName: "DRILLMASTER",
        voice: "Fenrir",
        voiceStyle: "Furious, harsh Spartan military drill instructor barking discipline at a recruit.",
        npc: {
          archetype: "guard",
          position: "left",
          expression: "grumpy",
          speechBubble: "Ten laps in the dirt!",
          talking: true,
        },
        mood: "day",
      },
      {
        text: "If you got caught, you weren't beaten for stealing — you were whipped for being clumsy enough to get spotted.",
        mood: "day",
      },
      {
        text: "Would you have survived Sparta's brutal childhood? Tell us in the comments.",
        mood: "cool",
      },
    ],
  },

  "sparta-myths": {
    hook: "Everything Hollywood told you about Sparta is basically a lie.",
    scenes: [
      {
        text: "Hollywood made you think Sparta was full of muscle-bound gods in leather capes living in giant marble palaces.",
        mood: "cool",
      },
      {
        text: "In reality, Sparta was a collection of humble, muddy villages with no towering walls and zero grand monuments.",
        mood: "cool",
      },
      {
        text: "And that famous story about throwing weak babies off cliffs? Modern digs show that gorge was used for criminals, not infants.",
        mood: "cool",
      },
      {
        text: "Meanwhile, Spartan women actually ran the show — owning over forty percent of the land and driving their own chariots.",
        mood: "cool",
      },
      {
        text: "Too many words, Athenian. When King Philip threatened to destroy us, we sent back one word: 'If.'",
        speaker: "npc",
        speakerName: "SPARTAN VETERAN",
        voice: "Fenrir",
        voiceStyle: "Deadpan, ice-cold, intimidating Spartan warrior speaking with ruthless economy.",
        npc: {
          archetype: "guard",
          position: "left",
          expression: "grumpy",
          speechBubble: "If.",
          talking: true,
        },
        mood: "cool",
      },
      {
        text: "If Sparta was this disciplined, what finally brought them down? Follow for the shocking truth.",
        mood: "cool",
      },
    ],
  },

  "roman-patrician-vs-plebeian": {
    hook: "Waking up in ancient Rome depended entirely on how much gold you had.",
    scenes: [
      {
        text: "Waking up in Rome was heaven or absolute nightmare, depending entirely on your wallet.",
        mood: "day",
      },
      {
        text: "As a wealthy patrician, you woke up in a sprawling marble villa with private fountains and slaves feeding you imported grapes.",
        mood: "warm",
      },
      {
        text: "Fifth floor, zero plumbing, and the landlord just raised the rent!",
        speaker: "npc",
        speakerName: "PLEBEIAN",
        voice: "Puck",
        voiceStyle: "Exasperated Roman commoner complaining loudly about his terrible apartment.",
        npc: {
          archetype: "citizen",
          position: "left",
          expression: "grumpy",
          speechBubble: "Zero plumbing!",
          talking: true,
        },
        mood: "cool",
      },
      {
        text: "Poor plebeians crammed into creaky wooden insulae that collapsed or caught fire on a weekly basis.",
        mood: "day",
      },
      {
        text: "The rich man's workday was done by noon. The poor laborer baked bricks in the scorching heat until sundown.",
        mood: "warm",
      },
      {
        text: "Both used public baths, but rich Romans brought bodyguard entourages while the poor bathed in murky communal water.",
        mood: "cool",
      },
      {
        text: "Would you have survived a single day in a Roman slum? Drop a comment below.",
        mood: "dark",
      },
    ],
  },

  "roman-myths": {
    hook: "4 Roman 'facts' you believed that are completely made up.",
    scenes: [
      {
        text: "You think you know ancient Rome, but most famous 'facts' were totally invented by Hollywood.",
        mood: "warm",
      },
      {
        text: "Myth number one: Romans gorged at feasts and ran to a vomitorium to throw up so they could eat more.",
        mood: "warm",
      },
      {
        text: "From Latin vomere: to spew forth a crowd! It is just an exit hallway, you barbarian!",
        speaker: "npc",
        speakerName: "DR. AURELIUS",
        voice: "Puck",
        voiceStyle: "Haughty, eccentric ancient scholar lecturing with theatrical exasperation.",
        npc: {
          archetype: "doctor",
          position: "left",
          expression: "grumpy",
          speechBubble: "It's just an exit!",
          talking: true,
        },
        mood: "cool",
      },
      {
        text: "Myth number two: thumbs down meant death in the Colosseum. Scholars aren't even sure — it may have meant sheathe your sword.",
        mood: "warm",
      },
      {
        text: "Myth number three: everyone wore togas. Everyday Romans despised togas because they were heavy wool blankets.",
        mood: "cool",
      },
      {
        text: "Instead, citizens wore simple, comfortable tunics and only put on a toga for annoying court appearances.",
        mood: "day",
      },
      {
        text: "And those classic pure white statues? They were originally painted in wild, garish psychedelic colors.",
        mood: "day",
      },
      {
        text: "Which Roman myth surprised you the most? Let us know below.",
        mood: "day",
      },
    ],
  },

  "roman-legionary-march": {
    hook: "Imagine marching twenty miles a day carrying eighty pounds of iron.",
    scenes: [
      {
        text: "Imagine waking up at sunrise and strapping eighty pounds of solid gear to your back for a twenty-mile trek.",
        mood: "cool",
      },
      {
        text: "Roman legionaries weren't called Marius' Mules for nothing — you were literally a walking human supply convoy.",
        mood: "day",
      },
      {
        text: "You carried your shield, pilum spears, a cooking pot, two heavy palisade stakes, and two weeks of hard grain.",
        mood: "day",
      },
      {
        text: "Lunch was hardtack bread and sour vinegar-wine called posca to kill bacteria in muddy stream water.",
        mood: "warm",
      },
      {
        text: "Pick up that shovel, recruit! The barbarians aren't waiting for your blisters to heal!",
        speaker: "npc",
        speakerName: "CENTURION",
        voice: "Fenrir",
        voiceStyle: "Gruff, stern Roman centurion barking orders at tired soldiers.",
        npc: {
          archetype: "guard",
          position: "left",
          expression: "grumpy",
          speechBubble: "Pick up that shovel!",
          talking: true,
        },
        mood: "warm",
      },
      {
        text: "After eight hours of marching, you didn't rest. You dug deep ditches and built a fortified mini-fortress every single night.",
        mood: "dark",
      },
      {
        text: "Could you endure a month in a Roman legion? Tell us in the comments.",
        mood: "night",
      },
    ],
  },

  "greek-symposium": {
    hook: "Ancient Greek drinking parties had one strict rule: NEVER drink wine straight.",
    scenes: [
      {
        text: "You scored an invite to an elite Greek symposium — but forget about doing keg stands.",
        mood: "warm",
      },
      {
        text: "This was a high-society lounge where wealthy men reclined on couches to debate philosophy and gossip.",
        mood: "warm",
      },
      {
        text: "The host appointed a symposium master who strictly controlled how much alcohol flowed into the mixing krater.",
        mood: "warm",
      },
      {
        text: "Three parts water to one part wine! We are discussing philosophy, not starting a brawl!",
        speaker: "npc",
        speakerName: "WINE MASTER",
        voice: "Puck",
        voiceStyle: "Snooty, dramatic Greek symposium master scolding guests.",
        npc: {
          archetype: "merchant",
          position: "left",
          expression: "grumpy",
          speechBubble: "Three parts water!",
          talking: true,
        },
        mood: "warm",
      },
      {
        text: "Drinking undiluted wine was considered barbaric and trashy. Only barbarians drank straight from the flask.",
        mood: "warm",
      },
      {
        text: "Between deep debates, guests played kottabos — flicking wine dregs from their cups at bronze targets to predict their love lives.",
        mood: "dark",
      },
    ],
  },

  "egypt-pyramid-workers": {
    hook: "Slaves didn't build the pyramids. Well-fed craft guilds did.",
    scenes: [
      {
        text: "Hollywood convinced the world that whipped slaves built the Great Pyramids under the scorching Egyptian sun.",
        mood: "cool",
      },
      {
        text: "Archaeologists have completely shattered that myth. The pyramid builders were respected, paid Egyptian laborers.",
        mood: "warm",
      },
      {
        text: "Crews organized into competitive work guilds with proud gang names painted in red ochre, like the 'Friends of Khufu.'",
        mood: "warm",
      },
      {
        text: "Four jugs of thick beer and prime beef rations! Now heave that stone before noon!",
        speaker: "npc",
        speakerName: "BUILDER HORUS",
        voice: "Puck",
        voiceStyle: "Enthusiastic, burly ancient Egyptian stone mason shouting encouragement.",
        npc: {
          archetype: "worker",
          position: "left",
          expression: "grumpy",
          speechBubble: "Heave that stone!",
          talking: true,
        },
        mood: "day",
      },
      {
        text: "Excavations revealed worker villages where builders ate prime cattle, crusty garlic bread, and high-protein beer.",
        mood: "day",
      },
      {
        text: "When grain shipments were late, Egyptian workers did something incredible: they staged history's first recorded labor strikes.",
        mood: "dark",
      },
      {
        text: "Would you have worked on the Great Pyramid for beer and glory? Tell us below.",
        mood: "warm",
      },
    ],
  },

  "egypt-pharaoh-day": {
    hook: "Being an Egyptian Pharaoh sounded awesome... until you saw the daily schedule.",
    scenes: [
      {
        text: "Being Pharaoh sounds like the ultimate dream — you were literally worshipped as a living god on Earth.",
        mood: "warm",
      },
      {
        text: "Before the sun even rose, priests scrubbed you down, anointed you in sacred oils, and strapped on your royal regalia.",
        mood: "day",
      },
      {
        text: "Then came hours of ritual chants to Ma'at to literally prevent the cosmos from descending into eternal darkness.",
        mood: "warm",
      },
      {
        text: "Sire, the grain taxes are down three percent, and the Nile flood won't rise itself!",
        speaker: "npc",
        speakerName: "VIZIER IMHOTEP",
        voice: "Puck",
        voiceStyle: "Stressed, fussy ancient royal advisor holding stacks of scrolls.",
        npc: {
          archetype: "doctor",
          position: "left",
          expression: "grumpy",
          speechBubble: "Taxes are down!",
          talking: true,
        },
        mood: "day",
      },
      {
        text: "Your afternoon was buried under endless land disputes, temple construction budgets, and provincial border petitions.",
        mood: "warm",
      },
      {
        text: "And if a single harvest failed, your subjects blamed your divine failure and whispered treason.",
        mood: "cool",
      },
      {
        text: "Would you take the crown knowing the entire universe was blamed on you? Comment below.",
        mood: "dark",
      },
    ],
  },

  "egypt-myths": {
    hook: "Think Indiana Jones was accurate? Egypt's biggest myths debunked.",
    scenes: [
      {
        text: "Movies made us believe Egyptian tombs are full of rolling boulder traps, poisonous darts, and cursed mummies.",
        mood: "warm",
      },
      {
        text: "First: zero rolling boulders existed. Ancient architects relied on simple massive stone portcullis slabs and false dead-ends.",
        mood: "day",
      },
      {
        text: "No poison darts? Just a giant two-ton granite block in my way!",
        speaker: "npc",
        speakerName: "GRAVEROBBER",
        voice: "Puck",
        voiceStyle: "Disappointed, sneaky ancient thief whining about tomb construction.",
        npc: {
          archetype: "citizen",
          position: "left",
          expression: "grumpy",
          speechBubble: "A giant two-ton rock!",
          talking: true,
        },
        mood: "day",
      },
      {
        text: "Second: King Tut's deadly mummy curse was almost entirely made up by 1920s British tabloids hungry for clicks.",
        mood: "dark",
      },
      {
        text: "Howard Carter, the man who actually cracked open the tomb, lived another seventeen peaceful years in London.",
        mood: "cool",
      },
      {
        text: "And Cleopatra? She wasn't ethnically Egyptian at all — she was pure Greek Macedonian royalty.",
        mood: "dark",
      },
      {
        text: "Did you fall for any of these Egyptian myths? Tell us in the comments.",
        mood: "warm",
      },
      {
        text: "Follow for more real history they never taught you in school.",
        mood: "dark",
      },
    ],
  },

  "roman-money": {
    hook: "What could one silver coin actually buy you in ancient Rome?",
    scenes: [
      {
        text: "You bust your back doing manual labor in downtown Rome and get handed a single silver denarius at sunset.",
        mood: "day",
      },
      {
        text: "For a common laborer or Roman legionary, this single coin represented an entire hard day's wages.",
        mood: "warm",
      },
      {
        text: "A fresh round loaf of bread from the stone bakery cost just a couple of tiny copper asses.",
        mood: "warm",
      },
      {
        text: "One copper coin for street swill, but two denarii if you want real Falernian wine!",
        speaker: "npc",
        speakerName: "TAVERN KEEPER",
        voice: "Puck",
        voiceStyle: "Shrewd, charismatic ancient Roman street tavern merchant haggling.",
        npc: {
          archetype: "merchant",
          position: "left",
          expression: "grumpy",
          speechBubble: "Two denarii for wine!",
          talking: true,
        },
        mood: "day",
      },
      {
        text: "Cheap street wine and barley porridge were affordable, but downtown rent would completely wipe out your savings.",
        mood: "dark",
      },
      {
        text: "Meanwhile, wealthy Roman senators owned multiple country villas making millions of sestertii every harvest.",
        mood: "day",
      },
      {
        text: "The rich paid thousands for rare turbot fish while ordinary citizens counted spare change for chickpeas.",
        mood: "warm",
      },
      {
        text: "Could your budget survive on one Roman coin a day? Drop your thoughts below.",
        mood: "cool",
      },
    ],
  },

  "medieval-blacksmith-job": {
    hook: "In a medieval village, the blacksmith was literally the difference between life and death.",
    scenes: [
      {
        text: "If the medieval blacksmith died, the entire village was basically doomed.",
        mood: "warm",
      },
      {
        text: "At dawn, the forge is already blistering. You swallow soot as the bellows pump air into red-hot charcoal.",
        mood: "warm",
      },
      {
        text: "Farmers line up with broken iron plowshares, and the local lord demands newly tempered spearheads for his men-at-arms.",
        mood: "warm",
      },
      {
        text: "Master! The coals are white-hot, and the anvil's about to crack!",
        speaker: "npc",
        speakerName: "APPRENTICE",
        voice: "Puck",
        voiceStyle: "Exhausted, panting medieval blacksmith apprentice sweating by the fire.",
        npc: {
          archetype: "worker",
          position: "left",
          expression: "grumpy",
          speechBubble: "Anvil's cracking!",
          talking: true,
        },
        mood: "warm",
      },
      {
        text: "Without your forged iron tools, crops rot unharvested in the fields and the town is left completely defenseless.",
        mood: "warm",
      },
      {
        text: "Would you have had the stamina to swing a blacksmith's hammer all day? Tell us below.",
        mood: "cool",
      },
    ],
  },

  "medieval-monk-day": {
    hook: "Living in complete silence: a typical day in a medieval monastery.",
    scenes: [
      {
        text: "Imagine spending your entire life where speaking out loud was strictly forbidden.",
        mood: "dark",
      },
      {
        text: "At two in the morning, the bells ring for Vigils. You step out of your cell onto freezing stone floors in bare feet.",
        mood: "dark",
      },
      {
        text: "Your entire day is sliced into strict prayer bells, hard garden labor, and endless hours in the chilly scriptorium.",
        mood: "day",
      },
      {
        text: "Shhh! Brother Marcus! Three taps means pass the cheese, not the butter!",
        speaker: "npc",
        speakerName: "BROTHER THOMAS",
        voice: "Puck",
        voiceStyle: "Hushed, urgent medieval monk whispering furiously in a silent abbey scriptorium.",
        npc: {
          archetype: "doctor",
          position: "left",
          expression: "grumpy",
          speechBubble: "Pass the cheese!",
          talking: true,
        },
        mood: "day",
      },
      {
        text: "Monks developed elaborate hand sign languages so they could communicate without breaking their sacred vow of silence.",
        mood: "day",
      },
      {
        text: "While wars raged outside, these silent scribes quietly copied and preserved the world's ancient books for centuries.",
        mood: "dark",
      },
    ],
  },
};

export async function remasterTopic(slug) {
  const data = TOPICS_DATA[slug];
  if (!data) {
    throw new Error(`No topic data found for ${slug}`);
  }

  const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
  let originalScript = fs.existsSync(scriptPath) ? JSON.parse(fs.readFileSync(scriptPath, "utf8")) : {};

  // Build new scene list preserving images and updating copy / npc config
  const scenes = data.scenes.map((dScene, i) => {
    const origScene = originalScript.scenes?.[i] || {};
    // Ensure image exists
    let img = origScene.image || `images/${slug}/${i + 1}.png`;
    // If original had jpg or png, preserve
    return {
      text: dScene.text,
      mood: dScene.mood || origScene.mood || "day",
      imagePrompt: origScene.imagePrompt || "",
      image: img,
      audio: `audio/${slug}/${i + 1}.${EXTENSION}`,
      seconds: origScene.seconds || 5.0,
      voicedText: "",
      ...(dScene.speaker ? { speaker: dScene.speaker, speakerName: dScene.speakerName } : {}),
      ...(dScene.voice ? { voice: dScene.voice, voiceStyle: dScene.voiceStyle } : {}),
      ...(dScene.npc ? { npc: dScene.npc } : {}),
    };
  });

  const updatedScript = {
    ...originalScript,
    slug,
    title: originalScript.title || slug.replace(/-/g, " "),
    hook: data.hook,
    channelName: originalScript.channelName || "A Day Back Then",
    scenes,
  };

  fs.writeFileSync(scriptPath, JSON.stringify(updatedScript, null, 2));

  // Synthesize voice clips
  console.log(`\n==================================================`);
  console.log(`🎙️ Synthesizing voices for: ${slug}`);
  console.log(`==================================================`);
  fs.mkdirSync(path.join(root, "public", "audio", slug), { recursive: true });

  for (let i = 0; i < updatedScript.scenes.length; i++) {
    const scene = updatedScript.scenes[i];
    const absAudio = path.join(root, "public", scene.audio);

    const reusable =
      fs.existsSync(absAudio) &&
      scene.voicedText === scene.text &&
      scene.seconds;

    if (reusable) {
      console.log(`  [Scene ${i + 1}/${updatedScript.scenes.length}] Reusing existing audio (${scene.seconds}s)`);
      continue;
    }

    const overrides = scene.speaker === "npc"
      ? {
          voice: scene.voice || "Puck",
          style: scene.voiceStyle || "Exasperated neighbor shouting.",
        }
      : {
          voice: "Charon",
          style: "A warm, curious, fast-paced storyteller speaking directly to the viewer with punchy comedic timing and high energy.",
        };

    console.log(`  [Scene ${i + 1}/${updatedScript.scenes.length}] ${scene.speaker === "npc" ? "NPC (" + scene.speakerName + ")" : "Narrator"}: "${scene.text.slice(0, 50)}..."`);
    await synth(scene.text, absAudio, overrides);
    const secs = durationSeconds(absAudio);
    scene.seconds = Math.round((secs + PAD_SECONDS) * 10) / 10;
    scene.voicedText = scene.text;

    fs.writeFileSync(scriptPath, JSON.stringify(updatedScript, null, 2));

    if (PROVIDER === "gemini") {
      await new Promise((r) => setTimeout(r, 4200));
    }
  }

  const totalSecs = updatedScript.scenes.reduce((acc, s) => acc + s.seconds, 0).toFixed(1);
  console.log(`✅ Voice synthesis finished for ${slug} (Total: ${totalSecs}s)`);

  // Render video
  const outVideo = `out/${slug}.mp4`;
  const relScriptPath = `scripts-out/${slug}.json`;
  console.log(`\n🎬 Rendering Remotion video to: ${outVideo}`);
  execFileSync(
    "npx",
    ["remotion", "render", "src/index.ts", "Short", outVideo, `--props=${relScriptPath}`],
    { stdio: "inherit", shell: true, cwd: root }
  );
  console.log(`🎉 Finished rendering: out/${slug}.mp4\n`);
}

// CLI runner
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  if (target) {
    await remasterTopic(target);
  } else {
    for (const slug of Object.keys(TOPICS_DATA)) {
      await remasterTopic(slug);
    }
  }
}
