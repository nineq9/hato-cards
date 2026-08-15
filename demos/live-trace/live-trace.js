const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const baseNow = () => new Date();
const minutesAgo = (n, base=baseNow()) => new Date(base.getTime() - n * 60000);
const fmt = d => d.toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit',hour12:false});
const fmtSeconds = d => d.toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});

function makeSignal({id,time,source,actor,truthState,headline,claim,stateNote,originalTitle,originalExcerpt,url}){
  return {id,time,source,actor,truthState,headline,claim,stateNote,originalTitle,originalExcerpt,url};
}

function createState(){
  const now = baseNow();
  return {
    mode:'grouped', paused:false, injected:0, pendingNew:0, lastChecked:minutesAgo(22,now),
    clusters:[
      {
        id:'power-grid',time:minutesAgo(2.6,now),title:'キーウ周辺の電力設備について複数のSignal',
        summary:'停電、設備停止、現地観測が同じ時間帯に入っています。原因や被害規模はまだ確定していません。',
        changed:true,card:{status:'available',reason:''},signals:[
          makeSignal({id:'s1',time:minutesAgo(4.0,now),source:'Kyiv City Administration',actor:'KYIV CITY ADMINISTRATION',truthState:'CLAIM',headline:'市内の一部地域で停電が発生したと発表',claim:'市内の一部地域で停電が発生したとしています。',stateNote:'Official statement · independently unconfirmed',originalTitle:'Power interruptions reported in several districts',originalExcerpt:'The city administration says power interruptions are affecting several districts. Cause and duration remain under assessment.',url:'https://example.com/'}),
          makeSignal({id:'s2',time:minutesAgo(3.5,now),source:'Reuters Demo Wire',actor:'REUTERS DEMO WIRE',truthState:'CLAIM',headline:'現地当局の発表を引用し、停電と爆発音を報道',claim:'現地当局を引用し、停電と爆発音があったと報じています。',stateNote:'Secondary reporting · source attribution preserved',originalTitle:'Power disruption reported around Kyiv after overnight alerts',originalExcerpt:'A demo wire report cites local officials describing outages and reports of explosions. It does not independently establish the cause.',url:'https://example.com/'}),
          makeSignal({id:'s3',time:minutesAgo(3.0,now),source:'Local Monitor',actor:'LOCAL MONITOR',truthState:'UNKNOWN',headline:'市北部で閃光を見たとの投稿',claim:'市北部で閃光を見たと投稿しています。',stateNote:'Unverified local observation',originalTitle:'Flash seen north of the city',originalExcerpt:'A local monitoring account posts that a flash was visible to the north. Location and cause are not verified.',url:'https://example.com/'}),
          makeSignal({id:'s4',time:minutesAgo(2.6,now),source:'Ukraine Energy Demo',actor:'UKRAINE ENERGY OPERATOR',truthState:'CONFIRMED',headline:'運用中設備の一部停止を事業者が確認',claim:'自社設備の一部停止を確認し、原因を調査中としています。',stateNote:'Direct operator confirmation · cause unknown',originalTitle:'Operator confirms partial equipment outage',originalExcerpt:'The operator confirms that part of its equipment is offline. It says the cause is under investigation and gives no attribution.',url:'https://example.com/'})
        ]
      },
      {
        id:'border-claim',time:minutesAgo(7.7,now),title:'国境付近の無人機活動をめぐり異なる主体が別々の説明',
        summary:'複数の当事者発表は同じ時間帯を指す可能性がありますが、対象・結果の説明は一致していません。',
        changed:true,card:{status:'not',reason:'独立確認が不足しているため、現時点ではCARDSの有限レビューキューには入れていないデモ状態です。'},signals:[
          makeSignal({id:'s5',time:minutesAgo(8.8,now),source:'Ukraine Air Command Demo',actor:'UKRAINE AIR COMMAND',truthState:'CLAIM',headline:'複数の無人機を迎撃したと発表',claim:'複数の無人機を迎撃したと主張しています。',stateNote:'Party claim · not independently confirmed',originalTitle:'Air command reports drone interceptions',originalExcerpt:'The command says several drones were intercepted. This demo does not independently verify the number or outcome.',url:'https://example.com/'}),
          makeSignal({id:'s6',time:minutesAgo(8.2,now),source:'Russian MOD Demo',actor:'RUSSIAN MOD',truthState:'CLAIM',headline:'指定した目標に到達したと発表',claim:'指定した目標に到達したと主張しています。',stateNote:'Party claim · not independently confirmed',originalTitle:'Defence ministry reports intended targets reached',originalExcerpt:'The ministry says intended targets were reached. The demo preserves this as an attributed claim rather than a confirmed result.',url:'https://example.com/'}),
          makeSignal({id:'s7',time:minutesAgo(7.7,now),source:'OSINT Desk Demo',actor:'OSINT DESK',truthState:'UNKNOWN',headline:'公開映像の撮影地点を確認中',claim:'公開映像の位置情報を検証中で、結論はまだ出していません。',stateNote:'Verification in progress',originalTitle:'Geolocation review remains incomplete',originalExcerpt:'Analysts are attempting to geolocate public video. No final location or event attribution has been established.',url:'https://example.com/'})
        ]
      },
      {
        id:'port',time:minutesAgo(13.8,now),title:'黒海沿岸の港湾運用に小さな変化',
        summary:'港湾当局の運用通知と船舶追跡情報に変化。現時点では大きな事件かどうかは不明です。',
        changed:false,card:{status:'not',reason:'変化は観測されていますが、影響範囲がまだ小さく、CARDSには入っていないデモ状態です。'},signals:[
          makeSignal({id:'s8',time:minutesAgo(14.5,now),source:'Port Authority Demo',actor:'PORT AUTHORITY',truthState:'CONFIRMED',headline:'一部バースの運用変更を公式通知',claim:'港湾当局が一部バースの運用変更を告知しています。',stateNote:'Direct official notice',originalTitle:'Temporary berth operating change',originalExcerpt:'The port authority publishes a temporary operating change for selected berths. No broader cause is given.',url:'https://example.com/'}),
          makeSignal({id:'s9',time:minutesAgo(13.8,now),source:'Marine Tracker Demo',actor:'MARINE TRACKER',truthState:'UNKNOWN',headline:'公開データ上で入港待ち船舶が増加',claim:'公開船舶データ上、待機船が通常より増えているように見えるとしています。',stateNote:'Open-source observation · significance unknown',originalTitle:'Vessels appear to be holding outside port',originalExcerpt:'Public tracking data appears to show more vessels holding outside port than in the immediately preceding period. Significance is uncertain.',url:'https://example.com/'})
        ]
      }
    ],
    ungrouped:[
      makeSignal({id:'u1',time:minutesAgo(5,now),source:'Regional Rail Demo',actor:'REGIONAL RAIL',truthState:'CONFIRMED',headline:'夜間列車の一部遅延を公式告知',claim:'運行事業者が一部列車の遅延を告知しています。',stateNote:'Ungrouped direct service notice',originalTitle:'Selected night services delayed',originalExcerpt:'The regional rail operator lists delays on selected night services. No relation to other incoming events is stated.',url:'https://example.com/'}),
      makeSignal({id:'u2',time:minutesAgo(11,now),source:'Weather Service Demo',actor:'WEATHER SERVICE',truthState:'CONFIRMED',headline:'南部の強風警報を更新',claim:'気象機関が南部の強風警報を更新しています。',stateNote:'Ungrouped official weather update',originalTitle:'Strong wind warning updated for southern region',originalExcerpt:'The weather service updates its wind warning. The signal is retained even though it is not grouped with another event.',url:'https://example.com/'})
    ],
    newSince:[
      {time:minutesAgo(7.7,now),label:'OSINT Desk Demo',detail:'border-claim cluster に検証中Signalが追加'},
      {time:minutesAgo(3.0,now),label:'Local Monitor',detail:'power-grid cluster に未確認の現地観測が追加'},
      {time:minutesAgo(2.6,now),label:'Ukraine Energy Demo',detail:'power-grid cluster に直接確認できる設備状態が追加'},
      {time:minutesAgo(5,now),label:'Regional Rail Demo',detail:'UNGROUPEDの新規Signal'}
    ]
  };
}

let state = createState();
let streamInterval = null;
let streamStartTimeout = null;
let sheetStack = [];
let lockedPageY = 0;

const incoming = [
  {cluster:'power-grid',source:'Emergency Service Demo',actor:'EMERGENCY SERVICE',truthState:'CLAIM',headline:'現場対応を開始したと発表',claim:'現場対応を開始し、被害規模はまだ確定していないとしています。',stateNote:'Official claim · extent unknown',originalTitle:'Emergency response reported at infrastructure site',originalExcerpt:'The emergency service says crews have been dispatched. It does not provide a confirmed damage estimate.',url:'https://example.com/'},
  {cluster:'border-claim',source:'AP Demo Desk',actor:'AP DEMO DESK',truthState:'UNKNOWN',headline:'双方の発表を確認したが独立検証は未完了と報道',claim:'双方の発表を伝えつつ、独立確認はできていないとしています。',stateNote:'Secondary reporting · uncertainty preserved',originalTitle:'Competing drone claims remain unverified',originalExcerpt:'A demo desk reports both parties’ statements and says it cannot independently verify the claimed outcomes.',url:'https://example.com/'},
  {cluster:null,source:'Regional Telegram Demo',actor:'REGIONAL TELEGRAM',truthState:'UNKNOWN',headline:'遠方で爆発音を聞いたとの投稿',claim:'遠方で爆発音を聞いたと投稿しています。',stateNote:'Unverified · ungrouped',originalTitle:'Unverified post reports distant explosion sound',originalExcerpt:'A regional channel posts that a distant explosion was heard. Location, time, and cause are not verified.',url:'https://example.com/'},
  {cluster:'port',source:'Shipping Company Demo',actor:'SHIPPING COMPANY',truthState:'CLAIM',headline:'到着予定を数時間後ろ倒し',claim:'到着予定の変更を通知していますが、理由は示していません。',stateNote:'Company notice · cause not stated',originalTitle:'Arrival schedule revised',originalExcerpt:'The shipping company revises an arrival time by several hours without stating a reason.',url:'https://example.com/'}
];

const timeline = $('#timeline');
const groupedBtn = $('#groupedBtn');
const allBtn = $('#allBtn');
const pauseBtn = $('#pauseBtn');
const newReturn = $('#newReturn');
const backdrop = $('#backdrop');
const sheet = $('#detailSheet');
const sheetBody = $('#sheetBody');
const sheetLabel = $('#sheetLabel');
const sheetBack = $('#sheetBack');
const cardPreview = $('#cardPreview');

function allSignals(){
  const grouped = state.clusters.flatMap(c => c.signals.map(s => ({...s,clusterId:c.id,clusterTitle:c.title,cardStatus:c.card.status})));
  const ungrouped = state.ungrouped.map(s => ({...s,clusterId:null,clusterTitle:null,cardStatus:'not'}));
  return [...grouped,...ungrouped].sort((a,b)=>b.time-a.time);
}

function findSignal(id){return allSignals().find(s=>s.id===id)}
function findCluster(id){return state.clusters.find(c=>c.id===id)}
function isNearNow(){return window.scrollY < 120}

function captureAnchor(){
  if(isNearNow()) return null;
  const rows = $$('[data-row-key]',timeline);
  const anchor = rows.find(el => el.getBoundingClientRect().bottom > 150);
  return anchor ? {key:anchor.dataset.rowKey,top:anchor.getBoundingClientRect().top} : {key:null,scrollY:window.scrollY};
}
function restoreAnchor(anchor){
  if(!anchor) return;
  requestAnimationFrame(()=>{
    if(anchor.key){
      const el = timeline.querySelector(`[data-row-key="${anchor.key}"]`);
      if(el){window.scrollBy(0,el.getBoundingClientRect().top-anchor.top);return;}
    }
    if(typeof anchor.scrollY==='number') window.scrollTo(0,anchor.scrollY);
  });
}

function render({preserve=false}={}){
  const anchor = preserve ? captureAnchor() : null;
  groupedBtn.classList.toggle('active',state.mode==='grouped');
  allBtn.classList.toggle('active',state.mode==='all');
  groupedBtn.setAttribute('aria-pressed',String(state.mode==='grouped'));
  allBtn.setAttribute('aria-pressed',String(state.mode==='all'));
  pauseBtn.textContent = state.injected>=incoming.length ? '↻' : state.paused ? '▶' : 'Ⅱ';
  pauseBtn.setAttribute('aria-label',state.injected>=incoming.length?'デモを最初から再生':state.paused?'Signal追加を再開':'Signal追加を一時停止');
  state.mode==='grouped' ? renderGrouped() : renderAll();
  updateSince();
  updateNewReturn();
  restoreAnchor(anchor);
}

function renderGrouped(){
  const rows = [
    ...state.clusters.map(c=>({type:'cluster',time:c.time,data:c})),
    ...state.ungrouped.map(s=>({type:'signal',time:s.time,data:s}))
  ].sort((a,b)=>b.time-a.time);
  timeline.innerHTML = rows.map(row=>row.type==='cluster'?clusterHTML(row.data):signalHTML(row.data,true)).join('') || '<div class="empty">No incoming signals.</div>';
  bindTimeline();
}
function renderAll(){
  timeline.innerHTML = allSignals().map(s=>signalHTML(s,false)).join('') || '<div class="empty">No incoming signals.</div>';
  bindTimeline();
}
function bindTimeline(){
  $$('[data-cluster]',timeline).forEach(el=>el.addEventListener('click',()=>openView('cluster',el.dataset.cluster)));
  $$('[data-source]',timeline).forEach(el=>el.addEventListener('click',()=>openView('source',el.dataset.source)));
}

function clusterHTML(c){
  const recent = c.changed || c.signals.some(s=>Date.now()-s.time.getTime()<6*60000);
  const sourceNames = c.signals.slice(-3).map(s=>s.source).join(' · ');
  const queue = c.card.status==='available' ? '<span class="queue available">CARD AVAILABLE</span>' : '<span class="queue">Not queued</span>';
  return `<article class="entry ${recent?'new':''}" data-row-key="cluster-${c.id}">
    <div class="entry-time">${fmt(c.time)}</div><div class="entry-axis"><span class="axis-dot"></span></div>
    <button class="entry-main" type="button" data-cluster="${c.id}" aria-label="Event Clusterを開く: ${escapeText(c.title)}">
      <span class="meta-row"><span class="kind">LIKELY SAME EVENT</span><span class="source-count">${c.signals.length} signals · ${new Set(c.signals.map(s=>s.source)).size} sources</span>${recent?'<span class="new-tag">+NEW</span>':''}${queue}</span>
      <span class="entry-title">${escapeText(c.title)}</span><span class="entry-summary">${escapeText(c.summary)}</span>
      <span class="entry-foot"><span class="sources-mini">${escapeText(sourceNames)}</span><span class="open-cue">OPEN</span></span>
    </button></article>`;
}
function signalHTML(s,ungrouped){
  const isNew = state.newSince.some(n=>n.signalId===s.id || n.label===s.source) || Date.now()-s.time.getTime()<4*60000;
  const clusterHint = s.clusterId ? ` · AI groups as likely same event` : '';
  return `<article class="entry signal ${ungrouped?'ungrouped':''} ${isNew?'new':''}" data-row-key="signal-${s.id}">
    <div class="entry-time">${fmt(s.time)}</div><div class="entry-axis"><span class="axis-dot"></span></div>
    <button class="entry-main" type="button" data-source="${s.id}" aria-label="Sourceを開く: ${escapeText(s.source)}">
      <span class="meta-row"><span class="kind">${ungrouped?'UNGROUPED SIGNAL':'SIGNAL'}</span><span class="truth-label">${s.truthState}</span>${isNew?'<span class="new-tag">NEW</span>':''}<span class="queue ${s.cardStatus==='available'?'available':''}">${s.cardStatus==='available'?'CARD AVAILABLE':'Not queued'}</span></span>
      <span class="source-name">${escapeText(s.source)}</span><span class="entry-title">${escapeText(s.headline)}</span><span class="entry-summary">${escapeText(s.stateNote)}${clusterHint}</span>
    </button></article>`;
}

function updateSince(){
  const changedClusters = state.clusters.filter(c=>c.changed).length;
  $('#sinceSummary').textContent = `${state.newSince.length} SIGNALS · ${changedClusters} CLUSTERS CHANGED`;
  $('#sinceDetail').textContent = `前回確認 ${fmt(state.lastChecked)} · ${state.ungrouped.length} UNGROUPED`;
}
function updateNewReturn(){
  if(state.pendingNew>0 && !isNearNow()){
    newReturn.textContent = `${state.pendingNew} new signal${state.pendingNew===1?'':'s'} · ↑ NOW`;
    newReturn.classList.remove('hidden');
  } else newReturn.classList.add('hidden');
}

function truthSections(c){
  const definitions = {
    CONFIRMED:'このデモで直接確認できる範囲。Sourceと確認対象を分けて表示します。',
    CLAIM:'特定の主体の主張。KAWASEMIは事実へ変換しません。',
    UNKNOWN:'未検証・検証中・証拠不足。分からない状態を残します。'
  };
  return ['CONFIRMED','CLAIM','UNKNOWN'].map(key=>{
    const items = c.signals.filter(s=>s.truthState===key).sort((a,b)=>b.time-a.time);
    return `<div class="state-group"><div class="state-heading">${key}</div><div class="state-note">${definitions[key]}</div>${items.length?items.map(s=>`<div class="state-item"><strong>${escapeText(s.headline)}</strong><span>${escapeText(s.source)} · ${fmt(s.time)}</span></div>`).join(''):'<div class="none-yet">None yet.</div>'}</div>`;
  }).join('');
}

function renderClusterView(id){
  const c = findCluster(id); if(!c) return {label:'EVENT CLUSTER',html:'<div class="empty">Cluster not found.</div>'};
  const actors = c.signals.slice().sort((a,b)=>b.time-a.time).map(s=>`<div class="actor-row"><strong>${escapeText(s.actor)}</strong><p>${escapeText(s.claim)}</p><span>${s.truthState} · ${escapeText(s.stateNote)}</span></div>`).join('');
  const sources = c.signals.slice().sort((a,b)=>b.time-a.time).map(s=>`<button class="source-row" data-open-source="${s.id}" type="button" aria-label="Open source: ${escapeText(s.source)}"><span><strong>${escapeText(s.source)}</strong><span>${fmt(s.time)} · ${s.truthState} · ${escapeText(s.stateNote)}</span></span><b>›</b></button>`).join('');
  const queue = c.card.status==='available'
    ? `<div class="queue-box"><div class="queue-row"><strong>CARD AVAILABLE</strong><button class="card-open-btn" data-open-card="${c.id}" type="button">OPEN IN CARDS →</button></div></div>`
    : `<div class="queue-box"><div class="queue-row"><strong>Not queued</strong><button class="queue-detail-btn" data-show-why type="button">WHY?</button></div><div class="queue-reason hidden" data-queue-reason>${escapeText(c.card.reason)}</div></div>`;
  const html = `<div class="kicker">LIKELY SAME EVENT · ${fmt(c.time)}</div><h2 class="sheet-title">${escapeText(c.title)}</h2>
    <div class="sheet-meta"><span>${c.signals.length} signals</span><span>${new Set(c.signals.map(s=>s.source)).size} sources</span><span>${c.changed?'changed since last check':'no new change marker'}</span></div>
    <div class="ai-note">AI grouped ${c.signals.length} signals as a likely same event. This is a grouping hypothesis, not a claim that every signal describes the same event or that every statement is true.</div>
    <section class="section"><span class="section-label">WHAT IS KNOWN</span>${truthSections(c)}</section>
    <section class="section"><span class="section-label">WHO SAYS WHAT</span>${actors}</section>
    <section class="section"><span class="section-label">INDIVIDUAL SIGNALS / SOURCES</span>${sources}</section>
    <section class="section"><span class="section-label">CARDS STATUS</span>${queue}</section>`;
  return {label:'EVENT CLUSTER',html,after(){
    $$('[data-open-source]',sheetBody).forEach(el=>el.addEventListener('click',()=>openView('source',el.dataset.openSource)));
    const why = $('[data-show-why]',sheetBody); if(why) why.addEventListener('click',()=>{const reason=$('[data-queue-reason]',sheetBody);reason.classList.toggle('hidden');why.textContent=reason.classList.contains('hidden')?'WHY?':'HIDE';});
    const card = $('[data-open-card]',sheetBody); if(card) card.addEventListener('click',()=>openCardPreview(card.dataset.openCard));
  }};
}

function renderSourceView(id){
  const s = findSignal(id); if(!s) return {label:'SOURCE',html:'<div class="empty">Source not found.</div>'};
  const cluster = s.clusterId ? findCluster(s.clusterId) : null;
  const relation = cluster ? `AI currently groups this Signal with “${cluster.title}” as a likely same event.` : 'This Signal is currently UNGROUPED and remains visible.';
  const html = `<div class="kicker">${s.truthState} · ${escapeText(s.source)}</div><h2 class="sheet-title">${escapeText(s.headline)}</h2>
    <div class="sheet-meta"><span>${fmt(s.time)}</span><span>${escapeText(s.actor)}</span></div>
    <div class="source-copy">${escapeText(s.claim)}</div>
    <div class="source-original"><small>ORIGINAL TITLE</small>${escapeText(s.originalTitle)}<br><br><small>ORIGINAL EXCERPT</small>${escapeText(s.originalExcerpt)}</div>
    <div class="demo-note">${escapeText(relation)}<br>${escapeText(s.stateNote)}</div>
    <a class="external" href="${s.url}" target="_blank" rel="noopener"><span>VIEW ORIGINAL DEMO SOURCE</span><span>↗</span></a>
    <div class="demo-note">Prototype data is fictional. External links use example.com.</div>`;
  return {label:'SOURCE',html};
}

function renderChangesView(){
  const rows = state.newSince.slice().sort((a,b)=>b.time-a.time).map(n=>`<div class="change-row"><small>${fmt(n.time)}</small><strong>${escapeText(n.label)}</strong><span>${escapeText(n.detail)}</span></div>`).join('');
  return {label:'SINCE LAST CHECK',html:`<div class="kicker">WHAT CHANGED</div><h2 class="sheet-title">前回見た時から増えた情報</h2><div class="sheet-meta"><span>arrival order · not importance ranking</span></div><section class="section">${rows||'<div class="none-yet">No new signals.</div>'}</section>`};
}

function openView(type,id=null){
  if(sheet.classList.contains('open') && sheetStack.length) sheetStack[sheetStack.length-1].scrollTop=sheetBody.scrollTop;
  else lockPage();
  sheetStack.push({type,id,scrollTop:0});
  renderSheetView();
  sheet.classList.add('open');backdrop.classList.add('open');sheet.setAttribute('aria-hidden','false');
}
function renderSheetView(){
  const view = sheetStack[sheetStack.length-1]; if(!view) return;
  const rendered = view.type==='cluster'?renderClusterView(view.id):view.type==='source'?renderSourceView(view.id):renderChangesView();
  sheetLabel.textContent=rendered.label;sheetBody.innerHTML=rendered.html;sheetBack.classList.toggle('hidden',sheetStack.length<2);
  sheetBody.scrollTop=view.scrollTop||0;if(rendered.after)rendered.after();
}
function backSheet(){
  if(sheetStack.length<2){closeSheet();return;}
  sheetStack.pop();renderSheetView();
}
function closeSheet(){
  sheet.classList.remove('open');backdrop.classList.remove('open');sheet.setAttribute('aria-hidden','true');sheetStack=[];unlockPage();
}
function lockPage(){
  if(document.body.dataset.locked==='1') return;
  lockedPageY=window.scrollY;document.body.dataset.locked='1';document.body.style.position='fixed';document.body.style.top=`-${lockedPageY}px`;document.body.style.left='0';document.body.style.right='0';document.body.style.width='100%';
}
function unlockPage(){
  if(document.body.dataset.locked!=='1') return;
  document.body.dataset.locked='0';document.body.style.position='';document.body.style.top='';document.body.style.left='';document.body.style.right='';document.body.style.width='';window.scrollTo(0,lockedPageY);
}

function openCardPreview(clusterId){
  const c=findCluster(clusterId);if(!c)return;
  closeSheet();
  const confirmed=c.signals.filter(s=>s.truthState==='CONFIRMED');
  const claims=c.signals.filter(s=>s.truthState==='CLAIM');
  const unknown=c.signals.filter(s=>s.truthState==='UNKNOWN');
  $('#cardPreviewBody').innerHTML=`<article class="card-demo"><div class="card-kicker">CARDS · STRUCTURED PREVIEW</div><h2>${escapeText(c.title)}</h2><p class="lead">LIVEで流入したSignalを、Sourceと不確実性を残したまま有限レビュー用に整理した場合の接続デモです。</p>
    ${cardSection('CONFIRMED','現在確認できていること',confirmed)}${cardSection('CLAIMS','主体ごとの主張',claims)}${cardSection('UNKNOWN','まだ分からないこと',unknown)}
    <div class="card-foot">This is an isolated handoff preview. Production CARDS gesture code is not loaded or modified by this demo.</div></article>`;
  cardPreview.classList.remove('hidden');cardPreview.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('#cardBack').focus();
}
function cardSection(label,title,items){
  const body=items.length?items.map(s=>`<p><strong>${escapeText(s.source)}:</strong> ${escapeText(s.claim)}</p>`).join('<br>'):'<p>まだ十分な情報がありません。</p>';
  return `<section class="card-section"><small>${label}</small><h3>${title}</h3>${body}</section>`;
}
function closeCardPreview(){cardPreview.classList.add('hidden');cardPreview.setAttribute('aria-hidden','true');document.body.style.overflow='';}

function injectSignal(){
  if(state.paused || state.injected>=incoming.length) return;
  const item=incoming[state.injected];const now=new Date();state.injected+=1;
  const id=`live-${state.injected}`;
  const s=makeSignal({id,time:now,source:item.source,actor:item.actor,truthState:item.truthState,headline:item.headline,claim:item.claim,stateNote:item.stateNote,originalTitle:item.originalTitle,originalExcerpt:item.originalExcerpt,url:item.url});
  state.newSince.unshift({time:now,label:item.source,detail:item.cluster?`${item.cluster} cluster に新しいSignal`:'UNGROUPEDの新規Signal',signalId:id});
  if(item.cluster){const c=findCluster(item.cluster);c.signals.push(s);c.time=now;c.changed=true;}else state.ungrouped.unshift(s);
  const preserve=!isNearNow();if(preserve)state.pendingNew+=1;render({preserve});
  if(state.injected>=incoming.length) stopStream();
}
function startStream(){
  stopStream();streamStartTimeout=setTimeout(injectSignal,3500);streamInterval=setInterval(injectSignal,7000);
}
function stopStream(){if(streamStartTimeout){clearTimeout(streamStartTimeout);streamStartTimeout=null}if(streamInterval){clearInterval(streamInterval);streamInterval=null}}
function resetDemo(){stopStream();state=createState();render();window.scrollTo({top:0,behavior:'auto'});startStream();}

function escapeText(value=''){return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}

function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem('liveTraceTheme',theme);$('#themeBtn').setAttribute('aria-label',theme==='dark'?'ライトテーマに切り替える':'ダークテーマに切り替える');}
function initTheme(){setTheme(localStorage.getItem('liveTraceTheme')||'dark')}

function goNow(){state.pendingNew=0;updateNewReturn();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}

groupedBtn.addEventListener('click',()=>{state.mode='grouped';state.pendingNew=0;render();window.scrollTo({top:0,behavior:'auto'})});
allBtn.addEventListener('click',()=>{state.mode='all';state.pendingNew=0;render();window.scrollTo({top:0,behavior:'auto'})});
pauseBtn.addEventListener('click',()=>{if(state.injected>=incoming.length){resetDemo();return;}state.paused=!state.paused;render();});
$('#newInfoBtn').addEventListener('click',()=>openView('changes'));
newReturn.addEventListener('click',goNow);
$('#closeSheet').addEventListener('click',closeSheet);sheetBack.addEventListener('click',backSheet);backdrop.addEventListener('click',closeSheet);
$('#cardBack').addEventListener('click',closeCardPreview);
$('#themeBtn').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
window.addEventListener('scroll',()=>{if(isNearNow()&&state.pendingNew){state.pendingNew=0;updateNewReturn();}}, {passive:true});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!cardPreview.classList.contains('hidden'))closeCardPreview();else if(sheet.classList.contains('open'))closeSheet();});
setInterval(()=>$('#clock').textContent=fmtSeconds(new Date()),1000);

initTheme();$('#clock').textContent=fmtSeconds(new Date());render();startStream();
