const capcutSVG='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 18h40L18 46h34M12 46h40L18 18h34" fill="none" stroke="#111" stroke-linecap="round" stroke-linejoin="round" stroke-width="5.5"></path></svg>';

const basePhotos=[
  {src:BM_PHOTOS[0],size:"1.2 MB",sizeMB:1.2,date:"2026年8月16日 09:41",place:""},
  {src:BM_PHOTOS[1],size:"820 KB",sizeMB:.82,date:"2026年8月16日 09:38",place:""},
  {src:BM_PHOTOS[2],size:"3.8 MB",sizeMB:3.8,date:"2026年8月16日 09:33",place:""},
  {src:BM_PHOTOS[3],size:"2.1 MB",sizeMB:2.1,date:"2026年8月16日 09:27",place:""},
  {src:BM_PHOTOS[4],size:"5.4 MB",sizeMB:5.4,date:"2026年8月15日 17:04",place:""}
];
const photos=Array.from({length:30},(_,i)=>({...basePhotos[i%basePhotos.length],demoIndex:i}));

const film=document.getElementById("film"),counter=document.getElementById("counter");
const viewer=document.getElementById("viewer"),viewerImg=document.getElementById("viewerImg"),viewerSize=document.getElementById("viewerSize");
const backdrop=document.getElementById("backdrop"),sheet=document.getElementById("sheet"),detailDate=document.getElementById("detailDate"),detailPlace=document.getElementById("detailPlace"),neighbors=document.getElementById("neighbors");
const deleteBackdrop=document.getElementById("deleteBackdrop"),deleteSheet=document.getElementById("deleteSheet"),deleteSheetBody=document.getElementById("deleteSheetBody");
const appCard=document.getElementById("appCard"),appTrash=document.getElementById("appTrash"),mainNav=document.getElementById("mainNav");
const openingArt=document.getElementById("openingArt"),completionArt=document.getElementById("completionArt");
const queued=new Set();
let current=0;
let appQueued=false;
let appDeletionConfirmed=false;
let photoReviewCompleted=false;
let photoDeletionConfirmed=false;
let deletedPhotoCount=0;
let deletedPhotoMB=0;

if(window.BM_BRAND_ASSETS){openingArt.src=window.BM_BRAND_ASSETS.opening;completionArt.src=window.BM_BRAND_ASSETS.complete;}
function signal(){return '<span class="signal" aria-hidden="true"><i></i><i></i><i></i></span>'}
function vibrate(){if(navigator.vibrate)navigator.vibrate(6)}
function render(){film.innerHTML="";photos.forEach((p,i)=>{if(queued.has(i))return;const card=document.createElement("article");card.className="photo-card";card.dataset.i=i;card.innerHTML=`<img class="photo-media" src="${p.src}" alt=""><div class="size-badge">${signal()}${p.size}</div>`;film.appendChild(card)});counter.textContent=`${Math.min(current+1,photos.length)} / ${photos.length}`;updateReview()}
function queuedMB(){return [...queued].reduce((sum,i)=>sum+(photos[i]?.sizeMB||0),0)}
function formatStorage(photoMB=0,includeApp=false){const totalGB=(includeApp?1.8:0)+photoMB/1024;return totalGB>=1?`${totalGB.toFixed(2)} GB`:`${Math.max(0,Math.round(photoMB))} MB`}
function updateReview(){
  const count=queued.size,bytes=queuedMB();
  const p=document.getElementById("photoReviewCount"),sz=document.getElementById("photoReviewSize"),total=document.getElementById("totalSize"),summary=document.getElementById("finalSummary"),photoRow=document.getElementById("photoReviewRow"),t1=document.getElementById("reviewThumb1"),t2=document.getElementById("reviewThumb2"),deleteBtn=document.getElementById("deleteBtn");
  if(p)p.textContent=`${count}枚`;
  if(sz)sz.textContent=bytes>=1?`${bytes.toFixed(bytes<10?1:0)} MB`:`${Math.round(bytes*1024)} KB`;
  if(photoRow)photoRow.style.display=count?"grid":"none";
  const q=[...queued];
  if(t1&&q.length){t1.src=photos[q[0]].src;t1.style.display=""}else if(t1)t1.style.display="none";
  if(t2&&q.length>1){t2.src=photos[q[1]].src;t2.style.display=""}else if(t2)t2.style.display="none";
  if(total)total.textContent=formatStorage(bytes,false);
  if(summary)summary.textContent=`写真・動画 ${count}枚`;
  if(deleteBtn){deleteBtn.disabled=!photoReviewCompleted;deleteBtn.textContent=count?"削除を進める":"アプリ整理へ";}
}
function updateCompletion(){
  document.getElementById("completionPhotos").textContent=`${photoDeletionConfirmed?deletedPhotoCount:0}枚`;
  document.getElementById("completionApps").textContent=`${appDeletionConfirmed?1:0}個`;
  document.getElementById("completionStorage").textContent=formatStorage(photoDeletionConfirmed?deletedPhotoMB:0,appDeletionConfirmed);
}
function openViewer(i){const p=photos[i];viewerImg.src=p.src;viewerSize.innerHTML=signal()+p.size;viewer.classList.add("show")}
function closeViewer(){viewer.classList.remove("show")}
document.getElementById("viewerClose").addEventListener("click",closeViewer);
function openDetails(i){const p=photos[i];detailDate.textContent=p.date;detailPlace.textContent=p.place||"";neighbors.innerHTML="";[i-2,i-1,i,i+1,i+2].filter(x=>x>=0&&x<photos.length).forEach(x=>{const im=document.createElement("img");im.className="neighbor";im.src=photos[x].src;im.alt="";neighbors.appendChild(im)});backdrop.classList.add("show");sheet.classList.add("show")}
function closeDetails(){backdrop.classList.remove("show");sheet.classList.remove("show")}
backdrop.addEventListener("click",closeDetails);
function openDeleteSheet(html){deleteSheetBody.innerHTML=html;deleteBackdrop.classList.add("show");deleteSheet.classList.add("show")}
function closeDeleteSheet(){deleteBackdrop.classList.remove("show");deleteSheet.classList.remove("show")}
deleteBackdrop.addEventListener("click",closeDeleteSheet);
function appHead(sub="iPhoneで削除"){return `<div class="delete-sheet-head"><div class="delete-app-icon">${capcutSVG}</div><div><div class="delete-sheet-title">CapCut</div><div class="delete-sheet-sub">${sub}</div></div></div>`}
async function copyAppName(btn){const done=()=>{btn.querySelector("span").textContent="コピーしました";btn.classList.add("copied");setTimeout(()=>{btn.querySelector("span").textContent="CapCutをコピー";btn.classList.remove("copied")},1200)};try{await navigator.clipboard.writeText("CapCut");done()}catch(e){const ta=document.createElement("textarea");ta.value="CapCut";ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();done()}}
function showAppDeleteGuide(){
  appQueued=true;
  openDeleteSheet(`${appHead()}<button class="copy-app-name" id="copyAppName" type="button"><span>CapCutをコピー</span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="10" height="10" rx="2"></rect><path d="M6 15H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path></svg></button><div class="delete-instructions"><div class="delete-instruction"><span class="delete-step">1</span><span>ホーム画面を下にスワイプして検索を開く</span></div><div class="delete-instruction"><span class="delete-step">2</span><span>「CapCut」を貼り付けて検索</span></div><div class="delete-instruction"><span class="delete-step">3</span><span>検索結果のCapCutを長押し</span></div><div class="delete-instruction"><span class="delete-step">4</span><span>「Appを削除」→ もう一度「Appを削除」</span></div></div><p class="delete-sheet-note">be minimalからApp本体を直接削除することはありません。</p><button class="delete-sheet-primary" id="appDeletedBtn">削除した</button><button class="delete-sheet-secondary" id="appLaterBtn">あとで</button>`);
  document.getElementById("copyAppName").onclick=e=>copyAppName(e.currentTarget);
  const laterBtn=document.getElementById("appLaterBtn");
  document.getElementById("appDeletedBtn").onclick=()=>{
    appDeletionConfirmed=true;appQueued=false;updateCompletion();
    const btn=document.getElementById("appDeletedBtn");
    btn.disabled=true;btn.classList.add("is-complete");btn.innerHTML='<span class="delete-check" aria-hidden="true">✓</span>削除完了';
    laterBtn.textContent="完了を見る";
    laterBtn.onclick=()=>{closeDeleteSheet();updateCompletion();go("completion")};
    vibrate();
  };
  laterBtn.onclick=closeDeleteSheet;
}
function confirmPhotosAndContinue(){deletedPhotoCount=queued.size;deletedPhotoMB=queuedMB();photoDeletionConfirmed=true;updateCompletion();go("apps")}
function startDeleteFlow(){if(!photoReviewCompleted)return;confirmPhotosAndContinue()}
let asx=0,asy=0,alx=0,aly=0,alt=0,avy=0,appDragging=false;
function appTrashHot(on){appTrash.classList.toggle("hot",on)}
function restoreApp(){appCard.animate([{transform:appCard.style.transform||"none",opacity:appCard.style.opacity||1},{transform:"translate3d(0,0,0) scale(1)",opacity:1}],{duration:180,easing:"cubic-bezier(.2,.78,.18,1)"}).onfinish=()=>{appCard.style.transform="";appCard.style.opacity="";appTrashHot(false)}}
function openGuideFromSwipe(){vibrate();appTrashHot(true);appCard.animate([{transform:appCard.style.transform||"none",opacity:1},{transform:"translate3d(0,-30px,0) scale(.985)",opacity:.72}],{duration:130,easing:"cubic-bezier(.2,.8,.2,1)"}).onfinish=()=>{appCard.style.transform="";appCard.style.opacity="";appTrashHot(false);showAppDeleteGuide()}}
appCard.addEventListener("pointerdown",e=>{asx=alx=e.clientX;asy=aly=e.clientY;alt=performance.now();avy=0;appDragging=false;appCard.setPointerCapture?.(e.pointerId)});
appCard.addEventListener("pointermove",e=>{const now=performance.now(),dt=Math.max(8,now-alt),dx=e.clientX-asx,dy=e.clientY-asy;avy=(e.clientY-aly)/dt*1000;alx=e.clientX;aly=e.clientY;alt=now;if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)*.7)appDragging=true;if(!appDragging)return;if(dy<0){appCard.style.transform=`translate3d(${dx*.05}px,${dy*.58}px,0) scale(${1-Math.min(.018,Math.abs(dy)/7000)})`;appTrashHot(dy<-28)}else{appCard.style.transform=`translate3d(${dx*.03}px,${dy*.12}px,0)`;appTrashHot(false)}e.preventDefault()});
appCard.addEventListener("pointerup",e=>{const dy=e.clientY-asy;if(appDragging&&(dy<-46||avy<-650)){openGuideFromSwipe();return}restoreApp()});
appCard.addEventListener("pointercancel",restoreApp);
const screens={photos:document.getElementById("photosScreen"),apps:document.getElementById("appsScreen"),final:document.getElementById("finalScreen"),completion:document.getElementById("completionScreen")};
function go(name){if(name==="final")updateReview();if(name==="completion")updateCompletion();Object.entries(screens).forEach(([k,s])=>s.classList.toggle("active",k===name));document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.target===name));mainNav.classList.toggle("is-hidden",name==="completion")}
window.onPhotoReviewComplete=()=>{if(photoReviewCompleted)return;photoReviewCompleted=true;updateReview();setTimeout(()=>go("final"),180)};
function resetSession(){queued.clear();appQueued=false;appDeletionConfirmed=false;photoReviewCompleted=false;photoDeletionConfirmed=false;deletedPhotoCount=0;deletedPhotoMB=0;current=0;counter.textContent=`1 / ${photos.length}`;updateReview();updateCompletion();if(typeof window.resetPhotoReview==="function")window.resetPhotoReview();else render();go("photos")}
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>go(b.dataset.target)));
document.getElementById("cancelBtn").addEventListener("click",()=>go("photos"));
document.getElementById("deleteBtn").addEventListener("click",startDeleteFlow);
document.getElementById("againBtn").addEventListener("click",resetSession);
render();