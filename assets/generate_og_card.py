"""Generate a 1200x630 PNG OG card matching the brand book.
Run: python generate_og_card.py
Output: og-card.png in this folder.
"""
from PIL import Image, ImageDraw, ImageFont
import os
import sys

# Brand tokens (Brand Book §3)
INK = (5, 6, 8)
DEEP_NAVY = (11, 44, 66)
BRASS = (201, 168, 106)
BRASS_BRIGHT = (229, 201, 136)
PARCHMENT = (245, 241, 232)

W, H = 1200, 630

img = Image.new("RGB", (W, H), INK)
draw = ImageDraw.Draw(img, "RGBA")

# Subtle radial gradient (top-right brass glow + bottom-left navy)
for r in range(W):
    for c in range(0, H, 4):  # stride for speed; thin horizontal bands
        # Brass radial centred at (0.8W, 0.2H)
        dx = (r - 0.8*W) / W
        dy = (c - 0.2*H) / H
        d1 = (dx*dx + dy*dy) ** 0.5
        a1 = max(0, 1 - d1*1.7) ** 2
        # Navy radial centred at (0.1W, 1.0H)
        dx = (r - 0.1*W) / W
        dy = (c - 1.0*H) / H
        d2 = (dx*dx + dy*dy) ** 0.5
        a2 = max(0, 1 - d2*1.6) ** 2
        # Composite
        rr, gg, bb = INK
        rr = int(rr + (BRASS[0] - rr) * a1 * 0.16 + (DEEP_NAVY[0] - rr) * a2 * 0.55)
        gg = int(gg + (BRASS[1] - gg) * a1 * 0.16 + (DEEP_NAVY[1] - gg) * a2 * 0.55)
        bb = int(bb + (BRASS[2] - bb) * a1 * 0.16 + (DEEP_NAVY[2] - bb) * a2 * 0.55)
        draw.rectangle([r, c, r+1, c+4], fill=(rr, gg, bb))

# Faint grid overlay (every 80px)
grid_alpha = 18
for x in range(0, W, 80):
    draw.line([(x, 0), (x, H)], fill=(245, 241, 232, grid_alpha))
for y in range(0, H, 80):
    draw.line([(0, y), (W, y)], fill=(245, 241, 232, grid_alpha))

# Try to load a serif font; fall back to default if not available.
def find_font(candidates, size):
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()

WIN_FONTS = r"C:\Windows\Fonts"
serif_paths = [
    os.path.join(WIN_FONTS, "georgia.ttf"),
    os.path.join(WIN_FONTS, "georgiab.ttf"),  # bold
    os.path.join(WIN_FONTS, "constan.ttf"),
    os.path.join(WIN_FONTS, "times.ttf"),
]
serif_bold_paths = [
    os.path.join(WIN_FONTS, "georgiab.ttf"),
    os.path.join(WIN_FONTS, "constanb.ttf"),
    os.path.join(WIN_FONTS, "timesbd.ttf"),
] + serif_paths
sans_paths = [
    os.path.join(WIN_FONTS, "segoeui.ttf"),
    os.path.join(WIN_FONTS, "arial.ttf"),
]
sans_bold_paths = [
    os.path.join(WIN_FONTS, "segoeuib.ttf"),
    os.path.join(WIN_FONTS, "arialbd.ttf"),
] + sans_paths

font_eyebrow = find_font(sans_bold_paths, 18)
font_h1 = find_font(serif_bold_paths, 68)
font_lead = find_font(sans_paths, 22)
font_brand = find_font(serif_bold_paths, 28)

# EYEBROW
eyebrow = "SENIOR-LED ADVISORY"
# tracked-out caps simulation: insert thin spaces between letters
eyebrow_spaced = "  ".join(eyebrow)
draw.text((80, 110), eyebrow_spaced, fill=BRASS, font=font_eyebrow)

# Headline (two lines)
draw.text((80, 220), "Operating the AI era.", fill=PARCHMENT, font=font_h1)
draw.text((80, 305), "Strategy. Operations.", fill=PARCHMENT, font=font_h1)
draw.text((80, 390), "Emerging tech.", fill=PARCHMENT, font=font_h1)

# Brass underline
draw.line([(80, 490), (200, 490)], fill=BRASS, width=2)

# Lead line (sans, lighter)
draw.text((80, 510), "Nitesh Chawda Consulting · Melbourne · London · New York",
          fill=(245, 241, 232, 199), font=font_lead)

# Brand mark bottom-right
draw.text((80, 560), "NITESH  CHAWDA  CONSULTING", fill=BRASS, font=font_brand)

# Top rule (subtle)
draw.line([(0, 0), (W, 0)], fill=BRASS, width=2)

# Save
out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "og-card.png")
img.save(out_path, "PNG", optimize=True)
print(f"Wrote {out_path} ({os.path.getsize(out_path)} bytes)")
