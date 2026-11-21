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
| 網頁語言 | English 預設，繁體中文第二語言 | 使用者認可的既有規劃 |

使用真實姓名做為主識別，不使用 `ribeye` 取代正式姓名；`ribeye.cc` 是網域名稱。

## 2. Education / 學歷

1. **National Taipei University of Technology（國立臺北科技大學）** — 2024–2026。人工智慧科技碩士學位學程，**已畢業並取得碩士學位**。研究室：**Robot Vision Lab（機器人視覺實驗室）**，隸屬資工所，使用者於 2026-11-21 明確更正，公開頁面使用「資工所」簡稱。不要把正式就讀學位寫成「Computer Science M.S.」。
2. **Chinese Culture University（中國文化大學）** — 2019–2024。電機工程學系，**已畢業並取得學士學位**。

學歷英文寫法可暫用：
- `M.S. in Artificial Intelligence Technology, National Taipei University of Technology (2024–2026)`
- `B.S. in Electrical Engineering, Chinese Culture University (2019–2024)`

如需正式學位全銜或學院官方英文名稱，以校方證書／官方文件最後核對；網站可沿用上述簡寫。

**不要在網站正文另外標示休學一年的細節**；2019–2024 是正確的入學到畢業期間。高中不是主要專業履歷項目，目前不列入公開 Education。不要推測高中畢業。

## 3. Research interests / 研究興趣

使用者於 2026-11-21 確認履歷的技術能力呈現：

- **研究領域 / Research areas**：Computer Vision, Voice Processing。
- **程式語言 / Programming languages**：C, C++, Python, x86 assembly。欄位名稱使用「程式語言」，不加「熟悉的」；專案採用的其他語言與框架不應自動列入。
- **工具 / Tools**：Git, GitHub, Docker, ROS。不列 GitHub Actions；ROS 版本未提供，不自行指定 ROS 1 或 ROS 2。
- **Linux 與遠端訓練能力**：在工具列下方以獨立段落呈現：「熟悉 Linux 環境，日常使用 Arch Linux，並能熟練透過命令列介面（CLI）與 TTY 終端操作系統。碩士研究中的模型訓練亦透過遠端連線，於租用的資料中心主機上完成。」使用者已確認 Arch Linux 為日用系統及碩士研究的遠端訓練經驗；不加入與他人的熟練度比較，也不推測資料中心業者、GPU 型號或訓練規模。
- CV 不另設「研究經歷」區塊，以免與「論文與研究」重複。

以下為較完整的研究興趣背景；CV 的研究領域以以上新確認內容為準：

- Computer Vision / 電腦視覺
- Vision-Language Models (VLMs) / 視覺語言模型
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
| **med-sched** | https://github.com/ribeye0/med-sched | JavaScript 個人用 Web 工具；README 很簡短 | 次要作品，不公開任何真實個人用藥資料 |

## 6. 建議英文介紹（可修改，但不要增加無根據的經歷）

> I am Chun-Jie Zhuang, an M.S. graduate in Artificial Intelligence Technology from National Taipei University of Technology. My graduate research at the Robot Vision Lab focused on spatio-temporal accident grounding with vision-language models. I am also interested in computational geometry and building practical software tools.

## 7. 建議繁體中文介紹

> 我是莊淳傑，畢業於國立臺北科技大學人工智慧科技碩士學位學程，曾於 Robot Vision Lab（機器人視覺實驗室）進行視覺語言模型與交通事故影片時空定位研究。我也對計算幾何、演算法設計及實用軟體開發有興趣。

## 8. 尚待本人補充（不可自行填寫）

- TOEIC 考試日期及是否希望公開分項成績／證書。
- 是否有可公開的履歷 PDF 或可重新託管的論文完整本文。碩士論文典藏網址已提供： https://hdl.handle.net/11296/u6rz3a 。
- 是否有實習／工作經歷（目前沒有提供，**不能杜撰**）。
- 是否要加入照片（目前沒有要求，也不是此種學術首頁的必要元素）。
