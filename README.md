# ribeye.cc

莊淳傑（Chun-Jie Zhuang）的中英雙語個人學術網站。原生 HTML/CSS，使用 Node.js 內建功能產生靜態頁面，**零 npm 套件依賴**。

Repository：[cjzrv/homepage](https://github.com/cjzrv/homepage)，發布分支為 `main`。

**編輯期間暫停發布，網站已下線。** GitHub Actions 只做檢查，不上傳 Pages 產物或部署。本人已在 Pages 設定選擇 **Unpublish site**，公開網址已確認回傳 404；後續等本人明確要求再恢復發布。

```sh
cd ribeye-cc
npm run verify
npm run preview
```

開啟 http://127.0.0.1:4321/，預設繁體中文；英文首頁為 `/en/`，既有 `/zh-tw/` 中文入口仍可使用。不需要 `npm install`。

- [開發與內容編輯說明](ribeye-cc/README.md)
- [驗證紀錄](ribeye-cc/docs/VALIDATION.md)
- [GitHub Pages 發布步驟](ribeye-cc/docs/NEXT_STEPS.md)

Git 儲存庫根目錄為本資料夾；`.github/workflows/pages.yml` 會建置 `ribeye-cc/` 並只部署 `ribeye-cc/dist/`。`academic-home/` 是保留在本機的舊草稿，已由 `.gitignore` 排除。
