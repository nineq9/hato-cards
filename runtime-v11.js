/* KINGFISHER runtime v11 — one interaction layer */
(() => {
  const $v = (s, r=document) => r.querySelector(s);
  const $$v = (s, r=document) => [...r.querySelectorAll(s)];
  const clampV = (n,a,b) => Math.min(b,Math.max(a,n));
  const detailEl = $v('#detail');
  const detailScrollEl = $v('#detailScroll');
  const tutorialEl = $v('#tutorial');
  const splashEl = $v('#splash');
  const splashBirdEl = $v('#splashBird');
  const splashSceneEl = $v('#splashScene');
  const waterRippleEl = $v('#waterRipple');
  const waterVeilEl = $v('#waterVeil');

  /* ---------- feed truth ---------- */
  function remainingFor(feed){
    let list = articles;
    if(feed === 'hot') list = articles.filter(a=>a.hot);
    if(feed === 'must') list = articles.filter(a=>a.must);
    return list.filter(a=>!state.processed.has(a.id)).length;
  }
  function syncFeedIndicators(){
    $$v('.feed-nav-btn').forEach(btn=>{
      const count = remainingFor(btn.dataset.feed);
      btn.classList.toggle('has-unread',count>0);
      btn.classList.toggle('is-empty',count===0);
      btn.dataset.remaining=String(count);
    });
  }
  const baseRenderDeck = renderDeck;
  renderDeck = function(...args){
    const out=baseRenderDeck.apply(this,args);
    syncFeedIndicators();
    return out;
  };

  /* ---------- richer news detail ---------- */
  const esc = value => String(value ?? '').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  fillDetail = function(a){
    $v('#detailHero').innerHTML=imageMarkup(a);
    attachImageFallback($v('#detailHero'));
    $v('#detailMeta').textContent=`${(a.tags||[]).join(' · ')}${a.source?' · '+displaySource(a.source):''}`;
    $v('#detailTitle').textContent=a.title;
    $v('#detailDek').textContent=a.summary;

    const body=a.body||[];
    const source=displaySource(a.source||'KINGFISHER');
    const demo=/DEMO/i.test(source);
    const overview=[a.summary,body[0]].filter(Boolean);
    const sections=body.slice(1).map((p,i)=>{
      const labels=['何が変わっているか','なぜ重要なのか','背景と次の焦点'];
      return `<section class="news-section"><h2>${labels[i]||'続報で見る点'}</h2><p>${esc(p)}</p></section>`;
    }).join('');
    const hook=a.key?`<aside class="news-hook"><small>読むポイント</small><strong>${esc(a.key)}</strong></aside>`:'';
    const quote=`<figure class="quoted-news"><figcaption>引用ニュース${demo?' · DEMO':''}</figcaption><blockquote>「${esc(a.summary||a.title)}」</blockquote><cite>${esc(source)}</cite></figure>`;
    const watch=a.watch?`<section class="news-section watch-section"><h2>次に見ること</h2><p>${esc(a.watch)}</p></section>`:'';
    $v('#detailArticle').innerHTML=`
      <section class="news-overview"><h2>ニュース概要</h2>${overview.map(p=>`<p>${esc(p)}</p>`).join('')}</section>
      ${hook}
      ${sections}
      ${quote}
      ${watch}
    `;
    $v('#detailSource').textContent=demo?'KINGFISHER DEMO · source connection pending':source;
    $v('#detailLike').classList.toggle('active',state.liked.has(a.id));
    $v('#detailBookmark').classList.toggle('active',state.saved.has(a.id));
  };

  /* ---------- known: no verbal toast ---------- */
  function showUndoOnly(){
    const toast=$v('#undoToast');
    if(!toast)return;
    $v('#undoText').textContent='';
    toast.classList.add('show','icon-only');
    clearTimeout(state.toastTimer);
    state.toastTimer=setTimeout(()=>toast.classList.remove('show','icon-only'),1800);
  }
  handleKnown = function(card=topCard()){
    const a=currentArticle(); if(!a||!card)return;
    snapshot(); state.processed.add(a.id); persist();
    card.style.transition='transform 245ms cubic-bezier(.16,.76,.20,1),opacity 170ms linear';
    card.style.transform='translate3d(-118vw,0,0) rotate(-8deg)';
    card.style.opacity='0';
    showUndoOnly();
    setTimeout(()=>{renderDeck();syncFeedIndicators();},225);
  };

  /* ---------- save: card is pulled into bookmark ---------- */
  handleSave = function(card=topCard()){
    const a=currentArticle(); if(!a||!card)return;
    snapshot(); state.saved.add(a.id); state.processed.add(a.id); persist();
    const target=$v('.save-action');
    const cr=card.getBoundingClientRect();
    const tr=target?.getBoundingClientRect();
    let dx=0,dy=innerHeight*.72;
    if(tr){
      dx=(tr.left+tr.width/2)-(cr.left+cr.width/2);
      dy=(tr.top+tr.height/2)-(cr.top+cr.height/2);
    }
    card.style.transition='transform 330ms cubic-bezier(.18,.78,.18,1),opacity 245ms linear,filter 260ms linear';
    card.style.transform=`translate3d(${dx}px,${dy}px,0) scale(.055)`;
    card.style.filter='blur(.4px)';
    card.style.opacity='.10';
    target?.classList.add('receive');
    showToast('保存しました');
    setTimeout(()=>{
      target?.classList.remove('receive');
      renderDeck();renderSavedArchive();syncFeedIndicators();
    },315);
  };

  /* ---------- detail -> cards: latest spec = RIGHT swipe ---------- */
  function closeDetailRight(){
    if(!state.detailArticle)return;
    detailEl.classList.remove('dragging');
    detailEl.style.transition='transform 250ms cubic-bezier(.16,.76,.20,1),opacity 185ms linear';
    detailEl.style.transform='translate3d(104vw,0,0) scale(.992)';
    detailEl.style.opacity='.16';
    setTimeout(()=>{
      detailEl.style.transition='';
      finishDetailClose();
      syncFeedIndicators();
    },250);
  }
  if(detailScrollEl){
    let g=null;
    detailScrollEl.addEventListener('pointerdown',e=>{
      if(!detailEl.classList.contains('open'))return;
      if(e.button!==undefined&&e.button!==0)return;
      e.stopImmediatePropagation();
      g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null};
    },true);
    detailScrollEl.addEventListener('pointermove',e=>{
      if(!g||e.pointerId!==g.id)return;
      e.stopImmediatePropagation();
      const dx=e.clientX-g.x,dy=e.clientY-g.y;
      if(!g.axis&&Math.hypot(dx,dy)>7){
        if(Math.abs(dx)>Math.abs(dy)*1.08)g.axis='x';
        else if(Math.abs(dy)>Math.abs(dx)*1.08)g.axis='y';
      }
      if(g.axis!=='x'||dx<=0)return;
      e.preventDefault();
      const now=performance.now(),dt=Math.max(8,now-g.lastT);
      const iv=(e.clientX-g.lastX)/dt;
      g.vx=g.vx*.42+iv*.58;g.lastX=e.clientX;g.lastT=now;
      const x=dx*.93;
      const progress=clampV(dx/Math.min(190,innerWidth*.48),0,1);
      detailEl.classList.add('dragging');
      detailEl.style.transform=`translate3d(${x}px,0,0) scale(${1-progress*.007})`;
      detailEl.style.opacity=String(1-progress*.11);
    },{capture:true,passive:false});
    detailScrollEl.addEventListener('pointerup',e=>{
      if(!g||e.pointerId!==g.id)return;
      e.stopImmediatePropagation();
      const dx=e.clientX-g.x,axis=g.axis,vx=g.vx;g=null;
      if(axis==='x'&&(dx>=42||vx>=.27)){closeDetailRight();return;}
      detailEl.classList.remove('dragging');
      detailEl.style.transition='transform 170ms cubic-bezier(.2,.72,.18,1),opacity 150ms linear';
      detailEl.style.transform='';detailEl.style.opacity='1';
      setTimeout(()=>detailEl.style.transition='',180);
    },true);
    detailScrollEl.addEventListener('pointercancel',e=>{
      if(!g||e.pointerId!==g.id)return;
      e.stopImmediatePropagation();g=null;
      detailEl.classList.remove('dragging');detailEl.style.transform='';detailEl.style.opacity='1';
    },true);
  }
  $v('#detailBackHint')?.addEventListener('click',closeDetailRight);

  /* ---------- tutorial: three gestures must actually work ---------- */
  const tutorialSteps=[
    {dir:'left',eyebrow:'01 / 03',title:'知っている',cue:'←',hint:'左へ'},
    {dir:'right',eyebrow:'02 / 03',title:'もっと読む',cue:'→',hint:'右へ'},
    {dir:'down',eyebrow:'03 / 03',title:'自分に保存',cue:'⌄',hint:'手前へ'}
  ];
  let tutorialStep=0;
  function tutorialMarkup(){
    return `<div class="tutorial-stage-v11">
      <div class="tutorial-wordmark">KINGFISHER</div>
      <div class="tutorial-progress"><i></i><i></i><i></i></div>
      <div id="tutorialPractice" class="tutorial-practice">
        <div class="tutorial-photo-v11"></div><div class="tutorial-shade-v11"></div>
        <div class="tutorial-copy-v11"><small id="tutorialEyebrow"></small><strong id="tutorialTitle"></strong><p>世界の流れを、指で選ぶ。</p></div>
        <span id="tutorialGestureCue" class="tutorial-gesture-cue"></span>
      </div>
      <div id="tutorialHint" class="tutorial-hint-v11"></div>
      <button id="tutorialEnter" class="tutorial-enter hidden" aria-label="KINGFISHERを始める">→</button>
    </div>`;
  }
  function renderTutorialStep(){
    const s=tutorialSteps[tutorialStep];
    if(!s)return;
    $v('#tutorialEyebrow').textContent=s.eyebrow;
    $v('#tutorialTitle').textContent=s.title;
    $v('#tutorialGestureCue').textContent=s.cue;
    $v('#tutorialHint').textContent=s.hint;
    $$v('.tutorial-progress i').forEach((dot,i)=>dot.classList.toggle('done',i<=tutorialStep));
  }
  function completeTutorialStep(card,dx,dy){
    const s=tutorialSteps[tutorialStep];
    const fly=s.dir==='left'?`translate3d(-105vw,${dy*.1}px,0) rotate(-7deg)`:s.dir==='right'?`translate3d(105vw,${dy*.1}px,0) rotate(7deg)`:`translate3d(0,78vh,0) scale(.12)`;
    card.style.transition='transform 280ms cubic-bezier(.16,.76,.20,1),opacity 190ms linear';
    card.style.transform=fly;card.style.opacity='.05';
    setTimeout(()=>{
      tutorialStep++;
      if(tutorialStep>=tutorialSteps.length){
        card.classList.add('tutorial-complete');
        card.style.display='none';
        $v('#tutorialHint').textContent='READY';
        $v('#tutorialEnter').classList.remove('hidden');
        $$v('.tutorial-progress i').forEach(d=>d.classList.add('done'));
        return;
      }
      card.style.transition='none';card.style.transform='translate3d(0,18px,0) scale(.96)';card.style.opacity='0';
      renderTutorialStep();
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        card.style.transition='transform 300ms cubic-bezier(.2,.72,.18,1),opacity 200ms linear';
        card.style.transform='';card.style.opacity='1';
      }));
    },270);
  }
  function installTutorial(){
    if(!tutorialEl)return;
    tutorialEl.innerHTML=tutorialMarkup();
    tutorialStep=0;renderTutorialStep();
    const card=$v('#tutorialPractice');
    let g=null;
    card.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0)return;
      e.stopImmediatePropagation();
      card.setPointerCapture?.(e.pointerId);
      g={id:e.pointerId,x:e.clientX,y:e.clientY,axis:null};
      card.style.transition='none';
    },true);
    card.addEventListener('pointermove',e=>{
      if(!g||e.pointerId!==g.id)return;e.stopImmediatePropagation();
      const dx=e.clientX-g.x,dy=e.clientY-g.y;
      if(!g.axis&&Math.hypot(dx,dy)>7)g.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
      const s=tutorialSteps[tutorialStep];
      let tx=dx*.72,ty=dy*.72;
      if(s.dir==='left')tx=Math.min(4,tx);
      if(s.dir==='right')tx=Math.max(-4,tx);
      if(s.dir==='down')ty=Math.max(-4,ty);
      card.style.transform=`translate3d(${tx}px,${ty}px,0) rotate(${tx/65}deg)`;
    },true);
    card.addEventListener('pointerup',e=>{
      if(!g||e.pointerId!==g.id)return;e.stopImmediatePropagation();
      const dx=e.clientX-g.x,dy=e.clientY-g.y;g=null;
      const s=tutorialSteps[tutorialStep];
      const ok=(s.dir==='left'&&dx<-58)||(s.dir==='right'&&dx>58)||(s.dir==='down'&&dy>58);
      if(ok){completeTutorialStep(card,dx,dy);return;}
      card.style.transition='transform 180ms cubic-bezier(.2,.72,.18,1)';card.style.transform='';
    },true);
    card.addEventListener('pointercancel',()=>{g=null;card.style.transform='';},true);
    $v('#tutorialEnter').addEventListener('click',()=>{
      localStorage.setItem('kingfisherTutorialDone','1');
      tutorialEl.classList.add('hidden');tutorialEl.setAttribute('aria-hidden','true');renderAll();
    });
  }
  installTutorial();

  /* ---------- splash: tap never launches; distance + velocity carry ---------- */
  if(splashEl&&splashBirdEl&&splashSceneEl){
    let g=null,raf=0,currentY=0,targetY=0;
    const M=window.KINGFISHER_MOTION;
    function draw(){
      if(!g){raf=0;return;}
      currentY+=(targetY-currentY)*.18;
      const charge=clampV(g.distance/230,0,1);
      const scale=1-charge*.055;
      splashBirdEl.style.opacity='1';
      splashBirdEl.style.transform=`translate3d(-50%,${currentY}px,0) scale(${scale})`;
      raf=requestAnimationFrame(draw);
    }
    function restore(){
      g=null;if(raf)cancelAnimationFrame(raf);raf=0;
      splashBirdEl.style.transition='transform 210ms cubic-bezier(.2,.72,.18,1)';
      splashBirdEl.style.opacity='1';splashBirdEl.style.transform='translate3d(-50%,0,0) scale(1)';
      setTimeout(()=>splashBirdEl.style.transition='',220);
    }
    function fly(releaseVelocity,startY){
      if(state.splashComplete)return;
      state.splashComplete=true;
      if(raf)cancelAnimationFrame(raf);raf=0;
      $v('.flight-guide',splashEl).style.opacity='0';
      const vh=innerHeight;
      const startCenter=vh-(42+31);
      const waterCenter=vh*.535;
      const travel=waterCenter-startCenter;
      const duration=clampV(900-releaseVelocity*110,690,930);
      const t0=performance.now();
      const initialSpeed=clampV(.16+releaseVelocity*.035,.16,.28);
      const startScale=1-Math.min(.055,Math.abs(startY)/3800);
      function flight(now){
        const t=clampV((now-t0)/duration,0,1);
        const p=initialSpeed*t+(1-initialSpeed)*t*t;
        const scaleP=clampV((p-.12)/.88,0,1);
        const y=startY+(travel*.86-startY)*p;
        const s=startScale+(M.flight.scaleEnd-startScale)*Math.pow(scaleP,1.18);
        splashBirdEl.style.opacity='1';
        splashBirdEl.style.transform=`translate3d(-50%,${y}px,0) scale(${s})`;
        splashSceneEl.style.transform=`scale(${1.035+(M.flight.cameraScale-1.035)*p*.62})`;
        if(t<1){requestAnimationFrame(flight);return;}
        const d0=performance.now();
        function dive(now2){
          const d=clampV((now2-d0)/205,0,1);
          const q=d*d*d;
          const y2=travel*.86+(travel-travel*.86)*q;
          const s2=M.flight.scaleEnd+(M.dive.scaleEnd-M.flight.scaleEnd)*q;
          splashBirdEl.style.transform=`translate3d(-50%,${y2}px,0) scale(${s2})`;
          splashSceneEl.style.transform=`scale(${M.flight.cameraScale+q*.055})`;
          if(d<1){requestAnimationFrame(dive);return;}
          waterRippleEl?.classList.add('impact');
          const i0=performance.now();
          function immerse(now3){
            const t3=clampV((now3-i0)/510,0,1);
            const q3=1-Math.pow(1-t3,4);
            splashBirdEl.style.opacity=String(1-t3);
            splashSceneEl.style.transform=`scale(${M.flight.cameraScale+.055+q3*.40}) translateY(${-q3*2.4}%)`;
            splashSceneEl.style.filter=`saturate(${1.08+t3*.08}) blur(${q3*2}px)`;
            if(waterVeilEl){waterVeilEl.style.opacity=String(q3);waterVeilEl.style.transform=`scale(${.86+q3*.26})`;}
            if(t3>.38){app.classList.remove('hidden');app.style.opacity=String(clampV((t3-.38)/.62,0,1));}
            if(t3<1){requestAnimationFrame(immerse);return;}
            completeSplash();
          }
          requestAnimationFrame(immerse);
        }
        requestAnimationFrame(dive);
      }
      requestAnimationFrame(flight);
    }
    splashEl.addEventListener('pointerdown',e=>{
      if(state.splashComplete)return;
      e.stopImmediatePropagation();
      if(e.button!==undefined&&e.button!==0)return;
      splashEl.setPointerCapture?.(e.pointerId);
      const now=performance.now();
      g={id:e.pointerId,startY:e.clientY,lastY:e.clientY,lastT:now,velocity:0,distance:0};
      currentY=targetY=0;splashBirdEl.style.opacity='1';
      if(!raf)raf=requestAnimationFrame(draw);
    },true);
    splashEl.addEventListener('pointermove',e=>{
      if(!g||e.pointerId!==g.id)return;e.stopImmediatePropagation();
      const now=performance.now(),dt=Math.max(8,now-g.lastT);
      const upward=Math.max(0,g.startY-e.clientY);
      const v=(g.lastY-e.clientY)/dt;
      g.velocity=g.velocity*.62+v*.38;g.lastY=e.clientY;g.lastT=now;g.distance=upward;
      const charge=clampV(upward/230,0,1);
      const follow=.14+charge*.42;
      targetY=-upward*follow;
    },true);
    splashEl.addEventListener('pointerup',e=>{
      if(!g||e.pointerId!==g.id)return;e.stopImmediatePropagation();
      const data=g;g=null;if(raf)cancelAnimationFrame(raf);raf=0;
      const commit=data.distance>=62||(data.distance>=30&&data.velocity>=.72);
      if(!commit){restore();return;}
      fly(data.velocity,currentY);
    },true);
    splashEl.addEventListener('pointercancel',e=>{
      if(!g||e.pointerId!==g.id)return;e.stopImmediatePropagation();restore();
    },true);
  }

  syncFeedIndicators();
})();