/**
 * Ritual Widget — injects a "Today's rituals" card at the top of the dashboard
 * and handles the Presence banner. Non-destructive: hooks into <body> via a known anchor.
 *
 * Include with <script src="/portal/ritual-widget.js" defer></script>.
 * Opt into dashboard injection by adding <div id="ap-ritual-slot"></div> anywhere in the page.
 * If the slot doesn't exist, the widget becomes a floating top banner.
 */
(function(){
  if (typeof window === 'undefined') return;

  async function getSession() {
    try {
      await fetch('/api/config').then(r => r.text()).then(t => eval(t));
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm');
      const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (e) { return null; }
  }

  function todayIso(tz) {
    try { return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date()); } catch { return new Date().toISOString().slice(0,10); }
  }

  async function render() {
    const session = await getSession();
    if (!session) return;
    const token = session.access_token;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    const [morningR, eveningR, presenceR] = await Promise.all([
      fetch('/api/morning-checkin?tz=' + encodeURIComponent(tz), { headers: { Authorization: 'Bearer ' + token } }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/evening-review?tz=' + encodeURIComponent(tz), { headers: { Authorization: 'Bearer ' + token } }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/presence-today', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]);

    const morningDone = !!(morningR && morningR.checkin);
    const eveningDone = !!(eveningR && eveningR.review);
    const banners = (presenceR && presenceR.banners) || [];

    const slot = document.getElementById('ap-ritual-slot') || createFloatingSlot();
    const wrap = document.createElement('div');
    wrap.className = 'ap-ritual-widget';
    wrap.innerHTML = `
      <style>
        .ap-ritual-widget { font-family:'Outfit',sans-serif; margin: 12px 0 24px; }
        .ap-presence { background:#0E1624; color:#fff; border-left:4px solid #FF6B1A; border-radius:14px; padding:16px 20px; margin-bottom:12px; box-shadow:0 8px 24px rgba(14,22,36,0.15); }
        .ap-presence .label { font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:#FF9F6B; font-weight:700; margin-bottom:4px; }
        .ap-presence .body { font-size:15px; line-height:1.4; font-weight:500; }
        .ap-rituals { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; }
        .ap-r-card { background:#fff; border:1px solid #DDE3ED; border-left:3px solid #FF6B1A; border-radius:14px; padding:16px 18px; text-decoration:none; color:#0E1624; transition:transform .15s, box-shadow .15s; display:flex; flex-direction:column; gap:6px; }
        .ap-r-card:hover { transform:translateY(-2px); box-shadow:0 10px 24px rgba(14,22,36,0.12); }
        .ap-r-label { font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:#FF6B1A; font-weight:700; }
        .ap-r-title { font-size:16px; font-weight:800; line-height:1.2; }
        .ap-r-meta { font-size:12px; color:#7A8FA8; }
        .ap-done { position:relative; }
        .ap-done::after { content:'✓ done'; position:absolute; top:12px; right:14px; font-size:11px; color:#16a34a; font-weight:700; }
        [data-theme="dark"] .ap-r-card { background:#1e2438; border-color:#2d3849; color:#e8eaf2; }
      </style>
      ${banners.length ? banners.map(b => `
        <div class="ap-presence" data-banner-id="${b.id}">
          <div class="label">Pattern preview</div>
          <div class="body">${escapeHtml((b.payload && b.payload.copy) || 'Watch for your driver today.')}</div>
          <div style="margin-top:10px; display:flex; gap:8px;">
            <a href="/evening-review" style="font-size:13px; font-weight:600; color:#FF9F6B; text-decoration:none;">Respond in evening review →</a>
            <button class="ap-dismiss" data-id="${b.id}" style="background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;font-size:13px;">Dismiss</button>
          </div>
        </div>
      `).join('') : ''}
      <div class="ap-rituals">
        <a href="/morning-checkin" class="ap-r-card ${morningDone ? 'ap-done' : ''}">
          <span class="ap-r-label">Morning</span>
          <span class="ap-r-title">Alignment check-in</span>
          <span class="ap-r-meta">${morningDone ? 'Reviewed today' : '45 seconds. Three answers.'}</span>
        </a>
        <a href="/evening-review" class="ap-r-card ${eveningDone ? 'ap-done' : ''}">
          <span class="ap-r-label">Evening</span>
          <span class="ap-r-title">Integrity review</span>
          <span class="ap-r-meta">${eveningDone ? 'Closed today' : '60 seconds. One honest line.'}</span>
        </a>
        <a href="/monthly-pulse" class="ap-r-card">
          <span class="ap-r-label">Monthly</span>
          <span class="ap-r-title">Domain pulse</span>
          <span class="ap-r-meta">Ten minutes. Twelve sliders.</span>
        </a>
        <a href="/longitudinal" class="ap-r-card">
          <span class="ap-r-label">Longitudinal</span>
          <span class="ap-r-title">Your biography</span>
          <span class="ap-r-meta">Trajectory over every assessment.</span>
        </a>
      </div>
    `;
    slot.innerHTML = '';
    slot.appendChild(wrap);

    // Dismiss handler
    wrap.querySelectorAll('.ap-dismiss').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await fetch('/api/presence-today', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ event_id: id, action: 'dismiss' }) });
        const card = btn.closest('.ap-presence'); if (card) card.remove();
      });
    });

    // Record ritual completions for install prompt gating
    if (morningDone && window.APInstall) window.APInstall.recordRitualComplete();
    if (eveningDone && window.APInstall) window.APInstall.recordRitualComplete();
  }

  function createFloatingSlot() {
    const slot = document.createElement('div');
    slot.id = 'ap-ritual-slot';
    slot.style.cssText = 'max-width:56rem;margin:16px auto 0;padding:0 16px;';
    const main = document.querySelector('main') || document.body;
    main.parentNode.insertBefore(slot, main);
    return slot;
  }

  function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
