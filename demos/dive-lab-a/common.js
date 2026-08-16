(function(){
  const own=document.currentScript && document.currentScript.src ? document.currentScript.src : location.href;
  const base=new URL('.',own);
  const files=['data.js','core.js','modes-a.js','modes-b.js','app-init.js'];
  const layoutFix=document.createElement('style');layoutFix.textContent='.article-card,.dive-card{height:calc(100dvh - 86px - var(--safe-top) - var(--safe-bottom))}.article-scroll{flex:1 1 auto}';document.head.appendChild(layoutFix);
  const load=(name)=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL(name,base).href;s.onload=resolve;s.onerror=()=>reject(new Error('Failed to load '+name));document.head.appendChild(s)});
  const ready=files.reduce((p,f)=>p.then(()=>load(f)),Promise.resolve());
  window.KLab={init(mode){ready.then(()=>window.KLabApp.init(mode)).catch(err=>{console.error(err);document.body.innerHTML='<p style="padding:24px;color:#f3f1ec;background:#081113">DIVE LAB failed to load.</p>'})}};
})();
