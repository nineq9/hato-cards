(()=>{
  const detail=document.querySelector('#detail');
  const scroll=detail?.querySelector('.detail-scroll');
  if(!detail||!scroll)return;

  let touch=null;
  scroll.addEventListener('touchstart',e=>{
    const t=e.touches[0];
    touch={x:t.clientX,y:t.clientY,axis:null};
  },{passive:true});
  scroll.addEventListener('touchmove',e=>{
    if(!touch||!detail.classList.contains('open'))return;
    const t=e.touches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;
    if(!touch.axis&&(Math.abs(dx)>8||Math.abs(dy)>8))touch.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
    if(touch.axis==='x'&&dx>0){
      detail.style.setProperty('transform',`translateX(${dx}px) scale(${1-Math.min(.035,dx/6000)})`,'important');
    }
  },{passive:true});
  scroll.addEventListener('touchend',()=>{
    detail.style.removeProperty('transform');
  },{capture:true,passive:true});
  scroll.addEventListener('touchcancel',()=>{
    detail.style.removeProperty('transform');touch=null;
  },{capture:true,passive:true});

  let pointer=null;
  detail.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch')return;
    pointer={x:e.clientX,y:e.clientY,axis:null};
  });
  detail.addEventListener('pointermove',e=>{
    if(!pointer||!detail.classList.contains('open'))return;
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
    if(!pointer.axis&&(Math.abs(dx)>8||Math.abs(dy)>8))pointer.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
    if(pointer.axis==='x'&&dx>0){
      detail.style.setProperty('transform',`translateX(${dx}px) scale(${1-Math.min(.035,dx/6000)})`,'important');
    }
  });
  detail.addEventListener('pointerup',()=>{
    detail.style.removeProperty('transform');pointer=null;
  },{capture:true});
  detail.addEventListener('pointercancel',()=>{
    detail.style.removeProperty('transform');pointer=null;
  },{capture:true});
})();