(() => {
  'use strict';
  const ID = window.DEMO_ID || '01';
  const STORAGE_KEY = `kawasemi-dive-lab-d-${ID}-v1`;
  const META = {
    '01': {no:'01', slug:'STORY EVOLUTION', title:'報道は、どう変わった？', intro:'初報→更新→訂正→現在版を選び、増えた事実・消えた表現・残った不確実性を差分で読む。'},
    '02': {no:'02', slug:'SOURCE LADDER', title:'その一文は、どこまで下れる？', intro:'記事の要約から一段ずつSourceへ降り、最後に一次資料の該当行へ到達する。'},
    '03': {no:'03', slug:'NEWSROOM NOTEBOOK', title:'取材デスクを開く', intro:'FACT / CLAIM / UNKNOWNを一つの完成文に混ぜず、取材途中の状態そのものを読む。'},
    '04': {no:'04', slug:'ANGLE SWITCH', title:'同じ出来事を、誰の位置から見る？', intro:'結論を切り替えるのではなく、同じ事件で各actorが持つSource・関心・未確認点を切り替える。'},
    '05': {no:'05', slug:'CLAIM LEDGER', title:'発言は、いつどう変わった？', intro:'同じ組織の言い回しを時系列で追い、変化した部分とSourceを一文単位で確認する。'},
    '06': {no:'06', slug:'SIGNAL → STORY', title:'この記事は、何から出来ている？', intro:'記事の文を分解し、どのSignal・Observation・Claimが材料になったかを逆向きに辿る。'},
    '07': {no:'07', slug:'WHAT CHANGED', title:'前回から、何だけ変わった？', intro:'新着差分だけを先に見て、必要なときだけ以前の文脈へ戻る。'},
    '08': {no:'08', slug:'SOURCE COLLISION', title:'食い違っている場所から潜る', intro:'Source A/Bの不一致をAIで平均化せず、何が一致し、何が衝突し、何がまだ不明かをそのまま見る。'},
    '09': {no:'09', slug:'BEAT DIVE', title:'単発ニュースを、長期テーマへ変える', intro:'今日の事件を入口に、規制・測定・企業・住民という継続取材の糸を選んで辿る。'},
    '10': {no:'10', slug:'BACKSTORY', title:'なぜ「今日」ニュースになった？', intro:'現在の見出しから一段ずつ前提へ遡り、今日に至る因果ではなく「ニュース化の条件」をSource付きでほどく。'}
  }[ID];

  const sources = {
    city: {
      type:'PRIMARY SOURCE / OBSERVATION',
      name:'東湾市上下水道局 水質管理・危機対応統括室（臨時公表資料）',
      title:'沿岸浄水場のPFOS・PFOA測定結果と応急給水対応について',
      time:'2026-08-14 08:30 JST',
      excerpt:'採水試料の合算値は62 ng/L。市は対象区域で飲用を控えるよう要請し、応急給水所を設置した。汚染源については調査中。',
      note:'このSourceで確認できるのは「市がこの資料を公表したこと」と資料内の測定・対応記録。汚染原因そのものは確認していない。'
    },
    lab: {
      type:'PRIMARY DOCUMENT / EVIDENCE RECORD',
      name:'東湾広域環境分析センター 水質試験課',
      title:'試験成績書 TW-26-0814-PFAS-04',
      time:'2026-08-14 07:42 JST',
      excerpt:'採水地点 TW-WTP-03。PFOS 34 ng/L、PFOA 28 ng/L、合算 62 ng/L。試料受領 2026-08-13 18:10。',
      note:'測定値を記録する資料。汚染源や責任主体を示す資料ではない。'
    },
    company: {
      type:'CLAIM / FIRST-PARTY STATEMENT',
      name:'清辰化学株式会社 コーポレートコミュニケーション部',
      title:'東湾市の水質発表に関する当社見解',
      time:'2026-08-14 10:15 JST',
      excerpt:'当社東湾事業所では2024年12月以降、対象PFASを工程で使用しておらず、現在の排水が原因であるとの認識はない。',
      note:'「会社がこの主張を公表した」ことは確認できるが、主張内容そのものの真偽は別途検証が必要。'
    },
    ministry: {
      type:'PRIMARY SOURCE / REGULATORY NOTICE',
      name:'環境政策庁 水環境安全局 有機フッ素化合物対策室',
      title:'東湾市沿岸域における追加採水・立入確認の実施について',
      time:'2026-08-14 13:20 JST',
      excerpt:'河川3地点、工業排水口4地点、地下水2地点で追加採水を実施する。現時点で排出源は特定していない。',
      note:'調査開始と採水計画は確認できる。排出源を確定する資料ではない。'
    },
    records: {
      type:'PUBLIC RECORD / HISTORICAL CONTEXT',
      name:'東湾県 環境監視情報公開システム（事業所排水検査記録）',
      title:'2023年度 東湾工業地区 排水監視記録 第4四半期',
      time:'2024-04-22 公開',
      excerpt:'清辰化学東湾事業所の周辺排水口でPFOS/PFOAを含む追加項目検査を実施。値は当時の行政対応基準未満。',
      note:'過去の監視記録は背景情報。今回の汚染源であることの証拠にはならない。'
    },
    residents: {
      type:'OBSERVATION / INTERVIEW LOG',
      name:'KAWASEMI demo取材メモ（東湾市西浜地区・住民4名）',
      title:'給水制限初日の住民聞き取り',
      time:'2026-08-14 11:10–12:05 JST',
      excerpt:'4名全員が午前9時前後に市の防災通知を受信。2名は前夜から水のにおいに変化を感じたと述べたが、測定・検証はしていない。',
      note:'通知受信は個別の観察。においの証言はCLAIM/OBSERVATIONであり、PFASとの因果関係を示さない。'
    }
  };

  const article = {
    title:'東湾市、沿岸浄水場でPFAS暫定基準超過　給水制限を開始、汚染源はなお未特定',
    summary:'東湾市は14日、沿岸浄水場の検査でPFOS・PFOAの合算値が市の暫定対応基準を上回ったとして、一部地域で飲用を控えるよう要請した。市の公表と検査記録で測定値と対応開始は確認できる一方、汚染源は特定されていない。',
  };

  function freshState(){ return {persisted:false,startedAt:null,lastActiveAt:null,current:'ANCHOR',visits:[],saved:[],questions:[],sourcesOpened:[],ui:{}}; }
  function load(){ try { return {...freshState(), ...(JSON.parse(localStorage.getItem(STORAGE_KEY))||{})}; } catch { return freshState(); } }
  let state = load();
  const runtime = {screen:'article', nav:[], articleScroll:0, toastTimer:null};
  const root = document.getElementById('app');

  root.innerHTML = `
    <div class="lab-app">
      <header id="topbar" class="topbar"></header>
      <main class="main">
        <section id="articleScreen" class="screen"><div id="articleScroll" class="article-scroll"><div id="articleContent" class="article-content"></div></div></section>
        <section id="diveScreen" class="screen hidden"><div id="diveScroll" class="dive-scroll"><div id="diveContent" class="dive-wrap"></div></div></section>
      </main>
      <nav class="dock" aria-label="Main modes"><button data-mode="cards" class="active">CARDS</button><button data-mode="live">LIVE</button><button data-mode="dive">DIVE</button></nav>
    </div>
    <div id="overlayRoot"></div><div id="toast" class="toast hidden" role="status" aria-live="polite"></div>`;

  const els = {
    topbar:document.getElementById('topbar'),articleScreen:document.getElementById('articleScreen'),diveScreen:document.getElementById('diveScreen'),
    articleScroll:document.getElementById('articleScroll'),articleContent:document.getElementById('articleContent'),diveContent:document.getElementById('diveContent'),
    diveScroll:document.getElementById('diveScroll'),overlay:document.getElementById('overlayRoot'),toast:document.getElementById('toast')
  };

  function icon(name){
    const paths = {
      back:'<path d="M15 5 8 12l7 7"/><path d="M9 12h10"/>',
      article:'<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
      session:'<path d="M12 7v5l3 2"/><path d="M4.8 6.5A8 8 0 1 1 4 16"/><path d="M4 6v4h4"/>',
      close:'<path d="m7 7 10 10M17 7 7 17"/>',
      lab:'<path d="M5 12h14M5 12l5-5M5 12l5 5"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
  }
  function persist(){ state.lastActiveAt = new Date().toISOString(); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function ensureSession(){ if(!state.persisted){ state.persisted=true; state.startedAt=new Date().toISOString(); } }
  function record(label, focus, opts={}){
    ensureSession();
    const entry={label,focus:focus||label,at:new Date().toISOString()};
    state.visits.push(entry); state.current=entry.focus;
    if(opts.source && !state.sourcesOpened.includes(opts.source)) state.sourcesOpened.push(opts.source);
    persist();
  }
  function perform(label, patch, focus){
    runtime.nav.push(JSON.stringify(state.ui||{}));
    state.ui={...(state.ui||{}),...patch};
    record(label, focus||label); renderDive();
  }
  function backInternal(){
    if(runtime.nav.length){ state.ui=JSON.parse(runtime.nav.pop()); state.current='BACK'; persist(); renderDive(); showToast('ひとつ前の探索状態へ戻りました'); }
    else showArticle();
  }
  function showToast(msg){ clearTimeout(runtime.toastTimer); els.toast.textContent=msg; els.toast.classList.remove('hidden'); runtime.toastTimer=setTimeout(()=>els.toast.classList.add('hidden'),1800); }
  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  function renderTopbar(){
    if(runtime.screen==='article'){
      els.topbar.innerHTML=`<div class="topbar-left"><a class="icon-button" href="../" aria-label="DIVE LAB D一覧へ戻る">${icon('lab')}</a><span class="topbar-mode">CARDS</span></div><div class="topbar-title">DEMO FIXTURE</div><div class="topbar-actions"><button class="icon-button" id="sessionBtn" aria-label="DIVE sessionを見る">${icon('session')}</button></div>`;
    } else {
      els.topbar.innerHTML=`<div class="topbar-left"><button class="icon-button" id="backBtn" aria-label="DIVEでひとつ戻る">${icon('back')}</button><span class="topbar-mode">DIVE</span></div><div class="topbar-title">${META.slug}</div><div class="topbar-actions"><button class="icon-button" id="articleBtn" aria-label="元記事へ戻る">${icon('article')}</button><button class="icon-button" id="sessionBtn" aria-label="DIVE sessionを見る">${icon('session')}</button></div>`;
      document.getElementById('backBtn').addEventListener('click',backInternal);
      document.getElementById('articleBtn').addEventListener('click',showArticle);
    }
    document.getElementById('sessionBtn').addEventListener('click',openSession);
  }

  function renderArticle(){
    const resume = state.persisted ? `<button class="secondary-action" id="resumeBtn">前回のDIVEを再開</button>` : '';
    els.articleContent.innerHTML=`<article class="story">
      <section class="cover"><div class="cover-shade"></div><div class="cover-copy"><span class="eyebrow">環境 · 公共インフラ · 2026.08.14</span><h1>${article.title}</h1><p class="summary">${article.summary}</p></div></section>
      <div class="story-body">
        <section class="story-section"><span class="section-label">WHAT WE CAN SAY</span><h2>確認できたのは「測定」と「行政対応」。原因はまだ別問題。</h2><p>市の臨時公表資料と試験成績書では、PFOS 34 ng/L、PFOA 28 ng/L、合算62 ng/Lという記録を確認できる。市は午前8時30分、一部地域に飲用を控えるよう要請した。</p><div class="state-line"><b>FACT</b><span>市が臨時資料を公表し、給水対応を開始した。</span></div><div class="state-line"><b>EVIDENCE</b><span>試験成績書に合算62 ng/Lの測定記録がある。</span></div><div class="state-line"><b>UNKNOWN</b><span>汚染源、流入経路、発生時点は特定されていない。</span></div><button class="source-card" data-source="city"><small>SOURCE</small><strong>東湾市上下水道局 水質管理・危機対応統括室</strong><span>公表資料を確認</span></button></section>
        <section class="story-section"><span class="section-label">WHO SAYS WHAT</span><h2>企業は「現在の排水が原因との認識はない」と説明。</h2><p>清辰化学は2024年12月以降、対象PFASを工程で使用していないとする見解を公表した。これは会社の主張として確認できるが、今回の汚染源ではないことを独立に確認したものではない。</p><button class="source-card" data-source="company"><small>CLAIM SOURCE</small><strong>清辰化学株式会社 コーポレートコミュニケーション部</strong><span>原文の位置づけを見る</span></button></section>
        <section class="story-section"><span class="section-label">WHAT NEXT</span><h2>環境政策庁が追加採水へ。結果はまだ出ていない。</h2><p>追加調査は河川、工業排水口、地下水を対象にする。現時点では、どの地点が汚染源かを示す結果は公表されていない。</p></section>
        <section class="entry-zone"><button class="primary-action" id="diveBtn">もっと知りたい → ${META.slug}</button>${resume}<p class="entry-note">このLABは架空データによるinteraction prototypeです。実在の事件・組織を示しません。</p></section>
      </div></article>`;
    els.articleContent.querySelectorAll('[data-source]').forEach(b=>b.addEventListener('click',()=>openSource(b.dataset.source)));
    document.getElementById('diveBtn').addEventListener('click',()=>showDive(false));
    if(document.getElementById('resumeBtn')) document.getElementById('resumeBtn').addEventListener('click',()=>showDive(true));
  }

  function showArticle(){
    if(runtime.screen==='dive') { runtime.screen='article'; }
    renderArticle();
    els.diveScreen.classList.add('hidden'); els.articleScreen.classList.remove('hidden');
    document.querySelectorAll('.dock button').forEach(b=>b.classList.toggle('active',b.dataset.mode==='cards'));
    renderTopbar(); requestAnimationFrame(()=>els.articleScroll.scrollTop=runtime.articleScroll);
  }
  function showDive(isResume){
    runtime.articleScroll=els.articleScroll.scrollTop; runtime.screen='dive'; runtime.nav=[];
    els.articleScreen.classList.add('hidden'); els.diveScreen.classList.remove('hidden');
    document.querySelectorAll('.dock button').forEach(b=>b.classList.toggle('active',b.dataset.mode==='dive'));
    renderTopbar(); renderDive();
    els.diveScroll.scrollTop=0;
    if(isResume && state.persisted) showToast(`再開: ${state.current}`);
  }

  document.querySelectorAll('.dock button').forEach(btn=>btn.addEventListener('click',()=>{
    if(btn.dataset.mode==='cards') showArticle();
    else if(btn.dataset.mode==='dive') showDive(state.persisted);
    else showToast('LIVEはこの独立LABでは変更しません');
  }));

  function openSource(key){
    const s=sources[key]; if(!s)return;
    if(state.persisted){ if(!state.sourcesOpened.includes(key)) state.sourcesOpened.push(key); persist(); }
    els.overlay.innerHTML=`<div class="backdrop" id="sheetBackdrop"></div><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sourceHeading"><div class="sheet-head"><small>${s.type}</small><button class="icon-button" id="sheetClose" aria-label="Sourceを閉じる">${icon('close')}</button></div><div class="sheet-body"><h2 id="sourceHeading">${s.name}</h2><p class="meta">${s.time}</p><h3>${s.title}</h3><p>${s.excerpt}</p><div class="fixture-note">${s.note}</div><p class="meta">DEMO FIXTURE · 外部リンクは意図的に接続していません。</p></div></section>`;
    document.getElementById('sheetClose').addEventListener('click',closeOverlay); document.getElementById('sheetBackdrop').addEventListener('click',closeOverlay);
  }
  function closeOverlay(){ els.overlay.innerHTML=''; }
  function saveDiscovery(text){ ensureSession(); if(!state.saved.some(x=>x.text===text)) state.saved.push({text,at:new Date().toISOString(),focus:state.current}); persist(); showToast('DISCOVERYを保存しました'); }
  function keepQuestion(text){ ensureSession(); if(!state.questions.some(x=>x.text===text)) state.questions.push({text,at:new Date().toISOString(),focus:state.current}); persist(); showToast('OPEN QUESTIONとして残しました'); }
  function commonButtons(discovery, question){
    return `<div class="action-row"><button class="mini-action save-discovery" data-text="${escapeHtml(discovery)}">発見を保存</button><button class="mini-action keep-question" data-text="${escapeHtml(question)}">未解決として残す</button></div>`;
  }
  function bindCommon(){
    els.diveContent.querySelectorAll('[data-source]').forEach(b=>b.addEventListener('click',()=>openSource(b.dataset.source)));
    els.diveContent.querySelectorAll('.save-discovery').forEach(b=>b.addEventListener('click',()=>saveDiscovery(b.dataset.text)));
    els.diveContent.querySelectorAll('.keep-question').forEach(b=>b.addEventListener('click',()=>keepQuestion(b.dataset.text)));
  }
  function openSession(){
    const visits = state.visits.length ? state.visits.slice(-8).reverse().map(v=>`<div class="sheet-item"><b>${escapeHtml(v.label)}</b><span>${new Date(v.at).toLocaleString('ja-JP')} · focus: ${escapeHtml(v.focus)}</span></div>`).join('') : `<p class="meta">まだ意味のある探索操作は記録されていません。</p>`;
    const saves=state.saved.length?state.saved.map(x=>`<div class="sheet-item"><b>SAVED DISCOVERY</b><span>${escapeHtml(x.text)}</span></div>`).join(''):`<p class="meta">保存した発見はまだありません。</p>`;
    const qs=state.questions.length?state.questions.map(x=>`<div class="sheet-item"><b>OPEN QUESTION</b><span>${escapeHtml(x.text)}</span></div>`).join(''):`<p class="meta">残した未解決はまだありません。</p>`;
    els.overlay.innerHTML=`<div class="backdrop" id="sheetBackdrop"></div><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sessionHeading"><div class="sheet-head"><small>DIVE SESSION · OBSERVABLE HISTORY</small><button class="icon-button" id="sheetClose" aria-label="Sessionを閉じる">${icon('close')}</button></div><div class="sheet-body"><h2 id="sessionHeading">${article.title}</h2><p class="meta">${state.persisted?`開始 ${new Date(state.startedAt).toLocaleString('ja-JP')} · last focus: ${escapeHtml(state.current)}`:'まだsessionは保存されていません。最初の探索操作後に保存されます。'}</p><h3>最近の操作</h3><div class="sheet-list">${visits}</div><h3 style="margin-top:20px">保存した発見</h3><div class="sheet-list">${saves}</div><h3 style="margin-top:20px">OPEN QUESTIONS</h3><div class="sheet-list">${qs}</div><div class="fixture-note">記録するのは、開いた情報・辿った操作・保存・未解決・最後の位置など観察可能な行動だけです。「理解した」「学習済み」「信じている」とは推定しません。</div>${state.persisted?`<button class="primary-action" id="resumeFromSheet">このDIVEを再開</button>`:''}</div></section>`;
    document.getElementById('sheetClose').addEventListener('click',closeOverlay); document.getElementById('sheetBackdrop').addEventListener('click',closeOverlay);
    if(document.getElementById('resumeFromSheet')) document.getElementById('resumeFromSheet').addEventListener('click',()=>{closeOverlay();showDive(true);});
  }

  function frame(body){
    return `<div class="dive-kicker">${META.no} · ${META.slug}</div><h1 class="dive-title">${META.title}</h1><p class="dive-intro">${META.intro}</p><div class="fixture-note">FACT / OBSERVATION / CLAIM / EVIDENCE / UNKNOWNを別物として扱います。AIのconfidenceは真実度ではありません。</div>${body}`;
  }

  function render01(){
    const versions=[
      {t:'08:42',label:'初報',headline:'PFAS基準超過、市が給水制限',body:'市発表をもとに、測定値62 ng/Lと給水制限開始を掲載。汚染源は「調査中」。',src:'city'},
      {t:'10:31',label:'更新',headline:'企業見解を追加',body:'清辰化学が「現在の排水が原因との認識はない」と公表。記事ではCLAIMとして追記。',src:'company'},
      {t:'11:56',label:'修正',headline:'「工場周辺」表現を修正',body:'初版の「工場周辺で検出」という表現を削除。検査地点は浄水場であり、工場周辺を示す資料ではなかった。',src:'lab'},
      {t:'13:42',label:'現在',headline:'追加採水を追記',body:'環境政策庁の追加採水計画を追記。排出源は依然未特定。',src:'ministry'}
    ];
    const i=Math.max(0,Math.min(3,state.ui.version??0)); const v=versions[i];
    return frame(`<div class="evolution-stage"><div class="version-rail">${versions.map((x,n)=>`<button class="version-btn ${n===i?'active':''}" data-version="${n}"><small>${x.t}</small><strong>${x.label}</strong></button>`).join('')}</div><div class="panel change-block"><span class="change-mark">VERSION ${i+1}/4 · ${v.label}</span><h3>${v.headline}</h3><p>${v.body}</p>${i===2?`<div class="discovery"><small>WHAT CHANGED</small><strong><span class="change-before">工場周辺で検出</span> → <span class="change-after">浄水場の検査で検出</span></strong><p>場所の言い換えだけで、読者が原因主体を推測しやすくなる。修正履歴を残すと、その編集判断も見える。</p></div>`:''}${i===3?`<div class="discovery"><small>CONNECTION</small><strong>「企業の否定」より後に「行政が排出源未特定」と明記された。</strong><p>否定claimと調査statusは別Sourceで、互いを真偽判定しない。</p></div>`:''}<div class="provenance"><button class="prov-button" data-source="${v.src}"><b>PROVENANCE</b>${sources[v.src].name}</button></div>${commonButtons('修正前後の表現差が、原因の印象を変えうる','初版で「工場周辺」と書かれた根拠は何だったか')}</div></div>`);
  }

  function render02(){
    const level=state.ui.level??0;
    const steps=[
      {k:'article',lvl:'ARTICLE',title:'「検査で合算62 ng/L」',desc:'KAWASEMI記事の要約文',src:'city'},
      {k:'city',lvl:'PUBLICATION',title:'市の臨時公表資料',desc:'市が測定結果と給水対応を公表',src:'city'},
      {k:'lab',lvl:'ATTACHMENT',title:'試験成績書 TW-26-0814-PFAS-04',desc:'PFOS 34 + PFOA 28 = 62 ng/L',src:'lab'},
      {k:'row',lvl:'PRIMARY LINE',title:'採水地点 TW-WTP-03 / 試料受領 18:10',desc:'測定値の元になった該当行。汚染源は記録していない。',src:'lab'}
    ];
    return frame(`<div class="ladder">${steps.slice(0,level+1).map((s,i)=>`<div><button class="ladder-step ${i===level?'active':''}" style="--indent:${i*10}px" data-step="${i}"><span class="level">${s.lvl}</span><strong>${s.title}</strong><span>${s.desc}</span></button>${i<level?'<div class="down-cue">↓</div>':''}</div>`).join('')}</div>${level<3?`<button class="primary-action" id="descendBtn" style="margin-top:14px">一次資料へ、もう一段降りる</button>`:`<div class="discovery"><small>PRIMARY SOURCE REVEAL</small><strong>記事の「62 ng/L」は、最下段の検査表の2項目の合算だった。</strong><p>一方、この表には「どこから来たか」は書かれていない。測定Evidenceと原因Claimを分離できる。</p></div>`}<div class="panel" style="margin-top:12px"><h3>今いる段</h3><p>${steps[level].lvl} · ${steps[level].title}</p><div class="provenance"><button class="prov-button" data-source="${steps[level].src}"><b>SOURCE</b>${sources[steps[level].src].name}</button></div>${commonButtons('記事の数値が一次検査表の2項目合算まで辿れた','測定地点より上流の採水データはどこまで公開されているか')}</div>`);
  }

  function render03(){
    const selected=state.ui.note||null;
    const notes={
      fact:[{id:'f1',t:'市が08:30に飲用自粛を要請',s:'city'},{id:'f2',t:'試験成績書に合算62 ng/L',s:'lab'}],
      claim:[{id:'c1',t:'会社「現在の排水が原因との認識はない」',s:'company'},{id:'c2',t:'住民2名「前夜から水のにおいが変わった」',s:'residents'}],
      unknown:[{id:'u1',t:'汚染源・流入経路は未特定',s:'ministry'},{id:'u2',t:'いつ濃度が上昇したか不明',s:'city'}]
    };
    const labels={fact:'FACT / EVIDENCE RECORD',claim:'CLAIM / OBSERVATION',unknown:'UNKNOWN / INVESTIGATING'};
    let detail='';
    if(selected){ const all=Object.values(notes).flat(); const n=all.find(x=>x.id===selected); const cat=Object.keys(notes).find(k=>notes[k].some(x=>x.id===selected)); detail=`<div class="panel"><span class="pill beige">${labels[cat]}</span><h3 style="margin-top:10px">${n.t}</h3><p>${cat==='fact'?'Source上で確認できる範囲だけを記録。':cat==='claim'?'誰が言ったかは確認できても、内容の真偽は別。':'未解決のため、結論文へ埋め込まない。'}</p><div class="provenance"><button class="prov-button" data-source="${n.s}"><b>PROVENANCE</b>${sources[n.s].name}</button></div>${commonButtons(n.t,'追加採水でこのUNKNOWNを狭められるか')}</div>`; }
    return frame(`<div class="notebook">${Object.entries(notes).map(([cat,items])=>`<section class="notebook-column"><header><b>${labels[cat]}</b><span>${items.length}</span></header>${items.map(n=>`<button class="note-card" data-note="${n.id}"><strong>${n.t}</strong><span>${sources[n.s].name}</span></button>`).join('')}</section>`).join('')}</div>${detail||`<div class="discovery"><small>NEWSROOM MECHANIC</small><strong>「完成した記事」では隠れやすい、未解決の取材状態をそのまま選んで開ける。</strong><p>任意のメモを2〜4件開いて、Sourceと状態の違いを確認してください。</p></div>`}`);
  }

  function render04(){
    const angle=state.ui.angle||'city';
    const data={
      city:{name:'行政',q:'何を確認し、何をまだ言えない？',body:'市は測定値と給水制限を公表。汚染源は「調査中」としている。',src:'city',connection:'市の資料だけでは企業の関与は確定しない。'},
      resident:{name:'住民',q:'生活上、何が最初に変わった？',body:'住民4名は防災通知を受信。2名は前夜のにおい変化を語るが、PFASとの関連は未検証。',src:'residents',connection:'住民の「におい」は早期兆候かもしれないが、測定Evidenceではない。'},
      company:{name:'企業',q:'何を否定し、何は否定していない？',body:'会社は「現在の排水が原因との認識はない」と主張。過去の排出や別経路を包括的に否定した文ではない。',src:'company',connection:'文言の射程を読むと「原因ではない」と断定したのではなく、現在の排水について述べている。'},
      regulator:{name:'規制当局',q:'次に何を調べる？',body:'河川・排水口・地下水で追加採水。現時点で排出源は未特定。',src:'ministry',connection:'採水設計を見ると、当局は単一の工場だけを調べているわけではない。'}
    }; const d=data[angle];
    return frame(`<div class="angle-dial">${Object.entries(data).map(([k,v])=>`<button class="angle-btn ${k===angle?'active':''}" data-angle="${k}">${v.name}</button>`).join('')}</div><div class="panel angle-stage"><div class="lens-caption"><span class="pill teal">LENS · ${d.name}</span><span class="meta">結論ではなく、見えるSourceの位置を切替</span></div><h3>${d.q}</h3><p>${d.body}</p><div class="discovery"><small>CONNECTION</small><strong>${d.connection}</strong></div><div class="provenance"><button class="prov-button" data-source="${d.src}"><b>PROVENANCE</b>${sources[d.src].name}</button></div>${commonButtons(`${d.name}の視点で見える情報の射程: ${d.connection}`,'別のactorが持つ未公開Sourceはあるか')}</div>`);
  }

  function render05(){
    const i=state.ui.claimDate??0;
    const claims=[
      {date:'2024.12',quote:'対象PFASの工程使用を終了した。',note:'工程使用の終了を公表。排水中の残留や過去由来についての記述なし。',src:'company'},
      {date:'2026.06',quote:'定期検査で法令上の異常は確認されていない。',note:'「法令上の異常」という範囲。今回と同じ採水地点・同じ検査項目とは限らない。',src:'records'},
      {date:'08.14 10:15',quote:'現在の排水が原因であるとの認識はない。',note:'現在の排水に限定した否定的見解。原因不存在を独立に証明するものではない。',src:'company'},
      {date:'08.14 15:40',quote:'行政の追加採水に全面的に協力する。',note:'協力表明。汚染源に関する新しい事実主張は追加されていない。',src:'company'}
    ]; const c=claims[i];
    return frame(`<div class="panel"><span class="pill beige">CLAIMANT · 清辰化学</span><blockquote class="claim-quote">「${c.quote}」</blockquote><p>${c.note}</p><div class="ledger-track"><div class="ledger-line"></div><div class="ledger-dates">${claims.map((x,n)=>`<button class="ledger-date ${n===i?'active':''}" data-claim-date="${n}">${x.date}</button>`).join('')}</div></div>${i>=2?`<div class="discovery"><small>WORDING SHIFT</small><strong>「使用を終了」→「現在の排水が原因との認識はない」へ。</strong><p>似た印象でも、主張対象は工程使用・法令検査・現在排水で異なる。同じ一つの主張としてまとめない。</p></div>`:''}<div class="provenance"><button class="prov-button" data-source="${c.src}"><b>SOURCE</b>${sources[c.src].name}</button></div>${commonButtons('同一組織の発言でも対象範囲が時点ごとに違う','「現在の排水」以外の経路について会社は何を述べているか')}</div>`);
  }

  function render06(){
    const i=state.ui.sentence??0;
    const sentences=[
      {text:'市は沿岸浄水場の検査でPFAS合算62 ng/Lを記録した。',signals:[['OBSERVATION','市が測定値を公表','city'],['EVIDENCE','試験成績書 34 + 28 ng/L','lab']]},
      {text:'一部地域で飲用を控えるよう要請し、応急給水を開始した。',signals:[['OBSERVATION','市の対応記録','city']]},
      {text:'清辰化学は現在の排水が原因との認識はないと述べた。',signals:[['CLAIM','企業の見解文','company']]},
      {text:'汚染源はなお特定されていない。',signals:[['UNKNOWN','市資料で原因調査中','city'],['OBSERVATION','環境政策庁も排出源未特定と記載','ministry']]}
    ]; const s=sentences[i];
    return frame(`<div class="story-builder">${sentences.map((x,n)=>`<div class="story-sentence ${n===i?'active':''}"><button data-sentence="${n}"><strong>${x.text}</strong></button></div>`).join('')}</div><div class="panel"><span class="pill teal">SENTENCE ${i+1}</span><h3 style="margin-top:10px">この一文の材料</h3><div class="signal-tray">${s.signals.map(([type,text,src])=>`<div class="signal"><small>${type}</small><p>${text}</p><button class="prov-button" data-source="${src}"><b>SOURCE</b>${sources[src].name}</button></div>`).join('')}</div>${i===3?`<div class="discovery"><small>DECOMPOSED</small><strong>「未特定」はAIの弱い推測ではなく、2つの一次Sourceが明示した調査statusとして書かれている。</strong></div>`:''}${commonButtons(`記事の一文「${s.text}」の材料を確認した`,'この一文に使われなかった反証・除外Signalはあるか')}</div>`);
  }

  function render07(){
    const open=state.ui.contextOpen||{};
    const items=[
      {id:'n1',time:'10:15',title:'清辰化学が見解を公表',new:'「現在の排水が原因との認識はない」と主張。',old:'前回訪問時点では企業コメントなし。',src:'company'},
      {id:'n2',time:'11:56',title:'記事の場所表現を修正',new:'「工場周辺で検出」を削除し「浄水場の検査で検出」へ。',old:'初版は場所を曖昧に結びつける表現だった。',src:'lab'},
      {id:'n3',time:'13:20',title:'環境政策庁が追加採水を発表',new:'河川3、排水口4、地下水2地点で採水。',old:'前回は市の原因調査中という情報のみ。',src:'ministry'}
    ];
    return frame(`<div class="panel"><span class="pill teal">SINCE YOUR LAST VISIT · 3</span><p>以前の全文を読み直さず、新しく増えた差分だけから入ります。</p></div><div class="change-stack">${items.map(x=>`<article class="new-item"><div class="new-item-head"><i class="new-dot"></i><button data-context="${x.id}"><span class="meta">${x.time}</span><strong style="display:block;margin-top:4px">${x.title}</strong><p>${x.new}</p></button></div>${open[x.id]?`<div class="context-reveal"><b>BEFORE</b><br>${x.old}<br><button class="prov-button" data-source="${x.src}"><b>SOURCE</b>${sources[x.src].name}</button></div>`:''}</article>`).join('')}</div><div class="discovery"><small>CONNECTION</small><strong>新情報3件のうち、1件は「事実追加」ではなく記事自身の修正。</strong><p>WHAT CHANGEDは外部世界の更新と編集上の更新を同じ「新情報」に潰さない。</p>${commonButtons('前回以降の変化に「記事の修正」も含まれていた','前回見た時点の判断に影響した表現は他にも変わっていないか')}</div>`);
  }

  function render08(){
    const compared=!!state.ui.compared; const focus=state.ui.collisionFocus||'discharge';
    const topics={
      discharge:{label:'CURRENT DISCHARGE',a:'「現在の排水が原因であるとの認識はない」',b:'「現時点で排出源は特定していない」',desc:'企業は原因を否定方向に主張。行政は未特定。両者は同じ命題を確定していない。'},
      timing:{label:'TIMING',a:'「2024年12月以降、対象PFASを工程で使用していない」',b:'「いつ濃度が上昇したかは未特定」',desc:'工程使用の終了時点と水中濃度上昇時点は別の事実。時間軸が接続できていない。'},
      route:{label:'ROUTE',a:'「現在の排水」について言及',b:'河川・排水口・地下水を追加採水',desc:'行政の調査範囲は複数経路。企業文はその全経路を否定していない。'}
    }; const t=topics[focus];
    return frame(`<div class="action-row">${Object.entries(topics).map(([k,v])=>`<button class="mini-action ${k===focus?'active':''}" data-collision-focus="${k}">${v.label}</button>`).join('')}</div><div class="collision-grid"><section class="collision-source"><header>SOURCE A · COMPANY CLAIM</header><blockquote>${t.a}</blockquote><p>清辰化学株式会社</p><button class="prov-button" data-source="company"><b>OPEN SOURCE</b>原文</button></section><div class="collision-center"><div><strong>≠</strong><button class="mini-action" id="compareBtn">${compared?'比較済み':'突き合わせる'}</button></div></div><section class="collision-source"><header>SOURCE B · REGULATOR STATUS</header><blockquote>${t.b}</blockquote><p>環境政策庁</p><button class="prov-button" data-source="ministry"><b>OPEN SOURCE</b>原文</button></section></div>${compared?`<div class="discovery"><small>UNRESOLVED COLLISION</small><strong>${t.desc}</strong><p>AIは両者の「中間」を作らず、不一致の形をそのまま保存する。</p>${commonButtons(`Source collision: ${t.desc}`,'追加採水結果はどの主張を支持・反証するか')}</div>`:`<div class="fixture-note">「突き合わせる」を押すと、一致・不一致・未解決の境界だけを示します。</div>`}`);
  }

  function render09(){
    const thread=state.ui.thread||null;
    const data={
      regulation:{label:'規制',q:'基準はどう変わってきた？',turns:[['2024.04','県が追加項目検査を公開'],['2025.06','市が独自の暫定対応基準を導入'],['2026.08','今回の給水対応で基準を運用']],src:'records',connection:'今日の「基準超過」は、長期的な監視制度の変更と接続している。'},
      measurement:{label:'測定',q:'どこを測ってきた？',turns:[['2024','工業地区の排水監視'],['2026.08.13','浄水場試料を採取'],['2026.08.14','河川・排水口・地下水へ拡大']],src:'lab',connection:'採水地点が増えるほど、原因仮説の範囲を狭められるが、地点数自体は原因Evidenceではない。'},
      company:{label:'企業',q:'企業とPFASの関係は？',turns:[['2024.12','工程使用終了を公表'],['2026.06','定期検査の異常なしと説明'],['2026.08','現在排水原因説を否定方向に主張']],src:'company',connection:'過去の工程情報と現在の原因判断の間には、検証すべき時間差が残る。'},
      residents:{label:'住民',q:'生活への影響はどう積み上がる？',turns:[['08.14 08:30','飲用自粛通知'],['09:10','応急給水所開設'],['11:10','住民聞き取り開始']],src:'residents',connection:'ニュースの主語を「汚染源」だけでなく、継続する生活対応のbeatへ広げられる。'}
    };
    const body=thread ? (()=>{const d=data[thread];return `<div class="panel"><span class="pill teal">BEAT · ${d.label}</span><h3 style="margin-top:10px">${d.q}</h3><div>${d.turns.map(([t,x])=>`<div class="thread-turn"><time>${t}</time><span>${x}</span></div>`).join('')}</div><div class="discovery"><small>BEAT CONNECTION</small><strong>${d.connection}</strong></div><div class="provenance"><button class="prov-button" data-source="${d.src}"><b>PROVENANCE</b>${sources[d.src].name}</button></div>${commonButtons(`${d.label} beat: ${d.connection}`,'このbeatで次に更新を待つSourceは何か')}</div>`})() : ``;
    return frame(`<div class="beat-shelf">${Object.entries(data).map(([k,v])=>`<article class="beat-thread"><button data-thread="${k}"><small>ONGOING BEAT</small><strong>${v.label} — ${v.q}</strong></button>${thread===k?`<div class="thread-body"><p>${v.connection}</p></div>`:''}</article>`).join('')}</div>${body||`<div class="fixture-note">今日の記事を「終わった単発事件」とせず、追い続けるテーマを選びます。</div>`}`);
  }

  function render10(){
    const depth=state.ui.depth??0;
    const cards=[
      {label:'TODAY',title:'なぜ今日ニュースになった？',body:'市が合算62 ng/Lの測定結果を公表し、給水制限を開始したから。',src:'city'},
      {label:'TRIGGER',title:'なぜ市は検査した？',body:'定期検査に加え、取水系統の再検査が13日に実施された。今回のfixtureでは「住民のにおい証言が検査の原因だった」とは確認できない。',src:'lab'},
      {label:'PRECONDITION',title:'なぜPFASが検査項目に入っていた？',body:'県の監視項目拡張と市の暫定対応基準が先に存在していたため。',src:'records'},
      {label:'OLDER CONTEXT',title:'なぜ工業地区が調査範囲に入る？',body:'過去の監視対象に工業排水口が含まれていたから。ただし「歴史的に監視されていた」ことは今回の原因Evidenceではない。',src:'records'}
    ];
    return frame(`<div class="backstory-stack">${cards.slice(0,depth+1).map((c,i)=>`<article class="why-card"><small>${c.label}</small><strong>${c.title}</strong><p>${c.body}</p><button class="prov-button" data-source="${c.src}"><b>SOURCE</b>${sources[c.src].name}</button></article>`).join('')}</div>${depth<3?`<button class="primary-action" id="whyBtn" style="margin-top:14px">もう一段「なぜ？」を遡る</button>`:`<div class="discovery"><small>BACKSTORY CONNECTION</small><strong>今日のニュースは、過去の監視制度があったから「測れてニュースになった」。</strong><p>しかし過去の監視対象だったことは、今回の汚染源だという証拠ではない。制度史と原因Evidenceを切り分ける。</p>${commonButtons('監視制度の変更が「今日測れた理由」に接続した','再検査の直接のきっかけは何だったか')}</div>`}`);
  }

  const renderers={'01':render01,'02':render02,'03':render03,'04':render04,'05':render05,'06':render06,'07':render07,'08':render08,'09':render09,'10':render10};
  function renderDive(){
    els.diveContent.innerHTML=renderers[ID](); bindCommon(); bindSpecific();
  }
  function bindSpecific(){
    if(ID==='01') els.diveContent.querySelectorAll('[data-version]').forEach(b=>b.addEventListener('click',()=>perform(`版を見る: ${b.textContent.trim()}`,{version:+b.dataset.version},`VERSION ${+b.dataset.version+1}`)));
    if(ID==='02'){
      const btn=document.getElementById('descendBtn'); if(btn)btn.addEventListener('click',()=>{const n=Math.min(3,(state.ui.level??0)+1);perform(`Sourceを一段降りる: level ${n}`,{level:n},`SOURCE LEVEL ${n+1}`)});
      els.diveContent.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{const n=+b.dataset.step;if(n<=(state.ui.level??0)) perform(`既に開いたSource段へ戻る`,{level:n},`SOURCE LEVEL ${n+1}`)}));
    }
    if(ID==='03') els.diveContent.querySelectorAll('[data-note]').forEach(b=>b.addEventListener('click',()=>perform(`Notebookを開く: ${b.textContent.trim().slice(0,32)}`,{note:b.dataset.note},`NOTE ${b.dataset.note}`)));
    if(ID==='04') els.diveContent.querySelectorAll('[data-angle]').forEach(b=>b.addEventListener('click',()=>perform(`Angleを切替: ${b.textContent.trim()}`,{angle:b.dataset.angle},`ANGLE ${b.textContent.trim()}`)));
    if(ID==='05') els.diveContent.querySelectorAll('[data-claim-date]').forEach(b=>b.addEventListener('click',()=>perform(`Claim時点を開く: ${b.textContent.trim()}`,{claimDate:+b.dataset.claimDate},`CLAIM ${b.textContent.trim()}`)));
    if(ID==='06') els.diveContent.querySelectorAll('[data-sentence]').forEach(b=>b.addEventListener('click',()=>perform(`記事文を分解: sentence ${+b.dataset.sentence+1}`,{sentence:+b.dataset.sentence},`SENTENCE ${+b.dataset.sentence+1}`)));
    if(ID==='07') els.diveContent.querySelectorAll('[data-context]').forEach(b=>b.addEventListener('click',()=>{const o={...(state.ui.contextOpen||{})};o[b.dataset.context]=!o[b.dataset.context];perform(`差分の以前の文脈を${o[b.dataset.context]?'開く':'閉じる'}`,{contextOpen:o},`CHANGE ${b.dataset.context}`)}));
    if(ID==='08'){
      els.diveContent.querySelectorAll('[data-collision-focus]').forEach(b=>b.addEventListener('click',()=>perform(`Collision論点を切替: ${b.textContent.trim()}`,{collisionFocus:b.dataset.collisionFocus,compared:false},`COLLISION ${b.dataset.collisionFocus}`)));
      const btn=document.getElementById('compareBtn'); if(btn)btn.addEventListener('click',()=>perform('Sourceを突き合わせる',{compared:true},`COLLISION COMPARED`));
    }
    if(ID==='09') els.diveContent.querySelectorAll('[data-thread]').forEach(b=>b.addEventListener('click',()=>perform(`Beatを開く: ${b.textContent.trim().slice(0,24)}`,{thread:b.dataset.thread},`BEAT ${b.dataset.thread}`)));
    if(ID==='10') {const btn=document.getElementById('whyBtn');if(btn)btn.addEventListener('click',()=>{const n=Math.min(3,(state.ui.depth??0)+1);perform(`Backstoryを一段遡る`,{depth:n},`BACKSTORY DEPTH ${n+1}`)});}
  }

  renderArticle(); renderTopbar();
})();
