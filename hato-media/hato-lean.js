(()=>{
  if(window.__HATO_LEAN_V1__)return;
  window.__HATO_LEAN_V1__=true;

  const app=window.__HATO_BRIDGE__;
  if(!app||!Array.isArray(app.articles))return;

  const SPEED_KEY='hato-playback-rate-v1';
  const SPEEDS=[0.3,0.5,0.8,1,1.2,1.5,2];
  const IMAGES=['./assets/article-1.svg?v=4','./assets/article-2.svg?v=4','./assets/article-3.svg?v=4'];
  const BRAND={logo:'./assets/hato-logo-hq.webp?v=1',sleep:'./assets/hato-sleep-hq.webp?v=2'};

  const style=document.createElement('style');
  style.id='hatoLeanStyle';
  style.textContent=`
    .logo-wrap img{width:112px!important;height:auto!important;max-height:42px!important;object-fit:contain!important;margin:0 auto!important}
    .completion{display:none!important}
    body.completion-mode #hatoFixedControls{opacity:1!important;pointer-events:auto!important;transform:none!important}

    .feed{padding-left:20px!important;padding-right:20px!important}
    #feed article.story{
      display:grid!important;
      grid-template-columns:26px minmax(0,1fr)!important;
      gap:9px!important;
      width:100%!important;
      margin:0!important;
      padding:16px 0 20px!important;
      border-bottom:1px solid #dedede!important;
    }
    #feed article.story .story-num{
      width:26px!important;
      padding-top:2px!important;
      font-size:12px!important;
      line-height:1.15!important;
      font-weight:850!important;
    }
    #feed article.story .story-main{display:block!important;width:100%!important;min-width:0!important;max-width:none!important;overflow:visible!important}
    #feed article.story .story-topline{margin:0 0 7px!important;min-height:14px!important}
    #feed article.story .story-cat{font-size:10px!important;line-height:1.1!important;letter-spacing:.075em!important;font-weight:850!important}
    #feed article.story h2{
      display:block!important;
      width:100%!important;
      max-width:none!important;
      margin:0!important;
      padding:0!important;
      font-size:17px!important;
      line-height:1.22!important;
      letter-spacing:-.016em!important;
      font-weight:800!important;
      overflow:visible!important;
      overflow-wrap:break-word!important;
      word-break:normal!important;
      hyphens:auto!important;
    }
    #feed article.story h2 .open-article{display:block!important;width:100%!important;margin:0!important;padding:0!important;line-height:inherit!important;text-align:left!important}
    #feed article.story .story-art{
      display:block!important;
      float:none!important;
      clear:both!important;
      width:100%!important;
      height:auto!important;
      aspect-ratio:16/9!important;
      margin:11px 0 9px!important;
      padding:0!important;
      overflow:hidden!important;
      background:#111!important;
      border-radius:4px!important;
      line-height:0!important;
    }
    #feed article.story .story-art img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;margin:0!important}
    #feed article.story p{display:block!important;font-size:13.5px!important;line-height:1.46!important;margin:0 0 10px!important;color:#363636!important}
    #feed article.story .meta{display:flex!important;clear:both!important;margin:0!important;padding:0!important;font-size:10.5px!important;gap:8px!important}
    #feed .timeline-chapter article.story:last-child{border-bottom:0!important}
    #feed .chapter-head{margin-left:0!important;margin-right:0!important}

    .article-inner{padding-left:22px!important;padding-right:22px!important}
    .article-title{font-size:29px!important;line-height:1.08!important;letter-spacing:-.035em!important;max-width:100%!important;overflow-wrap:anywhere!important}
    .article-hero-art{display:block!important;width:100%!important;aspect-ratio:16/9!important;overflow:hidden!important;background:#111!important;border-radius:4px!important;line-height:0!important}
    .article-hero-art img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
    #backArticle{left:50%!important;right:auto!important;transform:translateX(-50%)!important}

    .hato-progress-text{display:none!important}
    .hato-audio-row{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:9px!important;padding:0!important;margin:0!important}
    #hatoAudioShort,#hatoAudioLong,.hato-audio-btn{
      width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;
      padding:0!important;margin:0!important;border:0!important;border-radius:0!important;
      background:transparent!important;box-shadow:none!important;clip-path:none!important;
      display:grid!important;place-items:center!important;overflow:visible!important;color:var(--orange)!important;
    }
    #hatoAudioLong,.hato-audio-btn.long{color:#111!important}
    #hatoAudioShort span,#hatoAudioLong span,.hato-audio-btn span{font-size:14px!important;line-height:1!important;font-weight:800!important;transform:none!important;color:inherit!important}
    .archive-audio-btn{
      width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;
      padding:0!important;margin:0 4px 0 0!important;border:0!important;border-radius:0!important;
      background:transparent!important;box-shadow:none!important;clip-path:none!important;
      display:grid!important;place-items:center!important;overflow:visible!important;font-size:0!important;color:var(--orange)!important;
    }
    .archive-audio-btn[data-archive-audio="all"]{color:#111!important}
    .archive-audio-btn::before{content:'▶︎'!important;display:block!important;font-size:14px!important;line-height:1!important;color:inherit!important}
    .archive-audio-btn::after{content:none!important;display:none!important}

    .hato-speed-control{display:flex;align-items:center;gap:5px;margin-left:auto;margin-right:7px;flex:none}
    .hato-speed-label{font-size:9px;line-height:1;color:#999;font-weight:750;letter-spacing:.055em}
    .hato-speed-select{height:28px;border:1px solid #d0d0cd;border-radius:999px;background:#fff;color:#111;padding:0 7px;font-size:10px;line-height:1;font-weight:800;outline:none}

    @media(min-width:521px){
      .feed{padding-left:24px!important;padding-right:24px!important}
      #feed article.story{grid-template-columns:30px minmax(0,1fr)!important;gap:11px!important;padding-top:18px!important;padding-bottom:22px!important}
      #feed article.story .story-num{width:30px!important;font-size:13px!important}
      #feed article.story h2{font-size:19px!important}
      #feed article.story .story-art{aspect-ratio:2/1!important}
      .article-title{font-size:40px!important}
      .article-inner{padding-left:28px!important;padding-right:28px!important}
    }
  `;
  document.head.appendChild(style);

  const imageFor=id=>IMAGES[Math.abs(Number(id)||0)%IMAGES.length];
  const makeImage=id=>{
    const img=document.createElement('img');
    img.className='hato-news-photo';
    img.src=imageFor(id);
    img.alt='';
    img.loading='lazy';
    img.decoding='async';
    img.width=640;img.height=360;
    try{img.fetchPriority='low';}catch(e){}
    img.addEventListener('error',()=>img.closest('.story-art,.article-hero-art')?.setAttribute('hidden',''),{once:true});
    return img;
  };

  const syncBrand=()=>{
    document.querySelectorAll('.logo-wrap img').forEach(img=>{if(!img.src.includes('hato-logo-hq.webp'))img.src=BRAND.logo;});
    const sleep=document.querySelector('#aboutPage .about-birds img');
    if(sleep&&!sleep.src.includes('hato-sleep-hq.webp'))sleep.src=BRAND.sleep;
  };

  const syncCard=card=>{
    const id=Number(card.dataset.id)||0;
    const main=card.querySelector('.story-main');
    const h2=main?.querySelector('h2');
    let art=card.querySelector(':scope > .story-art')||main?.querySelector('.story-art');
    if(!main||!h2||!art)return;

    const flow=main.querySelector('.story-title-flow');
    if(flow){
      if(h2.parentElement===flow)flow.parentNode.insertBefore(h2,flow);
      if(art.parentElement===flow)flow.parentNode.insertBefore(art,flow.nextSibling);
      flow.remove();
    }
    if(art.parentElement!==main||art.previousElementSibling!==h2)h2.insertAdjacentElement('afterend',art);

    const wanted=new URL(imageFor(id),document.baseURI).href;
    let img=art.querySelector('img');
    if(!img||img.src!==wanted){art.removeAttribute('hidden');art.replaceChildren(makeImage(id));}
    else{
      img.loading='lazy';img.decoding='async';img.width=640;img.height=360;
      try{img.fetchPriority='low';}catch(e){}
    }
  };

  const syncCards=()=>document.querySelectorAll('#feed article.story[data-id]').forEach(syncCard);

  const syncDetail=()=>{
    const hero=document.querySelector('#articleContent .article-hero-art');
    if(!hero)return;
    const title=document.querySelector('#articleContent .article-title')?.textContent?.trim();
    const article=app.articles.find(a=>String(a.title||'').trim()===title);
    if(!article)return;
    const wanted=new URL(imageFor(article.id),document.baseURI).href;
    const img=hero.querySelector('img');
    if(!img||img.src!==wanted){hero.removeAttribute('hidden');hero.replaceChildren(makeImage(article.id));}
  };

  const syncPlayButtons=()=>{
    const short=document.getElementById('hatoAudioShort');
    const long=document.getElementById('hatoAudioLong');
    if(short){short.innerHTML='<span aria-hidden="true">▶︎</span>';short.setAttribute('aria-label','短い音声を再生');}
    if(long){long.innerHTML='<span aria-hidden="true">▶︎</span>';long.setAttribute('aria-label','長い音声を再生');}
    document.querySelectorAll('.archive-audio-btn').forEach(btn=>{btn.textContent='';btn.setAttribute('aria-label',btn.dataset.archiveAudio==='all'?'長い音声を再生':'短い音声を再生');});
  };

  const getRate=()=>{
    const n=Number(localStorage.getItem(SPEED_KEY)||'1');
    return SPEEDS.includes(n)?n:1;
  };

  const applyMediaRate=()=>{
    const rate=getRate();
    document.querySelectorAll('audio,video').forEach(el=>{try{el.defaultPlaybackRate=rate;el.playbackRate=rate;}catch(e){}});
  };

  const patchSpeech=()=>{
    if(!('speechSynthesis' in window)||window.__HATO_LEAN_SPEECH_PATCHED__)return;
    window.__HATO_LEAN_SPEECH_PATCHED__=true;
    const original=speechSynthesis.speak.bind(speechSynthesis);
    speechSynthesis.speak=utterance=>{try{utterance.rate=getRate();}catch(e){}return original(utterance);};
  };

  const syncNewSpeechDuration=()=>{
    try{
      if(typeof speechState==='undefined'||!speechState?.active||speechState.hatoLeanBaseDuration)return;
      const rate=getRate();
      const oldPos=typeof getSpeechPosition==='function'?getSpeechPosition():(Number(speechState.position)||0);
      speechState.hatoLeanBaseDuration=Math.max(.1,Number(speechState.duration)||1);
      speechState.hatoLeanRate=rate;
      speechState.duration=Math.max(.1,speechState.hatoLeanBaseDuration/rate);
      speechState.position=Math.min(oldPos,speechState.duration);
      speechState.startedAt=performance.now()-speechState.position*1000;
      if(typeof updateSpeechUI==='function')updateSpeechUI();
    }catch(e){}
  };

  const restartSpeechAtRate=(oldRate,newRate)=>{
    try{
      if(typeof speechState==='undefined'||!speechState?.active)return;
      const textLen=Math.max(1,speechState.text?.length||1);
      const oldDur=Math.max(.1,Number(speechState.duration)||1);
      const base=speechState.hatoLeanBaseDuration||oldDur*Math.max(.01,oldRate||1);
      const pos=typeof getSpeechPosition==='function'?getSpeechPosition():(Number(speechState.position)||0);
      const byChar=(Number(speechState.charIndex)||0)/textLen;
      const fraction=Math.max(0,Math.min(1,byChar>0?byChar:pos/oldDur));
      speechState.hatoLeanBaseDuration=base;
      speechState.hatoLeanRate=newRate;
      speechState.duration=Math.max(.1,base/newRate);
      speechState.position=Math.min(speechState.duration-.01,fraction*speechState.duration);
      speechState.startedAt=performance.now()-speechState.position*1000;
      if(typeof speakFromPosition==='function')speakFromPosition(Math.max(0,speechState.position),!!speechState.paused);
      if(typeof updateSpeechUI==='function'&&!speechState.paused)updateSpeechUI();
    }catch(e){}
  };

  const setRate=value=>{
    const next=SPEEDS.includes(Number(value))?Number(value):1;
    const old=getRate();
    try{localStorage.setItem(SPEED_KEY,String(next));}catch(e){}
    applyMediaRate();
    if(old!==next)restartSpeechAtRate(old,next);
    const select=document.getElementById('hatoLeanSpeed');if(select)select.value=String(next);
  };

  const ensureSpeedUi=()=>{
    const head=document.querySelector('#miniPlayer .mini-player-head');
    if(!head)return;
    let wrap=document.getElementById('hatoLeanSpeedControl');
    if(!wrap){
      wrap=document.createElement('label');wrap.id='hatoLeanSpeedControl';wrap.className='hato-speed-control';
      wrap.innerHTML=`<span class="hato-speed-label">SPEED</span><select id="hatoLeanSpeed" class="hato-speed-select" aria-label="読み上げ速度">${SPEEDS.map(r=>`<option value="${r}">${r.toFixed(1)}×</option>`).join('')}</select>`;
      const close=document.getElementById('miniClose');head.insertBefore(wrap,close||null);
      wrap.querySelector('select').addEventListener('change',e=>setRate(Number(e.target.value)));
    }
    const select=document.getElementById('hatoLeanSpeed');if(select)select.value=String(getRate());
  };

  const installEdgeMenu=()=>{
    if(document.documentElement.dataset.hatoLeanEdge==='1')return;
    document.documentElement.dataset.hatoLeanEdge='1';
    let edge=null;
    const canStart=()=>!document.getElementById('menu')?.classList.contains('open')&&!document.body.classList.contains('article-open')&&!document.getElementById('audioSheet')?.classList.contains('open');
    document.addEventListener('touchstart',e=>{if(e.touches.length!==1||!canStart()||e.target.closest?.('#feed article[data-id]'))return;const t=e.touches[0];if(t.clientX>24)return;edge={x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY};},{passive:true});
    document.addEventListener('touchmove',e=>{if(!edge||e.touches.length!==1)return;const t=e.touches[0];edge.lastX=t.clientX;edge.lastY=t.clientY;},{passive:true});
    document.addEventListener('touchend',()=>{if(!edge)return;const dx=edge.lastX-edge.x,dy=edge.lastY-edge.y;edge=null;if(dx>70&&Math.abs(dx)>Math.abs(dy)*1.2&&typeof openMenu==='function')openMenu();},{passive:true});
    document.addEventListener('touchcancel',()=>{edge=null;},{passive:true});
  };

  const installShortDetailSwipe=()=>{
    const view=document.getElementById('articleView');
    if(!view||view.dataset.hatoLeanSwipe==='1')return;
    view.dataset.hatoLeanSwipe='1';
    let g=null;
    view.addEventListener('touchstart',e=>{if(e.touches.length!==1||!document.body.classList.contains('article-open'))return;const t=e.touches[0];g={x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY};},{passive:true});
    view.addEventListener('touchmove',e=>{if(!g||e.touches.length!==1)return;const t=e.touches[0];g.lastX=t.clientX;g.lastY=t.clientY;},{passive:true});
    view.addEventListener('touchend',()=>{
      if(!g)return;const s=g;g=null;const dx=s.lastX-s.x,dy=s.lastY-s.y;const normal=Math.max(72,innerWidth*.22);
      if(dx>-28||Math.abs(dx)<=Math.abs(dy)*1.08||Math.abs(dx)>=normal)return;
      const title=document.querySelector('#articleContent .article-title')?.textContent?.trim();
      const article=app.articles.find(a=>String(a.title||'').trim()===title);if(!article)return;
      const key='hato-inbox-dismissed-v5';let ids=[];try{ids=JSON.parse(localStorage.getItem(key)||'[]').map(Number);}catch(e){}
      if(!ids.includes(Number(article.id))){ids.push(Number(article.id));try{localStorage.setItem(key,JSON.stringify(ids));}catch(e){}}
      document.getElementById('backArticle')?.click();setTimeout(()=>app.rerender?.(),0);
    },{passive:true});
    view.addEventListener('touchcancel',()=>{g=null;},{passive:true});
  };

  const refresh=()=>{syncBrand();syncCards();syncDetail();syncPlayButtons();ensureSpeedUi();applyMediaRate();};

  const baseRerender=app.rerender;
  app.rerender=()=>{baseRerender?.();requestAnimationFrame(()=>{syncCards();syncPlayButtons();});};

  document.getElementById('searchInput')?.addEventListener('input',()=>requestAnimationFrame(syncCards));
  document.addEventListener('click',e=>{
    if(e.target.closest?.('.open-article'))setTimeout(()=>{syncCards();syncDetail();},0);
    if(e.target.closest?.('.audio-option[data-mode]'))setTimeout(()=>{ensureSpeedUi();syncNewSpeechDuration();applyMediaRate();},0);
  });
  document.addEventListener('play',e=>{if(e.target instanceof HTMLMediaElement){try{e.target.playbackRate=getRate();}catch(err){}}},true);

  patchSpeech();installEdgeMenu();installShortDetailSwipe();refresh();
  setTimeout(refresh,120);setTimeout(refresh,500);
})();
