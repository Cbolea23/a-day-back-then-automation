import fs from "node:fs";
import { validateContentGovernance } from "./lib/language-governance.mjs";

const week1Posts = [
  {
    date: "Nov 1, Sunday 12:00",
    slug: "victorian-arsenic-green-wallpaper",
    title: "THE DEADLIEST WALLPAPER IN VICTORIAN HOMES",
    body: "In the 1850s, a vibrant emerald hue called Scheele Green became the ultimate fashion trend in London homes, coloring everything from patterned wallpaper to children toys and luxury gowns. What homeowners did not realize was that the pigment secret ingredient was copper arsenite. In damp Victorian rooms, microscopic fungus reacted with the dyed walls, releasing toxic arsenic gas into nurseries and bedrooms as families slept.",
    tags: "#VictorianEra #ScheelesGreen #DarkHistory #HistoryFacts #LondonHistory #ADayBackThen",
    pinned: "If vivid green wallpaper was the peak aesthetic trend in the 1850s, would you have decorated your bedroom with it?"
  },
  {
    date: "Nov 1, Sunday 18:30",
    slug: "victorian-body-snatchers",
    title: "DIGGING UP FRESH GRAVES IN NIGHTTIME LONDON",
    body: "Because British law previously allowed only executed murderers to be dissected, medical academies faced an acute shortage of human cadavers for anatomy lectures. Enter the resurrection men: underground gangs paid substantial bounties to exhume freshly buried bodies within hours of interment. To prevent loved ones from being stolen, grieving families installed heavy iron mortsafes directly over cemetery plots.",
    tags: "#BodySnatchers #ResurrectionMen #VictorianHistory #DarkHistory #LondonHistory #ADayBackThen",
    pinned: "Have you ever seen an iron mortsafe in an old cemetery? Tell us your thoughts below."
  },
  {
    date: "Nov 1, Sunday 21:00",
    slug: "victorian-corset-fainting",
    title: "EIGHTEEN-INCH WAISTS AT THE EXPENSE OF BREATHING",
    body: "During the 1870s, high society demanded the dramatic wasp-waist silhouette, enforced by heavily boned corsets crafted from tempered steel and whalebone. Tight-lacing reduced natural breathing capacity by nearly a third and compressed vital organs. As a result, Victorian parlors featured specialized fainting couches, and ladies carried pocket vials of smelling salts everywhere they went.",
    tags: "#VictorianFashion #CorsetHistory #SocialHistory #HistoryFacts #London #ADayBackThen",
    pinned: "Could you endure a full day wearing a steel-boned corset tightened to an eighteen-inch waist?"
  },
  {
    date: "Nov 2, Monday 12:00",
    slug: "victorian-mudlark-job",
    title: "THE CHILDREN SCAVENGING COINS FROM RIVER SEWAGE",
    body: "Mudlarks were impoverished Victorian children who scavenged barefoot along the icy shores of the River Thames during low tide. They sifted through thick river silt contaminated with raw city sewage, searching for dropped coins, scraps of coal, copper nails, and discarded iron to sell. On a lucky day, a young mudlark might earn three pence, just enough to buy bread for their family.",
    tags: "#Mudlarks #RiverThames #VictorianHistory #ChildLabor #HistoryFacts #ADayBackThen",
    pinned: "Under ten years old and barefoot in the freezing mud of the Thames: what would life have been like for a young mudlark?"
  },
  {
    date: "Nov 2, Monday 18:30",
    slug: "victorian-pea-souper-smog",
    title: "THE YELLOW SMOG THAT TURNED LONDON PITCH BLACK",
    body: "Fed by the smoke of millions of coal fireplaces and industrial chimneys, London became infamous for its pea-soupers: thick, yellowish-green fogs saturated with sulfur dioxide. The smog became so dense that pedestrians could not see their own feet on the cobblestones, and unfortunate citizens frequently stumbled into canals and open drainage ditches in broad daylight.",
    tags: "#PeaSouper #GreatSmog #VictorianLondon #EnvironmentalHistory #HistoryFacts #ADayBackThen",
    pinned: "Imagine walking through a city where fog is so dense you cannot see the lamppost directly in front of you. How would you navigate?"
  },
  {
    date: "Nov 2, Monday 21:00",
    slug: "victorian-penny-blood",
    title: "ONE PENNY FOR PULP HORROR IN THE STREETS",
    body: "In the 1830s, weekly serialized booklets known as Penny Bloods and Penny Dreadfuls captured the imagination of Britain working-class youth. These inexpensive pamphlets introduced legendary sensational characters like Sweeney Todd and Varney the Vampire. Aristocratic critics warned that sensational thrillers would corrupt youthful morals, yet these pulp editions laid the direct groundwork for modern comic books and serial thrillers.",
    tags: "#PennyDreadful #GothicHorror #VictorianEra #PulpFiction #HistoryFacts #ADayBackThen",
    pinned: "If you had a single spare penny in 1840, would you have bought fresh bread or the latest Penny Dreadful chapter?"
  },
  {
    date: "Nov 3, Tuesday 12:00",
    slug: "victorian-phossy-jaw-matchgirls",
    title: "THE MATCH FACTORY GIRLS WHOSE BONES GLOWED GREEN",
    body: "At the Bryant and May match factory in East London during the 1880s, teenage girls worked fourteen-hour shifts dipping wooden splints into white phosphorus paste. The toxic fumes slowly penetrated tooth cavities, causing phossy jaw, an agonizing condition where jawbones deteriorated and literally glowed in the dark. In 1888, fourteen hundred matchgirls organized a historic strike and won landmark safety protections.",
    tags: "#Matchgirls #PhossyJaw #LaborHistory #VictorianEra #IndustrialHistory #ADayBackThen",
    pinned: "The matchgirls were mostly teenagers when they united to defeat one of Britain largest industrial firms. What do you think of their courage?"
  },
  {
    date: "Nov 3, Tuesday 18:30",
    slug: "victorian-post-mortem-photos",
    title: "THE FINAL PORTRAIT: WHY VICTORIANS POSED WITH THE DECEASED",
    body: "Because early daguerreotype photography was expensive and rare in the mid-nineteenth century, ordinary working families often never captured an image of their children or parents during life. When a family member passed away, relatives lovingly dressed them in their Sunday finest to take a final keepsake portrait. In an era of staggering mortality rates, memorial photography was an expression of profound remembrance.",
    tags: "#MementoMori #VictorianPhotography #SocialHistory #HistoryFacts #VictorianEra #ADayBackThen",
    pinned: "If you lived during the Victorian era and had only one chance to preserve an image of a loved one, would you take a memorial portrait?"
  },
  {
    date: "Nov 3, Tuesday 21:00",
    slug: "victorian-sewer-hunters-toshers",
    title: "HUNTING FOR GOLD IN THE SEWERS BENEATH LONDON",
    body: "Toshers were subterranean scavengers who slipped into London sprawling, unmapped brick sewer tunnels beneath the streets. Equipped with pole lanterns, canvas bags, and hoe rakes, they waded through fetid black mud searching for lost coins, dropped silver spoons, and jewelry swept down street gutters. Despite the lethal risks of pocketed marsh gas, collapsing masonry, and tidal surges, an experienced tosher could make an entire sovereign in an afternoon.",
    tags: "#Toshers #LondonSewers #VictorianHistory #UndergroundHistory #HistoryFacts #ADayBackThen",
    pinned: "Would you venture into miles of pitch-black nineteenth-century sewers for a chance at finding gold jewelry?"
  },
  {
    date: "Nov 4, Wednesday 12:00",
    slug: "victorian-chimney-sweep-job",
    title: "SIX-YEAR-OLD APPRENTICES FORCED UP FLUES",
    body: "Because Victorian flues and chimneys were built narrow and convoluted, master sweeps purchased orphaned children as young as four and five years old to work as climbing boys. These young apprentices were forced to squeeze up nine-inch brick chimneys in darkness, scraping soot with small metal brushes while inhaling clouds of toxic ash. It took decades of parliamentary debate and intense public outrage before climbing boys were finally outlawed.",
    tags: "#ChimneySweep #VictorianHistory #ChildLabor #SocialHistory #HistoryFacts #ADayBackThen",
    pinned: "Some of these chimney flues measured only nine inches across. What is your reaction to the working conditions of Victorian climbing boys?"
  },
  {
    date: "Nov 4, Wednesday 18:30",
    slug: "victorian-factory-day",
    title: "FOURTEEN HOURS AMID UNGUARDED STEAM GEARS",
    body: "Before dawn broke across northern England, the industrial mill bells summoned thousands of workers to their stations. Arriving a few minutes late meant forfeiting half a day pay. Inside the spinning mills, workers faced heavy leather drive belts and massive cast-iron gears operating without safety guards, humid air saturated with airborne cotton fiber, and young children tasked with crawling under operating looms to sweep lint.",
    tags: "#IndustrialRevolution #VictorianHistory #FactoryLife #SocialHistory #HistoryFacts #ADayBackThen",
    pinned: "Could you survive a fourteen-hour shift surrounded by deafening, unguarded machinery in a Victorian textile mill?"
  },
  {
    date: "Nov 4, Wednesday 21:00",
    slug: "victorian-penny-sit-up-coffin-beds",
    title: "TWO PENCE TO SLEEP HANGING OVER A ROPE",
    body: "In London East End, impoverished laborers who could not afford a real bed turned to four-penny coffin homes: wooden boxes where men slept beneath tarpaulins. For two pence, the two-penny hangover offered shelter sitting on a wooden bench while leaning forward against a taut rope slung across the room. At six in the morning, the shelter keeper unhooked the rope, sending every sleeping customer crashing to the wooden floor.",
    tags: "#TwoPennyHangover #CoffinBeds #VictorianLondon #EastEnd #HistoryFacts #ADayBackThen",
    pinned: "Which of these shelter arrangements sounds the most brutal: the penny sit-up bench, the two-penny hangover rope, or the coffin bed?"
  },
  {
    date: "Nov 5, Thursday 12:00",
    slug: "wwii-ration-day",
    title: "ONE FRESH EGG FOR AN ENTIRE WEEK",
    body: "During World War II in Great Britain, civilian survival depended on the official ration book. Every citizen was restricted to strict weekly allowances: two ounces of butter, two ounces of loose tea, and only one fresh egg per week. Families transformed suburban gardens and bomb craters into vegetable patches under the Dig for Victory campaign, while used tea leaves were dried on stoves to be steeped a second time.",
    tags: "#WWIIRationing #HomeFront #WW2History #DigForVictory #HistoryFacts #ADayBackThen",
    pinned: "Could your household survive on one single fresh egg per person each week? Tell us how you would budget meals."
  },
  {
    date: "Nov 5, Thursday 18:30",
    slug: "wwii-anderson-shelter-backyard",
    title: "SLEEPING BENEATH THE LAWN AS BOMBS FELL",
    body: "Over two million British families assembled Anderson shelters in their back gardens: corrugated steel arches bolted together and buried beneath several feet of earth. The shelters were damp, freezing, and often accumulated standing water during heavy autumn rains. Yet throughout fifty-seven consecutive nights of London Blitz bombardment, these modest backyard bunkers saved tens of thousands of civilian lives.",
    tags: "#AndersonShelter #TheBlitz #WW2History #HomeFront #LondonHistory #ADayBackThen",
    pinned: "Spending ninety consecutive nights underground in a cold, damp garden shelter: could your family have endured it?"
  },
  {
    date: "Nov 5, Thursday 21:00",
    slug: "wwii-blackout-night",
    title: "STRIKING A MATCH OUTDOORS COULD MEAN ARREST",
    body: "During the Blitz, the British government enforced an uncompromising nationwide blackout to prevent enemy bombers from spotting urban centers. Heavy black curtains were pinned across every residential window, car headlights were masked with metal louvers, and air raid wardens patrolled streets arresting anyone exposing a flame. Walking home through total darkness, thousands of pedestrians fell off bridge piers and tumbled into fresh bomb craters.",
    tags: "#TheBlackout #TheBlitz #WW2History #HomeFront #LondonHistory #ADayBackThen",
    pinned: "Have you ever experienced total citywide darkness without a single streetlamp or window glowing? Tell us your experience."
  },
  {
    date: "Nov 6, Friday 12:00",
    slug: "wwii-deception-ghost-army",
    title: "THE INFLATABLE TANKS THAT FOOLED THE GERMAN HIGH COMMAND",
    body: "In 1944, the United States Army deployed the 23rd Headquarters Special Troops, popularly known as the Ghost Army. Composed of artists, sound engineers, architects, and designers, their mission was pure theatrical deception. They inflated rubber Sherman tanks in thirty minutes, fabricated phantom radio traffic, and broadcast the recorded sounds of armored divisions through giant five-hundred-pound loudspeakers across French valleys.",
    tags: "#GhostArmy #WW2History #MilitaryHistory #Deception #HistoryFacts #ADayBackThen",
    pinned: "Did you know an entire division won critical WWII tactical engagements using inflatable rubber tanks and sound effects?"
  },
  {
    date: "Nov 6, Friday 18:30",
    slug: "wwii-night-fighter-carrots-myth",
    title: "THE WARTIME LIE THAT CARROTS GIVE YOU NIGHT VISION",
    body: "In the autumn of 1940, Royal Air Force night fighter pilots suddenly began shooting down German bombers in total darkness with pinpoint accuracy. The secret advantage was Britain newly developed airborne radar equipment. To keep this breakthrough technology hidden from enemy intelligence, the Air Ministry launched a press campaign claiming pilots ate enormous quantities of carrots to see in the dark, a myth still believed today.",
    tags: "#CarrotsMyth #RadarHistory #WW2History #RAF #Propaganda #ADayBackThen",
    pinned: "Did your parents ever tell you that eating carrots would help you see in the dark? Tell us below."
  },
  {
    date: "Nov 6, Friday 21:00",
    slug: "ottoman-hamam-bathhouse",
    title: "WHERE MOTHERS SCOUTED FUTURE BRIDES IN THE HAMAM",
    body: "The Turkish hamam was the architectural heart of Ottoman public hygiene: heated marble slabs, scrubbing with coarse kese mitts, and warm scented steam under domed skylights. For Ottoman women, the hamam was the premier social salon of the week. Families brought fruit spreads, shared neighborhood news, and mothers carefully observed prospective brides in an open social environment where status was stripped away.",
    tags: "#Hamam #OttomanEmpire #IstanbulHistory #CulturalHistory #HistoryFacts #ADayBackThen",
    pinned: "Spending six hours socializing, eating, and relaxing in a marble steam bath: would you enjoy an authentic Ottoman hamam day?"
  },
  {
    date: "Nov 7, Saturday 12:00",
    slug: "ottoman-imperial-hareem-politics",
    title: "THE WOMEN WHO RULED THE OTTOMAN EMPIRE",
    body: "The Imperial Harem of Topkapi Palace was far from a gilded prison: it operated as a sophisticated academy of administrative law, diplomacy, language, and politics. At its pinnacle stood the Valide Sultan, the mother of the reigning Sultan. During the era known as the Sultanate of Women, legendary rulers like Hurrem Sultan and Kosem Sultan governed state policy, financed grand public works, and negotiated directly with European monarchs.",
    tags: "#SultanateOfWomen #TopkapiPalace #OttomanHistory #WomenInHistory #HistoryFacts #ADayBackThen",
    pinned: "Did you know that for over a century, powerful women inside Topkapi Palace held the true reins of the Ottoman Empire?"
  },
  {
    date: "Nov 7, Saturday 18:30",
    slug: "ottoman-janissary-life",
    title: "THE ARMY WHOSE SACRED BATTLE FLAG WAS A SOUP POT",
    body: "The Janissaries were the first standing professional infantry in Europe, renowned for strict discipline and firearm mastery. Their internal hierarchy was structured around culinary traditions: senior colonels were designated Soup Makers, and captains were known as Head Cooks. Their most revered military standard was not a woven silk flag, but the giant bronze copper cauldron of their regiment. Inverting the cauldron in the square was the unmistakable signal of open rebellion.",
    tags: "#Janissaries #OttomanEmpire #MilitaryHistory #HistoryFacts #Istanbul #ADayBackThen",
    pinned: "A giant copper soup cauldron serving as the most feared military symbol in Europe: have you heard this story before?"
  },
  {
    date: "Nov 7, Saturday 21:00",
    slug: "ottoman-siege-cannon-dardanelles",
    title: "THE EIGHTEEN-TON SUPER-CANNONS OF 1453",
    body: "The ancient triple walls of Constantinople held strong for over a thousand years until Sultan Mehmed II commissioned the legendary cannon maker Urban to cast the Basilica super-cannon. Measuring twenty-seven feet long and weighing eighteen tons, the bronze monster fired twelve-hundred-pound stone spheres into the city ramparts. Sixty oxen and two hundred men were required to haul the colossal siege gun across Thrace.",
    tags: "#Constantinople1453 #OttomanEmpire #SiegeOfConstantinople #MilitaryHistory #HistoryFacts #ADayBackThen",
    pinned: "The super-cannon could fire only seven times a day because the barrel had to be cooled in warm olive oil. Was it worth the effort?"
  }
];

let md = `# A Day Back Then — Backlog Copy Week 1 · Nov 1–7, 2026 (Authoritative English Edition)

Canonical English copy pack for A Day Back Then (Page ID: 1322330324303425). Zero emojis, strictly English, curated per video story.

`;

for (const p of week1Posts) {
  const fullCaption = `${p.title}\n\n${p.body}\n\nFollow A Day Back Then for daily historical stories.\n\n${p.tags}`;
  
  // Validate with language governance
  validateContentGovernance("adaybackthen", fullCaption, `Post ${p.slug}`);
  validateContentGovernance("adaybackthen", p.pinned, `Pinned comment for ${p.slug}`);

  md += `### ${p.date} — ${p.slug}\n`;
  md += `**Caption:**\n${fullCaption}\n\n`;
  md += `**Pinned comment:** ${p.pinned}\n\n`;
}

fs.writeFileSync("docs/adaybackthen-backlog-copy-week1.md", md, "utf8");
console.log("Successfully generated and validated docs/adaybackthen-backlog-copy-week1.md (100% English, zero emojis)!");
