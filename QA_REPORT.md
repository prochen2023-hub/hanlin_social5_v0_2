# QA REPORT v1.3.0

Static/deploy checks: 90 / Passed: 90 / Failed: 0

- PASS — 13 lessons listed
- PASS — speech synthesis enabled
- PASS — 40-minute exam timer
- PASS — timer bell alerts
- PASS — auto-submit on timeout
- PASS — lesson 1-1 present
- PASS — lesson 1-2 present
- PASS — lesson 1-3 present
- PASS — lesson 2-1 present
- PASS — lesson 2-2 present
- PASS — lesson 3-1 present
- PASS — lesson 3-2 present
- PASS — lesson 4-1 present
- PASS — lesson 4-2 present
- PASS — lesson 4-3 present
- PASS — lesson 5-1 present
- PASS — lesson 5-2 present
- PASS — lesson 5-3 present
- PASS — exam type tf
- PASS — exam type mcq
- PASS — exam type fill
- PASS — exam type match
- PASS — exam type group
- PASS — exam type data
- PASS — exam type short
- PASS — Unit 1 three lesson labels
- PASS — Unit 1 total review present
- PASS — world/East Asia interactive maps present
- PASS — prehistory timeline/jade inquiry present
- PASS — Indigenous 16/high-frequency learning present
- PASS — v0.8 empty daily loop removed
- PASS — v0.8 full semester map hidden
- PASS — v0.8 visual maps
- PASS — v0.8 3-choice map interaction
- PASS — v0.8 climate local adaptations
- PASS — v0.8 prehistory sites + exchange
- PASS — v0.8 Indigenous distribution caveat
- PASS — v0.9 official Indigenous distribution map
- PASS — v0.9 calibrated small markers
- PASS — v0.9 prehistory memory hierarchy
- PASS — v0.9 game 24 spaces / 12 turns
- PASS — v0.9 game learning domains
- PASS — v0.9 game replay + detailed results
- PASS — v0.9 game question speech
- PASS — v0.9 tribes collected as badges, not land
- PASS — v1.0 clue-only board labels
- PASS — v1.0 repeat-tile question memory
- PASS — v1.0 U1/U2 15-turn games
- PASS — v1.0 Unit2 full sequence
- PASS — v1.0 Unit2 legacy/trade content
- PASS — v1.0 licensed fort image credits
- PASS — v1.3 login identifies Social Studies and version
- PASS — v1.2 Unit 1/2 scope switch
- PASS — v1.2 Unit2 lessons remain first-class course pages
- PASS — v1.2 Unit2 base detailed content
- PASS — v1.2 Unit2 review and exam separation
- PASS — v1.2 full-page course views
- PASS — v1.2 love-hate sea chain
- PASS — v1.2 Dutch local meeting / treaty / Red Fort corrections
- PASS — v1.2 trade ledger
- PASS — v1.2 second-unit pictures
- PASS — v1.3 categorized quiz hub
- PASS — v1.3 matching memory game
- PASS — v1.3 four memory hooks each lesson
- PASS — v1.3 map calibration
- PASS — v1.3 Zeelandia verified image + fallback
- PASS — v1.3 game combo
- PASS — no TODO/FIXME/draft markers
- PASS — index.html exists
- PASS — styles.css exists
- PASS — app.js exists
- PASS — v08.js exists
- PASS — v09.js exists
- PASS — v10.js exists
- PASS — v11.js exists
- PASS — v12.js exists
- PASS — v13.js exists
- PASS — 404.html exists
- PASS — manifest.webmanifest exists
- PASS — .nojekyll exists
- PASS — VERSION exists
- PASS — SOURCES.md exists
- PASS — qa_runtime_vm.js exists
- PASS — qa_v08.js exists
- PASS — qa_v09.js exists
- PASS — qa_v10.js exists
- PASS — qa_v11.js exists
- PASS — qa_v12.js exists
- PASS — qa_v13.js exists
- PASS — Node VM runtime content checks

## Runtime data/render checks
```text
## qa_runtime_vm.js
PASS A exam = 100 
PASS B exam = 100 
PASS A exam has 33 questions 
PASS B exam has 33 questions 
PASS 1-1 quiz has 15 questions 
PASS 1-2 quiz has 15 questions 
PASS 1-3 quiz has 15 questions 
PASS Unit 1 shows 第一/二/三課 
PASS 1-1 stage1 has 5 continents/3 oceans 
PASS 1-1 stage1 has 16 fill selects 
PASS 1-1 includes scope+area 
PASS 1-1 climate/ocean/birds content 
PASS 1-2 timeline 3 ages 
PASS 1-2 jade + 5W1H + museums 
PASS 1-3 16 tribes + high-frequency focus 
PASS 1-3 ecology wisdom 
PASS 1-1 renders 15 quiz blocks 
PASS 1-2 renders 15 quiz blocks 
PASS 1-3 renders 15 quiz blocks 
PASS Unit1 review has 15 questions 
PASS Exam ready shows 40:00 
PASS Exam A renders map + 7 sections 
PASS TTS included 
PASS all 13 lessons have nonblank core fields 
PASS Unit 1 evidence/pairs/story have no blank entries 
PASS Unit 1 review pools have no blank questions/options/tips 
PASS all exam sections/questions are nonblank 
PASS no TODO/FIXME/DRAFT/TBD content markers 
PASS required deploy files exist 
PASS all 13 lessons render stages 1–5 with nonblank content 
PASS Exam B renders timeline/data + 7 sections 
PASS A/B exams include enriched Unit 1 coverage 

Passed 32/32

## qa_v13.js
PASS v13 loaded
PASS login + top show v1.3.0
PASS all cache-busted assets use 1.3.0
PASS Zeelandia direct image URL repaired
PASS Fort gallery links NMTH official collection
PASS map frame uses image-anchored marker
PASS map marker reduced to <=16px CSS
PASS world/east coordinate banks remain complete
PASS five lessons have 4 memory hooks each
PASS memory hooks include key mnemonics
PASS five lessons have four quiz tracks
PASS each track can build at least 6 questions
PASS each track has at least 6 native on-topic questions
PASS tiered quiz is 6 questions per track
PASS tiered quiz exposes 3 difficulty levels
PASS matching banks exist for all five lessons
PASS matching game awards only after all pairs
PASS Unit1 board questions expanded
PASS Unit2 board questions expanded
PASS Unit2 board synced v1.2 key content
PASS Unit2 events include treaty + Qing transition
PASS game combo system exists
PASS board tile text enlarged
PASS game question text enlarged
PASS A/B exams remain 100
PASS 2-1 quiz still rich >=43
PASS 2-2 quiz still rich >=42
PASS no empty href
PASS no TODO placeholders
PASS deploy files include v13

U1 board Q=102
U2 board Q=111
2-1 quiz=43, 2-2 quiz=42
Passed 30/30
```

## Browser automation note
- 此執行環境的 Chromium 被組織政策擋住 localhost/file 頁面，因此 v1.3 不宣稱完成 Chromium 自動瀏覽。
- 已以 Node VM 載入實際 `app.js + v08.js + v09.js + v10.js + v11.js + v12.js + v13.js`，檢查資料結構、第一單元新版頁面輸出、題數、考卷總分、空欄與朗讀／計時功能；部署後仍建議在實際 GitHub Pages 網址做一次人工手機點測。

## Static server smoke test
- PASS — `index.html`, `styles.css`, `app.js`, `v08.js`～`v13.js`, `VERSION`, `manifest.webmanifest`, `404.html` 均由本機靜態伺服器回傳 HTTP 200。
- 外部教學圖片仍需部署後網路連線；熱蘭遮城圖使用已驗證的 Wikimedia 原圖並設 `Special:FilePath` 同檔名備援，來源另連臺史博典藏頁。
