# 網站設計規範：傳統教授個人學術網頁

## 1. 設計目標

使用者明確希望「像老教授自己寫出來的、極簡但有濃厚學術感的網頁」。這是一種**刻意選擇的資訊優先設計**，不是要用新潮科技產品頁面取代。

好例子概念：90 年代後期至今常見的教授個人網站，簡潔但可讀、有研究引用、所有內容一眼找到；不必真的複製過時的 HTML 寫法，現代 HTML 與無障礙仍要做好。

## 2. 必須保留

- 白底／深灰至黑色文字；傳統藍色、常態底線的超連結。
- 單欄文件式閱讀布局，合理 `max-width`、左對齊；手機正常換行。
- 標題、段落、清楚的條列、作者—題名—期刊—年份、研究結果表格。
- 普通文字導覽：Home / Publications / Software / CV / 中文切換。
- 研究內容真有需要時，才加入方法架構圖或數據表，且有圖說與替代文字。
- 英文及繁體中文兩版內容一致；語言切換留在對應頁面。
- 快速載入、語意化 HTML、鍵盤操作、合適色彩對比、列印樣式、SEO 基本資料。

## 3. 禁止（沒有使用者重新指定，不要加入）

- 深色全頁背景、鮮豔主題色、漸層、玻璃擬態、發光、動畫、視差、影片 Hero。
- 大型品牌標語、Marketing CTA、下載按鈕排排站、Emoji／Lucide 裝飾圖示。
- 彩色功能卡片、Dashboard、Bento Grid、技能熟練度進度條、Stars/訪問計數。
- 顯眼的大幅個人大頭照或擬人化 Logo、自動載入的商業圖片／外部字型。使用者於 2026-11-22 明確要求加入完整原圖的小幅個人照片；允許首頁姓名與聯絡資訊旁顯示 160px 方形照片，手機版 128px，不裁切、不加裝飾。
- 為純靜態網站引入 React／Vue、巨型 JS 框架、動態伺服器或 CMS。

## 4. 建議資訊架構

2026-11-21 使用者另外授權 linecover 演算法互動示範：獨立的中英文
`/projects/linecover/demo/` 頁面可使用 raylib／WebAssembly 與主動啟動的逐步播放。
沿用白底、文件式排版與原生控制項。這不改變一般學術頁面不加入裝飾動畫或大型 JS 的原則。

```text
/                 繁體中文預設首頁
/en/              英文首頁：姓名、學校／研究室、聯絡、簡介、研究興趣、論文與研究、程式專案、學歷
/research/        學術論文／研究列表
/research/accisage/
/research/pcb-coverage/
/projects/        軟體專案列表
/projects/dldr/
/projects/linecover/
/projects/med-sched/
/about/           學歷、研究經歷、技能、英語能力、聯絡
/zh-tw/...        繁體中文鏡像
```

使用者於 2026-11-21 將預設語言改為繁體中文。`/zh-tw/` 保留為中文首頁別名，canonical 指向 `/`；其餘中英文內容網址不變。雙語頁面及 sitemap 的 `x-default` 指向中文版本。

注意 `/research/` 既有頁內包含研究 manuscript，若導覽寫 Publications，應避免讓讀者誤以為兩項都已正式出版。可改成 `Research` 或 `Research & Publications`，或在列表中清楚區別 publication status。

## 5. 視覺參考

交接包的 `preview-images/academic-desktop.png`、`academic-mobile.png`、`academic-chinese.png` 是 **既有 Academic V2** 的畫面快照，不是新增設計需求；可用來比對未來是否偏離風格。

## 6. 實作原則

- 使用原生 HTML/CSS 與 Node.js 內建功能產生靜態檔案；依使用者於 2026-11-21 的要求，已移除 Astro 與 TypeScript，不加入非必要框架或依賴。
- 排版細節（行高、字距、標題間距、引用縮排）可以細緻，但不應搶掉研究內容。
- 依真實內容調整資訊排序，減少重複：AcciSAGE 和 PCB 研究各有正式介紹，linecover 應連回 PCB 論文。
- 人名、學位、英文名拼法、作者順序與數據是高優先級的正確性項目。
