import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

async function calculateDirSize(dirPath) {
  let total = 0;
  for (const entry of await readdir(dirPath, { withFileTypes: true })) {
    const full = join(dirPath, entry.name);
    total += entry.isDirectory() ? await calculateDirSize(full) : (await stat(full)).size;
  }
  return total;
}

async function verify() {
  const bytes = await calculateDirSize('dist');
  const limit = 100_000_000; // 100 MB limit

  console.log(`\n=== 生产构建包体检查 ===`);
  console.log(`总包大小: ${bytes.toLocaleString()} 字节 (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`平台限额: ${limit.toLocaleString()} 字节 (100.00 MB)`);

  if (bytes >= limit) {
    throw new Error(`构建包超出 100MB 限制: 当前为 ${(bytes / 1024 / 1024).toFixed(2)} MB`);
  }

  const mapFiles = await readdir('dist/maps');
  const jsMaps = mapFiles.filter((f) => f.endsWith('.js'));
  console.log(`内置地图文件数: ${jsMaps.length} / 24 张`);

  if (jsMaps.length < 24) {
    throw new Error(`地图构建不完整，期望 24 张，实际仅有 ${jsMaps.length} 张`);
  }

  await mkdir('verification', { recursive: true });
  await writeFile(
    'verification/package-size.json',
    JSON.stringify({ bytes, limit, maps: jsMaps.length, timestamp: new Date().toISOString() }, null, 2),
    'utf8'
  );

  console.log(`✅ 检查通过: 24 张地图完整收录，包体符合平台要求。\n`);
}

verify().catch((err) => {
  console.error('Package size check failed:', err);
  process.exit(1);
});
