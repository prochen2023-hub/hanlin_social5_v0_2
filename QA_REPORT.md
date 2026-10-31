# QA REPORT v1.2.0

Static/deploy checks: 82 / Passed: 82 / Failed: 0

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
- PASS — v1.2 login identifies Social Studies and version
- PASS — v1.2 Unit 1/2 scope switch
- PASS — v1.2 Unit2 lessons remain first-class course pages
- PASS — v1.2 Unit2 base detailed content
- PASS — v1.2 Unit2 review and exam separation
- PASS — v1.2 full-page course views
- PASS — v1.2 love-hate sea chain
- PASS — v1.2 Dutch local meeting / treaty / Red Fort corrections
- PASS — v1.2 trade ledger
- PASS — v1.2 second-unit pictures
- PASS — no TODO/FIXME/draft markers
- PASS — index.html exists
- PASS — styles.css exists
- PASS — app.js exists
- PASS — v08.js exists
- PASS — v09.js exists
- PASS — v10.js exists
- PASS — v11.js exists
- PASS — v12.js exists
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

## qa_v08.js
PASS daily slogan removed
PASS semester map removed from child home
PASS compact auth labels first-time setup
PASS home only current unit shell
PASS v08 remote open maps
PASS teaching video/resource links
PASS home renders three U1 lesson rows
PASS 1-1 stage1 world + East Asia visual labs
PASS 1-1 stage1 only 3-choice interaction renderer
PASS 1-1 stage2 scope area islands
PASS 1-1 stage3 climate + adaptations + photos
PASS 1-1 stage4 currents/fish/spoonbill
PASS 1-1 visual quiz sequential one-at-a-time
PASS 1-2 defines prehistory + artifact/site
PASS 1-2 three era timeline + representative sites
PASS 1-2 evidence to life differences
PASS 1-2 jade + exchange objects/regions + museums
PASS 1-2 5W1H mission
PASS 1-3 16 tribes + real Taiwan map + distribution caveat
PASS 1-3 high-frequency focus organized by region
PASS 1-3 legends explain wisdom not rote pairing
PASS 1-3 hunting/fishing/sharing/governance
PASS A/B exam remain 100
PASS exams include enriched U1 knowledge
PASS Unit1 review includes aquaculture + Shisanhang exchange
PASS TTS remains
PASS no todo markers
PASS deploy required files

Passed 28/28

## qa_v09.js
PASS v09 script loaded
PASS game card + game dialog in HTML
PASS game board has 24 perimeter spaces
PASS chance and fate are content-rich
PASS game mixes all U1 domains
PASS game includes tuna/mullet/spoonbill/jade
PASS tribal rewards are badges not tribal land
PASS official Indigenous distribution map used
PASS official Indigenous source link present
PASS marker is smaller
PASS map box follows image dimensions
PASS 1-3 stage1 renders real distribution map
PASS prehistory has memory priority
PASS history order + rough ranges included
PASS Unit1 game card shown while Unit1 active
PASS game dialog opens
PASS game initializes 12 turns and 200 coins
PASS game geography pool includes continents/oceans/area/islands
PASS tribe spaces mix location + culture
PASS game questions keep TTS
PASS game end reports category totals
PASS game replay record shown on home
PASS CSS includes responsive board
PASS exam checkpoint still separate from Unit2
PASS semester-wide map remains absent
PASS no empty href
PASS no TODO placeholders
PASS deploy core files

Passed 28/28

## qa_v12.js
PASS v12 loaded
PASS login and top show Social Studies v1.2.0
PASS all cache-busted core assets use 1.2.0
PASS full-page lesson/unit CSS exists
PASS v12 applies full-page class
PASS 1648 appears only as an explicit correction
PASS love-hate chain has core sequence
PASS Dutch governance covers forts/trade/local meetings
PASS Spanish story covers Manila/Keelung/Tamsui/Red Fort correction
PASS Zheng story covers landing/siege/treaty/Chengtiang Fu
PASS Yanping memorial correction included
PASS trade table separates Japan/SE Asia/Manila/China coast
PASS education and beliefs included
PASS Qing transition corrected
PASS 2-1 quiz now >=42
PASS 2-2 quiz now >=41
PASS v12 lesson 2-1 stage1 outputs story chain
PASS v12 lesson 2-1 stage2 outputs Dutch and Spanish episodes
PASS v12 lesson 2-1 stage3 outputs Zheng episode
PASS v12 lesson 2-2 stage1 outputs photos/legacy
PASS v12 lesson 2-2 stage1 outputs species and faith
PASS v12 lesson 2-2 stage2 outputs trade ledger
PASS v12 lesson 2-2 stage3 outputs education ending
PASS exam A/B remain 100 points
PASS exam includes Red Fort/trade/treaty/life evidence
PASS no empty href
PASS no TODO placeholders
PASS deploy files include v12

Quiz lengths: 2-1=43, 2-2=42
Passed 28/28
```

## Browser automation note
- 此執行環境的 Chromium 被組織政策擋住 localhost/file 頁面，因此 v1.2 不宣稱完成 Chromium 自動瀏覽。
- 已以 Node VM 載入實際 `app.js + v08.js + v09.js + v10.js + v11.js + v12.js`，檢查資料結構、第一單元新版頁面輸出、題數、考卷總分、空欄與朗讀／計時功能；部署後仍建議在實際 GitHub Pages 網址做一次人工手機點測。

## HTTP smoke test
- PASS — local static server: `index.html`, `styles.css`, `app.js`, `v08.js`, `v09.js`, `v10.js`, `v11.js`, `v12.js`, `VERSION`, `404.html`, `manifest.webmanifest` all returned HTTP 200.
