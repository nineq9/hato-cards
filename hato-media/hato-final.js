(()=>{
  if(window.__HATO_FINAL_V1__)return;
  window.__HATO_FINAL_V1__=true;

  const app=window.__HATO_BRIDGE__;
  const SPEEDS=[0.8,1,1.2,1.5,2];
  const SPEED_KEY='hato-playback-rate-v1';
  const PHOTOS=[
    './assets/article-1.svg?v=3',
    './assets/article-2.svg?v=3',
    './assets/article-3.svg?v=3'
  ];

  const style=document.createElement('style');
  style.textContent=`
    html body .feed{padding-left:20px!important;padding-right:20px!important}

    html body #feed article.story.hato-wrap-title{
      display:block!important;
      position:relative!important;
      width:100%!important;
      margin:0!important;
      padding:18px 0 21px!important;
      border-bottom:1px solid #dedede!important;
      overflow:visible!important;
    }
    html body #feed article.story.hato-wrap-title .story-num{
      position:absolute!important;
      left:0!important;
      top:19px!important;
      width:27px!important;
      padding:0!important;
      margin:0!important;
      font-size:13px!important;
      line-height:1.15!important;
      font-weight:850!important;
      font-variant-numeric:tabular-nums!important;
    }
    html body #feed article.story.hato-wrap-title .story-main{
      display:block!important;
      width:100%!important;
      max-width:none!important;
      min-width:0!important;
      margin:0!important;
      padding:0!important;
      overflow:visible!important;
    }
    html body #feed article.story.hato-wrap-title .story-topline{
      display:flex!important;
      align-items:center!important;
      gap:8px!important;
      min-height:18px!important;
      margin:0 0 12px!important;
      padding:0 0 0 39px!important;
    }
    html body #feed article.story.hato-wrap-title .story-cat{
      font-size:10.5px!important;
      line-height:1.1!important;
      font-weight:850!important;
      letter-spacing:.075em!important;
      color:var(--orange)!important;
    }
    html body #feed article.story.hato-wrap-title .story-title-flow{
      display:flex!important;
      flex-direction:column!important;
      width:100%!important;
      min-width:0!important;
      max-width:none!important;
      margin:0!important;
      padding:0!important;
      overflow:visible!important;
    }
    html body #feed article.story.hato-wrap-title .story-title-flow::after{
      content:none!important;
      display:none!important;
      clear:none!important;
    }
    html body #feed article.story.hato-wrap-title h2{
      order:1!important;
      display:block!important;
      width:100%!important;
      max-width:none!important;
      clear:both!important;
      margin:0 0 12px!important;
      padding:0!important;
      font-size:18px!important;
      line-height:1.19!important;
      letter-spacing:-.018em!important;
      font-weight:800!important;
      overflow:visible!important;
      overflow-wrap:anywhere!important;
      word-break:normal!important;
      hyphens:auto!important;
    }
    html body #feed article.story.hato-wrap-title h2 .open-article{
      display:block!important;
      width:100%!important;
      max-width:none!important;
      margin:0!important;
      padding:0!important;
      text-align:left!important;
      line-height:inherit!important;
    }
    html body #feed article.story.hato-wrap-title .story-art{
      order:2!important;
      float:none!important;
      clear:both!important;
      display:block!important;
      width:100%!important;
      min-width:0!important;
      height:auto!important;
      aspect-ratio:16/8.5!important;
      margin:0 0 12px!important;
      padding:0!important;
      border:0!important;
      border-radius:5px!important;
      overflow:hidden!important;
      background:#111!important;
      line-height:0!important;
    }
    html body #feed article.story.hato-wrap-title .story-art img,
    html body #feed article.story.hato-wrap-title .story-art .hato-news-photo{
      display:block!important;
      width:100%!important;
      height:100%!important;
      margin:0!important;
      object-fit:cover!important;
      object-position:center!important;
      border-radius:inherit!important;
    }
    html body #feed article.story.hato-wrap-title .story-main>p{
      display:block!important;
      width:100%!important;
      max-width:none!important;
      margin:0 0 12px!important;
      padding:0!important;
      font-size:13.5px!important;
      line-height:1.48!important;
      color:#363636!important;
      letter-spacing:-.005em!important;
    }
    html body #feed article.story.hato-wrap-title .meta{
      display:flex!important;
      clear:both!important;
      align-items:center!important;
      gap:9px!important;
      width:100%!important;
      margin:0!important;
      padding:0!important;
      font-size:10.5px!important;
      line-height:1.2!important;
      color:#777!important;
    }
    html body #feed article.story.hato-wrap-title .source-link{font-weight:800!important}
    html body #feed .timeline-chapter article.story:last-child{border-bottom:0!important}

    html body .article-hero-art{
      display:block!important;
      width:100%!important;
      overflow:hidden!important;
      line-height:0!important;
      border-radius:6px!important;
      background:#111!important;
    }
    html body .article-hero-art .hato-news-photo,
    html body .article-hero-art img{
      display:block!important;
      width:100%!important;
      height:auto!important;
      aspect-ratio:16/9!important;
      object-fit:cover!important;
    }

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
    .hato-speed-select{height:26px;border:1px solid #5e5e5e;border-radius:999px;background:#111;color:#fff;padding:0 7px;font-size:10px;line-height:1;font-weight:800;outline:none}

    @media(min-width:521px){
      html body .feed{padding-left:22px!important;padding-right:22px!important}
      html body #feed article.story.hato-wrap-title{padding-top:20px!important;padding-bottom:23px!important}
      html body #feed article.story.hato-wrap-title .story-num{top:21px!important;font-size:13.5px!important}
      html body #feed article.story.hato-wrap-title h2{font-size:20px!important;line-height:1.18!important}
      html body #feed article.story.hato-wrap-title .story-main>p{font-size:14px!important}
      html body #feed article.story.hato-wrap-title .story-art{aspect-ratio:16/8!important}
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
        const o=document.createElement('option');o.value=String(rate);o.textContent=`${rate.toFixed(1)}×`;select.appendChild(o);
      });
      select.addEventListener('change',()=>setRate(Number(select.value)));
    }
    syncSpeedUi();
  };

  const syncSpeedUi=()=>{
    const select=document.getElementById('hatoSpeedSelect');
    if(select)select.value=String(getRate());
  };

  const photoIndex=id=>Math.abs(Number(id)||0)%PHOTOS.length;
  const photoFor=id=>PHOTOS[photoIndex(id)];

  const bindImage=(img,parent,id)=>{
    if(!img)return;
    img.className='hato-news-photo';
    img.alt='';
    img.loading='lazy';
    img.decoding='async';
    try{img.fetchPriority='low';}catch(e){}
    if(img.dataset.hatoErrorBound==='1')return;
    img.dataset.hatoErrorBound='1';
    img.addEventListener('error',()=>{
      const tried=Number(img.dataset.hatoFallbackIndex||photoIndex(id));
      if(tried<PHOTOS.length-1){
        const next=tried+1;
        img.dataset.hatoFallbackIndex=String(next);
        img.src=PHOTOS[next];
      }else{
        parent?.setAttribute('hidden','');
      }
    });
  };

  const ensurePhoto=(parent,id)=>{
    if(!parent)return;
    const wanted=new URL(photoFor(id),document.baseURI).href;
    let img=parent.querySelector('img');
    if(!img){img=document.createElement('img');parent.replaceChildren(img);}
    bindImage(img,parent,id);
    img.dataset.hatoFallbackIndex=String(photoIndex(id));
    if(img.src!==wanted)img.src=photoFor(id);
    parent.removeAttribute('hidden');
  };

  const enforceThreePhotos=()=>{
    if(!app||!Array.isArray(app.articles))return;
    document.querySelectorAll('#feed article[data-id]').forEach(card=>{
      const art=card.querySelector('.story-art');
      ensurePhoto(art,Number(card.dataset.id)||0);
    });
    const hero=document.querySelector('#articleContent .article-hero-art');
    if(hero){
      const title=document.querySelector('#articleContent .article-title')?.textContent?.trim();
      const article=app.articles.find(a=>a.title?.trim()===title);
      if(article)ensurePhoto(hero,article.id);
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