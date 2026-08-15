(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const prefersReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sources={
    visual:{name:'Coastal Visual Desk',title:'Verified local video set',time:'08:51',type:'visual verification'},
    satellite:{name:'Orbital Demo Desk',title:'Post-event satellite frame',time:'09:12',type:'satellite imagery'},
    grid:{name:'Regional Grid Operator',title:'Generation status notice',time:'08:55',type:'official operations'},
    government:{name:'Government Press Office',title:'Statement on coastal facility incident',time:'08:47',type:'official claim'},
    archive:{name:'Infrastructure Archive',title:'2024 comparable facility attack',time:'2024-05-19',type:'historical archive'}
  };
  const nodes={
    event:{type:'EVENT',label:'発電施設爆発',question:'何が起き、何がまだ分からない？',sources:['visual','grid','government']},
    evidence:{type:'EVIDENCE',label:'何が根拠になっている？',question:'観測できる材料を分けて見る',sources:['visual','satellite','grid']},
    claims:{type:'CLAIMS',label:'誰が何を主張している？',question:'主張主体を分離する',sources:['government']},
    confirmed:{type:'CONFIRMED',label:'何が確認されている？',question:'合意できる最小事実',sources:['visual','grid']},
    unknown:{type:'UNKNOWN',label:'まだ分からないこと',question:'確定してはいけない範囲',sources:['visual','government']},
    history:{type:'HISTORY',label:'過去に似たことは？',question:'似ているが、証拠ではない',sources:['archive']},
    technology:{type:'TECHNOLOGY',label:'どういう技術が関係している？',question:'無人機・航法・防空の条件',sources:['archive']},
    impact:{type:'IMPACT',label:'何に影響する？',question:'電力・港湾・価格への波及',sources:['grid']},
    satellite:{type:'EVIDENCE',label:'衛星画像',question:'画像から何が確認できる？',sources:['satellite']},
    groundVideo:{type:'EVIDENCE',label:'現地映像',question:'映像は何を示している？',sources:['visual']},
    capturePosition:{type:'EVIDENCE',label:'撮影位置',question:'位置は検証できる？',sources:['visual','satellite']},
    sourceNode:{type:'SOURCE',label:'情報源',question:'どこから来た情報？',sources:['visual','satellite','grid']},
    captureTime:{type:'EVIDENCE',label:'撮影時刻',question:'他の時刻情報と整合する？',sources:['satellite','grid']},
    damage:{type:'EVIDENCE',label:'損傷位置',question:'どこが損傷している？',sources:['satellite']},
    anotherVideo:{type:'EVIDENCE',label:'別角度の映像',question:'別映像でも一致する？',sources:['visual']},
    imageConfirmed:{type:'CONFIRMED',label:'画像で確認できること',question:'確認範囲を限定する',sources:['satellite']},
    imageUnknown:{type:'UNKNOWN',label:'画像では分からないこと',question:'画像の限界は？',sources:['satellite']},
    history2024:{type:'HISTORY',label:'2024年の類似施設攻撃',question:'何が似て、何が違う？',sources:['archive']},
    priorDrone:{type:'HISTORY',label:'過去の無人機攻撃',question:'過去にはどう使われた？',sources:['archive']},
    regional:{type:'CONTEXT',label:'地域のインフラ攻撃史',question:'地域的な背景は？',sources:['archive']},
    governmentClaim:{type:'CLAIM',label:'政府「無人機攻撃」',question:'何を根拠に主張？',sources:['government']},
    gridImpact:{type:'IMPACT',label:'電力系統への影響',question:'供給に何が起きる？',sources:['grid']},
    navigation:{type:'TECHNOLOGY',label:'航法',question:'長距離飛行に必要な技術は？',sources:['archive']}
  };
  const graphs={
    event:[['evidence','supports','根拠となる観測材料へ進む。',['visual','satellite','grid']],['claims','claims','事件について誰が何を主張しているかを見る。',['government']],['confirmed','confirms','複数情報で一致する確認済み範囲を見る。',['visual','grid']],['unknown','context_for','未確認範囲を理解の前提として分けて見る。',['visual','government']],['history','historically_similar_to','過去事例と比較する。今回の事件の証拠ではない。',['archive']],['technology','explains','技術的な条件を理解する方向。',['archive']],['impact','affects','施設停止が周辺に及ぼす影響を見る。',['grid']]],
    evidence:[['satellite','supports','衛星画像は損傷位置を確かめる材料の一つ。',['satellite']],['groundVideo','supports','現地映像は爆発と煙の発生を裏づける。',['visual']],['capturePosition','confirms','位置情報の整合性を検証する。',['visual','satellite']],['sourceNode','context_for','根拠を出所ごとに分離して確認する。',['visual','satellite','grid']],['unknown','context_for','根拠が足りない範囲を同時に確認する。',['visual','government']]],
    satellite:[['captureTime','confirms','撮影時刻と運転低下の時刻が近い。',['satellite','grid']],['damage','supports','画像上の損傷位置を詳しく確認する。',['satellite']],['anotherVideo','confirms','別角度の映像と火災位置が概ね整合する。',['satellite','visual']],['imageConfirmed','confirms','画像から確認可能な範囲を明示する。',['satellite']],['imageUnknown','contradicts','画像だけで原因まで断定する見方を抑制する。',['satellite']],['history','historically_similar_to','損傷形態を過去事例と比較する。今回の事件の証拠ではない。',['satellite','archive']]],
    history:[['history2024','historically_similar_to','重要インフラへの被害という共通点を比較する。今回の原因の証拠ではない。',['archive']],['priorDrone','historically_similar_to','過去の無人機攻撃と比較する。今回の原因は証明しない。',['archive']],['regional','context_for','地域のインフラ被害履歴を背景として見る。',['archive']],['event','context_for','現在の事件へ戻り、背景と証拠を分離して見る。',['archive','visual']]],
    claims:[['governmentClaim','claims','政府が無人機攻撃と主張している。',['government']],['evidence','context_for','主張と独立した観測材料を比較する。',['government','visual']]],
    technology:[['navigation','explains','長距離飛行に関係する航法技術を見る。',['archive']],['event','context_for','技術条件を現在事件の確定事実と分離して見る。',['archive','visual']]],
    impact:[['gridImpact','affects','施設停止が電力系統へ及ぼす影響を見る。',['grid']],['event','context_for','影響予測と現在確認されている事実を分ける。',['grid','visual']]],
    confirmed:[['event','confirms','確認済み範囲を元事件の記述へ戻して見る。',['visual','grid']],['evidence','supports','確認に使える材料をさらに見る。',['visual','satellite']]],
    unknown:[['governmentClaim','contradicts','未確認であることは、政府主張を確認済み事実として扱わない理由になる。',['government']],['evidence','context_for','何が不足しているかを根拠側から確認する。',['visual','satellite']]],
    groundVideo:[['evidence','context_for','映像を他の根拠と並べて確認する。',['visual']],['imageUnknown','context_for','映像だけでは分からない範囲を見る。',['visual']]],
    capturePosition:[['evidence','confirms','位置検証を根拠全体の中で見る。',['visual','satellite']]],
    sourceNode:[['evidence','context_for','情報源を根拠の集合へ戻して見る。',['visual','satellite','grid']]],
    captureTime:[['satellite','confirms','撮影時刻を衛星画像の検証へ戻す。',['satellite','grid']]],
    damage:[['satellite','supports','損傷位置を衛星画像の文脈へ戻す。',['satellite']]],
    anotherVideo:[['satellite','confirms','別映像と衛星画像の整合性を見る。',['visual','satellite']]],
    imageConfirmed:[['satellite','confirms','確認可能範囲を衛星画像へ戻す。',['satellite']]],
    imageUnknown:[['satellite','context_for','画像の限界を衛星画像と一緒に見る。',['satellite']]],
    history2024:[['history','historically_similar_to','過去事例群の中へ戻る。今回事件の証拠ではない。',['archive']]],
    priorDrone:[['history','historically_similar_to','過去攻撃の比較文脈へ戻る。今回事件の証拠ではない。',['archive']]],
    regional:[['history','context_for','地域史を過去比較の中で見る。',['archive']]],
    governmentClaim:[['claims','claims','主張主体の一覧へ戻る。',['government']],['evidence','context_for','主張と観測材料を比較する。',['government','visual']]],
    gridImpact:[['impact','affects','系統影響を波及全体の中で見る。',['grid']]],
    navigation:[['technology','explains','航法を技術文脈全体へ戻す。',['archive']]]
  };
  const positionsPortrait=[[50,17],[23,31],[77,31],[22,67],[78,67],[34,84],[66,84]];
  const positionsLandscape=[[50,15],[20,29],[80,29],[18,68],[82,68],[36,85],[66,85]];
  const views={cards:$('#cardsView'),diveHome:$('#diveHomeView'),focus:$('#focusView'),live:$('#liveView')};
  const state={view:'cards',originScroll:0,current:'event',path:['event'],arrival:null,saved:false,dragging:false};

  function setView(name){Object.values(views).forEach(v=>v.classList.remove('active')); views[name].classList.add('active'); state.view=name; $('#app').classList.toggle('focus-mode',name==='focus'); $$('.dock button').forEach(b=>b.classList.toggle('active',(name==='diveHome'||name==='focus')?b.dataset.nav==='dive':b.dataset.nav===name)); $('#screenTitle').textContent=name==='cards'?'CARDS → DIVE':name==='focus'?'DIVE · FOCUS MAP':name==='diveHome'?'DIVE HOME':'LIVE';}
  function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1100)}

  const card=$('#articleCard'), scroll=$('#articleScroll'); let swipe=null;
  card.addEventListener('pointerdown',e=>{if(e.target.closest('#diveGrab')||state.dragging)return;swipe={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0,lock:null};});
  card.addEventListener('pointermove',e=>{if(!swipe||e.pointerId!==swipe.id||state.dragging)return;swipe.dx=e.clientX-swipe.x;swipe.dy=e.clientY-swipe.y;const ax=Math.abs(swipe.dx),ay=Math.abs(swipe.dy);if(!swipe.lock&&Math.max(ax,ay)>14){swipe.lock=ay>ax*1.18?'vertical':ax>ay*1.18?'horizontal':'pending';}if(swipe.lock==='pending'&&Math.max(ax,ay)>24)swipe.lock=ay>=ax?'vertical':'horizontal';if(swipe.lock==='horizontal')card.style.transform=`translateX(${Math.max(-110,Math.min(110,swipe.dx))}px)`;});
  const endSwipe=e=>{if(!swipe||e.pointerId!==swipe.id)return;const s=swipe;swipe=null;if(s.lock==='horizontal'&&s.dx>76){state.saved=true;$('#saveFeedback').classList.add('show');toast('SAVE · article stays here');setTimeout(()=>$('#saveFeedback').classList.remove('show'),650);}else if(s.lock==='horizontal'&&s.dx<-76){card.style.transition='transform .22s ease';card.style.transform='translateX(-115%)';setTimeout(()=>{toast('NEXT · next article starts at top');card.style.transition='none';card.style.transform='translateX(115%)';requestAnimationFrame(()=>requestAnimationFrame(()=>{card.style.transition='transform .22s ease';card.style.transform='translateX(0)';scroll.scrollTop=0;}));},220);}card.style.transform=s.dx<-76?'translateX(-115%)':'translateX(0)';setTimeout(()=>{if(!state.dragging)card.style.transform='translateX(0)'},260);};
  card.addEventListener('pointerup',endSwipe);card.addEventListener('pointercancel',endSwipe);
  $('#heartButton').addEventListener('click',e=>{e.currentTarget.classList.toggle('on');e.currentTarget.textContent=e.currentTarget.classList.contains('on')?'♥':'♡'});

  const handle=$('#diveGrab'),dock=$('#diveDock'); let hold=null,ghost=null;
  handle.addEventListener('pointerdown',e=>{e.preventDefault();handle.setPointerCapture?.(e.pointerId);hold={id:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,active:false,timer:setTimeout(()=>beginDrag(e.clientX,e.clientY),280)};});
  handle.addEventListener('pointermove',e=>{if(!hold||e.pointerId!==hold.id)return;hold.lastX=e.clientX;hold.lastY=e.clientY;if(!hold.active&&Math.hypot(e.clientX-hold.startX,e.clientY-hold.startY)>10){clearTimeout(hold.timer);hold=null;return;}if(hold?.active){moveGhost(e.clientX,e.clientY);updateDropState(e.clientX,e.clientY);}});
  handle.addEventListener('pointerup',finishDrag);handle.addEventListener('pointercancel',cancelDrag);
  function beginDrag(x,y){if(!hold)return;hold.active=true;state.dragging=true;card.classList.add('drag-armed');dock.classList.add('ready');ghost=document.createElement('div');ghost.className='drag-ghost';ghost.innerHTML='<small>ARTICLE · DIVE</small><strong>沿岸部の発電施設で大規模爆発</strong><span>Drop on DIVE</span>';document.body.appendChild(ghost);moveGhost(hold.lastX||x,hold.lastY||y);navigator.vibrate?.(18);}
  function moveGhost(x,y){if(ghost){ghost.style.left=x+'px';ghost.style.top=y+'px'}}
  function isOverDock(x,y){const r=dock.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top-34&&y<=r.bottom+4}
  function updateDropState(x,y){dock.classList.toggle('hot',isOverDock(x,y))}
  function finishDrag(e){if(!hold||e.pointerId!==hold.id)return;clearTimeout(hold.timer);const active=hold.active,drop=active&&isOverDock(e.clientX,e.clientY);cleanupDrag();if(drop)enterDiveFromArticle();}
  function cancelDrag(){if(!hold)return;clearTimeout(hold.timer);cleanupDrag();}
  function cleanupDrag(){hold=null;state.dragging=false;card.classList.remove('drag-armed');dock.classList.remove('ready','hot');ghost?.remove();ghost=null;}
  function enterDiveFromArticle(){state.originScroll=scroll.scrollTop;state.current='event';state.path=['event'];state.arrival=null;setView('focus');renderMap();toast('ARTICLE → DIVE');}
  $('#accessibleDirectDive').addEventListener('click',enterDiveFromArticle);

  $$('.dock button').forEach(b=>b.addEventListener('click',()=>{if(state.dragging)return;const n=b.dataset.nav;if(n==='dive'){setView('diveHome');}else if(n==='cards'){setView('cards');}else if(n==='live'){setView('live');}}));
  $$('[data-home-node]').forEach(b=>b.addEventListener('click',()=>{state.current=b.dataset.homeNode;state.path=[b.dataset.homeNode];state.arrival=null;setView('focus');renderMap();}));

  function currentGraph(){return graphs[state.current]||[['event','context_for','元の事件へ戻る。',nodes.event.sources]]}
  function layoutPositions(count){const landscape=innerWidth>innerHeight&&innerWidth>=700;return (landscape?positionsLandscape:positionsPortrait).slice(0,count)}
  function renderMap(){
    const layer=$('#nodeLayer'),relLayer=$('#relationLayer'),svg=$('#edgeSvg'),cur=nodes[state.current];layer.innerHTML='';relLayer.innerHTML='';svg.innerHTML='';
    const current=document.createElement('div');current.className='node current';current.innerHTML=`<span class="node-type">${cur.type}</span><span class="node-label">${cur.label}</span><span class="node-question">${cur.question}</span>`;layer.appendChild(current);
    const graph=currentGraph().slice(0,7),pos=layoutPositions(graph.length);
    graph.forEach((edge,i)=>{const [target,relation,explanation,sourceRefs]=edge,n=nodes[target],p=pos[i];const btn=document.createElement('button');btn.className='node';btn.type='button';btn.dataset.node=target;btn.style.left=p[0]+'%';btn.style.top=p[1]+'%';btn.innerHTML=`<span class="node-type">${n.type}<em> · ${relation}</em></span><span class="node-label">${n.label}</span><span class="node-question">${n.question}</span>`;btn.addEventListener('click',()=>selectNode(btn,target,edge));layer.appendChild(btn);const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1','50%');line.setAttribute('y1','50%');line.setAttribute('x2',p[0]+'%');line.setAttribute('y2',p[1]+'%');svg.appendChild(line);});
    renderTrail();$('#focusType').textContent=cur.type;$('#focusLabel').textContent=cur.label;$('#focusQuestion').textContent=cur.question;$('#diveBack').disabled=state.path.length<2;
    const a=$('#arrivalRelation');if(state.arrival){a.hidden=false;a.innerHTML=`from ${nodes[state.arrival.from].label} · <strong>${state.arrival.relation}</strong>`;a.onclick=()=>openRelation(state.arrival.from,state.current,state.arrival.relation,state.arrival.explanation,state.arrival.sources);}else{a.hidden=true;a.onclick=null;}
  }
  function selectNode(btn,target,edge){const [_,relation,explanation,sourceRefs]=edge;if(prefersReduced()){commitNode(target,relation,explanation,sourceRefs);return;}const r=btn.getBoundingClientRect(),canvas=$('#mapCanvas').getBoundingClientRect(),center={x:canvas.left+canvas.width/2,y:canvas.top+canvas.height/2};const clone=btn.cloneNode(true);clone.classList.add('node-motion-clone');Object.assign(clone.style,{position:'fixed',left:r.left+r.width/2+'px',top:r.top+r.height/2+'px',width:r.width+'px',zIndex:300,pointerEvents:'none'});document.body.appendChild(clone);clone.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(${center.x-(r.left+r.width/2)-r.width/2}px,${center.y-(r.top+r.height/2)-r.height/2}px) scale(1.03)`,opacity:.88}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'}).onfinish=()=>{clone.remove();commitNode(target,relation,explanation,sourceRefs)};}
  function commitNode(target,relation,explanation,sourceRefs){const from=state.current;state.current=target;state.path.push(target);state.arrival={from,relation,explanation,sources:sourceRefs};renderMap();}
  function renderTrail(){const t=$('#trail');t.innerHTML='';state.path.forEach((id,i)=>{if(i){const s=document.createElement('span');s.className='sep';s.textContent='›';t.appendChild(s)}const b=document.createElement('button');b.type='button';b.textContent=trailLabel(id);b.addEventListener('click',()=>jumpTrail(i));t.appendChild(b)});requestAnimationFrame(()=>{t.scrollLeft=t.scrollWidth});}
  function trailLabel(id){const n=nodes[id];if(id==='event')return 'Event';if(id==='evidence')return 'Evidence';if(id==='satellite')return 'Satellite imagery';if(id==='history')return 'History';return n.label;}
  function jumpTrail(index){if(index===state.path.length-1)return;state.path=state.path.slice(0,index+1);state.current=state.path[state.path.length-1];state.arrival=null;renderMap();}
  $('#diveBack').addEventListener('click',()=>{if(state.path.length<2)return;state.path.pop();state.current=state.path[state.path.length-1];state.arrival=null;renderMap();});
  $('#returnArticle').addEventListener('click',()=>{setView('cards');requestAnimationFrame(()=>{scroll.scrollTop=state.originScroll;requestAnimationFrame(()=>{scroll.scrollTop=state.originScroll;toast('Returned to exact reading position')})})});
  $('#sourcesButton').addEventListener('click',()=>openSources(nodes[state.current].sources));

  function openRelation(from,to,relation,explanation,sourceRefs){$('#sheetKicker').textContent='RELATION';$('#sheetTitle').textContent=relation;let html=`<p><strong>${nodes[from].label}</strong> → <strong>${nodes[to].label}</strong></p><p>${explanation}</p>`;if(relation==='historically_similar_to')html+='<p class="warning">過去の類似事例です。今回の事件の証拠ではありません。<br><strong>historically_similar_to ≠ supports</strong></p>';html+=sourcesHtml(sourceRefs);openSheet(html);}
  function openSources(refs){$('#sheetKicker').textContent='PROVENANCE';$('#sheetTitle').textContent='Sources';openSheet('<p>現在のNodeに紐づくデモ出典です。実データ接続は今回の範囲外です。</p>'+sourcesHtml(refs));}
  function sourcesHtml(refs=[]){const unique=[...new Set(refs)];return '<div class="source-list">'+unique.map(id=>{const s=sources[id];return s?`<div class="source"><small>${s.type.toUpperCase()} · ${s.time}</small><strong>${s.name}</strong><span>${s.title}</span></div>`:''}).join('')+'</div>'}
  function openSheet(html){$('#sheetBody').innerHTML=html;$('#sheet').classList.add('open');$('#backdrop').classList.add('open');$('#sheet').setAttribute('aria-hidden','false');setTimeout(()=>$('#sheetClose').focus(),50)}
  function closeSheet(){$('#sheet').classList.remove('open');$('#backdrop').classList.remove('open');$('#sheet').setAttribute('aria-hidden','true')}
  $('#sheetClose').addEventListener('click',closeSheet);$('#backdrop').addEventListener('click',closeSheet);
  $('#infoButton').addEventListener('click',()=>{$('#sheetKicker').textContent='DEMO GUIDE';$('#sheetTitle').textContent='Touch the full DIVE flow';openSheet(`<ol class="scenario-list"><li>CARDSを縦に読み、任意の位置へスクロール</li><li>右下のHOLD · DIVEだけを長押し</li><li>浮いたArticleをDockのDIVEへdrop</li><li>EVIDENCE → 衛星画像 → HISTORY</li><li>historically_similar_toをtap</li><li>BACK / TRAILで戻る</li><li>ARTICLEで元スクロール位置へ戻る</li><li>DockのDIVEを普通にtapしてDIVE Homeを見る</li><li>端末回転でPortrait / Landscapeを比較</li></ol><p class="demo-note">Drag開始方式は専用grab affordanceを採用。本文long-pressはtext selectionとREADに競合し、記事末尾のみdragは発見性と任意位置からの探索開始を弱めるため不採用。</p>`)});
  addEventListener('resize',()=>{if(state.view==='focus')renderMap()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
  renderMap();
})();
