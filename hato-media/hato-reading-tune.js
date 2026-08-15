(()=>{
  let tries=0;
  const boot=()=>{
    const app=window.__HATO_BRIDGE__;
    if((!app||!Array.isArray(app.articles))&&tries++<80){setTimeout(boot,50);return;}
    if(!app||!Array.isArray(app.articles)||window.__HATO_READING_TUNE__)return;
    window.__HATO_READING_TUNE__=true;

    const style=document.createElement('style');
    style.textContent=`
      .hato-inbox-hint{font-size:0!important;width:28px;height:20px;position:relative}
      .hato-inbox-hint::after{content:'✓';display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:var(--orange);color:#fff;font-size:12px;font-weight:900;position:absolute;right:0;top:0}
      #feed article.hato-swiping{box-shadow:100vw 0 0 var(--orange)!important}
      #feed article.hato-swiping::after{content:'✓'!important;color:#fff!important;font-size:26px!important;font-weight:900!important;left:calc(100% + 22px)!important}
    `;
    document.head.appendChild(style);

    const key='hato-inbox-dismissed-v4';
    const dismissSilently=id=>{
      id=Number(id);if(!id)return;
      let ids=[];
      try{ids=JSON.parse(localStorage.getItem(key)||'[]').map(Number);}catch(e){}
      if(!ids.includes(id)){ids.push(id);try{localStorage.setItem(key,JSON.stringify(ids));}catch(e){}}
      setTimeout(()=>app.rerender?.(),0);
    };
    const currentId=()=>{
      const title=document.getElementById('articleContent')?.querySelector('h1')?.textContent?.trim();
      const item=app.articles.find(a=>a.title?.trim()===title);
      return item?.id??null;
    };

    // Opening and reading an article counts as processing it: when the normal back button is used,
    // it disappears from the inbox automatically. Swipe-left remains the faster gesture.
    document.getElementById('backArticle')?.addEventListener('click',()=>{
      const id=currentId();if(id!==null)dismissSilently(id);
    },true);
  };
  boot();
})();
