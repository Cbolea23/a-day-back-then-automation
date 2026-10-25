"use client";

import React, {useMemo} from "react";

export type NarratorPreviewProps = {
  theme?: string;
  tunicColor?: string;
  accentColor?: string;
  size?: number;
  gesture?: "idle" | "explain" | "point" | "wave" | "think" | "shrug";
  talking?: boolean;
};

const INK = "#111111";
const SKIN_DEFAULT = "#f2dcb0";
const SKIN_EGYPT = "#e5b780";
const SKIN_MESOAMERICA = "#c68d58";

type Vec = [number, number];

type Pose = {
  lElbow: Vec;
  lHand: Vec;
  rElbow: Vec;
  rHand: Vec;
  headTilt: number;
  headDy: number;
  lean: number;
  shiftX: number;
};

const POSES: Record<string, Pose> = {
  idle: {
    lElbow: [80, 262],
    lHand: [68, 336],
    rElbow: [220, 262],
    rHand: [232, 336],
    headTilt: 0,
    headDy: 0,
    lean: 0,
    shiftX: 0,
  },
  explain: {
    lElbow: [58, 246],
    lHand: [38, 262],
    rElbow: [242, 246],
    rHand: [262, 262],
    headTilt: 0,
    headDy: 0,
    lean: 0,
    shiftX: 0,
  },
  point: {
    lElbow: [82, 265],
    lHand: [70, 325],
    rElbow: [232, 218],
    rHand: [272, 168],
    headTilt: 5,
    headDy: 0,
    lean: 4,
    shiftX: 10,
  },
  wave: {
    lElbow: [78, 260],
    lHand: [68, 330],
    rElbow: [242, 208],
    rHand: [268, 138],
    headTilt: -3,
    headDy: 0,
    lean: 0,
    shiftX: 0,
  },
  think: {
    lElbow: [85, 255],
    lHand: [135, 285],
    rElbow: [225, 245],
    rHand: [182, 162],
    headTilt: -6,
    headDy: 3,
    lean: -2,
    shiftX: 0,
  },
  shrug: {
    lElbow: [55, 235],
    lHand: [35, 218],
    rElbow: [245, 235],
    rHand: [265, 218],
    headTilt: 4,
    headDy: 0,
    lean: 0,
    shiftX: 0,
  },
};

/**
 * Hand with palm, thumb, articulated fingers, and beast claws when werewolf.
 */
const Hand: React.FC<{
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  side: "left" | "right";
  variant?: "open" | "point" | "fist";
  skin: string;
  isWolf?: boolean;
}> = ({x, y, fromX, fromY, side, variant = "open", skin, isWolf = false}) => {
  const ang = Math.atan2(y - fromY, x - fromX);
  const fingerLine = (a: number, len: number, w = 3.5) => {
    const bx = x + Math.cos(a) * 6;
    const by = y + Math.sin(a) * 6;
    const fx = bx + Math.cos(a) * len;
    const fy = by + Math.sin(a) * len;
    return (
      <g key={a}>
        <line
          x1={bx}
          y1={by}
          x2={fx}
          y2={fy}
          stroke={INK}
          strokeWidth={w}
          strokeLinecap="round"
        />
        {isWolf && (
          <line
            x1={fx}
            y1={fy}
            x2={fx + Math.cos(a) * 6}
            y2={fy + Math.sin(a) * 6}
            stroke="#141414"
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}
      </g>
    );
  };

  return (
    <g>
      {variant === "point" ? (
        fingerLine(ang, 16, 4)
      ) : variant === "open" ? (
        <g>
          {fingerLine(ang - 0.38, 9)}
          {fingerLine(ang, 11)}
          {fingerLine(ang + 0.38, 9)}
        </g>
      ) : null}
      <circle
        cx={x}
        cy={y}
        r={variant === "fist" ? 9 : 8}
        fill={skin}
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* Thumb */}
      <circle
        cx={x + (side === "left" ? -7 : 7)}
        cy={y - 1}
        r={3.6}
        fill={skin}
        stroke={INK}
        strokeWidth={2.5}
      />
      {isWolf && (
        <line
          x1={x + (side === "left" ? -7 : 7)}
          y1={y - 1}
          x2={x + (side === "left" ? -12 : 12)}
          y2={y - 4}
          stroke="#141414"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

/**
 * Eyebrows for cartoon host (fierce angled brow ridge for werewolf).
 */
const Brows: React.FC<{isWolf?: boolean}> = ({isWolf = false}) => {
  if (isWolf) {
    return (
      <g stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none">
        <line x1="114" y1="74" x2="138" y2="82" />
        <line x1="186" y1="74" x2="162" y2="82" />
      </g>
    );
  }
  const L = [117, 70, 128, 66, 139, 70];
  const R = [161, 70, 172, 66, 183, 70];
  return (
    <g stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none">
      <path d={`M ${L[0]} ${L[1]} Q ${L[2]} ${L[3]} ${L[4]} ${L[5]}`} />
      <path d={`M ${R[0]} ${R[1]} Q ${R[2]} ${R[3]} ${R[4]} ${R[5]}`} />
    </g>
  );
};

/**
 * The 100% Authentic Remotion Narrator Character SVG.
 * Contains dedicated, authentic, fully distinct graphics for ALL 30 historical & folklore costumes:
 * - Werewolf (wolf ears, fur mane, snarling fangs, glowing amber slit eyes, torn shirt, shaggy digitigrade legs & clawed paws)
 * - Roman Citizen vs Ancient Greek (draped toga with crimson clavus vs chiton with azure himation & meander hem)
 * - Norse Viking vs Medieval Villager (fur mantle & Celtic knot belt vs rustic peasant cowl & rope belt)
 * - Ottoman Chronicler vs Victorian Londoner vs WWII War Correspondent (crimson fez & kaytan vs newsboy cap & watch chain vs 1940s vest & gas mask strap)
 * - Shadow Demon (horns, red spiky hair, ember cracks, red eyes)
 * - Gravedigger (Victorian top hat, cravat, mourning armband)
 * - Forest Druid (deep cowl hood, rope belt, oak leaves & autumn berries)
 * - Executioner (black leather hood with eye slits, baldric strap, heavy iron belt)
 * - Gothic Abbey Nun (flowing habit, white coif collar, wooden rosary cross)
 * - Ancient Mummy (linen bandage wraps, loose fluttering strips, chest gap)
 * - Krampus (curved goat horns, shaggy fur torso, cloven hooves, chains & bell)
 * - Plague Doctor, Gladiator, Pirate, Asian, Ninja, Knight, Witch, Vampire, Ghost, Albularyo, Barong, Katipunero, Modern!
 */
export function NarratorPreview({
  theme = "roman",
  tunicColor,
  accentColor,
  size = 280,
  gesture = "explain",
  talking = false,
}: NarratorPreviewProps) {
  const p = POSES[gesture] ?? POSES.explain;

  const isWolf = theme === "werewolf";
  const isDemon = theme === "demon";

  const skin = useMemo(() => {
    if (theme === "werewolf") return "#5a3d22"; // Rich wolf brown fur
    if (theme === "demon") return "#2a0a0a";
    if (theme === "ghost") return "#eef1f7";
    if (theme === "vampire") return "#f2e7de";
    if (theme === "mummy") return "#bda88c";
    if (theme === "egypt") return SKIN_EGYPT;
    if (theme === "mesoamerica" || theme === "albularyo" || theme === "katipunero" || theme === "barong") {
      return SKIN_MESOAMERICA;
    }
    return SKIN_DEFAULT;
  }, [theme]);

  const defaultTunicMap: Record<string, string> = {
    albularyo: "#5c3d28",
    barong: "#f7f1e1",
    katipunero: "#ece5d5",
    modern: "#1e293b",
    witch: "#1b141f",
    vampire: "#181419",
    werewolf: "#4d4438",
    ghost: "#f2f4fa",
    "plague-doctor": "#1e1e24",
    demon: "#3d0f0f",
    gravedigger: "#191619",
    druid: "#4a5a3a",
    executioner: "#1e1b20",
    nun: "#1c1a1e",
    mummy: "#d9cfbe",
    krampus: "#2b1c12",
    roman: "#e8cf9a",
    gladiator: "#b87843",
    egypt: "#f7f2e7",
    greek: "#fcfaf4",
    mesoamerica: "#f2ebdc",
    viking: "#3d5639",
    knight: "#b82d23",
    medieval: "#8a532d",
    ninja: "#1b1b22",
    asian: "#2d4f6c",
    pirate: "#1b263b",
    ottoman: "#184363",
    victorian: "#36312a",
    wwii: "#4a473e",
  };

  const defaultAccentMap: Record<string, string> = {
    albularyo: "#9e2424",
    barong: "#ebe0c5",
    katipunero: "#b81d1d",
    modern: "#38bdf8",
    witch: "#5b2d86",
    vampire: "#8f1212",
    werewolf: "#5a3d22",
    ghost: "#c9d2e4",
    "plague-doctor": "#2d7f8d",
    demon: "#e8641f",
    gravedigger: "#8a8f96",
    druid: "#a6813b",
    executioner: "#5c3a1e",
    nun: "#ece7db",
    mummy: "#b8ab93",
    krampus: "#c9a227",
    roman: "#942626",
    gladiator: "#8e2222",
    egypt: "#e5b32f",
    greek: "#234b7a",
    mesoamerica: "#b83323",
    viking: "#7d5d3b",
    knight: "#dfac26",
    medieval: "#5c381e",
    ninja: "#8a1818",
    asian: "#d4af37",
    pirate: "#8f1d1d",
    ottoman: "#9e1e1e",
    victorian: "#962424",
    wwii: "#782424",
  };

  const primary = tunicColor || defaultTunicMap[theme] || "#e8cf9a";
  const accent = accentColor || defaultAccentMap[theme] || "#942626";

  return (
    <svg
      viewBox="0 0 300 600"
      style={{height: size, width: "auto", overflow: "visible"}}
      aria-label={`Authentic Narrator dressed as ${theme}`}
    >
      {/* Contact Ground Shadow */}
      <ellipse cx="150" cy="576" rx="80" ry="14" fill="rgba(0,0,0,0.38)" />

      {/* ================= LEGS & FOOTWEAR ================= */}
      {theme === "egypt" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <rect x="110" y="555" width="20" height="8" rx="2" fill="#e5b32f" stroke={INK} strokeWidth="3" />
          <rect x="170" y="555" width="20" height="8" rx="2" fill="#e5b32f" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "mesoamerica" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <rect x="114" y="550" width="12" height="22" rx="3" fill="#7a421d" stroke={INK} strokeWidth="3" />
          <rect x="174" y="550" width="12" height="22" rx="3" fill="#7a421d" stroke={INK} strokeWidth="3" />
          <line x1="112" y1="500" x2="126" y2="512" stroke="#7a421d" strokeWidth="4" />
          <line x1="172" y1="500" x2="186" y2="512" stroke="#7a421d" strokeWidth="4" />
        </>
      ) : theme === "ninja" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="114" y1="500" x2="126" y2="500" stroke="#33333d" strokeWidth="4" />
          <line x1="114" y1="520" x2="126" y2="520" stroke="#33333d" strokeWidth="4" />
          <line x1="174" y1="500" x2="186" y2="500" stroke="#33333d" strokeWidth="4" />
          <line x1="174" y1="520" x2="186" y2="520" stroke="#33333d" strokeWidth="4" />
          <path d="M100 560 L128 560 L126 580 L94 580 Z" fill="#18181f" stroke={INK} strokeWidth="4" />
          <path d="M172 560 L200 560 L206 580 L174 580 Z" fill="#18181f" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "asian" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <path d="M100 558 L128 558 L126 580 L94 580 Z" fill="#2b2d38" stroke={INK} strokeWidth="4" />
          <path d="M172 558 L200 558 L206 580 L174 580 Z" fill="#2b2d38" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "viking" || theme === "knight" || theme === "medieval" || theme === "druid" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <path d="M102 555 L130 555 L128 580 L92 580 Z" fill="#4a2e18" stroke={INK} strokeWidth="4" />
          <path d="M170 555 L198 555 L208 580 L172 580 Z" fill="#4a2e18" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "greek" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="112" y1="510" x2="128" y2="520" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="128" y1="525" x2="114" y2="538" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="172" y1="510" x2="188" y2="520" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="188" y1="525" x2="174" y2="538" stroke="#7a4e2a" strokeWidth="4" />
        </>
      ) : theme === "gladiator" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <path d="M168 470 L190 470 L188 555 L168 555 Z" fill="#d49b33" stroke={INK} strokeWidth="4" />
          <line x1="168" y1="495" x2="190" y2="495" stroke="#946513" strokeWidth="3" />
          <line x1="168" y1="525" x2="189" y2="525" stroke="#946513" strokeWidth="3" />
          <line x1="112" y1="490" x2="128" y2="500" stroke="#633e1f" strokeWidth="5" />
          <line x1="128" y1="515" x2="114" y2="525" stroke="#633e1f" strokeWidth="5" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        </>
      ) : theme === "wwii" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <path d="M100 558 L128 558 L126 580 L94 580 Z" fill="#1c1a17" stroke={INK} strokeWidth="4" />
          <path d="M172 558 L200 558 L206 580 L174 580 Z" fill="#1c1a17" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "victorian" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <path d="M98 554 L130 554 L128 580 L92 580 Z" fill="#211e1b" stroke={INK} strokeWidth="4" />
          <path d="M170 554 L202 554 L208 580 L172 580 Z" fill="#211e1b" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "pirate" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <path d="M108 520 L136 520 L134 545 L106 545 Z" fill="#3b2012" stroke={INK} strokeWidth="3" />
          <path d="M164 520 L192 520 L194 545 L166 545 Z" fill="#3b2012" stroke={INK} strokeWidth="3" />
          <path d="M100 556 L130 556 L128 580 L92 580 Z" fill="#23130a" stroke={INK} strokeWidth="4" />
          <path d="M170 556 L200 556 L208 580 L172 580 Z" fill="#23130a" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "ottoman" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <path d="M96 558 L128 558 L124 580 L86 578 Q90 568 96 558 Z" fill="#4a2916" stroke={INK} strokeWidth="4" />
          <path d="M172 558 L204 558 Q210 568 214 578 L176 580 L172 558 Z" fill="#4a2916" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "witch" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="560" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="560" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <line x1="117" y1={430 + i * 32} x2="127" y2={430 + i * 32} stroke="#7a3fa0" strokeWidth="13" />
              <line x1="173" y1={430 + i * 32} x2="183" y2={430 + i * 32} stroke="#7a3fa0" strokeWidth="13" />
            </g>
          ))}
          <path d="M98 548 L132 548 L130 580 L86 580 Q92 562 98 548 Z" fill="#141114" stroke={INK} strokeWidth="4" />
          <path d="M168 548 L202 548 Q208 562 214 580 L170 580 L168 548 Z" fill="#141114" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "vampire" || theme === "executioner" || theme === "demon" || theme === "plague-doctor" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <path d="M100 556 L130 556 L128 580 L92 580 Z" fill="#161316" stroke={INK} strokeWidth="4" />
          <path d="M170 556 L200 556 L208 580 L172 580 Z" fill="#161316" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "werewolf" ? (
        <>
          {/* Shaggy lupine fur legs */}
          <path d="M118 400 Q112 480 116 565 L142 565 Q146 480 140 400 Z" fill="#5a3d22" stroke={INK} strokeWidth="5" />
          <path d="M160 400 Q154 480 158 565 L184 565 Q188 480 182 400 Z" fill="#5a3d22" stroke={INK} strokeWidth="5" />
          <path d="M122 440 L136 448 M160 440 L174 448 M122 500 L136 508 M160 500 L174 508" stroke="#3d2a16" strokeWidth="3" />
          {/* Clawed wolf paws */}
          <path d="M96 556 L140 556 L138 580 L90 580 Z" fill="#3d2a16" stroke={INK} strokeWidth="4" />
          <path d="M160 556 L204 556 L210 580 L162 580 Z" fill="#3d2a16" stroke={INK} strokeWidth="4" />
          <path d="M100 580 L94 590 M118 580 L116 591 M182 580 L184 591 M200 580 L206 590" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : theme === "krampus" ? (
        <>
          <path d="M125 400 Q100 470 118 520 Q130 545 122 565" fill="none" stroke="#2b1c12" strokeWidth="14" strokeLinecap="round" />
          <path d="M175 400 Q200 470 182 520 Q170 545 178 565" fill="none" stroke="#2b1c12" strokeWidth="14" strokeLinecap="round" />
          <path d="M104 556 L140 556 L138 580 L100 580 Z" fill="#0f0b08" stroke={INK} strokeWidth="4" />
          <path d="M160 556 L196 556 L200 580 L162 580 Z" fill="#0f0b08" stroke={INK} strokeWidth="4" />
          <line x1="120" y1="558" x2="120" y2="580" stroke={INK} strokeWidth="3" />
          <line x1="180" y1="558" x2="180" y2="580" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "mummy" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="565" stroke="#d9cfbe" strokeWidth="16" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="565" stroke="#d9cfbe" strokeWidth="16" strokeLinecap="round" />
          <path d="M100 556 L130 556 L128 580 L94 580 Z" fill="#cfc3ad" stroke={INK} strokeWidth="4" />
          <path d="M170 556 L200 556 L206 580 L172 580 Z" fill="#cfc3ad" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "ghost" || theme === "nun" ? (
        <>{/* Robe covers legs */}</>
      ) : theme === "gravedigger" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <path d="M98 554 L130 554 L128 580 L92 580 Z" fill="#1d1a1a" stroke={INK} strokeWidth="4" />
          <path d="M170 554 L202 554 L208 580 L172 580 Z" fill="#1d1a1a" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "modern" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <path d="M96 558 L132 558 L130 580 L92 580 Z" fill="#ffffff" stroke={INK} strokeWidth="4" />
          <path d="M168 558 L204 558 L208 580 L170 580 Z" fill="#ffffff" stroke={INK} strokeWidth="4" />
          <line x1="94" y1="574" x2="132" y2="574" stroke={accent} strokeWidth="3" />
          <line x1="168" y1="574" x2="206" y2="574" stroke={accent} strokeWidth="3" />
        </>
      ) : theme === "barong" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <path d="M98 556 L130 556 L128 580 L92 580 Z" fill="#141416" stroke={INK} strokeWidth="4" />
          <path d="M170 556 L202 556 L208 580 L172 580 Z" fill="#141416" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "katipunero" || theme === "albularyo" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Roman caligae sandals */}
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="114" y1="540" x2="126" y2="540" stroke="#7a4e2a" strokeWidth="5" />
          <line x1="114" y1="552" x2="126" y2="552" stroke="#7a4e2a" strokeWidth="5" />
          <line x1="174" y1="540" x2="186" y2="540" stroke="#7a4e2a" strokeWidth="5" />
          <line x1="174" y1="552" x2="186" y2="552" stroke="#7a4e2a" strokeWidth="5" />
        </>
      )}

      {/* ================= BACK CAPES ================= */}
      {theme === "vampire" && (
        <>
          <path d="M96 175 Q60 120 45 60 Q90 90 110 160 Z" fill="#141114" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M204 175 Q240 120 255 60 Q210 90 190 160 Z" fill="#141114" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M96 175 Q60 120 45 60 Q75 95 100 165 Z" fill="#7a1010" />
          <path d="M204 175 Q240 120 255 60 Q225 95 200 165 Z" fill="#7a1010" />
        </>
      )}

      {theme === "witch" && (
        <>
          <path d="M70 180 Q40 300 55 430 L90 400 Q80 300 92 200 Z" fill="#2a1430" stroke={INK} strokeWidth="4" />
          <path d="M230 180 Q260 300 245 430 L210 400 Q220 300 208 200 Z" fill="#2a1430" stroke={INK} strokeWidth="4" />
        </>
      )}

      {/* ================= BODY / TORSO / OUTFITS ================= */}
      {theme === "egypt" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <rect x="80" y="270" width="140" height="20" rx="4" fill="#e5b32f" stroke={INK} strokeWidth="4" />
          <path d="M130 290 L170 290 L160 375 L140 375 Z" fill="#e5b32f" stroke={INK} strokeWidth="4" />
          <circle cx="150" cy="280" r="6" fill="#1b828f" />
          <path d="M88 165 Q150 240 212 165 Q150 145 88 165 Z" fill="#e5b32f" stroke={INK} strokeWidth="5" />
          <path d="M96 175 Q150 230 204 175" stroke="#187a82" strokeWidth="6" fill="none" />
        </>
      ) : theme === "mesoamerica" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <rect x="76" y="380" width="148" height="26" fill={accent} stroke={INK} strokeWidth="3" />
          <line x1="76" y1="388" x2="224" y2="388" stroke="#1a8c79" strokeWidth="4" />
          <rect x="76" y="278" width="148" height="22" rx="3" fill={accent} stroke={INK} strokeWidth="4" />
          <path d="M102 168 Q150 215 198 168" stroke="#1a8c79" strokeWidth="6" fill="none" />
          <circle cx="150" cy="196" r="7" fill="#1a8c79" stroke={INK} strokeWidth="2.5" />
        </>
      ) : theme === "viking" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M80 160 Q150 135 220 160 Q235 210 215 235 Q150 205 85 235 Q65 210 80 160 Z" fill="#7d5d3b" stroke={INK} strokeWidth="5" />
          <path d="M110 180 L120 195" stroke="#52391e" strokeWidth="3" />
          <path d="M150 170 L150 190" stroke="#52391e" strokeWidth="3" />
          <path d="M185 180 L175 195" stroke="#52391e" strokeWidth="3" />
          <rect x="76" y="285" width="148" height="22" rx="4" fill="#301f13" stroke={INK} strokeWidth="4" />
          <circle cx="150" cy="296" r="10" fill="#9e9e9e" stroke={INK} strokeWidth="3" />
          <rect x="180" y="295" width="28" height="32" rx="6" fill="#4d301b" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "medieval" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M90 160 Q150 145 210 160 Q215 220 150 225 Q85 220 90 160 Z" fill="#5c381e" stroke={INK} strokeWidth="5" />
          <line x1="80" y1="295" x2="220" y2="295" stroke="#d5be8a" strokeWidth="8" strokeLinecap="round" />
          <circle cx="120" cy="325" r="14" fill="#5c381e" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "greek" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M92 168 Q125 210 160 290 L135 290 Q105 220 92 168 Z" fill={accent} stroke={INK} strokeWidth="4" />
          <circle cx="94" cy="172" r="6" fill="#dfb332" stroke={INK} strokeWidth="3" />
          <line x1="84" y1="392" x2="216" y2="392" stroke={accent} strokeWidth="5" />
          <line x1="84" y1="399" x2="216" y2="399" stroke="#dfb332" strokeWidth="3" />
          <line x1="82" y1="288" x2="218" y2="288" stroke="#dfb332" strokeWidth="6" strokeLinecap="round" />
        </>
      ) : theme === "ottoman" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M132 162 L150 240 L168 162 Z" fill="#f5ede0" stroke={INK} strokeWidth="3" />
          <path d="M102 172 Q130 220 148 245" stroke="#d4af37" strokeWidth="5" fill="none" />
          <path d="M198 172 Q170 220 152 245" stroke="#d4af37" strokeWidth="5" fill="none" />
          <rect x="76" y="270" width="148" height="30" rx="3" fill={accent} stroke={INK} strokeWidth="4" />
          <line x1="76" y1="280" x2="224" y2="280" stroke="#d4af37" strokeWidth="3" />
          <line x1="76" y1="290" x2="224" y2="290" stroke="#d4af37" strokeWidth="3" />
        </>
      ) : theme === "victorian" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M130 162 L150 225 L170 162 Z" fill="#dfd8cb" stroke={INK} strokeWidth="3" />
          <path d="M138 178 Q150 205 162 178 Q150 170 138 178 Z" fill={accent} stroke={INK} strokeWidth="3" />
          <path d="M147 195 L143 235 L152 230 L157 235 L153 195 Z" fill={accent} stroke={INK} strokeWidth="2" />
          <line x1="118" y1="172" x2="114" y2="400" stroke="#221e1a" strokeWidth="6" />
          <line x1="182" y1="172" x2="186" y2="400" stroke="#221e1a" strokeWidth="6" />
          <path d="M136 315 Q150 330 162 315" stroke="#c79f38" strokeWidth="3" fill="none" />
        </>
      ) : theme === "wwii" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M130 162 L150 235 L170 162 Z" fill="#e8e2d3" stroke={INK} strokeWidth="3" />
          <path d="M146 195 L154 195 L157 265 L150 275 L143 265 Z" fill={accent} stroke={INK} strokeWidth="2.5" />
          <line x1="104" y1="175" x2="198" y2="340" stroke="#7a6344" strokeWidth="8" strokeLinecap="round" />
          <line x1="104" y1="175" x2="198" y2="340" stroke="#52402a" strokeWidth="2" strokeLinecap="round" />
          <circle cx="150" cy="295" r="3" fill="#2b2923" />
          <circle cx="150" cy="325" r="3" fill="#2b2923" />
        </>
      ) : theme === "demon" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M120 200 L135 260 L122 300 L140 360" stroke={accent} strokeWidth="4" fill="none" />
          <path d="M180 210 L168 270 L182 310 L170 370" stroke={accent} strokeWidth="4" fill="none" />
          <circle cx="135" cy="262" r="3.5" fill="#ffb13d" />
          <circle cx="168" cy="272" r="3.5" fill="#ffb13d" />
          <path d="M100 172 L115 150 L130 170 L145 148 L160 170 L175 148 L190 170 L200 175 Q150 195 100 175 Z" fill="#200808" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </>
      ) : theme === "werewolf" ? (
        <>
          {/* Werewolf: Shredded dark shirt over thick beastly chest fur */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Shaggy fur ruff at neck collar */}
          <path d="M100 175 L115 150 L128 172 L142 148 L155 172 L170 148 L182 172 L196 152 L200 178 Q150 195 100 178 Z" fill="#5a3d22" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          {/* Torn claw slashes revealing fur */}
          <polygon points="115,220 175,250 125,280" fill="#5a3d22" stroke={INK} strokeWidth="3" />
          <polygon points="185,295 130,330 175,360" fill="#5a3d22" stroke={INK} strokeWidth="3" />
          <polygon points="110,345 155,365 120,395" fill="#5a3d22" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "gravedigger" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L232 415 Q150 435 68 415 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M132 175 L168 175 L162 340 L150 360 L138 340 Z" fill="#e8e4da" stroke={INK} strokeWidth="3" />
          <path d="M142 180 L158 180 L154 230 L150 245 L146 230 Z" fill="#2c2626" stroke={INK} strokeWidth="3" />
          <circle cx="112" cy="260" r="4" fill={accent} />
          <circle cx="112" cy="300" r="4" fill={accent} />
          <circle cx="188" cy="260" r="4" fill={accent} />
          <circle cx="188" cy="300" r="4" fill={accent} />
          <rect x="196" y="230" width="26" height="14" rx="3" fill="#0c0a0c" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "druid" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M84 290 Q150 305 216 290" stroke={accent} strokeWidth="8" fill="none" />
          <path d="M140 296 L138 330 M160 296 L162 330" stroke={accent} strokeWidth="5" />
          <ellipse cx="115" cy="220" rx="10" ry="5" fill="#6e8c3f" stroke={INK} strokeWidth="2" transform="rotate(-30 115 220)" />
          <ellipse cx="130" cy="235" rx="10" ry="5" fill="#7fa04c" stroke={INK} strokeWidth="2" transform="rotate(20 130 235)" />
          <ellipse cx="185" cy="220" rx="10" ry="5" fill="#6e8c3f" stroke={INK} strokeWidth="2" transform="rotate(30 185 220)" />
          <circle cx="150" cy="260" r="5" fill="#a83232" stroke={INK} strokeWidth="2" />
          <circle cx="162" cy="266" r="5" fill="#a83232" stroke={INK} strokeWidth="2" />
        </>
      ) : theme === "executioner" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M108 168 L196 330 L182 342 L94 180 Z" fill={accent} stroke={INK} strokeWidth="4" />
          <rect x="80" y="290" width="140" height="20" rx="4" fill="#3a2a18" stroke={INK} strokeWidth="4" />
          <rect x="140" y="286" width="20" height="28" rx="3" fill="#8a8f96" stroke={INK} strokeWidth="3" />
          <path d="M92 175 Q70 220 78 280 Q95 250 100 200 Z" fill="#141216" stroke={INK} strokeWidth="4" />
          <path d="M208 175 Q230 220 222 280 Q205 250 200 200 Z" fill="#141216" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "nun" ? (
        <>
          <path d="M88 170 Q150 148 212 170 Q226 360 220 572 L80 572 Q74 360 88 170 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M118 170 Q150 195 182 170 L176 200 Q150 218 124 200 Z" fill={accent} stroke={INK} strokeWidth="4" />
          <line x1="150" y1="280" x2="150" y2="330" stroke="#6e4a26" strokeWidth="8" strokeLinecap="round" />
          <line x1="132" y1="300" x2="168" y2="300" stroke="#6e4a26" strokeWidth="8" strokeLinecap="round" />
          <circle cx="130" cy="248" r="4" fill="#3a332a" stroke={INK} strokeWidth="2" />
          <circle cx="150" cy="253" r="4" fill="#3a332a" stroke={INK} strokeWidth="2" />
          <circle cx="170" cy="248" r="4" fill="#3a332a" stroke={INK} strokeWidth="2" />
        </>
      ) : theme === "mummy" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M92 210 L208 230 M88 260 L212 245 M90 310 L210 330 M95 360 L205 350" stroke={accent} strokeWidth="4" fill="none" />
          <path d="M190 340 Q200 380 192 420 L178 418 Q186 380 178 342 Z" fill="#cfc3ad" stroke={INK} strokeWidth="3" />
          <path d="M135 240 L165 245 L160 290 L140 288 Z" fill="#3a332a" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "krampus" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse key={i} cx={95 + i * 22} cy={285 + (i % 2) * 6} rx="11" ry="8" fill="none" stroke="#6e6e78" strokeWidth="5" />
          ))}
          <circle cx="150" cy="310" r="12" fill={accent} stroke={INK} strokeWidth="4" />
          <line x1="150" y1="318" x2="150" y2="326" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "ninja" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M104 175 L168 285" stroke="#333340" strokeWidth="5" />
          <path d="M196 175 L132 285" stroke="#333340" strokeWidth="5" />
          <rect x="76" y="275" width="148" height="24" rx="3" fill={accent} stroke={INK} strokeWidth="4" />
          <path d="M165 299 L175 365 L160 365 L152 299 Z" fill={accent} stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "asian" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M150 162 L105 270 L140 270 Z" fill={accent} stroke={INK} strokeWidth="3" />
          <line x1="150" y1="162" x2="105" y2="270" stroke={INK} strokeWidth="4" />
          <rect x="76" y="270" width="148" height="24" rx="3" fill={accent} stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "knight" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <line x1="150" y1="180" x2="150" y2="390" stroke="#f0ebe1" strokeWidth="18" strokeLinecap="square" />
          <line x1="110" y1="260" x2="190" y2="260" stroke="#f0ebe1" strokeWidth="18" strokeLinecap="square" />
          <line x1="150" y1="180" x2="150" y2="390" stroke={accent} strokeWidth="12" strokeLinecap="square" />
          <line x1="110" y1="260" x2="190" y2="260" stroke={accent} strokeWidth="12" strokeLinecap="square" />
          <rect x="76" y="280" width="148" height="22" rx="4" fill="#302013" stroke={INK} strokeWidth="4" />
          <rect x="138" y="276" width="24" height="30" rx="3" fill="#dfac26" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "plague-doctor" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L232 415 Q150 435 68 415 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <line x1="150" y1="175" x2="150" y2="415" stroke={INK} strokeWidth="4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx="150" cy={200 + i * 40} r="4" fill="#a89a80" stroke={INK} strokeWidth="2" />
          ))}
          <path d="M90 168 Q150 205 210 168 L218 240 Q150 270 82 240 Z" fill="#2d2d38" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </>
      ) : theme === "gladiator" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M96 168 L204 290 L180 300 L96 190 Z" fill="#3b2010" stroke={INK} strokeWidth="4" />
          <circle cx="150" cy="227" r="14" fill="#d49b33" stroke={INK} strokeWidth="3.5" />
          <circle cx="150" cy="227" r="6" fill={accent} />
        </>
      ) : theme === "pirate" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M130 162 L150 250 L170 162 Z" fill="#f4ede1" stroke={INK} strokeWidth="3" />
          <rect x="76" y="275" width="148" height="28" rx="3" fill={accent} stroke={INK} strokeWidth="4" />
          <rect x="136" y="271" width="28" height="36" rx="4" fill="#d4af37" stroke={INK} strokeWidth="3.5" />
        </>
      ) : theme === "witch" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L222 380 L205 395 L190 378 L172 396 L155 380 L138 396 L120 380 L105 394 L88 378 L72 392 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M118 200 L182 200 L176 320 L124 320 Z" fill={accent} stroke={INK} strokeWidth="4" />
          <path d="M150 340 A14 14 0 1 0 150 368 A11 11 0 1 1 150 340" fill="#e8d44d" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "vampire" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M150 175 L120 175 L142 300 L150 320 L158 300 L180 175 L150 175 Z" fill="#0c0a0d" stroke={INK} strokeWidth="3" />
          <path d="M138 175 L162 175 L158 320 L150 340 L142 320 Z" fill={accent} stroke={INK} strokeWidth="3" />
          <ellipse cx="150" cy="200" rx="14" ry="18" fill="#5c0c0c" stroke={INK} strokeWidth="3" />
          <circle cx="150" cy="330" r="10" fill="#c9a227" stroke={INK} strokeWidth="3" />
          <circle cx="150" cy="330" r="4" fill="#7a1010" />
        </>
      ) : theme === "ghost" ? (
        <>
          <path d="M80 175 Q150 145 220 175 Q238 350 232 555 Q210 572 190 556 Q172 572 150 558 Q128 572 108 557 Q88 572 68 556 Q62 350 80 175 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M120 220 Q112 350 118 520" stroke={accent} strokeWidth="4" fill="none" />
          <path d="M180 220 Q188 350 182 520" stroke={accent} strokeWidth="4" fill="none" />
        </>
      ) : theme === "albularyo" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M92 168 L130 168 L145 410 L108 410 Z" fill={accent} stroke={INK} strokeWidth="3.5" />
          <line x1="110" y1="170" x2="126" y2="408" stroke="#e5b32f" strokeWidth="3" strokeDasharray="8 6" />
          <rect x="76" y="282" width="148" height="22" rx="4" fill="#3a2414" stroke={INK} strokeWidth="4" />
          <ellipse cx="182" cy="312" rx="18" ry="22" fill="#4e6b36" stroke={INK} strokeWidth="3.5" />
          <circle cx="182" cy="296" r="5" fill="#c9a227" stroke={INK} strokeWidth="2" />
          <path d="M118 168 Q150 235 182 168" stroke="#1f1610" strokeWidth="4" fill="none" />
          <polygon points="150,208 130,244 170,244" fill="#e5b32f" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="150" cy="232" r="5" fill={accent} stroke={INK} strokeWidth="2" />
        </>
      ) : theme === "barong" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <rect x="116" y="170" width="68" height="175" rx="6" fill={accent} stroke="#c2b28f" strokeWidth="3" />
          <line x1="150" y1="170" x2="150" y2="345" stroke={INK} strokeWidth="3" />
          <path d="M126 190 Q138 205 126 220 Q138 235 126 250" stroke="#b59d6b" strokeWidth="2.5" fill="none" />
          <path d="M174 190 Q162 205 174 220 Q162 235 174 250" stroke="#b59d6b" strokeWidth="2.5" fill="none" />
          <circle cx="150" cy="200" r="3.5" fill={INK} />
          <circle cx="150" cy="230" r="3.5" fill={INK} />
          <circle cx="150" cy="260" r="3.5" fill={INK} />
        </>
      ) : theme === "katipunero" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M104 165 Q150 220 196 165 Q182 205 150 228 Q118 205 104 165 Z" fill={accent} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M142 212 L132 275 L150 265 L168 275 L158 212 Z" fill={accent} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="76" y="286" width="148" height="22" rx="4" fill="#3b2313" stroke={INK} strokeWidth="4" />
          <rect x="138" y="282" width="24" height="30" rx="3" fill="#d4af37" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "modern" ? (
        <>
          {/* Urban Streetwear Hoodie */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M126 168 L120 408 M174 168 L180 408" stroke={accent} strokeWidth="5" />
          <line x1="138" y1="185" x2="136" y2="245" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
          <line x1="162" y1="185" x2="164" y2="245" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
          <rect x="102" y="310" width="96" height="55" rx="12" fill={accent} stroke={INK} strokeWidth="3.5" />
        </>
      ) : (
        <>
          {/* Classic Imperial Roman Toga */}
          <path d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z" fill={primary} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M125 168 L120 405" stroke={accent} strokeWidth="8" />
          <path d="M175 168 L180 405" stroke={accent} strokeWidth="8" />
          <rect x="80" y="290" width="140" height="18" rx="4" fill="#6e3d1b" stroke={INK} strokeWidth="4" />
          <rect x="140" y="286" width="20" height="26" rx="3" fill="#d4af37" stroke={INK} strokeWidth="3" />
        </>
      )}

      {/* ================= ARMS & HANDS (Full limbs + articulated fingers + claws) ================= */}
      <line x1="102" y1="190" x2={p.lElbow[0]} y2={p.lElbow[1]} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1={p.lElbow[0]} y1={p.lElbow[1]} x2={p.lHand[0]} y2={p.lHand[1]} stroke={INK} strokeWidth="8" strokeLinecap="round" />

      <line x1="198" y1="190" x2={p.rElbow[0]} y2={p.rElbow[1]} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1={p.rElbow[0]} y1={p.rElbow[1]} x2={p.rHand[0]} y2={p.rHand[1]} stroke={INK} strokeWidth="8" strokeLinecap="round" />

      <Hand
        x={p.lHand[0]}
        y={p.lHand[1]}
        fromX={p.lElbow[0]}
        fromY={p.lElbow[1]}
        side="left"
        variant="open"
        skin={skin}
        isWolf={isWolf}
      />
      <Hand
        x={p.rHand[0]}
        y={p.rHand[1]}
        fromX={p.rElbow[0]}
        fromY={p.rElbow[1]}
        side="right"
        variant={gesture === "point" ? "point" : "open"}
        skin={skin}
        isWolf={isWolf}
      />

      {/* ================= HEAD & HAIR & ACCESSORIES ================= */}
      <g style={{transformOrigin: "150px 92px"}}>
        {/* Head Base */}
        <circle cx="150" cy="92" r="64" fill={skin} stroke={INK} strokeWidth="6" />

        {/* Headwear per Theme */}
        {theme === "egypt" ? (
          <>
            <path d="M86 90 Q80 20 150 20 Q220 20 214 90 Q215 50 150 40 Q85 50 86 90 Z" fill="#1d4370" stroke={INK} strokeWidth="5" />
            <path d="M84 90 L75 220 L96 215 L100 135 Z" fill="#1d4370" stroke={INK} strokeWidth="4" />
            <path d="M216 90 L225 220 L204 215 L200 135 Z" fill="#1d4370" stroke={INK} strokeWidth="4" />
            <circle cx="150" cy="38" r="9" fill="#e5b32f" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "mesoamerica" ? (
          <>
            <path d="M90 60 L60 -30 L80 -25 L100 50 Z" fill="#1a8c79" stroke={INK} strokeWidth="3.5" />
            <path d="M120 45 L110 -55 L130 -50 L135 45 Z" fill="#2eb8a1" stroke={INK} strokeWidth="3.5" />
            <path d="M150 40 L150 -65 L165 -60 L160 40 Z" fill="#e5a823" stroke={INK} strokeWidth="3.5" />
            <path d="M180 45 L190 -55 L170 -50 L165 45 Z" fill="#2eb8a1" stroke={INK} strokeWidth="3.5" />
            <path d="M210 60 L240 -30 L220 -25 L200 50 Z" fill="#1a8c79" stroke={INK} strokeWidth="3.5" />
            <rect x="85" y="48" width="130" height="24" rx="4" fill="#dfad28" stroke={INK} strokeWidth="4" />
            <circle cx="150" cy="60" r="7" fill="#b83323" stroke={INK} strokeWidth="2.5" />
          </>
        ) : theme === "viking" ? (
          <>
            <path d="M84 62 Q150 46 216 62 L214 78 Q150 62 86 78 Z" fill="#4d301b" stroke={INK} strokeWidth="4" />
            <circle cx="100" cy="70" r="4" fill="#a8a8a8" />
            <circle cx="150" cy="64" r="4" fill="#a8a8a8" />
            <circle cx="200" cy="70" r="4" fill="#a8a8a8" />
            <path d="M86 85 Q88 25 150 25 Q212 25 214 85 Q185 55 150 58 Q115 55 86 85 Z" fill="#c97d32" stroke={INK} strokeWidth="4" />
          </>
        ) : theme === "medieval" ? (
          <>
            <circle cx="150" cy="92" r="76" fill="#5c381e" stroke={INK} strokeWidth="5" />
            <circle cx="150" cy="92" r="62" fill={skin} stroke={INK} strokeWidth="5" />
            <path d="M82 120 Q66 170 76 220 Q92 185 96 140 Z" fill="#5c381e" stroke={INK} strokeWidth="4" />
            <path d="M218 120 Q234 170 224 220 Q208 185 204 140 Z" fill="#5c381e" stroke={INK} strokeWidth="4" />
          </>
        ) : theme === "greek" ? (
          <>
            <path d="M92 78 Q150 40 208 78" stroke="#254d1f" strokeWidth="4" fill="none" />
            <ellipse cx="104" cy="65" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(-35 104 65)" />
            <ellipse cx="120" cy="54" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(-20 120 54)" />
            <ellipse cx="140" cy="48" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(-5 140 48)" />
            <ellipse cx="160" cy="48" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(5 160 48)" />
            <ellipse cx="180" cy="54" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(20 180 54)" />
            <ellipse cx="196" cy="65" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(35 196 65)" />
            <circle cx="112" cy="60" r="3.5" fill="#dfb332" />
            <circle cx="150" cy="46" r="3.5" fill="#dfb332" />
            <circle cx="188" cy="60" r="3.5" fill="#dfb332" />
          </>
        ) : theme === "ottoman" ? (
          <>
            <path d="M110 58 L122 0 L178 0 L190 58 Z" fill="#9e1a1a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <ellipse cx="150" cy="56" rx="40" ry="8" fill="#801414" stroke={INK} strokeWidth="4" />
            <circle cx="150" cy="2" r="3.5" fill="#141414" />
            <path d="M150 2 Q182 15 186 50" stroke="#141414" strokeWidth="3.5" fill="none" />
            <ellipse cx="186" cy="52" rx="4" ry="7" fill="#141414" />
          </>
        ) : theme === "victorian" ? (
          <>
            <path d="M84 72 Q86 16 150 14 Q214 16 216 72 Q150 50 84 72 Z" fill="#332f2a" stroke={INK} strokeWidth="5" />
            <path d="M98 70 Q150 58 202 70 Q150 78 98 70 Z" fill="#24211d" stroke={INK} strokeWidth="3.5" />
            <circle cx="150" cy="18" r="3.5" fill="#1c1916" />
          </>
        ) : theme === "wwii" ? (
          <>
            <path d="M82 72 Q85 18 150 16 Q215 18 218 72 Q150 52 82 72 Z" fill="#4a473e" stroke={INK} strokeWidth="5" />
            <path d="M90 68 Q150 48 210 68 L218 74 Q150 56 82 74 Z" fill="#36332a" stroke={INK} strokeWidth="3" />
            <path d="M102 70 Q150 60 198 70 Q150 78 102 70 Z" fill="#36332a" stroke={INK} strokeWidth="3" />
            <circle cx="150" cy="20" r="3.5" fill="#2b2923" />
          </>
        ) : theme === "demon" ? (
          <>
            <path d="M112 38 Q92 10 96 -18 Q116 2 126 30 Z" fill="#7a1a1a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M188 38 Q208 10 204 -18 Q184 2 174 30 Z" fill="#7a1a1a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M88 85 Q90 25 150 24 Q210 25 212 85 Q185 58 150 60 Q115 58 88 85 Z" fill="#3d0f0f" stroke={INK} strokeWidth="5" />
            <path d="M150 24 Q155 40 150 55" stroke="#e8641f" strokeWidth="3" />
          </>
        ) : theme === "werewolf" ? (
          <>
            {/* Werewolf: Pointed wolf ears */}
            <path d="M96 40 L72 -18 L128 16 Z" fill="#5a3d22" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M204 40 L228 -18 L172 16 Z" fill="#5a3d22" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M98 28 L84 -6 L116 18 Z" fill="#8a6a42" />
            <path d="M202 28 L216 -6 L184 18 Z" fill="#8a6a42" />
            {/* Shaggy lupine fur framing cheeks and chin */}
            <path d="M84 75 L56 95 L74 110 L54 128 L78 142 L88 120 Z" fill="#5a3d22" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M216 75 L244 95 L226 110 L246 128 L222 142 L212 120 Z" fill="#5a3d22" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            {/* Wild fur crest on head */}
            <path d="M88 80 Q90 18 150 16 Q210 18 212 80 Q180 48 150 50 Q120 48 88 80 Z" fill="#3f2713" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            {/* Muzzle lighter fur patch */}
            <ellipse cx="150" cy="112" rx="26" ry="18" fill="#7a5430" stroke={INK} strokeWidth="2.5" />
          </>
        ) : theme === "gravedigger" ? (
          <>
            <ellipse cx="150" cy="58" rx="82" ry="14" fill="#141114" stroke={INK} strokeWidth="5" />
            <path d="M112 56 L114 -6 Q150 -14 186 -6 L188 56 Q150 44 112 56 Z" fill="#1d1a1c" stroke={INK} strokeWidth="5" />
            <path d="M112 40 Q150 52 188 40 L188 56 Q150 68 112 56 Z" fill="#0c0a0c" stroke={INK} strokeWidth="3" />
            <rect x="112" y="30" width="76" height="10" fill="#3a3640" />
          </>
        ) : theme === "druid" ? (
          <>
            <circle cx="150" cy="92" r="78" fill="#5c4526" stroke={INK} strokeWidth="5" />
            <circle cx="150" cy="92" r="62" fill={skin} stroke={INK} strokeWidth="5" />
            <ellipse cx="100" cy="40" rx="12" ry="6" fill="#6e8c3f" stroke={INK} strokeWidth="2.5" transform="rotate(-30 100 40)" />
            <ellipse cx="200" cy="40" rx="12" ry="6" fill="#7fa04c" stroke={INK} strokeWidth="2.5" transform="rotate(30 200 40)" />
            <ellipse cx="150" cy="18" rx="12" ry="6" fill="#6e8c3f" stroke={INK} strokeWidth="2.5" />
            <path d="M84 120 Q66 170 74 220 Q92 190 96 140 Z" fill="#4a3820" stroke={INK} strokeWidth="4" />
            <path d="M216 120 Q234 170 226 220 Q208 190 204 140 Z" fill="#4a3820" stroke={INK} strokeWidth="4" />
          </>
        ) : theme === "executioner" ? (
          <>
            <circle cx="150" cy="92" r="68" fill="#141216" stroke={INK} strokeWidth="6" />
            <path d="M88 110 Q70 160 78 210 Q95 180 100 130 Z" fill="#141216" stroke={INK} strokeWidth="4" />
            <path d="M212 110 Q230 160 222 210 Q205 180 200 130 Z" fill="#141216" stroke={INK} strokeWidth="4" />
            <path d="M150 24 L150 44 M110 34 Q120 40 132 42 M190 34 Q180 40 168 42" stroke="#3a3640" strokeWidth="3" />
          </>
        ) : theme === "nun" ? (
          <>
            <circle cx="150" cy="92" r="78" fill="#1c1a1e" stroke={INK} strokeWidth="5" />
            <circle cx="150" cy="92" r="68" fill="#ece7db" stroke={INK} strokeWidth="4" />
            <circle cx="150" cy="92" r="60" fill={skin} stroke={INK} strokeWidth="5" />
            <path d="M82 115 Q64 165 72 215 Q90 185 94 135 Z" fill="#1c1a1e" stroke={INK} strokeWidth="4" />
            <path d="M218 115 Q236 165 228 215 Q210 185 206 135 Z" fill="#1c1a1e" stroke={INK} strokeWidth="4" />
          </>
        ) : theme === "mummy" ? (
          <>
            <path d="M92 30 L208 30 L206 58 L94 58 Z" fill="#d9cfbe" stroke={INK} strokeWidth="4" transform="rotate(-4 150 44)" />
            <path d="M86 105 L116 100 L112 140 L84 145 Z" fill="#cfc3ad" stroke={INK} strokeWidth="3" />
            <path d="M214 105 L184 100 L188 140 L216 145 Z" fill="#cfc3ad" stroke={INK} strokeWidth="3" />
            <path d="M120 148 L180 148 L178 162 L122 162 Z" fill="#d9cfbe" stroke={INK} strokeWidth="3" />
            <path d="M205 45 Q230 60 235 90 L222 92 Q216 68 196 58 Z" fill="#cfc3ad" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "krampus" ? (
          <>
            <path d="M108 40 Q70 -20 55 -55 Q95 -30 118 25 Z" fill="#cfc3ad" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M192 40 Q230 -20 245 -55 Q205 -30 182 25 Z" fill="#cfc3ad" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M95 -10 Q85 -25 80 -38 M205 -10 Q215 -25 220 -38" stroke="#a89a80" strokeWidth="3" />
            <path d="M88 80 Q90 25 150 24 Q210 25 212 80 Q180 55 150 58 Q120 55 88 80 Z" fill="#2b1c12" stroke={INK} strokeWidth="5" />
          </>
        ) : theme === "asian" ? (
          <>
            <path d="M60 70 L150 0 L240 70 Z" fill="#d9b677" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <line x1="75" y1="58" x2="225" y2="58" stroke="#a6813b" strokeWidth="3" />
            <path d="M105 68 Q150 145 195 68" stroke="#a82323" strokeWidth="3.5" fill="none" />
          </>
        ) : theme === "ninja" ? (
          <>
            <path d="M86 90 Q80 20 150 20 Q220 20 214 90 Q225 155 150 162 Q75 155 86 90 Z" fill="#1b1b22" stroke={INK} strokeWidth="5" />
            <ellipse cx="150" cy="88" rx="46" ry="16" fill={skin} stroke={INK} strokeWidth="4" />
            <line x1="84" y1="68" x2="216" y2="68" stroke="#8a1818" strokeWidth="6" />
          </>
        ) : theme === "knight" ? (
          <>
            <path d="M86 92 Q80 20 150 20 Q220 20 214 92 Q225 160 150 170 Q75 160 86 92 Z" fill="#858a91" stroke={INK} strokeWidth="5" />
            <ellipse cx="150" cy="100" rx="46" ry="48" fill={skin} stroke={INK} strokeWidth="5" />
          </>
        ) : theme === "plague-doctor" ? (
          <>
            <ellipse cx="150" cy="45" rx="95" ry="18" fill="#141418" stroke={INK} strokeWidth="5" />
            <path d="M100 45 L115 0 L185 0 L200 45 Z" fill="#1c1c21" stroke={INK} strokeWidth="5" />
            <circle cx="126" cy="88" r="16" fill="#111113" stroke="#876527" strokeWidth="5" />
            <circle cx="174" cy="88" r="16" fill="#111113" stroke="#876527" strokeWidth="5" />
            <circle cx="123" cy="84" r="4" fill="#ffffff" />
            <circle cx="171" cy="84" r="4" fill="#ffffff" />
            <path d="M136 98 Q150 96 164 98 L160 160 Q150 185 142 185 L140 160 Z" fill="#d9cfbe" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          </>
        ) : theme === "pirate" ? (
          <>
            <path d="M72 74 Q150 10 228 74 Q210 20 150 20 Q90 20 72 74 Z" fill="#1a1c22" stroke={INK} strokeWidth="5" />
            <circle cx="150" cy="46" r="6" fill="#dfaf37" />
            <ellipse cx="174" cy="88" rx="14" ry="14" fill="#111113" stroke={INK} strokeWidth="3" />
            <line x1="156" y1="74" x2="192" y2="102" stroke={INK} strokeWidth="3.5" />
          </>
        ) : theme === "gladiator" ? (
          <>
            <path d="M84 90 Q80 15 150 15 Q220 15 216 90 Z" fill="#a87d32" stroke={INK} strokeWidth="5" />
            <path d="M142 15 Q145 -35 150 -45 Q155 -35 158 15 Z" fill="#b82323" stroke={INK} strokeWidth="4" />
            <line x1="140" y1="40" x2="160" y2="40" stroke="#7a5418" strokeWidth="5" />
          </>
        ) : theme === "witch" ? (
          <>
            <ellipse cx="150" cy="62" rx="92" ry="16" fill="#18131c" stroke={INK} strokeWidth="5" />
            <path d="M106 58 L142 -30 Q150 -40 158 -30 L194 58 Z" fill="#241b2b" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <rect x="110" y="44" width="80" height="12" fill={accent} stroke={INK} strokeWidth="2.5" />
            <rect x="142" y="40" width="16" height="20" rx="3" fill="#dfb332" stroke={INK} strokeWidth="2" />
          </>
        ) : theme === "vampire" ? (
          <>
            <path d="M86 92 Q82 28 150 26 Q218 28 214 92 Q200 60 186 52 Q172 44 160 58 Q150 70 140 58 Q128 44 114 52 Q100 60 86 92 Z" fill="#100d12" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M90 85 L98 125 L88 120 Z" fill="#100d12" stroke={INK} strokeWidth="3" />
            <path d="M210 85 L202 125 L212 120 Z" fill="#100d12" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "ghost" ? (
          <>
            <circle cx="150" cy="92" r="80" fill="#f2f4fa" stroke={INK} strokeWidth="5" />
            <circle cx="150" cy="92" r="62" fill={skin} stroke={INK} strokeWidth="5" />
            <path d="M90 130 Q110 165 130 140 Q150 170 170 140 Q190 165 210 130 L210 155 Q190 185 170 158 Q150 190 130 158 Q110 185 90 155 Z" fill="#f2f4fa" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          </>
        ) : theme === "albularyo" ? (
          <>
            <path d="M86 82 Q88 22 150 20 Q212 22 214 82 Q185 52 150 54 Q115 52 86 82 Z" fill="#1c1613" stroke={INK} strokeWidth="5" />
            <path d="M84 68 Q150 48 216 68 L214 50 Q150 30 86 50 Z" fill={accent} stroke={INK} strokeWidth="4" />
            <line x1="86" y1="59" x2="214" y2="59" stroke="#e5b32f" strokeWidth="3" strokeDasharray="6 5" />
            <path d="M212 58 L236 72 L228 84 L208 66 Z" fill={accent} stroke={INK} strokeWidth="3.5" />
          </>
        ) : theme === "katipunero" ? (
          <>
            <path d="M58 68 Q150 -8 242 68 Z" fill="#c9a565" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M85 48 Q150 20 215 48" stroke="#96743b" strokeWidth="3" fill="none" />
            <circle cx="150" cy="14" r="7" fill="#d4af37" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "barong" || theme === "modern" ? (
          <>
            <path d="M86 80 Q85 18 150 16 Q215 18 214 80 Q192 46 155 48 Q112 46 86 80 Z" fill="#181512" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M115 32 Q150 22 185 34" stroke="#36302a" strokeWidth="3" fill="none" />
          </>
        ) : (
          <>
            {/* Roman Laurel Wreath (Exclusive to Roman) */}
            <path d="M92 78 Q150 40 208 78" stroke="#386b2d" strokeWidth="4" fill="none" />
            <ellipse cx="106" cy="68" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(-30 106 68)" />
            <ellipse cx="122" cy="58" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(-15 122 58)" />
            <ellipse cx="140" cy="52" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(-5 140 52)" />
            <ellipse cx="160" cy="52" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(5 160 52)" />
            <ellipse cx="178" cy="58" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(15 178 58)" />
            <ellipse cx="194" cy="68" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(30 194 68)" />
          </>
        )}

        {/* ================= FACE DETAILS ================= */}
        {theme !== "plague-doctor" && (
          <>
            {/* Brows */}
            <Brows isWolf={isWolf} />

            {/* Nose per Theme (Canine wolf snout vs cute cartoon nose) */}
            {isWolf ? (
              <>
                <polygon points="144,103 156,103 150,111" fill="#181512" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
                <circle cx="138" cy="111" r="1.5" fill="#181512" />
                <circle cx="141" cy="113" r="1.5" fill="#181512" />
                <circle cx="159" cy="113" r="1.5" fill="#181512" />
                <circle cx="162" cy="111" r="1.5" fill="#181512" />
              </>
            ) : (
              <path d="M148 94 Q153 100 148 104" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            )}

            {/* Rosy Blushing Cheeks (NOT on demon, ghost, or werewolf) */}
            {!isDemon && theme !== "ghost" && !isWolf && (
              <>
                <ellipse cx="114" cy="108" rx="8" ry="4" fill="#e89e82" opacity="0.45" />
                <ellipse cx="186" cy="108" rx="8" ry="4" fill="#e89e82" opacity="0.45" />
              </>
            )}

            {/* Eyes (Predatory amber slit eyes for werewolf, fiery red for demon, cute cartoon for others) */}
            {[128, 172].map((cx) => (
              <g key={cx}>
                <ellipse
                  cx={cx}
                  cy={88}
                  rx={8.5}
                  ry={9.5}
                  fill={isDemon ? "#ff3322" : isWolf ? "#f59e0b" : "#ffffff"}
                  stroke={isWolf ? "#78350f" : INK}
                  strokeWidth={2.5}
                />
                {isWolf ? (
                  <ellipse cx={cx} cy={88} rx={2.2} ry={6.5} fill="#181512" />
                ) : (
                  <circle cx={cx} cy={88} r={3.8} fill={isDemon ? "#ffe044" : INK} />
                )}
                <circle cx={cx + 1.5} cy={86.5} r={1.2} fill="#ffffff" />
              </g>
            ))}

            {/* Mouth (Fierce snarling wolf jaws with white fangs vs friendly cartoon smile) */}
            {isWolf ? (
              <>
                {/* Snarling wolf maw */}
                <path d="M132 116 Q150 134 168 116 Q150 121 132 116 Z" fill="#3f0f0f" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
                {/* Upper fangs */}
                <polygon points="135,116 142,116 138,127" fill="#ffffff" stroke={INK} strokeWidth="1.5" />
                <polygon points="158,116 165,116 162,127" fill="#ffffff" stroke={INK} strokeWidth="1.5" />
                {/* Lower fangs */}
                <polygon points="144,126 148,126 146,120" fill="#ffffff" stroke={INK} strokeWidth="1" />
                <polygon points="152,126 156,126 154,120" fill="#ffffff" stroke={INK} strokeWidth="1" />
              </>
            ) : !talking ? (
              <path
                d="M134 118 Q150 130 166 118"
                stroke={INK}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
            ) : (
              <ellipse
                cx="150"
                cy="124"
                rx={11}
                ry={12}
                fill="#2b0d0d"
                stroke={INK}
                strokeWidth={4}
              />
            )}
          </>
        )}
      </g>
    </svg>
  );
}
