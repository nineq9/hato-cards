(()=>{
  if(window.__HATO_HOTFIX_V1__) return;
  window.__HATO_HOTFIX_V1__=true;
  const style=document.createElement('style');
  style.textContent=`
    #hatoAudioShort,#hatoAudioLong,.hato-audio-btn,
    #hatoAudioShort span,#hatoAudioLong span,
    .archive-audio-btn,.archive-audio-btn::before{
      background:transparent!important;
      background-color:transparent!important;
      background-image:none!important;
      box-shadow:none!important;
      border:0!important;
      outline:0!important;
      -webkit-appearance:none!important;
      appearance:none!important;
    }
    #hatoAudioShort,#hatoAudioLong,.hato-audio-btn{
      width:18px!important;
      height:18px!important;
      min-width:18px!important;
      min-height:18px!important;
      padding:0!important;
      margin:0!important;
      border-radius:0!important;
      clip-path:none!important;
      overflow:visible!important;
      display:grid!important;
      place-items:center!important;
    }
    #hatoAudioShort span,#hatoAudioLong span,.hato-audio-btn span,
    .archive-audio-btn::before{
      font-size:14px!important;
      line-height:1!important;
    }
    .archive-audio-btn{
      width:18px!important;
      height:18px!important;
      min-width:18px!important;
      min-height:18px!important;
      padding:0!important;
      border-radius:0!important;
    }
    #feed .story.hato-wrap-title .story-main{
      display:block!important;
      min-width:0!important;
      overflow:visible!important;
    }
    #feed .story.hato-wrap-title .story-art{
      margin-top:0!important;
      margin-bottom:4px!important;
    }
    #feed .story.hato-wrap-title h2{
      clear:none!important;
      margin-top:0!important;
      padding-top:0!important;
      overflow:visible!important;
    }
    #feed .story.hato-wrap-title .story-topline{
      margin-bottom:4px!important;
    }
  `;
  document.head.appendChild(style);
})();