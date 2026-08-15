(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const sources = {
    localVideo: { id:'local-video', name:'Coastal Visual Desk', title:'Video verification set: power facility blast', publicationTime:'08:51', sourceType:'visual verification', url:'https://example.invalid/demo/local-video' },
    satelliteDesk: { id:'satellite-desk', name:'Orbital Demo Desk', title:'Post-event satellite frame — coastal power facility', publicationTime:'09:12', sourceType:'satellite imagery', url:'https://example.invalid/demo/satellite' },
    gridOperator: { id:'grid-operator', name:'Regional Grid Operator', title:'Generation status notice', publicationTime:'08:55', sourceType:'official operations notice', url:'https://example.invalid/demo/grid' },
    government: { id:'government', name:'Government Press Office', title:'Statement on coastal facility incident', publicationTime:'08:47', sourceType:'official claim', url:'https://example.invalid/demo/government' },
    archive2024: { id:'archive-2024', name:'Infrastructure Archive', title:'2024 attack on comparable energy facility', publicationTime:'2024-05-19 14:20', sourceType:'historical archive', url:'https://example.invalid/demo/history-2024' },
    regionalArchive: { id:'regional-archive', name:'Regional Security Archive', title:'Infrastructure incidents in the coastal region', publicationTime:'2023-11-02 10:00', sourceType:'historical archive', url:'https://example.invalid/demo/regional-history' }
  };

  const nodes = {
    event: { id:'event', type:'EVENT', category:'event', label:'発電施設爆発', questionLabel:'何が起き、何がまだ分からない？', summary:'爆発と火災は確認。原因と攻撃主体は未確認。', sourceRefs:['localVideo','gridOperator','government'] },
    evidence: { id:'evidence', type:'EVIDENCE', category:'evidence', label:'何が根拠になっている？', questionLabel:'観測できる材料を分けて見る', summary:'映像・衛星画像・位置情報・Sourceを混ぜずに確認する。', sourceRefs:['localVideo','satelliteDesk','gridOperator'] },
    claims: { id:'claims', type:'CLAIMS', category:'claim', label:'誰が何を主張している？', questionLabel:'主張主体を分離する', summary:'政府は無人機攻撃と主張。独立確認とは分けて扱う。', sourceRefs:['government'] },
    confirmed: { id:'confirmed', type:'CONFIRMED', category:'confirmed', label:'何が確認されている？', questionLabel:'合意できる最小事実', summary:'爆発、火災、出力低下は複数情報と整合。', sourceRefs:['localVideo','gridOperator'] },
    unknown: { id:'unknown', type:'UNKNOWN', category:'unknown', label:'まだ分からないこと', questionLabel:'何を確定してはいけない？', summary:'原因、攻撃主体、兵器種、長期損傷は未確認。', sourceRefs:['localVideo','government'] },
    history: { id:'history', type:'HISTORY', category:'history', label:'過去に似たことは？', questionLabel:'似ているが、証拠ではない', summary:'過去事例を比較の文脈として見る。今回の原因の証明には使わない。', sourceRefs:['archive2024','regionalArchive'] },
    technology: { id:'technology', type:'TECHNOLOGY', category:'technology', label:'どういう技術が関係している？', questionLabel:'無人機・航法・防空の条件', summary:'仮に無人機なら必要な技術条件を整理する。', sourceRefs:['regionalArchive'] },
    impact: { id:'impact', type:'IMPACT', category:'impact', label:'この先、何に影響する？', questionLabel:'電力・港湾・価格への波及', summary:'停止期間と代替供給で影響が変わる。', sourceRefs:['gridOperator'] },
    satellite: { id:'satellite', type:'EVIDENCE', category:'evidence', label:'衛星画像', questionLabel:'画像から何が確認できる？', summary:'損傷位置と撮影時刻は確認できるが、爆発原因は画像だけでは確定できない。', sourceRefs:['satelliteDesk'] },
    groundVideo: { id:'ground-video', type:'EVIDENCE', category:'evidence', label:'現地映像', questionLabel:'映像は何を示している？', summary:'爆発と煙は見える。飛来物の種類は不鮮明。', sourceRefs:['localVideo'] },
    capturePosition: { id:'capture-position', type:'EVIDENCE', category:'evidence', label:'撮影位置', questionLabel:'映像の位置は検証できる？', summary:'海岸線と施設配置から撮影地点を概算する。', sourceRefs:['localVideo','satelliteDesk'] },
    sourceNode: { id:'source-node', type:'SOURCE', category:'source', label:'Source', questionLabel:'情報はどこから来た？', summary:'映像・衛星・運転情報・政府声明を別々に保持する。', sourceRefs:['localVideo','satelliteDesk','gridOperator','government'] },
    captureTime: { id:'capture-time', type:'EVIDENCE', category:'evidence', label:'撮影時刻', questionLabel:'時刻は他情報と整合する？', summary:'撮像時刻は運転低下と現地映像の時刻帯に近い。', sourceRefs:['satelliteDesk','gridOperator'] },
    captureSource: { id:'capture-source', type:'SOURCE', category:'source', label:'撮影元', questionLabel:'画像の由来は追える？', summary:'このデモでは衛星画像デスクのメタデータを表示する。', sourceRefs:['satelliteDesk'] },
    damageLocation: { id:'damage-location', type:'EVIDENCE', category:'evidence', label:'損傷位置', questionLabel:'どの設備が損傷している？', summary:'熱源と損傷はタービン棟付近に集中して見える。', sourceRefs:['satelliteDesk'] },
    anotherVideo: { id:'another-video', type:'EVIDENCE', category:'evidence', label:'別映像', questionLabel:'別角度でも整合する？', summary:'別角度の映像でも火災位置が概ね一致する。', sourceRefs:['localVideo'] },
    imageConfirms: { id:'image-confirms', type:'CONFIRMED', category:'confirmed', label:'画像から確認できること', questionLabel:'確認範囲を限定する', summary:'火災位置と外観損傷は画像から確認可能。', sourceRefs:['satelliteDesk'] },
    imageCannotConfirm: { id:'image-cannot-confirm', type:'UNKNOWN', category:'unknown', label:'画像では確認できないこと', questionLabel:'画像の限界は？', summary:'兵器種、攻撃主体、爆発原因は画像だけでは確認できない。', sourceRefs:['satelliteDesk'] },
    history2024: { id:'history-2024', type:'HISTORY', category:'history', label:'2024年 類似施設攻撃', questionLabel:'何が似ていて何が違う？', summary:'重要インフラへの被害という点は似るが、今回事件の証拠ではない。', sourceRefs:['archive2024'] },
    priorDrone: { id:'prior-drone', type:'HISTORY', category:'history', label:'過去の無人機攻撃', questionLabel:'過去の攻撃形態は？', summary:'過去に無人機が使われた事例を比較する。今回の原因は証明しない。', sourceRefs:['archive2024'] },
    regionalInfra: { id:'regional-infra', type:'HISTORY', category:'history', label:'同地域でのインフラ攻撃', questionLabel:'地域的な文脈は？', summary:'同地域のインフラ被害履歴を背景情報として確認する。', sourceRefs:['regionalArchive'] },
    governmentClaim: { id:'government-claim', type:'CLAIM', category:'claim', label:'政府：無人機攻撃', questionLabel:'何を根拠に主張している？', summary:'政府は無人機攻撃と述べるが、公開根拠は限定的。', sourceRefs:['government'] },
    gridEffect: { id:'grid-effect', type:'IMPACT', category:'impact', label:'系統影響', questionLabel:'電力供給に何が起きる？', summary:'停止時間が長いほど予備力と価格への負荷が増える。', sourceRefs:['gridOperator'] },
    navigationTech: { id:'navigation-tech', type:'TECHNOLOGY', category:'technology', label:'航法', questionLabel:'長距離飛行には何が必要？', summary:'衛星航法、慣性航法、画像照合などが考えられる。', sourceRefs:['regionalArchive'] }
  };

  const edges = [
    ['event-evidence','event','evidence','supports','supports','現在事件を理解する根拠群へ接続する。',['localVideo','satelliteDesk','gridOperator']],
    ['event-claims','event','claims','claims','claims','事件について誰が何を主張しているかへ接続する。',['government']],
    ['event-confirmed','event','confirmed','confirms','confirms','複数情報が一致する確認済み範囲へ接続する。',['localVideo','gridOperator']],
    ['event-unknown','event','unknown','context_for','context_for','まだ確定できない範囲を理解の前提として示す。',['government','localVideo']],
    ['event-history','event','history','historically_similar_to','historically_similar_to','過去の類似事例へ比較のため接続する。',['archive2024']],
    ['event-technology','event','technology','explains','explains','技術条件を理解するための説明方向。',['regionalArchive']],
    ['event-impact','event','impact','affects','affects','施設停止が周辺へ及ぼす影響方向。',['gridOperator']],
    ['evidence-satellite','evidence','satellite','supports','supports','衛星画像は被害位置を裏づける材料の一つ。',['satelliteDesk']],
    ['evidence-video','evidence','ground-video','supports','supports','現地映像は爆発・煙の発生を裏づける。',['localVideo']],
    ['evidence-position','evidence','capture-position','confirms','confirms','撮影地点の整合性は映像検証の信頼度を上げる。',['localVideo','satelliteDesk']],
    ['evidence-source','evidence','source-node','context_for','context_for','根拠を出所ごとに分離して確認する。',['localVideo','satelliteDesk','gridOperator']],
    ['evidence-unknown','evidence','unknown','context_for','context_for','根拠が示せない範囲を同時に確認する。',['government','localVideo']],
    ['sat-time','satellite','capture-time','confirms','confirms','撮影時刻と運転低下時刻が近い。',['satelliteDesk','gridOperator']],
    ['sat-source','satellite','capture-source','context_for','context_for','画像の出所情報へ接続する。',['satelliteDesk']],
    ['sat-damage','satellite','damage-location','supports','supports','衛星画像上の損傷位置を詳しく見る。',['satelliteDesk']],
    ['sat-video','satellite','another-video','confirms','confirms','別映像の火災位置と概ね整合する。',['satelliteDesk','localVideo']],
    ['sat-confirm','satellite','image-confirms','confirms','confirms','画像から確認できる範囲を明示する。',['satelliteDesk']],
    ['sat-unknown','satellite','image-cannot-confirm','contradicts','contradicts','画像だけで原因まで断定する見方を抑制する。',['satelliteDesk']],
    ['sat-history','satellite','history','historically_similar_to','historically_similar_to','画像上の被害形態を過去事例と比較する。今回事件の証拠ではない。',['satelliteDesk','archive2024']],
    ['history-2024-edge','history','history-2024','historically_similar_to','historically_similar_to','2024年の類似施設被害を比較する。今回事件の証拠ではない。',['archive2024']],
    ['history-drone-edge','history','prior-drone','historically_similar_to','historically_similar_to','過去の無人機攻撃と比較する。今回事件の証拠ではない。',['archive2024']],
    ['history-regional-edge','history','regional-infra','historically_similar_to','historically_similar_to','同地域のインフラ被害履歴と比較する。今回事件の証拠ではない。',['regionalArchive']],
    ['claims-government','claims','government-claim','claims','claims','政府が無人機攻撃と主張している。',['government']],
    ['government-evidence','government-claim','evidence','context_for','context_for','政府主張と独立根拠を分けて比較する。',['government','localVideo']],
    ['technology-nav','technology','navigation-tech','explains','explains','長距離飛行に関係する航法技術を説明する。',['regionalArchive']],
    ['impact-grid','impact','grid-effect','affects','affects','施設停止が系統運用に影響する。',['gridOperator']],
    ['unknown-claim','unknown','government-claim','contradicts','contradicts','未確認事項が政府主張の確定扱いを妨げる。',['government']]
  ].map(([id,from,to,type,label,explanation,sourceRefs])=>({id,from,to,type,label,explanation,sourceRefs}));

  const views = { cards:$('#cardsView'), live:$('#liveView'), dive:$('#diveView'), saved:$('#savedView') };
  const state = {
    screen:'cards', interactionMode:'normal', originArticleId:null, originCardIndex:0, originScrollPosition:0, originEntryMethod:null,
    rootNodeId:null, currentNodeId:null, visitedPath:[], visibleNodeIds:[], selectedRelationId:null, isRelationSheetOpen:false, dragActivation:'B'
  };
  const runtime = {
    articleIndex:0, liked:new Set(), saved:new Set(), drag:null, gesture:null, suppressClickUntil:0, trailCursor:-1,
    lastSavedScroll:0, renderToken:0, dropCount:0
  };
  const articleQueue = [
    {id:'coastal-power-plant-blast',title:'沿岸部の発電施設で大規模爆発'},
    {id:'next-demo-card',title:'NEXT gesture check · demo card'}
  ];
  const mapPositions = [[50,50],[22,20],[76,20],[82,49],[75,79],[28,80],[18,52],[51,11]];
  const HOLD_MS = 430, MOVE_THRESHOLD = 10, HORIZONTAL_DOMINANCE = 1.22, VERTICAL_DOMINANCE = 1.12;

  function edgeById(id){ return edges.find(edge=>edge.id===id); }
  function nodeById(id){ return Object.values(nodes).find(node=>node.id===id); }
  function outgoing(nodeId){ return edges.filter(edge=>edge.from===nodeId); }
  function sourceByKey(key){ return sources[key]; }
  function currentArticle(){ return articleQueue[runtime.articleIndex]; }

  function setScreen(name,{preserveDive=false}={}){
    state.screen=name;
    Object.entries(views).forEach(([key,el])=>el.classList.toggle('active',key===name));
    $$('.dock-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===name));
    if(name==='cards') requestAnimationFrame(()=>{$('#cardScroll').scrollTop=state.originArticleId===currentArticle().id?state.originScrollPosition:$('#cardScroll').scrollTop;});
    if(name==='dive'&&!preserveDive) showDiveHome({clearOrigin:true});
    updateSavedView();
  }

  function showDiveHome({clearOrigin=false}={}){
    $('#diveHome').classList.remove('hidden'); $('#focusShell').classList.add('hidden');
    state.currentNodeId=null;state.visibleNodeIds=[];state.selectedRelationId=null;runtime.trailCursor=-1;
    if(clearOrigin){state.originArticleId=null;state.originCardIndex=0;state.originScrollPosition=0;state.originEntryMethod=null;}
  }

  function startFocus(rootNodeId,{originEntryMethod='home',resetPath=true}={}){
    state.rootNodeId=rootNodeId; state.currentNodeId=rootNodeId; state.originEntryMethod=originEntryMethod;
    if(resetPath){state.visitedPath=[rootNodeId];runtime.trailCursor=0;}
    $('#diveHome').classList.add('hidden');$('#focusShell').classList.remove('hidden');
    setScreen('dive',{preserveDive:true}); updateReturnLabel(); renderFocus({initial:true});
  }

  function updateReturnLabel(){ $('#articleReturn').textContent=state.originArticleId?'← ARTICLE':'← DIVE HOME'; }
  function visibleEdgesFor(nodeId){ return outgoing(nodeId).slice(0,7); }

  function renderFocus({initial=false}={}){
    const token=++runtime.renderToken; const current=nodeById(state.currentNodeId);if(!current)return;
    const currentEdges=visibleEdgesFor(current.id); state.visibleNodeIds=[current.id,...currentEdges.map(edge=>edge.to)];
    const layer=$('#nodeLayer');layer.innerHTML='';
    state.visibleNodeIds.forEach((id,index)=>{
      const node=nodeById(id);if(!node)return;
      const button=document.createElement('button'); button.type='button';
      button.className=`map-node ${index===0?'center ':''}${initial?'entering':''}`;
      button.dataset.nodeId=id; button.style.left=`${mapPositions[index][0]}%`; button.style.top=`${mapPositions[index][1]}%`;
      button.innerHTML=`<small>${node.type}</small><strong>${node.label}</strong><span>${node.questionLabel}</span>`;
      if(index>0)button.addEventListener('click',()=>selectNode(id)); layer.appendChild(button);
    });
    renderEdges(currentEdges);renderTrail();
    $('#focusType').textContent=current.type;$('#focusLabel').textContent=current.label;$('#focusQuestion').textContent=current.questionLabel;$('#provenanceCount').textContent=String(current.sourceRefs.length);
    requestAnimationFrame(()=>{if(token===runtime.renderToken)$$('.map-node.entering').forEach(el=>el.classList.remove('entering'));});
  }

  function renderEdges(currentEdges){
    const svg=$('#edgeLayer'),map=$('#focusMap');svg.innerHTML='';
    const width=map.clientWidth||390,height=map.clientHeight||590;svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const cx=width*.5,cy=height*.5;
    currentEdges.forEach((edge,index)=>{
      const pos=mapPositions[index+1];if(!pos)return;
      const x=width*pos[0]/100,y=height*pos[1]/100,mx=(cx+x)/2,my=(cy+y)/2,labelWidth=clamp(edge.label.length*5.8+18,58,112);
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.classList.add('edge-group');g.dataset.edgeId=edge.id;
      g.innerHTML=`<line class="edge-line" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/><line class="edge-hit" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/><rect class="edge-label-bg" style="pointer-events:all" x="${mx-labelWidth/2}" y="${my-9}" width="${labelWidth}" height="18" rx="1"/><text class="edge-label" style="pointer-events:all" x="${mx}" y="${my+3}" text-anchor="middle">${edge.label}</text>`;
      g.addEventListener('click',()=>openRelation(edge.id));svg.appendChild(g);
    });
  }

  function selectNode(nodeId){
    if(state.interactionMode!=='normal'||nodeId===state.currentNodeId)return;
    const target=$(`.map-node[data-node-id="${CSS.escape(nodeId)}"]`),center=$('.map-node.center');
    $$('.map-node').forEach(node=>{if(node!==target&&node!==center)node.style.opacity='.12';});
    if(target){target.classList.add('selected','chosen');target.style.left='50%';target.style.top='50%';target.style.zIndex='7';}
    if(center){center.style.opacity='.1';center.style.transform='translate(-50%,-50%) scale(.96)';}
    setTimeout(()=>{
      state.currentNodeId=nodeId;
      if(runtime.trailCursor<state.visitedPath.length-1)state.visitedPath=state.visitedPath.slice(0,runtime.trailCursor+1);
      if(state.visitedPath[state.visitedPath.length-1]!==nodeId)state.visitedPath.push(nodeId);
      runtime.trailCursor=state.visitedPath.length-1;renderFocus();
    },360);
  }

  function renderTrail(){
    const trail=$('#diveTrail');trail.innerHTML='';
    state.visitedPath.forEach((id,index)=>{
      const node=nodeById(id);if(!node)return;
      const button=document.createElement('button');button.type='button';button.className=`trail-button ${index===runtime.trailCursor?'current':''}`;button.textContent=node.label;button.addEventListener('click',()=>jumpTrail(index));trail.appendChild(button);
      if(index<state.visitedPath.length-1){const sep=document.createElement('span');sep.className='trail-sep';sep.textContent='›';trail.appendChild(sep);}
    });
    requestAnimationFrame(()=>{trail.scrollLeft=Math.max(0,trail.scrollWidth-trail.clientWidth);});
  }

  function jumpTrail(index){ if(index<0||index>=state.visitedPath.length)return;runtime.trailCursor=index;state.currentNodeId=state.visitedPath[index];renderFocus(); }
  function backDive(){ if(runtime.trailCursor>0){jumpTrail(runtime.trailCursor-1);return;}if(state.originArticleId){returnToArticle();return;}showDiveHome(); }

  function openRelation(edgeId){
    const edge=edgeById(edgeId);if(!edge)return;
    state.selectedRelationId=edgeId;state.isRelationSheetOpen=true;$('#relationSheetTitle').textContent=edge.label;$('#relationSheetExplanation').textContent=edge.explanation;
    $('#historyWarning').classList.toggle('hidden',edge.type!=='historically_similar_to');renderSourceList($('#relationSources'),edge.sourceRefs);openSheet($('#relationSheet'));
  }

  function openProvenance(){ const node=nodeById(state.currentNodeId);if(!node)return;$('#provenanceTitle').textContent=`${node.label} · Sources`;renderSourceList($('#provenanceSources'),node.sourceRefs);openSheet($('#provenanceSheet')); }

  function renderSourceList(container,refs){
    container.innerHTML='';refs.map(sourceByKey).filter(Boolean).forEach(source=>{
      const card=document.createElement('div');card.className='source-card';
      card.innerHTML=`<small>${source.sourceType.toUpperCase()}</small><strong>${source.name}</strong><span>${source.title}</span><span>${source.publicationTime}</span><a href="${source.url}" target="_blank" rel="noopener">URL PLACEHOLDER ↗</a>`;container.appendChild(card);
    });
  }

  function openSheet(sheet){ $$('.bottom-sheet.open').forEach(el=>el.classList.remove('open'));$('#sheetBackdrop').classList.add('show');$('#sheetBackdrop').setAttribute('aria-hidden','false');sheet.classList.add('open');sheet.setAttribute('aria-hidden','false'); }
  function closeSheets(){ $$('.bottom-sheet.open').forEach(el=>{el.classList.remove('open');el.setAttribute('aria-hidden','true');});$('#sheetBackdrop').classList.remove('show');$('#sheetBackdrop').setAttribute('aria-hidden','true');state.isRelationSheetOpen=false; }

  function recordOrigin(method){ state.originArticleId=currentArticle().id;state.originCardIndex=runtime.articleIndex;state.originScrollPosition=$('#cardScroll').scrollTop;state.originEntryMethod=method; }
  function returnToArticle(){
    const index=articleQueue.findIndex(a=>a.id===state.originArticleId);if(index>=0&&index!==runtime.articleIndex){runtime.articleIndex=index;renderArticle();}
    setScreen('cards');requestAnimationFrame(()=>{$('#cardScroll').scrollTop=state.originScrollPosition;});
  }

  function renderArticle(){
    const article=currentArticle();$('#articleCard').dataset.articleId=article.id;
    if(article.id==='coastal-power-plant-blast'){
      $('#articleCard').classList.remove('secondary');$('.cover h1').textContent='沿岸部の発電施設で大規模爆発';$('.cover-copy p').textContent='政府は無人機攻撃と発表したが、原因は独立確認されていない。爆発と施設被害は複数の映像と運転情報で確認できる一方、攻撃主体と手段は未確認のまま。';$('#articleBody').style.display='block';
    }else{
      $('#articleCard').classList.add('secondary');$('.cover h1').textContent='NEXT gesture check · demo card';$('.cover-copy p').textContent='このカードはNEXT後のscrollTop=0とgesture resetを確認するための比較用placeholderです。';$('#articleBody').style.display='none';
    }
    $('#likeButton').classList.toggle('active',runtime.liked.has(article.id));$('#cardScroll').scrollTop=0;
  }

  function commitNext(){
    const card=$('#articleCard');card.style.transition='transform .28s var(--ease),opacity .22s linear';card.style.transform='translate3d(-112%,0,0)';card.style.opacity='.08';
    setTimeout(()=>{runtime.articleIndex=(runtime.articleIndex+1)%articleQueue.length;renderArticle();card.style.transition='none';card.style.transform='translate3d(12%,0,0)';card.style.opacity='0';requestAnimationFrame(()=>requestAnimationFrame(()=>{card.style.transition='transform .3s var(--ease),opacity .2s linear';card.style.transform='translate3d(0,0,0)';card.style.opacity='1';$('#cardsStage').classList.remove('nexting');}));},230);
  }

  function commitSave(){
    const article=currentArticle(),y=$('#cardScroll').scrollTop;runtime.saved.add(article.id);runtime.lastSavedScroll=y;updateSavedView();
    const card=$('#articleCard');card.style.transition='transform .26s var(--ease)';card.style.transform='translate3d(0,0,0)';card.classList.add('saving');card.style.setProperty('--save-progress','1');
    setTimeout(()=>{card.classList.remove('saving');card.style.removeProperty('--save-progress');card.style.transition='';$('#cardScroll').scrollTop=y;},300);
  }

  function updateSavedView(){ const saved=runtime.saved.has('coastal-power-plant-blast');$('#savedEmpty').classList.toggle('hidden',saved);$('#savedItem').classList.toggle('hidden',!saved); }
  function toggleLike(){ const id=currentArticle().id;if(runtime.liked.has(id))runtime.liked.delete(id);else runtime.liked.add(id);const button=$('#likeButton');button.classList.toggle('active',runtime.liked.has(id));button.classList.remove('pulse');void button.offsetWidth;button.classList.add('pulse');setTimeout(()=>button.classList.remove('pulse'),340); }

  function updateGestureCard(dx){
    const card=$('#articleCard'),width=card.clientWidth||390,damped=dx*.92;card.style.transition='none';card.style.transform=`translate3d(${damped}px,0,0)`;
    const progress=clamp(Math.abs(dx)/(width*.34),0,1);if(dx<0){$('#cardsStage').classList.add('nexting');card.classList.remove('saving');}else{card.classList.add('saving');$('#cardsStage').classList.remove('nexting');card.style.setProperty('--save-progress',String(progress));}
  }
  function resetGestureCard(){ const card=$('#articleCard');card.style.transition='transform .26s var(--ease)';card.style.transform='translate3d(0,0,0)';$('#cardsStage').classList.remove('nexting');card.classList.remove('saving');card.style.removeProperty('--save-progress');setTimeout(()=>card.style.transition='',280); }
  function canArticleGesture(target){ return !target.closest('#dragHandle,.like-button,.article-source'); }
  function createGesture(pointerEvent){ return {pointerId:pointerEvent.pointerId,startX:pointerEvent.clientX,startY:pointerEvent.clientY,lastX:pointerEvent.clientX,lastY:pointerEvent.clientY,startTime:performance.now(),lock:null}; }

  function startHold(event,source){ cancelHold();const hold={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,lastX:event.clientX,lastY:event.clientY,source,timer:null,activated:false};hold.timer=setTimeout(()=>activateDiveDrag(hold),HOLD_MS);runtime.drag=hold; }
  function cancelHold(){ if(runtime.drag?.timer)clearTimeout(runtime.drag.timer);if(runtime.drag&&!runtime.drag.activated)runtime.drag=null; }

  function activateDiveDrag(hold){
    if(!runtime.drag||runtime.drag!==hold||state.interactionMode!=='normal')return;
    hold.activated=true;state.interactionMode='dive-drag';state.originScrollPosition=$('#cardScroll').scrollTop;$('#articleCard').classList.add('drag-source');$('#cardScroll').style.overflowY='hidden';
    $('#dragLayer').classList.add('active');$('#dragLayer').setAttribute('aria-hidden','false');$('#diveDock').classList.add('drop-ready');$('#dragHandle').classList.add('holding');runtime.gesture=null;updateDragPosition(hold.lastX,hold.lastY);$('#gestureStatus').textContent='DIVE DRAG';
  }
  function updateDragPosition(x,y){ const card=$('#dragCard'),w=Math.min(innerWidth*.78,330),h=126;card.style.transform=`translate3d(${x-w/2}px,${y-h*.48}px,0)`;$('#diveDock').classList.toggle('over',isOverDiveDrop(x,y)); }
  function isOverDiveDrop(x,y){ const r=$('#diveDock').getBoundingClientRect();return x>=r.left-16&&x<=r.right+16&&y>=r.top-30&&y<=r.bottom+10; }

  function finishDiveDrag(x,y){
    if(state.interactionMode!=='dive-drag')return;const dropped=isOverDiveDrop(x,y),scroll=state.originScrollPosition;$('#diveDock').classList.remove('drop-ready','over');$('#dragHandle').classList.remove('holding');
    if(dropped){recordOrigin(`drag-${state.dragActivation}`);runtime.dropCount+=1;$('#dragCard').classList.add('dropping');setTimeout(()=>{cleanupDrag(scroll);state.rootNodeId='event';state.currentNodeId='event';state.visitedPath=['event'];runtime.trailCursor=0;startFocus('event',{originEntryMethod:`drag-${state.dragActivation}`,resetPath:false});},180);}
    else{cleanupDrag(scroll);$('#gestureStatus').textContent='DRAG CANCELLED';setTimeout(()=>$('#gestureStatus').textContent='',520);}
  }
  function cleanupDrag(scroll){ state.interactionMode='normal';$('#dragLayer').classList.remove('active');$('#dragLayer').setAttribute('aria-hidden','true');$('#dragCard').classList.remove('dropping');$('#articleCard').classList.remove('drag-source');$('#cardScroll').style.overflowY='auto';$('#cardScroll').scrollTop=scroll;$('#dragCard').style.transform='translate3d(-999px,-999px,0)';runtime.drag=null; }

  function handlePointerDown(event){
    if(state.screen!=='cards'||state.interactionMode!=='normal')return;const target=event.target,mode=state.dragActivation;
    if(mode==='B'&&target.closest('#dragHandle')){startHold(event,'handle');return;}if(mode==='C'&&target.closest('#diveDock')){startHold(event,'dock');return;}
    if(mode==='A'&&target.closest('#articleCard')&&!target.closest('button,a,input,textarea,select'))startHold(event,'body');
    if(target.closest('#articleCard')&&canArticleGesture(target))runtime.gesture=createGesture(event);
  }

  function handlePointerMove(event){
    const hold=runtime.drag;
    if(hold&&hold.pointerId===event.pointerId){hold.lastX=event.clientX;hold.lastY=event.clientY;const moved=Math.hypot(event.clientX-hold.startX,event.clientY-hold.startY);if(!hold.activated&&moved>MOVE_THRESHOLD){clearTimeout(hold.timer);if(hold.source!=='body')runtime.drag=null;}if(hold.activated){event.preventDefault();updateDragPosition(event.clientX,event.clientY);return;}}
    const g=runtime.gesture;if(!g||g.pointerId!==event.pointerId||state.interactionMode!=='normal')return;
    const dx=event.clientX-g.startX,dy=event.clientY-g.startY;g.lastX=event.clientX;g.lastY=event.clientY;const distance=Math.hypot(dx,dy);
    if(!g.lock&&distance>=MOVE_THRESHOLD){const ax=Math.abs(dx),ay=Math.abs(dy);if(ay>ax*VERTICAL_DOMINANCE){g.lock='vertical';cancelHold();}else if(ax>ay*HORIZONTAL_DOMINANCE){g.lock='horizontal';cancelHold();try{$('#articleCard').setPointerCapture(event.pointerId);}catch{}}}
    if(g.lock==='horizontal'){event.preventDefault();updateGestureCard(dx);}
  }

  function handlePointerUp(event){
    const hold=runtime.drag;
    if(hold&&hold.pointerId===event.pointerId){if(hold.timer)clearTimeout(hold.timer);if(hold.activated){event.preventDefault();runtime.suppressClickUntil=performance.now()+500;finishDiveDrag(event.clientX,event.clientY);return;}runtime.drag=null;}
    const g=runtime.gesture;if(!g||g.pointerId!==event.pointerId)return;runtime.gesture=null;if(g.lock!=='horizontal'){resetGestureCard();return;}
    const dx=event.clientX-g.startX,dt=Math.max(1,performance.now()-g.startTime),vx=dx/dt,commit=Math.abs(dx)>82||Math.abs(vx)>.52;if(!commit){resetGestureCard();return;}if(dx<0)commitNext();else commitSave();runtime.suppressClickUntil=performance.now()+380;
  }

  function handlePointerCancel(event){ if(runtime.drag?.pointerId===event.pointerId){if(runtime.drag.timer)clearTimeout(runtime.drag.timer);if(runtime.drag.activated)cleanupDrag(state.originScrollPosition);runtime.drag=null;}if(runtime.gesture?.pointerId===event.pointerId){runtime.gesture=null;resetGestureCard();} }
  function setActivation(mode){ if(!['A','B','C'].includes(mode))return;state.dragActivation=mode;$('#activationBadge').textContent=mode;closeSheets();$('#gestureStatus').textContent=`DRAG MODE ${mode}`;setTimeout(()=>$('#gestureStatus').textContent='',650); }

  function dockClick(event){ const button=event.target.closest('.dock-item');if(!button||performance.now()<runtime.suppressClickUntil)return;const view=button.dataset.view;if(view==='dive'){setScreen('dive');return;}setScreen(view); }
  function articleSourceClick(){ if(performance.now()<runtime.suppressClickUntil)return;$('#provenanceTitle').textContent='Article · Sources';renderSourceList($('#provenanceSources'),['localVideo','gridOperator','government']);openSheet($('#provenanceSheet')); }

  function setup(){
    const shell=$('#demoShell');shell.addEventListener('pointerdown',handlePointerDown);shell.addEventListener('pointermove',handlePointerMove,{passive:false});shell.addEventListener('pointerup',handlePointerUp);shell.addEventListener('pointercancel',handlePointerCancel);
    $('#editorialDock').addEventListener('click',dockClick);$('#likeButton').addEventListener('click',()=>{if(performance.now()>=runtime.suppressClickUntil)toggleLike();});$('#articleSource').addEventListener('click',articleSourceClick);
    $('#savedItem').addEventListener('click',()=>{runtime.articleIndex=0;renderArticle();setScreen('cards');});$('#diveBack').addEventListener('click',backDive);$('#articleReturn').addEventListener('click',()=>state.originArticleId?returnToArticle():showDiveHome());$('#provenanceOpen').addEventListener('click',openProvenance);
    $('#sheetBackdrop').addEventListener('click',closeSheets);$$('[data-sheet-close]').forEach(button=>button.addEventListener('click',closeSheets));$('#demoControlOpen').addEventListener('click',()=>openSheet($('#demoControls')));$$('input[name="activation"]').forEach(input=>input.addEventListener('change',()=>setActivation(input.value)));$$('[data-home-node]').forEach(button=>button.addEventListener('click',()=>startFocus(button.dataset.homeNode,{originEntryMethod:'home'})));window.addEventListener('resize',()=>{if(state.currentNodeId)renderFocus();});updateSavedView();
  }

  setup();
  window.__DIVE_DEMO__={state,runtime,nodes,edges,sources,selectNode,jumpTrail,openRelation,returnToArticle,setActivation,startFocus};
})();
