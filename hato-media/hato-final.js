(()=>{
  if(window.__HATO_FINAL_V1__)return;
  window.__HATO_FINAL_V1__=true;

  const app=window.__HATO_BRIDGE__;
  const SPEEDS=[0.8,1,1.2,1.5,2];
  const SPEED_KEY='hato-playback-rate-v1';
  const PHOTOS=[
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=420&q=55',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=420&q=55',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=420&q=55'
  ];

  const style=document.createElement('style');
  style.textContent=`
    .feed{padding-left:16px!important;padding-right:16px!important}
    #feed article.story.hato-wrap-title .story-main{display:block!important;min-width:0!important;overflow:visible!important}
    #feed article.story.hato-wrap-title .story-topline{margin-bottom:4px!important}
    #feed article.story.hato-wrap-title .story-title-flow{display:block!important;min-width:0!important;margin:0!important}
    #feed article.story.hato-wrap-title .story-title-flow::after{content:"";display:block;clear:both}
    #feed article.story.hato-wrap-title .story-art{
      float:right!important;
      width:82px!important;
      aspect-ratio:1.25/1!important;
      margin:0 0 5px 10px!important;
      display:block!important;
      clear:none!important;
      overflow:hidden!important;
      background:#ececea!important;
    }
    #feed article.story.hato-wrap-title h2{
      display:block!important;
      clear:none!important;
      margin:0!important;
      padding:0!important;
      font-size:16.5px!important;
      line-height:1.16!important;
      letter-spacing:-.018em!important;
      font-weight:820!important;
      overflow:visible!important;
    }
    #feed article.story.hato-wrap-title h2 .open-article{
      display:inline!important;
      width:auto!important;
      margin:0!important;
      padding:0!important;
      text-align:left!important;
      clear:none!important;
    }
    #feed article.story.hato-wrap-title .meta{clear:both!important;padding-top:6px!important;margin-top:0!important}
    @media(min-width:521px){
      #feed article.story.hato-wrap-title .story-art{width:92px!important;margin-left:12px!important}
      #feed article.story.hato-wrap-title h2{font-size:18px!important}
    }

    .hato-news-photo{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important}
    .story-art.hato-photo-fallback,.article-hero-art.hato-photo-fallback{background:linear-gradient(135deg,#ece9e5,#d7d5d0)!important}

    #hatoAudioShort,#hatoAudioLong,.hato-audio-btn,
    #hatoAudioShort span,#hatoAudioLong span,.hato-audio-btn span,
    .archive-audio-btn,.archive-audio-btn::before,.archive-audio-btn::after{
      background:transparent!important;
      background-color:transparent!important;
      background-image:none!important;
      box-shadow:none!important;
      border:0!important;
      outline:0!important;
      clip-path:none!important;
      -webkit-appearance:none!important;
      appearance:none!important;
    }
    #hatoAudioShort,#hatoAudioLong,.hato-audio-btn{
      width:16px!important;height:16px!important;min-width:16px!important;min-height:16px!important;
      padding:0!important;margin:0!important;border-radius:0!important;overflow:visible!important;
      display:grid!important;place-items:center!important;color:var(--orange)!important;
    }
    #hatoAudioLong,.hato-audio-btn.long{color:#111!important}
    #hatoAudioShort span,#hatoAudioLong span,.hato-audio-btn span{font-size:13px!important;line-height:1!important;font-weight:800!important;transform:none!important;color:inherit!important}
    .hato-audio-row{gap:8px!important;align-items:center!important;justify-content:flex-end!important}

    .archive-audio-btn{
      width:16px!important;height:16px!important;min-width:16px!important;min-height:16px!important;
      padding:0!important;margin:0 4px 0 0!important;border-radius:0!important;overflow:visible!important;
      display:grid!important;place-items:center!important;color:var(--orange)!important;font-size:0!important;
    }
    .archive-audio-btn[data-archive-audio="all"]{color:#111!important}
    .archive-audio-btn::before{content:'▶︎'!important;display:block!important;font-size:13px!important;line-height:1!important;color:inherit!important}
    .archive-audio-btn::after{content:none!important;display:none!important}
    .archive-audio-line{gap:7px!important;align-items:center!important}

    .hato-speed-control{display:flex;align-items:center;gap:5px;margin-left:auto;margin-right:8px;flex:none}
    .hato-speed-label{font-size:9px;line-height:1;color:#aaa;font-weight:700;letter-spacing:.06em}
    .hato-speed-select{
      height:26px;border:1px solid #5e5e5e;border-radius:999px;background:#111;color:#fff;
      padding:0 7px;font-size:10px;line-height:1;font-weight:800;outline:none;
    }
  `;
  document.head.appendChild(style);

  const getRate=()=>{
    const n=Number(localStorage.getItem(SPEED_KEY)||'1');
    return SPEEDS.includes(n)?n:1;
  };
  const setRate=r=>{
    const rate=SPEEDS.includes(Number(r))?Number(r):1;
    try{localStorage.setItem(SPEED_KEY,String(rate));}catch(e){}
    document.querySelectorAll('audio,video').forEach(el=>{
      try{el.defaultPlaybackRate=rate;el.playbackRate=rate;}catch(e){}
    });
    restartSpeechAtRate(rate);
    syncSpeedUi();
  };

  const patchSpeech=()=>{
    if(!('speechSynthesis' in window)||window.__HATO_SPEECH_RATE_PATCHED__)return;
    window.__HATO_SPEECH_RATE_PATCHED__=true;
    const originalSpeak=window.speechSynthesis.speak.bind(window.speechSynthesis);
    window.speechSynthesis.speak=utterance=>{
      try{utterance.rate=getRate();}catch(e){}
      return originalSpeak(utterance);
    };
  };

  const restartSpeechAtRate=rate=>{
    try{
      if(typeof speechState==='undefined'||!speechState?.active)return;
      const textLen=Math.max(1,speechState.text?.length||1);
      const oldDur=Math.max(.1,Number(speechState.duration)||1);
      if(!speechState.hatoBaseDuration)speechState.hatoBaseDuration=oldDur*(Number(speechState.hatoAppliedRate)||1);
      const fraction=Math.max(0,Math.min(1,(Number(speechState.charIndex)||0)/textLen || (typeof getSpeechPosition==='function'?getSpeechPosition()/oldDur:0)));
      speechState.duration=Math.max(.1,speechState.hatoBaseDuration/rate);
      speechState.position=fraction*speechState.duration;
      speechState.hatoAppliedRate=rate;
      speechState.startedAt=performance.now()-speechState.position*1000;
      if(typeof speakFromPosition==='function')speakFromPosition(Math.min(speechState.position,Math.max(0,speechState.duration-.05)),!!speechState.paused);
    }catch(e){}
  };

  const syncSpeechDuration=()=>{
    try{
      if(typeof speechState==='undefined'||!speechState?.active)return;
      const rate=getRate();
      if(!speechState.hatoBaseDuration){
        speechState.hatoBaseDuration=Math.max(.1,Number(speechState.duration)||1);
        speechState.hatoAppliedRate=rate;
        speechState.duration=Math.max(.1,speechState.hatoBaseDuration/rate);
        speechState.startedAt=performance.now()-(Number(speechState.position)||0)*1000;
      }
    }catch(e){}
  };

  const ensureSpeedUi=()=>{
    const head=document.querySelector('#miniPlayer .mini-player-head');
    if(!head)return;
    let wrap=document.getElementById('hatoSpeedControl');
    if(!wrap){
      wrap=document.createElement('label');
      wrap.id='hatoSpeedControl';
      wrap.className='hato-speed-control';
      wrap.innerHTML='<span class="hato-speed-label">SPEED</span><select id="hatoSpeedSelect" class="hato-speed-select" aria-label="Скорость озвучивания"></select>';
      const close=document.getElementById('miniClose');
      if(close)head.insertBefore(wrap,close);else head.appendChild(wrap);
      const select=wrap.querySelector('select');
      SPEEDS.forEach(rate=>{
        const o=document.createElement('option');o.value=String(rate);o.textContent=`${rate.toFixed(rate===1?1:1)}×`;select.appendChild(o);
      });
      select.addEventListener('change',()=>setRate(Number(select.value)));
    }
    syncSpeedUi();
  };

  const syncSpeedUi=()=>{
    const select=document.getElementById('hatoSpeedSelect');
    if(select)select.value=String(getRate());
  };

  const bindImage=img=>{
    if(!img)return;
    img.loading='lazy';
    img.decoding='async';
    try{img.fetchPriority='low';}catch(e){}
    if(img.dataset.hatoErrorBound==='1')return;
    img.dataset.hatoErrorBound='1';
    img.addEventListener('error',()=>{
      const parent=img.parentElement;
      const tried=Number(img.dataset.hatoFallbackIndex||'0');
      if(tried<PHOTOS.length-1){
        const next=(tried+1)%PHOTOS.length;
        img.dataset.hatoFallbackIndex=String(next);
        img.src=PHOTOS[next];
      }else{
        img.remove();
        parent?.classList.add('hato-photo-fallback');
      }
    });
  };

  const enforceThreePhotos=()=>{
    if(!app||!Array.isArray(app.articles))return;
    document.querySelectorAll('#feed article[data-id]').forEach(card=>{
      const id=Number(card.dataset.id)||0;
      const img=card.querySelector('.hato-news-photo');
      if(!img)return;
      const src=PHOTOS[Math.abs(id)%PHOTOS.length];
      if(!PHOTOS.some(p=>img.src.includes(p.split('?')[0]))){img.dataset.hatoFallbackIndex=String(Math.abs(id)%PHOTOS.length);img.src=src;}
      bindImage(img);
    });
    const hero=document.querySelector('#articleContent .article-hero-art .hato-news-photo');
    if(hero){
      const title=document.querySelector('#articleContent .article-title')?.textContent?.trim();
      const article=app.articles.find(a=>a.title?.trim()===title);
      const id=Number(article?.id)||0;
      const src=PHOTOS[Math.abs(id)%PHOTOS.length];
      if(!PHOTOS.some(p=>hero.src.includes(p.split('?')[0]))){hero.dataset.hatoFallbackIndex=String(Math.abs(id)%PHOTOS.length);hero.src=src;}
      bindImage(hero);
    }
  };

  const syncPlayButtons=()=>{
    const short=document.getElementById('hatoAudioShort');
    const long=document.getElementById('hatoAudioLong');
    if(short&&short.textContent.trim()!=='▶︎')short.innerHTML='<span aria-hidden="true">▶︎</span>';
    if(long&&long.textContent.trim()!=='▶︎')long.innerHTML='<span aria-hidden="true">▶︎</span>';
    document.querySelectorAll('.archive-audio-btn').forEach(btn=>{if(btn.textContent)btn.textContent='';});
  };

  const boostDetailSwipe=()=>{
    const view=document.getElementById('articleView');
    if(!view||view.dataset.hatoQuickSwipe==='1')return;
    view.dataset.hatoQuickSwipe='1';
    let gesture=null;
    view.addEventListener('touchstart',e=>{
      if(e.touches.length!==1||!document.body.classList.contains('article-open'))return;
      const t=e.touches[0];gesture={x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY};
    },{passive:true});
    view.addEventListener('touchmove',e=>{
      if(!gesture||e.touches.length!==1)return;
      const t=e.touches[0];gesture.lastX=t.clientX;gesture.lastY=t.clientY;
    },{passive:true});
    view.addEventListener('touchend',()=>{
      if(!gesture)return;
      const g=gesture;gesture=null;
      const dx=g.lastX-g.x,dy=g.lastY-g.y;
      if(dx>-24||Math.abs(dx)<=Math.abs(dy)*1.05)return;
      const forced=Math.max(84,innerWidth*.25);
      if(Math.abs(dx)>=forced)return;
      try{
        const ev=new Event('touchmove',{cancelable:true});
        Object.defineProperty(ev,'touches',{value:[{clientX:g.x-forced-2,clientY:g.y}],configurable:true});
        document.dispatchEvent(ev);
      }catch(e){}
    },{passive:true});
    view.addEventListener('touchcancel',()=>{gesture=null;},{passive:true});
  };

  const sync=()=>{
    patchSpeech();
    ensureSpeedUi();
    syncSpeechDuration();
    document.querySelectorAll('audio,video').forEach(el=>{try{el.defaultPlaybackRate=getRate();el.playbackRate=getRate();}catch(e){}});
    enforceThreePhotos();
    syncPlayButtons();
    boostDetailSwipe();
  };

  sync();
  setTimeout(sync,120);
  setTimeout(sync,500);
  setTimeout(sync,1200);
  new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','src']});
})();