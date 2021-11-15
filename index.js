const fs = require('fs');
const fsp = require('fs/promises');
const mkdirp = require('mkdirp');
const { join } = require('path');
const marked = require('marked');
const Prism = require('prismjs');
const Handlebars = require('handlebars');
require('dotenv').config();
require('prismjs/components/prism-jsx.js');

/**
 * Synchronously read text file
 *
 * @param {string} filename File to read
 * @param {string} dir Path to file
 * @returns {string} File content
 */
 function readTextSync(filename, dir = '') {
  const contentRoot = dir ? join(__dirname, dir) : __dirname;
  const filePath = join(contentRoot, filename);
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Asynchronously read text file
 *
 * @param {string} filename File to read
 * @param {string} dir Path to file
 * @returns {Promise<string>} File content
 */
async function readText(filename, dir = '') {
  const contentRoot = dir ? join(__dirname, dir) : __dirname;
  const filePath = join(contentRoot, filename);
  return fsp.readFile(filePath, 'utf-8');
}

/**
 * Highlight code with Prism
 *
 * @param {string} code Code to highlight
 * @param {*} lang Language code (js, jsx, etc.)
 * @returns 
 */
function highlight(code, lang) {
  if (Prism.languages[lang]) {
    return Prism.highlight(code, Prism.languages[lang], lang);
  } else {
    return code;
  }
}

/**
 * Split markdown (extract TOC)
 *
 * @param {string} md Markdown source
 */
function extractMdToc(md) {
  const split = md.split(/^## /gm);
  const first = split.shift();
  const [, title] = first.match(/^# (.*)/, first);
  return split.map( s => ({
    title: s.split('\n').shift(),
    depth: 2,
  }) );
}

const reactTemplate = readTextSync('react-template.html');
const docTemplate = readTextSync('template.html');
const compiledDocTemplate = Handlebars.compile(docTemplate);

marked.setOptions({
  highlight,
});

const shortcodeRenderer = {
  app(pk, pv) {
    const inputFilesDir = join(__dirname, 'example', pv);
    const inputFiles = fs.readdirSync(inputFilesDir);
    const outputDir = join(__dirname, 'output', 'examples', pv);
    const output = reactTemplate.replace(/\{\{dir\}\}/g, pv);
    const dirExists = fs.existsSync(outputDir);
    if (!dirExists) {
      mkdirp.sync(outputDir);
    }
    const outputFile = join(outputDir, 'index.html');
    fs.writeFileSync(outputFile, output);

    const { EXAMPLES_ROOT_URL: examplesUrl } = process.env;
    return `<div class="react-app-embed" id="${pv}">
      <div class="left">
        <div class="file-tabs">
          ${inputFiles.filter(f => /\.jsx?$/.test(f)).map(f => `<span data-file-id="${pv}-${f.replace(/\./g, '-')}">${f}</span>`).join('')}
        </div>
        <div class="file-contents">
          ${inputFiles
            .filter(f => /\.jsx?$/.test(f))
            .map(f => `<pre id="${pv}-${f.replace(/\./g, '-')}"><code class="language-js">${Prism.highlight(fs.readFileSync(join(inputFilesDir, f), 'utf-8'), Prism.languages.jsx, 'jsx')}</code></pre>`).join('')}
        </div>
      </div>
      <div class="right">
        <div class="address-bar">
          <code>${examplesUrl}/${pv}</code>
        </div>
        <iframe src="${examplesUrl}/${pv}"></iframe>
      </div>
    </div>`;
  }
}

const markedRenderer = {
  paragraph(text) {
    const m = text.match(/\[([a-z]+)( ([a-z]+)=("?[^"]+"?))*\]/)
    if (!m) return `<p>${text}</p>`;
    const [, shortcode,,pk, pv] = m;
    return shortcodeRenderer[shortcode](pk, pv);
  }
};

marked.use({ renderer: markedRenderer });

(async () => {
  try {
    const md = await readText('README.md', 'content');
    const toc = extractMdToc(md);
    const body = marked.parse(md);
    const output = compiledDocTemplate({ body, toc });
    await fsp.writeFile('output/index.html', output);
  } catch (err) {
    console.error(err);
  }
})();