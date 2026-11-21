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
