import { gunzipSync } from 'fflate';

export interface ChunkMeta {
  min: [number, number, number];
  scale: [number, number, number];
  vertices: number;
  indicesCount: number;
  posOffs: number;
  posLen: number;
  idxOffs: number;
  idxLen: number;
}

export interface MapHeader {
  id: string;
  name: string;
  enName: string;
  category: string;
  isDlc: boolean;
  desc: string;
  color: [number, number, number];
  bounds: { min: [number, number, number]; max: [number, number, number] };
  center: [number, number, number];
  spawnWalk: [number, number, number];
  spawnFly: [number, number, number];
  triangles: number;
  vertices: number;
  chunks: ChunkMeta[];
}

export interface DecodedChunk {
  meta: ChunkMeta;
  positions: Uint16Array;
  indices: Uint16Array;
}

export interface DecodedMap {
  header: MapHeader;
  chunks: DecodedChunk[];
}

const mapReceivers = new Map<string, (b64: string) => void>();

declare global {
  var __atlasReceive: (id: string, data: string) => void;
}

globalThis.__atlasReceive = (id: string, data: string) => {
  const handler = mapReceivers.get(id);
  if (handler) {
    handler(data);
  }
};

function base64ToUint8Array(b64: string): Uint8Array {
  const binaryString = atob(b64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function getCandidateMapUrls(mapId: string): string[] {
  const urls: string[] = [];

  // 1. Primary: relative to document.baseURI
  try {
    if (typeof document !== 'undefined' && document.baseURI) {
      urls.push(new URL(`./maps/${mapId}.js`, document.baseURI).href);
    }
  } catch {}

  // 2. Relative to bundle script path if located in /assets/
  try {
    const metaUrl = String(import.meta.url || '');
    const assetIdx = metaUrl.lastIndexOf('/assets/');
    if (assetIdx !== -1) {
      urls.push(`${metaUrl.slice(0, assetIdx)}/maps/${mapId}.js`);
    }
  } catch {}

  // 3. Document location href directory
  try {
    if (typeof location !== 'undefined' && location.href) {
      const loc = location.href.split('?')[0].split('#')[0];
      const dir = loc.slice(0, loc.lastIndexOf('/') + 1);
      urls.push(`${dir}maps/${mapId}.js`);
    }
  } catch {}

  // 4. Plain relative path
  urls.push(`./maps/${mapId}.js`);

  // Remove any entry containing 'undefined' or duplicates
  return Array.from(new Set(urls.filter((u) => u && !u.includes('undefined'))));
}

export function loadMapScript(mapId: string, signal?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('已取消', 'AbortError'));
    }

    const candidateUrls = getCandidateMapUrls(mapId);
    let candidateIndex = 0;
    let currentScript: HTMLScriptElement | null = null;

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`读取地图 ${mapId} 超时，请重试`));
    }, 60000);

    const onAbort = () => {
      cleanup();
      reject(new DOMException('已取消', 'AbortError'));
    };

    const cleanup = () => {
      clearTimeout(timer);
      if (currentScript) {
        currentScript.remove();
        currentScript = null;
      }
      mapReceivers.delete(mapId);
      signal?.removeEventListener('abort', onAbort);
    };

    signal?.addEventListener('abort', onAbort, { once: true });

    mapReceivers.set(mapId, (b64) => {
      cleanup();
      resolve(b64);
    });

    function tryNext() {
      if (signal?.aborted) return;
      if (candidateIndex >= candidateUrls.length) {
        cleanup();
        reject(new Error(`地图文件 ${mapId}.js 加载失败 (尝试过的路径: ${candidateUrls.join(', ')})`));
        return;
      }

      const url = candidateUrls[candidateIndex++];
      if (currentScript) {
        currentScript.remove();
      }

      const script = document.createElement('script');
      currentScript = script;
      script.src = url;
      script.onerror = (e) => {
        console.warn(`[DS2] 尝试加载地图路径失败: ${url}，正在尝试下一个路径...`, e);
        tryNext();
      };
      document.head.appendChild(script);
    }

    tryNext();
  });
}

export async function parseMapData(b64: string): Promise<DecodedMap> {
  const compressed = base64ToUint8Array(b64);
  const decompressed = gunzipSync(compressed);
  const view = new DataView(decompressed.buffer, decompressed.byteOffset, decompressed.byteLength);

  const headerLen = view.getUint32(0, true);
  if (headerLen + 4 > decompressed.byteLength) {
    throw new Error('地图数据损坏: 头部长度越界');
  }

  const headerBytes = decompressed.subarray(4, 4 + headerLen);
  const headerJson = new TextDecoder('utf-8').decode(headerBytes);
  const header = JSON.parse(headerJson) as MapHeader;

  const binaryBase = 4 + headerLen;
  const chunks: DecodedChunk[] = [];

  for (const meta of header.chunks) {
    const posStart = binaryBase + meta.posOffs;
    const idxStart = binaryBase + meta.idxOffs;

    // Slice or create aligned array copies
    const posBuffer = decompressed.buffer.slice(
      decompressed.byteOffset + posStart,
      decompressed.byteOffset + posStart + meta.posLen
    );
    const idxBuffer = decompressed.buffer.slice(
      decompressed.byteOffset + idxStart,
      decompressed.byteOffset + idxStart + meta.idxLen
    );

    const positions = new Uint16Array(posBuffer);
    const indices = new Uint16Array(idxBuffer);

    chunks.push({
      meta,
      positions,
      indices
    });
  }

  return { header, chunks };
}

const mapCache = new Map<string, DecodedMap>();

export function releaseDecodedMap(mapId: string) {
  mapCache.delete(mapId);
}

export async function loadDecodedMap(
  mapId: string,
  signal?: AbortSignal,
  onStageChange?: (stage: string, percent: number) => void
): Promise<DecodedMap> {
  const cached = mapCache.get(mapId);
  if (cached) {
    onStageChange?.('从内存缓存中调取几何档案...', 75);
    return cached;
  }

  onStageChange?.('读取几何档案脚本...', 20);
  const b64 = await loadMapScript(mapId, signal);
  if (signal?.aborted) {
    throw new DOMException('已取消', 'AbortError');
  }

  onStageChange?.('解压几何网格与构造空间索引...', 65);
  // Yield to main thread briefly for smooth UI update
  await new Promise((r) => setTimeout(r, 10));
  if (signal?.aborted) {
    throw new DOMException('已取消', 'AbortError');
  }

  const decoded = await parseMapData(b64);
  if (signal?.aborted) {
    throw new DOMException('已取消', 'AbortError');
  }
  mapCache.set(mapId, decoded);
  return decoded;
}
