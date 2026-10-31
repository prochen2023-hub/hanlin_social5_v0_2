const fs=require('fs'), vm=require('vm');
const code=fs.readFileSync(__dirname+'/app.js','utf8');
const elements=new Map();
function el(sel=''){ if(elements.has(sel))return elements.get(sel); const base={selector:sel,hidden:false,innerHTML:'',textContent:'',value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},showModal(){this.open=true},close(){this.open=false},setAttribute(){},getAttribute(){return null},addEventListener(){},focus(){},scrollIntoView(){},querySelector(){return el(sel+' child')},querySelectorAll(){return []}}; elements.set(sel,base); return base; }
const storage={};
const document={querySelector:s=>el(s),querySelectorAll:s=>[],addEventListener(){},createElement:()=>el('created'),body:{appendChild(){}}};
const localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v),removeItem:k=>delete storage[k]};
const ctx={console,document,localStorage,window:{},crypto:require('crypto').webcrypto,TextEncoder,URL,encodeURIComponent,decodeURIComponent,setTimeout:(f)=>0,clearTimeout(){},setInterval:(f)=>0,clearInterval(){},Date,Math,JSON,confirm:()=>true,scrollTo(){},speechSynthesis:{getVoices:()=>[],cancel(){},speak(){},speaking:false},SpeechSynthesisUtterance:function(){},AudioContext:function(){},webkitAudioContext:function(){},FormData:function(){},HTMLElement:function(){}};
ctx.window=ctx; ctx.window.AudioContext=function(){return {currentTime:0,createOscillator(){return {frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}}},createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}},destination:{}}};
vm.createContext(ctx);
try{vm.runInContext(code,ctx,{filename:'app.js'});}catch(e){console.error('INIT FAIL',e);process.exit(1)}
function run(x){return vm.runInContext(x,ctx)}
const checks=[];function check(name,fn){try{let v=fn(),ok=!!v;checks.push([name,ok,v]);console.log(ok?'PASS':'FAIL',name,typeof v==='boolean'?'':v)}catch(e){checks.push([name,false,e.message]);console.log('FAIL',name,e.message)}}
run("currentUser='QA'; state=defaultState();");
check('A exam = 100',()=>run('examTotal(examData.A)===100'));
check('B exam = 100',()=>run('examTotal(examData.B)===100'));
check('A exam has 33 questions',()=>run("examData.A.sections.reduce((n,s)=>n+s.qs.length,0)===33"));
check('B exam has 33 questions',()=>run("examData.B.sections.reduce((n,s)=>n+s.qs.length,0)===33"));
for(const id of ['1-1','1-2','1-3']) check(id+' quiz has 15 questions',()=>run(`lessons['${id}'].quiz.length===15`));
run("openUnit(1)");check('Unit 1 shows 第一/二/三課',()=>/第一課/.test(el('#unitContent').innerHTML)&&/第二課/.test(el('#unitContent').innerHTML)&&/第三課/.test(el('#unitContent').innerHTML));
run("openLesson('1-1',1)");check('1-1 stage1 has 5 continents/3 oceans',()=>/五大洲/.test(el('#lessonContent').innerHTML)&&/三大洋/.test(el('#lessonContent').innerHTML));check('1-1 stage1 has 16 fill selects',()=>((el('#lessonContent').innerHTML.match(/data-fill-answer=/g)||[]).length===16));check('1-1 includes scope+area',()=>/36,000/.test(el('#lessonContent').innerHTML)&&/澎湖/.test(el('#lessonContent').innerHTML)&&/金門/.test(el('#lessonContent').innerHTML)&&/馬祖/.test(el('#lessonContent').innerHTML));
run("openLesson('1-1',3)");check('1-1 climate/ocean/birds content',()=>['東北季風','西南季風','鮪魚','烏魚','黑面琵鷺'].every(x=>el('#lessonContent').innerHTML.includes(x)));
run("openLesson('1-2',1)");check('1-2 timeline 3 ages',()=>['舊石器','新石器','金屬器','距今5萬年'].every(x=>el('#lessonContent').innerHTML.includes(x)));
run("openLesson('1-2',3)");check('1-2 jade + 5W1H + museums',()=>['臺灣玉','Who','十三行博物館','南科考古館'].every(x=>el('#lessonContent').innerHTML.includes(x)));
run("openLesson('1-3',1)");check('1-3 16 tribes + high-frequency focus',()=>['16族','達悟族','邵族','布農族','賽夏族','排灣族'].every(x=>el('#lessonContent').innerHTML.includes(x)));
run("openLesson('1-3',3)");check('1-3 ecology wisdom',()=>['狩獵禁忌','共享互助','永續'].every(x=>el('#lessonContent').innerHTML.includes(x)));
for(const id of ['1-1','1-2','1-3']){run(`openLesson('${id}',5)`);check(id+' renders 15 quiz blocks',()=>((el('#lessonContent').innerHTML.match(/class="quiz-q"/g)||[]).length===15));}
run('openUnit1Review()');check('Unit1 review has 15 questions',()=>((el('#missionContent').innerHTML.match(/class="review-q"/g)||[]).length===15));
run("renderExamReady('A')");check('Exam ready shows 40:00',()=>el('#examContent').innerHTML.includes('40:00'));
run("renderExam('A'); stopExamTimer();");check('Exam A renders map + 7 sections',()=>el('#examContent').innerHTML.includes('exam-visual')&&((el('#examContent').innerHTML.match(/class="exam-section"/g)||[]).length===7));
check('TTS included',()=>code.includes('SpeechSynthesisUtterance')&&code.includes('🔊'));
check('all 13 lessons have nonblank core fields',()=>run(`Object.values(lessons).length===13 && Object.values(lessons).every(l=>[l.title,l.short,l.intro].every(x=>typeof x==='string'&&x.trim()) && Array.isArray(l.facts)&&l.facts.length && l.facts.every(r=>r.length>=2&&r.every(x=>String(x).trim())) && Array.isArray(l.quiz)&&l.quiz.length && l.quiz.every(q=>String(q[0]||'').trim()&&Array.isArray(q[1])&&q[1].length>=2&&q[1].every(o=>String(o).trim())&&Number.isInteger(q[2])&&String(q[3]||'').trim()))`));
check('Unit 1 evidence/pairs/story have no blank entries',()=>run(`['1-1','1-2','1-3'].every(id=>{const l=lessons[id];return l.pairs.every(r=>r.every(x=>String(x).trim()))&&l.story.every(r=>r.every(x=>String(x).trim()))&&String(l.claim).trim()&&l.evidence.every(r=>String(r[0]).trim()&&String(r[1]).trim())})`));
check('Unit 1 review pools have no blank questions/options/tips',()=>run(`Object.values(unit1ReviewPools).every(pool=>pool.length>=10&&pool.every(q=>String(q.id).trim()&&String(q.q).trim()&&Array.isArray(q.opts)&&q.opts.length>=2&&q.opts.every(o=>String(o).trim())&&Number.isInteger(q.a)&&String(q.tip).trim()))`));
check('all exam sections/questions are nonblank',()=>run(`Object.values(examData).every(ex=>ex.sections.length===7&&ex.sections.every(sec=>String(sec.type).trim()&&String(sec.name).trim()&&sec.qs.length&&sec.qs.every(q=>{if(!String(q.q||'').trim()||!Number(q.p))return false;if(['mcq','group','data'].includes(sec.type))return Array.isArray(q.opts)&&q.opts.length>=2&&q.opts.every(o=>String(o).trim())&&Number.isInteger(q.a);if(sec.type==='fill')return Array.isArray(q.answers)&&q.answers.length&&q.answers.every(a=>String(a).trim());if(sec.type==='match')return String(q.a||'').trim();if(sec.type==='short')return Array.isArray(q.keywords)&&q.keywords.length&&q.keywords.every(g=>g.length&&g.every(k=>String(k).trim()));return sec.type==='tf'&&typeof q.a==='boolean'})))`));
check('no TODO/FIXME/DRAFT/TBD content markers',()=>!/(?:\bTODO\b|\bFIXME\b|\bTBD\b|DRAFT_ONLY|待補內容|尚未填寫)/i.test(code));
check('required deploy files exist',()=>['index.html','styles.css','app.js','404.html','manifest.webmanifest','.nojekyll','VERSION','SOURCES.md'].every(f=>fs.existsSync(__dirname+'/'+f)));
check('all 13 lessons render stages 1–5 with nonblank content',()=>{for(const id of run('Object.keys(lessons)')){for(let stage=1;stage<=5;stage++){run(`openLesson('${id}',${stage})`);const h=el('#lessonContent').innerHTML;if(!h||h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().length<40)return false}}return true});
run("renderExam('B'); stopExamTimer();");check('Exam B renders timeline/data + 7 sections',()=>el('#examContent').innerHTML.includes('exam-visual')&&((el('#examContent').innerHTML.match(/class="exam-section"/g)||[]).length===7));
check('A/B exams include enriched Unit 1 coverage',()=>run(`(()=>{const t=JSON.stringify(examData);return ['臺灣海峽','巴士海峽','3.6萬','東北季風','西南季風','鮪魚','烏魚','黑面琵鷺','長濱','卑南','十三行','臺灣玉','達悟','邵族','布農'].every(k=>t.includes(k))})()`));


const fail=checks.filter(x=>!x[1]);console.log(`\nPassed ${checks.length-fail.length}/${checks.length}`);if(fail.length)process.exit(1);
