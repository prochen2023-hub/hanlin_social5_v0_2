from pathlib import Path
import re, subprocess
root=Path(__file__).parent
app=(root/'app.js').read_text(encoding='utf-8')
v08=(root/'v08.js').read_text(encoding='utf-8')
v09=(root/'v09.js').read_text(encoding='utf-8')
v10=(root/'v10.js').read_text(encoding='utf-8')
v11=(root/'v11.js').read_text(encoding='utf-8')
v12=(root/'v12.js').read_text(encoding='utf-8')
v13=(root/'v13.js').read_text(encoding='utf-8')
html=(root/'index.html').read_text(encoding='utf-8')
allcode=app+'\n'+v08+'\n'+v09+'\n'+v10+'\n'+v11+'\n'+v12+'\n'+v13+'\n'+html
checks=[]
def ok(name,cond,detail=''):
    checks.append((name,bool(cond),detail))

ok('13 lessons listed', "const availableLessons=[...lessonOrder]" in app)
ok('speech synthesis enabled', 'SpeechSynthesisUtterance' in app)
ok('40-minute exam timer', 'const EXAM_MINUTES=40' in app)
ok('timer bell alerts', "[600,'10 分鐘'],[300,'5 分鐘'],[60,'1 分鐘']" in app)
ok('auto-submit on timeout', "gradeExam(examRuntime.form,true)" in app)
for lid in ['1-1','1-2','1-3','2-1','2-2','3-1','3-2','4-1','4-2','4-3','5-1','5-2','5-3']:
    ok(f'lesson {lid} present', f"'{lid}':{{" in app or f"'{lid}': {{" in app)
for typ in ['tf','mcq','fill','match','group','data','short']:
    ok(f'exam type {typ}', f"type:'{typ}'" in app)
ok('Unit 1 three lesson labels', all(x in app for x in ['第一課','第二課','第三課']))
ok('Unit 1 total review present', '第一單元總複習' in app and '15題抽考' in app)
ok('world/East Asia interactive maps present', all(x in app for x in ['五大洲','三大洋','臺灣海峽','巴士海峽']))
ok('prehistory timeline/jade inquiry present', all(x in app for x in ['距今5萬年','臺灣玉','5W1H','十三行博物館']))
ok('Indigenous 16/high-frequency learning present', all(x in app for x in ['16族','高頻','共享互助']))
ok('v0.8 empty daily loop removed', '今天只做 3 件事' not in html and '開始今天的探險' not in html)
ok('v0.8 full semester map hidden', 'semesterMap' not in html and 'toggleMap' not in html)
ok('v0.8 visual maps', all(x in v08 for x in ['World_map_configurable.svg','East_Asia_area_blank_CJK.svg','Taiwan_in_its_region.svg']))
ok('v0.8 3-choice map interaction', 'q.wrong.slice(0,2)' in v08)
ok('v0.8 climate local adaptations', all(x in v08 for x in ['澎湖菜宅','蘭嶼地下屋','新埔柿餅','沿海魚塭']))
ok('v0.8 prehistory sites + exchange', all(x in v08 for x in ['八仙洞','卑南遺址','十三行遺址','外來陶器','玻璃珠']))
ok('v0.8 Indigenous distribution caveat', '現代原住民族人口分布更廣' in v08)
ok('v0.9 official Indigenous distribution map', 'mhi.moe.edu.tw' in v09 and '16 族主要傳統分布' in v09)
ok('v0.9 calibrated small markers', 'tiny-map-marker' in v09 and 'calibrated-map' in v09)
ok('v0.9 prehistory memory hierarchy', all(x in v09 for x in ['⭐ 必記','👀 會看','➕ 加分','三棒接力']))
ok('v0.9 game 24 spaces / 12 turns', 'const GAME_BOARD=[' in v09 and 'maxTurns:12' in v09 and 'GAME_POS' in v09)
ok('v0.9 game learning domains', all(x in v09 for x in ["geo:'地理定位'","climate:'季風與生活'","ocean:'洋流與生物'","history:'史前文化'","tribe:'原住民族文化'"]))
ok('v0.9 game replay + detailed results', all(x in v09 for x in ['再玩一次','地方資產','漁獲','遺址／寶物','智慧徽章','獎金']))
ok('v0.9 game question speech', 'data-speech=' in v09)
ok('v0.9 tribes collected as badges, not land', "assetType:'badge'" in v09 and '不是買下族群土地' in v09)
ok('v1.0 clue-only board labels', '答對才揭曉' in v10 and '春夏漁汛' in v10 and '河口鐵村' in v10)
ok('v1.0 repeat-tile question memory', 'gameQuestionMemory' in v10 and 'slice(-3)' in v10)
ok('v1.0 U1/U2 15-turn games', "maxTurns:15" in v10 and 'V10_U2_BOARD' in v10)
ok('v1.0 Unit2 full sequence', all(x in v10 for x in ['1624','1626','1642','1661','1662','台江內海','熱蘭遮','普羅民遮']))
ok('v1.0 Unit2 legacy/trade content', all(x in v10 for x in ['羅馬字','孔廟','媽祖','玄天上帝','日本','東南亞']))
ok('v1.0 licensed fort image credits', 'creativecommons.org/licenses/by/4.0' in v10 and 'creativecommons.org/licenses/by-sa/3.0' in v10)
ok('v1.3 login identifies Social Studies and version', '國小五上・社會科・翰林版' in html and '程式 v1.3.0' in html)
ok('v1.2 Unit 1/2 scope switch', 'data-open-scope-unit="1"' in html and 'data-open-scope-unit="2"' in html)
ok('v1.2 Unit2 lessons remain first-class course pages', all(x in v11 for x in ["id==='2-1'&&stage===1","id==='2-1'&&stage===2","id==='2-1'&&stage===3","id==='2-2'&&stage===1","id==='2-2'&&stage===2","id==='2-2'&&stage===3"]))
ok('v1.2 Unit2 base detailed content', all(x in v11 for x in ['台江內海','熱蘭遮城','普羅民遮城','新港文書','1665','全臺首學','1683','1684']))
ok('v1.2 Unit2 review and exam separation', '第二單元總複習' in v11 and "box.querySelector('#unitExamBtn')" in v11 and '第一、二單元都完成後' in v11)

ok('v1.2 full-page course views', 'full-course-page' in v12 and '#lessonDialog.full-course-page' in (root/'styles.css').read_text(encoding='utf-8'))
ok('v1.2 love-hate sea chain', all(x in v12 for x in ['顏思齊','鄭芝龍','1624','1626','1642','1661–1662','1683→1684']))
ok('v1.2 Dutch local meeting / treaty / Red Fort corrections', all(x in v12 for x in ['地方會議','私人動產','安東尼堡','不是 1648']))
ok('v1.2 trade ledger', all(x in v12 for x in ['糖皮換銀','糖皮換軍火香料','轉口','走私']))
ok('v1.2 second-unit pictures', all(x in v12 for x in ['聖薩爾瓦多城模型','紅毛城','熱蘭遮','普羅民遮']))

ok('v1.3 categorized quiz hub', all(x in v13 for x in ['分區闖關','基礎定位','應用連結','挑戰推理']))
ok('v1.3 matching memory game', '連連看記憶戰' in v13 and 'V13_MATCH_BANK' in v13)
ok('v1.3 four memory hooks each lesson', 'V13_MEMORY' in v13 and all(x in v13 for x in ['夏鮪冬烏','舊長打','東阿美','24荷南','糖皮換銀']))
ok('v1.3 map calibration', 'v13-map-frame' in v13 and 'tiny-map-marker' in v13)
ok('v1.3 Zeelandia verified image + fallback', 'View_of_the_town_Taioan_and_Fort_Zeelandia.jpg' in v13 and 'Special:FilePath' in v13)
ok('v1.3 game combo', '連勝' in v13 and 'g.streak' in v13)

ok('no TODO/FIXME/draft markers', not re.search(r'\bTODO\b|\bFIXME\b|\bTBD\b|待補內容|尚未填寫|DRAFT_ONLY|PLACEHOLDER_CONTENT',allcode,re.I))
for f in ['index.html','styles.css','app.js','v08.js','v09.js','v10.js','v11.js','v12.js','v13.js','404.html','manifest.webmanifest','.nojekyll','VERSION','SOURCES.md','qa_runtime_vm.js','qa_v08.js','qa_v09.js','qa_v10.js','qa_v11.js','qa_v12.js','qa_v13.js']:
    ok(f'{f} exists',(root/f).exists())

runtime_parts=[]
runtime_ok=True
for script in ['qa_runtime_vm.js','qa_v13.js']:
    try:
        r=subprocess.run(['node',str(root/script)],cwd=root,capture_output=True,text=True,timeout=30)
        runtime_parts.append(f'## {script}\n'+(r.stdout+r.stderr).strip())
        runtime_ok = runtime_ok and (r.returncode==0)
    except Exception as e:
        runtime_parts.append(f'## {script}\nRuntime harness unavailable: {e}')
        runtime_ok=False
runtime_out='\n\n'.join(runtime_parts)
ok('Node VM runtime content checks',runtime_ok)

failed=[x for x in checks if not x[1]]
lines=['# QA REPORT v1.3.0','',f'Static/deploy checks: {len(checks)} / Passed: {len(checks)-len(failed)} / Failed: {len(failed)}','']
for n,p,d in checks: lines.append(f"- {'PASS' if p else 'FAIL'} — {n}{(' — '+d) if d else ''}")
lines += ['', '## Runtime data/render checks', '```text', runtime_out or '(no output)', '```', '', '## Browser automation note', '- 此執行環境的 Chromium 被組織政策擋住 localhost/file 頁面，因此 v1.3 不宣稱完成 Chromium 自動瀏覽。', '- 已以 Node VM 載入實際 `app.js + v08.js + v09.js + v10.js + v11.js + v12.js + v13.js`，檢查資料結構、第一單元新版頁面輸出、題數、考卷總分、空欄與朗讀／計時功能；部署後仍建議在實際 GitHub Pages 網址做一次人工手機點測。', '']
(root/'QA_REPORT.md').write_text('\n'.join(lines),encoding='utf-8')
print('\n'.join(lines))
raise SystemExit(1 if failed else 0)
