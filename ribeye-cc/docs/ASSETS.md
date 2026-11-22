# Image sources

## Author-provided portrait

- `public/images/profile.jpg`: supplied by the owner on 2026-11-22 as `/home/ev/Pictures/profile_img.jpg` (960 × 960 JPEG). Copied unchanged, with no cropping, retouching or generated edits, as explicitly requested.
- Displayed on the Chinese and English homepages beside the name and contact information at 160px wide. On narrow screens it appears above the text at 128px wide. The full square image is preserved with automatic height, localized alternative text and explicit intrinsic dimensions.
- The portrait was added during the unpublished editing period. The owner explicitly authorized publishing the website again on 2026-11-22.

## Author-provided research video

- `public/media/accisage-introduction.mp4`: supplied by the owner on 2026-11-21 as `ICRA_video_莊淳傑_0828.mp4` (110.87 seconds, 1280 × 720). The original in Downloads is unchanged. The web copy uses FFmpeg stream copy with `+faststart`, moving the MP4 index to the start without re-encoding the picture or audio.
- `public/images/accisage-video-poster.jpg`: extracted from the supplied video at 0.2 seconds, showing the method overview. No generated or reconstructed imagery.
- The video is presented as a research introduction, not as proof of an ICRA submission or acceptance. See `RESEARCH_FACTS.md` for the owner's stated uncertainty.
- Native playback controls, `playsinline`, and `preload="none"` are used. No autoplay or third-party video service is added. English captions are embedded in the video picture; there is no separate selectable captions track.

## Existing research figures

- `public/images/accisage-overview.jpg`: existing method overview from the owner's [AcciSAGE repository](https://github.com/cjzrv/accisage/blob/main/docs/assets/accisage_overview.jpg), retrieved 2026-11-21. The repository is MIT-licensed. Kept locally so the site does not require runtime GitHub image requests. The original image is linked for full-size reading.
- `public/images/accisage-LICENSE.txt`: upstream MIT notice, also included in the static output.
- `public/images/pcb-v-shape.png`: inherited from the handoff, taken from the author's PCB paper, p. 5. No additional paper images or full-text PDF have been added.

The DLDR repository's library screenshot contains adult work covers, so it is not embedded or copied into this website. A clean screenshot with synthetic library data can be added later.

AcciSAGE repository license:

```text
MIT License

Copyright (c) 2026 AcciSAGE contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
