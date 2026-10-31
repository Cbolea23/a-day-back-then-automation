import { uploadReel } from './upload-facebook.mjs';

const caption = `PHILIPPINE DARK LORE
KAPAG MAHINA NA ANG TUNOG NG WAK-WAK, NASA BUBUNGAN MO NA SIYA

Sa mga baryo ng Visayas, may tunog na ayaw marinig ng sinuman sa gabi: wak... wak... wak... Kapag malakas ang tunog, malayo pa siya. Pero kapag humina na ito hanggang sa halos hindi mo na marinig - huwag kang matuwa. Ibig sabihin noon, nasa itaas mo na siya.

Kung nagustuhan mo ang kwentong ito, i-follow ang page para sa susunod pang Dark Lore tuwing gabi.

#Wakwak #KwentongPinoy #PinoyHorror #PhilippineMythology #Visayas #ADayBackThen`;

async function main() {
  console.log('--- SCHEDULING WAKWAK ON FACEBOOK REELS ---');
  await uploadReel('wakwak', {
    schedule: '2026-10-27T10:30:00Z', // 6:30 PM PHT today
    caption
  });
}

main().catch(err => {
  console.error('Failed to schedule Wakwak on FB:', err);
  process.exit(1);
});
