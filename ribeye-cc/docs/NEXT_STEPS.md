# GitHub Pages 發布準備

本機重構已完成，使用者已指定並授權推送 [cjzrv/homepage](https://github.com/cjzrv/homepage)。SSH remote 為 `git@github.com:cjzrv/homepage.git`，發布分支為 `main`。DNS 尚未修改；推送不代表 Pages 已成功發布。

## Repository 與推送

1. Git 根目錄是本機 **`/home/ev/Documents/ChatGPT/site`**，維護來源位於 `ribeye-cc/`。
2. `origin` 已連接使用者指定的 repository，首次推送前已確認遠端沒有既有分支或提交。
3. 提交範圍為 `ribeye-cc/`、根目錄 README、`.gitignore` 與 `.github/workflows/pages.yml`。舊草稿 `academic-home/`、建置產物與私人參考檔案已由 `.gitignore` 排除。
4. 在外層 Git 根目錄推送 `main`：`git push -u origin main`。workflow 的 push 觸發分支為 `main`。
5. 此 repository 是專案站；預設 `https://cjzrv.github.io/homepage/` 帶有子路徑。目前來源採根目錄路徑，正式發布需完成下列 `ribeye.cc` 自訂網域設定。

## Pages 設定

1. Repository → Settings → Pages → Build and deployment → Source 選 **GitHub Actions**。
2. 在 Pages 的 Custom domain 設定 `ribeye.cc`。`public/CNAME` 及產物 `CNAME` 已保留，但仍需在 GitHub Pages 設定自訂網域。
3. `.github/workflows/pages.yml` 會執行 `npm run verify`，上傳 `ribeye-cc/dist/`，再部署。PR 只做檢查，不部署。
4. 按照 GitHub 官方文件的當前紀錄，在網域供應商設定 DNS；確認原有網域用途後再切換。
5. 等待 DNS／憑證驗證完成，再啟用 HTTPS，檢查中英文路由、404、影片與典藏連結。

官方文件：[自訂 Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[設定自訂網域](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。

## 本機已具備

- Node.js 22+、零 npm 套件依賴，無安裝步驟。
- 所有 19 個 HTML 頁面、中英文對應、sitemap、robots、CNAME、`.nojekyll`。
- 本機預覽伺服器僅為開發用途；GitHub Pages 不需要執行伺服器。
- 資料、版型與詳頁正文分開維護，沒有第二套預覽原始碼。
- 完整驗證命令：在 `ribeye-cc/` 執行 `npm run verify`。

尚未提供的選填內容：乾淨的 DLDR 截圖、獨立履歷 PDF、可重新託管論文全文的授權。這些不妨礙目前網站發布。

列印的原生預覽仍需以一般瀏覽器最後確認；內建瀏覽器無法檢視系統列印視窗。
