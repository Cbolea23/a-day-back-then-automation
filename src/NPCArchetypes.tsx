import React from "react";
import {NPCArchetype} from "./types";

const INK = "#1c1917";

/** Headwear and hair for the 5 Cameo NPC archetypes */
export const ArchetypeHeadwear: React.FC<{archetype: NPCArchetype}> = ({archetype}) => {
  switch (archetype) {
    case "citizen":
      // Receding messy hair on sides, bald on top, exhausted commoner
      return (
        <g>
          {/* Side messy hair tufts */}
          <path
            d="M84 75 Q72 55 78 40 Q88 45 92 65 Z"
            fill="#4a382a"
            stroke={INK}
            strokeWidth="3.5"
          />
          <path
            d="M216 75 Q228 55 222 40 Q212 45 208 65 Z"
            fill="#4a382a"
            stroke={INK}
            strokeWidth="3.5"
          />
          {/* Stray unruly hairs */}
          <path d="M120 32 Q125 18 135 22" stroke="#4a382a" strokeWidth="3" fill="none" />
          <path d="M165 30 Q175 16 182 24" stroke="#4a382a" strokeWidth="3" fill="none" />
        </g>
      );

    case "doctor":
      // Wild eccentric graying tufts (mad genius / ancient doctor)
      return (
        <g>
          <path
            d="M74 80 Q56 60 66 38 Q84 46 90 68 Z"
            fill="#8c827a"
            stroke={INK}
            strokeWidth="3.5"
          />
          <path
            d="M226 80 Q244 60 234 38 Q216 46 210 68 Z"
            fill="#8c827a"
            stroke={INK}
            strokeWidth="3.5"
          />
          <path
            d="M86 42 Q100 24 116 32 Q104 44 94 48 Z"
            fill="#8c827a"
            stroke={INK}
            strokeWidth="3"
          />
          <path
            d="M214 42 Q200 24 184 32 Q196 44 206 48 Z"
            fill="#8c827a"
            stroke={INK}
            strokeWidth="3"
          />
        </g>
      );

    case "worker":
      // Red tied sweatband wrap around forehead with knot and dangling ties
      return (
        <g>
          <path
            d="M84 72 Q150 48 216 72 L216 56 Q150 34 84 56 Z"
            fill="#b91c1c"
            stroke={INK}
            strokeWidth="4.5"
          />
          {/* Headband cloth knot on the side */}
          <circle cx="218" cy="64" r="7" fill="#991b1b" stroke={INK} strokeWidth="3" />
          <path
            d="M222 68 L238 88 L230 96 L218 74 Z"
            fill="#b91c1c"
            stroke={INK}
            strokeWidth="3"
          />
          <path
            d="M224 62 L244 76 L240 84 L222 68 Z"
            fill="#991b1b"
            stroke={INK}
            strokeWidth="3"
          />
        </g>
      );

    case "guard":
      // Bronze helmet with crimson crest and cheek guards
      return (
        <g>
          {/* Crimson horsehair crest */}
          <path
            d="M142 -25 Q150 -45 158 -25 L162 38 L138 38 Z"
            fill="#dc2626"
            stroke={INK}
            strokeWidth="3.5"
          />
          <path
            d="M130 -10 Q150 -35 170 -10 L166 35 L134 35 Z"
            fill="#b91c1c"
            stroke={INK}
            strokeWidth="3"
          />
          {/* Bronze dome helmet */}
          <path
            d="M82 72 Q150 18 218 72 L212 42 Q150 2 88 42 Z"
            fill="#d97706"
            stroke={INK}
            strokeWidth="5"
          />
          {/* Brow reinforcing band */}
          <line x1="84" y1="62" x2="216" y2="62" stroke="#b45309" strokeWidth="5" />
          {/* Hanging cheek guards */}
          <path
            d="M92 68 L92 115 L106 115 L106 74 Z"
            fill="#d97706"
            stroke={INK}
            strokeWidth="3.5"
          />
          <path
            d="M208 68 L208 115 L194 115 L194 74 Z"
            fill="#d97706"
            stroke={INK}
            strokeWidth="3.5"
          />
        </g>
      );

    case "merchant":
      // Small embroidered merchant turban / cap with jewel
      return (
        <g>
          <ellipse cx="150" cy="45" rx="66" ry="24" fill="#0284c7" stroke={INK} strokeWidth="4.5" />
          <path
            d="M90 45 Q150 22 210 45 Q150 64 90 45 Z"
            fill="#0369a1"
            stroke={INK}
            strokeWidth="3.5"
          />
          {/* Gold center brooch */}
          <circle cx="150" cy="45" r="9" fill="#facc15" stroke={INK} strokeWidth="3" />
          <circle cx="150" cy="45" r="4.5" fill="#dc2626" />
          {/* Small feather plume */}
          <path d="M150 36 Q156 16 168 10 Q160 25 152 36 Z" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
        </g>
      );

    default:
      return null;
  }
};

/** Facial details (beards, stubble, spectacles, scars, smudges) */
export const ArchetypeFaceDetails: React.FC<{archetype: NPCArchetype}> = ({archetype}) => {
  switch (archetype) {
    case "citizen":
      // Stubble dots across jaw + tired eye bags
      return (
        <g>
          {/* Five o'clock shadow texture */}
          {[
            [122, 126], [128, 132], [134, 128], [140, 134],
            [146, 128], [152, 132], [158, 127], [164, 133],
            [170, 128], [176, 134], [132, 138], [144, 140],
            [156, 140], [168, 138]
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={1.6} fill="#4a382a" opacity={0.7} />
          ))}
          {/* Tired eye creases */}
          <path d="M120 102 Q128 106 136 102" stroke="#8c786a" strokeWidth="2.5" fill="none" />
          <path d="M164 102 Q172 106 180 102" stroke="#8c786a" strokeWidth="2.5" fill="none" />
        </g>
      );

    case "doctor":
      // Wire-rim spectacles + pointed goatee beard
      return (
        <g>
          {/* Round wire glasses */}
          <circle cx="128" cy="88" r="14" fill="rgba(255,255,255,0.25)" stroke="#b45309" strokeWidth="3" />
          <circle cx="172" cy="88" r="14" fill="rgba(255,255,255,0.25)" stroke="#b45309" strokeWidth="3" />
          <path d="M142 88 Q150 84 158 88" stroke="#b45309" strokeWidth="3" fill="none" />
          <line x1="114" y1="88" x2="96" y2="84" stroke="#b45309" strokeWidth="2.5" />
          <line x1="186" y1="88" x2="204" y2="84" stroke="#b45309" strokeWidth="2.5" />
          {/* Pointed doctor goatee */}
          <path
            d="M142 132 L150 162 L158 132 Z"
            fill="#574f48"
            stroke={INK}
            strokeWidth="3"
          />
        </g>
      );

    case "worker":
      // Soot / dirt smudges on cheeks + dripping sweat drop
      return (
        <g>
          {/* Dirt smudges on cheeks */}
          <ellipse cx="114" cy="104" rx="10" ry="6" fill="#3b2d20" opacity={0.55} transform="rotate(-15 114 104)" />
          <ellipse cx="186" cy="108" rx="9" ry="5" fill="#3b2d20" opacity={0.55} transform="rotate(20 186 108)" />
          {/* Forehead soot line */}
          <line x1="126" y1="76" x2="148" y2="78" stroke="#3b2d20" strokeWidth="3" strokeLinecap="round" opacity={0.5} />
        </g>
      );

    case "guard":
      // Chiseled jawline stubble + battle scar across eye/cheek
      return (
        <g>
          {/* Battle scar slash across left side */}
          <line x1="118" y1="74" x2="134" y2="108" stroke="#991b1b" strokeWidth="3.5" strokeLinecap="round" />
          {/* Chiseled jaw shadow */}
          <path
            d="M125 125 L150 142 L175 125 Z"
            fill="#3b2d20"
            opacity={0.3}
          />
        </g>
      );

    case "merchant":
      // Curled handlebar mustache + gold earring
      return (
        <g>
          {/* Handlebar mustache */}
          <path
            d="M150 118 Q138 110 120 118 Q112 124 108 120 Q116 106 136 110 Q146 114 150 118 Z"
            fill="#3d2817"
            stroke={INK}
            strokeWidth="2.5"
          />
          <path
            d="M150 118 Q162 110 180 118 Q188 124 192 120 Q184 106 164 110 Q154 114 150 118 Z"
            fill="#3d2817"
            stroke={INK}
            strokeWidth="2.5"
          />
          {/* Gold hoop earring on right ear */}
          <ellipse cx="218" cy="102" rx="5" ry="7" fill="none" stroke="#facc15" strokeWidth="3" />
        </g>
      );

    default:
      return null;
  }
};

/** Outfits, tunics, and accessories for the 5 archetypes */
export const ArchetypeOutfit: React.FC<{archetype: NPCArchetype; tunic?: string}> = ({
  archetype,
  tunic,
}) => {
  switch (archetype) {
    case "citizen":
      // Ragged brown/beige tunic with frayed patch and rope belt
      return (
        <>
          <path
            d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z"
            fill={tunic || "#b59f7b"}
            stroke={INK}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Frayed cloth patch on tunic */}
          <rect x="110" y="220" width="28" height="26" fill="#8c785b" stroke={INK} strokeWidth="3" rx="2" />
          <line x1="112" y1="222" x2="136" y2="244" stroke="#5c4d37" strokeWidth="2" />
          {/* Rough rope belt */}
          <line x1="80" y1="292" x2="220" y2="292" stroke="#4a3728" strokeWidth="10" strokeLinecap="round" />
          <line x1="80" y1="292" x2="220" y2="292" stroke="#78593a" strokeWidth="4" strokeLinecap="round" />
          {/* Hanging rope knot */}
          <path d="M140 292 L144 350 L136 350 Z" fill="#4a3728" stroke={INK} strokeWidth="2.5" />
        </>
      );

    case "doctor":
      // Dark scholar robe with apothecary vials belt
      return (
        <>
          <path
            d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z"
            fill={tunic || "#374151"}
            stroke={INK}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Leather utility belt */}
          <rect x="80" y="286" width="140" height="22" rx="4" fill="#78350f" stroke={INK} strokeWidth="4" />
          {/* Apothecary potion vials on belt */}
          {[95, 115, 175, 195].map((vx, i) => (
            <g key={i}>
              <rect x={vx} y="296" width="12" height="22" rx="3" fill="#38bdf8" stroke={INK} strokeWidth="2" />
              <rect x={vx + 2} y="292" width="8" height="6" fill="#facc15" stroke={INK} strokeWidth="1.5" />
            </g>
          ))}
          {/* Medical herb pouch */}
          <rect x="135" y="292" width="30" height="34" rx="4" fill="#92400e" stroke={INK} strokeWidth="3" />
        </>
      );

    case "worker":
      // Sleeveless stone-stained burlap tunic with heavy leather apron
      return (
        <>
          <path
            d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z"
            fill={tunic || "#a3907c"}
            stroke={INK}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Thick leather blacksmith/stonemason apron */}
          <path
            d="M112 210 L188 210 L196 385 L104 385 Z"
            fill="#593b21"
            stroke={INK}
            strokeWidth="4"
          />
          {/* Apron neck strap */}
          <path d="M125 170 L120 210" stroke="#3d2613" strokeWidth="4" />
          <path d="M175 170 L180 210" stroke="#3d2613" strokeWidth="4" />
          {/* Tool hanging in apron loop */}
          <line x1="172" y1="280" x2="168" y2="340" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
        </>
      );

    case "guard":
      // Segmented bronze/iron cuirass with crimson cape
      return (
        <>
          {/* Crimson military cape visible behind shoulders */}
          <path
            d="M86 170 L72 380 L228 380 L214 170 Z"
            fill="#991b1b"
            stroke={INK}
            strokeWidth="5"
          />
          {/* Bronze armor cuirass */}
          <path
            d="M96 168 Q150 150 204 168 L224 370 Q150 390 76 370 Z"
            fill={tunic || "#d97706"}
            stroke={INK}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Armor muscle plate ridges */}
          <path d="M120 220 Q150 240 180 220" stroke="#b45309" strokeWidth="5" fill="none" />
          <path d="M125 260 Q150 280 175 260" stroke="#b45309" strokeWidth="5" fill="none" />
          {/* Military belt with brass pteruges plates */}
          <rect x="80" y="310" width="140" height="22" rx="4" fill="#78350f" stroke={INK} strokeWidth="4" />
          {[98, 118, 138, 158, 178].map((px, i) => (
            <rect key={i} x={px} y="332" width="12" height="32" rx="2" fill="#d97706" stroke={INK} strokeWidth="2.5" />
          ))}
        </>
      );

    case "merchant":
      // Luxurious patterned silk vest with gold coin pouch
      return (
        <>
          <path
            d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z"
            fill={tunic || "#0284c7"}
            stroke={INK}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Gold embroidered open vest panels */}
          <path d="M102 172 L132 290 L100 390" stroke="#facc15" strokeWidth="6" fill="none" />
          <path d="M198 172 L168 290 L200 390" stroke="#facc15" strokeWidth="6" fill="none" />
          {/* Silk waist sash */}
          <rect x="80" y="280" width="140" height="24" rx="4" fill="#7c3aed" stroke={INK} strokeWidth="4" />
          {/* Bulging gold coin purse */}
          <circle cx="175" cy="305" r="14" fill="#d97706" stroke={INK} strokeWidth="3" />
          <circle cx="175" cy="296" r="6" fill="#facc15" />
        </>
      );

    default:
      return null;
  }
};
