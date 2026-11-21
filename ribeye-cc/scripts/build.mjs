/** Zero-dependency static build. Never copies source, private references or development files. */
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { identity, research, projects, siteRoutes, localUrl } from '../src/data/site.js';
import { homePage, listingPage, aboutPage, detailPage, notFoundPage } from '../src/render.js';
import { escapeHtml as e } from '../src/html.js';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export async function build(outputDirectory = 'dist') {
  if (!['dist', 'static-preview'].includes(outputDirectory)) throw new Error('Output must be dist or static-preview');
  const output = path.join(projectRoot, outputDirectory);
  const staging = `${output}.next`;
  await rm(staging, { recursive: true, force: true });
  await mkdir(staging, { recursive: true });
  try {
    await cp(path.join(projectRoot, 'public'), staging, { recursive: true, dereference: false });
    await cp(path.join(projectRoot, 'src/styles/global.css'), path.join(staging, 'styles.css'));
    let pageCount = 0;
    async function save(route, html) {
      const filename = path.join(staging, route === '/404.html' ? '404.html' : `${route.slice(1)}index.html`);
      await mkdir(path.dirname(filename), { recursive: true });
      await writeFile(filename, html);
      pageCount += 1;
    }
    for (const lang of ['en', 'zh-tw']) {
      await save(localUrl('/', lang), homePage(lang));
      await save(localUrl('/about', lang), aboutPage(lang));
      for (const category of ['research', 'projects']) await save(localUrl(`/${category}`, lang), listingPage(lang, category));
      for (const work of [...research, ...projects]) {
        const article = await readFile(path.join(projectRoot, 'src/content', lang, `${work.slug}.html`), 'utf8');
        await save(localUrl(`/${work.route}/${work.slug}`, lang), detailPage(lang, work, article));
      }
    }
    // Keep the existing Chinese homepage URL usable; its canonical points to /.
    await save('/zh-tw/', homePage('zh-tw'));
    await save('/404.html', notFoundPage());
    const absolute = (route, lang) => new URL(localUrl(route, lang), identity.website).href;
    const entries = siteRoutes.flatMap(route => ['en', 'zh-tw'].map(lang => `<url><loc>${e(absolute(route, lang))}</loc>
      <xhtml:link rel="alternate" hreflang="en" href="${e(absolute(route, 'en'))}"/>
      <xhtml:link rel="alternate" hreflang="zh-Hant-TW" href="${e(absolute(route, 'zh-tw'))}"/>
      <xhtml:link rel="alternate" hreflang="x-default" href="${e(absolute(route, 'zh-tw'))}"/></url>`));
    await writeFile(path.join(staging, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
    await writeFile(path.join(staging, '.nojekyll'), '');
    await rm(output, { recursive: true, force: true });
    await rename(staging, output);
    console.log(`Built ${pageCount} HTML pages + sitemap in ${outputDirectory}/ (no packages required).`);
    return output;
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--outDir')) throw new Error('Usage: node scripts/build.mjs [--outDir static-preview]');
  await build(args[1] || 'dist');
}
