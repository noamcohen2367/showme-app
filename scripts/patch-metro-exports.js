/**
 * Patches Metro's package.json to expose ./src/lib/TerminalReporter.
 *
 * Root cause: @expo/cli@0.10.x imports `metro/src/lib/TerminalReporter`
 * directly. Metro 0.83.x added a strict `exports` field that doesn't
 * include that subpath, causing Node 22.x to throw ERR_PACKAGE_PATH_NOT_EXPORTED.
 */
const fs = require('fs');
const path = require('path');

const metaPkgPath = path.resolve(__dirname, '../node_modules/metro/package.json');

if (!fs.existsSync(metaPkgPath)) {
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(metaPkgPath, 'utf8'));
const SUBPATH = './src/lib/TerminalReporter';

if (!pkg.exports || pkg.exports[SUBPATH]) {
  process.exit(0);
}

pkg.exports[SUBPATH] = './src/lib/TerminalReporter.js';
fs.writeFileSync(metaPkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('✓ Patched metro/package.json exports → added', SUBPATH);
