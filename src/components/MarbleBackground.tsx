import { useEffect, useRef } from "react";
import { getLevel } from "../audio/engine";

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0., 1.); }
`;

// Liquid marble — blue/chrome ink swirls on paper-white, flowing ribbons
const FRAG = `
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
  for(int i=0;i<6;i++){ v += a*noise(p); p = r*p; a *= .5; }
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
    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
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

    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      smx += (mx - smx) * 0.05;
      smy += (my - smy) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform2f(uMouse, smx, smy);
      gl.uniform1f(uLevel, getLevel());
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };
    loop();

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
