const articles = window.KAWASEMI_ARTICLES || [];

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const state = {
  feed:"forYou",
  processed:new Set(JSON.parse(localStorage.getItem("kawasemiProcessed") || "[]")),
  saved:new Set(JSON.parse(localStorage.getItem("kawasemiSaved") || "[]")),
  liked:new Set(JSON.parse(localStorage.getItem("kawasemiLiked") || "[]")),
  interests:JSON.parse(localStorage.getItem("kawasemiInterests") || '["Ukraine","AI","Drones","Europe","Energy"]'),
  archiveMode:"theme",
  history:[],
  drag:null,
  detailArticle:null,
  detailRect:null,
  detailDrag:null,
  toastTimer:null,
  themeChoice:localStorage.getItem("kawasemiTheme") || "auto"
};

const app = $("#app");
const splash = $("#splash");
const tutorial = $("#tutorial");
const deck = $("#deck");
const detail = $("#detail");

function persist(){
  localStorage.setItem("kawasemiProcessed", JSON.stringify([...state.processed]));
  localStorage.setItem("kawasemiSaved", JSON.stringify([...state.saved]));
  localStorage.setItem("kawasemiLiked", JSON.stringify([...state.liked]));
  localStorage.setItem("kawasemiInterests", JSON.stringify(state.interests));
}
function applyTheme(){
  const mediaDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const actual = state.themeChoice === "auto" ? (mediaDark ? "dark":"light") : state.themeChoice;
  document.documentElement.dataset.theme = actual;
  document.querySelector('meta[name="theme-color"]').setAttribute("content", actual === "dark" ? "#071a1e" : "#f6f5f2");
  $$("[data-theme-choice]").forEach(b=>b.classList.toggle("active", b.dataset.themeChoice === state.themeChoice));
}
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", ()=>{if(state.themeChoice==="auto")applyTheme()});

function renderGeoNumber(value){
  const text = String(Math.max(0,value));
  $("#counter").innerHTML = [...text].map(d=>`<span class="geo-digit">${d}</span>`).join("");
  $("#counter").setAttribute("aria-label", `残り${value}件`);
}
function likedTags(){
  const tags = new Set();
  articles.filter(a=>state.liked.has(a.id)).forEach(a=>a.tags.forEach(t=>tags.add(t.toLowerCase())));
  return tags;
}
function interestScore(article){
  const prefs = new Set([...state.interests.map(x=>x.toLowerCase()), ...likedTags()]);
  return article.tags.reduce((n,t)=>n+(prefs.has(t.toLowerCase())?3:0),0) + (article.hot?1:0) + (article.must?1:0);
}
function feedArticles(){
  let list;
  if(state.feed==="hot") list = articles.filter(a=>a.hot);
  else if(state.feed==="must") list = articles.filter(a=>a.must);
  else list = [...articles].sort((a,b)=>interestScore(b)-interestScore(a));
  return list.filter(a=>!state.processed.has(a.id));
}
function articleById(id){return articles.find(a=>a.id===id)}
function imageMarkup(a){return `<img src="${a.image}" alt="" loading="eager" referrerpolicy="no-referrer">`}

function cardMarkup(a, pos){
  return `
    <article class="news-card ${pos===1?"back1":pos===2?"back2":""}" data-id="${a.id}" data-pos="${pos}">
      <div class="card-image">${imageMarkup(a)}</div>
      <div class="card-shade"></div>
      <div class="card-copy">
        <div class="card-tags">${a.tags.slice(0,3).map(t=>`<span class="card-tag">${t}</span>`).join("")}</div>
        <h2 class="card-title">${a.title}</h2>
        <p class="card-summary">${a.summary}</p>
        <div class="card-source">${a.source}</div>
      </div>
      ${state.saved.has(a.id)?`<div class="saved-corner"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg></div>`:""}
      <div class="gesture-flash left"><b>←</b><span>KNOW</span></div>
      <div class="gesture-flash right"><span>READ</span><b>→</b></div>
      <div class="gesture-flash up"><b>⌃</b><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg></div>
    </article>`;
}
function renderDeck(){
  const q = feedArticles();
  renderGeoNumber(q.length);
  deck.innerHTML = "";
  if(!q.length){
    deck.innerHTML = `<div class="clear-card"><div><div class="zero">0</div><small>CLEAR</small></div></div>`;
    $("#actionDock").style.opacity=".25";
    $("#actionDock").style.pointerEvents="none";
    updateStats();
    return;
  }
  $("#actionDock").style.opacity="1";
  $("#actionDock").style.pointerEvents="auto";
  for(let p=Math.min(2,q.length-1);p>=0;p--) deck.insertAdjacentHTML("beforeend",cardMarkup(q[p],p));
  bindTopCard();
  updateStats();
}
function topCard(){return $(".news-card[data-pos='0']",deck)}
function currentArticle(){const c=topCard(); return c?articleById(c.dataset.id):null}
function resetCard(card){
  if(!card)return;
  card.style.transform="";
  card.style.opacity="";
  $$(".gesture-flash",card).forEach(x=>x.style.opacity=0);
}
function showDragCue(card, axis, dx, dy){
  const left=$(".gesture-flash.left",card),right=$(".gesture-flash.right",card),up=$(".gesture-flash.up",card);
  [left,right,up].forEach(x=>x.style.opacity=0);
  if(axis==="y" && dy<0) up.style.opacity=Math.min(1,Math.abs(dy)/90);
  if(axis==="x" && dx<0) left.style.opacity=Math.min(1,Math.abs(dx)/90);
  if(axis==="x" && dx>0) right.style.opacity=Math.min(1,Math.abs(dx)/90);
}
function bindTopCard(){
  const card=topCard(); if(!card)return;
  const begin=(x,y,id)=>{state.drag={x,y,id,axis:null};card.style.transition="none"};
  const move=(x,y)=>{
    if(!state.drag)return;
    const dx=x-state.drag.x,dy=y-state.drag.y;
    if(!state.drag.axis && (Math.abs(dx)>7||Math.abs(dy)>7)) state.drag.axis=Math.abs(dx)>=Math.abs(dy)?"x":"y";
    const axis=state.drag.axis;
    if(axis==="y"){
      if(dy>0){resetCard(card);return}
      card.style.transform=`translateY(${dy*.72}px) scale(${1-Math.min(.045,Math.abs(dy)/4200)})`;
    }else if(axis==="x"){
      card.style.transform=`translateX(${dx}px) rotate(${dx/34}deg)`;
    }
    showDragCue(card,axis,dx,dy);
  };
  const end=(x,y)=>{
    if(!state.drag)return;
    const dx=x-state.drag.x,dy=y-state.drag.y,axis=state.drag.axis;
    state.drag=null;card.style.transition="";
    if(axis==="y"&&dy<-95)return handleSave(card);
    if(axis==="x"&&dx<-95)return handleKnown(card);
    if(axis==="x"&&dx>95)return openDetail(currentArticle(),card);
    resetCard(card);
  };
  card.addEventListener("touchstart",e=>{const t=e.touches[0];begin(t.clientX,t.clientY,"touch")},{passive:true});
  card.addEventListener("touchmove",e=>{const t=e.touches[0];move(t.clientX,t.clientY)},{passive:true});
  card.addEventListener("touchend",e=>{const t=e.changedTouches[0];end(t.clientX,t.clientY)},{passive:true});
  card.addEventListener("pointerdown",e=>{if(e.pointerType==="touch")return;begin(e.clientX,e.clientY,"pointer")});
  const pm=e=>{if(state.drag?.id==="pointer")move(e.clientX,e.clientY)};
  const pu=e=>{if(state.drag?.id==="pointer"){end(e.clientX,e.clientY);window.removeEventListener("pointermove",pm);window.removeEventListener("pointerup",pu)}};
  card.addEventListener("pointerdown",e=>{if(e.pointerType!=="touch"){window.addEventListener("pointermove",pm);window.addEventListener("pointerup",pu)}});
}
function snapshot(){state.history.push({processed:[...state.processed],saved:[...state.saved],liked:[...state.liked]});}
function handleKnown(card=topCard()){
  const a=currentArticle();if(!a||!card)return;
  snapshot();state.processed.add(a.id);persist();
  card.style.transform="translateX(-118vw) rotate(-13deg)";card.style.opacity="0";
  showToast("知ってるにしました");
  setTimeout(renderDeck,210);
}
function handleSave(card=topCard()){
  const a=currentArticle();if(!a||!card)return;
  snapshot();state.saved.add(a.id);state.processed.add(a.id);persist();
  card.style.transform="translateY(-105vh) scale(.94)";card.style.opacity="0";
  showToast("あとで読むに保存しました");
  setTimeout(()=>{renderDeck();renderSavedArchive()},220);
}
function handleRead(){const a=currentArticle(),c=topCard();if(a&&c)openDetail(a,c)}

function fillDetail(a){
  $("#detailHero").innerHTML=imageMarkup(a);
  $("#detailMeta").textContent=`${a.tags.join(" · ")} · ${a.source}`;
  $("#detailTitle").textContent=a.title;
  $("#detailDek").textContent=a.summary;
  $("#detailArticle").innerHTML=[
    ...a.body.map(p=>`<p>${p}</p>`),
    `<div class="article-key">${a.key}</div>`,
    `<div class="watch"><small>WATCH</small><p>${a.watch}</p></div>`
  ].join("");
  $("#detailSource").textContent=`${a.source} · prototype article`;
  $("#detailLike").classList.toggle("active",state.liked.has(a.id));
  $("#detailBookmark").classList.toggle("active",state.saved.has(a.id));
}
function detailFromRect(rect){
  const vw=innerWidth,vh=innerHeight;
  detail.style.transform=`translate(${rect.left}px,${rect.top}px) scale(${rect.width/vw},${rect.height/vh})`;
  detail.style.borderRadius="30px";
}
function openDetail(a,card){
  if(!a||!card)return;
  state.detailArticle=a;
  state.detailRect=card.getBoundingClientRect();
  fillDetail(a);
  detailFromRect(state.detailRect);
  detail.classList.add("preopen");
  detail.setAttribute("aria-hidden","false");
  requestAnimationFrame(()=>requestAnimationFrame(()=>detail.classList.add("open")));
}
function closeDetail(animated=true){
  if(!state.detailArticle)return;
  const target=topCard()?.getBoundingClientRect()||state.detailRect;
  detail.classList.remove("dragging");
  if(animated&&target){
    detail.classList.remove("open");
    detailFromRect(target);
    setTimeout(finishDetailClose,390);
  }else finishDetailClose();
}
function finishDetailClose(){
  detail.classList.remove("open","preopen","dragging");
  detail.style.transform="";
  detail.style.borderRadius="";
  detail.setAttribute("aria-hidden","true");
  state.detailArticle=null;state.detailDrag=null;
  renderDeck();
}
function bindDetailSwipe(){
  const scroll=$(".detail-scroll",detail);
  let local=null;
  scroll.addEventListener("touchstart",e=>{const t=e.touches[0];local={x:t.clientX,y:t.clientY,axis:null}},{passive:true});
  scroll.addEventListener("touchmove",e=>{
    if(!local)return;
    const t=e.touches[0],dx=t.clientX-local.x,dy=t.clientY-local.y;
    if(!local.axis&&(Math.abs(dx)>8||Math.abs(dy)>8))local.axis=Math.abs(dx)>Math.abs(dy)?"x":"y";
    if(local.axis==="x"&&dx>0){
      e.preventDefault();detail.classList.add("dragging");
      detail.style.transform=`translateX(${dx}px) scale(${1-Math.min(.035,dx/6000)})`;
    }
  },{passive:false});
  scroll.addEventListener("touchend",e=>{
    if(!local)return;
    const t=e.changedTouches[0],dx=t.clientX-local.x;
    const axis=local.axis;local=null;
    if(axis==="x"&&dx>88)return closeDetail(true);
    detail.classList.remove("dragging");detail.style.transform="";
  },{passive:true});

  detail.addEventListener("pointerdown",e=>{
    if(e.pointerType==="touch")return;
    state.detailDrag={x:e.clientX,y:e.clientY,axis:null};
    detail.setPointerCapture?.(e.pointerId);
  });
  detail.addEventListener("pointermove",e=>{
    if(!state.detailDrag)return;
    const dx=e.clientX-state.detailDrag.x,dy=e.clientY-state.detailDrag.y;
    if(!state.detailDrag.axis&&(Math.abs(dx)>8||Math.abs(dy)>8))state.detailDrag.axis=Math.abs(dx)>Math.abs(dy)?"x":"y";
    if(state.detailDrag.axis==="x"&&dx>0){detail.classList.add("dragging");detail.style.transform=`translateX(${dx}px) scale(${1-Math.min(.035,dx/6000)})`}
  });
  detail.addEventListener("pointerup",e=>{
    if(!state.detailDrag)return;
    const dx=e.clientX-state.detailDrag.x,axis=state.detailDrag.axis;state.detailDrag=null;
    if(axis==="x"&&dx>88)return closeDetail(true);
    detail.classList.remove("dragging");detail.style.transform="";
  });
}
function toggleLike(){
  const a=state.detailArticle;if(!a)return;
  if(state.liked.has(a.id))state.liked.delete(a.id);else state.liked.add(a.id);
  persist();$("#detailLike").classList.toggle("active",state.liked.has(a.id));updateStats();
}
function toggleDetailSave(){
  const a=state.detailArticle;if(!a)return;
  if(state.saved.has(a.id)){state.saved.delete(a.id);showToast("保存を外しました")}else{state.saved.add(a.id);showToast("あとで読むに保存しました")}
  persist();$("#detailBookmark").classList.toggle("active",state.saved.has(a.id));renderSavedArchive();updateStats();
}
function undo(){
  const h=state.history.pop();if(!h)return;
  state.processed=new Set(h.processed);state.saved=new Set(h.saved);state.liked=new Set(h.liked);persist();
  $("#undoToast").classList.remove("show");renderDeck();renderSavedArchive();
}
function showToast(text){
  $("#undoText").textContent=text;
  $("#undoToast").classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer=setTimeout(()=>$("#undoToast").classList.remove("show"),4200);
}

function switchFeed(feed){
  state.feed=feed;
  $$(".feed-tab").forEach(b=>b.classList.toggle("active",b.dataset.feed===feed));
  renderDeck();
}
function switchScreen(id){
  $$(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
  $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));
  if(id==="savedScreen")renderSavedArchive();
  if(id==="discoverScreen")renderDiscover();
  if(id==="meScreen")renderMe();
}
function renderDiscover(){
  const hot=articles.filter(a=>a.hot).slice(0,6);
  $("#hotClusters").innerHTML=hot.map(a=>`
    <button class="cluster-card" data-id="${a.id}">
      ${imageMarkup(a)}
      <div><small>${a.tags.slice(0,2).join(" · ")}</small><strong>${a.title}</strong></div>
    </button>`).join("");
  $$(".cluster-card").forEach(b=>b.addEventListener("click",()=>{
    const a=articleById(b.dataset.id);
    switchScreen("cardsScreen");state.feed="hot";$$(".feed-tab").forEach(x=>x.classList.toggle("active",x.dataset.feed==="hot"));renderDeck();
    setTimeout(()=>{const c=$(`.news-card[data-id="${a.id}"]`,deck);if(c)openDetail(a,c)},80);
  }));
  const tags={};
  articles.filter(a=>a.hot||a.must).forEach(a=>a.tags.forEach(t=>tags[t]=(tags[t]||0)+1));
  $("#radarTopics").innerHTML=Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([t,n],i)=>`<button class="radar-topic ${i<4?"hot":""}">${t}<sup>${n}</sup></button>`).join("");
}
function groupSaved(){
  const rows=articles.filter(a=>state.saved.has(a.id));
  const groups={};
  rows.forEach(a=>{
    const key=state.archiveMode==="date"?a.month:a.topic;
    (groups[key] ||= []).push(a);
  });
  return groups;
}
function renderSavedArchive(){
  $$(".archive-switch button").forEach(b=>b.classList.toggle("active",b.dataset.archive===state.archiveMode));
  const groups=groupSaved(),keys=Object.keys(groups);
  if(!keys.length){
    $("#savedArchive").innerHTML=`<div class="archive-empty"><svg viewBox="0 0 32 32"><path d="M9 5h14v22l-7-5-7 5z"/></svg><span>EMPTY</span></div>`;
    return;
  }
  $("#savedArchive").innerHTML=keys.sort().map(key=>`
    <section class="archive-group"><h3>${key.toUpperCase()}</h3>
    ${groups[key].map(a=>`<button class="archive-item" data-id="${a.id}">
      <span class="archive-thumb">${imageMarkup(a)}</span>
      <span><small>${a.tags.slice(0,2).join(" · ")}</small><strong>${a.title}</strong></span>
    </button>`).join("")}</section>`).join("");
  $$(".archive-item").forEach(b=>b.addEventListener("click",()=>{
    const a=articleById(b.dataset.id);
    state.processed.delete(a.id);persist();switchScreen("cardsScreen");state.feed="forYou";renderDeck();
    setTimeout(()=>{const c=$(`.news-card[data-id="${a.id}"]`,deck);if(c)openDetail(a,c)},80);
  }));
}
function renderMe(){
  $("#interestChips").innerHTML=state.interests.map((x,i)=>`<button class="interest-chip" data-index="${i}" title="タップで削除">${x}</button>`).join("");
  $$(".interest-chip").forEach(b=>b.addEventListener("click",()=>{state.interests.splice(Number(b.dataset.index),1);persist();renderMe();renderDeck()}));
  updateStats();applyTheme();
}
function updateStats(){
  $("#screenedStat").textContent=state.processed.size;
  $("#savedStat").textContent=state.saved.size;
  $("#likedStat").textContent=state.liked.size;
}

function showAppAfterSplash(){
  app.classList.remove("hidden");
  if(localStorage.getItem("kawasemiTutorialDone")==="1"){
    renderAll();
  }else{
    tutorial.classList.remove("hidden");tutorial.setAttribute("aria-hidden","false");
  }
}
function enterSplash(){
  splash.classList.add("launched");
  setTimeout(()=>splash.classList.add("fade-out"),700);
  setTimeout(()=>{splash.classList.add("hidden");showAppAfterSplash()},1080);
}
function bindSplash(){
  let start=null;
  const begin=(x,y)=>{start={x,y};$("#splashBird").style.transition="none"};
  const move=(x,y)=>{
    if(!start)return;
    const dy=Math.min(0,y-start.y);
    const p=Math.min(1,Math.abs(dy)/250);
    $("#splashBird").style.transform=`translateX(-50%) translateY(${dy*.7}px) scale(${1-p*.45})`;
    $(".splash-photo").style.transform=`scale(${1.04+p*.045})`;
  };
  const end=(x,y)=>{
    if(!start)return;const dy=y-start.y;start=null;
    $("#splashBird").style.transition="";
    if(dy<-120)return enterSplash();
    $("#splashBird").style.transform="";
    $(".splash-photo").style.transform="";
  };
  splash.addEventListener("touchstart",e=>{const t=e.touches[0];begin(t.clientX,t.clientY)},{passive:true});
  splash.addEventListener("touchmove",e=>{const t=e.touches[0];move(t.clientX,t.clientY)},{passive:true});
  splash.addEventListener("touchend",e=>{const t=e.changedTouches[0];end(t.clientX,t.clientY)},{passive:true});
  splash.addEventListener("pointerdown",e=>{if(e.pointerType!=="touch"){begin(e.clientX,e.clientY);splash.setPointerCapture?.(e.pointerId)}});
  splash.addEventListener("pointermove",e=>{if(start&&e.pointerType!=="touch")move(e.clientX,e.clientY)});
  splash.addEventListener("pointerup",e=>{if(start&&e.pointerType!=="touch")end(e.clientX,e.clientY)});
}
function renderAll(){renderDeck();renderDiscover();renderSavedArchive();renderMe()}
function finishTutorial(){
  localStorage.setItem("kawasemiTutorialDone","1");
  tutorial.classList.add("hidden");tutorial.setAttribute("aria-hidden","true");renderAll();
}

$$(".feed-tab").forEach(b=>b.addEventListener("click",()=>switchFeed(b.dataset.feed)));
$$(".action-circle").forEach(b=>b.addEventListener("click",()=>{
  if(b.dataset.action==="known")handleKnown();
  if(b.dataset.action==="save")handleSave();
  if(b.dataset.action==="read")handleRead();
}));
$$(".nav-btn").forEach(b=>b.addEventListener("click",()=>switchScreen(b.dataset.screen)));
$$(".archive-switch button").forEach(b=>b.addEventListener("click",()=>{state.archiveMode=b.dataset.archive;renderSavedArchive()}));
$$("[data-theme-choice]").forEach(b=>b.addEventListener("click",()=>{
  state.themeChoice=b.dataset.themeChoice;localStorage.setItem("kawasemiTheme",state.themeChoice);applyTheme();
}));
$("#interestForm").addEventListener("submit",e=>{
  e.preventDefault();const input=$("#interestInput"),v=input.value.trim();if(!v)return;
  if(!state.interests.some(x=>x.toLowerCase()===v.toLowerCase()))state.interests.push(v);
  input.value="";persist();renderMe();renderDeck();
});
$("#detailLike").addEventListener("click",toggleLike);
$("#detailBookmark").addEventListener("click",toggleDetailSave);
$("#undoBtn").addEventListener("click",undo);
$("#tutorialDone").addEventListener("click",finishTutorial);

applyTheme();
bindSplash();
bindDetailSwipe();
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));