(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .lead.read{opacity:.54!important;filter:saturate(.62) brightness(1.05)!important;transition:opacity .22s ease,filter .22s ease}
    #backArticle{left:50%!important;right:auto!important;transform:translateX(-50%)!important}
    html{overscroll-behavior-x:none}
    .overlay{transform:translateX(-12px);transition:transform .22s ease,opacity .22s ease}
    .overlay.open{transform:translateX(0)}

    .hato-inbox-bar{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:11px 16px 10px;border-bottom:1px solid var(--line);background:#fff}
    .hato-inbox-main{display:flex;align-items:baseline;gap:8px;min-width:0}
    .hato-inbox-label{font-size:11px;font-weight:900;letter-spacing:.11em;color:#111}
    .hato-inbox-count{font-size:18px;font-weight:900;letter-spacing:-.03em;color:var(--orange)}
    .hato-inbox-hint{font-size:10px;line-height:1.3;color:#777;text-align:right;white-space:nowrap}

    #feed article.story.read,#feed article.lead.read{position:relative;touch-action:pan-y;will-change:transform}
    #feed article.hato-swiping{z-index:3;transition:none!important;box-shadow:-100vw 0 0 #f1f6f2}
    #feed article.hato-swiping::before{content:'✓  読了';position:absolute;right:calc(100% + 18px);top:50%;transform:translateY(-50%);font-size:12px;font-weight:900;letter-spacing:.04em;color:#25704a;white-space:nowrap}
    #feed article.hato-dismiss-out{transition:transform .24s cubic-bezier(.2,.7,.25,1),opacity .18s ease!important;pointer-events:none}
    #feed .timeline-chapter.hato-empty-chapter{display:none}

    .hato-undo{position:fixed;left:16px;right:16px;bottom:calc(18px + var(--safe-bottom));z-index:220;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#111;color:#fff;border-radius:12px;padding:13px 14px 13px 16px;box-shadow:0 8px 28px rgba(0,0,0,.22);opacity:0;transform:translateY(18px);pointer-events:none;transition:opacity .18s ease,transform .18s ease}
    .hato-undo.show{opacity:1;transform:translateY(0);pointer-events:auto}
    .hato-undo span{font-size:12px;font-weight:700;line-height:1.35}
    .hato-undo button{flex:none;color:#fff;font-size:12px;font-weight:900;border-bottom:1px solid rgba(255,255,255,.75);padding:4px 0}

    .hato-processed{margin:18px 0 26px;border-top:1px solid #111}
    .hato-processed-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:14px 0 8px}
    .hato-processed-head strong{font-size:11px;letter-spacing:.09em}
    .hato-processed-head span{font-size:10px;color:#777}
    .hato-processed-empty{font-size:12px;color:#888;padding:10px 0 17px;border-bottom:1px solid var(--line)}
    .hato-processed-row{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
    .hato-processed-open{text-align:left;min-width:0}
    .hato-processed-open strong{display:block;font-size:13px;line-height:1.35}
    .hato-processed-open span{display:block;font-size:9px;color:#888;margin-top:4px;letter-spacing:.04em}
    .hato-restore{font-size:10px;font-weight:900;color:var(--orange);padding:7px 0;white-space:nowrap}
  `;
  document.head.appendChild(style);

  const kiss=document.getElementById('kissBird');
  const fly=document.getElementById('flyAway');
  const kissSrc='./assets/img2.webp?v=hd2';
  const flySrc='./assets/img3.webp?v=hd2';
  if(kiss){ kiss.src=kissSrc; kiss.dataset.kissSrc=kissSrc; }
  if(fly){ fly.src=flySrc; }

  const makeFeedFingerprint=()=>{
    try{
      const src=ARTICLES.map(a=>`${a.id}:${a.title}`).join('|');
      let hash=2166136261;
      for(let i=0;i<src.length;i++){
        hash^=src.charCodeAt(i);
        hash=Math.imul(hash,16777619);
      }
      return (hash>>>0).toString(36);
    }catch(e){ return 'default'; }
  };
  const DISMISSED_KEY=`hato-inbox-dismissed-v1-${makeFeedFingerprint()}`;
  let dismissedSet=new Set();
  try{
    const valid=new Set(ARTICLES.map(a=>a.id));
    dismissedSet=new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY)||'[]').map(Number).filter(id=>valid.has(id)));
  }catch(e){}

  const saveDismissed=()=>{
    try{ localStorage.setItem(DISMISSED_KEY,JSON.stringify([...dismissedSet])); }catch(e){}
  };

  const ensureInboxUI=()=>{
    if(document.getElementById('hatoInboxBar'))return;
    const category=document.getElementById('categorySelector');
    if(!category)return;
    const bar=document.createElement('div');
    bar.id='hatoInboxBar';
    bar.className='hato-inbox-bar';
    bar.innerHTML=`<div class="hato-inbox-main"><span class="hato-inbox-label">INBOX</span><strong id="hatoInboxCount" class="hato-inbox-count">0</strong></div><span class="hato-inbox-hint">読んだ記事は → スワイプで整理</span>`;
    category.parentNode.insertBefore(bar,category);
  };

  const refreshInboxUI=()=>{
    ensureInboxUI();
    const count=document.getElementById('hatoInboxCount');
    if(count)count.textContent=String(Math.max(0,ARTICLES.length-dismissedSet.size));
  };

  const pruneDismissed=()=>{
    const feed=document.getElementById('feed');
    if(!feed)return;
    feed.querySelectorAll('article[data-id]').forEach(card=>{
      if(dismissedSet.has(Number(card.dataset.id)))card.remove();
    });
    feed.querySelectorAll('.timeline-chapter').forEach(section=>{
      section.classList.toggle('hato-empty-chapter',!section.querySelector('article[data-id]'));
    });
    if(typeof query!=='undefined' && query && !feed.querySelector('article[data-id]')){
      feed.innerHTML='<div class="empty-state">INBOXには該当する記事がありません。</div>';
    }
    refreshInboxUI();
  };

  const ensureUndo=()=>{
    let el=document.getElementById('hatoUndo');
    if(el)return el;
    el=document.createElement('div');
    el.id='hatoUndo';
    el.className='hato-undo';
    el.innerHTML='<span>INBOXから整理しました</span><button type="button">元に戻す</button>';
    document.body.appendChild(el);
    return el;
  };

  let undoTimer=0;
  let lastDismissedId=null;
  const showUndo=id=>{
    const el=ensureUndo();
    lastDismissedId=id;
    el.classList.add('show');
    clearTimeout(undoTimer);
    undoTimer=setTimeout(()=>{
      el.classList.remove('show');
      lastDismissedId=null;
    },4500);
  };

  const renderProcessedArchive=()=>{
    const page=document.getElementById('archivePage');
    if(!page)return;
    let block=document.getElementById('hatoProcessed');
    if(!block){
      block=document.createElement('section');
      block.id='hatoProcessed';
      block.className='hato-processed';
      const results=document.getElementById('archiveResults');
      (results?.parentNode||page).insertBefore(block,results?results.nextSibling:page.firstChild);
    }
    const items=ARTICLES.filter(a=>dismissedSet.has(a.id));
    block.innerHTML=`<div class="hato-processed-head"><strong>TODAY · 処理済み</strong><span>${items.length}件</span></div>${items.length?items.map(a=>`<div class="hato-processed-row"><button class="hato-processed-open" data-id="${a.id}"><strong>${esc(a.title)}</strong><span>${a.category} · ${a.time}</span></button><button class="hato-restore" data-restore-id="${a.id}">INBOXへ戻す</button></div>`).join(''):'<div class="hato-processed-empty">まだ整理した記事はありません。</div>'}`;
  };

  const restoreToInbox=id=>{
    dismissedSet.delete(id);
    saveDismissed();
    if(typeof renderFeed==='function')renderFeed();
    renderProcessedArchive();
    refreshInboxUI();
  };

  const dismissFromInbox=(card,id)=>{
    if(dismissedSet.has(id))return;
    const section=card.closest?.('.timeline-chapter');
    dismissedSet.add(id);
    saveDismissed();
    if(typeof readSet!=='undefined' && !readSet.has(id)){
      readSet.add(id);
      if(typeof saveRead==='function')saveRead();
    }
    if(typeof updateProgress==='function')updateProgress();
    card.classList.remove('hato-swiping');
    card.classList.add('hato-dismiss-out');
    card.style.transform='translateX(calc(100vw + 80px))';
    card.style.opacity='0';
    showUndo(id);
    renderProcessedArchive();
    refreshInboxUI();
    setTimeout(()=>{
      card.remove();
      if(section)section.classList.toggle('hato-empty-chapter',!section.querySelector('article[data-id]'));
    },240);
  };

  if(typeof renderFeed==='function' && !renderFeed.__hatoInboxWrapped){
    const baseRenderFeed=renderFeed;
    const wrapped=function(){
      const result=baseRenderFeed.apply(this,arguments);
      pruneDismissed();
      return result;
    };
    wrapped.__hatoInboxWrapped=true;
    renderFeed=wrapped;
  }

  let swipe=null;
  let suppressClickUntil=0;
  const resetSwipe=animate=>{
    if(!swipe)return;
    const card=swipe.card;
    card.classList.remove('hato-swiping');
    if(animate){
      card.style.transition='transform .18s ease';
      card.style.transform='translateX(0)';
      setTimeout(()=>{card.style.transition='';card.style.transform='';},190);
    }else{
      card.style.transform='';
    }
    swipe=null;
  };

  document.addEventListener('pointerdown',e=>{
    if(e.button!==undefined && e.button!==0)return;
    const card=e.target.closest?.('#feed article.story.read,#feed article.lead.read');
    if(!card || document.body.classList.contains('article-open'))return;
    swipe={card,id:Number(card.dataset.id),startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,locked:false,moved:false,pointerId:e.pointerId};
  },{passive:true});

  document.addEventListener('pointermove',e=>{
    if(!swipe || e.pointerId!==swipe.pointerId)return;
    const dx=e.clientX-swipe.startX,dy=e.clientY-swipe.startY;
    swipe.lastX=e.clientX;swipe.lastY=e.clientY;
    if(!swipe.locked && (Math.abs(dx)>7 || Math.abs(dy)>7)){
      if(dx>0 && Math.abs(dx)>Math.abs(dy)*1.15){
        swipe.locked=true;
        swipe.moved=true;
        swipe.card.classList.add('hato-swiping');
      }else if(Math.abs(dy)>=Math.abs(dx) || dx<0){
        resetSwipe(false);
        return;
      }
    }
    if(!swipe?.locked)return;
    e.preventDefault();
    const resistance=dx>0?dx:dx*.18;
    swipe.card.style.transform=`translateX(${Math.max(0,resistance)}px)`;
    suppressClickUntil=Date.now()+350;
  },{passive:false});

  const finishPointer=e=>{
    if(!swipe || (e.pointerId!==undefined && e.pointerId!==swipe.pointerId))return;
    const active=swipe;
    const dx=active.lastX-active.startX;
    const threshold=Math.max(86,active.card.getBoundingClientRect().width*.28);
    if(active.locked && dx>=threshold){
      swipe=null;
      suppressClickUntil=Date.now()+500;
      dismissFromInbox(active.card,active.id);
    }else{
      resetSwipe(true);
    }
  };
  document.addEventListener('pointerup',finishPointer,{passive:true});
  document.addEventListener('pointercancel',()=>resetSwipe(true),{passive:true});
  document.addEventListener('click',e=>{
    if(Date.now()<suppressClickUntil && e.target.closest?.('#feed article[data-id]')){
      e.preventDefault();e.stopPropagation();
    }
  },true);

  document.addEventListener('click',e=>{
    if(e.target.closest('#hatoUndo button')){
      if(lastDismissedId!==null)restoreToInbox(lastDismissedId);
      ensureUndo().classList.remove('show');
      lastDismissedId=null;
      clearTimeout(undoTimer);
      return;
    }
    const restore=e.target.closest?.('[data-restore-id]');
    if(restore){ restoreToInbox(Number(restore.dataset.restoreId)); return; }
    const open=e.target.closest?.('.hato-processed-open');
    if(open){
      if(typeof showPage==='function')showPage('today');
      setTimeout(()=>{ if(typeof openArticle==='function')openArticle(Number(open.dataset.id)); },40);
    }
  });

  let edge=null;
  const canStart=()=>{
    const menu=document.getElementById('menu');
    const sheet=document.getElementById('audioSheet');
    return !(menu?.classList.contains('open') || document.body.classList.contains('article-open') || sheet?.classList.contains('open'));
  };
  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1 || !canStart()) return;
    if(e.target.closest?.('#feed article[data-id]')) return;
    const t=e.touches[0];
    if(t.clientX>28) return;
    edge={x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY,locked:false};
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!edge || e.touches.length!==1) return;
    const t=e.touches[0],dx=t.clientX-edge.x,dy=t.clientY-edge.y;
    edge.lastX=t.clientX;edge.lastY=t.clientY;
    if(!edge.locked && (Math.abs(dx)>8 || Math.abs(dy)>8)){
      if(dx>0 && Math.abs(dx)>Math.abs(dy)*1.2) edge.locked=true;
      else if(Math.abs(dy)>=Math.abs(dx)) edge=null;
    }
    if(edge?.locked) e.preventDefault();
  },{passive:false});
  document.addEventListener('touchend',()=>{
    if(!edge) return;
    const dx=edge.lastX-edge.x,dy=edge.lastY-edge.y;
    if(edge.locked && dx>72 && Math.abs(dy)<Math.max(54,dx*.7) && typeof openMenu==='function') openMenu();
    edge=null;
  },{passive:true});
  document.addEventListener('touchcancel',()=>{edge=null},{passive:true});

  const setup=()=>{
    ensureInboxUI();
    ensureUndo();
    pruneDismissed();
    renderProcessedArchive();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();