import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { uploadReel } from "./upload-facebook.mjs";

const week1Plan = [
  {
    date: "2026-11-01",
    timeStr: "12:00",
    isoUtc: "2026-11-01T04:00:00.000Z",
    slug: "victorian-arsenic-green-wallpaper",
    driveFileId: "1lp6st-E81ttfLuyRh4NyhXLGT65f4UJe",
    title: "THE DEADLIEST WALLPAPER IN VICTORIAN HOMES",
    caption: `THE DEADLIEST WALLPAPER IN VICTORIAN HOMES\n\nIn the 1850s, a vibrant emerald hue called Scheele Green became the ultimate fashion trend in London homes, coloring everything from patterned wallpaper to children toys and luxury gowns. What homeowners did not realize was that the pigment secret ingredient was copper arsenite. In damp Victorian rooms, microscopic fungus reacted with the dyed walls, releasing toxic arsenic gas into nurseries and bedrooms as families slept.\n\nFollow A Day Back Then for daily historical stories.\n\n#VictorianEra #ScheelesGreen #DarkHistory #HistoryFacts #LondonHistory #ADayBackThen`,
    pinned: "If vivid green wallpaper was the peak aesthetic trend in the 1850s, would you have decorated your bedroom with it?"
  },
  {
    date: "2026-11-01",
    timeStr: "18:30",
    isoUtc: "2026-11-01T10:30:00.000Z",
    slug: "victorian-body-snatchers",
    driveFileId: "1B6EZWlDsqElt-CbhXhqpWAnKvjaZ0QwH",
    title: "DIGGING UP FRESH GRAVES IN NIGHTTIME LONDON",
    caption: `DIGGING UP FRESH GRAVES IN NIGHTTIME LONDON\n\nBecause British law previously allowed only executed murderers to be dissected, medical academies faced an acute shortage of human cadavers for anatomy lectures. Enter the resurrection men: underground gangs paid substantial bounties to exhume freshly buried bodies within hours of interment. To prevent loved ones from being stolen, grieving families installed heavy iron mortsafes directly over cemetery plots.\n\nFollow A Day Back Then for daily historical stories.\n\n#BodySnatchers #ResurrectionMen #VictorianHistory #DarkHistory #LondonHistory #ADayBackThen`,
    pinned: "Have you ever seen an iron mortsafe in an old cemetery? Tell us your thoughts below."
  },
  {
    date: "2026-11-01",
    timeStr: "21:00",
    isoUtc: "2026-11-01T13:00:00.000Z",
    slug: "victorian-corset-fainting",
    driveFileId: "1ued4MNnnNkZv38A2Nz7xWi7kPpmPHEfK",
    title: "EIGHTEEN-INCH WAISTS AT THE EXPENSE OF BREATHING",
    caption: `EIGHTEEN-INCH WAISTS AT THE EXPENSE OF BREATHING\n\nDuring the 1870s, high society demanded the dramatic wasp-waist silhouette, enforced by heavily boned corsets crafted from tempered steel and whalebone. Tight-lacing reduced natural breathing capacity by nearly a third and compressed vital organs. As a result, Victorian parlors featured specialized fainting couches, and ladies carried pocket vials of smelling salts everywhere they went.\n\nFollow A Day Back Then for daily historical stories.\n\n#VictorianFashion #CorsetHistory #SocialHistory #HistoryFacts #London #ADayBackThen`,
    pinned: "Could you endure a full day wearing a steel-boned corset tightened to an eighteen-inch waist?"
  },
  {
    date: "2026-11-02",
    timeStr: "12:00",
    isoUtc: "2026-11-02T04:00:00.000Z",
    slug: "victorian-mudlark-job",
    driveFileId: "1MJEp00OeE6q91UFTFjEgL1IZJwHnamLv",
    title: "THE CHILDREN SCAVENGING COINS FROM RIVER SEWAGE",
    caption: `THE CHILDREN SCAVENGING COINS FROM RIVER SEWAGE\n\nMudlarks were impoverished Victorian children who scavenged barefoot along the icy shores of the River Thames during low tide. They sifted through thick river silt contaminated with raw city sewage, searching for dropped coins, scraps of coal, copper nails, and discarded iron to sell. On a lucky day, a young mudlark might earn three pence, just enough to buy bread for their family.\n\nFollow A Day Back Then for daily historical stories.\n\n#Mudlarks #RiverThames #VictorianHistory #ChildLabor #HistoryFacts #ADayBackThen`,
    pinned: "Under ten years old and barefoot in the freezing mud of the Thames: what would life have been like for a young mudlark?"
  },
  {
    date: "2026-11-02",
    timeStr: "18:30",
    isoUtc: "2026-11-02T10:30:00.000Z",
    slug: "victorian-pea-souper-smog",
    driveFileId: "1GHTZXEnWI1-yRUg_Jf54NOXIYDs2vwtX",
    title: "THE YELLOW SMOG THAT TURNED LONDON PITCH BLACK",
    caption: `THE YELLOW SMOG THAT TURNED LONDON PITCH BLACK\n\nFed by the smoke of millions of coal fireplaces and industrial chimneys, London became infamous for its pea-soupers: thick, yellowish-green fogs saturated with sulfur dioxide. The smog became so dense that pedestrians could not see their own feet on the cobblestones, and unfortunate citizens frequently stumbled into canals and open drainage ditches in broad daylight.\n\nFollow A Day Back Then for daily historical stories.\n\n#PeaSouper #GreatSmog #VictorianLondon #EnvironmentalHistory #HistoryFacts #ADayBackThen`,
    pinned: "Imagine walking through a city where fog is so dense you cannot see the lamppost directly in front of you. How would you navigate?"
  },
  {
    date: "2026-11-02",
    timeStr: "21:00",
    isoUtc: "2026-11-02T13:00:00.000Z",
    slug: "victorian-penny-blood",
    driveFileId: "1sApwSnfTnTjHjiQ-cJ38-2wX0Iz-ckgu",
    title: "ONE PENNY FOR PULP HORROR IN THE STREETS",
    caption: `ONE PENNY FOR PULP HORROR IN THE STREETS\n\nIn the 1830s, weekly serialized booklets known as Penny Bloods and Penny Dreadfuls captured the imagination of Britain working-class youth. These inexpensive pamphlets introduced legendary sensational characters like Sweeney Todd and Varney the Vampire. Aristocratic critics warned that sensational thrillers would corrupt youthful morals, yet these pulp editions laid the direct groundwork for modern comic books and serial thrillers.\n\nFollow A Day Back Then for daily historical stories.\n\n#PennyDreadful #GothicHorror #VictorianEra #PulpFiction #HistoryFacts #ADayBackThen`,
    pinned: "If you had a single spare penny in 1840, would you have bought fresh bread or the latest Penny Dreadful chapter?"
  },
  {
    date: "2026-11-03",
    timeStr: "12:00",
    isoUtc: "2026-11-03T04:00:00.000Z",
    slug: "victorian-phossy-jaw-matchgirls",
    driveFileId: "1EakAeGFC-ilk1TZYibefQiAFiLDhke8d",
    title: "THE MATCH FACTORY GIRLS WHOSE BONES GLOWED GREEN",
    caption: `THE MATCH FACTORY GIRLS WHOSE BONES GLOWED GREEN\n\nAt the Bryant and May match factory in East London during the 1880s, teenage girls worked fourteen-hour shifts dipping wooden splints into white phosphorus paste. The toxic fumes slowly penetrated tooth cavities, causing phossy jaw, an agonizing condition where jawbones deteriorated and literally glowed in the dark. In 1888, fourteen hundred matchgirls organized a historic strike and won landmark safety protections.\n\nFollow A Day Back Then for daily historical stories.\n\n#Matchgirls #PhossyJaw #LaborHistory #VictorianEra #IndustrialHistory #ADayBackThen`,
    pinned: "The matchgirls were mostly teenagers when they united to defeat one of Britain largest industrial firms. What do you think of their courage?"
  },
  {
    date: "2026-11-03",
    timeStr: "18:30",
    isoUtc: "2026-11-03T10:30:00.000Z",
    slug: "victorian-post-mortem-photos",
    driveFileId: "1mupEZ0SmBG6YFjP-ep5hm4TVncStjiNC",
    title: "THE FINAL PORTRAIT: WHY VICTORIANS POSED WITH THE DECEASED",
    caption: `THE FINAL PORTRAIT: WHY VICTORIANS POSED WITH THE DECEASED\n\nBecause early daguerreotype photography was expensive and rare in the mid-nineteenth century, ordinary working families often never captured an image of their children or parents during life. When a family member passed away, relatives lovingly dressed them in their Sunday finest to take a final keepsake portrait. In an era of staggering mortality rates, memorial photography was an expression of profound remembrance.\n\nFollow A Day Back Then for daily historical stories.\n\n#MementoMori #VictorianPhotography #SocialHistory #HistoryFacts #VictorianEra #ADayBackThen`,
    pinned: "If you lived during the Victorian era and had only one chance to preserve an image of a loved one, would you take a memorial portrait?"
  },
  {
    date: "2026-11-03",
    timeStr: "21:00",
    isoUtc: "2026-11-03T13:00:00.000Z",
    slug: "victorian-sewer-hunters-toshers",
    driveFileId: "1pfoAUbGwkoY1RMPzFJnD2yNkEA6HQGfk",
    title: "HUNTING FOR GOLD IN THE SEWERS BENEATH LONDON",
    caption: `HUNTING FOR GOLD IN THE SEWERS BENEATH LONDON\n\nToshers were subterranean scavengers who slipped into London sprawling, unmapped brick sewer tunnels beneath the streets. Equipped with pole lanterns, canvas bags, and hoe rakes, they waded through fetid black mud searching for lost coins, dropped silver spoons, and jewelry swept down street gutters. Despite the lethal risks of pocketed marsh gas, collapsing masonry, and tidal surges, an experienced tosher could make an entire sovereign in an afternoon.\n\nFollow A Day Back Then for daily historical stories.\n\n#Toshers #LondonSewers #VictorianHistory #UndergroundHistory #HistoryFacts #ADayBackThen`,
    pinned: "Would you venture into miles of pitch-black nineteenth-century sewers for a chance at finding gold jewelry?"
  },
  {
    date: "2026-11-04",
    timeStr: "12:00",
    isoUtc: "2026-11-04T04:00:00.000Z",
    slug: "victorian-chimney-sweep-job",
    driveFileId: "1GlFLw0h4v5nMfYqc0LWIdhwZ0t4w8tt0",
    title: "SIX-YEAR-OLD APPRENTICES FORCED UP FLUES",
    caption: `SIX-YEAR-OLD APPRENTICES FORCED UP FLUES\n\nBecause Victorian flues and chimneys were built narrow and convoluted, master sweeps purchased orphaned children as young as four and five years old to work as climbing boys. These young apprentices were forced to squeeze up nine-inch brick chimneys in darkness, scraping soot with small metal brushes while inhaling clouds of toxic ash. It took decades of parliamentary debate and intense public outrage before climbing boys were finally outlawed.\n\nFollow A Day Back Then for daily historical stories.\n\n#ChimneySweep #VictorianHistory #ChildLabor #SocialHistory #HistoryFacts #ADayBackThen`,
    pinned: "Some of these chimney flues measured only nine inches across. What is your reaction to the working conditions of Victorian climbing boys?"
  },
  {
    date: "2026-11-04",
    timeStr: "18:30",
    isoUtc: "2026-11-04T10:30:00.000Z",
    slug: "victorian-factory-day",
    driveFileId: "1tMYOvRsPMhx3XyIPgOvM1qc8yWB2ijX0",
    title: "FOURTEEN HOURS AMID UNGUARDED STEAM GEARS",
    caption: `FOURTEEN HOURS AMID UNGUARDED STEAM GEARS\n\nBefore dawn broke across northern England, the industrial mill bells summoned thousands of workers to their stations. Arriving a few minutes late meant forfeiting half a day pay. Inside the spinning mills, workers faced heavy leather drive belts and massive cast-iron gears operating without safety guards, humid air saturated with airborne cotton fiber, and young children tasked with crawling under operating looms to sweep lint.\n\nFollow A Day Back Then for daily historical stories.\n\n#IndustrialRevolution #VictorianHistory #FactoryLife #SocialHistory #HistoryFacts #ADayBackThen`,
    pinned: "Could you survive a fourteen-hour shift surrounded by deafening, unguarded machinery in a Victorian textile mill?"
  },
  {
    date: "2026-11-04",
    timeStr: "21:00",
    isoUtc: "2026-11-04T13:00:00.000Z",
    slug: "victorian-penny-sit-up-coffin-beds",
    driveFileId: "1U_dbE7Zgc0MC0v3xxpeYNAmX6Mkx7ND5",
    title: "TWO PENCE TO SLEEP HANGING OVER A ROPE",
    caption: `TWO PENCE TO SLEEP HANGING OVER A ROPE\n\nIn London East End, impoverished laborers who could not afford a real bed turned to four-penny coffin homes: wooden boxes where men slept beneath tarpaulins. For two pence, the two-penny hangover offered shelter sitting on a wooden bench while leaning forward against a taut rope slung across the room. At six in the morning, the shelter keeper unhooked the rope, sending every sleeping customer crashing to the wooden floor.\n\nFollow A Day Back Then for daily historical stories.\n\n#TwoPennyHangover #CoffinBeds #VictorianLondon #EastEnd #HistoryFacts #ADayBackThen`,
    pinned: "Which of these shelter arrangements sounds the most brutal: the penny sit-up bench, the two-penny hangover rope, or the coffin bed?"
  },
  {
    date: "2026-11-05",
    timeStr: "12:00",
    isoUtc: "2026-11-05T04:00:00.000Z",
    slug: "wwii-ration-day",
    driveFileId: "1ZdxbziNEn9QGlSWmWkaxjvP4YB0oZucX",
    title: "ONE FRESH EGG FOR AN ENTIRE WEEK",
    caption: `ONE FRESH EGG FOR AN ENTIRE WEEK\n\nDuring World War II in Great Britain, civilian survival depended on the official ration book. Every citizen was restricted to strict weekly allowances: two ounces of butter, two ounces of loose tea, and only one fresh egg per week. Families transformed suburban gardens and bomb craters into vegetable patches under the Dig for Victory campaign, while used tea leaves were dried on stoves to be steeped a second time.\n\nFollow A Day Back Then for daily historical stories.\n\n#WWIIRationing #HomeFront #WW2History #DigForVictory #HistoryFacts #ADayBackThen`,
    pinned: "Could your household survive on one single fresh egg per person each week? Tell us how you would budget meals."
  },
  {
    date: "2026-11-05",
    timeStr: "18:30",
    isoUtc: "2026-11-05T10:30:00.000Z",
    slug: "wwii-anderson-shelter-backyard",
    driveFileId: "1X5hu5uigteff2xxVDyRTauq81HdVM6wW",
    title: "SLEEPING BENEATH THE LAWN AS BOMBS FELL",
    caption: `SLEEPING BENEATH THE LAWN AS BOMBS FELL\n\nOver two million British families assembled Anderson shelters in their back gardens: corrugated steel arches bolted together and buried beneath several feet of earth. The shelters were damp, freezing, and often accumulated standing water during heavy autumn rains. Yet throughout fifty-seven consecutive nights of London Blitz bombardment, these modest backyard bunkers saved tens of thousands of civilian lives.\n\nFollow A Day Back Then for daily historical stories.\n\n#AndersonShelter #TheBlitz #WW2History #HomeFront #LondonHistory #ADayBackThen`,
    pinned: "Spending ninety consecutive nights underground in a cold, damp garden shelter: could your family have endured it?"
  },
  {
    date: "2026-11-05",
    timeStr: "21:00",
    isoUtc: "2026-11-05T13:00:00.000Z",
    slug: "wwii-blackout-night",
    driveFileId: "11X2XoNgnf1Ue4SuOwEUlls-q00polQO3",
    title: "STRIKING A MATCH OUTDOORS COULD MEAN ARREST",
    caption: `STRIKING A MATCH OUTDOORS COULD MEAN ARREST\n\nDuring the Blitz, the British government enforced an uncompromising nationwide blackout to prevent enemy bombers from spotting urban centers. Heavy black curtains were pinned across every residential window, car headlights were masked with metal louvers, and air raid wardens patrolled streets arresting anyone exposing a flame. Walking home through total darkness, thousands of pedestrians fell off bridge piers and tumbled into fresh bomb craters.\n\nFollow A Day Back Then for daily historical stories.\n\n#TheBlackout #TheBlitz #WW2History #HomeFront #LondonHistory #ADayBackThen`,
    pinned: "Have you ever experienced total citywide darkness without a single streetlamp or window glowing? Tell us your experience."
  },
  {
    date: "2026-11-06",
    timeStr: "12:00",
    isoUtc: "2026-11-06T04:00:00.000Z",
    slug: "wwii-deception-ghost-army",
    driveFileId: "1sbITlJjVnToIA3c3jlQNVs7vkgKFr-ks",
    title: "THE INFLATABLE TANKS THAT FOOLED THE GERMAN HIGH COMMAND",
    caption: `THE INFLATABLE TANKS THAT FOOLED THE GERMAN HIGH COMMAND\n\nIn 1944, the United States Army deployed the 23rd Headquarters Special Troops, popularly known as the Ghost Army. Composed of artists, sound engineers, architects, and designers, their mission was pure theatrical deception. They inflated rubber Sherman tanks in thirty minutes, fabricated phantom radio traffic, and broadcast the recorded sounds of armored divisions through giant five-hundred-pound loudspeakers across French valleys.\n\nFollow A Day Back Then for daily historical stories.\n\n#GhostArmy #WW2History #MilitaryHistory #Deception #HistoryFacts #ADayBackThen`,
    pinned: "Did you know an entire division won critical WWII tactical engagements using inflatable rubber tanks and sound effects?"
  },
  {
    date: "2026-11-06",
    timeStr: "18:30",
    isoUtc: "2026-11-06T10:30:00.000Z",
    slug: "wwii-night-fighter-carrots-myth",
    driveFileId: "10m_gc1Xm3N3TRjrM2d9ehbQRMR7iP3cr",
    title: "THE WARTIME LIE THAT CARROTS GIVE YOU NIGHT VISION",
    caption: `THE WARTIME LIE THAT CARROTS GIVE YOU NIGHT VISION\n\nIn the autumn of 1940, Royal Air Force night fighter pilots suddenly began shooting down German bombers in total darkness with pinpoint accuracy. The secret advantage was Britain newly developed airborne radar equipment. To keep this breakthrough technology hidden from enemy intelligence, the Air Ministry launched a press campaign claiming pilots ate enormous quantities of carrots to see in the dark, a myth still believed today.\n\nFollow A Day Back Then for daily historical stories.\n\n#CarrotsMyth #RadarHistory #WW2History #RAF #Propaganda #ADayBackThen`,
    pinned: "Did your parents ever tell you that eating carrots would help you see in the dark? Tell us below."
  },
  {
    date: "2026-11-06",
    timeStr: "21:00",
    isoUtc: "2026-11-06T13:00:00.000Z",
    slug: "ottoman-hamam-bathhouse",
    driveFileId: "1BtmwC2v1JLK_lCHQr0MdHgI3OGl09Eah",
    title: "WHERE MOTHERS SCOUTED FUTURE BRIDES IN THE HAMAM",
    caption: `WHERE MOTHERS SCOUTED FUTURE BRIDES IN THE HAMAM\n\nThe Turkish hamam was the architectural heart of Ottoman public hygiene: heated marble slabs, scrubbing with coarse kese mitts, and warm scented steam under domed skylights. For Ottoman women, the hamam was the premier social salon of the week. Families brought fruit spreads, shared neighborhood news, and mothers carefully observed prospective brides in an open social environment where status was stripped away.\n\nFollow A Day Back Then for daily historical stories.\n\n#Hamam #OttomanEmpire #IstanbulHistory #CulturalHistory #HistoryFacts #ADayBackThen`,
    pinned: "Spending six hours socializing, eating, and relaxing in a marble steam bath: would you enjoy an authentic Ottoman hamam day?"
  },
  {
    date: "2026-11-07",
    timeStr: "12:00",
    isoUtc: "2026-11-07T04:00:00.000Z",
    slug: "ottoman-imperial-hareem-politics",
    driveFileId: "1HkDtB0504xcYdQe8S_hVBh1tqZuhHEvl",
    title: "THE WOMEN WHO RULED THE OTTOMAN EMPIRE",
    caption: `THE WOMEN WHO RULED THE OTTOMAN EMPIRE\n\nThe Imperial Harem of Topkapi Palace was far from a gilded prison: it operated as a sophisticated academy of administrative law, diplomacy, language, and politics. At its pinnacle stood the Valide Sultan, the mother of the reigning Sultan. During the era known as the Sultanate of Women, legendary rulers like Hurrem Sultan and Kosem Sultan governed state policy, financed grand public works, and negotiated directly with European monarchs.\n\nFollow A Day Back Then for daily historical stories.\n\n#SultanateOfWomen #TopkapiPalace #OttomanHistory #WomenInHistory #HistoryFacts #ADayBackThen`,
    pinned: "Did you know that for over a century, powerful women inside Topkapi Palace held the true reins of the Ottoman Empire?"
  },
  {
    date: "2026-11-07",
    timeStr: "18:30",
    isoUtc: "2026-11-07T10:30:00.000Z",
    slug: "ottoman-janissary-life",
    driveFileId: "1eA1FRaNu96yzLtgm2uQmATon15a8eTJ4",
    title: "THE ARMY WHOSE SACRED BATTLE FLAG WAS A SOUP POT",
    caption: `THE ARMY WHOSE SACRED BATTLE FLAG WAS A SOUP POT\n\nThe Janissaries were the first standing professional infantry in Europe, renowned for strict discipline and firearm mastery. Their internal hierarchy was structured around culinary traditions: senior colonels were designated Soup Makers, and captains were known as Head Cooks. Their most revered military standard was not a woven silk flag, but the giant bronze copper cauldron of their regiment. Inverting the cauldron in the square was the unmistakable signal of open rebellion.\n\nFollow A Day Back Then for daily historical stories.\n\n#Janissaries #OttomanEmpire #MilitaryHistory #HistoryFacts #Istanbul #ADayBackThen`,
    pinned: "A giant copper soup cauldron serving as the most feared military symbol in Europe: have you heard this story before?"
  },
  {
    date: "2026-11-07",
    timeStr: "21:00",
    isoUtc: "2026-11-07T13:00:00.000Z",
    slug: "ottoman-siege-cannon-dardanelles",
    driveFileId: "1mpRvKQgMngU3K3JKY9jqEpjmVeGzumPR",
    title: "THE EIGHTEEN-TON SUPER-CANNONS OF 1453",
    caption: `THE EIGHTEEN-TON SUPER-CANNONS OF 1453\n\nThe ancient triple walls of Constantinople held strong for over a thousand years until Sultan Mehmed II commissioned the legendary cannon maker Urban to cast the Basilica super-cannon. Measuring twenty-seven feet long and weighing eighteen tons, the bronze monster fired twelve-hundred-pound stone spheres into the city ramparts. Sixty oxen and two hundred men were required to haul the colossal siege gun across Thrace.\n\nFollow A Day Back Then for daily historical stories.\n\n#Constantinople1453 #OttomanEmpire #SiegeOfConstantinople #MilitaryHistory #HistoryFacts #ADayBackThen`,
    pinned: "The super-cannon could fire only seven times a day because the barrel had to be cooled in warm olive oil. Was it worth the effort?"
  }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const logFile = "data/week1-scheduled-reels.json";

let history = {};
if (fs.existsSync(logFile)) {
  try {
    history = JSON.parse(fs.readFileSync(logFile, "utf8"));
  } catch {}
}

async function run() {
  console.log("========================================================");
  console.log("   ARMING WEEK 1 BACKLOG SCHEDULE (Nov 1–7, 2026)");
  console.log("========================================================");
  console.log(`Total slots: ${week1Plan.length}`);
  console.log(`Page: A Day Back Then (1322330324303425)`);
  console.log("--------------------------------------------------------\n");

  for (let i = 0; i < week1Plan.length; i++) {
    const item = week1Plan[i];
    console.log(`[Slot ${i + 1}/${week1Plan.length}] ${item.date} ${item.timeStr} PHT: ${item.slug}`);

    if (history[item.slug]?.status === "SCHEDULED") {
      console.log(`   ⏭️  Already scheduled (Video ID: ${history[item.slug].videoId}). Skipping.`);
      continue;
    }

    const localVideo = path.join("out", `${item.slug}.mp4`);
    if (!fs.existsSync(localVideo)) {
      console.log(`   📥 Downloading from Drive (ID: ${item.driveFileId})...`);
      execSync(`gdrive readonly download ${item.driveFileId} -o ${localVideo}`, { stdio: "inherit" });
    }

    console.log(`   🚀 Uploading & Scheduling on Meta Graph API...`);
    const uploadRes = await uploadReel(item.slug, {
      channel: "adaybackthen",
      caption: item.caption,
      schedule: item.isoUtc
    });

    if (!uploadRes.videoId) {
      throw new Error(`Failed to schedule ${item.slug}: No videoId returned!`);
    }

    console.log(`   ✅ Scheduled successfully! Video ID: ${uploadRes.videoId}`);

    // Rename Drive file to DONE -
    console.log(`   🏷️  Renaming Drive file...`);
    try {
      execSync(`gdrive mutate rename ${item.driveFileId} "DONE - ${item.slug}.mp4"`, { stdio: "inherit" });
      console.log(`   ✓ Renamed to DONE - ${item.slug}.mp4 on Drive`);
    } catch (e) {
      console.warn(`   ⚠️ Warning: Failed to rename Drive file: ${e.message}`);
    }

    history[item.slug] = {
      date: item.date,
      time: item.timeStr,
      isoUtc: item.isoUtc,
      videoId: uploadRes.videoId,
      watchUrl: `https://www.facebook.com/watch/?v=${uploadRes.videoId}`,
      status: "SCHEDULED",
      title: item.title,
      pinned: item.pinned,
      scheduledAt: new Date().toISOString()
    };
    fs.writeFileSync(logFile, JSON.stringify(history, null, 2), "utf8");

    // Clean up local file to save disk space
    if (fs.existsSync(localVideo)) {
      fs.unlinkSync(localVideo);
    }

    console.log(`   ⏳ Safe pause 20s before next slot...\n`);
    await sleep(20000);
  }

  console.log("\n🎉 ALL 21 WEEK 1 REELS SUCCESSFULLY ARMED!");
}

run().catch((err) => {
  console.error("\n❌ ARMED PROCESS HALTED ON ERROR:", err);
  process.exit(1);
});
