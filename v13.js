/* v1.3.0 — board-game challenge upgrade, tiered quiz tracks, matching memory games, map marker calibration */
const V13_VERSION='1.3.0';

/* ---------- Reliable image/source repair ---------- */
if(typeof U2_IMAGES!=='undefined'){
  // Direct Wikimedia original URL verified on 2026-10-31; avoids the broken Special:FilePath filename used before.
  U2_IMAGES.zeelandia='https://upload.wikimedia.org/wikipedia/commons/b/bc/View_of_the_town_Taioan_and_Fort_Zeelandia.jpg';
}
const v13FortGalleryBase=typeof u2FortGallery==='function'?u2FortGallery:null;
u2FortGallery=function(){return `<div class="history-photo-grid"><figure><img src="${U2_IMAGES.zeelandia}" alt="1644年大員市鎮與熱蘭遮城歷史圖" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://commons.wikimedia.org/wiki/Special:FilePath/View_of_the_town_Taioan_and_Fort_Zeelandia.jpg?width=1200'"><figcaption><b>南部港口據點</b><span>熱蘭遮城｜今安平古堡一帶</span><small class="image-credit"><a href="https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&rno=2002.006.0039" target="_blank" rel="noopener">國立臺灣歷史博物館｜熱蘭遮城圖（公眾領域）</a>・<a href="https://commons.wikimedia.org/wiki/File:View_of_the_town_Taioan_and_Fort_Zeelandia.jpg" target="_blank" rel="noopener">Wikimedia Commons 原圖</a></small></figcaption></figure><figure><img src="${U2_IMAGES.provintia}" alt="赤崁樓，普羅民遮城舊址" loading="lazy" referrerpolicy="no-referrer"><figcaption><b>行政與商業據點</b><span>普羅民遮城舊址｜今赤崁樓</span><small class="image-credit"><a href="https://commons.wikimedia.org/wiki/File:Fort_Provintia_(Chihkan_Tower),_Haisheng_Temple,_2026,_Tainan_City_(Taiwan).jpg" target="_blank" rel="noopener">Wikimedia Commons</a>・CC BY 4.0</small></figcaption></figure><figure><img src="${U2_IMAGES.domingo}" alt="淡水紅毛城" loading="lazy" referrerpolicy="no-referrer"><figcaption><b>北部多時代古堡</b><span>西班牙先建聖多明哥城；荷蘭後來在附近重建今日主堡</span><small class="image-credit"><a href="https://commons.wikimedia.org/wiki/File:Fort_San_Domingo.JPG" target="_blank" rel="noopener">Wikimedia Commons</a>・CC BY-SA 3.0</small></figcaption></figure></div>`};

/* ---------- Map marker calibration: marker frame now follows the image itself, not a letterboxed wrapper ---------- */
mapChallengeHtml=function(key,title,img,items,credit){return `<section class="map-lab v13-map-lab" data-map-lab="${key}"><div class="map-lab-head"><div><span class="mini-kicker">互動定位</span><h4>${title}</h4></div><span class="map-progress" id="${key}Progress">1 / ${items.length}</span></div><div class="v13-map-stage"><div class="v13-map-frame"><img src="${img}" alt="${title}" loading="lazy" referrerpolicy="no-referrer"><span id="${key}Marker" class="map-pulse-marker tiny-map-marker v13-map-marker">?</span></div></div><p class="map-credit">${credit}<br><b>定位點已改成跟著圖片本身座標，不再受留白框影響。</b></p><div class="map-question-box"><b id="${key}Prompt"></b><div id="${key}Choices" class="choice-3"></div><p id="${key}Feedback" class="feedback"></p></div></section>`};
// Small coordinate refinements after removing the old object-fit letterboxing.
if(typeof worldItems!=='undefined'){
  const wc=[[67,34],[50,29],[51,53],[19,40],[83,68],[91,44],[35,43],[67,59]];
  worldItems.forEach((q,i)=>{q.x=wc[i][0];q.y=wc[i][1]});
}
if(typeof eastItems!=='undefined'){
  const ec=[[36,45],[76,32],[60,35],[62,80],[51,61],[58,73],[59,47],[83,59]];
  eastItems.forEach((q,i)=>{q.x=ec[i][0];q.y=ec[i][1]});
}

/* ---------- More memory hooks, kept collapsible to avoid textbook-wall feeling ---------- */
const V13_MEMORY={
 '1-1':[
  ['世界定位','「亞東太西、北日南菲」＝臺灣在亞洲東部、太平洋西側；北近日本、南近菲律賓。'],
  ['四周海域','「西海峽、南巴士、東太平、北東海」。'],
  ['季風','「冬東北、夏西南；先看風從哪裡來，再判迎風背風。」'],
  ['海洋季節','「夏鮪冬烏、秋冬琵鷺來」：黑鮪魚春夏、烏魚冬季、黑面琵鷺秋冬度冬。']
 ],
 '1-2':[
  ['三棒接力','「舊長打、新卑磨、金十鐵」＝長濱打製、卑南磨製與農業、十三行鐵器。'],
  ['生活變化','「工具強 → 產量穩 → 聚落大 → 分工多 → 交換廣」。'],
  ['臺灣玉','「花蓮出、各地走、跨海到東南亞」＝產地和出土地不同，就想到交換網。'],
  ['考古判讀','「物是遺物、地是遺跡；年代看層位，生活看證據組合。」']
 ],
 '1-3':[
  ['區域錨點','「東阿美、蘭嶼達悟、湖邵、中央布農、北中泰雅賽夏、南排灣魯凱」。'],
  ['祭典線索','「阿美豐年、布農射耳、賽夏矮靈、達悟飛魚」。'],
  ['生活智慧','「禁忌不是神祕：常是在管季節、資源、共享與共同責任。」'],
  ['分布圖提醒','「看傳統區域，不是把現代族人鎖在地圖色塊裡。」']
 ],
 '2-1':[
  ['大時序','「24荷南、26西北、42西離、61鄭來、62荷離、83鄭終、84清納」。'],
  ['荷蘭兩城','「安平熱蘭遮、赤崁普羅民遮」＝港口軍政貿易 vs 赤崁行政商業。'],
  ['西班牙北上','「菲律賓起、基隆聖薩、淡水聖多」。'],
  ['鄭成功攻臺','「鹿耳門進、先赤崁、再安平；61來、62和」。']
 ],
 '2-2':[
  ['貿易物流','「糖皮換銀→日本；糖皮換軍香→東南亞；絲瓷可能是轉口→馬尼拉」。'],
  ['古堡位置','「安平荷、赤崁荷、基隆西、淡水西起荷重建」。'],
  ['教育人物','「1665全臺首學：鄭經＋陳永華」。'],
  ['地名線索','「營鎮先想屯墾、三貂先想西班牙；但都要再查史料。」']
 ]
};
function v13MemoryPanel(id){const arr=V13_MEMORY[id];if(!arr)return'';return `<details class="v13-memory-bag"><summary>🧠 記憶咒語袋｜不硬背，先抓 4 個鉤子</summary><div class="v13-memory-grid">${arr.map(x=>`<article><b>${x[0]}</b><span>${x[1]}</span></article>`).join('')}</div></details>`}
const v13LessonShellBase=lessonShell;
lessonShell=function(id,stage,body){const extra=(stage===3&&V13_MEMORY[id])?v13MemoryPanel(id):'';v13LessonShellBase(id,stage,body+extra);const note=$('#lessonContent .source-note');if(note){note.textContent=String(id).startsWith('2-')?'第二單元依翰林版公開課程進度、國立臺灣歷史博物館、臺南市文化資產資料與近年公開評量重新整理；古蹟圖像均附來源。':'第一單元依翰林版公開課程進度、政府／博物館資料與近年公開評量重新整理；地圖採公開授權底圖。'}};

/* ---------- Board-game question expansion: sync v1.2 detailed content into repeat-play pools ---------- */
function v13BoardSpace(board,key){return board.find(x=>x.key===key)}
function v13Push(board,key,...qs){const s=v13BoardSpace(board,key);if(!s)return;s.q=s.q||[];qs.forEach(q=>{if(!s.q.some(x=>x[0]===q[0]))s.q.push(q)})}
function v13EventPush(events,event){if(!events.some(e=>e.q&&e.q[0]===event.q[0]))events.push(event)}

// Unit 1: deepen repeat visits with analysis questions rather than direct recall only.
v13Push(V10_U1_BOARD,'world',
 ['如果從臺灣往北、往南各選一個鄰近國家，最適合哪組？',['北日本、南菲律賓','北菲律賓、南日本','北澳洲、南韓國'],0,'把臺灣放在東亞再看南北。','北近日本、南近菲律賓。'],
 ['臺灣面積約3.6萬平方公里，與日本、菲律賓、南韓相比較小。這個比較主要在建立？',['面積量感','國家強弱排名','人口一定多少'],0,'不是背三國精確面積。','比較是幫你建立「臺灣不大但位置重要」的量感。']);
v13Push(V10_U1_BOARD,'seas',
 ['一艘船從高雄往馬尼拉，離臺後最可能先穿越哪個重要海域？',['巴士海峽','東海','日本海'],0,'菲律賓在臺灣南方。','南下往菲律賓會接近巴士海峽。'],
 ['如果題目把「東海」標在臺灣正南方，最可能哪裡錯？',['方向錯了，東海在臺灣北方附近','名稱錯了，沒有東海','東海在南極'],0,'用「北東海」檢查。','東海位於臺灣北方附近。']);
v13Push(V10_U1_BOARD,'winterwind',
 ['冬季東北季風來時，哪個判斷步驟最重要？',['先判風向，再看地形哪一面迎風','只背縣市人口','先看史前年代'],0,'迎背風要先有風向。','判風向→看地形→推降雨與生活。']);
v13Push(V10_U1_BOARD,'tuna',
 ['同一港口不同月份漁獲差很多，最適合從哪兩個因素找原因？',['季節與海洋環境','學校課表與考試','城堡與孔廟'],0,'魚會洄游。','季節、洋流與水溫會影響漁汛。']);
v13Push(V10_U1_BOARD,'eras',
 ['如果只記一條史前年代主線，最值得先記哪個？',['長濱早→卑南中→十三行晚','十三行最早→長濱最晚','三者完全同時'],0,'先後比精確數字更重要。','先抓長濱→卑南→十三行。'],
 ['考題給「打製石器、磨製石器、鐵器」三張圖，最適合怎麼排？',['打製→磨製→鐵器','鐵器→打製→磨製','磨製→鐵器→打製'],0,'對應舊→新→金。','工具技術順序可幫助判時代。']);
v13Push(V10_U1_BOARD,'jade',
 ['考古學家在沒有玉礦的地方發現大量臺灣玉，這個「不在產地卻出土」最關鍵的概念是？',['交換與移動','玉會自然長腳','沒有任何人際交流'],0,'比較來源地與出土地。','來源地和出土地分離，是交換網的重要證據。']);
v13Push(V10_U1_BOARD,'amis',['若只看到「花東＋豐年祭」兩個線索，最適合先想到？',['阿美族','邵族','達悟族'],0,'位置＋祭典一起記。','花東阿美、豐年祭。']);
v13Push(V10_U1_BOARD,'tao',['看到「蘭嶼、飛魚、地下屋、拼板舟」四個線索，最完整的共同核心？',['達悟族順應海島環境形成海洋文化','全部只是觀光活動','與季節和環境無關'],0,'四個線索要串成文化與環境。','達悟族文化把海洋季節、建築與生活規範連在一起。']);

// Unit 2: add v1.2 story details, administration, trade flows, surrender terms and Qing transition.
v13Push(V10_U2_BOARD,'crossroads',
 ['顏思齊、鄭芝龍出現在這一課，最主要提醒我們什麼？',['歐洲勢力來臺前後，東亞海商與漢人海上活動已很活躍','臺灣當時完全沒有人活動','他們都是西班牙總督'],0,'先把臺灣放回17世紀東亞海商世界。','大航海臺灣不是空白舞臺，海商活動早已存在。'],
 ['鄭芝龍早年曾和荷蘭人做翻譯、供應商品，之後又有競爭，這最能說明？',['海上勢力關係會隨利益與政治改變','歷史人物永遠只有朋友或敵人','海商完全不做交易'],0,'這就是「愛恨交疊鏈」。','海商世界的合作與衝突會隨局勢改變。']);
v13Push(V10_U2_BOARD,'southfort',
 ['熱蘭遮城旁同時有商館、倉庫、港口與軍事設施，最能證明？',['荷蘭把它當軍政與貿易核心','它只是單純住宅','它是史前墓地'],0,'功能要一次看完整。','熱蘭遮城同時服務統治、防衛與貿易。'],
 ['今天安平古堡紅頂瞭望塔能直接當成1624荷蘭原貌嗎？',['不能；現場疊加多時代建築，真正荷治遺構只剩部分牆體等','可以，完全沒改過','是西班牙原建'],0,'古蹟要分「地點歷史」與「現存建物年代」。','安平古堡是多時代疊加的歷史現場。']);
v13Push(V10_U2_BOARD,'adminfort',
 ['普羅民遮城為何常被說是行政與商業控制的重要據點？',['它位在赤崁一帶，方便管理市鎮、交易與人口活動','它在高山頂','它只用來養鹿'],0,'赤崁不是港口外堡而已。','普羅民遮強化荷蘭在赤崁地區的行政與商業控制。']);
v13Push(V10_U2_BOARD,'farm',
 ['荷蘭招募漢人開墾，除了增加稻米甘蔗，還會帶來哪個結構性改變？',['移民增加、土地利用與族群關係改變','所有土地衝突消失','臺灣變成無人島'],0,'人口、土地、經濟一起變。','開墾擴張會改變人口與土地使用。']);
v13Push(V10_U2_BOARD,'deer',
 ['「鹿皮賣到日本」若放進完整貿易鏈，還要補哪個觀念？',['臺灣物產透過港口進入跨國市場，同時可能造成生態壓力','鹿皮只在臺灣內部使用','獵鹿不會改變鹿群'],0,'經濟收益與環境代價都要看。','外銷鹿皮是貿易證據，也是資源利用議題。']);
v13Push(V10_U2_BOARD,'northport',
 ['西班牙來臺前的重要基地是馬尼拉，這個資訊最能解釋？',['它從菲律賓往北插入中國、日本的東亞貿易網','它從歐洲直接走陸路到基隆','它只想發展農田'],0,'先看菲律賓在臺灣南方。','馬尼拉是西班牙北上臺灣的區域基地。']);
v13Push(V10_U2_BOARD,'tamsui',
 ['紅毛城最容易出的陷阱是哪一個？',['西班牙先建聖多明哥城，但今日主堡是荷蘭後來在附近重建','今天主堡就是西班牙原城完整保存','紅毛城在臺南安平'],0,'「先西班牙、後荷蘭重建」。','同一地點可疊加不同政權的建築歷史。']);
v13Push(V10_U2_BOARD,'1642',
 ['1642荷蘭在北臺灣擊退西班牙後，最直接結果？',['西班牙勢力退出臺灣，荷蘭控制範圍擴大','鄭氏立即結束','清朝立即納臺'],0,'這是荷西競爭的結果。','1642是荷蘭與西班牙勢力消長的轉折。']);
v13Push(V10_U2_BOARD,'siege',
 ['1661鄭成功從哪個航道線索進入臺江？',['鹿耳門','三貂角','和平島'],0,'教材高頻地名。','鹿耳門是鄭成功攻臺的重要航道線索。'],
 ['1662和約最適合怎麼理解？',['政權移交有協商條款；公司財產與私人動產處理不同','荷蘭所有人只能空手離開','荷蘭可以帶走熱蘭遮城'],0,'公產與私產分開。','和約規範公司財產移交與私人財物、返航物資。']);
v13Push(V10_U2_BOARD,'tuntian',
 ['鄭成功設「承天府」的行政中心線索最接近哪裡？',['赤崁／普羅民遮城舊址一帶','基隆和平島','淡水紅毛城'],0,'鄭氏接手赤崁後設行政中心。','承天府是鄭氏在臺的重要行政設置。'],
 ['陳永華在鄭氏政權最適合歸在哪一條線？',['內政、屯田與教育制度','西班牙傳教','荷蘭鹿皮貿易'],0,'他是鄭氏治理的重要輔臣。','陳永華協助鄭經推動內政與教育。']);
v13Push(V10_U2_BOARD,'tradezheng',
 ['一張帳本寫「臺灣→日本：蔗糖、鹿皮；日本→臺灣：銀」，這叫？',['糖皮換銀','銀換黑鮪','香料換孔廟'],0,'日本銀是重點。','鄭氏對日本貿易常以蔗糖、鹿皮換銀。'],
 ['馬尼拉航線出現絲綢、瓷器，為何不等於「臺灣生產這些貨」？',['臺灣是轉運節點，商品可能從中國等地轉口','所有商品一定在出發港生產','17世紀沒有轉口'],0,'分清出口與轉口。','絲綢、瓷器等可能經臺灣轉運。'],
 ['清鄭戰爭與海禁下，和中國沿海的交易常呈現什麼特性？',['正式貿易受限，秘密或走私交易增加','所有交易完全合法自由','臺灣停止海運'],0,'政治衝突會改變貿易方式。','海禁與戰爭使海上交易更困難且更隱蔽。']);
v13Push(V10_U2_BOARD,'school',
 ['1665「全臺首學」最好用哪組人物記？',['鄭經＋陳永華','鄭成功＋施琅','荷蘭長官＋西班牙總督'],0,'教育線的核心人物。','鄭經採納陳永華建議建立孔廟與學校。'],
 ['媽祖、玄天上帝等信仰為什麼會在鄭氏時期更常出現？',['漢人移民把故鄉信仰與生活習俗帶來臺灣','荷蘭人強迫所有人信奉','史前文化直接建立廟宇'],0,'人口移動也帶文化。','移民會帶來宗教、語言與生活習俗。']);
v13Push(V10_U2_BOARD,'society',
 ['荷蘭地方會議召集村社長老，最能證明？',['外來統治不只做生意，也透過制度介入政治治理','荷蘭完全不管理村社','只有傳教沒有政治'],0,'地方會議是治理線索。','荷蘭透過地方會議、長老等方式進行治理與控制。'],
 ['若題目問「大航海留下的影響」，哪個答案最完整？',['古蹟、文字宗教、物種、貿易、移民教育與族群衝擊都要看','只寫戰爭年份','只寫一座城堡'],0,'影響是多面向。','把有形與無形、利益與代價一起看。']);

v13EventPush(V10_U2_EVENTS,{key:'u2e7',icon:'🧑🏻‍✈️',label:'海商轉向',q:['鄭芝龍早年曾與荷蘭合作，後來關係改變。這張牌要你記住？',['海商關係會隨利益與政治改變','歷史只有永久朋友','海商不做貿易'],0,'合作與競爭會變動。','17世紀海上世界是動態關係網。'],reward:{group:'badges',name:'海商關係徽章',coins:90}});
v13EventPush(V10_U2_EVENTS,{key:'u2e8',icon:'📜',label:'和約查驗',q:['1662和約中，哪個說法較精確？',['公司財產移交；私人動產與返航糧食等另有條件','荷蘭可帶走所有城堡','所有私人物品全沒收'],0,'分公產與私產。','政權更替也有談判與條款。'],reward:{group:'evidence',name:'1662和約卡',coins:110}});
v13EventPush(V10_U2_EVENTS,{key:'u2e9',icon:'⚓',label:'澎湖轉折',q:['1683施琅率清軍擊敗鄭軍的重要戰役在哪裡？',['澎湖','淡水','安平'],0,'83澎湖、84清納。','1683澎湖海戰後鄭氏政權結束，1684清帝國正式納臺。'],reward:{group:'assets',name:'1683澎湖轉折卡',coins:100}});

/* ---------- Better game feel: larger challenge text + combo bonus ---------- */
const v13NewGameBase=v10NewGame;
v10NewGame=function(c){const g=v13NewGameBase(c);g.streak=0;g.bestStreak=0;return g};
const v13StatsBase=v10Stats;
v10Stats=function(){v13StatsBase();const el=$('#gCombo');if(el&&v10GameSession)el.textContent=`${v10GameSession.streak||0}連勝`};
const v13RenderBoardBase=v10RenderBoard;
v10RenderBoard=function(){v13RenderBoardBase();const bar=$('.v10-statbar');if(bar&&!$('#gCombo')){const s=document.createElement('span');s.innerHTML='🔥 <b id="gCombo">0連勝</b>';bar.appendChild(s)}v10Stats()};
// Rebuild question handler so correct-first-try creates a small combo bonus.
v10ShowQuestion=function(item,isEvent){const g=v10GameSession,c=g.config,q=isEvent?item.q:v10PickFresh(c,item,item.q);g.totalQ++;let wrong=0;const opts=q[1].map((o,i)=>({o,i}));$('#gameCenter').innerHTML=`<div class="game-space-title v10-title"><span>${item.icon}</span><div><small>${isEvent?'機會／命運挑戰':v10CatName(item.cat)}</small><h3>${item.label}</h3></div></div><div class="mystery-lock">🔒 先破解；答案與記憶句答對後才解鎖</div><div class="game-question-row"><p class="game-question v10-game-question">${q[0]}</p><button class="speech-btn mini-speech" type="button" data-speech="${encodeURIComponent(q[0]+'。'+q[1].join('、'))}" aria-label="朗讀題目">🔊</button></div><div class="game-choices v10-choices">${shuffled(opts).map(z=>`<button data-game-answer="${z.i}">${escapeHtml(z.o)}</button>`).join('')}</div><p id="gameFeedback" class="feedback"></p>`;$('#gameCenter').querySelectorAll('[data-game-answer]').forEach(b=>b.onclick=()=>{const ok=Number(b.dataset.gameAnswer)===q[2],fb=$('#gameFeedback');if(ok){if(wrong===0){g.correct++;g.streak=(g.streak||0)+1;g.bestStreak=Math.max(g.bestStreak||0,g.streak);if(g.streak>=2){const bonus=Math.min(40,g.streak*5);g.coins+=bonus;g.log.push(`🔥 ${g.streak}連勝，加碼 +${bonus}`)}}else g.streak=0;b.classList.add('correct');$('#gameCenter').querySelectorAll('[data-game-answer]').forEach(x=>x.disabled=true);v10Reward(item,wrong>0);setTimeout(()=>{const reveal=item.reveal||item.label;const card=document.createElement('div');card.className='game-memory-tip reveal-card';card.innerHTML=`<b>🔓 解鎖：${escapeHtml(reveal)}</b><span>${escapeHtml(q[4]||q[3])}</span>${g.streak>=2?`<em class="combo-chip">🔥 ${g.streak} 連勝！</em>`:''}<button class="primary-btn game-big-btn" id="gameContinue">下一回合</button>`;$('#gameCenter').appendChild(card);$('#gameContinue').onclick=v10FinishTurn;v10Stats()},260)}else{wrong++;g.streak=0;b.classList.add('wrong');b.disabled=true;fb.textContent=`還沒破解。提示：${q[3]}`;g.log.push(`🧠 ${item.label} 第${wrong}次未解開。`);v10RenderLog();v10Stats()}});v10Stats()};

/* ---------- Categorized / tiered lesson challenge instead of 43-question walls ---------- */
const V13_TRACKS={
 '1-1':[
  ['geo','🗺️ 地圖定位','洲洋、鄰國、海域、離島','洲|洋|位置|海峽|東海|日本|菲律賓|澎湖|金門|馬祖|蘭嶼|面積'],
  ['climate','🌬️ 氣候環境','季風、迎背風、建築與產業','季風|風向|迎風|背風|菜宅|柿餅|地下屋|風獅爺|養殖'],
  ['ocean','🌊 海洋生物','洋流、漁汛、候鳥','洋流|漁|魚|鮪|烏魚|琵鷺|候鳥|濕地|遷徙'],
  ['life','🏠 生活應用','把地理線索放進生活情境','為什麼|最能|如果|情境|特色|發展|影響']
 ],
 '1-2':[
  ['time','⏳ 時代排序','舊石器、新石器、金屬器與年代','年代|時代|先後|舊石器|新石器|金屬器|長濱|卑南|十三行'],
  ['artifact','🏺 遺物遺跡','用證據猜生活','遺物|遺跡|石器|陶器|鐵器|石板棺|火塘|工具'],
  ['trade','💚 生產交換','臺灣玉、分工與跨海交換','玉|交換|分工|跨海|出土|產地|外來|交易'],
  ['inquiry','🔎 遺址探究','從證據做推論','推論|證據|為什麼|如何|最合理|研究|探究|生活']
 ],
 '1-3':[
  ['place','🗺️ 族群位置','先用地理位置建立錨點','分布|山區|東部|蘭嶼|日月潭|花東|位置|哪一族'],
  ['culture','🎎 祭典文化','族群與祭典、傳說、工藝','祭|豐年|射耳|矮靈|飛魚|gaga|織布|白鹿|百步蛇'],
  ['wisdom','🌿 生活智慧','狩獵、共享、季節與永續','狩獵|禁忌|共享|互助|永續|資源|規範|季節'],
  ['scenario','🧠 情境判讀','避免刻板印象，從線索推理','最適合|最能|如果|不能|不代表|理解|情境']
 ],
 '2-1':[
  ['route','🧭 航路地理','臺灣、菲律賓、臺南、基隆、淡水','位置|航路|菲律賓|臺南|基隆|淡水|安平|赤崁|鹿耳門|港'],
  ['powers','🏰 荷西據點','荷蘭、西班牙、城堡與治理','荷蘭|西班牙|熱蘭遮|普羅民遮|聖薩爾瓦多|聖多明哥|地方會議|紅毛城'],
  ['timeline','⏳ 人物時序','顏思齊、鄭芝龍、鄭成功、施琅與年份','顏思齊|鄭芝龍|鄭成功|施琅|1624|1626|1642|1661|1662|1683|1684|先後'],
  ['reason','🔗 歷史推理','為什麼來、如何競爭、結果是什麼','為什麼|原因|結果|影響|最能|最完整|關係|和約|推論']
 ],
 '2-2':[
  ['heritage','🏛️ 古蹟文字','城堡、新港文書、宗教與地名','古蹟|城|紅毛|安平|赤崁|新港|羅馬|三貂|宗教|傳教'],
  ['trade','📦 貿易物流','日本、東南亞、中國沿海與轉口','日本|東南亞|中國|菲律賓|馬尼拉|蔗糖|鹿皮|銀|香料|軍火|絲綢|瓷器|轉口|走私'],
  ['society','🏫 教育地名','孔廟、陳永華、軍屯與移民信仰','孔廟|全臺首學|陳永華|鄭經|軍屯|新營|左營|媽祖|玄天上帝|移民'],
  ['impact','🧩 多元影響','交流、治理、土地與族群衝擊','影響|原住民|土地|治理|地方會議|衝突|文化|人口|最完整|多元']
 ]
};
const V13_MATCH_BANK={
 '1-1':[['澎湖','菜宅擋強風'],['新竹新埔','九降風曬柿餅'],['屏東東港','春夏黑鮪魚'],['臺南西南沿海','秋冬黑面琵鷺'],['蘭嶼','地下屋＋達悟海洋文化'],['臺灣西側','臺灣海峽']],
 '1-2':[['長濱文化','舊石器＋打製石器'],['卑南文化','新石器＋農業聚落'],['十三行文化','金屬器＋煉鐵交換'],['花蓮豐田','臺灣玉原料'],['八仙洞','長濱文化重要遺址'],['新北八里','十三行遺址']],
 '1-3':[['阿美族','花東＋豐年祭'],['泰雅族','北中山區＋gaga'],['布農族','中央山區＋射耳祭'],['邵族','日月潭＋白鹿傳說'],['達悟族','蘭嶼＋飛魚'],['賽夏族','新竹苗栗＋矮靈祭']],
 '2-1':[['1624','荷蘭南臺灣'],['1626','西班牙北臺灣'],['1642','西班牙退出臺灣'],['1661','鄭成功鹿耳門進臺江'],['1662','荷蘭離臺'],['1683→1684','澎湖海戰→清帝國納臺']],
 '2-2':[['安平古堡一帶','熱蘭遮城'],['赤崁樓','普羅民遮城舊址'],['淡水紅毛城','西班牙先建據點、荷蘭後重建'],['日本','糖皮換銀'],['東南亞','糖皮換軍火香料'],['1665','孔廟＋學校／全臺首學']]
};
function v13Difficulty(q){const t=q[0];if(/較精確|最完整|不應|不能|推論|證據|為什麼|關係|如果|最能|最合理/.test(t))return 3;if(/影響|原因|功能|如何|說明|代表|結果/.test(t))return 2;return 1}
function v13TrackPool(id,track){const l=lessons[id],re=new RegExp(track[3]);let pool=l.quiz.map((q,i)=>({q,i,d:v13Difficulty(q)})).filter(x=>re.test(x.q[0]+' '+(x.q[3]||'')));if(pool.length<6){const seen=new Set(pool.map(x=>x.i));l.quiz.forEach((q,i)=>{if(pool.length<8&&!seen.has(i)){pool.push({q,i,d:v13Difficulty(q)});seen.add(i)}})}return pool}
function v13TrackState(){state.v13Tracks=state.v13Tracks||{};return state.v13Tracks}
function v13PassedTracks(id){const t=v13TrackState()[id]||{};return Object.values(t).filter(v=>v>=80).length}
function renderTieredQuiz(id){const tracks=V13_TRACKS[id]||[];const passed=v13PassedTracks(id);lessonShell(id,5,`<div class="v13-quiz-hub"><div class="v13-quiz-hero"><span>🎯</span><div><h3>分區闖關，不再一次塞 ${lessons[id].quiz.length} 題</h3><p>每次挑一個概念區，只做 6 題；題目由 <b>★基礎 → ★★應用 → ★★★挑戰</b> 排進來。完成任意 <b>3 區達 80%</b> 就過關。</p></div></div><div class="v13-track-grid">${tracks.map(t=>{const best=(v13TrackState()[id]||{})[t[0]]||0;return `<button class="v13-track-card ${best>=80?'passed':''}" data-v13-track="${t[0]}"><span>${t[1].split(' ')[0]}</span><b>${t[1].replace(/^\S+\s/,'')}</b><small>${t[2]}</small><em>${best?`最佳 ${best}%`:'6題挑戰'}</em></button>`}).join('')}</div><button class="v13-match-card" id="v13MatchStart"><span>🧩</span><div><b>連連看記憶戰</b><small>5 組線索，不算入過關門檻；用配對把零散知識黏起來。</small></div><i>開始</i></button><div class="v13-track-status">目前通過 <b>${passed}/3</b> 個概念區 ${passed>=3?'✅':''}</div></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一關</button><button class="primary-btn" id="finishQuiz" ${passed>=3?'':'disabled'}>${passed>=3?'前往錯題救援':'先完成 3 個概念區'}</button></div>`);$('#stagePrev').onclick=()=>openLesson(id,4);$$('[data-v13-track]').forEach(b=>b.onclick=()=>v13StartTrack(id,b.dataset.v13Track));$('#v13MatchStart').onclick=()=>v13StartMatch(id);$('#finishQuiz').onclick=()=>{if(v13PassedTracks(id)<3)return;state.lessonQuizBest[id]=Math.max(state.lessonQuizBest[id]||0,Math.ceil(lessons[id].quiz.length*.8));completeStage(id,5);saveState();openLesson(id,6)}}
function v13StartTrack(id,key){const track=V13_TRACKS[id].find(x=>x[0]===key),pool=v13TrackPool(id,track),recentKey=`v13Recent_${id}_${key}`;state[recentKey]=state[recentKey]||[];const recent=new Set(state[recentKey]);let candidates=pool.filter(x=>!recent.has(x.i));if(candidates.length<6)candidates=pool.slice();candidates=shuffled(candidates).slice(0,6).sort((a,b)=>a.d-b.d);let i=0,correct=0;function draw(){const item=candidates[i],q=item.q,all=q[1].map((o,j)=>({o,j}));$('#lessonContent .rich-stage').innerHTML=`<div class="v13-track-play"><div class="v13-track-top"><button class="text-btn" id="backTrackHub">← 換分類</button><span>${track[1]}</span><b>${i+1}/6</b></div><div class="v13-level">${'★'.repeat(item.d)}${'☆'.repeat(3-item.d)} ${['','基礎定位','應用連結','挑戰推理'][item.d]}</div>${quizVisual?quizVisual(id,item.i):''}<h3 class="question-line"><span>${q[0]}</span>${speechBtn(q[0],'朗讀題目')}</h3><div class="choice-3 quiz-choice-3">${(()=>{const c=all.find(x=>x.j===q[2]),w=shuffled(all.filter(x=>x.j!==q[2])).slice(0,2);return shuffled([c,...w]).map(z=>`<button data-v13-opt="${z.j}">${z.o}</button>`).join('')})()}</div><p class="feedback" id="v13TrackFeedback"></p><div class="mini-progress"><i style="width:${Math.round(i/6*100)}%"></i></div></div>`;$('#backTrackHub').onclick=()=>renderTieredQuiz(id);$$('[data-v13-opt]').forEach(b=>b.onclick=()=>{const ok=Number(b.dataset.v13Opt)===q[2];if(ok){correct++;b.classList.add('correct');clearWrong(`quiz-${id}-${item.i}`);$('#v13TrackFeedback').textContent='答對！下一題會再提高一點難度。'}else{b.classList.add('wrong');$('#v13TrackFeedback').textContent=`提示：${q[3]}`;addWrong(`quiz-${id}-${item.i}`,id,q[0],q[3],'quiz')}$$('[data-v13-opt]').forEach(x=>x.disabled=true);setTimeout(()=>{i++;if(i<6)draw();else finish()},ok?450:900)})}function finish(){const pct=Math.round(correct/6*100),ts=v13TrackState();ts[id]=ts[id]||{};ts[id][key]=Math.max(ts[id][key]||0,pct);state[recentKey]=[...new Set([...state[recentKey],...candidates.map(x=>x.i)])].slice(-12);if(pct>=80)state.stars+=3;saveState();$('#lessonContent .rich-stage').innerHTML=`<div class="v13-track-result"><span>${pct>=80?'🏆':'🧠'}</span><h3>${track[1]}｜${pct}分</h3><p>答對 ${correct}/6。${pct>=80?'這區通過！下次會優先換一批題。':'先看錯題提示，再來一次會更穩。'}</p><button class="primary-btn" id="trackBackHub">回分類地圖</button><button class="secondary-btn" id="trackAgain">換一批再玩</button></div>`;$('#trackBackHub').onclick=()=>renderTieredQuiz(id);$('#trackAgain').onclick=()=>v13StartTrack(id,key)}draw()}
function v13StartMatch(id){const bank=shuffled(V13_MATCH_BANK[id]||lessons[id].pairs).slice(0,5),right=shuffled(bank.map(x=>x[1]));let selected=null,done=new Set();$('#lessonContent .rich-stage').innerHTML=`<div class="v13-match-play"><div class="v13-track-top"><button class="text-btn" id="backTrackHub">← 回分類</button><span>🧩 連連看記憶戰</span><b>0/${bank.length}</b></div><p>先點左邊，再點右邊。每接對一組，就把「地點／人物」和「特色／事件」黏在一起。</p><div class="v13-match-board"><div>${bank.map((x,i)=>`<button data-v13-left="${i}">${x[0]}</button>`).join('')}</div><div>${right.map(x=>`<button data-v13-right="${escapeHtml(x)}">${x}</button>`).join('')}</div></div><p class="feedback" id="v13MatchFeedback">開始配對！</p></div>`;$('#backTrackHub').onclick=()=>renderTieredQuiz(id);$$('[data-v13-left]').forEach(b=>b.onclick=()=>{$$('[data-v13-left]').forEach(x=>x.classList.remove('selected'));selected=b;b.classList.add('selected')});$$('[data-v13-right]').forEach(b=>b.onclick=()=>{if(!selected){$('#v13MatchFeedback').textContent='先選左邊一張。';return}const i=Number(selected.dataset.v13Left),ok=bank[i][1]===b.dataset.v13Right;if(ok){selected.disabled=true;b.disabled=true;selected.classList.add('correct');b.classList.add('correct');done.add(i);selected=null;$('.v13-track-top b').textContent=`${done.size}/${bank.length}`;$('#v13MatchFeedback').textContent='接對！';if(done.size===bank.length){state.v13MatchDone=state.v13MatchDone||[];if(!state.v13MatchDone.includes(id)){state.v13MatchDone.push(id);state.stars+=2}saveState();setTimeout(()=>{$('#lessonContent .rich-stage').innerHTML=`<div class="v13-track-result"><span>🧩</span><h3>五組全接上了！</h3><p>連連看不是另外背一次，而是把「位置／人物 → 特色／事件」做成一條記憶路徑。</p><button class="primary-btn" id="trackBackHub">回分類地圖</button><button class="secondary-btn" id="trackAgain">再抽 5 組</button></div>`;$('#trackBackHub').onclick=()=>renderTieredQuiz(id);$('#trackAgain').onclick=()=>v13StartMatch(id)},350)}}else{$('#v13MatchFeedback').textContent='這兩張不是直接關係，再找更貼近的配對。';selected.classList.add('wrong');setTimeout(()=>selected&&selected.classList.remove('wrong'),350)}})}
// Replace the giant quiz wall for all five lessons in Units 1–2.
renderUnit1VisualQuiz=function(id){return renderTieredQuiz(id)};
renderQuizStage=function(id){if(V13_TRACKS[id])return renderTieredQuiz(id);return v07RenderQuizStage(id)};

/* ---------- Unit 2 board subtitle to advertise deeper v1.2 synced pool ---------- */
if(typeof V10_GAME_CONFIGS!=='undefined'){
 V10_GAME_CONFIGS.u1.subtitle='線索→挑戰→解鎖；同格會換題，還有連勝加碼。地理、氣候、史前與族群一起混合提取。';
 V10_GAME_CONFIGS.u2.subtitle='v1.2故事內容已同步：海商、荷西據點、1662和約、鄭氏物流、陳永華與1683/1684都會反覆抽到。';
}

/* ---------- Source/version polish ---------- */
const v13OpenUnitBase=openUnit;
openUnit=function(n){v13OpenUnitBase(n);const box=$('#unitContent');if(!box)return;const note=box.querySelector('.v12-unit-note');if(note&&n===2)note.innerHTML='<b>🎮 v1.3 遊戲整合版</b><span>先學分課故事，再用分類闖關、連連看與大航海任務局反覆提取；不再一次做四十多題。</span>'};

if(state){state.v13Tracks=state.v13Tracks||{};saveState();renderState()}

/* ---------- v1.3 final board-depth additions ---------- */
v13Push(V10_U2_BOARD,'crossroads',
 ['顏思齊、鄭芝龍等海商故事放進大航海單元，最重要不是背傳說，而是看懂？',['臺灣海域早已是東亞海商活動網的一部分','歐洲人來前臺灣周邊完全沒有海上活動','所有海商都是同一國政府官員'],0,'把人物放回海路網。','海商活動說明臺灣周邊早已連入中國、日本與東南亞海上交流。']);
v13Push(V10_U2_BOARD,'siege',
 ['1662和約若寫「荷蘭人的私人動產可依條件帶走」，哪個理解較精確？',['政權更替伴隨談判，不等於所有私人財物都被沒收','荷蘭可把城堡整座搬走','鄭軍沒有取得任何據點'],0,'注意公司財產與私人動產不同。','和約條款可訓練孩子分辨「戰敗」與「所有財產全失」不是同一句話。']);
v13Push(V10_U2_BOARD,'tuntian',
 ['承天府、軍屯與陳永華三條線放在一起，最適合歸納成？',['鄭氏把臺灣從軍事基地逐步經營成有行政與生產制度的政權中心','西班牙北臺灣傳教制度','荷蘭只做鹿皮貿易'],0,'行政＋生產＋內政。','承天府、屯墾及陳永華的治理都屬鄭氏經營臺灣的重要線索。']);
v13Push(V10_U2_BOARD,'tradezheng',
 ['一艘船在馬尼拉卸下絲綢、瓷器，再帶回其他物資，這最能提醒我們？',['要分清臺灣自產出口與經臺灣轉口的商品','所有經過臺灣的貨都在臺灣製造','馬尼拉不屬大航海貿易網'],0,'「經過」不等於「生產」。','大航海貿易要分出口、進口與轉口。']);
v13Push(V10_U2_BOARD,'society',
 ['荷蘭地方會議、鄭氏開墾、漢人移民放在同一張圖，最適合問哪個問題？',['不同政權如何改變土地利用與族群關係？','哪個城堡最高？','哪種貨物最甜？'],0,'把制度、土地與人群一起看。','社會科高階題常要求從多個證據歸納治理與族群影響。']);
v13Push(V10_U2_BOARD,'school',
 ['1683、1684應如何分辨？',['1683澎湖海戰後鄭氏結束；1684清帝國正式將臺灣納入版圖','1683清正式納臺；1684荷蘭來臺','兩年都代表西班牙進北臺灣'],0,'口訣：83鄭終、84清納。','1683是戰事與鄭氏政權結束的轉折，1684才是清帝國正式納臺。']);

/* ---------- v1.3 concept-bank enrichment: more authentic questions behind the 6-question UI ---------- */
function v13QuizPush(id,...qs){if(lessons[id]&&Array.isArray(lessons[id].quiz))lessons[id].quiz.push(...qs)}
v13QuizPush('1-1',
 ['如果冬季東北季風很強，澎湖居民用石牆圍成菜宅，最能說明什麼？',['人會依氣候環境調整生活方式','強風只會影響海上船隻','菜宅主要為了增加豪華裝飾'],0,'把「強風→擋風」連起來。'],
 ['同樣是冬季東北季風，臺灣東北部比西南部常更濕，最適合用哪個概念說明？',['迎風面與背風面','五大洲位置','史前年代'],0,'風遇到地形會造成降雨差異。'],
 ['黑鮪魚與烏魚在不同季節出現，最能說明哪個海洋特色？',['季節、洋流與魚群洄游會改變漁汛','所有魚全年固定在同一處','漁業和海水條件無關'],0,'夏鮪冬烏是季節線索。'],
 ['黑面琵鷺秋冬到臺灣西南沿海度冬，最能說明臺灣的哪個位置功能？',['東亞候鳥遷徙的重要中繼站','世界最大沙漠中心','南極冰原的一部分'],0,'候鳥會沿遷徙路線停棲。'],
 ['如果你是地方規畫者，要替澎湖設計農田防風設施，最合理的做法是？',['利用石牆降低強風直接吹襲','把所有作物種到沒有遮蔽的高處','完全不考慮季風'],0,'情境題要把環境條件放進決策。'],
 ['如果要替蘭嶼傳統地下屋寫一句解說，哪句最能連結環境與生活？',['降低屋體、因應強風颱風與炎熱','為了靠近雪地取暖','與海島氣候沒有關係'],0,'建築是適應環境的生活智慧。'],
 ['如果觀光海報寫「冬天到臺灣西部看黑鮪魚汛」，最需要修正哪裡？',['黑鮪魚主要連結春末夏季，冬季常見烏魚汛','黑鮪魚只生活在淡水湖','臺灣沒有季節性漁獲'],0,'記「夏鮪冬烏」。'],
 ['要用一個例子證明「人會善用在地資源」，哪組最有說服力？',['沿海魚塭養殖＋依水域條件發展漁業','高山地區大量造海港','完全忽略土地與氣候'],0,'生活特色要和地方條件連起來。']
);
v13QuizPush('1-2',
 ['考古學家在遺址找到大量磨製石器、陶器與定居聚落，最可能屬於哪類生活轉變？',['新石器時代農業與定居增加','舊石器只靠打製石器','現代都市工業'],0,'磨製石器＋陶器＋聚落是新石器重要線索。'],
 ['同一遺址出現鐵器、玻璃珠與外來陶器，最值得進一步探究什麼？',['是否有技術分工與區域交換','是否完全與外界隔絕','是否沒有生產活動'],0,'外來物品是交流的證據。'],
 ['臺灣玉原料在花蓮，成品卻在臺灣各地甚至東南亞出土，最合理的生產交換推論是？',['已有加工分工與跨海交換網','每一地都自然長出相同玉器','史前人完全不會航海'],0,'產地和出土地不同就是交換線索。'],
 ['生產力提高後，哪個連鎖最合理？',['剩餘增加→分工增加→交換擴大','工具進步→所有人停止合作','農業增加→聚落一定消失'],0,'把生產力和社會變化串成因果。'],
 ['用5W1H探究卑南遺址，「WHERE」最適合問什麼？',['遺址在哪裡、周邊有哪些地形與資源？','誰最會唱歌？','今天氣溫幾度就能解釋全部歷史？'],0,'WHERE問位置與環境。'],
 ['用5W1H探究十三行遺址，「HOW」最適合問什麼？',['人們如何煉鐵、取得食物並和外地交換？','遺址名稱有幾個字？','哪一張照片最漂亮？'],0,'HOW問生活與技術如何運作。'],
 ['若研究者只看到一件玉器就斷言「一定從東南亞來」，最需要補做什麼？',['比對材質來源、出土層位與其他證據','直接相信猜測','忽略出土地點'],0,'考古推論需要多種證據交叉。']
);
v13QuizPush('1-3',
 ['看到「蘭嶼、飛魚、拼板舟」三個位置與文化線索，最可能是哪一族？',['達悟族','邵族','賽夏族'],0,'蘭嶼是最強地理錨點。'],
 ['看到「日月潭、白鹿傳說」兩個位置線索，最可能是哪一族？',['邵族','阿美族','布農族'],0,'日月潭→邵族。'],
 ['狩獵規範限制繁殖季捕獵，最可能具有什麼生活智慧？',['讓資源有恢復機會、維持永續','讓所有獵物立刻消失','和自然環境完全無關'],0,'禁忌也可能具有資源管理功能。'],
 ['部落把獵物分享給需要的人，最能表現哪一種生活智慧？',['共享互助與共同責任','只重視個人占有','禁止任何合作'],0,'共享是部落互助的重要線索。'],
 ['達悟族依飛魚季節安排捕撈與禁忌，最適合如何理解？',['依海洋節律調整利用資源的時機','一年四季無限制捕撈','只是一個和環境無關的名稱'],0,'季節＋規範＝環境智慧。'],
 ['如果同學說「分布圖上是排灣族區，所以今天住在那裡的人一定都是排灣族」，你應如何判斷？',['不正確；分布圖多呈現傳統區域，現代人口流動更廣','完全正確，不需查資料','所有原住民族都只住都市'],0,'避免把傳統分布當現代唯一居住範圍。'],
 ['如果祭典題只要死背名稱，會漏掉什麼重要概念？',['祭典常連結祖先記憶、季節、社會規範與環境','祭典只有服裝顏色','祭典和族群文化無關'],0,'要理解背後功能，不只配對名稱。'],
 ['遇到不熟悉的原住民族習俗，最好的解題方式是？',['先看地理位置、資源與活動線索，再推族群與文化','只猜最常見族名','把所有族群視為相同'],0,'位置＋環境＋文化線索一起判讀。']
);
