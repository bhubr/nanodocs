
function bindEventListeners(app) {
  const fileTabs = app.querySelectorAll('.file-tabs span');
  const contentPanels = app.querySelectorAll('.file-contents pre');
  for (const file of fileTabs) {
    file.addEventListener('click', (e) => {
      const clickedTab = e.target;
      const slug = clickedTab.dataset.file;
      const activatedFileId = `${app.id}-${slug}`;
      for (const tab of fileTabs) {
        if (tab === clickedTab) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      }
      for (const panel of contentPanels) {
        if (panel.id === activatedFileId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      }
    });
  }
}

(() => {
  const apps = document.querySelectorAll('.app-embed');
  for (const app of apps) {
    bindEventListeners(app);
  }
})();