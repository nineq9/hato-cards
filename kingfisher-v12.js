(() => {
  'use strict';

  const articles = window.KAWASEMI_ARTICLES || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const esc = v => String(v ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));

  window.KINGFISHER_MOTION = {
    charge: { commitDistance: 56, velocityCommit: 0.58, maxDistance: 240, initialFollow: 0.14, finalFollow: 0.56, response: 0.18, cancelDuration: 210 },
    flight: { durationBase: 900, durationMin: 680, durationMax: 940, velocityInfluence: 115, waterY: 0.535, scaleEnd: 0.15, cameraScale: 1.12 },
    dive: { duration: 205, scaleEnd: 0.035, cameraBoost: 0.055 },
    immersion: { duration: 510, cameraScale: 1.53, handoffAt: 0.38 }
  };

  const state = {
    tab: 'forYou',
    processed: new Set(JSON.parse(localStorage.getItem('kingfisherProcessed') || '[]')),
    saved: new Set(JSON.parse(localStorage.getItem('kingfisherSaved') || '[]')),
    liked: new Set(JSON.parse(localStorage.getItem('kingfisherLiked') || '[]')),
    interests: JSON.parse(localStorage.getItem('kingfisherInterests') || '["Ukraine","AI","Drones","Europe","Energy"]'),
    historyIds: JSON.parse(localStorage.getItem('kingfisherSwipeHistory') || '[]'),
    themeChoice: localStorage.getItem('kingfisherTheme') || 'dark',
    undo: [],
    detailArticle: null,
    detailRect: null,
    toastTimer: null,
    lastReadId: localStorage.getItem('kingfisherLastRead') || null,
    drawerView: 'home',
    dive: { articleId: null, depth: 0, path: [], current: null, origin: 'cards' }
  };

  const DIGITS = {
    0:[1,1,1,1,1,1,0],1:[0,1,1,0,0,0,0],2:[1,1,0,1,1,0,1],3:[1,1,1,1,0,0,1],4:[0,1,1,0,0,1,1],
    5:[1,0,1,1,0,1,1],6:[1,0,1,1,1,1,1],7:[1,1,1,0,0,0,0],8:[1,1,1,1,1,1,1],9:[1,1,1,1,0,1,1]
  };
  const LINES = [[5,4,19,4],[21,6,21,19],[21,22,21,35],[5,37,19,37],[3,22,3,35],[3,6,3,19],[5,20.5,19,20.5]];
  const digitSvg = d => `<svg viewBox="0 0 24 42" aria-hidden="true">${LINES.map((l,i)=>`<line x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}" opacity="${DIGITS[d]?.[i] ? 1 : .08}"/>`).join('')}<path d="M0 26 L8 19" opacity=".28"/></svg>`;
  const geoNumber = value => `<span class="geo-number">${String(Math.max(0,value)).split('').map(digitSvg).join('')}</span>`;

  function persist(){
    localStorage.setItem('kingfisherProcessed', JSON.stringify([...state.processed]));
    localStorage.setItem('kingfisherSaved', JSON.stringify([...state.saved]));
    localStorage.setItem('kingfisherLiked', JSON.stringify([...state.liked]));
    localStorage.setItem('kingfisherInterests', JSON.stringify(state.interests));
    localStorage.setItem('kingfisherSwipeHistory', JSON.stringify(state.historyIds.slice(0,80)));
  }

  function resolveTheme(){
    if(state.themeChoice === 'system') return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return state.themeChoice === 'light' ? 'light' : 'dark';
  }
  function applyTheme(){
    const actual = resolveTheme();
    document.documentElement.dataset.theme = actual;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', actual === 'dark' ? '#081113' : '#f2efe8');
    $$('[data-theme]').forEach(b => b.classList.toggle('active', b.dataset.theme === state.themeChoice));
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{ if(state.themeChoice === 'system') applyTheme(); });

  const articleById = id => articles.find(a => a.id === id);
  const displaySource = source => String(source || '').replace(/KAWASEMI/g,'KINGFISHER');
  const imageMarkup = a => a?.image ? `<img src="${esc(a.image)}" alt="" referrerpolicy="no-referrer" data-article-image="${esc(a.id)}">` : '<div class="image-fallback"></div>';
  function bindImageFallback(root=document){
    $$('img[data-article-image]',root).forEach(img=>{
      img.addEventListener('error',()=>{ img.replaceWith(Object.assign(document.createElement('div'),{className:'image-fallback'})); },{once:true});
    });
  }

  function addHistory(id){
    if(!id) return;
    state.historyIds = [id, ...state.historyIds.filter(x=>x!==id)].slice(0,80);
    persist();
    if($('#drawer')?.classList.contains('open')) renderDrawer();
  }

  function likedTags(){
    const set = new Set();
    articles.filter(a=>state.liked.has(a.id)).forEach(a=>(a.tags||[]).forEach(t=>set.add(String(t).toLowerCase())));
    return set;
  }
  function interestScore(a){
    const prefs = new Set([...state.interests.map(x=>String(x).toLowerCase()),...likedTags()]);
    return (a.tags||[]).reduce((n,t)=>n+(prefs.has(String(t).toLowerCase())?3:0),0)+(a.hot?1:0)+(a.must?1:0);
  }
  function queueFor(tab=state.tab){
    let list = tab === 'hot' ? articles.filter(a=>a.hot) : [...articles].sort((a,b)=>interestScore(b)-interestScore(a));
    return list.filter(a=>!state.processed.has(a.id));
  }
  function remaining(tab){ return tab === 'dive' ? 0 : queueFor(tab).length; }

  function syncNav(){
    $$('.feed-tab').forEach(btn=>{
      const active = btn.dataset.tab === state.tab;
      btn.classList.toggle('active',active);
      if(btn.dataset.tab === 'dive') { btn.classList.remove('has-unread'); return; }
      btn.classList.toggle('has-unread', remaining(btn.dataset.tab) > 0);
    });
  }

  function cardMarkup(a,pos,count){
    return `<article class="news-card ${pos===1?'back1':pos===2?'back2':''}" data-id="${esc(a.id)}" data-pos="${pos}">
      <div class="card-image">${imageMarkup(a)}</div>
      <div class="card-shade"></div>
      ${pos===0?`<div class="card-count" aria-label="残り${count}件">${geoNumber(count)}</div>`:''}
      <div class="card-copy">
        <div class="card-tags">${(a.tags||[]).slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}</div>
        <h2>${esc(a.title)}</h2>
        <p>${esc(a.summary)}</p>
        <small>${esc(displaySource(a.source))}</small>
      </div>
      <span class="swipe-cue cue-left">←</span>
      <span class="swipe-cue cue-save" aria-hidden="true"><svg viewBox="0 0 28 32"><path d="M7 3.5h14v24l-7-5-7 5z"/></svg></span>
      <span class="swipe-cue cue-right">→</span>
      <span class="gesture-label label-left">KNOW</span><span class="gesture-label label-save">SAVE</span><span class="gesture-label label-right">READ</span>
    </article>`;
  }

  function renderDeck(){
    const deck = $('#deck'); if(!deck) return;
    const queue = queueFor();
    deck.innerHTML='';
    if(!queue.length){
      deck.innerHTML='<div class="clear-card"><span>CLEAR</span></div>';
      $('#actionDock')?.classList.add('disabled');
      syncNav(); renderDrawer(); return;
    }
    $('#actionDock')?.classList.remove('disabled');
    for(let p=Math.min(2,queue.length-1);p>=0;p--) deck.insertAdjacentHTML('beforeend',cardMarkup(queue[p],p,queue.length));
    bindImageFallback(deck);
    bindTopCard();
    syncNav();
  }
  const topCard = () => $('.news-card[data-pos="0"]');
  const currentArticle = () => articleById(topCard()?.dataset.id);

  function clearGestureLabels(card){ $$('.gesture-label',card).forEach(x=>x.style.opacity='0'); }
  function setGestureLabel(card,type,strength){ clearGestureLabels(card); const el=$(`.label-${type}`,card); if(el) el.style.opacity=String(clamp(strength,0,1)); }
  function resetCard(card){
    if(!card) return;
    card.style.transition='transform 190ms cubic-bezier(.2,.72,.18,1),opacity 150ms linear';
    card.style.transform='';card.style.opacity='';card.style.filter='';clearGestureLabels(card);
    setTimeout(()=>{card.style.transition='';},200);
  }

  function bindTopCard(){
    const card=topCard(); if(!card) return;
    let g=null;
    card.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0) return;
      card.setPointerCapture?.(e.pointerId);
      g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,lastT:performance.now(),vx:0,vy:0,axis:null};
      card.style.transition='none';
    });
    card.addEventListener('pointermove',e=>{
      if(!g||e.pointerId!==g.id)return;
      const now=performance.now(),dt=Math.max(8,now-g.lastT);
      g.vx=(e.clientX-g.lastX)/dt;g.vy=(e.clientY-g.lastY)/dt;g.lastX=e.clientX;g.lastY=e.clientY;g.lastT=now;
      const dx=e.clientX-g.x,dy=e.clientY-g.y;
      if(!g.axis&&Math.hypot(dx,dy)>8) g.axis=Math.abs(dx)>Math.abs(dy)*1.08?'x':Math.abs(dy)>Math.abs(dx)*1.08?'y':null;
      if(g.axis==='x'){
        card.style.transform=`translate3d(${dx}px,0,0) rotate(${dx/46}deg)`;
        setGestureLabel(card,dx<0?'left':'right',Math.abs(dx)/80);
      } else if(g.axis==='y'){
        if(dy>0){card.style.transform=`translate3d(0,${dy*.76}px,0) scale(${1-Math.min(.025,dy/4800)})`;setGestureLabel(card,'save',dy/82);}
        else {card.style.transform=`translate3d(0,${dy*.12}px,0)`;clearGestureLabels(card);}
      }
    });
    const finish=e=>{
      if(!g||e.pointerId!==g.id)return;
      const data=g;g=null;
      const dx=e.clientX-data.x,dy=e.clientY-data.y;
      if(data.axis==='x'&&(Math.abs(dx)>62||Math.abs(data.vx)>.42)){
        if(dx>0||data.vx>.42) readCurrent(); else markKnown();
        return;
      }
      if(data.axis==='y'&&(dy>64||data.vy>.46)){ saveCurrent(); return; }
      resetCard(card);
    };
    card.addEventListener('pointerup',finish);
    card.addEventListener('pointercancel',()=>{g=null;resetCard(card);});
  }

  function snapshot(){ state.undo.push({processed:[...state.processed],saved:[...state.saved],liked:[...state.liked]}); if(state.undo.length>20)state.undo.shift(); }
  function showUndoOnly(){
    const t=$('#undoToast'); if(!t)return;
    t.classList.add('show'); clearTimeout(state.toastTimer); state.toastTimer=setTimeout(()=>t.classList.remove('show'),1700);
  }
  function undo(){
    const h=state.undo.pop(); if(!h)return;
    state.processed=new Set(h.processed);state.saved=new Set(h.saved);state.liked=new Set(h.liked);persist();renderDeck();renderDrawer();$('#undoToast')?.classList.remove('show');
  }

  function markKnown(){
    const a=currentArticle(),card=topCard(); if(!a||!card)return;
    snapshot();addHistory(a.id);state.processed.add(a.id);persist();
    card.style.transition='transform 240ms cubic-bezier(.16,.76,.20,1),opacity 170ms linear';
    card.style.transform='translate3d(-118vw,0,0) rotate(-8deg)';card.style.opacity='0';showUndoOnly();
    setTimeout(renderDeck,220);
  }
  function readCurrent(){
    const a=currentArticle(),card=topCard(); if(!a||!card)return;
    addHistory(a.id);state.lastReadId=a.id;localStorage.setItem('kingfisherLastRead',a.id);openDetail(a,card);
  }
  function saveCurrent(){
    const a=currentArticle(),card=topCard(); if(!a||!card)return;
    snapshot();addHistory(a.id);state.saved.add(a.id);state.processed.add(a.id);persist();
    const target=$('.save-action'),cr=card.getBoundingClientRect(),tr=target?.getBoundingClientRect();
    let dx=0,dy=innerHeight*.7;
    if(tr){dx=(tr.left+tr.width/2)-(cr.left+cr.width/2);dy=(tr.top+tr.height/2)-(cr.top+cr.height/2);}
    card.style.transition='transform 320ms cubic-bezier(.18,.78,.18,1),opacity 230ms linear';
    card.style.transform=`translate3d(${dx}px,${dy}px,0) scale(.055)`;card.style.opacity='.08';target?.classList.add('receive');
    setTimeout(()=>{target?.classList.remove('receive');renderDeck();renderDrawer();},310);
  }

  function fillDetail(a){
    $('#detailHero').innerHTML=imageMarkup(a);bindImageFallback($('#detailHero'));
    $('#detailMeta').textContent=`${(a.tags||[]).join(' · ')}${a.source?' · '+displaySource(a.source):''}`;
    $('#detailTitle').textContent=a.title;$('#detailDek').textContent=a.summary;
    const body=a.body||[],source=displaySource(a.source||'KINGFISHER'),demo=/DEMO/i.test(source);
    const sections=body.map((p,i)=>{
      const labels=['ニュース概要','何が変わっているか','なぜ重要なのか','背景と次の焦点'];
      return `<section class="news-section ${i===0?'overview':''}"><h2>${labels[i]||'続報で見る点'}</h2><p>${esc(p)}</p></section>`;
    }).join('');
    const hook=a.key?`<aside class="news-hook"><small>読むポイント</small><strong>${esc(a.key)}</strong></aside>`:'';
    const quote=`<figure class="quoted-news"><figcaption>引用ニュース${demo?' · DEMO':''}</figcaption><blockquote>「${esc(a.summary||a.title)}」</blockquote><cite>${esc(source)}</cite></figure>`;
    const watch=a.watch?`<section class="news-section"><h2>次に見ること</h2><p>${esc(a.watch)}</p></section>`:'';
    $('#detailArticle').innerHTML=`<section class="news-brief"><h2>ニュース概要</h2><p>${esc(a.summary)}</p></section>${hook}${sections}${quote}${watch}<section class="detail-dive-entry"><div class="dive-entry-label">DIVE</div><div id="detailDiveChoices" class="detail-dive-choices"></div></section>`;
    $('#detailSource').textContent=demo?'KINGFISHER DEMO · source connection pending':source;
    $('#detailLike').classList.toggle('active',state.liked.has(a.id));$('#detailBookmark').classList.toggle('active',state.saved.has(a.id));
    renderDetailDiveChoices(a);
  }

  function openDetail(a,card=null){
    if(!a)return;
    const detail=$('#detail');state.detailArticle=a;state.detailRect=card?.getBoundingClientRect()||null;fillDetail(a);
    $('#detailScroll').scrollTop=0;
    detail.classList.add('visible');detail.setAttribute('aria-hidden','false');
    if(state.detailRect){
      const r=state.detailRect,sx=r.width/innerWidth,sy=r.height/innerHeight;
      detail.style.transform=`translate3d(${r.left}px,${r.top}px,0) scale(${sx},${sy})`;detail.style.borderRadius='30px';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{detail.classList.add('open');detail.style.transform='';detail.style.borderRadius='';}));
    }else{detail.classList.add('open');detail.style.transform='';detail.style.borderRadius='';}
  }
  function finishDetailClose(){
    const d=$('#detail');d.classList.remove('open','visible','dragging');d.style='';d.setAttribute('aria-hidden','true');state.detailArticle=null;
  }
  function closeDetailRight(){
    if(!state.detailArticle)return;
    const d=$('#detail');d.classList.remove('dragging');d.style.transition='transform 240ms cubic-bezier(.16,.76,.20,1),opacity 170ms linear';d.style.transform='translate3d(104vw,0,0) scale(.993)';d.style.opacity='.16';
    setTimeout(()=>{d.style.transition='';finishDetailClose();renderDeck();},240);
  }
  function bindDetailGesture(){
    const sc=$('#detailScroll');let g=null;
    sc.addEventListener('pointerdown',e=>{if(!$('#detail').classList.contains('open'))return;g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null};});
    sc.addEventListener('pointermove',e=>{
      if(!g||e.pointerId!==g.id)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;
      if(!g.axis&&Math.hypot(dx,dy)>7)g.axis=Math.abs(dx)>Math.abs(dy)*1.08?'x':'y';
      if(g.axis!=='x'||dx<=0)return;e.preventDefault();
      const now=performance.now(),dt=Math.max(8,now-g.lastT),iv=(e.clientX-g.lastX)/dt;g.vx=g.vx*.42+iv*.58;g.lastX=e.clientX;g.lastT=now;
      const progress=clamp(dx/190,0,1),d=$('#detail');d.classList.add('dragging');d.style.transform=`translate3d(${dx*.94}px,0,0) scale(${1-progress*.007})`;d.style.opacity=String(1-progress*.11);
    },{passive:false});
    sc.addEventListener('pointerup',e=>{if(!g||e.pointerId!==g.id)return;const dx=e.clientX-g.x,axis=g.axis,vx=g.vx;g=null;if(axis==='x'&&(dx>=42||vx>=.27)){closeDetailRight();return;}const d=$('#detail');d.classList.remove('dragging');d.style.transform='';d.style.opacity='1';});
    sc.addEventListener('pointercancel',()=>{g=null;const d=$('#detail');d.classList.remove('dragging');d.style.transform='';d.style.opacity='1';});
  }

  function toggleLike(){const a=state.detailArticle;if(!a)return;state.liked.has(a.id)?state.liked.delete(a.id):state.liked.add(a.id);persist();$('#detailLike').classList.toggle('active',state.liked.has(a.id));renderDrawer();}
  function toggleDetailSave(){const a=state.detailArticle;if(!a)return;state.saved.has(a.id)?state.saved.delete(a.id):state.saved.add(a.id);persist();$('#detailBookmark').classList.toggle('active',state.saved.has(a.id));renderDrawer();}

  const DIVE_CATALOG = [
    {label:'TECH',hint:'仕組みを分解',keywords:['drone','ai','tech','drones'],title:'技術はどう動く？',body:'このニュースを成立させている技術を、入力・判断・実行の順に分けて見る。どこが強みで、どこが弱点なのかが見えてくる。'},
    {label:'WHY NOW',hint:'なぜ今なのか',keywords:['ukraine','europe','politics'],title:'なぜ今、重要になった？',body:'以前から存在した問題が、どの条件の変化で急に重要になったのか。時間軸を置くとニュースの意味が変わる。'},
    {label:'RUSSIA',hint:'反対側の視点',keywords:['ukraine','russia','defense'],title:'ロシア側から見ると？',body:'同じ出来事を反対側の制約・目的・対応策から見る。相手が何を恐れ、何を変えようとしているかを整理する。'},
    {label:'COST',hint:'お金と量産',keywords:['economy','energy','industry'],title:'いくらかかり、量産できる？',body:'性能だけでなく単価、供給網、生産速度、維持費を見る。現実に広がる技術かどうかはここで決まる。'},
    {label:'RADAR',hint:'どう発見する？',keywords:['drone','defense'],title:'どうやって見つける？',body:'センサー、レーダー、画像、通信情報。対象を見つけるまでの仕組みと、見逃しが起こる場所を追う。'},
    {label:'COMPARE',hint:'各国・方式を比較',keywords:['europe','tech'],title:'他の方式と何が違う？',body:'代替手段と並べて、速度・価格・精度・供給量を比較する。一つの技術だけでは見えないトレードオフが分かる。'},
    {label:'POLICY',hint:'制度と政治',keywords:['politics','europe','ukraine'],title:'政策は何を変える？',body:'予算、規制、同盟、調達。技術や市場が広がる条件を、制度の側から確認する。'},
    {label:'HISTORY',hint:'過去から見る',keywords:['history'],title:'以前はどうだった？',body:'似た問題が過去にどう扱われ、何が失敗し、何が残ったかを見る。今の選択肢の理由が見えてくる。'},
    {label:'NUMBERS',hint:'数字で確かめる',keywords:['economy','cost','energy'],title:'数字にすると何が見える？',body:'規模、比率、速度、コストを数字に置き換える。印象ではなく、どの差が本当に大きいのかを見る。'},
    {label:'IMPACT',hint:'生活への影響',keywords:['people','economy','energy'],title:'誰に、どう影響する？',body:'国家や企業の話を、生活・雇用・価格・安全に落とす。ニュースが自分事になる位置を探す。'},
    {label:'PRODUCTION',hint:'作れる量を見る',keywords:['defense','industry','europe'],title:'本当に作れる量は？',body:'工場、部品、人材、契約期間。予算ではなく現物の供給能力から実現可能性を確認する。'},
    {label:'NEXT',hint:'次に起きること',keywords:['politics','market'],title:'次に何が起こりうる？',body:'今ある制約から、次の一手と反応を複数に分ける。予言ではなく、監視すべき条件を持つ。'}
  ];
  const DIVE_COLORS=['#0b1d20','#0a2024','#081b20','#07171c','#061419'];
  function diveAffinity(item,a){
    const words=[...state.interests,...(a.tags||[]),a.topic||''].join(' ').toLowerCase();
    return item.keywords.reduce((n,k)=>n+(words.includes(k)?2:0),0);
  }
  function diveChoices(a,depth,path=[]){
    const used=new Set(path.map(x=>x.label));
    const pool=DIVE_CATALOG.filter(x=>!used.has(x.label)).map(x=>({...x,score:diveAffinity(x,a)})).sort((x,y)=>y.score-x.score);
    const picked=[];
    pool.forEach(x=>{if(picked.length<2&&x.score>0)picked.push(x);});
    pool.forEach(x=>{if(picked.length<2&&!picked.some(p=>p.label===x.label))picked.push(x);});
    const breadth=pool.slice().reverse().find(x=>!picked.some(p=>p.label===x.label));if(breadth)picked.push(breadth);
    return picked.slice(0,3);
  }
  function renderDetailDiveChoices(a){
    const host=$('#detailDiveChoices');if(!host)return;
    host.innerHTML=diveChoices(a,0,[]).map((c,i)=>`<button class="detail-dive-choice" data-index="${i}"><strong>${c.label}</strong><span>${c.hint}</span></button>`).join('');
    $$('.detail-dive-choice',host).forEach((b,i)=>b.addEventListener('click',()=>enterDive(a,'detail',diveChoices(a,0,[])[i])));
  }
  function enterDive(a,origin='cards',firstChoice=null){
    if(!a)return;
    if(origin==='detail'){finishDetailClose();}
    state.tab='dive';state.dive={articleId:a.id,depth:firstChoice?1:0,path:firstChoice?[firstChoice]:[],current:firstChoice||{label:'SURFACE',title:a.title,body:a.summary},origin};
    renderDive();showScreen('dive');syncNav();
  }
  function renderDive(){
    const a=articleById(state.dive.articleId)||articleById(state.lastReadId)||articles[0];if(!a)return;
    const d=state.dive.depth,current=state.dive.current||{title:a.title,body:a.summary};
    const screen=$('#diveScreen');screen.style.setProperty('--dive-bg',DIVE_COLORS[Math.min(d,DIVE_COLORS.length-1)]);
    $('#diveDepth').innerHTML=geoNumber(String(d).padStart(2,'0'));
    $('#diveRail').innerHTML=Array.from({length:Math.max(1,d+1)},(_,i)=>`<i class="${i===d?'active':''}"></i>`).join('');
    $('#diveTheme').textContent=current.title||a.title;$('#diveText').textContent=current.body||a.summary;
    const choices=d>=4?[]:diveChoices(a,d,state.dive.path);
    $('#diveChoices').innerHTML=choices.map((c,i)=>`<button class="dive-choice" data-i="${i}"><strong>${c.label}</strong><span>${c.hint}</span></button>`).join('');
    $$('.dive-choice').forEach((b,i)=>b.addEventListener('click',()=>chooseDive(choices[i],b)));
    $('#diveEnd').classList.toggle('show',d>=4);
  }
  function chooseDive(choice,button){
    if(!choice)return;button.classList.add('selected');const stage=$('#diveStage');stage.classList.add('sink');
    setTimeout(()=>{
      state.dive.depth++;state.dive.path.push(choice);state.dive.current=choice;renderDive();stage.classList.remove('sink');stage.classList.add('rise');requestAnimationFrame(()=>requestAnimationFrame(()=>stage.classList.remove('rise')));
    },280);
  }
  function bindDiveSurfaceGesture(){
    const screen=$('#diveScreen');let g=null;
    screen.addEventListener('pointerdown',e=>{if(state.tab!=='dive')return;g={id:e.pointerId,y:e.clientY,lastY:e.clientY,lastT:performance.now(),vy:0};});
    screen.addEventListener('pointermove',e=>{if(!g||e.pointerId!==g.id)return;const dy=Math.max(0,e.clientY-g.y),now=performance.now(),dt=Math.max(8,now-g.lastT);g.vy=(e.clientY-g.lastY)/dt;g.lastY=e.clientY;g.lastT=now;screen.style.setProperty('--surface-pull',String(clamp(dy/180,0,1)));$('#diveStage').style.transform=`translateY(${dy*.32}px) scale(${1-dy/9000})`;});
    screen.addEventListener('pointerup',e=>{if(!g||e.pointerId!==g.id)return;const dy=e.clientY-g.y,vy=g.vy;g=null;if(dy>90||vy>.58){exitDive();return;}screen.style.setProperty('--surface-pull','0');$('#diveStage').style.transform='';});
    screen.addEventListener('pointercancel',()=>{g=null;screen.style.setProperty('--surface-pull','0');$('#diveStage').style.transform='';});
  }
  function exitDive(){
    const origin=state.dive.origin,a=articleById(state.dive.articleId);state.tab='forYou';showScreen('cards');renderDeck();$('#diveScreen').style.setProperty('--surface-pull','0');$('#diveStage').style.transform='';
    if(origin==='detail'&&a)setTimeout(()=>openDetail(a,topCard()?.dataset.id===a.id?topCard():null),80);
  }

  function showScreen(which){
    $('#cardsScreen').classList.toggle('active',which==='cards');$('#diveScreen').classList.toggle('active',which==='dive');
  }
  function switchTab(tab){
    if(tab==='dive'){
      const a=articleById(state.lastReadId)||currentArticle()||articles[0];
      if(state.dive.articleId){state.tab='dive';showScreen('dive');renderDive();syncNav();}else enterDive(a,'cards');
      return;
    }
    state.tab=tab;showScreen('cards');renderDeck();syncNav();
  }

  function openDrawer(){renderDrawer();$('#drawer').classList.add('open');$('#drawerBackdrop').classList.add('show');}
  function closeDrawer(){$('#drawer').classList.remove('open');$('#drawerBackdrop').classList.remove('show');}
  function drawerRows(ids){
    return ids.map(id=>articleById(id)).filter(Boolean).map(a=>`<button class="drawer-article" data-id="${esc(a.id)}">${esc(a.title)}</button>`).join('')||'<div class="drawer-empty">EMPTY</div>';
  }
  function renderDrawer(){
    const body=$('#drawerBody');if(!body)return;
    if(state.drawerView==='home'){
      body.innerHTML=`<div class="drawer-actions">
        <button data-view="liked"><span>♡</span><b>LIKED</b></button>
        <button data-view="saved"><span>⌑</span><b>SAVED</b></button>
        <button data-view="interests"><span>◎</span><b>INTERESTS</b></button>
        <button data-view="appearance"><span>◐</span><b>APPEARANCE</b></button>
      </div><div class="drawer-section-title">HISTORY</div><div class="drawer-history">${drawerRows(state.historyIds)}</div>`;
    }else if(state.drawerView==='liked') body.innerHTML=`<button class="drawer-back">←</button><h2>LIKED</h2>${drawerRows([...state.liked])}`;
    else if(state.drawerView==='saved') body.innerHTML=`<button class="drawer-back">←</button><h2>SAVED</h2>${drawerRows([...state.saved])}`;
    else if(state.drawerView==='interests') body.innerHTML=`<button class="drawer-back">←</button><h2>INTERESTS</h2><div class="interest-list">${state.interests.map((x,i)=>`<button class="interest-chip" data-i="${i}">${esc(x)} ×</button>`).join('')}</div><form id="drawerInterestForm"><input id="drawerInterestInput" maxlength="32" placeholder="＋"/><button>＋</button></form>`;
    else if(state.drawerView==='appearance') body.innerHTML=`<button class="drawer-back">←</button><h2>APPEARANCE</h2><div class="theme-list"><button data-theme="dark">DARK</button><button data-theme="light">LIGHT</button><button data-theme="system">SYSTEM</button></div>`;
    bindDrawerContent();applyTheme();
  }
  function bindDrawerContent(){
    $$('.drawer-actions [data-view]').forEach(b=>b.addEventListener('click',()=>{state.drawerView=b.dataset.view;renderDrawer();}));
    $('.drawer-back')?.addEventListener('click',()=>{state.drawerView='home';renderDrawer();});
    $$('.drawer-article').forEach(b=>b.addEventListener('click',()=>{const a=articleById(b.dataset.id);closeDrawer();if(a)openDetail(a,null);}));
    $$('.interest-chip').forEach(b=>b.addEventListener('click',()=>{state.interests.splice(Number(b.dataset.i),1);persist();renderDrawer();renderDeck();}));
    $('#drawerInterestForm')?.addEventListener('submit',e=>{e.preventDefault();const input=$('#drawerInterestInput'),v=input.value.trim();if(v&&!state.interests.some(x=>x.toLowerCase()===v.toLowerCase()))state.interests.push(v);persist();renderDrawer();renderDeck();});
    $$('[data-theme]').forEach(b=>b.addEventListener('click',()=>{state.themeChoice=b.dataset.theme;localStorage.setItem('kingfisherTheme',state.themeChoice);applyTheme();}));
  }

  function buildTutorial(){
    const tutorial=$('#tutorial');
    tutorial.innerHTML=`<div class="tutorial-stage"><div class="tutorial-brand">KINGFISHER</div><div class="tutorial-progress"><i></i><i></i><i></i></div><div id="tutorialCard" class="tutorial-card-v12"><div class="tutorial-river"></div><div class="tutorial-bird">${$('#splashBird')?.innerHTML||''}</div><div class="tutorial-copy"><small id="tutorialStepNo"></small><strong id="tutorialTitle"></strong></div><span id="tutorialCue" class="tutorial-cue-v12"></span></div><div id="tutorialHint" class="tutorial-hint"></div></div>`;
    const steps=[{dir:'left',title:'知っている',cue:'←',hint:'左へ'},{dir:'right',title:'もっと読む',cue:'→',hint:'右へ'},{dir:'down',title:'自分に保存',cue:'⌄',hint:'手前へ'}];
    let index=0,g=null;const card=$('#tutorialCard');
    const render=()=>{const s=steps[index];$('#tutorialStepNo').textContent=`0${index+1} / 03`;$('#tutorialTitle').textContent=s.title;$('#tutorialCue').textContent=s.cue;$('#tutorialHint').textContent=s.hint;$$('.tutorial-progress i').forEach((x,i)=>x.classList.toggle('done',i<=index));};
    const complete=()=>{
      localStorage.setItem('kingfisherTutorialDone','1');
      tutorial.classList.add('finishing');setTimeout(()=>{tutorial.classList.add('hidden');tutorial.classList.remove('finishing');tutorial.setAttribute('aria-hidden','true');renderDeck();},300);
    };
    const advance=(dx,dy)=>{
      const s=steps[index],fly=s.dir==='left'?`translate3d(-105vw,0,0) rotate(-7deg)`:s.dir==='right'?`translate3d(105vw,0,0) rotate(7deg)`:'translate3d(0,74vh,0) scale(.12)';card.style.transition='transform 270ms cubic-bezier(.16,.76,.20,1),opacity 180ms linear';card.style.transform=fly;card.style.opacity='.05';
      setTimeout(()=>{index++;if(index>=steps.length){complete();return;}card.style.transition='none';card.style.transform='translate3d(0,18px,0) scale(.97)';card.style.opacity='0';render();requestAnimationFrame(()=>requestAnimationFrame(()=>{card.style.transition='transform 280ms cubic-bezier(.2,.72,.18,1),opacity 190ms linear';card.style.transform='';card.style.opacity='1';}));},260);
    };
    card.addEventListener('pointerdown',e=>{card.setPointerCapture?.(e.pointerId);g={id:e.pointerId,x:e.clientX,y:e.clientY};card.style.transition='none';});
    card.addEventListener('pointermove',e=>{if(!g||e.pointerId!==g.id)return;const dx=e.clientX-g.x,dy=e.clientY-g.y,s=steps[index];let tx=dx*.72,ty=dy*.72;if(s.dir==='left')tx=Math.min(4,tx);if(s.dir==='right')tx=Math.max(-4,tx);if(s.dir==='down')ty=Math.max(-4,ty);card.style.transform=`translate3d(${tx}px,${ty}px,0) rotate(${tx/65}deg)`;});
    card.addEventListener('pointerup',e=>{if(!g||e.pointerId!==g.id)return;const dx=e.clientX-g.x,dy=e.clientY-g.y,s=steps[index];g=null;const ok=(s.dir==='left'&&dx<-54)||(s.dir==='right'&&dx>54)||(s.dir==='down'&&dy>54);if(ok){advance(dx,dy);return;}card.style.transition='transform 180ms cubic-bezier(.2,.72,.18,1)';card.style.transform='';});
    card.addEventListener('pointercancel',()=>{g=null;card.style.transform='';});render();
  }

  function showAfterSplash(){
    $('#app').classList.remove('hidden');$('#app').style.opacity='1';renderDeck();renderDrawer();
    if(localStorage.getItem('kingfisherTutorialDone')==='1'){$('#tutorial').classList.add('hidden');$('#tutorial').setAttribute('aria-hidden','true');}
    else{$('#tutorial').classList.remove('hidden');$('#tutorial').setAttribute('aria-hidden','false');buildTutorial();}
  }

  function bindSplash(){
    const splash=$('#splash'),bird=$('#splashBird'),scene=$('#splashScene'),ripple=$('#waterRipple'),veil=$('#waterVeil'),M=window.KINGFISHER_MOTION;
    let g=null,raf=0,currentY=0,targetY=0;
    const draw=()=>{if(!g){raf=0;return;}currentY+=(targetY-currentY)*M.charge.response;const charge=clamp(g.distance/M.charge.maxDistance,0,1),scale=1-charge*.055;bird.style.opacity='1';bird.style.transform=`translate3d(-50%,${currentY}px,0) scale(${scale})`;raf=requestAnimationFrame(draw);};
    const restore=()=>{g=null;if(raf)cancelAnimationFrame(raf);raf=0;bird.style.transition='transform 210ms cubic-bezier(.2,.72,.18,1)';bird.style.opacity='1';bird.style.transform='translate3d(-50%,0,0) scale(1)';setTimeout(()=>bird.style.transition='',220);};
    const complete=()=>{splash.style.transition='opacity 180ms linear';splash.style.opacity='0';splash.style.pointerEvents='none';setTimeout(()=>{splash.classList.add('hidden');showAfterSplash();},190);};
    const launch=data=>{
      const vh=innerHeight,startCenter=vh-73,waterCenter=vh*M.flight.waterY,travel=waterCenter-startCenter,velocity=Math.max(0,data.velocity),duration=clamp(M.flight.durationBase-velocity*M.flight.velocityInfluence,M.flight.durationMin,M.flight.durationMax),t0=performance.now(),startY=currentY,startScale=1-Math.min(.055,Math.abs(startY)/3800),initial=clamp(.16+velocity*.035,.16,.28);
      let done=false;const fallback=setTimeout(()=>{if(!done){done=true;complete();}},duration+M.dive.duration+M.immersion.duration+900);
      const flight=now=>{const t=clamp((now-t0)/duration,0,1),p=initial*t+(1-initial)*t*t,sp=clamp((p-.12)/.88,0,1),y=startY+(travel*.86-startY)*p,s=startScale+(M.flight.scaleEnd-startScale)*Math.pow(sp,1.18);bird.style.opacity='1';bird.style.transform=`translate3d(-50%,${y}px,0) scale(${s})`;scene.style.transform=`scale(${1.035+(M.flight.cameraScale-1.035)*p*.62})`;if(t<1){requestAnimationFrame(flight);return;}const d0=performance.now();const dive=now2=>{const d=clamp((now2-d0)/M.dive.duration,0,1),q=d*d*d,y2=travel*.86+(travel-travel*.86)*q,s2=M.flight.scaleEnd+(M.dive.scaleEnd-M.flight.scaleEnd)*q;bird.style.transform=`translate3d(-50%,${y2}px,0) scale(${s2})`;scene.style.transform=`scale(${M.flight.cameraScale+q*M.dive.cameraBoost})`;if(d<1){requestAnimationFrame(dive);return;}ripple.classList.add('impact');const i0=performance.now();const immerse=now3=>{const t3=clamp((now3-i0)/M.immersion.duration,0,1),q3=1-Math.pow(1-t3,4);bird.style.opacity=String(1-t3);scene.style.transform=`scale(${M.flight.cameraScale+M.dive.cameraBoost+q3*(M.immersion.cameraScale-M.flight.cameraScale-M.dive.cameraBoost)}) translateY(${-q3*2.4}%)`;scene.style.filter=`saturate(${1.08+t3*.08}) blur(${q3*2}px)`;veil.style.opacity=String(q3);veil.style.transform=`scale(${.86+q3*.26})`;if(t3>M.immersion.handoffAt){$('#app').classList.remove('hidden');$('#app').style.opacity=String(clamp((t3-M.immersion.handoffAt)/(1-M.immersion.handoffAt),0,1));}if(t3<1){requestAnimationFrame(immerse);return;}if(!done){done=true;clearTimeout(fallback);complete();}};requestAnimationFrame(immerse);};requestAnimationFrame(dive);};requestAnimationFrame(flight);
    };
    splash.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;splash.setPointerCapture?.(e.pointerId);const now=performance.now();g={id:e.pointerId,startY:e.clientY,lastY:e.clientY,lastT:now,velocity:0,distance:0};currentY=targetY=0;bird.style.opacity='1';if(!raf)raf=requestAnimationFrame(draw);});
    splash.addEventListener('pointermove',e=>{if(!g||e.pointerId!==g.id)return;const now=performance.now(),dt=Math.max(8,now-g.lastT),up=Math.max(0,g.startY-e.clientY),v=(g.lastY-e.clientY)/dt;g.velocity=g.velocity*.62+v*.38;g.lastY=e.clientY;g.lastT=now;g.distance=up;const charge=clamp(up/M.charge.maxDistance,0,1),follow=M.charge.initialFollow+(M.charge.finalFollow-M.charge.initialFollow)*charge;targetY=-up*follow;$('.flight-guide').style.opacity=String(clamp(.72-charge*.8,0,.72));});
    splash.addEventListener('pointerup',e=>{if(!g||e.pointerId!==g.id)return;const data=g;g=null;if(raf)cancelAnimationFrame(raf);raf=0;const commit=data.distance>=M.charge.commitDistance||(data.distance>=28&&data.velocity>=M.charge.velocityCommit);if(!commit){restore();return;}$('.flight-guide').style.opacity='0';launch(data);});
    splash.addEventListener('pointercancel',restore);
  }

  function init(){
    applyTheme();buildTutorial();bindSplash();bindDetailGesture();bindDiveSurfaceGesture();renderDrawer();syncNav();
    $('#menuButton').addEventListener('click',openDrawer);$('#drawerBackdrop').addEventListener('click',closeDrawer);$('#drawerMenuButton').addEventListener('click',closeDrawer);
    $$('.feed-tab').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
    $$('.action-button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.action==='known')markKnown();if(b.dataset.action==='read')readCurrent();if(b.dataset.action==='save')saveCurrent();}));
    $('#detailLike').addEventListener('click',toggleLike);$('#detailBookmark').addEventListener('click',toggleDetailSave);$('#detailBackHint').addEventListener('click',closeDetailRight);$('#undoBtn').addEventListener('click',undo);
    if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }

  init();
})();