const cards=[
{
  id:'ua-rebuild',country:'🇺🇦 UKRAINE',palette:['#2f4657','#aa9147'],tags:['政治','復興','経済'],
  title:'政府、復旧予算の追加配分案を発表　住宅再建を最優先に',
  summary:'追加の復旧予算を住宅再建へ重点配分する方針。対象地域と財源が次の焦点になる。',
  source:'Kyiv Independent',
  image:'https://images.unsplash.com/photo-1569511166187-97eb6e387e19?auto=format&fit=crop&w=1200&q=82',
  what:'追加予算の配分先として、損壊住宅の再建を優先する方針が示されました。',
  why:'住宅再建は避難者の帰還、地方経済、自治体財政に直接影響します。',watch:'対象地域と財源の正式決定。'
},
{
  id:'us-cpi',country:'🇺🇸 WORLD',palette:['#572c34','#29384b'],tags:['経済','市場'],
  title:'米国の消費者物価、伸びが鈍化　市場は利下げ時期を再評価',
  summary:'物価上昇率が予想を下回り、金利見通しが変化。ドルと株式市場にも反応が出た。',
  source:'Reuters',
  image:'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=1200&q=82',
  what:'最新の消費者物価統計が市場予想を下回りました。',
  why:'米金利は為替、資金調達、欧州や新興国の市場にも広く影響します。',watch:'次回FOMCまでの雇用・物価指標。'
},
{
  id:'eu-sanctions',country:'🇪🇺 EUROPE',palette:['#2f4665','#8e7b43'],tags:['制裁','外交','安全保障'],
  title:'EU、対ロ追加制裁で合意　エネルギーと金融への規制を強化',
  summary:'新たな制裁パッケージがまとまり、エネルギー収入と金融取引への制限が強まる。',
  source:'European Commission',
  image:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82',
  what:'EU加盟国が追加制裁の主要項目で合意しました。',
  why:'ロシアの戦費調達と欧州企業の取引双方に影響するためです。',watch:'各国での実施時期と例外規定。'
},
{
  id:'ua-east',country:'🇺🇦 WAR',palette:['#563839','#8c6645'],tags:['戦況','軍事'],
  title:'東部戦線で攻撃方向に変化　複数地点の動きを確認',
  summary:'占領面積よりも攻撃軸の変化が重要。複数の公開情報から方向転換が確認された。',
  source:'HATO Desk',image:null,
  what:'複数地点で部隊移動と攻撃方向の変化が確認されています。',
  why:'攻撃軸の変化は補給、予備兵力、次の重点地域を読む材料になります。',watch:'48時間以内の部隊配置と補給線の変化。'
}
];

let index=0;
let history=[];
let understood=new Set();
let saved=new Set(JSON.parse(localStorage.getItem('hatoSaved')||'[]'));
let drag=null;
let toastTimer=null;
let detailStartX=0;
let lastCardRect=null;
let detailClosing=false;

const $=s=>document.querySelector(s);
const deck=$('#deck');
const stage=$('#cardStage');
const intro=$('#batchIntro');
const clear=$('#clearScreen');
const detail=$('#detail');

function flagFromCountry(c){return c.split(' ')[0]||'🌍'}
function persistSaved(){localStorage.setItem('hatoSaved',JSON.stringify([...saved]));updateSavedCount()}
function updateSavedCount(){$('#savedCount').textContent=saved.size}
function flagFallback(country,a,b){return `<div class="flag-fallback" style="background:linear-gradient(145deg,${a},${b});"><span class="flag-emoji">${flagFromCountry(country)}</span></div>`}
function mediaHTML(d){
  if(d.image){
    return `<img src="${d.image}" alt="" loading="eager" onerror="this.parentElement.innerHTML=flagFallback('${d.country}','${d.palette[0]}','${d.palette[1]}')">`;
  }
  return flagFallback(d.country,d.palette[0],d.palette[1]);
}

function renderDeck(){
  deck.innerHTML='';
  $('#position').textContent=Math.min(index+1,cards.length);
  $('#total').textContent=cards.length;
  if(index>=cards.length){
    stage.classList.add('hidden');
    clear.classList.remove('hidden');
    $('#clearDone').textContent=cards.length;
    $('#clearTotal').textContent=cards.length;
    $('#clearStats').textContent=`${cards.length} stories screened · ${understood.size} deeply read · ${saved.size} saved`;
    if(navigator.vibrate)navigator.vibrate([35,45,70]);
    return;
  }
  clear.classList.add('hidden');
  for(let p=Math.min(2,cards.length-1-index);p>=0;p--){
    const d=cards[index+p];
    const el=document.createElement('article');
    el.className='news-card'+(p===1?' back1':p===2?' back2':'');
    el.dataset.pos=p;
    const [a,b]=d.palette;
    el.innerHTML=`<div class="country-band" style="background:linear-gradient(90deg,${a},${b})"></div>
      <div class="card-content">
        <div class="card-head"><div class="country-label">${d.country}</div><div class="save-mark">${saved.has(d.id)?'↑':'♡'}</div></div>
        <div class="tags card-tags">${d.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <h2 class="card-title">${d.title}</h2>
        <p class="card-summary">${d.summary}</p>
        <div class="source">${d.source}</div>
        <div class="visual">${mediaHTML(d)}</div>
        ${understood.has(d.id)?'<div class="understood">理解できた ✓</div>':''}
        ${saved.has(d.id)?'<div class="saved-pill">SAVED ↑</div>':''}
        <div class="swipe-badge left">知ってる</div>
        <div class="swipe-badge right">もっと知る</div>
        <div class="swipe-badge up">あとで読む ↑</div>
      </div>`;
    deck.appendChild(el);
  }
  bindSwipe();
}

function topCard(){return deck.querySelector('.news-card[data-pos="0"]')}
function resetVisualBadges(c){c.querySelectorAll('.swipe-badge').forEach(x=>x.style.opacity=0)}
function reset(c){c.style.transform='';resetVisualBadges(c)}

function bindSwipe(){
  const c=topCard();
  if(!c)return;
  const start=(x,y,id)=>{drag={x,y,id,axis:null};c.style.transition='none'};
  const move=(x,y)=>{
    if(!drag)return;
    const dx=x-drag.x,dy=y-drag.y;
    if(!drag.axis&&(Math.abs(dx)>8||Math.abs(dy)>8))drag.axis=Math.abs(dx)>=Math.abs(dy)?'x':'y';
    if(drag.axis==='y'){
      if(dy>0){resetVisualBadges(c);return}
      c.style.transform=`translateY(${dy*.72}px) scale(${1-Math.min(.035,Math.abs(dy)/5000)})`;
      c.querySelector('.swipe-badge.up').style.opacity=Math.max(0,Math.min(1,-dy/95));
      c.querySelector('.swipe-badge.left').style.opacity=0;
      c.querySelector('.swipe-badge.right').style.opacity=0;
      return;
    }
    c.style.transform=`translateX(${dx}px) rotate(${dx/24}deg)`;
    c.querySelector('.swipe-badge.left').style.opacity=Math.max(0,Math.min(1,-dx/95));
    c.querySelector('.swipe-badge.right').style.opacity=Math.max(0,Math.min(1,dx/95));
    c.querySelector('.swipe-badge.up').style.opacity=0;
  };
  const end=(x,y)=>{
    if(!drag)return;
    const dx=x-drag.x,dy=y-drag.y,axis=drag.axis;
    drag=null;
    c.style.transition='transform .25s cubic-bezier(.2,.8,.2,1),opacity .22s ease';
    if(axis==='y'&&dy<-90){saveForLater(c);return}
    if(axis==='x'&&dx<-90){acceptKnown(c);return}
    if(axis==='x'&&dx>90){openMore(c);return}
    reset(c);
  };
  c.addEventListener('touchstart',e=>{const t=e.touches[0];start(t.clientX,t.clientY,'t')},{passive:true});
  c.addEventListener('touchmove',e=>{const t=e.touches[0];move(t.clientX,t.clientY)},{passive:true});
  c.addEventListener('touchend',e=>{const t=e.changedTouches[0];end(t.clientX,t.clientY)},{passive:true});
  c.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;start(e.clientX,e.clientY,'m')});
  window.addEventListener('pointermove',e=>{if(drag?.id==='m')move(e.clientX,e.clientY)});
  window.addEventListener('pointerup',e=>{if(drag?.id==='m')end(e.clientX,e.clientY)});
}

function pushHistory(){history.push({index,understood:[...understood],saved:[...saved]})}
function acceptKnown(c){pushHistory();c.style.transform='translateX(-120vw) rotate(-15deg)';c.style.opacity='0';showUndo('「知ってる」にしました');setTimeout(()=>{index++;renderDeck()},220)}
function saveForLater(c){
  pushHistory();
  const d=cards[index];saved.add(d.id);persistSaved();
  c.style.transform='translateY(-105vh) scale(.96)';c.style.opacity='0';showUndo('あとで読むに保存しました');
  setTimeout(()=>{index++;renderDeck()},230);
}
function openMore(c){lastCardRect=c.getBoundingClientRect();c.style.transform='translateX(16px) rotate(1.5deg)';setTimeout(()=>{reset(c);openDetail(c)},80)}

function fillDetail(){
  const d=cards[index];
  $('#detailPosition').textContent=`${index+1} / ${cards.length}`;
  $('#detailCountry').textContent=d.country;
  $('#detailTags').innerHTML=d.tags.map(t=>`<span class="tag">${t}</span>`).join('');
  $('#detailTitle').textContent=d.title;$('#detailDek').textContent=d.summary;$('#detailThree').textContent=d.summary;
  $('#detailWhat').textContent=d.what;$('#detailWhy').textContent=d.why;$('#detailWatch').textContent=d.watch;$('#detailSource').textContent=d.source;
  $('#detailHero').innerHTML=mediaHTML(d);$('#detailSave').textContent=saved.has(d.id)?'✓':'↑';
}
function setDetailFromRect(rect){
  const vw=window.innerWidth,vh=window.innerHeight;
  detail.style.transform=`translate(${rect.left}px,${rect.top}px) scale(${rect.width/vw},${rect.height/vh})`;
  detail.style.borderRadius='30px';
}
function openDetail(c){
  fillDetail();
  const rect=lastCardRect||c?.getBoundingClientRect()||{left:0,top:0,width:window.innerWidth,height:window.innerHeight};
  setDetailFromRect(rect);detail.classList.remove('closing');detail.classList.add('preopen');detail.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=>requestAnimationFrame(()=>detail.classList.add('open')));
}
function closeDetail(){
  if(detailClosing)return;
  detailClosing=true;
  const d=cards[index];understood.add(d.id);
  const target=topCard()?.getBoundingClientRect()||lastCardRect;
  detail.classList.remove('open');detail.classList.add('closing');if(target)setDetailFromRect(target);
  setTimeout(()=>{detail.classList.remove('preopen','closing');detail.setAttribute('aria-hidden','true');detail.style.transform='';detail.style.borderRadius='';detailClosing=false;renderDeck()},390);
}
function saveFromDetail(){
  const d=cards[index];
  if(saved.has(d.id)){saved.delete(d.id);showUndo('保存を解除しました')}else{saved.add(d.id);showUndo('あとで読むに保存しました')}
  persistSaved();$('#detailSave').textContent=saved.has(d.id)?'✓':'↑';
}

function undo(){
  const h=history.pop();if(!h)return;
  index=h.index;understood=new Set(h.understood);saved=new Set(h.saved);persistSaved();
  clear.classList.add('hidden');stage.classList.remove('hidden');renderDeck();$('#undoToast').classList.remove('show');
}
function showUndo(t){$('#undoText').textContent=t;$('#undoToast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#undoToast').classList.remove('show'),4500)}

function openMenu(){$('#menu').classList.add('open');$('#menuScrim').classList.add('open');$('#menu').setAttribute('aria-hidden','false');renderSavedList()}
function closeMenu(){$('#menu').classList.remove('open');$('#menuScrim').classList.remove('open');$('#menu').setAttribute('aria-hidden','true')}
function renderSavedList(){
  const box=$('#savedList');const rows=cards.filter(d=>saved.has(d.id));box.classList.remove('hidden');
  box.innerHTML=rows.length?rows.map(d=>`<button class="saved-card" data-id="${d.id}"><small>${d.country} · ${d.source}</small><strong>${d.title}</strong></button>`).join(''):`<div class="saved-empty">まだ保存した記事はありません。<br>カードを上へスワイプするとここに残ります。</div>`;
  box.querySelectorAll('.saved-card').forEach(btn=>btn.addEventListener('click',()=>{
    const i=cards.findIndex(d=>d.id===btn.dataset.id);if(i<0)return;index=i;intro.classList.add('hidden');clear.classList.add('hidden');stage.classList.remove('hidden');renderDeck();closeMenu();setTimeout(()=>openDetail(topCard()),100);
  }));
}

$('#startBatch').addEventListener('click',()=>{intro.classList.add('hidden');stage.classList.remove('hidden');renderDeck()});
$('#detailBack').addEventListener('click',closeDetail);$('#detailSave').addEventListener('click',saveFromDetail);
$('#undoBtn').addEventListener('click',undo);$('#undoTop').addEventListener('click',undo);
$('#menuOpen').addEventListener('click',openMenu);$('#menuClose').addEventListener('click',closeMenu);$('#menuScrim').addEventListener('click',closeMenu);$('#menuNow').addEventListener('click',closeMenu);$('#menuSaved').addEventListener('click',renderSavedList);
detail.addEventListener('touchstart',e=>{detailStartX=e.touches[0].clientX},{passive:true});
detail.addEventListener('touchend',e=>{if(e.changedTouches[0].clientX-detailStartX<-70)closeDetail()},{passive:true});

$('#batchCount').textContent=cards.length;$('#total').textContent=cards.length;updateSavedCount();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
