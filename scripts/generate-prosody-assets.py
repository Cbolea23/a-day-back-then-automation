from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('exports/5 - Emotional AI Voiceover & Prosody Director', exist_ok=True)

# 1. Logo (512x512)
logo = Image.new('RGB', (512, 512), '#0B0F19')
d = ImageDraw.Draw(logo)

# Gradient background glow
for r in range(220, 0, -2):
    alpha = int(40 * (1 - r / 220))
    d.ellipse([256 - r, 256 - r, 256 + r, 256 + r], fill='#1E1B4B')

# Audio wave bars
bar_heights = [60, 110, 180, 260, 320, 240, 160, 90]
bar_width = 24
spacing = 16
total_w = len(bar_heights) * bar_width + (len(bar_heights) - 1) * spacing
start_x = (512 - total_w) // 2

colors = ['#818CF8', '#A855F7', '#EC4899', '#F43F5E', '#EC4899', '#A855F7', '#818CF8', '#6366F1']

for i, h in enumerate(bar_heights):
    x = start_x + i * (bar_width + spacing)
    y1 = 256 - h // 2
    y2 = 256 + h // 2
    c = colors[i % len(colors)]
    d.rounded_rectangle([x, y1, x + bar_width, y2], radius=10, fill=c)

# Badge circle
d.ellipse([340, 100, 420, 180], fill='#F43F5E')
d.text((360, 125), "TTS", fill='#FFFFFF')

logo_path = 'exports/5 - Emotional AI Voiceover & Prosody Director/prosody-director-logo.png'
logo.save(logo_path)
print(f"Created {logo_path}")

# 2. Screenshot (1280x720)
screen = Image.new('RGB', (1280, 720), '#0B0F19')
sd = ImageDraw.Draw(screen)

# Header banner
sd.rectangle([0, 0, 1280, 90], fill='#111827')
sd.text((50, 32), "EMOTIONAL AI VOICEOVER & PROSODY DIRECTOR", fill='#818CF8')
sd.rectangle([1100, 25, 1220, 65], fill='#F43F5E')
sd.text((1125, 38), "$9 PRO", fill='#FFFFFF')

# Left panel - Acoustic Matrix
sd.rounded_rectangle([50, 120, 600, 660], radius=12, fill='#1F2937', outline='#374151')
sd.text((80, 150), "ACOUSTIC PROSODY CALIBRATION", fill='#F43F5E')

presets = [
    ("SPOOKY-SUSPENSE", "Pitch: -4Hz  |  Rate: -5%  (Dread & Cryptids)", '#EC4899'),
    ("INTENSE-DRAMA", "Pitch: -2Hz  |  Rate: -2%  (Battles & Stakes)", '#F59E0B'),
    ("DOCUMENTARY-CALM", "Pitch: -1Hz  |  Rate: -1%  (History & Nature)", '#10B981'),
    ("VIRAL-ENERGETIC", "Pitch: +1Hz  |  Rate: +4%  (Viral Trivia)", '#38BDF8'),
]

for idx, (title, desc, col) in enumerate(presets):
    y = 210 + idx * 105
    sd.rounded_rectangle([75, y, 575, y + 85], radius=8, fill='#111827', outline=col)
    sd.text((95, y + 16), title, fill=col)
    sd.text((95, y + 46), desc, fill='#9CA3AF')

# Right panel - Waveform & Terminal
sd.rounded_rectangle([630, 120, 1230, 660], radius=12, fill='#111827', outline='#374151')
sd.text((660, 150), "REAL-TIME PROSODY SYNTHESIS TERMINAL", fill='#10B981')

terminal_lines = [
    "$ node scripts/prosody-tts.js \"Deep in the balete...\" out.mp3",
    ">> Loaded persona: fil-PH-AngeloNeural (Filipino Storyteller)",
    ">> Injected dramatic breath pause: 350ms inhalation",
    ">> Calibrated acoustic offset: Pitch -4Hz | Speed -5%",
    ">> Pure-Node MP3 Duration: 5.42 seconds (Parsed from MPEG sync)",
    ">> Status: Zero robotic monotone. Broadcast emotional audio ready!"
]

for i, line in enumerate(terminal_lines):
    color = '#10B981' if line.startswith('>> Status') else '#E5E7EB' if line.startswith('$') else '#9CA3AF'
    sd.text((660, 220 + i * 45), line, fill=color)

# Waveform visualization in lower right
wave_y = 540
for x in range(660, 1200, 10):
    import math
    h = int(30 * math.sin((x - 660) * 0.05) * math.cos((x - 660) * 0.02) + 40)
    sd.rectangle([x, wave_y - h, x + 6, wave_y + h], fill='#A855F7')

screen_path = 'exports/5 - Emotional AI Voiceover & Prosody Director/prosody-director-screenshot.png'
screen.save(screen_path)
print(f"Created {screen_path}")
