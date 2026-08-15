(()=>{
  const app=window.__HATO_BRIDGE__;
  if(!app||!Array.isArray(app.articles)){console.error('HATO inbox bridge unavailable');return;}
  const articles=app.articles;
  const css=document.createElement('style');
  css.textContent=`
    .hato-inbox-bar{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:11px 16px 10px;border-bottom:1px solid var(--line);background:#fff}
    .hato-inbox-main{display:flex;align-items:baseline;gap:8px}.hato-inbox-label{font-size:11px;font-weight:900;letter-spacing:.11em}.hato-inbox-count{font-size:18px;font-weight:900;color:var(--orange)}
    .hato-inbox-hint{font-size:10px;color:#777;text-align:right;white-space:nowrap}
    #feed article[data-id]{position:relative;touch-action:pan-y;will-change:transform}
    #feed article.hato-swiping{z-index:3;transition:none!important;box-shadow:100vw 0 0 #f7eeee}
    #feed article.hato-swiping::after{content:'捨てる';position:absolute;left:calc(100% + 18px);top:50%;transform:translateY(-50%);font-size:12px;font-weight:900;color:#9b3030;white-space:nowrap}
    #feed article.hato-dismiss-out{transition:transform .24s cubic-bezier(.2,.7,.25,1),opacity .18s ease!important;pointer-events:none}
    #feed .timeline-chapter.hato-empty-chapter{display:none}
    .hato-undo{position:fixed;left:16px;right:16px;bottom:calc(18px + var(--safe-bottom));z-index:220;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#111;color:#fff;border-radius:12px;padding:13px 14px 13px 16px;box-shadow:0 8px 28px rgba(0,0,0,.22);opacity:0;transform:translateY(18px);pointer-events:none;transition:.18s ease}
    .hato-undo.show{opacity:1;transform:translateY(0);pointer-events:auto}.hato-undo span{font-size:12px;font-weight:700}.hato-undo button{color:#fff;font-size:12px;font-weight:900;border-bottom:1px solid rgba(255,255,255,.75);padding:4px 0}
    .article-view.hato-article-swiping{transition:none!important;will-change:transform}
    .article-view.hato-article-dismiss{transition:transform .24s cubic-bezier(.2,.7,.25,1),opacity .18s ease!important;pointer-events:none}
  `;
  document.head.appendChild(css);

  let hash=2166136261;
  const src=articles.map(a=>`${a.id}:${a.title}`).join('|');
  for(let i=0;i<src.length;i++){hash^=src.charCodeAt(i);hash=Math.imul(hash,16777619);}
  const key=`hato-inbox-dismissed-v3-${(hash>>>0).toString(36)}`;
  const valid=new Set(articles.map(a=>Number(a.id)));
  let dismissed=new Set();
  try{dismissed=new Set(JSON.parse(localStorage.getItem(key)||'[]').map(Number).filter(id=>valid.has(id)));}catch(e){}
  const save=()=>{try{localStorage.setItem(key,JSON.stringify([...dismissed]));}catch(e){}};

  const ensureBar=()=>{
    let bar=document.getElementById('hatoInboxBar');if(bar)return;
    const anchor=document.getElementById('categorySelector');if(!anchor)return;
    bar=document.createElement('div');bar.id='hatoInboxBar';bar.className='hato-inbox-bar';
    bar.innerHTML='<div class="hato-inbox-main"><span class="hato-inbox-label">INBOX</span><strong id="hatoInboxCount" class="hato-inbox-count">0</strong></div><span class="hato-inbox-hint">← スワイプで捨てる</span>';
    anchor.parentNode.insertBefore(bar,anchor);
  };
  const count=()=>{ensureBar();const el=document.getElementById('hatoInboxCount');if(el)el.textContent=String(Math.max(0,articles.length-dismissed.size));};
  const prune=()=>{const feed=document.getElementById('feed');if(!feed)return;feed.querySelectorAll('article[data-id]').forEach(c=>{if(dismissed.has(Number(c.dataset.id)))c.remove();});feed.querySelectorAll('.timeline-chapter').forEach(s=>s.classList.toggle('hato-empty-chapter',!s.querySelector('article[data-id]')));count();};
  let queued=false;const queuePrune=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;prune();});};
  const feed=document.getElementById('feed');if(feed)new MutationObserver(queuePrune).observe(feed,{childList:true,subtree:true});

  let undo=document.getElementById('hatoUndo');if(!undo){undo=document.createElement('div');undo.id='hatoUndo';undo.className='hato-undo';undo.innerHTML='<span>INBOXから捨てました</span><button type="button">元に戻す</button>';document.body.appendChild(undo);}
  let last=null,timer=0;const showUndo=id=>{last=id;undo.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>{undo.classList.remove('show');last=null;},4500);};
  const restore=id=>{dismissed.delete(Number(id));save();app.rerender?.();count();queuePrune();};
  undo.querySelector('button').addEventListener('click',()=>{if(last!==null)restore(last);undo.classList.remove('show');last=null;clearTimeout(timer);});
  const storeDismiss=id=>{id=Number(id);if(dismissed.has(id))return false;dismissed.add(id);save();showUndo(id);count();return true;};
  const dismissCard=(card,id)=>{if(!storeDismiss(id))return;const section=card.closest('.timeline-chapter');card.classList.remove('hato-swiping');card.classList.add('hato-dismiss-out');card.style.transform='translateX(calc(-100vw - 80px))';card.style.opacity='0';setTimeout(()=>{card.remove();if(section)section.classList.toggle('hato-empty-chapter',!section.querySelector('article[data-id]'));},240);};

  let swipe=null,suppressUntil=0;
  const resetCard=animate=>{if(!swipe)return;const c=swipe.card;c.classList.remove('hato-swiping');if(animate){c.style.transition='transform .18s ease';c.style.transform='translateX(0)';setTimeout(()=>{c.style.transition='';c.style.transform='';},190);}else c.style.transform='';swipe=null;};
  document.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;const card=e.target.closest?.('#feed article[data-id]');if(!card||document.body.classList.contains('article-open'))return;swipe={card,id:Number(card.dataset.id),x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,locked:false,pointerId:e.pointerId};},{passive:true});
  document.addEventListener('pointermove',e=>{if(!swipe||e.pointerId!==swipe.pointerId)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe.lastX=e.clientX;swipe.lastY=e.clientY;if(!swipe.locked&&(Math.abs(dx)>7||Math.abs(dy)>7)){if(dx<0&&Math.abs(dx)>Math.abs(dy)*1.15){swipe.locked=true;swipe.card.classList.add('hato-swiping');}else{return resetCard(false);}}if(!swipe?.locked)return;e.preventDefault();swipe.card.style.transform=`translateX(${Math.min(0,dx)}px)`;suppressUntil=Date.now()+350;},{passive:false});
  const finishCard=e=>{if(!swipe||(e.pointerId!==undefined&&e.pointerId!==swipe.pointerId))return;const s=swipe,dx=s.lastX-s.x,threshold=Math.max(86,s.card.getBoundingClientRect().width*.28);if(s.locked&&dx<=-threshold){swipe=null;suppressUntil=Date.now()+500;dismissCard(s.card,s.id);}else resetCard(true);};
  document.addEventListener('pointerup',finishCard,{passive:true});document.addEventListener('pointercancel',()=>resetCard(true),{passive:true});
  document.addEventListener('click',e=>{if(Date.now()<suppressUntil&&e.target.closest?.('#feed article[data-id]')){e.preventDefault();e.stopPropagation();}},true);

  let articleSwipe=null;
  const articleView=document.getElementById('articleView');
  const currentArticleId=()=>{const c=document.getElementById('articleContent');const direct=Number(c?.dataset?.id);if(valid.has(direct))return direct;const title=c?.querySelector('h1')?.textContent?.trim();const found=articles.find(a=>a.title?.trim()===title);return found?Number(found.id):null;};
  const resetArticle=animate=>{if(!articleSwipe||!articleView)return;if(animate){articleView.style.transition='transform .18s ease';articleView.style.transform='translateX(0)';setTimeout(()=>{articleView.style.transition='';articleView.style.transform='';articleView.classList.remove('hato-article-swiping');},190);}else{articleView.style.transform='';articleView.classList.remove('hato-article-swiping');}articleSwipe=null;};
  document.addEventListener('touchstart',e=>{if(e.touches.length!==1||!document.body.classList.contains('article-open')||!articleView)return;const t=e.touches[0];articleSwipe={x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY,locked:false};},{passive:true});
  document.addEventListener('touchmove',e=>{if(!articleSwipe||e.touches.length!==1)return;const t=e.touches[0],dx=t.clientX-articleSwipe.x,dy=t.clientY-articleSwipe.y;articleSwipe.lastX=t.clientX;articleSwipe.lastY=t.clientY;if(!articleSwipe.locked&&(Math.abs(dx)>8||Math.abs(dy)>8)){if(dx<0&&Math.abs(dx)>Math.abs(dy)*1.15){articleSwipe.locked=true;articleView.classList.add('hato-article-swiping');}else{articleSwipe=null;return;}}if(articleSwipe?.locked){e.preventDefault();articleView.style.transform=`translateX(${Math.min(0,dx)}px)`;}},{passive:false});
  document.addEventListener('touchend',()=>{if(!articleSwipe)return;const s=articleSwipe,dx=s.lastX-s.x,threshold=Math.max(90,innerWidth*.25);if(s.locked&&dx<=-threshold){articleSwipe=null;const id=currentArticleId();if(id!==null)storeDismiss(id);articleView.classList.remove('hato-article-swiping');articleView.classList.add('hato-article-dismiss');articleView.style.transform='translateX(-105vw)';articleView.style.opacity='0';setTimeout(()=>{articleView.classList.remove('hato-article-dismiss');articleView.style.transform='';articleView.style.opacity='';app.showPage?.('today');app.rerender?.();queuePrune();},240);}else resetArticle(true);},{passive:true});
  document.addEventListener('touchcancel',()=>resetArticle(true),{passive:true});

  ensureBar();count();prune();
})();
