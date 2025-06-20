const pkgJson = require(process.env['PKG_JSON_PATH'] || '../../package.json');

function processExportMap(m) {
  for (const key in m) {
    const value = m[key];
    if (typeof value === 'string') m[key] = value.replace(/^\.\/dist\//, './');
    else processExportMap(value);
  }
}
processExportMap(pkgJson.exports);

for (const key of ['types', 'main', 'module']) {
  if (typeof pkgJson[key] === 'string') pkgJson[key] = pkgJson[key].replace(/^(\.\/)?dist\//, './');
}
// Fix bin paths if present
if (pkgJson.bin) {
  for (const key in pkgJson.bin) {
    if (typeof pkgJson.bin[key] === 'string') {
      pkgJson.bin[key] = pkgJson.bin[key].replace(/^(\.\/)?dist\//, './');
    }
  }
}

// Fix files array - when publishing from dist, we need to include the actual files
if (pkgJson.files) {
  pkgJson.files = pkgJson.files.map(file => {
    // Remove 'dist' from files array since we're publishing from dist
    if (file === 'dist' || file === 'dist/') return ['**/*.js', '**/*.mjs', '**/*.d.ts', '**/*.d.mts', 'bin/**/*', 'commands/**/*', 'utils/**/*', 'scripts/**/*'];
    if (file.startsWith('dist/')) return file.replace(/^dist\//, '');
    return file;
  }).flat();
  // Ensure essential files are included
  if (!pkgJson.files.includes('README.md')) pkgJson.files.push('README.md');
  if (!pkgJson.files.includes('LICENSE')) pkgJson.files.push('LICENSE');
  if (!pkgJson.files.includes('CHANGELOG.md')) pkgJson.files.push('CHANGELOG.md');
}

delete pkgJson.devDependencies;
delete pkgJson.scripts.prepack;
delete pkgJson.scripts.prepublishOnly;
delete pkgJson.scripts.prepare;

console.log(JSON.stringify(pkgJson, null, 2));
