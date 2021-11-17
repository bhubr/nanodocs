const loadCss = (() => {
    const stylesheets = {};
  
    return (path) => {
      const cachedCss = stylesheets[path];
      if (cachedCss) {
        return Promise.resolve(cachedCss);
      }
      return fetch(path)
        .then(res => res.text())
        .then(css => {
          stylesheets[path] = css;
          return css;
        });
    }
  })();
  
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function applyTheme(theme) {
  localStorage.setItem('theme', theme);
  loadCss(`/assets/css/prism-one${theme}.css`)
    .then(css => {
      const styles = document.querySelectorAll('.file-contents style');
      for (const style of styles) {
        style.textContent = css;
      }
      document.documentElement.setAttribute('data-theme', theme);
    });  
}

function switchTheme(e) {
  const theme = e.target.checked ? 'dark' : 'light';
  applyTheme(theme);
}

toggleSwitch.addEventListener('change', switchTheme, false);

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
  applyTheme(currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}