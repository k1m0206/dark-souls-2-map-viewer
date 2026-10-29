import type { DecodedChunk } from './format';

export interface GroundHit {
  groundY: number;
  normalY: number;
}

export interface ICollider {
  lowestY: number;
  highestY: number;
  getGroundHeight(x: number, yLimit: number, z: number, maxStepDown?: number): GroundHit | null;
}

interface ChunkColliderItem {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  chunk: DecodedChunk;
}

export class MapCollider implements ICollider {
  items: ChunkColliderItem[] = [];
  lowestY = -1000;
  highestY = 1000;

  constructor(chunks: DecodedChunk[]) {
    this.build(chunks);
  }

  build(chunks: DecodedChunk[]) {
    this.items = [];
    let lowest = Infinity;
    let highest = -Infinity;

    for (const chunk of chunks) {
      const { min, scale } = chunk.meta;
      const minX = min[0];
      const maxX = min[0] + scale[0] * 65535;
      const minY = min[1];
      const maxY = min[1] + scale[1] * 65535;
      const minZ = min[2];
      const maxZ = min[2] + scale[2] * 65535;

      if (minY < lowest) lowest = minY;
      if (maxY > highest) highest = maxY;

      this.items.push({
        minX,
        maxX,
        minY,
        maxY,
        minZ,
        maxZ,
        chunk
      });
    }

    this.lowestY = Number.isFinite(lowest) ? lowest : -1000;
    this.highestY = Number.isFinite(highest) ? highest : 1000;
  }

  getGroundHeight(x: number, yLimit: number, z: number, maxStepDown = 50.0): GroundHit | null {
    let bestY = -Infinity;
    let bestNormalY = 1.0;
    const padding = 0.2;

    for (let k = 0; k < this.items.length; k++) {
      const item = this.items[k];

      // Broad-phase 2D / 3D bounding box check
      if (
        x < item.minX - padding ||
        x > item.maxX + padding ||
        z < item.minZ - padding ||
        z > item.maxZ + padding
      ) {
        continue;
      }

      if (item.minY > yLimit + 0.8 || item.maxY < yLimit - maxStepDown) {
        continue;
      }

      const { meta, positions, indices } = item.chunk;
      const [minX, minY, minZ] = meta.min;
      const [scaleX, scaleY, scaleZ] = meta.scale;

      const numTris = indices.length;
      for (let t = 0; t < numTris; t += 3) {
        const i0 = indices[t] * 3;
        const i1 = indices[t + 1] * 3;
        const i2 = indices[t + 2] * 3;

        const x0 = minX + positions[i0] * scaleX;
        const y0 = minY + positions[i0 + 1] * scaleY;
        const z0 = minZ + positions[i0 + 2] * scaleZ;

        const x1 = minX + positions[i1] * scaleX;
        const y1 = minY + positions[i1 + 1] * scaleY;
        const z1 = minZ + positions[i1 + 2] * scaleZ;

        const x2 = minX + positions[i2] * scaleX;
        const y2 = minY + positions[i2 + 1] * scaleY;
        const z2 = minZ + positions[i2 + 2] * scaleZ;

        // Fast 2D bounding box
        const triMinX = Math.min(x0, x1, x2);
        const triMaxX = Math.max(x0, x1, x2);
        const triMinZ = Math.min(z0, z1, z2);
        const triMaxZ = Math.max(z0, z1, z2);

        if (x < triMinX || x > triMaxX || z < triMinZ || z > triMaxZ) {
          continue;
        }

        // Barycentric interpolation in the XZ plane
        const dx0 = x1 - x0;
        const dz0 = z1 - z0;
        const dx1 = x2 - x0;
        const dz1 = z2 - z0;

        const det = dx0 * dz1 - dz0 * dx1;
        if (Math.abs(det) < 1e-6) continue;

        const u = ((x - x0) * dz1 - (z - z0) * dx1) / det;
        const v = (dx0 * (z - z0) - dz0 * (x - x0)) / det;

        // Inside triangle test with small tolerance for edge transitions
        if (u >= -0.015 && v >= -0.015 && u + v <= 1.015) {
          const triY = y0 + u * (y1 - y0) + v * (y2 - y0);

          if (triY <= yLimit + 0.6 && triY >= yLimit - maxStepDown && triY > bestY) {
            // Compute face normal to check slope steepness
            const e1x = x1 - x0, e1y = y1 - y0, e1z = z1 - z0;
            const e2x = x2 - x0, e2y = y2 - y0, e2z = z2 - z0;
            const ny = e1z * e2x - e1x * e2z;
            const len = Math.hypot(e1y * e2z - e1z * e2y, ny, e1x * e2y - e1y * e2x);
            const nNormY = len > 0 ? Math.abs(ny / len) : 1.0;

            // Only walk on surfaces with reasonable inclination (normalY > 0.3)
            if (nNormY > 0.25) {
              bestY = triY;
              bestNormalY = nNormY;
            }
          }
        }
      }
    }

    if (bestY > -Infinity) {
      return { groundY: bestY, normalY: bestNormalY };
    }
    return null;
  }
}
