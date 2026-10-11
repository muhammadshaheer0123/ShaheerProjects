// Topographic contour field for the Method section. Each method step morphs the same terrain:
// survey grid → dense ground model → foundation footprint → excavation → live sensor pulses.
import * as THREE from 'three';

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}`;

const vertexShader = /* glsl */ `
uniform float uTime, uAmp, uDig, uPtrAmt;
uniform vec2 uPointer;
varying float vH; varying vec2 vUv; varying vec2 vP; varying float vPtr;
${NOISE}
float fbm(vec2 p){ float s=0.0, a=0.5; for(int i=0;i<4;i++){ s+=a*snoise(p); p=p*2.02+vec2(1.7,9.2); a*=0.5; } return s; }
float rectMask(vec2 p){ return (1.0-smoothstep(30.0,36.0,abs(p.x)))*(1.0-smoothstep(16.0,22.0,abs(p.y))); }
void main(){
  vec3 pos = position;
  vec2 q = pos.xy*0.011 + vec2(uTime*0.012, -uTime*0.008);
  float h = fbm(q)*uAmp + pos.y*0.05;
  h = mix(h, -12.0 + h*0.08, uDig*rectMask(pos.xy));
  float d = distance(pos.xy, uPointer);
  float b = exp(-(d*d)/(2.0*16.0*16.0))*uPtrAmt;
  h += b*7.0;
  pos.z = h;
  vH = h; vUv = uv; vP = pos.xy; vPtr = b;
  gl_Position = projectionMatrix*modelViewMatrix*vec4(pos,1.0);
}`;

const fragmentShader = /* glsl */ `
uniform float uTime, uDensity, uDots, uScanAmt, uScan, uFoot, uPulse;
uniform vec3 uInk, uAccent;
varying float vH; varying vec2 vUv; varying vec2 vP; varying float vPtr;
float iso(float v, float wMul){ float f=fract(v); float d=min(f,1.0-f); float w=fwidth(v)*wMul; return 1.0-smoothstep(w*0.5, w*1.5, d); }
void main(){
  float c = (vH + 40.0) * uDensity;
  float minor = iso(c, 1.0);
  float major = iso(c/5.0, 1.7);
  float edge = smoothstep(0.0,0.16,vUv.x)*smoothstep(1.0,0.84,vUv.x)*smoothstep(0.0,0.22,vUv.y)*smoothstep(1.0,0.8,vUv.y);
  float a = minor*0.2 + major*0.42;

  vec2 g = vP/8.0; float dw = fwidth(g.x);
  float dots = (1.0-smoothstep(dw*0.8, dw*1.9, length(fract(g)-0.5))) * uDots;
  a = max(a, dots*0.75);

  float band = exp(-pow((vUv.y - uScan)*16.0, 2.0)) * uScanAmt;

  vec2 rp = abs(vP) - vec2(33.0, 19.0); float rd = max(rp.x, rp.y); float rw = fwidth(rd);
  float outline = (1.0-smoothstep(rw*0.6, rw*2.0, abs(rd))) * uFoot;

  float pulse = 0.0; float sdot = 0.0;
  vec2 S0 = vec2(-20.0, 8.0); vec2 S1 = vec2(2.0, -9.0); vec2 S2 = vec2(22.0, 6.0);
  for (int i = 0; i < 3; i++) {
    vec2 s = i == 0 ? S0 : (i == 1 ? S1 : S2);
    float r = length(vP - s);
    pulse += iso(r*0.12 - uTime*0.5, 1.3) * exp(-r*0.05);
    sdot += 1.0 - smoothstep(1.0, 1.7, r);
  }
  pulse *= uPulse; sdot *= uPulse;

  float accMix = clamp(band + vPtr*1.6 + outline + pulse + sdot, 0.0, 1.0);
  float accA = clamp(band*(minor+major+dots) + vPtr*(minor+major)*1.4 + outline + pulse*0.9 + sdot, 0.0, 1.0);
  vec3 col = mix(uInk, uAccent, accMix);
  a = max(a, accA) * edge;
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`;

export const MODES = [
  { uAmp: 16, uDensity: 0.38, uDots: 1, uScanAmt: 1, uFoot: 0, uDig: 0, uPulse: 0 },
  { uAmp: 18, uDensity: 0.95, uDots: 0.12, uScanAmt: 0.25, uFoot: 0, uDig: 0, uPulse: 0 },
  { uAmp: 16, uDensity: 0.5, uDots: 0, uScanAmt: 0, uFoot: 1, uDig: 0, uPulse: 0 },
  { uAmp: 14, uDensity: 0.5, uDots: 0, uScanAmt: 0, uFoot: 1, uDig: 1, uPulse: 0 },
  { uAmp: 14, uDensity: 0.42, uDots: 0, uScanAmt: 0, uFoot: 0.55, uDig: 1, uPulse: 1 },
];

export function createTerrain(canvas, { reduced = false, gsap = null } = {}) {
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 1, 1000);

  const uniforms = {
    uTime: { value: 0 }, uScan: { value: 0 },
    uPointer: { value: new THREE.Vector2(999, 999) }, uPtrAmt: { value: 0 },
    uInk: { value: new THREE.Color(0xecebe5) }, uAccent: { value: new THREE.Color(0xff5a1f) },
  };
  for (const [k, v] of Object.entries(MODES[0])) uniforms[k] = { value: v };

  const seg = small ? [100, 72] : [160, 116];
  const geo = new THREE.PlaneGeometry(220, 160, seg[0], seg[1]);
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  // pointer → plane-local coordinates (local y = −world z)
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  let ptrTarget = 0;
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) { uniforms.uPointer.value.set(hit.x, -hit.z); ptrTarget = 1; }
  });
  canvas.addEventListener('pointerleave', () => { ptrTarget = 0; });

  let running = false, raf = 0, time = 0, acc = 0;
  const clock = new THREE.Clock();

  function render() { renderer.render(scene, camera); }
  function tick() {
    raf = requestAnimationFrame(tick);
    acc += clock.getDelta();
    if (acc < 1 / 32) return;
    const dt = Math.min(acc, 0.08);
    acc = 0;
    time += dt;
    uniforms.uTime.value = time;
    uniforms.uScan.value = ((time * 0.11) % 1.35) - 0.15;
    uniforms.uPtrAmt.value += (ptrTarget - uniforms.uPtrAmt.value) * (1 - Math.exp(-dt * 4));
    render();
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    const k = aspect < 1 ? 1.25 / Math.max(aspect, 0.55) : aspect < 1.3 ? 1.08 : 1;
    camera.position.set(0, 112 * k, 128 * k);
    camera.lookAt(0, -6, 6);
    camera.updateProjectionMatrix();
    if (!running) render();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  return {
    setMode(i) {
      const m = MODES[i];
      if (!m) return;
      for (const [k, v] of Object.entries(m)) {
        if (gsap && !reduced) gsap.to(uniforms[k], { value: v, duration: 1.4, ease: 'power3.inOut', overwrite: true, onUpdate: running ? null : render });
        else uniforms[k].value = v;
      }
      if (reduced || !running) render();
    },
    start() {
      if (reduced) { uniforms.uScan.value = 0.5; render(); return; }
      if (running) return;
      running = true; clock.getDelta(); raf = requestAnimationFrame(tick);
    },
    stop() { running = false; cancelAnimationFrame(raf); },
  };
}
