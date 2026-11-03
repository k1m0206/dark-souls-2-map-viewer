import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('[build-web] Starting Web build (for GitHub Pages / Web)...');
process.env.BUILD_TARGET = 'web';

execSync('npm run typecheck', { cwd: rootDir, stdio: 'inherit', env: process.env });
execSync('npx vite build', { cwd: rootDir, stdio: 'inherit', env: process.env });
execSync('node scripts/check-size.mjs', { cwd: rootDir, stdio: 'inherit', env: process.env });
console.log('[build-web] Web build completed successfully!');
