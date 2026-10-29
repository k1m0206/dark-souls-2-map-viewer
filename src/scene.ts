import { mat4 } from 'gl-matrix';
import type { DecodedMap } from './format';
import { MapCollider } from './collider';

export interface GpuChunk {
  vao: WebGLVertexArrayObject;
  vbo: WebGLBuffer;
  ibo: WebGLBuffer;
  indexCount: number;
  min: [number, number, number];
  scale: [number, number, number];
  color: [number, number, number];
}

interface LoadedRegion {
  data: DecodedMap;
  chunks: GpuChunk[];
  collider: MapCollider;
}

export class DS2Scene {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  chunks: GpuChunk[] = [];
  collider: MapCollider | null = null;
  mapData: DecodedMap | null = null;
  private regions = new Map<string, LoadedRegion>();

  private uniforms: Record<string, WebGLUniformLocation> = {};
  private view = mat4.create();
  private projection = mat4.create();
  private vp = mat4.create();

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
      uniform mat4 uVP;
      uniform vec3 uMin;
      uniform vec3 uScale;
      out vec3 vWorld;

      void main() {
        vec3 p = uMin + aPosition * uScale;
        vWorld = p;
        gl_Position = uVP * vec4(p, 1.0);
      }
    `;

    const fsSrc = `#version 300 es
      precision highp float;
      in vec3 vWorld;
      uniform vec3 uEye;
      uniform vec3 uRegionColor;
      uniform float uWire;
      out vec4 fragColor;

      void main() {
        // High quality screen-space normal computation
        vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));

        // Directional key light + fill light
        vec3 lightDir1 = normalize(vec3(0.4, 0.85, 0.35));
        vec3 lightDir2 = normalize(vec3(-0.5, 0.3, -0.6));
        float diff1 = max(0.0, dot(n, lightDir1));
        float diff2 = max(0.0, dot(n, lightDir2)) * 0.35;
        float light = 0.28 + 0.72 * (diff1 + diff2);

        // Classic Souls clay white-box palette
        vec3 baseClay = mix(vec3(0.32, 0.34, 0.38), vec3(0.82, 0.78, 0.70), clamp(n.y * 0.5 + 0.5, 0.0, 1.0)) * light;

        // Subtle tint from the collision model's original area signature color
        vec3 tintedClay = mix(baseClay, baseClay * (uRegionColor * 2.2 + 0.35), 0.32);

        // Wireframe / mesh inspection mode tint
        vec3 finalColor = mix(tintedClay, vec3(0.68, 0.82, 0.74), uWire);

        // Exponential atmospheric depth fog
        float dist = length(vWorld - uEye);
        float fog = 1.0 - exp(-dist * 0.00065);
        vec3 fogColor = vec3(0.07, 0.08, 0.10);

        fragColor = vec4(mix(finalColor, fogColor, fog), 1.0);
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

    for (const key of ['uVP', 'uMin', 'uScale', 'uEye', 'uRegionColor', 'uWire']) {
      this.uniforms[key] = gl.getUniformLocation(this.program, key)!;
    }
  }

  loadMap(mapData: DecodedMap, onProgress?: (ratio: number) => void) {
    this.destroyBuffers();
    this.addMap(mapData, onProgress);
    this.setActiveMap(mapData.header.id);
  }

  addMap(mapData: DecodedMap, onProgress?: (ratio: number) => void) {
    if (this.regions.has(mapData.header.id)) return;

    const gl = this.gl;
    const totalChunks = mapData.chunks.length;
    const gpuChunks: GpuChunk[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const chunk = mapData.chunks[i];
      const vao = gl.createVertexArray()!;
      const vbo = gl.createBuffer()!;
      const ibo = gl.createBuffer()!;

      gl.bindVertexArray(vao);

      // Upload quantized 16-bit positions
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, chunk.positions, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.UNSIGNED_SHORT, false, 6, 0);

      // Upload 16-bit indices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, chunk.indices, gl.STATIC_DRAW);

      gl.bindVertexArray(null);

      gpuChunks.push({
        vao,
        vbo,
        ibo,
        indexCount: chunk.indices.length,
        min: chunk.meta.min,
        scale: chunk.meta.scale,
        color: mapData.header.color
      });

      if (onProgress) {
        onProgress((i + 1) / totalChunks);
      }
    }

    this.regions.set(mapData.header.id, {
      data: mapData,
      chunks: gpuChunks,
      collider: new MapCollider(mapData.chunks),
    });
    this.rebuildCombined();
  }

  removeMap(mapId: string) {
    const region = this.regions.get(mapId);
    if (!region) return;
    for (const chunk of region.chunks) {
      this.gl.deleteVertexArray(chunk.vao);
      this.gl.deleteBuffer(chunk.vbo);
      this.gl.deleteBuffer(chunk.ibo);
    }
    this.regions.delete(mapId);
    if (this.mapData?.header.id === mapId) this.mapData = null;
    this.rebuildCombined();
  }

  hasMap(mapId: string) { return this.regions.has(mapId); }
  loadedMapIds() { return [...this.regions.keys()]; }
  mapGroundHeight(mapId: string, x: number, feetY: number, z: number) {
    return this.regions.get(mapId)?.collider.getGroundHeight(x, feetY + 1.2, z, 3) ?? null;
  }
  setActiveMap(mapId: string) {
    this.mapData = this.regions.get(mapId)?.data ?? null;
  }

  private rebuildCombined() {
    this.chunks = [...this.regions.values()].flatMap((region) => region.chunks);
    const collisionChunks = [...this.regions.values()].flatMap((region) => region.data.chunks);
    this.collider = collisionChunks.length ? new MapCollider(collisionChunks) : null;
  }

  render(
    cameraPos: [number, number, number],
    yaw: number,
    pitch: number,
    width: number,
    height: number,
    wireframe: boolean,
    fovDeg = 75
  ) {
    const gl = this.gl;
    if (this.chunks.length === 0) return;

    gl.viewport(0, 0, width, height);
    gl.clearColor(0.07, 0.08, 0.10, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);

    gl.useProgram(this.program);

    // Compute View-Projection Matrix
    const fovRad = (Math.max(35, Math.min(115, fovDeg)) * Math.PI) / 180;
    const aspect = width / Math.max(height, 1);
    mat4.perspective(this.projection, fovRad, aspect, 0.2, 50000.0);

    // Camera transform from yaw & pitch
    mat4.identity(this.view);
    mat4.rotateX(this.view, this.view, -pitch);
    mat4.rotateY(this.view, this.view, -yaw);
    mat4.translate(this.view, this.view, [-cameraPos[0], -cameraPos[1], -cameraPos[2]]);

    mat4.multiply(this.vp, this.projection, this.view);

    gl.uniformMatrix4fv(this.uniforms.uVP, false, this.vp);
    gl.uniform3fv(this.uniforms.uEye, cameraPos);

    gl.uniform1f(this.uniforms.uWire, wireframe ? 1.0 : 0.0);

    // Draw all chunks
    const renderMode = wireframe ? gl.LINES : gl.TRIANGLES;
    for (const chunk of this.chunks) {
      gl.uniform3fv(this.uniforms.uRegionColor, chunk.color);
      gl.uniform3fv(this.uniforms.uMin, chunk.min);
      gl.uniform3fv(this.uniforms.uScale, chunk.scale);

      gl.bindVertexArray(chunk.vao);
      gl.drawElements(renderMode, chunk.indexCount, gl.UNSIGNED_SHORT, 0);
    }

    gl.bindVertexArray(null);
  }

  destroyBuffers() {
    for (const mapId of this.loadedMapIds()) this.removeMap(mapId);
    this.chunks = [];
    this.collider = null;
    this.mapData = null;
  }

  destroy() {
    this.destroyBuffers();
    this.gl.deleteProgram(this.program);
  }
}
