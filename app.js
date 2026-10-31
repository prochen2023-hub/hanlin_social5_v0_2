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
  unit:1,title:'從地圖探索臺灣的位置與發展',short:'世界 → 東亞 → 臺灣周邊 → 氣候海洋，一層一層看懂。',visual:mapSvg,
  intro:'這課不是只背「臺灣在東亞」。要把世界位置、周邊海域、島嶼範圍、季風、洋流與生物遷徙串成一條因果線。',
  facts:[
   ['🌍 世界位置','先認得五大洲與三大洋，再把臺灣放回亞洲東側、太平洋西側。'],
   ['🧭 東亞鄰居','臺灣西隔臺灣海峽面向中國大陸，北方鄰近日本、韓國方向，南隔巴士海峽接近菲律賓。'],
   ['🏝️ 島嶼範圍','臺灣地區除了臺灣本島，也包含澎湖、金門、馬祖、綠島、蘭嶼、小琉球等島嶼；課堂常以約3.6萬平方公里記憶。'],
   ['🌬️ 季風生活','冬季東北季風、夏季西南季風會改變風向與降雨，也影響建築、農作與生活安排。'],
   ['🌊 洋流漁獲','暖流、冷流與季節變化，使臺灣周邊不同季節出現不同漁獲。'],
   ['🐦 遷徙中繼','臺灣位在東亞候鳥遷徙路線上，濕地與魚塭能成為黑面琵鷺等候鳥重要停棲與度冬地。']
  ],
  pairs:[
   ['亞洲東側、太平洋西側','臺灣的世界相對位置'],['臺灣海峽','臺灣本島西側的重要海域'],['巴士海峽','臺灣南方、往菲律賓方向的海域'],['東北季風','冬半年常見，北部與東北部迎風面較濕冷'],['西南季風','夏半年帶來暖濕氣流與較多降雨'],['夏季暖流','東部海域常見鮪魚等洄游魚群線索'],['冬季冷流','西部海域常見烏魚洄游產卵線索'],['黑面琵鷺','利用臺灣西南沿海濕地與魚塭度冬']
  ],
  story:[
   ['🌍','定位','世界先找亞洲與太平洋，再縮小到東亞。'],['🧭','周邊','海峽與鄰國位置讓臺灣成為海上交流節點。'],['🌬️','氣候','季風造成不同季節的風雨差異，人們因地制宜。'],['🌊','海洋','洋流帶來季節性漁獲，也讓生物沿海洋遷徙。'],['🐦','生態','候鳥利用濕地補充食物，臺灣成為遷徙中繼站。']
  ],
  claim:'「臺灣的位置會同時影響人類活動與生物遷徙。」哪一組證據最能支持？',
  evidence:[
   ['A','臺灣鄰近東亞海上航路，周邊又有洋流與沿海濕地，因此同時出現海上交流、季節漁獲與候鳥停棲。',true],
   ['B','臺灣有許多高山，而且便利商店很多。',false],
   ['C','所有縣市的氣候與產業都完全相同。',false]
  ],
  quiz:[
   ['五大洲中，臺灣位在哪一洲？',['亞洲','非洲','歐洲','美洲'],0,'臺灣位在亞洲東側。'],
   ['三大洋中，臺灣東側面向哪一個大洋？',['太平洋','大西洋','印度洋','北冰洋'],0,'臺灣東側面向太平洋。'],
   ['臺灣本島西側的重要海域是？',['臺灣海峽','巴士海峽','大西洋','日本海'],0,'西側是臺灣海峽。'],
   ['臺灣本島南方、往菲律賓方向的重要海域是？',['巴士海峽','臺灣海峽','東海','大西洋'],0,'南方是巴士海峽。'],
   ['課堂上通常把臺灣地區面積約記成多少？',['約3.6萬平方公里','約360平方公里','約36萬平方公里','約360萬平方公里'],0,'先記約3.6萬平方公里。'],
   ['哪一組都是臺灣周邊的重要離島？',['澎湖、金門、馬祖','北海道、沖繩、濟州島','呂宋、宿霧、峇里島','香港、澳門、新加坡'],0,'這三者都是臺灣常見離島範圍題。'],
   ['冬季東北季風最容易讓哪一側迎風面較濕冷？',['北部與東北部','西南部全年完全無雨','所有地方都一樣','只有外島'],0,'東北季風遇山抬升，北部與東北部迎風面較容易降雨。'],
   ['夏季西南季風的主要特性較接近？',['暖濕、常帶來較多降雨','乾冷、完全無雨','全年風向不變','只影響海底'],0,'夏季西南季風常帶來暖濕氣流。'],
   ['澎湖「菜宅」用石牆圍住農地，主要是在適應什麼？',['強勁季風與鹽風','火山爆發','終年積雪','沙漠高溫'],0,'石牆能減弱強風、保護作物。'],
   ['蘭嶼傳統半穴居家屋最能說明什麼？',['因應強風、颱風與炎熱環境','為了看雪景','因為沒有木材或石材','和環境完全無關'],0,'建築會因地制宜。'],
   ['新竹新埔曬柿餅會利用秋冬乾燥風，這說明？',['人們會善用地方氣候發展產業','季風只有壞處','農作和氣候無關','所有縣市都適合曬柿餅'],0,'在地產業常和氣候資源結合。'],
   ['夏季臺灣東部海域暖流常和哪種漁獲活動連結？',['鮪魚','烏魚','帝王蟹','鱈魚'],0,'課本常以夏季鮪魚、冬季烏魚對照。'],
   ['冬季臺灣西部海域常見哪種季節性漁獲？',['烏魚','鮪魚','鯨魚','鮭魚'],0,'冬季冷流與烏魚洄游是常見考點。'],
   ['黑面琵鷺的嘴最具辨識度的特徵是？',['末端像湯匙的黑色長嘴','短而紅的圓嘴','沒有嘴','像鸚鵡的彎嘴'],0,'黑面琵鷺因黑臉與匙狀嘴得名。'],
   ['「臺灣是生物遷徙中繼站」最適合用哪個例子說明？',['候鳥在臺灣濕地停棲、覓食或度冬','所有鳥終生都不移動','臺灣沒有濕地','只有人類會跨海移動'],0,'候鳥遷徙會利用臺灣補充食物與休息。']
  ]
 },
 '1-2':{
  unit:1,title:'史前人們如何善用資源維持生活？',short:'時間軸 → 工具 → 生產 → 聚落 → 交換，看見生活一步步改變。',visual:archaeologyVisual,
  intro:'「史前」不是沒有歷史，而是缺少我們熟悉的文字紀錄。考古學家靠地層、遺址與器物，重建人們如何取得食物、製作工具、定居、分工與交換。',
  facts:[
   ['⌛ 何謂史前','沒有留下可直接閱讀的文字紀錄，因此要靠考古證據推論。'],
   ['🪨 舊石器','長濱文化是重要代表；打製石器、採集、狩獵、漁撈與用火是常見線索。'],
   ['🏺 新石器','磨製石器、陶器與農業增加，食物較穩定，聚落與分工更容易發展。'],
   ['⚒️ 金屬器','十三行文化會製鐵、用鐵器，工具效率與農業生產力提高。'],
   ['💚 臺灣玉','花蓮玉材被加工成器物，在臺灣各地與東南亞出土，顯示專業分工與跨海交換。'],
   ['🧪 5W1H探究','Who、What、When、Where、Why、How 能把遺址證據整理成有根據的推論。']
  ],
  pairs:[
   ['長濱文化','打製石器、採集狩獵與用火'],['卑南文化／遺址','農業、大型聚落、石板棺與玉器'],['十三行文化','鐵器、農業、漁獵與跨海交換'],['磨製石器與陶器','新石器時代重要技術線索'],['鐵製農具','金屬器時代生產效率提高'],['花蓮豐田玉材','臺灣玉重要原料來源'],['臺灣玉在東南亞出土','跨海交換與航海網絡的證據'],['遺址文化層','判斷生活方式與年代先後的證據']
  ],
  story:[
   ['🪨','工具','打製 → 磨製 → 金屬，工具愈來愈有效率。'],['🌾','生產','採集狩獵之外，農業增加，食物較穩定。'],['🏘️','聚落','定居與人口增加，工作開始分工。'],['💚','專業','有人專門製作玉器、鐵器等物品。'],['🚣','交換','多餘產品與珍貴物品被帶到更遠地方，形成區域與跨海網絡。']
  ],
  claim:'「史前社會的生產力提高後，分工與交換也更容易發展。」哪個證據最能直接支持？',
  evidence:[
   ['A','出土鐵製農具、玉器加工痕跡與遠地來源物品，顯示工具進步、專業製作與交換同時存在。',true],
   ['B','遺址附近今天有便利商店。',false],
   ['C','所有史前人都做完全相同的工作。',false]
  ],
  quiz:[
   ['「史前時代」最適合的解釋是？',['缺少可直接閱讀的文字紀錄，主要靠考古證據研究','完全沒有任何人類活動','沒有工具的年代','只有恐龍生活的年代'],0,'史前仍有人類歷史，只是文字紀錄不足。'],
   ['長濱文化常被放在哪一個時代？',['舊石器時代','新石器時代','金屬器時代','大航海時代'],0,'長濱文化是臺灣舊石器重要代表。'],
   ['舊石器時代工具最具代表性的製作方式是？',['打製石器','鐵器鑄造','玻璃製造','塑膠射出'],0,'以敲打石材做出利刃。'],
   ['新石器時代比舊石器更明顯的新線索是？',['農業、磨製石器與陶器','高速鐵路','大量鐵農具','現代文字'],0,'農業與磨製技術是核心差異。'],
   ['卑南文化常見哪個組合？',['大型聚落、農業、石板棺與玉器','打製石器而完全沒有定居','大型鐵工廠與蒸汽機','歐洲城堡'],0,'卑南文化屬新石器晚期重要代表。'],
   ['十三行文化最常用哪一項證據辨認？',['鐵器使用與煉鐵技術','只有打製石器','沒有農業','沒有任何交換'],0,'十三行是金屬器時代的重要代表。'],
   ['從舊石器到金屬器，最主要的變化方向是？',['工具效率提高，生產、聚落與分工更複雜','人類愈來愈不會使用工具','食物來源愈來愈不穩定','所有人都離開臺灣'],0,'重點是生產力與社會組織的變化。'],
   ['臺灣玉主要原料來源常指向哪裡？',['花蓮壽豐一帶','臺北盆地','澎湖玄武岩','金門花崗岩'],0,'臺灣閃玉的重要來源在花蓮壽豐豐田一帶。'],
   ['花蓮玉材在臺灣各地被發現，最能推論？',['島內已有交換與運輸網絡','玉會自己走路','所有人都住在花蓮','沒有分工'],0,'產地與出土地不同，可支持交換推論。'],
   ['臺灣玉器也在菲律賓、越南等地被發現，最合理的推論是？',['史前已有跨海航行與交換','史前人只在山上活動','東南亞人從未航海','所有玉都產在菲律賓'],0,'遠距出土地顯示海上交流。'],
   ['玉器加工遺址的意義較接近？',['可能存在專業製作者與工作分工','每個人都只做同一件事','玉器與社會無關','只能證明今天有珠寶店'],0,'專業加工需要技術、時間與分工。'],
   ['5W1H 中「Where」主要在問？',['在哪裡發生或出土','誰做的','為什麼','怎麼做'],0,'Where 就是地點。'],
   ['5W1H 中「How」用在長濱文化可問？',['人們如何利用石材製作工具、取得食物','什麼時候出生','住在哪個縣市的現代飯店','誰發明手機'],0,'How 強調方法與過程。'],
   ['想實地認識卑南遺址，最適合去哪一類場所？',['卑南遺址公園／史前文化博物館相關場館','只有百貨公司','只有遊樂園','機場免稅店'],0,'考古遺址與博物館是理解史前文化的重要場所。'],
   ['史前文物成為「國寶」最重要的原因是？',['具有稀有性與重要歷史文化價值，能幫助理解臺灣過去','因為價格一定最貴','因為體積最大','因為是現代大量生產'],0,'國寶重點是文化資產價值，不只是價格。']
  ]
 },
 '1-3':{
  unit:1,title:'原住民族的文化與環境有何關聯？',short:'先看分布，再記少數高頻文化線索，最後理解背後的環境智慧。',visual:indigenousVisual,
  intro:'臺灣目前經政府認定有16個原住民族。網站會讓你「全部看過，但不全部硬背」：先掌握常見考點，再用環境、規範、祭儀與故事理解生活智慧。',
  facts:[
   ['🗺️ 16族分布','不同族群分布在北中南山區、東部縱谷與海岸、日月潭、蘭嶼等不同環境。'],
   ['🦌 邵族白鹿','白鹿傳說和祖先尋找新居地、日月潭環境的文化記憶相連。'],
   ['🐟 達悟族飛魚','飛魚季有捕撈時序、禁忌與共享規範，反映順應海洋季節與珍惜資源。'],
   ['🌾 阿美族豐年祭','和農作收穫、年齡階級與部落凝聚力有關，是常見辨識考點。'],
   ['🏹 布農族射耳祭','和狩獵文化、教育與族群傳承相關，常和「射耳祭」配對。'],
   ['🧵 泰雅族智慧','gaga規範、織布與山林生活常被用來理解社會規範和環境知識。'],
   ['🤝 共享互助','傳統部落的重要事務、漁獵、祭儀常有共同規範；目的之一是維持秩序、互助與資源延續。']
  ],
  pairs:[
   ['阿美族','東部海岸與縱谷；豐年祭'],['泰雅族','北中部山區；gaga、織布'],['布農族','中央山區；射耳祭、狩獵文化'],['排灣族','南部山區；階級制度、祭儀與工藝'],['邵族','日月潭；白鹿傳說'],['賽夏族','新竹苗栗山區；矮靈祭'],['達悟族','蘭嶼；飛魚文化'],['卑南族','臺東平原一帶；少年會所等部落文化線索']
  ],
  story:[
   ['🏔️','環境','山地、海岸、湖泊、離島提供不同資源與限制。'],['📖','故事','傳說保存祖先遷徙、資源與價值觀的文化記憶。'],['📜','規範','禁忌、祭儀、gaga或部落決議規範共同生活。'],['🌿','智慧','依季節打獵、捕魚、採集，避免無限制取用。'],['🤝','互助','共享、分工與共同決策讓部落面對環境與生活挑戰。']
  ],
  claim:'「一些原住民族的禁忌與祭儀，也具有管理資源、傳承知識的功能。」哪個證據最能支持？',
  evidence:[
   ['A','飛魚季、狩獵季等活動常依季節、物種與部落規範決定何時可捕、如何分享，長輩也會藉活動教導年輕人。',true],
   ['B','所有族群在任何時間都用完全相同方式取得資源。',false],
   ['C','文化規範只和服裝顏色有關。',false]
  ],
  quiz:[
   ['目前政府認定的臺灣原住民族共有？',['16族','9族','20族','36族'],0,'目前官方認定16族。'],
   ['阿美族常見分布與文化線索是？',['東部海岸與縱谷、豐年祭','蘭嶼、飛魚季','日月潭、白鹿傳說','北部高山、矮靈祭'],0,'阿美族常和東部、豐年祭配對。'],
   ['邵族最常和哪個地點、傳說配對？',['日月潭、白鹿傳說','蘭嶼、飛魚傳說','花蓮玉、玉器加工','北海岸、煉鐵'],0,'邵族的重要文化地景是日月潭。'],
   ['達悟族（雅美族）最具代表性的海洋文化是？',['飛魚文化','烏魚文化','黑鮪魚祭','石滬文化'],0,'蘭嶼達悟族與飛魚文化密切相關。'],
   ['飛魚季的時序與禁忌最能說明？',['利用季節規律並管理海洋資源','完全不看季節捕撈','只為了觀光表演','和環境沒有關係'],0,'規範常兼具文化與資源管理意義。'],
   ['布農族常見的祭儀考點是？',['射耳祭','矮靈祭','豐年祭','飛魚祭'],0,'布農族—射耳祭是常見配對。'],
   ['賽夏族常見的祭儀考點是？',['矮靈祭','射耳祭','飛魚季','黑鮪魚季'],0,'賽夏族—矮靈祭。'],
   ['泰雅族的 gaga 較接近什麼？',['規範族人生活、倫理與祭儀的傳統法則／價值系統','一種海魚名稱','一種現代交通工具','一個荷蘭城堡'],0,'gaga 是泰雅族重要社會規範概念。'],
   ['排灣族常見的文化線索較接近？',['階級制度、家族與祭儀工藝','飛魚季','白鹿傳說','長濱打製石器'],0,'排灣族常見階級、家族與祭儀文化。'],
   ['「打獵禁忌」若限制幼獸、繁殖季或某些區域，可能有什麼功能？',['讓野生動物有繁衍機會，避免資源耗盡','鼓勵一次捕光','讓狩獵完全沒有規則','只增加裝飾'],0,'傳統規範可能兼具資源永續功能。'],
   ['部落重要事務由族人共同討論或依傳統制度決定，最能表現？',['共同治理與社會組織','每人完全互不往來','沒有任何規範','只有個人決定'],0,'部落事務反映社會組織與共同決策。'],
   ['傳說對學習原住民族文化最大的意義是？',['保存祖先、遷徙、環境與價值觀的文化記憶','可以當成精確氣象數字','證明所有傳說都完全一樣','只用來背人物名稱'],0,'傳說是文化記憶與價值傳承方式。'],
   ['為什麼網站不要求把16族全部一次背完？',['先掌握分布規律與高頻文化線索，再逐步認識，較能理解且避免混淆','因為只有少數族群重要','因為其他族群不存在','因為地圖沒有用途'],0,'學習要兼顧多元尊重與可記憶性。'],
   ['下列哪個配對正確？',['達悟族—蘭嶼—飛魚文化','邵族—蘭嶼—飛魚文化','布農族—日月潭—白鹿傳說','賽夏族—東部海岸—豐年祭'],0,'達悟族主要居住蘭嶼。'],
   ['學習原住民族生活智慧時，最重要的理解是？',['文化規範常和環境、資源、互助及族群歷史一起形成','所有族群都完全相同','只背服裝顏色即可','文化只存在古代'],0,'重點是環境與文化之間的關聯。']
  ]
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


function lessonOrdinal(id){const n=Number(String(id).split('-')[1]);return ['','第一課','第二課','第三課','第四課'][n]||`第${n}課`}
function unit1WorldMap(){return `<div class="learning-map-card"><div class="map-title"><b>🌍 世界定位圖</b><span>先看編號，再到下方填名稱</span></div><svg class="world-study-map" viewBox="0 0 800 390" role="img" aria-label="五大洲三大洋互動示意圖">
 <rect x="5" y="5" width="790" height="380" rx="26" class="sea-bg"/>
 <path d="M55 85 Q110 40 175 70 L215 120 170 165 125 150 90 205 45 160Z" class="land-shape"/><path d="M175 205 Q210 180 230 225 L210 330 165 300 150 245Z" class="land-shape"/>
 <path d="M345 70 Q390 55 425 83 L410 115 360 110Z" class="land-shape"/><path d="M360 125 Q420 105 455 150 L445 285 380 300 345 225Z" class="land-shape"/>
 <path d="M430 75 Q535 40 665 85 L720 145 640 190 570 160 520 210 465 170Z" class="land-shape"/><path d="M635 245 Q700 218 750 270 L725 325 650 315 615 280Z" class="land-shape"/>
 <g class="map-number"><circle cx="555" cy="118" r="18"/><text x="555" y="124">1</text><circle cx="385" cy="91" r="18"/><text x="385" y="97">2</text><circle cx="402" cy="210" r="18"/><text x="402" y="216">3</text><circle cx="140" cy="130" r="18"/><text x="140" y="136">4</text><circle cx="685" cy="278" r="18"/><text x="685" y="284">5</text><circle cx="755" cy="155" r="18"/><text x="755" y="161">6</text><circle cx="285" cy="155" r="18"/><text x="285" y="161">7</text><circle cx="525" cy="285" r="18"/><text x="525" y="291">8</text></g>
 <circle cx="632" cy="124" r="8" class="taiwan-dot"/><text x="645" y="128" class="taiwan-label">臺灣</text>
 </svg><div class="map-legend-note">本課依國小教材常用分類：五大洲＝亞洲、歐洲、非洲、美洲、大洋洲｜三大洋＝太平洋、大西洋、印度洋。</div></div>`}
function unit1EastAsiaMap(){return `<div class="learning-map-card"><div class="map-title"><b>🧭 東亞放大圖</b><span>臺灣在海陸交界，方向題一定要會</span></div><svg class="eastasia-study-map" viewBox="0 0 760 430" role="img" aria-label="臺灣與東亞鄰國海域示意圖">
 <rect x="5" y="5" width="750" height="420" rx="26" class="sea-bg"/><path d="M35 25 H360 Q325 130 365 215 Q320 310 250 410 H35Z" class="land-shape"/><path d="M560 60 q35 25 12 75 q-15 40 12 80 q25 40 0 75" class="island-chain"/><path d="M480 335 q25 -25 55 0 l20 65 h-95z" class="land-shape"/>
 <ellipse cx="430" cy="260" rx="15" ry="43" transform="rotate(-18 430 260)" class="taiwan-shape"/>
 <g class="map-number"><circle cx="210" cy="170" r="18"/><text x="210" y="176">1</text><circle cx="585" cy="135" r="18"/><text x="585" y="141">2</text><circle cx="520" cy="75" r="18"/><text x="520" y="81">3</text><circle cx="520" cy="365" r="18"/><text x="520" y="371">4</text><circle cx="345" cy="255" r="18"/><text x="345" y="261">5</text><circle cx="440" cy="350" r="18"/><text x="440" y="356">6</text><circle cx="465" cy="155" r="18"/><text x="465" y="161">7</text><circle cx="620" cy="255" r="18"/><text x="620" y="261">8</text></g>
 <text x="410" y="323" class="taiwan-label">臺灣</text></svg><div class="map-legend-note">1中國大陸｜2日本｜3韓國｜4菲律賓｜5臺灣海峽｜6巴士海峽｜7東海（東中國海）｜8太平洋</div></div>`}
function taiwanScopeVisual(){return `<div class="scope-grid"><div class="taiwan-scope-map"><svg viewBox="0 0 340 430" role="img" aria-label="臺灣本島與主要離島示意圖"><rect x="5" y="5" width="330" height="420" rx="24" class="sea-bg"/><ellipse cx="205" cy="205" rx="48" ry="125" transform="rotate(-18 205 205)" class="taiwan-shape"/><g class="island-dot"><circle cx="120" cy="250" r="9"/><text x="80" y="274">澎湖</text><circle cx="54" cy="205" r="8"/><text x="22" y="190">金門</text><circle cx="75" cy="125" r="7"/><text x="35" y="112">馬祖</text><circle cx="275" cy="245" r="7"/><text x="281" y="250">綠島</text><circle cx="292" cy="315" r="8"/><text x="297" y="320">蘭嶼</text><circle cx="118" cy="350" r="7"/><text x="70" y="375">小琉球</text></g></svg></div><div><h4>範圍先抓「本島＋周邊島嶼」</h4><p>考題常用地圖問：哪一個是臺灣範圍、哪一個在臺灣東／西／南側。核心先會 <b>澎湖、金門、馬祖、綠島、蘭嶼、小琉球</b>。教材地圖也常標示龜山島、釣魚臺列嶼、東沙群島、南沙群島中的太平島等，考前要能從位置辨認。</p><div class="number-card"><b>約 36,000 km²</b><span>課堂記憶值；政府土地面積統計約 36,197 km²。</span></div><div class="compare-bars"><div><span>臺灣</span><i style="--w:36%"></i><b>3.6萬</b></div><div><span>南韓</span><i style="--w:100%"></i><b>約10萬</b></div><div><span>日本</span><i style="--w:100%"></i><b>約37.8萬</b></div><div><span>菲律賓</span><i style="--w:100%"></i><b>約30萬</b></div></div><small>比較只看量級：臺灣比南韓、日本、菲律賓都小；考試重點通常是「約3.6萬平方公里」及相對位置，不必背鄰國精確面積。</small></div></div>`}
function selectActivity(title,rows,id){const options=['請選擇','亞洲','歐洲','非洲','美洲','大洋洲','太平洋','大西洋','印度洋','中國大陸','日本','韓國','菲律賓','臺灣海峽','巴士海峽','東海','北部與東北部','西南部','東北季風','西南季風','鮪魚','烏魚','黑面琵鷺'];return `<div class="select-activity"><h4>${title}</h4>${rows.map((r,i)=>`<label><span class="fill-prompt">${r[0]}${speechBtn(r[0],'朗讀題目')}</span><select data-fill-answer="${r[1]}" data-fill-group="${id}">${options.map(o=>`<option value="${o}">${o}</option>`).join('')}</select></label>`).join('')}<button class="secondary-btn" data-check-fill="${id}">檢查答案</button><p class="feedback" id="fillFeedback-${id}">完成後按檢查。</p></div>`}
function bindSelectActivity(id,needed=null){const btn=document.querySelector(`[data-check-fill="${id}"]`);if(!btn)return;btn.onclick=()=>{const sels=$$(`[data-fill-group="${id}"]`);let good=0;sels.forEach(x=>{const ok=x.value===x.dataset.fillAnswer;x.classList.toggle('answer-ok',ok);x.classList.toggle('answer-bad',!ok);if(ok)good++});const target=needed??sels.length;const fb=$(`#fillFeedback-${id}`);fb.textContent=good===sels.length?`全部答對！${good}/${sels.length} 🎉`:`答對 ${good}/${sels.length}。先看地圖位置，再修正紅框。`;if(good>=target)fb.classList.add('good')}}
function lesson11Stage1(){const worldRows=[['① 位在臺灣所在的大洲','亞洲'],['② 歐亞大陸西側的小洲','歐洲'],['③ 歐洲南方的大洲','非洲'],['④ 地圖左側的大洲','美洲'],['⑤ 澳洲與太平洋島嶼區','大洋洲'],['⑥ 臺灣東側的大洋','太平洋'],['⑦ 美洲與歐非之間','大西洋'],['⑧ 非洲、亞洲與大洋洲之間','印度洋']];const eastRows=[['① 臺灣西側陸地','中國大陸'],['② 臺灣東北方島國','日本'],['③ 日本西側半島國家','韓國'],['④ 臺灣南方群島國家','菲律賓'],['⑤ 臺灣本島西側海域','臺灣海峽'],['⑥ 臺灣本島南方海域','巴士海峽'],['⑦ 臺灣北方海域','東海'],['⑧ 臺灣東側海域','太平洋']];return `<h3>第一課｜四個定位重點</h3><div class="focus-route"><span>① 世界</span><span>② 東亞</span><span>③ 臺灣範圍</span><span>④ 位置影響</span></div><p>先從最大尺度縮小。只要會「世界 → 東亞 → 臺灣周邊」，方向題就不容易亂。</p>${unit1WorldMap()}${selectActivity('互動一｜把五大洲、三大洋填回去',worldRows,'world')}${unit1EastAsiaMap()}${selectActivity('互動二｜把鄰國與海域填回去',eastRows,'east')}${taiwanScopeVisual()}<div class="cause-strip"><b>位置不是背完就結束：</b><span>海上交通便利 → 人群與商品交流</span><span>季風與洋流 → 生活、產業不同</span><span>東亞遷徙路線 → 候鳥停棲</span></div><div class="stage-actions"><button class="primary-btn" id="stageNext">我會定位了 → 地圖實戰</button></div>`}
function lesson11Stage2(){const rows=[['臺灣位於哪一洲東側？','亞洲'],['臺灣東側是哪一個大洋？','太平洋'],['臺灣西側海域？','臺灣海峽'],['臺灣南側海域？','巴士海峽'],['臺灣北方海域？','東海'],['北方鄰近哪一島國？','日本'],['南方鄰近哪一群島國家？','菲律賓'],['冬季常見季風？','東北季風'],['夏季常見季風？','西南季風'],['冬季西部常見洄游漁獲？','烏魚']];return `<h3>地圖實戰｜不看答案再填一次</h3><p>這一關故意把位置、季風和海洋混在一起，因為考卷常這樣出。</p>${selectActivity('答對 8/10 就過關',rows,'mapchallenge')}<div class="exam-focus"><b>🧠 近年考題怎麼出？</b><span>公開五年級評量真的會給世界圖、臺灣圖，要求填大洲、大洋、海域和離島。方向口訣：「西海峽、南巴士、東太平、北東海」；鄰居記「北日韓、南菲律賓、西中國大陸」。</span></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext" disabled>下一關</button></div>`}
function climateCards(){return `<h3>氣候、洋流與生活｜把「自然 → 人的做法」連起來</h3><div class="compare-table-wrap"><table class="study-table"><thead><tr><th>自然條件</th><th>主要特色</th><th>生活／產業例子</th><th>好記法</th></tr></thead><tbody><tr><td>冬季東北季風</td><td>北、東北迎風面較濕冷；西南部相對乾</td><td>澎湖菜宅擋風；新埔利用秋冬乾燥風曬柿餅</td><td>冬「東北」來</td></tr><tr><td>夏季西南季風</td><td>暖濕，常帶來較多降雨</td><td>農作與水資源安排要配合雨季</td><td>夏「西南」來</td></tr><tr><td>強風／颱風</td><td>離島風勢強、天候變化大</td><td>蘭嶼半穴居家屋降低風害與暑熱</td><td>房子也會適應環境</td></tr><tr><td>海洋洋流</td><td>冷暖流與季節交替</td><td>夏東部鮪魚、冬西部烏魚等季節漁獲</td><td>夏鮪、冬烏</td></tr></tbody></table></div><div class="local-feature-grid"><div><b>🌬️ 澎湖</b><span>菜宅石牆擋強風；石滬利用潮汐捕魚。</span></div><div><b>🏠 蘭嶼</b><span>半穴居家屋降低強風、颱風與暑熱影響。</span></div><div><b>🍊 新竹新埔</b><span>秋冬乾燥風有利柿餅曝曬。</span></div><div><b>🦁 金門</b><span>風獅爺等地方文化反映強季風環境。</span></div><div><b>🐟 屏東東港</b><span>暖流與洄游魚群形成黑鮪魚季節性漁業文化。</span></div><div><b>🐦 臺南沿海</b><span>魚塭養殖與黑面琵鷺棲地保育發展友善共存做法。</span></div></div><div class="season-cards"><div><b>☀️ 夏季東部</b><span>暖流＋洄游 → 鮪魚等漁獲，屏東東港黑鮪魚文化活動常被拿來當生活例子。</span></div><div><b>🌬️ 冬季西部</b><span>冷流＋洄游 → 烏魚南下產卵，形成捕烏、烏魚子等季節產業。</span></div><div><b>🐦 秋冬濕地</b><span>黑面琵鷺等候鳥南下，在臺灣西南沿海濕地、魚塭休息覓食或度冬。</span></div></div><div class="blackface-card"><div class="spoonbill-icon">🥄🐦</div><div><b>黑面琵鷺為什麼常考？</b><p>牠有黑色臉部、扁長且前端像湯匙的嘴，是冬候鳥。臺灣西南沿海是全球非常重要的度冬地。考題常問「外型辨識＋為什麼來臺灣＋保育如何兼顧魚塭產業」。</p><p class="memory-line">記：<b>黑臉、匙嘴、西南濕地、冬候鳥</b>。</p></div></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext">我能解釋季節差異 → 找證據</button></div>`}
function archaeologyTimeline(){return `<div class="timeline-rich"><div class="timeline-axis"><span style="left:0%">距今5萬年</span><span style="left:48%">7000年</span><span style="left:70%">3500年</span><span style="left:82%">2000年</span><span style="right:0">400年</span></div><div class="era-band old"><b>舊石器</b><span>長濱文化：約5萬～5千年前（翰林時間軸約數）</span></div><div class="era-band neo"><b>新石器</b><span>約7000年前後開始；卑南文化約3500～2000年前</span></div><div class="era-band metal"><b>金屬器</b><span>十三行文化約2000～400年前</span></div></div><p class="source-note">年代是考古研究的「約數」，不同研究或遺址定年可能略有差異。考試看到「約」字要保留。</p>`}
function archaeologyCompare(){return `<div class="compare-table-wrap"><table class="study-table"><thead><tr><th>時代</th><th>代表文化</th><th>工具</th><th>取得食物</th><th>聚落／交換</th></tr></thead><tbody><tr><td>舊石器</td><td>長濱文化</td><td>打製石器、懂用火</td><td>採集、狩獵、漁撈</td><td>流動性較高，利用天然洞穴與沿海資源</td></tr><tr><td>新石器</td><td>卑南等文化</td><td>磨製石器、陶器</td><td>農業增加＋漁獵</td><td>定居聚落、分工、玉器製作與交換</td></tr><tr><td>金屬器</td><td>十三行文化</td><td>鐵器、煉鐵</td><td>農業效率再提高＋漁獵</td><td>聚落與跨海貿易更明顯</td></tr></tbody></table></div><div class="exam-focus"><b>🎯 近年考題怎麼出？</b><span>常用「文化—工具—生活」配合題或年代先後題。最大差異不是只換工具：工具效率提高 → 食物更穩定／生產更多 → 聚落與人口增加 → 工作分工 → 交換範圍擴大。</span></div>`}
function jadeTrade(){return `<div class="concept-chain"><div><b>① 資源</b><span>花蓮壽豐一帶有臺灣玉原料</span></div><i>→</i><div><b>② 加工</b><span>玉器工坊顯示專業技術與分工</span></div><i>→</i><div><b>③ 交換</b><span>玉器傳到臺灣各地、澎湖與東南亞</span></div><i>→</i><div><b>④ 社會</b><span>玉飾可反映身分、儀式與審美</span></div><i>→</i><div><b>⑤ 國寶</b><span>珍貴文物成為理解史前社會的重要文化資產</span></div></div><div class="learning-map-card"><div class="map-title"><b>💚 臺灣玉的海上路線（概念圖）</b><span>不是背每一條航線，而是看「產地 ≠ 出土地」</span></div><svg class="jade-map" viewBox="0 0 700 320"><rect x="5" y="5" width="690" height="310" rx="24" class="sea-bg"/><path d="M180 20 Q225 80 205 155 Q190 220 225 300" class="coast-line"/><ellipse cx="300" cy="115" rx="24" ry="70" transform="rotate(-18 300 115)" class="taiwan-shape"/><circle cx="312" cy="125" r="7" class="jade-source"/><text x="325" y="128">花蓮玉材</text><circle cx="270" cy="205" r="6"/><text x="235" y="230">澎湖</text><path d="M315 140 Q400 190 465 230 Q540 260 620 270" class="trade-arrow"/><text x="450" y="205">菲律賓</text><text x="555" y="260">越南等東南亞</text></svg></div>`}
function inquiry5w1h(){return `<h4>🔎 長濱文化 5W1H 探究表</h4><div class="wh-grid"><div><b>Who 誰</b><span>長濱文化的人們</span></div><div><b>What 做什麼</b><span>採集、狩獵、漁撈、製作打製石器</span></div><div><b>When 何時</b><span>舊石器時代，距今數萬年至數千年前</span></div><div><b>Where 哪裡</b><span>臺灣東海岸，以臺東八仙洞等遺址最具代表性</span></div><div><b>Why 為什麼</b><span>就地利用海岸、山林與石材等自然資源</span></div><div><b>How 怎麼做</b><span>敲打石材做利器、用火加工食物與改善生活</span></div></div>`}
function museumCards(){return `<h4>🏛️ 可以真的去看的考古場館</h4><div class="museum-grid"><div><b>國立臺灣史前文化博物館／卑南遺址公園</b><span>臺東｜看卑南遺址、聚落與史前文物。</span></div><div><b>新北市立十三行博物館</b><span>八里｜認識十三行文化、煉鐵與海洋交流。</span></div><div><b>南科考古館</b><span>臺南｜從多層文化遺址看臺灣數千年生活變遷。</span></div></div>`}
function indigenousMap(){return `<div class="indigenous-map-layout"><div class="learning-map-card"><div class="map-title"><b>🗺️ 原住民族分布概念圖</b><span>地圖只畫高頻區域，不把16族塞成一團</span></div><svg class="indigenous-study-map" viewBox="0 0 360 500"><rect x="5" y="5" width="350" height="490" rx="25" class="sea-bg"/><path d="M205 35 Q280 105 265 190 Q245 275 210 365 Q185 425 135 465 Q100 390 115 310 Q130 220 150 125 Q165 60 205 35Z" class="taiwan-shape"/><g class="tribe-zone"><text x="165" y="115">泰雅／賽夏</text><text x="150" y="220">布農／邵／鄒</text><text x="148" y="330">排灣／魯凱</text><text x="220" y="180">阿美</text><text x="220" y="285">卑南</text><circle cx="300" cy="385" r="16"/><text x="278" y="420">達悟</text></g></svg></div><div class="all16"><b>目前官方認定 16 族</b><p>阿美、泰雅、排灣、布農、卑南、魯凱、鄒、賽夏、達悟（雅美）、邵、噶瑪蘭、太魯閣、撒奇萊雅、賽德克、拉阿魯哇、卡那卡那富。</p><div class="tip-chip">不用一次硬背16族；先會地區＋高頻文化線索。</div></div></div>`}
function indigenousFocusTable(){return `<div class="compare-table-wrap"><table class="study-table"><thead><tr><th>考試層級</th><th>族群</th><th>地理線索</th><th>文化／智慧線索</th><th>一句記憶</th></tr></thead><tbody><tr><td><span class="hot">必會</span></td><td>阿美族</td><td>花東海岸、縱谷</td><td>豐年祭</td><td>「東部豐年」</td></tr><tr><td><span class="hot">必會</span></td><td>達悟族</td><td>蘭嶼</td><td>飛魚季、拼板舟、海洋規範</td><td>「蘭嶼飛魚」</td></tr><tr><td><span class="hot">必會</span></td><td>邵族</td><td>日月潭</td><td>白鹿傳說</td><td>「白鹿到日月潭」</td></tr><tr><td><span class="hot">常見</span></td><td>布農族</td><td>中央山區</td><td>射耳祭、八部合音、狩獵文化</td><td>「布農射耳＋八部合音」</td></tr><tr><td><span class="hot">常見</span></td><td>泰雅族</td><td>北中部山區</td><td>gaga、織布、山林知識</td><td>「泰雅山林gaga」</td></tr><tr><td><span class="hot">常見</span></td><td>賽夏族</td><td>新竹苗栗山區</td><td>矮靈祭</td><td>「賽夏矮靈」</td></tr><tr><td><span class="hot">常見</span></td><td>排灣族</td><td>屏東、臺東南部山區</td><td>階級、家族、祭儀工藝</td><td>「南排灣階級」</td></tr></tbody></table></div>`}
function indigenousWisdom(){return `<h3>不是背祭典而已｜每個文化線索都要問「為什麼」｜近年評量常把族名、地點、祭儀與環境放在同一題</h3><div class="legend-wisdom-table"><div><b>🦌 邵族白鹿</b><span>祖先尋找新居地的文化記憶 → 看見「環境與遷徙」</span></div><div><b>🐟 達悟飛魚</b><span>季節、禁忌、分工與分享 → 看見「海洋資源管理」</span></div><div><b>🏹 布農射耳</b><span>狩獵技巧與長幼傳承 → 看見「知識教育」</span></div><div><b>🌾 阿美豐年</b><span>收穫、年齡階級、部落凝聚 → 看見「共同生活」</span></div></div><div class="wisdom-grid"><div><b>🐟 飛魚季規範</b><span>依季節捕撈、不同階段有禁忌與分工。→ 讓海洋資源與文化秩序能延續。</span></div><div><b>🏹 狩獵禁忌</b><span>依季節、物種、地區或部落規範行動。→ 不是想打多少就打多少。</span></div><div><b>🤝 共享互助</b><span>獵物、漁獲或祭儀中的分享，維持親族與部落互助網絡。</span></div><div><b>🗣️ 口述傳承</b><span>故事、祭典、歌謠、長者教導把環境知識傳給下一代。</span></div><div><b>🏘️ 共同事務</b><span>依族群制度，由頭目、長老、祭司、年齡階級或部落會議等共同處理。</span></div><div><b>🌱 永續不是新名詞</b><span>許多傳統規範早就包含「依時取用、保留資源、共同遵守」的精神。</span></div></div><div class="memory-line"><b>記憶公式：</b>環境 → 規範 → 行動 → 分享／傳承 → 資源延續。</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext">我懂文化背後的原因 → 找證據</button></div>`}
function renderUnit1RichStage(id,stage){
 if(id==='1-1'&&stage===1){lessonShell(id,1,lesson11Stage1());bindSelectActivity('world');bindSelectActivity('east');$('#stageNext').onclick=()=>{completeStage(id,1);openLesson(id,2)};return true}
 if(id==='1-1'&&stage===2){lessonShell(id,2,lesson11Stage2());bindSelectActivity('mapchallenge',8);const old=document.querySelector('[data-check-fill="mapchallenge"]');if(old){const fn=old.onclick;old.onclick=()=>{fn();const sels=$$('[data-fill-group="mapchallenge"]');const good=sels.filter(x=>x.value===x.dataset.fillAnswer).length;if(good>=8){completeStage(id,2);$('#stageNext').disabled=false}}}$('#stagePrev').onclick=()=>openLesson(id,1);$('#stageNext').onclick=()=>openLesson(id,3);return true}
 if(id==='1-1'&&stage===3){lessonShell(id,3,climateCards());$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>{completeStage(id,3);openLesson(id,4)};return true}
 if(id==='1-1'&&stage===4){const l=lessons[id],evs=shuffled(l.evidence);lessonShell(id,4,`<h3>證據題｜黑面琵鷺為什麼會來臺灣？</h3><div class="reading-box"><b>資料</b><p>黑面琵鷺每年秋冬沿東亞遷徙路線南下，臺灣西南沿海的濕地、潟湖與友善魚塭有淺水、魚蝦等食物，也有適合休息的空間，因此成為全球重要度冬地之一。保育不只是「不准人靠近」，也可透過棲地保護、友善魚塭與生態教育兼顧人與鳥。</p></div><p class="question-line"><b>主張：</b>${l.claim}${speechBtn(l.claim,'朗讀題目')}</p>${evs.map((x,i)=>`<button class="evidence-choice" data-correct="${x[2]?'1':'0'}"><span>${String.fromCharCode(65+i)}</span>${x[1]}</button>`).join('')}<p id="evidenceFeedback" class="feedback"></p><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext" disabled>下一關</button></div>`);setupEvidence(id);$('#stagePrev').onclick=()=>openLesson(id,3);return true}
 if(id==='1-2'&&stage===1){lessonShell(id,1,`<h3>第二課｜先拉出史前時間軸</h3><div class="definition-card"><b>什麼叫「史前時代」？</b><span>不是「沒有歷史」，而是缺少可以直接閱讀的文字紀錄，所以要靠考古證據重建生活。</span><div class="artifact-pair"><span><strong>遺物</strong>：石器、陶器、玉器等可以被發現與移動的物品</span><span><strong>遺跡</strong>：住屋、墓葬、聚落、文化層等人類活動留下的位置與痕跡</span></div></div><p>先看三大時代，再把代表文化放進去。年代都用「約」來理解。</p>${archaeologyTimeline()}${archaeologyCompare()}<div class="stage-actions"><button class="primary-btn" id="stageNext">我看懂時代差異 → 配對</button></div>`);$('#stageNext').onclick=()=>{completeStage(id,1);openLesson(id,2)};return true}
 if(id==='1-2'&&stage===3){lessonShell(id,3,`<h3>從「活下來」到「交換網」</h3><p>生產力增加後，不只吃得比較穩定，也會改變聚落、分工與交換。</p>${jadeTrade()}<div class="exam-focus"><b>💡 這段真正要懂什麼？</b><span>不是只背「臺灣玉很漂亮」。玉材產地、加工工坊、遠地出土與國寶文物合在一起，能證明史前人已出現專業分工、交換網、身分／儀式意義與海上交流。</span></div>${inquiry5w1h()}${museumCards()}<div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext">我能說出因果鏈 → 找證據</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>{completeStage(id,3);openLesson(id,4)};return true}
 if(id==='1-3'&&stage===1){lessonShell(id,1,`<h3>第三課｜先看分布，再抓高頻文化線索</h3><p>16族全部認識，但考前先掌握下表7個高頻焦點，避免一次背到混亂。</p>${indigenousMap()}${indigenousFocusTable()}<details class="exam-archive"><summary>📚 近5年公開評量曾出現的族群辨識（展開複習）</summary><div class="archive-chips"><span>泰雅族 → 紋面／織布</span><span>布農族 → 八部合音</span><span>排灣族 → 百步蛇文化線索</span><span>阿美族 → 豐年祭</span><span>賽夏族 → 矮靈祭</span><span>卑南族 → 少年祭儀線索</span><span>魯凱族 → 巴冷公主傳說</span><span>達悟族 → 飛魚規範</span></div><p>這裡是「考古題曾出現／常見辨識」補充，不要求一次背完；先把地點與核心生活智慧理解好。</p></details><div class="exam-focus"><b>🧠 近年考題怎麼出？</b><span>公開評量可見「族名—祭儀／傳說」配對、自然禁忌、分布地圖等題型。不要背孤立配對，要多加一個地點：東部阿美豐年、蘭嶼達悟飛魚、日月潭邵族白鹿、中央山布農射耳。</span></div><div class="stage-actions"><button class="primary-btn" id="stageNext">我抓到高頻焦點 → 配對</button></div>`);$('#stageNext').onclick=()=>{completeStage(id,1);openLesson(id,2)};return true}
 if(id==='1-3'&&stage===3){lessonShell(id,3,indigenousWisdom());$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>{completeStage(id,3);openLesson(id,4)};return true}
 return false
}
const unit1ReviewPools={
 '1-1':[
  {id:'world-asia',q:'臺灣在五大洲中的哪一洲？',opts:['亞洲','歐洲','非洲','美洲'],a:0,tip:'臺灣位於亞洲東側。'},
  {id:'pacific',q:'臺灣東側面向哪一個大洋？',opts:['太平洋','印度洋','大西洋','北冰洋'],a:0,tip:'臺灣東側是太平洋。'},
  {id:'strait',q:'臺灣本島西側的重要海域是？',opts:['臺灣海峽','巴士海峽','東海','南海'],a:0,tip:'西海峽。'},
  {id:'bashi',q:'臺灣本島南方、往菲律賓方向的重要海域是？',opts:['巴士海峽','臺灣海峽','日本海','大西洋'],a:0,tip:'南巴士。'},
  {id:'area',q:'課堂上通常把臺灣地區面積約記成？',opts:['約3.6萬平方公里','約360平方公里','約36萬平方公里','約360萬平方公里'],a:0,tip:'記約3.6萬平方公里。'},
  {id:'islands',q:'哪一組都是臺灣周邊常見離島？',opts:['澎湖、金門、馬祖','北海道、濟州、呂宋','峇里、宿霧、關島','香港、新加坡、澳門'],a:0,tip:'澎湖、金門、馬祖是高頻地圖題。'},
  {id:'monsoon',q:'冬季臺灣常受到哪個季風影響？',opts:['東北季風','西南季風','東南季風','西北季風'],a:0,tip:'冬東北、夏西南。'},
  {id:'penghu',q:'澎湖菜宅用石牆圍住農地，主要是為了？',opts:['減弱強風、保護作物','阻擋積雪','防火山熔岩','增加沙漠水源'],a:0,tip:'澎湖冬季風強。'},
  {id:'aquaculture',q:'嘉義、臺南沿海常見魚塭養殖，最能說明哪個觀念？',opts:['人們會利用沿海水域與氣候條件發展地方產業','所有沿海地區只能種稻米','養殖業完全不受水溫影響','只有高山才適合養殖'],a:0,tip:'沿海地形、水域、氣候與管理方式共同影響養殖發展。'},
  {id:'fish',q:'「夏鮪、冬烏」中的「冬烏」是？',opts:['烏魚','烏賊','黑鮪魚','虱目魚'],a:0,tip:'冬季西部常見烏魚洄游。'},
  {id:'spoonbill',q:'黑面琵鷺秋冬常利用臺灣哪類環境停棲、覓食或度冬？',opts:['西南沿海濕地與魚塭','高山雪地','都市地下街','中央山脈山頂'],a:0,tip:'西南沿海濕地是重要度冬地。'}
 ],
 '1-2':[
  {id:'prehistory',q:'「史前時代」最適合的解釋是？',opts:['缺少可直接閱讀的文字紀錄，主要靠考古證據研究','完全沒有人類活動','只有恐龍的年代','沒有任何工具'],a:0,tip:'史前不是沒有歷史。'},
  {id:'relic',q:'石器、陶器、玉器較屬於哪一類考古證據？',opts:['遺物','遺跡','氣候','地名'],a:0,tip:'可移動的物品是遺物。'},
  {id:'longbin',q:'長濱文化最具代表性的工具線索是？',opts:['打製石器','大量鐵器','蒸汽機','玻璃工廠'],a:0,tip:'長濱文化是舊石器重要代表。'},
  {id:'neo',q:'新石器時代比舊石器更明顯的新變化是？',opts:['農業、磨製石器與陶器','完全不使用工具','只有鐵器','現代文字'],a:0,tip:'農業與磨製技術是核心差異。'},
  {id:'peinan',q:'卑南文化常見哪一組生活線索？',opts:['農業、大型聚落、石板棺與玉器','只有打製石器且沒有定居','歐洲城堡','高速鐵路'],a:0,tip:'卑南屬新石器晚期重要代表。'},
  {id:'shihsan',q:'十三行文化最常用哪個線索辨認？',opts:['鐵器與煉鐵','只有打製石器','完全沒有農業','沒有交換'],a:0,tip:'十三行是金屬器時代代表。'},
  {id:'jade-source',q:'臺灣玉的重要原料來源常指向？',opts:['花蓮壽豐一帶','臺北盆地','澎湖玄武岩','金門花崗岩'],a:0,tip:'花蓮壽豐豐田一帶是重要玉材來源。'},
  {id:'jade-trade',q:'臺灣玉器在菲律賓、越南等遠地出土，最能支持？',opts:['史前已有跨海交換與航海網絡','玉會自己移動','沒有分工','所有玉都產在東南亞'],a:0,tip:'產地和出土地相距很遠。'},
  {id:'shisanhang-trade',q:'十三行遺址出現外來陶器、錢幣、玻璃珠等物品，最合理的推論是？',opts:['當時存在島內外交換與交流','所有物品都在同一戶製造','居民完全與外界隔絕','只有打獵沒有其他活動'],a:0,tip:'外地物品出現在遺址，是交流與交換的重要線索。'},
  {id:'5w1h',q:'5W1H中的「How」最適合問哪一題？',opts:['長濱人如何利用石材製作工具？','長濱文化在哪裡？','長濱人是誰？','長濱文化何時？'],a:0,tip:'How 問方法與過程。'},
  {id:'museum',q:'想實地認識十三行文化，最適合去哪裡？',opts:['新北市立十三行博物館','故宮南院','海生館','天文館'],a:0,tip:'十三行博物館位於新北八里。'}
 ],
 '1-3':[
  {id:'16',q:'目前政府認定的臺灣原住民族共有？',opts:['16族','9族','20族','36族'],a:0,tip:'目前官方認定16族。'},
  {id:'amis',q:'哪一組最適合阿美族？',opts:['東部海岸／縱谷—豐年祭','蘭嶼—飛魚文化','日月潭—白鹿傳說','苗栗山區—矮靈祭'],a:0,tip:'阿美族常和東部、豐年祭配對。'},
  {id:'tao',q:'蘭嶼與飛魚文化最常和哪一族相連？',opts:['達悟族','邵族','賽夏族','阿美族'],a:0,tip:'蘭嶼達悟飛魚。'},
  {id:'thao',q:'日月潭白鹿傳說常和哪一族相連？',opts:['邵族','布農族','泰雅族','排灣族'],a:0,tip:'邵族—日月潭—白鹿。'},
  {id:'bunun',q:'布農族常見的祭儀／文化線索是？',opts:['射耳祭、八部合音','飛魚季','矮靈祭','白鹿傳說'],a:0,tip:'布農射耳，也常見八部合音。'},
  {id:'saisiyat',q:'賽夏族常見的祭儀考點是？',opts:['矮靈祭','射耳祭','豐年祭','飛魚季'],a:0,tip:'賽夏—矮靈祭。'},
  {id:'atayal',q:'泰雅族的gaga較接近哪種概念？',opts:['規範生活、倫理與祭儀的傳統法則／價值系統','一種魚名','一種交通工具','荷蘭城堡'],a:0,tip:'gaga是泰雅族重要規範概念。'},
  {id:'hunting',q:'打獵禁忌若限制繁殖季、幼獸或某些區域，可能有何功能？',opts:['讓野生動物有繁衍機會，避免資源耗盡','鼓勵一次捕光','完全沒有作用','只為裝飾'],a:0,tip:'傳統規範可能兼具資源永續功能。'},
  {id:'sharing',q:'獵物、漁獲或祭儀中的共享互助，較能表現？',opts:['部落社會的互助與共同生活','每個人完全互不往來','沒有社會規範','只重視個人利益'],a:0,tip:'共享能維持親族與部落互助網絡。'},
  {id:'culture-env',q:'學習原住民族生活智慧最重要的是理解？',opts:['文化規範常和環境、資源、互助及族群歷史一起形成','只背服裝顏色','所有族群都完全一樣','文化只存在古代'],a:0,tip:'重點是文化與環境的關聯。'}
 ]
};
function openUnit1Review(){const qs=['1-1','1-2','1-3'].flatMap(id=>shuffled(unit1ReviewPools[id]).slice(0,5));$('#missionContent').innerHTML=`<div class="unit-title"><span class="pill">第一單元總複習</span><h2>15題抽考｜每課固定5題</h2><p>第一課、第二課、第三課各抽5題，避免只抽到某一課。答錯會送進弱點救援。</p></div><div id="unit1ReviewBox">${qs.map((q,i)=>`<div class="review-q" data-review="${q.id}"><div class="question-line"><b>${i+1}. ${q.q}</b>${speechBtn(q.q,'朗讀題目')}</div>${shuffled(q.opts.map((o,j)=>({o,j}))).map(z=>`<label><input type="radio" name="u1r${i}" value="${z.j}"> ${z.o}</label>`).join('')}<p class="review-answer" id="u1rf${i}"></p></div>`).join('')}<button class="primary-btn" id="gradeUnit1Review">交卷</button><p class="feedback" id="unit1ReviewFeedback"></p></div>`;$('#missionDialog').showModal();$('#gradeUnit1Review').onclick=()=>{let score=0;qs.forEach((q,i)=>{const x=document.querySelector(`input[name="u1r${i}"]:checked`),ok=x&&Number(x.value)===q.a;if(ok){score++;clearWrong(`u1review-${q.id}`);$(`#u1rf${i}`).textContent='✓ 答對'}else{addWrong(`u1review-${q.id}`,q.id.startsWith('world')||['pacific','strait','bashi','area','islands','monsoon','penghu','aquaculture','fish','spoonbill'].includes(q.id)?'1-1':unit1ReviewPools['1-2'].some(z=>z.id===q.id)?'1-2':'1-3',q.q,q.tip,'quiz');$(`#u1rf${i}`).textContent=`提示：${q.tip}`}});const pct=Math.round(score/qs.length*100);$('#unit1ReviewFeedback').textContent=`答對 ${score}/${qs.length}（${pct}分）${pct>=80?' 🎉 第一單元核心很穩！':'。錯題已送到救援；先補洞，再重抽一次。'}`;if(pct>=80){state.stars+=10;saveState();renderState()}}}

function openUnit(n){
 const u=units[n];const lessonCards=u.lessons.map(id=>{const l=lessons[id],ready=availableLessons.includes(id),done=state.completedLessons.includes(id);return `<div class="lesson-card ${done?'lesson-done':''}"><div class="lesson-line"><b>${done?'✓ ':''}${lessonOrdinal(id)}｜${l?.title||previewTitle(id)}</b><span>${ready?(done?'已完成，可以再複習':'六關已開放'):'準備中'}</span></div>${ready?`<button class="secondary-btn" data-open-lesson="${id}">${done?'再複習':'開始這一課'}</button>`:''}</div>`}).join('');
 $('#unitContent').innerHTML=`<div class="unit-title"><span class="pill">${u.theme} 第 ${n} 單元</span><h2>${u.title}</h2><p>${u.subtitle}</p></div><div class="six-steps">${stages.map(s=>`<span>${s.icon} ${s.name}</span>`).join('')}</div><div class="lesson-list">${lessonCards}</div>${n===1?`<div class="checkpoint-mini unit1-review-card"><b>🧠 第一單元總複習</b><span>地圖、史前、原住民族混合抽15題，考前可重複練。</span><button class="primary-btn" id="unit1ReviewBtn">開始第一單元總複習</button></div>`:''}${n===2?`<div class="checkpoint-mini"><b>★ 第一次段考檢核點</b><span>第一、二單元完成後很適合挑戰；A、B 卷都可直接預覽。</span><button class="primary-btn" id="unitExamBtn">打開 A / B 卷</button></div>`:''}<p class="source-note">內容依翰林版五上公開課程架構與學習目標重新設計，不重製課本全文。</p>`;
 $('#unitDialog').showModal();$$('[data-open-lesson]').forEach(b=>b.onclick=()=>{$('#unitDialog').close();openLesson(b.dataset.openLesson)});const rb=$('#unit1ReviewBtn');if(rb)rb.onclick=()=>{$('#unitDialog').close();openUnit1Review()};const eb=$('#unitExamBtn');if(eb)eb.onclick=()=>{$('#unitDialog').close();openExamHub()}
}
function previewTitle(id){const m={'3-1':'早期移民如何在臺灣建立家園？','3-2':'開港通商為什麼改變了臺灣的發展？','4-1':'人們如何適應不同地形創造所需？','4-2':'沿海的利用為什麼呈現多元發展？','4-3':'土地開發與環境保護該如何抉擇？','5-1':'選一個我想研究的問題','5-2':'找可靠資料','5-3':'整理成我的臺灣小書'};return m[id]||id}
$$('[data-open-unit]').forEach(b=>b.onclick=()=>openUnit(Number(b.dataset.openUnit)));

function lessonShell(id,stage,body){const l=lessons[id];const stageSpeech=`${l.title}。${cleanSpeechText(body)}`;$('#lessonContent').innerHTML=`<div class="lesson-header"><span class="pill">${lessonUnitLabel(id)}・${lessonOrdinal(id)}</span><div class="read-row"><h2>${l.title}</h2>${speechBtn(stageSpeech,'朗讀本頁')}</div><p class="muted">一次只走一小關。現在只看第 ${stage} 關。</p></div><div class="stage-tabs">${stages.map((s,i)=>`<button class="stage-tab ${i+1===stage?'active':''} ${stagesFor(id).includes(i+1)?'done':''}" data-stage="${i+1}">${s.icon} ${s.name}</button>`).join('')}</div><section class="stage-panel">${body}</section><p class="source-note">這一課依公開課程計畫的學習重點重新編寫；重點放在理解關聯、讀證據與做判斷。</p>`;$$('[data-stage]').forEach(b=>b.onclick=()=>openLesson(id,Number(b.dataset.stage)))}
function openLesson(id,stage=null){const l=lessons[id];if(!l){openUnit(Number(id[0]));return}$('#lessonDialog').showModal();const n=stage||Math.min(6,stagesFor(id).length+1);renderLessonStage(id,n)}
function renderLessonStage(id,stage){const l=lessons[id];if(renderUnit1RichStage(id,stage))return;if(stage===1){const allFacts=[...l.facts,...(lessonExtras[id]||[])];lessonShell(id,1,`<h3>先看懂畫面</h3><p>${l.intro}</p>${l.visual()}<h4 class="focus-title">這課要掌握的 ${allFacts.length} 個重點</h4><div class="fact-grid">${allFacts.map(x=>`<div class="fact-card"><div class="fact-top"><b>${x[0]}</b>${speechBtn(`${x[0]}。${x[1]}`,'朗讀這個重點')}</div><span>${x[1]}</span></div>`).join('')}</div><div class="exam-focus"><b>🎯 考前怎麼讀？</b><span>不要只背名詞，請練習說出「原因 → 證據 → 影響」。</span></div><div class="stage-actions"><button class="primary-btn" id="stageNext">看懂了 → 下一關</button></div>`);$('#stageNext').onclick=()=>{completeStage(id,1);openLesson(id,2)}}
 if(stage===2){const shuffled=[...l.pairs].sort((a,b)=>a[1].localeCompare(b[1])).reverse();lessonShell(id,2,`<h3>配對：把線索和意思接起來</h3><p>先點左邊，再點右邊。答錯只給提示，不扣星星。</p><div class="match-board"><div class="match-column">${l.pairs.map((x,i)=>`<button data-left="${i}">${x[0]}</button>`).join('')}</div><div class="match-column">${shuffled.map(x=>`<button data-right="${l.pairs.findIndex(p=>p[0]===x[0])}">${x[1]}</button>`).join('')}</div></div><p class="feedback" id="matchFeedback">完成 ${l.pairs.length} 組就過關。</p><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext" disabled>下一關</button></div>`);setupMatch(id);$('#stagePrev').onclick=()=>openLesson(id,1)}
 if(stage===3){lessonShell(id,3,`<h3>把四個重點串成一個故事</h3><p>社會不是零散名詞。看懂「前因 → 過程 → 影響」，比較不容易忘。</p><div class="story-strip">${l.story.map(x=>`<div class="story-card"><span class="emoji">${x[0]}</span><b>${x[1]}</b><span>${x[2]}</span></div>`).join('')}</div><div class="memory-line"><b>一句話記憶：</b>${l.story.map(x=>x[1]).join(' → ')}</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext">我能說出故事了</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>{completeStage(id,3);openLesson(id,4)}}
 if(stage===4){const evs=shuffled(l.evidence);lessonShell(id,4,`<h3>找證據，不被「看起來很像」騙走</h3><p class="question-line"><b>主張：</b>${l.claim}${speechBtn(l.claim,'朗讀題目')}</p>${evs.map((x,i)=>`<button class="evidence-choice" data-correct="${x[2]?'1':'0'}"><span>${String.fromCharCode(65+i)}</span>${x[1]}</button>`).join('')}<p id="evidenceFeedback" class="feedback"></p><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext" disabled>下一關</button></div>`);setupEvidence(id);$('#stagePrev').onclick=()=>openLesson(id,3)}
 if(stage===5)renderQuizStage(id);
 if(stage===6)renderRescueStage(id);
}
function setupMatch(id){const l=lessons[id];let left=null,done=new Set();$$('[data-left]').forEach(b=>b.onclick=()=>{$$('[data-left]').forEach(x=>x.classList.remove('selected'));left=b;b.classList.add('selected')});$$('[data-right]').forEach(b=>b.onclick=()=>{if(!left){$('#matchFeedback').textContent='先從左邊選一張線索。';return}const ok=left.dataset.left===b.dataset.right;if(ok){left.disabled=true;b.disabled=true;left.classList.add('correct');b.classList.add('correct');done.add(b.dataset.right);left=null;$('#matchFeedback').textContent=`答對 ${done.size}/${l.pairs.length} 組！`;clearWrong(`match-${id}`);if(done.size===l.pairs.length){completeStage(id,2);$('#stageNext').disabled=false}}else{$('#matchFeedback').textContent='還沒接對。想想兩邊是不是「直接關聯」。';addWrong(`match-${id}`,id,`${id} 的線索配對還容易混`,l.pairs[Number(left.dataset.left)][1],'activity')}});$('#stageNext').onclick=()=>openLesson(id,3)}
function setupEvidence(id){const l=lessons[id];$$('[data-correct]').forEach(b=>b.onclick=()=>{const ok=b.dataset.correct==='1';$$('[data-correct]').forEach(z=>z.classList.remove('correct','wrong'));b.classList.add(ok?'correct':'wrong');if(ok){$('#evidenceFeedback').textContent='對！這個證據最直接支持題目的主張。';$('#stageNext').disabled=false;completeStage(id,4);clearWrong(`evidence-${id}`)}else{$('#evidenceFeedback').textContent='這句可能有資訊，但沒有直接支持題目的主張。';addWrong(`evidence-${id}`,id,`${id} 找證據時還會被旁支資訊吸引`,'先把題目的關鍵詞圈起來，再找直接談到同一件事的證據。','evidence')}});$('#stageNext').onclick=()=>openLesson(id,5)}
function renderQuizStage(id){const l=lessons[id],answers={};lessonShell(id,5,`<h3>${l.quiz.length}題小闖關</h3><p>目標是答對 80%。答錯會自動進入救援，不用整課重做。</p><div id="quizBox">${l.quiz.map((x,i)=>`<div class="quiz-q" data-q="${i}"><h4 class="question-line"><span>${i+1}. ${x[0]}</span>${speechBtn(x[0],'朗讀題目')}</h4><div class="quiz-options">${shuffled(x[1].map((o,j)=>({o,j}))).map(z=>`<button data-opt="${z.j}">${z.o}</button>`).join('')}</div><p class="feedback"></p></div>`).join('')}</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="finishQuiz" disabled>看成績</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,4);$$('.quiz-q').forEach(qel=>{const qi=Number(qel.dataset.q),q=l.quiz[qi];qel.querySelectorAll('[data-opt]').forEach(btn=>btn.onclick=()=>{answers[qi]=Number(btn.dataset.opt);qel.querySelectorAll('[data-opt]').forEach(x=>x.classList.remove('correct','wrong'));const ok=answers[qi]===q[2];btn.classList.add(ok?'correct':'wrong');qel.querySelector('.feedback').textContent=ok?'答對！':`提示：${q[3]}`;const wid=`quiz-${id}-${qi}`;if(ok)clearWrong(wid);else addWrong(wid,id,q[0],q[3],'quiz');if(Object.keys(answers).length===l.quiz.length)$('#finishQuiz').disabled=false})});$('#finishQuiz').onclick=()=>{const score=l.quiz.filter((x,i)=>answers[i]===x[2]).length;state.lessonQuizBest[id]=Math.max(state.lessonQuizBest[id]||0,score);if(score>=Math.ceil(l.quiz.length*0.8)){completeStage(id,5);if(score===l.quiz.length)unlockAchievement('perfect_quiz')}saveState();renderState();$('#finishQuiz').textContent=`答對 ${score}/${l.quiz.length} → 去救援`;setTimeout(()=>openLesson(id,6),350)}}
function renderRescueStage(id){const l=lessons[id],wrongs=state.wrongBank.filter(w=>w.lesson===id);const best=state.lessonQuizBest[id]||0;lessonShell(id,6,`<h3>${wrongs.length?'只救真的卡住的地方':'太棒了，這課暫時沒有錯點'}</h3><p>${best>=Math.ceil(l.quiz.length*0.8)?'你的小闖關已達標。':'小闖關最佳 '+best+'/'+l.quiz.length+'；先看提示，再回去挑戰會更容易。'}</p><div class="rescue-list">${wrongs.slice(0,6).map(w=>`<div class="rescue-item"><b>${escapeHtml(w.label)}</b><p>${escapeHtml(w.tip)}</p>${w.kind==='quiz'?`<button class="secondary-btn" data-retry-quiz>回第 5 關重試</button>`:w.kind==='evidence'?`<button class="secondary-btn" data-retry-evidence>回第 4 關再找一次</button>`:`<button class="secondary-btn" data-clear="${w.id}">我重新想懂了</button>`}</div>`).join('')}</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 回闖關</button><button class="primary-btn" id="finishLesson">${best>=Math.ceil(l.quiz.length*0.8)?'完成這一課':'先回去達成 80%'}</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,5);$$('[data-retry-quiz]').forEach(b=>b.onclick=()=>openLesson(id,5));$$('[data-retry-evidence]').forEach(b=>b.onclick=()=>openLesson(id,4));$$('[data-clear]').forEach(b=>b.onclick=()=>{clearWrong(b.dataset.clear);renderRescueStage(id)});$('#finishLesson').onclick=()=>{if((state.lessonQuizBest[id]||0)<Math.ceil(l.quiz.length*0.8)){showToast('先回第 5 關，答對至少 80% 就能完成。');openLesson(id,5);return}completeStage(id,6);completeLesson(id);$('#lessonDialog').close();showToast(`完成 ${id}！下一站已更新。`)}}


const EXAM_MINUTES=40;
const examMapContext=`<div class="exam-visual"><svg viewBox="0 0 680 350" role="img" aria-label="東亞位置題示意圖"><rect x="5" y="5" width="670" height="340" rx="22" class="sea-bg"/><path d="M25 20 H320 Q290 100 315 180 Q285 260 230 335 H25Z" class="land-shape"/><path d="M500 45 q35 35 12 80 q-18 35 8 75" class="island-chain"/><path d="M455 270 q35 -20 65 10 l18 55 h-100z" class="land-shape"/><ellipse cx="385" cy="215" rx="14" ry="39" transform="rotate(-18 385 215)" class="taiwan-shape"/><g class="map-number"><circle cx="280" cy="205" r="17"/><text x="280" y="211">甲</text><circle cx="390" cy="295" r="17"/><text x="390" y="301">乙</text><circle cx="540" cy="205" r="17"/><text x="540" y="211">丙</text><circle cx="500" cy="95" r="17"/><text x="500" y="101">丁</text></g><text x="363" y="260" class="taiwan-label">臺灣</text></svg><p class="source-note">圖中甲、乙、丙、丁分別標示臺灣周邊海域或鄰近方向，請依相對位置判讀。</p></div>`;
const examPrehistoryContext=`<div class="exam-visual"><div class="mini-timeline"><div><b>距今約5萬～5千年前</b><span>長濱文化｜打製石器</span></div><i>→</i><div><b>約3500～2000年前</b><span>卑南文化｜農業、聚落、玉器</span></div><i>→</i><div><b>約2000～400年前</b><span>十三行文化｜鐵器、交換</span></div></div><p class="source-note">年代為翰林課程常用約數，重點在先後與生活變化。</p></div>`;
const examData={
 A:{title:'第一次段考模擬 A 卷',subtitle:'第一、二單元｜地圖、史前、文化與大航海混合',sections:[
  {type:'tf',name:'一、是非題｜16分',qs:[
   {q:'臺灣位在亞洲東側、太平洋西側，這種位置有利於海上交通與東亞交流。',a:true,p:2,tip:'先定位亞洲與太平洋。'},
   {q:'冬季東北季風和夏季西南季風的風向與水氣來源不同，因此各地降雨與生活安排可能不同。',a:true,p:2,tip:'季風會帶來季節性的風雨差異。'},
   {q:'冬季臺灣西部的烏魚洄游、夏季東部的鮪魚漁獲，都和洋流及季節變化有關。',a:true,p:2,tip:'記「夏鮪、冬烏」。'},
   {q:'黑面琵鷺全年都固定住在臺灣高山，不會進行季節遷徙。',a:false,p:2,tip:'黑面琵鷺是重要冬候鳥。'},
   {q:'史前時代缺少可直接閱讀的文字紀錄，所以考古學家會利用遺址、文化層和器物推論生活。',a:true,p:2,tip:'史前不等於無法研究。'},
   {q:'臺灣玉只在花蓮出土，從未出現在臺灣其他地區或東南亞。',a:false,p:2,tip:'遠地出土正是交換的重要證據。'},
   {q:'1624年後荷蘭勢力以南臺灣為重要據點，1626年後西班牙勢力主要在北臺灣活動。',a:true,p:2,tip:'荷蘭南、西班牙北。'},
   {q:'大航海時代對臺灣只有戰爭影響，沒有貿易、宗教、移民或文化資產等其他影響。',a:false,p:2,tip:'影響是多面向的。'}]},
  {type:'mcq',name:'二、選擇題｜24分',qs:[
   {q:'下列哪一組「方向—地理名稱」正確？',opts:['西—臺灣海峽；南—巴士海峽','西—太平洋；南—日本海','東—臺灣海峽；北—巴士海峽','南—大西洋；東—印度洋'],a:0,p:3,tip:'口訣：西海峽、南巴士、東太平。'},
   {q:'澎湖菜宅以石牆圍住農地，最主要是在適應哪一項環境條件？',opts:['強勁季風與鹽風','終年積雪','火山熔岩','沙漠缺水'],a:0,p:3,tip:'澎湖冬季風強。'},
   {q:'從長濱文化到卑南、十三行文化，哪個變化最合理？',opts:['工具效率提高，農業、定居、分工與交換逐漸增加','人們逐漸不使用任何工具','食物來源一定愈來愈不穩定','所有聚落都消失'],a:0,p:3,tip:'工具進步會連動生產力與社會組織。'},
   {q:'臺灣玉在菲律賓、越南等地出土，最能支持哪個推論？',opts:['史前已有跨海交換與航海網絡','玉器會自行漂流到固定遺址','所有玉都產在東南亞','史前人完全沒有分工'],a:0,p:3,tip:'看產地與出土地的距離。'},
   {q:'哪一組族群與文化線索正確？',opts:['達悟族—蘭嶼—飛魚文化','邵族—蘭嶼—飛魚文化','布農族—日月潭—白鹿傳說','賽夏族—東部海岸—豐年祭'],a:0,p:3,tip:'蘭嶼達悟飛魚。'},
   {q:'17世紀歐洲勢力重視臺灣的一項重要原因是？',opts:['位在東亞海上航路與貿易網附近','臺灣已有高速鐵路','歐洲完全停止海外貿易','臺灣位在大西洋中央'],a:0,p:3,tip:'把第一課的位置與第二單元連起來。'},
   {q:'1642年後北臺灣西班牙勢力的變化是？',opts:['西班牙離臺，荷蘭勢力擴大','西班牙統治全臺','清帝國立即建省','鄭氏政權立刻消失'],a:0,p:3,tip:'1626來、1642離。'},
   {q:'鄭氏經營臺灣的敘述何者較完整？',opts:['持續海上貿易，也推動開墾、教育與制度','完全停止海外往來','只發展北極航線','禁止任何移民'],a:0,p:3,tip:'鄭氏不只軍事，也有經營與建設。'}]},
  {type:'fill',name:'三、填充題｜8分',qs:[
   {q:'臺灣本島西側的重要海域叫做＿＿＿＿。',answers:['臺灣海峽','台湾海峡'],p:2,tip:'西側海域。'},
   {q:'臺灣本島南方、往菲律賓方向的重要海域叫做＿＿＿＿。',answers:['巴士海峽','巴士海峡'],p:2,tip:'南方海域。'},
   {q:'金屬器時代、會使用鐵器的重要代表文化是＿＿＿＿文化。',answers:['十三行','十三行文化'],p:2,tip:'新北八里的重要考古文化。'},
   {q:'1624年起主要在南臺灣建立據點的歐洲國家是＿＿＿＿。',answers:['荷蘭','荷蘭人'],p:2,tip:'荷蘭南、西班牙北。'}]},
  {type:'match',name:'四、配合題｜12分',choices:['新埔柿餅','澎湖菜宅','達悟族飛魚文化','布農族射耳祭'],qs:[
   {q:'利用秋冬乾燥風進行地方農產加工',a:'新埔柿餅',p:3,tip:'新竹新埔常用秋冬乾風曬柿餅。'},
   {q:'用石牆降低強風對農作的影響',a:'澎湖菜宅',p:3,tip:'強風地區的農業智慧。'},
   {q:'蘭嶼海洋生活、捕撈時序與禁忌',a:'達悟族飛魚文化',p:3,tip:'蘭嶼達悟飛魚。'},
   {q:'中央山區族群的狩獵與教育祭儀',a:'布農族射耳祭',p:3,tip:'布農射耳。'}]},
  {type:'group',name:'五、閱讀素養題組｜20分',context:'17世紀時，歐洲商船希望在中國、日本、東南亞之間進行貿易。荷蘭與西班牙先後在臺灣南、北部建立據點；後來鄭氏政權也利用海上交通持續貿易並招募漢人來臺開墾。老師要同學不要只背年代，而要用「位置—行動—影響」解釋。',qs:[
   {q:'歐洲勢力選擇臺灣建立據點，最能用哪個條件解釋？',opts:['臺灣位在東亞海上交通與貿易網附近','臺灣有現代機場','臺灣位在歐洲中心','臺灣完全沒有居民'],a:0,p:4,tip:'先看區域海路位置。'},
   {q:'荷蘭與西班牙分別在南、北臺灣活動，最適合搭配哪種資料理解？',opts:['臺灣地圖與港灣位置','只有人物照片','只有現代人口數','只有氣溫表'],a:0,p:4,tip:'空間問題優先看地圖。'},
   {q:'鄭氏招募漢人開墾，最可能帶來哪項變化？',opts:['人口與土地利用增加，漢人社會規模擴大','所有農地消失','臺灣完全停止貿易','史前文化重新開始'],a:0,p:4,tip:'移民與開墾會改變人口與土地。'},
   {q:'如果要證明「大航海時代帶來文化接觸」，哪種證據較有力？',opts:['城堡、教會活動、歷史文件與不同族群往來資料','今天的電視節目','一張沒有年代的自拍照','只有自己的感覺'],a:0,p:4,tip:'要選能直接連到當時的歷史證據。'},
   {q:'這段資料最主要想說明？',opts:['地理位置會影響人群交流，進而改變臺灣歷史','臺灣位置和歷史完全無關','所有變化只由氣溫造成','只要背年份就能理解歷史'],a:0,p:4,tip:'位置→交流→歷史發展。'}]},
  {type:'data',name:'六、地圖判讀｜10分',context:examMapContext,qs:[
   {q:'圖中「甲」位在臺灣西側，最可能是哪個海域？',opts:['臺灣海峽','巴士海峽','太平洋','大西洋'],a:0,p:5,tip:'臺灣西側是臺灣海峽。'},
   {q:'圖中「乙」位在臺灣南方，往哪一個國家方向較接近？',opts:['菲律賓','韓國','加拿大','法國'],a:0,p:5,tip:'臺灣南方隔巴士海峽接近菲律賓。'}]},
  {type:'short',name:'七、簡答題｜10分',qs:[
   {q:'請用「季風或洋流」舉一個臺灣生活／產業例子，並說明自然條件如何影響它。',keywords:[['季風','洋流','風','冷流','暖流'],['菜宅','柿餅','鮪魚','烏魚','建築','漁業','農業']],p:5,tip:'先寫自然條件，再寫具體生活或產業。'},
   {q:'請用一句話說明：為什麼臺灣的地理位置會吸引大航海時代不同勢力來臺？',keywords:[['東亞','海','航路','交通','位置'],['貿易','交流','中國','日本','東南亞']],p:5,tip:'要同時有「位置／航路」和「貿易／交流」。'}]}
 ]},
 B:{title:'第一次段考模擬 B 卷',subtitle:'第一、二單元｜同範圍、不同情境與圖表',sections:[
  {type:'tf',name:'一、是非題｜16分',qs:[
   {q:'臺灣課堂上常以約3.6萬平方公里記憶，面積比日本、菲律賓、南韓都小。',a:true,p:2,tip:'先記量級與相對大小。'},
   {q:'蘭嶼傳統半穴居家屋和強風、颱風、炎熱等環境條件沒有任何關係。',a:false,p:2,tip:'建築是因地制宜的例子。'},
   {q:'臺灣位在東亞候鳥遷徙路線上，沿海濕地與魚塭可能成為候鳥停棲、覓食或度冬環境。',a:true,p:2,tip:'黑面琵鷺是代表例。'},
   {q:'新石器時代的農業與磨製石器，通常比舊石器時代更有利於長期定居和聚落形成。',a:true,p:2,tip:'食物較穩定有利定居。'},
   {q:'十三行文化只會使用打製石器，完全沒有鐵器或跨海交換。',a:false,p:2,tip:'十三行是金屬器時代重要代表。'},
   {q:'原住民族的祭儀、禁忌與故事有時也保存對季節、資源與共同生活的知識。',a:true,p:2,tip:'文化與環境常有關聯。'},
   {q:'西班牙勢力在17世紀主要以北臺灣為據點之一。',a:true,p:2,tip:'荷蘭南、西班牙北。'},
   {q:'鄭氏政權來臺後完全不使用海上貿易，也沒有開墾與人口移入。',a:false,p:2,tip:'鄭氏仍重視貿易與開墾。'}]},
  {type:'mcq',name:'二、選擇題｜24分',qs:[
   {q:'「西海峽、南巴士、東太平」這句口訣主要在記什麼？',opts:['臺灣周邊海域方向','三大史前時代','原住民族祭典','大航海人物'],a:0,p:3,tip:'是臺灣周邊海域。'},
   {q:'秋冬時新竹新埔常利用乾燥風曬柿餅，這個例子最能說明？',opts:['人們會善用地方氣候發展特色產業','季風只會造成災害','農業和氣候無關','全臺灣都適合相同作物'],a:0,p:3,tip:'自然資源也能成為地方產業條件。'},
   {q:'考古學家在文化層中從打製石器、磨製石器到鐵器發現差異，最適合用來研究？',opts:['工具、生產與生活方式的變化','今天的即時天氣','現代交通票價','未來股價'],a:0,p:3,tip:'考古證據用來重建過去生活。'},
   {q:'玉器工坊、遠地出土玉器與海上分布一起出現，最合理的解釋是？',opts:['已有專業分工與交換網絡','所有人都做相同工作','完全沒有航海','玉器與社會無關'],a:0,p:3,tip:'工坊→分工；遠地出土→交換。'},
   {q:'哪一組配對正確？',opts:['邵族—日月潭—白鹿傳說','阿美族—蘭嶼—飛魚文化','布農族—矮靈祭','賽夏族—射耳祭'],a:0,p:3,tip:'邵族白鹿與日月潭是高頻線索。'},
   {q:'荷蘭與西班牙來臺的共同背景較接近？',opts:['大航海時代的貿易競爭與宗教傳播','興建現代高速公路','開發太空站','尋找南極冰'],a:0,p:3,tip:'大航海時代常見貿易與傳教。'},
   {q:'鄭成功在1661～1662年前後帶來哪個重要轉折？',opts:['荷蘭人離臺，鄭氏成為主要統治力量','西班牙第一次來臺','清帝國立即建省','日本開始統治臺灣'],a:0,p:3,tip:'1661攻臺，1662荷蘭離臺。'},
   {q:'要研究大航海時代對今日臺灣的影響，哪一組資料最完整？',opts:['遺址、歷史文件、貿易記錄、人口與宗教資料','只有一張自拍照','只有一個人物名字','只有現代氣象圖'],a:0,p:3,tip:'多元證據互相驗證。'}]},
  {type:'fill',name:'三、填充題｜8分',qs:[
   {q:'課堂上通常把臺灣地區面積約記成＿＿萬平方公里。',answers:['3.6','3.6萬','三點六','三點六萬'],p:2,tip:'約3.6萬平方公里。'},
   {q:'冬季臺灣西部常見的季節性洄游漁獲是＿＿魚。',answers:['烏','烏魚'],p:2,tip:'夏鮪冬烏。'},
   {q:'日月潭白鹿傳說常和＿＿族相連。',answers:['邵','邵族'],p:2,tip:'邵族—日月潭—白鹿。'},
   {q:'1626年起主要在北臺灣建立據點的歐洲國家是＿＿＿＿。',answers:['西班牙','西班牙人'],p:2,tip:'荷蘭南、西班牙北。'}]},
  {type:'match',name:'四、配合題｜12分',choices:['長濱文化','卑南文化','十三行文化','臺灣玉交換網'],qs:[
   {q:'打製石器、採集狩獵、用火',a:'長濱文化',p:3,tip:'舊石器代表。'},
   {q:'農業、大型聚落、石板棺與玉器',a:'卑南文化',p:3,tip:'新石器重要代表。'},
   {q:'鐵器、煉鐵與較高生產效率',a:'十三行文化',p:3,tip:'金屬器代表。'},
   {q:'花蓮原料在臺灣與東南亞遠地出土',a:'臺灣玉交換網',p:3,tip:'遠地出土是交換證據。'}]},
  {type:'group',name:'五、閱讀素養題組｜20分',context:'小芸閱讀「黑面琵鷺與友善魚塭」資料：每年秋冬，大批黑面琵鷺沿東亞遷徙路線來到臺灣西南沿海。淺水濕地和魚塭裡有魚蝦等食物。部分養殖戶配合保育，在適當時期調整水位、保留覓食空間，也發展生態導覽。',qs:[
   {q:'黑面琵鷺秋冬來臺最直接和哪項現象有關？',opts:['季節性遷徙','火山活動','都市捷運','史前農業'],a:0,p:4,tip:'牠是冬候鳥。'},
   {q:'臺灣西南沿海適合黑面琵鷺的重要原因是？',opts:['有淺水棲地與食物來源','終年積雪','沒有任何生物','海拔最高'],a:0,p:4,tip:'棲地需要食物和休息空間。'},
   {q:'友善魚塭的做法最能表現哪個概念？',opts:['生產與生態保育可以嘗試共存','保育一定要停止所有人類活動','養殖和環境完全無關','候鳥只需要城市高樓'],a:0,p:4,tip:'兼顧產業與棲地。'},
   {q:'若要證明「臺灣是生物遷徙中繼站」，哪個資料最有力？',opts:['候鳥遷徙路線與每年來臺停棲紀錄','便利商店分布圖','高速公路里程','學校數量'],a:0,p:4,tip:'選直接關聯遷徙的證據。'},
   {q:'這段資料和第一課哪個核心概念最有關？',opts:['位置與自然環境會影響生物及人類活動','史前鐵器','荷蘭城堡','清代開港'],a:0,p:4,tip:'位置→環境→遷徙與產業。'}]},
  {type:'data',name:'六、時間軸判讀｜10分',context:examPrehistoryContext,qs:[
   {q:'依時間軸，哪一個文化最早？',opts:['長濱文化','卑南文化','十三行文化','三者同時'],a:0,p:5,tip:'距今數字越大通常越早。'},
   {q:'從時間軸的工具與生活線索，哪個推論最合理？',opts:['工具技術與生產方式逐步改變，聚落與交換也可能更複雜','人類愈晚愈不會使用工具','三個文化完全沒有差異','金屬器比打製石器更早'],a:0,p:5,tip:'看打製→農業聚落→鐵器交換的變化。'}]},
  {type:'short',name:'七、簡答題｜10分',qs:[
   {q:'請用「環境—規範—永續」說明一個原住民族生活智慧的例子。',keywords:[['飛魚','狩獵','季節','禁忌','gaga','祭'],['資源','永續','繁衍','分享','環境']],p:5,tip:'舉例後說明規範如何幫助資源或部落延續。'},
   {q:'請比較長濱文化與十三行文化，至少寫出一項工具或生活方式的差異。',keywords:[['長濱','打製','石器'],['十三行','鐵','金屬']],p:5,tip:'最直接比較「打製石器」和「鐵器」。'}]}
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
/* v0.8: removed empty daily-task loop */
$('#enterNextLesson').onclick=()=>{const id=nextLesson();availableLessons.includes(id)?openLesson(id):openUnit(Number(id[0]))};
/* v0.8: semester map is intentionally hidden from children */
$('#openExamCheckpoint').onclick=openExamHub;

function openGlobalRescue(){const ws=state.wrongBank;$('#missionContent').innerHTML=`<div class="unit-title"><span class="pill">🛟 弱點救援</span><h2>${ws.length?`今天只救 ${Math.min(ws.length,6)} 個錯點`:'目前沒有錯點'}</h2><p>${ws.length?'不用回頭重看整章。看提示，知道自己錯在哪裡就好。':'可以安心繼續往下一站。'}</p></div><div class="rescue-list">${ws.slice(0,6).map(w=>`<div class="rescue-item"><b>${escapeHtml(w.label)}</b><p>${escapeHtml(w.tip)}</p>${lessons[w.lesson]?`<button class="secondary-btn" data-rescue-lesson="${w.lesson}">回 ${w.lesson} 複習</button>`:`<button class="secondary-btn" data-rescue-clear="${w.id}">我已重新確認觀念</button>`}</div>`).join('')}</div>`;if(!$('#missionDialog').open)$('#missionDialog').showModal();$$('[data-rescue-lesson]').forEach(b=>b.onclick=()=>{$('#missionDialog').close();openLesson(b.dataset.rescueLesson,6)});$$('[data-rescue-clear]').forEach(b=>b.onclick=()=>{clearWrong(b.dataset.rescueClear);openGlobalRescue()})}
$('#rescueBtn').onclick=openGlobalRescue;

function openTimeline(){const done2=state.completedLessons.some(x=>x.startsWith('2-'));$('#missionContent').innerHTML=`<div class="unit-title"><span class="pill">⏳ 時光機</span><h2>把事件放回時間裡</h2><p>時間軸不是用來背一長串年份，而是看「誰先、誰後、發生了什麼改變」。</p></div><div class="timeline">${[['史前','長濱文化：打製石器、用火'],['史前','卑南遺址：農業與聚落'],['史前','十三行文化：鐵器'],['1624','荷蘭人在南臺灣建立據點'],['1626','西班牙人在北臺灣建立據點'],['1642','西班牙離臺，荷蘭勢力擴大'],['1661','鄭成功率軍來臺'],['1662','荷蘭人離臺，鄭氏政權經營臺灣']].map((x,i)=>`<div class="time-item ${!done2&&i>2?'future':''}"><b>${x[0]}</b><span>${!done2&&i>2?'完成第二單元後再揭曉':x[1]}</span></div>`).join('')}</div>`;$('#missionDialog').showModal()}
function openEvidenceRoom(){const pool=availableLessons.filter(id=>state.completedLessons.includes(id));const id=pool.length?pool[Math.floor(Math.random()*pool.length)]:nextLesson();openLesson(lessons[id]?id:'1-1',4)}

function profileHtml(){const badges=[['lesson_finish','🚩 第一站完成','完成任一課六關'],['culture_respect','🌿 文化觀察家','完成 1-3 原住民族文化與環境'],['time_traveler','⏳ 時光旅行者','完成第二單元'],['perfect_quiz','💯 小闖關全對','任一課小闖關全部答對'],['exam_master','👑 檢核高手','第一次段考任一卷 90 分以上']];return `<div class="unit-title"><span class="pill">我的探險資料</span><h2>👤 ${escapeHtml(currentUser)}</h2><p>每個帳號的進度都獨立保存在這台裝置。</p></div><div class="profile-stats"><div class="stat-box"><b>${state.stars}</b><span>星星</span></div><div class="stat-box"><b>${state.completedLessons.length}/13</b><span>完成課數</span></div><div class="stat-box"><b>${state.progress}%</b><span>學期進度</span></div></div><div class="exam-mini-stats"><span>A卷最佳 <b>${state.examBest.A||0}</b></span><span>B卷最佳 <b>${state.examBest.B||0}</b></span></div><h3>成就</h3><div class="achievement-grid">${badges.map(b=>`<div class="badge-card ${state.achievements.includes(b[0])?'':'locked'}"><b>${b[1]}</b><small>${b[2]}</small></div>`).join('')}</div><div class="profile-actions"><button class="secondary-btn" id="logoutBtn">切換帳號</button><button class="danger-btn" id="resetMeBtn">重設這個帳號進度</button></div><p class="tiny-note">這是本機學習帳號；清除瀏覽器網站資料會一併清除帳號與進度。正式上線若要跨裝置同步，再接雲端帳號。</p>`}
function openProfile(){$('#profileContent').innerHTML=profileHtml();$('#profileDialog').showModal();$('#logoutBtn').onclick=()=>{$('#profileDialog').close();logout()};$('#resetMeBtn').onclick=()=>{if(confirm('確定要把這個帳號的星星、錯題和進度全部重設嗎？')){state=defaultState();saveState();renderState();$('#profileContent').innerHTML=profileHtml()}}}
$('#profileBtn').onclick=openProfile;
/* v0.8 bottom navigation is wired after the simplified home renderer loads */
$$('[data-close]').forEach(b=>b.onclick=()=>{const d=b.closest('dialog');if(d?.id==='examDialog'&&examRuntime&&!examRuntime.submitted){if(!confirm('模擬考正在計時，確定要離開嗎？計時會結束。'))return;stopExamTimer()}d.close()});
function showToast(msg){let t=document.createElement('div');t.textContent=msg;Object.assign(t.style,{position:'fixed',left:'50%',bottom:'90px',transform:'translateX(-50%)',background:'#26334a',color:'#fff',padding:'11px 16px',borderRadius:'999px',zIndex:99,fontWeight:800,boxShadow:'0 8px 22px #0003'});document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

/* v0.8 initializes after v08.js overrides the home and Unit 1 learning flow. */
