const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'src', 'source');

function restore(prefix, outputName) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source directory not found: ${sourceDir}`);
  }

  const parts = fs.readdirSync(sourceDir)
    .filter((name) => name.startsWith(prefix))
    .sort();

  if (!parts.length) {
    throw new Error(`No source parts found for ${outputName}`);
  }

  const encoded = parts
    .map((name) => fs.readFileSync(path.join(sourceDir, name), 'utf8').trim())
    .join('');

  const compressed = Buffer.from(encoded, 'base64');
  const restored = zlib.brotliDecompressSync(compressed);
  const destination = path.join(root, 'src', outputName);

  fs.writeFileSync(destination, restored);
  console.log(`Restored ${path.relative(root, destination)} (${restored.length} bytes)`);
}

try {
  restore('App.jsx.br.b64.part', 'App.jsx');
  restore('styles2.css.br.b64.part', 'styles.css');
  require('./upgrade-v014.cjs');
  require('./upgrade-v015.cjs');
  require('./upgrade-v016.cjs');
  require('./upgrade-v017.cjs');
  require('./upgrade-v018.cjs');
  require('./upgrade-v019.cjs');
  require('./upgrade-v020.cjs');
  console.log('Blueprint 3D Studio source restoration complete.');
} catch (error) {
  console.error('SOURCE RESTORE FAILED:', error.message);
  process.exit(1);
}
