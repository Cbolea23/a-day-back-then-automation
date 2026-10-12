const url = "https://discord.com/api/webhooks/1559117072154501230/YGglkdPa_iM8zIT627N_sXPCOeXAoJDp1nXLjQdjMSStVjtPCLgY3M2_V_7QeRPgyk2R";

const payload = {
  content: "🚶 **Zero-Slip Articulated Walk Kinematics & Grounded Staging Completed!**\nWe stripped away the opening acrobatic stunt intro and implemented a realistic walking gait with zero sliding:\n\n📹 **Walk Showcase Video:** `out/narrator-walk-demo.mp4`\n\n**Key Kinematic Upgrades:**\n1. 🚷 **Zero Foot-Sliding**: Stance foot ground translation speed is mathematically synchronized with screen velocity ($v = \\Delta X / \\Delta t$). When a foot touches the floor, its world coordinate is locked ($0\\text{px}$ slippage).\n2. 🦵 **Articulated 2-Bone IK Legs & Anatomic Pelvis**: Fixed bone lengths ($88\\text{px}$ thigh, $88\\text{px}$ shin), anatomical flared hips, and outward knee projection that eliminates knee crossing.\n3. 👟 **4-Phase Richard Williams Walk Cycle**: Heel strike contact, knee flex & hip dip cushion ($+4\\text{px}$), clean parabolic clearance arc ($22\\text{px}$ lift), and toe push-off extension ($-4\\text{px}$).\n4. 👞 **Ankle Pitch Rotation**: Dynamic heel-to-toe roll ($-14^\\circ$ heel strike $\\to 0^\\circ$ flat $\\to +22^\\circ$ push-off).\n5. 🎯 **Default Grounded Staging**: Scene 0 entrance acrobatics stripped away; the narrator stands naturally grounded right from frame 0."
};

async function send() {
  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
  });
  console.log("Discord webhook response status:", res.status, res.statusText);
}

send().catch(console.error);
