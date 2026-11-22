"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { audioAwake, hiss, playDef, tone, useAutoplaySoundAllowed, type SoundDef } from "@/lib/ui-sounds";

const N = 22; // points per strand
const MAX = 8; // max strands at once

type Strand = {
  x: Float32Array; y: Float32Array; px: Float32Array; py: Float32Array;
  ax: number; ay: number;
  rest: number;
  state: "flying" | "held" | "dangling" | "falling";
  t: number;
  age: number;
  seed: number;
  fibers: [number, number][];
  spokes: [number, number][];
  fib: { off: number; freq: number; phase: number; w: number; a: number; loose: boolean; speed: number }[];
  splat: { ang: number; len: number; curve: number; w: number; a: number; branch: number }[];
  cross: [number, number, number, number][];
  knots: number[];
  fray: number;
  sx: number; sy: number;
  stretch: number;
  alpha: number;
  hitAge: number;
  dIn: [number, number];
  ghost: boolean;
  creaks: number;
};

const jit = (k = 0.12) => 1 + (Math.random() * 2 - 1) * k;
const def = (label: string, play: SoundDef["play"]): SoundDef => ({ category: "Web", label, play });
const SFX = {
  thwip: () => {
    const r = jit();
    return def("Thwip", (c, o) => {
      hiss(c, o, { attack: 0.004, decay: 0.016, freq: 7000 * r, gain: 0.16, filter: "highpass" });
      hiss(c, o, { attack: 0.006, decay: 0.085 * jit(0.2), freq: 2600 * r, to: 900 * r, gain: 0.32, q: 1.6 });
      hiss(c, o, { at: 0.012, attack: 0.01, decay: 0.07, freq: 5200 * r, to: 1800, gain: 0.12, q: 3 });
      tone(c, o, { freq: 190 * r, to: 95, decay: 0.045, gain: 0.12 });
    });
  },
  splat: (force: number) => {
    const r = jit(0.08);
    return def("Splat", (c, o) => {
      hiss(c, o, { attack: 0.002, decay: 0.06, freq: 1100 * r, to: 260, gain: 0.34 * force, filter: "lowpass", q: 0.7 });
      tone(c, o, { freq: 150 * r, to: 72, decay: 0.08, gain: 0.3 * force });
      hiss(c, o, { attack: 0.002, decay: 0.012, freq: 3400 * r, gain: 0.12 * force, q: 2.5 });
      for (let k = 0; k < 4; k++) hiss(c, o, { at: 0.03 + k * 0.022 + Math.random() * 0.012, decay: 0.008, freq: 2500 + Math.random() * 2500, gain: 0.05 * force, q: 4 });
    });
  },
  creak: (stretch: number) =>
    def("Creak", (c, o) => {
      const f = 240 + (stretch - 1) * 420;
      tone(c, o, { freq: f, to: f * 1.18, attack: 0.012, decay: 0.07, gain: 0.05, type: "triangle" });
      hiss(c, o, { attack: 0.01, decay: 0.07, freq: f * 3, gain: 0.07, q: 9 });
    }),
  recoil: () =>
    def("Recoil", (c, o) => {
      hiss(c, o, { attack: 0.01, decay: 0.09, freq: 1900 * jit(), to: 520, gain: 0.11, q: 1.1 });
    }),
  snap: () => {
    const r = jit(0.08);
    return def("Snap", (c, o) => {
      hiss(c, o, { decay: 0.014, freq: 3200 * r, gain: 0.42, filter: "highpass" });
      tone(c, o, { freq: 820 * r, to: 210, glide: 0.16, decay: 0.2, gain: 0.13, type: "triangle" });
      hiss(c, o, { at: 0.015, attack: 0.012, decay: 0.13, freq: 4200 * r, to: 700, gain: 0.16, q: 1.4 });
    });
  },
  stick: () =>
    def("Stick", (c, o) => {
      hiss(c, o, { attack: 0.002, decay: 0.03, freq: 1500 * jit(), to: 500, gain: 0.13, filter: "lowpass" });
      hiss(c, o, { at: 0.012, decay: 0.006, freq: 3800, gain: 0.04, q: 4 });
    }),
  peel: () =>
    def("Peel", (c, o) => {
      for (let k = 0; k < 5; k++) hiss(c, o, { at: k * 0.018 + Math.random() * 0.01, decay: 0.01, freq: 1800 + Math.random() * 3000, gain: 0.035, q: 3 });
    }),
};

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export type HeroWebSlingProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  targetRef: React.RefObject<HTMLElement | null>;
  snapAt?: number;
  enableSound?: boolean;
};

export function HeroWebSling({
  sectionRef,
  targetRef,
  snapAt = 2.4,
  enableSound = true,
}: HeroWebSlingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const autoSound = useAutoplaySoundAllowed();
  const soundRef = useRef({ on: enableSound, auto: autoSound });

  useLayoutEffect(() => {
    soundRef.current = { on: enableSound, auto: autoSound };
  }, [enableSound, autoSound]);

  useEffect(() => {
    const stage = sectionRef.current;
    const target = targetRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const reduced = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1;
    const B = { cx: 0, cy: 0, w: 0, h: 0 };
    const pose = { x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, hit: 0 };

    const fit = () => {
      const sr = stage.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = sr.width;
      h = sr.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const curTarget = targetRef.current;
      if (curTarget) {
        const tr = curTarget.getBoundingClientRect();
        B.w = tr.width || curTarget.offsetWidth;
        B.h = tr.height || curTarget.offsetHeight;
        B.cx = tr.left - sr.left + B.w / 2 - pose.x;
        B.cy = tr.top - sr.top + B.h / 2 - pose.y;
      }
    };

    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    if (target) ro.observe(target);
    window.addEventListener("resize", fit);
    fit();

    const toWorld = (lx: number, ly: number) => {
      const c = Math.cos(pose.rot), s = Math.sin(pose.rot);
      return { x: B.cx + pose.x + lx * c - ly * s, y: B.cy + pose.y + lx * s + ly * c };
    };

    const nearestLocal = (qx: number, qy: number) => {
      const c = Math.cos(-pose.rot), s = Math.sin(-pose.rot);
      const dx = qx - (B.cx + pose.x), dy = qy - (B.cy + pose.y);
      const lx = dx * c - dy * s, ly = dx * s + dy * c;
      const r = B.h / 2, a = Math.max(0, B.w / 2 - r);
      const cx = Math.max(-a, Math.min(a, lx));
      const vx = lx - cx, vy = ly;
      const d = Math.hypot(vx, vy) || 1;
      return { x: cx + (vx / d) * (r - 2), y: (vy / d) * (r - 2), nx: vx / d, ny: vy / d };
    };

    let strands: Strand[] = [];
    let splash: { x: number; y: number; vx: number; vy: number; r: number; age: number; seed: number }[] = [];
    let held: Strand | null = null;
    const ptr = { x: -999, y: -999, inside: false, down: false, last: 0 };
    let seedN = 1;

    const sfx = (d: SoundDef, vol: number, ghost: boolean) => {
      const o = soundRef.current;
      if (!o.on || (ghost && (!o.auto || !audioAwake()))) return;
      playDef(`web-${d.label}`, d, vol);
    };

    const fire = (x: number, y: number) => {
      if (reduced) return;
      sfx(SFX.thwip(), 0.75, false);
      const a = nearestLocal(x, y);
      const end = toWorld(a.x, a.y);
      const dist = Math.hypot(end.x - x, end.y - y);
      const s: Strand = {
        x: new Float32Array(N).fill(x), y: new Float32Array(N).fill(y),
        px: new Float32Array(N).fill(x), py: new Float32Array(N).fill(y),
        ax: a.x, ay: a.y,
        rest: (dist * 1.02) / (N - 1),
        state: "flying", t: 0, age: 0, seed: seedN++,
        fibers: Array.from({ length: 5 }, (_, k) => {
          const tang = [-a.ny, a.nx];
          const off = (k - 2) * 6 + (Math.random() - 0.5) * 3;
          return [tang[0] * off - a.nx * Math.random() * 4, tang[1] * off - a.ny * Math.random() * 4] as [number, number];
        }),
        spokes: Array.from({ length: 9 }, (_, k) => [(k / 9) * Math.PI * 2 + (Math.random() - 0.5) * 0.4, 8 + Math.random() * 12] as [number, number]),
        sx: x, sy: y, stretch: 1, alpha: 1,
        fib: Array.from({ length: 9 }, (_, k) => ({
          off: (k / 8) * 2 - 1 + (Math.random() - 0.5) * 0.3,
          freq: 6 + Math.random() * 10,
          phase: Math.random() * Math.PI * 2,
          w: 0.35 + Math.random() * 0.55,
          a: 0.4 + Math.random() * 0.45,
          loose: Math.random() < 0.22,
          speed: 0.5 + Math.random(),
        })),
        splat: Array.from({ length: 14 }, (_, k) => ({
          ang: (k / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.35,
          len: 10 + Math.pow(Math.random(), 1.4) * 24,
          curve: (Math.random() - 0.5) * 0.7,
          w: 0.4 + Math.random() * 0.6,
          a: 0.45 + Math.random() * 0.45,
          branch: Math.random() < 0.35 ? (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.5) : 0,
        })).sort((p, q) => p.ang - q.ang),
        cross: [],
        knots: Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => 0.12 + Math.random() * 0.76),
        fray: 0,
        hitAge: 0,
        dIn: [-a.nx, -a.ny],
        ghost: false,
        creaks: 0,
      };
      for (let k = 0; k < 7; k++) {
        const i = Math.floor(Math.random() * s.splat.length);
        s.cross.push([i, (i + 1) % s.splat.length, 0.3 + Math.random() * 0.6, 0.3 + Math.random() * 0.6]);
      }
      strands.push(s);
      if (strands.length > MAX) {
        const old = strands.find((t) => t !== s && t.state === "dangling") ?? strands.find((t) => t !== s && t.state !== "falling");
        if (old) { old.state = "falling"; sfx(SFX.peel(), 0.6, false); }
      }
      return s;
    };

    const release = () => {
      if (held && held.state === "held") {
        held.state = "dangling";
        held.rest *= 0.82;
        held.t = 0;
        sfx(SFX.recoil(), 0.7, held.ghost);
      }
      held = null;
    };

    const press = (x: number, y: number) => {
      release();
      held = fire(x, y) ?? null;
    };

    const local = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const targetEl = e.target as HTMLElement;
      // Do not intercept clicks on real buttons, links, or inputs
      if (targetEl && targetEl.closest("button, a, input, textarea, [role='button']")) return;

      e.preventDefault();
      const p = local(e);
      ptr.x = p.x; ptr.y = p.y; ptr.down = true; ptr.last = performance.now();
      try { stage.setPointerCapture(e.pointerId); } catch {}
      press(p.x, p.y);
    };

    const onMove = (e: PointerEvent) => {
      const p = local(e);
      ptr.x = p.x; ptr.y = p.y;
      const inside = p.x >= 0 && p.y >= 0 && p.x <= w && p.y <= h;
      const targetEl = e.target as HTMLElement;
      const isOverInteractive = !!targetEl?.closest("button, a, input, textarea, [role='button']");
      ptr.inside = inside && !isOverInteractive;
      if (inside) ptr.last = performance.now();
    };

    const onUp = () => { ptr.down = false; release(); };

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // WebGL
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true }) as WebGLRenderingContext | null;
    const mk = (vs: string, fs: string) => {
      if (!gl) return null;
      const sh = (t: number, src: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, src); gl.compileShader(o); return o; };
      const pr = gl.createProgram()!;
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
      return pr;
    };
    const RVS = `attribute vec2 aPos;attribute vec4 aV;attribute vec2 aSK;uniform vec2 uRes;varying vec4 vV;varying vec2 vSK;
void main(){vV=aV;vSK=aSK;vec2 c=aPos/uRes*2.0-1.0;gl_Position=vec4(c.x,-c.y,0.0,1.0);}`;
    const RFS = `precision mediump float;varying vec4 vV;varying vec2 vSK;
float h(float n){return fract(sin(n)*43758.5453);}
float nz(float x){float i=floor(x);float f=fract(x);f=f*f*(3.0-2.0*f);return mix(h(i),h(i+1.0),f);}
void main(){
  float k=vSK.y;float light=vV.y;float along=vV.w;float ax=abs(vV.x);
  if(k>1.5){
    float e=1.0-smoothstep(0.2,1.0,ax);
    float a=vV.z*e;
    float spec=pow(light,6.0)*0.9;
    vec3 c=mix(vec3(0.70,0.74,0.82),vec3(0.98,0.99,1.0),light)+spec;
    gl_FragColor=vec4(min(c,vec3(1.0))*a,a);return;
  }
  if(k>0.5){
    float a=vV.z*(1.0-smoothstep(0.0,1.0,ax));
    gl_FragColor=vec4(0.0,0.0,0.0,a);return;
  }
  float e=1.0-smoothstep(0.35,1.0,ax);
  float cr=nz(along*0.5+vSK.x*37.0)*0.6+nz(along*2.1+vSK.x*11.0)*0.4;
  float spec=pow(light,3.0)*(0.15+1.6*cr*cr);
  vec3 base=mix(vec3(0.6,0.64,0.72),vec3(0.95,0.96,0.99),light);
  vec3 c=base*(0.6+0.4*light)+vec3(1.0,0.99,0.96)*spec;
  float a=vV.z*e;
  gl_FragColor=vec4(min(c,vec3(1.0))*a,a);
}`;
    const PVS = `attribute vec2 aPos;attribute vec2 aSA;uniform vec2 uRes;uniform float uDpr;varying float vA;
void main(){vA=aSA.y;vec2 c=aPos/uRes*2.0-1.0;gl_Position=vec4(c.x,-c.y,0.0,1.0);gl_PointSize=aSA.x*uDpr;}`;
    const PFS = `precision mediump float;varying float vA;
void main(){vec2 p=gl_PointCoord-0.5;float d=length(p)*2.0;float core=exp(-d*d*14.0);float halo=exp(-d*d*3.0)*0.25;
vec3 c=(vec3(1.0)*core+vec3(0.7,0.8,1.0)*halo)*vA;gl_FragColor=vec4(c,max(c.r,max(c.g,c.b)));}`;
    const rProg = mk(RVS, RFS);
    const pProg = mk(PVS, PFS);
    const rBuf = gl?.createBuffer() || null;
    const pBuf = gl?.createBuffer() || null;
    const VMAX = 90000;
    const VB = new Float32Array(VMAX * 8);
    let vn = 0;
    const PB = new Float32Array(3000 * 4);
    let pn = 0;

    const point = (x: number, y: number, size: number, a: number) => {
      if (pn >= 3000 || a < 0.02) return;
      const o = pn * 4;
      PB[o] = x; PB[o + 1] = y; PB[o + 2] = size; PB[o + 3] = Math.min(1, a);
      pn++;
    };
    const vtx = (x: number, y: number, ac: number, li: number, al: number, lo: number, sd: number, kd: number) => {
      const o = vn * 8;
      VB[o] = x; VB[o + 1] = y; VB[o + 2] = ac; VB[o + 3] = li; VB[o + 4] = al; VB[o + 5] = lo; VB[o + 6] = sd; VB[o + 7] = kd;
      vn++;
    };
    const RN = 260;
    const rx = new Float32Array(RN), ry = new Float32Array(RN), rw = new Float32Array(RN), rl = new Float32Array(RN), ra = new Float32Array(RN), rg = new Float32Array(RN);
    const ribbon = (n: number, seed: number, kind = 0) => {
      if (n < 2 || vn + (n - 1) * 6 >= VMAX) return;
      const minW = 1.2 / dpr;
      let pnx = 0, pny = 0, pw = 0, pa = 0;
      for (let i = 0; i < n; i++) {
        const i0 = Math.max(0, i - 1), i1 = Math.min(n - 1, i + 1);
        let tx = rx[i1] - rx[i0], ty = ry[i1] - ry[i0];
        const tl = Math.hypot(tx, ty) || 1;
        tx /= tl; ty /= tl;
        const nx = -ty, ny = tx;
        let wd = rw[i], al = ra[i];
        if (wd < minW && kind === 0) { al *= wd / minW; wd = minW; }
        if (i > 0) {
          const j = i - 1, hj = pw / 2, hi = wd / 2;
          vtx(rx[j] + pnx * hj, ry[j] + pny * hj, -1, rl[j], pa, rg[j], seed, kind);
          vtx(rx[j] - pnx * hj, ry[j] - pny * hj, 1, rl[j], pa, rg[j], seed, kind);
          vtx(rx[i] + nx * hi, ry[i] + ny * hi, -1, rl[i], al, rg[i], seed, kind);
          vtx(rx[j] - pnx * hj, ry[j] - pny * hj, 1, rl[j], pa, rg[j], seed, kind);
          vtx(rx[i] - nx * hi, ry[i] - ny * hi, 1, rl[i], al, rg[i], seed, kind);
          vtx(rx[i] + nx * hi, ry[i] + ny * hi, -1, rl[i], al, rg[i], seed, kind);
        }
        pnx = nx; pny = ny; pw = wd; pa = al;
      }
    };
    const blob = (x: number, y: number, r: number, seed: number, alpha: number, squash = 1, ang = 0) => {
      if (r < 0.3 || vn + 28 * 3 >= VMAX) return;
      const K = 28;
      const c = Math.cos(ang), s = Math.sin(ang);
      const P = (k: number) => {
        const a = (k / K) * Math.PI * 2;
        const rr = r * (1 + 0.24 * Math.sin(a * 2 + seed) + 0.15 * Math.sin(a * 5 - seed * 1.7) + 0.08 * Math.sin(a * 9 + seed * 3));
        const lx = Math.cos(a) * rr, ly = Math.sin(a) * rr * squash;
        return [x + lx * c - ly * s, y + lx * s + ly * c, 0.5 - 0.5 * Math.sin(a + 0.8)] as const;
      };
      for (let k = 0; k < K; k++) {
        const p0 = P(k), p1 = P(k + 1);
        vtx(x, y, 0, 0.85, alpha, 0, seed, 2);
        vtx(p0[0], p0[1], 1, p0[2], alpha, 0, seed, 2);
        vtx(p1[0], p1[1], 1, p1[2], alpha, 0, seed, 2);
      }
    };
    const flush = () => {
      if (!gl || !rProg || !pProg) return;
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      if (vn) {
        gl.useProgram(rProg);
        gl.uniform2f(gl.getUniformLocation(rProg, "uRes"), w, h);
        gl.bindBuffer(gl.ARRAY_BUFFER, rBuf);
        gl.bufferData(gl.ARRAY_BUFFER, VB.subarray(0, vn * 8), gl.DYNAMIC_DRAW);
        const a0 = gl.getAttribLocation(rProg, "aPos"), a1 = gl.getAttribLocation(rProg, "aV"), a2 = gl.getAttribLocation(rProg, "aSK");
        gl.enableVertexAttribArray(a0); gl.vertexAttribPointer(a0, 2, gl.FLOAT, false, 32, 0);
        gl.enableVertexAttribArray(a1); gl.vertexAttribPointer(a1, 4, gl.FLOAT, false, 32, 8);
        gl.enableVertexAttribArray(a2); gl.vertexAttribPointer(a2, 2, gl.FLOAT, false, 32, 24);
        gl.drawArrays(gl.TRIANGLES, 0, vn);
        gl.disableVertexAttribArray(a1); gl.disableVertexAttribArray(a2);
      }
      if (pn) {
        gl.useProgram(pProg);
        gl.uniform2f(gl.getUniformLocation(pProg, "uRes"), w, h);
        gl.uniform1f(gl.getUniformLocation(pProg, "uDpr"), dpr);
        gl.bindBuffer(gl.ARRAY_BUFFER, pBuf);
        gl.bufferData(gl.ARRAY_BUFFER, PB.subarray(0, pn * 4), gl.DYNAMIC_DRAW);
        const a0 = gl.getAttribLocation(pProg, "aPos"), a1 = gl.getAttribLocation(pProg, "aSA");
        gl.enableVertexAttribArray(a0); gl.vertexAttribPointer(a0, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(a1); gl.vertexAttribPointer(a1, 2, gl.FLOAT, false, 16, 8);
        gl.drawArrays(gl.POINTS, 0, pn);
        gl.disableVertexAttribArray(a1);
      }
      vn = 0; pn = 0;
    };

    const SUB = 4;
    const MP = (N - 1) * SUB + 1;
    const PX = new Float32Array(MP), PY = new Float32Array(MP), NX = new Float32Array(MP), NY = new Float32Array(MP), LS = new Float32Array(MP);
    const smoothPath = (s: Strand, cx0?: number, cy0?: number) => {
      const X = (i: number) => (i === 0 && cx0 !== undefined ? cx0 : s.x[Math.max(0, Math.min(N - 1, i))]);
      const Y = (i: number) => (i === 0 && cy0 !== undefined ? cy0! : s.y[Math.max(0, Math.min(N - 1, i))]);
      let m = 0;
      for (let i = 0; i < N - 1; i++) {
        const x0 = X(i - 1), y0 = Y(i - 1), x1 = X(i), y1 = Y(i), x2 = X(i + 1), y2 = Y(i + 1), x3 = X(i + 2), y3 = Y(i + 2);
        for (let k = 0; k < SUB; k++) {
          const t = k / SUB, t2 = t * t, t3 = t2 * t;
          PX[m] = 0.5 * (2 * x1 + (-x0 + x2) * t + (2 * x0 - 5 * x1 + 4 * x2 - x3) * t2 + (-x0 + 3 * x1 - 3 * x2 + x3) * t3);
          PY[m] = 0.5 * (2 * y1 + (-y0 + y2) * t + (2 * y0 - 5 * y1 + 4 * y2 - y3) * t2 + (-y0 + 3 * y1 - 3 * y2 + y3) * t3);
          m++;
        }
      }
      PX[m] = X(N - 1); PY[m] = Y(N - 1);
      let acc = 0;
      for (let i = 0; i < MP; i++) {
        if (i > 0) acc += Math.hypot(PX[i] - PX[i - 1], PY[i] - PY[i - 1]);
        LS[i] = acc;
        const a = Math.max(0, i - 1), b = Math.min(MP - 1, i + 1);
        const dx = PX[b] - PX[a], dy = PY[b] - PY[a], dl = Math.hypot(dx, dy) || 1;
        NX[i] = -dy / dl; NY[i] = dx / dl;
      }
      return acc;
    };

    const bundle = (s: Strand, alpha: number, time: number, total: number) => {
      const st = s.stretch;
      const tight = Math.min(1, (st - 1) * 2.2);
      const flying = s.state === "flying";
      const freeEnd = s.state === "dangling" || s.state === "falling";
      const spread = (flying ? 1.2 : 1.6 + 2.6 * (1 - tight)) / Math.sqrt(st);
      const thin = 1 / Math.sqrt(st);
      const env = (u: number) => {
        let e = Math.pow(Math.sin(Math.PI * Math.min(u, freeEnd || flying ? 0.5 : u)), 0.6);
        if (!flying) e += 1.6 * Math.exp(-u * 14);
        if (freeEnd) e *= 1 + s.fray * Math.pow(u, 4) * 2.8;
        for (const k of s.knots) e *= 1 - 0.75 * Math.exp(-Math.pow((u - k) / 0.03, 2));
        return e;
      };
      for (let i = 0; i < MP; i += 2) {
        const n = i >> 1;
        rx[n] = PX[i] + 5; ry[n] = PY[i] + 12; rw[n] = 4.5 * thin + 2; rl[n] = 0; ra[n] = 0.13 * alpha; rg[n] = 0;
      }
      ribbon(Math.ceil(MP / 2), 0, 1);
      for (let q = 0; q < s.fib.length; q++) {
        const f = s.fib[q];
        const sag = f.loose ? (5 + 9 * (1 - tight)) : 0;
        for (let i = 0; i < MP; i++) {
          const u = i / (MP - 1);
          const l = LS[i];
          const e = env(u);
          const th = f.phase + l * 0.16 + time * 0.8 * f.speed;
          const o = e * spread * ((f.loose ? 1.7 : 1) * f.off * 0.85 + 0.55 * Math.cos(th));
          rx[i] = PX[i] + NX[i] * o;
          ry[i] = PY[i] + NY[i] * o + e * sag * Math.sin(Math.PI * u);
          const psi = f.phase * 2.3 + l * (0.09 + 0.05 * f.speed) + time * 0.6;
          rw[i] = (0.55 + 1.15 * f.w) * thin * (0.3 + 0.7 * Math.abs(Math.cos(psi))) * (flying ? 1 + 0.6 * (1 - u) : 1);
          rl[i] = Math.min(1, 0.1 + 0.9 * (0.5 + 0.5 * Math.sin(th)) * Math.abs(Math.cos(psi - 0.7)));
          ra[i] = (0.55 + 0.45 * f.a) * alpha * (f.loose ? 0.7 : 1);
          rg[i] = l;
        }
        ribbon(MP, s.seed * 0.137 + q * 0.071);
      }
      for (let k = 0; k < 26; k++) {
        const hs = hash(s.seed * 13 + k * 7.1);
        const i = Math.min(MP - 2, Math.max(2, Math.round((0.05 + 0.9 * hs) * (MP - 1))));
        const side = hash(k * 3.3 + s.seed) < 0.5 ? -1 : 1;
        const back = hash(k * 5.1 + s.seed) < 0.7 ? -1 : 1;
        const len = (2 + 4.5 * hash(k * 9.7 + s.seed)) * thin;
        const tx = -NY[i] * back, ty = NX[i] * back;
        const bx = PX[i] + NX[i] * side * spread * env(i / (MP - 1)) * 0.8, by = PY[i] + NY[i] * side * spread * env(i / (MP - 1)) * 0.8;
        const ex = bx + (tx * 0.8 + NX[i] * side * 0.6) * len, ey = by + (ty * 0.8 + NY[i] * side * 0.6) * len;
        rx[0] = bx; ry[0] = by; rx[1] = (bx + ex) / 2 + NX[i] * side * 0.4; ry[1] = (by + ey) / 2 + NY[i] * side * 0.4; rx[2] = ex; ry[2] = ey;
        rw[0] = 0.6; rw[1] = 0.45; rw[2] = 0.3; rl[0] = rl[1] = rl[2] = 0.3 + 0.6 * hash(k + s.seed);
        ra[0] = ra[1] = ra[2] = 0.5 * alpha; rg[0] = 0; rg[1] = 1; rg[2] = 2;
        ribbon(3, 0.5 + k * 0.01);
      }
      for (let k = 0; k < 18; k++) {
        const i = Math.min(MP - 1, Math.round(hash(s.seed * 7 + k * 1.3) * (MP - 1)));
        const tw = Math.pow(Math.max(0, Math.sin(time * (1.5 + hash(k * 2.7) * 3) + k * 1.9 + s.seed)), 6);
        const side = hash(k * 4.4 + s.seed) * 2 - 1;
        point(PX[i] + NX[i] * side * spread, PY[i] + NY[i] * side * spread, 2 + 4 * tw, (0.15 + 0.85 * tw) * alpha);
      }
      if (!flying) {
        for (const k of s.knots) {
          const i = Math.min(MP - 2, Math.round(k * (MP - 1)));
          const ang = Math.atan2(PY[i + 1] - PY[i], PX[i + 1] - PX[i]);
          const r = (1.4 + 0.5 * Math.sin(k * 40 + s.seed)) / Math.pow(st, 0.3);
          blob(PX[i], PY[i], r * 1.3, s.seed + k * 10, 0.75 * alpha, 1 / Math.min(2.4, Math.sqrt(st)), ang);
          point(PX[i] - 0.4, PY[i] - 0.5, 2.6, 0.6 * alpha);
        }
      }
      return total;
    };

    const SP = 9;
    const splat = (s: Strand, A: { x: number; y: number }, alpha: number, time: number, pull: { x: number; y: number }) => {
      const since = s.age - s.hitAge;
      const grow = 1 - Math.pow(1 - Math.min(1, since / 0.16), 3);
      const net = Math.max(0, Math.min(1, (since - 0.07) / 0.22));
      const c = Math.cos(pose.rot), sn = Math.sin(pose.rot);
      const W = (lx: number, ly: number) => ({ x: B.cx + pose.x + lx * c - ly * sn, y: B.cy + pose.y + lx * sn + ly * c });
      const R0 = B.h / 2, A0 = Math.max(0, B.w / 2 - R0);
      const conform = (lx: number, ly: number) => {
        const qx = Math.max(-A0, Math.min(A0, lx));
        const vx = lx - qx, vy = ly;
        const d = Math.hypot(vx, vy) || 1;
        const sd = d - R0;
        if (sd <= 0) return { x: lx, y: ly, a: 1 };
        const keep = Math.min(sd, 2.5);
        return { x: qx + (vx / d) * (R0 + keep), y: (vy / d) * (R0 + keep), a: Math.exp(-sd / 5) };
      };
      const cxL = s.ax + pull.x, cyL = s.ay + pull.y;
      const tips: { x: number; y: number; a: number }[][] = [];
      for (let q = 0; q < s.splat.length; q++) {
        const f = s.splat[q];
        const fwd = Math.cos(f.ang - Math.atan2(s.dIn[1], s.dIn[0]));
        const L = f.len * 1.35 * (1 + 0.45 * fwd) * grow * (0.9 + 0.2 * Math.sin(since * 30 + q) * Math.exp(-since * 8));
        const ptsL: { x: number; y: number; a: number }[] = [];
        let n = 0;
        for (let j = 0; j < SP; j++) {
          const v = j / (SP - 1);
          const a = f.ang + f.curve * v * 1.2;
          const bx = s.ax + Math.cos(a) * L * v, by = s.ay + Math.sin(a) * L * v;
          const pullW = Math.pow(1 - v, 2);
          const p = conform(bx + (cxL - s.ax) * pullW, by + (cyL - s.ay) * pullW);
          const wp = W(p.x, p.y);
          ptsL.push(p);
          rx[n] = wp.x; ry[n] = wp.y;
          rw[n] = (f.w * 2.2 + 0.9) * (1 - v * 0.62);
          rl[n] = 0.35 + 0.6 * Math.abs(Math.sin(v * 6 + q * 1.3));
          ra[n] = alpha * p.a * (0.78 + 0.22 * (1 - v)) * (0.75 + 0.25 * f.a);
          rg[n] = v * 20 + q * 3;
          n++;
        }
        tips.push(ptsL);
        for (let j = 0; j < n; j++) { rx[j] += 0.8; ry[j] += 1.3; }
        const keepA = Array.from(ra.subarray(0, n));
        for (let j = 0; j < n; j++) ra[j] = keepA[j] * 0.35;
        ribbon(n, 0, 1);
        for (let j = 0; j < n; j++) { rx[j] -= 0.8; ry[j] -= 1.3; ra[j] = keepA[j]; }
        ribbon(n, 0.31 + q * 0.05);
        for (let j = 0; j < n; j++) {
          const v = j / (SP - 1);
          rx[j] += -Math.sin(f.ang) * 0.9 * v; ry[j] += Math.cos(f.ang) * 0.9 * v;
          rw[j] *= 0.55; ra[j] *= 0.8;
        }
        ribbon(n, 0.61 + q * 0.05);
        if (f.branch && grow > 0.5) {
          const p0 = ptsL[4];
          const ba = f.ang + f.branch;
          const bl = L * 0.38;
          const pe = conform(p0.x + Math.cos(ba) * bl, p0.y + Math.sin(ba) * bl);
          const w0 = W(p0.x, p0.y), w1 = W((p0.x + pe.x) / 2, (p0.y + pe.y) / 2), w2 = W(pe.x, pe.y);
          rx[0] = w0.x; ry[0] = w0.y; rx[1] = w1.x; ry[1] = w1.y; rx[2] = w2.x; ry[2] = w2.y;
          rw[0] = 0.8; rw[1] = 0.6; rw[2] = 0.35; rl[0] = rl[1] = rl[2] = 0.6; ra[0] = ra[1] = ra[2] = f.a * alpha * 0.8 * pe.a; rg[0] = 0; rg[1] = 3; rg[2] = 6;
          ribbon(3, 0.9 + q * 0.03);
        }
      }
      if (net > 0) {
        for (const ring of [0.32, 0.6, 0.85]) {
          const jr = Math.round(ring * (SP - 1));
          for (let q = 0; q < s.splat.length; q++) {
            const q2 = (q + 1) % s.splat.length;
            let gap = s.splat[q2].ang - s.splat[q].ang;
            if (gap < 0) gap += Math.PI * 2;
            if (gap > 1.25) continue;
            const p0 = tips[q][jr], p1 = tips[q2][jr];
            let n = 0;
            for (let j = 0; j <= 6; j++) {
              const v = j / 6;
              const sag = Math.sin(Math.PI * v) * 0.22;
              const lx = p0.x + (p1.x - p0.x) * v, ly = p0.y + (p1.y - p0.y) * v;
              const wp = W(lx + (cxL - lx) * sag, ly + (cyL - ly) * sag);
              rx[n] = wp.x; ry[n] = wp.y; rw[n] = 0.95; rl[n] = 0.55 + 0.4 * Math.sin(v * 3 + q);
              ra[n] = 0.85 * alpha * net * Math.min(p0.a, p1.a) * (ring > 0.8 ? 0.6 : 1); rg[n] = v * 8; n++;
            }
            ribbon(n, 0.77 + q * 0.02);
          }
        }
      }
      const cW = W(cxL, cyL);
      const pullAng = Math.atan2(pull.y, pull.x) + pose.rot;
      const pl = Math.hypot(pull.x, pull.y);
      blob(cW.x, cW.y, (12 + 2 * Math.sin(s.seed)) * grow, s.seed + 5, 0.4 * alpha, 1 / (1 + pl * 0.06), pullAng);
      blob(cW.x, cW.y, (6.5 + 1.2 * Math.sin(s.seed * 2)) * grow * (1 + 0.25 * pose.hit), s.seed, 0.9 * alpha, 1 / (1 + pl * 0.08), pullAng);
      point(cW.x - 1.2, cW.y - 1.4, 3.5 + 1.5 * Math.sin(time * 2 + s.seed), 0.75 * alpha);
      if (since < 0.14) point(cW.x, cW.y, 26 * (1 - since / 0.14), 0.7 * (1 - since / 0.14) * alpha);
      return cW;
    };

    let raf = 0;
    let visible = true;
    let prev = performance.now();
    const frame = (now: number) => {
      raf = visible ? requestAnimationFrame(frame) : 0;
      if (!visible) return;
      const dt = Math.max(1 / 240, Math.min(0.033, (now - prev) / 1000));
      prev = now;
      if (!w || !h) return;

      const curTarget = targetRef.current;
      const hx = ptr.x, hy = ptr.y;
      const show = ptr.inside;
      stage.style.cursor = show ? "none" : "";

      let pullX = 0, pullY = 0, torque = 0;
      for (const s of strands) {
        s.t += dt;
        s.age += dt;
        const A = toWorld(s.ax, s.ay);
        let pinEnd = false;
        let ex = 0, ey = 0;
        if (s.state === "flying") {
          const f = Math.min(1, s.t / 0.13);
          const sx = held === s ? hx : s.sx, sy = held === s ? hy : s.sy;
          const headX = sx + (A.x - sx) * f, headY = sy + (A.y - sy) * f;
          const nx = -(A.y - sy), ny = A.x - sx, nl = Math.hypot(nx, ny) || 1;
          for (let i = 0; i < N; i++) {
            const u = i / (N - 1);
            const wob = Math.sin(u * Math.PI) * Math.sin(s.t * 60 + u * 9) * 6 * (1 - f);
            s.x[i] = s.px[i] = headX + (sx - headX) * u + (nx / nl) * wob;
            s.y[i] = s.py[i] = headY + (sy - headY) * u + (ny / nl) * wob;
          }
          if (f >= 1) {
            s.state = held === s ? "held" : "dangling";
            s.t = 0;
            s.hitAge = s.age;
            {
              const ddx = A.x - sx, ddy = A.y - sy, ddl = Math.hypot(ddx, ddy) || 1;
              const c = Math.cos(-pose.rot), sn = Math.sin(-pose.rot);
              s.dIn = [((ddx / ddl) * c - (ddy / ddl) * sn), ((ddx / ddl) * sn + (ddy / ddl) * c)];
            }
            pose.hit = 1;
            sfx(SFX.splat(Math.min(1, 0.55 + Math.hypot(A.x - sx, A.y - sy) / 600)), 0.85, false);
            const dx = A.x - sx, dy = A.y - sy, dl = Math.hypot(dx, dy) || 1;
            pose.vx += (dx / dl) * 140; pose.vy += (dy / dl) * 140;
            for (let k = 0; k < 9; k++) {
              const a = Math.atan2(-dy, -dx) + (Math.random() - 0.5) * 2.4, sp = 80 + Math.random() * 220;
              splash.push({ x: A.x, y: A.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 1 + Math.random() * 2.2, age: 0, seed: Math.random() * 10 });
            }
            const restLen = Math.hypot(A.x - sx, A.y - sy);
            s.rest = (restLen * 1.02) / (N - 1);
            for (let i = 0; i < N; i++) {
              const u = i / (N - 1);
              s.x[i] = s.px[i] = A.x + (sx - A.x) * u;
              s.y[i] = s.py[i] = A.y + (sy - A.y) * u;
            }
          }
          continue;
        }
        if (s.state === "dangling" && !held && show && s.t > 0.4) {
          if (Math.hypot(s.x[N - 1] - hx, s.y[N - 1] - hy) < 16) {
            held = s; s.state = "held"; s.t = 0;
            s.rest = Math.max(s.rest, Math.hypot(hx - A.x, hy - A.y) / (N - 1));
            s.creaks = 0;
            sfx(SFX.stick(), 0.8, false);
          }
        }
        if (s.state === "held") {
          pinEnd = true; ex = hx; ey = hy;
          const dist = Math.hypot(ex - A.x, ey - A.y);
          s.stretch = Math.max(1, dist / (s.rest * (N - 1)));
          if (s.stretch > snapAt) {
            s.state = "dangling"; s.t = 0;
            s.rest *= 0.42;
            s.fray = 1;
            if (held === s) held = null;
            pinEnd = false;
            sfx(SFX.snap(), 0.8, false);
          } else {
            const step = Math.floor((s.stretch - 1.15) / 0.28) + 1;
            if (step > s.creaks && step > 0) sfx(SFX.creak(s.stretch), 0.8, false);
            if (step !== s.creaks) s.creaks = Math.max(0, step);
            const k = Math.min(70, (s.stretch - 1) * 60);
            const dx = (ex - A.x) / (dist || 1), dy = (ey - A.y) / (dist || 1);
            pullX += dx * k; pullY += dy * k;
            torque += (s.ax * dy - s.ay * dx) * k * 0.00035;
          }
        } else s.stretch += (1 - s.stretch) * Math.min(1, dt * 6);
        if (s.state === "falling") s.alpha -= dt * 0.9;
        else if (s.state === "dangling" && s.age > 9) s.state = "falling";

        const grav = s.state === "held" ? 160 : 700;
        const damp = s.state === "held" ? 0.96 : 0.985;
        for (let i = 0; i < N; i++) {
          const vx = (s.x[i] - s.px[i]) * damp, vy = (s.y[i] - s.py[i]) * damp;
          s.px[i] = s.x[i]; s.py[i] = s.y[i];
          s.x[i] += vx; s.y[i] += vy + grav * dt * dt;
        }
        const pinStart = s.state !== "falling";
        if (pinStart) { s.x[0] = s.px[0] = A.x; s.y[0] = s.py[0] = A.y; }
        if (pinEnd) { s.x[N - 1] = ex; s.y[N - 1] = ey; }
        const link = pinEnd ? Math.max(s.rest, Math.hypot(ex - A.x, ey - A.y) / (N - 1) * 0.995) : s.rest;
        for (let it = 0; it < 14; it++) {
          for (let i = 0; i < N - 1; i++) {
            const dx = s.x[i + 1] - s.x[i], dy = s.y[i + 1] - s.y[i];
            const d = Math.hypot(dx, dy) || 0.0001;
            const diff = (d - link) / d;
            const a = i === 0 && pinStart ? 0 : 0.5;
            const b = i + 1 === N - 1 && pinEnd ? 0 : 0.5;
            const m = a + b || 1;
            s.x[i] += dx * diff * (a / m); s.y[i] += dy * diff * (a / m);
            s.x[i + 1] -= dx * diff * (b / m); s.y[i + 1] -= dy * diff * (b / m);
          }
        }
        if (!Number.isFinite(s.x[N - 1])) { s.x.fill(A.x); s.y.fill(A.y); s.px.fill(A.x); s.py.fill(A.y); }
      }
      strands = strands.filter((s) => s.alpha > 0 && s.y[0] < h + 300);

      const pl = Math.hypot(pullX, pullY);
      if (pl > 90) { pullX *= 90 / pl; pullY *= 90 / pl; }
      pose.vx += ((pullX - pose.x) * 130 - pose.vx * 11) * dt;
      pose.vy += ((pullY - pose.y) * 130 - pose.vy * 11) * dt;
      pose.x += pose.vx * dt; pose.y += pose.vy * dt;
      const rt = Math.max(-0.35, Math.min(0.35, torque + pose.x * 0.0025));
      pose.vr += ((rt - pose.rot) * 110 - pose.vr * 10) * dt;
      pose.rot += pose.vr * dt;
      pose.hit = Math.max(0, pose.hit - dt * 5);

      if (curTarget) {
        curTarget.style.transform = `translate(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px) rotate(${pose.rot.toFixed(4)}rad) scale(${(1 - pose.hit * 0.04).toFixed(4)})`;
      }

      if (!gl || !rProg) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const time = now / 1000;
      for (const s of strands) {
        const alpha = Math.max(0, Math.min(1, s.alpha));
        const A = toWorld(s.ax, s.ay);
        const st = s.stretch;
        if (s.fray > 0) s.fray = Math.max(0.35, s.fray - dt * 0.4);
        let start: { x: number; y: number } | undefined;
        if (s.state !== "flying" && s.state !== "falling") {
          let pull = { x: 0, y: 0 };
          if (st > 1.02) {
            const dx = s.x[3] - A.x, dy = s.y[3] - A.y, dl = Math.hypot(dx, dy) || 1;
            const m = Math.min(7, (st - 1) * 9);
            const c = Math.cos(-pose.rot), sn = Math.sin(-pose.rot);
            pull = { x: ((dx / dl) * c - (dy / dl) * sn) * m, y: ((dx / dl) * sn + (dy / dl) * c) * m };
          }
          start = splat(s, A, alpha, time, pull);
          if (st > 1.04) {
            const j = Math.min(N - 1, 2 + Math.round(st * 1.5));
            const c = Math.cos(pose.rot), sn = Math.sin(pose.rot);
            const peel = Math.min(1, (st - 1) * 3);
            for (const [fx, fy] of s.fibers) {
              const gx = A.x + fx * c - fy * sn, gy = A.y + fx * sn + fy * c;
              rx[0] = gx; ry[0] = gy; rx[1] = (gx + s.x[j]) / 2; ry[1] = (gy + s.y[j]) / 2 + 1.5; rx[2] = s.x[j]; ry[2] = s.y[j];
              rw[0] = 0.9; rw[1] = 0.7; rw[2] = 0.6; rl[0] = rl[1] = rl[2] = 0.7; ra[0] = ra[1] = ra[2] = 0.7 * peel * alpha; rg[0] = 0; rg[1] = 4; rg[2] = 8;
              ribbon(3, 0.44);
              blob(gx, gy, 1.4, fx * 3 + fy, peel * alpha * 0.8);
            }
          }
        }
        const total = smoothPath(s, start?.x, start?.y);
        bundle(s, alpha, time, total);
        if (s.state === "flying") {
          blob(s.x[0], s.y[0], 2.6, s.seed, 0.9 * alpha);
          point(s.x[0], s.y[0], 7, 0.8 * alpha);
        }
      }
      for (const d of splash) {
        d.age += dt;
        d.vy += 700 * dt;
        d.vx *= Math.exp(-dt * 2.5);
        d.x += d.vx * dt; d.y += d.vy * dt;
        const a = Math.max(0, 1 - d.age / 0.7);
        if (a <= 0) continue;
        const ang = d.seed + d.age * 6;
        const L = 3 + d.r * 2.5;
        rx[0] = d.x - (Math.cos(ang) * L) / 2; ry[0] = d.y - (Math.sin(ang) * L) / 2;
        rx[1] = d.x + Math.sin(ang) * 1.2; ry[1] = d.y - Math.cos(ang) * 1.2;
        rx[2] = d.x + (Math.cos(ang) * L) / 2; ry[2] = d.y + (Math.sin(ang) * L) / 2;
        rw[0] = 0.5; rw[1] = 0.9; rw[2] = 0.4; rl[0] = rl[1] = rl[2] = 0.7; ra[0] = ra[1] = ra[2] = 0.8 * a; rg[0] = 0; rg[1] = 2; rg[2] = 4;
        ribbon(3, d.seed);
      }
      splash = splash.filter((d) => d.age < 0.7);
      flush();

      const rt2 = reticleRef.current;
      if (rt2) {
        rt2.style.opacity = show ? "1" : "0";
        if (show) rt2.style.transform = `translate(${hx.toFixed(1)}px, ${hy.toFixed(1)}px) scale(${held ? 0.75 : 1})`;
      }
    };
    raf = requestAnimationFrame(frame);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(stage);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", fit);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (targetRef.current) targetRef.current.style.transform = "";
      stage.style.cursor = "";
    };
  }, [snapAt, sectionRef, targetRef]);

  return (
    <>
      {/* Full Hero WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        aria-hidden="true"
      />

      {/* Hero Web Shooter Reticle */}
      <div
        ref={reticleRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-30"
        style={{ opacity: 0, transition: "opacity .15s" }}
      >
        <svg
          width="40"
          height="40"
          viewBox="-20 -20 40 40"
          style={{ position: "absolute", left: -20, top: -20, overflow: "visible" }}
        >
          <circle r="10" fill="none" stroke="rgba(182,255,92,0.9)" strokeWidth="2.2" />
          <circle r="10" fill="none" stroke="#08090D" strokeWidth="1" />
          {[45, 135, 225, 315].map((d) => (
            <line
              key={d}
              x1={Math.cos((d * Math.PI) / 180) * 12}
              y1={Math.sin((d * Math.PI) / 180) * 12}
              x2={Math.cos((d * Math.PI) / 180) * 17}
              y2={Math.sin((d * Math.PI) / 180) * 17}
              stroke="#B6FF5C"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
          <circle r="1.8" fill="#B6FF5C" />
        </svg>
      </div>
    </>
  );
}
