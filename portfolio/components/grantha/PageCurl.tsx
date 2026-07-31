"use client";

/**
 * THE BOOK CANVAS — one WebGL surface across the WHOLE open book, running the
 * page-curl transition (lib/curlSource.ts).
 *
 * It is a transition, not a single-leaf effect: `from` is the current spread
 * (both pages composited into one texture) and `to` is the next spread. The
 * shader turns `from`'s right page over the spine to reproduce `to`. That is
 * why this canvas spans both pages instead of just the right one — the leaf has
 * to be free to roll across the centre and lay down on the left.
 *
 * The split of concerns is unchanged from before: UPLOAD only when a texture's
 * identity changes; DRAW every time `progress` moves (cheap — just new
 * uniforms). If WebGL is missing the component renders nothing and Grantha
 * falls back to an instant page swap.
 */
import { useEffect, useRef } from "react";

import { CURL_FRAG, CURL_VERT } from "@/lib/curlSource";

export type PageSource = HTMLCanvasElement | HTMLImageElement | null;

export interface PageCurlProps {
  /** Current spread, both pages, as one texture. */
  from: PageSource;
  /** Next spread, both pages, as one texture. */
  to: PageSource;
  /** 0 = flat current, 1 = fully turned. */
  progress: number;
  /** Book width / height, for aspect-correct curl direction. */
  ratio: number;
  /** Curl radius (tightness). Reference default 0.1. */
  radius?: number;
  /** Target lift angle in degrees. Reference default 150. */
  angle?: number;
  /** Contact-shadow EXPONENT (not a strength). Reference default 0.2. */
  shadow?: number;
  /** True mirrors the curl horizontally — a backward turn lifts the left page. */
  mirror?: boolean;
  /**
   * Fade the canvas out (CSS only — it keeps its size and keeps drawing). At rest
   * the book shows live spread DOM instead; this layer is revealed only for the
   * duration of a turn. Deliberately opacity and not `display:none`: a canvas
   * with no layout box has clientWidth 0, so the next draw would resize its
   * backing store to 1x1 and the first frame of the turn would be a blank flash.
   */
  hidden?: boolean;
  /**
   * Reports whether the curl is actually usable. The caller needs this: it hides
   * the live page layer for the duration of a turn so the curl can be seen, and if
   * the curl never renders that would show blank paper for a second instead of
   * degrading to an instant swap.
   */
  onReady?: (ok: boolean) => void;
  className?: string;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    // A null log means there is no compiler message to give, which in practice
    // means the context is gone rather than the source being wrong. Do not go
    // hunting the GLSL for this one.
    console.error(
      "[PageCurl] shader compile:",
      log || "(no log — context lost, not a source error)"
    );
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function upload(
  gl: WebGLRenderingContext,
  texRef: { current: WebGLTexture | null },
  src: PageSource,
  mipmap: boolean,
  aniso: { pname: number; max: number } | null
) {
  if (!src) return;
  if (!texRef.current) texRef.current = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texRef.current);
  // Captured pages are drawn top-down; flip on upload so the shader's standard
  // y-up uv reads them upright.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
  } catch {
    // Tainted / zero-size source: keep whatever was there.
    return;
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // Anisotropic filtering, because the roll minifies the page in ONE direction
  // and plain trilinear would over-blur the other. Aniso samples along the roll,
  // staying sharp where it can. NOTE: this is polish, NOT the streak fix — the
  // streaks were a clamped asin() mismapping half the book (see curlSource.ts).
  if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.pname, aniso.max);
  if (mipmap) {
    // Mipmaps supply the pre-averaged levels the minified curl needs at the
    // grazing lip, where the texel footprint stretches without bound.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
}

export default function PageCurl({
  from,
  to,
  progress,
  ratio,
  radius = 0.1,
  angle = 150,
  shadow = 0.2,
  mirror = false,
  hidden = false,
  onReady,
  className,
}: PageCurlProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const progRef = useRef<WebGLProgram | null>(null);
  const fromTex = useRef<WebGLTexture | null>(null);
  const toTex = useRef<WebGLTexture | null>(null);
  const U = useRef<Record<string, WebGLUniformLocation | null>>({});
  const mipmapRef = useRef(false);
  const anisoRef = useRef<{ pname: number; max: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const opts: WebGLContextAttributes = {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    };
    // WebGL2 first: it can mipmap the non-power-of-two page textures directly,
    // which WebGL1 cannot. WebGL1 is the fallback and just goes without mipmaps.
    const gl = (canvas.getContext("webgl2", opts) ||
      canvas.getContext("webgl", opts)) as WebGLRenderingContext | null;
    if (!gl) return;
    // A canvas whose context was previously force-lost keeps returning that same
    // lost context. Nothing can be compiled against it, so say so once instead of
    // logging two mystifying null-log compile failures.
    if (gl.isContextLost()) {
      console.warn("[PageCurl] context is lost; the turn will swap instantly");
      return;
    }
    glRef.current = gl;
    mipmapRef.current =
      typeof WebGL2RenderingContext !== "undefined" &&
      gl instanceof WebGL2RenderingContext;
    const ax = (gl.getExtension("EXT_texture_filter_anisotropic") ||
      gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
      gl.getExtension("MOZ_EXT_texture_filter_anisotropic")) as
      | EXT_texture_filter_anisotropic
      | null;
    anisoRef.current = ax
      ? {
          pname: ax.TEXTURE_MAX_ANISOTROPY_EXT,
          max: gl.getParameter(ax.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number,
        }
      : null;

    const vs = compile(gl, gl.VERTEX_SHADER, CURL_VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, CURL_FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[PageCurl] link:", gl.getProgramInfoLog(program));
      return;
    }
    progRef.current = program;
    gl.useProgram(program);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    U.current = {
      uFrom: gl.getUniformLocation(program, "uFrom"),
      uTo: gl.getUniformLocation(program, "uTo"),
      uProgress: gl.getUniformLocation(program, "uProgress"),
      uRatio: gl.getUniformLocation(program, "uRatio"),
      uRadius: gl.getUniformLocation(program, "uRadius"),
      uShadow: gl.getUniformLocation(program, "uShadow"),
      uAngle: gl.getUniformLocation(program, "uAngle"),
      uMirror: gl.getUniformLocation(program, "uMirror"),
    };
    gl.uniform1i(U.current.uFrom, 0);
    gl.uniform1i(U.current.uTo, 1);

    // A real context loss (GPU reset, tab backgrounded too long, driver hiccup) is
    // rare but it must degrade rather than freeze: without this the canvas would
    // stop drawing while the caller kept hiding the live pages behind it, i.e. a
    // second of blank paper per turn, forever.
    const onLost = (e: Event) => {
      e.preventDefault();
      progRef.current = null;
      onReady?.(false);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    onReady?.(true);

    /**
     * NEVER call `WEBGL_lose_context.loseContext()` here.
     *
     * That is what this cleanup used to do, and it is a self-inflicted wound with
     * a very confusing signature: BOTH shaders fail to compile and
     * `getShaderInfoLog` returns `null`, which looks like a GLSL syntax error and
     * is not one. React StrictMode (on — see next.config.mjs) runs every effect
     * twice in development: setup, cleanup, setup. Force-losing the context in that
     * middle cleanup poisons the CANVAS, because `canvas.getContext()` keeps
     * handing back the same context object — now permanently lost — so the second
     * and final setup compiles against a dead context and the curl silently never
     * renders. A `null` info log is the tell: a real compile error always has a
     * message.
     *
     * Deleting the objects we made is the correct cleanup. The context itself goes
     * when the canvas is garbage collected, and it is a shared, limited resource
     * that we do not own hard enough to destroy.
     */
    return () => {
      onReady?.(false);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (!gl.isContextLost()) {
        gl.deleteBuffer(quad);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (fromTex.current) gl.deleteTexture(fromTex.current);
        if (toTex.current) gl.deleteTexture(toTex.current);
      }
      glRef.current = null;
      progRef.current = null;
      fromTex.current = null;
      toTex.current = null;
    };
    // `onReady` is intentionally out of the dep list: it is a notification, and
    // re-running WebGL setup because a parent re-rendered with a new closure would
    // rebuild the context and every texture for nothing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    if (!gl) return;
    upload(gl, fromTex, from, mipmapRef.current, anisoRef.current);
    upload(gl, toTex, to, mipmapRef.current, anisoRef.current);
  }, [from, to]);

  useEffect(() => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const program = progRef.current;
    if (!gl || !canvas || !program) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);

    gl.useProgram(program);
    gl.uniform1f(U.current.uProgress, Math.min(1, Math.max(0, progress)));
    gl.uniform1f(U.current.uRatio, ratio);
    gl.uniform1f(U.current.uRadius, radius);
    gl.uniform1f(U.current.uShadow, shadow);
    gl.uniform1f(U.current.uAngle, angle);
    gl.uniform1f(U.current.uMirror, mirror ? 1 : 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fromTex.current);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, toTex.current);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [progress, from, to, ratio, radius, angle, shadow, mirror]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      data-hidden={hidden ? "1" : undefined}
      aria-hidden="true"
    />
  );
}
