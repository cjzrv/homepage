# 後續維護工作

網站已完成零套件依賴的靜態重構。以下為目前維護入口，取代原 Astro 交接任務。

- 先讀 `START_HERE.md`、`AGENTS.md` 與已確認的資料文件。
- 維持既有極簡學術風格、研究狀態、雙語對應、影片與典藏連結。
- 共用資料在 `src/data/`，版型在 `src/layout.js`、`src/render.js`，詳頁正文在 `src/content/`。
- 新的個人資料先根據使用者提供內容更新，不從專案技術堆疊推定熟練程度或履歷資歷。
- 改動後執行 `npm run verify`，必要時以本機瀏覽器驗證。不要為簡單網站加入新的框架或外部套件。
- GitHub Pages 的 workflow 應在外層 Git 根目錄；僅部署 `ribeye-cc/dist/`。
- 準備部署的具體步驟及尚未設定的項目見 `NEXT_STEPS.md`。
