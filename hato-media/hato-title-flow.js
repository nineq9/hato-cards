(()=>{
  if(window.__HATO_TITLE_FLOW__)return;
  window.__HATO_TITLE_FLOW__=true;

  const style=document.createElement('style');
  style.textContent=`
    #feed article.story{grid-template-columns:30px minmax(0,1fr)!important;gap:8px!important;padding-left:0!important;padding-right:0!important}
    #feed article.story.hato-wrap-title .story-main{display:block!important;min-width:0!important;width:100%!important;max-width:none!important;overflow:visible!important}
    #feed article.story.hato-wrap-title .story-title-flow{display:block!important;width:100%!important;max-width:none!important;min-width:0!important;margin:0!important;padding:0!important;overflow:visible!important}
    #feed article.story.hato-wrap-title .story-title-flow::after{content:"";display:block;clear:both}
    #feed article.story.hato-wrap-title .story-art{float:right!important;clear:none!important;width:92px!important;height:64px!important;aspect-ratio:auto!important;margin:0 0 5px 10px!important;padding:0!important;display:block!important;overflow:hidden!important;background:#111!important}
    #feed article.story.hato-wrap-title h2{display:block!important;width:auto!important;max-width:none!important;font-size:15px!important;line-height:1.24!important;letter-spacing:-.012em!important;margin:0!important;padding:0!important;font-weight:800!important;clear:none!important;overflow:visible!important;word-break:normal!important;overflow-wrap:normal!important}
    #feed article.story.hato-wrap-title h2 .open-article{display:inline!important;width:auto!important;max-width:none!important;clear:none!important;margin:0!important;padding:0!important}
    #feed article.story.hato-wrap-title .meta{clear:both!important;margin-top:7px!important;padding-top:0!important}
    @media(min-width:521px){
      #feed article.story{grid-template-columns:34px minmax(0,1fr)!important;gap:10px!important}
      #feed article.story.hato-wrap-title .story-art{width:104px!important;height:72px!important;margin-left:12px!important}
      #feed article.story.hato-wrap-title h2{font-size:16px!important}
    }
  `;
  document.head.appendChild(style);

  const fix=()=>{
    document.querySelectorAll('#feed article.story[data-id]').forEach(card=>{
      const main=card.querySelector('.story-main');
      const art=card.querySelector('.story-art');
      const h2=card.querySelector('h2');
      if(!main||!art||!h2)return;
      card.classList.add('hato-wrap-title');
      let flow=main.querySelector('.story-title-flow');
      if(!flow){
        flow=document.createElement('div');
        flow.className='story-title-flow';
        h2.parentNode.insertBefore(flow,h2);
      }
      if(art.parentElement!==flow)flow.appendChild(art);
      if(h2.parentElement!==flow)flow.appendChild(h2);
    });
  };

  fix();
  new MutationObserver(()=>requestAnimationFrame(fix)).observe(document.body,{childList:true,subtree:true});

  const loadAxiosLayout=()=>{
    if(document.getElementById('hatoAxiosLayout20260816'))return;
    const s=document.createElement('script');
    s.id='hatoAxiosLayout20260816';
    s.src='./hato-axios-layout.js?v=1';
    s.defer=true;
    document.head.appendChild(s);
  };

  let runtime=document.getElementById('hatoRuntime20260816');
  if(!runtime){
    runtime=document.createElement('script');
    runtime.id='hatoRuntime20260816';
    runtime.src='./hato-runtime-20260816.js?v=2';
    runtime.defer=true;
    runtime.addEventListener('load',loadAxiosLayout,{once:true});
    document.head.appendChild(runtime);
  }else if(window.__HATO_RUNTIME_20260816__){
    loadAxiosLayout();
  }else{
    runtime.addEventListener('load',loadAxiosLayout,{once:true});
  }
})();
