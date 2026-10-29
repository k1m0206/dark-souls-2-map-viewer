import { constants, createDecipheriv, publicDecrypt } from 'node:crypto';
import { open, readFile, writeFile } from 'node:fs/promises';

const gameDir = 'E:\\steam\\steamapps\\common\\Dark Souls II Scholar of the First Sin\\Game';

function pathHash(path) {
  let hash = 0;
  for (const char of path.toLowerCase().replaceAll('\\', '/')) {
    hash = (Math.imul(hash, 37) + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function decryptHeader(encrypted, pem) {
  const blockSize = 256;
  const blocks = [];
  for (let offset = 0; offset < encrypted.length; offset += blockSize) {
    const raw = publicDecrypt(
      { key: pem, padding: constants.RSA_NO_PADDING },
      encryptedHeader.subarray(offset, offset + blockSize)
    );
    blocks.push(raw.subarray(1));
  }
  return Buffer.concat(blocks);
}

function readRecords(header) {
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

const encryptedHeader = await readFile(gameDir + '\\GameDataEbl.bhd');
const pem = await readFile(gameDir + '\\GameDataKeyCode.pem', 'utf8');
const records = readRecords(decryptHeader(encryptedHeader, pem));
const data = await open(gameDir + '\\GameDataEbl.bdt', 'r');

async function extractFile(path) {
  const record = records.get(pathHash(path));
  if (!record) return null;
  const buf = Buffer.alloc(record.size);
  await data.read(buf, 0, record.size, record.dataOffset);
  decryptRanges(buf, record.encryption);
  return buf;
}

const mapIds = [
  '10_02', '10_04', '10_10', '10_14', '10_15', '10_16', '10_17', '10_18',
  '10_19', '10_23', '10_25', '10_27', '10_29', '10_30', '10_31', '10_32',
  '10_33', '10_34', '20_10', '20_11', '20_21', '20_24', '20_26', '40_03',
  '50_35', '50_36', '50_37'
];

const results = {};

for (const mid of mapIds) {
  const tpfbhdPath = `/model/map/t${mid}_00_00.tpfbhd`;
  const tpfbdtPath = `/model/map/t${mid}_00_00.tpfbdt`;
  const tpfbhdBuf = await extractFile(tpfbhdPath);
  const tpfbdtRec = records.get(pathHash(tpfbdtPath));

  if (!tpfbhdBuf || !tpfbdtRec) {
    console.log(`[${mid}] No tpfbhd/bdt found`);
    continue;
  }

  const fileCount = tpfbhdBuf.readUInt32LE(12);
  const skyEntries = [];

  for (let i = 0; i < fileCount; i++) {
    const off = 0x40 + i * 36;
    const compSize = Number(tpfbhdBuf.readBigUInt64LE(off + 8));
    const dataOff = tpfbhdBuf.readUInt32LE(off + 24);
    const fileId = tpfbhdBuf.readUInt32LE(off + 28);
    const nameOff = tpfbhdBuf.readUInt32LE(off + 32);
    const nameEnd = tpfbhdBuf.indexOf(0, nameOff);
    const name = tpfbhdBuf.subarray(nameOff, nameEnd > nameOff ? nameEnd : nameOff + 64).toString('ascii');

    const lower = name.toLowerCase();
    if (
      lower.includes('sky') ||
      lower.includes('kumo') ||
      lower.includes('cloud') ||
      lower.includes('enkei') ||
      lower.includes('moon') ||
      lower.includes('sun') ||
      lower.includes('bg_') ||
      lower.includes('horizon')
    ) {
      skyEntries.push({
        name,
        fileId,
        compSize,
        bdtOffset: tpfbdtRec.dataOffset + dataOff,
      });
    }
  }

  results[mid] = skyEntries;
  console.log(`[${mid}] Found ${skyEntries.length} sky-related entries:`, skyEntries.map(e => e.name));
}

await writeFile('miniapp-ds2/scripts/sky-scan-results.json', JSON.stringify(results, null, 2));
await data.close();
