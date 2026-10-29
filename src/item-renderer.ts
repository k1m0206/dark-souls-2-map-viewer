import { mat4 } from 'gl-matrix';
import type { TreasureSpot } from './all-items';

import chestModelsData from './assets/chest-models.json';
import chestWoodTexUrl from './assets/chest_wood.webp';
import chestIronTexUrl from './assets/chest_iron.webp';

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

  // Chest rendering pipeline (3D authentic FromSoftware wooden & iron chests)
  private chestProgram: WebGLProgram;
  private chestUniforms: Record<string, WebGLUniformLocation> = {};
  private woodChestMesh: ChestGpuMesh;
  private ironChestMesh: ChestGpuMesh;
  private woodChestTex: WebGLTexture | null = null;
  private ironChestTex: WebGLTexture | null = null;

  // Soul Orb rendering pipeline (Iconic FromSoftware glowing soul orb billboard)
  private orbProgram: WebGLProgram;
  private orbUniforms: Record<string, WebGLUniformLocation> = {};
  private orbVao: WebGLVertexArrayObject;
  private orbVbo: WebGLBuffer;

  // Light Pillar rendering pipeline (Slender ascending beacon pillar)
  private pillarProgram: WebGLProgram;
  private pillarUniforms: Record<string, WebGLUniformLocation> = {};
  private pillarVao: WebGLVertexArrayObject;
  private pillarVbo: WebGLBuffer;
  private pillarVertexCount: number;

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
        float diff = 0.45 + 0.55 * (diff1 + diff2);

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

    // 2. SOUL ORB SHADER (Authentic Dark Souls swirling soul energy sphere)
    const orbVs = `#version 300 es
      precision mediump float;
      layout(location = 0) in vec2 aQuad;

      uniform mat4 uVP;
      uniform vec3 uCenter;
      uniform vec3 uEye;
      uniform float uRadius;

      out vec2 vUV;
      out vec3 vWorldPos;

      void main() {
        vUV = aQuad;

        vec3 forward = normalize(uEye - uCenter);
        if (abs(forward.y) > 0.99) forward = vec3(0.0, 0.0, 1.0);
        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
        vec3 up = cross(forward, right);

        vec3 worldPos = uCenter + (right * aQuad.x + up * aQuad.y) * uRadius;
        vWorldPos = worldPos;
        gl_Position = uVP * vec4(worldPos, 1.0);
      }
    `;

    const orbFs = `#version 300 es
      precision mediump float;
      in vec2 vUV;
      in vec3 vWorldPos;

      uniform vec4 uCoreColor;
      uniform vec4 uHaloColor;
      uniform float uTime;
      uniform vec3 uEye;

      out vec4 fragColor;

      void main() {
        float r = length(vUV);
        if (r > 1.0) discard;

        // 极坐标流转微光：模拟黑魂原生灵魂外溢的气旋流光
        float angle = atan(vUV.y, vUV.x);
        float swirl = sin(angle * 4.0 + uTime * 4.2) * 0.05 + cos(angle * 2.0 - uTime * 3.1) * 0.03;
        float flameR = r + swirl * (1.0 - r);

        // 炽白核心 (Core) 与柔和外晕 (Halo)
        float core = exp(-flameR * flameR * 12.0);
        float halo = pow(clamp(1.0 - r, 0.0, 1.0), 2.2);

        // 呼吸脉动
        float pulse = 0.90 + 0.10 * sin(uTime * 3.2);

        vec3 rgb = mix(uHaloColor.rgb, uCoreColor.rgb, clamp(core * 1.6, 0.0, 1.0)) * pulse;
        float alpha = clamp(core * 1.25 + halo * 0.75, 0.0, 1.0) * uCoreColor.a;

        // 场景深度雾气融合
        float dist = length(vWorldPos - uEye);
        float fog = 1.0 - exp(-dist * 0.00065);
        rgb = mix(rgb, vec3(0.07, 0.08, 0.10), fog);

        fragColor = vec4(rgb * alpha, alpha);
      }
    `;

    this.orbProgram = linkProgram(orbVs, orbFs);
    for (const key of ['uVP', 'uCenter', 'uEye', 'uRadius', 'uCoreColor', 'uHaloColor', 'uTime']) {
      this.orbUniforms[key] = gl.getUniformLocation(this.orbProgram, key)!;
    }

    // 3. BEACON LIGHT PILLAR SHADER (Slender ascending pillar of light)
    const pillarVs = `#version 300 es
      layout(location = 0) in vec3 aPosition;
      layout(location = 1) in float aAlpha;

      uniform mat4 uVP;
      uniform vec3 uCenter;
      uniform float uHeight;
      uniform float uRadius;

      out float vAlpha;
      out vec3 vWorldPos;

      void main() {
        vec3 world = uCenter + vec3(aPosition.x * uRadius, aPosition.y * uHeight, aPosition.z * uRadius);
        vWorldPos = world;
        vAlpha = aAlpha;
        gl_Position = uVP * vec4(world, 1.0);
      }
    `;

    const pillarFs = `#version 300 es
      precision mediump float;
      in float vAlpha;
      in vec3 vWorldPos;

      uniform vec4 uColor;
      uniform float uTime;
      uniform vec3 uEye;

      out vec4 fragColor;

      void main() {
        float pulse = 0.85 + 0.15 * sin(uTime * 3.0 + vWorldPos.y * 2.0);
        float alpha = vAlpha * pulse * uColor.a;

        float dist = length(vWorldPos - uEye);
        float fog = 1.0 - exp(-dist * 0.00065);
        vec3 rgb = mix(uColor.rgb, vec3(0.07, 0.08, 0.10), fog);

        fragColor = vec4(rgb * alpha, alpha);
      }
    `;

    this.pillarProgram = linkProgram(pillarVs, pillarFs);
    for (const key of ['uVP', 'uCenter', 'uHeight', 'uRadius', 'uColor', 'uTime', 'uEye']) {
      this.pillarUniforms[key] = gl.getUniformLocation(this.pillarProgram, key)!;
    }

    // Build GPU meshes for chests
    const models = chestModelsData as { wooden_chest: MeshDef; iron_chest: MeshDef };
    this.woodChestMesh = this.buildChestGpuMesh(models.wooden_chest);
    this.ironChestMesh = this.buildChestGpuMesh(models.iron_chest);

    // Build Soul Orb Quad
    const { vao: oVao, vbo: oVbo } = this.buildOrbQuadMesh();
    this.orbVao = oVao;
    this.orbVbo = oVbo;

    // Build Pillar Mesh
    const { vao: pVao, vbo: pVbo, count: pCount } = this.buildPillarMesh();
    this.pillarVao = pVao;
    this.pillarVbo = pVbo;
    this.pillarVertexCount = pCount;

    // Load authentic chest textures
    this.woodChestTex = this.loadTexture(chestWoodTexUrl, true);
    this.ironChestTex = this.loadTexture(chestIronTexUrl, true);
  }

  private buildChestGpuMesh(mesh: MeshDef): ChestGpuMesh {
    const gl = this.gl;
    const vao = gl.createVertexArray()!;
    const vbo = gl.createBuffer()!;
    const ibo = gl.createBuffer()!;

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

  private buildOrbQuadMesh(): { vao: WebGLVertexArrayObject; vbo: WebGLBuffer } {
    const gl = this.gl;
    // Quad from [-1, -1] to [1, 1]
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const vao = gl.createVertexArray()!;
    const vbo = gl.createBuffer()!;

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

    gl.bindVertexArray(null);
    return { vao, vbo };
  }

  private buildPillarMesh(): { vao: WebGLVertexArrayObject; vbo: WebGLBuffer; count: number } {
    const gl = this.gl;
    const vertices: number[] = [];
    const segments = 16;
    const radius = 1.0;
    const height = 1.0;

    for (let i = 0; i < segments; i++) {
      const theta0 = (i / segments) * Math.PI * 2;
      const theta1 = ((i + 1) / segments) * Math.PI * 2;

      const x0 = Math.cos(theta0) * radius;
      const z0 = Math.sin(theta0) * radius;
      const x1 = Math.cos(theta1) * radius;
      const z1 = Math.sin(theta1) * radius;

      // Triangle 1
      vertices.push(
        x0, 0.0, z0, 0.75,
        x1, 0.0, z1, 0.75,
        x0, height, z0, 0.0
      );

      // Triangle 2
      vertices.push(
        x1, 0.0, z1, 0.75,
        x1, height, z1, 0.0,
        x0, height, z0, 0.0
      );
    }

    const vao = gl.createVertexArray()!;
    const vbo = gl.createBuffer()!;

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // aPosition
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 16, 0);

    // aAlpha
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 16, 12);

    gl.bindVertexArray(null);

    return { vao, vbo, count: vertices.length / 4 };
  }

  private loadTexture(url: string, wrapRepeat: boolean): WebGLTexture | null {
    const gl = this.gl;
    const tex = gl.createTexture();
    if (!tex) return null;

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
    const visiblePickups: { spot: TreasureSpot; distSq: number }[] = [];
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
        visiblePickups.push({ spot, distSq });
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
    // PASS 2: RENDER AUTHENTIC DARK SOULS SOUL ORBS & LIGHT PILLARS
    // =========================================================================
    if (visiblePickups.length > 0) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(false);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.CULL_FACE);

      // Helper to compute halo and pillar colors by category
      const getColors = (spot: TreasureSpot): {
        core: [number, number, number, number];
        halo: [number, number, number, number];
        pillar: [number, number, number, number];
      } => {
        const cat = spot.items[0]?.category || '';
        const core: [number, number, number, number] = [1.0, 1.0, 1.0, 1.0]; // Always white-hot core

        if (cat === '强化材料' || cat === '钥匙余烬') {
          return {
            core,
            halo: [1.0, 0.78, 0.18, 0.95], // Radiant amber gold
            pillar: [1.0, 0.78, 0.18, 0.35],
          };
        } else if (cat === '武器' || cat === '防具') {
          return {
            core,
            halo: [0.85, 0.48, 1.0, 0.92], // Mystical purple
            pillar: [0.85, 0.48, 1.0, 0.32],
          };
        } else if (cat === '戒指') {
          return {
            core,
            halo: [0.32, 1.0, 0.68, 0.92], // Emerald jade
            pillar: [0.32, 1.0, 0.68, 0.32],
          };
        }

        // Default: Iconic FromSoftware ethereal soul cyan-white
        return {
          core,
          halo: [0.75, 0.92, 1.0, 0.88],
          pillar: [0.75, 0.92, 1.0, 0.35],
        };
      };

      // 2A: RENDER ASCENDING BEACON PILLARS
      gl.useProgram(this.pillarProgram);
      gl.bindVertexArray(this.pillarVao);
      gl.uniformMatrix4fv(this.pillarUniforms.uVP, false, vp);
      gl.uniform3fv(this.pillarUniforms.uEye, cameraPos);
      gl.uniform1f(this.pillarUniforms.uTime, timeSeconds);
      gl.uniform1f(this.pillarUniforms.uRadius, 0.08); // 0.08m slender beacon
      gl.uniform1f(this.pillarUniforms.uHeight, 1.45); // 1.45m pillar

      for (const { spot } of visiblePickups) {
        const { pillar } = getColors(spot);
        const bob = Math.sin(timeSeconds * 2.8 + (spot.pos[0] + spot.pos[2]) * 0.25) * 0.04;
        const basePos: [number, number, number] = [spot.pos[0], spot.pos[1] + 0.22 + bob, spot.pos[2]];

        gl.uniform3fv(this.pillarUniforms.uCenter, basePos);
        gl.uniform4fv(this.pillarUniforms.uColor, pillar);
        gl.drawArrays(gl.TRIANGLES, 0, this.pillarVertexCount);
      }

      // 2B: RENDER SWIRLING SOUL ORB BILLBOARDS
      gl.useProgram(this.orbProgram);
      gl.bindVertexArray(this.orbVao);
      gl.uniformMatrix4fv(this.orbUniforms.uVP, false, vp);
      gl.uniform3fv(this.orbUniforms.uEye, cameraPos);
      gl.uniform1f(this.orbUniforms.uTime, timeSeconds);
      gl.uniform1f(this.orbUniforms.uRadius, 0.28); // 0.28m radius soul orb

      for (const { spot } of visiblePickups) {
        const { core, halo } = getColors(spot);
        const bob = Math.sin(timeSeconds * 2.8 + (spot.pos[0] + spot.pos[2]) * 0.25) * 0.04;
        const orbPos: [number, number, number] = [spot.pos[0], spot.pos[1] + 0.28 + bob, spot.pos[2]];

        gl.uniform3fv(this.orbUniforms.uCenter, orbPos);
        gl.uniform4fv(this.orbUniforms.uCoreColor, core);
        gl.uniform4fv(this.orbUniforms.uHaloColor, halo);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
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

    gl.deleteVertexArray(this.orbVao);
    gl.deleteBuffer(this.orbVbo);

    gl.deleteVertexArray(this.pillarVao);
    gl.deleteBuffer(this.pillarVbo);

    if (this.woodChestTex) gl.deleteTexture(this.woodChestTex);
    if (this.ironChestTex) gl.deleteTexture(this.ironChestTex);

    gl.deleteProgram(this.chestProgram);
    gl.deleteProgram(this.orbProgram);
    gl.deleteProgram(this.pillarProgram);
  }
}
