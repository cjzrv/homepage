# 個人資料與網站內容（Codex 用）

> 用途：讓本機 Codex 不需要讀取整段聊天，也能正確改寫與維護網站。以使用者已確認內容為基礎。個人資料只有網站確實需要的部分才放到公開頁面。

## 1. 識別資訊

| 欄位 | 內容 | 來源／狀態 |
| --- | --- | --- |
| 中文姓名 | 莊淳傑 | 使用者確認 |
| 英文姓名 | Chun-Jie Zhuang；正式大寫 CHUN-JIE ZHUANG | 使用者確認 |
| Email | cjz89k@gmail.com | 使用者確認，預計用於公開聯絡 |
| 個人網站 | `ribeye.cc` | 使用者已購買網域；尚未等於完成部署 |
| GitHub 帳號 1 | https://github.com/cjzrv | 使用者說明為另一帳號 |
| GitHub 帳號 2 | https://github.com/ribeye0 | 使用者之前提供 |
| TOEIC | Listening & Reading **780 / 990** | 使用者確認；考試日期未知 |
| 網頁語言 | 繁體中文預設（`/`），保留英文（首頁 `/en/`）及既有 `/zh-tw/` 入口 | 使用者於 2026-11-21 更新 |

使用真實姓名做為主識別，不使用 `ribeye` 取代正式姓名；`ribeye.cc` 是網域名稱。

使用者於 2026-11-22 提供 `/home/ev/Pictures/profile_img.jpg` 並明確要求將完整原圖加入網站、不裁切。照片放在中英文首頁姓名與聯絡資訊旁，手機版置於文字上方；使用者隨後明確要求恢復公開網站。

首頁學歷下方的 TOEIC 成績依使用者於 2026-11-22 的要求，兩種語言均顯示 `TOEIC Listening & Reading: **780 / 990**.`，分數加粗，成績一行的字體放大為 1.125rem。

## 2. Education / 學歷

1. **National Taipei University of Technology（國立臺北科技大學）** — 2024–2026。人工智慧科技碩士學位學程，**已畢業並取得碩士學位**。研究室：**Robot Vision Lab（機器人視覺實驗室）**。使用者於 2026-11-22 的最新自介使用「資工系所屬」寫法，並補充電腦視覺與 UR 系列機械手臂相關研究，取代先前「資工所」的自介寫法。不要把正式就讀學位寫成「Computer Science M.S.」，也不推測機械手臂型號或研究成果。
2. **Chinese Culture University（中國文化大學）** — 2019–2024。電機工程學系，**已畢業並取得學士學位**。
3. **National Wu-Ling Senior High School（國立武陵高級中學）** — 2017–2019。使用者於 2026-11-22 要求加入學歷，校名依本人提供寫法呈現；不額外標示畢業資格或科別。

使用者於 2026-11-22 指定首頁與履歷學歷區塊採以下三筆，僅列期間、校名及學程／學系；高中不加「高中」說明或破折號，不另列畢業字樣或研究室：

```text
2024–2026 國立臺北科技大學 — 人工智慧科技碩士學位學程
2019–2024 中國文化大學 — 電機工程學系
2017–2019 國立武陵高級中學
```

學歷英文寫法可暫用：
- `M.S. in Artificial Intelligence Technology, National Taipei University of Technology (2024–2026)`
- `B.S. in Electrical Engineering, Chinese Culture University (2019–2024)`

如需正式學位全銜或學院官方英文名稱，以校方證書／官方文件最後核對；網站可沿用上述簡寫。

**不要在網站正文另外標示休學一年的細節**；2019–2024 是正確的入學到畢業期間。高中依使用者最新要求列入 Education，僅呈現校名與期間，不推測畢業資格。

## 3. Research interests / 研究興趣

使用者於 2026-11-22 更新首頁自介與研究興趣為電腦視覺、多模態語言模型微調（fine-tuning multimodal language models）與影像處理（Image Processing），並強調開發軟體工具以解決日常生活問題。以下 CV 技能欄位仍保留先前明確指定的 Computer Vision、Voice Processing；本次自介修改不自動更換 CV 的研究領域。

使用者於 2026-11-21 確認履歷的技術能力呈現：

- **研究領域 / Research areas**：Computer Vision, Voice Processing。
- **程式語言 / Programming languages**：C, C++, Python, x86 assembly。欄位名稱使用「程式語言」，不加「熟悉的」；專案採用的其他語言與框架不應自動列入。
- **工具 / Tools**：Git, GitHub, Docker, ROS。不列 GitHub Actions；ROS 版本未提供，不自行指定 ROS 1 或 ROS 2。
- **Linux 與遠端訓練能力**：在工具列下方以獨立段落呈現：「熟悉 Linux 環境，日常使用 Arch Linux，並能熟練透過命令列介面（CLI）與 TTY 終端操作系統。碩士研究中的模型訓練亦透過遠端連線，於租用的資料中心主機上完成。」使用者已確認 Arch Linux 為日用系統及碩士研究的遠端訓練經驗；不加入與他人的熟練度比較，也不推測資料中心業者、GPU 型號或訓練規模。
- CV 不另設「研究經歷」區塊，以免與「論文與研究」重複。

以下為較完整的研究興趣背景；CV 的研究領域以以上新確認內容為準：

- Computer Vision / 電腦視覺
- Fine-tuning and training multimodal language models / 多模態語言模型微調
- Video Understanding / 影片理解
- Spatio-Temporal Grounding / 時空定位
- Computational Geometry and Algorithms / 計算幾何與演算法
- Practical Software Development / 實用軟體開發

以有實際研究與專案佐證的領域為主；不要加入無來源的資歷、榮譽或研究合作。

## 4. Research / 研究成果

### A. AcciSAGE（2026，碩士研究）

完整英文題名：**AcciSAGE: Spatio-Temporal Accident Grounding in Surveillance Videos via Error-Aware VLM Tuning**。

中文題名：**交通事故影片時空定位之誤差導向視覺語言模型微調方法**。

摘要：以 Qwen3-VL 開放權重 VLM + LoRA，在監視器事故影片中處理事故時間、事故中心位置、事故類型三項任務，採 global-to-local 多階段推論；使用 SFT 後，再以 SAPO 進行與任務相符的誤差導向精煉。

主要實作：Python、Qwen3-VL、LoRA、SFT、SAPO。公開程式碼： https://github.com/cjzrv/accisage 。研究方法詳細圖示與數據以 Repository README 為準。

碩士論文典藏（使用者已提供並核對）：https://hdl.handle.net/11296/u6rz3a 。正式中文題名如上；典藏的正式英文題名為 **Spatio-Temporal Traffic Accident Grounding in Surveillance Videos via Error-Aware VLM Tuning**，應與 AcciSAGE 研究稿件題名分開保留。

**對外發表狀態：碩士研究／manuscript／reference implementation，不要暗示已刊登於期刊／會議。**

### B. 高效的 PCB 銅面覆蓋法（2024，期刊論文暨大學專題）

**公開呈現偏好（使用者於 2026-11-21 更新）**：網站首頁、研究列表、履歷與詳頁均省略這篇論文的作者姓名，僅呈現題名、期刊、年份、卷頁及連結。以下出版書目保留作內部核對，勿重新加回公開頁面；也不改寫成單一作者署名。

英文：**Highly efficient PCB copper pour coverage method**。
作者：**莊淳傑、高浩宸、黃志明**（Chun-Jie Zhuang, Hao-Chen Gao, Chi-Ming Huang）。
出版：**《明新學報》, Volume 47 (2024/01), pp. 1–8**。
連結：https://www.airitilibrary.com/Article/Detail/1728760X-N202404170002-90060
原始碼：https://github.com/cjzrv/linecover

重點：針對三角形與部分四邊形，設計幾何覆蓋法，改善覆蓋重疊率及筆刷移動距離；使用 V 字形覆蓋填補角落。

詳細比較與正確實驗數據見 `docs/RESEARCH_FACTS.md`。

## 5. Engineering / 軟體專案

| 專案 | 連結 | 經確認的要點 | 呈現建議 |
| --- | --- | --- | --- |
| **DLDR** | https://github.com/ribeye0/dldr | Rust、Tauri、Svelte；已購買 DLsite 作品的搜尋、批次下載、媒體庫、播放清單、同步字幕音訊播放器；GUI / CLI | 代表工程作品，展示真實介面截圖、技術與架構，不加入成人向內容圖片 |
| **linecover** | https://github.com/cjzrv/linecover | C++ CLI、多邊形覆蓋法、隨機產生圖形、比較演算法、資料儲存 | 和 PCB 論文交叉連結，避免產生兩份不同研究描述 |
| **AcciSAGE** | https://github.com/cjzrv/accisage | Python 研究實作、訓練／推論／評估、LoRA adapters | Research 詳頁為主，軟體列表可連過去 |

使用者於 2026-11-22 要求從網站移除 med-sched 專案；首頁、專案列表、履歷與中英文詳頁均不再呈現。

## 6. 建議英文介紹（可修改，但不要增加無根據的經歷）

> I am Chun-Jie Zhuang, a graduate of the M.S. Program in Artificial Intelligence Technology at National Taipei University of Technology. During my master’s studies, I conducted research on computer vision and UR-series robotic arms at the Robot Vision Lab in the Department of Computer Science and Information Engineering.
>
> My research interests include computer vision, fine-tuning multimodal language models, and image processing. I also enjoy building practical software tools to solve problems I encounter in everyday life.

## 7. 建議繁體中文介紹

> 我是莊淳傑，畢業於國立臺北科技大學人工智慧科技碩士學位學程。碩士期間曾於資工系所屬的 Robot Vision Lab（機器人視覺實驗室）從事電腦視覺與 UR 系列機械手臂相關研究。
>
> 我的研究興趣包括電腦視覺、多模態語言模型微調與影像處理。此外，我也喜歡開發實用的軟體工具，解決日常生活中遇到的問題。

## 8. 尚待本人補充（不可自行填寫）

- TOEIC 考試日期及是否希望公開分項成績／證書。
- 是否有可公開的履歷 PDF 或可重新託管的論文完整本文。碩士論文典藏網址已提供： https://hdl.handle.net/11296/u6rz3a 。
- 是否有實習／工作經歷（目前沒有提供，**不能杜撰**）。
- 個人照片已由本人提供並授權加入首頁，不裁切；素材紀錄見 `ASSETS.md`。
