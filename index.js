const fsp = require('fs/promises');
const { join } = require('path');
const marked = require('marked');
const Prism = require('prismjs');
require('prismjs/components/prism-jsx.js');

const readMarkdown = async (filename) => {
  const contentRoot = join(__dirname, 'content');
  const filePath = join(contentRoot, filename);
  return fsp.readFile(filePath, 'utf-8');
}
const readTemplate = async () => {
  const indexPath = join(__dirname, 'template.html');
  return fsp.readFile(indexPath, 'utf-8');
}

function highlight(code, lang) {
  console.log('PRISM', lang);
  if (Prism.languages[lang]) {
    return Prism.highlight(code, Prism.languages[lang], lang);
  } else {
    return code;
  }
}

marked.setOptions({
  highlight,
});

(async () => {
  try {
    const template = await readTemplate();
    const md = await readMarkdown('intro.md');
    const body = marked.parse(md);
    const output = template.replace('{{body}}', body);
    await fsp.writeFile('output.html', output);
  } catch (err) {
    console.error(err);
  }
})();