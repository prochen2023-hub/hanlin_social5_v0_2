const fs=require('fs'),vm=require('vm');
const files=['app.js','v08.js','v09.js','v10.js','v11.js','v12.js'];
const code=files.map(f=>fs.readFileSync(__dirname+'/'+f,'utf8')).join('\n');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),css=fs.readFileSync(__dirname+'/styles.css','utf8');
const elements=new Map();
function el(sel=''){
 if(elements.has(sel))return elements.get(sel);
 const classes=new Set();
 const base={selector:sel,hidden:false,open:false,innerHTML:'',textContent:'',value:'',disabled:false,dataset:{},style:{},className:'',parentNode:null,
  classList:{add(...xs){xs.forEach(x=>classes.add(x))},remove(...xs){xs.forEach(x=>classes.delete(x))},toggle(x){classes.has(x)?classes.delete(x):classes.add(x)},contains(x){return classes.has(x)}},showModal(){this.open=true},close(){this.open=false},setAttribute(){},getAttribute(){return null},addEventListener(){},focus(){},scrollIntoView(){},
  querySelector(){return null},querySelectorAll(){return []},appendChild(ch){ch.parentNode=this;return ch},insertBefore(ch){ch.parentNode=this;return ch},remove(){},closest(){return null},
  getBoundingClientRect(){return {left:0,top:0,width:100,height:100}},click(){if(this.onclick)this.onclick({preventDefault(){},stopPropagation(){}})}
 };
 elements.set(sel,base);return base
}
const storage={};
const document={querySelector:s=>el(s),querySelectorAll:s=>[],getElementById:id=>el('#'+id),addEventListener(){},createElement:()=>el('created'+Math.random()),body:{appendChild(){}}};
const localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v),removeItem:k=>delete storage[k]};
const ctx={console,document,localStorage,window:{},crypto:require('crypto').webcrypto,TextEncoder,URL,encodeURIComponent,decodeURIComponent,setTimeout:(f)=>0,clearTimeout(){},setInterval:(f)=>0,clearInterval(){},Date,Math,JSON,confirm:()=>true,scrollTo(){},speechSynthesis:{getVoices:()=>[],cancel(){},speak(){},speaking:false},SpeechSynthesisUtterance:function(){},AudioContext:function(){},webkitAudioContext:function(){},FormData:function(){},HTMLElement:function(){},addEventListener(){}};
ctx.window=ctx;ctx.window.addEventListener=()=>{};ctx.window.AudioContext=function(){return {currentTime:0,createOscillator(){return {frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}}},createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}},destination:{}}};
vm.createContext(ctx);
try{vm.runInContext(code,ctx,{filename:'bundle-v12.js'})}catch(e){console.error('INIT FAIL',e);process.exit(1)}
const run=x=>vm.runInContext(x,ctx);run("currentUser='QA';state=defaultState();");
let total=0,fail=0;function ck(name,val){total++;let ok=false;try{ok=typeof val==='function'?!!val():!!val}catch(e){console.log('FAIL',name,e.message);fail++;return}console.log(ok?'PASS':'FAIL',name);if(!ok)fail++}
ck('v12 loaded',()=>run("V12_VERSION==='1.2.0'"));
ck('login and top show Social Studies v1.2.0',()=>html.includes('國小五上・社會科・翰林版')&&html.includes('程式 v1.2.0')&&html.includes('top-version')&&html.includes('v1.2.0'));
ck('all cache-busted core assets use 1.2.0',()=>['styles.css','app.js','v08.js','v09.js','v10.js','v11.js','v12.js'].every(f=>html.includes(`${f}?v=1.2.0`)));
ck('full-page lesson/unit CSS exists',()=>css.includes('#lessonDialog.full-course-page')&&css.includes('#unitDialog.full-course-page')&&css.includes('width:100vw')&&css.includes('height:100dvh'));
ck('v12 applies full-page class',()=>code.includes("classList.add('full-course-page')")&&code.includes("textContent='←'"));
ck('1648 appears only as an explicit correction',()=>{const m=fs.readFileSync(__dirname+'/v12.js','utf8').match(/1648/g)||[];return m.length===1&&code.includes('不是 1648')});
ck('love-hate chain has core sequence',()=>['顏思齊','鄭芝龍','1624','1626','1642','1661–1662','1683→1684'].every(x=>code.includes(x)));
ck('Dutch governance covers forts/trade/local meetings',()=>['熱蘭遮','普羅民遮','鹿皮','蔗糖','地方會議'].every(x=>code.includes(x)));
ck('Spanish story covers Manila/Keelung/Tamsui/Red Fort correction',()=>['馬尼拉','和平島','淡水','聖多明哥','安東尼堡'].every(x=>code.includes(x)));
ck('Zheng story covers landing/siege/treaty/Chengtiang Fu',()=>['鹿耳門','禾寮港','先取普羅民遮','再圍熱蘭遮','私人動產','承天府'].every(x=>code.includes(x)));
ck('Yanping memorial correction included',()=>code.includes('1874')&&code.includes('沈葆楨')&&code.includes('延平郡王祠'));
ck('trade table separates Japan/SE Asia/Manila/China coast',()=>['糖皮換銀','糖皮換軍火香料','菲律賓／馬尼拉','中國沿海','轉口'].every(x=>code.includes(x)));
ck('education and beliefs included',()=>['1665','孔子廟','全臺首學','陳永華','媽祖','玄天上帝'].every(x=>code.includes(x)));
ck('Qing transition corrected',()=>code.includes('1683 施琅')&&code.includes('1684 清帝國正式納臺'));
ck('2-1 quiz now >=42',()=>run("lessons['2-1'].quiz.length>=42"));
ck('2-2 quiz now >=41',()=>run("lessons['2-2'].quiz.length>=41"));
ck('v12 lesson 2-1 stage1 outputs story chain',()=>{run("renderUnit2V12Stage('2-1',1)"); const s=el('#lessonContent').innerHTML; return s.includes('400 年前的臺灣海上連續劇')&&s.includes('愛恨交疊鏈')&&s.includes('顏思齊')&&s.includes('1683')});
ck('v12 lesson 2-1 stage2 outputs Dutch and Spanish episodes',()=>{run("renderUnit2V12Stage('2-1',2)"); const s=el('#lessonContent').innerHTML; return s.includes('荷蘭')&&s.includes('地方會議')&&s.includes('紅毛城別搞混')});
ck('v12 lesson 2-1 stage3 outputs Zheng episode',()=>{run("renderUnit2V12Stage('2-1',3)"); const s=el('#lessonContent').innerHTML; return s.includes('鹿耳門')&&s.includes('和約')&&s.includes('承天府')&&s.includes('延平郡王祠')});
ck('v12 lesson 2-2 stage1 outputs photos/legacy',()=>{run("renderUnit2V12Stage('2-2',1)"); const s=el('#lessonContent').innerHTML; return s.includes('古蹟')&&s.includes('熱蘭遮')&&s.includes('紅毛城')});
ck('v12 lesson 2-2 stage1 outputs species and faith',()=>{run("renderUnit2V12Stage('2-2',1)"); const s=el('#lessonContent').innerHTML; return s.includes('黃牛')&&s.includes('媽祖')});
ck('v12 lesson 2-2 stage2 outputs trade ledger',()=>{run("renderUnit2V12Stage('2-2',2)"); const s=el('#lessonContent').innerHTML; return s.includes('糖皮換銀')&&s.includes('轉口')&&s.includes('新港文書')});
ck('v12 lesson 2-2 stage3 outputs education ending',()=>{run("renderUnit2V12Stage('2-2',3)"); const s=el('#lessonContent').innerHTML; return s.includes('全臺首學')&&s.includes('陳永華')&&s.includes('1684')});
ck('exam A/B remain 100 points',()=>run("examTotal(examData.A)===100 && examTotal(examData.B)===100"));
ck('exam includes Red Fort/trade/treaty/life evidence',()=>['紅毛城','物流','糖皮換銀','地方會議','走私','轉口'].every(x=>JSON.stringify(run('examData')).includes(x)));
ck('no empty href',()=>!html.includes('href=""'));
ck('no TODO placeholders',()=>!/(TODO|FIXME|PLACEHOLDER_CONTENT|待補內容)/i.test(code+html));
ck('deploy files include v12',()=>['index.html','styles.css','app.js','v08.js','v09.js','v10.js','v11.js','v12.js','404.html','manifest.webmanifest','.nojekyll','VERSION','SOURCES.md'].every(f=>fs.existsSync(__dirname+'/'+f)));
console.log(`\nQuiz lengths: 2-1=${run("lessons['2-1'].quiz.length")}, 2-2=${run("lessons['2-2'].quiz.length")}`);
console.log(`Passed ${total-fail}/${total}`);if(fail)process.exit(1);
