(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  // Clearer one-screen tutorial.
  const tutorial=$('#tutorial');
  if(tutorial){
    tutorial.innerHTML=`
      <div class="tutorial-v2">
        <div class="tutorial-mini-card"><span>KAWASEMI</span><strong>一枚ずつ、世界へ。</strong></div>
        <div class="tutorial-gesture tg-left"><b>←</b><span>知ってる</span></div>
        <div class="tutorial-gesture tg-up"><b>↑</b><span>あとで読む</span></div>
        <div class="tutorial-gesture tg-right"><span>記事を読む</span><b>→</b></div>
        <button id="tutorialDoneV2" class="tutorial-start">はじめる</button>
      </div>`;
    $('#tutorialDoneV2')?.addEventListener('click',finishTutorial);
  }

  // The three feeds are the frequent action: make them the persistent bottom control.
  const oldNav=$('.bottom-nav');
  if(oldNav){
    oldNav.innerHTML=`
      <button class="feed-nav active" data-feed-v2="forYou"><span>FOR YOU</span></button>
      <button class="feed-nav" data-feed-v2="hot"><span>HOT</span><i></i></button>
      <button class="feed-nav" data-feed-v2="must"><span>MUST</span></button>`;
    $$('.feed-nav').forEach(b=>b.addEventListener('click',()=>{
      switchScreen('cardsScreen');
      switchFeed(b.dataset.feedV2);
      $$('.feed-nav').forEach(x=>x.classList.toggle('active',x===b));
    }));
  }
  $('.feed-tabs')?.classList.add('feed-tabs-hidden');

  // Less-frequent utilities live quietly in the header.
  const topbar=$('.topbar');
  if(topbar){
    const tools=document.createElement('div'); tools.className='top-tools';
    tools.innerHTML=`<button class="top-tool" data-go="savedScreen" aria-label="保存した記事"><svg viewBox="0 0 24 24"><path d="M7 3h10v18l-5-3.5L7 21z"/></svg></button><button class="top-tool" data-go="meScreen" aria-label="設定"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg></button>`;
    topbar.appendChild(tools);
    $$('.top-tool',tools).forEach(b=>b.addEventListener('click',()=>switchScreen(b.dataset.go)));
  }

  // Logo and wordmark always return home.
  ['.brand-mark','.brand-word'].forEach(sel=>{
    const el=$(sel); if(!el)return; el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    const home=()=>{switchScreen('cardsScreen');switchFeed('forYou');$$('.feed-nav').forEach(x=>x.classList.toggle('active',x.dataset.feedV2==='forYou'));};
    el.addEventListener('click',home);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')home()});
  });

  // Every article must start at its beginning, regardless of the previous article scroll position.
  const detail=$('#detail'), detailScroll=$('.detail-scroll',detail);
  const detailObserver=new MutationObserver(()=>{
    if(detail.classList.contains('open')){detailScroll.scrollTop=0;requestAnimationFrame(()=>detailScroll.scrollTo({top:0,left:0,behavior:'instant'}));}
  });
  detailObserver.observe(detail,{attributes:true,attributeFilter:['class']});

  // Turn long copy into visible editorial sections.
  const articleBox=$('#detailArticle');
  const copyObserver=new MutationObserver(()=>{
    const ps=$$('p',articleBox); const labels=['何が起きている？','なぜ重要？','背景','これから'];
    ps.forEach((p,i)=>{
      if(p.previousElementSibling?.classList.contains('article-section-label'))return;
      const h=document.createElement('h2');h.className='article-section-label';h.textContent=labels[i]||'ポイント';p.before(h);
    });
    if(!$('.detail-return-cue',$('.detail-body'))){
      const cue=document.createElement('div');cue.className='detail-return-cue';cue.innerHTML='<b>←</b><span>左へスワイプしてカードへ戻る</span>';
      $('#detailSource')?.after(cue);
    }
  });
  articleObserverTarget=articleBox;
  copyObserver.observe(articleBox,{childList:true});

  // Explicit left-swipe return at article level. Capture phase prevents the old right-swipe helper from competing.
  let backTouch=null;
  detailScroll.addEventListener('touchstart',e=>{const t=e.touches[0];backTouch={x:t.clientX,y:t.clientY,axis:null};},{capture:true,passive:true});
  detailScroll.addEventListener('touchmove',e=>{
    if(!backTouch||!detail.classList.contains('open'))return;
    const t=e.touches[0],dx=t.clientX-backTouch.x,dy=t.clientY-backTouch.y;
    if(!backTouch.axis&&(Math.abs(dx)>9||Math.abs(dy)>9))backTouch.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
    if(backTouch.axis==='x'&&dx<0){detail.classList.add('dragging');detail.style.setProperty('transform',`translateX(${dx}px) scale(${1-Math.min(.025,Math.abs(dx)/7000)})`,'important');}
  },{capture:true,passive:true});
  detailScroll.addEventListener('touchend',e=>{
    if(!backTouch)return;const t=e.changedTouches[0],dx=t.clientX-backTouch.x,axis=backTouch.axis;backTouch=null;
    detail.style.removeProperty('transform');detail.classList.remove('dragging');
    if(axis==='x'&&dx<-78)closeDetail(false);
  },{capture:true,passive:true});

  // Splash: a short deliberate flick is enough; after release the bird keeps flying by itself.
  let splashStartY=null;
  const splash=$('#splash');
  splash?.addEventListener('touchstart',e=>{splashStartY=e.touches[0].clientY},{capture:true,passive:true});
  splash?.addEventListener('touchend',e=>{
    if(splashStartY==null)return;const dy=e.changedTouches[0].clientY-splashStartY;splashStartY=null;
    if(dy<-45&&!splash.classList.contains('launched'))enterSplash();
  },{capture:true,passive:true});

  // Never show a broken/empty news image. Fallback is clearly an abstract topic visual, not a fake event photo.
  function installImageFallback(root=document){
    $$('img',root).forEach(img=>{
      if(img.dataset.fallbackBound)return;img.dataset.fallbackBound='1';
      img.addEventListener('error',()=>{
        const host=img.parentElement;if(!host)return;
        const article=img.closest('[data-id]');const id=article?.dataset.id||state.detailArticle?.id;
        const a=id?articleById(id):state.detailArticle;
        host.innerHTML=`<div class="topic-fallback"><i></i><i></i><i></i><span>${(a?.tags?.[0]||'WORLD').toUpperCase()}</span></div>`;
      },{once:true});
    });
  }
  new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType===1)installImageFallback(n)}))).observe(document.body,{childList:true,subtree:true});
  installImageFallback();

  // Keep bottom feed state visually synchronized when another UI path changes the feed.
  document.addEventListener('click',()=>requestAnimationFrame(()=>$$('.feed-nav').forEach(x=>x.classList.toggle('active',x.dataset.feedV2===state.feed))));
})();