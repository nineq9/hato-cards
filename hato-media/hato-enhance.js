(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .lead.read{opacity:.54!important;filter:saturate(.62) brightness(1.05)!important;transition:opacity .22s ease,filter .22s ease}
    #backArticle{left:50%!important;right:auto!important;transform:translateX(-50%)!important}
    html{overscroll-behavior-x:none}
    .overlay{transform:translateX(-12px);transition:transform .22s ease,opacity .22s ease}
    .overlay.open{transform:translateX(0)}
  `;
  document.head.appendChild(style);

  const kiss=document.getElementById('kissBird');
  const fly=document.getElementById('flyAway');
  const kissSrc='./assets/img2.webp?v=hd2';
  const flySrc='./assets/img3.webp?v=hd2';
  if(kiss){ kiss.src=kissSrc; kiss.dataset.kissSrc=kissSrc; }
  if(fly){ fly.src=flySrc; }

  let edge=null;
  const canStart=()=>{
    const menu=document.getElementById('menu');
    const sheet=document.getElementById('audioSheet');
    return !(menu?.classList.contains('open') || document.body.classList.contains('article-open') || sheet?.classList.contains('open'));
  };
  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1 || !canStart()) return;
    const t=e.touches[0];
    if(t.clientX>28) return;
    edge={x:t.clientX,y:t.clientY,lastX:t.clientX,lastY:t.clientY,locked:false};
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!edge || e.touches.length!==1) return;
    const t=e.touches[0],dx=t.clientX-edge.x,dy=t.clientY-edge.y;
    edge.lastX=t.clientX;edge.lastY=t.clientY;
    if(!edge.locked && (Math.abs(dx)>8 || Math.abs(dy)>8)){
      if(dx>0 && Math.abs(dx)>Math.abs(dy)*1.2) edge.locked=true;
      else if(Math.abs(dy)>=Math.abs(dx)) edge=null;
    }
    if(edge?.locked) e.preventDefault();
  },{passive:false});
  document.addEventListener('touchend',()=>{
    if(!edge) return;
    const dx=edge.lastX-edge.x,dy=edge.lastY-edge.y;
    if(edge.locked && dx>72 && Math.abs(dy)<Math.max(54,dx*.7) && typeof openMenu==='function') openMenu();
    edge=null;
  },{passive:true});
  document.addEventListener('touchcancel',()=>{edge=null},{passive:true});
})();