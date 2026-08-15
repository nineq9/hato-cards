(()=>{
  let tries=0;
  const boot=()=>{
    const app=window.__HATO_BRIDGE__;
    if((!app||!Array.isArray(app.articles))&&tries++<100){setTimeout(boot,50);return;}
    if(!app||!Array.isArray(app.articles)||window.__HATO_BRAND_V2__)return;
    window.__HATO_BRAND_V2__=true;

    const BRAND={logo:'./assets/hato-logo-hq.webp?v=1',heart:'./assets/hato-heart-hq.webp?v=1',sleep:'./assets/hato-sleep-hq.webp?v=2',plain:'./assets/hato-plain-hq.webp?v=1',mail:'./assets/hato-mail-hq.webp?v=1'};
    const PHOTO_POOL=['https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=420&q=55','https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=420&q=55','https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=420&q=55'];
    const DEMO_SOURCES=['Northline News','Europa Signal','Eastern Ledger','Civic Wire','Frontier Report','Continental Desk','Global Current','Metro Journal','Public Record','Worldline Press','Vektor News','Open Desk'];
    const placeholderSource=s=>!s||/^(HATO\s*DEMO|HATO)$/i.test(String(s).trim());
    app.articles.forEach(a=>{if(placeholderSource(a.source))a.source=DEMO_SOURCES[Math.abs(Number(a.id)||0)%DEMO_SOURCES.length];});

    const style=document.createElement('style');
    style.textContent=`
.logo-wrap img{width:112px!important;height:auto!important;max-height:42px!important;object-fit:contain!important;display:block!important;margin:0 auto!important}
.article-inner{padding-left:22px!important;padding-right:22px!important}.article-title{font-size:29px!important;line-height:1.08!important;letter-spacing:-.035em!important;max-width:100%!important;overflow-wrap:anywhere!important}@media(min-width:761px){.article-title{font-size:40px!important}.article-inner{padding-left:28px!important;padding-right:28px!important}}
.completion{display:none!important}body.completion-mode #hatoFixedControls{opacity:1!important;pointer-events:auto!important;transform:none!important}.hato-inbox-title.complete .hato-inbox-label{font-size:13px!important;line-height:1!important;font-weight:900!important;letter-spacing:-.025em!important;color:var(--orange)!important}
.hato-progress-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;margin-top:7px!important}.hato-progress-text{display:none!important}.hato-audio-row{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;padding:0!important;margin:0!important}
.hato-audio-btn{width:20px!important;height:20px!important;min-width:0!important;border:0!important;border-radius:0!important;padding:0!important;margin:0!important;background:none!important;display:grid!important;place-items:center!important;color:var(--orange)!important;font-size:15px!important}.hato-audio-btn.long{color:#111!important}.archive-audio-btn{width:20px!important;height:20px!important;border:0!important;background:none!important;color:var(--orange)!important}.archive-audio-btn[data-archive-audio="all"]{color:#111!important}.archive-audio-btn::before{content:'▶︎'!important;font-size:15px!important}
.story-art,.article-hero-art{background:linear-gradient(135deg,#ece9e5,#d9d6d1)!important;overflow:hidden!important}.hato-news-photo{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}.article-hero-art .hato-news-photo{aspect-ratio:16/9!important}
#aboutPage>.about-birds img{width:min(330px,78vw)!important;height:auto!important;object-fit:contain!important}`;
    document.head.appendChild(style);

    const photoFor=a=>PHOTO_POOL[Math.abs(Number(a?.id)||0)%3];
    const makePhoto=a=>{const img=document.createElement('img');img.className='hato-news-photo';img.src=photoFor(a);img.alt=`${a?.category||'NEWS'} — иллюстративное фото`;img.loading='lazy';img.decoding='async';img.fetchPriority='low';img.referrerPolicy='no-referrer';return img;};
    const replaceBrand=()=>{document.querySelectorAll('.logo-wrap img').forEach(img=>{if(!img.src.includes('hato-logo-hq.webp'))img.src=BRAND.logo;});const sleep=document.querySelector('#aboutPage .about-birds img');if(sleep&&!sleep.src.includes('hato-sleep-hq.webp?v=2'))sleep.src=BRAND.sleep;};
    const replaceNewsPhotos=()=>{document.querySelectorAll('#feed article[data-id]').forEach(card=>{const a=app.articles.find(x=>Number(x.id)===Number(card.dataset.id)),art=card.querySelector('.story-art');if(!a||!art)return;const wanted=photoFor(a);const current=art.querySelector('.hato-news-photo');if(!current||current.src!==wanted)art.replaceChildren(makePhoto(a));});const hero=document.querySelector('#articleContent .article-hero-art'),title=document.querySelector('#articleContent .article-title')?.textContent?.trim();if(hero&&title){const a=app.articles.find(x=>x.title?.trim()===title);if(a&&!hero.querySelector('.hato-news-photo'))hero.replaceChildren(makePhoto(a));}};
    const syncAudio=()=>{const short=document.getElementById('hatoAudioShort'),long=document.getElementById('hatoAudioLong');if(short)short.innerHTML='<span>▶︎</span>';if(long)long.innerHTML='<span>▶︎</span>';document.querySelectorAll('.archive-audio-btn').forEach(btn=>btn.textContent='');};
    const sync=()=>{replaceBrand();replaceNewsPhotos();syncAudio();};sync();setTimeout(sync,300);new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.body,{childList:true,subtree:true});
  };boot();
})();