# ribeye.cc — Chun-Jie Zhuang（莊淳傑）

中英文個人學術網站，保留傳統教授首頁的白底、襯線字體、藍色底線連結與單欄排版。**零 npm 套件依賴**；不需要 Astro、TypeScript、前端框架、模板套件或 npm 安裝步驟。

Node.js 只在開發與建置時使用。GitHub Pages 收到的是普通 HTML、CSS、圖片和 MP4。瀏覽器只在履歷頁載入一小段原生列印 JavaScript；其他頁面沒有頁面腳本，影片使用瀏覽器原生播放器。

## 本機使用

需要 Node.js 22 以上，版本提示在 `.nvmrc`。npm 僅提供方便的命令捷徑。

```sh
npm run dev
```

首次產生頁面後啟動 http://127.0.0.1:4321/，根網址直接顯示繁體中文，英文首頁為 `/en/`。既有 `/zh-tw/` 中文入口保留，canonical 指向 `/`；研究、軟體與履歷的中英文網址維持原樣。儲存 `src/` 或 `public/` 內容時會自動重新建置，**重新整理瀏覽器**即可查看。沒有注入 live-reload 或 WebSocket 腳本。

```sh
npm run verify
npm run preview
```

`verify` 依序執行語法與資料檢查、建置、靜態產物檢查及本機伺服器測試。`preview` 僅提供已建置的 `dist/`。使用 Ctrl+C 停止預覽；不再有背景 Astro 程序。

兩種預覽共用預設埠 4321，請勿同時啟動。可加上 `-- --port 4322` 改埠。

## 編輯內容

| 檔案 | 用途 |
| --- | --- |
| `src/data/site.js` | 個人識別、研究與軟體項目、雙語題名／摘要、期刊資料、影片、論文典藏、路由 |
| `src/data/profile.js` | 首頁與履歷共用的介紹、學歷、研究領域、程式語言、工具、Linux 經驗與 TOEIC |
| `src/content/en/*.html` | 英文研究／專案詳頁正文，直接編輯普通 HTML |
| `src/content/zh-tw/*.html` | 對應的繁體中文正文 |
| `src/layout.js` | 共用頁首、導覽、語言切換、SEO metadata 與頁尾 |
| `src/render.js` | 首頁、列表、履歷、詳頁共用區塊與 404 的小型產生函式 |
| `src/html.js` | 資料插入 HTML 時的跳脫與安全連結處理 |
| `src/styles/global.css` | 共用桌面、手機及列印樣式 |
| `public/` | 核准的圖片、影片、favicon、robots、CNAME 與原生列印腳本 |

在 `site.js` 新增研究／作品後，補上兩個語言的同名 HTML 正文，即會出現在列表、詳頁與 sitemap。不必新增路由檔案。若新增正式期刊論文，請提供 `publication` 的期刊、卷數與頁碼。

AcciSAGE 保持碩士研究／manuscript 身分；[正式碩士論文典藏](https://hdl.handle.net/11296/u6rz3a) 與研究介紹影片均保留，不據此宣稱 ICRA 投稿或接受。PCB 論文依使用者偏好省略公開作者名單；內部研究事實文件保留原始出版書目。

## 產物與檢查

- `npm run build`：使用 Node.js 內建檔案 API，從明確的來源產生 `dist/`；失敗時保留上一版輸出。
- `npm run check`：Node 語法檢查、雙語資料欄位與不含外部套件 import 的檢查。
- `npm run test:site`：驗證所有路由、連結、資源、標題、canonical、語言切換、表格、影片、sitemap，以及最新的內容呈現要求。
- `npm test`：使用 `node:test` 檢查 HTML／URL 跳脫、連結協定，以及本機伺服器的網址轉址、404、HEAD、影片分段讀取及來源檔案隔離。
- `npm run preview:static`：可選擇輸出至 `static-preview/`；與正式版使用同一個產生器，不是第二份原始碼。

建置不讀取網路、不下載圖片，也不把 `docs/` 或網站原始碼複製進公開產物。完整結果見 [docs/VALIDATION.md](docs/VALIDATION.md)。

## GitHub Pages

**請推送外層 `site/` 儲存庫，而不是只推本資料夾。** workflow 現在正確位於外層 `.github/workflows/pages.yml`，在 `ribeye-cc/` 執行 `npm run verify`，並只上傳 `ribeye-cc/dist/`。沒有安裝依賴或快取 npm 套件的步驟。

目前的網址設計針對 `ribeye.cc` 根目錄，亦可直接用 `<帳號>.github.io` 個人 Pages 根站。一般專案 Pages 的 `/<repository>/` 子路徑需要另外設定路徑；若選一般 repository，請先在 Pages 設定中使用 `ribeye.cc` 作為自訂網域。

Repository 為 [cjzrv/homepage](https://github.com/cjzrv/homepage)，SSH remote 為 `git@github.com:cjzrv/homepage.git`，發布分支為 `main`。`ribeye.cc` 已完成 Pages、DNS 與 HTTPS 設定；推送後仍需確認 Actions 的部署結果。詳見 [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md)。
