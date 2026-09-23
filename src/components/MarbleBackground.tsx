import { useEffect, useRef } from "react";
import { getLevel } from "../audio/engine";

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0., 1.); }
`;

// Liquid marble — blue/chrome ink swirls on paper-white, flowing ribbons.
// The fbm octave count is injected at compile time: weak GPUs get fewer
// octaves (the top octaves contribute <2% amplitude — visually identical).
const FRAG = (oct: number) => `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_level;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0., a = .5;
  mat2 r = mat2(1.6, 1.2, -1.2, 1.6);
  for(int i=0;i<${oct};i++){ v += a*noise(p); p = r*p; a *= .5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 asp = vec2(u_res.x/u_res.y, 1.);
  vec2 p = (uv - .5) * asp * 2.6;

  float t = u_time * 0.08;
  vec2 m = (u_mouse - .5) * 2.;
  p += m * 0.25;

  // domain warping = liquid marble
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 2.4*q + vec2(1.7, 9.2) + .15*t),
                fbm(p + 2.4*q + vec2(8.3, 2.8) - .12*t));
  float f = fbm(p + 3.5*r);

  // paper base
  vec3 col = vec3(0.956, 0.972, 0.977);

  // ribbon field: thin bright contours of |sin| of warped coordinate
  float ribbon = abs(sin((p.y + r.x*3.0 + f*4.0 + t*0.6) * 6.2831));
  ribbon = smoothstep(0.12, 0.0, ribbon);

  // deep blue ink veins
  float veins = smoothstep(.45, .9, f);
  vec3 inkA = mix(vec3(0.55, 0.85, 0.93), vec3(0.025, 0.45, 0.75), veins);
  col = mix(col, inkA, veins * 0.85);

  // chrome/ice highlights along ribbons
  col = mix(col, vec3(0.75, 0.94, 1.0), ribbon * (0.55 + u_level*0.35));

  // audio-reactive bloom: bass pushes ink outward from center
  float d = length(uv - .5);
  float pulse = u_level * smoothstep(.7, .0, d);
  col = mix(col, vec3(0.02, 0.55, 0.78), pulse * 0.5);

  // sparse graph dots (like reference grid)
  float dotMask = smoothstep(0.05, 0.0, length(fract(uv*asp*34.)-.5));
  col = mix(col, vec3(0.1, 0.15, 0.2), dotMask * 0.25 * (1.0 - veins));

  // vignette
  col *= 1.0 - 0.18 * pow(length(uv - .5) * 1.4, 2.);

  // subtle grain
  col += (hash(uv*u_time) - .5) * 0.015;

  gl_FragColor = vec4(col, 1.);
}
`;

export default function MarbleBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    // coarse pointers / small screens get the cheap path
    const weak =
      window.matchMedia("(pointer: coarse)").matches ||
      Math.min(window.innerWidth, window.innerHeight) < 768;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG(weak ? 4 : 6));
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uLevel = gl.getUniformLocation(prog, "u_level");

    // Quality tiers. The marble is soft, so rendering into a smaller
    // backing store and letting CSS upscale it looks identical while
    // costing a fraction of the fill-rate. If frames keep arriving late
    // we step down a tier — never back up, to avoid oscillation.
    const TIERS = weak
      ? [
          { scale: 0.5, fps: 30 },
          { scale: 0.4, fps: 24 },
          { scale: 0.33, fps: 20 },
        ]
      : [
          { scale: 0.75, fps: 60 },
          { scale: 0.6, fps: 30 },
          { scale: 0.45, fps: 24 },
        ];
    let tier = 0;

    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const s = TIERS[tier].scale;
      canvas.width = Math.max(1, Math.round(window.innerWidth * s));
      canvas.height = Math.max(1, Math.round(window.innerHeight * s));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    const draw = (now: number) => {
      smx += (mx - smx) * 0.05;
      smy += (my - smy) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform2f(uMouse, smx, smy);
      gl.uniform1f(uLevel, getLevel());
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduced) {
      // reduced motion: paint one static marble frame, no loop at all
      const still = () => draw(t0 + 8000);
      still();
      window.addEventListener("resize", still);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
        window.removeEventListener("resize", still);
      };
    }

    let raf = 0;
    let last = 0;
    let slow = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const interval = 1000 / TIERS[tier].fps;
      if (now - last < interval - 1) return; // fps cap
      const dt = now - last;
      last = now;
      // sustained late frames → drop a quality tier
      if (tier < TIERS.length - 1) {
        if (dt > interval * 1.4) {
          if (++slow > 45) {
            tier++;
            slow = 0;
            resize();
          }
        } else {
          slow = Math.max(0, slow - 2);
        }
      }
      draw(now);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden
    />
  );
}
