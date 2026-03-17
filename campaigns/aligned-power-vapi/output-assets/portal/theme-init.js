/**
 * Portal theme init — runs before paint.
 * Reads theme from cookie (set by app) or localStorage, applies to document.
 */
(function() {
  var t;
  try {
    var m = document.cookie.match(/ap-theme=(\w+)/);
    if (m && (m[1] === 'dark' || m[1] === 'light')) {
      t = m[1];
      try { localStorage.setItem('ap-theme', t); } catch (e) {}
    } else {
      t = localStorage.getItem('ap-theme');
    }
  } catch (e) {
    t = localStorage.getItem('ap-theme');
  }
  if (t === 'dark' || t === 'light') {
    document.documentElement.setAttribute('data-theme', t);
  }
})();
