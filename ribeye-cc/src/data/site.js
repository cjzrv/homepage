/** Shared bilingual identity, research and software records. */
export const bi = (en, zh) => ({ en, 'zh-tw': zh });
export const tr = (t, language) => t[language];
export function localUrl(path, language) {
    const normalized = '/' + path.replace(/^\/+|\/+$/g, '');
    const suffix = normalized === '/' ? '/' : normalized + '/';
    if (suffix === '/') return language === 'en' ? '/en/' : '/';
    return language === 'en' ? suffix : '/zh-tw' + suffix;
}
export function alternateUrl(path, language) {
    return localUrl(path, language === 'en' ? 'zh-tw' : 'en');
}
export const identity = {
    name: 'Chun-Jie Zhuang', chineseName: '莊淳傑',
    email: 'cjz89k@gmail.com', website: 'https://ribeye.cc',
    github: [{ label: 'cjzrv', href: 'https://github.com/cjzrv' }, { label: 'ribeye0', href: 'https://github.com/ribeye0' }],
};
const linecoverDemoRoute = '/projects/linecover/demo/';
const accisageThesis = {
    href: 'https://hdl.handle.net/11296/u6rz3a',
    title: bi('Spatio-Temporal Traffic Accident Grounding in Surveillance Videos via Error-Aware VLM Tuning', '交通事故影片時空定位之誤差導向視覺語言模型微調方法'),
};
export const research = [
    {
        slug: 'accisage', route: 'research', title: 'AcciSAGE',
        translatedTitle: bi('AcciSAGE: Spatio-Temporal Accident Grounding in Surveillance Videos via Error-Aware VLM Tuning', 'AcciSAGE：交通事故影片時空定位之誤差導向視覺語言模型微調方法'),
        subtitle: bi('Spatio-Temporal Accident Grounding in Surveillance Videos via Error-Aware VLM Tuning', '交通事故影片時空定位之誤差導向視覺語言模型微調方法'),
        publicationStatus: 'manuscript',
        category: bi('Master’s research · Manuscript', '碩士研究 · 研究稿件'),
        summary: bi('Error-aware vision-language model tuning for temporal, spatial, and collision-type grounding in surveillance accident videos.', '針對監視器事故影片的時間、空間與事故類型定位，提出誤差導向的視覺語言模型微調方法。'),
        year: '2026', tags: ['Qwen3-VL', 'LoRA', 'SAPO', 'Computer Vision'],
        video: {
            src: '/media/accisage-introduction.mp4', poster: '/images/accisage-video-poster.jpg',
            width: 1280, height: 720, duration: '1:51',
            summary: bi('A research introduction showing global-to-local accident grounding, task-specific LoRA adapters, SAPO refinement, and accident case demonstrations.', '介紹全域至局部的事故定位流程、各任務的 LoRA adapter、SAPO 精煉，以及事故影片案例。'),
        },
        thesis: accisageThesis,
        links: [
            { label: bi('Master’s thesis', '碩士論文'), href: accisageThesis.href },
            { label: bi('Source code', '原始碼'), href: 'https://github.com/cjzrv/accisage' },
        ],
    },
    {
        slug: 'pcb-coverage', route: 'research', title: 'Highly efficient PCB copper pour coverage method',
        translatedTitle: bi('Highly efficient PCB copper pour coverage method', '高效的 PCB 銅面覆蓋法'),
        publicationStatus: 'published',
        publication: { venue: bi('Minghsin Journal', '《明新學報》'), volume: '47', pages: '1–8' },
        category: bi('Journal article · Minghsin Journal', '期刊論文 · 明新學報'),
        summary: bi('A geometry-based coverage strategy designed to reduce brush travel distance and overlap when filling PCB copper regions.', '以幾何方法降低 PCB 銅面覆蓋過程的筆刷移動距離與重疊面積。'),
        year: '2024', tags: ['Computational Geometry', 'Algorithms', 'PCB', 'C++'],
        demoRoute: linecoverDemoRoute,
        links: [
            { label: bi('Journal article', '期刊收錄頁面'), href: 'https://www.airitilibrary.com/Article/Detail/1728760X-N202404170002-90060' },
            { label: bi('Implementation', '程式實作'), href: 'https://github.com/cjzrv/linecover' },
        ],
    }
];
export const projects = [
    {
        slug: 'dldr', route: 'projects', title: 'DLDR — DLsite Downloader',
        category: bi('Cross-platform desktop app', '跨平台桌面應用程式'),
        summary: bi('A desktop application for searching, downloading, organizing, and playing purchased DLsite works, with an integrated CLI and subtitle-aware audio player.', '針對已購買 DLsite 作品的跨平台下載與管理程式，整合命令列工具、標籤搜尋與同步字幕音訊播放器。'),
        year: '2026', tags: ['Rust', 'Tauri', 'Svelte', 'SQLite'],
        links: [{ label: bi('GitHub', 'GitHub'), href: 'https://github.com/ribeye0/dldr' }, { label: bi('Releases', '下載版本'), href: 'https://github.com/ribeye0/dldr/releases/latest' }],
    },
    {
        slug: 'linecover', route: 'projects', title: 'linecover',
        category: bi('Undergraduate project · Interactive algorithm demo', '畢業專題 · 演算法互動展示'),
        summary: bi('A C++ implementation of PCB coverage algorithms with a browser-based interactive demo: compare two methods, generate random shapes, and inspect brush paths and geometry metrics.', '以 C++ 實作 PCB 銅面覆蓋演算法，提供網頁互動展示，可比較兩種方法、隨機生成圖形，並觀察筆刷路徑與幾何指標。'),
        year: '2024', tags: ['C++', 'raylib', 'WebAssembly', 'Computational Geometry'],
        demoRoute: linecoverDemoRoute,
        links: [{ label: bi('GitHub', 'GitHub'), href: 'https://github.com/cjzrv/linecover' }],
    },
];
export const workTitle = (work, lang) => work.translatedTitle ? tr(work.translatedTitle, lang) : work.title;
export const researchGroups = [
    { status: 'manuscript', title: bi('Graduate research', '碩士研究') },
    { status: 'published', title: bi('Journal article', '期刊論文') },
];
export const siteRoutes = ['/', '/research/', ...research.map(work => `/research/${work.slug}/`), '/projects/', ...projects.map(work => `/projects/${work.slug}/`), linecoverDemoRoute, '/about/'];
