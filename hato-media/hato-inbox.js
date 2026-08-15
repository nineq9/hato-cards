(()=>{
  let tries=0;
  const boot=()=>{
    const app=window.__HATO_BRIDGE__;
    if((!app||!Array.isArray(app.articles))&&tries++<100){setTimeout(boot,50);return;}
    if(!app||!Array.isArray(app.articles)||window.__HATO_INBOX_V5__)return;
    window.__HATO_INBOX_V5__=true;

    const articles=app.articles;
    const total=articles.length;
    const categories=['UKRAINE','LIFE','REGIONS','WAR','WORLD','TECH','OSINT'].filter(c=>articles.some(a=>a.category===c));
    const valid=new Set(articles.map(a=>Number(a.id)));
    const order=new Map(articles.map((a,i)=>[Number(a.id),i]));
    const key='hato-inbox-dismissed-v5';
    let dismissed=new Set();
    try{
      const raw=localStorage.getItem(key)??localStorage.getItem('hato-inbox-dismissed-v4')??'[]';
      dismissed=new Set(JSON.parse(raw).map(Number).filter(id=>valid.has(id)));
    }catch(e){}
    const save=()=>{try{localStorage.setItem(key,JSON.stringify([...dismissed]));}catch(e){}};

    const css=document.createElement('style');
    css.textContent=`
      .utility{display:none!important}
      #hatoFixedControls{position:sticky;top:58px;z-index:45;background:#fff;border-bottom:1px solid var(--line);transition:opacity .2s ease,transform .2s ease}
      body.completion-mode #hatoFixedControls{opacity:0;pointer-events:none;transform:translateY(-110%)}
      .hato-inbox-panel{padding:10px 16px 8px;background:#fff}
      .hato-inbox-title{display:flex;align-items:baseline;gap:8px;height:25px}
      .hato-inbox-label{font-size:11px;font-weight:900;letter-spacing:.11em}
      .hato-inbox-count{font-size:18px;line-height:1;font-weight:900;color:var(--orange);font-variant-numeric:tabular-nums}
      .hato-progress-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;margin-top:7px}
      .hato-progress-track{height:4px;background:#e7e7e5;overflow:hidden}
      .hato-progress-fill{height:100%;width:100%;background:var(--orange);transition:width .28s cubic-bezier(.2,.75,.25,1)}
      .hato-progress-text{min-width:45px;text-align:right;font-size:10px;line-height:1;font-weight:850;color:#555;font-variant-numeric:tabular-nums;white-space:nowrap}
      .hato-progress-text.complete{color:var(--orange);letter-spacing:.05em}
      .hato-audio-row{display:flex;justify-content:center;align-items:center;gap:13px;padding:9px 0 1px}
      .hato-audio-btn{position:relative;width:31px;height:31px;border:1px solid #bdbdbd;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--orange)}
      .hato-audio-btn::before{content:'▶';font-size:9px;line-height:1;margin-left:2px}
      .hato-audio-btn.long::after{content:'';position:absolute;inset:3px;border:1px solid #bdbdbd;border-radius:50%;pointer-events:none}
      #hatoFixedControls .category-selector{position:relative!important;top:auto!important;z-index:4;border-top:1px solid #f0f0ee}
      #hatoFixedControls .search-panel{position:relative!important;top:auto!important;z-index:3}
      .cat-btn[data-cat="TOP"]{display:none!important}
      #feed .timeline-chapter:first-child{margin-top:0!important}
      #feed .timeline-chapter article.story:last-child{border-bottom:0!important}
      #feed article[data-id]{position:relative;z-index:2;background:#fff;will-change:transform}
      #feed article.hato-swiping{transition:none!important;z-index:3}
      #feed article.hato-dismiss-out{transition:transform .22s cubic-bezier(.2,.75,.25,1),opacity .18s ease!important;pointer-events:none}
      #feed .timeline-chapter.hato-empty-chapter{display:none}
      .hato-swipe-reveal{position:fixed;background:var(--orange);z-index:1;pointer-events:none;display:flex;align-items:center;justify-content:flex-end;padding-right:22px;overflow:hidden}
      .hato-detail-reveal{position:fixed;inset:0;background:var(--orange);z-index:119;pointer-events:none;display:flex;align-items:center;justify-content:flex-end;padding-right:28px}
      .hato-swipe-reveal span,.hato-detail-reveal span{color:#fff;font-size:27px;line-height:1;font-weight:900;transform:scale(.92);transition:transform .12s ease}
      .hato-swipe-reveal.ready span,.hato-detail-reveal.ready span{transform:scale(1.12)}
      .hato-undo{position:fixed;left:16px;right:16px;bottom:calc(18px + var(--safe-bottom));z-index:220;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#111;color:#fff;border-radius:12px;padding:12px 14px;box-shadow:0 8px 28px rgba(0,0,0,.22);opacity:0;transform:translateY(18px);pointer-events:none;transition:.18s ease}
      .hato-undo.show{opacity:1;transform:translateY(0);pointer-events:auto}.hato-undo span{font-size:16px;font-weight:900}.hato-undo button{color:#fff;font-size:11px;font-weight:900;border-bottom:1px solid rgba(255,255,255,.75);padding:4px 0;letter-spacing:.05em}
    `;
    document.head.appendChild(css);

    const totalFor=cat=>articles.filter(a=>a.category===cat).length;
    const remainingFor=cat=>articles.filter(a=>a.category===cat&&!dismissed.has(Number(a.id))).length;
    const remainingTotal=()=>Math.max(0,total-dismissed.size);

    const ensureControls=()=>{
      if(document.getElementById('hatoFixedControls'))return;
      const selector=document.getElementById('categorySelector');if(!selector)return;
      const search=document.getElementById('searchPanel');
      const fixed=document.createElement('div');fixed.id='hatoFixedControls';
      fixed.innerHTML=`<div class="hato-inbox-panel"><div class="hato-inbox-title"><span class="hato-inbox-label">INBOX</span><strong id="hatoInboxCount" class="hato-inbox-count">${total}</strong></div><div class="hato-progress-row"><div class="hato-progress-track"><div id="hatoProgressFill" class="hato-progress-fill"></div></div><span id="hatoProgressText" class="hato-progress-text">${total} / ${total}</span></div><div class="hato-audio-row"><button id="hatoAudioShort" class="hato-audio-btn" type="button" aria-label="12 min"></button><button id="hatoAudioLong" class="hato-audio-btn long" type="button" aria-label="25 min"></button></div></div>`;
      selector.parentNode.insertBefore(fixed,selector);fixed.appendChild(selector);if(search)fixed.appendChild(search);
      document.getElementById('hatoAudioShort')?.addEventListener('click',()=>document.querySelector('.audio-option[data-mode="digest"]')?.click());
      document.getElementById('hatoAudioLong')?.addEventListener('click',()=>document.querySelector('.audio-option[data-mode="all"]')?.click());
    };

    const currentCat=()=>{
      const threshold=58+(document.getElementById('hatoFixedControls')?.offsetHeight||0)+8;
      let result=categories[0]||null;
      categories.forEach(cat=>{const s=document.getElementById(`chapter-${cat}`);if(s&&s.getBoundingClientRect().top<=threshold)result=cat;});
      return result;
    };

    const setText=(el,text)=>{if(el&&el.textContent!==text)el.textContent=text;};
    const updateCounts=()=>{
      ensureControls();
      const remain=remainingTotal();
      setText(document.getElementById('hatoInboxCount'),String(remain));
      const fill=document.getElementById('hatoProgressFill');if(fill)fill.style.width=`${total?remain/total*100:0}%`;
      const p=document.getElementById('hatoProgressText');if(p){setText(p,remain===0?'COMPLETE!!':`${remain} / ${total}`);p.classList.toggle('complete',remain===0);}
      document.querySelectorAll('.cat-btn[data-cat]').forEach(btn=>{
        const cat=btn.dataset.cat;if(cat==='TOP')return;
        let s=btn.querySelector('.cat-status');if(!s){s=document.createElement('span');s.className='cat-status';btn.appendChild(s);}
        setText(s,`${remainingFor(cat)} / ${totalFor(cat)}`);
      });
      categories.forEach(cat=>{
        const sec=document.getElementById(`chapter-${cat}`);if(!sec)return;
        setText(sec.querySelector('.chapter-count'),`${remainingFor(cat)} / ${totalFor(cat)}`);
        sec.classList.toggle('chapter-done',remainingFor(cat)===0);
      });
      const cat=currentCat();if(cat){
        const btn=document.querySelector(`.cat-btn[data-cat="${cat}"]`),label=btn?.querySelector('.cat-label')?.textContent?.trim()||cat;
        setText(document.getElementById('categoryCurrent'),label);setText(document.getElementById('categoryCurrentStatus'),`${remainingFor(cat)} / ${totalFor(cat)}`);
        document.querySelectorAll('.cat-btn[data-cat]').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));
      }
    };

    const makeStory=(lead,a)=>{
      const visual=lead.querySelector('.lead-art')?.innerHTML||'';
      const n=document.createElement('article');n.className=`story ${lead.classList.contains('read')?'read':''}`;n.dataset.id=String(a.id);
      n.innerHTML=`<div class="story-num">01</div><div class="story-main"><div class="story-topline"><span class="story-cat">${a.category}</span><span class="read-check">✓ READ</span></div><h2><button class="open-article" data-id="${a.id}">${app.escape(a.title)}</button></h2><p>${app.escape(a.summary)}</p><div class="meta"><a class="source-link" href="#" onclick="return false">${app.escape(a.source)}</a><span>${app.escape(a.time)}</span></div></div><button class="open-article story-art" data-id="${a.id}" aria-label="Open">${visual}</button>`;
      n.querySelectorAll('.open-article').forEach(b=>b.addEventListener('click',()=>app.openArticle(a.id)));return n;
    };

    let normalizing=false;
    const normalize=()=>{
      if(normalizing)return;normalizing=true;
      const feed=document.getElementById('feed');
      if(feed){
        const top=feed.querySelector('#chapter-TOP');
        if(top){
          [...top.querySelectorAll('article[data-id]')].forEach(old=>{
            const id=Number(old.dataset.id),a=articles.find(x=>Number(x.id)===id),target=a&&feed.querySelector(`#chapter-${a.category}`);if(!a||!target)return;
            target.appendChild(old.classList.contains('lead')?makeStory(old,a):old);
          });
          top.remove();
        }
        categories.forEach(cat=>{
          const sec=feed.querySelector(`#chapter-${cat}`);if(!sec)return;
          const cards=[...sec.children].filter(el=>el.matches?.('article[data-id]')).sort((a,b)=>(order.get(Number(a.dataset.id))??0)-(order.get(Number(b.dataset.id))??0));
          let shown=0;cards.forEach(card=>{const id=Number(card.dataset.id);if(dismissed.has(id)){card.remove();return;}shown++;setText(card.querySelector('.story-num'),String(shown).padStart(2,'0'));sec.appendChild(card);});
          sec.classList.toggle('hato-empty-chapter',shown===0);
        });
        if(!feed.querySelector('.timeline-chapter'))feed.querySelectorAll('article[data-id]').forEach(c=>{if(dismissed.has(Number(c.dataset.id)))c.remove();});
      }
      updateCounts();normalizing=false;
    };

    const baseRerender=app.rerender;
    app.rerender=()=>{baseRerender?.();setTimeout(normalize,0);};
    document.addEventListener('click',e=>{if(e.target.closest?.('.open-article,.cat-btn'))setTimeout(normalize,0);},true);
    document.getElementById('searchInput')?.addEventListener('input',()=>setTimeout(normalize,0));
    window.addEventListener('scroll',()=>requestAnimationFrame(updateCounts),{passive:true});

    let undo=document.getElementById('hatoUndo');if(!undo){undo=document.createElement('div');undo.id='hatoUndo';undo.className='hato-undo';undo.innerHTML='<span>✓</span><button type="button">UNDO</button>';document.body.appendChild(undo);}
    let last=null,timer=0;
    const showUndo=id=>{last=id;undo.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>{undo.classList.remove('show');last=null;},4200);};
    const dismissId=id=>{id=Number(id);if(!valid.has(id)||dismissed.has(id))return false;dismissed.add(id);save();showUndo(id);updateCounts();return true;};
    const restore=id=>{dismissed.delete(Number(id));save();app.rerender();};
    undo.querySelector('button').addEventListener('click',()=>{if(last!==null)restore(last);undo.classList.remove('show');last=null;clearTimeout(timer);});

    let reveal=null;
    const clearReveal=()=>{reveal?.remove();reveal=null;};
    const showReveal=card=>{clearReveal();const r=card.getBoundingClientRect();reveal=document.createElement('div');reveal.className='hato-swipe-reveal';reveal.innerHTML='<span>✓</span>';Object.assign(reveal.style,{left:`${r.left}px`,top:`${r.top}px`,width:`${r.width}px`,height:`${r.height}px`});document.body.appendChild(reveal);};
    let swipe=null,suppressUntil=0;
    const resetList=()=>{if(!swipe){clearReveal();return;}const card=swipe.card;card.classList.remove('hato-swiping');card.style.transition='transform .16s ease';card.style.transform='translateX(0)';setTimeout(()=>{card.style.transition='';card.style.transform='';clearReveal();},170);swipe=null;};
    document.addEventListener('touchstart',e=>{if(e.touches.length!==1||document.body.classList.contains('article-open'))return;const card=e.target.closest?.('#feed article[data-id]');if(!card)return;const t=e.touches[0];swipe={card,id:Number(card.dataset.id),x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY,locked:false};},{passive:true});
    document.addEventListener('touchmove',e=>{if(!swipe||e.touches.length!==1)return;const t=e.touches[0],dx=t.clientX-swipe.x,dy=t.clientY-swipe.y;swipe.lastX=t.clientX;swipe.lastY=t.clientY;if(!swipe.locked&&(Math.abs(dx)>8||Math.abs(dy)>8)){if(dx<0&&Math.abs(dx)>Math.abs(dy)*1.12){swipe.locked=true;swipe.card.classList.add('hato-swiping');showReveal(swipe.card);}else{swipe=null;return;}}if(swipe?.locked){e.preventDefault();swipe.card.style.transform=`translateX(${Math.min(0,dx)}px)`;const th=Math.max(72,swipe.card.getBoundingClientRect().width*.22);reveal?.classList.toggle('ready',dx<=-th);suppressUntil=Date.now()+450;}},{passive:false});
    document.addEventListener('touchend',()=>{if(!swipe)return;const s=swipe,dx=s.lastX-s.x,th=Math.max(72,s.card.getBoundingClientRect().width*.22);if(s.locked&&dx<=-th){swipe=null;suppressUntil=Date.now()+500;if(dismissId(s.id)){s.card.classList.remove('hato-swiping');s.card.classList.add('hato-dismiss-out');s.card.style.transform='translateX(-110vw)';s.card.style.opacity='0';setTimeout(()=>{clearReveal();app.rerender();},220);}}else resetList();},{passive:true});
    document.addEventListener('touchcancel',resetList,{passive:true});
    document.addEventListener('click',e=>{if(Date.now()<suppressUntil&&e.target.closest?.('#feed article[data-id]')){e.preventDefault();e.stopPropagation();}},true);

    const articleView=document.getElementById('articleView');
    let articleSwipe=null,detailReveal=null;
    const currentArticleId=()=>{const title=document.getElementById('articleContent')?.querySelector('h1')?.textContent?.trim();const a=articles.find(x=>x.title?.trim()===title);return a?Number(a.id):null;};
    const showDetail=()=>{if(detailReveal)return;detailReveal=document.createElement('div');detailReveal.className='hato-detail-reveal';detailReveal.innerHTML='<span>✓</span>';document.body.appendChild(detailReveal);};
    const clearDetail=()=>{detailReveal?.remove();detailReveal=null;};
    const resetArticle=()=>{if(!articleSwipe||!articleView){clearDetail();return;}articleView.style.transition='transform .16s ease';articleView.style.transform='translateX(0)';setTimeout(()=>{articleView.style.transition='';articleView.style.transform='';clearDetail();},170);articleSwipe=null;};
    document.addEventListener('touchstart',e=>{if(e.touches.length!==1||!document.body.classList.contains('article-open')||!articleView)return;const t=e.touches[0];articleSwipe={x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY,locked:false};},{passive:true});
    document.addEventListener('touchmove',e=>{if(!articleSwipe||e.touches.length!==1)return;const t=e.touches[0],dx=t.clientX-articleSwipe.x,dy=t.clientY-articleSwipe.y;articleSwipe.lastX=t.clientX;articleSwipe.lastY=t.clientY;if(!articleSwipe.locked&&(Math.abs(dx)>8||Math.abs(dy)>8)){if(dx<0&&Math.abs(dx)>Math.abs(dy)*1.12){articleSwipe.locked=true;showDetail();}else{articleSwipe=null;return;}}if(articleSwipe?.locked){e.preventDefault();articleView.style.transition='none';articleView.style.transform=`translateX(${Math.min(0,dx)}px)`;const th=Math.max(72,innerWidth*.22);detailReveal?.classList.toggle('ready',dx<=-th);}},{passive:false});
    document.addEventListener('touchend',()=>{if(!articleSwipe)return;const s=articleSwipe,dx=s.lastX-s.x,th=Math.max(72,innerWidth*.22);if(s.locked&&dx<=-th){articleSwipe=null;const id=currentArticleId();if(id!==null)dismissId(id);articleView.style.transition='transform .22s cubic-bezier(.2,.75,.25,1),opacity .18s ease';articleView.style.transform='translateX(-110vw)';articleView.style.opacity='0';setTimeout(()=>{articleView.style.transition='';articleView.style.transform='';articleView.style.opacity='';clearDetail();document.getElementById('backArticle')?.click();app.rerender();},220);}else resetArticle();},{passive:true});
    document.addEventListener('touchcancel',resetArticle,{passive:true});

    ensureControls();normalize();setTimeout(normalize,350);setTimeout(normalize,1000);
  };
  boot();
})();
