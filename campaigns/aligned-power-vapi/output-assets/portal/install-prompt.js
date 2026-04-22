/**
 * PWA install prompt helper.
 * Behavior: store deferred `beforeinstallprompt` on window. Show our custom CTA after the user's
 * second successful ritual (morning or evening). Persist dismissal in localStorage.
 */
(function(){
  if (typeof window === 'undefined') return;
  var KEY = 'ap_install_prompt_state';
  function getState(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function setState(s){ try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }
  function isIOS(){ return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; }
  function isStandalone(){ return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches; }

  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    window.__apDeferredInstall = e;
    document.dispatchEvent(new CustomEvent('ap-install-available'));
  });

  // Register service worker (safe — no-op if already registered)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function(){});
  }

  window.APInstall = {
    recordRitualComplete: function(){
      var s = getState();
      s.rituals = (s.rituals || 0) + 1;
      setState(s);
      if (s.rituals >= 2 && !s.dismissed && !isStandalone()) {
        document.dispatchEvent(new CustomEvent('ap-install-cta-eligible'));
      }
    },
    showNative: async function(){
      if (window.__apDeferredInstall) {
        window.__apDeferredInstall.prompt();
        try {
          var choice = await window.__apDeferredInstall.userChoice;
          var s = getState(); s.dismissed = true; s.outcome = choice.outcome; setState(s);
          return choice.outcome;
        } catch { return 'dismissed'; }
      }
      if (isIOS()) { window.location.href = '/install'; return 'ios_redirect'; }
      return 'unavailable';
    },
    dismiss: function(){ var s = getState(); s.dismissed = true; setState(s); },
    isInstalled: isStandalone,
    isIOS: isIOS,
    eligibleNow: function(){
      var s = getState();
      return !isStandalone() && !s.dismissed && (s.rituals || 0) >= 2;
    }
  };

  // Show an unobtrusive toast when eligible
  document.addEventListener('DOMContentLoaded', function(){
    if (!window.APInstall.eligibleNow()) return;
    renderToast();
  });
  document.addEventListener('ap-install-cta-eligible', renderToast);

  function renderToast(){
    if (document.getElementById('ap-install-toast')) return;
    var el = document.createElement('div');
    el.id = 'ap-install-toast';
    el.style.cssText = 'position:fixed;bottom:20px;right:20px;max-width:340px;background:#0E1624;color:#fff;padding:16px 20px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.25);z-index:9999;font-family:\'Outfit\',sans-serif;';
    el.innerHTML = '<div style="display:flex;gap:12px;align-items:flex-start;"><div style="flex:1;"><div style="font-weight:700;margin-bottom:4px;">Add VAPI to your home screen</div><div style="font-size:13px;opacity:.85;line-height:1.4;">Your morning check-in is one tap away. Push notifications work better too.</div></div></div><div style="margin-top:12px;display:flex;gap:8px;"><button id="ap-install-yes" style="background:#FF6B1A;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:600;cursor:pointer;">Install</button><button id="ap-install-no" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.3);padding:8px 14px;border-radius:8px;font-weight:600;cursor:pointer;">Later</button></div>';
    document.body.appendChild(el);
    document.getElementById('ap-install-yes').addEventListener('click', async function(){
      var outcome = await window.APInstall.showNative();
      el.remove();
    });
    document.getElementById('ap-install-no').addEventListener('click', function(){
      window.APInstall.dismiss();
      el.remove();
    });
  }
})();
