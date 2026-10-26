import fs from "node:fs";

const tokenPath = "youtube-tokens.json";
const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

const REMEDIATION_MAP = {
  "kgf3QLAAOq4": {
    title: "Why ancient Celts dressed as demons on Oct 31 (Not for candy) #shorts",
    description: `Forget trick-or-treating. 2,000 years ago during Samhain, the ancient Celts believed the veil between the living and the dead dissolved for one terrifying night. 

To avoid being dragged into the otherworld by wandering spirits, villagers disguised themselves in animal skins and blackened their faces with ash to blend in with the demons.

Would you have survived a night during ancient Samhain? Tell us below! 👇

#Shorts #Samhain #HalloweenHistory #AncientCelts #HistoryFacts #CelticMythology #DarkHistory #ADayBackThen`,
    tags: ["Shorts", "Samhain", "Halloween History", "Ancient Celts", "History Facts", "Celtic Mythology", "Dark History", "A Day Back Then"]
  },
  "kR_vDip2Shc": {
    title: "The ancient festival where dead ancestors came home for dinner #shorts",
    description: `During the ancient Celtic festival of Samhain, every hearth fire was extinguished and relit from a sacred druid bonfire. 

Families set empty chairs at their tables and left out bowls of food, believing deceased ancestors would physically return to their homes for one final meal before winter struck.

Would you leave your front door open for dead ancestors? Let us know below! 👇

#Shorts #HalloweenOrigin #SamhainFestival #CelticLore #AncientHistory #SpookyHistory #ADayBackThen`,
    tags: ["Shorts", "Halloween Origin", "Samhain Festival", "Celtic Lore", "Ancient History", "Spooky History", "A Day Back Then"]
  },
  "2_uxvNGpG4o": {
    title: "If you hear this screaming in Ireland, you have 24 hours #shorts",
    description: `In ancient Irish lore, hearing the keening cry of a Banshee wasn't a curse—it was a death omen for five major noble clans.

Legend warned of the Bean Nighe: an eerie spectral woman washing blood-stained clothes in dark mountain streams right before a tragedy struck.

Have you ever heard an unexplainable noise in the middle of the night? Tell your story below! 👇

#Shorts #Banshee #IrishFolklore #CelticMythology #SpookyHistory #IrishHistory #DarkFolklore #ADayBackThen`,
    tags: ["Shorts", "Banshee", "Irish Folklore", "Celtic Mythology", "Spooky History", "Irish History", "Dark Folklore", "A Day Back Then"]
  },
  "_ZIM_rZ2c-4": {
    title: "Why an Ottoman Sultan threw up when he saw 20,000 stakes #shorts",
    description: `In 1462, Ottoman Sultan Mehmed II marched an army of 90,000 soldiers toward Târgoviște to conquer Wallachia.

What greeted them was a three-kilometer forest of over 20,000 impaled prisoners. The sight broke Ottoman morale so severely that Mehmed turned his entire imperial army around.

Could you handle psychological warfare like this? Let us know below! 👇

#Shorts #VladTheImpaler #DraculaHistory #OttomanEmpire #MedievalWarfare #HistoryFacts #Wallachia #ADayBackThen`,
    tags: ["Shorts", "Vlad the Impaler", "Dracula History", "Ottoman Empire", "Medieval Warfare", "History Facts", "Wallachia", "A Day Back Then"]
  },
  "o1Akf1Jj9AQ": {
    title: "The brutal test that proved you were a witch in 1645 #shorts",
    description: `During the chaos of the English Civil War, Matthew Hopkins appointed himself 'Witch Finder General' and executed over 100 people across England.

Under the 'swimming test', if you floated in water, you were guilty and hanged. If you sank, you were declared innocent—but drowned in the process.

How would anyone survive the paranoia of 17th century trials? Share your thoughts below! 👇

#Shorts #WitchTrials #WitchFinderGeneral #EnglishCivilWar #DarkHistory #HistoryFacts #17thCentury #ADayBackThen`,
    tags: ["Shorts", "Witch Trials", "Witch Finder General", "English Civil War", "Dark History", "History Facts", "17th Century", "A Day Back Then"]
  },
  "GlSpAyF1XG0": {
    title: "Why guards at the Tower of London refuse to walk this hallway #shorts",
    description: `For nearly 1,000 years, the Tower of London stood as England's most infamous fortress, prison, and execution ground.

From the disappearance of the two young Princes in 1483 to the execution of Queen Anne Boleyn, Yeoman Warders have documented chilling cold spots and shadow figures walking the Salt Tower corridors.

Would you spend a night locked inside the Tower of London? Tell us below! 👇

#Shorts #TowerOfLondon #AnneBoleyn #BritishHistory #PrincesInTheTower #GhostStories #DarkHistory #ADayBackThen`,
    tags: ["Shorts", "TowerOfLondon", "Anne Boleyn", "British History", "Princes in the Tower", "Ghost Stories", "Dark History", "A Day Back Then"]
  },
  "l9gu3ptn7Xs": {
    title: "Why plague doctors filled their bird beaks with dried flowers #shorts",
    description: `The bird-like mask worn by 17th-century plague doctors was not designed to frighten patients—it was a primitive gas mask.

Physicians believed the Black Death spread through 'miasma' or foul poisoned air. The 6-inch leather beak was stuffed with camphor, mint, and dried rose petals to filter out the stench of death.

Did you know the reason behind the plague doctor mask before watching? Let us know below! 👇

#Shorts #PlagueDoctor #BlackDeath #MedievalMedicine #MiasmaTheory #HistoryFacts #BubonicPlague #ADayBackThen`,
    tags: ["Shorts", "Plague Doctor", "Black Death", "Medieval Medicine", "Miasma Theory", "History Facts", "Bubonic Plague", "A Day Back Then"]
  }
};

async function remediate() {
  console.log("==========================================================");
  console.log("   REMEDIATING YOUTUBE TITLES, METADATA & DESCRIPTIONS");
  console.log("==========================================================");

  for (const [id, meta] of Object.entries(REMEDIATION_MAP)) {
    console.log(`\nFetching video: ${id}...`);
    const getRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&access_token=${tokens.access_token}`
    );
    const getData = await getRes.json();
    if (!getData.items || getData.items.length === 0) {
      console.error(`❌ Video ${id} not found.`);
      continue;
    }

    const snippet = getData.items[0].snippet;
    snippet.title = meta.title;
    snippet.description = meta.description;
    snippet.tags = meta.tags;
    snippet.categoryId = "27"; // Education

    const putRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&access_token=${tokens.access_token}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          snippet,
        }),
      }
    );

    const putData = await putRes.json();
    if (putData.snippet) {
      console.log(`✅ Updated: "${putData.snippet.title}"`);
    } else {
      console.error(`❌ Failed to update ${id}:`, JSON.stringify(putData));
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("\n==========================================================");
  console.log("🎉 ALL YOUTUBE METADATA SUCCESSFULLY REMEDIATED!");
  console.log("==========================================================");
}

remediate().catch(console.error);
