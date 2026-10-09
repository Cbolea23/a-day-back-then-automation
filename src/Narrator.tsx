import React from "react";
import {interpolate, useCurrentFrame} from "remotion";

export type CharacterTheme = "roman" | "egypt" | "viking" | "medieval" | "knight" | "plague-doctor" | "greek" | "gladiator";

export function getThemeFromSlug(slug: string = ""): CharacterTheme {
  const s = slug.toLowerCase();
  if (s.includes("gladiator")) {
    return "gladiator";
  }
  if (s.includes("egypt") || s.includes("pharaoh") || s.includes("pyramid") || s.includes("mummy") || s.includes("embalmer") || s.includes("scribe")) {
    return "egypt";
  }
  if (s.includes("greek") || s.includes("athens") || s.includes("sparta") || s.includes("olympic") || s.includes("symposium")) {
    return "greek";
  }
  if (s.includes("viking") || s.includes("norse")) {
    return "viking";
  }
  if (s.includes("knight")) {
    return "knight";
  }
  if (s.includes("plague")) {
    return "plague-doctor";
  }
  if (s.includes("medieval") || s.includes("castle") || s.includes("peasant")) {
    return "medieval";
  }
  return "roman";
}

type Props = {
  theme?: CharacterTheme;
  talking?: boolean;
  height?: number;
  tunic?: string;
};

export const Narrator: React.FC<Props> = ({
  theme = "roman",
  talking = true,
  height = 760,
  tunic,
}) => {
  const frame = useCurrentFrame();

  const bob = Math.sin(frame / 12) * 7;
  const sway = Math.sin(frame / 30) * 1.5;
  const blinkCycle = frame % 110;
  const eyeScaleY = interpolate(blinkCycle, [0, 4, 8], [1, 0.1, 1], {
    extrapolateRight: "clamp",
  });
  const mouthOpen = talking ? (Math.floor(frame / 5) % 3 === 0 ? 1 : 0) : 0;

  return (
    <svg
      viewBox="0 0 300 600"
      height={height}
      style={{
        overflow: "visible",
        transform: `translateY(${bob}px) rotate(${sway}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      {/* ================= LEGS ================= */}
      {theme === "egypt" ? (
        <>
          {/* Bare tan legs with gold anklets */}
          <line x1="125" y1="400" x2="120" y2="570" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          {/* Gold anklets */}
          <rect x="110" y="555" width="20" height="8" rx="2" fill="#e5b32f" stroke="#111" strokeWidth="3" />
          <rect x="170" y="555" width="20" height="8" rx="2" fill="#e5b32f" stroke="#111" strokeWidth="3" />
        </>
      ) : theme === "viking" || theme === "knight" || theme === "medieval" ? (
        <>
          {/* Dark trousers & heavy leather boots */}
          <line x1="125" y1="400" x2="120" y2="570" stroke="#111" strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke="#111" strokeWidth="11" strokeLinecap="round" />
          <path d="M102 555 L130 555 L128 580 L92 580 Z" fill="#4a2e18" stroke="#111" strokeWidth="4" />
          <path d="M170 555 L198 555 L208 580 L172 580 Z" fill="#4a2e18" stroke="#111" strokeWidth="4" />
        </>
      ) : theme === "greek" ? (
        <>
          {/* Greek legs with laced leather sandals */}
          <line x1="125" y1="400" x2="120" y2="570" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          {/* Sandal straps */}
          <line x1="112" y1="510" x2="128" y2="520" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="128" y1="525" x2="114" y2="538" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="114" y1="545" x2="126" y2="555" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="172" y1="510" x2="188" y2="520" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="188" y1="525" x2="174" y2="538" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="174" y1="545" x2="186" y2="555" stroke="#7a4e2a" strokeWidth="4" />
        </>
      ) : theme === "gladiator" ? (
        <>
          {/* Gladiator legs with bronze greave (ocrea) and leather arena sandals */}
          <line x1="125" y1="400" x2="120" y2="570" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          {/* Bronze Greave (Ocrea) on right leg */}
          <path d="M168 470 L190 470 L188 555 L168 555 Z" fill="#d49b33" stroke="#111" strokeWidth="4" />
          <line x1="168" y1="495" x2="190" y2="495" stroke="#946513" strokeWidth="3" />
          <line x1="168" y1="525" x2="189" y2="525" stroke="#946513" strokeWidth="3" />
          {/* Leather straps on left leg */}
          <line x1="112" y1="490" x2="128" y2="500" stroke="#633e1f" strokeWidth="5" />
          <line x1="128" y1="515" x2="114" y2="525" stroke="#633e1f" strokeWidth="5" />
          <line x1="114" y1="542" x2="126" y2="552" stroke="#633e1f" strokeWidth="5" />
        </>
      ) : (
        <>
          {/* Roman legs with Caligae sandals */}
          <line x1="125" y1="400" x2="120" y2="570" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke="#111" strokeWidth="9" strokeLinecap="round" />
          {/* Sandal straps */}
          <line x1="114" y1="540" x2="126" y2="540" stroke="#7a4e2a" strokeWidth="5" />
          <line x1="114" y1="552" x2="126" y2="552" stroke="#7a4e2a" strokeWidth="5" />
          <line x1="174" y1="540" x2="186" y2="540" stroke="#7a4e2a" strokeWidth="5" />
          <line x1="174" y1="552" x2="186" y2="552" stroke="#7a4e2a" strokeWidth="5" />
        </>
      )}

      {/* ================= ARMS ================= */}
      <line x1="102" y1="190" x2="68" y2="335" stroke="#111" strokeWidth="9" strokeLinecap="round" />
      <line x1="198" y1="190" x2="232" y2="335" stroke="#111" strokeWidth="9" strokeLinecap="round" />
      {theme === "egypt" && (
        <>
          {/* Gold wrist cuffs */}
          <rect x="62" y="315" width="16" height="18" rx="3" fill="#e5b32f" stroke="#111" strokeWidth="3" transform="rotate(15 70 324)" />
          <rect x="222" y="315" width="16" height="18" rx="3" fill="#e5b32f" stroke="#111" strokeWidth="3" transform="rotate(-15 230 324)" />
        </>
      )}
      {theme === "gladiator" && (
        <>
          {/* Segmented Bronze/Leather Arm Guard (Manica) on right arm */}
          <rect x="195" y="210" width="22" height="18" rx="3" fill="#d49b33" stroke="#111" strokeWidth="3" transform="rotate(32 205 220)" />
          <rect x="204" y="235" width="22" height="18" rx="3" fill="#d49b33" stroke="#111" strokeWidth="3" transform="rotate(32 214 245)" />
          <rect x="213" y="260" width="22" height="18" rx="3" fill="#d49b33" stroke="#111" strokeWidth="3" transform="rotate(32 223 270)" />
          <rect x="222" y="285" width="22" height="18" rx="3" fill="#d49b33" stroke="#111" strokeWidth="3" transform="rotate(32 232 295)" />
          {/* Leather wrist bracer on left wrist */}
          <rect x="60" y="315" width="18" height="18" rx="3" fill="#523218" stroke="#111" strokeWidth="3" transform="rotate(15 70 324)" />
        </>
      )}

      {/* ================= BODY / OUTFIT ================= */}
      {theme === "egypt" ? (
        <>
          {/* Egyptian Linen Shendyt (Pleated Kilt) */}
          <path
            d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z"
            fill="#f7f2e7"
            stroke="#111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Pleat details */}
          <path d="M125 280 L115 410" stroke="#d5c8ad" strokeWidth="3" />
          <path d="M175 280 L185 410" stroke="#d5c8ad" strokeWidth="3" />
          {/* Ornate Gold Belt & Front Apron */}
          <rect x="80" y="270" width="140" height="20" rx="4" fill="#e5b32f" stroke="#111" strokeWidth="4" />
          <path d="M130 290 L170 290 L160 375 L140 375 Z" fill="#e5b32f" stroke="#111" strokeWidth="4" />
          <circle cx="150" cy="280" r="6" fill="#1b828f" />
          <circle cx="150" cy="330" r="5" fill="#a82323" />

          {/* Broad Usekh Collar (Jeweled Egyptian Necklace) */}
          <path
            d="M88 165 Q150 240 212 165 Q150 145 88 165 Z"
            fill="#e5b32f"
            stroke="#111"
            strokeWidth="5"
          />
          {/* Collar Rings (Turquoise & Carnelian) */}
          <path d="M96 175 Q150 230 204 175" stroke="#187a82" strokeWidth="6" fill="none" />
          <path d="M106 185 Q150 220 194 185" stroke="#9e1e1e" strokeWidth="5" fill="none" />
        </>
      ) : theme === "viking" ? (
        <>
          {/* Viking Wool Tunic (Forest green / earthy brown) */}
          <path
            d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z"
            fill="#3d5639"
            stroke="#111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Fur Mantle over shoulders */}
          <path
            d="M80 160 Q150 135 220 160 Q235 210 215 235 Q150 205 85 235 Q65 210 80 160 Z"
            fill="#7d5d3b"
            stroke="#111"
            strokeWidth="5"
          />
          {/* Fur texture marks */}
          <path d="M110 180 L120 195" stroke="#52391e" strokeWidth="3" />
          <path d="M150 170 L150 190" stroke="#52391e" strokeWidth="3" />
          <path d="M185 180 L175 195" stroke="#52391e" strokeWidth="3" />
          {/* Wide Norse leather belt with buckle and side pouch */}
          <rect x="76" y="285" width="148" height="22" rx="4" fill="#301f13" stroke="#111" strokeWidth="4" />
          <circle cx="150" cy="296" r="10" fill="#9e9e9e" stroke="#111" strokeWidth="3" />
          <rect x="180" y="295" width="28" height="32" rx="6" fill="#4d301b" stroke="#111" strokeWidth="3" />
        </>
      ) : theme === "knight" ? (
        <>
          {/* Knight Heraldic Surcoat over chainmail (Quartered Red & Gold) */}
          <path
            d="M96 168 Q150 150 204 168 L228 415 Q150 430 72 415 Z"
            fill="#b82d23"
            stroke="#111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Gold quarter half */}
          <path
            d="M150 158 Q177 163 204 168 L228 415 Q189 423 150 420 Z"
            fill="#dfac26"
            stroke="#111"
            strokeWidth="4"
          />
          {/* Knightly Cross motif */}
          <rect x="144" y="200" width="12" height="70" fill="#ffffff" stroke="#111" strokeWidth="3" />
          <rect x="115" y="220" width="70" height="12" fill="#ffffff" stroke="#111" strokeWidth="3" />
          {/* Heavy sword belt */}
          <rect x="76" y="290" width="148" height="20" rx="3" fill="#2b1a0e" stroke="#111" strokeWidth="4" />
          <rect x="140" y="286" width="20" height="28" rx="2" fill="#c0c0c0" stroke="#111" strokeWidth="3" />
        </>
      ) : theme === "medieval" ? (
        <>
          {/* Medieval Peasant Smock (Earthy russet brown) */}
          <path
            d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z"
            fill="#8a532d"
            stroke="#111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Peasant Cowl / Collar */}
          <path
            d="M90 160 Q150 145 210 160 Q215 220 150 225 Q85 220 90 160 Z"
            fill="#5c381e"
            stroke="#111"
            strokeWidth="5"
          />
          {/* Rope Belt with hanging coin sack */}
          <line x1="80" y1="295" x2="220" y2="295" stroke="#d5be8a" strokeWidth="8" strokeLinecap="round" />
          <circle cx="120" cy="325" r="14" fill="#5c381e" stroke="#111" strokeWidth="3" />
        </>
      ) : theme === "plague-doctor" ? (
        <>
          {/* Long dark waxed leather coat */}
          <path
            d="M96 168 Q150 150 204 168 L236 430 Q150 445 64 430 Z"
            fill="#1e1e24"
            stroke="#111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Shoulder Cowl */}
          <path
            d="M80 160 Q150 140 220 160 Q235 225 150 235 Q65 225 80 160 Z"
            fill="#141418"
            stroke="#111"
            strokeWidth="5"
          />
          {/* Silver chain & potion phial */}
          <path d="M120 190 Q150 240 180 190" stroke="#9e9e9e" strokeWidth="4" fill="none" />
          <rect x="143" y="235" width="14" height="24" rx="4" fill="#2d7f8d" stroke="#111" strokeWidth="3" />
        </>
      ) : theme === "greek" ? (
        <>
          {/* Ancient Greek White Chiton */}
          <path
            d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z"
            fill="#fcfaf4"
            stroke="#111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Aegean Blue Himation (diagonal sash) */}
          <path
            d="M92 168 Q125 210 160 290 L135 290 Q105 220 92 168 Z"
            fill="#234b7a"
            stroke="#111"
            strokeWidth="4"
          />
          {/* Gold shoulder brooch */}
          <circle cx="94" cy="172" r="6" fill="#dfb332" stroke="#111" strokeWidth="3" />
          {/* Greek Key pattern border at hem */}
          <line x1="84" y1="392" x2="216" y2="392" stroke="#234b7a" strokeWidth="5" />
          <line x1="84" y1="399" x2="216" y2="399" stroke="#dfb332" strokeWidth="3" />
          {/* Woven gold waist cord */}
          <line x1="82" y1="288" x2="218" y2="288" stroke="#dfb332" strokeWidth="6" strokeLinecap="round" />
        </>
      ) : theme === "gladiator" ? (
        <>
          {/* Gladiator Crimson Subligaculum (Loincloth / Kilt) */}
          <path
            d="M96 270 Q150 258 204 270 L226 412 Q150 430 74 412 Z"
            fill="#8e2222"
            stroke="#111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Fabric folds */}
          <path d="M120 310 L115 410" stroke="#5a1515" strokeWidth="3" />
          <path d="M180 310 L185 410" stroke="#5a1515" strokeWidth="3" />

          {/* Wide Gladiator Balteus (Bronze-studded leather belt) */}
          <rect x="76" y="272" width="148" height="28" rx="4" fill="#3d2212" stroke="#111" strokeWidth="4" />
          <rect x="138" y="268" width="24" height="36" rx="3" fill="#d49b33" stroke="#111" strokeWidth="3" />
          <circle cx="100" cy="286" r="5" fill="#d49b33" />
          <circle cx="120" cy="286" r="5" fill="#d49b33" />
          <circle cx="180" cy="286" r="5" fill="#d49b33" />
          <circle cx="200" cy="286" r="5" fill="#d49b33" />

          {/* Crossed Leather Chest Harness (Fascia / Torso Straps) */}
          <line x1="96" y1="180" x2="194" y2="274" stroke="#3d2212" strokeWidth="10" strokeLinecap="round" />
          <line x1="204" y1="180" x2="106" y2="274" stroke="#3d2212" strokeWidth="10" strokeLinecap="round" />
          <line x1="96" y1="180" x2="194" y2="274" stroke="#1f1008" strokeWidth="3" />
          <line x1="204" y1="180" x2="106" y2="274" stroke="#1f1008" strokeWidth="3" />

          {/* Central Bronze Medallion Boss */}
          <circle cx="150" cy="227" r="14" fill="#d49b33" stroke="#111" strokeWidth="3.5" />
          <circle cx="150" cy="227" r="6" fill="#8e2222" />

          {/* Bronze Shoulder Guard (Galerus) on right shoulder */}
          <path
            d="M188 165 Q232 150 228 208 Q196 215 188 165 Z"
            fill="#d49b33"
            stroke="#111"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <circle cx="210" cy="180" r="4" fill="#3d2212" />
        </>
      ) : (
        <>
          {/* Classic Roman Tunic */}
          <path
            d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z"
            fill={tunic || "#e8cf9a"}
            stroke="#111"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Roman Clavi (Crimson Senatorial / Citizen vertical stripes) */}
          <path d="M125 168 L120 405" stroke="#942626" strokeWidth="8" />
          <path d="M175 168 L180 405" stroke="#942626" strokeWidth="8" />
          {/* Roman Leather Belt with Brass Plates */}
          <rect x="80" y="290" width="140" height="18" rx="4" fill="#6e3d1b" stroke="#111" strokeWidth="4" />
          <rect x="140" y="286" width="20" height="26" rx="3" fill="#d4af37" stroke="#111" strokeWidth="3" />
          <rect x="115" y="291" width="10" height="16" fill="#d4af37" />
          <rect x="175" y="291" width="10" height="16" fill="#d4af37" />
        </>
      )}

      {/* ================= HEAD ================= */}
      {/* Base Face Circle */}
      <circle cx="150" cy="92" r="64" fill={theme === "egypt" ? "#e5b780" : "#f2dcb0"} stroke="#111" strokeWidth="6" />

      {/* ================= THEMED HEADGEAR / HAIR ================= */}
      {theme === "egypt" ? (
        <>
          {/* Egyptian Nemes / Headcloth with Blue & Gold Stripes */}
          {/* Back/top crown */}
          <path
            d="M86 90 Q80 20 150 20 Q220 20 214 90 Q215 50 150 40 Q85 50 86 90 Z"
            fill="#1d4370"
            stroke="#111"
            strokeWidth="5"
          />
          {/* Gold stripes on top */}
          <path d="M120 25 Q135 40 135 50" stroke="#e5b32f" strokeWidth="6" fill="none" />
          <path d="M150 20 L150 45" stroke="#e5b32f" strokeWidth="6" fill="none" />
          <path d="M180 25 Q165 40 165 50" stroke="#e5b32f" strokeWidth="6" fill="none" />
          {/* Front side lappets framing the face */}
          <path
            d="M86 85 Q75 130 70 185 Q85 185 92 145 Q98 115 95 85 Z"
            fill="#1d4370"
            stroke="#111"
            strokeWidth="5"
          />
          <path
            d="M214 85 Q225 130 230 185 Q215 185 208 145 Q202 115 205 85 Z"
            fill="#1d4370"
            stroke="#111"
            strokeWidth="5"
          />
          {/* Gold bands on lappets */}
          <line x1="78" y1="115" x2="94" y2="115" stroke="#e5b32f" strokeWidth="5" />
          <line x1="74" y1="145" x2="89" y2="145" stroke="#e5b32f" strokeWidth="5" />
          <line x1="71" y1="170" x2="85" y2="170" stroke="#e5b32f" strokeWidth="5" />
          <line x1="206" y1="115" x2="222" y2="115" stroke="#e5b32f" strokeWidth="5" />
          <line x1="211" y1="145" x2="226" y2="145" stroke="#e5b32f" strokeWidth="5" />
          <line x1="215" y1="170" x2="229" y2="170" stroke="#e5b32f" strokeWidth="5" />
          {/* Golden Uraeus (sacred cobra emblem) on forehead */}
          <circle cx="150" cy="35" r="7" fill="#e5b32f" stroke="#111" strokeWidth="3" />
        </>
      ) : theme === "viking" ? (
        <>
          {/* Viking Fur Cap / Headband */}
          <path
            d="M88 75 Q85 25 150 25 Q215 25 212 75 Z"
            fill="#694b2f"
            stroke="#111"
            strokeWidth="5"
          />
          {/* Fur rim */}
          <ellipse cx="150" cy="72" rx="66" ry="14" fill="#91704d" stroke="#111" strokeWidth="4" />
        </>
      ) : theme === "knight" ? (
        <>
          {/* Chainmail Coif around head */}
          <path
            d="M86 92 Q80 20 150 20 Q220 20 214 92 Q225 160 150 170 Q75 160 86 92 Z"
            fill="#858a91"
            stroke="#111"
            strokeWidth="5"
          />
          {/* Face opening */}
          <ellipse cx="150" cy="100" rx="46" ry="48" fill="#f2dcb0" stroke="#111" strokeWidth="5" />
          {/* Chainmail texture rings */}
          <circle cx="105" cy="50" r="3" fill="#52565c" />
          <circle cx="120" cy="40" r="3" fill="#52565c" />
          <circle cx="150" cy="35" r="3" fill="#52565c" />
          <circle cx="180" cy="40" r="3" fill="#52565c" />
          <circle cx="195" cy="50" r="3" fill="#52565c" />
        </>
      ) : theme === "medieval" ? (
        <>
          {/* Medieval Peasant Coif / Hood */}
          <path
            d="M86 90 Q82 20 150 20 Q218 20 214 90 Q215 145 150 155 Q85 145 86 90 Z"
            fill="#5c381e"
            stroke="#111"
            strokeWidth="5"
          />
          {/* Face cutout */}
          <ellipse cx="150" cy="96" rx="48" ry="50" fill="#f2dcb0" stroke="#111" strokeWidth="5" />
        </>
      ) : theme === "plague-doctor" ? (
        <>
          {/* Wide-brimmed Doctor Hat */}
          <ellipse cx="150" cy="45" rx="95" ry="18" fill="#141418" stroke="#111" strokeWidth="5" />
          <path d="M100 45 L115 0 L185 0 L200 45 Z" fill="#1c1c21" stroke="#111" strokeWidth="5" />
          {/* Goggles (Dark Round Lenses) */}
          <circle cx="126" cy="88" r="16" fill="#111113" stroke="#876527" strokeWidth="5" />
          <circle cx="174" cy="88" r="16" fill="#111113" stroke="#876527" strokeWidth="5" />
          <circle cx="123" cy="84" r="4" fill="#ffffff" />
          <circle cx="171" cy="84" r="4" fill="#ffffff" />
          {/* Iconic Long Curved Beak Mask */}
          <path
            d="M136 98 Q150 96 164 98 L160 160 Q150 185 142 185 L140 160 Z"
            fill="#d9cfbe"
            stroke="#111"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <circle cx="148" cy="165" r="2.5" fill="#111" />
        </>
      ) : theme === "greek" ? (
        <>
          {/* Athenian Olive Wreath with Golden Olives */}
          <path
            d="M90 76 Q150 36 210 76"
            stroke="#2d5a27"
            strokeWidth="4"
            fill="none"
          />
          <ellipse cx="104" cy="65" rx="9" ry="4" fill="#3e7a35" stroke="#111" strokeWidth="2" transform="rotate(-35 104 65)" />
          <ellipse cx="120" cy="54" rx="9" ry="4" fill="#3e7a35" stroke="#111" strokeWidth="2" transform="rotate(-20 120 54)" />
          <ellipse cx="140" cy="48" rx="9" ry="4" fill="#3e7a35" stroke="#111" strokeWidth="2" transform="rotate(-5 140 48)" />
          <ellipse cx="160" cy="48" rx="9" ry="4" fill="#3e7a35" stroke="#111" strokeWidth="2" transform="rotate(5 160 48)" />
          <ellipse cx="180" cy="54" rx="9" ry="4" fill="#3e7a35" stroke="#111" strokeWidth="2" transform="rotate(20 180 54)" />
          <ellipse cx="196" cy="65" rx="9" ry="4" fill="#3e7a35" stroke="#111" strokeWidth="2" transform="rotate(35 196 65)" />
          <circle cx="112" cy="60" r="3.5" fill="#dfb332" />
          <circle cx="150" cy="46" r="3.5" fill="#dfb332" />
          <circle cx="188" cy="60" r="3.5" fill="#dfb332" />
        </>
      ) : theme === "gladiator" ? (
        <>
          {/* Gladiator Murmillo/Thraex Bronze Helmet & Tall Crimson Crest */}
          {/* High Crimson Plume / Crest */}
          <path
            d="M142 20 Q124 -42 150 -58 Q176 -42 158 20 Z"
            fill="#b82222"
            stroke="#111"
            strokeWidth="4"
          />
          {/* Plume texture lines */}
          <path d="M145 -38 Q150 -48 155 -38" stroke="#7a1414" strokeWidth="3" fill="none" />
          <path d="M144 -18 Q150 -28 156 -18" stroke="#7a1414" strokeWidth="3" fill="none" />
          <path d="M146 2 Q150 -8 154 2" stroke="#7a1414" strokeWidth="3" fill="none" />

          {/* Bronze Crest Ridge Box */}
          <path d="M142 24 L142 -2 L158 -2 L158 24 Z" fill="#a8741c" stroke="#111" strokeWidth="3" />

          {/* Bronze Helmet Skull Dome */}
          <path
            d="M84 86 Q80 18 150 18 Q220 18 216 86 Q150 66 84 86 Z"
            fill="#d49b33"
            stroke="#111"
            strokeWidth="5"
          />

          {/* Flared Bronze Cheek Guards */}
          <path d="M85 82 L88 132 L102 122 L98 84 Z" fill="#b58022" stroke="#111" strokeWidth="3" />
          <path d="M215 82 L212 132 L198 122 L202 84 Z" fill="#b58022" stroke="#111" strokeWidth="3" />

          {/* Front Bronze Brow Visor Rim */}
          <ellipse cx="150" cy="72" rx="70" ry="12" fill="#e5b32f" stroke="#111" strokeWidth="4" />
          {/* Rivets and Central Crest Boss on Brow */}
          <circle cx="112" cy="72" r="3.5" fill="#3d2212" />
          <circle cx="150" cy="69" r="5" fill="#b82222" stroke="#111" strokeWidth="2" />
          <circle cx="188" cy="72" r="3.5" fill="#3d2212" />
        </>
      ) : (
        <>
          {/* Roman Laurel Wreath */}
          <path
            d="M92 78 Q150 40 208 78"
            stroke="#386b2d"
            strokeWidth="4"
            fill="none"
          />
          {/* Left leaves */}
          <ellipse cx="106" cy="68" rx="8" ry="4" fill="#4d8c3e" stroke="#111" strokeWidth="2" transform="rotate(-30 106 68)" />
          <ellipse cx="122" cy="58" rx="8" ry="4" fill="#4d8c3e" stroke="#111" strokeWidth="2" transform="rotate(-15 122 58)" />
          <ellipse cx="140" cy="52" rx="8" ry="4" fill="#4d8c3e" stroke="#111" strokeWidth="2" transform="rotate(-5 140 52)" />
          {/* Right leaves */}
          <ellipse cx="160" cy="52" rx="8" ry="4" fill="#4d8c3e" stroke="#111" strokeWidth="2" transform="rotate(5 160 52)" />
          <ellipse cx="178" cy="58" rx="8" ry="4" fill="#4d8c3e" stroke="#111" strokeWidth="2" transform="rotate(15 178 58)" />
          <ellipse cx="194" cy="68" rx="8" ry="4" fill="#4d8c3e" stroke="#111" strokeWidth="2" transform="rotate(30 194 68)" />
        </>
      )}

      {/* ================= EYES & MOUTH (if not covered by mask) ================= */}
      {theme !== "plague-doctor" && (
        <>
          {/* Egyptian eyeliner flick wings */}
          {theme === "egypt" && (
            <>
              <path d="M120 86 L112 83 L110 88" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M180 86 L188 83 L190 88" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Eyes */}
          <ellipse cx="128" cy="86" rx="6" ry={7 * eyeScaleY} fill="#111" />
          <ellipse cx="172" cy="86" rx="6" ry={7 * eyeScaleY} fill="#111" />

          {/* Mouth */}
          {mouthOpen ? (
            <ellipse cx="150" cy="120" rx="13" ry="9" fill="#5a1d1d" stroke="#111" strokeWidth="3" />
          ) : (
            <path d="M134 118 Q150 130 166 118" stroke="#111" strokeWidth="5" fill="none" strokeLinecap="round" />
          )}
        </>
      )}
    </svg>
  );
};
