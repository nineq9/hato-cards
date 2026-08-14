/* KINGFISHER v10 interaction corrections */
(() => {
  const detailEl = document.getElementById('detail');
  const detailScrollEl = document.getElementById('detailScroll');
  const clamp01 = n => Math.max(0, Math.min(1, n));

  const style = document.createElement('style');
  style.textContent = `
    .feed-nav-btn[data-feed="hot"] i{display:none!important}
    .feed-nav-btn.has-unread::before{content:"";position:absolute;width:4px;height:4px;border-radius:50%;background:var(--kf-accent-orange);right:18%;top:9px;opacity:.9}
    .feed-nav-btn.is-empty::before{display:none!important}
    .detail-return-cue{cursor:pointer;user-select:none}
    .detail-return-cue b{animation:none!important;transform:none!important}
  `;
  document.head.appendChild(style);

  function remainingFor(feed) {
    let list = articles;
    if (feed === 'hot') list = articles.filter(a => a.hot);
    if (feed === 'must') list = articles.filter(a => a.must);
    return list.filter(a => !state.processed.has(a.id)).length;
  }

  function syncFeedIndicators() {
    document.querySelectorAll('.feed-nav-btn').forEach(btn => {
      const count = remainingFor(btn.dataset.feed);
      btn.classList.toggle('has-unread', count > 0);
      btn.classList.toggle('is-empty', count === 0);
      btn.dataset.remaining = String(count);
      btn.setAttribute('aria-label', `${btn.textContent.trim()} ${count}件`);
    });
  }

  const originalRenderDeck = renderDeck;
  renderDeck = function(...args) {
    const result = originalRenderDeck.apply(this, args);
    syncFeedIndicators();
    return result;
  };

  // Detail -> cards is always a LEFT swipe. Capture phase replaces the older gesture.
  if (detailScrollEl) {
    let g = null;
    const reset = () => {
      g = null;
      detailEl.classList.remove('dragging');
      if (detailEl.classList.contains('open')) {
        detailEl.style.transform = '';
        detailEl.style.opacity = '1';
      }
    };

    detailScrollEl.addEventListener('pointerdown', e => {
      if (!detailEl.classList.contains('open')) return;
      if (e.button !== undefined && e.button !== 0) return;
      e.stopImmediatePropagation();
      g = {id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null};
    }, true);

    detailScrollEl.addEventListener('pointermove', e => {
      if (!g || e.pointerId !== g.id) return;
      e.stopImmediatePropagation();
      const dx = e.clientX - g.x;
      const dy = e.clientY - g.y;
      if (!g.axis && Math.hypot(dx, dy) > 6) {
        if (Math.abs(dx) > Math.abs(dy) * 1.04) g.axis = 'x';
        else if (Math.abs(dy) > Math.abs(dx) * 1.08) g.axis = 'y';
      }
      if (g.axis !== 'x' || dx >= 0) return;
      e.preventDefault();
      const now = performance.now();
      const dt = Math.max(8, now - g.lastT);
      const instantV = (e.clientX - g.lastX) / dt;
      g.vx = g.vx * .42 + instantV * .58;
      g.lastX = e.clientX; g.lastT = now;
      const x = dx * .96;
      const progress = clamp01(Math.abs(dx) / Math.min(150, innerWidth * .38));
      detailEl.classList.add('dragging');
      detailEl.style.transform = `translate3d(${x}px,0,0) scale(${1-progress*.006})`;
      detailEl.style.opacity = String(1-progress*.10);
    }, {capture:true,passive:false});

    detailScrollEl.addEventListener('pointerup', e => {
      if (!g || e.pointerId !== g.id) return;
      e.stopImmediatePropagation();
      const dx = e.clientX - g.x, axis = g.axis, vx = g.vx;
      g = null;
      if (axis === 'x' && (dx <= -36 || vx <= -.22)) {
        detailEl.classList.remove('dragging');
        detailEl.style.transition = 'transform 220ms cubic-bezier(.16,.76,.20,1),opacity 170ms linear';
        detailEl.style.transform = 'translate3d(-104vw,0,0) scale(.994)';
        detailEl.style.opacity = '.14';
        setTimeout(() => {detailEl.style.transition='';finishDetailClose();syncFeedIndicators();},220);
        return;
      }
      detailEl.classList.remove('dragging');
      detailEl.style.transition='transform 160ms cubic-bezier(.2,.72,.18,1),opacity 140ms linear';
      detailEl.style.transform='';detailEl.style.opacity='1';
      setTimeout(()=>{detailEl.style.transition='';},170);
    }, true);

    detailScrollEl.addEventListener('pointercancel', e => {if(!g||e.pointerId!==g.id)return;e.stopImmediatePropagation();reset();}, true);
  }

  // The bottom cue is also a quiet fallback; primary interaction remains left swipe.
  document.querySelector('.detail-return-cue')?.addEventListener('click', () => {
    if (detailEl.classList.contains('open')) closeDetailToCard();
  });

  syncFeedIndicators();
})();