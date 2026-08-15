(()=>{
  let tries=0;
  const boot=()=>{
    const app=window.__HATO_BRIDGE__;
    if((!app||!Array.isArray(app.articles))&&tries++<100){setTimeout(boot,50);return;}
    if(!app||!Array.isArray(app.articles)||window.__HATO_BRAND_V2__)return;
    window.__HATO_BRAND_V2__=true;

    const BRAND={
      logo:'./assets/hato-logo-hq.webp?v=1',
      heart:'./assets/hato-heart-hq.webp?v=1',
      sleep:'./assets/hato-sleep-hq.webp?v=2',
      plain:'./assets/hato-plain-hq.webp?v=1',
      mail:'./assets/hato-mail-hq.webp?v=1'
    };

    const PHOTO_POOL=[
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=84',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=84'
    ];
    const FALLBACK_PHOTO='https://picsum.photos/seed/hato-news/1200/800';

    const DEMO_SOURCES=[
      'Northline News','Europa Signal','Eastern Ledger','Civic Wire',
      'Frontier Report','Continental Desk','Global Current','Metro Journal',
      'Public Record','Worldline Press','Vektor News','Open Desk'
    ];
    const placeholderSource=s=>!s||/^(HATO\s*DEMO|HATO)$/i.test(String(s).trim());
    app.articles.forEach(a=>{
      if(placeholderSource(a.source))a.source=DEMO_SOURCES[Math.abs(Number(a.id)||0)%DEMO_SOURCES.length];
    });

    const style=document.createElement('style');
    style.textContent=`
      .logo-wrap img{width:112px!important;height:auto!important;max-height:42px!important;object-fit:contain!important;display:block!important;margin:0 auto!important}

      .article-inner{padding-left:22px!important;padding-right:22px!important}
      .article-title{font-size:29px!important;line-height:1.08!important;letter-spacing:-.035em!important;max-width:100%!important;overflow-wrap:anywhere!important}
      @media(min-width:761px){.article-title{font-size:40px!important}.article-inner{padding-left:28px!important;padding-right:28px!important}}

      .completion{display:none!important}
      body.completion-mode #hatoFixedControls{opacity:1!important;pointer-events:auto!important;transform:none!important}
      .hato-inbox-title.complete .hato-inbox-label{font-size:13px!important;line-height:1!important;font-weight:900!important;letter-spacing:-.025em!important;color:var(--orange)!important}

      .hato-progress-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:12px!important;margin-top:7px!important}
      .hato-progress-text{display:none!important}
      .hato-audio-row{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:10px!important;padding:0!important;margin:0!important}
      .hato-audio-btn{
        width:30px!important;height:30px!important;border:0!important;border-radius:0!important;
        padding:0!important;margin:0!important;background:transparent!important;clip-path:none!important;
        box-shadow:none!important;display:grid!important;place-items:center!important;overflow:visible!important;
        color:var(--orange)!important;font-size:23px!important;line-height:1!important
      }
      .hato-audio-btn.long{color:#111!important;background:transparent!important}
      .hato-audio-btn span{font-size:23px!important;font-weight:800!important;line-height:1!important;letter-spacing:-.08em!important;transform:none!important}
      .hato-audio-btn:active{transform:scale(.94)}

      .archive-audio-btn{
        width:30px!important;height:30px!important;border:0!important;border-radius:0!important;padding:0!important;
        margin:0 5px 0 0!important;background:transparent!important;clip-path:none!important;box-shadow:none!important;
        display:grid!important;place-items:center!important;overflow:visible!important;font-size:23px!important;
        color:var(--orange)!important;line-height:1!important
      }
      .archive-audio-btn[data-archive-audio="all"]{color:#111!important;background:transparent!important}
      .archive-audio-btn::before{content:'▶︎'!important;display:block!important;font-size:23px!important;line-height:1!important}
      .archive-audio-btn::after{content:none!important;display:none!important}
      .archive-audio-line{align-items:center!important;gap:8px!important}

      #feed .story.hato-wrap-title{
        display:grid!important;grid-template-columns:28px minmax(0,1fr)!important;gap:8px!important;align-items:start!important
      }
      #feed .story.hato-wrap-title .story-main{display:block!important;min-width:0!important}
      #feed .story.hato-wrap-title .story-art{
        float:right!important;width:88px!important;aspect-ratio:1.35/1!important;margin:0 0 8px 10px!important;
        display:block!important;overflow:hidden!important;background:#ececea!important
      }
      #feed .story.hato-wrap-title h2{display:block!important}
      #feed .story.hato-wrap-title h2 .open-article{
        display:inline!important;width:auto!important;text-align:left!important
      }
      #feed .story.hato-wrap-title .meta{clear:both!important}
      @media(min-width:521px){
        #feed .story.hato-wrap-title{grid-template-columns:34px minmax(0,1fr)!important;gap:10px!important}
        #feed .story.hato-wrap-title .story-art{width:96px!important}
      }

      .story-art,.article-hero-art{background:linear-gradient(135deg,#ece9e5,#d9d6d1)!important;overflow:hidden!important}
      .hato-news-photo{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important}
      .article-hero-art .hato-news-photo{aspect-ratio:16/9!important}

      #aboutPage>.about-birds{margin-top:18px!important;padding-top:0!important;padding-bottom:max(38px,env(safe-area-inset-bottom))!important}
      #aboutPage>.about-birds img{width:min(330px,78vw)!important;height:auto!important;object-fit:contain!important}
    `;
    document.head.appendChild(style);

    const photoFor=a=>PHOTO_POOL[Math.abs(Number(a?.id)||0)%PHOTO_POOL.length];
    const attachImageFallback=img=>{
      if(!img||img.dataset.hatoFallbackBound==='1')return;
      img.dataset.hatoFallbackBound='1';
      img.addEventListener('error',()=>{
        if(img.dataset.hatoFallbackTried!=='1'){
          img.dataset.hatoFallbackTried='1';
          img.src=`${FALLBACK_PHOTO}?v=${encodeURIComponent(img.dataset.articleId||'x')}`;
        }else{
          const parent=img.parentElement;
          img.remove();
          if(parent)parent.style.background='linear-gradient(135deg,#ebe7e1 0%,#c9c6c0 52%,#eceae6 100%)';
        }
      });
    };
    const makePhoto=a=>{
      const img=document.createElement('img');
      img.className='hato-news-photo';
      img.src=photoFor(a);
      img.alt=`${a?.category||'NEWS'} — иллюстративное фото`;
      img.loading='lazy';
      img.referrerPolicy='no-referrer';
      img.dataset.articleId=String(a?.id||'');
      attachImageFallback(img);
      return img;
    };

    const replaceBrand=()=>{
      document.querySelectorAll('.logo-wrap img').forEach(img=>{if(!img.src.includes('hato-logo-hq.webp'))img.src=BRAND.logo;});
      const sleep=document.querySelector('#aboutPage .about-birds img');
      if(sleep&&!sleep.src.includes('hato-sleep-hq.webp?v=2'))sleep.src=BRAND.sleep;
      const kiss=document.getElementById('kissBird');
      if(kiss&&!kiss.src.includes('hato-heart-hq.webp'))kiss.src=BRAND.heart;
      const fly=document.getElementById('flyAway');
      if(fly&&!fly.src.includes('hato-plain-hq.webp'))fly.src=BRAND.plain;
      const mail=document.querySelector('.menu-bottom img');
      if(mail&&!mail.src.includes('hato-mail-hq.webp'))mail.src=BRAND.mail;
    };

    const syncStoryLayout=()=>{
      document.querySelectorAll('#feed article[data-id]').forEach(card=>{
        const main=card.querySelector('.story-main');
        const art=card.querySelector('.story-art');
        if(!main||!art)return;
        card.classList.add('hato-wrap-title');
        if(art.parentElement!==main){
          const topline=main.querySelector('.story-topline');
          if(topline)topline.insertAdjacentElement('afterend',art);
          else main.prepend(art);
        }
      });
    };

    const replaceNewsPhotos=()=>{
      document.querySelectorAll('#feed article[data-id]').forEach(card=>{
        const a=app.articles.find(x=>Number(x.id)===Number(card.dataset.id));
        const art=card.querySelector('.story-art');
        if(!a||!art)return;
        const current=art.querySelector('.hato-news-photo');
        if(current){attachImageFallback(current);return;}
        art.replaceChildren(makePhoto(a));
      });
      const hero=document.querySelector('#articleContent .article-hero-art');
      const title=document.querySelector('#articleContent .article-title')?.textContent?.trim();
      if(hero&&title){
        const a=app.articles.find(x=>x.title?.trim()===title);
        if(a){
          const current=hero.querySelector('.hato-news-photo');
          if(current)attachImageFallback(current);
          else hero.replaceChildren(makePhoto(a));
        }
      }
    };

    const syncSources=()=>{
      document.querySelectorAll('#feed article[data-id]').forEach(card=>{
        const a=app.articles.find(x=>Number(x.id)===Number(card.dataset.id));
        const link=card.querySelector('.source-link');
        if(a&&link&&link.textContent!==a.source)link.textContent=a.source;
      });
      const title=document.querySelector('#articleContent .article-title')?.textContent?.trim();
      if(title){
        const a=app.articles.find(x=>x.title?.trim()===title);
        const link=document.querySelector('#articleContent .source-link');
        if(a&&link&&link.textContent!==a.source)link.textContent=a.source;
      }
    };

    const syncAudio=()=>{
      const row=document.querySelector('.hato-progress-row');
      const audio=document.querySelector('.hato-audio-row');
      const old=document.getElementById('hatoProgressText');
      if(old)old.remove();
      if(row&&audio&&audio.parentElement!==row)row.appendChild(audio);
      const short=document.getElementById('hatoAudioShort');
      const long=document.getElementById('hatoAudioLong');
      if(short&&short.dataset.brandV2!=='1'){
        short.dataset.brandV2='1';short.innerHTML='<span aria-hidden="true">▶︎</span>';short.setAttribute('aria-label','Короткая аудиоверсия');
      }
      if(long&&long.dataset.brandV2!=='1'){
        long.dataset.brandV2='1';long.innerHTML='<span aria-hidden="true">▶︎</span>';long.setAttribute('aria-label','Полная аудиоверсия');
      }
      document.querySelectorAll('.archive-audio-btn').forEach(btn=>{
        if(btn.dataset.brandV2==='1')return;
        btn.dataset.brandV2='1';
        btn.textContent='';
        btn.setAttribute('aria-label',btn.dataset.archiveAudio==='all'?'Полная аудиоверсия':'Короткая аудиоверсия');
      });
    };

    const remaining=()=>{
      const title=document.getElementById('hatoInboxTitle');
      if(title?.classList.contains('complete'))return 0;
      const n=Number(document.getElementById('hatoInboxCount')?.textContent||'');
      return Number.isFinite(n)?n:app.articles.length;
    };

    const syncEnd=()=>{
      const lock=document.getElementById('endLock');if(!lock)return;
      const n=remaining();
      if(n<=0){if(lock.style.display!=='none')lock.style.display='none';return;}
      const html=`В сегодняшнем брифе осталось ещё <strong>${n}</strong> материалов.<br>На этом сегодняшние новости закончены.`;
      if(lock.style.display==='none')lock.style.display='block';
      if(lock.className!=='timeline-end-note')lock.className='timeline-end-note';
      if(lock.innerHTML!==html)lock.innerHTML=html;
    };

    const keepCompletionOff=()=>{
      if(document.body.classList.contains('completion-mode'))document.body.classList.remove('completion-mode');
      const completion=document.getElementById('completion');
      if(completion&&completion.style.display!=='none')completion.style.display='none';
    };

    let syncing=false;
    const sync=()=>{
      if(syncing)return;syncing=true;
      replaceBrand();syncAudio();syncStoryLayout();replaceNewsPhotos();syncSources();syncEnd();keepCompletionOff();
      syncing=false;
    };

    const baseRerender=app.rerender;
    app.rerender=()=>{baseRerender?.();requestAnimationFrame(sync);};

    sync();
    try{app.rerender?.();}catch(e){}
    setTimeout(sync,120);setTimeout(sync,500);setTimeout(sync,1200);
    new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.body,{
      childList:true,subtree:true,attributes:true,characterData:true,attributeFilter:['class','src']
    });
  };
  boot();
})();