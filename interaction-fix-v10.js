/* KINGFISHER v10 interaction corrections */
(() => {
  const detailEl = document.getElementById('detail');
  const detailScrollEl = document.getElementById('detailScroll');
  const clamp01 = n => Math.max(0, Math.min(1, n));

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
    });
  }

  // Keep the indicator truthful after every feed/deck change.
  const originalRenderDeck = renderDeck;
  renderDeck = function(...args) {
    const result = originalRenderDeck.apply(this, args);
    syncFeedIndicators();
    return result;
  };

  // Detail -> cards: LEFT swipe only. Capture phase replaces the older, harder gesture.
  if (detailScrollEl) {
    let g = null;
    const reset = () => {
      g = null;
      detailEl.classList.remove('dragging');
      if (detailEl.classList.contains('open')) detailEl.style.transform = '';
    };

    detailScrollEl.addEventListener('pointerdown', e => {
      if (!detailEl.classList.contains('open')) return;
      if (e.button !== undefined && e.button !== 0) return;
      e.stopImmediatePropagation();
      g = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        lastX: e.clientX,
        lastT: performance.now(),
        vx: 0,
        axis: null
      };
    }, true);

    detailScrollEl.addEventListener('pointermove', e => {
      if (!g || e.pointerId !== g.id) return;
      e.stopImmediatePropagation();
      const dx = e.clientX - g.x;
      const dy = e.clientY - g.y;
      if (!g.axis && Math.hypot(dx, dy) > 7) {
        if (Math.abs(dx) > Math.abs(dy) * 1.08) g.axis = 'x';
        else if (Math.abs(dy) > Math.abs(dx) * 1.08) g.axis = 'y';
      }
      if (g.axis !== 'x' || dx >= 0) return;
      e.preventDefault();
      const now = performance.now();
      const dt = Math.max(8, now - g.lastT);
      const instantV = (e.clientX - g.lastX) / dt;
      g.vx = g.vx * 0.45 + instantV * 0.55;
      g.lastX = e.clientX;
      g.lastT = now;
      const resistance = 0.92;
      const x = dx * resistance;
      const progress = clamp01(Math.abs(dx) / Math.min(180, innerWidth * 0.46));
      detailEl.classList.add('dragging');
      detailEl.style.transform = `translate3d(${x}px,0,0) scale(${1 - progress * 0.008})`;
      detailEl.style.opacity = String(1 - progress * 0.12);
    }, {capture:true, passive:false});

    detailScrollEl.addEventListener('pointerup', e => {
      if (!g || e.pointerId !== g.id) return;
      e.stopImmediatePropagation();
      const dx = e.clientX - g.x;
      const axis = g.axis;
      const vx = g.vx;
      g = null;
      // Easier than before: deliberate 44px left drag OR a quick left flick.
      if (axis === 'x' && (dx <= -44 || vx <= -0.28)) {
        detailEl.classList.remove('dragging');
        detailEl.style.transition = 'transform 240ms cubic-bezier(.16,.76,.20,1),opacity 180ms linear';
        detailEl.style.transform = 'translate3d(-104vw,0,0) scale(.992)';
        detailEl.style.opacity = '.18';
        setTimeout(() => {
          detailEl.style.transition = '';
          finishDetailClose();
          syncFeedIndicators();
        }, 240);
        return;
      }
      detailEl.classList.remove('dragging');
      detailEl.style.transition = 'transform 170ms cubic-bezier(.2,.72,.18,1),opacity 150ms linear';
      detailEl.style.transform = '';
      detailEl.style.opacity = '1';
      setTimeout(() => { detailEl.style.transition = ''; }, 180);
    }, true);

    detailScrollEl.addEventListener('pointercancel', e => {
      if (!g || e.pointerId !== g.id) return;
      e.stopImmediatePropagation();
      reset();
    }, true);
  }

  syncFeedIndicators();
})();