import { identity, localUrl, alternateUrl } from './data/site.js';
import { escapeHtml as e, link } from './html.js';

/** Only the common document shell; article content is supplied by the page renderer. */
export function layout({ lang, title, description, current = 'home', route = '/', noindex = false, print = false }, content) {
  const zh = lang === 'zh-tw';
  const displayName = zh ? `${identity.chineseName}（${identity.name}）` : identity.name;
  const pageTitle = title ? `${title} | ${displayName}` : `${identity.name} (莊淳傑)`;
  const pageDescription = description || (zh ? '莊淳傑的學術個人網站：電腦視覺、演算法研究與軟體開發。' : 'Academic homepage of Chun-Jie Zhuang. Research in computer vision and algorithms; software projects.');
  const canonical = new URL(localUrl(route, lang), identity.website).href;
  const alternate = new URL(alternateUrl(route, lang), identity.website).href;
  const navigation = [
    ['home', zh ? '首頁' : 'Home', '/'],
    ['research', zh ? '研究與論文' : 'Research', '/research'],
    ['projects', zh ? '軟體專案' : 'Software', '/projects'],
    ['about', zh ? '履歷' : 'CV', '/about'],
  ];
  const nameTag = route === '/' ? 'h1' : 'p';
  return `<!doctype html>
<html lang="${zh ? 'zh-Hant-TW' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${e(pageDescription)}">
  <meta name="author" content="${e(identity.name)}">
  <meta name="theme-color" content="#ffffff">
  ${noindex ? '<meta name="robots" content="noindex, follow">' : ''}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${e(pageTitle)}">
  <meta property="og:description" content="${e(pageDescription)}">
  <meta property="og:url" content="${e(canonical)}">
  <meta property="og:locale" content="${zh ? 'zh_TW' : 'en_US'}">
  <meta property="og:locale:alternate" content="${zh ? 'en_US' : 'zh_TW'}">
  <meta property="og:site_name" content="${e(identity.name)}">
  ${noindex ? '' : `<link rel="canonical" href="${e(canonical)}">
  <link rel="alternate" hreflang="en" href="${e(zh ? alternate : canonical)}">
  <link rel="alternate" hreflang="zh-Hant-TW" href="${e(zh ? canonical : alternate)}">
  <link rel="alternate" hreflang="x-default" href="${e(new URL(localUrl(route, 'en'), identity.website).href)}">`}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/styles.css">
  <title>${e(pageTitle)}</title>
  ${print ? '<script src="/print.js" defer></script>' : ''}
</head>
<body>
  ${link('#main', zh ? '跳到內容' : 'Skip to content', 'class="skip-link"')}
  <header class="site-header container">
    <${nameTag} class="header-name">${link(localUrl('/', lang), zh ? identity.chineseName : identity.name)}</${nameTag}>
    <p class="header-native" lang="${zh ? 'en' : 'zh-Hant'}">${e(zh ? identity.name : identity.chineseName)}</p>
    <p class="header-affiliation">${e(zh ? '國立臺北科技大學 人工智慧科技碩士' : 'M.S. in Artificial Intelligence Technology, National Taipei University of Technology')}</p>
    <p class="header-affiliation">${e(zh ? '碩士研究：機器人視覺實驗室（Robot Vision Lab），2024–2026' : 'Graduate research: Robot Vision Lab, 2024–2026')}</p>
    <p class="header-contacts">${link(`mailto:${identity.email}`, identity.email)}${identity.github.map(item => link(item.href, `GitHub (${item.label})`)).join('')}</p>
    <nav class="plain-nav" aria-label="${zh ? '主要導覽' : 'Main navigation'}">
      ${navigation.map(([key, label, href]) => link(localUrl(href, lang), label, !noindex && current === key ? 'aria-current="page"' : '')).join('\n      ')}
      ${link(alternateUrl(noindex ? '/' : route, lang), zh ? 'English' : '繁體中文', `class="nav-language" lang="${zh ? 'en' : 'zh-Hant'}" hreflang="${zh ? 'en' : 'zh-Hant-TW'}"`)}
    </nav>
  </header>
  <main class="container" id="main" tabindex="-1">${content}</main>
  <footer class="site-footer container"><div class="footer-inner"><span>© ${new Date().getFullYear()} ${e(identity.name)} · ${link(localUrl('/', lang), 'ribeye.cc')}</span></div></footer>
</body>
</html>\n`;
}
