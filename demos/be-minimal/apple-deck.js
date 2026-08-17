// Apple-like direct-manipulation review deck.
// LEFT = delete candidate, RIGHT = keep/save, UP = reconsider later.
(() => {
  const passed=new Set();
  const laterQueue=[];
  const laterSet=new Set();
  let active=null;
  let viewerIndex=null;
  let viewerScale=1;
  let pinchStartDistance=0;
  let pinchStartScale=1;
  let viewerGestureMoved=false;
  let suppressViewerTapUntil=0;
  let completionTriggered=false;
  const viewerPointers=new Map();

  const opening=document.getElementById('openingScreen');
  let openingClosed=false;
  function closeOpening(){if(!opening||openingClosed)return;openingClosed=true;opening.classList.add('is-hidden');setTimeout(()=>opening.classList.add('is-gone'),320);}
  const scheduleOpeningClose=()=>setTimeout(closeOpening,1250);
  if(document.readyState==='complete')scheduleOpeningClose();else window.addEventListener('load',scheduleOpeningClose,{once:true});
  opening?.addEventListener('click',closeOpening);

  const photosScreen=document.getElementById('photosScreen');
  const topbar=photosScreen.querySelector('.topbar');
  const targets=document.createElement('div');
  targets.className='review-targets';
  targets.innerHTML=`
    <div class="review-target review-target-trash" data-action="trash" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 7h14M9 7V5h6v2M8 9l.7 9h6.6L16 9M10 10v6M14 10v6"/></svg></div>
    <div class="review-target review-target-later" data-action="later" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M19 8a7 7 0 1 0 1 6"/><path d="M19 4v4h-4"/></svg></div>
    <div class="review-target review-target-keep" data-action="keep" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4.5h10v15l-5-3.2-5 3.2z"/></svg></div>`;
  photosScreen.appendChild(targets);
  const targetEls={trash:targets.querySelector('[data-action="trash"]'),keep:targets.querySelector('[data-action="keep"]'),later:targets.querySelector('[data-action="later"]')};

  function positionTargets(){
    const card=film.querySelector('.photo-card[data-depth="0"]');
    if(!card){targets.style.opacity='0';return;}
    targets.style.opacity='';
    const screenRect=photosScreen.getBoundingClientRect();
    const cardRect=card.getBoundingClientRect();
    const topbarRect=topbar.getBoundingClientRect();
    const visualHalf=10;
    const gap=8;
    const edge=4;
    const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
    const minX=edge+visualHalf;
    const maxX=screenRect.width-edge-visualHalf;
    const leftX=clamp(cardRect.left-screenRect.left-gap-visualHalf,minX,maxX);
    const rightX=clamp(cardRect.right-screenRect.left+gap+visualHalf,minX,maxX);
    const middleY=clamp(cardRect.top-screenRect.top+(cardRect.height/2),visualHalf+edge,screenRect.height-visualHalf-edge);
    const minTopY=(topbarRect.bottom-screenRect.top)+edge+visualHalf;
    const topY=clamp(cardRect.top-screenRect.top-gap-visualHalf,minTopY,screenRect.height-visualHalf-edge);
    targetEls.trash.style.left=`${leftX}px`;targetEls.trash.style.top=`${middleY}px`;
    targetEls.keep.style.left=`${rightX}px`;targetEls.keep.style.top=`${middleY}px`;
    targetEls.later.style.left=`${cardRect.left-screenRect.left+(cardRect.width/2)}px`;targetEls.later.style.top=`${topY}px`;
  }

  function clearHot(){Object.values(targetEls).forEach(el=>el.classList.remove('hot'))}
  function setHot(action){clearHot();if(action)targetEls[action].classList.add('hot')}
  function resolvedCount(){return queued.size+passed.size}
  function fresh(){return photos.map((_,i)=>i).filter(i=>!queued.has(i)&&!passed.has(i)&&!laterSet.has(i))}
  function available(){const freshItems=fresh();if(freshItems.length)return freshItems;return laterQueue.filter(i=>!queued.has(i)&&!passed.has(i))}
  function removeFromLater(i){laterSet.delete(i);const pos=laterQueue.indexOf(i);if(pos>=0)laterQueue.splice(pos,1)}
  function defer(i){if(laterSet.has(i)){const pos=laterQueue.indexOf(i);if(pos>=0)laterQueue.splice(pos,1)}else laterSet.add(i);laterQueue.push(i)}

  function updateDeck(){
    const cards=[...film.querySelectorAll('.photo-card')];
    cards.forEach((card,index)=>{card.dataset.depth=index<3?String(index):'hidden';card.style.opacity='';if(index===0)card.style.transform='translate(-50%,-50%)';});
    const resolved=resolvedCount();
    counter.textContent=resolved>=photos.length?`${photos.length} / ${photos.length}`:`${Math.min(resolved+1,photos.length)} / ${photos.length}`;
    targets.classList.toggle('is-complete',resolved>=photos.length);
    updateReview();
    requestAnimationFrame(positionTargets);
    if(resolved>=photos.length&&!completionTriggered){completionTriggered=true;setTimeout(()=>window.onPhotoReviewComplete?.(),150);}
  }

  function renderApple(){
    film.innerHTML='';
    available().forEach(i=>{const p=photos[i],card=document.createElement('article');card.className='photo-card';card.dataset.i=i;card.innerHTML=`<img class="photo-media" src="${p.src}" alt="" onload="this.classList.toggle('is-landscape',this.naturalWidth>this.naturalHeight)"><div class="size-badge">${signal()}${p.size}</div>`;film.appendChild(card)});
    requestAnimationFrame(updateDeck);
  }
  render=renderApple;

  function resistance(v){const sign=v<0?-1:1,magnitude=Math.abs(v);return sign*(magnitude<190?magnitude*.97:184.3+(magnitude-190)*.44)}
  function actionFor(dx,dy,vx,vy){const ax=Math.abs(dx),ay=Math.abs(dy);if(dy<0&&(ay>ax*.68||vy<-650)&&(ay>50||vy<-720))return 'later';if(dx<0&&(ax>56||vx<-620))return 'trash';if(dx>0&&(ax>56||vx>620))return 'keep';return null}
  function restore(card){card.animate([{transform:card.style.transform||'translate(-50%,-50%)'},{transform:'translate(-50%,calc(-50% + 2px)) scale(.999)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:260,easing:'cubic-bezier(.22,.78,.24,1)'}).onfinish=()=>{card.style.transform='translate(-50%,-50%)';card.style.opacity='';clearHot();}}
  function commit(card,action,dx,dy){
    const i=Number(card.dataset.i);setHot(action);if(navigator.vibrate)navigator.vibrate(action==='trash'?7:4);
    let tx=0,ty=0,rot=0;
    if(action==='trash'){tx=-760;ty=Math.max(-80,Math.min(80,dy*.18));rot=-6;}
    else if(action==='keep'){tx=760;ty=Math.max(-80,Math.min(80,dy*.18));rot=6;}
    else{tx=Math.max(-70,Math.min(70,dx*.12));ty=-900;}
    const from=card.style.transform||'translate(-50%,-50%)';
    card.animate([{transform:from,opacity:1},{transform:`translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) rotate(${rot}deg) scale(.97)`,opacity:.03}],{duration:190,easing:'cubic-bezier(.20,.80,.20,1)',fill:'forwards'}).onfinish=()=>{
      if(action==='trash'){removeFromLater(i);queued.add(i)}
      else if(action==='keep'){removeFromLater(i);passed.add(i)}
      else defer(i);
      clearHot();renderApple();
    };
  }

  film.addEventListener('pointerdown',e=>{const card=e.target.closest('.photo-card[data-depth="0"]');if(!card)return;if(e.pointerType==='mouse'&&e.button!==0)return;card.setPointerCapture?.(e.pointerId);active={card,id:e.pointerId,sx:e.clientX,sy:e.clientY,lx:e.clientX,ly:e.clientY,lt:performance.now(),vx:0,vy:0,moved:false,long:false,timer:null};active.timer=setTimeout(()=>{if(active&&!active.moved){active.long=true;openDetails(Number(card.dataset.i));}},520);e.stopImmediatePropagation();},true);
  film.addEventListener('pointermove',e=>{if(!active||e.pointerId!==active.id)return;const now=performance.now(),dt=Math.max(8,now-active.lt),dx=e.clientX-active.sx,dy=e.clientY-active.sy;active.vx=(e.clientX-active.lx)/dt*1000;active.vy=(e.clientY-active.ly)/dt*1000;active.lx=e.clientX;active.ly=e.clientY;active.lt=now;if(Math.abs(dx)>5||Math.abs(dy)>5){active.moved=true;clearTimeout(active.timer);}const x=resistance(dx),y=resistance(dy),rot=Math.max(-6,Math.min(6,x/29)),scale=1-Math.min(.03,Math.hypot(x,y)/3200);active.card.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) rotate(${rot}deg) scale(${scale})`;setHot(actionFor(dx,dy,active.vx,active.vy));e.preventDefault();e.stopImmediatePropagation();},true);
  function finish(e,cancel=false){if(!active||e.pointerId!==active.id)return;const a=active;active=null;clearTimeout(a.timer);e.stopImmediatePropagation();if(a.long){restore(a.card);return;}const dx=(e.clientX??a.lx)-a.sx,dy=(e.clientY??a.ly)-a.sy;if(!a.moved&&Math.abs(dx)<7&&Math.abs(dy)<7){a.card.style.transform='translate(-50%,-50%)';clearHot();openViewer(Number(a.card.dataset.i));return;}if(cancel){restore(a.card);return;}const action=actionFor(dx+a.vx*.075,dy+a.vy*.075,a.vx,a.vy);if(action){commit(a.card,action,dx,dy);return;}restore(a.card);}
  film.addEventListener('pointerup',e=>finish(e,false),true);film.addEventListener('pointercancel',e=>finish(e,true),true);

  function applyViewerScale(animated=false){viewerImg.style.transition=animated?'transform .22s cubic-bezier(.22,.78,.24,1)':'none';viewerImg.style.transform=`scale(${viewerScale})`}
  function resetViewerZoom(animated=false){viewerScale=1;applyViewerScale(animated);viewerPointers.clear();pinchStartDistance=0;viewerGestureMoved=false}
  function pointerDistance(){const pts=[...viewerPointers.values()];if(pts.length<2)return 0;return Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)}
  openViewer=i=>{const p=photos[i];viewerIndex=i;viewerImg.src=p.src;viewerSize.innerHTML=signal()+p.size;resetViewerZoom(false);viewer.classList.add('show')};
  const originalCloseViewer=closeViewer;closeViewer=()=>{viewerIndex=null;resetViewerZoom(false);originalCloseViewer()};document.getElementById('viewerClose')?.addEventListener('click',()=>{viewerIndex=null;resetViewerZoom(false)});
  viewerImg.addEventListener('pointerdown',e=>{viewerImg.setPointerCapture?.(e.pointerId);viewerPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});viewerGestureMoved=false;if(viewerPointers.size===2){pinchStartDistance=pointerDistance();pinchStartScale=viewerScale;viewerGestureMoved=true;}e.preventDefault();});
  viewerImg.addEventListener('pointermove',e=>{if(!viewerPointers.has(e.pointerId))return;const prev=viewerPointers.get(e.pointerId);if(Math.hypot(e.clientX-prev.x,e.clientY-prev.y)>3)viewerGestureMoved=true;viewerPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(viewerPointers.size>=2&&pinchStartDistance>0){const ratio=pointerDistance()/pinchStartDistance;viewerScale=Math.max(1,Math.min(4,pinchStartScale*ratio));applyViewerScale(false);suppressViewerTapUntil=performance.now()+260;}e.preventDefault();});
  function endViewerPointer(e){if(!viewerPointers.has(e.pointerId))return;const wasPinching=viewerPointers.size>=2;viewerPointers.delete(e.pointerId);if(wasPinching){suppressViewerTapUntil=performance.now()+260;pinchStartDistance=0;if(viewerScale<1.03)resetViewerZoom(true);}}
  viewerImg.addEventListener('pointerup',endViewerPointer);viewerImg.addEventListener('pointercancel',endViewerPointer);
  viewerImg.addEventListener('click',e=>{e.stopPropagation();if(viewerIndex===null)return;if(performance.now()<suppressViewerTapUntil||viewerGestureMoved){viewerGestureMoved=false;return;}viewerIndex=null;resetViewerZoom(false);originalCloseViewer();});

  const repositionTargets=()=>requestAnimationFrame(positionTargets);
  window.addEventListener('resize',repositionTargets,{passive:true});
  window.visualViewport?.addEventListener('resize',repositionTargets,{passive:true});
  window.visualViewport?.addEventListener('scroll',repositionTargets,{passive:true});

  window.resetPhotoReview=()=>{queued.clear();passed.clear();laterQueue.splice(0);laterSet.clear();completionTriggered=false;renderApple()};
  renderApple();
})();