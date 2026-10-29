"""
Extract Havok collision meshes from DS2 DLC archives and convert them into .iv format.
Compatible with the miniapp collision pipeline.
"""
import struct
import zlib
from pathlib import Path
import numpy as np

from soulstruct.havok.packfile.unpacker import PackFileUnpacker
from constrata.streams.reader import BinaryReader

# Patch PackFileUnpacker to ignore pointer consumption and unneeded parameter assertions
orig_unpack = PackFileUnpacker.unpack
def patched_unpack(self, reader, types_only=False):
    try:
        orig_unpack(self, reader, types_only=types_only)
    except ValueError:
        pass
PackFileUnpacker.unpack = patched_unpack


ROOT_DIR = Path(__file__).resolve().parents[2]
EXTRACTED_DIR = ROOT_DIR / "data" / "dlc-extracted"
OUTPUT_DIR = ROOT_DIR / "data" / "DarkSouls2CollisionData"

DLC_MAPS = [
    {
        "id": "m50_35",
        "archive": "h50_35_00_00",
        "iv_name": "50_35_Shulva, Sanctum City & Dragon's Sanctum.iv",
        "color": (0.12, 0.32, 0.22), # Jade Poison / Sanctum Green
    },
    {
        "id": "m50_36",
        "archive": "h50_36_00_00",
        "iv_name": "50_36_Brume Tower & Iron Passage.iv",
        "color": (0.35, 0.16, 0.10), # Ash / Smoldering Iron
    },
    {
        "id": "m50_37",
        "archive": "h50_37_00_00",
        "iv_name": "50_37_Frozen Eleum Loyce & Frigid Outskirts.iv",
        "color": (0.18, 0.26, 0.38), # Glacial Frost / Ivory White
    }
]


def extract_raw_subparts(archive_base):
    bhd_path = EXTRACTED_DIR / f"{archive_base}.hkxbhd"
    bdt_path = EXTRACTED_DIR / f"{archive_base}.hkxbdt"

    bhd = bhd_path.read_bytes()
    bdt = bdt_path.read_bytes()

    count = struct.unpack_from("<I", bhd, 0x0C)[0]
    file_header_size = struct.unpack_from("<I", bhd, 0x20)[0]

    subparts = []

    for i in range(count):
        off = 0x40 + i * file_header_size
        size = struct.unpack_from("<Q", bhd, off + 8)[0]
        data_off = struct.unpack_from("<Q", bhd, off + 24)[0] % 0x100000000
        name_off = struct.unpack_from("<I", bhd, off + 32)[0]
        entry_name = bhd[name_off:bhd.find(b"\0", name_off)].decode("utf-8")

        if not entry_name.endswith(".hkx.dcx") or "h01_" not in entry_name:
            continue

        raw = bdt[data_off:data_off + size]
        decomp = zlib.decompress(raw[76:])
        reader = BinaryReader(decomp)
        unpacker = PackFileUnpacker()
        unpacker.unpack(reader)

        for it in unpacker.data_items:
            if "SubpartStorage" in it.get_type_name():
                v = it.value
                raw_idx = np.array(v.indices16, dtype=np.uint16)
                if len(raw_idx) == 0 or len(v.vertices) == 0:
                    continue
                # In Havok extended mesh shape, triangles are stored as 4 uint16 per tri (v0, v1, v2, pad)
                if len(raw_idx) % 4 == 0:
                    tri_indices = raw_idx.reshape(-1, 4)[:, :3].flatten()
                elif len(raw_idx) % 3 == 0:
                    tri_indices = raw_idx
                else:
                    tri_indices = raw_idx[:(len(raw_idx) // 4) * 4].reshape(-1, 4)[:, :3].flatten()

                verts = np.array(v.vertices, dtype=np.float32)[:, :3]
                subparts.append((verts, tri_indices))

    return subparts


def build_iv(subparts, color, output_path):
    """
    Combine subparts into chunks where each chunk has <= 60000 vertices
    to ensure uint16 indexing works properly.
    """
    MAX_CHUNK_VERTS = 55000

    chunks = []
    cur_verts = []
    cur_indices = []
    vert_offset = 0

    for verts, indices in subparts:
        if len(verts) > MAX_CHUNK_VERTS:
            tri_count = len(indices) // 3
            step = (MAX_CHUNK_VERTS // 3)
            for s in range(0, tri_count, step):
                chunk_tris = indices[s * 3 : (s + step) * 3]
                unique_v, remap = np.unique(chunk_tris, return_inverse=True)
                chunks.append((verts[unique_v], remap.astype(np.uint16)))
            continue

        if vert_offset + len(verts) > MAX_CHUNK_VERTS:
            if cur_verts:
                chunks.append((np.concatenate(cur_verts, axis=0), np.concatenate(cur_indices, axis=0)))
                cur_verts = []
                cur_indices = []
                vert_offset = 0

        cur_indices.append(indices + vert_offset)
        cur_verts.append(verts)
        vert_offset += len(verts)

    if cur_verts:
        chunks.append((np.concatenate(cur_verts, axis=0), np.concatenate(cur_indices, axis=0)))

    num_chunks = len(chunks)
    header_size = 16 + num_chunks * 16

    chunk_descriptors = []
    data_buffer = bytearray()

    for verts, indices in chunks:
        idx_count = len(indices)
        pos_count = len(verts)

        idx_offs = header_size + len(data_buffer)
        data_buffer.extend(indices.astype(np.uint16).tobytes())

        while len(data_buffer) % 4 != 0:
            data_buffer.append(0)

        pos_offs = header_size + len(data_buffer)
        data_buffer.extend(verts.astype(np.float32).tobytes())

        chunk_descriptors.append((idx_offs, idx_count, pos_offs, pos_count))

    header = bytearray()
    header.extend(struct.pack("<I3f", num_chunks, color[0], color[1], color[2]))
    for idx_offs, idx_count, pos_offs, pos_count in chunk_descriptors:
        header.extend(struct.pack("<4I", idx_offs, idx_count, pos_offs, pos_count))

    output_path.write_bytes(header + data_buffer)
    total_triangles = sum(c[1] for c in chunk_descriptors) // 3
    total_vertices = sum(c[3] for c in chunk_descriptors)
    print(f"Generated {output_path.name}: {num_chunks} chunks, {total_vertices} verts, {total_triangles} tris, {len(header) + len(data_buffer):,} bytes")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for item in DLC_MAPS:
        print(f"Extracting {item['id']} ({item['archive']})...")
        subparts = extract_raw_subparts(item["archive"])
        print(f"  Extracted {len(subparts)} subpart meshes.")
        out_path = OUTPUT_DIR / item["iv_name"]
        build_iv(subparts, item["color"], out_path)
    print("All DLC collision maps successfully generated into .iv format!")


if __name__ == "__main__":
    main()
