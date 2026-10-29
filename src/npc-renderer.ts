import { mat4 } from 'gl-matrix';
import npcModelsJson from './npc-models.json';
import { NPC_TEXTURE_MAP } from './npc-textures';

interface NpcSubmesh {
  texture: string;
  positions: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
}

interface NpcRawModel {
  submeshes: NpcSubmesh[];
}

interface GpuSubmesh {
  vao: WebGLVertexArrayObject;
  vbo: WebGLBuffer;
  nbo: WebGLBuffer;
  uvbo: WebGLBuffer;
  ibo: WebGLBuffer;
  indexCount: number;
  textureKey: string;
}

interface GpuModel {
  submeshes: GpuSubmesh[];
}

export interface RenderableNpc {
  id: string;
  name: string;
  model: string;
  pos: [number, number, number];
  rotY: number;
  color: string;
}

export class NPCRenderer {
  private gl: WebGL2RenderingContext;

  // 1. NPC 3D mesh shader
  private meshProgram: WebGLProgram | null = null;
  private uMeshMVP: WebGLUniformLocation | null = null;
  private uMeshModel: WebGLUniformLocation | null = null;
  private uMeshEye: WebGLUniformLocation | null = null;
  private uMeshColor: WebGLUniformLocation | null = null;
  private uMeshTime: WebGLUniformLocation | null = null;
  private uMeshHasTexture: WebGLUniformLocation | null = null;
  private uMeshAlphaCutoff: WebGLUniformLocation | null = null;
  private uMeshTexture: WebGLUniformLocation | null = null;

  // 2. Foot beacon aura pillar
  private pillarProgram: WebGLProgram | null = null;
  private pillarVao: WebGLVertexArrayObject | null = null;
  private pillarVbo: WebGLBuffer | null = null;
  private uPillarMVP: WebGLUniformLocation | null = null;
  private uPillarColor: WebGLUniformLocation | null = null;
  private uPillarTime: WebGLUniformLocation | null = null;
  private pillarVertexCount: number = 0;

  private defaultTexture: WebGLTexture | null = null;
  private loadedTextures: Map<string, WebGLTexture> = new Map();
  private pendingTextures: Map<string, HTMLImageElement> = new Map();
  private gpuModels: Map<string, GpuModel> = new Map();
  private destroyed = false;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.initMeshShaders();
    this.initDefaultTexture();
    this.initPillarShaders();
    this.initPillarBuffers();
  }

  private createShader(type: number, src: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const msg = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(msg ?? 'Shader error');
    }
    return shader;
  }

  private initMeshShaders() {
    const gl = this.gl;
    const vsSource = `#version 300 es
      precision highp float;
      layout(location = 0) in vec3 aPosition;
      layout(location = 1) in vec2 aUV;
      layout(location = 2) in vec3 aNormal;

      uniform mat4 uMVP;
      uniform mat4 uModel;
      uniform float uTime;

      out vec3 vWorldPos;
      out vec2 vUV;
      out vec3 vWorldNormal;

      void main() {
        // Natural vertex breathing and cloth sway idle animation
        float breath = sin(uTime * 2.4 + aPosition.y * 3.6) * 0.007;
        float sway = sin(uTime * 1.6 + aPosition.x * 2.2) * 0.004;
        vec3 animatedPos = aPosition + aNormal * (breath + sway);

        vec4 world = uModel * vec4(animatedPos, 1.0);
        vWorldPos = world.xyz;
        vUV = aUV;
        vWorldNormal = normalize(mat3(uModel) * aNormal);
        gl_Position = uMVP * vec4(animatedPos, 1.0);
      }
    `;

    const fsSource = `#version 300 es
      precision highp float;

      in vec3 vWorldPos;
      in vec2 vUV;
      in vec3 vWorldNormal;

      uniform vec3 uEye;
      uniform vec4 uColor;
      uniform float uTime;
      uniform int uHasTexture;
      uniform float uAlphaCutoff;
      uniform sampler2D uTexture;

      out vec4 fragColor;

      void main() {
        vec3 baseColor = uColor.rgb;
        float alpha = uColor.a;

        if (uHasTexture == 1) {
          vec4 texColor = texture(uTexture, vUV);
          if (texColor.a < uAlphaCutoff) {
            discard;
          }
          baseColor *= texColor.rgb;
          alpha *= texColor.a;
        }

        vec3 normal = normalize(vWorldNormal);
        if (!gl_FrontFacing) normal = -normal;

        vec3 viewDir = normalize(uEye - vWorldPos);
        vec3 lightDir = normalize(vec3(0.4, 0.85, 0.35));

        // Diffuse wrap lighting
        float ndl = max(dot(normal, lightDir), 0.0);
        float diffuse = ndl * 0.72 + 0.38;

        // Blinn-phong specular
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 20.0) * 0.18;

        // Subtle rim glow
        float rim = 1.0 - max(dot(viewDir, normal), 0.0);
        float rimGlow = pow(rim, 3.5) * 0.15;

        vec3 finalColor = baseColor * diffuse + vec3(spec) + baseColor * rimGlow;
        fragColor = vec4(finalColor, alpha);
      }
    `;

    const vs = this.createShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.createShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    this.meshProgram = program;
    this.uMeshMVP = gl.getUniformLocation(program, 'uMVP');
    this.uMeshModel = gl.getUniformLocation(program, 'uModel');
    this.uMeshEye = gl.getUniformLocation(program, 'uEye');
    this.uMeshColor = gl.getUniformLocation(program, 'uColor');
    this.uMeshTime = gl.getUniformLocation(program, 'uTime');
    this.uMeshHasTexture = gl.getUniformLocation(program, 'uHasTexture');
    this.uMeshAlphaCutoff = gl.getUniformLocation(program, 'uAlphaCutoff');
    this.uMeshTexture = gl.getUniformLocation(program, 'uTexture');
  }

  private initDefaultTexture() {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([210, 205, 195, 255])
    );
    this.defaultTexture = tex;
  }

  private initPillarShaders() {
    const gl = this.gl;
    const vsSource = `#version 300 es
      precision mediump float;
      layout(location = 0) in vec3 aPosition;
      layout(location = 1) in float aAlpha;

      uniform mat4 uMVP;
      uniform float uTime;

      out float vAlpha;
      out vec3 vLocalPos;

      void main() {
        vLocalPos = aPosition;
        vAlpha = aAlpha;
        gl_Position = uMVP * vec4(aPosition, 1.0);
      }
    `;

    const fsSource = `#version 300 es
      precision mediump float;
      in float vAlpha;
      in vec3 vLocalPos;

      uniform vec4 uColor;
      uniform float uTime;

      out vec4 fragColor;

      void main() {
        float pulse = 0.85 + 0.15 * sin(uTime * 3.0 + vLocalPos.y * 2.2);
        float alpha = vAlpha * pulse * uColor.a;
        fragColor = vec4(uColor.rgb, alpha);
      }
    `;

    const vs = this.createShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.createShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

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
    const height = 2.2;

    for (let i = 0; i < segments; i++) {
      const theta0 = (i / segments) * Math.PI * 2;
      const theta1 = ((i + 1) / segments) * Math.PI * 2;

      const x0 = Math.cos(theta0) * radius;
      const z0 = Math.sin(theta0) * radius;
      const x1 = Math.cos(theta1) * radius;
      const z1 = Math.sin(theta1) * radius;

      vertices.push(x0, 0, z0, 0.75);
      vertices.push(x1, 0, z1, 0.75);
      vertices.push(x0, height, z0, 0.02);

      vertices.push(x1, 0, z1, 0.75);
      vertices.push(x1, height, z1, 0.02);
      vertices.push(x0, height, z0, 0.02);
    }

    this.pillarVertexCount = vertices.length / 4;

    this.pillarVao = gl.createVertexArray()!;
    gl.bindVertexArray(this.pillarVao);

    this.pillarVbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pillarVbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 16, 12);

    gl.bindVertexArray(null);
  }

  private loadTexture(textureKey: string): WebGLTexture {
    if (this.loadedTextures.has(textureKey)) {
      return this.loadedTextures.get(textureKey)!;
    }

    const url = NPC_TEXTURE_MAP[textureKey];
    if (!url) {
      return this.defaultTexture!;
    }

    if (this.pendingTextures.has(textureKey)) {
      return this.defaultTexture!;
    }

    const gl = this.gl;
    const img = new Image();
    img.src = url;
    this.pendingTextures.set(textureKey, img);

    img.onload = () => {
      if (this.destroyed) return;
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.generateMipmap(gl.TEXTURE_2D);

      this.loadedTextures.set(textureKey, tex);
      this.pendingTextures.delete(textureKey);
    };

    return this.defaultTexture!;
  }

  private loadGpuModel(modelKey: string): GpuModel | null {
    if (this.gpuModels.has(modelKey)) {
      return this.gpuModels.get(modelKey)!;
    }

    const raw = (npcModelsJson as Record<string, NpcRawModel>)[modelKey];
    if (!raw || !raw.submeshes || raw.submeshes.length === 0) {
      return null;
    }

    const gl = this.gl;
    const gpuSubmeshes: GpuSubmesh[] = [];

    for (const sm of raw.submeshes) {
      const vao = gl.createVertexArray()!;
      gl.bindVertexArray(vao);

      // Positions (location = 0)
      const vbo = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sm.positions), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

      // UVs (location = 1)
      const uvbo = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, uvbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sm.uvs), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

      // Normals (location = 2)
      const nbo = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sm.normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

      // Indices
      const ibo = gl.createBuffer()!;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      const isUint32 = sm.positions.length / 3 > 65535;
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        isUint32 ? new Uint32Array(sm.indices) : new Uint16Array(sm.indices),
        gl.STATIC_DRAW
      );

      gl.bindVertexArray(null);

      gpuSubmeshes.push({
        vao,
        vbo,
        nbo,
        uvbo,
        ibo,
        indexCount: sm.indices.length,
        textureKey: sm.texture,
      });

      // Warm up texture load
      this.loadTexture(sm.texture);
    }

    const gpuModel: GpuModel = { submeshes: gpuSubmeshes };
    this.gpuModels.set(modelKey, gpuModel);
    return gpuModel;
  }

  public render(
    viewProj: mat4,
    cameraPos: [number, number, number],
    activeNpcs: RenderableNpc[],
    timeSeconds: number
  ) {
    if (activeNpcs.length === 0) return;

    const gl = this.gl;
    const modelMat = mat4.create();
    const mvp = mat4.create();

    // 1. Render foot beacon aura pillars
    if (this.pillarProgram && this.pillarVao) {
      gl.useProgram(this.pillarProgram);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
      gl.disable(gl.CULL_FACE);

      gl.bindVertexArray(this.pillarVao);
      gl.uniform1f(this.uPillarTime, timeSeconds);

      for (const npc of activeNpcs) {
        mat4.identity(modelMat);
        mat4.translate(modelMat, modelMat, [npc.pos[0], npc.pos[1], npc.pos[2]]);
        mat4.multiply(mvp, viewProj, modelMat);

        gl.uniformMatrix4fv(this.uPillarMVP, false, mvp);
        const col = this.hexToRgba(npc.color, 0.45);
        gl.uniform4fv(this.uPillarColor, col);

        gl.drawArrays(gl.TRIANGLES, 0, this.pillarVertexCount);
      }

      gl.bindVertexArray(null);
      gl.depthMask(true);
      gl.disable(gl.BLEND);
    }

    // 2. Render 3D NPC Character Meshes
    if (this.meshProgram) {
      gl.useProgram(this.meshProgram);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.depthMask(true);
      gl.disable(gl.CULL_FACE);

      gl.uniform3f(this.uMeshEye, cameraPos[0], cameraPos[1], cameraPos[2]);
      gl.uniform1f(this.uMeshTime, timeSeconds);
      gl.uniform1f(this.uMeshAlphaCutoff, 0.25);
      gl.uniform1i(this.uMeshTexture, 0);

      for (const npc of activeNpcs) {
        const gpuModel = this.loadGpuModel(npc.model);
        if (!gpuModel) continue;

        mat4.identity(modelMat);
        mat4.translate(modelMat, modelMat, [npc.pos[0], npc.pos[1], npc.pos[2]]);
        mat4.rotateY(modelMat, modelMat, (npc.rotY * Math.PI) / 180);
        mat4.multiply(mvp, viewProj, modelMat);

        gl.uniformMatrix4fv(this.uMeshMVP, false, mvp);
        gl.uniformMatrix4fv(this.uMeshModel, false, modelMat);
        gl.uniform4f(this.uMeshColor, 1.0, 1.0, 1.0, 1.0);

        for (const sm of gpuModel.submeshes) {
          const tex = this.loadTexture(sm.textureKey);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.uniform1i(this.uMeshHasTexture, 1);

          gl.bindVertexArray(sm.vao);
          gl.drawElements(gl.TRIANGLES, sm.indexCount, gl.UNSIGNED_SHORT, 0);
          gl.bindVertexArray(null);
        }
      }
    }
  }

  private hexToRgba(hex: string, alpha: number): Float32Array {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return new Float32Array([
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255,
      alpha,
    ]);
  }

  public destroy() {
    this.destroyed = true;
    const gl = this.gl;

    for (const model of this.gpuModels.values()) {
      for (const sm of model.submeshes) {
        gl.deleteVertexArray(sm.vao);
        gl.deleteBuffer(sm.vbo);
        gl.deleteBuffer(sm.nbo);
        gl.deleteBuffer(sm.uvbo);
        gl.deleteBuffer(sm.ibo);
      }
    }
    this.gpuModels.clear();

    for (const tex of this.loadedTextures.values()) {
      gl.deleteTexture(tex);
    }
    this.loadedTextures.clear();

    if (this.defaultTexture) gl.deleteTexture(this.defaultTexture);
    if (this.pillarVao) gl.deleteVertexArray(this.pillarVao);
    if (this.pillarVbo) gl.deleteBuffer(this.pillarVbo);
    if (this.meshProgram) gl.deleteProgram(this.meshProgram);
    if (this.pillarProgram) gl.deleteProgram(this.pillarProgram);
  }
}
