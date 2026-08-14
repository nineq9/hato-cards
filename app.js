const articles = window.KAWASEMI_ARTICLES || [];
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutQuint = t => 1 - Math.pow(1 - t, 5);
const easeInCubic = t => t * t * t;
const easeSmooth = t => t * t * (3 - 2 * t);

window.KINGFISHER_MOTION = {
  charge: {
    commitDistance: 56,
    velocityCommit: 0.34,
    maxDistance: 250,
    initialFollow: 0.16,
    finalFollow: 0.64,
    visualResponse: 0.24,
    cancelDuration: 220
  },
  flight: {
    durationBase: 880,
    durationMin: 650,
    durationMax: 980,
    velocityInfluence: 130,
    targetViewportY: 0.535,
    scaleEnd: 0.15,
    cameraScale: 1.13
  },
  dive: {
    duration: 220,
    scaleEnd: 0.035,
    speedBoost: 1.16
  },
  immersion: {
    duration: 480,
    cameraScale: 1.52,
    veilOpacity: 1,
    handoffAt: 0.44
  }
};

const state = {
  feed: 'forYou',
  processed: new Set(JSON.parse(localStorage.getItem('kingfisherProcessed') || localStorage.getItem('kawasemiProcessed') || '[]')),
  saved: new Set(JSON.parse(localStorage.getItem('kingfisherSaved') || localStorage.getItem('kawasemiSaved') || '[]')),
  liked: new Set(JSON.parse(localStorage.getItem('kingfisherLiked') || localStorage.getItem('kawasemiLiked') || '[]')),
  interests: JSON.parse(localStorage.getItem('kingfisherInterests') || localStorage.getItem('kawasemiInterests') || '["Ukraine","AI","Drones","Europe","Energy"]'),
  archiveMode: 'theme',
  history: [],
  drag: null,
  detailArticle: null,
  detailRect: null,
  detailGesture: null,
  toastTimer: null,
  themeChoice: localStorage.getItem('kingfisherTheme') || 'dark',
  count: null,
  splashComplete: false
};

const app = $('#app');
const splash = $('#splash');
const splashBird = $('#splashBird');
const splashScene = $('#splashScene');
const waterRipple = $('#waterRipple');
const waterVeil = $('#waterVeil');
const tutorial = $('#tutorial');
const deck = $('#deck');
const detail = $('#detail');
const detailScroll = $('#detailScroll');

function persist() {
  localStorage.setItem('kingfisherProcessed', JSON.stringify([...state.processed]));
  localStorage.setItem('kingfisherSaved', JSON.stringify([...state.saved]));
  localStorage.setItem('kingfisherLiked', JSON.stringify([...state.liked]));
  localStorage.setItem('kingfisherInterests', JSON.stringify(state.interests));
}
function resolveTheme(choice = state.themeChoice) {
  if (choice === 'system') return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return choice === 'light' ? 'light' : 'dark';
}
function applyTheme() {
  const actual = resolveTheme();
  document.documentElement.dataset.theme = actual;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', actual === 'dark' ? '#0a1214' : '#f2f0ea');
  $$('[data-theme-choice]').forEach(b => b.classList.toggle('active', b.dataset.themeChoice === state.themeChoice));
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
  if (state.themeChoice === 'system') applyTheme();
});

const DIGIT_SEGMENTS = {
  0:[1,1,1,1,1,1,0],1:[0,1,1,0,0,0,0],2:[1,1,0,1,1,0,1],3:[1,1,1,1,0,0,1],4:[0,1,1,0,0,1,1],
  5:[1,0,1,1,0,1,1],6:[1,0,1,1,1,1,1],7:[1,1,1,0,0,0,0],8:[1,1,1,1,1,1,1],9:[1,1,1,1,0,1,1]
};
const SEG_LINES = [
  [5,4,19,4], [21,6,21,19], [21,22,21,35], [5,37,19,37], [3,22,3,35], [3,6,3,19], [5,20.5,19,20.5]
];
function digitSvg(d) {
  const active = DIGIT_SEGMENTS[d] || DIGIT_SEGMENTS[0];
  return `<svg viewBox="0 0 24 42" aria-hidden="true">${SEG_LINES.map((l,i)=>`<line class="seg" x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}" opacity="${active[i] ? 1 : .06}"/>`).join('')}<path d="M0 26 L8 19" stroke="currentColor" stroke-width="1.3" opacity=".26"/></svg>`;
}
function numberLayer(value, cls) {
  return `<span class="geo-number-layer ${cls}">${String(Math.max(0,value)).split('').map(digitSvg).join('')}</span>`;
}
function renderGeoNumber(value) {
  const counter = $('#counter');
  if (!counter) return;
  counter.setAttribute('aria-label', `残り${value}件`);
  if (state.count === null) {
    counter.innerHTML = numberLayer(value, 'new');
    state.count = value;
    return;
  }
  if (state.count === value) return;
  const old = state.count;
  state.count = value;
  counter.innerHTML = numberLayer(old, 'old') + numberLayer(value, 'new');
  setTimeout(() => {
    if (state.count === value) counter.innerHTML = numberLayer(value, 'new');
  }, 440);
}

function likedTags() {
  const tags = new Set();
  articles.filter(a => state.liked.has(a.id)).forEach(a => (a.tags || []).forEach(t => tags.add(String(t).toLowerCase())));
  return tags;
}
function interestScore(article) {
  const prefs = new Set([...state.interests.map(x => String(x).toLowerCase()), ...likedTags()]);
  return (article.tags || []).reduce((n,t) => n + (prefs.has(String(t).toLowerCase()) ? 3 : 0), 0) + (article.hot ? 1 : 0) + (article.must ? 1 : 0);
}
function feedArticles() {
  let list;
  if (state.feed === 'hot') list = articles.filter(a => a.hot);
  else if (state.feed === 'must') list = articles.filter(a => a.must);
  else list = [...articles].sort((a,b) => interestScore(b) - interestScore(a));
  return list.filter(a => !state.processed.has(a.id));
}
function articleById(id) { return articles.find(a => a.id === id); }
function displaySource(source) { return String(source || '').replace(/KAWASEMI/g,'KINGFISHER'); }
function imageMarkup(a) {
  return `<img src="${a.image || ''}" alt="" loading="eager" referrerpolicy="no-referrer" data-article-image="${a.id}">`;
}
function attachImageFallback(root = document) {
  $$('img[data-article-image]', root).forEach(img => {
    if (img.dataset.boundFallback) return;
    img.dataset.boundFallback = '1';
    img.addEventListener('error', () => {
      const host = img.parentElement;
      if (!host) return;
      host.innerHTML = '<div class="card-fallback"></div>';
    }, {once:true});
  });
}
function cardMarkup(a, pos) {
  return `<article class="news-card ${pos===1?'back1':pos===2?'back2':''}" data-id="${a.id}" data-pos="${pos}">
    <div class="card-image">${imageMarkup(a)}</div>
    <div class="card-shade"></div>
    <div class="card-copy">
      <div class="card-tags">${(a.tags || []).slice(0,3).map(t=>`<span class="card-tag">${t}</span>`).join('')}</div>
      <h2 class="card-title">${a.title}</h2>
      <p class="card-summary">${a.summary}</p>
      <div class="card-source">${displaySource(a.source)}</div>
    </div>
    <span class="card-edge-cue left">←</span><span class="card-edge-cue save">⌄</span><span class="card-edge-cue right">→</span>
    <span class="gesture-flash left">KNOW</span><span class="gesture-flash save">SAVE</span><span class="gesture-flash right">READ</span>
  </article>`;
}
function renderDeck() {
  const queue = feedArticles();
  renderGeoNumber(queue.length);
  deck.innerHTML = '';
  if (!queue.length) {
    deck.innerHTML = '<div class="news-card" style="display:grid;place-items:center;color:var(--kf-text-muted);font-size:10px;letter-spacing:.18em">CLEAR</div>';
    $('#actionDock').style.opacity = '.24';
    $('#actionDock').style.pointerEvents = 'none';
    updateStats();
    return;
  }
  $('#actionDock').style.opacity = '1';
  $('#actionDock').style.pointerEvents = 'auto';
  for (let p = Math.min(2, queue.length - 1); p >= 0; p--) deck.insertAdjacentHTML('beforeend', cardMarkup(queue[p], p));
  attachImageFallback(deck);
  bindTopCard();
  updateStats();
}
function topCard() { return $('.news-card[data-pos="0"]', deck); }
function currentArticle() { const c = topCard(); return c ? articleById(c.dataset.id) : null; }
function clearGestureCues(card) { $$('.gesture-flash', card).forEach(x => x.style.opacity = 0); }
function resetCard(card, animate = true) {
  if (!card) return;
  card.style.transition = animate ? 'transform 220ms cubic-bezier(.2,.72,.18,1), opacity 180ms linear' : 'none';
  card.style.transform = '';
  card.style.opacity = '';
  clearGestureCues(card);
  if (animate) setTimeout(() => { if(card) card.style.transition=''; }, 230);
}
function setGestureCue(card, type, strength) {
  clearGestureCues(card);
  const el = $(`.gesture-flash.${type}`, card);
  if (el) el.style.opacity = clamp(strength,0,1);
}
function bindTopCard() {
  const card = topCard();
  if (!card) return;
  let gesture = null;
  const start = e => {
    if (e.button !== undefined && e.button !== 0) return;
    card.setPointerCapture?.(e.pointerId);
    const t = performance.now();
    gesture = {id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,lastT:t,vx:0,vy:0,axis:null};
    card.style.transition='none';
  };
  const move = e => {
    if (!gesture || e.pointerId !== gesture.id) return;
    const now = performance.now();
    const dt = Math.max(8, now - gesture.lastT);
    gesture.vx = (e.clientX - gesture.lastX) / dt;
    gesture.vy = (e.clientY - gesture.lastY) / dt;
    gesture.lastX=e.clientX;gesture.lastY=e.clientY;gesture.lastT=now;
    const dx=e.clientX-gesture.x, dy=e.clientY-gesture.y;
    if (!gesture.axis && Math.hypot(dx,dy)>10) gesture.axis = Math.abs(dx) > Math.abs(dy)*1.12 ? 'x' : Math.abs(dy) > Math.abs(dx)*1.12 ? 'y' : null;
    if (!gesture.axis) return;
    if (gesture.axis === 'x') {
      card.style.transform=`translate3d(${dx}px,0,0) rotate(${dx/38}deg)`;
      setGestureCue(card, dx<0?'left':'right', Math.abs(dx)/88);
    } else if (gesture.axis === 'y') {
      if (dy < 0) {
        card.style.transform=`translate3d(0,${dy*.18}px,0)`;
        clearGestureCues(card);
      } else {
        card.style.transform=`translate3d(0,${dy*.72}px,0) scale(${1-Math.min(.025,dy/5000)})`;
        setGestureCue(card,'save',dy/92);
      }
    }
  };
  const end = e => {
    if (!gesture || e.pointerId !== gesture.id) return;
    const g=gesture;gesture=null;
    const dx=e.clientX-g.x, dy=e.clientY-g.y;
    const commitX = Math.abs(dx) > 72 || Math.abs(g.vx) > .48;
    const commitSave = dy > 72 || g.vy > .48;
    if (g.axis==='x' && commitX) {
      if (dx>0 || g.vx>.48) return openDetail(currentArticle(),card);
      return handleKnown(card);
    }
    if (g.axis==='y' && commitSave) return handleSave(card);
    resetCard(card,true);
  };
  card.addEventListener('pointerdown',start);
  card.addEventListener('pointermove',move);
  card.addEventListener('pointerup',end);
  card.addEventListener('pointercancel',()=>{gesture=null;resetCard(card,true)});
}
function snapshot(){ state.history.push({processed:[...state.processed],saved:[...state.saved],liked:[...state.liked]}); }
function handleKnown(card = topCard()) {
  const a = currentArticle(); if (!a || !card) return;
  snapshot(); state.processed.add(a.id); persist();
  card.style.transition='transform 240ms cubic-bezier(.14,.78,.22,1),opacity 180ms linear';
  card.style.transform='translate3d(-120vw,0,0) rotate(-10deg)'; card.style.opacity='0';
  showToast('知ってるにしました');
  setTimeout(renderDeck,220);
}
function handleSave(card = topCard()) {
  const a = currentArticle(); if (!a || !card) return;
  snapshot(); state.saved.add(a.id); state.processed.add(a.id); persist();
  card.style.transition='transform 240ms cubic-bezier(.14,.78,.22,1),opacity 180ms linear';
  card.style.transform='translate3d(0,95vh,0) scale(.92)'; card.style.opacity='0';
  showToast('保存しました');
  setTimeout(()=>{renderDeck();renderSavedArchive()},220);
}
function handleRead(){ const a=currentArticle(),c=topCard(); if(a&&c) openDetail(a,c); }

const ARTICLE_LABELS = ['何が起きている？','なぜ重要？','背景','これから'];
function fillDetail(a) {
  $('#detailHero').innerHTML = imageMarkup(a);
  attachImageFallback($('#detailHero'));
  $('#detailMeta').textContent = `${(a.tags || []).join(' · ')}${a.source ? ' · '+displaySource(a.source) : ''}`;
  $('#detailTitle').textContent = a.title;
  $('#detailDek').textContent = a.summary;
  $('#detailArticle').innerHTML = [
    ...(a.body || []).map((p,i)=>`<h2 class="article-section-label">${ARTICLE_LABELS[i] || 'ポイント'}</h2><p>${p}</p>`),
    a.key ? `<div class="article-key">${a.key}</div>` : '',
    a.watch ? `<div class="watch"><small>WATCH</small><p>${a.watch}</p></div>` : ''
  ].join('');
  $('#detailSource').textContent = a.source ? `${displaySource(a.source)} · prototype article` : 'prototype article';
  $('#detailLike').classList.toggle('active',state.liked.has(a.id));
  $('#detailBookmark').classList.toggle('active',state.saved.has(a.id));
}
function detailFromRect(rect) {
  if (!rect) return;
  const sx=rect.width/innerWidth, sy=rect.height/innerHeight;
  detail.style.transform=`translate3d(${rect.left}px,${rect.top}px,0) scale(${sx},${sy})`;
  detail.style.borderRadius='30px';
}
function openDetail(a, card) {
  if (!a || !card || detail.classList.contains('open')) return;
  state.detailArticle=a; state.detailRect=card.getBoundingClientRect();
  fillDetail(a);
  detailScroll.scrollTop=0;
  detailFromRect(state.detailRect);
  detail.classList.add('preopen');
  detail.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=>{
    detailScroll.scrollTop=0;
    requestAnimationFrame(()=>detail.classList.add('open'));
  });
}
function finishDetailClose() {
  detail.classList.remove('open','preopen','dragging');
  detail.style.transform='';detail.style.borderRadius='';detail.style.opacity='';
  detail.setAttribute('aria-hidden','true');
  state.detailArticle=null;state.detailGesture=null;
  renderDeck();
}
function closeDetailToCard() {
  if (!state.detailArticle) return;
  const target=topCard()?.getBoundingClientRect() || state.detailRect;
  detail.classList.remove('dragging');
  detail.style.transition='transform 300ms cubic-bezier(.2,.72,.18,1),opacity 180ms linear,border-radius 300ms cubic-bezier(.2,.72,.18,1)';
  detail.classList.remove('open');
  detailFromRect(target);
  setTimeout(()=>{detail.style.transition='';finishDetailClose()},310);
}
function bindDetailGesture() {
  let g=null;
  detailScroll.addEventListener('pointerdown',e=>{
    if(!detail.classList.contains('open') || e.button!==undefined&&e.button!==0) return;
    const t=performance.now();
    g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:t,vx:0,axis:null};
  });
  detailScroll.addEventListener('pointermove',e=>{
    if(!g||e.pointerId!==g.id)return;
    const dx=e.clientX-g.x,dy=e.clientY-g.y;
    if(!g.axis&&Math.hypot(dx,dy)>12) g.axis=Math.abs(dx)>Math.abs(dy)*1.35?'x':'y';
    if(g.axis!=='x'||dx>0)return;
    const now=performance.now(),dt=Math.max(8,now-g.lastT);g.vx=(e.clientX-g.lastX)/dt;g.lastX=e.clientX;g.lastT=now;
    detail.classList.add('dragging');
    detail.style.transform=`translate3d(${dx}px,0,0) scale(${1-Math.min(.018,Math.abs(dx)/9000)})`;
  });
  detailScroll.addEventListener('pointerup',e=>{
    if(!g||e.pointerId!==g.id)return;
    const dx=e.clientX-g.x,axis=g.axis,vx=g.vx;g=null;
    if(axis==='x'&&(dx<-78||vx<-.5)){
      detail.style.transition='transform 220ms cubic-bezier(.14,.78,.22,1),opacity 180ms linear';
      detail.style.transform='translate3d(-108vw,0,0) scale(.98)';detail.style.opacity='.15';
      setTimeout(()=>{detail.style.transition='';finishDetailClose()},220);
      return;
    }
    detail.classList.remove('dragging');detail.style.transform='';
  });
  detailScroll.addEventListener('pointercancel',()=>{g=null;detail.classList.remove('dragging');detail.style.transform=''});
}
function toggleLike(){const a=state.detailArticle;if(!a)return;state.liked.has(a.id)?state.liked.delete(a.id):state.liked.add(a.id);persist();$('#detailLike').classList.toggle('active',state.liked.has(a.id));updateStats()}
function toggleDetailSave(){const a=state.detailArticle;if(!a)return;if(state.saved.has(a.id)){state.saved.delete(a.id);showToast('保存を外しました')}else{state.saved.add(a.id);showToast('保存しました')}persist();$('#detailBookmark').classList.toggle('active',state.saved.has(a.id));renderSavedArchive();updateStats()}
function undo(){const h=state.history.pop();if(!h)return;state.processed=new Set(h.processed);state.saved=new Set(h.saved);state.liked=new Set(h.liked);persist();$('#undoToast').classList.remove('show');renderDeck();renderSavedArchive()}
function showToast(text){$('#undoText').textContent=text;$('#undoToast').classList.add('show');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>$('#undoToast').classList.remove('show'),3600)}

function switchFeed(feed){state.feed=feed;$$('.feed-nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.feed===feed));switchScreen('cardsScreen',false);renderDeck()}
function switchScreen(id, syncFeed=true){$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));if(id==='savedScreen')renderSavedArchive();if(id==='meScreen')renderMe();if(syncFeed&&id==='cardsScreen')$$('.feed-nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.feed===state.feed))}
function groupSaved(){const rows=articles.filter(a=>state.saved.has(a.id)),groups={};rows.forEach(a=>{const key=state.archiveMode==='date'?(a.month||'OTHER'):(a.topic||'OTHER');(groups[key] ||= []).push(a)});return groups}
function renderSavedArchive(){
  $$('.archive-switch button').forEach(b=>b.classList.toggle('active',b.dataset.archive===state.archiveMode));
  const groups=groupSaved(),keys=Object.keys(groups);
  if(!keys.length){$('#savedArchive').innerHTML='<div class="archive-empty">EMPTY</div>';return}
  $('#savedArchive').innerHTML=keys.sort().map(key=>`<section class="archive-group"><h3>${key.toUpperCase()}</h3>${groups[key].map(a=>`<button class="archive-item" data-id="${a.id}"><span class="archive-thumb">${imageMarkup(a)}</span><span><small>${(a.tags||[]).slice(0,2).join(' · ')}</small><strong>${a.title}</strong></span></button>`).join('')}</section>`).join('');
  attachImageFallback($('#savedArchive'));
  $$('.archive-item').forEach(b=>b.addEventListener('click',()=>{const a=articleById(b.dataset.id);state.processed.delete(a.id);persist();state.feed='forYou';switchScreen('cardsScreen');renderDeck();setTimeout(()=>{const c=$(`.news-card[data-id="${a.id}"]`,deck);if(c)openDetail(a,c)},60)}));
}
function renderMe(){
  $('#interestChips').innerHTML=state.interests.map((x,i)=>`<button class="interest-chip" data-index="${i}">${x}</button>`).join('');
  $$('.interest-chip').forEach(b=>b.addEventListener('click',()=>{state.interests.splice(Number(b.dataset.index),1);persist();renderMe();renderDeck()}));
  applyTheme();updateStats();
}
function updateStats(){if($('#screenedStat'))$('#screenedStat').textContent=state.processed.size;if($('#savedStat'))$('#savedStat').textContent=state.saved.size;if($('#likedStat'))$('#likedStat').textContent=state.liked.size}
function goHome(){state.feed='forYou';switchScreen('cardsScreen');$$('.feed-nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.feed==='forYou'));renderDeck()}

function bindSplash(){
  let input=null,raf=0,visualY=0,targetY=0;
  const motion=window.KINGFISHER_MOTION;
  const renderCharge=()=>{
    if(!input){raf=0;return}
    visualY += (targetY-visualY)*motion.charge.visualResponse;
    splashBird.style.transform=`translate3d(-50%,${visualY}px,0) scale(${1-Math.min(.12,Math.abs(visualY)/1800)})`;
    raf=requestAnimationFrame(renderCharge);
  };
  const start=e=>{
    if(state.splashComplete||e.button!==undefined&&e.button!==0)return;
    splash.setPointerCapture?.(e.pointerId);
    const now=performance.now();
    input={id:e.pointerId,startY:e.clientY,lastY:e.clientY,lastT:now,velocity:0,distance:0};
    targetY=visualY=0;
    splashBird.style.opacity='1';
    if(!raf)raf=requestAnimationFrame(renderCharge);
  };
  const move=e=>{
    if(!input||e.pointerId!==input.id)return;
    const now=performance.now(),dt=Math.max(8,now-input.lastT);
    const upward=Math.max(0,input.startY-e.clientY);
    const v=(input.lastY-e.clientY)/dt;
    input.velocity=input.velocity*.55+v*.45;input.lastY=e.clientY;input.lastT=now;input.distance=upward;
    const n=clamp(upward/motion.charge.maxDistance,0,1);
    const follow=lerp(motion.charge.initialFollow,motion.charge.finalFollow,easeSmooth(n));
    targetY=-upward*follow;
    $('.flight-guide',splash).style.opacity=String(clamp(.75-n*.9,0,.75));
  };
  const cancel=()=>{
    input=null;cancelAnimationFrame(raf);raf=0;
    splashBird.animate([{transform:splashBird.style.transform||'translate3d(-50%,0,0)'},{transform:'translate3d(-50%,0,0) scale(1)'}],{duration:motion.charge.cancelDuration,easing:'cubic-bezier(.2,.72,.18,1)',fill:'forwards'}).onfinish=()=>{splashBird.style.transform='translate3d(-50%,0,0) scale(1)';$('.flight-guide',splash).style.opacity=''};
  };
  const end=e=>{
    if(!input||e.pointerId!==input.id)return;
    const data=input;input=null;cancelAnimationFrame(raf);raf=0;
    const commit=data.distance>=motion.charge.commitDistance||data.velocity>=motion.charge.velocityCommit;
    if(!commit){cancel();return}
    launchSplash(data.velocity,data.distance,visualY);
  };
  splash.addEventListener('pointerdown',start);
  splash.addEventListener('pointermove',move);
  splash.addEventListener('pointerup',end);
  splash.addEventListener('pointercancel',cancel);
}
function launchSplash(releaseVelocity=0,distance=0,startVisualY=0){
  if(state.splashComplete)return;
  state.splashComplete=true;
  const M=window.KINGFISHER_MOTION;
  $('.flight-guide',splash).style.opacity='0';
  const start=performance.now();
  const vh=innerHeight;
  const birdBaseCenter=vh-(42+31);
  const targetCenter=vh*M.flight.targetViewportY;
  const totalTravel=targetCenter-birdBaseCenter;
  const velocity=Math.max(0,releaseVelocity);
  const flightDuration=clamp(M.flight.durationBase-velocity*M.flight.velocityInfluence,M.flight.durationMin,M.flight.durationMax);
  const startScale=1-Math.min(.12,Math.abs(startVisualY)/1800);
  let phase='flight',phaseStart=start;
  const animate=now=>{
    if(phase==='flight'){
      const p=clamp((now-phaseStart)/flightDuration,0,1),e=easeOutQuint(p);
      const y=lerp(startVisualY,totalTravel*.88,e);
      const s=lerp(startScale,M.flight.scaleEnd,e);
      splashBird.style.transform=`translate3d(-50%,${y}px,0) scale(${s})`;
      const cam=lerp(1.035,M.flight.cameraScale,easeSmooth(p));
      splashScene.style.transform=`scale(${cam})`;
      splashScene.style.filter=`saturate(${lerp(1.03,1.12,p)})`;
      if(p>=1){phase='dive';phaseStart=now;requestAnimationFrame(animate);return}
    } else if(phase==='dive'){
      const p=clamp((now-phaseStart)/M.dive.duration,0,1),e=easeInCubic(p);
      const y=lerp(totalTravel*.88,totalTravel,e);
      const s=lerp(M.flight.scaleEnd,M.dive.scaleEnd,e);
      splashBird.style.transform=`translate3d(-50%,${y}px,0) scale(${s})`;
      splashScene.style.transform=`scale(${lerp(M.flight.cameraScale,M.flight.cameraScale*1.035,e)})`;
      if(p>=1){
        splashBird.style.opacity='0';waterRipple.classList.add('impact');phase='immersion';phaseStart=now;app.classList.remove('hidden');app.style.opacity='0';requestAnimationFrame(animate);return
      }
    } else {
      const p=clamp((now-phaseStart)/M.immersion.duration,0,1),e=easeOutQuint(p);
      const cam=lerp(M.flight.cameraScale*1.035,M.immersion.cameraScale,e);
      splashScene.style.transform=`scale(${cam}) translateY(${lerp(0,-2.5,e)}%)`;
      splashScene.style.filter=`saturate(${lerp(1.12,1.18,p)}) blur(${lerp(0,2.3,e)}px)`;
      waterVeil.style.opacity=String(lerp(0,M.immersion.veilOpacity,e));
      waterVeil.style.transform=`scale(${lerp(.84,1.12,e)})`;
      if(p>=M.immersion.handoffAt) app.style.opacity=String(clamp((p-M.immersion.handoffAt)/(1-M.immersion.handoffAt),0,1));
      if(p>=1){completeSplash();return}
    }
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
  setTimeout(()=>{if(!splash.classList.contains('hidden'))completeSplash()},flightDuration+M.dive.duration+M.immersion.duration+450);
}
function completeSplash(){
  if(splash.classList.contains('hidden'))return;
  app.classList.remove('hidden');app.style.opacity='1';
  splash.style.transition='opacity 180ms linear';splash.style.opacity='0';splash.style.pointerEvents='none';
  setTimeout(()=>{splash.classList.add('hidden');splash.style='';showAppAfterSplash()},190);
}
function showAppAfterSplash(){
  app.classList.remove('hidden');app.style.opacity='1';
  if(localStorage.getItem('kingfisherTutorialDone')==='1'||localStorage.getItem('kawasemiTutorialDone')==='1'){tutorial.classList.add('hidden');renderAll()}
  else{tutorial.classList.remove('hidden');tutorial.setAttribute('aria-hidden','false');renderAll()}
}
function finishTutorial(){localStorage.setItem('kingfisherTutorialDone','1');tutorial.classList.add('hidden');tutorial.setAttribute('aria-hidden','true');renderAll()}
function bindTutorialCard(){
  const card=$('#tutorialCard');if(!card)return;let g=null;
  card.addEventListener('pointerdown',e=>{g={id:e.pointerId,x:e.clientX,y:e.clientY};card.setPointerCapture?.(e.pointerId);card.style.transition='none'});
  card.addEventListener('pointermove',e=>{if(!g||e.pointerId!==g.id)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;card.style.transform=`translate3d(${dx*.45}px,${dy*.38}px,0) rotate(${dx/80}deg)`});
  const done=()=>{g=null;card.style.transition='transform 260ms cubic-bezier(.2,.72,.18,1)';card.style.transform='';setTimeout(()=>card.style.transition='',270)};
  card.addEventListener('pointerup',done);card.addEventListener('pointercancel',done);
}
function renderAll(){renderDeck();renderSavedArchive();renderMe()}

$$('.action-circle').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.action==='known')handleKnown();if(b.dataset.action==='save')handleSave();if(b.dataset.action==='read')handleRead()}));
$$('.feed-nav-btn').forEach(b=>b.addEventListener('click',()=>switchFeed(b.dataset.feed)));
$$('[data-screen-target]').forEach(b=>b.addEventListener('click',()=>switchScreen(b.dataset.screenTarget)));
$$('.archive-switch button').forEach(b=>b.addEventListener('click',()=>{state.archiveMode=b.dataset.archive;renderSavedArchive()}));
$$('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>{state.themeChoice=b.dataset.themeChoice;localStorage.setItem('kingfisherTheme',state.themeChoice);applyTheme()}));
$('#interestForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#interestInput'),v=input.value.trim();if(!v)return;if(!state.interests.some(x=>String(x).toLowerCase()===v.toLowerCase()))state.interests.push(v);input.value='';persist();renderMe();renderDeck()});
$('#detailLike').addEventListener('click',toggleLike);$('#detailBookmark').addEventListener('click',toggleDetailSave);$('#undoBtn').addEventListener('click',undo);$('#tutorialDone').addEventListener('click',finishTutorial);$('#homeButton').addEventListener('click',goHome);

applyTheme();bindSplash();bindDetailGesture();bindTutorialCard();
if(matchMedia('(prefers-reduced-motion: reduce)').matches){setTimeout(()=>{if(!state.splashComplete){state.splashComplete=true;completeSplash()}},300)}
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));