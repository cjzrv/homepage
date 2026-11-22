import { identity, research, projects, researchGroups, localUrl, workTitle, tr } from './data/site.js';
import { profile } from './data/profile.js';
import { escapeHtml as e, link } from './html.js';
import { layout } from './layout.js';

const detailsUrl = (work, lang) => localUrl(`/${work.route}/${work.slug}`, lang);
const workLinks = (work, lang) => work.links.map(item => link(item.href, `[${tr(item.label, lang)}]`)).join(' ');
const emailLink = () => link(`mailto:${identity.email}`, identity.email);
const list = items => `<ol class="entry-list">${items.join('\n')}</ol>`;
const section = (title, content) => `<section><h2>${e(title)}</h2>${content}</section>`;

function publication(work, lang) {
  const { venue, volume, pages } = work.publication;
  return `<cite>${e(tr(venue, lang))}</cite>, ${e(volume)}, ${lang === 'zh-tw' ? '頁' : 'pp.'} ${e(pages)} (${e(work.year)}).`;
}

function workEntry(work, lang) {
  const zh = lang === 'zh-tw';
  const url = detailsUrl(work, lang);
  return `<li class="entry">
    <p class="entry-citation">${link(url, workTitle(work, lang), 'class="entry-title"')}.</p>
    <p class="entry-metadata">${work.publicationStatus === 'published' ? publication(work, lang) : `${e(tr(work.category, lang))} (${e(work.year)}).`}</p>
    <p class="entry-summary">${e(tr(work.summary, lang))}</p>
    <p class="entry-links">${link(url, zh ? '[詳細內容]' : '[details]')}${work.video ? link(`${url}#video`, zh ? '[介紹影片]' : '[video]') : ''}${workLinks(work, lang)}</p>
  </li>`;
}

function researchEntries(lang, heading = 'h3') {
  return researchGroups.map(group => `<section class="research-group">
    <${heading}>${e(tr(group.title, lang))}</${heading}>
    ${list(research.filter(work => work.publicationStatus === group.status).map(work => workEntry(work, lang)))}
  </section>`).join('\n');
}

export function homePage(lang) {
  const zh = lang === 'zh-tw';
  const body = `<section class="home-intro">${profile.introduction.map(text => `<p>${e(tr(text, lang))}</p>`).join('')}</section>
    ${section(zh ? '研究興趣' : 'Research interests', `<p class="interests">${e(tr(profile.interests, lang))}</p>`)}
    ${section(zh ? '研究與論文' : 'Research and publications', `${researchEntries(lang)}<p class="small">${link(localUrl('/research', lang), zh ? '研究成果與實驗詳情' : 'Research details and experimental results')}</p>`)}
    ${section(zh ? '軟體作品' : 'Software', list(projects.map(work => workEntry(work, lang))))}
    ${section(zh ? '學歷' : 'Education', `<ul class="simple-timeline">${profile.education.map(item => `<li><span class="date">${e(item.period)}</span> <strong>${e(tr(item.institution, lang))}</strong>${tr(item.shortDegree, lang) ? ` — ${e(tr(item.shortDegree, lang))}` : ''}</li>`).join('')}</ul>
      <p><span class="toeic-score" lang="en">TOEIC Listening &amp; Reading: <strong>${e(profile.toeic)}</strong>.</span> <span class="small">${link(localUrl('/about', lang), zh ? '完整履歷' : 'Full CV')}</span></p>`)}
    ${section(zh ? '聯絡方式' : 'Contact', `<p>${zh ? '電子郵件' : 'Email'}: ${emailLink()}</p>`)}`;
  return layout({ lang, current: 'home' }, body);
}

export function listingPage(lang, category) {
  const zh = lang === 'zh-tw';
  const isResearch = category === 'research';
  const title = isResearch ? (zh ? '研究與論文' : 'Research and publications') : (zh ? '軟體專案' : 'Software projects');
  const description = isResearch
    ? (zh ? '莊淳傑的已刊登論文與碩士研究：PCB 銅面覆蓋法，以及視覺語言模型的事故影片時空定位。' : 'Published work and graduate research by Chun-Jie Zhuang, spanning PCB coverage algorithms and vision-language models for accident video grounding.')
    : (zh ? '莊淳傑的公開軟體專案：DLDR 桌面應用程式、linecover 幾何演算法實作與個人工具。' : 'Software by Chun-Jie Zhuang: the DLDR desktop application, linecover geometry algorithms, and small personal web tools.');
  return layout({ lang, current: category, route: `/${category}`, title, description }, `
    <div class="page-intro"><h1>${e(title)}</h1><p>${e(description)}</p></div>
    ${isResearch ? researchEntries(lang, 'h2') : list(projects.map(work => workEntry(work, lang)))}`);
}

export function aboutPage(lang) {
  const zh = lang === 'zh-tw';
  const accisage = research.find(work => work.slug === 'accisage');
  const pcb = research.find(work => work.slug === 'pcb-coverage');
  const title = zh ? '履歷' : 'Curriculum vitae';
  const description = zh ? '莊淳傑的學歷、論文與研究、技術能力及聯絡方式。' : 'Education, research, technical skills, and contact information for Chun-Jie Zhuang.';
  const body = `<div class="page-intro"><h1>${e(title)}</h1>
      <p>${e(zh ? '莊淳傑（Chun-Jie Zhuang）。人工智慧研究、演算法與軟體工程。' : 'Chun-Jie Zhuang (莊淳傑). Artificial intelligence research, algorithms, and software engineering.')}</p>
      <p class="small"><button type="button" class="text-action" data-print>${zh ? '[列印／另存為 PDF]' : '[Print / Save as PDF]'}</button></p>
    </div>
    ${section(zh ? '學歷' : 'Education', `<ul class="cv-list">${profile.education.map(item => `<li><span class="cv-date">${e(item.period)}</span> <strong>${e(tr(item.institution, lang))}</strong>${tr(item.degree, lang) ? ` — ${e(tr(item.degree, lang))}` : ''}</li>`).join('')}</ul>`)}
    ${section(zh ? '論文與研究' : 'Research', `<ul class="cv-list">
      <li><strong>AcciSAGE</strong> (${e(accisage.year)}). ${e(zh ? '碩士論文與研究稿件，附公開參考實作。' : 'Master’s thesis and research manuscript with a public reference implementation.')} ${link(detailsUrl(accisage, lang), zh ? '[詳情]' : '[details]')}${accisage.thesis ? ` ${link(accisage.thesis.href, zh ? '[碩士論文]' : '[master’s thesis]')}` : ''}${accisage.video ? ` ${link(`${detailsUrl(accisage, lang)}#video`, zh ? '[研究介紹影片]' : '[research video]')}` : ''}</li>
      <li><strong>${e(workTitle(pcb, lang))}</strong> (${e(pcb.year)}). ${e(zh ? `${tr(pcb.publication.venue, lang)}，${pcb.publication.volume}，${pcb.publication.pages} 頁。` : `${tr(pcb.publication.venue, lang)}, ${pcb.publication.volume}, pp. ${pcb.publication.pages}.`)} ${link(detailsUrl(pcb, lang), zh ? '[詳情]' : '[details]')}</li>
    </ul>`)}
    ${section(zh ? '技術能力' : 'Technical skills', `
      <p><strong>${zh ? '研究領域' : 'Research areas'}:</strong> ${e(profile.researchAreas.join(', '))}.</p>
      <p><strong>${zh ? '程式語言' : 'Programming languages'}:</strong> ${e(profile.programmingLanguages.join(', '))}.</p>
      <p><strong>${zh ? '工具' : 'Tools'}:</strong> ${e(profile.tools.join(', '))}.</p>
      <p>${e(tr(profile.linuxExperience, lang))}</p>`)}
    ${section(zh ? '英語能力' : 'English proficiency', `<p>TOEIC Listening &amp; Reading: <strong>${e(profile.toeic)}</strong>.</p>`)}
    ${section(zh ? '聯絡方式' : 'Contact', `<p>Email: ${emailLink()}<br>GitHub: ${identity.github.map(item => link(item.href, item.label)).join(', ')}</p>`)}`;
  return layout({ lang, current: 'about', route: '/about', title, description, print: true }, body);
}

function videoSection(work, lang) {
  if (!work.video) return '';
  const zh = lang === 'zh-tw';
  const video = work.video;
  return `<section class="article-section video-section" id="video" aria-labelledby="video-heading">
    <h2 id="video-heading">${zh ? '研究介紹影片' : 'Research introduction video'}</h2>
    <p id="video-description">${e(tr(video.summary, lang))}</p>
    <figure><video class="research-video" controls playsinline preload="none" poster="${e(video.poster)}" width="${e(video.width)}" height="${e(video.height)}" aria-labelledby="video-heading" aria-describedby="video-description">
      <source src="${e(video.src)}" type="video/mp4">
      <p>${zh ? '瀏覽器不支援影片播放。' : 'Your browser does not support embedded video.'} ${link(video.src, zh ? '開啟 MP4 影片' : 'Open the MP4 video')}.</p>
    </video><figcaption>AcciSAGE · ${e(video.duration)} · ${zh ? '影片內含英文文字與字幕' : 'English on-screen text and subtitles'}</figcaption></figure>
    <p class="small">${link(video.src, zh ? '開啟 MP4 影片' : 'Open the MP4 video')} · ${link(video.src, zh ? '下載影片' : 'Download video', 'download="accisage-introduction.mp4"')}</p>
  </section>`;
}

function researchStatus(work, lang) {
  if (work.slug !== 'accisage') return '';
  const zh = lang === 'zh-tw';
  return `<section class="article-section"><h2>${zh ? '研究狀態與論文典藏' : 'Research status and thesis record'}</h2>
    <p>${zh ? '2026 年碩士研究；研究稿件與公開參考實作。' : 'Master’s research, 2026. Manuscript with a public reference implementation.'}</p>
    ${work.thesis ? `<p>${zh ? '碩士論文：' : 'Master’s thesis: '}${link(work.thesis.href, tr(work.thesis.title, lang))}${zh ? '。國立臺北科技大學，2026。典藏於臺灣博碩士論文知識加值系統。' : '. National Taipei University of Technology, 2026. Record in Taiwan’s National Digital Library of Theses and Dissertations.'}</p>` : ''}
  </section>`;
}

export function detailPage(lang, work, article) {
  const zh = lang === 'zh-tw';
  const title = workTitle(work, lang);
  const subtitle = work.subtitle ? `<p class="detail-subtitle">${e(tr(work.subtitle, lang))}</p>` : '';
  const translation = work.slug === 'pcb-coverage' ? `<p class="detail-subtitle" lang="${zh ? 'en' : 'zh-Hant'}">${e(workTitle(work, zh ? 'en' : 'zh-tw'))}</p>` : '';
  const backLabel = work.route === 'research' ? (zh ? '研究與論文' : 'Research and publications') : (zh ? '軟體專案' : 'Software projects');
  const body = `${link(localUrl(`/${work.route}`, lang), backLabel, 'class="back-link"')}
    <div class="page-intro"><h1>${e(work.slug === 'accisage' ? work.title : title)}</h1>${subtitle}${translation}
      <p class="detail-meta">${e(tr(work.category, lang))} · ${e(work.year)} · ${e(work.tags.join(', '))}</p>
      <p>${e(tr(work.summary, lang))}</p>
      <p class="detail-links">${work.video ? link('#video', zh ? '[介紹影片]' : '[video]') : ''}${workLinks(work, lang)}</p>
    </div>
    ${videoSection(work, lang)}
    ${article}
    ${researchStatus(work, lang)}
    <section class="article-section"><h2>${zh ? '相關連結' : 'Links'}</h2><p>${workLinks(work, lang)}</p><p class="small">${zh ? '聯絡：' : 'Contact:'} ${emailLink()}</p></section>`;
  return layout({ lang, current: work.route, route: `/${work.route}/${work.slug}`, title, description: tr(work.summary, lang) }, body);
}

export function notFoundPage() {
  return layout({ lang: 'zh-tw', route: '/404', title: '找不到此頁面', noindex: true }, `
    <h1>找不到此頁面</h1>
    <p>網址可能已變更。請返回<a href="/">中文首頁</a>，或瀏覽<a href="/zh-tw/research/">研究與論文</a>及<a href="/zh-tw/projects/">軟體專案</a>。</p>
    <section lang="en"><h2>Page not found</h2><p>The address may have changed. You can return to the <a href="/en/">English homepage</a> or browse <a href="/research/">research</a> and <a href="/projects/">software</a>.</p></section>`);
}
