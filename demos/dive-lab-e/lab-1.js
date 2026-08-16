const demos=[
 {id:1,slug:'01-semantic-tunnel',name:'SEMANTIC TUNNEL',jp:'問いを一本道に深くする',deck:'WHY → CLAIM → EVIDENCE → ASSUMPTION。次の問いを自分で選び、縦に潜る。',landscape:false},
 {id:2,slug:'02-braid',name:'BRAID',jp:'複数の糸を並行して辿る',deck:'別々のストーリーを少しずつ進め、交差した瞬間だけ一つの発見として見せる。',landscape:true},
 {id:3,slug:'03-layer-peel',name:'LAYER PEEL',jp:'一層ずつ表面を剥がす',deck:'出来事の表面 → actors → claims → evidence → origin を、紙をめくるように露出する。',landscape:false},
 {id:4,slug:'04-entity-wormhole',name:'ENTITY WORMHOLE',jp:'人物・企業・場所から別事件へワープ',deck:'記事中の実体を入口にし、関係タイプを保ったまま別の出来事へ飛ぶ。',landscape:false},
 {id:5,slug:'05-convergence-lens',name:'CONVERGENCE LENS',jp:'離れた糸の共有点を探す',deck:'二つの経路の「意味の半径」を少しずつ広げ、最初に共有する根を見つける。',landscape:true},
 {id:6,slug:'06-cause-cascade',name:'CAUSE CASCADE',jp:'原因は過去へ、影響は未来へ',deck:'中心の出来事から左へ原因、右へ影響を辿る。因果と単なる同時発生を分ける。',landscape:true},
 {id:7,slug:'07-evidence-loom',name:'EVIDENCE LOOM',jp:'Claimに証拠を一本ずつ織り込む',deck:'support / contradiction / context を混ぜず、選んだClaimに対して証拠を組み立てる。',landscape:true},
 {id:8,slug:'08-time-place',name:'TIME × PLACE',jp:'時刻と場所の交差点を動かす',deck:'時間と場所を独立して動かし、同じ事件がどこで何時にどう見えていたかを比較する。',landscape:true},
 {id:9,slug:'09-fractal-dive',name:'FRACTAL DIVE',jp:'スケールを変えて潜る',deck:'世界 → 国 → 組織 → 人物 → 発言 → 一次資料。ズームそのものを探索操作にする。',landscape:false},
 {id:10,slug:'10-contradiction-reader',name:'CONTRADICTION READER',jp:'食い違いの文だけを入口にする',deck:'二つの主張の「違う部分」を選び、出典と確認状況まで降りる。',landscape:true}
];
const mount=document.getElementById('labMount');
const requested=Math.max(1,Math.min(10,Number(new URLSearchParams(location.search).get('demo'))||Number(document.body.dataset.demo)||1));
const isIndex=document.body.dataset.labIndex==='true';
let current=requested;
const key=id=>`kawasemi-dive-lab-e-v1-${id}`;
const baseState=id=>({demo:id,stage:'article',depth:0,route:[],journey:[],sources:[],discoveries:[],unresolved:[],resume:'article',articleScrollY:0,concept:{},persisted:false,startedAt:Date.now(),lastActiveAt:Date.now()});
let state=load(current);
function load(id){try{const raw=localStorage.getItem(key(id));if(raw){const s=JSON.parse(raw);return {...baseState(id),...s,demo:id,stage:'article'}}}catch(e){}return baseState(id)}
function save(){state.lastActiveAt=Date.now();if(state.persisted)localStorage.setItem(key(current),JSON.stringify({...state,stage:'article'}))}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function icon(name){const p={back:'<path d="M19 6 10 15l9 9"/>',theme:'<path d="M20 4a9 9 0 1 0 0 16 7 7 0 0 1 0-16Z"/>',close:'<path d="m8 8 16 16M24 8 8 24"/>'}[name]||'';return `<svg viewBox="0 0 32 32" aria-hidden="true">${p}</svg>`}
function shell(){
 const demo=demos[current-1];
 const tabs=isIndex?`<div class="lab-selector" aria-label="DIVE LAB E prototypes">${demos.map(d=>`<button class="demo-tab ${d.id===current?'active':''}" data-switch="${d.id}" aria-current="${d.id===current?'page':'false'}">${String(d.id).padStart(2,'0')} ${d.name}</button>`).join('')}</div>`:'';
 return `<div class="lab-app demo-${current}"><header class="topbar"><button class="icon-btn" data-act="article" aria-label="記事に戻る">${icon('back')}</button><span class="mark" aria-hidden="true"><svg viewBox="0 0 44 36"><polygon points="5,21 20,8 23,18 39,14 26,26 18,32" fill="currentColor"/><polygon points="20,8 30,5 23,18" fill="currentColor" opacity=".55"/><polygon points="18,32 26,26 30,34" fill="currentColor" opacity=".72"/></svg></span><button class="icon-btn" data-act="theme" aria-label="テーマを切り替える">${icon('theme')}</button></header>${tabs}<main class="main" id="main"></main>${nav()}<div id="overlay"></div></div>`
}
function nav(){return `<nav class="session-nav" aria-label="DIVE session navigation"><button class="nav-btn" data-act="back" ${!state.route.length?'disabled':''}><strong>‹</strong>BACK</button><button class="nav-btn" data-act="trail"><strong>⌁</strong>TRAIL</button><button class="nav-btn" data-act="article"><strong>▤</strong>ARTICLE</button><button class="nav-btn" data-act="history"><strong>◷</strong>SESSION</button></nav>`}
function render(){mount.innerHTML=shell();const main=document.getElementById('main');main.innerHTML=state.stage==='explore'?explore():article();bind();}
function article(){const has=state.persisted;return `<article class="article-card"><section class="article-cover"><div class="article-copy"><small class="eyebrow">CARDS · LAB FIXTURE</small><h1>北海沖の海底データケーブル障害、複数組織が調査。原因はまだ確定していない</h1><p>運用会社は通信低下を確認した。一方、同時間帯に付近を航行した作業船との関係は未確認で、気象条件や保守作業の記録も調査対象になっている。</p></div></section><section class="article-body"><p class="fixture-note">これはDIVE操作検証のための架空データです。現実の事件についての主張ではありません。</p><h2>確認できていること</h2><p>監視システムは02:14 UTCに通信容量の急減を記録した。障害区間はおよそ18kmの範囲に絞られている。</p><h2>まだ分からないこと</h2><p>物理的な損傷、機器故障、保守作業、船舶活動のどれが直接原因かは確定していない。同時発生だけでは因果関係を示さない。</p><button class="inline-source" data-source="article"><small>SOURCE</small><strong>North Sea Cable Operations Centre — incident bulletin (LAB FIXTURE)</strong></button><button class="dive-entry" data-act="enter">${has?'前回のDIVEを続ける':'この記事からDIVE'}</button></section></article>`}
function explore(){const d=demos[current-1];return `<section class="explore"><header class="explore-head"><div><small class="concept-kicker">${String(d.id).padStart(2,'0')} · DIVE LAB E</small><h1 class="concept-title">${d.name}</h1><p class="concept-deck">${d.deck}</p></div><div class="depth-readout">${depthText()}</div></header><div class="surface">${renderConcept()}</div></section>`}
function depthText(){return `DEPTH ${state.depth} · ${state.route.length} STEPS`}
function rel(type,label,source='fixture'){return `<span class="relation">${esc(type)}${label?` · ${esc(label)}`:''}<button data-source="${source}" aria-label="この関係の出典を見る">PROVENANCE</button></span>`}
function push(label,relation='context_for',source='fixture'){const entry={id:`s${Date.now()}-${state.journey.length}`,parentStepId:state.route.at(-1)?.id||null,label,relation,at:Date.now(),depth:state.depth+1,concept:JSON.parse(JSON.stringify(state.concept))};state.route.push(entry);state.journey.push(entry);state.depth=Math.max(state.depth+1,1);state.persisted=true;state.resume=label;if(source&&!state.sources.includes(source))state.sources.push(source);save();render()}
function discovery(label){if(!state.discoveries.includes(label)){state.discoveries.push(label);if(state.persisted)save()}}
function renderConcept(){switch(current){case 1:return tunnel();case 2:return braid();case 3:return peel();case 4:return wormhole();case 5:return convergence();case 6:return cascade();case 7:return loom();case 8:return timeplace();case 9:return fractal();case 10:return contradiction();}}