// Safari interaction parity layer for the native Apple-style review deck.
// Direct manipulation follows the finger. Commit uses horizontal distance,
// predicted travel and velocity; diagonal drags are never rejected by angle.
(() => {
  const passed = new Set();
  const history = [];
  let active = null;
  let viewerIndex = null;
  let viewerScale = 1;
  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let viewerGestureMoved = false;
  let suppressViewerTapUntil = 0;
  const viewerPointers = new Map();

  const undo = document.createElement('button');
  undo.className = 'apple-undo';
  undo.setAttribute('aria-label', 'ひとつ戻す');
  undo.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 8 5 12l4 4M5 12h8a5 5 0 1 1 0 10"/></svg>';
  document.querySelector('.app').appendChild(undo);

  function available(){ return photos.map((_,i)=>i).filter(i=>!queued.has(i)&&!passed.has(i)); }
  function updateDeck(){
    const cards=[...film.querySelectorAll('.photo-card')];
    cards.forEach((card,index)=>{
      card.dataset.depth=index<3?String(index):'hidden';
      card.style.opacity='';
      if(index===0) card.style.transform='translate(-50%,-50%)';
    });
    const done=queued.size+passed.size;
    counter.textContent=`${Math.min(done+1,photos.length)} / ${photos.length}`;
    undo.disabled=!history.length;
    updateReview();
  }

  function renderApple(){
    film.innerHTML='';
    available().forEach(i=>{
      const p=photos[i],card=document.createElement('article');
      card.className='photo-card'; card.dataset.i=i;
      card.innerHTML=`<img class="photo-media" src="${p.src}" alt=""><div class="size-badge">${signal()}${p.size}</div>`;
      film.appendChild(card);
    });
    requestAnimationFrame(updateDeck);
  }

  // Replace the original demo renderer so review/delete flows keep using this deck.
  render = renderApple;

  function resistance(v){
    const s=v<0?-1:1,m=Math.abs(v);
    return s*(m<190?m*.97:184.3+(m-190)*.44);
  }
  function verticalFollow(dx,dy){
    const intent=Math.min(1,Math.abs(dx)/Math.max(Math.abs(dy),1));
    return .08+.22*intent;
  }
  function restore(card){
    card.animate([
      {transform:card.style.transform||'translate(-50%,-50%)'},
      {transform:'translate(-50%,calc(-50% + 2px)) scale(.999)'},
      {transform:'translate(-50%,-50%) scale(1)'}
    ],{duration:300,easing:'cubic-bezier(.22,.78,.24,1)'}).onfinish=()=>{
      card.style.transform='translate(-50%,-50%)'; card.style.opacity=''; trashTarget.classList.remove('hot');
    };
  }
  function commit(card,dir,dy){
    const i=Number(card.dataset.i),discard=dir<0;
    trashTarget.classList.toggle('hot',discard);
    if(navigator.vibrate) navigator.vibrate(discard?7:4);
    const target=dir<0?-760:760,rot=dir<0?-7:7,carried=Math.max(-90,Math.min(90,dy*.2));
    const from=card.style.transform||'translate(-50%,-50%)';
    card.animate([
      {transform:from,opacity:1},
      {transform:`translate(calc(-50% + ${target}px),calc(-50% + ${carried}px)) rotate(${rot}deg) scale(.97)`,opacity:.03}
    ],{duration:190,easing:'cubic-bezier(.20,.80,.20,1)',fill:'forwards'}).onfinish=()=>{
      if(discard) queued.add(i); else passed.add(i);
      history.push({i,discard});
      trashTarget.classList.remove('hot');
      renderApple();
    };
  }

  film.addEventListener('pointerdown',e=>{
    const card=e.target.closest('.photo-card[data-depth="0"]'); if(!card)return;
    if(e.pointerType==='mouse'&&e.button!==0)return;
    card.setPointerCapture?.(e.pointerId);
    active={card,id:e.pointerId,sx:e.clientX,sy:e.clientY,lx:e.clientX,lt:performance.now(),vx:0,moved:false,long:false,timer:null};
    active.timer=setTimeout(()=>{ if(active&&!active.moved){active.long=true;openDetails(Number(card.dataset.i));} },520);
    e.stopImmediatePropagation();
  },true);

  film.addEventListener('pointermove',e=>{
    if(!active||e.pointerId!==active.id)return;
    const now=performance.now(),dt=Math.max(8,now-active.lt),dx=e.clientX-active.sx,dy=e.clientY-active.sy;
    active.vx=(e.clientX-active.lx)/dt*1000; active.lx=e.clientX; active.lt=now;
    if(Math.abs(dx)>5||Math.abs(dy)>5){active.moved=true;clearTimeout(active.timer);}
    const x=resistance(dx),yf=dy*verticalFollow(dx,dy),rot=Math.max(-6.5,Math.min(6.5,x/27)),scale=1-Math.min(.034,Math.abs(x)/3000);
    active.card.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${yf}px)) rotate(${rot}deg) scale(${scale})`;
    trashTarget.classList.toggle('hot',dx<-44 || active.vx<-520);
    e.preventDefault(); e.stopImmediatePropagation();
  },true);

  function finish(e,cancel=false){
    if(!active||e.pointerId!==active.id)return;
    const a=active; active=null; clearTimeout(a.timer);
    e.stopImmediatePropagation();
    if(a.long){restore(a.card);return;}
    const dx=(e.clientX??a.lx)-a.sx,dy=(e.clientY??a.sy)-a.sy;
    if(!a.moved&&Math.abs(dx)<7&&Math.abs(dy)<7){a.card.style.transform='translate(-50%,-50%)';openViewer(Number(a.card.dataset.i));return;}
    if(cancel){restore(a.card);return;}
    // Approximate SwiftUI's predictedEndTranslation using current horizontal velocity.
    const predictedX=dx+a.vx*.085;
    if(dx<=-64||predictedX<=-118||a.vx<=-620){commit(a.card,-1,dy);return;}
    if(dx>=64||predictedX>=118||a.vx>=620){commit(a.card,1,dy);return;}
    restore(a.card);
  }
  film.addEventListener('pointerup',e=>finish(e,false),true);
  film.addEventListener('pointercancel',e=>finish(e,true),true);

  undo.addEventListener('click',()=>{
    const last=history.pop(); if(!last)return;
    if(last.discard) queued.delete(last.i); else passed.delete(last.i);
    renderApple();
  });

  // Fullscreen viewer: first card tap opens it, pinch zooms, second image tap queues discard.
  function applyViewerScale(animated=false){
    viewerImg.style.transition=animated?'transform .22s cubic-bezier(.22,.78,.24,1)':'none';
    viewerImg.style.transform=`scale(${viewerScale})`;
  }
  function resetViewerZoom(animated=false){
    viewerScale=1;
    applyViewerScale(animated);
    viewerPointers.clear();
    pinchStartDistance=0;
    viewerGestureMoved=false;
  }
  function pointerDistance(){
    const pts=[...viewerPointers.values()];
    if(pts.length<2)return 0;
    return Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
  }

  openViewer = i => {
    const p=photos[i];
    viewerIndex=i;
    viewerImg.src=p.src;
    viewerSize.innerHTML=signal()+p.size;
    resetViewerZoom(false);
    viewer.classList.add('show');
  };

  const originalCloseViewer=closeViewer;
  closeViewer = () => {
    viewerIndex=null;
    resetViewerZoom(false);
    originalCloseViewer();
  };

  viewerImg.addEventListener('pointerdown',e=>{
    viewerImg.setPointerCapture?.(e.pointerId);
    viewerPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    viewerGestureMoved=false;
    if(viewerPointers.size===2){
      pinchStartDistance=pointerDistance();
      pinchStartScale=viewerScale;
      viewerGestureMoved=true;
    }
    e.preventDefault();
  });

  viewerImg.addEventListener('pointermove',e=>{
    if(!viewerPointers.has(e.pointerId))return;
    const prev=viewerPointers.get(e.pointerId);
    if(Math.hypot(e.clientX-prev.x,e.clientY-prev.y)>3)viewerGestureMoved=true;
    viewerPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(viewerPointers.size>=2&&pinchStartDistance>0){
      const ratio=pointerDistance()/pinchStartDistance;
      viewerScale=Math.max(1,Math.min(4,pinchStartScale*ratio));
      applyViewerScale(false);
      suppressViewerTapUntil=performance.now()+260;
    }
    e.preventDefault();
  });

  function endViewerPointer(e){
    if(!viewerPointers.has(e.pointerId))return;
    const wasPinching=viewerPointers.size>=2;
    viewerPointers.delete(e.pointerId);
    if(wasPinching){
      suppressViewerTapUntil=performance.now()+260;
      pinchStartDistance=0;
      if(viewerScale<1.03)resetViewerZoom(true);
    }
  }
  viewerImg.addEventListener('pointerup',endViewerPointer);
  viewerImg.addEventListener('pointercancel',endViewerPointer);

  viewerImg.addEventListener('click',e=>{
    e.stopPropagation();
    if(viewerIndex===null)return;
    if(performance.now()<suppressViewerTapUntil||viewerGestureMoved){viewerGestureMoved=false;return;}
    const i=viewerIndex;
    queued.add(i);
    passed.delete(i);
    history.push({i,discard:true});
    if(navigator.vibrate)navigator.vibrate(7);
    viewerIndex=null;
    resetViewerZoom(false);
    originalCloseViewer();
    renderApple();
  });

  renderApple();
})();