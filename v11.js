/* v1.1.0 — make Unit 2 a first-class selectable course, deepen both lessons, add visible versioning */
const V11_VERSION='1.1.0';

/* ---------- Unit 2: extend question pools ---------- */
lessons['2-1'].quiz.push(
 ['17世紀荷蘭人選擇今日臺南一帶作為重要據點，除了東亞航路位置，也和哪項自然條件有關？',['台江內海提供港灣與航道條件','終年積雪','大片沙漠'],0,'位置與港灣條件要一起看。'],
 ['熱蘭遮城在荷蘭統治臺灣時較接近哪種功能？',['行政、軍事與對外貿易的重要中心','史前墓葬','只是一座民宅'],0,'城堡是統治與貿易網的一部分。'],
 ['1650年代荷蘭在赤崁一帶興築普羅民遮城，課程上最適合怎麼理解？',['強化赤崁一帶的行政、商業與防禦控制','取代所有農田','成為原住民族史前遺址'],0,'赤崁與安平是兩個重要據點。'],
 ['課程常提荷蘭人提供土地、耕牛與農具招募漢人開墾，最主要目的為何？',['增加生產並取得貿易利益','讓所有人停止交易','發展冰雪觀光'],0,'荷蘭東印度公司具有強烈商業目的。'],
 ['黃牛、豌豆、番茄或土芒果等例子，在本課主要用來說明什麼？',['跨海交流也會帶來新物種與生活改變','臺灣完全沒有農業','只有戰爭才叫歷史'],0,'教材常用新物種說明生活交流。'],
 ['西班牙人在1626年首先重視基隆和平島，一項原因是？',['北臺灣港口可連接東亞海上活動','當地有高鐵','離菲律賓最遠'],0,'港口與航線是重點。'],
 ['西班牙在淡水興築聖多明哥城的時間較接近？',['1628年','1662年','1684年'],0,'1626基隆、1628淡水可當進階時間線。'],
 ['「荷南、西北」這個口訣是在記？',['荷蘭主要經營南臺灣、西班牙主要經營北臺灣','荷蘭在北、西班牙在南','兩國都只在東部'],0,'先抓空間，再接年份。'],
 ['「24荷南、26西北、42西離、61鄭來、62荷離」最主要是幫助記什麼？',['大航海時代臺灣政權與勢力變化的時序','臺灣五大洲位置','史前文化年代'],0,'這是第二單元第一課的時間骨架。'],
 ['鄭成功來臺後設承天府、分兵屯墾，最能反映哪兩項需求？',['建立治理基地並解決軍民糧食','停止所有農業與治理','只發展宗教觀光'],0,'政權要有行政與糧食。'],
 ['新營、左營、柳營、左鎮等地名常被拿來當軍屯線索，學習時最安全的做法是？',['把「營、鎮」當線索，再查地名史料確認','看到「營」就百分之百判定','完全不看地名'],0,'地名是證據線索，不是單獨定論。'],
 ['研究1624年的臺灣時，為什麼不能說「歐洲人來了，臺灣才開始有歷史」？',['臺灣原住民族早已長期生活，周邊也已有多方海上活動','因為1624在史前時代','因為臺灣當時完全無人'],0,'臺灣不是一座等待外來者發現的空島。']
);

lessons['2-2'].quiz.push(
 ['「新港文書」為什麼是大航海時代文化接觸的重要證據？',['部分文書以羅馬字母拼寫西拉雅語，甚至和漢文並列','只使用現代英文','是史前石器'],0,'文字本身就是交流痕跡。'],
 ['新港文書中的羅馬字母書寫，最早和哪類活動有密切關係？',['荷蘭傳教士的傳教與教育','鄭氏軍屯','清末鐵路'],0,'傳教需要學習、記錄在地語言。'],
 ['臺南孔子廟創建於鄭氏時期，最直接反映什麼？',['鄭氏推動儒學教育與人才培育','西班牙在北臺灣傳教','荷蘭鹿皮貿易'],0,'孔廟＋學校是教育線。'],
 ['臺南孔子廟創建的年份較接近？',['1665年','1624年','1895年'],0,'1665是鄭經採納陳永華建議的重要教育線索。'],
 ['鄭氏時期推動教育，課程常提到哪位人物向鄭經提出建議？',['陳永華','劉銘傳','沈葆楨'],0,'陳永華是鄭氏治理的重要人物。'],
 ['「全臺首學」最常和哪個文化資產連結？',['臺南孔子廟','安平古堡','紅毛城'],0,'臺南孔廟是臺灣儒學教育的重要象徵。'],
 ['若一個地方同時保留古堡、雙語契約、外來宗教痕跡，最合理的推論是？',['曾有不同族群長期接觸與統治交流','只發生一次短暫天災','完全沒有跨文化互動'],0,'多種證據要一起解讀。'],
 ['外來者招募大量漢人開墾，使漢人社會逐漸擴大；但描述這段歷史時還應補上什麼觀點？',['原住民族面對土地、統治、傳教與文化改變的不同經驗','只說農產增加就夠','原住民族與這段歷史無關'],0,'第二課要有多元族群觀點。'],
 ['荷蘭治理部分原住民族社群時，可能利用地方會議、長老等方式，這最能說明？',['統治會介入既有社會組織','外來政權完全不治理','只有商品交換沒有政治'],0,'大航海時代不只是貿易。'],
 ['媽祖、玄天上帝等信仰在本課被提到，主要用來說明？',['漢人移民也帶來原鄉信仰與生活文化','西班牙天主教','史前文化'],0,'人口移動會帶來文化。'],
 ['大航海時代影響臺灣社會的四條主線，哪組最完整？',['文化資產、貿易網、人口移動、不同族群影響','只有城堡、城堡、城堡、城堡','只有年份、人物、戰爭'],0,'第二課不能只背古堡。'],
 ['1683鄭氏政權結束、1684清帝國正式將臺灣納入版圖，這兩個年份最適合放在哪裡？',['第二單元尾端與第三單元開頭的轉折','第一單元史前時間軸','現代民主發展'],0,'它是大航海時代接到清帝國統治的橋。']
);

/* ---------- Detailed Unit 2 learning pages ---------- */
function v11Unit2LessonMap(){return `<div class="u2-lesson-map">
 <article><span>🌍</span><b>1 世界背景</b><small>亞洲商品、新航路、海上貿易競爭</small></article>
 <article><span>🧭</span><b>2 臺灣位置</b><small>中國沿海、日本、東南亞之間的航路節點</small></article>
 <article><span>🇳🇱</span><b>3 荷蘭南臺灣</b><small>臺南、台江、城堡、開墾與貿易</small></article>
 <article><span>🇪🇸</span><b>4 西班牙北臺灣</b><small>基隆、淡水、貿易與天主教傳教</small></article>
 <article><span>⚔️</span><b>5 鄭氏政權</b><small>1661／1662、屯墾、治理與海上貿易</small></article>
 </div>`}

function v11Unit2Memory(){return `<div class="u2-memory-code"><b>先背骨架，再補細節：</b><span>24 荷南</span><span>26 西北</span><span>42 西離</span><span>61 鄭來</span><span>62 荷離</span></div>`}

function v11U21WorldContext(){return `<div class="u2-deep-grid">
 <article><span>🌶️</span><h4>為什麼歐洲船往亞洲跑？</h4><p>香料、絲織品、瓷器等亞洲商品具有高價值。航海技術與海圖知識進步後，歐洲國家更積極尋找直接海路，希望取得貿易利益。</p></article>
 <article><span>🏝️</span><h4>臺灣為什麼變重要？</h4><p>臺灣靠近中國東南沿海、日本與東南亞航線。它不是「世界中心」，但在17世紀東亞海路上具轉運、補給、軍事與貿易價值。</p></article>
 <article><span>🧑🏽‍🤝‍🧑🏽</span><h4>外國人來前，臺灣有人嗎？</h4><p>當然有。原住民族長期在臺生活；中國、日本等地的商人、漁民與海上勢力也在周邊海域活動。學歷史不能把臺灣想成「無人島」。</p></article>
 <article><span>🏷️</span><h4>福爾摩沙要怎麼學？</h4><p>把它當作「臺灣進入歐洲航海者視野」的稱呼線索即可。真正的主線仍是海路、貿易與多方勢力互動。</p></article>
 </div>`}

function v11U21DutchTable(){return `<div class="u2-key-table">
 <div class="head">線索</div><div class="head">要記什麼</div><div class="head">為什麼</div><div class="head">可能怎麼考</div>
 <div class="important">1624</div><div>荷蘭進入南臺灣</div><div>尋求東亞貿易據點與利益</div><div>年份＋勢力＋南北位置</div>
 <div class="important">台江內海</div><div>臺南西南部港灣環境</div><div>沙洲、潟湖與港道有利船隻活動</div><div>古今海岸線比較、港口判讀</div>
 <div class="important">熱蘭遮城</div><div>今安平古堡一帶</div><div>行政、軍事、貿易的重要中心</div><div>古蹟配對、功能判讀</div>
 <div class="important">普羅民遮城</div><div>今赤崁樓舊址</div><div>加強赤崁一帶的行政、商業與防禦</div><div>古蹟舊名配對</div>
 <div class="important">招募漢人</div><div>土地、耕牛、農具與開墾</div><div>增加稻米、甘蔗等生產與商業收益</div><div>「為什麼招募？」因果題</div>
 <div class="important">鹿皮／蔗糖</div><div>重要外銷商品</div><div>連結日本、中國與區域市場</div><div>貿易路線＋環境代價</div>
 <div class="important last-row">傳教／文字</div><div class="last-row">教堂、學校、羅馬字母拼寫族語</div><div class="last-row">傳教也造成語言、教育與統治接觸</div><div class="last-row">新港文書、文化影響</div>
 </div>`}

function v11U21DutchImpacts(){return `<div class="u2-impact-path">
 <article><span>🐂</span><b>新物種</b><small>教材常以黃牛、豌豆、番茄／土芒果等例子說明跨海交流改變生活。</small></article>
 <article><span>🌾</span><b>農業生產</b><small>漢人移入與開墾增加，稻米、甘蔗等生產擴大。</small></article>
 <article><span>🦌</span><b>資源壓力</b><small>鹿皮大量輸出帶來獵鹿壓力，不能只看到貿易收益。</small></article>
 <article><span>⚠️</span><b>族群衝擊</b><small>統治、土地利用與傳教會使部分原住民族社群面臨協商、抵抗與改變。</small></article>
 </div>`}

function v11U21SpanishZhengCompare(){return `<div class="u2-compare">
 <section><h4>🇪🇸 西班牙：北臺灣</h4><ul><li><b>1626</b>：以基隆和平島為重要據點，建立聖薩爾瓦多城。</li><li><b>1628</b>：在淡水興築聖多明哥城。</li><li>主要目的：參與東亞貿易、傳播天主教。</li><li><b>1642</b>：荷蘭北上，西班牙勢力退出臺灣。</li></ul><p class="memory-line"><b>位置口訣：</b>西班牙在北部＝「西北」。</p></section>
 <section><h4>⚔️ 鄭氏：基地與海貿</h4><ul><li><b>1661</b>：鄭成功率軍來臺，先取普羅民遮城，再圍熱蘭遮城。</li><li><b>1662</b>：荷蘭守軍投降離臺。</li><li>設置行政制度、分兵屯墾，解決軍民糧食並拓展聚落。</li><li>持續利用日本、東南亞等海上貿易維持政權。</li></ul><p class="memory-line"><b>時序口訣：</b>61鄭來，62荷離。</p></section>
 </div>`}

function v11U21ZhengDetails(){return `<div class="u2-deep-grid">
 <article><span>🏛️</span><h4>治理基地</h4><p>鄭氏以臺南一帶作為政權核心。課本學習重點是「臺灣成為政權基地」，承天府等名稱可當挑戰補充，不必一次背完所有行政區。</p></article>
 <article><span>🌾</span><h4>軍屯與糧食</h4><p>軍隊分散開墾，兼顧駐防與糧食。今天中南部一些帶「營、鎮」的地名可成為追查軍屯歷史的線索。</p></article>
 <article><span>🚢</span><h4>海上貿易</h4><p>鄭氏需要銀、軍火、香料與民生物資，因此即使面臨海禁，仍設法維持日本與東南亞航線。</p></article>
 <article><span>🔎</span><h4>地名不是百分百證明</h4><p>新營、柳營、左營、左鎮常被用來學軍屯，但正確做法是「先當線索，再查地方史料」，不能看到一個「營」字就直接下結論。</p></article>
 </div>`}

function v11U22EvidenceFamilies(){return `<div class="u2-impact-path">
 <article><span>🏰</span><b>古堡／遺址</b><small>安平古堡、赤崁樓、紅毛城等，讓今天還能看見統治據點的空間痕跡。</small></article>
 <article><span>🔤</span><b>文字</b><small>荷蘭傳教士以羅馬字母記錄部分原住民族語言，後來形成新港文書等重要證據。</small></article>
 <article><span>⛪</span><b>宗教</b><small>荷蘭基督宗教、西班牙天主教與在地社會接觸；漢人移民也帶入媽祖等信仰。</small></article>
 <article><span>📍</span><b>地名</b><small>三貂角、營／鎮類地名，可成為追查西班牙或鄭氏活動的歷史線索。</small></article>
 </div>`}

function v11NewportDocument(){return `<div class="u2-doc-card">
 <div><b>🔤 羅馬字母一側（示意）</b><p class="roman">Taivoan / Siraya language written with Roman letters…</p><small>荷蘭傳教士為傳教與教育，學習並用羅馬字母記錄部分原住民族語言。</small></div>
 <div><b>漢文一側（示意）</b><p class="han">立契人……土地四至……銀若干……</p><small>後來部分契約出現漢文與羅馬拼音並列，反映語言、土地交易與族群互動。</small></div>
 <p class="u2-doc-note">⚠️ 上面是教學排版示意，不是抄錄真實契約。真正的新港文書是重要古文書證據；重點是知道「羅馬字母族語＋契約」如何證明文化接觸。</p>
 </div>`}

function v11U22ZhengSociety(){return `<div class="u2-deep-grid">
 <article><span>🏫</span><h4>1665｜孔廟與教育</h4><p>鄭經採納陳永華建議，在臺南建立孔廟、設學校，推動儒學教育與人才培育。今天臺南孔子廟被稱為「全臺首學」。</p></article>
 <article><span>🧳</span><h4>漢人移民增加</h4><p>荷蘭時期已招募漢人開墾；鄭氏時期又有軍民移入、屯墾與聚落發展，使漢人社會與漢人文化的影響持續擴大。</p></article>
 <article><span>🛕</span><h4>信仰與生活文化</h4><p>移民把媽祖、玄天上帝等信仰及生活習俗帶來臺灣。歷史變遷不是只有政治事件，也會改變日常生活。</p></article>
 <article><span>🧑🏽‍🤝‍🧑🏽</span><h4>原住民族不是「背景人物」</h4><p>貿易、傳教、統治與開墾都會影響原住民族土地與生活。不同社群可能交易、協商、抵抗或調整，不能只用統治者角度說故事。</p></article>
 </div>`}

function v11U22TradeMap(){return `<div class="u2-key-table">
 <div class="head">方向</div><div class="head">常見輸出／交換</div><div class="head">取得</div><div class="head">要理解什麼</div>
 <div class="important">🇯🇵 日本</div><div>蔗糖、鹿皮等</div><div>銀等</div><div>銀可支撐政權與再交易</div>
 <div class="important">🌴 東南亞</div><div>蔗糖、鹿皮等</div><div>軍火、香料等</div><div>戰爭與生活都仰賴跨海物資</div>
 <div class="important">🇨🇳 中國沿海</div><div>物產與轉口商品</div><div>民生物資、人口與商業網絡</div><div>海禁會提高交易難度，走私增加</div>
 <div class="important last-row">🏝️ 臺灣</div><div class="last-row">生產＋轉運</div><div class="last-row">不同市場的貨物</div><div class="last-row">臺灣是區域交換網節點，不是孤島</div>
 </div>`}

function v11U22ImpactBalance(){return `<div class="u2-compare">
 <section><h4>✨ 交流與新連結</h4><ul><li>跨海商品與新物種進入生活。</li><li>宗教、文字與教育形成新接觸。</li><li>海上貿易使臺灣和東亞、東南亞更緊密。</li><li>古堡、古文書與地名成為今日文化資產。</li></ul></section>
 <section><h4>⚠️ 統治與衝擊</h4><ul><li>外來政權建立控制制度並徵收資源。</li><li>開墾擴張可能增加土地競爭。</li><li>傳教與治理會改變部分原住民族社會。</li><li>大量捕鹿等經濟行為也可能造成環境代價。</li></ul></section>
 </div><p class="u2-caution"><b>社會科高分關鍵：</b>不要寫成「外來者只帶來好東西」或「只有壞事」。真正要比較的是：誰得到利益？誰承受代價？留下了哪些證據？</p>`}

function renderUnit2V11Stage(id,stage){
 if(id==='2-1'&&stage===1){lessonShell(id,1,`<div class="stage-intro visual-intro"><span class="big-emoji">⛵</span><div><h3>第一課｜臺灣為什麼在大航海時代崛起？</h3><p>先建立五格主線，再讀人物與年份。這一課不是背「荷西鄭」三個名字，而是看海路如何讓臺灣變成多方競逐的節點。</p></div></div>${v11Unit2LessonMap()}${v11U21WorldContext()}${u2RouteNetwork()}${v11Unit2Memory()}<div id="v11u21s1" class="mini-mission"></div><div class="stage-actions"><button class="primary-btn" id="stageNext" disabled>世界與航路解鎖 → 荷蘭南臺灣</button></div>`);
  setupMiniMission('#v11u21s1',[
   ['大航海時代歐洲人積極往亞洲航行，核心動機之一是？',['取得亞洲商品與貿易利益','尋找現代高鐵','避開所有海洋'],0,'香料、絲織品、瓷器是提示。'],
   ['臺灣在17世紀受到重視，最重要的地理理由是？',['接近中國沿海、日本、東南亞海路','位在大西洋中央','終年積雪'],0,'把第一單元的東亞位置接回來。'],
   ['外國勢力來臺前，臺灣的情況是？',['原住民族長期生活，周邊已有多方海上活動','完全沒有人','只有歐洲人居住'],0,'臺灣不是空島。'],
   ['「轉運節點」比較接近？',['貨物、人群可在此集散並連接不同航線','所有船只能停住','只生產不交易'],0,'關鍵在「連接」。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,1)});if(stagesFor(id).includes(1))$('#stageNext').disabled=false;$('#stageNext').onclick=()=>openLesson(id,2);return true}

 if(id==='2-1'&&stage===2){lessonShell(id,2,`<h3>荷蘭南臺灣｜把「城堡、開墾、貿易、影響」串在一起</h3><p>1624只是入口。真正會考的是：為什麼選臺南？城堡做什麼？為什麼招募漢人？商品怎麼流動？又造成哪些改變？</p>${u2FortGallery()}${v11U21DutchTable()}${u2DutchTrade()}${v11U21DutchImpacts()}<div id="v11u21s2" class="mini-mission"></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 世界與航路</button><button class="primary-btn" id="stageNext" disabled>荷蘭任務完成 → 北部與鄭氏</button></div>`);
  setupMiniMission('#v11u21s2',[
   ['荷蘭為什麼選臺南一帶建立據點？',['東亞航路位置＋台江港灣條件','因為高山積雪','因為沒有居民'],0,'位置與港灣要一起答。'],
   ['熱蘭遮城最完整的功能是？',['行政、軍事與貿易中心','史前墓葬','只有住宿'],0,'不只是一座城牆。'],
   ['荷蘭招募漢人開墾的主要商業目的？',['增加稻米、甘蔗等生產與收益','停止農業','發展太空科技'],0,'公司要增加可交易商品。'],
   ['鹿皮大量輸出時，除了賺錢還要看到？',['野生鹿群與生態壓力','鹿群一定增加','海水變淡'],0,'經濟收益與環境代價一起看。'],
   ['羅馬字母拼寫部分原住民族語言，最初主要和什麼有關？',['傳教與教育','軍屯地名','史前玉器'],0,'傳教士需要記錄、教學語言。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,2)});if(stagesFor(id).includes(2))$('#stageNext').disabled=false;$('#stagePrev').onclick=()=>openLesson(id,1);$('#stageNext').onclick=()=>openLesson(id,3);return true}

 if(id==='2-1'&&stage===3){lessonShell(id,3,`<h3>西班牙北臺灣＋鄭氏政權｜用「位置＋時間＋目的」記</h3>${v11U21SpanishZhengCompare()}${v11U21ZhengDetails()}${u2Timeline()}${v11Unit2Memory()}<div id="v11u21s3" class="mini-mission"></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 荷蘭南臺灣</button><button class="primary-btn" id="stageNext" disabled>時序解鎖 → 找歷史證據</button></div>`);
  setupMiniMission('#v11u21s3',[
   ['1626和哪件事最相符？',['西班牙進入北臺灣','荷蘭離臺','清帝國納臺'],0,'24荷南，26西北。'],
   ['1642的重要轉折是？',['荷蘭北上，西班牙退出臺灣','鄭氏政權結束','臺南孔廟建立'],0,'西班牙在北臺灣約16年。'],
   ['鄭成功1661來臺後的攻城順序較接近？',['先普羅民遮，再圍熱蘭遮','先紅毛城，再和平島','先孔廟，再安平'],0,'赤崁先、安平後。'],
   ['1662代表？',['荷蘭守軍投降離臺，鄭氏開始統治','西班牙首次來臺','清帝國正式納臺'],0,'61來、62荷離。'],
   ['鄭氏軍屯最直接要解決？',['軍民糧食與駐防生產','冬季候鳥','五大洲定位'],0,'屯墾就是兵農結合。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,3)});if(stagesFor(id).includes(3))$('#stageNext').disabled=false;$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>openLesson(id,4);return true}

 if(id==='2-2'&&stage===1){lessonShell(id,1,`<div class="stage-intro visual-intro"><span class="big-emoji">🏛️</span><div><h3>第二課｜大航海時代在臺灣留下哪些影響？</h3><p>把臺灣想成一座「歷史證據博物館」。不是只找古堡，而是同時找建築、文字、宗教、地名、商品與人口變化。</p></div></div>${v11U22EvidenceFamilies()}${u2FortGallery()}${v11NewportDocument()}<a class="resource-link single-resource" href="https://www.th.gov.tw/Epaper_Content/237/7453/" target="_blank" rel="noopener"><span>📜</span><b>國史館臺灣文獻館｜新港文書</b><small>看真正古文書如何留下西拉雅語羅馬字母與土地契約證據</small></a><div id="v11u22s1" class="mini-mission"></div><div class="stage-actions"><button class="primary-btn" id="stageNext" disabled>證據分類完成 → 打開海上帳本</button></div>`);
  setupMiniMission('#v11u22s1',[
   ['安平古堡、赤崁樓、紅毛城屬於哪類歷史證據？',['古蹟／有形文化資產','季風資料','史前石器分類'],0,'它們是今天仍可觀察的建築遺址。'],
   ['新港文書最關鍵的文字特色之一是？',['羅馬字母拼寫西拉雅語，部分和漢文並列','只有現代英文','只畫圖沒有文字'],0,'文字交流是重點。'],
   ['三貂角、新營、左營等地名的共同學習價值是？',['可成為追查歷史的線索','可以單獨證明所有歷史','和歷史完全無關'],0,'地名需要配合其他史料查證。'],
   ['文化接觸應如何理解？',['可能同時包含交流、統治、傳教與衝突','一定只有好處','一定只有壞處'],0,'避免單一角度。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,1)});if(stagesFor(id).includes(1))$('#stageNext').disabled=false;$('#stageNext').onclick=()=>openLesson(id,2);return true}

 if(id==='2-2'&&stage===2){lessonShell(id,2,`<h3>海上帳本＋漢人社會形成｜人、貨物與制度一起移動</h3>${v11U22TradeMap()}${v11U22ZhengSociety()}<a class="resource-link single-resource" href="https://taiwangods.moi.gov.tw/html/Landscape/1_0011.aspx?i=74" target="_blank" rel="noopener"><span>🏫</span><b>內政部臺灣宗教文化地圖｜臺南孔子廟</b><small>1665年鄭氏時期創建，理解「全臺首學」與儒學教育</small></a><div id="v11u22s2" class="mini-mission"></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 歷史證據</button><button class="primary-btn" id="stageNext" disabled>帳本解鎖 → 比較交流與衝擊</button></div>`);
  setupMiniMission('#v11u22s2',[
   ['鄭氏和日本交易時，常用臺灣物產換取什麼？',['銀等物資','高鐵車廂','冰河'],0,'蔗糖、鹿皮與銀是常見線索。'],
   ['1665臺南孔子廟的創建，最能說明？',['鄭氏推動儒學教育與人才培育','西班牙北臺灣統治','荷蘭鹿皮貿易'],0,'孔廟與學校是教育制度。'],
   ['漢人移民增加帶來哪項文化變化？',['媽祖等信仰與生活習俗擴大','所有文化完全相同','原住民族文化自動消失'],0,'人口移動帶來文化，但不是把其他文化抹掉。'],
   ['海禁對鄭氏海貿可能造成？',['交易更困難，走私等方式增加','完全沒影響','所有港口更開放'],0,'海禁是切斷經濟的重要手段。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,2)});if(stagesFor(id).includes(2))$('#stageNext').disabled=false;$('#stagePrev').onclick=()=>openLesson(id,1);$('#stageNext').onclick=()=>openLesson(id,3);return true}

 if(id==='2-2'&&stage===3){lessonShell(id,3,`<h3>最後一塊拼圖｜交流帶來改變，也帶來權力與土地問題</h3>${v11U22ImpactBalance()}<div class="place-name-lab"><b>📍 軍屯地名偵探</b><p><strong>新營、柳營、左營、左鎮、前鎮</strong>等常被用來追查鄭氏軍屯。記法不是「看到營就一定是」，而是「營／鎮＝先懷疑軍屯 → 再查地方沿革」。</p></div><div class="u2-impact-path"><article><span>1683</span><b>鄭氏政權結束</b><small>這一年是政權結束的轉折。</small></article><article><span>1684</span><b>清帝國納入版圖</b><small>下一單元正式進入清帝國統治。</small></article><article><span>🔗</span><b>兩單元的橋</b><small>大航海不是突然結束，而是進入新的統治與移民階段。</small></article><article><span>🧠</span><b>考試思考</b><small>遇到「影響」題，至少從文化、經濟、人口、族群四面向回答。</small></article></div><div id="v11u22s3" class="mini-mission"></div><div class="stage-actions"><button class="secondary-btn" id="stagePrev">← 海上帳本</button><button class="primary-btn" id="stageNext" disabled>影響比較完成 → 找證據</button></div>`);
  setupMiniMission('#v11u22s3',[
   ['大航海時代對臺灣的影響，哪個答案最完整？',['文化資產、貿易、人口移動與族群關係都改變','只有戰爭年份','只有古堡'],0,'四條主線一起看。'],
   ['開墾擴張對原住民族社群可能造成？',['土地壓力、治理介入與文化改變','完全沒有影響','只有人口增加的好處'],0,'不同族群承受的影響不同。'],
   ['看到「營、鎮」地名，正確做法是？',['當軍屯線索，再查地方史料','直接百分百判定','完全忽略'],0,'地名是證據之一，不是全部。'],
   ['1683與1684的差別？',['1683鄭氏結束；1684清帝國正式納臺','兩年都是西班牙來臺','兩年都是荷蘭來臺'],0,'這是接到第三單元的橋。']
  ],()=>{$('#stageNext').disabled=false;completeStage(id,3)});if(stagesFor(id).includes(3))$('#stageNext').disabled=false;$('#stagePrev').onclick=()=>openLesson(id,2);$('#stageNext').onclick=()=>openLesson(id,4);return true}
 return false;
}

const v11RenderLessonStageBase=renderLessonStage;
renderLessonStage=function(id,stage){if(renderUnit2V11Stage(id,stage))return;return v11RenderLessonStageBase(id,stage)};

/* ---------- Unit 2 review ---------- */
function openUnit2Review(){
 const a=shuffled(lessons['2-1'].quiz.map((q,i)=>({id:`u21-${i}`,lesson:'2-1',q:q[0],opts:q[1],a:q[2],tip:q[3]}))).slice(0,8);
 const b=shuffled(lessons['2-2'].quiz.map((q,i)=>({id:`u22-${i}`,lesson:'2-2',q:q[0],opts:q[1],a:q[2],tip:q[3]}))).slice(0,8);
 const qs=shuffled([...a,...b]);
 $('#missionContent').innerHTML=`<div class="unit-title"><span class="pill">第二單元總複習</span><h2>16題混合抽考｜兩課各8題</h2><p>航路、荷西鄭、古堡、貿易、文字、教育、軍屯與族群影響一起抽。每次重開都會換一批。</p></div><div id="unit2ReviewBox">${qs.map((q,i)=>`<div class="review-q"><div class="question-line"><b>${i+1}. ${q.q}</b>${speechBtn(q.q,'朗讀題目')}</div>${shuffled(q.opts.map((o,j)=>({o,j}))).map(z=>`<label><input type="radio" name="u2r${i}" value="${z.j}"> ${z.o}</label>`).join('')}<p class="review-answer" id="u2rf${i}"></p></div>`).join('')}<button class="primary-btn" id="gradeUnit2Review">交卷</button><p class="feedback" id="unit2ReviewFeedback"></p></div>`;
 $('#missionDialog').showModal();
 $('#gradeUnit2Review').onclick=()=>{let score=0;qs.forEach((q,i)=>{const x=document.querySelector(`input[name="u2r${i}"]:checked`),ok=x&&Number(x.value)===q.a;if(ok){score++;clearWrong(`u2review-${q.id}`);$(`#u2rf${i}`).textContent='✓ 答對'}else{addWrong(`u2review-${q.id}`,q.lesson,q.q,q.tip,'quiz');$(`#u2rf${i}`).textContent=`提示：${q.tip}`}});const pct=Math.round(score/qs.length*100);$('#unit2ReviewFeedback').textContent=`答對 ${score}/${qs.length}（${pct}分）${pct>=80?' 🎉 第二單元核心很穩！':'。錯題已送進弱點救援；補完再抽一次。'}`;if(pct>=80){state.stars+=10;saveState();renderState()}}
}

/* ---------- Unit 2 must be directly selectable ---------- */
const v11OpenUnitBase=openUnit;
openUnit=function(n){
 v11OpenUnitBase(n);
 const box=$('#unitContent');if(!box)return;
 if(n===2){
   const examBtn=box.querySelector('#unitExamBtn');if(examBtn){const parent=examBtn.closest('.checkpoint-mini');if(parent)parent.remove()}
   if(!box.querySelector('#unit2ReviewCard')){
     const card=document.createElement('div');card.id='unit2ReviewCard';card.className='checkpoint-mini unit2-review-card';
     card.innerHTML='<b>🧠 第二單元總複習</b><span>兩課各抽8題：航路、荷西鄭、古堡、文字、貿易、教育、軍屯與族群影響。</span><button class="primary-btn" id="unit2ReviewBtn">開始第二單元總複習</button>';
     const game=box.querySelector('#unit2GameInline');if(game)box.insertBefore(card,game);else box.appendChild(card);
     card.querySelector('button').onclick=()=>{$('#unitDialog').close();openUnit2Review()};
   }
   const note=document.createElement('p');note.className='scope-note';note.textContent='段考入口不放在第二單元裡；第一、二單元都完成後，首頁才會出現「要段考囉」。';box.appendChild(note);
 }
};

function bindScopeSwitcher(){
 $$('[data-open-scope-unit]').forEach(btn=>{btn.onclick=()=>openUnit(Number(btn.dataset.openScopeUnit))});
}
bindScopeSwitcher();

const v11RenderStateBase=renderState;
renderState=function(){
 v11RenderStateBase();
 bindScopeSwitcher();
 const current=firstIncompleteUnit();
 $$('[data-open-scope-unit]').forEach(btn=>{const n=Number(btn.dataset.openScopeUnit);btn.classList.toggle('current',n===current);btn.classList.toggle('done',units[n].lessons.every(id=>state.completedLessons.includes(id)))});
};
if(state)renderState();
