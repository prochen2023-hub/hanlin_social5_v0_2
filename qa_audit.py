from pathlib import Path
import re, subprocess
root=Path(__file__).parent
app=(root/'app.js').read_text(encoding='utf-8')
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
ok('no TODO/FIXME/draft markers', not re.search(r'\bTODO\b|\bFIXME\b|\bTBD\b|待補內容|尚未填寫|DRAFT_ONLY',app,re.I))
for f in ['index.html','styles.css','app.js','404.html','manifest.webmanifest','.nojekyll','VERSION','SOURCES.md','qa_runtime_vm.js']:
    ok(f'{f} exists',(root/f).exists())

runtime_out=''
runtime_ok=False
try:
    r=subprocess.run(['node',str(root/'qa_runtime_vm.js')],cwd=root,capture_output=True,text=True,timeout=30)
    runtime_out=(r.stdout+r.stderr).strip()
    runtime_ok=(r.returncode==0)
except Exception as e:
    runtime_out=f'Runtime harness unavailable: {e}'
ok('Node VM runtime content checks',runtime_ok)

failed=[x for x in checks if not x[1]]
lines=['# QA REPORT v0.7','',f'Static/deploy checks: {len(checks)} / Passed: {len(checks)-len(failed)} / Failed: {len(failed)}','']
for n,p,d in checks: lines.append(f"- {'PASS' if p else 'FAIL'} — {n}{(' — '+d) if d else ''}")
lines += ['', '## Runtime data/render checks', '```text', runtime_out or '(no output)', '```', '', '## Browser automation note', '- 此執行環境的 Chromium 被組織政策擋住 localhost/file 頁面，因此 v0.7 不宣稱完成 Chromium 自動瀏覽。', '- 已以 Node VM 載入實際 `app.js`，檢查資料結構、第一單元各特殊頁面輸出、題數、考卷總分、空欄與朗讀／計時功能；部署後仍建議在實際 GitHub Pages 網址做一次人工手機點測。', '']
(root/'QA_REPORT.md').write_text('\n'.join(lines),encoding='utf-8')
print('\n'.join(lines))
raise SystemExit(1 if failed else 0)
