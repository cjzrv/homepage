# 零套件依賴重構驗證 — 2026-11-21

## 結果

由既有 Astro Academic V2 接續重構為 **HTML/CSS + Node.js 內建功能**。npm 套件由 273 個降為 0 個；沒有 `dependencies`、`devDependencies`、lockfile 或 `node_modules/`。Node.js 只用於產生靜態頁面與本機預覽，沒有伺服器端部署需求。

原網站本來就輸出靜態 HTML；本次改善主要在安裝、依賴維護與部署流程，而非宣稱移除原本不存在的前端框架下載量。

## 重構內容

- 移除 Astro、TypeScript、Vite 與其間接套件、路由殼檔案、框架設定和舊的靜態預覽入口。
- 版型改為小型 JavaScript 函式；共用資料插入 HTML 時進行文字／屬性跳脫及連結協定驗證。
- 首頁與履歷共用的學歷、技能、介紹集中於 `src/data/profile.js`；研究與作品資料集中於 `src/data/site.js`。
- 詳頁正文移為兩個語言資料夾的普通 HTML，保留實際文字、圖表與數值，不另外維護生成頁面副本。
- 只在履歷頁載入原生列印腳本，其餘頁面不載入頁面 JavaScript；影片保持原生控制、按需載入、無自動播放。
- 以 Node.js 內建 HTTP／檔案 API 提供本機預覽，包含 HEAD、尾斜線轉址、雙語 404、影片 Range 讀取與公開資料夾界線。
- 建置在獨立暫存目錄完成後替換 `dist/`，不把 docs、原始碼或私人 PDF 複製進產物；加入 `.nojekyll`。
- 將 GitHub Pages workflow 移至真正的外層 Git 根目錄；來源仍位於 `ribeye-cc/`，只部署其 `dist/`，無安裝或快取 npm 套件步驟。
- 更新開發、資料與發布文件，排除本機舊草稿與產物，避免提交重複網站。

## 驗證

- 在沒有 `node_modules/`、沒有安裝套件的情況下，`npm run verify` 成功。
- Node 語法與雙語資料檢查通過；所有 import 僅使用相對模組或 `node:` 內建模組。
- 19 個 HTML 頁面通過內部連結、錨點、圖片、表格、影片、SEO、語言互換、sitemap、私人檔案界線檢查。
- 與重構前產物逐頁比對：正文文字（不計不可見 script）、連結、圖片屬性、影片屬性及 metadata 保留。CSS 僅移除未使用的選擇器。
- 保留最新使用者調整：碩士研究排在期刊前、PCB 作者姓名省略、碩士論文典藏與介紹影片、資工所、CV 的技能及 Linux／遠端訓練描述。
- `node:test` 的五組測試通過：兩組驗證文字／URL 跳脫與不可執行的連結協定，三組 HTTP 測試覆蓋轉址、HEAD、404、影片 206／416、非公開檔案路徑與不允許的 HTTP 寫入方法。

- 瀏覽器檢查 1280 × 900、390 × 844、320 × 740 三種視窗下的 18 個中英文內容頁，共 54 次檢查，沒有頁面橫向溢出、h1 數量錯誤或已載入圖片失敗。首頁的 `document.scripts` 為空，CV 僅有 `/print.js`。
- 開發模式以 4322 埠實測：新增及移除臨時靜態資產均自動重建，HTTP 從 200 回到 404，測試檔案已移除，測試用伺服器已停止。
- 根目錄 workflow 已由 YAML parser 讀取並檢查來源／產物相對路徑與部署權限；使用的 checkout／setup-node v7 tag 已向官方 repository 核對。尚未在遠端 runner 實際執行。
- `npm run preview:static` 亦成功；`npm ls --all` 回報空的套件樹。圖片及 MP4 與重構前逐位元組相同。

## 備份與限制

重構前來源與產物已備份於 Git 儲存庫外：`/home/ev/Documents/ChatGPT/ribeye-cc-astro-backup-2026-11-21.tar.gz`。舊依賴與框架快取已移出專案。沒有覆寫或刪除本機 `academic-home/` 舊草稿。

2026-11-21 使用者指定 `cjzrv/homepage`，已連接 SSH remote，首次推送前確認遠端為空。本機再次執行 `npm run verify` 通過。以上重構驗證不代表遠端 Actions、Pages、DNS 或 HTTPS 已驗證；發布狀態需另看 GitHub Actions 與 Pages。網站目前針對 `ribeye.cc` 根目錄，專案 Pages 的 `/homepage/` 子路徑需另外設定或使用自訂網域。

原生系統列印視窗無法由目前內建瀏覽器讀取，A4 實際分頁仍需在一般瀏覽器確認。碩士論文使用永久典藏連結，不代表 ICRA 投稿或接受狀態已確認。
