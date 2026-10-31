const fs=require('fs'),vm=require('vm');
const files=['app.js','v08.js','v09.js','v10.js','v11.js'];
const code=files.map(f=>fs.readFileSync(__dirname+'/'+f,'utf8')).join('\n');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),css=fs.readFileSync(__dirname+'/styles.css','utf8');
const elements=new Map();
function el(sel=''){
 if(elements.has(sel))return elements.get(sel);
 const base={selector:sel,hidden:false,open:false,innerHTML:'',textContent:'',value:'',disabled:false,dataset:{},style:{},className:'',parentNode:null,
  classList:{add(){},remove(){},toggle(){},contains(){return false}},showModal(){this.open=true},close(){this.open=false},setAttribute(){},getAttribute(){return null},addEventListener(){},focus(){},scrollIntoView(){},
  querySelector(){return null},querySelectorAll(){return []},appendChild(ch){ch.parentNode=this;return ch},insertBefore(ch){ch.parentNode=this;return ch},remove(){},closest(){return null},
  getBoundingClientRect(){return {left:0,top:0,width:100,height:100}},click(){if(this.onclick)this.onclick({preventDefault(){},stopPropagation(){}})}
 };
 elements.set(sel,base);return base
}
const storage={};
const document={querySelector:s=>el(s),querySelectorAll:s=>[],addEventListener(){},createElement:()=>el('created'+Math.random()),body:{appendChild(){}}};
const localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v),removeItem:k=>delete storage[k]};
const ctx={console,document,localStorage,window:{},crypto:require('crypto').webcrypto,TextEncoder,URL,encodeURIComponent,decodeURIComponent,setTimeout:(f)=>0,clearTimeout(){},setInterval:(f)=>0,clearInterval(){},Date,Math,JSON,confirm:()=>true,scrollTo(){},speechSynthesis:{getVoices:()=>[],cancel(){},speak(){},speaking:false},SpeechSynthesisUtterance:function(){},AudioContext:function(){},webkitAudioContext:function(){},FormData:function(){},HTMLElement:function(){},addEventListener(){}};
ctx.window=ctx;ctx.window.addEventListener=()=>{};ctx.window.AudioContext=function(){return {currentTime:0,createOscillator(){return {frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}}},createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}},destination:{}}};
vm.createContext(ctx);
try{vm.runInContext(code,ctx,{filename:'bundle-v11.js'})}catch(e){console.error('INIT FAIL',e);process.exit(1)}
const run=x=>vm.runInContext(x,ctx);run("currentUser='QA';state=defaultState();");
let total=0,fail=0;function ck(name,val){total++;let ok=false;try{ok=typeof val==='function'?!!val():!!val}catch(e){console.log('FAIL',name,e.message);fail++;return}console.log(ok?'PASS':'FAIL',name);if(!ok)fail++}
ck('v11 script loaded',()=>run("V11_VERSION==='1.1.0'"));
ck('index identifies Social Studies and v1.1.0 at login',()=>html.includes('國小五上・社會科・翰林版')&&html.includes('程式 v1.1.0'));
ck('top bar includes version',()=>html.includes('top-version')&&html.includes('v1.1.0'));
ck('index loads v11 and cache-busted v1.1 assets',()=>html.includes('v11.js?v=1.1.0')&&html.includes('styles.css?v=1.1.0'));
ck('home has only Unit 1 and Unit 2 scope buttons',()=>html.includes('data-open-scope-unit="1"')&&html.includes('data-open-scope-unit="2"')&&!html.includes('data-open-scope-unit="3"'));
ck('scope switch is labeled current exam range',()=>html.includes('本次段考範圍'));
ck('2-1 quiz expanded to at least 36 questions',()=>run("lessons['2-1'].quiz.length>=36"));
ck('2-2 quiz expanded to at least 36 questions',()=>run("lessons['2-2'].quiz.length>=36"));
ck('2-1 covers world/route/Dutch/Spanish/Zheng core',()=>['台江內海','熱蘭遮城','普羅民遮城','1624','1626','1642','1661','1662','鹿皮','蔗糖','屯墾'].every(x=>code.includes(x)));
ck('2-1 includes introduced species and Indigenous impact',()=>['黃牛','豌豆','番茄','原住民族'].every(x=>code.includes(x)));
ck('2-2 covers New Port Documents and Romanized Indigenous language',()=>['新港文書','羅馬字母','西拉雅語'].every(x=>code.includes(x)));
ck('2-2 covers Zheng education and Confucius Temple',()=>['1665','孔子廟','全臺首學','陳永華'].every(x=>code.includes(x)));
ck('2-2 covers religion, trade and Indigenous perspectives',()=>['媽祖','玄天上帝','日本','東南亞','土地壓力','原住民族'].every(x=>code.includes(x)));
ck('military settlement place-name clues included with caution',()=>['新營','柳營','左營','左鎮'].every(x=>code.includes(x))&&code.includes('不能看到一個「營」字就直接下結論'));
ck('Unit 2 transition to Qing includes 1683 and 1684',()=>code.includes('1683')&&code.includes('1684'));
ck('2-1 has three detailed v11 stages',()=>[1,2,3].every(n=>code.includes(`id==='2-1'&&stage===${n}`)));
ck('2-2 has three detailed v11 stages',()=>[1,2,3].every(n=>code.includes(`id==='2-2'&&stage===${n}`)));
ck('later lesson stages remain evidence/quiz/rescue via base renderer',()=>code.includes('v11RenderLessonStageBase(id,stage)'));
ck('Unit 2 review draws 8 questions from each lesson',()=>code.includes("slice(0,8)")&&code.includes('兩課各8題'));
ck('Unit 2 review wrong answers feed rescue',()=>code.includes("addWrong(`u2review-${q.id}`"));
ck('Unit 2 internal exam checkpoint is explicitly removed',()=>code.includes("box.querySelector('#unitExamBtn')")&&code.includes("parent.remove()"));
ck('Unit 2 explains exam appears only after U1+U2 completion',()=>code.includes('第一、二單元都完成後')&&code.includes('要段考囉'));
ck('scope buttons call openUnit directly',()=>code.includes("openUnit(Number(btn.dataset.openScopeUnit))"));
ck('Unit 2 review card is inserted into Unit 2',()=>code.includes('unit2ReviewCard')&&code.includes('開始第二單元總複習'));
ck('lesson 2-1 stage 1 renders meaningful detailed content',()=>{run("renderUnit2V11Stage('2-1',1)");const s=el('#lessonContent').innerHTML;return s.includes('第一課｜臺灣為什麼在大航海時代崛起？')&&s.includes('世界背景')&&s.includes('海路')});
ck('lesson 2-1 stage 2 renders Dutch detail table',()=>{run("renderUnit2V11Stage('2-1',2)");const s=el('#lessonContent').innerHTML;return s.includes('台江內海')&&s.includes('熱蘭遮城')&&s.includes('鹿皮')});
ck('lesson 2-1 stage 3 renders Spanish/Zheng comparison',()=>{run("renderUnit2V11Stage('2-1',3)");const s=el('#lessonContent').innerHTML;return s.includes('西班牙')&&s.includes('鄭氏')&&s.includes('1642')});
ck('lesson 2-2 stage 1 renders evidence museum and New Port Documents',()=>{run("renderUnit2V11Stage('2-2',1)");const s=el('#lessonContent').innerHTML;return s.includes('歷史證據博物館')&&s.includes('新港文書')&&s.includes('羅馬字母')});
ck('lesson 2-2 stage 2 renders trade and 1665 education',()=>{run("renderUnit2V11Stage('2-2',2)");const s=el('#lessonContent').innerHTML;return s.includes('1665')&&s.includes('孔子廟')&&s.includes('日本')});
ck('lesson 2-2 stage 3 renders balanced impact and transition',()=>{run("renderUnit2V11Stage('2-2',3)");const s=el('#lessonContent').innerHTML;return s.includes('交流與新連結')&&s.includes('統治與衝擊')&&s.includes('1684')});
ck('New Port teaching mockup is clearly labeled as not real transcription',()=>code.includes('教學排版示意，不是抄錄真實契約'));
ck('no whole-semester scope controls reintroduced',()=>!html.includes('data-open-scope-unit="4"')&&!html.includes('data-open-scope-unit="5"'));
ck('no empty href',()=>!html.includes('href=""'));
ck('no TODO placeholders',()=>!/(TODO|FIXME|PLACEHOLDER_CONTENT|待補內容)/i.test(code+html));
ck('deploy core files include v11',()=>['index.html','styles.css','app.js','v08.js','v09.js','v10.js','v11.js','404.html','manifest.webmanifest','.nojekyll','VERSION','SOURCES.md'].every(f=>fs.existsSync(__dirname+'/'+f)));
console.log(`\nQuiz lengths: 2-1=${run("lessons['2-1'].quiz.length")}, 2-2=${run("lessons['2-2'].quiz.length")}`);
console.log(`Passed ${total-fail}/${total}`);if(fail)process.exit(1);
