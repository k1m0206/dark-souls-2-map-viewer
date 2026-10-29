import json
import io
import os
from pathlib import Path
from PIL import Image
from soulstruct.dcx import decompress
from soulstruct.containers import TPF

results_path = 'miniapp-ds2/scripts/sky-scan-results.json'
with open(results_path, 'r', encoding='utf-8') as f:
    results = json.load(f)

game_bdt = r'E:\steam\steamapps\common\Dark Souls II Scholar of the First Sin\Game\GameDataEbl.bdt'
out_dir = Path('miniapp-ds2/src/assets/sky')
out_dir.mkdir(parents=True, exist_ok=True)

extracted_textures = {}

with open(game_bdt, 'rb') as f:
    for mid, entries in results.items():
        if not entries:
            continue
        print(f'=== Map {mid} ===')
        for e in entries:
            name = e['name']
            stem = name.split('\\')[-1].replace('.tpf.dcx', '')
            
            # Prefer sky_XX or m10_04_sky or enkei
            f.seek(e['bdtOffset'])
            raw = f.read(e['compSize'])
            try:
                dec, _ = decompress(raw)
                tpf = TPF.from_bytes(dec)
                for tex in tpf.textures:
                    tex_stem = tex.stem
                    out_path = out_dir / f"{mid}_{tex_stem}.webp"
                    if out_path.exists():
                        continue
                    img = Image.open(io.BytesIO(tex.data))
                    print(f"  {tex_stem}: size={img.size}, mode={img.mode}, format={img.format}")
                    
                    # Convert to RGBA and save as high-quality WebP
                    img = img.convert('RGBA')
                    # If very large (e.g. 4096), resize down to 1024 or 2048 to save package size
                    if img.width > 1024:
                        img = img.resize((1024, int(img.height * 1024 / img.width)), Image.Resampling.LANCZOS)
                    img.save(out_path, 'WEBP', quality=82)
                    print(f"    Saved {out_path.name}, size={out_path.stat().st_size} bytes")
            except Exception as err:
                print(f"  Error on {name}: {err}")
