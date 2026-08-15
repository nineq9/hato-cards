(()=>{
  if(window.__HATO_TITLE_FLOW__)return;
  window.__HATO_TITLE_FLOW__=true;

  const style=document.createElement('style');
  style.textContent=`
    #feed article.story.hato-wrap-title .story-main{display:block!important;min-width:0!important}
    #feed article.story.hato-wrap-title .story-title-flow{display:block!important;min-width:0!important;margin-top:0!important}
    #feed article.story.hato-wrap-title .story-title-flow::after{content:"";display:block;clear:both}
    #feed article.story.hato-wrap-title .story-art{float:right!important;width:88px!important;aspect-ratio:1.35/1!important;margin:0 0 8px 12px!important;display:block!important;overflow:hidden!important;background:#ececea!important}
    #feed article.story.hato-wrap-title h2{font-size:18px!important;line-height:1.14!important;letter-spacing:-.022em!important;margin:0 0 8px!important;font-weight:820!important;clear:none!important;overflow:visible!important}
    #feed article.story.hato-wrap-title h2 .open-article{display:inline!important;width:auto!important;clear:none!important}
    #feed article.story.hato-wrap-title .meta{clear:both!important;margin-top:2px!important}
    @media(min-width:521px){
      #feed article.story.hato-wrap-title .story-art{width:96px!important;margin-left:14px!important}
      #feed article.story.hato-wrap-title h2{font-size:19px!important}
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

  if(!document.getElementById('hatoRuntime20260816')){
    const script=document.createElement('script');
    script.id='hatoRuntime20260816';
    script.src='./hato-runtime-20260816.js?v=1';
    script.defer=true;
    document.head.appendChild(script);
  }
})();
