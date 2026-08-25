const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "src", "App.jsx");
const cssPath = path.join(root, "src", "styles.css");

function replaceOnce(text, from, to, label) {
  if (to && text.includes(to)) return text;
  if (!text.includes(from)) throw new Error(`v0.22 patch target missing: ${label}`);
  return text.replace(from, to);
}

let app = fs.readFileSync(appPath, "utf8");
app = replaceOnce(app, 'const APP_VERSION = "0.21.0";', 'const APP_VERSION = "0.22.0";', "version");
app = replaceOnce(
  app,
  'import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";',
  'import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";\nimport { appendHistorySnapshot, stepProjectHistoryRedo, stepProjectHistoryUndo } from "./projectHistory.js";',
  "history module import",
);
app = replaceOnce(app, "const HISTORY_LIMIT = 80;\n", "", "embedded history limit");
app = replaceOnce(
  app,
`function appendHistorySnapshot(stack, snapshot) {
  return [...stack.slice(-(HISTORY_LIMIT - 1)), snapshot];
}

function stepProjectHistoryUndo(past, current, future) {
  if (!past.length || !current) return null;
  return {
    past: past.slice(0, -1),
    current: past[past.length - 1],
    future: appendHistorySnapshot(future, current),
  };
}

function stepProjectHistoryRedo(past, current, future) {
  if (!future.length || !current) return null;
  return {
    past: appendHistorySnapshot(past, current),
    current: future[future.length - 1],
    future: future.slice(0, -1),
  };
}

`,
  "",
  "embedded history helpers",
);
fs.writeFileSync(appPath, app);

let css = fs.readFileSync(cssPath, "utf8");
const marker = "/* v0.22.0 — centralized project history module */";
if (!css.includes(marker)) css += `\n${marker}\n`;
fs.writeFileSync(cssPath, css);

console.log("Applied Blueprint 3D Studio v0.22.0 centralized history upgrade.");
