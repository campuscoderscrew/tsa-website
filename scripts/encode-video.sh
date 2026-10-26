
#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/encode-video.sh <input-path> <output-path>

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

# Flag explanations:
# -vf "scale=-2:720,fps=30": Resize to 720px tall, preserve aspect ratio,
#   keep width even, and explicitly set 30 FPS.
# -c:v libx264: Encode using H.264 for browser compatibility.
# -crf 30: Quality-based compression; CRF 30 kept the three videos below
#   2 MB combined. Check visual quality at the rendered carousel size.
# -preset slow: Spend more encoding time to improve compression efficiency.
# -pix_fmt yuv420p: Use a widely supported pixel format for browser compatibility.
# -an: Remove audio.
# -movflags +faststart: Move MP4 metadata to the beginning for faster playback.
