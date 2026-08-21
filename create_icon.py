from PIL import Image, ImageDraw

size = 1024
img = Image.new('RGB', (size, size), '#0B1220')
d = ImageDraw.Draw(img)
d.rounded_rectangle((150, 160, 874, 864), radius=170, fill='#2F80ED')
d.rounded_rectangle((212, 248, 812, 690), radius=100, fill='#151F32')
d.polygon([(260, 566), (320, 450), (410, 392), (620, 392), (706, 450), (770, 566)], fill='#F6F8FC')
d.rounded_rectangle((300, 500, 730, 628), radius=46, fill='#F6F8FC')
d.rounded_rectangle((384, 430, 476, 506), radius=18, fill='#151F32')
d.rounded_rectangle((520, 430, 612, 506), radius=18, fill='#151F32')
d.ellipse((330, 580, 420, 670), fill='#0B1220')
d.ellipse((610, 580, 700, 670), fill='#0B1220')
d.line((500, 738, 560, 790, 716, 628), fill='#35D0BA', width=42, joint='curve')
img.save('assets/images/icon.png')
for name in ['splash-icon.png', 'favicon.png', 'android-icon-foreground.png']:
    img.save(f'assets/images/{name}')
