import React from "react";
import {interpolate} from "remotion";
import {CharacterTheme} from "./Narrator";
import {WalkCycleOptions, solveTwoBoneIK, lerp, easeInOutQuad, Vec} from "./kinematics";

const SKIN = "#f2dcb0";
const SKIN_EGYPT = "#e5b780";
const SKIN_MESOAMERICA = "#c68d58";
const INK = "#111";

export interface NarratorSideviewProps {
  theme?: CharacterTheme;
  tunic?: string;
  height?: number;
  frame: number;
  mouthOpen?: number;
  walking?: boolean;
  walkOptions?: WalkCycleOptions;
}

/**
 * Calculates smooth vertical hip drop for the 4 keyframes in Richard Williams walk cycle:
 * Contact (0px) -> Down (+5px) -> Passing (-2px) -> Up (-5px) -> Contact (0px)
 */
function getWalkHipDrop(u: number, amplitude: number = 5): number {
  if (u < 0.25) {
    const t = u / 0.25;
    return lerp(0, amplitude, easeInOutQuad(t));
  } else if (u < 0.5) {
    const t = (u - 0.25) / 0.25;
    return lerp(amplitude, -2, easeInOutQuad(t));
  } else if (u < 0.75) {
    const t = (u - 0.5) / 0.25;
    return lerp(-2, -amplitude, easeInOutQuad(t));
  } else {
    const t = (u - 0.75) / 0.25;
    return lerp(-amplitude, 0, easeInOutQuad(t));
  }
}

export const NarratorSideview: React.FC<NarratorSideviewProps> = ({
  theme = "roman",
  tunic,
  height = 760,
  frame,
  mouthOpen = 0,
  walkOptions,
}) => {
  const cadence = walkOptions?.cadence ?? 24;
  const stride = walkOptions?.stride ?? 24;
  const stepHeight = walkOptions?.stepHeight ?? 24;
  const facing = walkOptions?.facing ?? "right";
  const hipDropAmp = walkOptions?.hipDropAmplitude ?? 5;

  // Normalized walk cycle progress
  const halfCadence = cadence / 2;
  const cycleFrame = frame % cadence;
  const stepIndex = Math.floor(cycleFrame / halfCadence); // 0 = first step, 1 = second step
  const u = (cycleFrame % halfCadence) / halfCadence; // 0..1 through current step
  const cyclePhase = (cycleFrame / cadence) * Math.PI * 2;

  // Vertical body cushion & bounce
  const hipDrop = getWalkHipDrop(u, hipDropAmp);
  const headBob = hipDrop * 0.85;

  // Eye blink cycle
  const blinkT = frame % 107;
  const eyeScaleY = interpolate(blinkT, [0, 4, 8], [1, 0.1, 1], {
    extrapolateRight: "clamp",
  });

  // Theme skin color
  const skin =
    theme === "egypt"
      ? SKIN_EGYPT
      : theme === "mesoamerica"
      ? SKIN_MESOAMERICA
      : theme === "ghost"
      ? "#eef1f7"
      : theme === "vampire"
      ? "#f2e7de"
      : SKIN;

  // Theme costume palettes
  const tunicColor =
    tunic ??
    (theme === "wwii"
      ? "#4b5320"
      : theme === "roman"
      ? "#c23a2b"
      : theme === "victorian"
      ? "#1e293b"
      : theme === "gravedigger"
      ? "#334155"
      : theme === "pirate"
      ? "#881337"
      : theme === "medieval"
      ? "#854d0e"
      : theme === "viking"
      ? "#78350f"
      : theme === "ninja"
      ? "#18181b"
      : theme === "asian"
      ? "#0284c7"
      : theme === "witch"
      ? "#581c87"
      : theme === "vampire"
      ? "#18181b"
      : theme === "werewolf"
      ? "#713f12"
      : theme === "krampus"
      ? "#3f2e1e"
      : theme === "mummy"
      ? "#e2e8f0"
      : theme === "ghost"
      ? "#f1f5f9"
      : "#92400e");

  const pantsNear =
    theme === "wwii"
      ? "#3f461b"
      : theme === "victorian" || theme === "vampire" || theme === "ninja"
      ? "#1e293b"
      : theme === "gravedigger"
      ? "#1e293b"
      : theme === "pirate"
      ? "#1e1b4b"
      : theme === "medieval" || theme === "viking"
      ? "#451a03"
      : theme === "werewolf"
      ? "#5c3310"
      : "#334155";

  const pantsFar =
    theme === "wwii"
      ? "#2e3314"
      : theme === "victorian" || theme === "vampire" || theme === "ninja"
      ? "#0f172a"
      : theme === "gravedigger"
      ? "#0f172a"
      : theme === "pirate"
      ? "#0f0e26"
      : theme === "medieval" || theme === "viking"
      ? "#291002"
      : theme === "werewolf"
      ? "#3e220a"
      : "#1e293b";

  const bootColor =
    theme === "wwii"
      ? "#451a03"
      : theme === "victorian" || theme === "vampire" || theme === "gravedigger"
      ? "#09090b"
      : theme === "ninja"
      ? "#18181b"
      : theme === "pirate"
      ? "#271206"
      : "#291508";

  // -------------------------------------------------------------------------
  // 1. LEGS KINEMATICS (Zero-Slip Stance & Forward Swing Arc)
  // -------------------------------------------------------------------------
  // Stance foot: linear movement from +stride to -stride (0px world slip)
  const stanceFoot = (uProgress: number) => {
    const x = 150 + stride * (1 - 2 * uProgress);
    const y = 570;
    let angle = 0;
    if (uProgress < 0.2) {
      // Heel strike to flat foot roll
      angle = -14 * (1 - uProgress / 0.2);
    } else if (uProgress > 0.75) {
      // Heel lifts off floor pushing off toe
      angle = 24 * ((uProgress - 0.75) / 0.25);
    }
    return {x, y, angle};
  };

  // Swing foot: parabolic clearance arc with knee lift
  const swingFoot = (uProgress: number) => {
    const x = 150 - stride + 2 * stride * (0.5 - 0.5 * Math.cos(uProgress * Math.PI));
    const y = 570 - stepHeight * Math.sin(uProgress * Math.PI);
    let angle = 0;
    if (uProgress < 0.25) {
      // Toe points down as it leaves floor
      angle = 20 * (1 - uProgress / 0.25);
    } else if (uProgress > 0.7) {
      // Ankle flexes up so heel touches down first
      angle = -14 * ((uProgress - 0.7) / 0.3);
    }
    return {x, y, angle};
  };

  // Step 0: Near leg stance, Far leg swing
  // Step 1: Near leg swing, Far leg stance
  const nearData = stepIndex === 0 ? stanceFoot(u) : swingFoot(u);
  const farData = stepIndex === 0 ? swingFoot(u) : stanceFoot(u);

  // Analytical 2-Bone IK
  const nearHip: Vec = [150, 400 + hipDrop];
  const farHip: Vec = [145, 398 + hipDrop];

  const nearIK = solveTwoBoneIK(nearHip, [nearData.x, nearData.y], 86, 86, true);
  const farIK = solveTwoBoneIK(farHip, [farData.x, farData.y], 86, 86, true);

  // -------------------------------------------------------------------------
  // 2. ARMS KINEMATICS (Harmonic Sagittal Pendulum Counter-Swing)
  // -------------------------------------------------------------------------
  // At Contact (frame 0): Near leg is forward, Near arm is at peak BACKWARD swing (-26 deg).
  // At Contact 2 (frame 12): Near leg is back, Near arm is at peak FORWARD swing (+26 deg).
  const swingAngle = Math.cos(cyclePhase) * 26;
  const nearArmDeg = -swingAngle; // Near arm opposite to near leg
  const farArmDeg = swingAngle;

  const nearArmRad = (nearArmDeg * Math.PI) / 180;
  const farArmRad = (farArmDeg * Math.PI) / 180;

  const nearShoulder: Vec = [148, 195 + hipDrop * 0.75];
  const farShoulder: Vec = [142, 193 + hipDrop * 0.75];

  // Near Arm Segments (60px upper arm, 50px forearm)
  const nearElbowX = nearShoulder[0] + 60 * Math.sin(nearArmRad);
  const nearElbowY = nearShoulder[1] + 60 * Math.cos(nearArmRad);
  // Natural forearm flexion: flexes forward when swinging forward, relaxes when backward
  const nearForearmFlex = nearArmDeg > 0 ? (nearArmDeg / 26) * 0.42 : 0.08;
  const nearHandX = nearElbowX + 50 * Math.sin(nearArmRad + nearForearmFlex);
  const nearHandY = nearElbowY + 50 * Math.cos(nearArmRad + nearForearmFlex);

  // Far Arm Segments
  const farElbowX = farShoulder[0] + 60 * Math.sin(farArmRad);
  const farElbowY = farShoulder[1] + 60 * Math.cos(farArmRad);
  const farForearmFlex = farArmDeg > 0 ? (farArmDeg / 26) * 0.42 : 0.08;
  const farHandX = farElbowX + 50 * Math.sin(farArmRad + farForearmFlex);
  const farHandY = farElbowY + 50 * Math.cos(farArmRad + farForearmFlex);

  // -------------------------------------------------------------------------
  // 3. PROFILE HEADWEAR & ACCESSORIES PER THEME
  // -------------------------------------------------------------------------
  const renderProfileHat = () => {
    const headY = 92 + headBob;
    if (theme === "wwii") {
      return (
        <g>
          {/* M1 Steel Pot Helmet Profile with front visor brim & rear nape flare */}
          <path
            d={`M98 ${headY + 20} Q96 ${headY - 44} 142 ${headY - 44} Q182 ${headY - 42} 188 ${headY + 4} L196 ${headY + 8} Q146 ${headY + 16} 98 ${headY + 20} Z`}
            fill="#525c27"
            stroke={INK}
            strokeWidth="5.5"
            strokeLinejoin="round"
          />
          {/* Helmet rim flange line */}
          <path
            d={`M96 ${headY + 20} Q146 ${headY + 16} 198 ${headY + 8}`}
            stroke={INK}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Chin strap hanging in profile */}
          <path
            d={`M132 ${headY + 16} Q138 ${headY + 38} 150 ${headY + 40}`}
            fill="none"
            stroke="#3a2f1b"
            strokeWidth="3.5"
          />
        </g>
      );
    }
    if (theme === "roman") {
      return (
        <g>
          {/* Galea helmet profile */}
          <path
            d={`M106 ${headY + 14} Q108 ${headY - 42} 146 ${headY - 42} Q182 ${headY - 40} 186 ${headY + 4} L194 ${headY + 8} Q146 ${headY + 12} 104 ${headY + 18} Z`}
            fill="#c99738"
            stroke={INK}
            strokeWidth="5.5"
            strokeLinejoin="round"
          />
          {/* Visor peak */}
          <path d={`M182 ${headY + 2} L196 ${headY + 6} L180 ${headY + 10} Z`} fill="#b58228" stroke={INK} strokeWidth="4" />
          {/* Neck guard */}
          <path d={`M108 ${headY + 10} L96 ${headY + 28} L114 ${headY + 20} Z`} fill="#b58228" stroke={INK} strokeWidth="4" />
          {/* Red Crest curving front to back */}
          <path
            d={`M112 ${headY - 32} Q146 ${headY - 68} 182 ${headY - 30} Q146 ${headY - 54} 112 ${headY - 32} Z`}
            fill="#b91c1c"
            stroke={INK}
            strokeWidth="4.5"
          />
        </g>
      );
    }
    if (theme === "victorian" || theme === "gravedigger") {
      return (
        <g>
          {/* Top Hat profile */}
          <rect
            x="116"
            y={headY - 68}
            width="56"
            height="58"
            rx="2"
            fill="#18181b"
            stroke={INK}
            strokeWidth="5.5"
          />
          {/* Hat band */}
          <rect
            x="116"
            y={headY - 20}
            width="56"
            height="10"
            fill={theme === "gravedigger" ? "#334155" : "#881337"}
          />
          {/* Hat brim */}
          <ellipse
            cx="145"
            cy={headY - 10}
            rx="46"
            ry="7"
            fill="#09090b"
            stroke={INK}
            strokeWidth="4.5"
          />
        </g>
      );
    }
    if (theme === "pirate") {
      return (
        <g>
          {/* Pirate Bicorne / Tricorn profile */}
          <path
            d={`M98 ${headY - 4} Q145 ${headY - 54} 195 ${headY - 4} L190 ${headY - 16} Q145 ${headY - 38} 105 ${headY - 16} Z`}
            fill="#18181b"
            stroke={INK}
            strokeWidth="5.5"
          />
          <path
            d={`M98 ${headY - 4} Q145 ${headY - 54} 195 ${headY - 4}`}
            fill="none"
            stroke="#eab308"
            strokeWidth="3.5"
          />
          <path
            d={`M112 ${headY - 18} Q100 ${headY - 55} 125 ${headY - 65}`}
            fill="none"
            stroke="#dc2626"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      );
    }
    // Default stylized profile hair
    return (
      <g>
        <path
          d={`M108 ${headY + 6} Q108 ${headY - 42} 146 ${headY - 42} Q180 ${headY - 40} 180 ${headY - 4} Q170 ${headY - 25} 145 ${headY - 30} Q120 ${headY - 25} 108 ${headY + 6} Z`}
          fill="#3b2716"
          stroke={INK}
          strokeWidth="4.5"
        />
        <path
          d={`M172 ${headY - 12} Q184 ${headY - 8} 180 ${headY + 4}`}
          fill="none"
          stroke="#3b2716"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    );
  };

  // -------------------------------------------------------------------------
  // 4. PROFILE FOOTWEAR COMPONENT (Sturdy Boot with Heel & Sole)
  // -------------------------------------------------------------------------
  const renderFoot = (tipX: number, tipY: number, angle: number, isFar: boolean) => (
    <g transform={`translate(${tipX}, ${tipY}) rotate(${angle})`}>
      {/* Outer Boot Contour */}
      <path
        d="M-14 -8 L10 -8 L20 0 L26 8 L24 12 L-14 12 Z"
        fill={isFar ? "#18181b" : bootColor}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Heavy Sole Tread */}
      <rect x="-14" y="9" width="38" height="4" fill="#09090b" stroke={INK} strokeWidth="2.5" />
      {/* Heel Block */}
      <rect x="-14" y="9" width="10" height="5" fill="#09090b" stroke={INK} strokeWidth="2.5" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 300 600"
      height={height}
      style={{
        overflow: "visible",
      }}
    >
      {/* Global horizontal flip for facing direction */}
      <g transform={facing === "left" ? "scale(-1, 1) translate(-300, 0)" : undefined}>
        {/* ----------------------------------------------------------------- */}
        {/* LAYER 1: FAR ARM (Behind Torso) */}
        {/* ----------------------------------------------------------------- */}
        <g opacity={0.85}>
          {/* Upper Arm Sleeve (Outer contour stroke + inner fill stroke) */}
          <line
            x1={farShoulder[0]}
            y1={farShoulder[1]}
            x2={farElbowX}
            y2={farElbowY}
            stroke={INK}
            strokeWidth="24"
            strokeLinecap="round"
          />
          <line
            x1={farShoulder[0]}
            y1={farShoulder[1]}
            x2={farElbowX}
            y2={farElbowY}
            stroke={tunicColor}
            strokeWidth="17"
            strokeLinecap="round"
          />

          {/* Forearm Sleeve */}
          <line
            x1={farElbowX}
            y1={farElbowY}
            x2={farHandX}
            y2={farHandY}
            stroke={INK}
            strokeWidth="20"
            strokeLinecap="round"
          />
          <line
            x1={farElbowX}
            y1={farElbowY}
            x2={farHandX}
            y2={farHandY}
            stroke={tunicColor}
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Far Hand (Side Profile hand at wrist) */}
          <circle cx={farHandX} cy={farHandY} r="7.5" fill={skin} stroke={INK} strokeWidth="3" />
        </g>

        {/* ----------------------------------------------------------------- */}
        {/* LAYER 2: FAR LEG (Behind Torso) */}
        {/* ----------------------------------------------------------------- */}
        <g opacity={0.88}>
          {/* Black Outer Contour of Thigh & Shin */}
          <path
            d={`M${farHip[0]} ${farHip[1]} L${farIK.joint[0]} ${farIK.joint[1]} L${farIK.tip[0]} ${farIK.tip[1]}`}
            stroke={INK}
            strokeWidth="26"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Solid Pants Color Fill */}
          <path
            d={`M${farHip[0]} ${farHip[1]} L${farIK.joint[0]} ${farIK.joint[1]} L${farIK.tip[0]} ${farIK.tip[1]}`}
            stroke={pantsFar}
            strokeWidth="19"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Far Foot */}
          {renderFoot(farIK.tip[0], farIK.tip[1], farData.angle, true)}
        </g>

        {/* ----------------------------------------------------------------- */}
        {/* LAYER 3: PROFILE TORSO & BELT */}
        {/* ----------------------------------------------------------------- */}
        <g>
          {/* Profile Torso Silhouette (Chest forward at right, spine at left) */}
          <path
            d={`M125 170 Q172 172 172 230 L168 ${405 + hipDrop} L124 ${405 + hipDrop} L118 230 Q118 172 125 170 Z`}
            fill={tunicColor}
            stroke={INK}
            strokeWidth="6"
            strokeLinejoin="round"
          />

          {/* Profile Belt */}
          <rect
            x="118"
            y={295 + hipDrop}
            width="50"
            height="18"
            rx="3"
            fill="#271206"
            stroke={INK}
            strokeWidth="4"
          />
          {/* Profile Belt Buckle at front edge */}
          <rect
            x="158"
            y={293 + hipDrop}
            width="10"
            height="22"
            rx="2"
            fill="#d4af37"
            stroke={INK}
            strokeWidth="3"
          />

          {/* Theme Chest Detail in Profile */}
          {theme === "wwii" ? (
            <g>
              {/* Pocket flap in profile */}
              <rect x="145" y={225 + hipDrop} width="22" height="18" rx="2" fill="#3f461b" stroke={INK} strokeWidth="3" />
              {/* Tie */}
              <path d={`M154 185 L164 185 L160 ${235 + hipDrop} L154 ${235 + hipDrop} Z`} fill="#655232" stroke={INK} strokeWidth="2.5" />
            </g>
          ) : theme === "roman" ? (
            <g>
              {/* Shoulder Fibula clasp */}
              <circle cx="150" cy="180" r="5" fill="#d4af37" stroke={INK} strokeWidth="2.5" />
              {/* Drapery fold */}
              <path d={`M148 185 Q135 230 148 ${285 + hipDrop}`} fill="none" stroke="#991b1b" strokeWidth="3.5" />
            </g>
          ) : null}
        </g>

        {/* ----------------------------------------------------------------- */}
        {/* LAYER 4: PROFILE HEAD & FACE */}
        {/* ----------------------------------------------------------------- */}
        <g>
          {/* Neck */}
          <rect
            x="132"
            y={130 + headBob}
            width="24"
            height="44"
            fill={skin}
            stroke={INK}
            strokeWidth="5"
          />

          {/* Profile Head Silhouette with solid chin & jaw */}
          <ellipse
            cx="145"
            cy={92 + headBob}
            rx="36"
            ry="40"
            fill={skin}
            stroke={INK}
            strokeWidth="5.5"
          />

          {/* Profile Nose protruding forward from the head */}
          <path
            d={`M172 ${84 + headBob} L188 ${92 + headBob} L172 ${98 + headBob} Z`}
            fill={skin}
            stroke={INK}
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* Profile Ear at back center */}
          <path
            d={`M134 ${86 + headBob} Q126 ${92 + headBob} 134 ${100 + headBob}`}
            fill={skin}
            stroke={INK}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Profile Eye */}
          <ellipse
            cx="162"
            cy={84 + headBob}
            rx="5"
            ry={6 * eyeScaleY}
            fill={INK}
          />
          {/* Eye shine reflection */}
          <circle cx="160.5" cy={82 + headBob} r="1.5" fill="#ffffff" />

          {/* Eyebrow */}
          <path
            d={`M152 ${74 + headBob} Q162 ${70 + headBob} 172 ${74 + headBob}`}
            fill="none"
            stroke={INK}
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Profile Lipsync Mouth on front edge */}
          {mouthOpen > 0.08 ? (
            <g>
              <path
                d={`M172 ${102 + headBob} Q${180 + mouthOpen * 8} ${106 + headBob} 170 ${110 + mouthOpen * 8 + headBob}`}
                fill="#5a1818"
                stroke={INK}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="172"
                y1={103 + headBob}
                x2={175 + mouthOpen * 3}
                y2={103 + headBob}
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          ) : (
            <path
              d={`M172 ${105 + headBob} Q176 ${107 + headBob} 171 ${109 + headBob}`}
              fill="none"
              stroke={INK}
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {/* Profile Hair or Hat */}
          {renderProfileHat()}
        </g>

        {/* ----------------------------------------------------------------- */}
        {/* LAYER 5: NEAR LEG (In Front of Torso) */}
        {/* ----------------------------------------------------------------- */}
        <g>
          {/* Black Outer Contour of Thigh & Shin */}
          <path
            d={`M${nearHip[0]} ${nearHip[1]} L${nearIK.joint[0]} ${nearIK.joint[1]} L${nearIK.tip[0]} ${nearIK.tip[1]}`}
            stroke={INK}
            strokeWidth="26"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Solid Pants Color Fill */}
          <path
            d={`M${nearHip[0]} ${nearHip[1]} L${nearIK.joint[0]} ${nearIK.joint[1]} L${nearIK.tip[0]} ${nearIK.tip[1]}`}
            stroke={pantsNear}
            strokeWidth="19"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Near Foot */}
          {renderFoot(nearIK.tip[0], nearIK.tip[1], nearData.angle, false)}
        </g>

        {/* ----------------------------------------------------------------- */}
        {/* LAYER 6: NEAR ARM (Foreground) */}
        {/* ----------------------------------------------------------------- */}
        <g>
          {/* Upper Arm Sleeve (Outer contour stroke + inner fill stroke) */}
          <line
            x1={nearShoulder[0]}
            y1={nearShoulder[1]}
            x2={nearElbowX}
            y2={nearElbowY}
            stroke={INK}
            strokeWidth="24"
            strokeLinecap="round"
          />
          <line
            x1={nearShoulder[0]}
            y1={nearShoulder[1]}
            x2={nearElbowX}
            y2={nearElbowY}
            stroke={tunicColor}
            strokeWidth="17"
            strokeLinecap="round"
          />

          {/* Forearm Sleeve */}
          <line
            x1={nearElbowX}
            y1={nearElbowY}
            x2={nearHandX}
            y2={nearHandY}
            stroke={INK}
            strokeWidth="20"
            strokeLinecap="round"
          />
          <line
            x1={nearElbowX}
            y1={nearElbowY}
            x2={nearHandX}
            y2={nearHandY}
            stroke={tunicColor}
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Near Hand in Profile (Thumb and curved fingers) */}
          <circle cx={nearHandX} cy={nearHandY} r="8.5" fill={skin} stroke={INK} strokeWidth="3.5" />
          <path
            d={`M${nearHandX - 2} ${nearHandY - 5} Q${nearHandX + 5} ${nearHandY - 6} ${nearHandX + 5} ${nearHandY}`}
            fill="none"
            stroke={INK}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
};
