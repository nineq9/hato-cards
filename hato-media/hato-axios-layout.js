(()=>{
  if(window.__HATO_AXIOS_LAYOUT_20260816__)return;
  window.__HATO_AXIOS_LAYOUT_20260816__=true;

  const style=document.createElement('style');
  style.id='hato-axios-layout-style';
  style.textContent=`
    html body .feed{
      padding-left:20px!important;
      padding-right:20px!important;
    }

    html body #feed article.story.hato-wrap-title{
      display:block!important;
      position:relative!important;
      width:100%!important;
      margin:0!important;
      padding:18px 0 20px!important;
      border-bottom:1px solid #dedede!important;
      overflow:visible!important;
    }

    html body #feed article.story.hato-wrap-title .story-num{
      position:absolute!important;
      left:0!important;
      top:19px!important;
      width:27px!important;
      padding:0!important;
      margin:0!important;
      font-size:13px!important;
      line-height:1.15!important;
      font-weight:850!important;
      font-variant-numeric:tabular-nums!important;
    }

    html body #feed article.story.hato-wrap-title .story-main{
      display:block!important;
      width:100%!important;
      max-width:none!important;
      min-width:0!important;
      margin:0!important;
      padding:0!important;
      overflow:visible!important;
    }

    html body #feed article.story.hato-wrap-title .story-topline{
      display:flex!important;
      align-items:center!important;
      gap:8px!important;
      min-height:18px!important;
      margin:0 0 12px!important;
      padding:0 0 0 39px!important;
    }

    html body #feed article.story.hato-wrap-title .story-cat{
      font-size:10.5px!important;
      line-height:1.1!important;
      font-weight:850!important;
      letter-spacing:.075em!important;
      color:var(--orange)!important;
    }

    html body #feed article.story.hato-wrap-title .story-title-flow{
      display:flex!important;
      flex-direction:column!important;
      width:100%!important;
      min-width:0!important;
      max-width:none!important;
      margin:0!important;
      padding:0!important;
      overflow:visible!important;
    }

    html body #feed article.story.hato-wrap-title .story-title-flow::after{
      content:none!important;
      display:none!important;
      clear:none!important;
    }

    html body #feed article.story.hato-wrap-title h2{
      order:1!important;
      display:block!important;
      width:100%!important;
      max-width:none!important;
      clear:both!important;
      margin:0 0 12px!important;
      padding:0!important;
      font-size:18px!important;
      line-height:1.19!important;
      letter-spacing:-.018em!important;
      font-weight:800!important;
      overflow:visible!important;
      overflow-wrap:anywhere!important;
      word-break:normal!important;
      hyphens:auto!important;
    }

    html body #feed article.story.hato-wrap-title h2 .open-article{
      display:block!important;
      width:100%!important;
      max-width:none!important;
      margin:0!important;
      padding:0!important;
      text-align:left!important;
      line-height:inherit!important;
    }

    html body #feed article.story.hato-wrap-title .story-art{
      order:2!important;
      float:none!important;
      clear:both!important;
      display:block!important;
      width:100%!important;
      min-width:0!important;
      height:auto!important;
      aspect-ratio:16/8.5!important;
      margin:0 0 12px!important;
      padding:0!important;
      border:0!important;
      border-radius:5px!important;
      overflow:hidden!important;
      background:#111!important;
      line-height:0!important;
    }

    html body #feed article.story.hato-wrap-title .story-art img,
    html body #feed article.story.hato-wrap-title .story-art .hato-news-photo{
      display:block!important;
      width:100%!important;
      height:100%!important;
      margin:0!important;
      object-fit:cover!important;
      border-radius:inherit!important;
    }

    html body #feed article.story.hato-wrap-title .story-main>p{
      display:block!important;
      width:100%!important;
      max-width:none!important;
      margin:0 0 12px!important;
      padding:0!important;
      font-size:13.5px!important;
      line-height:1.48!important;
      color:#363636!important;
      letter-spacing:-.005em!important;
    }

    html body #feed article.story.hato-wrap-title .meta{
      display:flex!important;
      clear:both!important;
      align-items:center!important;
      gap:9px!important;
      width:100%!important;
      margin:0!important;
      padding:0!important;
      font-size:10.5px!important;
      line-height:1.2!important;
      color:#777!important;
    }

    html body #feed article.story.hato-wrap-title .source-link{
      font-weight:800!important;
    }

    html body #feed .timeline-chapter article.story:last-child{
      border-bottom:0!important;
    }

    @media(min-width:521px){
      html body .feed{padding-left:22px!important;padding-right:22px!important}
      html body #feed article.story.hato-wrap-title{padding-top:20px!important;padding-bottom:22px!important}
      html body #feed article.story.hato-wrap-title .story-num{top:21px!important;font-size:13.5px!important}
      html body #feed article.story.hato-wrap-title h2{font-size:20px!important;line-height:1.18!important}
      html body #feed article.story.hato-wrap-title .story-main>p{font-size:14px!important}
      html body #feed article.story.hato-wrap-title .story-art{aspect-ratio:16/8!important}
    }
  `;
  document.head.appendChild(style);

  const app=()=>window.__HATO_BRIDGE__;
  const imageSrc=id=>`./assets/article-${((Math.max(1,Number(id)||1)-1)%3)+1}.svg?v=2`;

  const ensureImages=()=>{
    const bridge=app();
    document.querySelectorAll('#feed article.story[data-id]').forEach(card=>{
      const art=card.querySelector('.story-art');
      if(!art)return;
      const id=Number(card.dataset.id)||1;
      const wanted=new URL(imageSrc(id),document.baseURI).href;
      let img=art.querySelector('img');
      if(!img||img.src!==wanted){
        img=document.createElement('img');
        img.className='hato-news-photo';
        img.src=imageSrc(id);
        img.alt='';
        img.loading='lazy';
        img.decoding='async';
        img.fetchPriority='low';
        img.onerror=()=>art.setAttribute('hidden','');
        art.replaceChildren(img);
      }
      art.removeAttribute('hidden');
    });

    const hero=document.querySelector('#articleContent .article-hero-art');
    if(hero&&bridge?.articles){
      const title=document.querySelector('#articleContent .article-title')?.textContent?.trim();
      const item=bridge.articles.find(a=>String(a.title||'').trim()===title);
      if(item){
        const wanted=new URL(imageSrc(item.id),document.baseURI).href;
        let img=hero.querySelector('img');
        if(!img||img.src!==wanted){
          img=document.createElement('img');
          img.className='hato-news-photo';
          img.src=imageSrc(item.id);
          img.alt='';
          img.loading='lazy';
          img.decoding='async';
          img.fetchPriority='low';
          img.onerror=()=>hero.setAttribute('hidden','');
          hero.replaceChildren(img);
        }
        hero.removeAttribute('hidden');
      }
    }
  };

  let raf=0;
  const refresh=()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(ensureImages);
  };

  let tries=0;
  const boot=()=>{
    if(!app()&&tries++<120){setTimeout(boot,50);return;}
    ensureImages();
    new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
    setTimeout(ensureImages,300);
    setTimeout(ensureImages,1000);
  };
  boot();
})();
