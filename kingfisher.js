(() => {
  'use strict';

  const articles = window.KAWASEMI_ARTICLES || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const esc = v => String(v ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const lang = () => (localStorage.getItem('kingfisherLanguage') || 'ja') === 'ru' ? 'ru' : 'ja';
  const tr = (ja, ru) => lang() === 'ru' ? ru : ja;

  window.KINGFISHER_MOTION = {
    charge: { commitDistance: 56, velocityCommit: 0.58, maxDistance: 240, initialFollow: 0.14, finalFollow: 0.56, response: 0.18, cancelDuration: 210 },
    flight: { durationBase: 900, durationMin: 680, durationMax: 940, velocityInfluence: 115, waterY: 0.535, scaleEnd: 0.15, cameraScale: 1.12 },
    dive: { duration: 205, scaleEnd: 0.035, cameraBoost: 0.055, immersionDuration: 510 }
  };

  const state = {
    tab: 'forYou',
    currentId: null,
    processed: new Set(JSON.parse(localStorage.getItem('kingfisherProcessed') || '[]')),
    saved: new Set(JSON.parse(localStorage.getItem('kingfisherSaved') || '[]')),
    liked: new Set(JSON.parse(localStorage.getItem('kingfisherLiked') || '[]')),
    interests: JSON.parse(localStorage.getItem('kingfisherInterests') || '["Ukraine","AI","Drones","Europe","Energy"]'),
    historyIds: JSON.parse(localStorage.getItem('kingfisherSwipeHistory') || '[]'),
    themeChoice: localStorage.getItem('kingfisherTheme') || 'dark',
    undo: [],
    toastTimer: null,
    lastReadId: localStorage.getItem('kingfisherLastRead') || null,
    drawerView: 'home',
    edgeDrawerPointerId: null,
    sourceArticleId: null,
    sourceScrollY: 0,
    dive: { articleId: null, depth: 0, path: [], current: null, returnTab: 'forYou', returnScroll: 0 }
  };

  document.documentElement.lang = lang();

  const DIGITS = {
    0:[1,1,1,1,1,1,0],1:[0,1,1,0,0,0,0],2:[1,1,0,1,1,0,1],3:[1,1,1,1,0,0,1],4:[0,1,1,0,0,1,1],
    5:[1,0,1,1,0,1,1],6:[1,0,1,1,1,1,1],7:[1,1,1,0,0,0,0],8:[1,1,1,1,1,1,1],9:[1,1,1,1,0,1,1]
  };
  const LINES = [[5,4,19,4],[21,6,21,19],[21,22,21,35],[5,37,19,37],[3,22,3,35],[3,6,3,19],[5,20.5,19,20.5]];
  const digitSvg = d => `<svg viewBox="0 0 24 42" aria-hidden="true">${LINES.map((l,i)=>`<line x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}" opacity="${DIGITS[d]?.[i] ? 1 : .08}"/>`).join('')}<path d="M0 26 L8 19" opacity=".28"/></svg>`;
  const geoNumber = value => `<span class="geo-number">${String(Math.max(0,value)).split('').map(digitSvg).join('')}</span>`;

  function persist(){
    localStorage.setItem('kingfisherProcessed', JSON.stringify([...state.processed]));
    localStorage.setItem('kingfisherSaved', JSON.stringify([...state.saved]));
    localStorage.setItem('kingfisherLiked', JSON.stringify([...state.liked]));
    localStorage.setItem('kingfisherInterests', JSON.stringify(state.interests));
    localStorage.setItem('kingfisherSwipeHistory', JSON.stringify(state.historyIds.slice(0,80)));
  }

  function resolveTheme(){
    if(state.themeChoice === 'system') return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return state.themeChoice === 'light' ? 'light' : 'dark';
  }
  function applyTheme(){
    const actual = resolveTheme();
    document.documentElement.dataset.theme = actual;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', actual === 'dark' ? '#081113' : '#f2efe8');
    $$('[data-theme]').forEach(b => b.classList.toggle('active', b.dataset.theme === state.themeChoice));
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{ if(state.themeChoice === 'system') applyTheme(); });

  const articleById = id => articles.find(a => a.id === id);
  const displaySource = source => String(source || '').replace(/KAWASEMI/g,'KINGFISHER');
  const imageMarkup = a => a?.image ? `<img src="${esc(a.image)}" alt="" referrerpolicy="no-referrer" data-article-image="${esc(a.id)}">` : '<div class="image-fallback"></div>';
  function bindImageFallback(root=document){
    $$('img[data-article-image]',root).forEach(img=>{
      if(img.dataset.fallbackBound) return;
      img.dataset.fallbackBound='1';
      img.addEventListener('error',()=>img.replaceWith(Object.assign(document.createElement('div'),{className:'image-fallback'})),{once:true});
    });
  }

  function addHistory(id){
    if(!id) return;
    state.historyIds=[id,...state.historyIds.filter(x=>x!==id)].slice(0,80);
    persist();
    if($('#drawer')?.classList.contains('open')) renderDrawer();
  }
  function likedTags(){
    const set=new Set();
    articles.filter(a=>state.liked.has(a.id)).forEach(a=>(a.tags||[]).forEach(t=>set.add(String(t).toLowerCase())));
    return set;
  }
  function interestScore(a){
    const prefs=new Set([...state.interests.map(x=>String(x).toLowerCase()),...likedTags()]);
    return (a.tags||[]).reduce((n,t)=>n+(prefs.has(String(t).toLowerCase())?3:0),0)+(a.hot?1:0)+(a.must?1:0);
  }
  function queueFor(tab=state.tab){
    let list=tab==='hot'?articles.filter(a=>a.hot):[...articles].sort((a,b)=>interestScore(b)-interestScore(a));
    return list.filter(a=>!state.processed.has(a.id));
  }
  function remaining(tab){return tab==='dive'?0:queueFor(tab).length;}
  function ensureCurrent(){
    let a=articleById(state.currentId);
    if(a) return a;
    a=queueFor()[0]||null;
    state.currentId=a?.id||null;
    return a;
  }
  const currentArticle = () => ensureCurrent();
  function nextArticleCandidate(){
    const current=currentArticle(),queue=queueFor();
    if(!current) return null;
    const i=queue.findIndex(a=>a.id===current.id);
    return i>=0?(queue[i+1]||null):(queue[0]||null);
  }
  function syncNav(){
    $$('.feed-tab').forEach(btn=>{
      const active=btn.dataset.tab===state.tab;
      btn.classList.toggle('active',active);
      if(btn.dataset.tab==='dive'){btn.classList.remove('has-unread');return;}
      btn.classList.toggle('has-unread',remaining(btn.dataset.tab)>0);
    });
  }
  const edgeGestureWidth=()=>clamp(innerWidth*.06,22,28);

  function sectionVocabulary(a){
    const topic=String(a.topic||'').toLowerCase(),tags=(a.tags||[]).join(' ').toLowerCase(),all=`${topic} ${tags}`;
    if(/civilian|people/.test(all)) return lang()==='ru'
      ? [{k:'ON THE GROUND',t:'Что произошло на месте'},{k:'HUMAN IMPACT',t:'Что это значит для людей'},{k:'WATCH',t:'Что отслеживать'}]
      : [{k:'ON THE GROUND',t:'現地で何が起きた'},{k:'HUMAN IMPACT',t:'人への影響'},{k:'WATCH',t:'次に見ること'}];
    if(/energy|oil|shipping/.test(all)) return lang()==='ru'
      ? [{k:'SUPPLY',t:'Что изменилось в поставках'},{k:'IMPACT',t:'Почему это влияет на рынок'},{k:'WATCH',t:'Следующий сигнал'}]
      : [{k:'SUPPLY',t:'供給に何が起きた'},{k:'IMPACT',t:'市場への意味'},{k:'WATCH',t:'次の焦点'}];
    if(/ceasefire|black sea|politic|diplom/.test(all)) return lang()==='ru'
      ? [{k:'POSITION',t:'Что заявили стороны'},{k:'CONTEXT',t:'Что это меняет в переговорах'},{k:'WATCH',t:'Следующая реакция'}]
      : [{k:'POSITION',t:'各側は何を示したか'},{k:'CONTEXT',t:'交渉への意味'},{k:'WATCH',t:'次の反応'}];
    if(/economy|market|fed|inflation|consumer/.test(all)) return lang()==='ru'
      ? [{k:'DATA',t:'Что показывают данные'},{k:'POLICY',t:'Что это меняет для экономики'},{k:'WATCH',t:'Следующий индикатор'}]
      : [{k:'DATA',t:'数字が示すこと'},{k:'POLICY',t:'経済・政策への意味'},{k:'WATCH',t:'次の指標'}];
    if(/ai|tech|chip/.test(all)) return lang()==='ru'
      ? [{k:'SHIFT',t:'Что изменилось'},{k:'IMPACT',t:'Почему это важно'},{k:'WATCH',t:'Что дальше'}]
      : [{k:'SHIFT',t:'何が変わった'},{k:'IMPACT',t:'なぜ重要なのか'},{k:'WATCH',t:'次の焦点'}];
    if(/climate|wildfire|environment/.test(all)) return lang()==='ru'
      ? [{k:'ON THE GROUND',t:'Что происходит на месте'},{k:'IMPACT',t:'Какие последствия шире пожара'},{k:'WATCH',t:'Что дальше'}]
      : [{k:'ON THE GROUND',t:'現地で起きていること'},{k:'IMPACT',t:'火災の先に広がる影響'},{k:'WATCH',t:'次に見ること'}];
    if(/ukraine|russia|defense|drone|war/.test(all)) return lang()==='ru'
      ? [{k:'UPDATE',t:'Что произошло'},{k:'CONTEXT',t:'Почему это важно сейчас'},{k:'WATCH',t:'Что отслеживать'}]
      : [{k:'UPDATE',t:'何が起きた'},{k:'CONTEXT',t:'なぜ今重要なのか'},{k:'WATCH',t:'次に見ること'}];
    return lang()==='ru'
      ? [{k:'UPDATE',t:'Что произошло'},{k:'CONTEXT',t:'Почему это важно'},{k:'WATCH',t:'Что дальше'}]
      : [{k:'UPDATE',t:'何が起きた'},{k:'CONTEXT',t:'なぜ重要なのか'},{k:'WATCH',t:'今後'}];
  }
  function articleSections(a){
    const labels=sectionVocabulary(a),out=[],body=(a.body||[]).filter(Boolean);
    if(body.length) out.push({label:labels[0].k,title:labels[0].t,paragraphs:body});
    if(a.key) out.push({label:labels[1].k,title:labels[1].t,paragraphs:[a.key],emphasis:true});
    if(a.watch) out.push({label:labels[2].k,title:labels[2].t,paragraphs:[a.watch]});
    return out;
  }
  function sourceLine(a){return `${displaySource(a.source)}${a.publishedAt?' · '+String(a.publishedAt).replace(' UTC',''):''}`;}
  function storyMarkup(a,count){
    const sections=articleSections(a);
    return `<article class="story-page" data-id="${esc(a.id)}">
      <section class="story-cover">
        <div class="story-cover-image">${imageMarkup(a)}</div><div class="story-cover-shade"></div>
        <div class="story-cover-top"><button class="story-source-button" data-source-id="${esc(a.id)}">${esc(sourceLine(a))}</button><span class="story-count">${count}</span></div>
        <div class="story-cover-copy">
          <div class="story-tags">${(a.tags||[]).slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}</div>
          <h1>${esc(a.title)}</h1><p class="story-summary">${esc(a.summary)}</p>
        </div><span class="story-read-cue" aria-hidden="true"></span>
      </section>
      <div class="story-body">
        ${sections.map(s=>`<section class="story-section ${s.emphasis?'emphasis':''}"><small class="story-section-label">${esc(s.label)}</small><h2>${esc(s.title)}</h2>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')}
        <button class="story-source-card" data-source-id="${esc(a.id)}"><small>${tr('SOURCE','ИСТОЧНИК')}</small><strong>${esc(displaySource(a.source)||'SOURCE')}</strong><span>${esc(a.sourceTitle||a.title)}</span></button>
        <div class="story-end"><button class="story-like ${state.liked.has(a.id)?'active':''}" data-like-id="${esc(a.id)}" aria-label="${tr('この記事が良かった','Мне понравилась эта статья')}"><svg viewBox="0 0 34 34"><path d="M17 29S5.5 22.2 5.5 13.4C5.5 9 8.3 6.5 11.7 6.5c2.4 0 4.4 1.3 5.3 3.2.9-1.9 2.9-3.2 5.3-3.2 3.4 0 6.2 2.5 6.2 6.9C28.5 22.2 17 29 17 29z"/></svg></button></div>
      </div>
    </article>`;
  }
  function nextPreviewMarkup(a){
    if(!a) return '';
    return `<div class="next-cover-mini"><div class="story-cover-image">${imageMarkup(a)}</div><div class="story-cover-shade"></div><div class="next-cover-mini-copy"><small>${esc(displaySource(a.source)||'SOURCE')}</small><strong>${esc(a.title)}</strong></div></div>`;
  }

  function resetReaderVisual(){
    const stage=$('#readerStage'),panel=$('#readerPanel'),save=$('#readerSaveReveal');
    stage?.classList.remove('is-nexting','is-saving');
    if(panel){panel.style.transition='';panel.style.transform='';panel.style.opacity='';}
    if(save){save.style.setProperty('--save-progress','0');save.classList.remove('committed','already');}
  }
  function renderReader({resetScroll=true,scrollTop=null}={}){
    const content=$('#articleContent'),scroll=$('#articleScroll'),nextHost=$('#readerNextPreview'),saveHost=$('#readerSaveReveal');
    if(!content||!scroll) return;
    const a=currentArticle();
    resetReaderVisual();
    if(!a){
      content.innerHTML='<div class="clear-card"><span>CLEAR</span></div>';nextHost.innerHTML='';syncNav();return;
    }
    const count=queueFor().length+(state.processed.has(a.id)?1:0);
    content.innerHTML=storyMarkup(a,Math.max(1,count));
    nextHost.innerHTML=nextPreviewMarkup(nextArticleCandidate());
    saveHost.classList.toggle('already',state.saved.has(a.id));
    bindImageFallback(content);bindImageFallback(nextHost);
    bindArticleActions();
    if(resetScroll) scroll.scrollTop=0;
    else if(scrollTop!==null) scroll.scrollTop=scrollTop;
    state.lastReadId=a.id;localStorage.setItem('kingfisherLastRead',a.id);addHistory(a.id);syncNav();
  }

  function snapshot(){
    state.undo.push({processed:[...state.processed],saved:[...state.saved],liked:[...state.liked],currentId:state.currentId,tab:state.tab,scrollTop:$('#articleScroll')?.scrollTop||0});
    if(state.undo.length>20) state.undo.shift();
  }
  function showUndoOnly(){const t=$('#undoToast');if(!t)return;t.classList.add('show');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>t.classList.remove('show'),1700);}
  function undo(){
    const h=state.undo.pop();if(!h)return;
    state.processed=new Set(h.processed);state.saved=new Set(h.saved);state.liked=new Set(h.liked);state.currentId=h.currentId;state.tab=h.tab;persist();showScreen('cards');renderReader({resetScroll:false,scrollTop:h.scrollTop});renderDrawer();$('#undoToast')?.classList.remove('show');
  }

  function settleReader(){
    const panel=$('#readerPanel'),stage=$('#readerStage'),save=$('#readerSaveReveal');
    panel.style.transition='transform 210ms cubic-bezier(.2,.72,.18,1),opacity 160ms linear';panel.style.transform='translate3d(0,0,0)';panel.style.opacity='1';
    setTimeout(()=>{panel.style.transition='';stage.classList.remove('is-nexting','is-saving');save.style.setProperty('--save-progress','0');save.classList.remove('committed');},220);
  }
  function advanceNext(dx=0,vx=0){
    const a=currentArticle();if(!a)return;
    const next=nextArticleCandidate();snapshot();state.processed.add(a.id);addHistory(a.id);persist();
    const panel=$('#readerPanel');
    panel.style.transition=`transform ${clamp(250-Math.abs(vx)*65,175,250)}ms cubic-bezier(.12,.82,.16,1),opacity 175ms linear`;
    panel.style.transform='translate3d(-112vw,0,0) rotate(-2.5deg)';panel.style.opacity='.08';
    setTimeout(()=>{
      state.currentId=next?.id||null;
      renderReader({resetScroll:true});
      const p=$('#readerPanel');p.style.transition='none';p.style.transform='translate3d(14px,0,0)';p.style.opacity='.96';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{p.style.transition='transform 220ms cubic-bezier(.2,.72,.18,1),opacity 180ms linear';p.style.transform='';p.style.opacity='1';setTimeout(()=>p.style.transition='',230);}));
      showUndoOnly();
    },220);
  }
  function saveCurrent(){
    const a=currentArticle();if(!a)return false;
    if(state.saved.has(a.id)) return false;
    snapshot();state.saved.add(a.id);addHistory(a.id);persist();renderDrawer();showUndoOnly();return true;
  }
  function commitSave(dx=0){
    const panel=$('#readerPanel'),reveal=$('#readerSaveReveal');
    const added=saveCurrent();
    reveal.classList.add('committed');reveal.classList.toggle('already',state.saved.has(currentArticle()?.id));
    panel.style.transition='transform 150ms cubic-bezier(.18,.78,.18,1)';panel.style.transform=`translate3d(${Math.max(72,Math.min(dx,105))}px,0,0)`;
    setTimeout(settleReader,115);
    return added;
  }

  function bindReaderGesture(){
    const panel=$('#readerPanel');let g=null;
    panel.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0) return;
      if($('#drawer').classList.contains('open')||$('#sourceSheet').classList.contains('open')||state.tab==='dive') return;
      if(e.clientX<=edgeGestureWidth()||state.edgeDrawerPointerId===e.pointerId) return;
      if(e.target.closest('button,a,input,textarea,select')) return;
      g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,lastT:performance.now(),vx:0,vy:0,axis:null};
    });
    panel.addEventListener('pointermove',e=>{
      if(!g||e.pointerId!==g.id)return;
      const dx=e.clientX-g.x,dy=e.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy),dist=Math.hypot(dx,dy);
      if(!g.axis&&dist>10){
        if(ax>ay*1.25) g.axis='x';
        else if(ay>ax*1.10) g.axis='y';
      }
      if(g.axis==='y') return;
      if(g.axis!=='x') return;
      panel.setPointerCapture?.(e.pointerId);e.preventDefault();
      const now=performance.now(),dt=Math.max(8,now-g.lastT);g.vx=g.vx*.44+((e.clientX-g.lastX)/dt)*.56;g.vy=g.vy*.44+((e.clientY-g.lastY)/dt)*.56;g.lastX=e.clientX;g.lastY=e.clientY;g.lastT=now;
      const follow=dx<0?dx*.96:dx*.90,progress=clamp(Math.abs(dx)/150,0,1),stage=$('#readerStage'),save=$('#readerSaveReveal');
      panel.style.transition='none';panel.style.transform=`translate3d(${follow}px,0,0) rotate(${clamp(dx/140,-1.2,1.2)}deg)`;
      stage.classList.toggle('is-nexting',dx<0);stage.classList.toggle('is-saving',dx>0);save.style.setProperty('--save-progress',String(progress));save.classList.toggle('already',state.saved.has(currentArticle()?.id));
    },{passive:false});
    const finish=e=>{
      if(!g||e.pointerId!==g.id)return;
      const data=g;g=null;const dx=e.clientX-data.x;
      if(data.axis!=='x'){resetReaderVisual();return;}
      if(dx<-70||data.vx<-.42){advanceNext(dx,data.vx);return;}
      if(dx>70||data.vx>.42){commitSave(dx);return;}
      settleReader();
    };
    panel.addEventListener('pointerup',finish);
    panel.addEventListener('pointercancel',()=>{if(!g)return;g=null;settleReader();});
  }

  function toggleLike(id,button){
    const a=articleById(id);if(!a)return;
    state.liked.has(id)?state.liked.delete(id):state.liked.add(id);persist();
    button?.classList.toggle('active',state.liked.has(id));button?.classList.remove('pulse');void button?.offsetWidth;button?.classList.add('pulse');setTimeout(()=>button?.classList.remove('pulse'),320);renderDrawer();
  }
  function bindArticleActions(){
    $$('[data-source-id]').forEach(b=>b.addEventListener('click',()=>openSource(articleById(b.dataset.sourceId))));
    $$('.story-like').forEach(b=>b.addEventListener('click',()=>toggleLike(b.dataset.likeId,b)));
  }

  function openSource(a){
    if(!a)return;
    state.sourceArticleId=a.id;state.sourceScrollY=$('#articleScroll')?.scrollTop||0;
    $('#sourceMedia').textContent=displaySource(a.source||'SOURCE');$('#sourceTitle').textContent=a.sourceTitle||a.title;
    $('#sourcePublished').textContent=[a.publishedAt,a.topic].filter(Boolean).join(' · ');$('#sourceSummary').textContent=a.summary||'';
    const link=$('#sourceExternal');link.textContent=tr('元記事を開く ↗','Открыть оригинал ↗');
    if(a.sourceUrl){link.href=a.sourceUrl;link.removeAttribute('aria-disabled');}else{link.removeAttribute('href');link.setAttribute('aria-disabled','true');}
    $('#sourceBackdrop').classList.add('show');$('#sourceBackdrop').setAttribute('aria-hidden','false');$('#sourceSheet').classList.add('open');$('#sourceSheet').setAttribute('aria-hidden','false');
  }
  function closeSource(){
    $('#sourceBackdrop').classList.remove('show');$('#sourceBackdrop').setAttribute('aria-hidden','true');$('#sourceSheet').classList.remove('open');$('#sourceSheet').setAttribute('aria-hidden','true');
    const scroll=$('#articleScroll');if(scroll) requestAnimationFrame(()=>scroll.scrollTop=state.sourceScrollY);state.sourceArticleId=null;
  }

  /* Existing DIVE knowledge logic is intentionally retained. Article-end connection is pending user approval. */
  const DIVE_CATALOG = [
    {label:'TECH',hint:'仕組みを分解',keywords:['drone','ai','tech','drones'],title:'技術はどう動く？',body:'このニュースを成立させている技術を、入力・判断・実行の順に分けて見る。どこが強みで、どこが弱点なのかが見えてくる。'},
    {label:'WHY NOW',hint:'なぜ今なのか',keywords:['ukraine','europe','politics'],title:'なぜ今、重要になった？',body:'以前から存在した問題が、どの条件の変化で急に重要になったのか。時間軸を置くとニュースの意味が変わる。'},
    {label:'RUSSIA',hint:'反対側の視点',keywords:['ukraine','russia','defense'],title:'ロシア側から見ると？',body:'同じ出来事を反対側の制約・目的・対応策から見る。相手が何を恐れ、何を変えようとしているかを整理する。'},
    {label:'COST',hint:'お金と量産',keywords:['economy','energy','industry'],title:'いくらかかり、量産できる？',body:'性能だけでなく単価、供給網、生産速度、維持費を見る。現実に広がる技術かどうかはここで決まる。'},
    {label:'RADAR',hint:'どう発見する？',keywords:['drone','defense'],title:'どうやって見つける？',body:'センサー、レーダー、画像、通信情報。対象を見つけるまでの仕組みと、見逃しが起こる場所を追う。'},
    {label:'COMPARE',hint:'各国・方式を比較',keywords:['europe','tech'],title:'他の方式と何が違う？',body:'代替手段と並べて、速度・価格・精度・供給量を比較する。一つの技術だけでは見えないトレードオフが分かる。'},
    {label:'POLICY',hint:'制度と政治',keywords:['politics','europe','ukraine'],title:'政策は何を変える？',body:'予算、規制、同盟、調達。技術や市場が広がる条件を、制度の側から確認する。'},
    {label:'HISTORY',hint:'過去から見る',keywords:['history'],title:'以前はどうだった？',body:'似た問題が過去にどう扱われ、何が失敗し、何が残ったかを見る。今の選択肢の理由が見えてくる。'},
    {label:'NUMBERS',hint:'数字で確かめる',keywords:['economy','cost','energy'],title:'数字にすると何が見える？',body:'規模、比率、速度、コストを数字に置き換える。印象ではなく、どの差が本当に大きいのかを見る。'},
    {label:'IMPACT',hint:'生活への影響',keywords:['people','economy','energy'],title:'誰に、どう影響する？',body:'国家や企業の話を、生活・雇用・価格・安全に落とす。ニュースが自分事になる位置を探す。'},
    {label:'PRODUCTION',hint:'作れる量を見る',keywords:['defense','industry','europe'],title:'本当に作れる量は？',body:'工場、部品、人材、契約期間。予算ではなく現物の供給能力から実現可能性を確認する。'},
    {label:'NEXT',hint:'次に起きること',keywords:['politics','market'],title:'次に何が起こりうる？',body:'今ある制約から、次の一手と反応を複数に分ける。予言ではなく、監視すべき条件を持つ。'}
  ];
  const DIVE_COLORS=['#0b1d20','#0a2024','#081b20','#07171c','#061419'];
  const DIVE_HINT_RU={'仕組みを分解':'Как это работает','なぜ今なのか':'Почему сейчас','反対側の視点':'Другая сторона','お金と量産':'Цена и масштаб','どう発見する？':'Как обнаруживают','各国・方式を比較':'Сравнить','制度と政治':'Политика','過去から見る':'История','数字で確かめる':'Цифры','生活への影響':'Влияние','作れる量を見る':'Производство','次に起きること':'Что дальше'};
  const diveHint=h=>lang()==='ru'?(DIVE_HINT_RU[h]||h):h;
  function diveAffinity(item,a){const words=[...state.interests,...(a.tags||[]),a.topic||''].join(' ').toLowerCase();return item.keywords.reduce((n,k)=>n+(words.includes(k)?2:0),0);}
  function diveChoices(a,depth,path=[]){const used=new Set(path.map(x=>x.label));const pool=DIVE_CATALOG.filter(x=>!used.has(x.label)).map(x=>({...x,score:diveAffinity(x,a)})).sort((x,y)=>y.score-x.score);const picked=[];pool.forEach(x=>{if(picked.length<2&&x.score>0)picked.push(x)});pool.forEach(x=>{if(picked.length<2&&!picked.some(p=>p.label===x.label))picked.push(x)});const breadth=pool.slice().reverse().find(x=>!picked.some(p=>p.label===x.label));if(breadth)picked.push(breadth);return picked.slice(0,3);}
  function enterDive(a,firstChoice=null){
    if(!a)return;state.dive.returnTab=state.tab;state.dive.returnScroll=$('#articleScroll')?.scrollTop||0;state.tab='dive';state.dive.articleId=a.id;state.dive.depth=firstChoice?1:0;state.dive.path=firstChoice?[firstChoice]:[];state.dive.current=firstChoice||{label:'SURFACE',title:a.title,body:a.summary};renderDive();showScreen('dive');syncNav();
  }
  function renderDive(){const a=articleById(state.dive.articleId)||currentArticle()||articles[0];if(!a)return;const d=state.dive.depth,current=state.dive.current||{title:a.title,body:a.summary},screen=$('#diveScreen');screen.style.setProperty('--dive-bg',DIVE_COLORS[Math.min(d,DIVE_COLORS.length-1)]);$('#diveDepth').innerHTML=geoNumber(String(d).padStart(2,'0'));$('#diveRail').innerHTML=Array.from({length:Math.max(1,d+1)},(_,i)=>`<i class="${i===d?'active':''}"></i>`).join('');$('#diveTheme').textContent=current.title||a.title;$('#diveText').textContent=current.body||a.summary;const choices=d>=4?[]:diveChoices(a,d,state.dive.path);$('#diveChoices').innerHTML=choices.map((c,i)=>`<button class="dive-choice" data-i="${i}"><strong>${c.label}</strong><span>${esc(diveHint(c.hint))}</span></button>`).join('');$$('.dive-choice').forEach((b,i)=>b.addEventListener('click',()=>chooseDive(choices[i],b)));$('#diveEnd').classList.toggle('show',d>=4);}
  function chooseDive(choice,button){if(!choice)return;button.classList.add('selected');const stage=$('#diveStage');stage.classList.add('sink');setTimeout(()=>{state.dive.depth++;state.dive.path.push(choice);state.dive.current=choice;renderDive();stage.classList.remove('sink');stage.classList.add('rise');requestAnimationFrame(()=>requestAnimationFrame(()=>stage.classList.remove('rise')));},280);}
  function bindDiveSurfaceGesture(){const screen=$('#diveScreen');let g=null;screen.addEventListener('pointerdown',e=>{if(state.tab!=='dive')return;g={id:e.pointerId,y:e.clientY,lastY:e.clientY,lastT:performance.now(),vy:0};});screen.addEventListener('pointermove',e=>{if(!g||e.pointerId!==g.id)return;const dy=Math.max(0,e.clientY-g.y),now=performance.now(),dt=Math.max(8,now-g.lastT);g.vy=(e.clientY-g.lastY)/dt;g.lastY=e.clientY;g.lastT=now;screen.style.setProperty('--surface-pull',String(clamp(dy/180,0,1)));$('#diveStage').style.transform=`translateY(${dy*.32}px) scale(${1-dy/9000})`;});screen.addEventListener('pointerup',e=>{if(!g||e.pointerId!==g.id)return;const dy=e.clientY-g.y,vy=g.vy;g=null;if(dy>90||vy>.58){exitDive();return;}screen.style.setProperty('--surface-pull','0');$('#diveStage').style.transform='';});screen.addEventListener('pointercancel',()=>{g=null;screen.style.setProperty('--surface-pull','0');$('#diveStage').style.transform='';});}
  function exitDive(){state.tab=state.dive.returnTab||'forYou';showScreen('cards');renderReader({resetScroll:false,scrollTop:state.dive.returnScroll});$('#diveScreen').style.setProperty('--surface-pull','0');$('#diveStage').style.transform='';syncNav();}
  function showScreen(which){$('#cardsScreen').classList.toggle('active',which==='cards');$('#diveScreen').classList.toggle('active',which==='dive');}
  function switchTab(tab){
    if(tab==='dive'){enterDive(currentArticle()||articles[0]);return;}
    state.tab=tab;state.currentId=queueFor(tab)[0]?.id||null;showScreen('cards');renderReader({resetScroll:true});syncNav();
  }

  function openDrawer(){state.drawerView='home';renderDrawer();const drawer=$('#drawer'),backdrop=$('#drawerBackdrop');drawer.style.transition='';drawer.style.transform='';backdrop.style.opacity='';drawer.classList.add('open');backdrop.classList.add('show');}
  function closeDrawer(){const drawer=$('#drawer'),backdrop=$('#drawerBackdrop');drawer.style.transition='';drawer.style.transform='';backdrop.style.opacity='';drawer.classList.remove('open');backdrop.classList.remove('show');state.drawerView='home';renderDrawer();}
  function drawerRows(ids){return ids.map(id=>articleById(id)).filter(Boolean).map(a=>`<button class="drawer-article" data-id="${esc(a.id)}">${esc(a.title)}</button>`).join('')||'<div class="drawer-empty">EMPTY</div>';}
  function renderDrawer(){
    const body=$('#drawerBody');if(!body)return;
    if(state.drawerView==='home') body.innerHTML=`<div class="drawer-home"><div class="drawer-actions"><button data-view="liked"><span>♡</span><b>${tr('いいね','НРАВИТСЯ')}</b></button><button data-view="saved"><span class="drawer-save-icon"><svg viewBox="0 0 28 32" aria-hidden="true"><path d="M7 4h14v24l-7-5-7 5z"/></svg></span><b>${tr('保存','СОХРАНЁННОЕ')}</b></button></div><div class="drawer-section-title">${tr('履歴','ИСТОРИЯ')}</div><div class="drawer-history">${drawerRows(state.historyIds)}</div><div class="drawer-settings-entry"><button data-view="settings"><span>⚙︎</span><b>${tr('設定','НАСТРОЙКИ')}</b></button></div></div>`;
    else if(state.drawerView==='liked') body.innerHTML=`<button class="drawer-back">←</button><h2>${tr('いいね','НРАВИТСЯ')}</h2>${drawerRows([...state.liked])}`;
    else if(state.drawerView==='saved') body.innerHTML=`<button class="drawer-back">←</button><h2>${tr('保存','СОХРАНЁННОЕ')}</h2>${drawerRows([...state.saved])}`;
    else if(state.drawerView==='settings') body.innerHTML=`<button class="drawer-back">←</button><h2>${tr('設定','НАСТРОЙКИ')}</h2><section class="settings-group"><h3>${tr('言語','ЯЗЫК')}</h3><div class="language-list"><button data-lang="ja">日本語</button><button data-lang="ru">Русский</button></div></section><section class="settings-group"><h3>${tr('興味・好み','ИНТЕРЕСЫ')}</h3><div class="interest-list">${state.interests.map((x,i)=>`<button class="interest-chip" data-i="${i}">${esc(x)} ×</button>`).join('')}</div><form id="drawerInterestForm"><input id="drawerInterestInput" maxlength="32" placeholder="＋"/><button>＋</button></form></section><section class="settings-group"><h3>${tr('デザイン','ТЕМА')}</h3><div class="theme-list"><button data-theme="dark">DARK</button><button data-theme="light">LIGHT</button><button data-theme="system">SYSTEM</button></div></section>`;
    bindDrawerContent();applyTheme();
  }
  function focusArticle(id){const a=articleById(id);if(!a)return;state.currentId=id;state.lastReadId=id;localStorage.setItem('kingfisherLastRead',id);closeDrawer();showScreen('cards');renderReader({resetScroll:true});}
  function bindDrawerContent(){
    $$('#drawerBody [data-view]').forEach(b=>b.addEventListener('click',()=>{state.drawerView=b.dataset.view;renderDrawer();}));$('.drawer-back')?.addEventListener('click',()=>{state.drawerView='home';renderDrawer();});$$('.drawer-article').forEach(b=>b.addEventListener('click',()=>focusArticle(b.dataset.id)));$$('.interest-chip').forEach(b=>b.addEventListener('click',()=>{state.interests.splice(Number(b.dataset.i),1);persist();renderDrawer();renderReader({resetScroll:false,scrollTop:$('#articleScroll')?.scrollTop||0});}));$('#drawerInterestForm')?.addEventListener('submit',e=>{e.preventDefault();const input=$('#drawerInterestInput'),v=input.value.trim();if(v&&!state.interests.some(x=>x.toLowerCase()===v.toLowerCase()))state.interests.push(v);persist();renderDrawer();});$$('[data-theme]').forEach(b=>b.addEventListener('click',()=>{state.themeChoice=b.dataset.theme;localStorage.setItem('kingfisherTheme',state.themeChoice);applyTheme();}));$$('[data-lang]').forEach(b=>{b.classList.toggle('active',b.dataset.lang===lang());b.addEventListener('click',()=>{const y=$('#articleScroll')?.scrollTop||0;localStorage.setItem('kingfisherLanguage',b.dataset.lang);document.documentElement.lang=b.dataset.lang;renderDrawer();renderReader({resetScroll:false,scrollTop:y});});});
  }

  function bindEdgeDrawerGesture(){
    let g=null;
    document.addEventListener('pointerdown',e=>{
      if(e.clientX>edgeGestureWidth()||$('#drawer').classList.contains('open')||$('#sourceSheet').classList.contains('open')||state.tab==='dive'||!$('#cardsScreen').classList.contains('active')||!$('#splash').classList.contains('hidden')||!$('#tutorial').classList.contains('hidden')) return;
      g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null};state.edgeDrawerPointerId=e.pointerId;
    },true);
    document.addEventListener('pointermove',e=>{
      if(!g||e.pointerId!==g.id)return;const dx=Math.max(0,e.clientX-g.x),dy=e.clientY-g.y;if(!g.axis&&Math.hypot(dx,dy)>7)g.axis=Math.abs(dx)>Math.abs(dy)*1.2?'x':'y';if(g.axis!=='x')return;e.preventDefault();const now=performance.now(),dt=Math.max(8,now-g.lastT);g.vx=(e.clientX-g.lastX)/dt;g.lastX=e.clientX;g.lastT=now;const drawer=$('#drawer'),backdrop=$('#drawerBackdrop'),progress=clamp(dx/Math.max(1,drawer.offsetWidth),0,1);drawer.style.transition='none';drawer.style.transform=`translateX(${-103+103*progress}%)`;backdrop.style.opacity=String(progress*.9);backdrop.classList.add('dragging');
    },{capture:true,passive:false});
    const end=e=>{if(!g||e.pointerId!==g.id)return;const dx=e.clientX-g.x,axis=g.axis,vx=g.vx;g=null;state.edgeDrawerPointerId=null;$('#drawerBackdrop').classList.remove('dragging');if(axis==='x'&&(dx>68||vx>.38)){openDrawer();return;}closeDrawer();};
    document.addEventListener('pointerup',end,true);document.addEventListener('pointercancel',e=>{if(g&&e.pointerId===g.id){g=null;state.edgeDrawerPointerId=null;$('#drawerBackdrop').classList.remove('dragging');closeDrawer();}},true);
  }

  function buildTutorial(){
    const tutorial=$('#tutorial');
    tutorial.innerHTML=`<div class="tutorial-stage"><div class="tutorial-brand">KINGFISHER</div><div class="tutorial-progress"><i></i><i></i><i></i><i></i></div><div id="tutorialCard" class="tutorial-card"><div id="tutorialCardInner" class="tutorial-card-inner"><div class="tutorial-river"></div><div class="tutorial-copy"><small id="tutorialStepNo"></small><strong id="tutorialTitle"></strong><p id="tutorialMicro"></p></div><div class="tutorial-peek">${tr('本文がそのまま下に続く','Текст продолжается ниже')}</div><span id="tutorialCue" class="tutorial-cue"></span><span id="tutorialSaveMark" class="tutorial-save-mark"><svg viewBox="0 0 32 38"><path d="M9 5h14v27l-7-5-7 5z"/></svg></span><button id="tutorialHeart" class="tutorial-heart" aria-label="LIKE"><svg viewBox="0 0 34 34"><path d="M17 29S5.5 22.2 5.5 13.4C5.5 9 8.3 6.5 11.7 6.5c2.4 0 4.4 1.3 5.3 3.2.9-1.9 2.9-3.2 5.3-3.2 3.4 0 6.2 2.5 6.2 6.9C28.5 22.2 17 29 17 29z"/></svg></button></div></div><div id="tutorialHint" class="tutorial-hint"></div></div>`;
    const steps=[
      {dir:'read',title:'READ',cue:'↑',hint:tr('上へ','ВВЕРХ'),micro:tr('そのまま読む','Читать дальше')},
      {dir:'next',title:'NEXT',cue:'←',hint:tr('左へ','ВЛЕВО'),micro:tr('もういい → 次へ','Дальше')},
      {dir:'save',title:'SAVE',cue:'→',hint:tr('右へ','ВПРАВО'),micro:tr('取っておく','Сохранить')},
      {dir:'like',title:'LIKE',cue:'♡',hint:'♡',micro:tr('良かった','Понравилось')}
    ];
    let index=0,g=null;const card=$('#tutorialCard'),inner=$('#tutorialCardInner'),heart=$('#tutorialHeart'),saveMark=$('#tutorialSaveMark');
    const render=()=>{const s=steps[index];$('#tutorialStepNo').textContent=`0${index+1} / 04`;$('#tutorialTitle').textContent=s.title;$('#tutorialCue').textContent=s.cue;$('#tutorialMicro').textContent=s.micro;$('#tutorialHint').textContent=s.hint;$$('.tutorial-progress i').forEach((x,i)=>x.classList.toggle('done',i<=index));heart.classList.toggle('show',s.dir==='like');$('#tutorialCue').style.display=s.dir==='like'?'none':'';inner.style.transform='';saveMark.classList.remove('show');};
    const complete=()=>{localStorage.setItem('kingfisherTutorialDone','1');tutorial.classList.add('finishing');setTimeout(()=>{tutorial.classList.add('hidden');tutorial.classList.remove('finishing');tutorial.setAttribute('aria-hidden','true');renderReader({resetScroll:true});},300);};
    const advance=()=>{index++;if(index>=steps.length){complete();return;}render();};
    card.addEventListener('pointerdown',e=>{if(steps[index].dir==='like')return;card.setPointerCapture?.(e.pointerId);g={id:e.pointerId,x:e.clientX,y:e.clientY};inner.style.transition='none';});
    card.addEventListener('pointermove',e=>{if(!g||e.pointerId!==g.id)return;const s=steps[index],dx=e.clientX-g.x,dy=e.clientY-g.y;if(s.dir==='read')inner.style.transform=`translate3d(0,${Math.min(0,dy*.55)}px,0)`;if(s.dir==='next')inner.style.transform=`translate3d(${Math.min(4,dx*.76)}px,0,0) rotate(${Math.min(0,dx)/75}deg)`;if(s.dir==='save')inner.style.transform=`translate3d(${Math.max(-4,dx*.68)}px,0,0)`;});
    card.addEventListener('pointerup',e=>{if(!g||e.pointerId!==g.id)return;const s=steps[index],dx=e.clientX-g.x,dy=e.clientY-g.y;g=null;const ok=(s.dir==='read'&&dy<-54)||(s.dir==='next'&&dx<-54)||(s.dir==='save'&&dx>54);if(!ok){inner.style.transition='transform 180ms cubic-bezier(.2,.72,.18,1)';inner.style.transform='';return;}if(s.dir==='read'){inner.style.transition='transform 220ms ease';inner.style.transform='translate3d(0,-70px,0)';setTimeout(advance,230);}else if(s.dir==='next'){inner.style.transition='transform 230ms cubic-bezier(.16,.76,.20,1),opacity 170ms linear';inner.style.transform='translate3d(-104vw,0,0) rotate(-5deg)';inner.style.opacity='.08';setTimeout(()=>{inner.style.transition='none';inner.style.opacity='1';inner.style.transform='translate3d(15px,0,0)';requestAnimationFrame(()=>requestAnimationFrame(()=>{inner.style.transition='transform 200ms ease';inner.style.transform='';setTimeout(advance,210);}));},220);}else{saveMark.classList.add('show');inner.style.transition='transform 200ms cubic-bezier(.2,.72,.18,1)';inner.style.transform='';setTimeout(advance,260);}});
    card.addEventListener('pointercancel',()=>{g=null;inner.style.transform='';});heart.addEventListener('click',e=>{e.stopPropagation();heart.classList.add('active');setTimeout(advance,180);});render();
  }

  function showAfterSplash(){
    $('#app').classList.remove('hidden');$('#app').style.opacity='1';renderDrawer();
    if(localStorage.getItem('kingfisherTutorialDone')==='1'){$('#tutorial').classList.add('hidden');$('#tutorial').setAttribute('aria-hidden','true');renderReader({resetScroll:true});}
    else{$('#tutorial').classList.remove('hidden');$('#tutorial').setAttribute('aria-hidden','false');buildTutorial();}
  }

  function bindSplash(){
    const splash=$('#splash'),bird=$('#splashBird'),scene=$('#splashScene'),ripple=$('#waterRipple'),M=window.KINGFISHER_MOTION;let g=null,raf=0,currentY=0,targetY=0;
    const draw=()=>{if(!g){raf=0;return;}currentY+=(targetY-currentY)*M.charge.response;const charge=clamp(g.distance/M.charge.maxDistance,0,1),scale=1-charge*.055;bird.style.opacity='1';bird.style.transform=`translate3d(-50%,${currentY}px,0) scale(${scale})`;raf=requestAnimationFrame(draw);};
    const restore=()=>{g=null;if(raf)cancelAnimationFrame(raf);raf=0;bird.style.transition='transform 210ms cubic-bezier(.2,.72,.18,1)';bird.style.opacity='1';bird.style.transform='translate3d(-50%,0,0) scale(1)';setTimeout(()=>bird.style.transition='',220);};
    const complete=()=>{splash.style.transition='opacity 180ms linear';splash.style.opacity='0';splash.style.pointerEvents='none';setTimeout(()=>{splash.classList.add('hidden');showAfterSplash();},190);};
    const launch=data=>{const vh=innerHeight,startCenter=vh-73,waterCenter=vh*M.flight.waterY,travel=waterCenter-startCenter,velocity=Math.max(0,data.velocity),duration=clamp(M.flight.durationBase-velocity*M.flight.velocityInfluence,M.flight.durationMin,M.flight.durationMax),t0=performance.now(),startY=currentY,startScale=1-Math.min(.055,Math.abs(startY)/3800),initial=clamp(.16+velocity*.035,.16,.28);let done=false;const fallback=setTimeout(()=>{if(!done){done=true;complete();}},duration+M.dive.duration+M.dive.immersionDuration+900);const flight=now=>{const t=clamp((now-t0)/duration,0,1),p=initial*t+(1-initial)*t*t,sp=clamp((p-.12)/.88,0,1),y=startY+(travel*.86-startY)*p,s=startScale+(M.flight.scaleEnd-startScale)*Math.pow(sp,1.18);bird.style.opacity='1';bird.style.transform=`translate3d(-50%,${y}px,0) scale(${s})`;scene.style.transform=`scale(${1.035+(M.flight.cameraScale-1.035)*p*.62})`;if(t<1){requestAnimationFrame(flight);return;}const d0=performance.now();const dive=now2=>{const d=clamp((now2-d0)/M.dive.duration,0,1),q=d*d*d,y2=travel*.86+(travel-travel*.86)*q,s2=M.flight.scaleEnd+(M.dive.scaleEnd-M.flight.scaleEnd)*q;bird.style.transform=`translate3d(-50%,${y2}px,0) scale(${s2})`;scene.style.transform=`scale(${M.flight.cameraScale+q*M.dive.cameraBoost})`;if(d<1){requestAnimationFrame(dive);return;}ripple.classList.add('impact');const i0=performance.now();const immerse=now3=>{const t3=clamp((now3-i0)/M.dive.immersionDuration,0,1),q3=1-Math.pow(1-t3,4);bird.style.opacity=String(1-t3);scene.style.transform=`scale(${M.flight.cameraScale+M.dive.cameraBoost+q3*.40}) translateY(${-q3*2.4}%)`;scene.style.filter=`saturate(${1.08+t3*.08}) blur(${q3*2}px)`;if(t3>.38){$('#app').classList.remove('hidden');$('#app').style.opacity=String(clamp((t3-.38)/.62,0,1));}if(t3<1){requestAnimationFrame(immerse);return;}if(!done){done=true;clearTimeout(fallback);complete();}};requestAnimationFrame(immerse);};requestAnimationFrame(dive);};requestAnimationFrame(flight);};
    splash.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;splash.setPointerCapture?.(e.pointerId);const now=performance.now();g={id:e.pointerId,startY:e.clientY,lastY:e.clientY,lastT:now,velocity:0,distance:0};currentY=targetY=0;bird.style.opacity='1';if(!raf)raf=requestAnimationFrame(draw);});
    splash.addEventListener('pointermove',e=>{if(!g||e.pointerId!==g.id)return;const now=performance.now(),dt=Math.max(8,now-g.lastT),up=Math.max(0,g.startY-e.clientY),v=(g.lastY-e.clientY)/dt;g.velocity=g.velocity*.62+v*.38;g.lastY=e.clientY;g.lastT=now;g.distance=up;const charge=clamp(up/M.charge.maxDistance,0,1),follow=M.charge.initialFollow+(M.charge.finalFollow-M.charge.initialFollow)*charge;targetY=-up*follow;$('.flight-guide').style.opacity=String(clamp(.72-charge*.8,0,.72));});
    splash.addEventListener('pointerup',e=>{if(!g||e.pointerId!==g.id)return;const data=g;g=null;if(raf)cancelAnimationFrame(raf);raf=0;const commit=data.distance>=M.charge.commitDistance||(data.distance>=28&&data.velocity>=M.charge.velocityCommit);if(!commit){restore();return;}$('.flight-guide').style.opacity='0';launch(data);});splash.addEventListener('pointercancel',restore);
  }

  function init(){
    applyTheme();buildTutorial();bindSplash();bindReaderGesture();bindDiveSurfaceGesture();bindEdgeDrawerGesture();renderDrawer();syncNav();
    $('#menuButton').addEventListener('click',openDrawer);$('#drawerBackdrop').addEventListener('click',closeDrawer);$('#drawerMenuButton').addEventListener('click',closeDrawer);$$('.feed-tab').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));$('#sourceBackdrop').addEventListener('click',closeSource);$('#sourceClose').addEventListener('click',closeSource);$('#undoBtn').addEventListener('click',undo);
    if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }

  init();
})();
