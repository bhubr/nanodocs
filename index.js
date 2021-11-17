const fs = require('fs');
const fsp = require('fs/promises');
const mkdirp = require('mkdirp');
const { join, dirname } = require('path');
const marked = require('marked');
const Prism = require('prismjs');
const Handlebars = require('handlebars');
require('dotenv').config();
require('prismjs/components/prism-jsx.js');
const emojis = require('./emojis.json');
const demos = require('./content/demos.json');

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
 * Extract subsections from md section
 *
 * @param {string} section Markdown section 
 */
function extractMdSubsections(section) {
  const split = section.split(/^### /gm);
  split.shift();
  return split.map(subsection => {
    const lines = subsection.split('\n');
    const title = lines.shift();
    return {
      title,
      depth: 3,
    };
  });
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
  return split.map(section => {
    const lines = section.split('\n');
    const title = lines.shift();
    console.log('section', lines.join('\n').trim())
    return {
      title,
      subsections: extractMdSubsections(lines.join('\n').trim()),
      depth: 2,
    };
  });
}

const reactTemplate = readTextSync('react-template.html');
const demoTemplate = readTextSync('demo-template.html');
const compiledDemoTemplate = Handlebars.compile(demoTemplate);
const docTemplate = readTextSync('template.html');
const compiledDocTemplate = Handlebars.compile(docTemplate);

marked.setOptions({
  highlight,
});

const slugify = str => str.replace(/\./g, '-');

const shortcodeRenderer = {
  app(pk, pv) {
    const inputFilesDir = join(__dirname, 'example', pv);
    const demo = demos.find(d => d.path === pv);
    if (!demo) {
      throw new Error(`Could not find demo with path: ${pv}`);
    }
    const files = demo.files.map((f, index) => {
      const ext = f.name.split('.').pop()
      const content = fs.readFileSync(join(inputFilesDir, f.name), 'utf-8');
      return {
        ...f,
        slug: slugify(f.name),
        code: Prism.highlight(content, Prism.languages[ext], ext),
        display: index > 0 ? 'none' : 'block'
      }
    });
    const outputDir = join(__dirname, 'output', 'demos', pv);
    const output = reactTemplate.replace(/\{\{dir\}\}/g, pv);
    const dirExists = fs.existsSync(outputDir);
    if (!dirExists) {
      mkdirp.sync(outputDir);
    }
    const outputFile = join(outputDir, 'index.html');
    fs.writeFileSync(outputFile, output);

    const { EXAMPLES_ROOT_URL: examplesUrl } = process.env;
    return compiledDemoTemplate({
      demoPath: pv,
      examplesUrl,
      files
    });
  }
}

const markedRenderer = {
  paragraph(text) {
    const m = text.match(/\[([a-z]+)( ([a-z]+)=("?[^"]+"?))*\]/)
    if (!m) return `<p>${text}</p>`;
    const [, shortcode,,pk, pv] = m;
    return shortcodeRenderer[shortcode](pk, pv);
  },
  blockquote(text) {
    const matchSpecial = text.match(/(info|danger)(:[a-z]+:)/);
    if (!matchSpecial) {
      return `<blockquote>${text}</blockquote>`;
    }
    const mText = text.replace(/(info|danger)(:[a-z]+:)/, (args) => {
      const [, emoji] = args.split(':');
      return emojis[emoji];
    });
    return `<blockquote class="blockquote-${matchSpecial[1]}">${mText}</blockquote>`;
  }
};

marked.use({ renderer: markedRenderer });

(async () => {
  try {
    const tocJSON = await readText('toc.json', 'content/en');
    const toc = JSON.parse(tocJSON).map(o => ({
      ...o, isHeadline: o.type === 'headline', isHome: o.href === 'index'
    }));
    const docs = toc.filter(({ isHeadline }) => !isHeadline);
    for (let doc of docs) {
      const md = await readText(`${doc.href}.md`, 'content/en');
      const body = marked.parse(md);
      const output = compiledDocTemplate({ body, toc });

      const filename = doc.href === 'index' ? 'index.html' : join(doc.href, 'index.html');
      const outFile = join(__dirname, 'output', filename);
      const outDir = dirname(outFile);
      console.log('out', outFile, outDir);
      if (!fs.existsSync(outDir)) {
        mkdirp.sync(outDir);
      }
      await fsp.writeFile(outFile, output);
    }
  } catch (err) {
    console.error(err);
  }
})();