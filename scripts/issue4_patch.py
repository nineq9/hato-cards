from pathlib import Path

js = Path('kingfisher.js')
text = js.read_text()
old = '''  function decideAxis(g,dx,dy,threshold=10){
    if(g.axis) return g.axis;
    const ax=Math.abs(dx),ay=Math.abs(dy),dist=Math.hypot(dx,dy);
    if(dist<threshold) return null;
    if(ax>ay*1.22) g.axis='x';
    else if(ay>ax*1.10) g.axis='y';
    else if(dist>20) g.axis=ax>ay?'x':'y';
    return g.axis;
  }
'''
new = '''  function decideAxis(g,dx,dy,threshold=10){
    if(g.axis) return g.axis;
    const ax=Math.abs(dx),ay=Math.abs(dy),dist=Math.hypot(dx,dy);
    if(dist<threshold) return null;
    // Reading is the primary continuous action. Do not let a tiny horizontal
    // wobble at touch-down steal an otherwise clear vertical read.
    if(ay>=ax*1.12) g.axis='y';
    else if(ax>=ay*1.45) g.axis='x';
    else if(dist>=28) g.axis=ay>=ax*.82?'y':'x';
    return g.axis;
  }
'''
assert old in text, 'decideAxis block changed unexpectedly'
text = text.replace(old,new,1)

old = '''    surface.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0) return;
      if($('#drawer').classList.contains('open')||$('#sourceSheet').classList.contains('open')||state.tab==='dive') return;
      if(e.clientX<=edgeGestureWidth()||state.edgeDrawerPointerId===e.pointerId) return;
      const now=performance.now();
      g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,lastT:now,vx:0,vy:0,axis:null};
    });
'''
new = '''    surface.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0) return;
      if($('#drawer').classList.contains('open')||$('#sourceSheet').classList.contains('open')||state.tab==='dive') return;
      if(e.clientX<=edgeGestureWidth()||state.edgeDrawerPointerId===e.pointerId) return;
      // A missing terminal event must never poison the next gesture.
      if(g){g=null;resetReaderVisual();}
      const now=performance.now();
      g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,lastT:now,vx:0,vy:0,axis:null};
    });
'''
assert old in text, 'reader pointerdown block changed unexpectedly'
text = text.replace(old,new,1)

old = '''    surface.addEventListener('pointerup',finish);
    surface.addEventListener('pointercancel',()=>{if(!g)return;g=null;settleReader();});

    surface.addEventListener('click',e=>{
'''
new = '''    surface.addEventListener('pointerup',finish);
    const cancelReaderPointer=e=>{if(!g||e.pointerId!==g.id)return;g=null;settleReader();};
    surface.addEventListener('pointercancel',cancelReaderPointer);
    surface.addEventListener('lostpointercapture',cancelReaderPointer);

    surface.addEventListener('click',e=>{
'''
assert old in text, 'reader cancel block changed unexpectedly'
text = text.replace(old,new,1)
js.write_text(text)

css = Path('kingfisher.css')
ct = css.read_text()
old = '.drawer-body{overflow-y:auto;padding:8px 18px calc(24px + var(--safe-bottom));overscroll-behavior:contain}'
new = '.drawer-body{overflow-y:auto;padding:8px 18px calc(24px + var(--safe-bottom));overscroll-behavior:contain;touch-action:pan-y}'
assert old in ct, 'drawer-body rule changed unexpectedly'
css.write_text(ct.replace(old,new,1))

print('Issue #4 production patch applied')
