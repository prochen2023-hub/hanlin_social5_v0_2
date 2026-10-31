from pathlib import Path
import re
root=Path(__file__).parent
app=(root/'app.js').read_text(encoding='utf-8')
checks=[]
def ok(name,cond,detail=''):
    checks.append((name,bool(cond),detail))
# static checks
ok('13 lessons listed', "const availableLessons=[...lessonOrder]" in app)
ok('speech synthesis enabled', 'SpeechSynthesisUtterance' in app)
ok('40-minute exam timer', 'const EXAM_MINUTES=40' in app)
ok('timer bell alerts', "[600,'10 分鐘'],[300,'5 分鐘'],[60,'1 分鐘']" in app)
ok('auto-submit on timeout', "gradeExam(examRuntime.form,true)" in app)
for lid in ['1-1','1-2','1-3','2-1','2-2','3-1','3-2','4-1','4-2','4-3','5-1','5-2','5-3']:
    ok(f'lesson {lid} present', f"'{lid}':{{" in app or f"'{lid}': {{" in app)
for typ in ['tf','mcq','fill','match','group','data','short']:
    ok(f'exam type {typ}', f"type:'{typ}'" in app)
# obvious blank UI/content markers
ok('no TODO/draft markers', not re.search(r'\bTODO\b|待補內容|尚未填寫|DRAFT_ONLY',app,re.I))
for f in ['index.html','styles.css','app.js','404.html','manifest.webmanifest','.nojekyll']:
    ok(f'{f} exists',(root/f).exists())
failed=[x for x in checks if not x[1]]
lines=['# QA REPORT v0.6','',f'Checks: {len(checks)} / Passed: {len(checks)-len(failed)} / Failed: {len(failed)}','']
for n,p,d in checks: lines.append(f"- {'PASS' if p else 'FAIL'} — {n}{(' — '+d) if d else ''}")
(root/'QA_REPORT.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('\n'.join(lines))
raise SystemExit(1 if failed else 0)
