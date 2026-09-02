#!/usr/bin/env bash
set -euo pipefail
cd /home/ubuntu/ai-used-car-checker
rm -f carwise_clip_*.mp4 carwise_extended_concat.txt carwise_mobile_mockup_demo_2min.mp4
index=0
for image in carwise_extended_scene_*.png; do
  clip=$(printf 'carwise_clip_%02d.mp4' "$index")
  zoom=$(awk "BEGIN { printf \"%.4f\", 0.00035 + ($index * 0.00002) }")
  ffmpeg -loglevel error -y -loop 1 -i "$image" -t 10 -vf "scale=1280:720,zoompan=z='min(zoom+${zoom},1.03)':d=300:s=1280x720:fps=30,fade=t=in:st=0:d=0.45,fade=t=out:st=9.55:d=0.45,format=yuv420p" -an -c:v libx264 -preset medium -crf 20 -movflags +faststart "$clip"
  printf "file '%s'\n" "$clip" >> carwise_extended_concat.txt
  index=$((index + 1))
done
ffmpeg -loglevel error -y -f concat -safe 0 -i carwise_extended_concat.txt -c copy -movflags +faststart carwise_mobile_mockup_demo_2min.mp4
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of default=noprint_wrappers=1 carwise_mobile_mockup_demo_2min.mp4
