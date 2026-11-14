// Executa a versão instalada localmente de ESLint sobre TypeScript, sem
// depender do wrapper next lint nem de diferenças entre shells Windows/Linux.
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const eslint = path.join(__dirname, '..', 'node_modules', 'eslint', 'bin', 'eslint.js');
const result = spawnSync(
  process.execPath,
  [eslint, 'src', '--ext', '.ts,.tsx'],
  { stdio: 'inherit', env: { ...process.env, ESLINT_USE_FLAT_CONFIG: 'false' } }
);
if (result.error) {
  console.error(result.error);
  process.exit(1);
}
process.exit(result.status === null ? 1 : result.status);
