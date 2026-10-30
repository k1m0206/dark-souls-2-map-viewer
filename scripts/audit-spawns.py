"""Audit catalog spawn positions against the source collision triangles."""
import json
import struct
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT.parent / 'data' / 'DarkSouls2CollisionData'
MANIFEST = json.loads((ROOT / 'public-lite/maps/manifest.json').read_text(encoding='utf-8'))
SPAWNS = json.loads((ROOT / 'src/spawn-points.json').read_text(encoding='utf-8'))
BONFIRES = json.loads((ROOT / 'scripts/bonfire-hints.json').read_text(encoding='utf-8'))['anchors']
NO_BONFIRE_MAP_IDS = set(json.loads((ROOT / 'scripts/bonfire-hints.json').read_text(encoding='utf-8'))['noBonfireMapIds'])
assert set(SPAWNS) == set(BONFIRES) | NO_BONFIRE_MAP_IDS
assert not set(BONFIRES) & NO_BONFIRE_MAP_IDS


def read_triangles(path):
    data = path.read_bytes()
    chunk_count = struct.unpack_from('<I', data)[0]
    triangles = []
    for i in range(chunk_count):
        index_offset, index_count, vertex_offset, vertex_count = struct.unpack_from('<4I', data, 16 + 16 * i)
        vertices = np.frombuffer(data, '<f4', vertex_count * 3, vertex_offset).reshape(-1, 3)
        indices = np.frombuffer(data, '<u2', index_count, index_offset).reshape(-1, 3)
        triangles.append(vertices[indices])
    return np.concatenate(triangles)


def ground_hits(triangles, x, z):
    inside = (triangles[:, :, 0].min(axis=1) <= x) & (triangles[:, :, 0].max(axis=1) >= x)
    inside &= (triangles[:, :, 2].min(axis=1) <= z) & (triangles[:, :, 2].max(axis=1) >= z)
    tri = triangles[inside]
    if len(tri) == 0:
        return np.array([])
    a, b, c = tri[:, 0], tri[:, 1], tri[:, 2]
    dx0, dz0 = b[:, 0] - a[:, 0], b[:, 2] - a[:, 2]
    dx1, dz1 = c[:, 0] - a[:, 0], c[:, 2] - a[:, 2]
    det = dx0 * dz1 - dz0 * dx1
    valid = abs(det) > 1e-6
    u = np.zeros(len(tri))
    v = np.zeros(len(tri))
    u[valid] = ((x - a[valid, 0]) * dz1[valid] - (z - a[valid, 2]) * dx1[valid]) / det[valid]
    v[valid] = (dx0[valid] * (z - a[valid, 2]) - dz0[valid] * (x - a[valid, 0])) / det[valid]
    normal = np.cross(b - a, c - a)
    steepness = abs(normal[:, 1]) / np.maximum(np.linalg.norm(normal, axis=1), 1e-9)
    valid &= (u >= -0.015) & (v >= -0.015) & (u + v <= 1.015) & (steepness > 0.25)
    return np.sort(a[valid, 1] + u[valid] * (b[valid, 1] - a[valid, 1]) + v[valid] * (c[valid, 1] - a[valid, 1]))


for item in MANIFEST:
    file = next(DATA.glob(item['id'][1:3] + '_' + item['id'][4:] + '_*.iv'))
    triangles = read_triangles(file)
    x, y, z = SPAWNS[item['id']]
    assert item['spawnWalk'] == [x, y, z], item['id']
    hits = ground_hits(triangles, x, z)
    below = hits[hits <= y - 0.3]
    floor = below[-1] if len(below) else None
    if floor is None:
        print(f'{item["id"]}: NO GROUND')
        continue
    gap = y - 1.5 - floor
    assert abs(gap) < 1.2, f'{item["id"]}: spawn is {gap:.2f}m from ground'
    nearby = 0
    for ox, oz in [(0.65, 0), (-0.65, 0), (0, 0.65), (0, -0.65)]:
        local = ground_hits(triangles, x + ox, z + oz)
        nearby += bool(len(local[(local >= floor - 0.8) & (local <= floor + 0.8)]))
    assert nearby >= 3, f'{item["id"]}: narrow or isolated ledge'
    if item['id'] in BONFIRES:
        anchor = BONFIRES[item['id']]['position']
        assert np.linalg.norm(np.array([x, y - 1.5, z]) - anchor) < 3, f'{item["id"]}: too far from bonfire anchor'
    print(f'{item["id"]}: ground {floor:.2f}, gap {gap:.2f}, neighbors {nearby}/4')
    if abs(gap) >= 0.9 or nearby < 3:
        centroids = triangles.mean(axis=1)
        normals = np.cross(triangles[:, 1] - triangles[:, 0], triangles[:, 2] - triangles[:, 0])
        slope = abs(normals[:, 1]) / np.maximum(np.linalg.norm(normals, axis=1), 1e-9)
        area = abs(normals[:, 1]) / 2
        score = np.hypot(centroids[:, 0] - x, centroids[:, 2] - z)
        score += abs(centroids[:, 1] - floor) * 0.4
        score[(slope < 0.8) | (area < 0.2)] = np.inf
        for idx in np.argsort(score)[:300]:
            px, py, pz = [round(float(v), 2) for v in centroids[idx]]
            hh = ground_hits(triangles, px, pz)
            hh = hh[hh <= py + 0.7]
            if len(hh) == 0 or abs(hh[-1] - py) > 0.25:
                continue
            good = 0
            for ox, oz in [(0.65, 0), (-0.65, 0), (0, 0.65), (0, -0.65)]:
                local = ground_hits(triangles, px + ox, pz + oz)
                good += bool(len(local[(local >= py - 0.8) & (local <= py + 0.8)]))
            if good >= 4:
                print('  better', [px, round(py + 1.5, 2), pz], 'neighbors', good)
                break

print(f'Validated {len(MANIFEST)} walk spawns against collision geometry')

if '--bonfires' in sys.argv:
    for map_id, hint in BONFIRES.items():
        file = next(DATA.glob(map_id[1:3] + '_' + map_id[4:] + '_*.iv'))
        triangles = read_triangles(file)
        target = hint['position']
        centroids = triangles.mean(axis=1)
        normal = np.cross(triangles[:, 1] - triangles[:, 0], triangles[:, 2] - triangles[:, 0])
        slope = abs(normal[:, 1]) / np.maximum(np.linalg.norm(normal, axis=1), 1e-9)
        area = abs(normal[:, 1]) / 2
        horizontal = np.hypot(centroids[:, 0] - target[0], centroids[:, 2] - target[2])
        vertical = abs(centroids[:, 1] - target[1])
        score = horizontal + vertical * 0.5
        score[(slope < 0.8) | (area < 0.15) | (horizontal > 30) | (vertical > 25)] = np.inf
        found = None
        for idx in np.argsort(score)[:200]:
            if not np.isfinite(score[idx]):
                break
            px, py, pz = [round(float(v), 2) for v in centroids[idx]]
            floor_hits = ground_hits(triangles, px, pz)
            floor_hits = floor_hits[floor_hits <= py + 1.2]
            if len(floor_hits) == 0 or abs(floor_hits[-1] - py) > 0.25:
                continue
            good = 0
            for ox, oz in [(0.65, 0), (-0.65, 0), (0, 0.65), (0, -0.65)]:
                local = ground_hits(triangles, px + ox, pz + oz)
                good += bool(len(local[(local >= py - 0.8) & (local <= py + 0.8)]))
            if good >= 3:
                found = [px, round(py + 1.5, 2), pz]
                break
        print(map_id, hint['name'], 'anchor', target, 'spawn', found,
              'horizontal distance', round(float(horizontal[idx]), 2) if found else None)
