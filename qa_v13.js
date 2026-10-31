const fs=require('fs'),vm=require('vm');
const files=['app.js','v08.js','v09.js','v10.js','v11.js','v12.js','v13.js'];
const code=files.map(f=>fs.readFileSync(__dirname+'/'+f,'utf8')).join('\n');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),css=fs.readFileSync(__dirname+'/styles.css','utf8');
const elements=new Map();
function el(sel=''){
 if(elements.has(sel))return elements.get(sel); const classes=new Set();
 const base={selector:sel,hidden:false,open:false,innerHTML:'',textContent:'',value:'',disabled:false,dataset:{},style:{},className:'',parentNode:null,
  classList:{add(...xs){xs.forEach(x=>classes.add(x))},remove(...xs){xs.forEach(x=>classes.delete(x))},toggle(x,v){if(v===undefined){classes.has(x)?classes.delete(x):classes.add(x)}else v?classes.add(x):classes.delete(x)},contains(x){return classes.has(x)}},
  showModal(){this.open=true},close(){this.open=false},setAttribute(){},getAttribute(){return null},addEventListener(){},focus(){},scrollIntoView(){},
  querySelector(){return null},querySelectorAll(){return []},appendChild(ch){ch.parentNode=this;return ch},insertBefore(ch){ch.parentNode=this;return ch},remove(){},closest(){return null},
  getBoundingClientRect(){return {left:0,top:0,width:100,height:100}},click(){if(this.onclick)this.onclick({preventDefault(){},stopPropagation(){}})}
 }; elements.set(sel,base);return base;
}
const storage={};
const document={querySelector:s=>el(s),querySelectorAll:s=>[],getElementById:id=>el('#'+id),addEventListener(){},createElement:()=>el('created'+Math.random()),body:{appendChild(){}}};
const localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v),removeItem:k=>delete storage[k]};
const ctx={console,document,localStorage,window:{},crypto:require('crypto').webcrypto,TextEncoder,URL,encodeURIComponent,decodeURIComponent,setTimeout:(f)=>0,clearTimeout(){},setInterval:(f)=>0,clearInterval(){},Date,Math,JSON,confirm:()=>true,scrollTo(){},speechSynthesis:{getVoices:()=>[],cancel(){},speak(){},speaking:false},SpeechSynthesisUtterance:function(){},AudioContext:function(){},webkitAudioContext:function(){},FormData:function(){},HTMLElement:function(){},addEventListener(){}};
ctx.window=ctx;ctx.window.addEventListener=()=>{};ctx.window.AudioContext=function(){return {currentTime:0,createOscillator(){return {frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}}},createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}},destination:{}}};
vm.createContext(ctx);
try{vm.runInContext(code,ctx,{filename:'bundle-v13.js'})}catch(e){console.error('INIT FAIL',e);process.exit(1)}
const run=x=>vm.runInContext(x,ctx);run("currentUser='QA';state=defaultState(); state.v13Tracks={};");
let total=0,fail=0;function ck(name,fn){total++;try{const ok=!!fn();console.log(ok?'PASS':'FAIL',name);if(!ok)fail++}catch(e){console.log('FAIL',name,e.message);fail++}}
ck('v13 loaded',()=>run("V13_VERSION==='1.3.0'"));
ck('login + top show v1.3.0',()=>html.includes('程式 v1.3.0')&&html.includes('top-version">v1.3.0'));
ck('all cache-busted assets use 1.3.0',()=>['styles.css','app.js','v08.js','v09.js','v10.js','v11.js','v12.js','v13.js'].every(f=>html.includes(`${f}?v=1.3.0`)));
ck('Zeelandia direct image URL repaired',()=>run("U2_IMAGES.zeelandia.includes('upload.wikimedia.org') && U2_IMAGES.zeelandia.includes('View_of_the_town_Taioan')"));
ck('Fort gallery links NMTH official collection',()=>run("u2FortGallery().includes('collections.nmth.gov.tw/CollectionContent.aspx')"));
ck('map frame uses image-anchored marker',()=>run("mapChallengeHtml('x','t','i',[],'c').includes('v13-map-frame')")&&css.includes('.v13-map-frame{position:relative'));
ck('map marker reduced to <=16px CSS',()=>css.includes('width:16px!important')&&css.includes('height:16px!important'));
ck('world/east coordinate banks remain complete',()=>run('worldItems.length===8 && eastItems.length===8'));
ck('five lessons have 4 memory hooks each',()=>run("['1-1','1-2','1-3','2-1','2-2'].every(id=>V13_MEMORY[id]&&V13_MEMORY[id].length===4)"));
ck('memory hooks include key mnemonics',()=>['24荷南','糖皮換銀','夏鮪冬烏','舊長打','東阿美'].every(x=>code.includes(x)));
ck('five lessons have four quiz tracks',()=>run("Object.values(V13_TRACKS).every(x=>x.length===4)"));
ck('each track can build at least 6 questions',()=>run("Object.entries(V13_TRACKS).every(([id,ts])=>ts.every(t=>v13TrackPool(id,t).length>=6))"));
ck('each track has at least 6 native on-topic questions',()=>run("Object.entries(V13_TRACKS).every(([id,ts])=>ts.every(t=>{const re=new RegExp(t[3]);return lessons[id].quiz.filter(q=>re.test(q[0]+' '+(q[3]||''))).length>=6}))"));
ck('tiered quiz is 6 questions per track',()=>code.includes('slice(0,6)')&&code.includes('i+1}/6'));
ck('tiered quiz exposes 3 difficulty levels',()=>code.includes('基礎定位')&&code.includes('應用連結')&&code.includes('挑戰推理'));
ck('matching banks exist for all five lessons',()=>run("['1-1','1-2','1-3','2-1','2-2'].every(id=>V13_MATCH_BANK[id].length>=6)"));
ck('matching game awards only after all pairs',()=>code.includes('done.size===bank.length'));
ck('Unit1 board questions expanded',()=>run("V10_U1_BOARD.filter(x=>Array.isArray(x.q)).reduce((n,x)=>n+x.q.length,0)>=95"));
ck('Unit2 board questions expanded',()=>run("V10_U2_BOARD.filter(x=>Array.isArray(x.q)).reduce((n,x)=>n+x.q.length,0)>=110"));
ck('Unit2 board synced v1.2 key content',()=>run("(()=>{const t=JSON.stringify(V10_U2_BOARD);return ['顏思齊','鄭芝龍','地方會議','鹿耳門','私人動產','承天府','陳永華','馬尼拉','走私','1684'].every(k=>t.includes(k))})()"));
ck('Unit2 events include treaty + Qing transition',()=>run("(()=>{const t=JSON.stringify(V10_U2_EVENTS);return ['和約','1683','1684','鄭芝龍'].every(k=>t.includes(k))})()"));
ck('game combo system exists',()=>code.includes('連勝')&&code.includes('g.streak'));
ck('board tile text enlarged',()=>css.includes('.v10-board .board-space>b{font-size:.9rem'));
ck('game question text enlarged',()=>css.includes('.v10-game-question{font-size:1.28rem'));
ck('A/B exams remain 100',()=>run('examTotal(examData.A)===100 && examTotal(examData.B)===100'));
ck('2-1 quiz still rich >=43',()=>run("lessons['2-1'].quiz.length>=43"));
ck('2-2 quiz still rich >=42',()=>run("lessons['2-2'].quiz.length>=42"));
ck('no empty href',()=>!html.includes('href=""'));
ck('no TODO placeholders',()=>!/(TODO|FIXME|PLACEHOLDER_CONTENT|待補內容)/i.test(code+html));
ck('deploy files include v13',()=>['index.html','styles.css','app.js','v08.js','v09.js','v10.js','v11.js','v12.js','v13.js','404.html','manifest.webmanifest','.nojekyll','VERSION','SOURCES.md'].every(f=>fs.existsSync(__dirname+'/'+f)));
console.log(`\nU1 board Q=${run("V10_U1_BOARD.filter(x=>Array.isArray(x.q)).reduce((n,x)=>n+x.q.length,0)")}`);
console.log(`U2 board Q=${run("V10_U2_BOARD.filter(x=>Array.isArray(x.q)).reduce((n,x)=>n+x.q.length,0)")}`);
console.log(`2-1 quiz=${run("lessons['2-1'].quiz.length")}, 2-2 quiz=${run("lessons['2-2'].quiz.length")}`);
console.log(`Passed ${total-fail}/${total}`);if(fail)process.exit(1);
