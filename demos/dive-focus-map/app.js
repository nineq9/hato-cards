(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const views = { cards: $('#cardsView'), live: $('#liveView'), dive: $('#diveView') };

  const graph = {
    event: { type:'EVENT', label:'Coastal power plant explosion', question:'何が起き、何がまだ分からない？', detail:'爆発は確認。原因と攻撃主体は未確認。', neighbors:[['evidence','supports'],['claims','claims'],['confirmed','confirms'],['unknown','context_for'],['history-root','historically_similar_to'],['technology','explains'],['impact','affects']] },
    evidence: { type:'EVIDENCE', label:'何が根拠になっている？', question:'観測できる材料は何か？', detail:'映像・衛星画像・運転ログを分離して確認する。', neighbors:[['satellite','supports'],['ground-video','supports'],['grid-log','confirms'],['claim-drone','contradicts'],['history-root','context_for'],['unknown','context_for']] },
    satellite: { type:'EVIDENCE', label:'Satellite image', question:'衛星画像から何が確認できる？', detail:'火災地点と被害範囲は見えるが、原因までは確定できない。', neighbors:[['fire-zone','supports'],['timestamp','confirms'],['history-2019','historically_similar_to'],['history-root','context_for'],['drone-fragment','contradicts'],['unknown','context_for']] },
    'ground-video': { type:'EVIDENCE', label:'Ground video', question:'現地映像は何を示す？', detail:'爆発と煙は確認できる。飛来物は不鮮明。', neighbors:[['event','supports'],['satellite','confirms'],['claim-drone','context_for'],['unknown','context_for']] },
    'grid-log': { type:'CONFIRMED', label:'Grid operator log', question:'運転データで何が分かる？', detail:'出力低下の時刻は映像の爆発時刻と近い。', neighbors:[['event','confirms'],['timestamp','confirms'],['impact','affects']] },
    claims: { type:'CLAIMS', label:'誰が何を主張している？', question:'主張主体を分けて見る', detail:'政府は無人機攻撃、反対側は関与を否定。', neighbors:[['claim-drone','claims'],['claim-denial','claims'],['evidence','context_for'],['confirmed','context_for'],['unknown','context_for']] },
    'claim-drone': { type:'CLAIM', label:'Government: drone attack', question:'政府は何を根拠にしている？', detail:'現時点で公開された根拠は限定的。', neighbors:[['event','claims'],['drone-fragment','supports'],['satellite','context_for'],['claim-denial','contradicts']] },
    'claim-denial': { type:'CLAIM', label:'Opposing side: denies involvement', question:'否定声明は何を意味する？', detail:'関与否定は主張であり、独立確認とは別。', neighbors:[['claim-drone','contradicts'],['event','claims'],['unknown','context_for']] },
    confirmed: { type:'CONFIRMED', label:'何が確認されている？', question:'合意できる最小事実', detail:'爆発、火災、出力低下は複数の独立情報と整合。', neighbors:[['event','confirms'],['ground-video','confirms'],['grid-log','confirms'],['satellite','confirms'],['unknown','context_for']] },
    unknown: { type:'UNKNOWN', label:'まだ分からないこと', question:'何を確定してはいけない？', detail:'原因、攻撃主体、兵器種、被害の長期影響。', neighbors:[['claim-drone','context_for'],['drone-fragment','context_for'],['history-root','context_for'],['technology','context_for']] },
    technology: { type:'TECHNOLOGY', label:'どういう技術？', question:'無人機攻撃なら何が必要？', detail:'航法、通信、弾頭、対空網突破という複数要素が必要。', neighbors:[['drone-nav','explains'],['air-defense','explains'],['claim-drone','context_for'],['unknown','context_for']] },
    impact: { type:'IMPACT', label:'何に影響する？', question:'施設停止がどこへ波及する？', detail:'電力、港湾、産業、価格への二次影響を分けて見る。', neighbors:[['grid-impact','affects'],['port-impact','affects'],['market-impact','affects'],['event','affects']] },
    'history-root': { type:'HISTORY', label:'過去に似たことは？', question:'似ているが、証拠ではない', detail:'過去事例は現在事件の証拠ではなく比較用の文脈。', neighbors:[['history-2019','historically_similar_to'],['history-2022','historically_similar_to'],['event','context_for'],['satellite','context_for'],['technology','context_for']] },
    'history-2019': { type:'HISTORY', label:'2019 refinery strike', question:'何が似ていて何が違う？', detail:'重要インフラ、遠距離攻撃、供給懸念は似るが、現在事件の原因証明にはならない。', neighbors:[['history-root','historically_similar_to'],['satellite','context_for'],['event','historically_similar_to'],['market-impact','affects']] },
    'history-2022': { type:'HISTORY', label:'2022 substation sabotage', question:'破壊形態の違いは？', detail:'地上破壊と遠距離攻撃では痕跡が異なる。', neighbors:[['history-root','historically_similar_to'],['technology','context_for'],['unknown','context_for']] },
    'fire-zone': { type:'EVIDENCE', label:'Fire zone', question:'被害範囲はどこか？', detail:'衛星画像上でタービン棟周辺の熱源を確認。', neighbors:[['satellite','supports'],['impact','affects']] },
    timestamp: { type:'EVIDENCE', label:'Timestamp match', question:'時刻は整合している？', detail:'衛星撮像、現地映像、出力低下の時刻が近い。', neighbors:[['satellite','confirms'],['grid-log','confirms'],['event','supports']] },
    'drone-fragment': { type:'EVIDENCE', label:'Possible fragment', question:'破片は決定的証拠か？', detail:'出所が独立確認されておらず、現時点では補助材料。', neighbors:[['claim-drone','supports'],['unknown','context_for'],['satellite','contradicts']] },
    'drone-nav': { type:'TECHNOLOGY', label:'Navigation', question:'沿岸施設まで到達するには？', detail:'衛星航法だけでなく地形・画像照合も考えられる。', neighbors:[['technology','explains'],['air-defense','context_for']] },
    'air-defense': { type:'TECHNOLOGY', label:'Air defense gap', question:'防空側の弱点は？', detail:'低高度・海上接近は探知条件を変える。', neighbors:[['technology','explains'],['unknown','context_for']] },
    'grid-impact': { type:'IMPACT', label:'Grid stability', question:'供給への影響は？', detail:'短期は予備電源で吸収可能でも、長期停止は別問題。', neighbors:[['impact','affects'],['grid-log','context_for']] },
    'port-impact': { type:'IMPACT', label:'Port operations', question:'港湾にどう波及する？', detail:'クレーン・冷蔵設備・燃料処理に電力依存がある。', neighbors:[['impact','affects'],['market-impact','affects']] },
    'market-impact': { type:'IMPACT', label:'Power price', question:'価格は動く？', detail:'代替供給と停止期間によって価格影響は変わる。', neighbors:[['impact','affects'],['history-2019','context_for']] }
  };

  const relationCopy = {
    supports:'このNodeは、接続先の内容を裏づける材料として扱います。',
    contradicts:'接続先の説明と矛盾する、または単純化を妨げる材料です。',
    claims:'誰かがそう主張している関係です。事実確定とは分離します。',
    confirms:'複数の独立情報が一致し、確認度を上げる関係です。',
    context_for:'理解の背景になる関係です。現在事件の証拠とは扱いません。',
    historically_similar_to:'歴史的に似た特徴がある関係です。現在事件の証拠ではありません。',
    affects:'一方の変化が他方へ影響する関係です。',
    explains:'仕組みや因果の理解を助ける説明関係です。'
  };

  const state = { view:'cards', articleScroll:0, saved:false, currentNode:'event', trail:['event'], origin:null, drag:null, swipe:null, nodeButtons:new Map() };
  const positions = [[50,50],[22,23],[77,22],[84,51],[73,79],[27,79],[15,52],[50,13]];

  function setView(name, options={}) {
    state.view=name;
    Object.entries(views).forEach(([key,el])=>el.classList.toggle('active',key===name));
    $$('.dock-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===name));
    if(name==='cards') requestAnimationFrame(()=>{$('#cardScroll').scrollTop=state.articleScroll;});
    if(name==='dive'&&!options.directMap) showDiveHome();
  }

  function showDiveHome(){ $('#diveHome').classList.remove('hidden'); $('#focusShell').classList.add('hidden'); }

  function enterFocus(nodeId,origin='home'){
    state.origin=origin;state.currentNode=nodeId;state.trail=[nodeId];
    $('#diveHome').classList.add('hidden');$('#focusShell').classList.remove('hidden');
    setView('dive',{directMap:true});renderFocus(true);
  }

  function navigateNode(nodeId){
    if(!graph[nodeId]||nodeId===state.currentNode)return;
    const chosen=state.nodeButtons.get(nodeId),center=state.nodeButtons.get(state.currentNode);
    $$('.map-node').forEach(node=>{if(node!==chosen&&node!==center)node.style.opacity='.18';});
    if(chosen){chosen.classList.add('chosen');chosen.style.left='50%';chosen.style.top='50%';chosen.style.zIndex='5';}
    if(center){center.style.opacity='.12';center.style.transform='translate(-50%,-50%) scale(.94)';}
    setTimeout(()=>{
      state.currentNode=nodeId;
      const existingIndex=state.trail.indexOf(nodeId);
      if(existingIndex>=0)state.trail=state.trail.slice(0,existingIndex+1);else state.trail.push(nodeId);
      renderFocus(false);
    },430);
  }

  function renderFocus(initial=false){
    const center=graph[state.currentNode];if(!center)return;
    state.nodeButtons.clear();const nodeLayer=$('#nodeLayer');nodeLayer.innerHTML='';
    const visible=[state.currentNode,...center.neighbors.slice(0,7).map(([id])=>id)];
    visible.forEach((id,index)=>{
      const node=graph[id];if(!node)return;
      const button=document.createElement('button');
      button.className=`map-node ${index===0?'center ':''}${initial?'entering':''}`;
      button.dataset.nodeId=id;button.style.left=`${positions[index][0]}%`;button.style.top=`${positions[index][1]}%`;
      button.innerHTML=`<small>${node.type}</small><strong>${node.label}</strong><span>${node.question}</span>`;
      button.addEventListener('click',()=>navigateNode(id));nodeLayer.appendChild(button);state.nodeButtons.set(id,button);
    });
    requestAnimationFrame(()=>$$('.map-node.entering').forEach(n=>n.classList.remove('entering')));
    renderEdges(center,visible);renderTrail();$('#focusType').textContent=center.type;$('#focusQuestion').textContent=center.question;
  }

  function renderEdges(center,visible){
    const svg=$('#edgeLayer'),map=$('#focusMap');svg.innerHTML='';
    const width=map.clientWidth||390,height=map.clientHeight||600;svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const centerX=width*.5,centerY=height*.5;
    center.neighbors.slice(0,7).forEach(([id,relation],i)=>{
      if(!visible.includes(id))return;
      const pos=positions[i+1],x=width*pos[0]/100,y=height*pos[1]/100,midX=(centerX+x)/2,midY=(centerY+y)/2;
      const group=document.createElementNS('http://www.w3.org/2000/svg','g');group.classList.add('edge-group');group.dataset.relation=relation;group.dataset.to=id;
      group.innerHTML=`<line class="edge-line" x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}"/><line class="edge-hit" x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}"/><rect class="edge-label-bg" x="${midX-42}" y="${midY-9}" width="84" height="18" rx="1"/><text class="edge-label" x="${midX}" y="${midY+3}" text-anchor="middle">${relation}</text>`;
      group.querySelector('.edge-hit').addEventListener('click',()=>inspectRelation(relation,id));svg.appendChild(group);
    });
  }

  function inspectRelation(relation,toId){ $('#relationName').textContent=relation;$('#relationText').textContent=`${relationCopy[relation]||''} → ${graph[toId]?.label||''}`; }

  function renderTrail(){
    const trail=$('#diveTrail');trail.innerHTML='';
    state.trail.forEach((id,index)=>{
      const node=graph[id],button=document.createElement('button');button.className=`trail-button ${index===state.trail.length-1?'current':''}`;button.textContent=node.type==='EVENT'?'Event':node.label;
      button.addEventListener('click',()=>{state.currentNode=id;state.trail=state.trail.slice(0,index+1);renderFocus(false);});trail.appendChild(button);
      if(index<state.trail.length-1){const sep=document.createElement('span');sep.className='trail-sep';sep.textContent='›';trail.appendChild(sep);}
    });
    requestAnimationFrame(()=>{trail.scrollLeft=trail.scrollWidth;});
  }

  function backDive(){ if(state.trail.length<=1){showDiveHome();return;}state.trail.pop();state.currentNode=state.trail[state.trail.length-1];renderFocus(false); }
  function returnToArticle(){ setView('cards');requestAnimationFrame(()=>{$('#cardScroll').scrollTop=state.articleScroll;}); }

  function pointInDiveDock(x,y){const r=$('#diveDock').getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top-16&&y<=r.bottom+8;}

  function beginDrag(e){
    state.articleScroll=$('#cardScroll').scrollTop;
    state.drag={id:e.pointerId,x:e.clientX,y:e.clientY,targetX:e.clientX,targetY:e.clientY,currentX:e.clientX,currentY:e.clientY,raf:0};
    document.body.classList.add('drag-mode');$('#articleCard').classList.add('drag-origin');$('#dragLayer').classList.add('active');$('#dragLayer').setAttribute('aria-hidden','false');$('#diveDock').classList.add('drop-ready');
    const tick=()=>{if(!state.drag)return;state.drag.currentX+=(state.drag.targetX-state.drag.currentX)*.30;state.drag.currentY+=(state.drag.targetY-state.drag.currentY)*.30;const card=$('#dragCard');card.style.left=`${state.drag.currentX}px`;card.style.top=`${state.drag.currentY}px`;state.drag.raf=requestAnimationFrame(tick);};
    state.drag.raf=requestAnimationFrame(tick);moveDrag(e.clientX,e.clientY);$('#gestureStatus').textContent='DRAG MODE';
  }

  function moveDrag(x,y){if(!state.drag)return;state.drag.targetX=x;state.drag.targetY=y;$('#diveDock').classList.toggle('drop-hot',pointInDiveDock(x,y));}

  function endDrag(x,y){
    const hot=pointInDiveDock(x,y);if(state.drag?.raf)cancelAnimationFrame(state.drag.raf);
    document.body.classList.remove('drag-mode');$('#articleCard').classList.remove('drag-origin','drag-ready');$('#dragLayer').classList.remove('active');$('#dragLayer').setAttribute('aria-hidden','true');$('#diveDock').classList.remove('drop-ready','drop-hot');state.drag=null;$('#gestureStatus').textContent='';
    if(hot)enterFocus('event','article');
  }

  function setupCardGestures(){
    const card=$('#articleCard'),scroll=$('#cardScroll'),handle=$('#dragHandle');let holdTimer=null;
    const clearHold=()=>{if(holdTimer)clearTimeout(holdTimer);holdTimer=null;card.classList.remove('drag-ready');};

    handle.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0)return;e.stopPropagation();
      const start={id:e.pointerId,x:e.clientX,y:e.clientY};state.swipe={...start,axis:null,fromHandle:true};
      holdTimer=setTimeout(()=>{card.classList.add('drag-ready');beginDrag(e);holdTimer=null;},430);handle.setPointerCapture?.(e.pointerId);
    });
    handle.addEventListener('pointermove',e=>{
      if(state.drag&&e.pointerId===state.drag.id){e.preventDefault();moveDrag(e.clientX,e.clientY);return;}
      if(!state.swipe||e.pointerId!==state.swipe.id)return;if(Math.hypot(e.clientX-state.swipe.x,e.clientY-state.swipe.y)>9)clearHold();
    },{passive:false});
    handle.addEventListener('pointerup',e=>{clearHold();if(state.drag&&e.pointerId===state.drag.id)endDrag(e.clientX,e.clientY);state.swipe=null;});
    handle.addEventListener('pointercancel',e=>{clearHold();if(state.drag&&e.pointerId===state.drag.id)endDrag(e.clientX,e.clientY);state.swipe=null;});
    handle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();state.articleScroll=scroll.scrollTop;enterFocus('event','article');}});

    let g=null;
    scroll.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;if(e.target.closest('#dragHandle'))return;g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null};});
    scroll.addEventListener('pointermove',e=>{
      if(!g||e.pointerId!==g.id||state.drag)return;
      const dx=e.clientX-g.x,dy=e.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);
      if(!g.axis&&Math.hypot(dx,dy)>10){if(ax>ay*1.25)g.axis='x';else if(ay>ax*1.10)g.axis='y';else if(Math.hypot(dx,dy)>20)g.axis=ax>ay?'x':'y';}
      const now=performance.now(),dt=Math.max(8,now-g.lastT);g.vx=g.vx*.45+((e.clientX-g.lastX)/dt)*.55;g.lastX=e.clientX;g.lastT=now;
      if(g.axis!=='x')return;e.preventDefault();scroll.setPointerCapture?.(e.pointerId);card.style.transition='none';card.style.transform=`translate3d(${dx*.9}px,0,0) rotate(${clamp(dx/170,-.8,.8)}deg)`;card.classList.toggle('is-saving',dx>0);$('#gestureStatus').textContent=dx>0?'SAVE':'NEXT';
    },{passive:false});
    scroll.addEventListener('pointerup',e=>{
      if(!g||e.pointerId!==g.id)return;const dx=e.clientX-g.x,axis=g.axis,vx=g.vx;g=null;state.articleScroll=scroll.scrollTop;
      if(axis!=='x'){card.style.transform='';card.classList.remove('is-saving');$('#gestureStatus').textContent='';return;}
      if(dx>72||vx>.45){state.saved=true;card.style.transition='transform 210ms cubic-bezier(.2,.72,.18,1)';card.style.transform='';card.classList.add('is-saving');$('#gestureStatus').textContent='SAVED';setTimeout(()=>{card.classList.remove('is-saving');$('#gestureStatus').textContent='';},420);return;}
      if(dx<-72||vx<-.45){card.style.transition='transform 230ms cubic-bezier(.18,.76,.18,1),opacity 180ms linear';card.style.transform='translate3d(-110%,0,0) rotate(-1.5deg)';card.style.opacity='.08';setTimeout(()=>{scroll.scrollTop=0;state.articleScroll=0;card.style.transition='none';card.style.transform='translate3d(18px,0,0)';card.style.opacity='1';requestAnimationFrame(()=>requestAnimationFrame(()=>{card.style.transition='transform 220ms cubic-bezier(.2,.72,.18,1)';card.style.transform='';}));$('#gestureStatus').textContent='NEXT';setTimeout(()=>$('#gestureStatus').textContent='',350);},230);return;}
      card.style.transition='transform 190ms cubic-bezier(.2,.72,.18,1)';card.style.transform='';card.classList.remove('is-saving');$('#gestureStatus').textContent='';
    });
    scroll.addEventListener('pointercancel',()=>{g=null;card.style.transform='';card.classList.remove('is-saving');$('#gestureStatus').textContent='';});
    scroll.addEventListener('scroll',()=>{if(!state.drag)state.articleScroll=scroll.scrollTop;},{passive:true});
  }

  function setupDock(){ $('#editorialDock').addEventListener('click',e=>{const button=e.target.closest('[data-view]');if(!button)return;const name=button.dataset.view;if(name==='dive'){setView('dive');return;}setView(name);}); }
  function setupDive(){ $$('.home-entry').forEach(btn=>btn.addEventListener('click',()=>enterFocus(btn.dataset.homeNode,'home')));$('#diveBack').addEventListener('click',backDive);$('#articleReturn').addEventListener('click',returnToArticle);window.addEventListener('resize',()=>{if(state.view==='dive'&&!$('#focusShell').classList.contains('hidden'))renderFocus(false);}); }

  setupCardGestures();setupDock();setupDive();setView('cards');
})();
