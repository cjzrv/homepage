# ribeye.cc 維護入口

這是莊淳傑（Chun-Jie Zhuang）的中英文個人學術網站。使用者已恢復本名署名，公開作品與 GitHub 帳號僅呈現目前共用資料中的項目；研究連結與影片保留。2026-11-21 已依使用者要求移除 Astro 與 TypeScript；目前以 Node.js 內建功能產生 HTML，沒有 npm 套件依賴。

1. 先讀 `AGENTS.md`、`docs/PROFILE_AND_CONTENT.md`、`docs/RESEARCH_FACTS.md`、`docs/DESIGN_SPEC.md`。
2. 執行 `npm run verify`，不需要安裝套件。
3. 執行 `npm run dev`，開啟 http://127.0.0.1:4321/；原生監看會在儲存後重建，瀏覽器需自行重新整理。
4. 根網址預設繁體中文，英文首頁為 `/en/`，既有 `/zh-tw/` 仍可使用。研究、軟體、履歷與詳頁的中英文網址維持原樣，頁內語言切換對應同一內容。
5. 資料與內容檔案位置見 `README.md`。不要恢復舊框架或另建第二套 HTML 預覽模板。

Git 儲存庫根目錄在外層 `site/`。GitHub Pages workflow 位於外層 `.github/workflows/pages.yml`，只部署這個專案的 `dist/`。原始私人 PDF 不屬於網站程式碼或產物。

AcciSAGE 的碩士論文典藏已加入，不代表 ICRA 稿件投稿或接受狀態已確認。其他個人資料與公開呈現方式以最新使用者要求及 `PROFILE_AND_CONTENT.md` 為準。

最新驗證見 `docs/VALIDATION.md`；準備發布的步驟見 `docs/NEXT_STEPS.md`。
