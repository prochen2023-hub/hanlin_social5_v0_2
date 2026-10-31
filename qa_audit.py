from pathlib import Path
import re, subprocess
root=Path(__file__).parent
app=(root/'app.js').read_text(encoding='utf-8')
v08=(root/'v08.js').read_text(encoding='utf-8')
html=(root/'index.html').read_text(encoding='utf-8')
allcode=app+'\n'+v08+'\n'+html
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
ok('no TODO/FIXME/draft markers', not re.search(r'\bTODO\b|\bFIXME\b|\bTBD\b|待補內容|尚未填寫|DRAFT_ONLY|PLACEHOLDER_CONTENT',allcode,re.I))
for f in ['index.html','styles.css','app.js','v08.js','404.html','manifest.webmanifest','.nojekyll','VERSION','SOURCES.md','qa_runtime_vm.js','qa_v08.js']:
    ok(f'{f} exists',(root/f).exists())

runtime_parts=[]
runtime_ok=True
for script in ['qa_runtime_vm.js','qa_v08.js']:
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
lines=['# QA REPORT v0.8.1','',f'Static/deploy checks: {len(checks)} / Passed: {len(checks)-len(failed)} / Failed: {len(failed)}','']
for n,p,d in checks: lines.append(f"- {'PASS' if p else 'FAIL'} — {n}{(' — '+d) if d else ''}")
lines += ['', '## Runtime data/render checks', '```text', runtime_out or '(no output)', '```', '', '## Browser automation note', '- 此執行環境的 Chromium 被組織政策擋住 localhost/file 頁面，因此 v0.8.1 不宣稱完成 Chromium 自動瀏覽。', '- 已以 Node VM 載入實際 `app.js + v08.js`，檢查資料結構、第一單元新版頁面輸出、題數、考卷總分、空欄與朗讀／計時功能；部署後仍建議在實際 GitHub Pages 網址做一次人工手機點測。', '']
(root/'QA_REPORT.md').write_text('\n'.join(lines),encoding='utf-8')
print('\n'.join(lines))
raise SystemExit(1 if failed else 0)
