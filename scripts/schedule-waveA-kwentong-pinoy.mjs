import fs from 'node:fs';
import path from 'node:path';
import { uploadReel } from './upload-facebook.mjs';
import { uploadVideo } from './upload-youtube.mjs';

const SCHEDULE_STATE_FILE = 'data/kwentong-pinoy-waveA-schedule.json';

const lineup = [
  {
    day: 1,
    slug: 'fort-santiago',
    ytScheduleIso: '2026-10-31T12:00:00Z', // 20:00 PHT (8:00 PM)
    fbScheduleIso: '2026-10-31T13:00:00Z', // 21:00 PHT (9:00 PM)
    displaySlot: 'Oct 31, 2026 (Day 1)',
    ytTitle: 'Fort Santiago: The Prisoners the River Claimed #shorts',
    fbCaption: `PHILIPPINE DARK LORE
NOONG 1945, DAAN-DAANG BILANGGO ANG INILOCK SA ILALIM NG FORT SANTIAGO — AT PINASOK NG TUBIG ANG KANILANG SELDA

Dito rin ikinulong si Rizal bago siya lumakad patungong Bagumbayan noong 1896. Ngayon, parke at museo na ang Fort Santiago — pero sa may piitan, may mga bisitang nakakaramdam ng malamig na hangin at iyak sa katahimikan.

Follow Kwentong Pinoy: Lore & History para sa araw-araw na kwentong bayan at dark history!

#FortSantiago #KwentongPinoy #PhilippineHistory #Intramuros #Manila #DarkHistory`,
    ytDescription: `NOONG 1945, DAAN-DAANG BILANGGO ANG INILOCK SA ILALIM NG FORT SANTIAGO — AT PINASOK NG TUBIG ANG KANILANG SELDA

Dito rin ikinulong si Rizal bago siya lumakad patungong Bagumbayan noong 1896. Ngayon, parke at museo na ang Fort Santiago — pero sa may piitan, may mga bisitang nakakaramdam ng malamig na hangin at iyak sa katahimikan.

Nakita mo na ba ang mga bronze na yapak ni Rizal sa Fort Santiago? Ano ang naramdaman mo habang sinusundan ito?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #FortSantiago #Intramuros #DarkHistory`
  },
  {
    day: 2,
    slug: 'teniente-gimo',
    ytScheduleIso: '2026-11-01T12:00:00Z',
    fbScheduleIso: '2026-11-01T13:00:00Z',
    displaySlot: 'Nov 01, 2026 (Day 2)',
    ytTitle: 'Teniente Gimo: The Fiesta Guest Who Was the Feast #shorts',
    fbCaption: `PHILIPPINE DARK LORE
MAY IMBITASYON SIYA SA PISTA — PERO HINDI SIYA ANG HANDA, IKAW

Sa Aklan, ang pinakarespetadong tao sa baryo ay si Teniente Gimo. Kaya nang imbitahan niya ang isang dalagang bisita sa kanyang bahay, walang nagduda. Hanggang sa hatinggabi, nang marinig ng dalaga ang tanong mula sa kabila ng dingding: "Handa na ba ang bisita?"

Follow Kwentong Pinoy: Lore & History para sa araw-araw na kwentong bayan at dark history!

#TenienteGimo #KwentongPinoy #PinoyHorror #Aswang #Aklan #KwentongBayan`,
    ytDescription: `MAY IMBITASYON SIYA SA PISTA — PERO HINDI SIYA ANG HANDA, IKAW

Sa Aklan, ang pinakarespetadong tao sa baryo ay si Teniente Gimo. Kaya nang imbitahan niya ang isang dalagang bisita sa kanyang bahay, walang nagduda. Hanggang sa hatinggabi, nang marinig ng dalaga ang tanong mula sa kabila ng dingding: "Handa na ba ang bisita?"

Narinig mo na ba ang kwento ni Teniente Gimo noong bata ka? Saan mo ito unang narinig?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #TenienteGimo #PinoyHorror #Aswang`
  },
  {
    day: 3,
    slug: 'cia-aswang',
    ytScheduleIso: '2026-11-02T12:00:00Z',
    fbScheduleIso: '2026-11-02T13:00:00Z',
    displaySlot: 'Nov 02, 2026 (Day 3)',
    ytTitle: 'The Aswang the CIA Used as a Weapon #shorts',
    fbCaption: `PHILIPPINE DARK LORE
NOONG 1950s, GINAMIT NG AMERIKA ANG ASWANG — BILANG SANDATA LABAN SA MGA HUK

Hindi ito tsismis. Isinulat mismo ng CIA operative na si Edward Lansdale sa kanyang memoir: itinanghal nila ang isang patay na Huk na parang inatake ng aswang — walang dugo, may dalawang butas sa leeg. At ang mga gerilya, iniwan ang baryo sa takot.

Follow Kwentong Pinoy: Lore & History para sa araw-araw na kwentong bayan at dark history!

#CIA #Aswang #KwentongPinoy #PhilippineHistory #ColdWar #DarkHistory`,
    ytDescription: `NOONG 1950s, GINAMIT NG AMERIKA ANG ASWANG — BILANG SANDATA LABAN SA MGA HUK

Hindi ito tsismis. Isinulat mismo ng CIA operative na si Edward Lansdale sa kanyang memoir: itinanghal nila ang isang patay na Huk na parang inatake ng aswang — walang dugo, may dalawang butas sa leeg. At ang mga gerilya, iniwan ang baryo sa takot.

Alam mo bang ginamit pala ng Amerika ang takot natin sa aswang? Anong masasabi mo rito?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #CIA #Aswang #PhilippineHistory`
  },
  {
    day: 4,
    slug: 'corregidor',
    ytScheduleIso: '2026-11-03T12:00:00Z',
    fbScheduleIso: '2026-11-03T13:00:00Z',
    displaySlot: 'Nov 03, 2026 (Day 4)',
    ytTitle: 'Corregidor: The Island That Never Surrendered #shorts',
    fbCaption: `PHILIPPINE DARK LORE
SA ISLANG ITO, ANG MGA SUNDALO AY NAGBABANTAY PA RIN — 80 TAON PAGKATAPOS NG DIGMAAN

Sa Malinta Tunnel, libo-libong sugatan ang ginamot sa dilim noong 1942. Noong 1945, marami sa mga huling tagapagtanggol ng isla ay hindi na nakalabas ng mga tunnel. Hanggang ngayon, may mga yabag at sigaw pa ring naririnig ang mga guwardiya sa gabi.

Follow Kwentong Pinoy: Lore & History para sa araw-araw na kwentong bayan at dark history!

#Corregidor #KwentongPinoy #PhilippineHistory #WWII #Bataan #DarkHistory`,
    ytDescription: `SA ISLANG ITO, ANG MGA SUNDALO AY NAGBABANTAY PA RIN — 80 TAON PAGKATAPOS NG DIGMAAN

Sa Malinta Tunnel, libo-libong sugatan ang ginamot sa dilim noong 1942. Noong 1945, marami sa mga huling tagapagtanggol ng isla ay hindi na nakalabas ng mga tunnel. Hanggang ngayon, may mga yabag at sigaw pa ring naririnig ang mga guwardiya sa gabi.

Nakapunta ka na ba sa Corregidor? Saang lugar doon ang pinakaramdam mo ang bigat ng kasaysayan?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #Corregidor #WWII #DarkHistory`
  },
  {
    day: 5,
    slug: 'maria-labo',
    ytScheduleIso: '2026-11-04T12:00:00Z',
    fbScheduleIso: '2026-11-04T13:00:00Z',
    displaySlot: 'Nov 04, 2026 (Day 5)',
    ytTitle: 'Maria Labo: The Nurse Who Came Home an Aswang #shorts',
    fbCaption: `PHILIPPINE DARK LORE
UMALIS SIYA BILANG NARS. UMUWI SIYA BILANG ASWANG

Sa Capiz, may isang inang nangibang-bansa para sa kinabukasan ng kanyang mga anak. Pero nang umuwi siya, may nagbago — umiiwas siya sa simbahan, at nagsimulang magkasakit ang baryo. Sa pinakamadilim na bersyon ng kwento, ang sarili niyang mga anak ang nakatuklas ng totoo.

Follow Kwentong Pinoy: Lore & History para sa araw-araw na kwentong bayan at dark history!

#MariaLabo #KwentongPinoy #PinoyHorror #Aswang #Capiz #KwentongBayan`,
    ytDescription: `UMALIS SIYA BILANG NARS. UMUWI SIYA BILANG ASWANG

Sa Capiz, may isang inang nangibang-bansa para sa kinabukasan ng kanyang mga anak. Pero nang umuwi siya, may nagbago — umiiwas siya sa simbahan, at nagsimulang magkasakit ang baryo. Sa pinakamadilim na bersyon ng kwento, ang sarili niyang mga anak ang nakatuklas ng totoo.

Bakit kaya ang Capiz ang tinaguriang bayan ng mga aswang? Anong kwento ang alam mo?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #MariaLabo #PinoyHorror #Aswang`
  },
  {
    day: 6,
    slug: 'siquijor',
    ytScheduleIso: '2026-11-05T12:00:00Z',
    fbScheduleIso: '2026-11-05T13:00:00Z',
    displaySlot: 'Nov 05, 2026 (Day 6)',
    ytTitle: 'Siquijor: Island of Healers and Sorcerers #shorts',
    fbCaption: `PHILIPPINE DARK LORE
ISANG ISLA. DALAWANG KLASE NG MAHIWAGA: ANG NANGKUKULAM, AT ANG GUMAGAMOT

Tinawag itong Isla de Fuego ng mga Kastila. Dito, ang bolo-bolo healer ay humihihip sa kawayan para hilahin ang sakit palabas ng katawan — at dito rin isinisisi ang barang. Hanggang ngayon, tuwing Semana Santa, umaakyat ang mga manggagamot sa Bundok Bandilaan para kumuha ng mga halamang gamot.

Follow Kwentong Pinoy: Lore & History para sa araw-araw na kwentong bayan at dark history!

#Siquijor #KwentongPinoy #PinoyFolklore #Manggagamot #IslaDeFuego #KwentongBayan`,
    ytDescription: `ISANG ISLA. DALAWANG KLASE NG MAHIWAGA: ANG NANGKUKULAM, AT ANG GUMAGAMOT

Tinawag itong Isla de Fuego ng mga Kastila. Dito, ang bolo-bolo healer ay humihihip sa kawayan para hilahin ang sakit palabas ng katawan — at dito rin isinisisi ang barang. Hanggang ngayon, tuwing Semana Santa, umaakyat ang mga manggagamot sa Bundok Bandilaan para kumuha ng mga halamang gamot.

Kung makakapunta ka sa Siquijor, kanino ka magpapagamot — o matatakot ka bang sumubok?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #Siquijor #PinoyFolklore #Manggagamot`
  },
  {
    day: 7,
    slug: 'laguna-copperplate',
    ytScheduleIso: '2026-11-06T12:00:00Z',
    fbScheduleIso: '2026-11-06T13:00:00Z',
    displaySlot: 'Nov 06, 2026 (Day 7)',
    ytTitle: 'Laguna Copperplate: A Debt Forgiven in the Year 900 #shorts',
    fbCaption: `PHILIPPINE DARK LORE
NOONG TAONG 900, ISANG LALAKI SA LAGUNA ANG NAGKAROON NG UTANG — AT BINURA ITO SA ISANG PLAKANG TANSO

Noong 1989, isang tagahukay ng buhangin sa Ilog Lumbang ang nakadiskubre ng nakarolyong tanso. Nang basahin ng mga eksperto: isang opisyal na kapatawaran sa utang para kay Namwaran at sa kanyang pamilya, sa harap ng mga pinuno ng Tondo — anim na siglo bago dumating si Magellan.

Follow Kwentong Pinoy: Lore & History para sa araw-araw na kwentong bayan at dark history!

#LagunaCopperplate #KwentongPinoy #PhilippineHistory #Tondo #AncientPhilippines #Kasaysayan`,
    ytDescription: `NOONG TAONG 900, ISANG LALAKI SA LAGUNA ANG NAGKAROON NG UTANG — AT BINURA ITO SA ISANG PLAKANG TANSO

Noong 1989, isang tagahukay ng buhangin sa Ilog Lumbang ang nakadiskubre ng nakarolyong tanso. Nang basahin ng mga eksperto: isang opisyal na kapatawaran sa utang para kay Namwaran at sa kanyang pamilya, sa harap ng mga pinuno ng Tondo — anim na siglo bago dumating si Magellan.

Kung may ganito nang sibilisasyon dito noong 900 AD, ano pa kayang kasaysayan ang hindi pa natin alam?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #LagunaCopperplate #PhilippineHistory #AncientPhilippines`
  },
  {
    day: 8,
    slug: 'magindara',
    ytScheduleIso: '2026-11-07T12:00:00Z',
    fbScheduleIso: '2026-11-07T13:00:00Z',
    displaySlot: 'Nov 07, 2026 (Day 8)',
    ytTitle: 'Magindara: The Sirens of the Visayan Sea #shorts',
    fbCaption: `PHILIPPINE DARK LORE
MAY KUMAKANTA SA ILALIM NG DAGAT — AT ANG MANGINGISDA, HINDI NA UMUUWI

Sabi ng matatandang mangingisda, bawat bahura ay may sariling kanta — at may sariling mga nalunod. Kaya bago ihagis ang lambat, may iniaalay muna sa dagat. At isang bilin: kahit anong mangyari, huwag mong sasagutin ang kanta.

Follow Kwentong Pinoy: Lore & History para sa araw-araw na kwentong bayan at dark history!

#Magindara #KwentongPinoy #PhilippineMythology #Alamat #Visayas #Sirena`,
    ytDescription: `MAY KUMAKANTA SA ILALIM NG DAGAT — AT ANG MANGINGISDA, HINDI NA UMUUWI

Sabi ng matatandang mangingisda, bawat bahura ay may sariling kanta — at may sariling mga nalunod. Kaya bago ihagis ang lambat, may iniaalay muna sa dagat. At isang bilin: kahit anong mangyari, huwag mong sasagutin ang kanta.

May kwentong dagat din ba sa bayan ninyo? Anong nilalang ang binabantayan ng mga mangingisda?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #Magindara #Visayas #PhilippineMythology`
  },
  {
    day: 9,
    slug: 'berbalang',
    ytScheduleIso: '2026-11-08T12:00:00Z',
    fbScheduleIso: '2026-11-08T13:00:00Z',
    displaySlot: 'Nov 08, 2026 (Day 9)',
    ytTitle: 'Berbalang: The Aswang That Leaves Its Own Body #shorts',
    fbCaption: `PHILIPPINE DARK LORE
SA CAGAYAN, MAY ASWANG NA NATUTULOG — PERO ANG KALULUWA NIYA, NANGANGASO

Ang katawan niya, nakahiga at malamig sa banig. Pero ang kaluluwa niya, lumilipad sa dilim na may dalawang matang nagliliyab. At kapag mahina na ang tunog ng pakpak niya... ibig sabihin, nasa tabi mo na siya.

Follow Kwentong Pinoy: Lore & History para sa araw-araw na kwentong bayan at dark history!

#Berbalang #KwentongPinoy #PinoyHorror #PhilippineMythology #Cagayan #Aswang`,
    ytDescription: `SA CAGAYAN, MAY ASWANG NA NATUTULOG — PERO ANG KALULUWA NIYA, NANGANGASO

Ang katawan niya, nakahiga at malamig sa banig. Pero ang kaluluwa niya, lumilipad sa dilim na may dalawang matang nagliliyab. At kapag mahina na ang tunog ng pakpak niya... ibig sabihin, nasa tabi mo na siya.

Sa probinsya ninyo, ano ang depensa laban sa aswang na itinuturo ng matatanda?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #Berbalang #PinoyHorror #PhilippineMythology`
  }
];

async function run() {
  console.log('========================================================');
  console.log('   Kwentong Pinoy Wave A: Autonomous Publisher');
  console.log('   Order: Fort Santiago -> Teniente Gimo -> CIA Aswang');
  console.log('          -> Corregidor -> Maria Labo -> Siquijor');
  console.log('          -> Laguna Copperplate -> Magindara -> Berbalang');
  console.log('   Cadence: 1 per day (20:00 YT / 21:00 FB PHT)');
  console.log('========================================================\n');

  let state = {};
  if (fs.existsSync(SCHEDULE_STATE_FILE)) {
    try {
      state = JSON.parse(fs.readFileSync(SCHEDULE_STATE_FILE, 'utf8'));
    } catch {}
  }

  for (const item of lineup) {
    console.log(`\n--------------------------------------------------------`);
    console.log(`[DAY ${item.day}/9] ${item.displaySlot} - ${item.slug.toUpperCase()}`);
    console.log(`YouTube Slot: ${item.ytScheduleIso} (20:00 PHT)`);
    console.log(`Facebook Slot: ${item.fbScheduleIso} (21:00 PHT)`);
    console.log(`--------------------------------------------------------`);

    if (!state[item.slug]) {
      state[item.slug] = {};
    }

    // 1. Facebook Reels
    if (state[item.slug].fbVideoId) {
      console.log(`✓ Facebook Reel already scheduled! Video ID: ${state[item.slug].fbVideoId}`);
    } else {
      console.log(`1. Uploading & scheduling Facebook Reel...`);
      try {
        const fbRes = await uploadReel(item.slug, {
          channel: 'kwentong-pinoy',
          schedule: item.fbScheduleIso,
          caption: item.fbCaption
        });
        state[item.slug].fbVideoId = fbRes.videoId || fbRes.id;
        state[item.slug].fbScheduledSlot = item.fbScheduleIso;
        console.log(`✓ Facebook Reel Scheduled! Video ID: ${state[item.slug].fbVideoId}`);
      } catch (err) {
        console.error(`✗ Facebook scheduling error for ${item.slug}:`, err.message);
      }
    }

    // 2. YouTube Shorts
    if (state[item.slug].ytVideoId) {
      console.log(`✓ YouTube Short already scheduled! Video ID: ${state[item.slug].ytVideoId}`);
    } else {
      console.log(`2. Uploading & scheduling YouTube Short...`);
      try {
        const ytRes = await uploadVideo(item.slug, {
          channel: 'kwentong-pinoy',
          schedule: item.ytScheduleIso,
          title: item.ytTitle,
          description: item.ytDescription
        });
        state[item.slug].ytVideoId = ytRes?.videoId || ytRes?.id;
        state[item.slug].ytScheduledSlot = item.ytScheduleIso;
        console.log(`✓ YouTube Short Scheduled! Video ID: ${state[item.slug].ytVideoId}`);
      } catch (err) {
        console.error(`✗ YouTube scheduling error for ${item.slug}:`, err.message);
        if (err.message && err.message.includes('quota')) {
          console.warn(`[QUOTA NOTICE] YouTube API quota paused. Remaining days will pace on schedule.`);
        }
      }
    }

    // Persist state after each item
    fs.writeFileSync(SCHEDULE_STATE_FILE, JSON.stringify(state, null, 2));
  }

  console.log('\n========================================================');
  console.log('🎉 Scheduling Execution Complete!');
  console.log(`State recorded in: ${SCHEDULE_STATE_FILE}`);
  console.log('========================================================\n');
}

run();
