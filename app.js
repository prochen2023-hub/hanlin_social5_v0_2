const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const ACCOUNTS_KEY='social5_accounts_v02', SESSION_KEY='social5_session_v02';
let accounts=JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||'{}');
let currentUser=null,state=null,selectedLogin=null;
const todayKey=()=>new Date().toISOString().slice(0,10);
const defaultState=()=>({
  stars:0,streak:1,lastVisit:todayKey(),progress:0,
  daily:{date:todayKey(),done:[]},doneTasks:[],
  lesson11Stages:[],lessonStages:{},lessonQuizBest:{},
  wrongBank:[],achievements:[],completedLessons:[],
  examBest:{A:0,B:0},examAttempts:{A:0,B:0}
});
const normalizeName=n=>n.trim().replace(/\s+/g,' ');
const userKey=name=>'social5_profile_v02_'+name.toLowerCase();
async function hashPin(pin,salt){
  if(crypto?.subtle){const data=new TextEncoder().encode(`${salt}|${pin}`);const h=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('')}
  let h=2166136261;for(const c of `${salt}|${pin}`){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return String(h>>>0)
}
function saveAccounts(){localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(accounts))}
function saveState(){if(currentUser)localStorage.setItem(userKey(currentUser),JSON.stringify(state))}
function migrateState(raw){
  const d=defaultState(),s={...d,...raw};
  s.lessonStages={...(raw.lessonStages||{})};
  if(raw.lesson11Stages?.length&&!s.lessonStages['1-1'])s.lessonStages['1-1']=raw.lesson11Stages;
  s.lessonQuizBest={...(raw.lessonQuizBest||{})};
  if(raw.quizBest&&!s.lessonQuizBest['1-1'])s.lessonQuizBest['1-1']=raw.quizBest;
  s.examBest={...d.examBest,...(raw.examBest||{})};s.examAttempts={...d.examAttempts,...(raw.examAttempts||{})};
  s.daily=raw.daily?.date===todayKey()?raw.daily:{date:todayKey(),done:[]};
  return s;
}
function loadState(name){return migrateState(JSON.parse(localStorage.getItem(userKey(name))||'{}'))}
function uid(){return crypto.getRandomValues?crypto.getRandomValues(new Uint32Array(2)).join('-'):Date.now()+'-'+Math.random()}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function shuffled(arr){return arr.map((v,i)=>({v,r:Math.random(),i})).sort((a,b)=>a.r-b.r).map(x=>x.v)}

function renderAccounts(){
 const names=Object.keys(accounts),picker=$('#accountPicker'),form=$('#createForm');
 if(!names.length){picker.hidden=true;form.hidden=false;return}
 picker.hidden=false;form.hidden=true;$('#accountList').innerHTML=names.map(n=>`<button type="button" class="account-btn" data-account="${escapeHtml(n)}"><span>🧭</span><span><b>${escapeHtml(n)}</b><small>繼續我的進度</small></span></button>`).join('');
 $$('[data-account]').forEach(b=>b.onclick=()=>selectLogin(b.dataset.account));
}
function selectLogin(name){selectedLogin=name;$('#accountPicker').hidden=true;$('#createForm').hidden=true;$('#loginForm').hidden=false;$('#loginName').textContent=name;$('#loginPin').value='';$('#loginPin').focus()}
$('#switchAccount').onclick=()=>{$('#loginForm').hidden=true;renderAccounts()};
$('#addAccount').onclick=()=>{$('#accountPicker').hidden=true;$('#loginForm').hidden=true;$('#createForm').hidden=false;$('#createName').value='';$('#createPin').value='';$('#createName').focus()};
$('#createForm').addEventListener('submit',async e=>{e.preventDefault();const name=normalizeName($('#createName').value),pin=$('#createPin').value,msg=$('#createMsg');if(name.length<1||pin.length<4){msg.textContent='名字至少 1 個字，PIN／密碼至少 4 位。';return}if(accounts[name]){msg.textContent='這個名字已經有人用了，換一個名字吧。';return}const salt=uid();accounts[name]={salt,hash:await hashPin(pin,salt),createdAt:Date.now()};saveAccounts();localStorage.setItem(userKey(name),JSON.stringify(defaultState()));login(name)});
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();const rec=accounts[selectedLogin],pin=$('#loginPin').value,msg=$('#loginMsg');if(!rec)return;const ok=(await hashPin(pin,rec.salt))===rec.hash;if(!ok){msg.textContent='PIN／密碼不對，再試一次。';return}login(selectedLogin)});
function login(name){currentUser=name;state=loadState(name);localStorage.setItem(SESSION_KEY,name);$('#authView').hidden=true;$('#appView').hidden=false;touchStreak();renderState()}
function logout(){localStorage.removeItem(SESSION_KEY);currentUser=null;state=null;$('#appView').hidden=true;$('#authView').hidden=false;$('#loginForm').hidden=true;$('#createForm').hidden=Object.keys(accounts).length>0;renderAccounts()}
function touchStreak(){const today=todayKey();if(state.lastVisit===today)return;const prev=new Date(state.lastVisit),now=new Date(today),d=Math.round((now-prev)/86400000);state.streak=d===1?state.streak+1:1;state.lastVisit=today;state.daily={date:today,done:[]};saveState()}

/* v0.6 accessibility: Taiwanese Mandarin text-to-speech + exam bells */
let speakingButton=null;
function cleanSpeechText(t){return String(t||'').replace(/<[^>]*>/g,' ').replace(/\p{Extended_Pictographic}/gu,' ').replace(/\s+/g,' ').trim()}
function preferredVoice(){const vs=speechSynthesis.getVoices?.()||[];return vs.find(v=>/^zh-TW$/i.test(v.lang))||vs.find(v=>/zh-(Hant|TW)/i.test(v.lang))||vs.find(v=>/^zh/i.test(v.lang))||null}
function speakText(text,btn=null){if(!('speechSynthesis' in window)){showToast('這個瀏覽器目前不支援語音朗讀。');return}const t=cleanSpeechText(text);if(!t)return;if(speechSynthesis.speaking){speechSynthesis.cancel();if(speakingButton===btn){speakingButton=null;return}}const u=new SpeechSynthesisUtterance(t);u.lang='zh-TW';u.rate=.92;u.pitch=1;const v=preferredVoice();if(v)u.voice=v;speakingButton=btn;if(btn)btn.classList.add('speaking');u.onend=u.onerror=()=>{if(btn)btn.classList.remove('speaking');speakingButton=null};speechSynthesis.speak(u)}
function speechBtn(text,label='朗讀'){return `<button type="button" class="speak-btn" data-speech="${encodeURIComponent(cleanSpeechText(text))}" aria-label="${label}" title="${label}">🔊</button>`}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-speech]');if(b){e.preventDefault();e.stopPropagation();speakText(decodeURIComponent(b.dataset.speech||''),b)}});
if('speechSynthesis' in window){speechSynthesis.onvoiceschanged=()=>preferredVoice()}
let audioCtx=null;
function bell(times=1){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();let now=audioCtx.currentTime;for(let i=0;i<times;i++){const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(i%2?880:660,now+i*.28);g.gain.setValueAtTime(.0001,now+i*.28);g.gain.exponentialRampToValueAtTime(.18,now+i*.28+.02);g.gain.exponentialRampToValueAtTime(.0001,now+i*.28+.22);o.connect(g);g.connect(audioCtx.destination);o.start(now+i*.28);o.stop(now+i*.28+.24)}}catch(e){}}


const units={
 1:{title:'臺灣的位置與先民足跡',theme:'🗺️',subtitle:'先知道臺灣在哪裡，再用考古證據與文化故事認識這片土地上的人。',lessons:['1-1','1-2','1-3']},
 2:{title:'臺灣登上國際舞臺',theme:'⛵',subtitle:'跟著航線與時間軸，看不同勢力為何來到臺灣，以及留下哪些影響。',lessons:['2-1','2-2']},
 3:{title:'成為清帝國的領土',theme:'🏘️',subtitle:'看看移民、開墾與開港通商，如何改變臺灣。',lessons:['3-1','3-2']},
 4:{title:'土地的利用與變遷',theme:'🌿',subtitle:'從山到海，觀察人們如何利用環境，也學會做選擇。',lessons:['4-1','4-2','4-3']},
 5:{title:'製作小書看見臺灣',theme:'📘',subtitle:'把你最想研究的臺灣主題，做成自己的學期成果。',lessons:['5-1','5-2','5-3']}
};
const stages=[{icon:'👀',name:'看一眼'},{icon:'🖐️',name:'玩一下'},{icon:'💬',name:'聽懂故事'},{icon:'🔍',name:'找證據'},{icon:'✅',name:'闖關'},{icon:'🛟',name:'救援'}];

function mapSvg(){return `<svg class="east-asia-map" viewBox="0 0 720 380" role="img" aria-label="簡化的東亞位置示意圖"><rect width="720" height="380" fill="#dff1ec"/><path d="M0 35 L210 20 300 70 330 120 300 160 260 180 245 230 170 250 110 235 55 190 0 175Z" fill="#f5e7bd"/><path d="M430 28 L468 70 485 120 472 158 448 138 450 88Z" fill="#f5e7bd"/><path d="M325 235 C350 245 365 260 380 280 L360 318 330 300Z" fill="#f5e7bd"/><ellipse cx="392" cy="206" rx="10" ry="22" class="taiwan-dot"/><path d="M405 210 C500 185 590 170 720 175" fill="none" stroke="#8bb9cf" stroke-width="5" stroke-dasharray="12 10"/><text x="85" y="112" class="map-label">亞洲大陸</text><text x="470" y="90" class="map-label">日本</text><text x="315" y="348" class="map-label">菲律賓方向</text><text x="410" y="204" class="map-label">臺灣</text><text x="540" y="146" class="map-label">太平洋</text></svg>`}
function archaeologyVisual(){return `<div class="layer-box"><div class="soil-layer modern"><b>現在</b><span>地面上的生活</span></div><div class="soil-layer metal"><b>較晚的文化層</b><span>鐵器、陶片等線索</span></div><div class="soil-layer neolithic"><b>更早的文化層</b><span>磨製石器、聚落等線索</span></div><div class="soil-layer paleolithic"><b>更深的文化層</b><span>打製石器等線索</span></div></div>`}
function indigenousVisual(){return `<div class="island-scene"><div class="mountain-shape">⛰️</div><div class="coast-shape">🌊</div><div class="scene-note"><b>同一座島，不同環境</b><span>山地、縱谷、平原、海岸與離島，孕育出不同的生活方式與文化。</span></div></div>`}
function voyageVisual(){return `<div class="voyage-map"><div class="route-node europe">歐洲</div><div class="route-node asia">東亞</div><div class="route-node taiwan">臺灣</div><div class="route-node sea">東南亞</div><div class="route-line r1"></div><div class="route-line r2"></div><div class="route-line r3"></div><span class="ship s1">⛵</span><span class="ship s2">⛵</span></div>`}
function legacyVisual(){return `<div class="legacy-grid"><div><span>🏰</span><b>城堡與據點</b><small>留下可被看見的歷史痕跡</small></div><div><span>✝️</span><b>宗教與文化</b><small>西方宗教與文字教育進入臺灣</small></div><div><span>🚢</span><b>海上貿易</b><small>臺灣更深地連入區域貿易網絡</small></div><div><span>🌾</span><b>移民與開墾</b><small>漢人移入增加，社會組成逐步改變</small></div></div>`}
function immigrantVisual(){return `<div class="concept-river"><div>🌊 渡海來臺</div><span>→</span><div>🌾 開墾水利</div><span>→</span><div>🏘️ 聚落市街</div><span>→</span><div>🤝 合作與衝突</div></div>`}
function portVisual(){return `<div class="port-scene"><div>🚢<b>開港</b><small>外商與商品進出</small></div><div>🍵<b>茶・糖・樟腦</b><small>出口帶動產業</small></div><div>🏥<b>醫療教育</b><small>西方制度與知識進入</small></div><div>🚂<b>近代建設</b><small>治理方式逐步改變</small></div></div>`}
function terrainVisual(){return `<div class="terrain-band"><div class="mount">⛰️<b>山地</b></div><div class="hill">🌄<b>丘陵</b></div><div class="plain">🌾<b>平原</b></div><div class="river">🏞️<b>河川</b></div></div>`}
function coastVisual(){return `<div class="coast-compare"><div><b>西部</b><span>較平緩、沙岸與泥岸較多</span><small>港口、養殖、濕地、聚落</small></div><div><b>東部</b><span>山地近海、岩岸與深水較常見</span><small>漁業、港灣、景觀與保育</small></div><div><b>北部</b><span>岬灣、岩岸地形多變</span><small>天然港灣與觀光</small></div><div><b>南部</b><span>珊瑚礁等特殊海岸</span><small>生態與遊憩價值</small></div></div>`}
function sustainVisual(){return `<div class="balance-visual"><div>🏗️<b>開發需求</b></div><div class="balance-mid">⚖️</div><div>🌱<b>環境保護</b></div><p>真正的題目不是「完全不能開發」，而是如何兼顧生活需求、風險與環境永續。</p></div>`}
function researchVisual(){return `<div class="research-flow"><span>❓好問題</span><b>→</b><span>🔎找資料</span><b>→</b><span>🧠整理證據</span><b>→</b><span>📘清楚呈現</span></div>`}


const lessons={
 '1-1':{
  unit:1,title:'從地圖探索位置與發展有何關聯？',short:'臺灣在哪裡？位置會帶來什麼影響？',visual:mapSvg,
  intro:'先不要背經緯度。看懂臺灣和亞洲大陸、太平洋、周邊地區的「相對位置」，才知道後面的氣候、交通與文化交流為什麼會發生。',
  facts:[['🌏 東亞位置','臺灣位在東亞，西側靠近亞洲大陸，東側面向太平洋。'],['🌬️ 季風與生活','季節性的風向與雨量會影響農作、建築與生活安排。'],['⛵ 海上交流','位在海上交通路線附近，使人群、商品與文化較容易往來。'],['🐦 生物中繼','海陸位置也會影響候鳥與其他生物的遷徙、分布。']],
  pairs:[['四周靠海','海上交通與海洋資源較重要'],['位在東亞交通附近','較容易和不同地區交流'],['受到季風影響','生活會因季節風向與雨量調整'],['島嶼位在遷徙路徑附近','可能成為候鳥等生物的中繼站']],
  story:[['🧭','位置','臺灣位在東亞、靠近海洋。'],['🌬️','氣候','季風與海洋影響各地的生活方式。'],['⛵','交流','海上交通讓人群、物品與文化移動。'],['🐦','生態','島嶼位置也和生物遷徙有關。']],
  claim:'「臺灣的位置有利於和東亞其他地區交流。」哪個證據最能直接支持？',evidence:[['A','臺灣北方有日本、西側靠近亞洲大陸，南方接近菲律賓方向，位在海上交通附近。',true],['B','臺灣有很多高山。',false],['C','臺灣許多城市都有便利商店。',false]],
  quiz:[
   ['臺灣大致位在世界哪個區域？',['東亞','南美洲','歐洲'],0,'先看亞洲大陸東側與太平洋西側。'],
   ['哪個最能說明「地理位置會影響交流」？',['靠近海上交通路線，較容易接觸不同地區','山比較高，所以完全不會交流','島嶼一定和外界隔絕'],0,'找會直接改變交通與接觸機會的條件。'],
   ['季風最直接和哪一類生活條件有關？',['風向、雨量與季節變化','文字字體大小','歷史人物姓名'],0,'季風是一種季節性風向系統。'],
   ['要支持「臺灣與東亞交流方便」，哪個證據最有力？',['周邊有日本、亞洲大陸與往南海域','臺灣有很多夜市','臺灣有很多高山'],0,'挑和位置、距離、交通最直接的證據。'],
   ['本課最重要的想法是？',['位置、環境會和生活、歷史發展互相影響','只要背地名就學完','臺灣的位置和發展無關'],0,'重點是「位置和發展的關聯」。']]
 },
 '1-2':{
  unit:1,title:'史前人們如何善用資源維持生活？',short:'從出土文物，推理史前人怎麼生活。',visual:archaeologyVisual,
  intro:'史前時代沒有留下我們熟悉的文字紀錄，考古學家會從遺址、文化層和器物找線索，再推測人們如何取得食物、製作工具與交換物品。',
  facts:[['🪨 長濱文化','舊石器時代使用打製石器，臨海生活，也已懂得用火。'],['🌾 卑南遺址','新石器時代農業較發達，食物來源穩定，有利聚落形成。'],['⚒️ 十三行文化','金屬器時代使用鐵器，工具效率提高，生產方式再改變。'],['💚 臺灣玉','花蓮產的臺灣玉在島內多地甚至東南亞出土，顯示已有交換與航海。']],
  pairs:[['打製石器','長濱文化的生活線索'],['磨製石器與農業聚落','新石器時代生活更定居'],['鐵器耕作','金屬器時代工具效率提升'],['臺灣玉在遠方出土','存在跨地區器物交換']],
  story:[['🪨','就地取材','早期人們利用石材製作工具，也從海岸與陸地取得食物。'],['🌱','農業出現','種植讓食物取得較穩定，人口與聚落逐漸發展。'],['⚒️','工具改變','鐵器等新工具提升耕作與加工效率。'],['🚣','交換擴大','臺灣玉的分布顯示島內與跨海交換已經存在。']],
  claim:'「史前人們已經有跨海交換能力。」哪個證據最能支持？',evidence:[['A','花蓮產的臺灣玉，在臺灣多處與東南亞遺址都曾出土。',true],['B','臺灣東部有很多山。',false],['C','現代臺灣有大型港口。',false]],
  quiz:[
   ['史前時代的生活，最常靠什麼方式研究？',['遺址與出土器物','電視新聞','現代人的日記'],0,'沒有熟悉的文字紀錄時，要靠考古證據。'],
   ['長濱文化最適合和哪個線索配對？',['打製石器、臨海生活','大量鐵製農具','現代機械農業'],0,'長濱文化屬舊石器時代。'],
   ['農業發展為什麼可能促成聚落形成？',['食物較穩定，人口能較長期居住','一定要每天遠距移動','完全不需要工具'],0,'穩定食物來源有利定居。'],
   ['十三行文化的鐵器反映什麼？',['金屬工具可提升工作效率','人們已經使用汽車','人們沒有農業'],0,'注意工具材料改變。'],
   ['臺灣玉在東南亞也被發現，最合理的推論是？',['史前已有跨地區交換與航海','玉只可能自己漂過海','所有史前人都住在花蓮'],0,'從「物品出現在產地以外」推理交換。']]
 },
 '1-3':{
  unit:1,title:'原住民族的文化與環境有何關聯？',short:'不是背族名，而是看文化如何和環境一起形成。',visual:indigenousVisual,
  intro:'臺灣官方目前認定 16 個原住民族。不同族群生活的地理環境、社會組織、傳說與知識各有特色，學習時最重要的是理解差異並尊重，而不是把所有族群當成一樣。',
  facts:[['🧑🏽‍🤝‍🧑🏽 多元族群','官方目前認定 16 族，各族有自己的語言、傳統與歷史經驗。'],['🦌 傳說與環境','邵族白鹿傳說、達悟族等故事，都能看見人和自然環境的關係。'],['🌿 生態智慧','傳統知識常包含對季節、植物、漁獵與資源使用的細緻觀察。'],['🤝 尊重差異','文化會隨時代改變；理解文化要避免用單一印象套用所有族群。']],
  pairs:[['傳統故事','可能保存族群對環境與歷史的理解'],['季節性採集或漁獵知識','反映長期觀察自然的經驗'],['不同族群有不同語言與制度','文化不應被當成完全相同'],['參觀博物館與文化館','從文物與族人觀點認識文化']],
  story:[['🗺️','環境不同','山區、海岸、縱谷與離島提供不同資源與挑戰。'],['👥','社會組織','族群在生活中形成不同的分工、規範與互助方式。'],['📖','故事知識','神話、祭儀與口述傳統保存重要的文化記憶。'],['🌱','持續改變','今天的原住民族文化仍在生活中延續、創新，不是停在過去。']],
  claim:'「原住民族的傳統文化和自然環境有關。」哪個證據最直接？',evidence:[['A','族群的傳說、採集、漁獵與季節知識常與居住環境密切相關。',true],['B','每個族群的生活方式都完全一樣。',false],['C','只要住在山上就一定屬於同一族。',false]],
  quiz:[
   ['目前中央政府認定的臺灣原住民族共有幾族？',['16族','6族','36族'],0,'目前官方認定是 16 族。'],
   ['學習原住民族文化時，哪種態度最適合？',['理解各族差異並尊重族人觀點','把所有族群想成完全一樣','只用外人的刻板印象判斷'],0,'多元文化的核心是理解與尊重差異。'],
   ['傳統故事能提供什麼學習線索？',['族群對環境、歷史與價值的理解','精確的現代氣象預報數字','所有人的生活都相同'],0,'故事可以保存文化記憶與環境知識。'],
   ['哪個最能表現「生態智慧」？',['依季節與資源狀況調整採集、漁獵方式','無限制取得所有資源','完全忽略環境變化'],0,'重點在長期觀察與合宜使用資源。'],
   ['下列何者正確？',['原住民族文化會延續也會創新','原住民族文化只存在博物館','每一族的文化都完全相同'],0,'文化是活的，會隨社會變遷。']]
 },
 '2-1':{
  unit:2,title:'臺灣為什麼在大航海時代崛起？',short:'400 多年前，為什麼很多勢力都注意到臺灣？',visual:voyageVisual,
  intro:'約 17 世紀，歐洲國家積極向亞洲拓展海上貿易。臺灣位在東亞海路的重要位置，吸引荷蘭、西班牙等勢力來建立據點；後來鄭氏政權也利用臺灣的位置與資源經營。',
  facts:[['🇳🇱 荷蘭','1624 年起以臺灣南部為重要據點，拓展貿易並進行統治。'],['🇪🇸 西班牙','1626 年起在臺灣北部建立據點，發展貿易與傳教。'],['⚔️ 1642','荷蘭勢力北上，西班牙離開臺灣。'],['🏯 鄭氏政權','1661 年鄭成功來臺，1662 年荷蘭人離臺；鄭氏持續經營貿易、開墾與制度。']],
  pairs:[['荷蘭人','主要從南臺灣建立貿易與統治據點'],['西班牙人','主要在北臺灣建立據點'],['鄭氏政權','利用臺灣作為政權基地並經營海上貿易'],['臺灣地理位置','讓東亞與東南亞海路上的競爭更集中']],
  story:[['🌍','大航海時代','歐洲國家向亞洲拓展航路，競爭貿易利益。'],['📍','臺灣位置','臺灣位在東亞海路節點，戰略與轉運價值提高。'],['🏰','建立據點','荷蘭在南部、西班牙在北部建立據點。'],['⚔️','勢力更替','西班牙離臺，後來鄭氏驅逐荷蘭，臺灣統治者再變。']],
  claim:'「臺灣在大航海時代受到多方勢力重視，和地理位置有關。」哪個證據最直接？',evidence:[['A','臺灣位在日本、中國沿海與東南亞之間的海上航路附近。',true],['B','臺灣有很多現代高速公路。',false],['C','臺灣最高山超過三千公尺。',false]],
  quiz:[
   ['大航海時代臺灣逐漸受到重視，最重要的背景之一是？',['位在東亞海上航路附近','當時已有高鐵','歐洲國家完全停止航海'],0,'把世界航路和臺灣位置連起來。'],
   ['1624 年起主要在臺灣南部建立據點的是？',['荷蘭人','西班牙人','葡萄牙政府'],0,'記「荷蘭南、西班牙北」。'],
   ['1626 年起主要在臺灣北部建立據點的是？',['西班牙人','荷蘭人','鄭氏'],0,'北部是西班牙的重要活動區。'],
   ['1642 年後，西班牙人在臺灣的據點如何變化？',['被荷蘭勢力取代，西班牙離臺','擴張到全島','改成清帝國據點'],0,'時間軸：1626 來、1642 離。'],
   ['鄭氏政權經營臺灣時，哪項說法合理？',['利用臺灣位置進行貿易並推動開墾','完全不和外地交易','只經營北極航線'],0,'鄭氏利用海上位置與資源。']]
 },
 '2-2':{
  unit:2,title:'大航海時代在臺灣留下哪些影響？',short:'城堡、宗教、貿易、移民，哪些改變延續下來？',visual:legacyVisual,
  intro:'大航海時代不只是「誰打贏誰」。西方勢力帶來宗教與文化接觸，海上貿易擴大；鄭氏時期又推動教育、開墾與移民，使臺灣社會組成出現重要變化。',
  facts:[['🏰 文化資產','城堡、遺址與地名，讓我們今天仍能追查當時的歷史。'],['✝️ 西方文化','荷蘭與西班牙除了商業，也有宗教傳播等活動。'],['🚢 海上貿易','商品與人員流動更密集，臺灣成為區域貿易的一環。'],['🌾 社會變化','鄭氏招募漢人來臺開墾、推動教育，漢人社會規模擴大。']],
  pairs:[['城堡與遺址','屬於可看見的有形文化資產'],['傳教與教育活動','帶來新的宗教、文字與文化接觸'],['對外貿易','讓臺灣和更多地區形成商品交換'],['招募漢人來臺開墾','促使人口與社會組成改變']],
  story:[['🏰','留下痕跡','城堡、遺址讓後人看見外來勢力活動。'],['🗣️','文化接觸','宗教、語言、文字與生活方式產生新的交流。'],['🚢','貿易網絡','臺灣和日本、中國沿海、東南亞等地交換商品。'],['👥','社會重組','漢人移入與開墾增加，臺灣逐步形成以漢人為主體的社會。']],
  claim:'「大航海時代的影響不只發生在戰爭，也改變臺灣社會。」哪個證據最完整？',evidence:[['A','除了城堡與戰爭，也出現宗教傳播、貿易擴大、移民與開墾等長期變化。',true],['B','只要記住幾個戰爭年份就能解釋全部影響。',false],['C','當時的交流完全沒有留下任何文化痕跡。',false]],
  quiz:[
   ['荷蘭、西班牙來臺的重要目的包括？',['商業利益與宗教傳播','建造現代捷運','發展太空科技'],0,'課程重點是貿易與傳教。'],
   ['今天看到當時城堡遺址，最適合稱為？',['有形文化資產與歷史證據','未來預言','自然形成的山脈'],0,'建築遺址是人類留下的歷史痕跡。'],
   ['鄭氏推動開墾、教育與招募漢人來臺，造成什麼影響？',['漢人社會規模擴大','臺灣人口完全消失','臺灣停止對外貿易'],0,'注意人口與社會組成。'],
   ['海上貿易擴大代表什麼？',['臺灣和周邊地區的商品、人群交流增加','臺灣更完全孤立','所有商品都只能在島內流通'],0,'貿易會增加跨地區連結。'],
   ['研究大航海時代影響，最好的方法是？',['一起看人物、事件、遺址、貿易與社會變化','只背一個人物','只看現代地圖不看歷史'],0,'社會科要把多種證據串起來。']]
 }
};


Object.assign(lessons,{
 '3-1':{
  unit:3,title:'早期移民如何在臺灣建立家園？',short:'渡海、開墾、聚落、衝突與合作，家園怎麼形成？',visual:immigrantVisual,
  intro:'清帝國把臺灣納入版圖後，來臺移民持續增加。跨越臺灣海峽有風浪風險，抵達後還要面對土地、水源與疾病等挑戰；人們透過開墾、水利、聚落與信仰建立生活，也可能因資源與群體差異產生衝突。',
  facts:[['🛶 渡海風險','早期渡海交通不便，風浪與航行風險高。'],['📜 管理限制','清帝國前期曾用限制渡臺等政策管理人口與秩序。'],['🌾 開墾水利','移民開墾農地、修築水圳，使耕地與聚落逐步擴大。'],['🏘️ 聚落形成','市場、廟宇、道路與家族網絡，讓生活圈逐漸穩定。']],
  pairs:[['渡海來臺','要面對海象與航行風險'],['修築水圳','讓農業用水更穩定'],['廟宇與市場','成為聚落共同生活的重要場所'],['民變與械鬥','反映治理、資源競爭與群體衝突等問題'],['漢人移民增加','漢人文化逐漸成為社會主流']],
  story:[['🌊','渡海','許多人從中國東南沿海渡海來臺。'],['🌾','開墾','農地與水利建設讓生活逐漸穩定。'],['🏘️','聚落','市場、廟宇與交通路線把人群連在一起。'],['⚠️','衝突','土地、水源與群體差異有時造成民變或械鬥。'],['🤝','融合','長期互動後，臺灣社會形成新的地方生活與文化。']],
  claim:'「早期移民建立家園，不只是蓋房子，而是建立一整套生活網絡。」哪個證據最直接？',evidence:[['A','移民同時開墾農地、修水圳，並形成市場、廟宇與聚落。',true],['B','臺灣今天有很多高樓。',false],['C','所有移民都住在同一個村落。',false]],
  quiz:[['早期移民渡海來臺首先可能面對什麼？',['海象與航行風險','高速鐵路停駛','雪地暴風'],0,'先想當時的交通條件。'],['修築水圳的重要作用是？',['提供較穩定農業用水','讓海水變淡水','讓山變成平原'],0,'農業需要穩定水源。'],['市場與廟宇對聚落有什麼功能？',['提供交易、信仰與公共互動空間','讓所有人停止工作','只供外國商人使用'],0,'聚落需要共同生活空間。'],['民變與械鬥常和哪些問題有關？',['治理不易、資源競爭與群體衝突','只有天氣變冷','完全和社會無關'],0,'從人群與資源的互動思考。'],['漢人移民長期增加帶來什麼社會變化？',['漢人文化逐漸成為社會主流之一','臺灣停止農業','所有原住民族文化消失'],0,'社會改變不等於其他文化完全消失。']]},
 '3-2':{
  unit:3,title:'開港通商為什麼改變了臺灣的發展？',short:'港口打開後，商品、人、知識與治理都發生什麼變化？',visual:portVisual,
  intro:'19 世紀後期臺灣開港通商，外國商人、傳教士與領事等來臺活動，茶、糖、樟腦等商品外銷增加。牡丹社事件、清法戰爭等外部衝擊，也促使清帝國重新重視臺灣防務與近代建設。',
  facts:[['🚢 開港通商','港口開放後，臺灣和世界市場的往來更密切。'],['🍵 出口產業','茶、糖、樟腦等商品帶動生產、運輸與港口城市發展。'],['🧭 外國觀察','外國領事、商人與自然研究者記錄臺灣，增加外界對臺灣的認識。'],['🏥 醫療教育','傳教士等帶來西式醫療、教育與宗教活動。']],
  pairs:[['開港通商','人員與商品進出更頻繁'],['茶、糖、樟腦','重要出口商品'],['牡丹社事件後','清政府更加重視臺灣治理與防務'],['劉銘傳等建設','反映清末治理逐步近代化'],['傳教士活動','帶入西式醫療、教育與宗教']],
  story:[['🚢','開港','對外貿易增加，港口與商業活動成長。'],['📦','出口','臺灣農產與特產進入國際市場。'],['⚔️','外部壓力','國際事件使清廷更重視臺灣戰略位置。'],['🏗️','建設','交通、通訊、防務與行政逐步改革。'],['🏥','知識交流','西式醫療教育與研究活動擴大。']],
  claim:'「開港通商改變的不只是貿易，也改變城市與治理。」哪個證據最完整？',evidence:[['A','出口產業、港口城市、外國活動與清末近代建設都一起增加。',true],['B','只有商品價格改變，其他都沒有變化。',false],['C','開港後臺灣和外界往來反而完全停止。',false]],
  quiz:[['開港通商最直接帶來什麼？',['人員與商品跨地區流動增加','臺灣完全封閉','所有港口停用'],0,'開港就是增加對外往來。'],['哪組是清末臺灣重要外銷商品？',['茶、糖、樟腦','石油、黃金、汽車','香蕉、電腦、衛星'],0,'想想 19 世紀出口產業。'],['牡丹社事件後清政府態度有何轉變？',['更重視臺灣防務與治理','立即放棄臺灣','禁止所有道路'],0,'外部壓力讓臺灣戰略地位上升。'],['傳教士在臺活動可能帶來什麼？',['西式醫療與教育','高鐵建設','太空站'],0,'教材特別強調醫療教育。'],['清末建設增加說明什麼？',['治理方式逐步朝近代化調整','臺灣停止和世界互動','所有建設都只服務農村'],0,'建設是治理轉變的一部分。']]},
 '4-1':{
  unit:4,title:'人們如何適應不同地形創造所需？',short:'山地、丘陵、平原與河川，怎麼影響生活與土地利用？',visual:terrainVisual,
  intro:'臺灣受到板塊運動影響，地形起伏大，山地面積廣。河川多從高處快速流向海洋。不同地形提供不同資源，也限制交通、農業與聚落；人們會調整土地利用，但過度開發也可能增加災害風險。',
  facts:[['🧱 板塊作用','板塊運動與長期侵蝕、堆積共同塑造多樣地形。'],['⛰️ 山地丘陵','坡度大、交通較不便，但有森林、水源與觀光等資源。'],['🌾 平原盆地','地勢較平坦，較適合農業、聚落、交通與都市發展。'],['🏞️ 河川','多數河川短而陡，流量受季節降雨影響明顯。']],
  pairs:[['平原','聚落與農業較容易集中'],['山地','森林、水源與坡地保育重要'],['河川上游','坡陡流急、沖刷作用較強'],['河川下游','地勢較緩，沉積與用水活動較多'],['坡地過度開發','可能提高水土流失與災害風險']],
  story:[['🧱','形成','板塊與地表作用造就高低起伏。'],['🌧️','水流','雨水沿坡地匯入短而陡的河川。'],['🏘️','利用','人們依地形選擇農業、聚落、交通或遊憩。'],['⚠️','風險','坡地與河岸若過度開發可能放大災害。'],['🌱','保育','土地利用要考慮承載力與保育。']],
  claim:'「地形會影響聚落與土地利用。」哪個證據最直接？',evidence:[['A','平原地勢較平坦，交通與建設成本通常較低，因此聚落較集中。',true],['B','所有山地都不能有人居住。',false],['C','地形只影響風景，不影響生活。',false]],
  quiz:[['臺灣多樣地形的重要形成原因之一是？',['板塊運動','只有人工填土','完全沒有地殼活動'],0,'臺灣位在板塊交界附近。'],['平原常有較多聚落，主要因為？',['地勢平坦、交通與建設較方便','一定不會下雨','完全沒有河川'],0,'比較地形對活動成本的影響。'],['臺灣河川常見特色是？',['短而陡、流量季節變化大','非常長且終年均勻','大多流向內陸'],0,'山地離海近。'],['山林保育重要的原因是？',['維護水土、生態與水源功能','讓所有人不能進山','只為了拍照'],0,'山林有多種環境功能。'],['坡地過度開發可能造成？',['水土流失與災害風險增加','坡度自動變平','河川完全消失'],0,'注意土地承載力。']]},
 '4-2':{
  unit:4,title:'沿海的利用為什麼呈現多元發展？',short:'臺灣四面環海，但每一段海岸都一樣嗎？',visual:coastVisual,
  intro:'臺灣東西南北海岸因地質、海浪與河川堆積等條件不同，呈現岩岸、沙岸、泥岸、珊瑚礁等多樣風貌。海岸地形會影響港口、漁業、養殖、聚落、觀光與保育方式。',
  facts:[['🌊 西部海岸','多處地勢平緩、淺海與泥沙堆積較明顯，常見養殖、濕地與港口利用。'],['🪨 東部海岸','山地接近海岸，岩岸與深水海域較常見，景觀與漁業特色不同。'],['🧭 北部海岸','岬角、海灣與岩岸變化多，部分天然港灣利於港口發展。'],['🪸 南部海岸','部分地區有珊瑚礁等特殊地形，兼具生態與觀光價值。']],
  pairs:[['沙岸或泥岸','容易出現濕地、沙洲或養殖利用'],['天然深水港灣','有利大型船舶停靠'],['珊瑚礁海岸','生態敏感，遊憩需兼顧保護'],['河川帶來泥沙','可能影響西部海岸堆積'],['海岸利用多元','來自地形、資源、交通與市場條件差異']],
  story:[['🪨','地形不同','地質與海浪作用造就不同海岸。'],['🐟','資源不同','漁場、濕地、潮間帶與景觀價值各異。'],['🚢','利用不同','港口、養殖、漁業、觀光依條件發展。'],['🏘️','生活不同','聚落與產業會適應在地海岸條件。'],['🌱','保育不同','敏感生態需要不同管理方式。']],
  claim:'「臺灣沿海利用多元，是因為海岸條件不完全相同。」哪個證據最有力？',evidence:[['A','不同海岸有岩岸、沙岸、泥岸、珊瑚礁與深淺水差異，適合的產業與活動不同。',true],['B','臺灣所有海岸地形都一模一樣。',false],['C','海岸利用只由人口數決定。',false]],
  quiz:[['西部部分海岸常見養殖與濕地，和什麼條件較有關？',['地勢平緩與泥沙堆積','終年積雪','高山峽谷直接入海'],0,'想想西部海岸較平緩。'],['東部海岸常見哪種特徵？',['山地較接近海岸、岩岸較多','廣大沙漠','全是人工島'],0,'中央山脈靠近東部。'],['天然港灣有利哪項活動？',['港口與船舶停靠','高山農業','沙漠牧業'],0,'港灣提供避風與停靠條件。'],['珊瑚礁海岸利用時要特別注意？',['生態保育與遊憩承載量','大量挖除珊瑚','只看交通方便'],0,'珊瑚礁生態敏感。'],['沿海利用不同最合理的解釋是？',['自然條件與人文需求共同影響','所有地方隨機決定','只受一個因素控制'],0,'社會科常看多重因素。']]},
 '4-3':{
  unit:4,title:'土地開發與環境保護該如何抉擇？',short:'不是只選「開發」或「保護」，而是怎麼找到更好的方案。',visual:sustainVisual,
  intro:'道路、住宅、工業、觀光與能源等開發能滿足生活需求，但也可能改變地表、棲地、水質與海岸。做公共決策時，要比較不同方案的利益、風險、受影響族群與長期環境成本。',
  facts:[['🏗️ 開發需求','人口、交通、產業與公共服務會產生土地需求。'],['🌧️ 水土風險','過度改變坡地與河川可能增加沖蝕、淹水或災害風險。'],['🐟 河海資源','河川、濕地與海岸提供水源、生態、漁業與休閒價值。'],['♻️ 永續原則','可透過減量、避開敏感區、復育與監測降低衝擊。']],
  pairs:[['環境敏感區','開發前要更審慎評估'],['河川整治','除了防洪也要考慮生態與水質'],['海岸開發','可能改變漂沙、棲地與景觀'],['替代方案','比較不同位置、規模與工程方式'],['公民參與','讓不同受影響者表達需求與證據']],
  story:[['❓','需求','先釐清問題真的需要什麼。'],['🔎','證據','調查環境條件、風險與受影響者。'],['⚖️','比較','比較效益、成本與替代方案。'],['🛠️','減輕','避開、縮小、補償或復育衝擊。'],['📈','追蹤','開發後持續監測並調整。']],
  claim:'「好的土地決策需要同時比較開發利益與環境代價。」哪個做法最符合？',evidence:[['A','先調查風險與生態，提出多個方案，再比較長短期影響。',true],['B','只看開發速度，其他影響都不考慮。',false],['C','只要有人反對就不需要任何資料。',false]],
  quiz:[['土地開發前最重要的第一步之一是？',['了解需求、環境條件與可能風險','立刻施工','只看廣告'],0,'先理解問題再決策。'],['坡地過度開發可能增加什麼？',['沖蝕與災害風險','海拔自動降低','季風消失'],0,'地表植被與排水改變會影響風險。'],['河川與海岸為何需要保護？',['同時具有水源、生態、漁業與休閒等功能','完全沒有經濟價值','只有風景功能'],0,'自然系統有多重價值。'],['哪個最符合永續做法？',['避開敏感區並降低、補償衝擊','先破壞再說','把所有成本留給未來'],0,'永續重視長期與多方影響。'],['公共決策為什麼需要公民參與？',['不同群體有不同需求與在地知識','因為科學資料不重要','只為了拖延時間'],0,'證據與多元觀點要一起考慮。']]},
 '5-1':{
  unit:5,title:'選一個我想研究的問題',short:'把「我喜歡臺灣」變成一個真的查得到答案的問題。',visual:researchVisual,
  intro:'製作小書的第一步不是立刻上網搜尋，而是把興趣變成清楚、範圍適中的研究問題。好的問題通常有明確主題、地點或時間，並能用資料回答。',
  facts:[['💡 從興趣出發','先回顧整學期，找自己真正好奇的主題。'],['❓ 問題要具體','「臺灣很好玩嗎？」太大；「淡水開港後為何成為重要港口？」更可研究。'],['🗺️ 限定範圍','加入地點、年代或對象，問題會更清楚。'],['👥 分工合作','團隊可分成資料、地圖、文字、版面等角色。']],
  pairs:[['主題','想研究的大方向'],['研究問題','希望透過資料回答的核心問題'],['研究範圍','時間、地點或對象界線'],['分工','每位組員負責的任務'],['進度表','確認何時完成哪些工作']],
  story:[['💡','興趣','找出最想知道的臺灣主題。'],['❓','問題','把興趣改寫成可回答的問題。'],['🎯','範圍','縮小到適當時間、地點與對象。'],['👥','分工','安排每個人的任務。'],['📅','進度','設定檢核點避免最後才趕工。']],
  claim:'「好的研究問題應該清楚而且能用資料回答。」哪個例子最好？',evidence:[['A','「為什麼清末開港後淡水的貿易活動增加？」',true],['B','「臺灣是不是最棒？」',false],['C','「所有歷史全部介紹一下。」',false]],
  quiz:[['開始研究前最重要的是？',['先形成清楚問題','先做漂亮封面','先決定字體'],0,'問題會決定後面找什麼資料。'],['哪個問題範圍較適合五年級小書？',['某一地區在某時期的變化原因','從史前到未來所有臺灣歷史','全世界所有文化'],0,'範圍要能完成。'],['研究問題加入地點與時間有什麼好處？',['讓查找與比較更聚焦','讓題目更模糊','完全沒有影響'],0,'縮小範圍。'],['團隊分工的目的？',['讓任務清楚並互相合作','讓一個人做全部','避免任何討論'],0,'分工不等於分離。'],['進度檢核點可以幫助？',['及早發現落後並調整','保證不用工作','只增加壓力'],0,'進度管理是研究的一部分。']]},
 '5-2':{
  unit:5,title:'找可靠資料',short:'資料很多，不代表每一個都能直接相信。',visual:researchVisual,
  intro:'做社會探究時，可以使用課本、政府網站、博物館、書籍、訪談、地圖、統計與照片等資料。重要的是記得「誰提供、何時提供、根據什麼」，並用不同來源互相核對。',
  facts:[['📚 多種來源','文字、照片、地圖、統計、文物與訪談各能提供不同線索。'],['🏛️ 來源可信度','政府、學校、博物館與研究機構通常會交代資料來源與更新時間。'],['🔁 交叉查證','重要資訊最好用兩個以上可靠來源核對。'],['🧠 事實與意見','「1624 年」是可查證事實；「這是最精彩時代」屬於意見。']],
  pairs:[['作者／機構','判斷誰對內容負責'],['出版或更新日期','判斷資訊是否仍合用'],['原始資料','較接近事件或觀察本身的證據'],['二手整理','方便理解，但仍要追查來源'],['引用來源','讓讀者知道資料從哪裡來']],
  story:[['🔎','搜尋','用關鍵詞找到候選資料。'],['🏛️','判斷','看作者、機構、日期與證據。'],['🔁','核對','用不同來源比對重要資訊。'],['📝','摘記','用自己的話整理，保留來源。'],['🚫','避免抄貼','理解後重寫，不整段複製。']],
  claim:'「網路搜尋第一個結果，不一定就是最可靠資料。」哪個做法最好？',evidence:[['A','查看來源機構、日期與證據，再和其他可靠資料交叉比對。',true],['B','只要排第一名就完全相信。',false],['C','只看標題，不讀內容。',false]],
  quiz:[['判斷資料可信度，可以先看什麼？',['作者或機構、日期與資料來源','網頁背景顏色','字體大小'],0,'看誰負責與證據。'],['重要資訊最好怎麼確認？',['用多個可靠來源交叉查證','只相信一個匿名貼文','只看短影音標題'],0,'多來源可降低誤判。'],['哪一個較像「事實」？',['荷蘭人 1624 年在臺灣南部建立據點','大航海時代最有趣','我最喜歡城堡'],0,'事實能被查證。'],['摘錄資料時應該？',['用自己的話整理並記錄來源','整頁複製不標來源','刪掉所有出處'],0,'研究要可追溯。'],['照片也需要判斷來源嗎？',['需要，時間、地點與拍攝者都可能影響解讀','不用，照片永遠不會誤導','只有黑白照需要'],0,'影像也是證據，需要脈絡。']]},
 '5-3':{
  unit:5,title:'整理成我的臺灣小書',short:'把資料變成讀者看得懂的故事，而不是把搜尋結果貼在一起。',visual:researchVisual,
  intro:'最後一步是把問題、證據與結論整理成清楚的小書。可以使用短文、地圖、時間軸、圖表和圖片，但每一頁都要服務研究問題，並標明資料來源。',
  facts:[['🧭 結構清楚','封面、研究問題、主要發現、證據、結論與來源要有順序。'],['🗺️ 圖像有功能','地圖適合呈現位置，時間軸適合呈現先後，表格適合比較。'],['✍️ 自己表達','把理解轉成自己的句子，不把來源整段貼上。'],['©️ 尊重著作','使用圖片與文字要確認授權並標示來源。']],
  pairs:[['地圖','說明空間位置與分布'],['時間軸','說明事件先後與變化'],['比較表','整理相同與不同'],['圖說','告訴讀者圖像要看什麼'],['參考資料頁','列出使用過的來源']],
  story:[['🧱','架構','先排好每一頁要回答什麼。'],['📝','撰寫','用自己的話說明證據與結論。'],['🗺️','視覺化','用地圖、時間軸或圖表幫助理解。'],['🔍','校對','檢查事實、來源與錯字。'],['🗣️','分享','請同學試讀，再依回饋修改。']],
  claim:'「好的小書不是資料越多越好，而是每一頁都幫忙回答研究問題。」哪個做法最好？',evidence:[['A','只保留和研究問題有關的證據，並用圖文說明它們如何支持結論。',true],['B','把找到的所有網頁全文貼進去。',false],['C','只做封面不寫來源。',false]],
  quiz:[['時間軸最適合呈現什麼？',['事件先後與變化','地形高度顏色','人物長相'],0,'時間軸看先後。'],['地圖最適合呈現？',['位置與分布','文章字數','考試分數'],0,'地圖處理空間。'],['圖片旁加圖說的目的？',['引導讀者理解圖片和主題的關係','只是填空間','讓字變多'],0,'圖說要服務理解。'],['完成初稿後最適合？',['校對並找同學試讀回饋','立刻刪除來源','不再修改'],0,'作品需要檢核。'],['參考資料頁的重要性？',['讓讀者知道證據來源，也尊重著作','只為增加頁數','可以省略所有作者'],0,'研究要可追溯。']]}
});

const lessonExtras={
 '1-1':[['🧭 相對位置','讀地圖時先看「誰在臺灣的哪個方向」，比死背經緯度更能理解交流。'],['🌊 海洋文化','漁業、港口、航運與沿海生活都和四面環海有關。'],['🚢 交通節點','位置帶來機會，也可能讓臺灣成為不同勢力競逐的地方。']],
 '1-2':[['🏺 文化層','考古學家會比較不同深度的文化層，建立先後關係。'],['🔥 用火','用火能帶來取暖、烹煮與防護等生活改變。'],['🧩 推論原則','一件文物通常只能提供部分線索，要和其他證據一起判斷。']],
 '1-3':[['🗣️ 語言文化','語言、祭儀、工藝、飲食與社會制度都是文化的一部分。'],['📍 分布不是固定','族群因歷史遷移與現代生活，分布不只限於傳統部落。'],['🤲 文化主體性','認識族群文化時，應優先理解族人自己的說法與觀點。']],
 '2-1':[['🌶️ 香料貿易','歐洲人尋找亞洲商品與新航路，是大航海時代的重要背景。'],['🏰 據點功能','據點不只軍事，也用來管理貿易、補給與統治。'],['🧭 區域連結','臺灣的價值來自它和中國沿海、日本、東南亞航路的關係。']],
 '2-2':[['📖 文字教育','不同勢力會透過語言、宗教與教育推行統治。'],['🌾 土地與人口','招募移民與開墾會改變土地利用與人口分布。'],['🏛️ 文化資產','遺址要結合史料與考古資料解讀，不能只靠外觀猜故事。']],
 '3-1':[['🧑‍🌾 移民來源','許多漢人移民來自中國東南沿海，帶來語言、信仰與生活習慣。'],['💧 水利合作','大型水利常需要多人出資與合作，促進地方組織形成。'],['⚖️ 原漢互動','土地開墾也牽涉原住民族權益，互動同時包含交易、合作與衝突。']],
 '3-2':[['🏙️ 港市成長','港口周邊商業、倉儲與人口增加，帶動城市發展。'],['📡 交通通訊','清末鋪設鐵路、電報等近代設施，加快資訊與人員移動。'],['🌏 世界連結','外國人的記錄讓臺灣動植物、社會與地理更被世界認識。']],
 '4-1':[['🏞️ 侵蝕堆積','河川侵蝕山區、在較平緩地方堆積，長期改變地形。'],['🏙️ 都市擴張','平坦土地有限，都市成長會改變農地與生活空間。'],['🌳 山林功能','森林不只提供資源，也有保水、保土與棲地功能。']],
 '4-2':[['🦀 潮間帶','潮間帶是生物多樣性高、也容易受人類活動影響的環境。'],['🏗️ 港口工程','防波堤與填海可能改變海流、漂沙與鄰近海岸。'],['🧂 產業變遷','傳統鹽業、漁業與養殖會因市場、科技與環境條件改變。']],
 '4-3':[['📊 多方案比較','公共決策不只問「要不要」，也應比較「在哪裡、做多大、怎麼做」。'],['🧪 長期監測','開發前預測不一定完全正確，完成後仍要追蹤影響。'],['🌍 世代公平','永續也要考慮未來世代是否仍能使用健康的環境與資源。']],
 '5-1':[['🧠 好問題不是答案','研究問題應該需要查資料、比較或推理，不是只查一個名詞。'],['📏 適當規模','一學期小書適合聚焦一個地方、一段時間或一個現象。'],['🤝 任務可交接','分工時要把檔名、來源與進度記清楚，團隊才能整合。']],
 '5-2':[['🧭 第一手資料','訪談、現場照片、原始地圖或當時文件，可提供接近事件的線索。'],['📰 偏誤意識','每個來源都有觀點與限制，可信不代表完全沒有立場。'],['🔐 個資倫理','訪談與拍照要尊重同意，不公開不必要的個人資訊。']],
 '5-3':[['🎨 版面節制','一頁一個重點，比塞滿文字更容易閱讀。'],['🔗 證據連結','不要只放圖，要說明這張圖如何支持你的發現。'],['🪞 反思','作品最後可以寫「我原本怎麼想、現在改變了什麼」。']]
};

const lessonOrder=['1-1','1-2','1-3','2-1','2-2','3-1','3-2','4-1','4-2','4-3','5-1','5-2','5-3'];
const availableLessons=[...lessonOrder];

function addStars(n){state.stars+=n;saveState()}
function unlockAchievement(id){if(!state.achievements.includes(id)){state.achievements.push(id);state.stars+=8;saveState()}}
function stagesFor(id){return state.lessonStages[id]||[]}
function completeStage(id,n){state.lessonStages[id]=stagesFor(id);if(!state.lessonStages[id].includes(n)){state.lessonStages[id].push(n);addStars(3)}saveState();renderState()}
function addWrong(id,lesson,label,tip,kind='quiz'){const old=state.wrongBank.find(x=>x.id===id);if(old){old.label=label;old.tip=tip;old.lesson=lesson;old.kind=kind}else state.wrongBank.push({id,lesson,label,tip,kind});saveState();renderState()}
function clearWrong(id){state.wrongBank=state.wrongBank.filter(x=>x.id!==id);saveState();renderState()}
function completeLesson(id){if(!state.completedLessons.includes(id)){state.completedLessons.push(id);state.stars+=10;unlockAchievement(id==='1-3'?'culture_respect':id==='2-2'?'time_traveler':'lesson_finish')}state.lessonStages[id]=[1,2,3,4,5,6];recalcProgress();saveState();renderState()}
function recalcProgress(){state.progress=Math.round(state.completedLessons.length/lessonOrder.length*100)}
function nextLesson(){return lessonOrder.find(id=>!state.completedLessons.includes(id))||lessonOrder[lessonOrder.length-1]}
function lessonUnitLabel(id){const u=lessons[id]?.unit||Number(id[0]);return `第${['零','一','二','三','四','五'][u]}單元`}
function setTodayLabels(){const id=nextLesson(),l=lessons[id]||lessons['1-1'];const rows=$$('.task-row');const text=[['找一找',l.short],['看一眼',`先看懂：${l.title.replace('？','')}`],['試一題','用證據判斷，不只背答案']];rows.forEach((b,i)=>{const s=b.querySelector('span:nth-child(2)');if(s)s.innerHTML=`<strong>${text[i][0]}</strong><small>${text[i][1]}</small>`})}
function renderState(){
 if(!state)return;recalcProgress();$('#stars').textContent=state.stars;$('#streak').textContent=state.streak;$('#profileName').textContent=currentUser;$('#progressBar').style.width=`${state.progress}%`;$('#progressText').textContent=`${state.progress}%`;
 const dailyDone=state.daily?.date===todayKey()?state.daily.done:[];$$('.task-row').forEach(b=>b.classList.toggle('done',dailyDone.includes(b.dataset.task)));
 const next=nextLesson(),l=lessons[next],u=Number(next[0]);$('#continueUnitTitle').textContent=`${lessonUnitLabel(next)}｜${units[u].title}`;$('#continueNext').textContent=`下一站：${l?l.title:previewTitle(next)}`;$('#enterNextLesson').textContent=availableLessons.includes(next)?`進入 ${next} 六關`:`進入下一單元`;
 if(state.wrongBank.length){$('#rescueTitle').textContent=`有 ${state.wrongBank.length} 個觀念可以救回來`;$('#rescueText').textContent=state.wrongBank[0].label;$('#rescueBtn').disabled=false;$('#rescueBtn').textContent='開始 2 分鐘救援'}else{$('#rescueTitle').textContent='目前沒有要補救的地方';$('#rescueText').textContent='答錯的觀念才會出現在這裡，不會整課重做。';$('#rescueBtn').disabled=true;$('#rescueBtn').textContent='先去探險'}
 setTodayLabels();$$('.unit-stop[data-open-unit]').forEach(b=>{const n=Number(b.dataset.openUnit),ids=units[n].lessons;b.classList.toggle('done',ids.every(id=>state.completedLessons.includes(id)))});$('#openExamCheckpoint').classList.toggle('done',(state.examAttempts.A||0)+(state.examAttempts.B||0)>0);saveState();
}

function openUnit(n){
 const u=units[n];const lessonCards=u.lessons.map(id=>{const l=lessons[id],ready=availableLessons.includes(id),done=state.completedLessons.includes(id);return `<div class="lesson-card ${done?'lesson-done':''}"><div class="lesson-line"><b>${done?'✓ ':''}${id} ${l?.title||previewTitle(id)}</b><span>${ready?(done?'已完成，可以再複習':'六關已開放'):'準備中'}</span></div>${ready?`<button class="secondary-btn" data-open-lesson="${id}">${done?'再複習':'開始這一課'}</button>`:''}</div>`}).join('');
 $('#unitContent').innerHTML=`<div class="unit-title"><span class="pill">${u.theme} 第 ${n} 單元</span><h2>${u.title}</h2><p>${u.subtitle}</p></div><div class="six-steps">${stages.map(s=>`<span>${s.icon} ${s.name}</span>`).join('')}</div><div class="lesson-list">${lessonCards}</div>${n===2?`<div class="checkpoint-mini"><b>★ 第一次段考檢核點</b><span>第一、二單元完成後很適合挑戰；A、B 卷都可直接預覽。</span><button class="primary-btn" id="unitExamBtn">打開 A / B 卷</button></div>`:''}<p class="source-note">內容依翰林版五上公開課程架構與學習目標重新設計，不重製課本全文。</p>`;
 $('#unitDialog').showModal();$$('[data-open-lesson]').forEach(b=>b.onclick=()=>{$('#unitDialog').close();openLesson(b.dataset.openLesson)});const eb=$('#unitExamBtn');if(eb)eb.onclick=()=>{$('#unitDialog').close();openExamHub()}
}
function previewTitle(id){const m={'3-1':'早期移民如何在臺灣建立家園？','3-2':'開港通商為什麼改變了臺灣的發展？','4-1':'人們如何適應不同地形創造所需？','4-2':'沿海的利用為什麼呈現多元發展？','4-3':'土地開發與環境保護該如何抉擇？','5-1':'選一個我想研究的問題','5-2':'找可靠資料','5-3':'整理成我的臺灣小書'};return m[id]||id}
$$('[data-open-unit]').forEach(b=>b.onclick=()=>openUnit(Number(b.dataset.openUnit)));

function lessonShell(id,stage,body){const l=lessons[id];const stageSpeech=`${l.title}。${cleanSpeechText(body)}`;$('#lessonContent').innerHTML=`<div class="lesson-header"><span class="pill">${lessonUnitLabel(id)}・${id}</span><div class="read-row"><h2>${l.title}</h2>${speechBtn(stageSpeech,'朗讀本頁')}</div><p class="muted">一次只走一小關。現在只看第 ${stage} 關。</p></div><div class="stage-tabs">${stages.map((s,i)=>`<button class="stage-tab ${i+1===stage?'active':''} ${stagesFor(id).includes(i+1)?'done':''}" data-stage="${i+1}">${s.icon} ${s.name}</button>`).join('')}</div><section class="stage-panel">${body}</section><p class="source-note">這一課依公開課程計畫的學習重點重新編寫；重點放在理解關聯、讀證據與做判斷。</p>`;$$('[data-stage]').forEach(b=>b.onclick=()=>openLesson(id,Number(b.dataset.stage)))}
function openLesson(id,stage=null){const l=lessons[id];if(!l){openUnit(Number(id[0]));return}$('#lessonDialog').showModal();const n=stage||Math.min(6,stagesFor(id).length+1);renderLessonStage(id,n)}
function renderLessonStage(id,stage){const l=lessons[id];if(stage===1){const allFacts=[...l.facts,...(lessonExtras[id]||[])];lessonShell(id,1,`<h3>先看懂畫面</h3><p>${l.intro}</p>${l.visual()}<h4 class="focus-title">這課要掌握的 ${allFacts.length} 個重點</h4><div class="fact-grid">${allFacts.map(x=>`<div class="fact-card"><div class="fact-top"><b>${x[0]}</b>${speechBtn(`${x[0]}。${x[1]}`,'朗讀這個重點')}</div><span>${x[1]}</span></div>`).join('')}</div><div class="exam-focus"><b>🎯 考前怎麼讀？</b><span>不要只背名詞，請練習說出「原因 → 證據 → 影響」。</span></div><div class="stage-actions"><button class="primary-btn" id="stageNext">看懂了 → 下一關</button></div>`);$('#stageNext').onclick=()=>{completeStage(id,1);openLesson(id,2)}}
 if(stage===2){const shuffled=[...l.pairs].sort((a,b)=>a[1].localeCompare(b[1])).reverse();lessonShell(id,2,`<h3>配對：把線索和意思接起來</h3><p>先點左邊，再點右邊。答錯只給提示，不扣星星。</p><div class="match-board"><div class="match-column">${l.pairs.map((x,i)=>`<button data-left="${i}">${x[0]}</button>`).join('')}</div><div class="match-column">${shuffled.map(x=>`<button data-right="${l.pairs.findIndex(p=>p[0]===x[0])}">${x[1]}</button>`).join('')}</div></div><p class="feedback" id="matchFeedback">完成 ${l.pairs.length} 組就過關。</p><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext" disabled>下一關</button></div>`);setupMatch(id);$('#stagePrev').onclick=()=>openLesson(id,1)}
 if(stage===3){lessonShell(id,3,`<h3>把四個重點串成一個故事</h3><p>社會不是零散名詞。看懂「前因 → 過程 → 影響」，比較不容易忘。</p><div class="story-strip">${l.story.map(x=>`<div class="story-card"><span class="emoji">${x[0]}</span><b>${x[1]}</b><span>${x[2]}</span></div>`).join('')}</div><div class="memory-line"><b>一句話記憶：</b>${l.story.map(x=>x[1]).join(' → ')}</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext">我能說出故事了</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>{completeStage(id,3);openLesson(id,4)}}
 if(stage===4){const evs=shuffled(l.evidence);lessonShell(id,4,`<h3>找證據，不被「看起來很像」騙走</h3><p class="question-line"><b>主張：</b>${l.claim}${speechBtn(l.claim,'朗讀題目')}</p>${evs.map((x,i)=>`<button class="evidence-choice" data-correct="${x[2]?'1':'0'}"><span>${String.fromCharCode(65+i)}</span>${x[1]}</button>`).join('')}<p id="evidenceFeedback" class="feedback"></p><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext" disabled>下一關</button></div>`);setupEvidence(id);$('#stagePrev').onclick=()=>openLesson(id,3)}
 if(stage===5)renderQuizStage(id);
 if(stage===6)renderRescueStage(id);
}
function setupMatch(id){const l=lessons[id];let left=null,done=new Set();$$('[data-left]').forEach(b=>b.onclick=()=>{$$('[data-left]').forEach(x=>x.classList.remove('selected'));left=b;b.classList.add('selected')});$$('[data-right]').forEach(b=>b.onclick=()=>{if(!left){$('#matchFeedback').textContent='先從左邊選一張線索。';return}const ok=left.dataset.left===b.dataset.right;if(ok){left.disabled=true;b.disabled=true;left.classList.add('correct');b.classList.add('correct');done.add(b.dataset.right);left=null;$('#matchFeedback').textContent=`答對 ${done.size}/${l.pairs.length} 組！`;clearWrong(`match-${id}`);if(done.size===l.pairs.length){completeStage(id,2);$('#stageNext').disabled=false}}else{$('#matchFeedback').textContent='還沒接對。想想兩邊是不是「直接關聯」。';addWrong(`match-${id}`,id,`${id} 的線索配對還容易混`,l.pairs[Number(left.dataset.left)][1],'activity')}});$('#stageNext').onclick=()=>openLesson(id,3)}
function setupEvidence(id){const l=lessons[id];$$('[data-correct]').forEach(b=>b.onclick=()=>{const ok=b.dataset.correct==='1';$$('[data-correct]').forEach(z=>z.classList.remove('correct','wrong'));b.classList.add(ok?'correct':'wrong');if(ok){$('#evidenceFeedback').textContent='對！這個證據最直接支持題目的主張。';$('#stageNext').disabled=false;completeStage(id,4);clearWrong(`evidence-${id}`)}else{$('#evidenceFeedback').textContent='這句可能有資訊，但沒有直接支持題目的主張。';addWrong(`evidence-${id}`,id,`${id} 找證據時還會被旁支資訊吸引`,'先把題目的關鍵詞圈起來，再找直接談到同一件事的證據。','evidence')}});$('#stageNext').onclick=()=>openLesson(id,5)}
function renderQuizStage(id){const l=lessons[id],answers={};lessonShell(id,5,`<h3>五題小闖關</h3><p>目標是 4/5。答錯會自動進入救援，不用整課重做。</p><div id="quizBox">${l.quiz.map((x,i)=>`<div class="quiz-q" data-q="${i}"><h4 class="question-line"><span>${i+1}. ${x[0]}</span>${speechBtn(x[0],'朗讀題目')}</h4><div class="quiz-options">${shuffled(x[1].map((o,j)=>({o,j}))).map(z=>`<button data-opt="${z.j}">${z.o}</button>`).join('')}</div><p class="feedback"></p></div>`).join('')}</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="finishQuiz" disabled>看成績</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,4);$$('.quiz-q').forEach(qel=>{const qi=Number(qel.dataset.q),q=l.quiz[qi];qel.querySelectorAll('[data-opt]').forEach(btn=>btn.onclick=()=>{answers[qi]=Number(btn.dataset.opt);qel.querySelectorAll('[data-opt]').forEach(x=>x.classList.remove('correct','wrong'));const ok=answers[qi]===q[2];btn.classList.add(ok?'correct':'wrong');qel.querySelector('.feedback').textContent=ok?'答對！':`提示：${q[3]}`;const wid=`quiz-${id}-${qi}`;if(ok)clearWrong(wid);else addWrong(wid,id,q[0],q[3],'quiz');if(Object.keys(answers).length===l.quiz.length)$('#finishQuiz').disabled=false})});$('#finishQuiz').onclick=()=>{const score=l.quiz.filter((x,i)=>answers[i]===x[2]).length;state.lessonQuizBest[id]=Math.max(state.lessonQuizBest[id]||0,score);if(score>=4){completeStage(id,5);if(score===5)unlockAchievement('perfect_quiz')}saveState();renderState();$('#finishQuiz').textContent=`答對 ${score}/5 → 去救援`;setTimeout(()=>openLesson(id,6),350)}}
function renderRescueStage(id){const l=lessons[id],wrongs=state.wrongBank.filter(w=>w.lesson===id);const best=state.lessonQuizBest[id]||0;lessonShell(id,6,`<h3>${wrongs.length?'只救真的卡住的地方':'太棒了，這課暫時沒有錯點'}</h3><p>${best>=4?'你的小闖關已達標。':'小闖關最佳 '+best+'/5；先看提示，再回去挑戰會更容易。'}</p><div class="rescue-list">${wrongs.slice(0,6).map(w=>`<div class="rescue-item"><b>${escapeHtml(w.label)}</b><p>${escapeHtml(w.tip)}</p>${w.kind==='quiz'?`<button class="secondary-btn" data-retry-quiz>回第 5 關重試</button>`:w.kind==='evidence'?`<button class="secondary-btn" data-retry-evidence>回第 4 關再找一次</button>`:`<button class="secondary-btn" data-clear="${w.id}">我重新想懂了</button>`}</div>`).join('')}</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 回闖關</button><button class="primary-btn" id="finishLesson">${best>=4?'完成這一課':'先回去達成 4/5'}</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,5);$$('[data-retry-quiz]').forEach(b=>b.onclick=()=>openLesson(id,5));$$('[data-retry-evidence]').forEach(b=>b.onclick=()=>openLesson(id,4));$$('[data-clear]').forEach(b=>b.onclick=()=>{clearWrong(b.dataset.clear);renderRescueStage(id)});$('#finishLesson').onclick=()=>{if((state.lessonQuizBest[id]||0)<4){showToast('先回第 5 關，答對至少 4 題就能完成。');openLesson(id,5);return}completeStage(id,6);completeLesson(id);$('#lessonDialog').close();showToast(`完成 ${id}！下一站已更新。`)}}


const EXAM_MINUTES=40;
const examData={
 A:{title:'第一次段考模擬 A 卷',subtitle:'第一、二單元｜真實紙筆題型混合',sections:[
  {type:'tf',name:'一、是非題｜16分',qs:[
   {q:'臺灣位在東亞，四面環海，因此海上交通與文化交流是理解臺灣歷史的重要線索。',a:true,p:2,tip:'臺灣位置確實會影響海上往來。'},
   {q:'季風只會影響風向，和雨量、農業及生活安排都沒有關係。',a:false,p:2,tip:'季風會連動風向、降雨與生活。'},
   {q:'研究史前生活時，可以利用遺址、文化層與出土器物推理。',a:true,p:2,tip:'考古證據是重要線索。'},
   {q:'長濱文化最重要的工具特色是大量使用鐵器。',a:false,p:2,tip:'長濱文化代表性線索是打製石器等。'},
   {q:'臺灣玉在產地以外甚至東南亞遺址出土，可作為遠距交換的證據。',a:true,p:2,tip:'產地與出土地距離可支持交換推論。'},
   {q:'所有臺灣原住民族的語言、祭儀與社會組織都完全相同。',a:false,p:2,tip:'各族文化多元且各有特色。'},
   {q:'1624 年後荷蘭勢力以南臺灣為重要據點，1626 年後西班牙勢力主要在北臺灣活動。',a:true,p:2,tip:'可記「荷蘭南、西班牙北」。'},
   {q:'大航海時代對臺灣的影響只有戰爭，沒有宗教、貿易、移民或文化資產。',a:false,p:2,tip:'影響包含多種社會與文化變化。'}]},
  {type:'mcq',name:'二、選擇題｜24分',qs:[
   {q:'下列哪一項最能說明臺灣「相對位置」有利東亞交流？',opts:['位在亞洲大陸東側、太平洋西側，鄰近日本與往南海域','最高峰超過三千公尺','便利商店密度很高','島上有許多河川'],a:0,p:3,tip:'找和周邊地區、海路直接相關的條件。'},
   {q:'卑南遺址反映農業與聚落發展，下列哪個推論最合理？',opts:['食物取得較穩定，有利人口較長期居住','人們一定每天遠距離遷徙','農業使所有工具消失','聚落只會出現在海上'],a:0,p:3,tip:'穩定食物來源有利定居。'},
   {q:'十三行文化常用來說明哪一種生活變化？',opts:['金屬器使用增加，工具與生產方式改變','第一次出現現代汽車','完全沒有農業','人們開始使用網路'],a:0,p:3,tip:'十三行與鐵器關係密切。'},
   {q:'學習原住民族文化時，哪個做法最恰當？',opts:['理解各族差異，並重視族人自己的觀點','把所有族群套用同一種印象','只根據服裝猜族群','認為文化都停在過去'],a:0,p:3,tip:'多元文化重視差異與文化主體性。'},
   {q:'17 世紀歐洲勢力重視臺灣的主要背景之一是什麼？',opts:['臺灣位在東亞重要海上航路附近','臺灣已有高速鐵路','歐洲停止海外貿易','臺灣位在大西洋中心'],a:0,p:3,tip:'把大航海背景和臺灣位置連起來。'},
   {q:'1642 年後北臺灣的西班牙勢力有何變化？',opts:['西班牙離臺，荷蘭勢力擴大','西班牙統治全臺','改由清帝國立即統治','變成鄭氏首都'],a:0,p:3,tip:'1626 來、1642 離。'},
   {q:'鄭氏政權經營臺灣，哪項敘述較完整？',opts:['持續對外貿易，並推動開墾、教育與制度','完全停止海上活動','只在北極航線活動','沒有任何人口移入'],a:0,p:3,tip:'鄭氏不只是軍事，也有經營與社會建設。'},
   {q:'下列哪項最能說明大航海時代留下的長期影響？',opts:['城堡遺址、宗教文化接觸、海上貿易與人口移動','只有一場戰役名稱','只有一個年份','完全沒有留下痕跡'],a:0,p:3,tip:'長期影響通常跨越文化、經濟與人口。'}]},
  {type:'fill',name:'三、填充題｜8分',qs:[
   {q:'1624 年起主要在臺灣南部建立據點的歐洲國家是＿＿＿＿。',answers:['荷蘭','荷蘭人'],p:2,tip:'荷蘭南、西班牙北。'},
   {q:'1626 年起主要在臺灣北部建立據點的歐洲國家是＿＿＿＿。',answers:['西班牙','西班牙人'],p:2,tip:'荷蘭南、西班牙北。'},
   {q:'花蓮產、在臺灣各地與東南亞遺址也出土的史前交換物，常稱為臺灣＿＿。',answers:['玉','玉器','臺灣玉'],p:2,tip:'關鍵是「臺灣玉」。'},
   {q:'考古學家從地層、遺址與出土物品推論過去生活，這類研究稱為＿＿學。',answers:['考古','考古學'],p:2,tip:'研究遺址與文物的是考古學。'}]},
  {type:'match',name:'四、配合題｜12分',choices:['長濱文化','卑南遺址','十三行文化','鄭氏政權'],qs:[
   {q:'打製石器、用火等生活線索',a:'長濱文化',p:3,tip:'舊石器時代重要線索。'},
   {q:'農業與大型聚落等新石器生活線索',a:'卑南遺址',p:3,tip:'和定居、農業關聯較大。'},
   {q:'鐵器使用增加的金屬器時代線索',a:'十三行文化',p:3,tip:'關鍵字是鐵器。'},
   {q:'1661～1662 年後成為臺灣主要統治力量',a:'鄭氏政權',p:3,tip:'鄭成功來臺後荷蘭人離臺。'}]},
  {type:'group',name:'五、閱讀素養題組｜20分',context:'小安整理一張「臺灣與世界交流」筆記：史前時代花蓮產的玉器出現在遠地遺址；17 世紀荷蘭、西班牙來臺建立據點；鄭氏時期持續海上貿易並招募漢人開墾。老師提醒：不要只記事件，要找出它們共同說明的現象。',qs:[
   {q:'這三段資料共同最能說明什麼？',opts:['臺灣長期透過海洋和不同地區交流','臺灣一直完全與外界隔絕','所有交流都發生在現代','交流只和戰爭有關'],a:0,p:4,tip:'跨時代共同線索是海洋交流。'},
   {q:'史前臺灣玉能成為交流證據，最重要的判斷依據是？',opts:['產地和出土地相距很遠','玉的顏色漂亮','現代人喜歡玉','文物一定有文字'],a:0,p:4,tip:'空間距離支持交換推論。'},
   {q:'荷蘭、西班牙都在臺灣建立據點，最能反映臺灣哪項特性？',opts:['位在區域航路的重要位置','島上沒有居民','完全沒有資源','不需要航海技術'],a:0,p:4,tip:'據點和海路位置直接相關。'},
   {q:'鄭氏招募漢人開墾會帶來哪種社會影響？',opts:['人口與土地利用改變，漢人社會規模增加','臺灣人口消失','所有港口關閉','史前文化重新出現'],a:0,p:4,tip:'移民會改變人口與土地利用。'},
   {q:'如果要讓筆記更有說服力，下一步最好做什麼？',opts:['補上地圖、年代與可靠資料來源','只加更多裝飾','刪掉所有證據','只留自己的感覺'],a:0,p:4,tip:'社會科要用證據支持說法。'}]},
  {type:'data',name:'六、圖表判讀與應用｜10分',context:'<table class="mini-data"><tr><th>時間</th><th>事件</th></tr><tr><td>1624</td><td>荷蘭勢力在南臺灣建立據點</td></tr><tr><td>1626</td><td>西班牙勢力在北臺灣建立據點</td></tr><tr><td>1642</td><td>西班牙離臺，荷蘭勢力擴大</td></tr><tr><td>1661–1662</td><td>鄭成功來臺，荷蘭人離臺</td></tr></table>',qs:[
   {q:'依表格，1626 到 1642 年間最合理的描述是？',opts:['南北臺灣曾同時存在不同歐洲勢力據點','清帝國已統治臺灣','鄭氏已統治全臺','臺灣沒有任何外來勢力'],a:0,p:5,tip:'比對 1624、1626、1642 的先後。'},
   {q:'依時間軸，哪個排序正確？',opts:['荷蘭南部據點 → 西班牙北部據點 → 西班牙離臺 → 鄭成功來臺','西班牙離臺 → 荷蘭來臺 → 鄭成功來臺 → 西班牙來臺','鄭成功來臺 → 荷蘭來臺 → 西班牙來臺 → 1642','四件事同時發生'],a:0,p:5,tip:'按照年份排列。'}]},
  {type:'short',name:'七、簡答題｜10分',qs:[
   {q:'請用一句話解釋：「臺灣的地理位置為什麼會影響歷史發展？」',keywords:[['海','航路','交通'],['交流','貿易','往來','勢力']],p:5,tip:'答案要同時提到海上位置，以及交流／貿易／勢力往來。'},
   {q:'請寫出一個「文物能支持歷史推論」的例子，並說明它支持什麼推論。',keywords:[['玉','鐵器','石器','文物','遺址'],['交換','生活','工具','農業','文化']],p:5,tip:'先舉具體證據，再說明它支持的推論。'}]}
 ]},
 B:{title:'第一次段考模擬 B 卷',subtitle:'第一、二單元｜同範圍不同情境',sections:[
  {type:'tf',name:'一、是非題｜16分',qs:[
   {q:'臺灣東側面向太平洋，西側鄰近亞洲大陸，這種位置有利理解海洋交通與交流。',a:true,p:2,tip:'這是臺灣的重要相對位置。'},
   {q:'相對位置只用來背方向，不能幫助解釋交通、文化或歷史。',a:false,p:2,tip:'相對位置能解釋很多人地互動。'},
   {q:'史前時代沒有現代文字紀錄，所以任何生活情形都完全不能研究。',a:false,p:2,tip:'可以用考古證據推論。'},
   {q:'農業較穩定後，可能有利人口定居與聚落發展。',a:true,p:2,tip:'穩定食物來源支持定居。'},
   {q:'原住民族文化只有過去才存在，現代不會延續或創新。',a:false,p:2,tip:'文化會延續也會改變。'},
   {q:'西班牙人在臺灣的重要活動區主要位在北部。',a:true,p:2,tip:'可記荷蘭南、西班牙北。'},
   {q:'鄭氏經營臺灣期間完全停止海外貿易。',a:false,p:2,tip:'鄭氏仍利用海上貿易。'},
   {q:'今天的城堡與遺址可以作為研究大航海時代的歷史證據之一。',a:true,p:2,tip:'有形文化資產是歷史線索。'}]},
  {type:'mcq',name:'二、選擇題｜24分',qs:[
   {q:'候鳥遷徙、海上交通都和臺灣哪一項條件最相關？',opts:['島嶼的海陸位置','現代手機品牌','學校數量','捷運顏色'],a:0,p:3,tip:'這兩者都和空間位置有關。'},
   {q:'考古學家發現較深文化層有打製石器，較淺文化層有鐵器，最合理的用途是？',opts:['比較不同時期工具與生活變化','判斷今天氣溫','預測股票','決定交通票價'],a:0,p:3,tip:'文化層可幫助建立先後與變化。'},
   {q:'如果某族群依季節調整漁獵與採集活動，最能反映？',opts:['長期觀察環境形成的生態知識','完全忽略自然變化','所有族群都一樣','只有現代科技'],a:0,p:3,tip:'生態智慧來自長期觀察。'},
   {q:'哪一種資料最能避免對原住民族形成刻板印象？',opts:['同時閱讀族人自述、官方與博物館等多元資料','只看一張觀光照片','只聽一個傳聞','只記服飾顏色'],a:0,p:3,tip:'需要多元來源與族人觀點。'},
   {q:'荷蘭、西班牙來臺活動的共同目的可能包含？',opts:['貿易利益與宗教傳播','建造高鐵','發展太空科技','開採南極冰'],a:0,p:3,tip:'大航海時代常見貿易與傳教。'},
   {q:'哪一項最能說明臺灣成為區域貿易網的一環？',opts:['商品與人員在臺灣和周邊地區之間流動','島內完全不交易','只靠步行到歐洲','關閉所有港口'],a:0,p:3,tip:'貿易網的核心就是跨地區流動。'},
   {q:'1661～1662 年臺灣政權出現哪個重要轉折？',opts:['鄭成功來臺，荷蘭人離臺','西班牙第一次來臺','清帝國建省','日本開始統治'],a:0,p:3,tip:'時間軸核心轉折。'},
   {q:'要研究大航海時代對今日臺灣的影響，下列哪組資料最完整？',opts:['遺址、歷史文件、貿易記錄與人口變化','只有一張自拍照','只有一個地名','只有一個人物名字'],a:0,p:3,tip:'多種證據互相支持。'}]},
  {type:'fill',name:'三、填充題｜8分',qs:[
   {q:'長濱文化常見的石器製作方式稱為＿＿製石器。',answers:['打製','打製石器'],p:2,tip:'不是磨製，關鍵是打製。'},
   {q:'金屬器時代十三行文化的重要工具材料之一是＿＿。',answers:['鐵','鐵器'],p:2,tip:'十三行與鐵器關係密切。'},
   {q:'目前中央政府認定的臺灣原住民族共有＿＿族。',answers:['16','十六','16族','十六族'],p:2,tip:'目前官方認定 16 族。'},
   {q:'1661 年率軍來臺、後來使荷蘭人離臺的重要人物是鄭＿＿。',answers:['成功','鄭成功'],p:2,tip:'完整姓名鄭成功。'}]},
  {type:'match',name:'四、配合題｜12分',choices:['地理位置','考古證據','文化多樣性','海上貿易'],qs:[
   {q:'臺灣位在亞洲大陸與太平洋之間',a:'地理位置',p:3,tip:'描述空間關係。'},
   {q:'遺址、文化層與出土器物',a:'考古證據',p:3,tip:'用來推論史前生活。'},
   {q:'各原住民族有不同語言、祭儀與社會組織',a:'文化多樣性',p:3,tip:'重點是差異與多元。'},
   {q:'商品與人員跨區域流動',a:'海上貿易',p:3,tip:'跨海交換是核心。'}]},
  {type:'group',name:'五、閱讀素養題組｜20分',context:'某博物館規畫「島嶼交流」特展。展品包括：長濱文化石器、卑南遺址出土物、臺灣玉、原住民族口述故事、荷蘭與西班牙時期城堡模型，以及鄭氏時期的貿易資料。策展人希望觀眾不要把這些看成彼此無關的物件。',qs:[
   {q:'策展人最可能用哪一個主題串起展品？',opts:['臺灣人群如何利用環境並和外界交流','現代科技產品發展','世界所有國家的歷史','只有戰爭史'],a:0,p:4,tip:'展品橫跨環境利用與交流。'},
   {q:'卑南遺址若出現農作與聚落線索，可支持什麼推論？',opts:['農業較穩定有利定居生活','人們完全沒有食物','所有人住在船上','只靠狩獵且不定居'],a:0,p:4,tip:'農業與定居有關。'},
   {q:'原住民族口述故事在展覽中的價值是？',opts:['提供族群自身的歷史、環境與價值觀線索','一定能取代所有考古證據','只具有娛樂性','所有族群故事都相同'],a:0,p:4,tip:'口述傳統也是文化證據。'},
   {q:'城堡模型若沒有年代與來源說明，最大的問題是？',opts:['觀眾難以判斷它代表哪個歷史脈絡','模型一定是假的','顏色不夠漂亮','展覽不能使用模型'],a:0,p:4,tip:'證據需要脈絡。'},
   {q:'把臺灣玉與貿易資料放在同一展區，有什麼學習意義？',opts:['比較史前到歷史時期跨地區交換的延續與變化','證明兩者完全相同','證明交流只發生一次','和主題無關'],a:0,p:4,tip:'可以跨時代比較交流。'}]},
  {type:'data',name:'六、圖表判讀與應用｜10分',context:'<div class="mini-map-note"><b>位置線索</b><span>臺灣北方接近日本，西側靠近亞洲大陸，南方連向菲律賓與東南亞海域，東側面向太平洋。</span></div>',qs:[
   {q:'一艘 17 世紀商船要在中國沿海、日本與東南亞之間往來，為何臺灣值得注意？',opts:['位在多條區域航路之間，可作補給、轉運或據點','位在北極圈','離亞洲非常遠','完全沒有海岸'],a:0,p:5,tip:'根據位置線索判讀。'},
   {q:'同一張位置圖也能幫助解釋哪個自然現象？',opts:['候鳥遷徙與海洋生物分布','電腦運算速度','文字筆畫','學校作息'],a:0,p:5,tip:'位置也會影響生物移動。'}]},
  {type:'short',name:'七、簡答題｜10分',qs:[
   {q:'請用「環境」與「文化」兩個概念，解釋為什麼不能把所有原住民族看成完全相同。',keywords:[['環境','地形','海岸','山','季節'],['不同','多元','差異','文化','族']],p:5,tip:'要提到環境條件多樣，也要指出各族文化有差異。'},
   {q:'請寫出一個大航海時代留給今日臺灣的影響，並說明你可以用什麼證據研究它。',keywords:[['城堡','遺址','宗教','貿易','移民','地名','文化'],['證據','史料','遺址','文件','地圖','文物']],p:5,tip:'先說影響，再提出能研究它的證據。'}]}
 ]}
};
let examTimer=null,examRuntime=null;
function examTotal(e){return e.sections.reduce((s,sec)=>s+sec.qs.reduce((a,q)=>a+(q.p||0),0),0)}
function openExamHub(){stopExamTimer(false);const a=state.examBest.A||0,b=state.examBest.B||0;$('#examContent').innerHTML=`<div class="exam-head"><span class="pill">★ 第一次段考檢核點</span><h2>第一、二單元｜A / B 真實模擬卷</h2><p>每卷 100 分、40 分鐘。題型參照國小定期評量常見形式：是非、選擇、填充、配合、閱讀題組、圖表判讀與簡答。</p></div><div class="exam-cards"><button class="exam-card" data-exam="A"><span>🟢</span><b>A 卷</b><small>最佳 ${a} 分・${state.examAttempts.A||0} 次</small><em>完整 40 分鐘模擬，開始後會倒數並響鈴。</em></button><button class="exam-card" data-exam="B"><span>🟣</span><b>B 卷</b><small>最佳 ${b} 分・${state.examAttempts.B||0} 次</small><em>同範圍、不同資料與情境。</em></button></div><div class="exam-note"><b>模擬規則</b><span>按「開始」後計時不中斷；剩 10、5、1 分鐘會響鈴提醒，時間到自動交卷。每題都有 🔊 可朗讀。</span></div>`;if(!$('#examDialog').open)$('#examDialog').showModal();$$('[data-exam]').forEach(b=>b.onclick=()=>renderExamReady(b.dataset.exam))}
function renderExamReady(form){const e=examData[form],total=examTotal(e);$('#examContent').innerHTML=`<div class="exam-head"><button class="text-btn" id="backExam">← A / B 卷</button><span class="pill">${form} 卷・${total} 分</span><h2>${e.title}</h2><p>${e.subtitle}</p></div><div class="exam-start-card"><div class="big-clock">40:00</div><h3>準備好再按開始</h3><p>請先準備紙筆。開始後會像月考一樣倒數；時間到會自動交卷。</p><div class="exam-rules"><span>🔔 10 / 5 / 1 分鐘提醒</span><span>🔊 每題可語音朗讀</span><span>📝 未作答題時間到以 0 分計</span></div><button class="primary-btn" id="startExam">開始 40 分鐘模擬考</button></div>`;$('#backExam').onclick=openExamHub;$('#startExam').onclick=()=>{bell(1);renderExam(form)}}
function renderExamQuestion(sec,q,si,qi){const key=`s${si}q${qi}`,voice=speechBtn(q.q,'朗讀題目');if(sec.type==='tf')return `<div class="exam-q"><b class="question-line"><span>${qi+1}. ${q.q} <em>${q.p}分</em></span>${voice}</b><div class="exam-options inline"><label><input type="radio" name="${key}" value="1"> ○ 正確</label><label><input type="radio" name="${key}" value="0"> × 錯誤</label></div></div>`;if(['mcq','group','data'].includes(sec.type))return `<div class="exam-q"><b class="question-line"><span>${qi+1}. ${q.q} <em>${q.p}分</em></span>${voice}</b><div class="exam-options">${shuffled(q.opts.map((o,oi)=>({o,oi}))).map(z=>`<label><input type="radio" name="${key}" value="${z.oi}"> ${z.o}</label>`).join('')}</div></div>`;if(sec.type==='fill')return `<div class="exam-q"><b class="question-line"><span>${qi+1}. ${q.q} <em>${q.p}分</em></span>${voice}</b><input class="exam-input" name="${key}" autocomplete="off" placeholder="請填答案"></div>`;if(sec.type==='match')return `<div class="exam-q"><b class="question-line"><span>${qi+1}. ${q.q} <em>${q.p}分</em></span>${voice}</b><select class="exam-select" name="${key}"><option value="">請選擇配對</option>${shuffled(sec.choices).map(c=>`<option>${c}</option>`).join('')}</select></div>`;if(sec.type==='short')return `<div class="exam-q"><b class="question-line"><span>${qi+1}. ${q.q} <em>${q.p}分</em></span>${voice}</b><textarea class="exam-textarea" name="${key}" rows="3" placeholder="請用完整句子回答"></textarea></div>`;return ''}
function renderExam(form){const e=examData[form];examRuntime={form,endAt:Date.now()+EXAM_MINUTES*60000,alerts:new Set(),submitted:false};$('#examContent').innerHTML=`<div class="exam-sticky"><div><b>${form} 卷｜${e.title}</b><small>作答中</small></div><div class="timer-box" id="examTimer">40:00</div></div><form id="examForm">${e.sections.map((sec,si)=>`<section class="exam-section"><h3>${sec.name}</h3>${sec.context?`<div class="exam-context"><div class="context-head">資料閱讀 ${speechBtn(cleanSpeechText(sec.context),'朗讀資料')}</div>${sec.context}</div>`:''}${sec.qs.map((q,qi)=>renderExamQuestion(sec,q,si,qi)).join('')}</section>`).join('')}<div class="exam-submit"><p id="examProgress">40 分鐘內完成即可，不必急。</p><button type="submit" class="primary-btn">交卷並計分</button></div></form>`;$('#examForm').onsubmit=ev=>{ev.preventDefault();gradeExam(form,false)};startExamTimer()}
function startExamTimer(){clearInterval(examTimer);const tick=()=>{if(!examRuntime||examRuntime.submitted)return;const left=Math.max(0,examRuntime.endAt-Date.now()),sec=Math.ceil(left/1000),m=Math.floor(sec/60),s=sec%60;const el=$('#examTimer');if(el)el.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;[[600,'10 分鐘'],[300,'5 分鐘'],[60,'1 分鐘']].forEach(([t,label])=>{if(sec<=t&&!examRuntime.alerts.has(t)){examRuntime.alerts.add(t);bell(t===60?2:1);showToast(`🔔 剩下 ${label}`)}});if(sec<=0){bell(3);showToast('🔔 時間到，自動交卷');gradeExam(examRuntime.form,true)}};tick();examTimer=setInterval(tick,1000)}
function stopExamTimer(clearRuntime=true){if(examTimer){clearInterval(examTimer);examTimer=null}if(clearRuntime)examRuntime=null}
function normAns(v){return String(v||'').trim().replace(/[\s、，。,.]/g,'').toLowerCase()}
function shortScore(text,q){const t=normAns(text);if(!t)return 0;let groups=0;q.keywords.forEach(g=>{if(g.some(k=>t.includes(normAns(k))))groups++});return Math.round(q.p*groups/q.keywords.length)}
function gradeExam(form,auto=false){if(!examRuntime||examRuntime.submitted)return;const e=examData[form],fd=new FormData($('#examForm'));let score=0,totalQ=0,answered=0,wrong=[];e.sections.forEach((sec,si)=>sec.qs.forEach((q,qi)=>{totalQ++;const key=`s${si}q${qi}`,raw=fd.get(key),wid=`exam-${form}-${si}-${qi}`,has=raw!==null&&String(raw).trim()!=='';if(has)answered++;let pts=0,ok=false;if(sec.type==='tf'){ok=(raw==='1')===q.a&&has;pts=ok?q.p:0}else if(['mcq','group','data'].includes(sec.type)){ok=has&&Number(raw)===q.a;pts=ok?q.p:0}else if(sec.type==='fill'){ok=has&&q.answers.some(a=>normAns(a)===normAns(raw));pts=ok?q.p:0}else if(sec.type==='match'){ok=has&&raw===q.a;pts=ok?q.p:0}else if(sec.type==='short'){pts=shortScore(raw,q);ok=pts===q.p}else{}score+=pts;if(ok){state.wrongBank=state.wrongBank.filter(x=>x.id!==wid)}else{const answerText=sec.type==='short'?`作答要點：${q.tip}`:sec.type==='fill'?`可接受答案：${q.answers[0]}`:sec.type==='match'?`正確配對：${q.a}`:sec.type==='tf'?`正確答案：${q.a?'○':'×'}`:`正確答案：${q.opts[q.a]}`;wrong.push({id:wid,q:q.q,tip:answerText});const old=state.wrongBank.find(x=>x.id===wid);if(old){old.label=q.q;old.tip=answerText}else state.wrongBank.push({id:wid,lesson:'exam1',label:q.q,tip:answerText,kind:'exam'})}}));if(!auto&&answered<totalQ){$('#examProgress').textContent=`還有 ${totalQ-answered} 題未作答；若現在交卷，空白題會以 0 分計。再按一次交卷即可。`;if(!$('#examForm').dataset.confirmBlank){$('#examForm').dataset.confirmBlank='1';return}}examRuntime.submitted=true;stopExamTimer(false);state.examAttempts[form]=(state.examAttempts[form]||0)+1;state.examBest[form]=Math.max(state.examBest[form]||0,score);if(score>=90)unlockAchievement('exam_master');state.stars+=Math.max(5,Math.round(score/10));saveState();renderState();$('#examContent').innerHTML=`<div class="score-hero"><span>📝 ${form} 卷${auto?'・時間到':''}</span><strong>${score}</strong><small>/ 100</small><h2>${score>=90?'模擬狀態很穩！':score>=80?'大部分觀念已掌握':score>=70?'基本盤有了，再救幾個錯點':'先救錯點，比一直重考有效'}</h2><p>需要再確認 ${wrong.length} 題；已送到弱點救援。</p><div class="score-actions"><button class="secondary-btn" id="examHome">回 A / B 卷</button><button class="primary-btn" id="examRescue">看弱點救援</button></div></div>`;$('#examHome').onclick=openExamHub;$('#examRescue').onclick=()=>{$('#examDialog').close();openGlobalRescue()}}

function mission(type){const id=nextLesson(),l=lessons[id]||lessons['1-1'];const data={map:['🗺️ 找一找',`今天的主題：${l.short}`],story:['👀 看一眼',l.intro],check:['✅ 試一題',`先問自己：「我能不能用一個證據解釋 ${l.title.replace('？','')}？」`]}[type];$('#missionContent').innerHTML=`<div class="unit-title"><span class="pill">今日小任務</span><h2>${data[0]}</h2><p>${data[1]}</p></div><div class="mini-activity"><button class="primary-btn" id="finishMission">完成這一步</button></div>`;$('#missionDialog').showModal();$('#finishMission').onclick=()=>{if(state.daily.date!==todayKey())state.daily={date:todayKey(),done:[]};if(!state.daily.done.includes(type)){state.daily.done.push(type);addStars(2)}saveState();renderState();$('#missionDialog').close()}}
$$('.task-row').forEach(b=>b.onclick=()=>mission(b.dataset.task));$('#startToday').onclick=()=>{const d=state.daily?.done||[];mission(!d.includes('map')?'map':!d.includes('story')?'story':'check')};
$('#enterNextLesson').onclick=()=>{const id=nextLesson();availableLessons.includes(id)?openLesson(id):openUnit(Number(id[0]))};
$('#toggleMap').onclick=()=>{const m=$('#semesterMap'),o=m.hidden;m.hidden=!o;$('#toggleMap').textContent=o?'收起地圖 ↑':'展開地圖 ↓';$('#toggleMap').setAttribute('aria-expanded',String(o))};
$('#openExamCheckpoint').onclick=openExamHub;

function openGlobalRescue(){const ws=state.wrongBank;$('#missionContent').innerHTML=`<div class="unit-title"><span class="pill">🛟 弱點救援</span><h2>${ws.length?`今天只救 ${Math.min(ws.length,6)} 個錯點`:'目前沒有錯點'}</h2><p>${ws.length?'不用回頭重看整章。看提示，知道自己錯在哪裡就好。':'可以安心繼續往下一站。'}</p></div><div class="rescue-list">${ws.slice(0,6).map(w=>`<div class="rescue-item"><b>${escapeHtml(w.label)}</b><p>${escapeHtml(w.tip)}</p>${lessons[w.lesson]?`<button class="secondary-btn" data-rescue-lesson="${w.lesson}">回 ${w.lesson} 複習</button>`:`<button class="secondary-btn" data-rescue-clear="${w.id}">我已重新確認觀念</button>`}</div>`).join('')}</div>`;if(!$('#missionDialog').open)$('#missionDialog').showModal();$$('[data-rescue-lesson]').forEach(b=>b.onclick=()=>{$('#missionDialog').close();openLesson(b.dataset.rescueLesson,6)});$$('[data-rescue-clear]').forEach(b=>b.onclick=()=>{clearWrong(b.dataset.rescueClear);openGlobalRescue()})}
$('#rescueBtn').onclick=openGlobalRescue;

function openTimeline(){const done2=state.completedLessons.some(x=>x.startsWith('2-'));$('#missionContent').innerHTML=`<div class="unit-title"><span class="pill">⏳ 時光機</span><h2>把事件放回時間裡</h2><p>時間軸不是用來背一長串年份，而是看「誰先、誰後、發生了什麼改變」。</p></div><div class="timeline">${[['史前','長濱文化：打製石器、用火'],['史前','卑南遺址：農業與聚落'],['史前','十三行文化：鐵器'],['1624','荷蘭人在南臺灣建立據點'],['1626','西班牙人在北臺灣建立據點'],['1642','西班牙離臺，荷蘭勢力擴大'],['1661','鄭成功率軍來臺'],['1662','荷蘭人離臺，鄭氏政權經營臺灣']].map((x,i)=>`<div class="time-item ${!done2&&i>2?'future':''}"><b>${x[0]}</b><span>${!done2&&i>2?'完成第二單元後再揭曉':x[1]}</span></div>`).join('')}</div>`;$('#missionDialog').showModal()}
function openEvidenceRoom(){const pool=availableLessons.filter(id=>state.completedLessons.includes(id));const id=pool.length?pool[Math.floor(Math.random()*pool.length)]:nextLesson();openLesson(lessons[id]?id:'1-1',4)}

function profileHtml(){const badges=[['lesson_finish','🚩 第一站完成','完成任一課六關'],['culture_respect','🌿 文化觀察家','完成 1-3 原住民族文化與環境'],['time_traveler','⏳ 時光旅行者','完成第二單元'],['perfect_quiz','💯 五題全對','任一課小闖關 5/5'],['exam_master','👑 檢核高手','第一次段考任一卷 90 分以上']];return `<div class="unit-title"><span class="pill">我的探險資料</span><h2>👤 ${escapeHtml(currentUser)}</h2><p>每個帳號的進度都獨立保存在這台裝置。</p></div><div class="profile-stats"><div class="stat-box"><b>${state.stars}</b><span>星星</span></div><div class="stat-box"><b>${state.completedLessons.length}/13</b><span>完成課數</span></div><div class="stat-box"><b>${state.progress}%</b><span>學期進度</span></div></div><div class="exam-mini-stats"><span>A卷最佳 <b>${state.examBest.A||0}</b></span><span>B卷最佳 <b>${state.examBest.B||0}</b></span></div><h3>成就</h3><div class="achievement-grid">${badges.map(b=>`<div class="badge-card ${state.achievements.includes(b[0])?'':'locked'}"><b>${b[1]}</b><small>${b[2]}</small></div>`).join('')}</div><div class="profile-actions"><button class="secondary-btn" id="logoutBtn">切換帳號</button><button class="danger-btn" id="resetMeBtn">重設這個帳號進度</button></div><p class="tiny-note">這是本機學習帳號；清除瀏覽器網站資料會一併清除帳號與進度。正式上線若要跨裝置同步，再接雲端帳號。</p>`}
function openProfile(){$('#profileContent').innerHTML=profileHtml();$('#profileDialog').showModal();$('#logoutBtn').onclick=()=>{$('#profileDialog').close();logout()};$('#resetMeBtn').onclick=()=>{if(confirm('確定要把這個帳號的星星、錯題和進度全部重設嗎？')){state=defaultState();saveState();renderState();$('#profileContent').innerHTML=profileHtml()}}}
$('#profileBtn').onclick=openProfile;$('#toolAchievement').onclick=openProfile;$('#toolMap').onclick=()=>openLesson('1-1',1);$('#toolTime').onclick=openTimeline;$('#toolEvidence').onclick=openEvidenceRoom;
$$('.nav-item').forEach(b=>b.onclick=()=>{$$('.nav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');if(b.dataset.nav==='home')scrollTo({top:0,behavior:'smooth'});if(b.dataset.nav==='map'){$('#semesterMap').hidden=false;document.querySelector('.map-peek').scrollIntoView({behavior:'smooth'})}if(b.dataset.nav==='rescue')openGlobalRescue();if(b.dataset.nav==='me')openProfile()});
$$('[data-close]').forEach(b=>b.onclick=()=>{const d=b.closest('dialog');if(d?.id==='examDialog'&&examRuntime&&!examRuntime.submitted){if(!confirm('模擬考正在計時，確定要離開嗎？計時會結束。'))return;stopExamTimer()}d.close()});
function showToast(msg){let t=document.createElement('div');t.textContent=msg;Object.assign(t.style,{position:'fixed',left:'50%',bottom:'90px',transform:'translateX(-50%)',background:'#26334a',color:'#fff',padding:'11px 16px',borderRadius:'999px',zIndex:99,fontWeight:800,boxShadow:'0 8px 22px #0003'});document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

renderAccounts();const session=localStorage.getItem(SESSION_KEY);if(session&&accounts[session])login(session);
