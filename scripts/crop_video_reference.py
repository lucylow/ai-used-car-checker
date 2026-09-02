from PIL import Image

source = Image.open('/home/ubuntu/screenshots/webdev-preview-root-1787669734257531097-2679.png').convert('RGB')
width, height = source.size
target_height = int(width * 9 / 16)
top = max(0, (height - target_height) // 2)
cropped = source.crop((0, top, width, top + target_height))
cropped.save('/home/ubuntu/ai-used-car-checker/carwise_reference_16x9.png')
print(cropped.size)
