import { mat4 } from 'gl-matrix';
import type { TreasureSpot } from './all-items';

import chestModelsData from './assets/chest-models.json';
import chestWoodTexUrl from './assets/chest_wood.webp';
import chestIronTexUrl from './assets/chest_iron.webp';
import soulFlameTexUrl from './assets/soul_flame.webp';
import soulCoreTexUrl from './assets/soul_core.webp';
import soulBeamTexUrl from './assets/soul_beam.webp';

interface MeshDef {
  positions: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
}

interface ChestGpuMesh {
  vao: WebGLVertexArrayObject;
  vbo: WebGLBuffer;
  ibo: WebGLBuffer;
  count: number;
}

export class ItemRenderer {
  private gl: WebGL2RenderingContext;

  // Chest rendering pipeline
  private chestProgram: WebGLProgram;
  private chestUniforms: Record<string, WebGLUniformLocation> = {};
  private woodChestMesh: ChestGpuMesh;
  private ironChestMesh: ChestGpuMesh;
  private woodChestTex: WebGLTexture | null = null;
  private ironChestTex: WebGLTexture | null = null;

  // Loot pickup beacon rendering pipeline
  private pickupProgram: WebGLProgram;
  private pickupUniforms: Record<string, WebGLUniformLocation> = {};
  private quadVao: WebGLVertexArrayObject;
  private quadVbo: WebGLBuffer;
  private quadIbo: WebGLBuffer;
  private beamVao: WebGLVertexArrayObject;
  private beamVbo: WebGLBuffer;
  private beamIbo: WebGLBuffer;
  private soulFlameTex: WebGLTexture | null = null;
  private soulCoreTex: WebGLTexture | null = null;
  private soulBeamTex: WebGLTexture | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    const compileShader = (type: number, src: string): WebGLShader => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const err = gl.getShaderInfoLog(shader) || 'Shader compilation failed';
        gl.deleteShader(shader);
        throw new Error(err);
      }
      return shader;
    };

    const linkProgram = (vsSrc: string, fsSrc: string): WebGLProgram => {
      const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc);
      const program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const err = gl.getProgramInfoLog(program) || 'Program linking failed';
        gl.deleteProgram(program);
        throw new Error(err);
      }
      return program;
    };

    // 1. CHEST SHADER (3D authentic FromSoftware wooden & iron chests)
    const chestVs = `#version 300 es
      layout(location = 0) in vec3 aPosition;
      layout(location = 1) in vec3 aNormal;
      layout(location = 2) in vec2 aUV;

      uniform mat4 uVP;
      uniform vec3 uCenter;
      uniform float uRotY;
      uniform float uScale;

      out vec3 vNormal;
      out vec3 vWorldPos;
      out vec2 vUV;

      void main() {
        float c = cos(uRotY);
        float s = sin(uRotY);

        vec3 rotatedPos = vec3(
          aPosition.x * c - aPosition.z * s,
          aPosition.y,
          aPosition.x * s + aPosition.z * c
        );

        vec3 rotatedNorm = vec3(
          aNormal.x * c - aNormal.z * s,
          aNormal.y,
          aNormal.x * s + aNormal.z * c
        );

        vec3 world = uCenter + rotatedPos * uScale;
        vWorldPos = world;
        vNormal = normalize(rotatedNorm);
        vUV = aUV;

        gl_Position = uVP * vec4(world, 1.0);
      }
    `;

    const chestFs = `#version 300 es
      precision highp float;

      in vec3 vNormal;
      in vec3 vWorldPos;
      in vec2 vUV;

      uniform sampler2D uTexture;
      uniform vec3 uEye;

      out vec4 fragColor;

      void main() {
        vec4 texel = texture(uTexture, vUV);
        if (texel.a < 0.15) discard;

        vec3 n = normalize(vNormal);
        vec3 lightDir1 = normalize(vec3(0.42, 0.85, 0.32));
        vec3 lightDir2 = normalize(vec3(-0.45, 0.35, -0.60));
        vec3 viewDir = normalize(uEye - vWorldPos);

        float diff1 = max(0.0, dot(n, lightDir1));
        float diff2 = max(0.0, dot(n, lightDir2)) * 0.32;
        float diff = 0.42 + 0.58 * (diff1 + diff2);

        float fresnel = pow(1.0 - max(0.0, dot(n, viewDir)), 2.8);
        vec3 rim = vec3(0.95, 0.90, 0.78) * fresnel * 0.30;

        vec3 lit = texel.rgb * diff + rim;

        // Depth fog matching map atmosphere
        float dist = length(vWorldPos - uEye);
        float fog = 1.0 - exp(-dist * 0.00065);
        vec3 fogColor = vec3(0.07, 0.08, 0.10);

        fragColor = vec4(mix(lit, fogColor, fog), texel.a);
      }
    `;

    this.chestProgram = linkProgram(chestVs, chestFs);
    for (const key of ['uVP', 'uCenter', 'uRotY', 'uScale', 'uEye', 'uTexture']) {
      this.chestUniforms[key] = gl.getUniformLocation(this.chestProgram, key)!;
    }

    // 2. PICKUP BEACON SHADER (Authentic Dark Souls II glowing soul flame beacon & vertical light column)
    const pickupVs = `#version 300 es
      layout(location = 0) in vec3 aPosition;
      layout(location = 1) in vec2 aUV;

      uniform mat4 uVP;
      uniform vec3 uCenter;
      uniform vec3 uEye;
      uniform vec2 uScale;
      uniform float uIsVerticalBeam;
      uniform float uRotZ;

      out vec2 vUV;
      out vec3 vWorldPos;

      void main() {
        vec3 forward = normalize(uEye - uCenter);
        if (abs(forward.y) > 0.99) {
          forward = vec3(0.0, 0.0, 1.0);
        }

        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
        vec3 up = cross(forward, right);

        vec3 worldOffset;
        if (uIsVerticalBeam > 0.5) {
          // Vertical light column: stays strictly along world Y axis, faces camera horizontally
          worldOffset = right * (aPosition.x * uScale.x) + vec3(0.0, aPosition.y * uScale.y, 0.0);
        } else {
          // Billboard facing camera with optional in-plane flame rotation
          float cz = cos(uRotZ);
          float sz = sin(uRotZ);
          float rx = aPosition.x * cz - aPosition.y * sz;
          float ry = aPosition.x * sz + aPosition.y * cz;
          worldOffset = right * (rx * uScale.x) + up * (ry * uScale.y);
        }

        vec3 world = uCenter + worldOffset;
        vWorldPos = world;
        vUV = aUV;

        gl_Position = uVP * vec4(world, 1.0);
      }
    `;

    const pickupFs = `#version 300 es
      precision highp float;

      in vec2 vUV;
      in vec3 vWorldPos;

      uniform sampler2D uTexture;
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform vec3 uEye;

      out vec4 fragColor;

      void main() {
        vec4 texel = texture(uTexture, vUV);
        float mask = max(texel.a, max(max(texel.r, texel.g), texel.b));
        if (mask < 0.02) discard;

        // Additive luminous soul emission
        vec3 col = uColor * mask * uIntensity;

        // In additive mode, distant fog dissolves luminance to zero
        float dist = length(vWorldPos - uEye);
        float fog = 1.0 - exp(-dist * 0.00065);
        col = mix(col, vec3(0.0), fog);

        fragColor = vec4(col, mask);
      }
    `;

    this.pickupProgram = linkProgram(pickupVs, pickupFs);
    for (const key of ['uVP', 'uCenter', 'uEye', 'uScale', 'uIsVerticalBeam', 'uRotZ', 'uColor', 'uIntensity', 'uTexture']) {
      this.pickupUniforms[key] = gl.getUniformLocation(this.pickupProgram, key)!;
    }

    // Build GPU meshes for chests
    const models = chestModelsData as { wooden_chest: MeshDef; iron_chest: MeshDef };
    this.woodChestMesh = this.buildChestGpuMesh(models.wooden_chest);
    this.ironChestMesh = this.buildChestGpuMesh(models.iron_chest);

    // Build GPU quads for pickup particles
    const quad = this.buildPickupQuadMesh();
    this.quadVao = quad.vao;
    this.quadVbo = quad.vbo;
    this.quadIbo = quad.ibo;

    const beam = this.buildPickupBeamMesh();
    this.beamVao = beam.vao;
    this.beamVbo = beam.vbo;
    this.beamIbo = beam.ibo;

    // Load authentic textures
    this.woodChestTex = this.loadTexture(chestWoodTexUrl, true);
    this.ironChestTex = this.loadTexture(chestIronTexUrl, true);
    this.soulFlameTex = this.loadTexture(soulFlameTexUrl, false);
    this.soulCoreTex = this.loadTexture(soulCoreTexUrl, false);
    this.soulBeamTex = this.loadTexture(soulBeamTexUrl, false);
  }

  private buildChestGpuMesh(mesh: MeshDef): ChestGpuMesh {
    const gl = this.gl;
    const vao = gl.createVertexArray()!;
    const vbo = gl.createBuffer()!;
    const ibo = gl.createBuffer()!;

    // Interleave positions (3), normals (3), uvs (2) -> 8 floats (32 bytes per vertex)
    const vertCount = mesh.positions.length / 3;
    const interleaved = new Float32Array(vertCount * 8);

    for (let i = 0; i < vertCount; i++) {
      const pIdx = i * 3;
      const uIdx = i * 2;
      const outIdx = i * 8;

      interleaved[outIdx] = mesh.positions[pIdx];
      interleaved[outIdx + 1] = mesh.positions[pIdx + 1];
      interleaved[outIdx + 2] = mesh.positions[pIdx + 2];

      interleaved[outIdx + 3] = mesh.normals[pIdx];
      interleaved[outIdx + 4] = mesh.normals[pIdx + 1];
      interleaved[outIdx + 5] = mesh.normals[pIdx + 2];

      interleaved[outIdx + 6] = mesh.uvs[uIdx];
      interleaved[outIdx + 7] = mesh.uvs[uIdx + 1];
    }

    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

    // aPosition
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);

    // aNormal
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);

    // aUV
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);

    gl.bindVertexArray(null);

    return { vao, vbo, ibo, count: mesh.indices.length };
  }

  private buildPickupQuadMesh(): { vao: WebGLVertexArrayObject; vbo: WebGLBuffer; ibo: WebGLBuffer } {
    const gl = this.gl;
    // Centered quad: X in [-0.5, 0.5], Y in [-0.5, 0.5]
    const vertices = new Float32Array([
      -0.5, -0.5, 0.0,  0.0, 1.0,
       0.5, -0.5, 0.0,  1.0, 1.0,
       0.5,  0.5, 0.0,  1.0, 0.0,
      -0.5,  0.5, 0.0,  0.0, 0.0,
    ]);
    const indices = new Uint16Array([
      0, 1, 2,  0, 2, 3
    ]);

    const vao = gl.createVertexArray()!;
    const vbo = gl.createBuffer()!;
    const ibo = gl.createBuffer()!;

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);

    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);

    gl.bindVertexArray(null);

    return { vao, vbo, ibo };
  }

  private buildPickupBeamMesh(): { vao: WebGLVertexArrayObject; vbo: WebGLBuffer; ibo: WebGLBuffer } {
    const gl = this.gl;
    // Base-aligned vertical beam: X in [-0.5, 0.5], Y in [0.0, 1.0]
    const vertices = new Float32Array([
      -0.5, 0.0, 0.0,  0.0, 1.0,
       0.5, 0.0, 0.0,  1.0, 1.0,
       0.5, 1.0, 0.0,  1.0, 0.0,
      -0.5, 1.0, 0.0,  0.0, 0.0,
    ]);
    const indices = new Uint16Array([
      0, 1, 2,  0, 2, 3
    ]);

    const vao = gl.createVertexArray()!;
    const vbo = gl.createBuffer()!;
    const ibo = gl.createBuffer()!;

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);

    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);

    gl.bindVertexArray(null);

    return { vao, vbo, ibo };
  }

  private loadTexture(url: string, wrapRepeat: boolean): WebGLTexture | null {
    const gl = this.gl;
    const tex = gl.createTexture();
    if (!tex) return null;

    // 1x1 placeholder pixel
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([200, 200, 200, 255])
    );

    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        const wrap = wrapRepeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
      };
      img.src = url;
    }

    return tex;
  }

  public render(
    vp: mat4,
    cameraPos: [number, number, number],
    timeSeconds: number,
    spots: TreasureSpot[],
    maxVisibleDist = 180
  ) {
    if (!spots.length) return;
    const gl = this.gl;

    const visibleChests: { spot: TreasureSpot; distSq: number }[] = [];
    const visiblePickups: { spot: TreasureSpot; distSq: number; index: number }[] = [];
    const maxDistSq = maxVisibleDist * maxVisibleDist;

    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i];
      const dx = spot.pos[0] - cameraPos[0];
      const dy = spot.pos[1] - cameraPos[1];
      const dz = spot.pos[2] - cameraPos[2];
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq > maxDistSq) continue;

      if (spot.in_chest) {
        visibleChests.push({ spot, distSq });
      } else {
        visiblePickups.push({ spot, distSq, index: i });
      }
    }

    // =========================================================================
    // PASS 1: RENDER AUTHENTIC 3D CHESTS (WOODEN & IRON)
    // =========================================================================
    if (visibleChests.length > 0) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.depthFunc(gl.LEQUAL);
      gl.disable(gl.BLEND);
      gl.disable(gl.CULL_FACE);

      gl.useProgram(this.chestProgram);
      gl.uniformMatrix4fv(this.chestUniforms.uVP, false, vp);
      gl.uniform3fv(this.chestUniforms.uEye, cameraPos);
      gl.uniform1i(this.chestUniforms.uTexture, 0);
      gl.activeTexture(gl.TEXTURE0);

      // Separate into wood and iron to minimize VAO/Texture swaps
      const woodChests = visibleChests.filter((c) => c.spot.chest_type !== 'iron');
      const ironChests = visibleChests.filter((c) => c.spot.chest_type === 'iron');

      if (woodChests.length > 0 && this.woodChestTex) {
        gl.bindTexture(gl.TEXTURE_2D, this.woodChestTex);
        gl.bindVertexArray(this.woodChestMesh.vao);
        for (const { spot } of woodChests) {
          const rotY = (spot.rotY ?? 0) * (Math.PI / 180);
          gl.uniform3fv(this.chestUniforms.uCenter, spot.pos);
          gl.uniform1f(this.chestUniforms.uRotY, rotY);
          gl.uniform1f(this.chestUniforms.uScale, 1.0);
          gl.drawElements(gl.TRIANGLES, this.woodChestMesh.count, gl.UNSIGNED_SHORT, 0);
        }
      }

      if (ironChests.length > 0 && this.ironChestTex) {
        gl.bindTexture(gl.TEXTURE_2D, this.ironChestTex);
        gl.bindVertexArray(this.ironChestMesh.vao);
        for (const { spot } of ironChests) {
          const rotY = (spot.rotY ?? 0) * (Math.PI / 180);
          gl.uniform3fv(this.chestUniforms.uCenter, spot.pos);
          gl.uniform1f(this.chestUniforms.uRotY, rotY);
          gl.uniform1f(this.chestUniforms.uScale, 1.0);
          gl.drawElements(gl.TRIANGLES, this.ironChestMesh.count, gl.UNSIGNED_SHORT, 0);
        }
      }
    }

    // =========================================================================
    // PASS 2: RENDER AUTHENTIC DARK SOULS II SOUL FLAME BEACONS (GROUND PICKUPS)
    // =========================================================================
    if (visiblePickups.length > 0) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(false); // Transparent emissive particles don't occlude
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Additive luminous blending
      gl.disable(gl.CULL_FACE);

      gl.useProgram(this.pickupProgram);
      gl.uniformMatrix4fv(this.pickupUniforms.uVP, false, vp);
      gl.uniform3fv(this.pickupUniforms.uEye, cameraPos);
      gl.uniform1i(this.pickupUniforms.uTexture, 0);
      gl.activeTexture(gl.TEXTURE0);

      const pulse = (Math.sin(timeSeconds * 3.4) + 1.0) * 0.5;

      // Helper for category tint
      const getColor = (spot: TreasureSpot): [number, number, number] => {
        const cat = spot.items[0]?.category || '';
        if (cat === '强化材料' || cat === '钥匙余烬') {
          return [1.0, 0.72, 0.22]; // Radiant amber gold
        } else if (cat === '武器' || cat === '防具') {
          return [0.85, 0.45, 1.0]; // Mystical violet purple
        } else if (cat === '戒指') {
          return [0.32, 1.0, 0.68]; // Emerald jade
        }
        return [0.55, 0.88, 1.0]; // Ethereal soul cyan-white
      };

      // 2A: Vertical Light Shaft / Pillar of Light
      if (this.soulBeamTex) {
        gl.bindTexture(gl.TEXTURE_2D, this.soulBeamTex);
        gl.bindVertexArray(this.beamVao);
        gl.uniform1f(this.pickupUniforms.uIsVerticalBeam, 1.0);
        gl.uniform1f(this.pickupUniforms.uRotZ, 0.0);

        for (const { spot } of visiblePickups) {
          const col = getColor(spot);
          gl.uniform3fv(this.pickupUniforms.uColor, col);
          gl.uniform3fv(this.pickupUniforms.uCenter, spot.pos);
          gl.uniform2f(this.pickupUniforms.uScale, 0.32, 1.85);
          gl.uniform1f(this.pickupUniforms.uIntensity, 1.4 + pulse * 0.4);
          gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }
      }

      // 2B: Radiant Soul Energy Core / Halo
      if (this.soulCoreTex) {
        gl.bindTexture(gl.TEXTURE_2D, this.soulCoreTex);
        gl.bindVertexArray(this.quadVao);
        gl.uniform1f(this.pickupUniforms.uIsVerticalBeam, 0.0);
        gl.uniform1f(this.pickupUniforms.uRotZ, 0.0);

        for (const { spot, index } of visiblePickups) {
          const col = getColor(spot);
          const bob = Math.sin(timeSeconds * 2.5 + index * 1.3) * 0.04 + 0.38;
          const corePos: [number, number, number] = [spot.pos[0], spot.pos[1] + bob, spot.pos[2]];
          const coreScale = 0.82 + pulse * 0.22;

          gl.uniform3fv(this.pickupUniforms.uColor, col);
          gl.uniform3fv(this.pickupUniforms.uCenter, corePos);
          gl.uniform2f(this.pickupUniforms.uScale, coreScale, coreScale);
          gl.uniform1f(this.pickupUniforms.uIntensity, 1.2 + pulse * 0.5);
          gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }
      }

      // 2C: Authentic FromSoftware Soul Flame Tongue Sprite
      if (this.soulFlameTex) {
        gl.bindTexture(gl.TEXTURE_2D, this.soulFlameTex);
        gl.bindVertexArray(this.quadVao);
        gl.uniform1f(this.pickupUniforms.uIsVerticalBeam, 0.0);

        for (const { spot, index } of visiblePickups) {
          const baseCol = getColor(spot);
          // Inner flame core is radiant white-hot
          const flameCol: [number, number, number] = [
            baseCol[0] * 0.6 + 0.4,
            baseCol[1] * 0.6 + 0.4,
            baseCol[2] * 0.6 + 0.4
          ];

          const bob = Math.sin(timeSeconds * 2.8 + index * 1.5) * 0.06 + 0.44;
          const flamePos: [number, number, number] = [spot.pos[0], spot.pos[1] + bob, spot.pos[2]];
          const flameRotZ = Math.sin(timeSeconds * 4.2 + index * 2.0) * 0.12;
          const flameScaleY = 0.88 + Math.sin(timeSeconds * 4.8 + index * 1.8) * 0.08;

          gl.uniform3fv(this.pickupUniforms.uColor, flameCol);
          gl.uniform3fv(this.pickupUniforms.uCenter, flamePos);
          gl.uniform1f(this.pickupUniforms.uRotZ, flameRotZ);
          gl.uniform2f(this.pickupUniforms.uScale, 0.62, flameScaleY);
          gl.uniform1f(this.pickupUniforms.uIntensity, 2.3 + pulse * 0.7);
          gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

          // 2D: Orbiting ethereal soul wisps
          const wisp1Angle = timeSeconds * 2.6 + index;
          const wisp1Pos: [number, number, number] = [
            spot.pos[0] + Math.cos(wisp1Angle) * 0.20,
            spot.pos[1] + bob + Math.sin(timeSeconds * 3.2) * 0.10,
            spot.pos[2] + Math.sin(wisp1Angle) * 0.20
          ];
          gl.uniform3fv(this.pickupUniforms.uColor, baseCol);
          gl.uniform3fv(this.pickupUniforms.uCenter, wisp1Pos);
          gl.uniform1f(this.pickupUniforms.uRotZ, -wisp1Angle);
          gl.uniform2f(this.pickupUniforms.uScale, 0.22, 0.22);
          gl.uniform1f(this.pickupUniforms.uIntensity, 1.6);
          gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }
      }

      // Restore states
      gl.depthMask(true);
      gl.disable(gl.BLEND);
    }

    gl.bindVertexArray(null);
  }

  public destroy() {
    const gl = this.gl;

    gl.deleteVertexArray(this.woodChestMesh.vao);
    gl.deleteBuffer(this.woodChestMesh.vbo);
    gl.deleteBuffer(this.woodChestMesh.ibo);

    gl.deleteVertexArray(this.ironChestMesh.vao);
    gl.deleteBuffer(this.ironChestMesh.vbo);
    gl.deleteBuffer(this.ironChestMesh.ibo);

    gl.deleteVertexArray(this.quadVao);
    gl.deleteBuffer(this.quadVbo);
    gl.deleteBuffer(this.quadIbo);

    gl.deleteVertexArray(this.beamVao);
    gl.deleteBuffer(this.beamVbo);
    gl.deleteBuffer(this.beamIbo);

    if (this.woodChestTex) gl.deleteTexture(this.woodChestTex);
    if (this.ironChestTex) gl.deleteTexture(this.ironChestTex);
    if (this.soulFlameTex) gl.deleteTexture(this.soulFlameTex);
    if (this.soulCoreTex) gl.deleteTexture(this.soulCoreTex);
    if (this.soulBeamTex) gl.deleteTexture(this.soulBeamTex);

    gl.deleteProgram(this.chestProgram);
    gl.deleteProgram(this.pickupProgram);
  }
}
