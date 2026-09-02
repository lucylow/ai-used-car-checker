from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path('/home/ubuntu/ai-used-car-checker')
sources = sorted(Path('/home/ubuntu/screenshots').glob('webdev-preview-root-*.png'), key=lambda p: p.stat().st_mtime, reverse=True)[:12]
W, H = 1280, 720
phone_w, phone_h = 430, 690
phone_x, phone_y = (W - phone_w) // 2, 15
screen_box = (phone_x + 18, phone_y + 18, phone_x + phone_w - 18, phone_y + phone_h - 18)
screen_w, screen_h = screen_box[2] - screen_box[0], screen_box[3] - screen_box[1]
labels = [
    ('Welcome to Carwise', 'Know the car before the issues.'),
    ('Start with identity', 'A focused place for the vehicle details.'),
    ('Build the inspection', 'Move from context to evidence with less friction.'),
    ('Capture what matters', 'Keep the inspection trail close at hand.'),
    ('Review with confidence', 'Turn observations into a clearer decision.'),
    ('Keep your history local', 'Return to saved work whenever you need it.'),
    ('Compare the market', 'Bring asking price context into the conversation.'),
    ('Use AI where it helps', 'Surface useful signals without losing control.'),
    ('Stay organized', 'One inspection, one readable record.'),
    ('Make the next step clear', 'A calmer workflow for used-car shopping.'),
    ('Carwise', 'Inspection intelligence in your pocket.'),
    ('Know before you buy', 'A better way to inspect a used car.'),
]

for index, path in enumerate(sources):
    source = Image.open(path).convert('RGB')
    screen = ImageOps.fit(source, (screen_w, screen_h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    canvas = Image.new('RGB', (W, H), '#06111f')
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((W//2-350, 15, W//2+350, H+290), fill=(20, 125, 155, 48))
    canvas = Image.alpha_composite(canvas.convert('RGBA'), glow.filter(ImageFilter.GaussianBlur(90)))
    draw = ImageDraw.Draw(canvas)
    eyebrow, title = labels[index % len(labels)]
    draw.text((58, 78), 'CARWISE  /  PRODUCT WALKTHROUGH', fill='#78d9e7')
    draw.text((58, 112), eyebrow, fill='#f2f7fb')
    draw.text((58, 148), title, fill='#9eb0bd')
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((phone_x+12, phone_y+20, phone_x+phone_w+12, phone_y+phone_h+20), radius=48, fill=(0,0,0,185))
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(18)))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((phone_x, phone_y, phone_x+phone_w, phone_y+phone_h), radius=48, fill='#111b29', outline='#3c5468', width=3)
    mask = Image.new('L', (screen_w, screen_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, screen_w, screen_h), radius=32, fill=255)
    canvas.paste(screen, (screen_box[0], screen_box[1]), mask)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((phone_x+150, phone_y+9, phone_x+280, phone_y+31), radius=12, fill='#080d14')
    draw.line((58, 638, 245, 638), fill='#26a7b8', width=4)
    draw.text((58, 654), f'Carwise  •  {index+1:02d} / {len(sources):02d}', fill='#718693')
    out = ROOT / f'carwise_extended_scene_{index:02d}.png'
    canvas.convert('RGB').save(out, quality=95)
    print(out)
