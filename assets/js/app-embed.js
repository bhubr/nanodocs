function bindEventListeners(app) {
  const fileTabs = app.querySelectorAll('.file-tabs span');
  const contentPanels = app.querySelectorAll('.file-contents pre');
  for (const file of fileTabs) {
    file.addEventListener('click', (e) => {
      const clickedTab = e.target;
      const slug = clickedTab.dataset.file;
      const activatedFileId = `${app.id}-${slug}`;
      for (const tab of fileTabs) {
        tab.style.background =tab === clickedTab ?  '#eef' : '#f4f4f4';
      }
      for (const panel of contentPanels) {
        panel.style.display = panel.id === activatedFileId ? 'block' : 'none';
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