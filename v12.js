/* v1.2.0 — full-page lessons + story-driven Unit 2 + richer life-based assessment */
const V12_VERSION='1.2.0';

/* ---------- Version label ---------- */
document.querySelectorAll('.version-badge').forEach(el=>el.textContent='程式 v1.2.0');
document.querySelectorAll('.top-version').forEach(el=>el.textContent='v1.2.0');

/* ---------- Turn Unit/Lesson dialogs into full-page course views ---------- */
['lessonDialog','unitDialog'].forEach(id=>{
  const dlg=document.getElementById(id);
  if(!dlg)return;
  dlg.classList.add('full-course-page');
  const close=dlg.querySelector('.close-btn');
  if(close){close.textContent='←';close.setAttribute('aria-label','回上一頁');close.title='回上一頁'}
});

/* ---------- Unit 2 detailed story visuals ---------- */
function v12StoryHero(){return `<section class="story-hero-v12">
 <div class="story-hero-copy"><span class="story-kicker">⛵ 400 年前的臺灣海上連續劇</span><h3>不是「誰來統治」而已，而是大家都想搶這條海路</h3><p>先把臺灣放在中國沿海、日本、菲律賓與東南亞之間。商人要貨、國家要據點、軍隊要糧食、傳教士要接觸人群——同一座島，因此同時被很多人盯上。</p></div>
 <div class="story-hero-tags"><span>💰 貿易</span><span>🏰 據點</span><span>⚔️ 競爭</span><span>🧑🏽‍🤝‍🧑🏽 移民</span><span>⛪ 傳教</span><span>🌾 開墾</span></div>
 </section>`}

function v12SeaActors(){return `<section class="story-section-v12"><div class="story-section-head"><span>🎭</span><div><h4>第一幕｜外國人還沒來以前，臺灣海上已經很熱鬧</h4><p>先認識「海商、漁民、原住民族」，再進荷蘭、西班牙與鄭氏，故事才不會像外國人突然闖進一座空島。</p></div></div>
 <div class="actor-grid-v12">
  <article><div class="actor-avatar">🧑🏽‍🌾</div><b>臺灣原住民族</b><p>長期在島上生活，依不同環境發展農耕、漁獵與交換。後來面對外來貿易、傳教與統治，各社群反應並不相同。</p></article>
  <article><div class="actor-avatar">⛵</div><b>中國、日本海商</b><p>16、17 世紀已穿梭東亞海域。中國商品、日本白銀、東南亞香料，都可能透過海路交換。</p></article>
  <article><div class="actor-avatar">🗺️</div><b>顏思齊</b><p>課本與參考書常把他和鄭芝龍、漢人移入及雲林嘉義一帶開墾連在一起；史學界對精確登陸與據點位置仍有討論，因此記「西部海上活動＋招募移民」比死背一個點更穩。</p></article>
  <article><div class="actor-avatar">⚓</div><b>鄭芝龍</b><p>早年活躍東亞海上貿易，1624 年也曾替荷蘭人翻譯；後來勢力壯大、接受明朝招撫。這讓孩子看見：海商關係會從合作變競爭，不是一開始就固定敵我。</p></article>
 </div>
 <div class="memory-callout-v12"><b>🧠 故事記法</b><span>「島上有人 → 海上有人做生意 → 臺灣又剛好在航線旁 → 外國勢力才會搶著來。」</span></div></section>`}

function v12LoveHateChain(){return `<section class="story-section-v12"><div class="story-section-head"><span>🕸️</span><div><h4>第二幕｜愛恨交疊鏈：合作、搶生意、打仗、接手治理</h4><p>把人物與國家放在同一條鏈，會比一個一個背容易很多。</p></div></div>
 <div class="lovehate-chain-v12">
  <article data-tone="trade"><time>17世紀初</time><span>⛵</span><b>顏思齊・鄭芝龍等海商</b><p>臺灣西部與東亞海路已有商業、漁業與移民活動。</p><em>關係：先有海上網絡</em></article>
  <i>→</i>
  <article data-tone="dutch"><time>1624</time><span>🇳🇱</span><b>荷蘭進南臺灣</b><p>在大員／臺南建立轉運與統治據點。</p><em>目標：中國商品＋日本白銀＋區域貿易</em></article>
  <i>⇄</i>
  <article data-tone="spanish"><time>1626</time><span>🇪🇸</span><b>西班牙進北臺灣</b><p>從菲律賓馬尼拉北上，想插入中國、日本貿易。</p><em>對手：荷蘭</em></article>
  <i>⚔️</i>
  <article data-tone="dutch"><time>1642</time><span>🏆</span><b>荷蘭北上獲勝</b><p>西班牙退出，荷蘭勢力擴大到北臺灣。</p><em>結果：西班牙離臺</em></article>
  <i>⚔️</i>
  <article data-tone="zheng"><time>1661–1662</time><span>🛶</span><b>鄭成功攻荷</b><p>鹿耳門進入臺江，先取普羅民遮，再圍熱蘭遮，最後和談。</p><em>結果：荷蘭離臺，鄭氏接手</em></article>
  <i>→</i>
  <article data-tone="zheng"><time>1662–1683</time><span>🏛️</span><b>鄭氏經營</b><p>承天府、屯墾、海貿、教育；鄭經時期由陳永華等人協助治理。</p><em>重點：從戰爭走向經營</em></article>
  <i>⚔️</i>
  <article data-tone="qing"><time>1683→1684</time><span>🛡️</span><b>施琅・清帝國</b><p>1683 澎湖海戰後鄭氏投降；1684 清帝國正式將臺灣納入版圖。</p><em>下一單元開始</em></article>
 </div>
 <p class="accuracy-note-v12">📌 <b>日期別混：</b>不是 1648。要記「1683 鄭氏結束、1684 清帝國正式納臺」。</p></section>`}

function v12DutchEpisode(){return `<section class="story-section-v12"><div class="story-section-head"><span>🇳🇱</span><div><h4>第三幕｜荷蘭把臺南變成「港口＋公司總部＋貿易站」</h4><p>城堡不是觀光景點，而是公司要做生意、下命令、守港口的工作場所。</p></div></div>
 <div class="place-story-grid-v12">
  <article><span>🏰</span><b>熱蘭遮城</b><small>今安平古堡一帶</small><p>靠近大員港，是荷蘭長官、軍事防衛與對外貿易的重要核心。</p></article>
  <article><span>🏢</span><b>普羅民遮城</b><small>今赤崁樓舊址</small><p>1653 起在赤崁一帶建立，強化行政、商業與防衛；1661 後鄭氏改作承天府治。</p></article>
  <article><span>🌾</span><b>招募漢人開墾</b><small>土地＋耕牛＋農具</small><p>擴大稻米、甘蔗等生產，讓臺灣不只轉運，也能生產可賣的商品。</p></article>
  <article><span>🦌</span><b>鹿皮與蔗糖</b><small>重要外銷</small><p>鹿皮尤其和日本市場關係密切；日本白銀又能用來購買中國商品。</p></article>
  <article><span>👥</span><b>地方會議</b><small>治理原住民族社群</small><p>荷蘭召集部分村社長老、宣達命令、任命／確認長老並處理爭議。這表示貿易背後也有政治控制。</p></article>
  <article><span>🔤</span><b>傳教與文字</b><small>羅馬字母記錄族語</small><p>傳教士學習在地語言並以羅馬字母記錄，後來留下新港文書等重要證據。</p></article>
 </div></section>`}

function v12SpanishEpisode(){return `<section class="story-section-v12"><div class="story-section-head"><span>🇪🇸</span><div><h4>第四幕｜西班牙從菲律賓往北：想搶中國、日本的生意</h4><p>「西班牙在北」不是無聊配對，而是馬尼拉航線的延伸。</p></div></div>
 <div class="story-path-v12">
  <article><b>① 馬尼拉</b><p>西班牙已以菲律賓為東亞重要基地，透過白銀與中國商品交易。</p></article><i>→</i>
  <article><b>② 1626 基隆和平島</b><p>建立聖薩爾瓦多城，經營港口、貿易與天主教傳教。</p></article><i>→</i>
  <article><b>③ 1628 淡水</b><p>興築聖多明哥城，想控制淡水河口與北臺灣航路。</p></article><i>⚔️</i>
  <article><b>④ 1642</b><p>荷蘭北上，西班牙守軍撤退，北臺灣勢力轉手。</p></article>
 </div>
 <div class="truth-card-v12"><span>🔎</span><div><b>紅毛城別搞混</b><p>西班牙最早建的是聖多明哥城；撤退前已拆毀。今天紅毛城的主要城堡建築，是荷蘭後來在附近重建的安東尼堡。題目很愛用這個陷阱。</p></div></div></section>`}

function v12ZhengEpisode(){return `<section class="story-section-v12"><div class="story-section-head"><span>⚔️</span><div><h4>第五幕｜鄭成功不是「一登陸就結束」：先攻城，再談判，再接手一套政經系統</h4><p>這一段用「登陸 → 先赤崁 → 再安平 → 和談 → 承天府」記。</p></div></div>
 <div class="zheng-route-v12">
  <article><strong>1661</strong><b>鹿耳門進入臺江</b><p>鄭軍經鹿耳門港進入臺江；史料研究也指出當日另有禾寮港登陸與紮營活動。</p></article>
  <i>→</i><article><strong>先</strong><b>普羅民遮城</b><p>較快取得赤崁一帶據點。</p></article>
  <i>→</i><article><strong>再</strong><b>圍熱蘭遮城</b><p>圍城約九個月，雙方最後協商。</p></article>
  <i>→</i><article><strong>1662</strong><b>和約與荷蘭離臺</b><p>公司財產移交鄭氏；荷蘭人的私人動產，以及返航所需糧食、日用品與自衛物資等，經查驗／報備後可帶走。</p></article>
 </div>
 <div class="place-story-grid-v12 compact">
  <article><span>🏛️</span><b>承天府</b><small>赤崁／普羅民遮城舊址一帶</small><p>鄭成功設承天府作行政中心；熱蘭遮城則改稱安平鎮。</p></article>
  <article><span>🌾</span><b>軍屯</b><small>軍隊也種田</small><p>解決大批軍民糧食，並在各地留下營、鎮等可追查的地名線索。</p></article>
  <article><span>🧑🏻‍💼</span><b>鄭經＋陳永華</b><small>鄭成功 1662 病逝後</small><p>鄭經繼位，陳永華協助內政、屯田、教育等治理。</p></article>
  <article><span>⛩️</span><b>延平郡王祠</b><small>是後世紀念</small><p>民間早有鄭成功信仰；1874 年沈葆楨奏准將開山王廟改建為延平郡王祠，不是鄭成功本人興建。</p></article>
 </div></section>`}

function v12LegacyPhotos(){return `<section class="story-section-v12"><div class="story-section-head"><span>📸</span><div><h4>第二課第一站｜看到建築，就把「誰、哪裡、做什麼」一起叫回來</h4><p>不要只背古蹟名稱；每張照片都要能說出前身與歷史功能。</p></div></div>${u2FortGallery()}
 <div class="history-photo-grid v12-extra-photo"><figure><img src="https://commons.wikimedia.org/wiki/Special:FilePath/%E5%8F%B0%E7%81%A3%E5%9F%BA%E9%9A%86%E8%81%96%E8%96%A9%E7%88%BE%E7%93%A6%E5%A4%9A%E5%9F%8E%E6%A8%A1%E5%9E%8B.jpg?width=900" alt="基隆和平島聖薩爾瓦多城模型" loading="lazy" referrerpolicy="no-referrer"><figcaption><b>北部第一個西班牙統治中心</b><span>1626 基隆和平島｜聖薩爾瓦多城模型</span><small class="image-credit"><a href="https://commons.wikimedia.org/wiki/File:%E5%8F%B0%E7%81%A3%E5%9F%BA%E9%9A%86%E8%81%96%E8%96%A9%E7%88%BE%E7%93%A6%E5%A4%9A%E5%9F%8E%E6%A8%A1%E5%9E%8B.jpg" target="_blank" rel="noopener">國立臺灣歷史博物館／Wikimedia Commons</a>・Public Domain</small></figcaption></figure></div>
 <div class="photo-memory-row-v12">
  <article><span>🇳🇱</span><b>熱蘭遮 → 安平古堡</b><small>港口、行政、軍事、貿易</small></article>
  <article><span>🇳🇱</span><b>普羅民遮 → 赤崁樓</b><small>行政／商業中心；後成承天府治</small></article>
  <article><span>🇪🇸</span><b>聖薩爾瓦多 → 和平島</b><small>1626 西班牙北臺灣統治中心</small></article>
  <article><span>🇪🇸→🇳🇱</span><b>聖多明哥 → 紅毛城</b><small>西班牙先建、荷蘭後重建今日主體</small></article>
 </div>
 <div class="truth-card-v12"><span>🧭</span><div><b>考卷語言 vs. 精確史實</b><p>國小題目若問「哪個古蹟和西班牙人在淡水的建設有關？」紅毛城常是答案；但若問「今天看到的主堡是不是1628年的西班牙原城完整保存？」答案是否定的：西班牙撤離時原城被拆，現存主要城堡由荷蘭後來在附近重建。</p></div></div>
 </section>`}

function v12SpeciesFaith(){return `<section class="story-section-v12"><div class="story-section-head"><span>🌱</span><div><h4>第二課第二站｜連日常生活都變了：物種、宗教、語言一起跨海</h4><p>考題常把「看起來很生活」的材料拿來問大航海影響。</p></div></div>
 <div class="legacy-cards-v12">
  <article><span>🐂</span><b>黃牛</b><p>教材常用來說明荷蘭時期傳入／推廣的新物種與農業變化。</p></article>
  <article><span>🫛</span><b>豌豆</b><p>課程常用它的名稱／語音線索引起動機，提醒物種與語言也會留下交流痕跡。</p></article>
  <article><span>🍅</span><b>番茄、番石榴等</b><p>教材常把番茄、番石榴等列為大航海交流的新物種線索，用來理解跨海交流不只帶貨物，也改變飲食與農業。</p></article>
  <article><span>⛪</span><b>荷蘭傳教</b><p>基督宗教傳教、教育與羅馬字母族語記錄，留下新港文書線索。</p></article>
  <article><span>✝️</span><b>西班牙傳教</b><p>在北臺灣推動天主教，並留下三貂角等地名與遺址線索。</p></article>
  <article><span>🛕</span><b>漢人信仰</b><p>大量漢人移民也帶入媽祖、玄天上帝等原鄉信仰與生活習俗。</p></article>
 </div><p class="accuracy-note-v12">📌 物種「誰最早帶來」的歷史有時比國小教材摘要更複雜；本網站把它們當作課本常見的「大航海交流線索」，考試依教材層級掌握即可。</p></section>`}

function v12TradeLedger(){return `<section class="story-section-v12"><div class="story-section-head"><span>📦</span><div><h4>第二課第三站｜海上物流帳：先分「臺灣產」與「轉口貨」，再看去哪裡</h4><p>這一段很常被參考書拿來混淆進口、出口。最安全的核心是：鄭氏從臺灣主要賣蔗糖、鹿皮；買銀、軍火物資、香料。</p></div></div>
 <div class="trade-matrix-v12">
  <div class="tm-head">目的地／來源</div><div class="tm-head">從臺灣賣出去</div><div class="tm-head">從外面買回來／轉進來</div><div class="tm-head">考試記憶</div>
  <div class="tm-place">🇯🇵 日本</div><div><b>蔗糖、鹿皮</b></div><div><b>銀</b>（另有日本商品參與轉口）</div><div>「糖皮換銀」</div>
  <div class="tm-place">🌴 東南亞</div><div>蔗糖、鹿皮，也可能夾帶各地轉口商品</div><div><b>軍火物資、香料</b></div><div>「糖皮換軍火香料」</div>
  <div class="tm-place">🇵🇭 菲律賓／馬尼拉</div><div>實際海關紀錄顯示貨品很多元，包含生絲、鐵、棉花、紙、煙草等；也可能有中國／日本轉口貨</div><div>區域市場商品與白銀網絡</div><div>進階：不要把所有貨都當臺灣本地生產</div>
  <div class="tm-place">🇨🇳 中國沿海</div><div>透過走私／秘密交易轉運貨物</div><div>中國商品、民生物資與人力等</div><div><b>清鄭戰爭 → 海禁 → 走私增加</b></div>
 </div>
 <div class="truth-card-v12"><span>⚠️</span><div><b>最容易被混淆的地方</b><p>「銀」在五年級核心多和日本貿易相連；「軍火、香料」多和東南亞相連。中國沿海因海禁而常以走私方式取得中國商品與物資。參考書若把絲綢、瓷器放在菲律賓航線，多半是在考「轉口貿易」概念，不代表它們都在臺灣生產。</p></div></div></section>`}

function v12EducationEnding(){return `<section class="story-section-v12"><div class="story-section-head"><span>🏫</span><div><h4>第二課第四站｜打完仗還要治理：陳永華把「種田、做生意、讀書」串起來</h4><p>孩子常只記鄭成功，但鄭氏長期經營臺灣時，鄭經與陳永華非常重要。</p></div></div>
 <div class="ending-chain-v12">
  <article><span>🌾</span><b>屯田開墾</b><p>增加糧食與土地利用。</p></article><i>→</i>
  <article><span>🚢</span><b>海外貿易</b><p>取得銀、軍火、香料與其他物資。</p></article><i>→</i>
  <article><span>🏫</span><b>1665 孔廟＋學校</b><p>鄭經採納陳永華建議，建立孔廟、明倫堂與教育制度，今天稱「全臺首學」。</p></article><i>→</i>
  <article><span>🧑🏻‍💼</span><b>地方治理</b><p>培養人才、維持政權與社會運作。</p></article>
 </div>
 <div class="story-ending-v12"><b>最後轉折：</b><span>鄭經死後內部紛爭 → 1683 施琅在澎湖擊敗鄭軍 → 鄭克塽降清 → 1684 清帝國正式納臺。</span></div></section>`}

function v12StoryQuizBox(id,questions,nextLabel){return `<div id="${id}" class="mini-mission v12-story-quiz"></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 上一段</button><button class="primary-btn" id="stageNext" disabled>${nextLabel}</button></div>`}

function renderUnit2V12Stage(id,stage){
 if(id==='2-1'&&stage===1){lessonShell(id,1,`${v12StoryHero()}${v12SeaActors()}${v12LoveHateChain()}<div id="v12u21s1" class="mini-mission v12-story-quiz"></div><div class="stage-actions"><button class="primary-btn" id="stageNext" disabled>解開海上角色 → 荷蘭與西班牙</button></div>`);
  setupMiniMission('#v12u21s1',[
   ['顏思齊、鄭芝龍放在本課最適合代表哪一類歷史角色？',['17世紀東亞海商與漢人海上活動','西班牙傳教士','清朝水師將領'],0,'先把他們放回海上貿易世界。'],
   ['鄭芝龍和荷蘭人的關係為什麼不能只用「敵人」兩字概括？',['他早年曾翻譯、供應中國商品，之後勢力與政治關係再改變','兩者從來沒有接觸','他一直是西班牙國王'],0,'海商世界常先合作再競爭。'],
   ['1642在愛恨鏈上代表？',['荷蘭北上，西班牙退出臺灣','鄭氏投降清朝','臺南孔廟建立'],0,'24荷南、26西北、42西離。'],
   ['1683與1684的正確關係是？',['1683鄭氏結束；1684清帝國正式納臺','1683荷蘭來臺；1684西班牙來臺','兩年都指同一場荷西戰爭'],0,'這是接第三單元的橋。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,1)});if(stagesFor(id).includes(1))$('#stageNext').disabled=false;$('#stageNext').onclick=()=>openLesson(id,2);return true}

 if(id==='2-1'&&stage===2){lessonShell(id,2,`${v12DutchEpisode()}${v12SpanishEpisode()}${u2FortGallery()}<div id="v12u21s2" class="mini-mission v12-story-quiz"></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 海上角色</button><button class="primary-btn" id="stageNext" disabled>荷西關係解鎖 → 鄭成功接手</button></div>`);
  setupMiniMission('#v12u21s2',[
   ['荷蘭在部分原住民族村社舉辦地方會議，最主要能證明什麼？',['荷蘭不只做生意，也建立政治治理與控制','荷蘭完全沒有治理','只有原住民族在命令荷蘭'],0,'會議用來宣達政令、確認長老與處理爭議。'],
   ['今天紅毛城主要城堡建築的來源應怎麼說最精確？',['西班牙先在淡水建聖多明哥城，荷蘭後來在附近重建新城','整座都是鄭成功蓋的','整座是西班牙原建且從未改變'],0,'西班牙原城已拆，荷蘭後來重建。'],
   ['西班牙為什麼從菲律賓北上臺灣？',['想插入中國、日本貿易並傳教','要找南極企鵝','要躲避所有海上交易'],0,'馬尼拉→臺灣北部→東亞市場。'],
   ['荷蘭的熱蘭遮城與普羅民遮城，最適合怎麼區分？',['前者靠大員港、行政軍事貿易核心；後者強化赤崁行政商業控制','兩者都是史前墓葬','兩者都在基隆'],0,'一個在安平一帶、一個在赤崁一帶。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,2)});if(stagesFor(id).includes(2))$('#stageNext').disabled=false;$('#stagePrev').onclick=()=>openLesson(id,1);$('#stageNext').onclick=()=>openLesson(id,3);return true}

 if(id==='2-1'&&stage===3){lessonShell(id,3,`${v12ZhengEpisode()}${v12EducationEnding()}<div id="v12u21s3" class="mini-mission v12-story-quiz"></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 荷西競爭</button><button class="primary-btn" id="stageNext" disabled>鄭氏故事解鎖 → 找證據</button></div>`);
  setupMiniMission('#v12u21s3',[
   ['1661鄭軍進臺江後，攻城順序較接近？',['先普羅民遮，再圍熱蘭遮','先紅毛城，再基隆','先孔廟，再安平'],0,'記「先赤崁、再安平」。'],
   ['1662和約對荷蘭人的私人財物如何處理？',['私人動產經查驗可帶走，返航糧食等經報備也可帶走','所有私人財物全部沒收','荷蘭人可以帶走東印度公司所有公產'],0,'公司財產移交，但私人動產有不同安排。'],
   ['延平郡王祠哪個說法正確？',['是後世紀念鄭成功，1874沈葆楨奏准改建命名','鄭成功1661親自興建','西班牙人在1626興建'],0,'不要把紀念建築當成鄭成功本人所建。'],
   ['清朝水師施琅在1683年的關鍵戰役地點是？',['澎湖','淡水','基隆和平島'],0,'澎湖海戰是鄭氏結束的重要轉折。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,3)});if(stagesFor(id).includes(3))$('#stageNext').disabled=false;$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>openLesson(id,4);return true}

 if(id==='2-2'&&stage===1){lessonShell(id,1,`${v12LegacyPhotos()}${v12SpeciesFaith()}<div id="v12u22s1" class="mini-mission v12-story-quiz"></div><div class="stage-actions"><button class="primary-btn" id="stageNext" disabled>古蹟與生活痕跡解鎖 → 海上物流帳</button></div>`);
  setupMiniMission('#v12u22s1',[
   ['若導遊說「今天紅毛城就是1628西班牙原城完整保存」，你應怎麼判斷？',['不精確；西班牙原城拆毀，荷蘭後來在附近重建','完全正確','紅毛城其實在臺南'],0,'這是常見古蹟陷阱。'],
   ['新港文書最能代表哪一種大航海時代影響？',['語言、傳教與土地契約留下的文字證據','季風方向','史前石器'],0,'羅馬字母族語是關鍵。'],
   ['黃牛、豌豆、番茄等例子在本課主要要說明？',['跨海交流會改變農業、飲食與日常生活','荷蘭只打仗沒有交流','所有物種都原產臺灣'],0,'生活題常從食物或動物切入。'],
   ['三貂角最適合當作什麼證據？',['西班牙活動留下的地名線索','鄭氏軍屯地名','史前玉器產地'],0,'地名也能保存歷史。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,1)});if(stagesFor(id).includes(1))$('#stageNext').disabled=false;$('#stageNext').onclick=()=>openLesson(id,2);return true}

 if(id==='2-2'&&stage===2){lessonShell(id,2,`${v12TradeLedger()}${v11NewportDocument()}<div id="v12u22s2" class="mini-mission v12-story-quiz"></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 古蹟與生活</button><button class="primary-btn" id="stageNext" disabled>物流帳解鎖 → 教育與社會</button></div>`);
  setupMiniMission('#v12u22s2',[
   ['鄭氏對日本貿易的核心組合？',['賣蔗糖、鹿皮；買銀','賣銀；買蔗糖','賣香料；買黑鮪魚'],0,'記「糖皮換銀」。'],
   ['鄭氏和東南亞貿易的核心組合？',['賣蔗糖、鹿皮；買軍火物資、香料','只賣銀','只買稻米'],0,'記「糖皮換軍火香料」。'],
   ['清鄭戰爭下，中國沿海交易為何常變成走私？',['清帝國海禁與封鎖提高正式交易困難','因為日本鎖國','因為臺灣沒有港口'],0,'戰爭＋海禁是原因。'],
   ['菲律賓航線出現絲綢、瓷器等商品時，最重要的觀念是？',['可能包含中國等地的轉口貨，不代表都在臺灣生產','所有絲綢都產自臺灣','臺灣完全沒有轉口貿易'],0,'先分本地生產與轉口。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,2)});if(stagesFor(id).includes(2))$('#stageNext').disabled=false;$('#stagePrev').onclick=()=>openLesson(id,1);$('#stageNext').onclick=()=>openLesson(id,3);return true}

 if(id==='2-2'&&stage===3){lessonShell(id,3,`${v12EducationEnding()}${v11U22ImpactBalance()}<div class="place-name-lab"><b>📍 地名偵探</b><p><strong>新營、柳營、左營、左鎮、前鎮</strong>常被拿來追查鄭氏軍屯；<strong>三貂角</strong>則和西班牙語音轉有關。考題若只給一個地名，先判斷它屬於「軍屯」還是「西班牙活動」線索。</p></div><div id="v12u22s3" class="mini-mission v12-story-quiz"></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 海上物流帳</button><button class="primary-btn" id="stageNext" disabled>第二課主線完成 → 找證據</button></div>`);
  setupMiniMission('#v12u22s3',[
   ['1665臺南孔子廟與誰的治理最相關？',['鄭經採納陳永華建議','西班牙總督','荷蘭長官'],0,'鄭氏治理不只打仗。'],
   ['陳永華在課程中最適合怎麼記？',['協助鄭經處理內政、屯田與教育的重要人物','荷蘭傳教士','清朝施琅的部將'],0,'把他放在「內政」線。'],
   ['「新營」和「三貂角」同樣是地名證據，但來源不同：前者常連到？',['鄭氏軍屯','西班牙傳教','荷蘭鹿皮貿易'],0,'營／鎮常是軍屯線索。'],
   ['大航海時代留下的影響要怎麼答最完整？',['古蹟、貿易、物種、宗教文字、移民教育與族群衝擊一起看','只寫戰爭年份','只寫誰贏誰輸'],0,'影響題要多面向。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,3)});if(stagesFor(id).includes(3))$('#stageNext').disabled=false;$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>openLesson(id,4);return true}
 return false;
}

/* v11 wrapper calls this name dynamically, so replace it */
renderUnit2V11Stage=renderUnit2V12Stage;

/* ---------- Add richer question pools for repeat play/review ---------- */
lessons['2-1'].quiz.push(
 ['參考書寫「顏思齊、鄭芝龍在雲嘉一帶開墾」，最好的學法是？',['當作教材常見海商／移民線索，同時知道精確據點仍有史學討論','把每個傳說都當成百分之百精確座標','完全刪掉這兩人'],0,'課本記主線，進階知道史料仍可討論。'],
 ['鄭芝龍早年和荷蘭人曾有翻譯與商品供應等往來，這最適合說明？',['17世紀海上勢力可能先合作交易，後來再因政治與利益改變關係','所有國家永遠固定敵對','海商完全不做貿易'],0,'「愛恨鏈」的重點是關係會變。'],
 ['荷蘭地方會議召集部分村社長老，最主要功能之一是？',['宣達政令、確認長老並處理村社問題','教五大洲','推廣黑鮪魚季'],0,'這是治理制度，不只是貿易。'],
 ['1661鄭成功進入臺江後，教材常用哪個地名記登陸航道？',['鹿耳門','三貂角','和平島'],0,'鹿耳門是鄭成功攻臺高頻線索。'],
 ['1662和約中，哪個敘述最精確？',['荷蘭公司財產移交，但私人動產與返航所需物資有條件可帶走','荷蘭人可以帶走所有公司城堡','所有私人財物都被沒收'],0,'公產與私產要分開。'],
 ['1683施琅率清軍在哪裡擊敗鄭軍，是鄭氏政權結束的重要轉折？',['澎湖','赤崁','淡水'],0,'1683澎湖海戰。']
);
lessons['2-2'].quiz.push(
 ['今天紅毛城的主要城堡建築，較精確的歷史來源是？',['荷蘭人在西班牙撤離後於附近重建','西班牙1628原城完整保存','鄭成功1661新建'],0,'「西班牙先建、荷蘭後重建」是陷阱題。'],
 ['「糖皮換銀」是在記鄭氏與哪個市場的核心貿易？',['日本','加拿大','澳洲'],0,'日本銀是高頻考點。'],
 ['「糖皮換軍火香料」是在記鄭氏和哪個方向的貿易？',['東南亞','北極','歐洲內陸'],0,'東南亞市場供應軍火與香料等。'],
 ['馬尼拉海關紀錄出現生絲、鐵、棉花、紙等貨品，最能提醒學生？',['鄭氏貿易含大量轉口商品，不能把所有貨物都當臺灣本地生產','臺灣只賣鹿皮','菲律賓完全不做貿易'],0,'轉口貿易很重要。'],
 ['「延平郡王祠是鄭成功本人興建」這句話？',['錯；現名與正式改建和1874沈葆楨奏准有關','對，1661登陸當天就建好','對，荷蘭人替他興建'],0,'紀念建築和人物生前建設要分開。'],
 ['「全臺首學」為什麼和陳永華有關？',['他建議鄭經建立孔廟與學校、培育人才','他是西班牙傳教士','他主持荷蘭地方會議'],0,'教育制度是陳永華重要治理貢獻。']
);

/* ---------- Replace a few exam items with life-based / archive-inspired variants, preserving 100 points ---------- */
(function enrichExamV12(){
 const A=examData.A.sections, B=examData.B.sections;
 A[1].qs[6]={q:'小安在淡水紅毛城看到解說：「西班牙1628年在此建聖多明哥城；1642離臺後，荷蘭人在附近重建城堡。」哪個理解最正確？',opts:['今天主體不能直接說成西班牙原城完整保留','今天主體完全是西班牙原建未變','紅毛城在臺南','此地和西班牙完全無關'],a:0,p:3,tip:'西班牙先建據點，荷蘭後重建。'};
 A[2].qs[3]={q:'1661年鄭成功率軍進入臺江時，教材常用＿＿＿＿作為重要登陸航道線索。',answers:['鹿耳門','鹿耳門港'],p:2,tip:'臺南臺江的重要航道。'};
 A[4].context='校外教學時，老師把學生分成「港口偵探、古堡偵探、物流偵探、地名偵探」。港口組找到鹿耳門與台江內海；古堡組找到安平古堡、赤崁樓、紅毛城；物流組找到「糖皮換銀、糖皮換軍火香料」；地名組找到三貂角、新營、左營。請用證據判斷歷史。';
 A[4].qs[0]={q:'若港口組要解釋荷蘭為何選臺南，哪個說法最好？',opts:['東亞航路位置加上當時台江港灣條件','臺南位在歐洲中心','因為當時有高速鐵路','因為完全沒有人居住'],a:0,p:4,tip:'位置＋港灣一起答。'};
 A[4].qs[1]={q:'古堡組看到紅毛城，最不應該下哪個結論？',opts:['今天主體就是1628西班牙原城，從未重建','西班牙曾在淡水建聖多明哥城','荷蘭後來在附近重建城堡','古蹟需搭配史料才能理解'],a:0,p:4,tip:'古蹟會經歷拆除、重建與改造。'};
 A[4].qs[2]={q:'物流組的「糖皮換銀」最適合連到？',opts:['鄭氏對日本貿易','西班牙在基隆傳教','史前臺灣玉交換','黑面琵鷺遷徙'],a:0,p:4,tip:'日本銀是高頻線索。'};
 A[4].qs[3]={q:'地名組看到「新營」和「三貂角」，最佳判斷是？',opts:['前者常作鄭氏軍屯線索；後者常連到西班牙活動','兩者都是荷蘭城堡','兩者都是史前遺址','兩者都只和季風有關'],a:0,p:4,tip:'營／鎮 vs 西班牙語音轉。'};
 A[4].qs[4]={q:'這種「看地點、看物品、看地名」的題型主要在考什麼？',opts:['把歷史證據放回時間與空間脈絡判讀','只背單一年份','只看漂亮照片','猜老師喜歡哪個答案'],a:0,p:4,tip:'素養題重視證據與關聯。'};

 B[1].qs[5]={q:'小美整理「荷蘭—原住民族」資料，看到地方會議、村社長老、宣達命令。她應推論？',opts:['荷蘭在貿易之外也介入政治治理','荷蘭完全沒有統治','原住民族完全沒有自己的社會組織','這些資料只和氣候有關'],a:0,p:3,tip:'地方會議是治理證據。'};
 B[1].qs[6]={q:'一張1662和約摘要寫「公司財產移交；私人動產經查驗可帶走；返航糧食經報備可帶走」。最合理的理解？',opts:['公產和私產處理不同，政權移交也有協商規則','荷蘭可帶走所有城堡','鄭氏完全不和談','所有荷蘭私人財物都被沒收'],a:0,p:3,tip:'和約條款是生活化史料題。'};
 B[4].context='阿哲看到一張「鄭氏海上物流表」：日本欄寫「蔗糖、鹿皮→銀」；東南亞欄寫「蔗糖、鹿皮→軍火物資、香料」；中國沿海欄寫「戰爭與海禁下，秘密／走私交易」。老師提醒：絲綢、瓷器等也可能是轉口商品，不一定在臺灣生產。';
 B[4].qs[0]={q:'若船要到日本，哪組貨物流向最符合表格？',opts:['從臺灣賣蔗糖、鹿皮，換銀回來','賣銀換蔗糖','賣軍火換黑鮪魚','只帶人不帶貨'],a:0,p:4,tip:'糖皮換銀。'};
 B[4].qs[1]={q:'東南亞航線對鄭氏政權重要，因為可取得？',opts:['軍火物資與香料等','五大洲地圖','史前石器','冬季候鳥'],a:0,p:4,tip:'戰爭與生活都需要外來物資。'};
 B[4].qs[2]={q:'中國沿海交易常以走私方式進行，最直接背景是？',opts:['清鄭戰爭與海禁封鎖','日本鎖國','西班牙退出北臺灣','臺灣沒有港口'],a:0,p:4,tip:'政治衝突會改變貿易方式。'};
 B[4].qs[3]={q:'如果菲律賓航線出現絲綢、瓷器，為什麼不能直接說「這些都產自臺灣」？',opts:['臺灣也是轉運節點，貨品可能來自中國等地再轉口','所有商品都一定在目的地生產','17世紀沒有跨國貿易','絲綢只來自日本'],a:0,p:4,tip:'轉口貿易是本單元核心。'};
 B[4].qs[4]={q:'這張物流表最主要在訓練？',opts:['分清出口、進口與轉口，理解政治如何影響貿易','只背國旗顏色','只背一個人物','計算季風風速'],a:0,p:4,tip:'生活題會把貨物流向和戰爭背景混在一起。'};
 B[6].qs[1]={q:'校外教學時，導遊說：「今天淡水紅毛城的主堡，就是1628年西班牙人蓋的原城，一直沒有重建。」請指出這句話哪裡需要修正。',keywords:[['西班牙','聖多明哥'],['荷蘭','重建','安東尼','拆']],p:5,tip:'要寫出「西班牙先建聖多明哥城」以及「撤離後原城拆毀、荷蘭在附近重建今日主體」兩層。'};
})();

/* ---------- Unit page subtitle reminder ---------- */
const v12OpenUnitBase=openUnit;
openUnit=function(n){v12OpenUnitBase(n);const box=$('#unitContent');if(!box)return;if(n===2){const title=box.querySelector('.unit-title');if(title&&!title.querySelector('.v12-unit-note')){const note=document.createElement('div');note.className='v12-unit-note';note.innerHTML='<b>📖 v1.2 完整頁面版</b><span>2-1 先看「海上愛恨鏈」，2-2 再看「古蹟＋物流＋生活影響」。課程頁不再使用小浮框。</span>';title.appendChild(note)}}};

