# linecover: C++ / raylib / WebAssembly

《高效的 PCB 銅面覆蓋法》的現代幾何視覺化實作。原始參考：
[cjzrv/linecover](https://github.com/cjzrv/linecover)，revision `8a46f793d173ef8a4025a108e7febb3d3eb8ebcb`。
這是移除 BGI 耦合後的新實作，不宣稱逐像素復刻或重現原論文統計。

- `include/linecover/core.hpp`、`src/core.cpp`：不依賴圖形函式庫的 C++17 核心。
- `src/cli.cpp`：可離線產生完整筆劃與指標的 CLI。
- `src/viewer.cpp`：共用的 raylib 桌面與瀏覽器繪圖／播放程式。
- `tests/core_test.cpp`：幾何包含、可覆蓋區域、半徑公式、尺度與錯誤輸入檢查。
- 網頁控制項：`../ribeye-cc/public/demos/linecover/demo.js`、`demo.css`。
- 雙語頁面：由網站的 `src/linecover-demo.js` 產生；不另維護第二套 HTML。

網頁圖形以 2–3 倍畫布解析度繪製（依螢幕像素比調整），圓弧分段也依實際像素半徑增加。
標題、進度與頂點編號使用 SVG 向量文字及一般黑體，不使用 raylib 的點陣字型；頂點標記亦為 SVG。
編號沿外側角平分線移出圖形，並將整個文字框所需的間距計入。畫布留白包含外側編號，
拖曳仍使用 CSS 邏輯座標，與高解析度的繪圖緩衝區分開。

網頁提供「逐角折返覆蓋」（預設關閉）、「強調筆劃輪廓」（預設開啟）及「完整行進軌跡」（預設關閉）。
輪廓強調以六色循環、完整圓角輪廓及中心方向箭頭區分筆劃，當前筆劃使用紅色粗輪廓及白色襯線。
關閉後恢復原本依覆蓋階段著色的顯示。「完整行進軌跡」依實際筆劃順序連接筆頭中心，落筆為黑色實線、抬筆轉移為灰色虛線，包含換半徑的中心位移。
綠點標示起點，紅點標示目前位置；圓形蓋印以中心點表示零長度落筆。播放時只顯示已走過的前綴，「顯示全部」展示完整路徑。
不虛構首次定位或結束後返回起點的移動。此選項獨立於輪廓強調，切換不重設進度；播放控制、案例參數與頂點編輯保留。
依作者要求移除筆劃編號、清單、手動選取與淡化選項；圖形外的頂點編號及播放進度仍保留。
顯示選項不改變筆劃幾何、計算指標或案例 JSON。

## 桌面版

需要 CMake 3.20+、C/C++ 編譯器，以及 raylib 所需的平台開發函式庫。
首次建置由 CMake 下載固定 commit 的 raylib 6.0；也可指定本機來源。

```sh
cmake -S linecover -B linecover/build/native -DCMAKE_BUILD_TYPE=Release
cmake --build linecover/build/native --parallel 4
ctest --test-dir linecover/build/native --output-on-failure
./linecover/build/native/linecover
```

桌面操作：Space 播放／暫停、左右方向鍵單步、C 切換案例、R 重設、Z 切換逐角折返覆蓋、I 切換輪廓強調、T 切換完整行進軌跡、滑鼠拖曳頂點。
介面預設不自動播放。完整的參數、文字結果與匯入匯出操作在網頁版提供。

只執行核心與測試（不下載 raylib，也不需要圖形環境）：

```sh
cmake -S linecover -B linecover/build/core -DLINECOVER_VIEWER=OFF
cmake --build linecover/build/core --parallel 4
ctest --test-dir linecover/build/core --output-on-failure
./linecover/build/core/linecover-cli --case triangle --method improved --radius 7
./linecover/build/core/linecover-cli --case trapezoid --method reference --radius 7
```

`--input vertices.txt` 支援每行 `x y` 的三／四頂點檔，包含舊版 save3/save4 格式。
`--original-radius-rules` 啟用原始半徑取整。`--corner-zigzag` 啟用三角形與受支援梯形的逐側走法；比較法不受影響。輸出為 JSON。

## 網頁版與 GitHub Pages

已附上編譯完成的 `.js`、`.wasm`，一般網站預覽仍不需要安裝 npm 套件或 C++ 工具鏈。
執行 `cd ribeye-cc && npm run dev`，開啟：

- 中文：`http://127.0.0.1:4321/zh-tw/projects/linecover/demo/`
- English: `http://127.0.0.1:4321/projects/linecover/demo/`

修改 C++ 後，使用 **Emscripten 4.0.20** 與 **raylib 6.0** 重新建置：

```sh
git clone https://github.com/emscripten-core/emsdk.git /path/to/emsdk
/path/to/emsdk/emsdk install 4.0.20
/path/to/emsdk/emsdk activate 4.0.20
source /path/to/emsdk/emsdk_env.sh
bash linecover/scripts/build-web.sh
cd ribeye-cc
npm run verify
```

本機已有 raylib 時，可加 `-DFETCHCONTENT_SOURCE_DIR_RAYLIB=/path/to/raylib`。
建置腳本複製 runtime 到 `ribeye-cc/public/demos/linecover/`，並寫入來源／產物 SHA-256。
網站驗證會拒絕來源已修改但未重新編譯的 Wasm。GitHub Pages 只接收 `ribeye-cc/dist/`；
不需要執行 C++、Node 伺服器或提供 COOP/COEP 標頭。未使用 pthreads、外部 CDN 或資料上傳。
發布流程仍依網站原有設定保持暫停；此實作不會自動重新公開。

## 演算法與指標定義

支援非退化三角形，以及可容納所選筆刷、內縮邊仍有效的凸梯形。
核心的梯形頂點 0–1 與 2–3 須平行；網頁限制上下底水平，以提供一致的拖曳操作。
不把梯形實作泛稱為任意四邊形覆蓋。網頁座標範圍 x=20–580、y=35–445。

改良法：三角形初始半徑為內切圓半徑的一半；梯形為上下底距離的四分之一。
沿內縮邊畫一圈，再依 `Rnext = Rprevious × (1 − sin(angle/2)) / 2` 以 V 字形填補角落，
最後使用最小筆刷。比較法沿用原始 `cover3` 的半徑序列、圓形蓋印／梯形平行筆劃與最小筆刷描邊。

可選的 **逐角折返覆蓋**（2026-11-22，依作者更正）適用三角形與受支援梯形：
每個角先沿同一側由大筆刷縮至最小，再從角尖沿另一側由小到大返回，像描繪簡筆聖誕樹兩側。
先完成這個角才移到下一角，不在每次換半徑時換側，也不先畫完整初始圈。
初始大筆刷的每條邊分配給一個角；其後兩側都保留原始 `k = (1 − sin(angle/2))/2` 遞推及取整規則。
所有原始圓角筆劃（包含半徑）恰好保留一次，只變更順序與方向，故覆蓋聯集、筆劃數、面積總和及落筆長度不變。
JSON 每筆的 `side` 表示該角的出邊側（0）或入邊側（1）；關閉模式的筆劃以 -1 表示未標註。

角落順序與兩種共同繞行方向會列舉比較（三角形 12 組、梯形 48 組），
每個候選用兩狀態動態規劃選擇各小筆劃的進入端點，減少抬筆銜接；不宣稱所有可能走法的全域最佳。
半徑變更所需的筆刷中心轉移計為抬筆，不額外畫連接線。
開關預設關閉，JSON 的 `cornerZigzag` 保存設定，舊案例缺少此欄位視為關閉。

預設半徑 7、浮點模式下，三個三角形範例的含抬筆總移動分別減少 32.66%、28.73%、33.38%，
梯形範例減少 31.77%。這是新案例計算，不是原論文統計，也不保證所有形狀都有節省；
頁面顯示當前案例實際增加或減少。之前的逐筆換側／√k 版本已依作者更正移除。

模式差異：

- **Continuous geometry（預設）**：使用 double，保留幾何半徑，不為顯示而取整。
- **Original radius rounding**：三角形初始／遞推半徑向下取整、比較法三角形的首個增大半徑 round；
  梯形保留初始整數除法加一與遞推 round。可能留下空隙。
  兩者的圓心均由實際半徑計算，不復刻舊 `calcCenter(int)` 的額外隱式截斷，
  也不加舊圖形顯示的線寬 `+1`。因此是半徑規則比較，不是 BGI 執行結果的逐位元重現。

度量在核心由幾何資料計算，與縮放、反鋸齒及播放位置無關：

- 每筆圓角筆劃面積 `2rL + πr²`；筆劃接合處按各筆劃分別累計。
- 有效面積 `polygonArea − Σ rmin²[cot(angle/2) − (π−angle)/2]`，扣掉不可到達的角尖。
- 面積比為筆劃面積總和／有效面積。它不是筆劃聯集面積。
- 落筆路徑只計落筆時中心移動；圓形蓋印為零。另列相鄰筆劃間的抬筆移動。網頁分別顯示周長、落筆長度與不含抬筆的比例，避免與總移動比例混淆。
- 三角形的兩方法可能有相同落筆比例：此實作中，V 字形各半段長度逐級相消，落筆總長等於最小半徑內縮三角形的周長；比較法的圓形蓋印沒有中心移動，只有最終描邊計入落筆。
  因此 `Ldraw = P × (1 − rmin / rin)`；逐角折返保留全部筆劃，落筆長度不變，節省反映在抬筆與總移動。
  最小半徑 7 的預設三角形：`1094.56049760261 / 1167.60365108251 ≈ 93.744183%`，並非漏算抬筆；抬筆在另一列單獨計量。
  另以 300–400–500 三角形（周長 1200、內切圓半徑 100）的獨立公式 `Ldraw = 1200 − 12rmin` 作回歸檢查。
  這些是展示中筆頭中心路徑的幾何指標，不直接等同原論文的隨機樣本統計。
- V 字的兩段沿同一條連續路徑串接；這個播放順序與舊版兩次從中點出發的繪圖呼叫不同。
  含抬筆總移動比依本實作的確定筆劃順序計算，不宣稱為全域最短路徑。
- 不包含首次定位、換刷、加減速；不把示範的單一案例數值冒充論文的 1,000 個樣本平均。
- 色彩透明度僅協助觀察重疊，不是經校正的重疊次數熱圖。畫面不裁切掉越界以掩蓋錯誤。

原程式的面積累計狀態與梯形重複累計同一筆劃等實作問題在新核心中修正。
原論文的實驗表格保留於網站論文頁；不以這個新評估流程改寫其數值。

第三方授權位於 `../ribeye-cc/public/demos/linecover/THIRD_PARTY.txt`。
