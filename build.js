const fs = require("fs-extra");
const path = require("path");
const md = require("markdown-it")();

const inputDir = __dirname;
const outputDir = path.join(__dirname, "dist");

let pages = []; // store note {title, url, month}

function renderMarkdown(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${path.basename(filePath, ".md")}</title>
    </head>
    <body>
      <a href="../index.html">⬅ Back to Index</a>
      <hr/>
      ${md.render(content)}
    </body>
  </html>`;
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    // ignore speicifed dirs/files
    if (["node_modules", ".git", "dist", ".github"].includes(file)) {
      return;
    }

    const fullPath = path.join(dir, file);

    // recursively get files
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".md")) {
      // inputDir: notebook\ fullPath: notebook\2025.08\test_note.md
      // relPath: 2025.08\test_note.md
      const relPath = path.relative(inputDir, fullPath);

      // 2025.08\test_note.html
      const url = relPath.replace(/\.md$/, ".html");
      const html = renderMarkdown(fullPath);
      const outPath = path.join(outputDir, url);

      fs.ensureDirSync(path.dirname(outPath));
      fs.writeFileSync(outPath, html);

      pages.push({
        title: path.basename(file, ".md"),
        url: url.replace(/\\/g, "/"), // windows 兼容
        month: path.dirname(relPath),
      });
    }
  });
}

function buildIndex() {
  // group by year.month
  const grouped = {};
  pages.forEach((p) => {
    if (!grouped[p.month]) grouped[p.month] = [];
    grouped[p.month].push(p);
  });

  let indexHtml = `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Notebook Index</title>
    </head>
    <body>
      <h1>📒 My Notebook</h1>
  `;

  Object.keys(grouped)
    .sort()
    .forEach((month) => {
      indexHtml += `<h2>${month}</h2><ul>`;
      grouped[month].forEach((p) => {
        indexHtml += `<li><a href="${p.url}">${p.title}</a></li>`;
      });
      indexHtml += `</ul>`;
    });

  indexHtml += `
    </body>
  </html>`;

  fs.writeFileSync(path.join(outputDir, "index.html"), indexHtml);
}

fs.emptyDirSync(outputDir);
walkDir(inputDir);
buildIndex();
