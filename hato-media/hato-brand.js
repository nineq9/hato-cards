(()=>{
  let tries=0;
  const boot=()=>{
    const app=window.__HATO_BRIDGE__;
    if((!app||!Array.isArray(app.articles))&&tries++<100){setTimeout(boot,50);return;}
    if(!app||!Array.isArray(app.articles)||window.__HATO_BRAND_V1__)return;
    window.__HATO_BRAND_V1__=true;

    const BRAND={
      logo:'./assets/hato-logo-hq.webp?v=1',
      heart:'./assets/hato-heart-hq.webp?v=1',
      sleep:'./assets/hato-sleep-hq.webp?v=1',
      plain:'./assets/hato-plain-hq.webp?v=1',
      mail:'./assets/hato-mail-hq.webp?v=1'
    };

    const PHOTO={
      UKRAINE:[
        'https://gordonua.com/img/article/16381/83_big-v1670970912.jpg',
        'https://img.mathrubhumi.com/view/acePublic/alias/contentid/1mgvbtgnd7na5gna55w/1/ukraine-russia.webp'
      ],
      WAR:[
        'https://cdn-i.vtcnews.vn/resize/1200x900/upload/2026/02/26/1-07265953.jpg',
        'https://www.tyzden.sk/data/media/articles/6b78c56df1db603cca7afc5ed8b77e2b.jpg'
      ],
      REGIONS:[
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=82'
      ],
      LIFE:[
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=82'
      ],
      WORLD:[
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=82'
      ],
      TECH:[
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=82'
      ],
      OSINT:[
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=82',
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=82'
      ]
    };

    const style=document.createElement('style');
    style.textContent=`
      .logo-wrap img{width:112px!important;height:auto!important;max-height:42px!important;object-fit:contain!important;display:block!important;margin:0 auto!important}

      .article-inner{padding-left:22px!important;padding-right:22px!important}
      .article-title{font-size:29px!important;line-height:1.08!important;letter-spacing:-.035em!important;max-width:100%!important;overflow-wrap:anywhere!important}
      @media(min-width:761px){.article-title{font-size:40px!important}.article-inner{padding-left:28px!important;padding-right:28px!important}}

      .completion{display:none!important}
      body.completion-mode #hatoFixedControls{opacity:1!important;pointer-events:auto!important;transform:none!important}

      .hato-inbox-title.complete .hato-inbox-label{font-size:13px!important;line-height:1!important;font-weight:900!important;letter-spacing:-.018em!important;color:var(--orange)!important}
      .hato-progress-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;margin-top:7px!important}
      .hato-progress-text{display:none!important}
      .hato-audio-row{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;padding:0!important;margin:0!important}
      .hato-audio-btn{position:relative!important;width:38px!important;height:34px!important;border:0!important;border-radius:0!important;padding:0!important;margin:0!important;display:grid!important;place-items:center!important;background:#ffd0b5!important;color:#d94b00!important;clip-path:polygon(0 0,0 100%,100% 50%)!important;overflow:hidden!important;box-shadow:none!important}
      .hato-audio-btn.long{background:var(--orange)!important;color:#fff!important}
      .hato-audio-btn span{font-size:9.5px!important;font-weight:900!important;line-height:1!important;letter-spacing:-.04em!important;transform:translateX(-4px)!important;font-variant-numeric:tabular-nums!important}

      .archive-audio-btn{position:relative!important;width:38px!important;height:34px!important;border:0!important;border-radius:0!important;padding:0!important;margin:0 3px 0 0!important;display:grid!important;place-items:center!important;background:#ffd0b5!important;color:#d94b00!important;clip-path:polygon(0 0,0 100%,100% 50%)!important;overflow:hidden!important;box-shadow:none!important;font-size:0!important}
      .archive-audio-btn[data-archive-audio="all"]{background:var(--orange)!important;color:#fff!important}
      .archive-audio-btn::before{display:none!important;content:none!important}
      .archive-audio-btn::after{content:'12';font-size:9.5px!important;font-weight:900!important;line-height:1!important;letter-spacing:-.04em!important;transform:translateX(-4px)!important}
      .archive-audio-btn[data-archive-audio="all"]::after{content:'25'}
      .archive-audio-line{align-items:center!important;gap:5px!important}

      .story-art,.article-hero-art{background:#ececea!important;overflow:hidden!important}
      .hato-news-photo{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important}
      .article-hero-art .hato-news-photo{aspect-ratio:16/9!important}

      #aboutPage>.about-birds{margin-top:18px!important;padding-top:0!important;padding-bottom:max(38px,env(safe-area-inset-bottom))!important}
      #aboutPage>.about-birds img{width:min(310px,74vw)!important;height:auto!important;object-fit:contain!important}
    `;
    document.head.appendChild(style);

    const photoFor=a=>{
      const list=PHOTO[a?.category]||PHOTO.WORLD;
      return list[Math.abs(Number(a?.id)||0)%list.length];
    };
    const photoHTML=a=>`<img class="hato-news-photo" src="${photoFor(a)}" alt="${String(a?.category||'NEWS').replace(/[&<>\"]/g,'')} — иллюстративное фото" loading="lazy" referrerpolicy="no-referrer">`;

    // Replace the prototype abstract illustrations everywhere with news-style photography.
    window.artSVG=(a)=>photoHTML(a);

    const replaceNewsPhotos=()=>{
      document.querySelectorAll('#feed article[data-id]').forEach(card=>{
        const a=app.articles.find(x=>Number(x.id)===Number(card.dataset.id));
        const art=card.querySelector('.story-art');
        if(a&&art&&!art.querySelector('.hato-news-photo'))art.innerHTML=photoHTML(a);
      });
      const hero=document.querySelector('#articleContent .article-hero-art');
      const title=document.querySelector('#articleContent .article-title')?.textContent?.trim();
      if(hero&&title&&!hero.querySelector('.hato-news-photo')){
        const a=app.articles.find(x=>x.title?.trim()===title);
        if(a)hero.innerHTML=photoHTML(a);
      }
    };

    const replaceBrand=()=>{
      document.querySelectorAll('.logo-wrap img').forEach(img=>{if(!img.src.includes('hato-logo-hq.webp'))img.src=BRAND.logo;});
      const sleep=document.querySelector('#aboutPage .about-birds img');
      if(sleep&&!sleep.src.includes('hato-sleep-hq.webp'))sleep.src=BRAND.sleep;
      const kiss=document.getElementById('kissBird');
      if(kiss&&!kiss.src.includes('hato-heart-hq.webp'))kiss.src=BRAND.heart;
      const fly=document.getElementById('flyAway');
      if(fly&&!fly.src.includes('hato-plain-hq.webp'))fly.src=BRAND.plain;
      const mail=document.querySelector('.menu-bottom img');
      if(mail&&!mail.src.includes('hato-mail-hq.webp'))mail.src=BRAND.mail;
    };

    const syncAudio=()=>{
      const row=document.querySelector('.hato-progress-row');
      const audio=document.querySelector('.hato-audio-row');
      const old=document.getElementById('hatoProgressText');
      if(old)old.remove();
      if(row&&audio&&audio.parentElement!==row)row.appendChild(audio);
      const short=document.getElementById('hatoAudioShort');
      const long=document.getElementById('hatoAudioLong');
      if(short){short.innerHTML='<span>12</span>';short.setAttribute('aria-label','12 минут');}
      if(long){long.innerHTML='<span>25</span>';long.setAttribute('aria-label','25 минут');}
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
      if(n<=0){lock.style.display='none';return;}
      lock.style.display='block';
      lock.className='timeline-end-note';
      lock.innerHTML=`В сегодняшнем брифе осталось ещё <strong>${n}</strong> материалов.<br>На этом сегодняшние новости закончены.`;
    };

    const keepCompletionOff=()=>{
      document.body.classList.remove('completion-mode');
      const completion=document.getElementById('completion');if(completion)completion.style.display='none';
    };

    let syncing=false;
    const sync=()=>{
      if(syncing)return;syncing=true;
      replaceBrand();syncAudio();replaceNewsPhotos();syncEnd();keepCompletionOff();
      syncing=false;
    };

    const baseRerender=app.rerender;
    app.rerender=()=>{baseRerender?.();requestAnimationFrame(sync);};

    sync();
    try{app.rerender?.();}catch(e){}
    setTimeout(sync,120);setTimeout(sync,500);setTimeout(sync,1200);
    new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  };
  boot();
})();
