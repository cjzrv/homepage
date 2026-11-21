# GitHub Pages 發布準備

## 暫停發布 — 2026-11-21

本人要求先取消公開，待完整編輯後再公開。根目錄 `.github/workflows/pages.yml` 的 Pages 產物上傳與 deploy job 均設為 `if: ${{ false }}`，保留建置與檢查；即使推送或手動執行也不會發布。

本人已以 `cjzrv` 在 Pages 設定選擇 **Unpublish site**，移除目前部署並保留內容與設定。已實測根網址、英文首頁、舊中文首頁、`www` 與 `cjzrv.github.io/homepage/` 共五個入口均回傳 404。暫停發布的 Actions 建置檢查通過，產物上傳與 deploy 均為 skipped。

後續僅在本人明確要求重新公開時，恢復產物上傳與 deploy 的原有條件，再推送或執行 workflow。編輯與預覽使用本機伺服器。

以下為先前上線時的設定紀錄。

本機重構已完成並推送 [cjzrv/homepage](https://github.com/cjzrv/homepage)。SSH remote 為 `git@github.com:cjzrv/homepage.git`，發布分支為 `main`。使用者已完成 Pages、Spaceship DNS 與 Enforce HTTPS 設定；網站已於 `https://ribeye.cc/` 上線。後續每次推送仍需確認 Actions 的部署結果。

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
- 共 20 個 HTML 檔：18 個中英文 canonical 內容頁、保留的 `/zh-tw/` 中文首頁別名及自訂 404；另含 sitemap、robots、CNAME、`.nojekyll`。
- 根網址預設繁體中文，英文首頁為 `/en/`；語言切換及 `x-default` 對應中文預設。
- 本機預覽伺服器僅為開發用途；GitHub Pages 不需要執行伺服器。
- 資料、版型與詳頁正文分開維護，沒有第二套預覽原始碼。
- 完整驗證命令：在 `ribeye-cc/` 執行 `npm run verify`。

尚未提供的選填內容：乾淨的 DLDR 截圖、獨立履歷 PDF、可重新託管論文全文的授權。這些不妨礙目前網站發布。

列印的原生預覽仍需以一般瀏覽器最後確認；內建瀏覽器無法檢視系統列印視窗。
