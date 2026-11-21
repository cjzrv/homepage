# 研究成果書目與定量結果

此文件保留精確數據供 Codex 使用，**不可將測試分數寫成百分比、名次或已發表宣稱**。

## 1. AcciSAGE

### 正式碩士論文典藏（使用者於 2026-11-21 提供）

- 永久網址：https://hdl.handle.net/11296/u6rz3a 。已確認轉至臺灣博碩士論文知識加值系統的對應紀錄。
- 研究生：莊淳傑 / ZHUANG, CHUN-JIE；學位：碩士；學校：國立臺北科技大學；系所：人工智慧科技碩士學位學程；出版年：2026。
- 正式中文題名：交通事故影片時空定位之誤差導向視覺語言模型微調方法。
- 正式英文題名：Spatio-Temporal Traffic Accident Grounding in Surveillance Videos via Error-Aware VLM Tuning。
- 典藏論文的正式英文題名含 `Traffic Accident`，與 AcciSAGE 研究稿件題名不同，兩者分別保留。新增典藏不代表期刊／會議投稿或接受狀態有變更。
- 網站只連結典藏紀錄，不下載或重新託管論文全文。

### 作者補充的介紹影片（2026-11-21）

- 使用者提供 `ICRA_video_莊淳傑_0828.mp4`，表示原先為 ICRA 投稿準備，但不確定老師是否已完成投稿。**不能把這項資訊寫成已投稿、審稿中、已接受或已發表，也不能由檔名推定會議年份。**
- 網站公開名稱採「研究介紹影片 / Research introduction video」，研究仍分類為碩士研究與 manuscript。未公開宣稱 ICRA 投稿狀態。
- 片長 110.87 秒（顯示 1:51），1280 × 720，H.264 / AAC。畫面含英文文字與內嵌英文字幕。
- 內容包含全域至局部時空定位、共用 Qwen3-VL backbone 與任務 LoRA、SAPO 訓練、事故案例、訓練階段及同測試集比較。影片中的其他比較數據保留在原片中，尚未另行補入網站的正式結果表或研究摘要。
- 中英文履歷與研究列表連到各自語言的 `/research/accisage/#video`；詳頁提供原生播放器、文字摘要、直接開啟及下載。

**英文題名**：AcciSAGE: Spatio-Temporal Accident Grounding in Surveillance Videos via Error-Aware VLM Tuning  
**中文題名**：交通事故影片時空定位之誤差導向視覺語言模型微調方法  
**狀態**：2026 碩士研究 / manuscript；公開參考實作，但尚無本交接資料可證明正式期刊或會議發表。  
**實作**：https://github.com/cjzrv/accisage  
**資料集**：ACCIDENT IID test set，請使用原 Repo 定義。

| System | T1 | S | C | ACCS |
| --- | ---: | ---: | ---: | ---: |
| SFT-only pipeline | 0.5563 | 0.5236 | 0.5382 | 0.5390 |
| AcciSAGE (SAPO) | **0.5672** | **0.5352** | **0.5493** | **0.5503** |

- `T1`：時間定位指標，1 秒容忍範圍。
- `S`：空間定位分數。
- `C`：事故類型正確率。
- `ACCS`：三者的調和平均。
- 原始碼、模型、資料集與評估流程請以 [AcciSAGE README](https://github.com/cjzrv/accisage) 及其 `docs/evaluation.md` 為準。
- 若提及競賽排名、baseline、大模型比較等，**需另行附完整來源與公平比較條件**；目前 V2 只需呈現上述公開數字。

## 2. Published PCB paper

**中文正式題名**：高效的PCB銅面覆蓋法  
**英文正式題名**：Highly efficient PCB copper pour coverage method  
**作者順序**：莊淳傑 (Chun-Jie Zhuang)；高浩宸 (Hao-Chen Gao)；黃志明 (Chi-Ming Huang)  
**出版**：明新學報 / Minghsin Journal，Vol. 47，2024 年 1 月，pp. 1–8。  
**正式書目**：https://www.airitilibrary.com/Article/Detail/1728760X-N202404170002-90060  
**C++ 程式**：https://github.com/cjzrv/linecover  
**作者提供原始 PDF**：交接包 `private-reference/PCB-paper-author-copy.pdf`（僅供本機 Codex 閱讀）。

論文根據 1,000 個隨機產生的三角形進行幾何覆蓋策略比較，以兩個正規化量度評估：
- **覆蓋重疊率**：實際覆蓋面積 / 有效覆蓋面積，數值較低較好。
- **移動距離**：筆刷總移動距離 / 圖形周長，數值較低較好。

| 面積 | 本研究重疊率 | 比較方法重疊率 | 本研究移動距離 | 比較方法移動距離 |
| --- | ---: | ---: | ---: | ---: |
| 10K | 152.36% | 220.50% | 78.14% | 154.90% |
| 1M | 154.77% | 578.28% | 79.06% | 159.74% |
| 100M | 154.98% | 1753.16% | 79.15% | 160.23% |

數字直接來自作者提供的 PDF 第 7 頁，表 1、表 2。不能將本研究重疊率 `152.36%` 誤寫成 152.36% 的「提升」或「節省」。

圖像素材：作者提供 PDF 第 5 頁是 V 字形覆蓋示意，第 6 頁有推導與完整覆蓋示意；原 V2 的 `public/images/pcb-v-shape.png` 已取自相關論文圖。公開原論文 PDF 或更多圖前先確認再利用／上傳權限。

## 3. 註記與來源可信度

- 使用者直接確認：姓名、學歷、研究室、論文與專案關聯、兩個 GitHub 帳號、TOEIC 分數、網域。
- PDF（作者提供）：PCB 論文方法、作者及實驗數據。
- 華藝正式出版頁面：期刊名稱、卷數、年月、頁碼與作者順序。
- 公開 GitHub README：AcciSAGE 評估分數；DLDR 及 linecover 功能。
- 任何未知事項都保持未知，等待使用者補充。
