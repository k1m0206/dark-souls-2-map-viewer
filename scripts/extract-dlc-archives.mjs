import { constants, createDecipheriv, publicDecrypt } from 'node:crypto';
import { mkdir, open, readFile, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

const gameDir = resolve(process.argv[2] ?? '');
const outputDir = resolve(process.argv[3] ?? '');
if (!process.argv[2] || !process.argv[3]) {
  throw new Error('Usage: node scripts/extract-dlc-archives.mjs <DS2 Game dir> <output dir>');
}

const paths = [35, 36, 37].flatMap((id) => [
  `/model/map/h50_${id}_00_00.hkxbhd`,
  `/model/map/h50_${id}_00_00.hkxbdt`,
]);

function pathHash(path) {
  let hash = 0;
  for (const char of path.toLowerCase().replaceAll('\\', '/')) {
    hash = (Math.imul(hash, 37) + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function decryptHeader(encrypted, pem) {
  const blockSize = 256;
  if (encrypted.length % blockSize !== 0) throw new Error('Unexpected encrypted BHD size');
  const blocks = [];
  for (let offset = 0; offset < encrypted.length; offset += blockSize) {
    const raw = publicDecrypt(
      { key: pem, padding: constants.RSA_NO_PADDING },
      encrypted.subarray(offset, offset + blockSize),
    );
    if (raw[0] !== 0) throw new Error(`Invalid RSA block ${offset / blockSize}`);
    blocks.push(raw.subarray(1));
  }
  return Buffer.concat(blocks);
}

function readRecords(header) {
  if (header.toString('ascii', 0, 4) !== 'BHD5') throw new Error('Decrypted header is not BHD5');
  const littleEndian = header.readInt8(4) === -1;
  const u32 = (offset) => littleEndian ? header.readUInt32LE(offset) : header.readUInt32BE(offset);
  const i32 = (offset) => littleEndian ? header.readInt32LE(offset) : header.readInt32BE(offset);
  const i64 = (offset) => Number(littleEndian ? header.readBigInt64LE(offset) : header.readBigInt64BE(offset));
  const bucketCount = i32(0x10);
  const bucketsOffset = i32(0x14);
  const records = new Map();

  for (let bucket = 0; bucket < bucketCount; bucket++) {
    const bucketOffset = bucketsOffset + bucket * 8;
    const count = i32(bucketOffset);
    const recordsOffset = i32(bucketOffset + 4);
    for (let index = 0; index < count; index++) {
      const offset = recordsOffset + index * 32;
      const hash = u32(offset);
      const size = i32(offset + 4);
      const dataOffset = i64(offset + 8);
      const aesOffset = i64(offset + 24);
      let encryption = null;
      if (aesOffset !== 0) {
        const key = header.subarray(aesOffset, aesOffset + 16);
        const rangeCount = i32(aesOffset + 16);
        const ranges = [];
        for (let range = 0; range < rangeCount; range++) {
          const rangeOffset = aesOffset + 20 + range * 16;
          ranges.push([i64(rangeOffset), i64(rangeOffset + 8)]);
        }
        encryption = { key, ranges };
      }
      records.set(hash, { size, dataOffset, encryption });
    }
  }
  return records;
}

function decryptRanges(buffer, encryption) {
  if (!encryption) return buffer;
  for (const [start, end] of encryption.ranges) {
    if (start === -1 || end === -1 || start === end) continue;
    const decipher = createDecipheriv('aes-128-ecb', encryption.key, null);
    decipher.setAutoPadding(false);
    const decrypted = Buffer.concat([decipher.update(buffer.subarray(start, end)), decipher.final()]);
    decrypted.copy(buffer, start);
  }
  return buffer;
}

await mkdir(outputDir, { recursive: true });
const encryptedHeader = await readFile(join(gameDir, 'GameDataEbl.bhd'));
const pem = await readFile(join(gameDir, 'GameDataKeyCode.pem'), 'utf8');
const records = readRecords(decryptHeader(encryptedHeader, pem));
const data = await open(join(gameDir, 'GameDataEbl.bdt'), 'r');

try {
  for (const path of paths) {
    const record = records.get(pathHash(path));
    if (!record) throw new Error(`Archive entry not found: ${path}`);
    const buffer = Buffer.alloc(record.size);
    await data.read(buffer, 0, record.size, record.dataOffset);
    decryptRanges(buffer, record.encryption);
    const output = join(outputDir, basename(path));
    await writeFile(output, buffer);
    console.log(`${basename(path)}: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
  }
} finally {
  await data.close();
}
