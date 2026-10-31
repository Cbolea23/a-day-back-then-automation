import { uploadReel } from './upload-facebook.mjs';

const caption = `PHILIPPINE DARK LORE
HUWAG KANG LILINGON KAPAG MAY ANINONG NAGLALAKAD NANG PATALIKOD

Sa Cebu at Bohol, tuwing Semana Santa at walang buwan, may nilalang na naglalakad nang patalikod - nakatungo ang ulo sa pagitan ng kanyang mga binti, at nauuna ang kanyang anino kaysa sa kanya. Ito ang sigbin: ang halimaw na naamoy mo muna bago mo makita.

Kung nagustuhan mo ang kwentong ito, i-follow ang page para sa susunod pang Dark Lore tuwing gabi.

#Sigbin #KwentongPinoy #PinoyHorror #Alamat #Cebu #ADayBackThen`;

async function main() {
  console.log('--- SCHEDULING SIGBIN ON FACEBOOK REELS ---');
  await uploadReel('sigbin', {
    schedule: '2026-10-27T04:00:00Z', // 12:00 PM PHT today
    caption
  });
}

main().catch(err => {
  console.error('Failed to schedule Sigbin on FB:', err);
  process.exit(1);
});
