# XAQI arts — Saqib Maqbool Khan

Personal portfolio website of **Saqib Maqbool Khan** (brand: **XAQI arts**) — AI Generation Artist & creative media specialist, Wah Cantt, Pakistan.

**Live:** https://xaqiarts.github.io

## What's inside
- **Logo welcome** — animated brand intro on load
- **Three.js hero** — floating 3D cosmos (starfield, metallic shapes, mouse + scroll parallax)
- **AI Client Work** — 11 edited client films from Ryven Studios tenure (click a card to play with sound)
- **3D Gallery Album** — hand-made artwork (sketches, oil paintings, illustrations, murals) floating in a draggable 3D ring
- **Portfolio links** — Behance, Pinterest, GitHub
- **Light / dark theme** — persisted toggle

## Tech
Pure HTML + CSS + vanilla JS. 3D via vendored `three.min.js` (no build step, no npm).
Scroll reveals via IntersectionObserver. No frameworks, no trackers.

## Run locally
```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
Push the `site/` directory contents to the `XAQIARTS/xaqiarts.github.io` repository (`main` branch).
The `CNAME` file maps the custom domain; `.nojekyll` disables Jekyll processing.

## Content notes
- Gallery shows **only** the curated approved set (`curation.md` in the project workspace).
- Client films: edited per project scripts; full-quality masters live in the project workspace (`edited-videos/`).

© 2026 Saqib Maqbool Khan · XAQI arts. Site code is open-source (MIT). Artwork & films © the artist — all rights reserved.
