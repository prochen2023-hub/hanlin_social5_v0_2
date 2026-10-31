/* v0.9 — Unit 1 game-first reinforcement, calibrated maps, real Indigenous distribution map */
const V09_VERSION='0.9.0';
const V09_INDIGENOUS_MAP='https://mhi.moe.edu.tw/instructions-for-use/.galleries/images/1126-8.jpg';
const V09_INDIGENOUS_SOURCE='https://mhi.moe.edu.tw/instructions-for-use/TSMhiInstructionForUse-000011/';

/* ---------- home: one optional game card, no semester-wide map ---------- */
const v09RenderStateBase=renderState;
renderState=function(){
  v09RenderStateBase();
  const card=$('#unit1GameCard');
  if(card){
    const unit1Done=units[1].lessons.every(id=>state.completedLessons.includes(id));
    const unit1Active=firstIncompleteUnit()===1;
    card.hidden=!(unit1Active||unit1Done);
  }
  if(!state.unit1Game) state.unit1Game={plays:0,bestCoins:0,bestCorrect:0,bestCollection:0};
  const rec=$('#gameRecord');
  if(rec){const r=state.unit1Game;rec.hidden=!r.plays;rec.innerHTML=r.plays?`<span>已玩 <b>${r.plays}</b> 局</span><span>最高獎金 <b>${r.bestCoins}</b></span><span>最佳正確率 <b>${r.bestCorrect}%</b></span>`:'';}
};
$('#openUnit1Game').onclick=()=>openUnit1Game();

/* ---------- map calibration: marker is tied to actual image box, not a letterboxed container ---------- */
mapChallengeHtml=function(key,title,img,items,credit){return `<section class="map-lab" data-map-lab="${key}"><div class="map-lab-head"><div><span class="mini-kicker">互動定位</span><h4>${title}</h4></div><span class="map-progress" id="${key}Progress">1 / ${items.length}</span></div><div class="accurate-map-wrap calibrated-map map-${key}"><img src="${img}" alt="${title}" loading="lazy" referrerpolicy="no-referrer"><span id="${key}Marker" class="map-pulse-marker tiny-map-marker">?</span></div><p class="map-credit">${credit}</p><div class="map-question-box"><b id="${key}Prompt"></b><div id="${key}Choices" class="choice-3"></div><p id="${key}Feedback" class="feedback"></p></div></section>`};

/* ---------- Indigenous distribution: use an actual distribution map, then a light interaction ---------- */
lesson13Stage1V08=function(){return `<div class="stage-intro visual-intro"><span class="big-emoji">🗺️</span><div><h3>先看真的族群分布，再抓「區域感」</h3><p>這張圖直接標出 16 族主要傳統分布。你不需要把整張圖一次背完，只先抓六個區域。</p></div></div><figure class="indigenous-map-official"><img src="${V09_INDIGENOUS_MAP}" alt="臺灣原住民族16族主要傳統分布圖" loading="lazy" referrerpolicy="no-referrer"><figcaption>教育部本土語言資源網「原住民族分布圖」。圖示為主要傳統分布；現代族人居住地更廣。</figcaption></figure><div class="tribe-region-memory" id="tribeRegionMemory"><button data-region="east">東部</button><button data-region="north">北中山區</button><button data-region="central">中央</button><button data-region="south">南部</button><button data-region="lake">日月潭</button><button data-region="lanyu">蘭嶼</button></div><div id="tribeRegionCard" class="tribe-region-card"><span>👆</span><div><b>先點一個區域</b><p>每次只記 1～3 個族群，不用把 16 族塞進腦袋。</p></div></div><p class="map-note">※「主要傳統分布」不是現代人口限制；族人今日居住在臺灣各地。族群學習重點是理解文化與環境，不把人固定成地圖上的一塊顏色。</p><a class="resource-link single-resource" href="${V09_INDIGENOUS_SOURCE}" target="_blank" rel="noopener"><span>🔎</span><b>放大看教育部分布圖</b><small>另開官方教學資源</small></a><details class="all-tribes"><summary>完整 16 族名稱（認識即可）</summary><p>阿美、泰雅、排灣、布農、卑南、魯凱、鄒、賽夏、達悟（雅美）、邵、噶瑪蘭、太魯閣、撒奇萊雅、賽德克、拉阿魯哇、卡那卡那富。</p></details><div class="stage-actions"><button class="primary-btn" id="stageNext">我抓到區域感 → 高頻線索</button></div>`};
const v09RenderU1Base=renderUnit1RichStage;
renderUnit1RichStage=function(id,stage){
  if(id==='1-3'&&stage===1){
    lessonShell(id,1,lesson13Stage1V08());
    const cards={
      east:['東部海岸／縱谷','阿美、太魯閣、撒奇萊雅、噶瑪蘭','先把「東部＝阿美」當第一個錨點，再慢慢加其他族。'],
      north:['北中部山區','泰雅、賽夏、賽德克','看到北中部山區，先想到泰雅；苗栗新竹再連賽夏。'],
      central:['中央山區','布農、鄒等','中央山區先抓布農；嘉義阿里山再連鄒族。'],
      south:['南部山區','排灣、魯凱、拉阿魯哇、卡那卡那富','南部先抓排灣／魯凱，再認識人數較少的兩族。'],
      lake:['日月潭','邵族','邵族的白鹿傳說與日月潭是最常考的地點線索。'],
      lanyu:['蘭嶼','達悟族','蘭嶼＝達悟＝飛魚＝拼板舟／地下屋，是一組很好記的海洋文化線索。']
    };
    $$('[data-region]').forEach(b=>b.onclick=()=>{const x=cards[b.dataset.region];$$('[data-region]').forEach(z=>z.classList.toggle('active',z===b));$('#tribeRegionCard').innerHTML=`<span>📍</span><div><b>${x[0]}｜${x[1]}</b><p>${x[2]}</p></div>`});
    $('#stageNext').onclick=()=>{completeStage(id,1);openLesson(id,2)};
    return true;
  }
  return v09RenderU1Base(id,stage);
};

/* ---------- history: what must be memorized ---------- */
const v09Lesson12Stage2Base=lesson12Stage2V08;
lesson12Stage2V08=function(){return `<div class="memory-priority"><div><span>⭐ 必記</span><b>舊 → 新 → 金</b><p>長濱 → 卑南 → 十三行。先後順序一定要會。</p></div><div><span>👀 會看</span><b>3萬～5千／3500～2000多／1800～500</b><p>只要能判斷「很早／中段／較晚」，不用背到精確年份。</p></div><div><span>➕ 加分</span><b>精確起訖年代</b><p>遇到資料題會讀時間軸即可，不當作主要死背內容。</p></div></div><div class="era-mnemonic"><b>🧠 三棒接力記法</b><span><strong>長濱：</strong>「3萬起跑，5千交棒」</span><span><strong>卑南：</strong>「3千5接棒，2千多交棒」</span><span><strong>十三行：</strong>「1800接鐵棒，500前後收尾」</span></div>${v09Lesson12Stage2Base()}`};

/* ---------- Unit 1 treasure-board game ---------- */
const GAME_BOARD=[
 {icon:'🚩',name:'基隆港',type:'start',cat:'geo'},
 {icon:'🌏',name:'亞洲定位',cat:'geo',asset:'東亞導航證',assetType:'land',q:[['臺灣位在哪一洲？',['亞洲','歐洲','大洋洲'],0,'先看世界，再縮小到東亞。'],['臺灣東側面向哪個大洋？',['太平洋','印度洋','大西洋'],0,'東太平洋，是最重要的方向線索之一。'],['課本常用的「三大洋」是哪一組？',['太平洋、大西洋、印度洋','太平洋、地中海、紅海','大西洋、黑海、北海'],0,'先抓三個最大洋：太、大、印。'],['澳洲與許多太平洋島嶼歸在哪一洲？',['大洋洲','非洲','歐洲'],0,'五大洲中，大洋洲包含澳洲與許多太平洋島嶼。'],['臺灣本島與主要離島合計常用的面積約是多少？',['3.6萬平方公里','36萬平方公里','3600平方公里'],0,'記「3.6萬」，不用背一長串精確數字。']]},
 {icon:'🌊',name:'臺灣海峽',cat:'geo',asset:'海峽航線',assetType:'land',q:[['臺灣海峽在臺灣哪一側？',['西側','東側','北側'],0,'西邊隔著臺灣海峽面向中國大陸。'],['臺灣南方、往菲律賓方向的重要海域是？',['巴士海峽','東海','日本海'],0,'南巴士、東太平、北東海、西臺灣海峽。'],['哪一組都屬於臺灣範圍常學的重要島嶼？',['澎湖、金門、馬祖、綠島、蘭嶼','沖繩、濟州、海南、關島','北海道、九州、呂宋、峇里'],0,'本島以外，要能認得澎湖、金門、馬祖與周邊離島。'],['「西海峽、南巴士、東太平、北東海」是在記什麼？',['臺灣四周海域方向','史前文化年代','原住民族祭典'],0,'把臺灣放中間，四個方向一起記最省力。']]},
 {icon:'❄️',name:'東北季風',cat:'climate',asset:'冬季風卡',assetType:'land',q:[['冬季影響臺灣明顯的季風是？',['東北季風','西南季風','東南信風'],0,'冬東北、夏西南。'],['冬季東北季風下，哪一區通常較容易迎風濕冷？',['北部與東北部','西南部','澎湖中央'],0,'迎風面要看風從哪裡吹來。']]},
 {icon:'🧱',name:'澎湖菜宅',cat:'climate',asset:'澎湖菜宅',assetType:'land',q:[['澎湖菜宅石牆最主要在對付什麼環境？',['強風','大雪','火山灰'],0,'強季風讓居民用石牆替作物擋風。']]},
 {icon:'🎁',name:'機會',type:'chance',cat:'event'},
 {icon:'🍊',name:'新埔柿餅',cat:'climate',asset:'新埔柿餅坊',assetType:'land',q:[['新埔曬柿餅常利用哪種地方風？',['九降風','焚風','颱風眼'],0,'秋冬乾燥強風有利柿子脫水。']]},
 {icon:'🏠',name:'蘭嶼地下屋',cat:'climate',asset:'地下屋地標',assetType:'land',q:[['蘭嶼傳統地下屋把屋體降低，最有助於？',['減少強風與颱風影響','增加雪量','擴大沙漠'],0,'低矮、下沉能降低強風直接衝擊。']]},
 {icon:'🐟',name:'東港黑鮪魚',cat:'ocean',asset:'黑鮪魚',assetType:'fish',q:[['黑鮪魚季最常和哪個季節連結？',['春末到夏季','隆冬','整年完全相同'],0,'春末到夏，暖流水溫與洄游路線帶來漁汛。']]},
 {icon:'🦢',name:'黑面琵鷺',cat:'ocean',asset:'候鳥觀察章',assetType:'treasure',q:[['黑面琵鷺在臺灣最容易於哪個季節大量觀察？',['秋冬','盛夏','全年完全相同'],0,'牠們秋冬來臺度冬。'],['黑面琵鷺最好認的外形？',['匙狀長嘴','短紅嘴','巨大彎鉤嘴'],0,'黑臉＋湯匙嘴。']]},
 {icon:'🐠',name:'冬季烏魚',cat:'ocean',asset:'烏魚',assetType:'fish',q:[['冬至前後臺灣西部常見哪種季節漁獲？',['烏魚','黑鮪魚','飛魚'],0,'夏鮪、冬烏，是好記的季節口訣。']]},
 {icon:'⏳',name:'時光門',cat:'history',asset:'時光羅盤',assetType:'treasure',q:[['史前文化正確先後是？',['長濱 → 卑南 → 十三行','十三行 → 長濱 → 卑南','卑南 → 十三行 → 長濱'],0,'舊石器 → 新石器 → 金屬器。'],['哪一組年代最早？',['距今3萬～5千年的長濱文化','距今1800～500年的十三行','距今3500～2000多年的卑南'],0,'不用背精確年，只要知道長濱最早。']]},
 {icon:'🪨',name:'八仙洞',cat:'history',asset:'長濱遺址章',assetType:'site',q:[['八仙洞常和哪個史前文化配對？',['長濱文化','卑南文化','十三行文化'],0,'八仙洞＝長濱＝舊石器。'],['長濱文化最常見的工具線索？',['打製石器','大量鐵器','玻璃工廠'],0,'舊石器的代表技術是打製。']]},
 {icon:'🏺',name:'卑南遺址',cat:'history',asset:'卑南遺址章',assetType:'site',q:[['卑南文化最適合哪組生活線索？',['農業、定居聚落、石板棺與玉器','只有打製石器且沒有聚落','大型煉鐵爐'],0,'卑南文化是新石器時代的重要代表。']]},
 {icon:'💚',name:'臺灣玉',cat:'history',asset:'臺灣玉寶物',assetType:'treasure',q:[['臺灣玉在臺灣各地與東南亞出土，最能證明？',['分工、交換與跨海航行','玉器會自己移動','所有人都住花蓮'],0,'產地、加工地、出土地不同，就是交換網的線索。']]},
 {icon:'⚒️',name:'十三行',cat:'history',asset:'十三行遺址章',assetType:'site',q:[['十三行文化最突出的技術線索是？',['煉鐵與鐵器','只有打製石器','沒有交易'],0,'十三行是鐵器時代代表文化。'],['十三行文化大約距今多久？',['1800～500年','3萬～5千年','3500～2000多年'],0,'它是三條主線中最晚的一棒。']]},
 {icon:'🌀',name:'命運',type:'fate',cat:'event'},
 {icon:'🌾',name:'阿美族',cat:'tribe',asset:'阿美文化徽章',assetType:'badge',q:[['阿美族最常和哪個區域、祭典連結？',['東部海岸／縱谷、豐年祭','蘭嶼、飛魚','日月潭、白鹿'],0,'東部＝阿美是第一個地理錨點。'],['看到花東縱谷與東部海岸，第一個可以想到哪一族？',['阿美族','邵族','達悟族'],0,'東部先用阿美族當地理錨點。']]},
 {icon:'🧵',name:'泰雅族',cat:'tribe',asset:'泰雅智慧徽章',assetType:'badge',q:[['泰雅族常見的生活規範概念是？',['gaga','飛魚季','矮靈祭'],0,'gaga和生活倫理、規範、祭儀相關。'],['泰雅族傳統分布較常和哪一區連結？',['北部到中部山區','蘭嶼','日月潭湖畔'],0,'北中部山區先想到泰雅。']]},
 {icon:'🏹',name:'布農族',cat:'tribe',asset:'布農智慧徽章',assetType:'badge',q:[['布農族常見祭儀考點是？',['射耳祭','豐年祭','矮靈祭'],0,'布農＝射耳祭。'],['布農族的傳統生活環境較常和哪裡連結？',['中央山區','西部沿海平原','澎湖群島'],0,'中央山區是布農族的重要地理錨點。']]},
 {icon:'🐍',name:'排灣族',cat:'tribe',asset:'排灣文化徽章',assetType:'badge',q:[['排灣族常見文化線索較接近？',['階級制度、家族與百步蛇文化象徵','飛魚季','白鹿傳說'],0,'南部山區的排灣文化常見階級、家族與祭儀工藝。'],['排灣族傳統分布較常和哪個區域連結？',['南部山區','北海岸','蘭嶼'],0,'南部山區先抓排灣、魯凱。']]},
 {icon:'🦌',name:'邵族',cat:'tribe',asset:'邵族智慧徽章',assetType:'badge',q:[['邵族最常和哪個地點、傳說連在一起？',['日月潭、白鹿傳說','蘭嶼、飛魚','花東、豐年祭'],0,'白鹿到日月潭，是很好記的文化地景線索。'],['地圖上看到日月潭，哪一族是最直接的記憶連結？',['邵族','阿美族','達悟族'],0,'日月潭＝邵族，是一組位置線索。']]},
 {icon:'🐟',name:'達悟族',cat:'tribe',asset:'達悟海洋徽章',assetType:'badge',q:[['蘭嶼達悟族最具代表性的海洋文化是？',['飛魚文化','烏魚文化','黑鮪魚季'],0,'蘭嶼＝達悟＝飛魚。'],['達悟族的傳統家屋與哪種環境因應最有關？',['地下屋降低強風與颱風衝擊','雪屋保暖','高腳屋躲沙漠'],0,'蘭嶼強風與颱風，是地下屋的重要環境背景。']]},
 {icon:'🎲',name:'再遇機會',type:'chance',cat:'event'}
];
const GAME_CHANCE=[
 {icon:'🐟',title:'東港黑鮪魚季！',text:'春末到夏，暖流與洄游魚群帶來漁汛。你獲得黑鮪魚一尾。',coins:120,fish:'黑鮪魚'},
 {icon:'🦢',title:'黑面琵鷺來度冬',text:'秋冬候鳥抵達臺南沿海濕地，你完成生態觀察任務。',coins:90,treasure:'黑面琵鷺觀察章'},
 {icon:'🍊',title:'九降風吹得剛剛好',text:'新埔柿餅順利脫水，地方產業加分。',coins:80,land:'新埔柿餅坊'},
 {icon:'💚',title:'臺灣玉交換船順利',text:'玉材從花蓮經島內交換並跨海流通，你找到一枚交換寶物。',coins:100,treasure:'玉器交換卡'},
 {icon:'🧱',title:'菜宅擋住強風',text:'冬季東北季風強，澎湖菜宅石牆保護了作物。',coins:70,land:'澎湖菜宅'}
];
const GAME_FATE=[
 {icon:'🌬️',title:'東北季風突然增強',text:'你想起「冬東北、夏西南」，往前 1 格。',move:1,coins:30},
 {icon:'🧭',title:'海峽方向差點弄反',text:'複習口訣：「西臺灣海峽、南巴士、東太平、北東海」。退 1 格，再出發。',move:-1,coins:0},
 {icon:'⏳',title:'時光機校正成功',text:'你沒有硬背精確年份，而是先抓長濱 → 卑南 → 十三行。獲得時光獎金。',coins:80,treasure:'年代接力卡'},
 {icon:'🤝',title:'部落共享任務',text:'獵物與勞動共享代表互助責任，不是「誰搶到就是誰的」。獲得智慧徽章。',coins:50,badge:'共享互助徽章'},
 {icon:'🌊',title:'冬季烏魚南下',text:'你記住「夏鮪、冬烏」，獲得烏魚一尾。',coins:60,fish:'烏魚'}
];
const GAME_POS=[[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[7,6],[7,5],[7,4],[7,3],[7,2],[7,1],[6,1],[5,1],[4,1],[3,1],[2,1]];
let gameSession=null;

function gameSetAdd(setLike,item){if(item)setLike.add(item)}
function newGameSession(){return {pos:0,turn:0,maxTurns:12,coins:200,lands:new Set(),fish:new Map(),sites:new Set(),treasures:new Set(),badges:new Set(),correct:0,totalQ:0,busy:false,secondTry:false,log:['🚩 從基隆港出發！']}}
function gameCollectionCount(g){return g.lands.size+g.sites.size+g.treasures.size+g.badges.size+[...g.fish.values()].reduce((a,b)=>a+b,0)}
function renderGameStats(){const g=gameSession;if(!g)return;$('#gTurn').textContent=`${g.turn}/${g.maxTurns}`;$('#gCoins').textContent=g.coins;$('#gLand').textContent=g.lands.size;$('#gFish').textContent=[...g.fish.values()].reduce((a,b)=>a+b,0);$('#gTreasure').textContent=g.sites.size+g.treasures.size;$('#gBadge').textContent=g.badges.size;$('#gAcc').textContent=g.totalQ?Math.round(g.correct/g.totalQ*100)+'%':'—'}
function boardSpaceHtml(s,i){const [r,c]=GAME_POS[i];const cls=['board-space',`cat-${s.cat||'event'}`,s.type||'quiz'];return `<button type="button" class="${cls.join(' ')}" style="grid-row:${r};grid-column:${c}" data-space="${i}" aria-label="${s.name}"><span>${s.icon}</span><b>${s.name}</b>${i===0?'<em>START</em>':''}</button>`}
function gameCenterDefault(){return `<div class="game-center-home"><div class="dice-face" id="diceFace">🎲</div><h3>擲骰子，走一趟臺灣</h3><p>走到哪裡，就解一個地理／氣候／史前／族群線索。答對才能收進收藏。</p><button class="primary-btn" id="rollDice">擲骰子</button><small>每局 12 回合。答錯會看到記憶提示，同一格下次還可能再遇到。</small></div>`}
function renderGameBoard(){const g=gameSession;$('#gameContent').innerHTML=`<div class="game-head"><div><span class="pill game-pill">第一單元｜遊戲複習</span><h2>🎲 寶島時空藏寶局</h2><p>不是買下族群土地：地方地標可收成「地方資產」，原住民族內容改收「文化／智慧徽章」。</p></div><button class="secondary-btn" id="restartGameTop">↻ 重新開局</button></div><div class="game-statbar"><span>回合 <b id="gTurn">0/12</b></span><span>💰 <b id="gCoins">200</b></span><span>🏠 地方資產 <b id="gLand">0</b></span><span>🐟 漁獲 <b id="gFish">0</b></span><span>🏺 寶物／遺址 <b id="gTreasure">0</b></span><span>🪶 智慧徽章 <b id="gBadge">0</b></span><span>🎯 正確率 <b id="gAcc">—</b></span></div><div class="board-scroll"><div class="treasure-board" id="treasureBoard">${GAME_BOARD.map(boardSpaceHtml).join('')}<div class="game-center" id="gameCenter">${gameCenterDefault()}</div><div class="player-token" id="playerToken">🧭</div></div></div><div class="game-bottom"><details><summary>📦 我的收藏</summary><div id="gameCollection" class="game-collection"></div></details><details><summary>🧾 這局發生什麼？</summary><div id="gameLog" class="game-log"></div></details></div>`;
  positionToken();bindRoll();$('#restartGameTop').onclick=()=>startUnit1Game(true);renderGameStats();renderGameCollection();renderGameLog();
}
function positionToken(){const el=$('#playerToken'),space=$(`[data-space="${gameSession.pos}"]`);if(!el||!space)return;const b=$('#treasureBoard').getBoundingClientRect(),r=space.getBoundingClientRect();el.style.left=(r.left-b.left+r.width/2)+'px';el.style.top=(r.top-b.top+r.height/2)+'px';$$('[data-space]').forEach(x=>x.classList.toggle('active-space',Number(x.dataset.space)===gameSession.pos))}
function bindRoll(){const b=$('#rollDice');if(b)b.onclick=rollGameDice}
function renderGameCollection(){const g=gameSession,box=$('#gameCollection');if(!box)return;const fish=[...g.fish.entries()].map(([k,v])=>`${k}×${v}`);box.innerHTML=`<div><b>🏠 地方資產</b><span>${[...g.lands].join('、')||'還沒有'}</span></div><div><b>🐟 漁獲</b><span>${fish.join('、')||'還沒有'}</span></div><div><b>🏺 遺址／寶物</b><span>${[...g.sites,...g.treasures].join('、')||'還沒有'}</span></div><div><b>🪶 部落智慧</b><span>${[...g.badges].join('、')||'還沒有'}</span></div>`}
function renderGameLog(){const box=$('#gameLog');if(box)box.innerHTML=gameSession.log.slice(-10).reverse().map(x=>`<p>${escapeHtml(x)}</p>`).join('')}
function addFish(name,n=1){gameSession.fish.set(name,(gameSession.fish.get(name)||0)+n)}
function collectReward(s,half=false){const g=gameSession,coins=half?35:70;g.coins+=coins;if(s.assetType==='land')g.lands.add(s.asset);if(s.assetType==='fish')addFish(s.asset);if(s.assetType==='site')g.sites.add(s.asset);if(s.assetType==='treasure')g.treasures.add(s.asset);if(s.assetType==='badge')g.badges.add(s.asset);g.log.push(`✅ ${s.name}答對，${half?'補救成功':'收進收藏'}，+${coins}。`);renderGameStats();renderGameCollection();renderGameLog()}
async function rollGameDice(){const g=gameSession;if(g.busy||g.turn>=g.maxTurns)return;g.busy=true;const roll=1+Math.floor(Math.random()*6),face=$('#diceFace');const rollBtn=$('#rollDice');if(rollBtn)rollBtn.disabled=true;for(let k=0;k<6;k++){if(face)face.textContent=['⚀','⚁','⚂','⚃','⚄','⚅'][Math.floor(Math.random()*6)];await new Promise(r=>setTimeout(r,70))}if(face)face.textContent=['⚀','⚁','⚂','⚃','⚄','⚅'][roll-1];g.turn++;g.log.push(`🎲 第${g.turn}回合擲到 ${roll}。`);for(let i=0;i<roll;i++){const old=g.pos;g.pos=(g.pos+1)%GAME_BOARD.length;if(g.pos===0&&old!==0){g.coins+=50;g.log.push('🚩 經過起點，航海補給 +50。')}positionToken();await new Promise(r=>setTimeout(r,150))}renderGameStats();renderGameLog();resolveLanding()}
function resolveLanding(){const s=GAME_BOARD[gameSession.pos];if(s.type==='start'){showGameMessage('🚩','回到基隆港','補給完成，下一回合繼續出發。','下一回合');return}if(s.type==='chance'){applyEvent(GAME_CHANCE[Math.floor(Math.random()*GAME_CHANCE.length)],'機會');return}if(s.type==='fate'){applyEvent(GAME_FATE[Math.floor(Math.random()*GAME_FATE.length)],'命運');return}showGameQuestion(s)}
function showGameMessage(icon,title,text,btn='繼續'){const c=$('#gameCenter');c.innerHTML=`<div class="game-event-icon">${icon}</div><span class="mini-kicker">旅程事件</span><h3>${title}</h3><p>${text}</p><button class="primary-btn" id="gameContinue">${btn}</button>`;$('#gameContinue').onclick=finishTurn}
function applyEvent(e,kind){const g=gameSession;g.coins+=e.coins||0;if(e.fish)addFish(e.fish);if(e.land)g.lands.add(e.land);if(e.treasure)g.treasures.add(e.treasure);if(e.badge)g.badges.add(e.badge);if(e.move){g.pos=(g.pos+e.move+GAME_BOARD.length)%GAME_BOARD.length;setTimeout(positionToken,50)}g.log.push(`${kind==='機會'?'🎁':'🌀'} ${e.title} ${e.coins?`+${e.coins}`:''}`);renderGameStats();renderGameCollection();renderGameLog();const c=$('#gameCenter');c.innerHTML=`<div class="game-event-icon">${e.icon}</div><span class="mini-kicker">${kind}</span><h3>${e.title}</h3><p>${e.text}</p><button class="primary-btn" id="gameContinue">收下事件 → 繼續</button>`;$('#gameContinue').onclick=finishTurn}
function showGameQuestion(s){const g=gameSession,q=s.q[Math.floor(Math.random()*s.q.length)];g.totalQ++;g.secondTry=false;const opts=q[1].map((o,i)=>({o,i}));const c=$('#gameCenter');c.innerHTML=`<div class="game-space-title"><span>${s.icon}</span><div><small>${categoryName(s.cat)}</small><h3>${s.name}</h3></div></div><div class="game-question-row"><p class="game-question">${q[0]}</p><button class="speech-btn mini-speech" type="button" data-speech="${encodeURIComponent(q[0]+'。'+q[1].join('、'))}" aria-label="朗讀題目">🔊</button></div><div class="game-choices">${shuffled(opts).map(z=>`<button data-game-answer="${z.i}">${escapeHtml(z.o)}</button>`).join('')}</div><p id="gameFeedback" class="feedback"></p>`;c.querySelectorAll('[data-game-answer]').forEach(b=>b.onclick=()=>{const pick=Number(b.dataset.gameAnswer),ok=pick===q[2],fb=$('#gameFeedback');if(ok){if(!g.secondTry)g.correct++;b.classList.add('correct');fb.textContent=g.secondTry?'補救成功！這次拿半額獎金。':'答對！這個地標／寶物收進你的收藏。';c.querySelectorAll('[data-game-answer]').forEach(x=>x.disabled=true);collectReward(s,g.secondTry);setTimeout(()=>showContinueAfterQuestion(q[3]),380)}else{g.secondTry=true;b.classList.add('wrong');b.disabled=true;fb.textContent=`提示：${q[3]} 再試一次。`;g.log.push(`🧠 ${s.name}第一次答錯，看到提示後重試。`);renderGameLog()}});renderGameStats()}
function showContinueAfterQuestion(tip){const c=$('#gameCenter');const p=document.createElement('div');p.className='game-memory-tip';p.innerHTML=`<b>🧠 記憶點</b><span>${escapeHtml(tip)}</span><button class="primary-btn" id="gameContinue">下一回合</button>`;c.appendChild(p);$('#gameContinue').onclick=finishTurn}
function categoryName(c){return ({geo:'地理定位',climate:'季風與生活',ocean:'洋流與生物',history:'史前文化',tribe:'原住民族文化'})[c]||'事件'}
function finishTurn(){const g=gameSession;g.busy=false;if(g.turn>=g.maxTurns){finishGame();return}$('#gameCenter').innerHTML=gameCenterDefault();bindRoll();renderGameStats()}
function finishGame(){const g=gameSession,collection=gameCollectionCount(g),acc=g.totalQ?Math.round(g.correct/g.totalQ*100):0;state.unit1Game=state.unit1Game||{plays:0,bestCoins:0,bestCorrect:0,bestCollection:0};state.unit1Game.plays++;state.unit1Game.bestCoins=Math.max(state.unit1Game.bestCoins||0,g.coins);state.unit1Game.bestCorrect=Math.max(state.unit1Game.bestCorrect||0,acc);state.unit1Game.bestCollection=Math.max(state.unit1Game.bestCollection||0,collection);state.stars+=Math.max(3,Math.round(acc/20));saveState();renderState();const fishTotal=[...g.fish.values()].reduce((a,b)=>a+b,0);$('#gameCenter').innerHTML=`<div class="game-finish"><span>🏆</span><h3>這局探險完成！</h3><div class="finish-metrics"><b>💰 獎金 ${g.coins}</b><b>🏠 地方資產 ${g.lands.size}</b><b>🐟 漁獲 ${fishTotal}</b><b>🏺 遺址／寶物 ${g.sites.size+g.treasures.size}</b><b>🪶 智慧徽章 ${g.badges.size}</b><b>🎯 正確率 ${acc}%</b></div><div class="finish-collection"><p><b>地方資產：</b>${[...g.lands].join('、')||'尚未取得'}</p><p><b>漁獲：</b>${[...g.fish.entries()].map(([k,v])=>`${k}×${v}`).join('、')||'尚未取得'}</p><p><b>文化收藏：</b>${[...g.sites,...g.treasures,...g.badges].join('、')||'尚未取得'}</p></div><p>${acc>=80?'你的核心線索很穩。下一局會遇到不同格子、不同題目與不同事件。':'先不用背更多；再玩一局，讓相同線索換情境再出現。'}</p><button class="primary-btn" id="playAgain">🎲 再玩一次</button><button class="secondary-btn" id="reviewWeak">🧠 回第一單元救弱點</button></div>`;$('#playAgain').onclick=()=>startUnit1Game(true);$('#reviewWeak').onclick=()=>{$('#gameDialog').close();openGlobalRescue()};renderGameStats()}
function startUnit1Game(reset=false){if(reset||!gameSession)gameSession=newGameSession();renderGameBoard()}
function openUnit1Game(){startUnit1Game(true);$('#gameDialog').showModal()}
window.addEventListener('resize',()=>{if(gameSession&&$('#gameDialog')?.open)positionToken()});

/* ---------- add a game entry inside Unit 1 dialog without adding more bottom navigation ---------- */
const v09OpenUnitBase=openUnit;
openUnit=function(n){v09OpenUnitBase(n);if(n===1){const box=$('#unitContent');if(box&&!box.querySelector('#unitGameInline')){const div=document.createElement('section');div.id='unitGameInline';div.className='unit-game-inline';div.innerHTML='<span>🎲</span><div><b>把三課混在一起玩</b><p>季風、洋流、史前、族群位置會在同一局反覆出現。</p></div><button class="primary-btn">玩寶島藏寶局</button>';div.querySelector('button').onclick=()=>{$('#unitDialog').close();openUnit1Game()};box.appendChild(div)}}};

/* Initialize game card after v0.8 auto-login/render path. */
if(state)renderState();
