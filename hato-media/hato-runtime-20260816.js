(()=>{
  if(window.__HATO_RUNTIME_20260816__)return;
  window.__HATO_RUNTIME_20260816__=true;

  const SPEED_KEY='hato-playback-rate-v1';
  const SPEEDS=[0.8,1,1.2,1.5,2];
  let playbackRate=1;
  try{
    const saved=Number(localStorage.getItem(SPEED_KEY));
    if(SPEEDS.includes(saved))playbackRate=saved;
  }catch(e){}

  const style=document.createElement('style');
  style.id='hato-runtime-20260816-style';
  style.textContent=`
    html body .feed{padding-left:16px!important;padding-right:16px!important}
    html body #feed article.story{
      grid-template-columns:30px minmax(0,1fr)!important;
      gap:8px!important;
      padding:15px 0 16px!important;
      margin:0!important;
      width:100%!important;
    }
    html body #feed article.story .story-num{
      font-size:13px!important;
      line-height:1.15!important;
      padding-top:1px!important;
      width:30px!important;
    }
    html body #feed article.story .story-main{
      display:block!important;
      min-width:0!important;
      width:100%!important;
      max-width:none!important;
      overflow:visible!important;
    }
    html body #feed article.story .story-topline{
      margin:0 0 4px!important;
      min-height:16px!important;
    }
    html body #feed article.story .story-cat{
      font-size:10px!important;
      line-height:1.15!important;
      letter-spacing:.07em!important;
    }
    html body #feed article.story.hato-wrap-title .story-title-flow{
      display:block!important;
      width:100%!important;
      max-width:none!important;
      min-width:0!important;
      margin:0!important;
      padding:0!important;
      overflow:visible!important;
    }
    html body #feed article.story.hato-wrap-title .story-title-flow::after{
      content:""!important;
      display:block!important;
      clear:both!important;
    }
    html body #feed article.story.hato-wrap-title .story-art{
      float:right!important;
      clear:none!important;
      width:92px!important;
      height:64px!important;
      min-width:92px!important;
      aspect-ratio:auto!important;
      margin:0 0 5px 10px!important;
      padding:0!important;
      line-height:0!important;
      background:transparent!important;
      overflow:hidden!important;
    }
    html body #feed article.story.hato-wrap-title .story-art img,
    html body #feed article.story.hato-wrap-title .story-art .hato-news-photo{
      display:block!important;
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      margin:0!important;
    }
    html body #feed article.story.hato-wrap-title h2{
      display:block!important;
      clear:none!important;
      width:auto!important;
      max-width:none!important;
      font-size:15px!important;
      line-height:1.24!important;
      letter-spacing:-.012em!important;
      margin:0!important;
      padding:0!important;
      font-weight:800!important;
      overflow:visible!important;
      overflow-wrap:normal!important;
      word-break:normal!important;
      hyphens:auto!important;
    }
    html body #feed article.story.hato-wrap-title h2 .open-article{
      display:inline!important;
      width:auto!important;
      max-width:none!important;
      line-height:inherit!important;
      margin:0!important;
      padding:0!important;
      text-align:left!important;
    }
    html body #feed article.story.hato-wrap-title .meta{
      clear:both!important;
      margin-top:7px!important;
      padding-top:0!important;
    }
    html body #feed article.story p{
      font-size:12.5px!important;
      line-height:1.42!important;
      margin:7px 0 8px!important;
    }
    html body #feed .timeline-chapter article.story:last-child{border-bottom:0!important}

    html body .article-hero-art{overflow:hidden!important;line-height:0!important}
    html body .article-hero-art img{display:block!important;width:100%!important;height:auto!important;aspect-ratio:3/2!important;object-fit:cover!important}

    html body .hato-audio-row{gap:20px!important;padding-top:7px!important;padding-bottom:2px!important}
    html body .hato-audio-btn{width:32px!important;height:30px!important;min-width:32px!important;border:0!important;border-radius:0!important;padding:0!important;background:transparent!important;clip-path:none!important;display:grid!important;place-items:center!important;overflow:visible!important;color:var(--orange)!important}
    html body .hato-audio-btn.long{background:transparent!important;color:#111!important}
    html body .hato-audio-btn span{font-size:21px!important;line-height:1!important;font-weight:700!important;transform:none!important;letter-spacing:0!important}
    html body .archive-audio-btn{width:30px!important;height:28px!important;min-width:30px!important;border:0!important;border-radius:0!important;padding:0!important;margin-right:4px!important;background:transparent!important;clip-path:none!important;display:grid!important;place-items:center!important;font-size:20px!important;line-height:1!important;font-weight:700!important;color:var(--orange)!important;overflow:visible!important}
    html body .archive-audio-btn[data-archive-audio="all"]{background:transparent!important;color:#111!important}
    html body .archive-audio-btn::before,html body .archive-audio-btn::after{content:none!important;display:none!important}
    html body .archive-audio-line{gap:8px!important}

    html body .mini-player-head{gap:10px!important}
    .hato-speed-control{margin-left:auto;display:flex;align-items:center;gap:5px;font-size:10px;font-weight:850;color:#666;white-space:nowrap}
    .hato-speed-control select{appearance:auto;border:1px solid #d8d8d5;background:#fff;color:#111;border-radius:7px;padding:4px 5px;font:800 11px/1 system-ui,-apple-system,sans-serif;min-width:58px}
    .hato-speed-control select:focus{outline:2px solid rgba(255,90,0,.24);outline-offset:1px}
    @media(min-width:521px){
      html body #feed article.story{grid-template-columns:34px minmax(0,1fr)!important;gap:10px!important;padding-top:17px!important;padding-bottom:18px!important}
      html body #feed article.story .story-num{width:34px!important;font-size:13px!important}
      html body #feed article.story.hato-wrap-title .story-art{width:104px!important;height:72px!important;margin-left:12px!important}
      html body #feed article.story.hato-wrap-title h2{font-size:16px!important;line-height:1.25!important}
    }
  `;
  document.head.appendChild(style);

  const applyRateToMedia=()=>{
    document.querySelectorAll('audio,video').forEach(el=>{
      try{el.defaultPlaybackRate=playbackRate;el.playbackRate=playbackRate;}catch(e){}
    });
  };

  const NativeUtterance=window.SpeechSynthesisUtterance;
  let nativeSpeak=null;
  let currentSpeech=null;
  if('speechSynthesis' in window&&NativeUtterance){
    nativeSpeak=speechSynthesis.speak.bind(speechSynthesis);
    speechSynthesis.speak=function(utterance){
      try{utterance.rate=playbackRate;}catch(e){}
      const originalBoundary=utterance.onboundary;
      const originalEnd=utterance.onend;
      currentSpeech={utterance,text:String(utterance.text||''),base:0,last:0,originalBoundary,originalEnd};
      try{
        utterance.addEventListener('boundary',e=>{
          if(currentSpeech?.utterance===utterance&&typeof e.charIndex==='number')currentSpeech.last=e.charIndex;
        });
      }catch(e){}
      return nativeSpeak(utterance);
    };
  }

  const restartSpeechAtRate=()=>{
    if(!nativeSpeak||!currentSpeech||!speechSynthesis.speaking)return;
    const cur=currentSpeech;
    const skip=Math.max(0,Number(cur.last)||0);
    const remaining=cur.text.slice(skip);
    if(!remaining)return;
    const wasPaused=!!speechSynthesis.paused;
    const base=cur.base+skip;
    const oldBoundary=cur.originalBoundary;
    const oldEnd=cur.originalEnd;
    try{cur.utterance.onboundary=null;cur.utterance.onend=null;}catch(e){}
    try{speechSynthesis.cancel();}catch(e){}
    const next=new NativeUtterance(remaining);
    try{
      next.lang=cur.utterance.lang||'ja-JP';
      next.pitch=cur.utterance.pitch||1;
      next.volume=cur.utterance.volume??1;
      next.rate=playbackRate;
    }catch(e){}
    next.onboundary=e=>{
      if(typeof oldBoundary==='function')oldBoundary({charIndex:base+(Number(e.charIndex)||0)});
    };
    next.onend=e=>{if(typeof oldEnd==='function')oldEnd(e);};
    currentSpeech={utterance:next,text:remaining,base,last:0,originalBoundary:oldBoundary,originalEnd:oldEnd};
    try{
      next.addEventListener('boundary',e=>{
        if(currentSpeech?.utterance===next&&typeof e.charIndex==='number')currentSpeech.last=e.charIndex;
      });
    }catch(e){}
    nativeSpeak(next);
    if(wasPaused)setTimeout(()=>{try{speechSynthesis.pause();}catch(e){}},25);
  };

  const setPlaybackRate=rate=>{
    rate=Number(rate);
    if(!SPEEDS.includes(rate))rate=1;
    playbackRate=rate;
    try{localStorage.setItem(SPEED_KEY,String(rate));}catch(e){}
    applyRateToMedia();
    if(currentSpeech){
      try{currentSpeech.utterance.rate=rate;}catch(e){}
      restartSpeechAtRate();
    }
    const select=document.getElementById('hatoPlaybackRate');
    if(select&&Number(select.value)!==rate)select.value=String(rate);
  };

  const ensureSpeedUI=()=>{
    const head=document.querySelector('#miniPlayer .mini-player-head');
    if(!head||document.getElementById('hatoPlaybackRate'))return;
    const wrap=document.createElement('label');
    wrap.className='hato-speed-control';
    wrap.innerHTML=`<span>速度</span><select id="hatoPlaybackRate" aria-label="読み上げ速度">${SPEEDS.map(v=>`<option value="${v}"${v===playbackRate?' selected':''}>${v.toFixed(1)}×</option>`).join('')}</select>`;
    const close=document.getElementById('miniClose');
    head.insertBefore(wrap,close||null);
    wrap.querySelector('select').addEventListener('change',e=>setPlaybackRate(Number(e.target.value)));
  };

  const imageUrl=id=>`assets/article-${((Math.max(1,Number(id)||1)-1)%3)+1}.svg`;
  const imageHTML=id=>`<img src="${imageUrl(id)}" alt="" loading="lazy" decoding="async" fetchpriority="low" onerror="this.closest('.story-art,.article-hero-art')?.setAttribute('hidden','')">`;

  const decorateImages=()=>{
    document.querySelectorAll('#feed article.story[data-id] .story-art img').forEach(img=>{
      img.loading='lazy';img.decoding='async';img.fetchPriority='low';
      img.onerror=()=>img.closest('.story-art')?.setAttribute('hidden','');
    });
    const hero=document.querySelector('#articleContent .article-hero-art');
    if(hero){
      const img=hero.querySelector('img');
      if(img){img.loading='lazy';img.decoding='async';img.fetchPriority='low';img.onerror=()=>hero.setAttribute('hidden','');}
      else{
        const title=document.querySelector('#articleContent .article-title')?.textContent?.trim();
        const app=window.__HATO_BRIDGE__;
        const article=app?.articles?.find(a=>String(a.title||'').trim()===title);
        hero.innerHTML=imageHTML(Number(article?.id)||1);
      }
    }
  };

  const syncPlayButtons=()=>{
    const short=document.getElementById('hatoAudioShort');
    const long=document.getElementById('hatoAudioLong');
    if(short){short.innerHTML='<span aria-hidden="true">▶︎</span>';short.setAttribute('aria-label','短い音声を再生');}
    if(long){long.innerHTML='<span aria-hidden="true">▶︎</span>';long.setAttribute('aria-label','長い音声を再生');}
    document.querySelectorAll('.archive-audio-btn').forEach(btn=>{
      btn.textContent='▶︎';
      btn.setAttribute('aria-label',btn.dataset.archiveAudio==='all'?'長い音声を再生':'短い音声を再生');
    });
  };

  let syntheticSwipe=false;
  let shortSwipe=null;
  const installShortArticleSwipe=()=>{
    document.addEventListener('touchstart',e=>{
      if(syntheticSwipe||e.touches.length!==1||!document.body.classList.contains('article-open'))return;
      const t=e.touches[0];shortSwipe={x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY};
    },{passive:true});
    document.addEventListener('touchmove',e=>{
      if(syntheticSwipe||!shortSwipe||e.touches.length!==1)return;
      const t=e.touches[0];shortSwipe.lastX=t.clientX;shortSwipe.lastY=t.clientY;
    },{passive:true});
    document.addEventListener('touchend',()=>{
      if(syntheticSwipe||!shortSwipe)return;
      const s=shortSwipe;shortSwipe=null;
      const dx=s.lastX-s.x,dy=s.lastY-s.y;
      const normalThreshold=Math.max(72,innerWidth*.22);
      if(dx>-24||Math.abs(dx)<=Math.abs(dy)*1.05||Math.abs(dx)>=normalThreshold)return;
      const view=document.getElementById('articleView');if(!view)return;
      const point=(x,y)=>({clientX:x,clientY:y,pageX:x,pageY:y,screenX:x,screenY:y});
      const dispatch=(type,touches,changed)=>{
        const ev=new Event(type,{bubbles:true,cancelable:true});
        Object.defineProperty(ev,'touches',{value:touches});
        Object.defineProperty(ev,'changedTouches',{value:changed});
        view.dispatchEvent(ev);
      };
      syntheticSwipe=true;
      const start=point(s.x,s.y),end=point(s.x-normalThreshold-18,s.y);
      dispatch('touchstart',[start],[start]);
      dispatch('touchmove',[end],[end]);
      dispatch('touchend',[],[end]);
      syntheticSwipe=false;
    },{passive:true});
    document.addEventListener('touchcancel',()=>{if(!syntheticSwipe)shortSwipe=null;},{passive:true});
  };

  let raf=0;
  const refresh=()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      ensureSpeedUI();applyRateToMedia();decorateImages();syncPlayButtons();
    });
  };

  let tries=0;
  const boot=()=>{
    if(!window.__HATO_BRIDGE__&&tries++<120){setTimeout(boot,50);return;}
    ensureSpeedUI();applyRateToMedia();decorateImages();syncPlayButtons();installShortArticleSwipe();
    new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
    setTimeout(refresh,300);setTimeout(refresh,1000);
  };
  boot();
})();
