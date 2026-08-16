(()=>{
const DATA=window.DIVE_LAB_C;
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const now=()=>new Date().toISOString();
const modelId=document.body.dataset.model;
const model=DATA.models.find(x=>x.id===modelId);
const key=model?`kawasemi:dive-lab-c:${model.id}`:'';
let session=model?loadSession():null;
let view='article';
let ui={};
function loadSession(){try{return JSON.parse(localStorage.getItem(key))||{startedAt:now(),lastActiveAt:now(),steps:[],state:{}}}catch{return {startedAt:now(),lastActiveAt:now(),steps:[],state:{}}}}
function saveSession(){if(!model)return; session.lastActiveAt=now();localStorage.setItem(key,JSON.stringify(session));}
function clearSession(){session={startedAt:now(),lastActiveAt:now(),steps:[],state:{}};localStorage.removeItem(key)}
function step(label){session.steps.push({at:now(),label});saveSession()}
function src(id){return DATA.sources.find(s=>s.id===id)}
function state(label,cls=''){return `<span class="state-word ${cls}">${label}</span>`}
function modelUrl(m){return `./${m.slug}/`}
function sourceButton(id,label='SOURCE'){return `<button class="source-mini" data-source="${id}" aria-label="出典を確認：${esc(src(id)?.name||id)}">${label}</button>`}
function shell(title,body,{article=false}={}){
  return `<div class="demo-shell">
    <header class="topbar">
      <button class="back" data-back aria-label="戻る">‹</button>
      <div class="top-title"><small>DIVE LAB C · ${model.no}</small><strong>${esc(title)}</strong></div>
      <div class="utilities"><button class="utility" data-source="authority-1018" aria-label="出典を見る">SOURCE</button><button class="utility" data-session aria-label="セッション履歴を見る">SESSION</button></div>
    </header>
    <main class="main">${body}</main>
    ${article?'<div></div>':''}
  </div>`
}
function originPane(){return `<aside class="origin-pane"><div class="origin-card"><div class="kicker">ORIGIN · CARDS</div><h2>${esc(DATA.case.title)}</h2><p>${esc(DATA.case.summary)}</p><div class="mini-source">${state('CLAIM','state-claim')} ${state('UNKNOWN','state-unknown')}<br><br>原因は未確定。公開記録だけを使う架空ケース。</div></div></aside>`}
function workbench(content){return `<div class="investigation-layout">${originPane()}<section class="workbench">${content}</section></div>`}
function articleView(){
  const has=session.steps.length>0;
  const resume=has?`<div class="resume-box"><small>PAUSED DIVE</small><strong>${esc(model.name)} · ${session.steps.length} actions recorded</strong><button class="secondary-action" data-resume>前回の位置から再開</button></div>`:'';
  return shell(`${model.name} — ${model.jp}`,`<div class="narrow">
    <article class="article-card">
      <section class="article-hero"><div class="article-meta">${state('LAB CASE','state-evidence')}${state('UNKNOWN','state-unknown')}<span class="kicker">${esc(DATA.case.published)}</span></div><h1>${esc(DATA.case.title)}</h1><p>${esc(DATA.case.summary)}</p></section>
      <section class="article-body">${DATA.case.body.map(p=>`<p>${esc(p)}</p>`).join('')}<div class="article-note"><strong>SYNTHETIC</strong><span>${esc(DATA.case.warning)}</span></div></section>
    </article>
    ${resume}
    <button class="primary-action" data-enter>DIVE · ${esc(model.jp)}</button>
    ${has?'<button class="quiet-action" style="width:100%;margin-top:8px" data-reset>このLABセッションをリセット</button>':''}
  </div>`,{article:true})
}
function render(){
  const app=$('#app');
  if(!model){renderIndex();return}
  if(view==='article') app.innerHTML=articleView(); else app.innerHTML=renderModel();
  bindCommon();
  if(view!=='article') bindModel();
}
function bindCommon(){
  $$('[data-back]').forEach(b=>b.onclick=()=>{if(view==='article'){location.href='../'}else{view='article';render()}});
  $$('[data-source]').forEach(b=>b.onclick=()=>openSource(b.dataset.source));
  $$('[data-session]').forEach(b=>b.onclick=openSession);
  $('[data-enter]')?.addEventListener('click',()=>{if(session.steps.length===0)step('CARDS記事からDIVEを開始');view='model';render()});
  $('[data-resume]')?.addEventListener('click',()=>{view='model';render()});
  $('[data-reset]')?.addEventListener('click',()=>{clearSession();ui={};render()});
}
function openSource(id){
  const s=src(id)||DATA.sources[0];
  document.body.insertAdjacentHTML('beforeend',`<div class="backdrop" data-dismiss></div><section class="sheet" role="dialog" aria-modal="true" aria-label="Source provenance"><div class="sheet-handle"></div><div class="sheet-head"><div><div class="kicker">SOURCE / PROVENANCE</div><h2>${esc(s.name)}</h2></div><button data-dismiss aria-label="閉じる">×</button></div><div class="source-block"><small>${esc(s.kind)} · ${esc(s.time)}</small><strong>「${esc(s.excerpt)}」</strong><p>${esc(s.note)}</p><div class="source-meta">origin: ${esc(s.origin)} · independence group: ${esc(s.independence)} · synthetic source id: ${esc(s.id)}</div></div><div class="epistemic-note">出典が存在すること、誰が発言したか、命題が事実かは別々に扱います。このLABでは元資料への到達経路を常に残します。</div></section>`);
  $$('[data-dismiss]').forEach(x=>x.onclick=()=>{$('.sheet')?.remove();$('.backdrop')?.remove()});
}
function openSession(){
  const steps=session.steps.length?session.steps.map((s,i)=>`<div class="session-step"><time>${new Date(s.at).toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</time><span>${i+1}. ${esc(s.label)}</span></div>`).join(''):`<p class="empty-session">まだ意味のある探索操作は記録されていません。</p>`;
  document.body.insertAdjacentHTML('beforeend',`<div class="backdrop" data-dismiss></div><section class="sheet" role="dialog" aria-modal="true" aria-label="DIVE session"><div class="sheet-handle"></div><div class="sheet-head"><div><div class="kicker">DIVE SESSION</div><h2>${esc(model.name)}</h2></div><button data-dismiss aria-label="閉じる">×</button></div>${steps}<div class="epistemic-note">SESSIONに残るのは「何を開いたか」という行動記録だけです。理解・信念・賛否は推測しません。再訪時は最後の探索状態を復元します。</div></section>`);
  $$('[data-dismiss]').forEach(x=>x.onclick=()=>{$('.sheet')?.remove();$('.backdrop')?.remove()});
}
function basePanel(kicker,title,desc,body,note=''){
  return `<section class="panel"><div class="panel-head"><div><div class="kicker">${kicker}</div><h2>${title}</h2><p>${desc}</p></div></div>${body}${note?`<div class="epistemic-note" style="margin-top:14px">${note}</div>`:''}</section>`
}
function renderModel(){
 switch(model.id){
  case 'time-machine': return shell(model.name,workbench(renderTimeMachine()));
  case 'what-changed': return shell(model.name,workbench(renderWhatChanged()));
  case 'claim-comparison': return shell(model.name,workbench(renderClaimComparison()));
  case 'evidence-chain': return shell(model.name,workbench(renderEvidenceChain()));
  case 'event-reconstruction': return shell(model.name,workbench(renderEventReconstruction()));
  case 'follow-entity': return shell(model.name,workbench(renderFollowEntity()));
  case 'contradiction': return shell(model.name,workbench(renderContradiction()));
  case 'unanswered': return shell(model.name,workbench(renderUnanswered()));
  case 'who-knew-when': return shell(model.name,workbench(renderWhoKnew()));
  case 'hypothesis-test': return shell(model.name,workbench(renderHypothesis()));
 }
}
/* 01 */
const snapshots=[
 {time:'07:42',label:'最初の観測',state:'EVIDENCE',cls:'state-evidence',text:'通信センサーが応答率の急低下を記録。まだ公式説明はない。',source:'sensor-0742'},
 {time:'07:51',label:'公式告知 v1',state:'CLAIM',cls:'state-claim',text:'「技術点検のため一時制限」。原因は確認中。',source:'authority-0751'},
 {time:'09:02',label:'公式告知 v2',state:'CLAIM',cls:'state-claim',text:'「通信障害」に変更。「外部侵入を示す確認済みの証拠は現時点でない」を追記。',source:'authority-0902'},
 {time:'10:18',label:'公式告知 v3',state:'UNKNOWN',cls:'state-unknown',text:'復旧を告知し、「第三者保守作業との関連を含め原因を調査中」を追記。',source:'authority-1018'}
];
function renderTimeMachine(){const i=session.state.tm??3,s=snapshots[i];return basePanel('TIME MACHINE','その時点の世界へ戻る','現在のまとめを過去へ投影せず、その時に公開されていた記録だけを見る。',`<div class="time-ruler"><input id="timeRange" type="range" min="0" max="3" step="1" value="${i}" aria-label="時刻を移動"><div class="time-ticks"><span>07:42</span><span>07:51</span><span>09:02</span><span>10:18</span></div></div><div class="snapshot"><div class="snapshot-time">${s.time}</div><div class="status-line">${state(s.state,s.cls)}<span>${s.label}</span></div><div class="revision">${esc(s.text)}</div>${sourceButton(s.source)}${i===0?`<div class="discovery"><small>DISCOVERY</small><strong>最初の5分間には「原因」の説明が存在しない。</strong><p>後から分かった情報を過去時点へ混ぜないことで、当時の不確実性そのものが見える。</p></div>`:''}</div>`,'時間を遡っても、現在の知識で過去を埋めません。アーカイブが無い時間はUNKNOWNのままです。')}
/* 02 */
const diffs=[
 {id:0,label:'07:51 → 09:02',a:'技術点検のため、ゲート3の航行を一時制限しています。原因は確認中です。',b:'通信障害のため、ゲート3の航行を一時制限しています。外部侵入を示す確認済みの証拠は現時点でありません。',sum:'「技術点検」→「通信障害」。外部侵入についての限定的な文が追加。',src:'authority-0902'},
 {id:1,label:'09:02 → 10:18',a:'通信障害のため、ゲート3の航行を一時制限しています。外部侵入を示す確認済みの証拠は現時点でありません。',b:'通信障害は解消しました。第三者保守作業との関連を含め、原因を調査中です。',sum:'復旧に加え、第三者保守作業との関連が初めて明記された。ただし因果関係は未確定。',src:'authority-1018'}
];
function diffMarkup(t,old){let x=esc(t);if(old)x=x.replace('技術点検','<span class="deleted">技術点検</span>').replace('航行を一時制限しています。','航行を一時制限しています。');else x=x.replace('通信障害','<span class="added">通信障害</span>').replace('第三者保守作業','<span class="added">第三者保守作業</span>');return x}
function renderWhatChanged(){const d=diffs[session.state.diff??0];return basePanel('WHAT CHANGED','全文ではなく「変わった所」だけ読む','比較する2時点を選ぶと、言い換え・追加・削除を最小単位で確認できる。',`<div class="change-pairs">${diffs.map((x,i)=>`<button data-diff="${i}" class="${i===d.id?'active':''}">${x.label}</button>`).join('')}</div><div class="diff-columns"><div class="diff-card"><small>BEFORE</small><p>${diffMarkup(d.a,true)}</p></div><div class="diff-card"><small>AFTER</small><p>${diffMarkup(d.b,false)}</p></div></div><div class="change-summary"><strong>CHANGE:</strong> ${esc(d.sum)}</div>${sourceButton(d.src)}${d.id===1?`<div class="discovery"><small>DISCOVERY</small><strong>「保守会社が関与」ではなく「関連を調査中」だった。</strong><p>変更点だけを読むと、強い要約へ変換される前の限定表現を見落としにくい。</p></div>`:''}`,'差分は「何が変わったか」を示しますが、「なぜ変えたか」を自動で推測しません。')}
/* 03 */
const claimSets={cause:[
 {actor:'港湾当局',time:'09:02',quote:'外部侵入を示す確認済みの証拠は現時点でありません。',status:'CLAIM · external intrusion not confirmed',src:'authority-0902'},
 {actor:'青波放送',time:'08:31',quote:'匿名関係者は「侵入の可能性も調べている」と話した。',status:'CLAIM · independently unverified',src:'broadcaster-0831'},
 {actor:'シーバード・システムズ',time:'08:05',quote:'定期作業は07:30までに終了。07:58に通信不安定の追加チケットを起票。',status:'CLAIM + document existence',src:'contractor-0805'}
],attack:[
 {actor:'港湾当局 原文',time:'09:02',quote:'確認済みの証拠は現時点でありません。',status:'限定付きの否定',src:'authority-0902'},
 {actor:'東浜ニュース',time:'09:08',quote:'港湾当局は外部攻撃を否定した。',status:'二次要約',src:'wire-a'},
 {actor:'朝潮オンライン',time:'09:10',quote:'当局、サイバー攻撃を否定。',status:'同じ一次告知に依存',src:'wire-b'}
]};
function renderClaimComparison(){const k=session.state.claimProp||'cause',arr=claimSets[k];return basePanel('CLAIM COMPARISON','同じ問いに対する「誰の言葉か」を崩さない','一つの結論に混ぜず、主張者・時刻・原文・検証状態を並べる。',`<div class="proposition-tabs"><button data-prop="cause" class="${k==='cause'?'active':''}">原因は何か？</button><button data-prop="attack" class="${k==='attack'?'active':''}">外部攻撃は否定された？</button></div><div class="claim-stack">${arr.map(c=>`<div class="claim-card"><div class="actor"><span>${esc(c.actor)}</span><span>${c.time}</span></div><blockquote>「${esc(c.quote)}」</blockquote><div class="claim-status">${state('CLAIM','state-claim')} ${esc(c.status)}</div>${sourceButton(c.src)}</div>`).join('')}</div>${k==='attack'?`<div class="discovery"><small>DISCOVERY</small><strong>3つの文は「3つの確認」ではない。</strong><p>2つの記事は同じ公式告知を強く言い換えており、一次情報は1本。しかも原文は「否定」より限定的。</p></div>`:''}`,'CLAIMの数や一致を、真実の多数決として扱いません。')}
/* 04 */
const chainLayers=[
 {n:'ARTICLE',title:'「当局、外部攻撃を否定」',text:'二次記事の見出し。',src:'wire-a'},
 {n:'UPSTREAM',title:'朝潮オンライン / 東浜ニュース',text:'別記事に見えるが、両方とも同じ当局告知を参照。',src:'wire-b'},
 {n:'PRIMARY',title:'港湾当局 公開告知 v2',text:'原文は「外部侵入を示す確認済みの証拠は現時点でありません」。',src:'authority-0902'},
 {n:'INDEPENDENT EVIDENCE',title:'通信センサー',text:'障害の存在を示すが、外部攻撃の有無は判定できない。',src:'sensor-0742'}
];
function renderEvidenceChain(){const depth=session.state.chainDepth??0;return basePanel('EVIDENCE CHAIN','この文は、どこから来た？','「記事 → 引用元 → 一次資料 → 独立エビデンス」を一段ずつ逆引きする。',`<div class="chain">${chainLayers.map((l,i)=>`<div class="chain-layer ${i<=depth?'revealed':''}" style="--depth:${i}"><div class="chain-top"><small>${l.n}</small>${i<=depth?sourceButton(l.src,'OPEN'):''}</div><strong>${esc(l.title)}</strong><p>${esc(l.text)}</p>${i===1&&depth>=1?`<div class="independence"><span class="same">東浜 = authority-notice</span><span class="same">朝潮 = authority-notice</span></div>`:''}</div>`).join('')}</div>${depth<3?`<button class="primary-action" data-trace>もう1段、根拠へ戻る</button>`:''}${depth>=2?`<div class="discovery"><small>DISCOVERY</small><strong>「複数社が報道」でも独立確認は1本も増えていなかった。</strong><p>出典の数ではなく、independence groupまで辿ると“見かけの多数”がほどける。</p></div>`:''}`,'EVIDENCEは出典数ではなく、対象・関係・独立性を保ちます。同じ上流情報の転載は複数確認に数えません。')}
/* 05 */
const frags=[
 {id:'sensor',occur:'07:42',seen:'07:42',title:'センサー応答率が急低下',text:'測定値。原因説明なし。',src:'sensor-0742'},
 {id:'notice',occur:'07:51',seen:'07:51',title:'当局が航行制限を告知',text:'「技術点検」と説明。',src:'authority-0751'},
 {id:'ticket',occur:'07:58',seen:'08:05',title:'保守会社が追加チケット起票',text:'記録の作成時刻と、後に取得した時刻を分ける。',src:'contractor-0805'},
 {id:'report',occur:'08:31',seen:'08:31',title:'匿名関係者の「侵入可能性」報道',text:'CLAIM。独立確認なし。',src:'broadcaster-0831'}
];
function renderEventReconstruction(){const pinned=session.state.pinned||[];return basePanel('EVENT RECONSTRUCTION','断片を、勝手な物語にしない','Signalをピン留めし、「起きた時刻」と「観測・公開された時刻」を別々に持つ。',`<div class="event-river">${frags.map(f=>`<button class="fragment ${pinned.includes(f.id)?'pinned':''}" data-frag="${f.id}" style="width:calc(100% - 23px);text-align:left"><div class="two-times"><span>OCCURRED ${f.occur}</span><span>OBSERVED ${f.seen}</span></div><strong>${esc(f.title)}</strong><p>${esc(f.text)}</p></button>`).join('')}${pinned.length>=3?`<div class="gap-card"><strong>UNKNOWN GAP · 07:42–07:51</strong><br>障害検出から公式告知まで、公開記録上の原因説明は存在しない。</div>`:''}</div>${pinned.length>=3?`<div class="discovery"><small>DISCOVERY</small><strong>「07:58に起きた」ではなく「07:58の記録が08:05に観測された」。</strong><p>時刻を1本に潰さないことで、後から見つかった資料を当時既知だった情報と混同しない。</p></div>`:''}`,'EventClusterは整理用の容器であり、1つの権威ある物語ではありません。')}
/* 06 */
const entityStories={authority:[['07:51','青波港','航行制限を公開','authority-0751',''],['09:02','青波港','告知文を「通信障害」へ更新','authority-0902',''],['10:18','青波港','第三者保守との関連を調査中と追記','authority-1018','']],contractor:[['07:30','青波港','定期保守を終了したと記録','contractor-0805',''],['07:58','青波港','通信不安定チケットを起票','contractor-0805',''],['2025-11-03','青波港・別系統','過去の通信障害でも同社が保守担当','archive-2025','HISTORICALLY SIMILAR · CONTEXT ONLY']],place:[['07:42','ゲート3','通信センサー異常','sensor-0742',''],['09:14','ゲート3','作業船2隻が保存画像に写る','image-0914',''],['2025-11-03','別通信系統','過去障害の記録','archive-2025','CONTEXT ONLY']]};
function renderFollowEntity(){const e=session.state.entity||'authority',arr=entityStories[e];return basePanel('FOLLOW ENTITY','“事件”ではなく、ひとつの主体を軸に潜る','人物・組織・場所を選び、現在の事件から別時点・別資料へ同じ主体を追う。',`<div class="entity-picker"><button data-entity="authority" class="${e==='authority'?'active':''}">港湾当局</button><button data-entity="contractor" class="${e==='contractor'?'active':''}">シーバード社</button><button data-entity="place" class="${e==='place'?'active':''}">ゲート3</button></div><div class="entity-story">${arr.map(x=>`<div class="entity-chapter"><small>${x[0]} · ${x[1]}</small><strong>${x[2]}</strong>${x[4]?`<div class="context-only">${x[4]}</div>`:''}${sourceButton(x[3])}</div>`).join('')}</div>${e==='contractor'?`<div class="discovery"><small>DISCOVERY</small><strong>同じ保守会社が過去障害にも登場する。ただし、それは今回の原因の証拠ではない。</strong><p>“つながり”を見つける面白さと、証拠としての重みを構造上分離する。</p></div>`:''}`,'人物や組織を追う経路はCONTEXTを増やします。過去の類似や同一主体の存在だけで現在の因果を推定しません。')}
/* 07 */
function renderContradiction(){const exact=!!session.state.exact;return basePanel('CONTRADICTION','食い違いを「原文の距離」で見る','対立して見える2つの文を並べ、主語・時刻・限定語を外さず比較する。',`<div class="proposition-core"><small>QUESTION</small><strong>「港湾当局は外部攻撃を否定した」のか？</strong></div><div class="split-claims"><div class="split-source"><small>港湾当局 · 09:02</small><blockquote>「外部侵入を示す確認済みの証拠は現時点でありません」</blockquote>${sourceButton('authority-0902')}${exact?`<div class="exact-wording">重要語：<em>確認済み</em> / <em>現時点</em> / <em>証拠はない</em></div>`:''}</div><div class="split-source"><small>東浜ニュース · 09:08</small><blockquote>「港湾当局は外部攻撃を否定した」</blockquote>${sourceButton('wire-a')}${exact?`<div class="exact-wording">要約で消えた限定：<em>確認済み</em> / <em>現時点</em></div>`:''}</div></div><button class="primary-action" data-exact>${exact?'限定語を閉じる':'原文の限定語を比較'}</button>${exact?`<div class="discovery"><small>DISCOVERY</small><strong>これは完全な「正反対」より、要約による確度の増幅だった。</strong><p>CONTRADICTIONは二値判定ではなく、どの部分が食い違うかを出典付きで見せる。</p></div>`:''}`,'AIが「矛盾」と検出しても、それはrelation candidateです。原文を見て初めて人が食い違いの意味を判断できます。')}
/* 08 */
const unknowns=[
 {id:'cause',q:'通信障害の直接原因は何か？',needs:['機器ログの原因コード','保守作業と障害発生の時系列整合','独立した技術調査結果'],wow:'多数の記事が原因を語っていても、直接原因を確定する資料はまだ無い。'},
 {id:'intrusion',q:'外部侵入は発生したのか？',needs:['侵入検知ログ','第三者による技術検証','当局の最終調査報告'],wow:'「否定した」という二次見出しはあるが、一次文面は「確認済み証拠なし」に留まる。'},
 {id:'boats',q:'09:14の作業船は何をしていた？',needs:['船舶作業命令','乗員または運航記録','作業目的を示す一次資料'],wow:'画像は船の存在を示すだけで、目的までは示さない。'}
];
function renderUnanswered(){const id=session.state.unknown||'cause',u=unknowns.find(x=>x.id===id),kept=(session.state.openQuestions||[]).includes(id);return basePanel('UNANSWERED','答えより「まだ答えられない問い」を残す','UNKNOWNを消さず、何があれば解けるのかまで具体化して次回へ持ち越す。',`<div class="unknown-list">${unknowns.map(x=>`<button class="unknown-card ${x.id===id?'active':''}" data-unknown="${x.id}"><small>UNKNOWN</small><strong>${esc(x.q)}</strong></button>`).join('')}</div><div class="resolve-needs"><h3>この問いを解くのに必要なもの</h3>${u.needs.map(n=>`<div class="need"><i></i><span>${esc(n)}</span></div>`).join('')}</div><button class="secondary-action ${kept?'open-kept':''}" style="width:100%;margin-top:12px" data-keep>${kept?'OPEN QUESTIONとして保存済み':'この問いをOPEN QUESTIONとして残す'}</button><div class="discovery"><small>DISCOVERY</small><strong>${esc(u.wow)}</strong><p>「分からない」を失敗画面ではなく、次の調査入口として使う。</p></div>`,'UNKNOWN（情報状態）とOPEN QUESTION（ユーザーが戻りたい問い）は別物です。保存は明示操作だけで行います。')}
/* 09 */
const ktimes=['07:42','07:51','08:05','08:31','09:02','10:18'];
const knowledge={
 '07:42':[['センサー運用','通信異常を公開データが記録'],['港湾当局','公開記録なし'],['保守会社','公開記録なし'],['メディア','公開記録なし']],
 '07:51':[['センサー運用','07:42の通信異常'],['港湾当局','航行制限と「技術点検」を公開'],['保守会社','公開記録なし'],['メディア','公式告知を参照可能']],
 '08:05':[['センサー運用','通信異常が継続'],['港湾当局','航行制限を公開済み'],['保守会社','07:58起票の通信不安定チケットが記録化'],['メディア','公式告知を参照可能']],
 '08:31':[['センサー運用','通信異常記録'],['港湾当局','原因確認中'],['保守会社','追加チケット記録'],['メディア','匿名関係者の「侵入可能性」CLAIMを報道']],
 '09:02':[['センサー運用','通信異常記録'],['港湾当局','「通信障害」「確認済み侵入証拠なし」を公開'],['保守会社','追加チケット記録'],['メディア','公式v2と匿名CLAIMの双方を参照可能']],
 '10:18':[['センサー運用','復旧後データ'],['港湾当局','復旧と第三者保守との関連調査を公開'],['保守会社','保守記録'],['メディア','複数公開資料を参照可能']]
};
function renderWhoKnew(){const i=session.state.kt??4,t=ktimes[i],rows=knowledge[t];return basePanel('WHO KNEW WHAT WHEN','「知っていた」ではなく、公開記録上いつ確認できるか','時刻を動かし、各主体について公開された証拠・主張の到達点だけを表示する。',`<div class="knowledge-time"><strong>${t}</strong><input id="knowRange" type="range" min="0" max="5" value="${i}" step="1" aria-label="公開記録の時刻を移動"></div><div class="knowledge-lanes">${rows.map((r,j)=>`<div class="knowledge-row"><div class="knowledge-actor">${r[0]}</div><div class="knowledge-record ${r[1]==='公開記録なし'?'empty':''}"><small>PUBLIC RECORD</small><strong>${r[1]}</strong></div></div>`).join('')}</div><div class="private-warning"><strong>PRIVATE KNOWLEDGE = UNKNOWN</strong><br>ここから「本人が実際にいつ知ったか」「内部で誰に伝わったか」は推定しない。表示できるのは公開・保存された記録だけ。</div>${i>=4?`<div class="discovery"><small>DISCOVERY</small><strong>08:05には保守会社側の記録が存在するが、当局がその内容を知っていた証拠はない。</strong><p>“記録が存在した時刻”と“別主体が知った時刻”を同一視しない。</p></div>`:''}`,'Who knew what when は強力ですが、最も誤推測しやすい領域です。PRIVATE KNOWLEDGEを常にUNKNOWNとして固定します。')}
/* 10 */
const hypotheses=[{id:'maint',name:'H1 · 保守作業の設定不整合'},{id:'failure',name:'H2 · 機器の偶発故障'},{id:'intrusion',name:'H3 · 外部侵入'}];
const evs=[
 {id:'sensor',name:'07:42 センサー急低下',src:'sensor-0742',results:{maint:'CONSISTENT / not unique',failure:'CONSISTENT / not unique',intrusion:'CONSISTENT / not unique'}},
 {id:'ticket',name:'07:58 保守会社の追加チケット',src:'contractor-0805',results:{maint:'SUPPORTS POSSIBILITY / not causal proof',failure:'NO DISCRIMINATION',intrusion:'NO DISCRIMINATION'}},
 {id:'notice',name:'09:02 当局「確認済み侵入証拠なし」',src:'authority-0902',results:{maint:'NO DISCRIMINATION',failure:'NO DISCRIMINATION',intrusion:'WEAKENS / does not rule out'}}
];
function renderHypothesis(){const h=session.state.hyp||'maint',used=session.state.evidenceUsed||[];return basePanel('HYPOTHESIS TEST','仮説を“答え”にせず、証拠で壊せるか試す','複数の説明候補を明確にHYPOTHESISと表示し、証拠ごとに何が変わるかを見る。',`<div class="hypothesis-banner">HYPOTHESIS · NOT FACT — 以下は説明候補であり、確認済み事実ではありません。確率スコアも表示しません。</div><div class="hypothesis-picker">${hypotheses.map(x=>`<button data-hyp="${x.id}" class="${h===x.id?'active':''}"><small>HYPOTHESIS</small><strong>${x.name}</strong></button>`).join('')}</div><div class="evidence-test"><div class="kicker">TEST WITH EVIDENCE</div>${evs.map(e=>`<button class="evidence-token ${used.includes(e.id)?'used':''}" data-evidence="${e.id}"><small>${used.includes(e.id)?'TESTED':'EVIDENCE'}</small><strong>${e.name}</strong>${used.includes(e.id)?`<span class="verdict">→ ${e.results[h]}</span>`:''}</button>`).join('')}</div>${used.length>=2?`<div class="discovery"><small>DISCOVERY</small><strong>同じ証拠でも、ある仮説には効き、別の仮説には何も言えない。</strong><p>「関連する情報」を全部“支持”として積まず、反証・非識別・未解決を区別する。</p></div>`:''}`,'AIは仮説候補を整理できますが、仮説をFACTへ昇格させません。historical similarityも証拠に変換しません。')}
function bindModel(){
 switch(model.id){
  case 'time-machine': $('#timeRange')?.addEventListener('input',e=>{session.state.tm=+e.target.value;step(`TIME MACHINEを${snapshots[+e.target.value].time}へ移動`);render()});break;
  case 'what-changed': $$('[data-diff]').forEach(b=>b.onclick=()=>{session.state.diff=+b.dataset.diff;step(`差分 ${diffs[+b.dataset.diff].label} を比較`);render()});break;
  case 'claim-comparison': $$('[data-prop]').forEach(b=>b.onclick=()=>{session.state.claimProp=b.dataset.prop;step(`主張の問いを「${b.textContent}」へ切替`);render()});break;
  case 'evidence-chain': $('[data-trace]')?.addEventListener('click',()=>{session.state.chainDepth=Math.min(3,(session.state.chainDepth??0)+1);step(`EVIDENCE CHAINを${session.state.chainDepth+1}層目まで逆引き`);render()});break;
  case 'event-reconstruction': $$('[data-frag]').forEach(b=>b.onclick=()=>{let a=session.state.pinned||[];if(!a.includes(b.dataset.frag)){a=[...a,b.dataset.frag];session.state.pinned=a;step(`Signal「${frags.find(x=>x.id===b.dataset.frag).title}」を再構成へ追加`);saveSession();render()}});break;
  case 'follow-entity': $$('[data-entity]').forEach(b=>b.onclick=()=>{session.state.entity=b.dataset.entity;step(`Entity「${b.textContent}」を追跡`);render()});break;
  case 'contradiction': $('[data-exact]')?.addEventListener('click',()=>{session.state.exact=!session.state.exact;step('CONTRADICTIONで原文の限定語を比較');render()});break;
  case 'unanswered': $$('[data-unknown]').forEach(b=>b.onclick=()=>{session.state.unknown=b.dataset.unknown;step(`UNKNOWN「${unknowns.find(x=>x.id===b.dataset.unknown).q}」を開く`);render()}); $('[data-keep]')?.addEventListener('click',()=>{const id=session.state.unknown||'cause';let a=session.state.openQuestions||[];if(!a.includes(id)){a.push(id);session.state.openQuestions=a;step(`OPEN QUESTION「${unknowns.find(x=>x.id===id).q}」を保存`)}saveSession();render()});break;
  case 'who-knew-when': $('#knowRange')?.addEventListener('input',e=>{session.state.kt=+e.target.value;step(`PUBLIC RECORDを${ktimes[+e.target.value]}へ移動`);render()});break;
  case 'hypothesis-test': $$('[data-hyp]').forEach(b=>b.onclick=()=>{session.state.hyp=b.dataset.hyp;step(`${b.textContent.trim()}を検討対象に選択`);render()}); $$('[data-evidence]').forEach(b=>b.onclick=()=>{let a=session.state.evidenceUsed||[];if(!a.includes(b.dataset.evidence)){a.push(b.dataset.evidence);session.state.evidenceUsed=a;step(`仮説をEVIDENCE「${evs.find(x=>x.id===b.dataset.evidence).name}」でテスト`)}saveSession();render()});break;
 }
}
function renderIndex(){
  const cards=DATA.models.map(m=>{let s=null;try{s=JSON.parse(localStorage.getItem(`kawasemi:dive-lab-c:${m.id}`))}catch{};return `<a class="lab-link" href="${modelUrl(m)}"><span class="lab-no">${m.no} · ${m.jp}</span><h2>${m.name}</h2><p>${m.one}</p><div class="lab-tags">${m.tags.map(t=>`<span>${t}</span>`).join('')}${s?.steps?.length?`<span class="resume-chip">RESUME · ${s.steps.length}</span>`:''}</div></a>`}).join('');
  $('#app').innerHTML=`<div class="lab-shell"><section class="lab-hero"><div class="kicker">KAWASEMI · DIVE LAB C</div><h1>INVESTIGATION<br>/ TIME</h1><p>同じ架空ニュースから、10種類の「調べ方」に入ります。見た目の着せ替えではなく、時間・差分・主張・証拠・人物・矛盾・UNKNOWNなど、主操作そのものを変えています。</p><div class="legend">${state('FACT','state-fact')}${state('CLAIM','state-claim')}${state('EVIDENCE','state-evidence')}${state('HYPOTHESIS','state-hypothesis')}${state('UNKNOWN','state-unknown')}</div></section><section class="lab-grid">${cards}</section><footer class="lab-footer">LAB DATA IS SYNTHETIC. Production CARDS / LIVE / DIVE is not modified. Each prototype stores only local demo session state for Resume.</footer></div>`;
}
render();
})();
