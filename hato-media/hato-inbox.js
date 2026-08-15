(()=>{
  const app=window.__HATO_BRIDGE__;
  if(!app||!Array.isArray(app.articles)){console.error('HATO inbox bridge unavailable');return;}
  const articles=app.articles;
  const css=document.createElement('style');
  css.textContent=`
    .hato-inbox-bar{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:11px 16px 10px;border-bottom:1px solid var(--line);background:#fff}
    .hato-inbox-main{display:flex;align-items:baseline;gap:8px}.hato-inbox-label{font-size:11px;font-weight:900;letter-spacing:.11em}.hato-inbox-count{font-size:18px;font-weight:900;color:var(--orange)}
    .hato-inbox-hint{font-size:10px;color:#777;text-align:right;white-space:nowrap}
    #feed article.story.read,#feed article.lead.read{position:relative;touch-action:pan-y;will-change:transform}
    #feed article.hato-swiping{z-index:3;transition:none!important;box-shadow:-100vw 0 0 #eef5ef}
    #feed article.hato-swiping::before{content:'✓  読了';position:absolute;right:calc(100% + 18px);top:50%;transform:translateY(-50%);font-size:12px;font-weight:900;color:#25704a;white-space:nowrap}
    #feed article.hato-dismiss-out{transition:transform .24s cubic-bezier(.2,.7,.25,1),opacity .18s ease!important;pointer-events:none}
    #feed .timeline-chapter.hato-empty-chapter{display:none}
    .hato-undo{position:fixed;left:16px;right:16px;bottom:calc(18px + var(--safe-bottom));z-index:220;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#111;color:#fff;border-radius:12px;padding:13px 14px 13px 16px;box-shadow:0 8px 28px rgba(0,0,0,.22);opacity:0;transform:translateY(18px);pointer-events:none;transition:.18s ease}
    .hato-undo.show{opacity:1;transform:translateY(0);pointer-events:auto}.hato-undo span{font-size:12px;font-weight:700}.hato-undo button{color:#fff;font-size:12px;font-weight:900;border-bottom:1px solid rgba(255,255,255,.75);padding:4px 0}
  `;
  document.head.appendChild(css);

  let hash=2166136261;
  const src=articles.map(a=>`${a.id}:${a.title}`).join('|');
  for(let i=0;i<src.length;i++){hash^=src.charCodeAt(i);hash=Math.imul(hash,16777619);}
  const key=`hato-inbox-dismissed-v2-${(hash>>>0).toString(36)}`;
  const valid=new Set(articles.map(a=>Number(a.id)));
  let dismissed=new Set();
  try{dismissed=new Set(JSON.parse(localStorage.getItem(key)||'[]').map(Number).filter(id=>valid.has(id)));}catch(e){}
  const save=()=>{try{localStorage.setItem(key,JSON.stringify([...dismissed]));}catch(e){}};

  const ensureBar=()=>{
    let bar=document.getElementById('hatoInboxBar');
    if(bar)return;
    const anchor=document.getElementById('categorySelector');
    if(!anchor)return;
    bar=document.createElement('div');bar.id='hatoInboxBar';bar.className='hato-inbox-bar';
    bar.innerHTML='<div class="hato-inbox-main"><span class="hato-inbox-label">INBOX</span><strong id="hatoInboxCount" class="hato-inbox-count">0</strong></div><span class="hato-inbox-hint">読んだ記事は → スワイプで整理</span>';
    anchor.parentNode.insertBefore(bar,anchor);
  };
  const count=()=>{ensureBar();const el=document.getElementById('hatoInboxCount');if(el)el.textContent=String(Math.max(0,articles.length-dismissed.size));};
  const prune=()=>{
    const feed=document.getElementById('feed');if(!feed)return;
    feed.querySelectorAll('article[data-id]').forEach(card=>{if(dismissed.has(Number(card.dataset.id)))card.remove();});
    feed.querySelectorAll('.timeline-chapter').forEach(s=>s.classList.toggle('hato-empty-chapter',!s.querySelector('article[data-id]')));
    count();
  };
  let queued=false;
  const queuePrune=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;prune();});};
  const feed=document.getElementById('feed');if(feed)new MutationObserver(queuePrune).observe(feed,{childList:true,subtree:true});

  let undo=document.getElementById('hatoUndo');
  if(!undo){undo=document.createElement('div');undo.id='hatoUndo';undo.className='hato-undo';undo.innerHTML='<span>INBOXから整理しました</span><button type="button">元に戻す</button>';document.body.appendChild(undo);}
  let last=null,timer=0;
  const showUndo=id=>{last=id;undo.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>{undo.classList.remove('show');last=null;},4500);};
  const restore=id=>{dismissed.delete(Number(id));save();app.rerender?.();count();queuePrune();};
  undo.querySelector('button').addEventListener('click',()=>{if(last!==null)restore(last);undo.classList.remove('show');last=null;clearTimeout(timer);});

  const dismiss=(card,id)=>{
    id=Number(id);if(dismissed.has(id))return;
    dismissed.add(id);save();showUndo(id);count();
    const section=card.closest('.timeline-chapter');
    card.classList.remove('hato-swiping');card.classList.add('hato-dismiss-out');card.style.transform='translateX(calc(100vw + 80px))';card.style.opacity='0';
    setTimeout(()=>{card.remove();if(section)section.classList.toggle('hato-empty-chapter',!section.querySelector('article[data-id]'));},240);
  };

  let swipe=null,suppressUntil=0;
  const reset=animate=>{if(!swipe)return;const c=swipe.card;c.classList.remove('hato-swiping');if(animate){c.style.transition='transform .18s ease';c.style.transform='translateX(0)';setTimeout(()=>{c.style.transition='';c.style.transform='';},190);}else c.style.transform='';swipe=null;};
  document.addEventListener('pointerdown',e=>{
    if(e.button!==undefined&&e.button!==0)return;
    const card=e.target.closest?.('#feed article.story.read,#feed article.lead.read');if(!card||document.body.classList.contains('article-open'))return;
    swipe={card,id:Number(card.dataset.id),x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,locked:false,pointerId:e.pointerId};
  },{passive:true});
  document.addEventListener('pointermove',e=>{
    if(!swipe||e.pointerId!==swipe.pointerId)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe.lastX=e.clientX;swipe.lastY=e.clientY;
    if(!swipe.locked&&(Math.abs(dx)>7||Math.abs(dy)>7)){if(dx>0&&Math.abs(dx)>Math.abs(dy)*1.15){swipe.locked=true;swipe.card.classList.add('hato-swiping');}else{return reset(false);}}
    if(!swipe?.locked)return;e.preventDefault();swipe.card.style.transform=`translateX(${Math.max(0,dx)}px)`;suppressUntil=Date.now()+350;
  },{passive:false});
  const finish=e=>{if(!swipe||(e.pointerId!==undefined&&e.pointerId!==swipe.pointerId))return;const s=swipe,dx=s.lastX-s.x,threshold=Math.max(86,s.card.getBoundingClientRect().width*.28);if(s.locked&&dx>=threshold){swipe=null;suppressUntil=Date.now()+500;dismiss(s.card,s.id);}else reset(true);};
  document.addEventListener('pointerup',finish,{passive:true});document.addEventListener('pointercancel',()=>reset(true),{passive:true});
  document.addEventListener('click',e=>{if(Date.now()<suppressUntil&&e.target.closest?.('#feed article[data-id]')){e.preventDefault();e.stopPropagation();}},true);

  ensureBar();count();prune();
})();
