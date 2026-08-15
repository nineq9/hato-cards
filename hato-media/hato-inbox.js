(()=>{
  let attempts=0;
  const boot=()=>{
    const app=window.__HATO_BRIDGE__;
    if((!app||!Array.isArray(app.articles))&&attempts++<80){setTimeout(boot,50);return;}
    if(!app||!Array.isArray(app.articles)){console.error('HATO inbox bridge unavailable');return;}
    if(window.__HATO_INBOX_V4__)return;
    window.__HATO_INBOX_V4__=true;

    const articles=app.articles;
    const css=document.createElement('style');
    css.textContent=`
      .hato-inbox-bar{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:11px 16px 10px;border-bottom:1px solid var(--line);background:#fff}
      .hato-inbox-main{display:flex;align-items:baseline;gap:8px}.hato-inbox-label{font-size:11px;font-weight:900;letter-spacing:.11em}.hato-inbox-count{font-size:18px;font-weight:900;color:var(--orange)}
      .hato-inbox-hint{font-size:10px;color:#777;text-align:right;white-space:nowrap}
      #feed article[data-id]{position:relative;will-change:transform}
      #feed article.hato-swiping{z-index:3;transition:none!important;box-shadow:100vw 0 0 #f7eeee}
      #feed article.hato-swiping::after{content:'捨てる';position:absolute;left:calc(100% + 18px);top:50%;transform:translateY(-50%);font-size:12px;font-weight:900;color:#9b3030;white-space:nowrap}
      #feed article.hato-dismiss-out{transition:transform .22s ease,opacity .18s ease!important;pointer-events:none}
      #feed .timeline-chapter.hato-empty-chapter{display:none}
      .hato-undo{position:fixed;left:16px;right:16px;bottom:calc(18px + var(--safe-bottom));z-index:220;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#111;color:#fff;border-radius:12px;padding:13px 14px 13px 16px;box-shadow:0 8px 28px rgba(0,0,0,.22);opacity:0;transform:translateY(18px);pointer-events:none;transition:.18s ease}
      .hato-undo.show{opacity:1;transform:translateY(0);pointer-events:auto}.hato-undo span{font-size:12px;font-weight:700}.hato-undo button{color:#fff;font-size:12px;font-weight:900;border-bottom:1px solid rgba(255,255,255,.75);padding:4px 0}
    `;
    document.head.appendChild(css);

    const key='hato-inbox-dismissed-v4';
    const valid=new Set(articles.map(a=>Number(a.id)));
    let dismissed=new Set();
    try{dismissed=new Set(JSON.parse(localStorage.getItem(key)||'[]').map(Number).filter(id=>valid.has(id)));}catch(e){}
    const save=()=>{try{localStorage.setItem(key,JSON.stringify([...dismissed]));}catch(e){}};

    const ensureBar=()=>{
      let bar=document.getElementById('hatoInboxBar');
      if(bar)return;
      const anchor=document.getElementById('categorySelector');
      if(!anchor)return;
      bar=document.createElement('div');
      bar.id='hatoInboxBar';bar.className='hato-inbox-bar';
      bar.innerHTML='<div class="hato-inbox-main"><span class="hato-inbox-label">INBOX</span><strong id="hatoInboxCount" class="hato-inbox-count">0</strong></div><span class="hato-inbox-hint">← スワイプで捨てる</span>';
      anchor.parentNode.insertBefore(bar,anchor);
    };
    const updateCount=()=>{ensureBar();const el=document.getElementById('hatoInboxCount');if(el)el.textContent=String(Math.max(0,articles.length-dismissed.size));};
    const prune=()=>{
      const feed=document.getElementById('feed');if(!feed)return;
      feed.querySelectorAll('article[data-id]').forEach(card=>{if(dismissed.has(Number(card.dataset.id)))card.remove();});
      feed.querySelectorAll('.timeline-chapter').forEach(s=>s.classList.toggle('hato-empty-chapter',!s.querySelector('article[data-id]')));
      updateCount();
    };
    const feed=document.getElementById('feed');
    if(feed)new MutationObserver(()=>requestAnimationFrame(prune)).observe(feed,{childList:true,subtree:true});

    let undo=document.getElementById('hatoUndo');
    if(!undo){undo=document.createElement('div');undo.id='hatoUndo';undo.className='hato-undo';undo.innerHTML='<span>INBOXから捨てました</span><button type="button">元に戻す</button>';document.body.appendChild(undo);}
    let last=null,timer=0;
    const showUndo=id=>{last=id;undo.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>{undo.classList.remove('show');last=null;},4500);};
    const dismissId=id=>{id=Number(id);if(dismissed.has(id))return false;dismissed.add(id);save();showUndo(id);updateCount();return true;};
    const restore=id=>{dismissed.delete(Number(id));save();app.rerender?.();requestAnimationFrame(prune);};
    undo.querySelector('button').addEventListener('click',()=>{if(last!==null)restore(last);undo.classList.remove('show');last=null;clearTimeout(timer);});

    let swipe=null,suppressUntil=0;
    const resetList=()=>{if(!swipe)return;const card=swipe.card;card.classList.remove('hato-swiping');card.style.transition='transform .16s ease';card.style.transform='translateX(0)';setTimeout(()=>{card.style.transition='';card.style.transform='';},170);swipe=null;};
    document.addEventListener('touchstart',e=>{
      if(e.touches.length!==1||document.body.classList.contains('article-open'))return;
      const card=e.target.closest?.('#feed article[data-id]');if(!card)return;
      const t=e.touches[0];swipe={card,id:Number(card.dataset.id),x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY,locked:false};
    },{passive:true});
    document.addEventListener('touchmove',e=>{
      if(!swipe||e.touches.length!==1)return;
      const t=e.touches[0],dx=t.clientX-swipe.x,dy=t.clientY-swipe.y;swipe.lastX=t.clientX;swipe.lastY=t.clientY;
      if(!swipe.locked&&(Math.abs(dx)>8||Math.abs(dy)>8)){
        if(dx<0&&Math.abs(dx)>Math.abs(dy)*1.12){swipe.locked=true;swipe.card.classList.add('hato-swiping');}
        else{swipe=null;return;}
      }
      if(swipe?.locked){e.preventDefault();swipe.card.style.transform=`translateX(${Math.min(0,dx)}px)`;suppressUntil=Date.now()+450;}
    },{passive:false});
    document.addEventListener('touchend',()=>{
      if(!swipe)return;
      const s=swipe,dx=s.lastX-s.x,threshold=Math.max(72,s.card.getBoundingClientRect().width*.22);
      if(s.locked&&dx<=-threshold){swipe=null;suppressUntil=Date.now()+500;if(dismissId(s.id)){s.card.classList.remove('hato-swiping');s.card.classList.add('hato-dismiss-out');s.card.style.transform='translateX(-110vw)';s.card.style.opacity='0';setTimeout(()=>{app.rerender?.();requestAnimationFrame(prune);},220);}}
      else resetList();
    },{passive:true});
    document.addEventListener('touchcancel',resetList,{passive:true});
    document.addEventListener('click',e=>{if(Date.now()<suppressUntil&&e.target.closest?.('#feed article[data-id]')){e.preventDefault();e.stopPropagation();}},true);

    let articleSwipe=null;
    const articleView=document.getElementById('articleView');
    const currentArticleId=()=>{
      const title=document.getElementById('articleContent')?.querySelector('h1')?.textContent?.trim();
      const found=articles.find(a=>a.title?.trim()===title);return found?Number(found.id):null;
    };
    const resetArticle=()=>{if(!articleSwipe||!articleView)return;articleView.style.transition='transform .16s ease';articleView.style.transform='translateX(0)';setTimeout(()=>{articleView.style.transition='';articleView.style.transform='';},170);articleSwipe=null;};
    document.addEventListener('touchstart',e=>{
      if(e.touches.length!==1||!document.body.classList.contains('article-open')||!articleView)return;
      const t=e.touches[0];articleSwipe={x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY,locked:false};
    },{passive:true});
    document.addEventListener('touchmove',e=>{
      if(!articleSwipe||e.touches.length!==1)return;
      const t=e.touches[0],dx=t.clientX-articleSwipe.x,dy=t.clientY-articleSwipe.y;articleSwipe.lastX=t.clientX;articleSwipe.lastY=t.clientY;
      if(!articleSwipe.locked&&(Math.abs(dx)>8||Math.abs(dy)>8)){
        if(dx<0&&Math.abs(dx)>Math.abs(dy)*1.12)articleSwipe.locked=true;
        else{articleSwipe=null;return;}
      }
      if(articleSwipe?.locked){e.preventDefault();articleView.style.transition='none';articleView.style.transform=`translateX(${Math.min(0,dx)}px)`;}
    },{passive:false});
    document.addEventListener('touchend',()=>{
      if(!articleSwipe)return;
      const s=articleSwipe,dx=s.lastX-s.x,threshold=Math.max(72,innerWidth*.22);
      if(s.locked&&dx<=-threshold){articleSwipe=null;const id=currentArticleId();if(id!==null)dismissId(id);articleView.style.transition='transform .22s ease,opacity .18s ease';articleView.style.transform='translateX(-110vw)';articleView.style.opacity='0';setTimeout(()=>{articleView.style.transition='';articleView.style.transform='';articleView.style.opacity='';document.getElementById('backArticle')?.click();app.rerender?.();requestAnimationFrame(prune);},220);}
      else resetArticle();
    },{passive:true});
    document.addEventListener('touchcancel',resetArticle,{passive:true});

    ensureBar();updateCount();prune();
  };
  boot();
})();
