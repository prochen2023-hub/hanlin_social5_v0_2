# QA REPORT v0.7

Static/deploy checks: 41 / Passed: 41 / Failed: 0

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
- PASS — no TODO/FIXME/draft markers
- PASS — index.html exists
- PASS — styles.css exists
- PASS — app.js exists
- PASS — 404.html exists
- PASS — manifest.webmanifest exists
- PASS — .nojekyll exists
- PASS — VERSION exists
- PASS — SOURCES.md exists
- PASS — qa_runtime_vm.js exists
- PASS — Node VM runtime content checks

## Runtime data/render checks
```text
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
```

## Browser automation note
- 此執行環境的 Chromium 被組織政策擋住 localhost/file 頁面，因此 v0.7 不宣稱完成 Chromium 自動瀏覽。
- 已以 Node VM 載入實際 `app.js`，檢查資料結構、第一單元各特殊頁面輸出、題數、考卷總分、空欄與朗讀／計時功能；部署後仍建議在實際 GitHub Pages 網址做一次人工手機點測。
