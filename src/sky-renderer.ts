import { mat4 } from 'gl-matrix';
import { MAP_SKY_TEXTURES } from './sky-textures';

export class SkyRenderer {
  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly vbo: WebGLBuffer;
  private readonly ibo: WebGLBuffer;
  private readonly indexCount: number;

  private readonly uVP: WebGLUniformLocation | null;
  private readonly uTexture: WebGLUniformLocation | null;
  private readonly uBaseColor: WebGLUniformLocation | null;
  private readonly uBrightness: WebGLUniformLocation | null;

  private readonly textures = new Map<string, WebGLTexture>();
  private readonly loading = new Set<string>();

  private readonly view = mat4.create();
  private readonly projection = mat4.create();
  private readonly vp = mat4.create();

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    const vsSrc = `#version 300 es
      layout(location = 0) in vec3 aPosition;
      layout(location = 1) in vec2 aUV;
      uniform mat4 uVP;
      out vec2 vUV;
      out float vElevation;

      void main() {
        gl_Position = uVP * vec4(aPosition, 1.0);
        gl_Position.z = gl_Position.w * 0.99999;
        vUV = aUV;
        vElevation = aPosition.y;
      }
    `;

    const fsSrc = `#version 300 es
      precision highp float;
      in vec2 vUV;
      in float vElevation;
      uniform sampler2D uTexture;
      uniform vec3 uBaseColor;
      uniform float uBrightness;
      out vec4 fragColor;

      void main() {
        vec4 texel = texture(uTexture, vUV);
        // Smoothly blend lower horizon into deep background base tone
        float horizonFade = smoothstep(-160.0, 60.0, vElevation);
        vec3 rgb = mix(uBaseColor, texel.rgb * uBrightness, horizonFade);
        fragColor = vec4(rgb, 1.0);
      }
    `;

    const compile = (type: number, src: string): WebGLShader => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader) ?? 'Shader compile failed';
        gl.deleteShader(shader);
        throw new Error(info);
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);

    this.program = gl.createProgram()!;
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program) ?? 'Sky program link failed');
    }

    this.uVP = gl.getUniformLocation(this.program, 'uVP');
    this.uTexture = gl.getUniformLocation(this.program, 'uTexture');
    this.uBaseColor = gl.getUniformLocation(this.program, 'uBaseColor');
    this.uBrightness = gl.getUniformLocation(this.program, 'uBrightness');

    // Generate Panoramic Sky Dome Geometry
    const radius = 1000.0;
    const rings = 24;
    const segments = 48;
    const phiMin = -Math.PI * 0.16; // 稍微向下延伸，覆盖地平线以下
    const phiMax = Math.PI * 0.5;   // 直达天顶 +90 度

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let r = 0; r <= rings; r++) {
      const t = r / rings;
      const phi = phiMin + (phiMax - phiMin) * t;
      const y = radius * Math.sin(phi);
      const rxz = radius * Math.cos(phi);
      // v=0 对应顶端天顶，v=1 对应底端裙边
      const v = 1.0 - t;

      for (let s = 0; s <= segments; s++) {
        const u = s / segments;
        const theta = u * Math.PI * 2.0;
        const x = rxz * Math.sin(theta);
        const z = rxz * Math.cos(theta);

        positions.push(x, y, z);
        uvs.push(u, v);
      }
    }

    const rowStride = segments + 1;
    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < segments; s++) {
        const p0 = r * rowStride + s;
        const p1 = p0 + 1;
        const p2 = (r + 1) * rowStride + s;
        const p3 = p2 + 1;

        // 内表面法线朝向原点（相机位置）
        indices.push(p0, p2, p1);
        indices.push(p1, p2, p3);
      }
    }

    this.indexCount = indices.length;

    // Upload to GPU
    this.vao = gl.createVertexArray()!;
    this.vbo = gl.createBuffer()!;
    this.ibo = gl.createBuffer()!;

    gl.bindVertexArray(this.vao);

    // Interleave positions and uvs: [x, y, z, u, v]
    const interleaved = new Float32Array((positions.length / 3) * 5);
    for (let i = 0, vi = 0, ui = 0; i < interleaved.length; i += 5, vi += 3, ui += 2) {
      interleaved[i] = positions[vi];
      interleaved[i + 1] = positions[vi + 1];
      interleaved[i + 2] = positions[vi + 2];
      interleaved[i + 3] = uvs[ui];
      interleaved[i + 4] = uvs[ui + 1];
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindVertexArray(null);
  }

  private getOrLoadTexture(url: string): WebGLTexture | null {
    const cached = this.textures.get(url);
    if (cached) return cached;

    if (this.loading.has(url) || typeof Image === 'undefined') {
      return null;
    }

    this.loading.add(url);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.loading.delete(url);
      const gl = this.gl;
      const tex = gl.createTexture();
      if (!tex) return;

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      this.textures.set(url, tex);
    };
    img.onerror = () => {
      this.loading.delete(url);
    };
    img.src = url;

    return null;
  }

  render(
    mapId: string,
    yaw: number,
    pitch: number,
    width: number,
    height: number,
    fovDeg = 75,
    enabled = true
  ): void {
    const gl = this.gl;
    gl.viewport(0, 0, width, height);

    const baseColor: [number, number, number] = [0.07, 0.08, 0.10];
    gl.clearColor(baseColor[0], baseColor[1], baseColor[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (!enabled) return;

    const textureUrl = MAP_SKY_TEXTURES[mapId];
    if (!textureUrl) return;

    const texture = this.getOrLoadTexture(textureUrl);
    if (!texture) return;

    // Compute View-Projection with pure rotation (no camera translation)
    const fovRad = (Math.max(35, Math.min(115, fovDeg)) * Math.PI) / 180;
    const aspect = width / Math.max(height, 1);
    mat4.perspective(this.projection, fovRad, aspect, 0.2, 50000.0);

    mat4.identity(this.view);
    mat4.rotateX(this.view, this.view, -pitch);
    mat4.rotateY(this.view, this.view, -yaw);

    mat4.multiply(this.vp, this.projection, this.view);

    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uVP, false, this.vp);
    gl.uniform3fv(this.uBaseColor, baseColor);
    gl.uniform1f(this.uBrightness, 1.15);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(this.uTexture, 0);

    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);

    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
  }

  destroy(): void {
    const gl = this.gl;
    for (const tex of this.textures.values()) {
      gl.deleteTexture(tex);
    }
    this.textures.clear();
    gl.deleteBuffer(this.vbo);
    gl.deleteBuffer(this.ibo);
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.program);
  }
}
