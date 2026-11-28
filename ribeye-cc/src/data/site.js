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
    github: [{ label: 'cjzrv', href: 'https://github.com/cjzrv' }],
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
        category: bi('Master’s thesis', '碩士論文'),
        summary: bi('AcciSAGE uses a vision-language model to identify when and where a crash occurs in surveillance footage and what type of collision it is.', 'AcciSAGE 使用視覺語言模型，從監視器影片判斷事故何時發生、發生在哪裡，以及屬於哪種碰撞。'),
        figure: {
            src: '/images/accisage-overview.jpg', width: 4073, height: 1167,
            alt: bi('AcciSAGE pipeline for temporal, spatial, and collision-type predictions', 'AcciSAGE 架構圖，呈現事故時間、位置與碰撞類型的預測流程'),
            caption: bi('AcciSAGE uses task-specific adapters to locate and classify crashes.', 'AcciSAGE 以不同任務的 adapter 定位事故並判斷碰撞類型。'),
        },
        finding: bi('On the ACCIDENT IID test set, adding SAPO refinement after supervised fine-tuning raised the composite ACCS score from 0.5390 to 0.5503.', '在 ACCIDENT IID 測試集上，監督式微調後再加入 SAPO 精煉，綜合分數 ACCS 從 0.5390 提升至 0.5503。'),
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
        figure: {
            // Default triangle from linecover-cli, minimum radius 7 and perimeter-first order.
            panels: [
                { title: bi('A. V-shaped method', 'A. V 字形覆蓋法'), src: '/images/linecover-improved.svg',
                    alt: bi('Paired strokes fill the corners of the triangle.', '以成對筆劃填補三角形的角落。'), overlap: '172.88%', travelRatio: '171.10%' },
                { title: bi('B. Prior study (2020)', 'B. 其它研究（2020）'), src: '/images/linecover-reference.svg',
                    alt: bi('Circular brush impressions overlap near the corners of the same triangle.', '在相同三角形的角落可見重疊的圓形筆印。'), overlap: '213.60%', travelRatio: '196.55%' },
            ],
            caption: bi('Both methods use the default triangle with a minimum brush radius of 7. In “Total travel / perimeter”, 100% means the brush travels a total distance equal to the triangle’s perimeter, counting both drawing and lifted moves.', '兩法皆使用預設三角形，最小筆刷半徑為 7。「移動總距離／周長」若為 100%，表示筆刷落筆與抬筆的移動距離加總後，恰好等於三角形的周長。'),
        },
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
    { status: 'published', title: bi('Undergraduate research', '大學專題研究') },
];
export const siteRoutes = ['/', '/research/', ...research.map(work => `/research/${work.slug}/`), '/projects/', ...projects.map(work => `/projects/${work.slug}/`), linecoverDemoRoute, '/about/'];
