import { uploadReel } from './upload-facebook.mjs';

const caption = `PHILIPPINE DARK LORE
ANG ASWANG NA BUMANGON SA LIBINGAN... PERO HINDI MAKAYUKO

Sa Negros at Panay, kapag may bagong libing, maaga pa lang ay sarado na ang mga pinto. Ang amalanhig ay aswang na bumangon mula sa kanyang libingan na matigas ang buong katawan - hindi siya makayuko, hindi siya makalingon. At ang sikreto ng lahat ng nakaligtas sa kanya? Huwag na huwag kang tatakbo nang tuwid.

Kung nagustuhan mo ang kwentong ito, i-follow ang page para sa susunod pang Dark Lore tuwing gabi.

#Amalanhig #Aswang #KwentongPinoy #PinoyHorror #Negros #ADayBackThen`;

async function main() {
  console.log('--- SCHEDULING AMALANHIG (TIGHT 73.5s) ON FACEBOOK REELS ---');
  await uploadReel('amalanhig', {
    schedule: '2026-10-27T13:00:00Z', // 9:00 PM PHT tonight
    caption
  });
}

main().catch(err => {
  console.error('Failed to schedule Amalanhig on FB:', err);
  process.exit(1);
});
