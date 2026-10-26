
#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/encode-video.sh <input-path> <output-path>
# -vf "scale=-2:720": Resize to 720px tall, preserve aspect ratio, and keep width even
# -c:v libx264: Encode video using H.264 for browser compatibility
# -crf 30: Use CRF 30, which gave acceptable playback quality while bringing all three videos below 2 MB combined.
# -preset slow: Spend more encoding time to achieve smaller files 
# -an: Remove audio.
# -pix_fmt yuv420p: Use a widely supported pixel format for Safari and Firefox
# -movflags +faststart: Move MP4 metadata to the beginning for faster playback

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <input-path> <output-path>" >&2
  exit 1
fi

ffmpeg -y -i "$1" \
  -vf "scale=-2:720,fps=30" \
  -c:v libx264 -crf 30 -preset slow \
  -pix_fmt yuv420p \
  -an -movflags +faststart \
  "$2"
