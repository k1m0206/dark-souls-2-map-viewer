import { mat4, vec3 } from 'gl-matrix';
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

  // Soul Orb rendering pipeline (Exact Soul 1 mini-program soul orb billboard)
  private orbProgram: WebGLProgram | null = null;
  private orbVao: WebGLVertexArrayObject | null = null;
  private orbVbo: WebGLBuffer | null = null;
  private uOrbVP: WebGLUniformLocation | null = null;
  private uOrbCenter: WebGLUniformLocation | null = null;
  private uOrbCamRight: WebGLUniformLocation | null = null;
  private uOrbCamUp: WebGLUniformLocation | null = null;
  private uOrbRadius: WebGLUniformLocation | null = null;
  private uOrbCoreColor: WebGLUniformLocation | null = null;
  private uOrbHaloColor: WebGLUniformLocation | null = null;
  private uOrbTime: WebGLUniformLocation | null = null;

  // Light Pillar rendering pipeline (Exact Soul 1 mini-program ascending beacon pillar)
  private pillarProgram: WebGLProgram | null = null;
  private pillarVao: WebGLVertexArrayObject | null = null;
  private pillarVbo: WebGLBuffer | null = null;
  private pillarVertexCount = 0;
  private uPillarMVP: WebGLUniformLocation | null = null;
  private uPillarColor: WebGLUniformLocation | null = null;
  private uPillarTime: WebGLUniformLocation | null = null;

  // Reusable matrices for 60fps zero-allocation rendering
  private modelMatrix: mat4 = mat4.create();
  private mvpMatrix: mat4 = mat4.create();

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

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

        float dist = length(vWorldPos - uEye);
        float fog = 1.0 - exp(-dist * 0.00065);
        vec3 fogColor = vec3(0.07, 0.08, 0.10);

        fragColor = vec4(mix(lit, fogColor, fog), texel.a);
      }
    `;

    this.chestProgram = this.linkProgram(chestVs, chestFs);
    for (const key of ['uVP', 'uCenter', 'uRotY', 'uScale', 'uEye', 'uTexture']) {
      this.chestUniforms[key] = gl.getUniformLocation(this.chestProgram, key)!;
    }

    // Build GPU meshes for chests
    const models = chestModelsData as { wooden_chest: MeshDef; iron_chest: MeshDef };
    this.woodChestMesh = this.buildChestGpuMesh(models.wooden_chest);
    this.ironChestMesh = this.buildChestGpuMesh(models.iron_chest);

    // Load authentic chest textures
    this.woodChestTex = this.loadTexture(chestWoodTexUrl, true);
    this.ironChestTex = this.loadTexture(chestIronTexUrl, true);

    // 2. Initialize exact DS1 Light Pillar & Soul Orb pipelines
    this.initPillarShaders();
    this.initPillarBuffers();
    this.initOrbShaders();
    this.initOrbBuffers();
  }

  private createShader(type: number, src: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const err = gl.getShaderInfoLog(shader) || 'Shader compilation failed';
      gl.deleteShader(shader);
      throw new Error(err);
    }
    return shader;
  }

  private linkProgram(vsSrc: string, fsSrc: string): WebGLProgram {
    const gl = this.gl;
    const vs = this.createShader(gl.VERTEX_SHADER, vsSrc);
    const fs = this.createShader(gl.FRAGMENT_SHADER, fsSrc);
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
  }

  // --- Exact DS1 Pillar Shaders & Buffers ---
  private initPillarShaders() {
    const gl = this.gl;
    const vsSource = `#version 300 es
      layout(location = 0) in vec3 aPosition;
      layout(location = 1) in float aAlpha;

      uniform mat4 uMVP;

      out vec3 vLocalPos;
      out float vAlpha;

      void main() {
        vLocalPos = aPosition;
        vAlpha = aAlpha;
        gl_Position = uMVP * vec4(aPosition, 1.0);
      }
    `;

    const fsSource = `#version 300 es
      precision mediump float;
      in vec3 vLocalPos;
      in float vAlpha;

      uniform vec4 uColor;
      uniform float uTime;

      out vec4 fragColor;

      void main() {
        float pulse = 0.85 + 0.15 * sin(uTime * 3.0 + vLocalPos.y * 2.0);
        float alpha = vAlpha * pulse * uColor.a;
        fragColor = vec4(uColor.rgb, alpha);
      }
    `;

    const program = this.linkProgram(vsSource, fsSource);
    this.pillarProgram = program;
    this.uPillarMVP = gl.getUniformLocation(program, 'uMVP');
    this.uPillarColor = gl.getUniformLocation(program, 'uColor');
    this.uPillarTime = gl.getUniformLocation(program, 'uTime');
  }

  private initPillarBuffers() {
    const gl = this.gl;
    const vertices: number[] = [];
    const segments = 16;
    const radius = 0.45;
    const height = 2.4;

    for (let i = 0; i < segments; i++) {
      const theta0 = (i / segments) * Math.PI * 2;
      const theta1 = ((i + 1) / segments) * Math.PI * 2;

      const x0 = Math.cos(theta0) * radius;
      const z0 = Math.sin(theta0) * radius;
      const x1 = Math.cos(theta1) * radius;
      const z1 = Math.sin(theta1) * radius;

      vertices.push(x0, 0, z0, 0.95);
      vertices.push(x1, 0, z1, 0.95);
      vertices.push(x0, height, z0, 0.05);

      vertices.push(x1, 0, z1, 0.95);
      vertices.push(x1, height, z1, 0.05);
      vertices.push(x0, height, z0, 0.05);
    }

    this.pillarVertexCount = vertices.length / 4;

    this.pillarVao = gl.createVertexArray();
    gl.bindVertexArray(this.pillarVao);

    this.pillarVbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pillarVbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 16, 12);
    gl.enableVertexAttribArray(1);

    gl.bindVertexArray(null);
  }

  // --- Exact DS1 Soul Orb Shaders & Buffers ---
  private initOrbShaders() {
    const gl = this.gl;
    const vsSource = `#version 300 es
      precision mediump float;
      layout(location = 0) in vec2 aQuad;

      uniform mat4 uVP;
      uniform vec3 uCenter;
      uniform vec3 uCamRight;
      uniform vec3 uCamUp;
      uniform float uRadius;

      out vec2 vUV;

      void main() {
        vUV = aQuad;
        vec3 worldPos = uCenter + (uCamRight * aQuad.x + uCamUp * aQuad.y) * uRadius;
        gl_Position = uVP * vec4(worldPos, 1.0);
      }
    `;

    const fsSource = `#version 300 es
      precision mediump float;
      in vec2 vUV;

      uniform vec4 uCoreColor;
      uniform vec4 uHaloColor;
      uniform float uTime;

      out vec4 fragColor;

      void main() {
        float r = length(vUV);
        if (r > 1.0) discard;

        // 极坐标流转微光：模拟黑魂原生余火/灵魂外溢的气旋流光
        float angle = atan(vUV.y, vUV.x);
        float swirl = sin(angle * 4.0 + uTime * 4.2) * 0.05 + cos(angle * 2.0 - uTime * 3.1) * 0.03;
        float flameR = r + swirl * (1.0 - r);

        // 炽白核心 (Core) 与柔和外晕 (Halo)
        float core = exp(-flameR * flameR * 12.0);
        float halo = pow(clamp(1.0 - r, 0.0, 1.0), 2.2);

        // 呼吸脉动
        float pulse = 0.9 + 0.1 * sin(uTime * 3.2);

        vec3 rgb = mix(uHaloColor.rgb, uCoreColor.rgb, clamp(core * 1.6, 0.0, 1.0)) * pulse;
        float alpha = clamp(core * 1.2 + halo * 0.75, 0.0, 1.0) * uCoreColor.a;

        fragColor = vec4(rgb * alpha, alpha);
      }
    `;

    const program = this.linkProgram(vsSource, fsSource);
    this.orbProgram = program;
    this.uOrbVP = gl.getUniformLocation(program, 'uVP');
    this.uOrbCenter = gl.getUniformLocation(program, 'uCenter');
    this.uOrbCamRight = gl.getUniformLocation(program, 'uCamRight');
    this.uOrbCamUp = gl.getUniformLocation(program, 'uCamUp');
    this.uOrbRadius = gl.getUniformLocation(program, 'uRadius');
    this.uOrbCoreColor = gl.getUniformLocation(program, 'uCoreColor');
    this.uOrbHaloColor = gl.getUniformLocation(program, 'uHaloColor');
    this.uOrbTime = gl.getUniformLocation(program, 'uTime');
  }

  private initOrbBuffers() {
    const gl = this.gl;
    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    this.orbVao = gl.createVertexArray();
    gl.bindVertexArray(this.orbVao);

    this.orbVbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.orbVbo);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
    gl.enableVertexAttribArray(0);

    gl.bindVertexArray(null);
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
    camera: mat4 | [number, number, number],
    timeSeconds: number,
    spots: TreasureSpot[],
    maxVisibleDist = 180
  ) {
    if (!spots.length) return;
    const gl = this.gl;

    let cameraPos: [number, number, number];
    let camRight: vec3;
    let camUp: vec3;

    if (camera.length === 16) {
      const cameraMatrix = camera as mat4;
      cameraPos = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
      camRight = vec3.fromValues(cameraMatrix[0], cameraMatrix[1], cameraMatrix[2]);
      vec3.normalize(camRight, camRight);
      camUp = vec3.fromValues(cameraMatrix[4], cameraMatrix[5], cameraMatrix[6]);
      vec3.normalize(camUp, camUp);
    } else {
      cameraPos = camera as [number, number, number];
      camRight = vec3.fromValues(1, 0, 0);
      camUp = vec3.fromValues(0, 1, 0);
    }

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
    // PASS 2: EXACT SOUL 1 MINI-PROGRAM PICKUP LIGHT EFFECT (SOUL ORB & PILLAR)
    // =========================================================================
    if (visiblePickups.length > 0 && this.pillarProgram && this.pillarVao && this.orbProgram && this.orbVao) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // 加法辉光 (Additive blending)
      gl.depthMask(false);

      // 1. 渲染光柱与导向信标 (Exact DS1)
      gl.useProgram(this.pillarProgram);
      gl.bindVertexArray(this.pillarVao);
      gl.uniform1f(this.uPillarTime, timeSeconds);

      for (const { spot } of visiblePickups) {
        // 物品与宝藏顶部升腾的纤细信标光柱（便于远处辨识）
        const bobbing = Math.sin(timeSeconds * 2.8 + (spot.pos[0] + spot.pos[2]) * 0.25) * 0.04;
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, [spot.pos[0], spot.pos[1] + 0.25 + bobbing, spot.pos[2]]);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.08, 1.4, 0.08]);

        mat4.multiply(this.mvpMatrix, vp, this.modelMatrix);
        gl.uniformMatrix4fv(this.uPillarMVP, false, this.mvpMatrix);

        // Exact DS1 item light pillar color
        gl.uniform4f(this.uPillarColor, 0.85, 0.95, 1.0, 0.35);

        gl.drawArrays(gl.TRIANGLES, 0, this.pillarVertexCount);
      }

      // 2. 渲染原生白光「灵魂光球」粒子 (Soul Orb Billboard, Exact DS1)
      gl.useProgram(this.orbProgram);
      gl.bindVertexArray(this.orbVao);

      gl.uniformMatrix4fv(this.uOrbVP, false, vp);
      gl.uniform3fv(this.uOrbCamRight, camRight);
      gl.uniform3fv(this.uOrbCamUp, camUp);
      gl.uniform1f(this.uOrbTime, timeSeconds);

      for (const { spot } of visiblePickups) {
        const bobbing = Math.sin(timeSeconds * 2.8 + (spot.pos[0] + spot.pos[2]) * 0.25) * 0.04;
        const orbCenter: [number, number, number] = [spot.pos[0], spot.pos[1] + 0.28 + bobbing, spot.pos[2]];

        gl.uniform3fv(this.uOrbCenter, orbCenter);

        // Exact DS1 soul orb radius and colors
        gl.uniform1f(this.uOrbRadius, 0.26);
        gl.uniform4f(this.uOrbCoreColor, 1.0, 1.0, 1.0, 1.0);
        gl.uniform4f(this.uOrbHaloColor, 0.78, 0.92, 1.0, 0.85);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      // 恢复状态 (Exact DS1)
      gl.depthMask(true);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.BLEND);
      gl.bindVertexArray(null);
    }
  }

  public destroy() {
    const gl = this.gl;

    gl.deleteVertexArray(this.woodChestMesh.vao);
    gl.deleteBuffer(this.woodChestMesh.vbo);
    gl.deleteBuffer(this.woodChestMesh.ibo);

    gl.deleteVertexArray(this.ironChestMesh.vao);
    gl.deleteBuffer(this.ironChestMesh.vbo);
    gl.deleteBuffer(this.ironChestMesh.ibo);

    if (this.orbVao) gl.deleteVertexArray(this.orbVao);
    if (this.orbVbo) gl.deleteBuffer(this.orbVbo);
    if (this.orbProgram) gl.deleteProgram(this.orbProgram);

    if (this.pillarVao) gl.deleteVertexArray(this.pillarVao);
    if (this.pillarVbo) gl.deleteBuffer(this.pillarVbo);
    if (this.pillarProgram) gl.deleteProgram(this.pillarProgram);

    if (this.woodChestTex) gl.deleteTexture(this.woodChestTex);
    if (this.ironChestTex) gl.deleteTexture(this.ironChestTex);

    gl.deleteProgram(this.chestProgram);
  }
}
