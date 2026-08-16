(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const store = new DiveSessionStore();
  const explorer = new FixtureExplorationAdapter();
  const engine = new DiveSessionEngine(store, explorer);
  const ui = { view:'article', lastArticleScroll:0 };
  Object.defineProperty(ui,'session',{get:()=>engine.session,set:v=>engine.session=v});
  Object.defineProperty(ui,'draft',{get:()=>engine.draft,set:v=>engine.draft=v});

  const views = { article:$('#articleView'), home:$('#homeView'), dive:$('#diveView') };
  const articleScroll = $('#articleScroll');

  function nowIso(){ return new Date().toISOString(); }
  function uid(prefix){ return `${prefix}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2,8)}`; }
  function escapeHtml(v=''){ return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function formatAgo(iso){
    const d = Date.now() - new Date(iso).getTime();
    if (d < 60000) return 'たった今';
    if (d < 3600000) return `${Math.max(1,Math.round(d/60000))}分前`;
    if (d < 86400000) return `${Math.round(d/3600000)}時間前`;
    return `${Math.round(d/86400000)}日前`;
  }
  function formatDuration(ms){
    const mins = Math.max(1, Math.round(ms/60000));
    return mins < 60 ? `約${mins}分` : `約${Math.floor(mins/60)}時間${mins%60 ? `${mins%60}分` : ''}`;
  }
  function toast(text){ const el=$('#toast'); el.textContent=text; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),1300); }

  function startTiming(){ if(ui.view==='dive') engine.activate(); }
  function stopTiming(){ engine.deactivate(); }
  async function persistSession(force=false){ await engine.persist(force); if(ui.view==='dive') engine.activate(); }
  document.addEventListener('visibilitychange', async()=>{ if(document.hidden){ engine.deactivate(); if(engine.session && !engine.draft) await store.put(engine.session); } else startTiming(); });
  window.addEventListener('beforeunload', ()=>engine.deactivate());

  function setView(name){
    stopTiming();
    Object.entries(views).forEach(([key,el])=>el.classList.toggle('active',key===name));
    ui.view=name;
    $('#cardsDock').classList.toggle('active',name==='article');
    $('#diveDock').classList.toggle('active',name==='home'||name==='dive');
    $('#backButton').hidden = name==='article';
    $('#topKicker').textContent = name==='article'?'CARDS':name==='home'?'DIVE':'DIVE SESSION';
    $('#topTitle').textContent = name==='article'?'Article':name==='home'?'Continue / Recent':'Exploration';
    $('#articleDiveQuick').hidden = name!=='article';
    startTiming();
  }

  async function seedFixtureSessions(){
    const all=await store.all();
    if(all.length) return;
    const base=Date.now()-86400000;
    const make=(id,title,nodeId,minutes,saveCount,openCount,offset)=>{
      const root=`${id}:root`, step=`${id}:step`;
      return {
        id, isFixtureSeed:true,
        anchor:{type:'article',id:`fixture-${id}`,label:title,originArticleId:`fixture-${id}`,originScrollPosition:420},
        startedAt:new Date(base-offset).toISOString(), lastActiveAt:new Date(base/1+offset).toISOString(), activeDurationMs:minutes*60000,
        currentStepId:step,
        steps:[{id:root,parentStepId:null,nodeId:'event',viaRelationId:null,openedAt:new Date(base-offset).toISOString()},{id:step,parentStepId:root,nodeId,viaRelationId:null,openedAt:new Date(base-offset+60000).toISOString()}],
        savedDiscoveries:Array.from({length:saveCount},(_,i)=>({id:`${id}:sd${i}`,sessionId:id,nodeId,relationId:null,savedAt:new Date(base-offset+120000+i).toISOString(),routeStepId:step,sourceIds:[],evidenceIds:[]})),
        openQuestions:Array.from({length:openCount},(_,i)=>({id:`${id}:oq${i}`,sessionId:id,text:'以前の探索であとから確認したいと明示して残した問い。',createdAt:new Date(base-offset+180000+i).toISOString(),linkedNodeIds:[nodeId],linkedRelationIds:[],state:'open'})),
        state:'archived'
      };
    };
    await store.put(make('fixture:energy','欧州の送電網障害と越境電力取引','impact',11,2,1,7200000));
    await store.put(make('fixture:drone','長距離無人システムの航法とインフラ防護','technology',7,1,0,3600000));
  }

  async function beginDiveFromArticle(){
    ui.lastArticleScroll=articleScroll.scrollTop;
    await engine.createFromAnchor({type:'article',id:'article:coastal-power-blast',label:'沿岸部の発電施設で大規模爆発、政府は無人機攻撃と主張',originArticleId:'article:coastal-power-blast',originScrollPosition:ui.lastArticleScroll});
    setView('dive'); renderDive();
  }

  function currentStep(){ return engine.currentStep(); }
  function currentNode(){ return engine.currentNode(); }
  function parentStep(step=currentStep()){ return engine.parentStep(step); }
  function trailSteps(){ return engine.trailSteps(); }

  async function moveTo(relation){ await engine.move(relation); renderDive(); }
  async function backOne(){ if(await engine.back()) renderDive(); }
  async function jumpHistory(stepId){ if(await engine.jump(stepId)) renderDive(); }

  function renderTrail(){
    const trail=$('#trail'); trail.innerHTML='';
    trailSteps().forEach((step,i)=>{
      if(i){ const sep=document.createElement('span'); sep.textContent='›'; sep.className='trail-sep'; trail.appendChild(sep); }
      const b=document.createElement('button'); b.type='button'; b.textContent=explorer.getNode(step.nodeId)?.type==='EVENT'?'Event':explorer.getNode(step.nodeId)?.title || step.nodeId;
      b.addEventListener('click',()=>jumpHistory(step.id)); trail.appendChild(b);
    });
    requestAnimationFrame(()=>trail.scrollLeft=trail.scrollWidth);
  }

  function renderDirections(){
    const list=$('#directionsList'); list.innerHTML='';
    const node=currentNode();
    explorer.getDirections(node.id).slice(0,7).forEach(rel=>{
      const to=explorer.getNode(rel.toNodeId); const row=document.createElement('div'); row.className='direction-row';
      row.innerHTML=`<button class="direction-main"><span class="direction-type">${escapeHtml(to.type)}</span><strong>${escapeHtml(to.title)}</strong><em>${escapeHtml(to.question)}</em></button><button class="connection-button" aria-label="接続理由を見る: ${escapeHtml(to.title)}"><small>${escapeHtml(rel.relationType)}</small><span>CONNECTION</span></button>`;
      row.querySelector('.direction-main').addEventListener('click',()=>moveTo(rel));
      row.querySelector('.connection-button').addEventListener('click',()=>openRelation(rel));
      list.appendChild(row);
    });
  }

  function childrenOf(stepId){ return engine.childrenOf(stepId); }
  function renderHistoryTree(){
    const root=ui.session.steps.find(s=>!s.parentStepId); const wrap=$('#historyTree'); wrap.innerHTML='';
    function walk(step,depth){
      const node=explorer.getNode(step.nodeId); const item=document.createElement('button'); item.className='history-step'; item.style.setProperty('--depth',depth); item.classList.toggle('current',step.id===ui.session.currentStepId);
      const rel=step.viaRelationId?explorer.getRelation(step.viaRelationId):null;
      item.innerHTML=`<span>${escapeHtml(node?.type||'NODE')}</span><strong>${escapeHtml(node?.title||step.nodeId)}</strong>${rel?`<em>${escapeHtml(rel.relationType)}</em>`:''}`;
      item.addEventListener('click',()=>jumpHistory(step.id)); wrap.appendChild(item);
      childrenOf(step.id).forEach(ch=>walk(ch,depth+1));
    }
    if(root) walk(root,0);
    $('#historyCount').textContent=`${ui.session.steps.length} steps`;
  }

  function renderSavedAndOpen(){
    $('#savedCount').textContent=`${ui.session.savedDiscoveries.length}`;
    $('#openCount').textContent=`${ui.session.openQuestions.filter(q=>q.state==='open').length}`;
    const saved=$('#savedList'); saved.innerHTML='';
    if(!ui.session.savedDiscoveries.length) saved.innerHTML='<p class="empty-note">まだSAVEしていません</p>';
    ui.session.savedDiscoveries.forEach(d=>{
      const node=d.nodeId?explorer.getNode(d.nodeId):null, rel=d.relationId?explorer.getRelation(d.relationId):null;
      const el=document.createElement('button'); el.className='compact-item'; el.innerHTML=`<strong>${escapeHtml(node?.title || 'Connection')}</strong><span>${escapeHtml(rel?.relationType || 'saved node')}</span>`;
      el.addEventListener('click',()=>jumpHistory(d.routeStepId)); saved.appendChild(el);
    });
    const open=$('#openList'); open.innerHTML='';
    const questions=ui.session.openQuestions.filter(q=>q.state==='open');
    if(!questions.length) open.innerHTML='<p class="empty-note">残した問いはありません</p>';
    questions.forEach(q=>{ const el=document.createElement('button'); el.className='compact-item'; el.innerHTML=`<strong>${escapeHtml(q.text)}</strong><span>OPEN QUESTION</span>`; const linkedStep=ui.session.steps.find(s=>q.linkedNodeIds.includes(s.nodeId)); if(linkedStep) el.addEventListener('click',()=>jumpHistory(linkedStep.id)); open.appendChild(el); });
  }

  function renderDive(){
    if(!ui.session) return;
    const node=currentNode(), step=currentStep(), relation=step.viaRelationId?explorer.getRelation(step.viaRelationId):null;
    $('#sidebarAnchorTitle').textContent=ui.session.anchor.label;
    $('#focusType').textContent=node.type; $('#focusTitle').textContent=node.title; $('#focusQuestion').textContent=node.question;
    const arrival=$('#arrivalRelation');
    if(relation){ arrival.hidden=false; arrival.innerHTML=`<span>${escapeHtml(explorer.relationPlain(relation.relationType))}</span><strong>${escapeHtml(relation.relationType)}</strong>`; arrival.onclick=()=>openRelation(relation); }
    else { arrival.hidden=true; arrival.onclick=null; }
    $('#saveDiscoveryButton').disabled = ui.session.savedDiscoveries.some(d=>d.routeStepId===step.id && d.relationId===(relation?.id||null));
    $('#saveDiscoveryButton').textContent=$('#saveDiscoveryButton').disabled?'SAVED':'この発見をSAVE';
    $('#keepQuestionButton').disabled = ui.session.openQuestions.some(q=>q.state==='open'&&q.linkedNodeIds.includes(node.id));
    $('#keepQuestionButton').textContent=$('#keepQuestionButton').disabled?'OPEN QUESTIONに保存済み':'問いをあとで確認';
    renderTrail(); renderDirections(); renderHistoryTree(); renderSavedAndOpen();
  }

  function sourceHtml(sourceIds){
    return sourceIds.map(id=>explorer.getSource(id)).filter(Boolean).map(s=>`<div class="source-item"><small>${escapeHtml(s.type)}</small><strong>${escapeHtml(s.name)}</strong><p>${escapeHtml(s.title)}</p><span>${escapeHtml(s.publishedAt)}</span></div>`).join('');
  }
  function openRelation(rel){
    const from=explorer.getNode(rel.fromNodeId), to=explorer.getNode(rel.toNodeId);
    $('#sheetKicker').textContent='CONNECTION / PROVENANCE'; $('#sheetTitle').textContent=rel.relationType;
    const warning=rel.relationType==='historically_similar_to'?'<p class="epistemic-warning">これは歴史的な類似です。今回の事件を支持する証拠ではありません。</p>':'';
    $('#sheetBody').innerHTML=`<p class="relation-readable"><strong>${escapeHtml(explorer.relationPlain(rel.relationType))}</strong></p>${warning}<p><b>${escapeHtml(from.title)}</b> → <b>${escapeHtml(to.title)}</b></p><p>${escapeHtml(rel.explanation)}</p><div class="source-stack"><small>SOURCE / PROVENANCE</small>${sourceHtml(rel.sourceIds)}</div>`;
    openSheet();
  }

  function openQuestionSheet(){
    const node=currentNode(), suggestion=explorer.getSuggestedOpenQuestion(node.id);
    $('#sheetKicker').textContent='OPEN QUESTION'; $('#sheetTitle').textContent='あとで確認したい問い';
    $('#sheetBody').innerHTML=`<p>UNKNOWNとは別です。これは、あなたが後で戻るために明示的に残すSession itemです。</p><textarea id="questionInput" class="question-input" rows="5">${escapeHtml(suggestion)}</textarea><button id="confirmQuestion" class="primary-action sheet-action">KEEP OPEN QUESTION</button>`;
    openSheet();
    $('#confirmQuestion').addEventListener('click',async()=>{
      const text=$('#questionInput').value.trim(); if(!text) return;
      await engine.keepOpenQuestion(text); closeSheet(); renderDive(); toast('Open Questionを残しました');
    });
  }

  async function saveDiscovery(){ await engine.saveCurrentDiscovery(); renderDive(); toast('DiscoveryをSAVEしました'); }

  function openSheet(){ $('#backdrop').hidden=false; $('#sheet').classList.add('open'); $('#sheet').setAttribute('aria-hidden','false'); setTimeout(()=>$('#sheetClose').focus(),0); }
  function closeSheet(){ $('#sheet').classList.remove('open'); $('#sheet').setAttribute('aria-hidden','true'); setTimeout(()=>$('#backdrop').hidden=true,180); }

  async function leaveDive(){ if(!ui.session) return; await engine.pause(); setView('home'); await renderHome(); }
  async function continueSession(id){ if(!await engine.resume(id)) return; setView('dive'); renderDive(); engine.activate(); }

  async function renderHome(){
    const all=await store.all();
    const nonFixtures=all.filter(s=>!s.isFixtureSeed); const latest=nonFixtures.find(s=>s.state==='paused'||s.state==='active') || null;
    $('#continueSection').hidden=!latest;
    if(latest){ $('#continueButton').innerHTML=sessionRowHtml(latest,true); $('#continueButton').onclick=()=>continueSession(latest.id); }
    const recent=$('#recentList'); recent.innerHTML='';
    all.slice(0,6).forEach(s=>{ const b=document.createElement('button'); b.className='session-row'; b.innerHTML=sessionRowHtml(s,false); b.addEventListener('click',()=>continueSession(s.id)); recent.appendChild(b); });
  }
  function sessionRowHtml(s,isContinue){
    const step=s.steps.find(x=>x.id===s.currentStepId), node=step?explorer.getNode(step.nodeId):null, open=s.openQuestions.filter(q=>q.state==='open').length;
    return `<span class="session-row-kicker">${s.isFixtureSeed?'DEMO SESSION':isContinue?'RESUME':'DIVE SESSION'}</span><strong>${escapeHtml(s.anchor.label)}</strong><em>Last focus · ${escapeHtml(node?.title||'Anchor')}</em><div class="session-meta"><span>${formatAgo(s.lastActiveAt)}</span><span>${formatDuration(s.activeDurationMs)}</span><span>SAVED ${s.savedDiscoveries.length}</span><span>OPEN ${open}</span></div>`;
  }

  async function returnArticle(){
    if(ui.session && !ui.draft){ await engine.pause(); }
    const scrollPos=ui.session?.anchor?.originScrollPosition ?? ui.lastArticleScroll ?? 0;
    setView('article'); requestAnimationFrame(()=>{ articleScroll.scrollTop=scrollPos; requestAnimationFrame(()=>{ articleScroll.scrollTop=scrollPos; toast('元の読書位置へ戻りました'); }); });
  }

  async function resetDemo(){ await store.clear(); engine.session=null; engine.draft=false; await seedFixtureSessions(); articleScroll.scrollTop=0; setView('article'); toast('デモをリセットしました'); }

  $('#startDiveButton').addEventListener('click',beginDiveFromArticle);
  $('#articleDiveQuick').addEventListener('click',beginDiveFromArticle);
  $('#newFromArticleButton').addEventListener('click',beginDiveFromArticle);
  $('#cardsDock').addEventListener('click',returnArticle);
  $('#diveDock').addEventListener('click',async()=>{ if(ui.view==='dive') return; setView('home'); await renderHome(); });
  $('#backButton').addEventListener('click',()=>{ if(ui.view==='dive') backOne(); else if(ui.view==='home') returnArticle(); });
  $('#leaveDiveButton').addEventListener('click',leaveDive);
  $('#sidebarArticleButton').addEventListener('click',returnArticle);
  $('#saveDiscoveryButton').addEventListener('click',saveDiscovery);
  $('#keepQuestionButton').addEventListener('click',openQuestionSheet);
  $('#sessionPanelButton').addEventListener('click',()=>$('#sessionSidebar').classList.toggle('open-mobile'));
  $('#sheetClose').addEventListener('click',closeSheet); $('#backdrop').addEventListener('click',closeSheet);
  $('#resetButton').addEventListener('click',resetDemo);

  window.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if($('#sheet').classList.contains('open')) closeSheet(); else if($('#sessionSidebar').classList.contains('open-mobile')) $('#sessionSidebar').classList.remove('open-mobile'); } });

  window.__DIVE_SESSION_TEST__ = {
    getState:()=>JSON.parse(JSON.stringify({view:ui.view,session:ui.session,draft:ui.draft,articleScroll:articleScroll.scrollTop})),
    getSessions:()=>store.all(), reset:resetDemo
  };

  (async()=>{ await store.init(); await seedFixtureSessions(); await renderHome(); setView('article'); })();
})();
