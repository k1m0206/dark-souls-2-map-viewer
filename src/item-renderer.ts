import { mat4 } from 'gl-matrix';
import type { TreasureSpot } from './all-items';

export class ItemRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  
  // Crystal/Diamond mesh (Ground Pickup)
  private crystalVao: WebGLVertexArrayObject;
  private crystalVbo: WebGLBuffer;
  private crystalIbo: WebGLBuffer;
  private crystalIndexCount: number;

  // Box mesh (Chest)
  private chestVao: WebGLVertexArrayObject;
  private chestVbo: WebGLBuffer;
  private chestIbo: WebGLBuffer;
  private chestIndexCount: number;

  private uniforms: Record<string, WebGLUniformLocation> = {};

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

    const vsSrc = `#version 300 es
      layout(location = 0) in vec3 aPosition;
      layout(location = 1) in vec3 aNormal;

      uniform mat4 uVP;
      uniform vec3 uCenter;
      uniform vec3 uColor;
      uniform float uScale;
      uniform float uRotY;
      uniform float uBob;

      out vec3 vWorldNormal;
      out vec3 vWorldPos;
      out vec3 vColor;

      void main() {
        float c = cos(uRotY);
        float s = sin(uRotY);
        // Rotate around Y axis
        vec3 rotated = vec3(
          aPosition.x * c - aPosition.z * s,
          aPosition.y,
          aPosition.x * s + aPosition.z * c
        );
        vec3 normalRot = vec3(
          aNormal.x * c - aNormal.z * s,
          aNormal.y,
          aNormal.x * s + aNormal.z * c
        );

        vec3 world = uCenter + vec3(0.0, uBob, 0.0) + rotated * uScale;
        vWorldPos = world;
        vWorldNormal = normalize(normalRot);
        vColor = uColor;

        gl_Position = uVP * vec4(world, 1.0);
      }
    `;

    const fsSrc = `#version 300 es
      precision highp float;

      in vec3 vWorldNormal;
      in vec3 vWorldPos;
      in vec3 vColor;

      uniform vec3 uEye;
      uniform float uPulse;
      uniform float uIsChest;

      out vec4 fragColor;

      void main() {
        vec3 n = normalize(vWorldNormal);
        vec3 lightDir = normalize(vec3(0.4, 0.85, 0.35));
        vec3 viewDir = normalize(uEye - vWorldPos);

        float diff = max(0.0, dot(n, lightDir));
        float fresnel = pow(1.0 - max(0.0, dot(n, viewDir)), 2.5);

        vec3 color;
        if (uIsChest > 0.5) {
          // Chest: metallic warm wood/brass
          vec3 baseColor = vColor * (0.45 + diff * 0.55);
          vec3 rim = vec3(1.0, 0.85, 0.5) * fresnel * 0.45;
          color = baseColor + rim;
        } else {
          // Soul flame pickup: glowing beacon with pulsating inner core
          vec3 emissive = vColor * (1.1 + uPulse * 0.5);
          vec3 rim = vec3(0.9, 0.95, 1.0) * fresnel * 0.75;
          color = emissive * (0.65 + diff * 0.35) + rim;
        }

        // Depth fog matching map scene
        float dist = length(vWorldPos - uEye);
        float fog = 1.0 - exp(-dist * 0.00065);
        vec3 fogColor = vec3(0.07, 0.08, 0.10);

        fragColor = vec4(mix(color, fogColor, fog), 1.0);
      }
    `;

    const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc);

    this.program = gl.createProgram()!;
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const err = gl.getProgramInfoLog(this.program) || 'Program linking failed';
      throw new Error(err);
    }

    for (const key of ['uVP', 'uCenter', 'uColor', 'uScale', 'uRotY', 'uBob', 'uEye', 'uPulse', 'uIsChest']) {
      this.uniforms[key] = gl.getUniformLocation(this.program, key)!;
    }

    // Build Crystal Mesh (Octahedron for floating soul flame pickup)
    const { vao: cVao, vbo: cVbo, ibo: cIbo, count: cCount } = this.buildCrystalMesh();
    this.crystalVao = cVao;
    this.crystalVbo = cVbo;
    this.crystalIbo = cIbo;
    this.crystalIndexCount = cCount;

    // Build Chest Mesh (Rectangular treasure chest)
    const { vao: chVao, vbo: chVbo, ibo: chIbo, count: chCount } = this.buildChestMesh();
    this.chestVao = chVao;
    this.chestVbo = chVbo;
    this.chestIbo = chIbo;
    this.chestIndexCount = chCount;
  }

  private buildCrystalMesh(): { vao: WebGLVertexArrayObject; vbo: WebGLBuffer; ibo: WebGLBuffer; count: number } {
    const gl = this.gl;
    // Octahedron with separate face normals for crisp crystalline facets
    const top = [0, 0.6, 0];
    const bot = [0, -0.6, 0];
    const p0 = [0.38, 0, 0];
    const p1 = [0, 0, 0.38];
    const p2 = [-0.38, 0, 0];
    const p3 = [0, 0, -0.38];

    const faces: [number[], number[], number[]][] = [
      // Top 4 triangles
      [top, p0, p1],
      [top, p1, p2],
      [top, p2, p3],
      [top, p3, p0],
      // Bottom 4 triangles
      [bot, p1, p0],
      [bot, p2, p1],
      [bot, p3, p2],
      [bot, p0, p3],
    ];

    const vertices: number[] = [];
    const indices: number[] = [];
    let idx = 0;

    for (const [a, b, c] of faces) {
      // Calculate face normal
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      let nx = u[1] * v[2] - u[2] * v[1];
      let ny = u[2] * v[0] - u[0] * v[2];
      let nz = u[0] * v[1] - u[1] * v[0];
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;

      vertices.push(
        a[0], a[1], a[2], nx, ny, nz,
        b[0], b[1], b[2], nx, ny, nz,
        c[0], c[1], c[2], nx, ny, nz
      );
      indices.push(idx, idx + 1, idx + 2);
      idx += 3;
    }

    const vao = gl.createVertexArray()!;
    const vbo = gl.createBuffer()!;
    const ibo = gl.createBuffer()!;

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0); // pos
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12); // normal

    gl.bindVertexArray(null);

    return { vao, vbo, ibo, count: indices.length };
  }

  private buildChestMesh(): { vao: WebGLVertexArrayObject; vbo: WebGLBuffer; ibo: WebGLBuffer; count: number } {
    const gl = this.gl;
    // Box dimensions: w=0.9, h=0.6, d=0.65
    const hw = 0.45;
    const hh = 0.30;
    const hd = 0.32;

    // 6 faces * 4 vertices with separate normals
    const faces = [
      // Front (Z+)
      { norm: [0, 0, 1], quad: [[-hw, -hh, hd], [hw, -hh, hd], [hw, hh, hd], [-hw, hh, hd]] },
      // Back (Z-)
      { norm: [0, 0, -1], quad: [[hw, -hh, -hd], [-hw, -hh, -hd], [-hw, hh, -hd], [hw, hh, -hd]] },
      // Top (Y+)
      { norm: [0, 1, 0], quad: [[-hw, hh, hd], [hw, hh, hd], [hw, hh, -hd], [-hw, hh, -hd]] },
      // Bottom (Y-)
      { norm: [0, -1, 0], quad: [[-hw, -hh, -hd], [hw, -hh, -hd], [hw, -hh, hd], [-hw, -hh, hd]] },
      // Right (X+)
      { norm: [1, 0, 0], quad: [[hw, -hh, hd], [hw, -hh, -hd], [hw, hh, -hd], [hw, hh, hd]] },
      // Left (X-)
      { norm: [-1, 0, 0], quad: [[-hw, -hh, -hd], [-hw, -hh, hd], [-hw, hh, hd], [-hw, hh, -hd]] },
    ];

    const vertices: number[] = [];
    const indices: number[] = [];
    let idx = 0;

    for (const f of faces) {
      const [nx, ny, nz] = f.norm;
      for (const p of f.quad) {
        // offset center up so chest rests on ground (Y=0 is base)
        vertices.push(p[0], p[1] + hh, p[2], nx, ny, nz);
      }
      indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3);
      idx += 4;
    }

    const vao = gl.createVertexArray()!;
    const vbo = gl.createBuffer()!;
    const ibo = gl.createBuffer()!;

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0); // pos
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12); // normal

    gl.bindVertexArray(null);

    return { vao, vbo, ibo, count: indices.length };
  }

  render(
    vp: mat4,
    cameraPos: [number, number, number],
    timeSeconds: number,
    spots: TreasureSpot[],
    maxVisibleDist = 180
  ) {
    if (!spots.length) return;
    const gl = this.gl;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.uVP, false, vp);
    gl.uniform3fv(this.uniforms.uEye, cameraPos);

    const pulse = (Math.sin(timeSeconds * 3.2) + 1.0) * 0.5;
    gl.uniform1f(this.uniforms.uPulse, pulse);

    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i];
      const [x, y, z] = spot.pos;

      // Distance check
      const dx = x - cameraPos[0];
      const dy = y - cameraPos[1];
      const dz = z - cameraPos[2];
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq > maxVisibleDist * maxVisibleDist) continue;

      const isChest = spot.in_chest;
      const firstItem = spot.items[0];
      const cat = firstItem?.category || '';

      // Color coding
      let color: [number, number, number];
      if (isChest) {
        color = [0.96, 0.72, 0.32]; // warm golden bronze
      } else if (cat === '强化材料' || cat === '钥匙余烬') {
        color = [0.98, 0.65, 0.18]; // radiant amber / orange
      } else if (cat === '武器' || cat === '防具') {
        color = [0.82, 0.45, 0.95]; // mystical purple
      } else if (cat === '戒指') {
        color = [0.25, 0.90, 0.65]; // emerald jade
      } else {
        color = [0.38, 0.75, 0.96]; // ethereal soul cyan
      }

      gl.uniform3fv(this.uniforms.uColor, color);
      gl.uniform3fv(this.uniforms.uCenter, spot.pos);

      if (isChest) {
        gl.uniform1f(this.uniforms.uIsChest, 1.0);
        gl.uniform1f(this.uniforms.uScale, 1.0);
        gl.uniform1f(this.uniforms.uRotY, 0.0);
        gl.uniform1f(this.uniforms.uBob, 0.0);

        gl.bindVertexArray(this.chestVao);
        gl.drawElements(gl.TRIANGLES, this.chestIndexCount, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.uniform1f(this.uniforms.uIsChest, 0.0);
        gl.uniform1f(this.uniforms.uScale, 0.75);
        // Slowly spin & float
        const rotY = (timeSeconds * 1.5 + i * 0.7) % (Math.PI * 2);
        const bob = Math.sin(timeSeconds * 2.4 + i * 1.3) * 0.08 + 0.35;
        gl.uniform1f(this.uniforms.uRotY, rotY);
        gl.uniform1f(this.uniforms.uBob, bob);

        gl.bindVertexArray(this.crystalVao);
        gl.drawElements(gl.TRIANGLES, this.crystalIndexCount, gl.UNSIGNED_SHORT, 0);
      }
    }

    gl.bindVertexArray(null);
  }

  destroy() {
    const gl = this.gl;
    gl.deleteVertexArray(this.crystalVao);
    gl.deleteBuffer(this.crystalVbo);
    gl.deleteBuffer(this.crystalIbo);

    gl.deleteVertexArray(this.chestVao);
    gl.deleteBuffer(this.chestVbo);
    gl.deleteBuffer(this.chestIbo);

    gl.deleteProgram(this.program);
  }
}
