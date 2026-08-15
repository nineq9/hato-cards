from pathlib import Path

js = Path('kingfisher.js')
text = js.read_text()

old = '''    surface.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0) return;
      if($('#drawer').classList.contains('open')||$('#sourceSheet').classList.contains('open')||state.tab==='dive') return;
      if(e.clientX<=edgeGestureWidth()||state.edgeDrawerPointerId===e.pointerId) return;
      // A missing terminal event must never poison the next gesture.
      if(g){g=null;resetReaderVisual();}
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
      g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,lastT:now,vx:0,vy:0,axis:null,startScrollTop:surface.scrollTop,hadHorizontalLead:false,manualRead:false};
    });
'''
assert old in text, 'reader pointerdown block changed unexpectedly'
text = text.replace(old,new,1)

old = '''      g.vx=g.vx*.44+((e.clientX-g.lastX)/dt)*.56;
      g.vy=g.vy*.44+((e.clientY-g.lastY)/dt)*.56;
      g.lastX=e.clientX;g.lastY=e.clientY;g.lastT=now;
      decideAxis(g,dx,dy);
      if(g.axis==='y') return;
      if(g.axis!=='x') return;
'''
new = '''      g.vx=g.vx*.44+((e.clientX-g.lastX)/dt)*.56;
      g.vy=g.vy*.44+((e.clientY-g.lastY)/dt)*.56;
      g.lastX=e.clientX;g.lastY=e.clientY;g.lastT=now;
      const ax=Math.abs(dx),ay=Math.abs(dy),dist=Math.hypot(dx,dy);
      if(!g.axis&&dist>=10&&ax>ay) g.hadHorizontalLead=true;
      decideAxis(g,dx,dy);
      if(g.axis==='y'){
        // Chromium/WebKit may decline native vertical panning if the gesture
        // began slightly horizontal. Only that ambiguous-start case uses a
        // manual READ fallback; clean vertical gestures stay native.
        if(g.hadHorizontalLead){
          g.manualRead=true;
          e.preventDefault();
          surface.scrollTop=clamp(g.startScrollTop-dy,0,Math.max(0,surface.scrollHeight-surface.clientHeight));
        }
        return;
      }
      if(g.axis!=='x') return;
'''
assert old in text, 'reader pointermove block changed unexpectedly'
text = text.replace(old,new,1)

old = '''    surface.addEventListener('pointerup',finish);
    const cancelReaderPointer=e=>{if(!g||e.pointerId!==g.id)return;g=null;settleReader();};
    surface.addEventListener('pointercancel',cancelReaderPointer);
    surface.addEventListener('lostpointercapture',cancelReaderPointer);

    surface.addEventListener('click',e=>{
'''
new = '''    surface.addEventListener('pointerup',finish);
    const cancelReaderPointer=e=>{if(!g||e.pointerId!==g.id)return;g=null;settleReader();};
    surface.addEventListener('pointercancel',cancelReaderPointer);

    surface.addEventListener('click',e=>{
'''
assert old in text, 'reader cancel block changed unexpectedly'
text = text.replace(old,new,1)

old = '''        g={mode:'back',id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null};
      }else{
        if(!$('#cardsScreen').classList.contains('active')||!$('#tutorial').classList.contains('hidden')) return;
        g={mode:'open',id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null};
'''
new = '''        g={mode:'back',id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null,captureTarget:e.target instanceof Element?e.target:null};
      }else{
        if(!$('#cardsScreen').classList.contains('active')||!$('#tutorial').classList.contains('hidden')) return;
        g={mode:'open',id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null,captureTarget:e.target instanceof Element?e.target:null};
'''
assert old in text, 'edge pointerdown block changed unexpectedly'
text = text.replace(old,new,1)

old = '''      if(g.axis!=='x')return;
      e.preventDefault();
      if(g.mode==='open'){
'''
new = '''      if(g.axis!=='x')return;
      try{g.captureTarget?.setPointerCapture?.(g.id);}catch{}
      e.preventDefault();
      if(g.mode==='open'){
'''
assert old in text, 'edge pointermove block changed unexpectedly'
text = text.replace(old,new,1)

js.write_text(text)

css = Path('kingfisher.css')
ct = css.read_text()
assert 'overscroll-behavior:contain;touch-action:pan-y;will-change:transform,opacity' in ct, 'drawer touch-action fix missing'

print('Issue #4 touch arbitration refinement applied')
