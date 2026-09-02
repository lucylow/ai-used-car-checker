from pathlib import Path
from PIL import Image, ImageDraw

files = sorted(Path('/home/ubuntu/screenshots').glob('webdev-preview-root-*.png'), key=lambda p: p.stat().st_mtime, reverse=True)[:12]
thumbs = []
for path in files:
    image = Image.open(path).convert('RGB')
    image.thumbnail((180, 320), Image.Resampling.LANCZOS)
    tile = Image.new('RGB', (220, 365), '#162436')
    x = (220 - image.width) // 2
    tile.paste(image, (x, 12))
    ImageDraw.Draw(tile).text((8, 338), path.name[-18:], fill='#d8e5ed')
    thumbs.append(tile)
cols = 4
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * 220, rows * 365), '#08121f')
for index, tile in enumerate(thumbs):
    sheet.paste(tile, ((index % cols) * 220, (index // cols) * 365))
sheet.save('/home/ubuntu/ai-used-car-checker/carwise_screenshot_contact_sheet.png')
print('\n'.join(str(p) for p in files))
