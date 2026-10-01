(function () {
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function saved() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function apply() {
    var theme = saved() || (mq.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('color-scheme', theme);
  }
  apply();
  mq.addEventListener('change', apply);

  // Delegated so it keeps working after Turbo swaps the body.
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.theme-toggle')) return;
    var next = document.documentElement.getAttribute('color-scheme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch (e) {}
    apply();
  });
})();
