import { layout } from './layout.js';
import { localUrl } from './data/site.js';

export function linecoverDemo(lang) {
  const zh=lang==='zh-tw';
  const t=(a,b)=>zh?a:b;
  const controls=`<fieldset id="demo-controls" disabled>
    <legend>${t('圖形與覆蓋設定','Shape and coverage')}</legend>
    <div class="demo-fields demo-case-row">
      <label>${t('案例','Case')} <select id="demo-case">
        ${['一般三角形|Triangle','狹長三角形|Slender triangle','尖角三角形|Acute triangle','梯形|Trapezoid'].map((v,i)=>`<option value="${i}">${v.split('|')[zh?0:1]}</option>`).join('')}
        <option value="-1" disabled>${t('自訂圖形','Custom shape')}</option>
      </select></label>
      <div class="demo-button-group" role="group" aria-label="${t('隨機產生圖形','Generate a random shape')}">
        <button type="button" id="demo-random-triangle" aria-describedby="demo-random-help">${t('隨機三角形','Random triangle')}</button>
        <button type="button" id="demo-random-trapezoid" aria-describedby="demo-random-help">${t('隨機梯形','Random trapezoid')}</button>
      </div>
    </div>
    <div class="demo-fields demo-parameters">
      <label>${t('最小筆刷半徑','Minimum radius')} <input id="demo-radius" type="number" min="1" max="40" step="1" value="7"></label>
      <label>${t('半徑計算','Radius calculation')} <select id="demo-precision"><option value="0">${t('浮點幾何','Continuous geometry')}</option><option value="1">${t('原始半徑取整規則','Original radius rounding')}</option></select></label>
      <button type="button" id="demo-apply">${t('套用設定','Apply settings')}</button>
    </div>
    <div class="demo-options">
      <label><input id="demo-zigzag" type="checkbox"> ${t('逐角折返覆蓋','Fill each corner in turn')}</label>
      <label><input id="demo-identify" type="checkbox" checked> ${t('強調筆劃輪廓','Highlight stroke outlines')}</label>
      <label><input id="demo-travel" type="checkbox"> ${t('完整行進軌跡','Show full travel path')}</label>
    </div>
  </fieldset>`;
  const body=`<a class="back-link" href="${localUrl('/projects/linecover',lang)}">linecover</a>
    <h1>${t('PCB 銅面覆蓋：互動示範','PCB coverage: interactive demonstration')}</h1>
    <p>${t('比較 V 字形覆蓋法與張維恩等人（2020）的方法。','Compare the V-shaped method with the reference method of Chang et al. (2020).')}</p>
    <p>${t('兩張圖共用播放控制。先看完整結果，再按「播放」從頭觀察；也可拖曳圖形頂點或隨機產生新案例。','Both panels share playback controls. Start with the complete result, then select Play to watch from the beginning; drag vertices or generate a random shape to explore.')}</p>
    <p id="demo-status" role="status" aria-live="polite">${t('正在載入互動示範…','Loading the interactive demonstration…')}</p>
    <noscript><p>${t('互動示範需要 JavaScript 與 WebAssembly；研究方法及原始結果仍可在','This demonstration needs JavaScript and WebAssembly. Read the method and original results on the ')}<a href="${localUrl('/research/pcb-coverage',lang)}">${t('論文介紹頁','research page')}</a>。</p></noscript>
    ${controls}
    <section class="demo-workspace" aria-labelledby="demo-comparison-heading">
      <h2 id="demo-comparison-heading">${t('覆蓋過程比較','Compare the coverage process')}</h2>
    <fieldset id="demo-playback" disabled>
      <legend>${t('同步播放 A 與 B','Play A and B together')}</legend>
      <div class="demo-fields demo-playback-actions">
        <button type="button" id="demo-play" class="demo-play-primary" aria-controls="demo-canvas">${t('播放','Play')}</button>
        <button type="button" id="demo-back">${t('上一步','Previous step')}</button>
        <button type="button" id="demo-next">${t('下一步','Next step')}</button>
        <button type="button" id="demo-reset">${t('回到起點','Go to start')}</button>
        <button type="button" id="demo-finish">${t('顯示全部','Show all')}</button>
        <label>${t('速度','Speed')} <select id="demo-speed"><option value="2">2 ${t('筆／秒','strokes/s')}</option><option value="6" selected>6 ${t('筆／秒','strokes/s')}</option><option value="15">15 ${t('筆／秒','strokes/s')}</option></select></label>
      </div>
      <label class="demo-progress">${t('筆劃進度','Stroke progress')} <input id="demo-progress" type="range" min="0" max="1" value="0"> <output id="demo-progress-text">0 / 0</output></label>
    </fieldset>
    <figure class="demo-figure">
      <div id="demo-canvas-wrap"><canvas id="demo-canvas" width="1000" height="410" tabindex="0" aria-label="${t('兩種覆蓋方法的比較圖，可拖曳編號頂點；亦可用下方欄位編輯','Coverage comparison; drag numbered vertices or use the coordinate fields below')}" aria-describedby="demo-caption">${t('圖形內容的步驟、半徑與結果以文字顯示於下方。','Step, radius and result values are available as text below.')}</canvas><svg id="demo-annotations" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg></div>
      <figcaption id="demo-caption">${t('A：本研究 V 字形覆蓋法；B：比較方法。兩圖使用相同案例，圖外數字為可拖曳的頂點編號。','A: V-shaped method; B: reference method. Both panels use the same case. Numbers outside the shape mark draggable vertices.')}</figcaption>
    </figure>
      <p id="demo-step" class="small"></p>
      <details class="demo-details demo-legend">
        <summary>${t('操作說明與圖例','Instructions and legend')}</summary>
      <p>${t('A：本研究 V 字形覆蓋法。B：比較方法。啟用「強調筆劃輪廓」時，以循環色彩及完整輪廓區分每筆；紅色粗輪廓與白色襯線標示當前筆劃，中心箭頭表示落筆方向。圖形外的數字為頂點編號。關閉時，藍色為初始覆蓋、赭色為角落填補。色彩不是定量熱圖。','A: V-shaped method. B: reference method. With stroke outlines highlighted, cycling colors and full boundaries distinguish individual strokes. A thick red outline with a white halo marks the current stroke; center arrows show drawing direction. Numbers outside the shape identify vertices. With highlighting off, blue marks the initial fill and ochre marks corner fill. Colors are not a quantitative heatmap.')}</p>    <p class="small">${t('「完整行進軌跡」依實際順序連接筆頭中心：黑色實線為落筆移動、灰色虛線為抬筆轉移（含換半徑時的位移）；綠點為起點，紅點為目前位置。軌跡隨播放進度顯示，按「顯示全部」可看完整路徑。','Show full travel path connects the brush center in execution order: black solid lines show drawing, gray dashed lines show lifted transfers (including radius changes), the green dot marks the start, and the red dot marks the current position. The trace follows playback; select Show all to see the complete route.')}</p>
        <p id="demo-random-help">${t('隨機按鈕會產生新圖形，沿用目前的筆刷與選項；生成案例可在下方下載 JSON 保存。這些是互動探索案例，並非論文的固定面積隨機樣本。梯形的上下底保持水平，也可展開「頂點與案例檔案」以座標編輯。','The random buttons generate a new shape using the current brush settings and options. Save a generated case as JSON below. These exploratory cases are not the paper’s fixed-area random samples. Trapezoid bases stay horizontal; expand Vertices and case files to edit coordinates.')}</p>
      </details>
    </section>
    <section class="article-section"><h2>${t('目前案例的計算結果','Computed results for this case')}</h2>
      <p id="demo-zigzag-summary" class="small" aria-live="polite"></p>
      <p>${t('重點比較覆蓋重疊與總移動，兩者均越低越好；較低的數值以粗體標示。減少幅度以 B 為基準計算。','The main comparisons are coverage overlap and total travel: lower is better, with the lower value in bold. Reductions are relative to B.')}</p>
      <div class="demo-table-wrap"><table class="data-table"><caption>${t('完整圖形的幾何指標；播放時數值不變','Full-result geometry metrics; independent of playback position')}</caption>
        <thead><tr><th scope="col">${t('指標','Metric')}</th><th scope="col">A · ${t('本研究','V-shaped')}</th><th scope="col">B · ${t('比較方法','Reference')}</th></tr></thead>
        <tbody>${[['overlap',t('覆蓋重疊率','Coverage overlap'),t('筆劃面積總和／有效面積','Footprint sum / effective area')],['total',t('含抬筆的總移動／周長','Total travel incl. lifts / perimeter')]].map(([key,label,definition])=>`<tr class="demo-key-metric"><th scope="row">${label}${definition?`<small>${definition}</small>`:''}</th><td><span class="demo-metric-value" id="metric-${key}-0">—</span><small class="demo-metric-comparison" id="metric-${key}-comparison"></small></td><td><span class="demo-metric-value" id="metric-${key}-1">—</span></td></tr>`).join('')}
        ${[['count',t('播放筆劃數','Playback stroke count')],['perimeter',t('圖形周長（單位）','Polygon perimeter (units)')],['drawing-length',t('落筆移動長度（單位）','Drawing travel (units)')],['drawing',t('落筆路徑長／周長（不含抬筆）','Drawing length / perimeter (excluding lifts)')],['lifted',t('抬筆移動長度（單位）','Lifted travel (units)')]].map(([key,label])=>`<tr><th scope="row">${label}</th><td id="metric-${key}-0">—</td><td id="metric-${key}-1">—</td></tr>`).join('')}</tbody>
      </table></div>
      <details class="demo-details"><summary>${t('指標定義與計算範圍','Metric definitions and scope')}</summary>
      <p class="source-note">${t('這是目前案例的新計算結果，不是論文中 1,000 個三角形的統計復現。每個圓角筆劃的面積為 2rL + πr²，接合處按各筆劃分別累計；有效面積扣除最小筆刷無法到達的角尖。落筆比例僅計實線路徑，總移動比例另加虛線的抬筆轉移，兩者都除以圖形周長；圓形蓋印的落筆移動為零。逐角折返只改變順序與方向，因此落筆比例不變，差異會反映在含抬筆的總移動。長度均以筆頭中心計算，不含首次定位、換刷時間或機台加減速。','These are new results for the current case, not a reproduction of the paper’s 1,000-triangle statistics. Each capsule contributes 2rL + πr², counting each stroke separately at joints. Effective area excludes corner tips unreachable by the minimum brush. The drawing ratio counts solid-line travel only; total travel also includes dashed lifted transfers. Both are divided by polygon perimeter. Circular stamps have zero drawing travel. Filling corners in turn changes stroke order and direction, so drawing travel stays the same while total travel can change. All lengths track the brush center and exclude initial positioning, tool-change time and machine acceleration.')}</p>      </details>

    </section>
    <p class="demo-paper-result">${t('論文原始實驗：在三種面積尺度下，相較比較方法，覆蓋重疊率降低 <strong>30.90–91.16%</strong>，正規化移動距離降低 <strong>49.55–50.60%</strong>。這是由論文表 1、表 2 的數值換算，與上方目前案例分開呈現。','Original paper experiment: across three area scales, coverage overlap was <strong>30.90–91.16% lower</strong> and normalized travel was <strong>49.55–50.60% lower</strong> than the comparison method. These reductions are calculated from Tables 1–2, separately from the current case above.')} <a href="${localUrl('/research/pcb-coverage',lang)}#results">${t('查看原始實驗表格與條件','View original tables and experimental conditions')}</a>${t('。','.')}</p>
    <details class="article-section demo-details demo-editor"><summary>${t('頂點與案例檔案','Vertices and case files')}</summary>
      <fieldset id="demo-edit" disabled><legend>${t('以座標編輯（亦支援鍵盤操作）','Coordinate editing (keyboard accessible)')}</legend>
        <div id="demo-vertices" class="demo-vertices"></div>
        <div class="demo-fields"><button type="button" id="demo-update-vertices">${t('套用頂點','Apply vertices')}</button><button type="button" id="demo-download">${t('下載案例與完整筆劃 JSON','Download case and strokes (JSON)')}</button><label>${t('載入 JSON 案例','Load JSON case')} <input id="demo-upload" type="file" accept=".json,application/json"></label></div>
      </fieldset>
      <p class="source-note">${t('頂點範圍：x = 20–580、y = 35–445。案例檔可使用本頁匯出的 JSON，或頂點陣列 [[x,y],…]。不支援凹多邊形或任意四邊形；筆刷無法放入的圖形會拒絕套用。','Vertex range: x = 20–580, y = 35–445. Load an exported JSON file or a vertex array [[x,y],…]. Concave polygons and arbitrary quadrilaterals are unsupported; shapes that cannot fit the brush are rejected.')}</p>
    </details>
    <section class="article-section"><h2>${t('方法與復現範圍','Method and reproduction scope')}</h2>
      <p>${t('同一個 C++ 核心以 raylib 繪圖，經 WebAssembly 在瀏覽器執行。','One C++ core runs in your browser via WebAssembly, with raylib rendering.')}</p>
      <p>${t('浮點幾何模式使用論文的半徑遞推式 Rᵢ₊₁ = Rᵢ(1 − sin(θ/2))/2，直到最小半徑。原始半徑取整模式保留舊程式的初始與遞推半徑取整規則，可能產生細小空隙；它不是 BGI 像素畫面的逐點復刻。兩種模式都移除顯示用途的線寬 +1，並使用一致的幾何圓角筆劃。','Continuous mode uses the paper’s recurrence Rᵢ₊₁ = Rᵢ(1 − sin(θ/2))/2 down to the minimum radius. Original radius rounding preserves the old initial and recursive radius rounding rules and may produce small gaps; it does not reproduce BGI pixels. Both modes remove the display-only +1 line width and use consistent geometric capsules.')}</p>
      <p>${t('「逐角折返覆蓋」適用三角形與本示範支援的梯形。每個角先沿同一側由大筆刷縮至最小，再從角尖沿另一側由小到大返回，如同描繪簡筆聖誕樹的兩側。保留原本的 V 字形半徑序列與全部覆蓋筆劃，只調整處理順序與每筆方向；不會先繞完整圈，也不會每換一次半徑就換側。程式比較角落順序與兩種繞行方向，並為固定順序選擇較短的抬筆銜接；這不是所有可能路徑的全域最佳解。灰色虛線包含換半徑時的中心轉移，節省量以本案例實算。','Filling each corner in turn works for triangles and the supported trapezoids. At each corner, finish one side from the largest brush down to the minimum, then return along the other side from small to large, like tracing the two sides of a simple Christmas tree. The original V-shaped radii and every coverage stroke are preserved; only their order and direction change. The initial perimeter is distributed among corners, and the side changes only after reaching the minimum brush. The program compares corner orders and both boundary directions, choosing shorter lifted connections for each fixed order; this is not a global optimum over every possible path. Gray dashed lines include brush-center relocations when changing radius. Savings are computed for the current case.')}</p>
      <p><a href="${localUrl('/research/pcb-coverage',lang)}">${t('論文方法與原始實驗表格','Research method and original result tables')}</a> · <a href="https://github.com/cjzrv/linecover">${t('原始 BGI 程式','Original BGI implementation')}</a> · <a href="/demos/linecover/THIRD_PARTY.txt">${t('第三方軟體授權','Third-party notices')}</a></p>
    </section>`;
  return layout({lang,title:zh?'linecover 互動示範':'linecover interactive demo',description:zh?'使用 C++、raylib 與 WebAssembly，比較 PCB 銅面覆蓋演算法，支援頂點編輯與逐步播放。':'Compare PCB coverage algorithms with C++, raylib and WebAssembly, editable vertices and step-by-step playback.',current:'projects',route:'/projects/linecover/demo',demo:true},body);
}
