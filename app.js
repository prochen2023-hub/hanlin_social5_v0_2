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
const lessonOrder=['1-1','1-2','1-3','2-1','2-2','3-1','3-2','4-1','4-2','4-3','5-1','5-2','5-3'];
const availableLessons=['1-1','1-2','1-3','2-1','2-2'];

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
 const next=nextLesson(),l=lessons[next],u=Number(next[0]);$('#continueUnitTitle').textContent=`${lessonUnitLabel(next)}｜${units[u].title}`;$('#continueNext').textContent=`下一站：${l?l.title:previewTitle(next)}`;$('#enterNextLesson').textContent=availableLessons.includes(next)?`進入 ${next} 六關`:`預覽後續單元`;
 if(state.wrongBank.length){$('#rescueTitle').textContent=`有 ${state.wrongBank.length} 個觀念可以救回來`;$('#rescueText').textContent=state.wrongBank[0].label;$('#rescueBtn').disabled=false;$('#rescueBtn').textContent='開始 2 分鐘救援'}else{$('#rescueTitle').textContent='目前沒有要補救的地方';$('#rescueText').textContent='答錯的觀念才會出現在這裡，不會整課重做。';$('#rescueBtn').disabled=true;$('#rescueBtn').textContent='先去探險'}
 setTodayLabels();$$('.unit-stop[data-open-unit]').forEach(b=>{const n=Number(b.dataset.openUnit),ids=units[n].lessons;b.classList.toggle('done',ids.every(id=>state.completedLessons.includes(id)))});$('#openExamCheckpoint').classList.toggle('done',(state.examAttempts.A||0)+(state.examAttempts.B||0)>0);saveState();
}

function openUnit(n){
 const u=units[n];const lessonCards=u.lessons.map(id=>{const l=lessons[id],ready=availableLessons.includes(id),done=state.completedLessons.includes(id);return `<div class="lesson-card ${done?'lesson-done':''}"><div class="lesson-line"><b>${done?'✓ ':''}${id} ${l?.title||previewTitle(id)}</b><span>${ready?(done?'已完成，可以再複習':'六關已開放'):'後續版本預覽'}</span></div>${ready?`<button class="secondary-btn" data-open-lesson="${id}">${done?'再複習':'開始這一課'}</button>`:''}</div>`}).join('');
 $('#unitContent').innerHTML=`<div class="unit-title"><span class="pill">${u.theme} 第 ${n} 單元</span><h2>${u.title}</h2><p>${u.subtitle}</p></div><div class="six-steps">${stages.map(s=>`<span>${s.icon} ${s.name}</span>`).join('')}</div><div class="lesson-list">${lessonCards}</div>${n===2?`<div class="checkpoint-mini"><b>★ 第一次段考檢核點</b><span>第一、二單元完成後很適合挑戰；A、B 卷都可直接預覽。</span><button class="primary-btn" id="unitExamBtn">打開 A / B 卷</button></div>`:''}<p class="source-note">內容依翰林版五上公開課程架構與學習目標重新設計，不重製課本全文。</p>`;
 $('#unitDialog').showModal();$$('[data-open-lesson]').forEach(b=>b.onclick=()=>{$('#unitDialog').close();openLesson(b.dataset.openLesson)});const eb=$('#unitExamBtn');if(eb)eb.onclick=()=>{$('#unitDialog').close();openExamHub()}
}
function previewTitle(id){const m={'3-1':'早期移民如何在臺灣建立家園？','3-2':'開港通商為什麼改變了臺灣的發展？','4-1':'人們如何適應不同地形創造所需？','4-2':'沿海的利用為什麼呈現多元發展？','4-3':'土地開發與環境保護該如何抉擇？','5-1':'選一個我想研究的問題','5-2':'找可靠資料','5-3':'整理成我的臺灣小書'};return m[id]||id}
$$('[data-open-unit]').forEach(b=>b.onclick=()=>openUnit(Number(b.dataset.openUnit)));

function lessonShell(id,stage,body){const l=lessons[id];$('#lessonContent').innerHTML=`<div class="lesson-header"><span class="pill">${lessonUnitLabel(id)}・${id}</span><h2>${l.title}</h2><p class="muted">一次只走一小關。現在只看第 ${stage} 關。</p></div><div class="stage-tabs">${stages.map((s,i)=>`<button class="stage-tab ${i+1===stage?'active':''} ${stagesFor(id).includes(i+1)?'done':''}" data-stage="${i+1}">${s.icon} ${s.name}</button>`).join('')}</div><section class="stage-panel">${body}</section><p class="source-note">這一課依公開課程計畫的學習重點重新編寫；重點放在理解關聯、讀證據與做判斷。</p>`;$$('[data-stage]').forEach(b=>b.onclick=()=>openLesson(id,Number(b.dataset.stage)))}
function openLesson(id,stage=null){const l=lessons[id];if(!l){openUnit(Number(id[0]));return}$('#lessonDialog').showModal();const n=stage||Math.min(6,stagesFor(id).length+1);renderLessonStage(id,n)}
function renderLessonStage(id,stage){const l=lessons[id];if(stage===1){lessonShell(id,1,`<h3>先看懂畫面</h3><p>${l.intro}</p>${l.visual()}<div class="fact-grid">${l.facts.map(x=>`<div class="fact-card"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div><div class="stage-actions"><button class="primary-btn" id="stageNext">看懂了 → 下一關</button></div>`);$('#stageNext').onclick=()=>{completeStage(id,1);openLesson(id,2)}}
 if(stage===2){const shuffled=[...l.pairs].sort((a,b)=>a[1].localeCompare(b[1])).reverse();lessonShell(id,2,`<h3>配對：把線索和意思接起來</h3><p>先點左邊，再點右邊。答錯只給提示，不扣星星。</p><div class="match-board"><div class="match-column">${l.pairs.map((x,i)=>`<button data-left="${i}">${x[0]}</button>`).join('')}</div><div class="match-column">${shuffled.map(x=>`<button data-right="${l.pairs.findIndex(p=>p[0]===x[0])}">${x[1]}</button>`).join('')}</div></div><p class="feedback" id="matchFeedback">完成 ${l.pairs.length} 組就過關。</p><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext" disabled>下一關</button></div>`);setupMatch(id);$('#stagePrev').onclick=()=>openLesson(id,1)}
 if(stage===3){lessonShell(id,3,`<h3>把四個重點串成一個故事</h3><p>社會不是零散名詞。看懂「前因 → 過程 → 影響」，比較不容易忘。</p><div class="story-strip">${l.story.map(x=>`<div class="story-card"><span class="emoji">${x[0]}</span><b>${x[1]}</b><span>${x[2]}</span></div>`).join('')}</div><div class="memory-line"><b>一句話記憶：</b>${l.story.map(x=>x[1]).join(' → ')}</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext">我能說出故事了</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>{completeStage(id,3);openLesson(id,4)}}
 if(stage===4){const evs=shuffled(l.evidence);lessonShell(id,4,`<h3>找證據，不被「看起來很像」騙走</h3><p><b>主張：</b>${l.claim}</p>${evs.map((x,i)=>`<button class="evidence-choice" data-correct="${x[2]?'1':'0'}"><span>${String.fromCharCode(65+i)}</span>${x[1]}</button>`).join('')}<p id="evidenceFeedback" class="feedback"></p><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="stageNext" disabled>下一關</button></div>`);setupEvidence(id);$('#stagePrev').onclick=()=>openLesson(id,3)}
 if(stage===5)renderQuizStage(id);
 if(stage===6)renderRescueStage(id);
}
function setupMatch(id){const l=lessons[id];let left=null,done=new Set();$$('[data-left]').forEach(b=>b.onclick=()=>{$$('[data-left]').forEach(x=>x.classList.remove('selected'));left=b;b.classList.add('selected')});$$('[data-right]').forEach(b=>b.onclick=()=>{if(!left){$('#matchFeedback').textContent='先從左邊選一張線索。';return}const ok=left.dataset.left===b.dataset.right;if(ok){left.disabled=true;b.disabled=true;left.classList.add('correct');b.classList.add('correct');done.add(b.dataset.right);left=null;$('#matchFeedback').textContent=`答對 ${done.size}/${l.pairs.length} 組！`;clearWrong(`match-${id}`);if(done.size===l.pairs.length){completeStage(id,2);$('#stageNext').disabled=false}}else{$('#matchFeedback').textContent='還沒接對。想想兩邊是不是「直接關聯」。';addWrong(`match-${id}`,id,`${id} 的線索配對還容易混`,l.pairs[Number(left.dataset.left)][1],'activity')}});$('#stageNext').onclick=()=>openLesson(id,3)}
function setupEvidence(id){const l=lessons[id];$$('[data-correct]').forEach(b=>b.onclick=()=>{const ok=b.dataset.correct==='1';$$('[data-correct]').forEach(z=>z.classList.remove('correct','wrong'));b.classList.add(ok?'correct':'wrong');if(ok){$('#evidenceFeedback').textContent='對！這個證據最直接支持題目的主張。';$('#stageNext').disabled=false;completeStage(id,4);clearWrong(`evidence-${id}`)}else{$('#evidenceFeedback').textContent='這句可能有資訊，但沒有直接支持題目的主張。';addWrong(`evidence-${id}`,id,`${id} 找證據時還會被旁支資訊吸引`,'先把題目的關鍵詞圈起來，再找直接談到同一件事的證據。','evidence')}});$('#stageNext').onclick=()=>openLesson(id,5)}
function renderQuizStage(id){const l=lessons[id],answers={};lessonShell(id,5,`<h3>五題小闖關</h3><p>目標是 4/5。答錯會自動進入救援，不用整課重做。</p><div id="quizBox">${l.quiz.map((x,i)=>`<div class="quiz-q" data-q="${i}"><h4>${i+1}. ${x[0]}</h4><div class="quiz-options">${shuffled(x[1].map((o,j)=>({o,j}))).map(z=>`<button data-opt="${z.j}">${z.o}</button>`).join('')}</div><p class="feedback"></p></div>`).join('')}</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="finishQuiz" disabled>看成績</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,4);$$('.quiz-q').forEach(qel=>{const qi=Number(qel.dataset.q),q=l.quiz[qi];qel.querySelectorAll('[data-opt]').forEach(btn=>btn.onclick=()=>{answers[qi]=Number(btn.dataset.opt);qel.querySelectorAll('[data-opt]').forEach(x=>x.classList.remove('correct','wrong'));const ok=answers[qi]===q[2];btn.classList.add(ok?'correct':'wrong');qel.querySelector('.feedback').textContent=ok?'答對！':`提示：${q[3]}`;const wid=`quiz-${id}-${qi}`;if(ok)clearWrong(wid);else addWrong(wid,id,q[0],q[3],'quiz');if(Object.keys(answers).length===l.quiz.length)$('#finishQuiz').disabled=false})});$('#finishQuiz').onclick=()=>{const score=l.quiz.filter((x,i)=>answers[i]===x[2]).length;state.lessonQuizBest[id]=Math.max(state.lessonQuizBest[id]||0,score);if(score>=4){completeStage(id,5);if(score===5)unlockAchievement('perfect_quiz')}saveState();renderState();$('#finishQuiz').textContent=`答對 ${score}/5 → 去救援`;setTimeout(()=>openLesson(id,6),350)}}
function renderRescueStage(id){const l=lessons[id],wrongs=state.wrongBank.filter(w=>w.lesson===id);const best=state.lessonQuizBest[id]||0;lessonShell(id,6,`<h3>${wrongs.length?'只救真的卡住的地方':'太棒了，這課暫時沒有錯點'}</h3><p>${best>=4?'你的小闖關已達標。':'小闖關最佳 '+best+'/5；先看提示，再回去挑戰會更容易。'}</p><div class="rescue-list">${wrongs.slice(0,6).map(w=>`<div class="rescue-item"><b>${escapeHtml(w.label)}</b><p>${escapeHtml(w.tip)}</p>${w.kind==='quiz'?`<button class="secondary-btn" data-retry-quiz>回第 5 關重試</button>`:w.kind==='evidence'?`<button class="secondary-btn" data-retry-evidence>回第 4 關再找一次</button>`:`<button class="secondary-btn" data-clear="${w.id}">我重新想懂了</button>`}</div>`).join('')}</div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 回闖關</button><button class="primary-btn" id="finishLesson">${best>=4?'完成這一課':'先回去達成 4/5'}</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,5);$$('[data-retry-quiz]').forEach(b=>b.onclick=()=>openLesson(id,5));$$('[data-retry-evidence]').forEach(b=>b.onclick=()=>openLesson(id,4));$$('[data-clear]').forEach(b=>b.onclick=()=>{clearWrong(b.dataset.clear);renderRescueStage(id)});$('#finishLesson').onclick=()=>{if((state.lessonQuizBest[id]||0)<4){showToast('先回第 5 關，答對至少 4 題就能完成。');openLesson(id,5);return}completeStage(id,6);completeLesson(id);$('#lessonDialog').close();showToast(`完成 ${id}！下一站已更新。`)}}

const examData={
 A:{title:'第一次段考模擬 A 卷',sections:[
  {name:'一、基礎選擇｜40分',qs:[
   ['臺灣位在東亞，這個位置最容易和哪項發展產生關聯？',['海上交通與文化交流','南極冰原生活','完全沒有對外接觸'],0,5],
   ['季風會直接影響下列哪一項？',['季節風向與雨量','歷史人物姓名','文字的筆畫'],0,5],
   ['長濱文化的重要生活線索是？',['打製石器與用火','鐵路運輸','大型機械農業'],0,5],
   ['卑南遺址反映新石器時代哪個變化？',['農業較穩定、聚落發展','完全不使用工具','所有人長期住在船上'],0,5],
   ['十三行文化和哪項線索關係最密切？',['鐵器使用','蒸汽火車','玻璃帷幕大樓'],0,5],
   ['臺灣玉在東南亞也出土，可推論？',['已有跨海交換','玉會自己游泳','史前人沒有航海能力'],0,5],
   ['1624 年起主要在臺灣南部經營的是？',['荷蘭人','西班牙人','清帝國'],0,5],
   ['1626 年起主要在北臺灣建立據點的是？',['西班牙人','荷蘭人','鄭氏'],0,5]]},
  {name:'二、配對判讀｜20分',qs:[
   ['「打製石器」最適合配對？',['長濱文化','十三行文化','現代臺灣'],0,5],
   ['「鐵器耕作」最適合配對？',['十三行文化','長濱文化','荷蘭統治'],0,5],
   ['「南臺灣據點」最適合配對？',['荷蘭','西班牙','達悟族'],0,5],
   ['「北臺灣據點」最適合配對？',['西班牙','荷蘭','卑南文化'],0,5]]},
  {name:'三、證據判斷｜20分',qs:[
   ['要證明臺灣適合海上交流，哪個證據最直接？',['位在東亞海路附近，周邊連接多個地區','臺灣有高山','臺灣有便利商店'],0,5],
   ['要證明史前已有遠距交換，哪個證據最直接？',['花蓮玉在東南亞遺址出土','現代有機場','山區氣溫較低'],0,5],
   ['要說明原住民族文化與環境相關，哪個證據最好？',['傳說、採集與漁獵知識常連結居住環境','所有族群文化完全相同','只看族名就能判斷生活'],0,5],
   ['要說明大航海時代影響不只戰爭，哪個證據最好？',['宗教、貿易、移民與文化資產都產生變化','只記一個戰役','完全沒有文化接觸'],0,5]]},
  {name:'四、情境應用｜20分',qs:[
   ['博物館出土鐵器、聚落遺跡與農作線索，你最合理的推論是？',['工具進步可能提升生產，支持較穩定的聚落生活','一定是舊石器時代最早期','人們完全不耕作'],0,10],
   ['你是 17 世紀商人，要在日本、中國沿海與東南亞之間往來，為何會注意臺灣？',['臺灣位在區域海路節點，適合作為轉運與據點','臺灣位在大西洋中央','臺灣和亞洲完全沒有關係'],0,10]]}
 ]},
 B:{title:'第一次段考模擬 B 卷',sections:[
  {name:'一、基礎選擇｜40分',qs:[
   ['臺灣東側面向哪個大洋？',['太平洋','大西洋','北冰洋'],0,5],
   ['「位置會影響生活」最合理的例子是？',['季風與海洋影響農作、交通與生活安排','位置只影響名稱','地圖和生活沒有關係'],0,5],
   ['考古學家如何了解史前人的生活？',['從文化層、遺址與器物推理','訪問當時的新聞主播','只看現代照片'],0,5],
   ['新石器時代農業較穩定，可能帶來什麼？',['人口增加與聚落發展','人們一定停止使用工具','完全不需要合作'],0,5],
   ['官方目前認定的臺灣原住民族共有？',['16族','2族','60族'],0,5],
   ['學習原住民族文化最適合的態度是？',['理解各族差異並尊重族人觀點','把所有族群都看成一樣','只相信刻板印象'],0,5],
   ['1642 年後北臺灣西班牙據點如何改變？',['西班牙離臺，荷蘭勢力擴大','西班牙統治全臺','變成現代機場'],0,5],
   ['1661～1662 年間臺灣政權出現哪個重要轉折？',['鄭成功來臺，荷蘭人離臺','西班牙第一次來臺','清帝國建省'],0,5]]},
  {name:'二、配對判讀｜20分',qs:[
   ['「花蓮產、遠地也出土」對應？',['臺灣玉交換','季風雨量','現代觀光'],0,5],
   ['「與自然共存的傳說」對應？',['原住民族文化與環境','荷蘭城堡','十三行鐵器'],0,5],
   ['「商業利益與傳教」對應？',['荷蘭、西班牙來臺活動','長濱文化','現代都市計畫'],0,5],
   ['「招募漢人開墾、推動教育」對應？',['鄭氏政權','西班牙北臺灣據點','長濱文化'],0,5]]},
  {name:'三、證據判斷｜20分',qs:[
   ['哪個最能支持「農業促成聚落」？',['食物取得較穩定，人口可長期居住','人們每天一定換地方','農業會讓食物更不穩定'],0,5],
   ['哪個最能支持「文化是多元的」？',['不同原住民族有各自語言、傳統與歷史經驗','所有族群習俗完全相同','只存在一種生活方式'],0,5],
   ['哪個最能支持「臺灣進入區域貿易網」？',['商品與人員在臺灣和周邊地區間流動','臺灣完全停止航海','只在島內交換'],0,5],
   ['哪個最能支持「今天仍看得到大航海時代影響」？',['仍保存相關城堡、遺址與文化痕跡','所有遺跡都不存在','只靠想像'],0,5]]},
  {name:'四、情境應用｜20分',qs:[
   ['你看到一件文物，想判斷它能不能證明跨海交換，最重要先問什麼？',['它的產地和出土地是否相距很遠、需要跨海移動','它好不好看','它的照片是不是彩色'],0,10],
   ['兩位同學爭論「大航海時代只留下戰爭」，哪個回應較完整？',['還有宗教、貿易、移民、教育與文化資產等影響','對，只要背戰爭就好','歷史和今天沒有關係'],0,10]]}
 ]}
};
function openExamHub(){const a=state.examBest.A||0,b=state.examBest.B||0;$('#examContent').innerHTML=`<div class="exam-head"><span class="pill">★ 第一次段考檢核點</span><h2>第一、二單元｜A / B 兩卷</h2><p>每卷 100 分，建議 40 分鐘。這裡不強制倒數，先把題目讀懂比較重要。</p></div><div class="exam-cards"><button class="exam-card" data-exam="A"><span>🟢</span><b>A 卷</b><small>最佳 ${a} 分・${state.examAttempts.A||0} 次</small><em>地圖、史前、文化、大航海</em></button><button class="exam-card" data-exam="B"><span>🟣</span><b>B 卷</b><small>最佳 ${b} 分・${state.examAttempts.B||0} 次</small><em>同範圍、不同題目與情境</em></button></div><div class="exam-note"><b>考前不用把整個網站重看。</b><span>做完後，答錯觀念會送進弱點救援，回首頁只會看到最需要補的地方。</span></div>`;if(!$('#examDialog').open)$('#examDialog').showModal();$$('[data-exam]').forEach(b=>b.onclick=()=>renderExam(b.dataset.exam))}
function renderExam(form){const e=examData[form];$('#examContent').innerHTML=`<div class="exam-head"><button class="text-btn" id="backExam">← A / B 卷</button><span class="pill">${form} 卷・100 分</span><h2>${e.title}</h2><p>建議 40 分鐘｜全部作答後一次交卷。可以先跳過不確定的題目。</p></div><form id="examForm">${e.sections.map((sec,si)=>`<section class="exam-section"><h3>${sec.name}</h3>${sec.qs.map((q,qi)=>{const key=`s${si}q${qi}`;return `<div class="exam-q"><b>${qi+1}. ${q[0]} <span>${q[3]}分</span></b><div class="exam-options">${shuffled(q[1].map((o,oi)=>({o,oi}))).map(z=>`<label><input type="radio" name="${key}" value="${z.oi}"> ${z.o}</label>`).join('')}</div></div>`}).join('')}</section>`).join('')}<div class="exam-submit"><p id="examProgress">尚未交卷</p><button type="submit" class="primary-btn">交卷並計分</button></div></form>`;$('#backExam').onclick=openExamHub;$('#examForm').onsubmit=ev=>{ev.preventDefault();gradeExam(form)}}
function gradeExam(form){const e=examData[form],fd=new FormData($('#examForm'));let score=0,totalQ=0,answered=0,wrong=[];e.sections.forEach((sec,si)=>sec.qs.forEach((q,qi)=>{totalQ++;const key=`s${si}q${qi}`,v=fd.get(key),wid=`exam-${form}-${si}-${qi}`;if(v!==null){answered++;if(Number(v)===q[2]){score+=q[3];state.wrongBank=state.wrongBank.filter(x=>x.id!==wid)}else{wrong.push({id:wid,q:q[0],tip:`正確觀念：${q[1][q[2]]}`});const old=state.wrongBank.find(x=>x.id===wid);if(old){old.label=q[0];old.tip=`正確觀念：${q[1][q[2]]}`}else state.wrongBank.push({id:wid,lesson:'exam1',label:q[0],tip:`正確觀念：${q[1][q[2]]}`,kind:'exam'})}}}));if(answered<totalQ){$('#examProgress').textContent=`還有 ${totalQ-answered} 題沒有作答。先完成再交卷。`;return}state.examAttempts[form]=(state.examAttempts[form]||0)+1;state.examBest[form]=Math.max(state.examBest[form]||0,score);if(score>=90)unlockAchievement('exam_master');state.stars+=Math.max(5,Math.round(score/10));saveState();renderState();$('#examContent').innerHTML=`<div class="score-hero"><span>📝 ${form} 卷完成</span><strong>${score}</strong><small>/ 100</small><h2>${score>=90?'非常穩！':score>=80?'大部分觀念已掌握':score>=70?'基本盤有了，再救幾個錯點':'先救錯點，比一直重考有效'}</h2><p>答錯 ${wrong.length} 題；已把需要複習的觀念送到弱點救援。</p><div class="score-actions"><button class="secondary-btn" id="examHome">回 A / B 卷</button><button class="primary-btn" id="examRescue">看弱點救援</button></div></div>`;$('#examHome').onclick=openExamHub;$('#examRescue').onclick=()=>{ $('#examDialog').close();openGlobalRescue()}}

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
$$('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
function showToast(msg){let t=document.createElement('div');t.textContent=msg;Object.assign(t.style,{position:'fixed',left:'50%',bottom:'90px',transform:'translateX(-50%)',background:'#26334a',color:'#fff',padding:'11px 16px',borderRadius:'999px',zIndex:99,fontWeight:800,boxShadow:'0 8px 22px #0003'});document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

renderAccounts();const session=localStorage.getItem(SESSION_KEY);if(session&&accounts[session])login(session);
