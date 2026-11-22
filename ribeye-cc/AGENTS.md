# Codex handoff entrypoint

**Before editing this project, read `START_HERE.md`, `docs/PROFILE_AND_CONTENT.md`, `docs/RESEARCH_FACTS.md`, `docs/DESIGN_SPEC.md`, and `docs/NEXT_STEPS.md`.** These documents contain owner-confirmed facts, paper metrics, visual intent, and acceptance criteria.

# ribeye.cc — Academic homepage design rules

The owner deliberately prefers the look of a traditional professor's personal academic website over a modern startup or developer landing page. Protect that choice in every future change.

- Use a white background, black text, modest blue underlined links, normal document typography and narrow readable width.
- Text first: publication references (authors, titles, venue, year), research results, source-code links, education and contact.
- Owner display preference: omit the PCB paper's author list from public pages, including lists, CV and publication details. Keep the original published bibliography in reference docs for verification; do not replace it with a sole-author claim.
- Do not reintroduce hero illustrations, badges, bento layouts, colorful project cards, gradients, blur effects, decorative icons, counters, animation, dark mode, or heavy JavaScript.
- Show only real academic figures/tables in article detail pages, with captions.
- Preserve English and Traditional Chinese variants, keyboard accessibility, mobile readability, and useful metadata.
- Traditional Chinese is the default: `/` is the Chinese homepage and `/en/` is the English homepage. Preserve `/zh-tw/` as a Chinese homepage alias with canonical `/`; keep existing inner-page URLs and use Chinese counterparts for `x-default` metadata.
- AcciSAGE is graduate research/manuscript with public implementation, not an asserted formally published paper.
- PCB study is a 2024 Minghsin Journal publication. Its source experiment uses 1,000 randomly generated triangles and scale-dependent comparisons; do not invent benchmarks.
- The GitHub owners `cjzrv` and `ribeye0` are both associated with this person's work; keep repository links stable.
- Owner: Chun-Jie Zhuang (莊淳傑), `cjz89k@gmail.com`, domain `ribeye.cc`, M.S. 2024–2026, B.S. 2019–2024, TOEIC 780/990.
- Do not add a personal photo, full transcript, private life, or additional claims unless the owner provides them.

The owner requested removal of unnecessary frameworks on 2026-11-21. This is now plain HTML/CSS generated with Node.js built-ins, with **zero npm dependencies**. Do not reinstall Astro, TypeScript, a frontend framework or a template engine without a concrete need.

- `src/data/site.js`: works, localized summaries, publication metadata and routes.
- `src/data/profile.js`: confirmed profile, education and technical skills shared by home and CV.
- `src/layout.js` and `src/render.js`: common HTML shell and small rendering functions. Escape shared data through `src/html.js`.
- `src/content/en/` and `src/content/zh-tw/`: author-edited article HTML; no second copy of generated pages.
- `src/styles/global.css`: responsive and print styles. `public/`: approved static assets only.
- `scripts/build.mjs`: builds only `dist/` or `static-preview/`. `scripts/serve.mjs` is for local preview, not production hosting.
- Run `npm run verify` after source changes. It needs no install step and checks syntax, data, all pages and the local server. Tests use `node:test`.
- The Git repository root is the parent `site/`. Its `.github/workflows/pages.yml` builds `ribeye-cc/` and deploys **only** `ribeye-cc/dist/`. Do not put the workflow back into the nested project.
- Preserve GitHub Pages directory routes, bilingual counterparts, the custom 404, sitemap, robots and `CNAME` for `ribeye.cc`. Do not add build-only source or private reference files to output.

Current verification and deployment limits are recorded in `docs/VALIDATION.md` and `docs/NEXT_STEPS.md`.

## Authorized linecover interactive demonstration

The owner explicitly requested a C++/raylib/WebAssembly algorithm reproduction on 2026-11-21.
The isolated `/projects/linecover/demo/` and `/zh-tw/projects/linecover/demo/` pages may load
the raylib runtime and provide user-controlled algorithm playback. This is an exception for
scientific visualization only; preserve the ordinary academic pages and do not add decorative animation.
The implementation lives in the parent `linecover/` directory. Read `../linecover/README.md` before changing it.
After changing C++ or its CMake configuration, rebuild with `bash linecover/scripts/build-web.sh`
from the Git root (Emscripten 4.0.20 activated). Its checked-in web runtime and SHA-256 manifest
live in `public/demos/linecover/`; `npm run verify` detects stale compiled assets.
Run headless C++ tests as well as site checks. Preserve the distinction between new per-case
geometry metrics and the original published statistical tables. Never imply BGI pixel parity.

The owner requested unpublishing while editing on 2026-11-21, then explicitly requested publishing again on 2026-11-22. Pages artifact upload and deployment are restored: main pushes/manual runs publish after validation, while PRs only validate. Keep the site public until the owner requests otherwise. Local preview remains available.

The author corrected corner zig-zag on 2026-11-22: finish one whole side down to the minimum
brush, then return along the other side from small to large, like a simple Christmas-tree outline.
This applies to triangles and supported trapezoids. Preserve the original capsule multiset and
radius recurrence; the previous alternating-side sqrt(k) implementation has been replaced.
Only reorder/reorient strokes, count every brush-center relocation as lifted travel, and show
measured before/after totals without promising savings for all shapes.

On 2026-11-22 the owner simplified the demo, then explicitly added a full travel trace.
The current feature switches are 「逐角折返覆蓋」 (Fill each corner in turn),
「強調筆劃輪廓」 (Highlight stroke outlines), and 「完整行進軌跡」 (Show full travel path).
The trace connects brush centers in stroke order, with solid drawing segments and dashed
lifted transfers, including radius-change relocations. Show only the visited prefix during
playback; Show all reveals the complete route. Do not add an initial move or a return home.
Keep playback, case parameters and vertex editing, but do not reintroduce stroke numbering,
selection lists or fade controls. Exterior vertex labels remain.
The persisted cornerZigzag JSON field and CLI flag are retained for compatibility.

The drawing metric audit on 2026-11-22 confirmed that drawingRatio excludes lifted travel.
Keep its UI label explicit and show the raw drawing length and polygon perimeter. Do not
silently redefine it as total travel: total travel includes drawingLength + liftedLength.
For triangles the two methods can have identical drawing lengths because reference stamps
are stationary; corner reordering changes lifted travel, not the preserved drawing strokes.

The demo emphasizes overlap and total travel, highlighting the actual lower value and
reporting relative differences against B. Do not always highlight A: custom cases can be worse.
Published-table reductions (30.90–91.16% overlap, 49.55–50.60% normalized travel)
are derived from the three scale comparisons, not new-case or corner-routing benchmarks.

The demo now has Random triangle / Random trapezoid buttons. Candidates are generated
locally and validated by both methods in the existing C++ core, with at most 128 attempts.
Keep the current brush, precision and feature switches; do not select cases based on
measured advantages or describe these exploratory shapes as the paper’s fixed-area sample.

Playback controls and both method panels now share the `.demo-workspace` section.
Keep playback immediately above the figures; its toolbar stays sticky only within this
section (static in short viewports). Instructions, metric definitions and coordinate/JSON
editing use native details/summary. Preserve all existing controls and computation semantics.

PCB research and linecover records share `demoRoute` in `src/data/site.js`. The common
renderer exposes bilingual interactive-demo links on home/list/detail pages and the CV.
Keep those entry points and the project’s feature description in sync with the demo.
