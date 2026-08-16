(()=>{
const MODES={
'source-trace':{no:'01',name:'SOURCE TRACE',tag:'PROVENANCE / CHECKPOINT',desc:'記事の主張から、根拠がどこまで遡れるかを一本ずつ辿る。一次情報に届くことも、途中で出典が切れることも成果として残す。',kind:'trace'},
'question-chain':{no:'02',name:'QUESTION CHAIN',tag:'UNFINISHED THREAD / REVEAL',desc:'答えを当てるのではなく、今ある情報から「次に確かめる問い」を開いていく。問いが残ること自体を探索資産にする。',kind:'questions'},
'coverage-board':{no:'03',name:'COVERAGE BOARD',tag:'COMPLETION WITHOUT CERTAINTY',desc:'理解度ではなく、どの観点を実際に見たかだけを盤面に残す。UNKNOWNは空欄ではなく、確認済みの未確定状態として扱う。',kind:'coverage'},
'comparison-lens':{no:'04',name:'COMPARISON LENS',tag:'COMPARE / SWITCH AXIS',desc:'二つの情報源を、時刻・表現・根拠・未確定点など比較軸を切り替えながら読む。差分そのものが次の探索理由になる。',kind:'compare'},
'discovery-hand':{no:'05',name:'DISCOVERY HAND',tag:'CHOICE / COLLECTION',desc:'一度に3つだけ提示される「次のつながり」から、自分が追いたい1つを選ぶ。選ばなかった道も消さず、後で戻れる。',kind:'hand'},
'chronology-table':{no:'06',name:'CHRONOLOGY TABLE',tag:'ORDER / UNCERTAINTY',desc:'出来事の断片を時間順に並べ、確定時刻と推定時間帯を分けて扱う。並べ替えはユーザーの作業仮説として保存する。',kind:'timeline'},
'claim-pair':{no:'07',name:'CLAIM PAIR',tag:'HYPOTHESIS → VERIFICATION',desc:'別々の主張を二つ選んで並べ、各主張の根拠と不足を比較する。勝者を決めず、何が未検証かを残す。',kind:'pair'},
'return-file':{no:'08',name:'RETURN FILE',tag:'RETURN MOTIVATION / OPEN LOOP',desc:'未解決の問いを「また戻る理由」として残し、後から新しい材料だけを差分で確認する。継続の中心をstreakではなく未完了の調査に置く。',kind:'return'},
'collection-shelf':{no:'09',name:'COLLECTION SHELF',tag:'PERSONAL ARCHIVE / CURATION',desc:'探索中に見つけたものを、自分の意図で Evidence / Context / Unknown の棚へ残す。同じ発見は複数の棚に置ける。',kind:'collection'},
'actor-view':{no:'10',name:'ACTOR VIEW',tag:'PERSPECTIVE / ATTRIBUTION',desc:'関係者ごとに「何を述べたか」「何を根拠にしているか」を切り替えて見る。視点を変えても、主張と事実を混ぜない。',kind:'actor'}
};
const mode=MODES[window.LAB_MODE]||MODES['source-trace'];
const KEY='kawasemi-dive-lab-b-'+window.LAB_MODE;
const now=()=>new Date().toISOString();
const seed={startedAt:now(),lastActiveAt:now(),activeDurationMs:0,current:'anchor',currentStepId:'s0',steps:[{id:'s0',parentStepId:null,nodeId:'anchor',label:'記事',type:'anchor',openedAt:now()}],route:['記事'],visited:['anchor'],saved:[],openQuestions:[],openedEvidence:[],comparisons:[],actions:[],timelineOrder:['t1','t2','t3','t4'],pair:[],actor:'agency',activeShelf:'Evidence',collection:{Evidence:[],Context:[],Unknown:[]},paused:false};
let state=load();let activeTick=Date.now();
function load(){try{const stored=JSON.parse(localStorage.getItem(KEY)||'{}');const merged={...seed,...stored};merged.collection={...seed.collection,...(stored.collection||{})};merged.steps=Array.isArray(stored.steps)&&stored.steps.length?stored.steps:[...seed.steps];merged.currentStepId=stored.currentStepId||merged.steps[merged.steps.length-1].id;return merged}catch(e){return {...seed,steps:[...seed.steps],collection:{...seed.collection}}}}
function syncDuration(){if(document.visibilityState==='visible'){const t=Date.now();state.activeDurationMs=(state.activeDurationMs||0)+Math.max(0,t-activeTick);activeTick=t}}
function persist(){syncDuration();state.lastActiveAt=now();localStorage.setItem(KEY,JSON.stringify(state));renderSession()}
function action(type,label,extra={}){const at=now();const stepId='s'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);state.actions.push({type,label,at,...extra,stepId});state.steps.push({id:stepId,parentStepId:state.currentStepId,nodeId:extra.nodeId||label,label,type,openedAt:at,...extra});state.currentStepId=stepId;state.route.push(label);if(!state.visited.includes(label))state.visited.push(label);state.current=label;persist()}
function saveDiscovery(id,label){if(!state.saved.find(x=>x.id===id)){state.saved.push({id,label,at:now(),step:state.current})}persist()}
function keepQuestion(id,text){if(!state.openQuestions.find(x=>x.id===id)){state.openQuestions.push({id,text,at:now(),state:'open'})}persist()}
function markEvidence(id){if(!state.openedEvidence.includes(id))state.openedEvidence.push(id);persist()}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function shell(){
 document.getElementById('app').innerHTML=`
 <div class="lab-app">
  <header class="lab-topbar">
   <button class="icon-btn" id="backBtn" aria-label="一つ前へ戻る"><span class="back-glyph" aria-hidden="true"></span></button>
   <div class="lab-mark">DIVE LAB B · <strong>${mode.no}</strong></div>
   <div class="top-actions"><button class="text-btn" id="themeBtn">LIGHT</button><button class="text-btn" id="pauseBtn">PAUSE</button></div>
  </header>
  <main class="lab-main">
   <div class="fixture-note">LAB FIXTURE — 架空の検証用記事 / 実在のニュースではありません</div>
   <div class="title-row"><div class="eyebrow">${mode.tag}</div><h1>${mode.name}</h1><p>${mode.desc}</p></div>
   <div class="layout">
    <article class="article" aria-label="起点の記事">
     <div class="article-cover"><div class="article-source">KAWASEMI LAB · 08:40</div><h2>沿岸観測施設で通信障害。複数の説明が出ているが、原因はまだ確定していない</h2><p>機関発表、保守会社の説明、自治体の現地情報を分けて確認する必要がある。</p></div>
     <div class="article-body"><p>観測データの一部配信に遅延が生じた。運用機関は設備障害を確認したと発表。保守会社は外部回線の可能性に言及している。一方、現地自治体は施設周辺で停電は確認していないとしている。</p><div class="source-line">表示上の状態：<strong>CONFIRMED</strong> 配信遅延 / <strong>CLAIM</strong> 原因候補 / <strong>UNKNOWN</strong> 最終原因</div></div>
    </article>
    <section class="work" aria-live="polite"><div class="work-head"><div><small>PRIMARY INTERACTION</small><h3 id="workTitle"></h3></div><span class="status-chip" id="statusChip"></span></div><div class="micro" id="workMicro"></div><div id="mechanic" class="mechanic"></div></section>
    <aside class="session" aria-label="DIVE SESSION"><h3>DIVE SESSION</h3><div class="session-stats"><div class="stat"><strong id="visitedN">0</strong><span>VISITED</span></div><div class="stat"><strong id="savedN">0</strong><span>SAVED</span></div><div class="stat"><strong id="openN">0</strong><span>OPEN</span></div></div><div class="trail" id="trail"></div><div class="session-list" id="sessionList"></div></aside>
   </div>
  </main>
  <nav class="lab-nav" aria-label="KAWASEMI modes"><button class="nav-item">CARDS</button><button class="nav-item">LIVE</button><button class="nav-item active">DIVE</button></nav>
 </div>
 <div id="resumeHome" class="resume-home hidden"></div>`;
 document.getElementById('themeBtn').onclick=()=>{const html=document.documentElement;const light=html.dataset.theme==='light';html.dataset.theme=light?'dark':'light';document.getElementById('themeBtn').textContent=light?'LIGHT':'DARK'};
 document.getElementById('pauseBtn').onclick=pause;
 document.getElementById('backBtn').onclick=back;
}
function pause(){state.paused=true;persist();showResume()}
function showResume(){
 const home=document.getElementById('resumeHome');home.classList.remove('hidden');home.innerHTML=`<div class="resume-card"><small>CONTINUE · ${mode.name}</small><h2>この探索は、途中のまま残っています。</h2><p>理解度ではなく、実際に開いたもの・保存したもの・残した問い・最後の位置だけを復元します。</p><div class="resume-summary"><div><strong>${state.visited.length}</strong><span>VISITED</span></div><div><strong>${state.saved.length}</strong><span>SAVED</span></div><div><strong>${state.openQuestions.length}</strong><span>OPEN</span></div></div><div class="button-row"><button class="primary" id="resumeBtn">RESUME</button><button class="secondary" id="newBtn">NEW SESSION</button></div></div>`;
 document.getElementById('resumeBtn').onclick=()=>{state.paused=false;persist();home.classList.add('hidden');renderMechanic()};
 document.getElementById('newBtn').onclick=()=>{localStorage.removeItem(KEY);state={...seed,startedAt:now(),lastActiveAt:now(),activeDurationMs:0,current:'anchor',currentStepId:'s0',steps:[{id:'s0',parentStepId:null,nodeId:'anchor',label:'記事',type:'anchor',openedAt:now()}],route:['記事'],visited:['anchor'],saved:[],openQuestions:[],openedEvidence:[],comparisons:[],actions:[],timelineOrder:['t1','t2','t3','t4'],pair:[],actor:'agency',activeShelf:'Evidence',collection:{Evidence:[],Context:[],Unknown:[]},paused:false};activeTick=Date.now();persist();home.classList.add('hidden');renderMechanic()}
}
function back(){if(!state.actions.length)return;const a=state.actions.pop();const step=state.steps.find(x=>x.id===state.currentStepId);state.currentStepId=(step&&step.parentStepId)||'s0';state.route.pop();state.current=state.route[state.route.length-1]||'anchor';if(a.type==='reorder'&&a.beforeOrder)state.timelineOrder=[...a.beforeOrder];if(a.type==='pair'&&a.previousPair)state.pair=[...a.previousPair];if(a.type==='actor'&&a.previousActor)state.actor=a.previousActor;persist();renderMechanic()}
function renderSession(){
 const v=document.getElementById('visitedN');if(!v)return;v.textContent=state.visited.length;document.getElementById('savedN').textContent=state.saved.length;document.getElementById('openN').textContent=state.openQuestions.length;
 document.getElementById('trail').innerHTML=state.route.slice(-8).map(x=>`<span>${esc(x)}</span>`).join('');
 const items=[];if(state.saved.length)items.push(`<div class="session-item"><div><strong>SAVED DISCOVERY</strong><p>${esc(state.saved[state.saved.length-1].label)}</p></div><span class="tag">EXPLICIT</span></div>`);
 if(state.openQuestions.length)items.push(`<div class="session-item"><div><strong>OPEN QUESTION</strong><p>${esc(state.openQuestions[state.openQuestions.length-1].text)}</p></div><span class="tag">USER KEPT</span></div>`);
 if(state.actions.length)items.push(`<div class="session-item"><div><strong>LAST POSITION</strong><p>${esc(state.current)}</p></div><span class="tag">RESUME</span></div>`);
 const dur=Math.max(0,Math.floor((state.activeDurationMs||0)/1000));items.push(`<div class="session-item"><div><strong>OBSERVABLE SESSION</strong><p>ACTIVE ${Math.floor(dur/60)}:${String(dur%60).padStart(2,'0')} · ${state.steps.length-1} OPENED STEPS</p></div><span class="tag">NO INFERENCE</span></div>`);document.getElementById('sessionList').innerHTML=items.join('');
}
function setHead(title,micro,chip){document.getElementById('workTitle').textContent=title;document.getElementById('workMicro').textContent=micro;document.getElementById('statusChip').textContent=chip}
function renderMechanic(){({trace:renderTrace,questions:renderQuestions,coverage:renderCoverage,compare:renderCompare,hand:renderHand,timeline:renderTimeline,pair:renderPair,return:renderReturn,collection:renderCollection,actor:renderActor}[mode.kind]||renderTrace)();renderSession()}
function renderTrace(){
 setHead('根拠を一段ずつ遡る','「出典がある」ではなく、どこから来た情報かを辿ります。途中で出典が切れたら、それも記録します。',`${state.openedEvidence.length}/3 OPENED`);
 const steps=[{id:'e1',label:'記事の記述',sub:'配信遅延が発生',src:'記事内の確認済み記述'},{id:'e2',label:'運用機関の障害情報',sub:'08:12に設備障害を掲示',src:'機関発表（fixture）'},{id:'e3',label:'監視ログ抜粋',sub:'回線断を示す時刻記録',src:'技術ログ（fixture）'}];
 const opened=Math.min(state.actions.filter(a=>a.type==='evidence').length,steps.length);let html=`<div class="trace-chain">${steps.map((s,i)=>`<div class="trace-step ${i<opened?'done':''}"><i>${i+1}</i><div><strong>${s.label}</strong><div class="micro">${s.sub}</div></div></div>`).join('')}</div>`;
 if(opened<steps.length){const s=steps[opened];html+=`<button class="primary" id="traceNext">次の出典を開く — ${s.label}</button>`}else html+=`<div class="detail"><small>CHECKPOINT</small><h4>ここまでは出典を遡れた</h4><p>最終原因そのものは、この経路だけでは確定できません。</p><div class="button-row"><button class="secondary" id="saveTrace">この経路を保存</button><button class="secondary" id="questionTrace">「原因は何か」を開いたまま残す</button></div></div>`;
 document.getElementById('mechanic').innerHTML=html;
 const n=document.getElementById('traceNext');if(n)n.onclick=()=>{const s=steps[opened];markEvidence(s.id);action('evidence',s.label,{evidenceId:s.id});renderTrace()};
 const sv=document.getElementById('saveTrace');if(sv)sv.onclick=()=>saveDiscovery('trace','記事→機関発表→監視ログの出典経路');
 const q=document.getElementById('questionTrace');if(q)q.onclick=()=>keepQuestion('cause','最終原因は何か？');
}
function renderQuestions(){
 setHead('次に確かめる問いを開く','答えを選ぶクイズではありません。今ある情報で次に意味のある問いを選び、根拠を見て、残す問いを決めます。',`${state.actions.length} STEPS`);
 const depth=Math.min(state.actions.length,3);const qs=[{q:'配信遅延は、どこまで影響した？',a:'3観測点で遅延。欠測の有無は別確認が必要。',next:'欠測は発生した？'},{q:'設備障害と外部回線、どちらが先に観測された？',a:'時刻情報はあるが、因果関係は未確定。',next:'因果を確認できる一次ログはある？'},{q:'停電がなかったことは何を否定できる？',a:'施設全体停電の可能性は下がるが、機器単体障害は否定できない。',next:'機器単体の電源ログはある？'}];
 let html=`<div class="question-stack">${qs.slice(0,depth).map((x,i)=>`<div class="question-card open"><small>OPENED ${i+1}</small><h4>${x.q}</h4><div class="answer">${x.a}</div></div>`).join('')}</div>`;
 if(depth<3){html+=`<div class="option-grid">${qs.slice(depth).map((x,i)=>`<button class="choice" data-q="${depth+i}"><span class="type">QUESTION</span><strong>${x.q}</strong><span>${i===0?'影響範囲を絞る':'別の角度から確かめる'}</span></button>`).join('')}</div>`}else{html+=`<div class="detail"><small>UNFINISHED THREAD</small><h4>${qs[1].next}</h4><p>十分な根拠がないため、答えを埋めずに次回へ残せます。</p><div class="button-row"><button class="secondary" id="keepQ">OPEN QUESTIONとして残す</button><button class="secondary" id="saveQ">この問いの流れを保存</button></div></div>`}
 document.getElementById('mechanic').innerHTML=html;document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const x=qs[+b.dataset.q];markEvidence('q'+b.dataset.q);action('question',x.q,{evidenceId:'q'+b.dataset.q});renderQuestions()});
 const k=document.getElementById('keepQ');if(k)k.onclick=()=>keepQuestion('log','因果を確認できる一次ログはある？');const s=document.getElementById('saveQ');if(s)s.onclick=()=>saveDiscovery('question-thread','影響範囲→因果→一次ログへ進んだ問いの流れ');
}
function renderCoverage(){
 setHead('見た観点だけを埋める','盤面は理解度ではなく閲覧履歴です。UNKNOWNを開いた場合も「未確定を確認した」という観察として残ります。',`${state.visited.length-1} FACETS VISITED`);
 const cells=[['confirmed','CONFIRMED','何が確認済み？','配信遅延は確認済み'],['claims','CLAIMS','誰が何を主張？','原因候補は複数'],['unknown','UNKNOWN','まだ何が不明？','最終原因は未確定'],['impact','IMPACT','何に影響？','3観測点で遅延'],['history','HISTORY','過去に似た障害？','類似は背景であり証拠ではない'],['sources','SOURCES','元資料は？','機関発表・会社説明・自治体情報']];
 document.getElementById('mechanic').innerHTML=`<div class="coverage">${cells.map(c=>{const on=state.visited.includes(c[0]);return `<div class="coverage-cell ${on?'visited':''} ${c[0]==='unknown'?'unknown':''}"><button data-cell="${c[0]}"><small>${c[1]}</small><strong>${c[2]}</strong></button><span class="state">${on?c[3]:'未閲覧'}</span></div>`}).join('')}</div><div class="micro">全マスを埋める必要はありません。必要な観点だけ見て離脱できます。</div>`;
 document.querySelectorAll('[data-cell]').forEach(b=>b.onclick=()=>{action('facet',b.dataset.cell);if(b.dataset.cell==='unknown')keepQuestion('unknown-cause','最終原因はまだ何が分からない？');renderCoverage()});
}
function renderCompare(){
 const axes=['時刻','表現','根拠','未確定点'];const activeCompare=[...state.actions].reverse().find(a=>a.type==='compare');const current=activeCompare?.axis||'時刻';setHead('比較軸を切り替える','同じ出来事について、二つの説明を一つに平均せず、差分をそのまま確認します。',`${state.comparisons.length} AXES VIEWED`);
 const copy={'時刻':['08:12 設備障害を確認','08:19 外部回線の可能性に言及'],'表現':['「設備障害を確認」','「外部回線の可能性も調査中」'],'根拠':['内部監視のアラート','保守担当者の初期調査'],'未確定点':['障害箇所の最終特定','回線側が主因かどうか']};
 document.getElementById('mechanic').innerHTML=`<div class="compare-tabs">${axes.map(a=>`<button data-axis="${a}" class="${a===current?'active':''}">${a}</button>`).join('')}</div><div class="compare-grid"><div class="compare-pane"><small>運用機関</small><p>${copy[current][0]}</p></div><div class="compare-pane"><small>保守会社</small><p>${copy[current][1]}</p></div></div><div class="detail"><small>DELTA</small><h4>${current}の差をそのまま残す</h4><p>差があること自体は矛盾確定ではありません。追加確認の入口として扱います。</p><div class="button-row"><button class="secondary" id="saveDelta">この差分を保存</button><button class="secondary" id="keepDelta">未確定点を残す</button></div></div>`;
 document.querySelectorAll('[data-axis]').forEach(b=>b.onclick=()=>{if(!state.comparisons.includes(b.dataset.axis))state.comparisons.push(b.dataset.axis);action('compare','比較:'+b.dataset.axis,{axis:b.dataset.axis});renderCompare()});
 document.getElementById('saveDelta').onclick=()=>saveDiscovery('delta-'+current,current+'の説明差分');document.getElementById('keepDelta').onclick=()=>keepQuestion('delta-q',current+'の差は何で説明できる？');
}
function renderHand(){
 const round=Math.min(state.actions.filter(a=>a.type==='pick').length,2);const packs=[[{id:'h1',t:'通信経路',q:'外部回線の構成を見る',rel:'technical_dependency'},{id:'h2',t:'過去障害',q:'類似した停止事例を見る',rel:'historically_similar_to'},{id:'h3',t:'影響先',q:'遅延した観測点を見る',rel:'affects'}],[{id:'h4',t:'監視ログ',q:'回線断の時刻を見る',rel:'evidence_for'},{id:'h5',t:'保守契約',q:'責任範囲を見る',rel:'context_for'},{id:'h6',t:'復旧経路',q:'代替回線の有無を見る',rel:'explains'}],[{id:'h7',t:'時刻差',q:'発表とログの差を見る',rel:'context_for'},{id:'h8',t:'現地状況',q:'停電情報と照合する',rel:'contrasts_with'},{id:'h9',t:'未解決',q:'最終原因の不足証拠を見る',rel:'unknown'}]];
 setHead('3つから、追いたい道を1つ選ぶ','AIが「正解の次」を決めません。小さな候補群からユーザーが方向を選び、選ばなかった道も後で戻れます。',`ROUND ${round+1}`);
 const pack=packs[round];document.getElementById('mechanic').innerHTML=`<div class="hand">${pack.map(x=>`<div class="hand-card"><small>${x.rel}</small><strong>${x.t}</strong><p>${x.q}</p><button data-pick="${x.id}">この道を追う</button></div>`).join('')}</div>${round===2?`<div class="detail"><small>TRAIL DECK</small><h4>選んだ発見だけが、今回の探索の束になる</h4><p>訪れた候補はHISTORY、明示的に残したものだけSAVEDです。</p><button class="secondary" id="saveHand">最後の発見を保存</button></div>`:''}`;
 document.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const x=pack.find(y=>y.id===b.dataset.pick);action('pick',x.t,{relation:x.rel});if(x.rel==='unknown')keepQuestion('hand-unknown','最終原因に必要な証拠は何か？');renderHand()});const s=document.getElementById('saveHand');if(s)s.onclick=()=>saveDiscovery('hand-last',state.current);
}
function renderTimeline(){
 const items={t1:{when:'08:12',title:'設備障害を検知',note:'監視ログ',certain:true},t2:{when:'08:19',title:'外部回線の可能性を調査',note:'保守会社説明',certain:true},t3:{when:'08:05–08:20',title:'利用者側で遅延を認識',note:'正確な開始時刻は不明',certain:false},t4:{when:'08:31',title:'一部経路を切替',note:'復旧作業記録',certain:true}};
 setHead('断片を並べ替える','時刻が確定した断片と、幅しか分からない断片を同じ精度で扱いません。並びは「作業仮説」としてSESSIONに残します。','WORKING ORDER');
 document.getElementById('mechanic').innerHTML=`<div class="timeline">${state.timelineOrder.map((id,i)=>{const x=items[id];return `<div class="time-card ${state.current===id?'selected':''}"><div><div class="when">${x.when}</div><div class="uncertain">${x.certain?'SOURCE TIME':'TIME RANGE'}</div></div><div><strong>${x.title}</strong><span>${x.note}</span><div class="timeline-controls"><button data-move="up" data-id="${id}" aria-label="上へ移動">↑</button><button data-move="down" data-id="${id}" aria-label="下へ移動">↓</button><button data-time="${id}">確認</button></div></div></div>`}).join('')}</div><div class="detail"><small>NOTE</small><h4>「利用者が気づいた時刻」は幅のまま</h4><p>並べても確定時刻には変換しません。</p><button class="secondary" id="saveTimeline">この作業順を保存</button></div>`;
 document.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const i=state.timelineOrder.indexOf(b.dataset.id),j=b.dataset.move==='up'?i-1:i+1;if(j>=0&&j<state.timelineOrder.length){const beforeOrder=[...state.timelineOrder];[state.timelineOrder[i],state.timelineOrder[j]]=[state.timelineOrder[j],state.timelineOrder[i]];action('reorder','時系列を並べ替え',{beforeOrder});renderTimeline()}});document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{action('timeline',b.dataset.time,{evidenceId:'time-'+b.dataset.time});markEvidence('time-'+b.dataset.time);renderTimeline()});document.getElementById('saveTimeline').onclick=()=>saveDiscovery('timeline','作業中の時系列: '+state.timelineOrder.join(' → '));
}
function renderPair(){
 const claims=[{id:'c1',who:'運用機関',text:'設備側の障害を確認した',ev:'内部監視アラートあり'},{id:'c2',who:'保守会社',text:'外部回線が原因の可能性がある',ev:'初期調査段階。確定ログなし'},{id:'c3',who:'自治体',text:'周辺の停電は確認していない',ev:'地域停電情報'},{id:'c4',who:'利用者報告',text:'08:10頃から遅延を感じた',ev:'観測報告。時刻に幅あり'}];setHead('二つの主張をペアにする','「どちらが正しい？」ではなく、二つを同時に置いて、それぞれの根拠と不足を比較します。',`${state.pair.length}/2 SELECTED`);
 document.getElementById('mechanic').innerHTML=`<div class="pair-zone">${[0,1].map(i=>{const c=claims.find(x=>x.id===state.pair[i]);return `<div class="pair-slot"><small>CLAIM ${i+1}</small>${c?`<strong>${c.who}: ${c.text}</strong><div class="micro">${c.ev}</div>`:`<div class="micro">下から選択</div>`}</div>`}).join('')}</div><div class="claim-list">${claims.map(c=>`<button class="claim-card ${state.pair.includes(c.id)?'selected':''}" data-claim="${c.id}"><span class="type">${c.who}</span><strong>${c.text}</strong><span>${c.ev}</span></button>`).join('')}</div>${state.pair.length===2?`<div class="detail"><small>VERIFICATION GAP</small><h4>両方を同時に成立/不成立と決める材料はない</h4><p>必要なのは原因箇所を直接示す一次ログ。UNKNOWNのまま保持できます。</p><div class="button-row"><button class="secondary" id="keepPair">不足証拠をOPEN QUESTIONへ</button><button class="secondary" id="savePair">この比較を保存</button></div></div>`:''}`;
 document.querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>{const previousPair=[...state.pair];if(!state.pair.includes(b.dataset.claim)){if(state.pair.length>=2)state.pair.shift();state.pair.push(b.dataset.claim)}action('pair','主張を比較',{claimId:b.dataset.claim,previousPair});renderPair()});const k=document.getElementById('keepPair');if(k)k.onclick=()=>keepQuestion('primary-log','原因箇所を直接示す一次ログはある？');const s=document.getElementById('savePair');if(s)s.onclick=()=>saveDiscovery('claim-pair','二つの主張と根拠不足の比較');
}
function renderReturn(){
 const opened=state.openQuestions.length>0;setHead('未解決の糸を「戻る理由」にする','毎日来させるstreakではなく、まだ終わっていない問いに新しい材料が来た時だけ戻る構造を試します。',opened?'1 OPEN THREAD':'NO THREAD');
 const updates=state.visited.includes('新しい材料');document.getElementById('mechanic').innerHTML=`<div class="return-list"><div class="return-thread ${opened?'open':''}"><small>OPEN QUESTION</small><strong>最終原因を示す一次ログはある？</strong><p>${opened?'前回の探索で明示的に残した問い':'まだSESSIONには残していません'}</p></div>${opened?`<div class="return-thread"><span class="new-signal">NEW SINCE THIS DIVE</span><strong>保守会社が追加の時刻情報を公開</strong><p>原因確定ではなく、比較できる材料が1件増えた状態。</p></div>`:''}</div><div class="button-row">${!opened?`<button class="primary" id="openThread">この問いを残してPAUSE</button>`:`<button class="primary" id="inspectUpdate">新しい材料だけ見る</button>`}</div>${updates?`<div class="detail"><small>RETURN CHECKPOINT</small><h4>新情報を見ても、問いは自動で「解決」にしない</h4><p>根拠が足りなければOPENのまま。ユーザーは必要なら再び離脱できます。</p><button class="secondary" id="saveUpdate">今回見た更新を保存</button></div>`:''}`;
 const o=document.getElementById('openThread');if(o)o.onclick=()=>{keepQuestion('return-cause','最終原因を示す一次ログはある？');action('open-thread','問いを残す');pause()};const i=document.getElementById('inspectUpdate');if(i)i.onclick=()=>{markEvidence('new-update');action('update','新しい材料');renderReturn()};const s=document.getElementById('saveUpdate');if(s)s.onclick=()=>saveDiscovery('return-update','前回DIVE以降に追加された時刻情報');
}
function renderCollection(){
 const discoveries=[{id:'d1',label:'08:12の監視アラート',default:'Evidence'},{id:'d2',label:'過去の類似障害',default:'Context'},{id:'d3',label:'原因箇所は未確定',default:'Unknown'}];setHead('発見を、自分の棚に残す','自動分類で「学んだもの」にしません。ユーザーが明示的に残した発見だけをセッション内コレクションへ入れます。','CURATE');
 const counts=Object.fromEntries(Object.entries(state.collection).map(([k,v])=>[k,v.length]));document.getElementById('mechanic').innerHTML=`<div class="collection-shelf">${Object.keys(state.collection).map(k=>`<button class="collection-card ${state.activeShelf===k?'selected':''}" data-shelf="${k}"><span class="type">${k.toUpperCase()}</span><strong class="count">${counts[k]}</strong><span>saved discoveries</span></button>`).join('')}</div><div class="discovery-list">${discoveries.map(d=>`<div class="discovery-item"><strong>${d.label}</strong><button data-add="${d.id}" aria-label="${d.label}を保存">＋</button></div>`).join('')}</div><div class="micro">同じ発見を複数の棚へ置くこともできます。棚は真偽判定ではなく、個人の整理です。</div>`;
 document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const d=discoveries.find(x=>x.id===b.dataset.add);const shelf=state.activeShelf||d.default;if(!state.collection[shelf].includes(d.id))state.collection[shelf].push(d.id);saveDiscovery(d.id,d.label);action('collect',d.label,{discoveryId:d.id,shelf});renderCollection()});document.querySelectorAll('[data-shelf]').forEach(b=>b.onclick=()=>{state.activeShelf=b.dataset.shelf;action('shelf','棚:'+b.dataset.shelf,{shelf:b.dataset.shelf});renderCollection()});
}
function renderActor(){
 const actors={agency:{name:'運用機関',claim:'設備障害を確認した',basis:'内部監視アラート',unknown:'障害箇所の最終特定'},vendor:{name:'保守会社',claim:'外部回線の可能性も調査中',basis:'初期調査と回線状況',unknown:'回線側が主因か'},city:{name:'自治体',claim:'周辺停電は確認していない',basis:'地域停電情報',unknown:'施設内部の機器状態'}};const cur=actors[state.actor];setHead('話者を切り替える','誰が何を言ったかを視点ごとに分離します。視点を切り替えても、KAWASEMIが「どちらを信じるべき」とは決めません。','ATTRIBUTED');
 document.getElementById('mechanic').innerHTML=`<div class="actor-tabs">${Object.entries(actors).map(([id,a])=>`<button class="actor-card ${id===state.actor?'selected':''}" data-actor="${id}"><span class="type">ACTOR</span><strong>${a.name}</strong><span>この話者の記録を見る</span></button>`).join('')}</div><div class="actor-evidence"><div class="actor-note"><small>CLAIM</small><p>${cur.claim}</p></div><div class="actor-note"><small>BASIS</small><p>${cur.basis}</p></div><div class="actor-note"><small>UNKNOWN</small><p>${cur.unknown}</p></div></div><div class="button-row"><button class="secondary" id="saveActor">この話者の記録を保存</button><button class="secondary" id="openActorQ">未確定点を残す</button></div>`;
 document.querySelectorAll('[data-actor]').forEach(b=>b.onclick=()=>{const previousActor=state.actor;state.actor=b.dataset.actor;action('actor','話者:'+actors[state.actor].name,{previousActor,actorId:state.actor});renderActor()});document.getElementById('saveActor').onclick=()=>saveDiscovery('actor-'+state.actor,cur.name+'の主張・根拠・未確定点');document.getElementById('openActorQ').onclick=()=>keepQuestion('actor-q-'+state.actor,cur.unknown+'は何で確認できる？');
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){syncDuration();state.lastActiveAt=now();localStorage.setItem(KEY,JSON.stringify(state))}else activeTick=Date.now()});window.addEventListener('beforeunload',()=>{syncDuration();state.lastActiveAt=now();localStorage.setItem(KEY,JSON.stringify(state))});shell();renderMechanic();if(state.paused)showResume();
})();
