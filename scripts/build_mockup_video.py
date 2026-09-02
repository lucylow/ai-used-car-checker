from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path('/home/ubuntu/ai-used-car-checker')
source_path = Path('/home/ubuntu/screenshots/webdev-preview-root-1787859630562448176-9655.png')
source = Image.open(source_path).convert('RGB')
W, H = 1280, 720
phone_w, phone_h = 430, 690
phone_x, phone_y = (W - phone_w) // 2, 15
screen_box = (phone_x + 18, phone_y + 18, phone_x + phone_w - 18, phone_y + phone_h - 18)

# Fit the authentic portrait screenshot into the phone display.
screen_w = screen_box[2] - screen_box[0]
screen_h = screen_box[3] - screen_box[1]
screen = ImageOps.fit(source, (screen_w, screen_h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))

frames = []
for idx, (title, subtitle) in enumerate([
    ('Know the car before the issues.', 'Start with vehicle details and build a decision-ready inspection.'),
    ('A calmer way to inspect.', 'Capture identity, evidence, and checklist progress in one flow.'),
    ('Carwise', 'Used-car inspection, organized for confident decisions.'),
]):
    canvas = Image.new('RGB', (W, H), '#06111f')
    draw = ImageDraw.Draw(canvas)
    # Subtle presentation glow.
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((W//2-330, 40, W//2+330, H+260), fill=(20, 125, 155, 55))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    canvas = Image.alpha_composite(canvas.convert('RGBA'), glow).convert('RGB')
    draw = ImageDraw.Draw(canvas)
    draw.text((58, 86), 'CARWISE', fill='#78d9e7')
    draw.text((58, 125), title, fill='#f2f7fb')
    draw.text((58, 165), subtitle, fill='#9eb0bd')
    # Phone shadow and body.
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((phone_x+12, phone_y+20, phone_x+phone_w+12, phone_y+phone_h+20), radius=48, fill=(0,0,0,180))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas.convert('RGBA'), shadow)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((phone_x, phone_y, phone_x+phone_w, phone_y+phone_h), radius=48, fill='#111b29', outline='#3c5468', width=3)
    draw.rounded_rectangle(screen_box, radius=34, fill='#06111f')
    canvas.paste(screen, (screen_box[0], screen_box[1]))
    draw = ImageDraw.Draw(canvas)
    # Re-mask screen corners.
    mask = Image.new('L', (screen_w, screen_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0,0,screen_w,screen_h), radius=32, fill=255)
    canvas.paste(screen, (screen_box[0],screen_box[1]), mask)
    # Camera island and footer accent.
    draw.rounded_rectangle((phone_x+150, phone_y+9, phone_x+280, phone_y+31), radius=12, fill='#080d14')
    draw.line((58, 635, 245, 635), fill='#26a7b8', width=4)
    draw.text((58, 653), 'Product walkthrough', fill='#718693')
    out = ROOT / f'carwise_mockup_scene_{idx}.png'
    canvas.convert('RGB').save(out, quality=95)
    frames.append(out)

print('\n'.join(str(p) for p in frames))
