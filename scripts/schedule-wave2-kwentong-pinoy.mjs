import fs from 'node:fs';
import path from 'node:path';
import { uploadReel } from './upload-facebook.mjs';
import { uploadVideo } from './upload-youtube.mjs';

const lineup = [
  {
    slug: 'diplomat-hotel',
    scheduleIso: '2026-10-30T10:30:00Z', // 6:30 PM PHT
    scheduleDisplay: 'October 30, 2026 at 6:30 PM PHT',
    ytTitle: 'Diplomat Hotel: The Headless Ghosts of Baguio #shorts',
    fbCaption: `PHILIPPINE DARK LORE
MAY NAGHAHANAP NG KANYANG ULO SA LOOB NG DIPLOMAT HOTEL

Sa tuktok ng Dominican Hill sa Baguio City, nakatayo ang isang abandonadong gusali na may madilim na nakaraan. Noong Ikalawang Digmaang Pandaigdig, pinugutan ng mga sundalong Hapon ang mga pari at madre rito. Hanggang ngayon, marami pa rin ang nakakakita ng mga aninong walang ulo na naglalakad sa mga pasilyo.

Kung nagustuhan mo ang kwentong ito, i-follow ang page para sa susunod pang mga misteryo at kasaysayan tuwing gabi.

#DiplomatHotel #BaguioCity #KwentongPinoy #PinoyHorror #UrbanLegend`,
    ytDescription: `MAY NAGHAHANAP NG KANYANG ULO SA LOOB NG DIPLOMAT HOTEL.

Sa tuktok ng Dominican Hill sa Baguio City, nakatayo ang isang abandonadong gusali na may madilim na nakaraan. Noong Ikalawang Digmaang Pandaigdig, pinugutan ng mga sundalong Hapon ang mga pari at madre rito.

Ikaw, papasok ka ba sa Diplomat Hotel sa gabi? Ibahagi ang opinyon mo sa comments!

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #PinoyHorror #DiplomatHotel #Baguio`
  },
  {
    slug: 'balete-drive-white-lady',
    scheduleIso: '2026-10-30T13:00:00Z', // 9:00 PM PHT
    scheduleDisplay: 'October 30, 2026 at 9:00 PM PHT',
    ytTitle: 'The White Lady of Balete Drive: She Flags You Down at Night #shorts',
    fbCaption: `PHILIPPINE DARK LORE
HUWAG KANG LILINGON SA SALAMIN KAPAG DUMAAN KA SA BALETE DRIVE

Sa New Manila, Quezon City, may kalsadang iniiwasan ng mga driver pagsapit ng hatinggabi... ang Balete Drive. May babaeng nakaputi na bigla na lang tatayo sa gitna ng daan, at kapag tiningnan mo sa rearview mirror, nasa backseat mo na siya nakaupo.

Kung nagustuhan mo ang kwentong ito, i-follow ang page para sa susunod pang mga misteryo at kasaysayan tuwing gabi.

#BaleteDrive #WhiteLady #KwentongPinoy #PinoyHorror #QuezonCity`,
    ytDescription: `HUWAG KANG LILINGON SA SALAMIN KAPAG DUMAAN KA SA BALETE DRIVE.

Sa New Manila, Quezon City, may kalsadang iniiwasan ng mga driver pagsapit ng hatinggabi... ang Balete Drive. May babaeng nakaputi na bigla na lang tatayo sa gitna ng daan.

Nakapag-drive ka na ba sa Balete Drive sa madaling araw? Titingin ka ba sa salamin?

I-subscribe ang channel para sa mga misteryo at kwento ng ating kasaysayan: @KwentongPinoyLore

#Shorts #KwentongPinoy #PhilippineLore #PinoyHorror #WhiteLady #BaleteDrive`
  }
];

async function main() {
  console.log('========================================================');
  console.log('   Scheduling Wave 2 Launch on Kwentong Pinoy');
  console.log('   Target: Facebook Page (1426725153855187)');
  console.log('   Target: YouTube Channel (UCK3vSyh6bAL4gBK6zxXkNlQ)');
  console.log('========================================================\n');

  const results = [
    {
      slug: 'manila-film-center',
      slot: 'October 30, 2026 at 12:00 PM PHT',
      scheduleIso: '2026-10-30T04:00:00Z',
      fbVideoId: '2337866793665527',
      ytVideoId: 'zrDF-wiwUa0'
    }
  ];

  for (const item of lineup) {
    console.log(`\n▶ [SCHEDULING] ${item.slug.toUpperCase()}`);
    console.log(`Slot: ${item.scheduleDisplay} (${item.scheduleIso})`);

    // 1. Schedule on Facebook Reels
    console.log(`1. Uploading & scheduling on Facebook Page...`);
    const fbRes = await uploadReel(item.slug, {
      channel: 'kwentong-pinoy',
      schedule: item.scheduleIso,
      caption: item.fbCaption
    });

    console.log(`✓ Facebook Reel Scheduled! Video ID: ${fbRes.videoId || fbRes.id || 'OK'}`);

    // 2. Schedule on YouTube Shorts
    console.log(`2. Uploading & scheduling on YouTube Channel...`);
    const ytRes = await uploadVideo(item.slug, {
      channel: 'kwentong-pinoy',
      schedule: item.scheduleIso,
      title: item.ytTitle,
      description: item.ytDescription
    });

    console.log(`✓ YouTube Short Scheduled! Video ID: ${ytRes?.videoId || 'OK'}`);

    results.push({
      slug: item.slug,
      slot: item.scheduleDisplay,
      scheduleIso: item.scheduleIso,
      fbVideoId: fbRes.videoId || fbRes.id,
      ytVideoId: ytRes?.videoId
    });
  }

  console.log('\n========================================================');
  console.log('🎉 ALL 3 EPISODES SCHEDULED ON FACEBOOK & YOUTUBE!');
  console.log('========================================================\n');
  console.table(results);
}

main().catch(err => {
  console.error('\n❌ Scheduling failed:', err.message);
  process.exit(1);
});
