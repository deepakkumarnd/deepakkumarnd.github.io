(() => {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const savedTheme = () => {
    try { return localStorage.getItem('theme'); } catch { return null; }
  };

  const applyTheme = () => {
    const theme = savedTheme() || (systemDark.matches ? 'dark' : 'light');
    root.setAttribute('color-scheme', theme);
  };

  applyTheme();
  systemDark.addEventListener('change', applyTheme);

  // Delegated so it keeps working after Turbo swaps the body.
  document.addEventListener('click', ({ target }) => {
    if (!target.closest('.theme-toggle')) return;

    const next = root.getAttribute('color-scheme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch {}
    applyTheme();
  });
})();
