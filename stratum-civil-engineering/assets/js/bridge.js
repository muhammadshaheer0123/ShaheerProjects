// Procedural cable-stayed bridge with a steel Warren-truss deck, sitting on a geological section.
// Assembled by scroll progress (0 → 1). 1 scene unit ≈ 4.12 m, so the 100-unit main span reads as 412 m.
// Performance: renders on demand (only when progress, pointer or ambient traffic changes),
// shadows are baked only when the structure changes, and all "ghost" linework is one draw call.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const sub = (p, a, b) => clamp01((p - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const heat = (p, a, b) => { const t = sub(p, a, b); return t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI); };
const EPS = 1e-4;

export const UNIT = 4.12;
/** Ground surface profile: banks at +4, river bed at −9. */
export const surf = (x) => -9 + 13 * THREE.MathUtils.smoothstep(Math.abs(x), 62, 98);

const ACCENT = new THREE.Color(0xff5a1f);
const PYLONS = [-50, 50];
const LEG_Z = 8.2;
const LEG_TOP = 38;
const DECK_Y = 10;          // top-chord centreline of the steel truss
const DECK_TOP = 10.7;      // running surface
const BEARING = 8.15;       // underside of bottom chord — piers and cross-beams stop here
const SEG_L = 5.92;
const TRUSS_D = 1.6;        // top chord → bottom chord

export const PHASE_AT = [0.11, 0.33, 0.535, 0.765];

// Camera keyframes: the camera settles at each phase so the copy can be read.
const KEYS = [
  { p: 0.0, pos: [-230, 120, 300], tgt: [6, -4, 0] },
  { p: 0.07, pos: [-218, 108, 286], tgt: [6, -4, 0] },
  { p: 0.22, pos: [-124, 7, 98], tgt: [-48, -14, 0] },
  { p: 0.44, pos: [-4, 26, 124], tgt: [-50, 16, 0] },
  { p: 0.66, pos: [104, 70, 166], tgt: [0, 8, 0] },
  { p: 0.87, pos: [10, 20, 58], tgt: [-42, 22, 0] },
  { p: 1.0, pos: [-205, 62, 236], tgt: [6, 4, 0] },
].map((k) => ({ p: k.p, pos: new THREE.Vector3(...k.pos), tgt: new THREE.Vector3(...k.tgt) }));

/** One 6 m steel deck module: plate, edge chords, Warren diagonals, bottom laterals. Local origin = top chord centre. */
function steelModuleGeometry() {
  const parts = [];
  const box = (w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const g = new THREE.BoxGeometry(w, h, d);
    if (rx || ry || rz) g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz)));
    g.translate(x, y, z);
    parts.push(g);
  };
  const half = SEG_L / 2;
  const diagLen = Math.hypot(half, TRUSS_D);
  const diagAng = Math.atan2(TRUSS_D, half);
  box(SEG_L, 0.4, 13, 0, 0.5, 0);                                   // orthotropic deck plate
  for (const z of [-6.2, 6.2]) {
    box(SEG_L, 0.55, 0.6, 0, 0, z);                                  // top chord
    box(SEG_L, 0.45, 0.6, 0, -TRUSS_D, z);                           // bottom chord
    box(0.32, diagLen, 0.42, -half / 2, -TRUSS_D / 2, z, 0, 0, Math.PI / 2 - diagAng);    // diagonal down
    box(0.32, diagLen, 0.42, half / 2, -TRUSS_D / 2, z, 0, 0, -(Math.PI / 2 - diagAng));  // diagonal up
  }
  box(0.4, 0.4, 12.4, 0, -TRUSS_D, 0);                               // bottom cross girder
  const lat = Math.hypot(SEG_L, 12.4);
  const latAng = Math.atan2(12.4, SEG_L);
  box(lat, 0.18, 0.22, 0, -TRUSS_D - 0.05, 0, 0, latAng, 0);         // plan bracing ╳
  box(lat, 0.18, 0.22, 0, -TRUSS_D - 0.05, 0, 0, -latAng, 0);
  const g = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  return g;
}

export function createBridge(canvas, { reduced = false, labelsEl = null, onFrame = null } = {}) {
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !small;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  const BG = new THREE.Color(0x0f100f);
  scene.background = BG;
  scene.fog = new THREE.Fog(BG, 210, 560);

  const camera = new THREE.PerspectiveCamera(30, 1, 1, 1500);

  // ---------- lights ----------
  scene.add(new THREE.HemisphereLight(0xe9e4da, 0x1a1916, 1.15));
  const sun = new THREE.DirectionalLight(0xffecd8, 2.7);
  sun.position.set(-140, 190, 120);
  sun.castShadow = renderer.shadowMap.enabled;
  Object.assign(sun.shadow.camera, { left: -175, right: 175, top: 130, bottom: -130, near: 20, far: 650 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.5;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x9db4cc, 1.0);
  rim.position.set(170, 70, -150);
  scene.add(rim);

  // ---------- materials ----------
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x1d1d1a, transparent: true, opacity: 0.5 });
  const steelEdgeMat = new THREE.LineBasicMaterial({ color: 0x15181a, transparent: true, opacity: 0.32 });
  const ghostMat = new THREE.LineBasicMaterial({ color: 0xe6e1d6, transparent: true, opacity: 0.34, depthWrite: false });
  const concrete = () => new THREE.MeshStandardMaterial({ color: 0xcdc8bd, roughness: 0.86, metalness: 0.02, emissive: ACCENT, emissiveIntensity: 0 });
  const steel = () => new THREE.MeshStandardMaterial({ color: 0x9ea8b0, roughness: 0.48, metalness: 0.28, emissive: ACCENT, emissiveIntensity: 0 });
  const pileMat = concrete();
  const capMat = concrete();
  const pylonMat = concrete();
  const pierMat = concrete();

  const edgeCache = new Map();
  const edgesOf = (geo, threshold = 25) => {
    const key = geo.uuid + threshold;
    if (!edgeCache.has(key)) edgeCache.set(key, new THREE.EdgesGeometry(geo, threshold));
    return edgeCache.get(key);
  };

  const model = new THREE.Group();
  scene.add(model);

  // all ghost (design-drawing) lines are merged into a single LineSegments
  const ghostPts = [];
  const gv = new THREE.Vector3();
  function addGhost(edges, matrix) {
    const a = edges.attributes.position.array;
    for (let i = 0; i < a.length; i += 3) {
      gv.set(a[i], a[i + 1], a[i + 2]).applyMatrix4(matrix);
      ghostPts.push(gv.x, gv.y, gv.z);
    }
  }

  function part(geo, mat, x, y, z, { threshold = 25, lines = edgeMat, ghostGeo = null } = {}) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    m.updateMatrix();
    const edges = edgesOf(geo, threshold);
    m.add(new THREE.LineSegments(edges, lines));
    addGhost(ghostGeo ? edgesOf(ghostGeo, threshold) : edges, m.matrix);
    model.add(m);
    return m;
  }

  // ---------- ground: geological section ----------
  const DEPTH = 96;
  const extrude = (shape, depth = DEPTH) => {
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    g.translate(0, 0, -depth / 2);
    return g;
  };
  const strataEdgeMat = new THREE.LineBasicMaterial({ color: 0xe6e1d6, transparent: true, opacity: 0.32 });
  const strata = [
    { top: surf, bottom: -16, color: 0x8a8270, opacity: 0.7 },
    { top: () => -16, bottom: -27, color: 0x5d5850, opacity: 0.6 },
    { top: () => -27, bottom: -42, color: 0xa39e90, opacity: 0.46 },
  ];
  strata.forEach((s, i) => {
    const shape = new THREE.Shape();
    shape.moveTo(-150, s.bottom);
    shape.lineTo(150, s.bottom);
    for (let x = 150; x >= -150; x -= 4) shape.lineTo(x, s.top(x));
    const geo = extrude(shape);
    const mat = new THREE.MeshStandardMaterial({ color: s.color, roughness: 1, transparent: true, opacity: s.opacity, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.renderOrder = 3 - i;
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), strataEdgeMat));
    scene.add(mesh);
  });

  const xs = [];
  for (let x = -100; x <= 100; x += 1) if (surf(x) < -0.05) xs.push(x);
  const ws = new THREE.Shape();
  ws.moveTo(xs[0], 0);
  ws.lineTo(xs[xs.length - 1], 0);
  for (let i = xs.length - 1; i >= 0; i--) ws.lineTo(xs[i], surf(xs[i]));
  const water = new THREE.Mesh(
    extrude(ws, DEPTH - 0.6),
    new THREE.MeshStandardMaterial({ color: 0x223640, roughness: 0.08, metalness: 0.4, transparent: true, opacity: 0.62, depthWrite: false })
  );
  water.receiveShadow = true;
  water.renderOrder = 5;
  scene.add(water);

  const grid = new THREE.GridHelper(1100, 110, 0x2f2f2b, 0x1f201d);
  grid.position.y = -42.6;
  scene.add(grid);

  // ---------- boreholes ----------
  const bhMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.95 });
  const BH = [[-124, 18], [-98, -16], [-74, 22], [-58, -18], [-30, 14], [-4, -20], [24, 18], [56, -16], [78, 21], [102, -12], [126, 16]];
  const boreholes = BH.map(([x, z]) => {
    const top = surf(x);
    const L = top + 42;
    const pts = [0, 0, 0, 0, -L, 0];
    for (let d = 4; d < L; d += 4) pts.push(-0.9, -d, 0, 0.9, -d, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const ls = new THREE.LineSegments(g, bhMat);
    ls.position.set(x, top + 0.05, z);
    ls.renderOrder = 6;
    scene.add(ls);
    return ls;
  });

  // ---------- foundations + pylons ----------
  const pileGeo = new THREE.CylinderGeometry(0.9, 0.9, 32, 10);
  pileGeo.translate(0, -16, 0);
  const capGeo = new THREE.BoxGeometry(16, 3, 22);
  capGeo.translate(0, 1.5, 0);
  const legGeo = new THREE.BoxGeometry(2.8, LEG_TOP - 1, 3.2);
  legGeo.translate(0, (LEG_TOP - 1) / 2, 0);
  const lowBeamGeo = new THREE.BoxGeometry(2.4, 1.8, LEG_Z * 2);
  const topBeamGeo = new THREE.BoxGeometry(2.4, 2.4, LEG_Z * 2 + 3.2);

  const piles = [], caps = [], legs = [], lowBeams = [], topBeams = [];
  for (const px of PYLONS) {
    for (let ix = -1; ix <= 1; ix++) for (let iz = -1; iz <= 1; iz++) {
      piles.push(part(pileGeo, pileMat, px + ix * 5, -2, iz * 7, { threshold: 40 }));
    }
    caps.push(part(capGeo, capMat, px, -2, 0));
    for (const zs of [-1, 1]) legs.push(part(legGeo, pylonMat, px, 1, zs * LEG_Z));
    lowBeams.push(part(lowBeamGeo, pylonMat, px, BEARING - 0.9, 0));
    topBeams.push(part(topBeamGeo, pylonMat, px, LEG_TOP - 1.2, 0));
  }

  // approach piers + abutments (tops at bearing level under the truss)
  const piers = [];
  for (const x of [-112, -88, 88, 112]) {
    const g = surf(x);
    const h = BEARING - 1.2 - g;
    const colGeo = new THREE.BoxGeometry(2, h, 2.4);
    colGeo.translate(0, h / 2, 0);
    const grp = [part(colGeo, pierMat, x, g, -4), part(colGeo, pierMat, x, g, 4)];
    const pcGeo = new THREE.BoxGeometry(2.8, 1.2, 13.5);
    pcGeo.translate(0, 0.6, 0);
    grp.push(part(pcGeo, pierMat, x, BEARING - 1.2, 0));
    piers.push(grp);
  }
  for (const x of [-134, 134]) {
    const abGeo = new THREE.BoxGeometry(4, BEARING - 4, 16);
    abGeo.translate(0, (BEARING - 4) / 2, 0);
    piers.push([part(abGeo, pierMat, x, 4, 0)]);
  }

  // ---------- deck: 44 steel truss modules, erected balanced-cantilever from each pylon ----------
  const segGeo = steelModuleGeometry();
  const segGhostGeo = new THREE.BoxGeometry(SEG_L, TRUSS_D + 1.15, 13);  // simple envelope for the design-drawing ghost
  segGhostGeo.translate(0, -TRUSS_D / 2 + 0.25, 0);
  const segs = [];
  for (let i = 0; i < 44; i++) {
    const cx = -129 + i * 6;
    const d = Math.min(Math.abs(cx - 50), Math.abs(cx + 50));
    const mat = steel();
    segs.push({ m: part(segGeo, mat, cx, DECK_Y, 0, { threshold: 30, lines: steelEdgeMat, ghostGeo: segGhostGeo }), d, mat });
  }
  const dMax = Math.max(...segs.map((s) => s.d));

  // ---------- stay cables: 2 pylons × 2 sides × 2 planes × 6 ----------
  const cableGeo = new THREE.CylinderGeometry(small ? 0.2 : 0.16, small ? 0.2 : 0.16, 1, 6, 1);
  cableGeo.translate(0, 0.5, 0);
  const cableMats = Array.from({ length: 6 }, () =>
    new THREE.MeshStandardMaterial({ color: 0xece8de, roughness: 0.35, metalness: 0.55, emissive: ACCENT, emissiveIntensity: 0 })
  );
  const cables = [];
  const Y = new THREE.Vector3(0, 1, 0);
  let labelCable = null;
  for (const px of PYLONS) for (const s of [-1, 1]) for (const zs of [-1, 1]) for (let k = 0; k < 6; k++) {
    const a = new THREE.Vector3(px, 23 + k * 2.2, zs * 7.0);
    const b = new THREE.Vector3(px + s * (7 + k * 8.2), DECK_TOP, zs * 6.2);
    const dir = b.clone().sub(a);
    const len = dir.length();
    dir.normalize();
    const m = new THREE.Mesh(cableGeo, cableMats[k]);
    m.position.copy(a);
    m.quaternion.setFromUnitVectors(Y, dir);
    m.scale.set(1, len, 1);
    m.castShadow = true;
    model.add(m);
    cables.push({ m, len, k });
    ghostPts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    if (px === -50 && s === 1 && zs === 1 && k === 4) labelCable = a.clone().lerp(b, 0.55);
  }

  const ghostGeo = new THREE.BufferGeometry();
  ghostGeo.setAttribute('position', new THREE.Float32BufferAttribute(ghostPts, 3));
  const ghost = new THREE.LineSegments(ghostGeo, ghostMat);
  scene.add(ghost);

  // ---------- traffic + aviation beacons ----------
  const CARS = small ? 18 : 30;
  const carMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const cars = new THREE.InstancedMesh(new THREE.BoxGeometry(1.8, 0.62, 0.85), carMat, CARS);
  const lanes = [-4.6, -1.6, 1.6, 4.6];
  const carData = [];
  const col = new THREE.Color();
  for (let i = 0; i < CARS; i++) {
    const lane = lanes[i % 4];
    const dir = lane > 0 ? 1 : -1;
    carData.push({ lane, dir, x: -132 + ((i * 97.3) % 264), v: 11 + ((i * 7.1) % 7) });
    cars.setColorAt(i, col.set(dir > 0 ? 0xfff1d2 : 0xff5126));
  }
  cars.visible = false;
  model.add(cars);
  const dummy = new THREE.Object3D();

  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff2a10, transparent: true, opacity: 0 });
  const beaconGeo = new THREE.SphereGeometry(0.55, 10, 8);
  for (const px of PYLONS) for (const zs of [-1, 1]) {
    const b = new THREE.Mesh(beaconGeo, beaconMat);
    b.position.set(px, LEG_TOP + 0.6, zs * LEG_Z);
    model.add(b);
  }

  // ---------- HTML annotation tags projected from 3D ----------
  const labelDefs = [
    { at: [-30, surf(-30), 14], text: 'BH-04 · cored to −42.0 m', win: [0.12, 0.31] },
    { at: [-118, -34, 48], text: 'Chalk · from −26.0 m', win: [0.15, 0.31] },
    { at: [-50, -22, 7], text: '9 × Ø1.8 m bored piles', win: [0.235, 0.33] },
    { at: [-50, LEG_TOP + 0.5, LEG_Z], text: 'Pylon P1 · +156.6 m', win: [0.41, 0.535] },
    { at: [-6, DECK_Y - TRUSS_D, 6.2], text: 'S460 steel truss · 412 m span', win: [0.63, 0.765] },
    { at: labelCable.toArray(), text: 'Stay C-14 · 6.8 MN', win: [0.845, 0.975] },
  ];
  const labels = labelsEl
    ? labelDefs.map((d) => {
        const el = document.createElement('div');
        el.className = 'tag';
        el.innerHTML = `<span class="tag__dot"></span><span class="tag__line"></span><span class="tag__text">${d.text}</span>`;
        labelsEl.appendChild(el);
        return { ...d, el, v: new THREE.Vector3(...d.at), o: -1, flip: null };
      })
    : [];

  // ---------- state ----------
  let W = 1, H = 1, distScale = 1;
  let target = reduced ? 1 : 0;
  let cur = target;
  let time = 0;
  let running = false;
  let raf = 0;
  let dirty = true;
  let lastBlink = -1;
  let lastShadowP = -1;
  let frameParity = 0;
  const clock = new THREE.Clock();
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  const stats = { phase: 0, piles: 0, deck: 0, cables: 0 };
  const camPos = new THREE.Vector3();
  const camTgt = new THREE.Vector3();
  const off = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  function cameraAt(p) {
    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const a = KEYS[i], b = KEYS[i + 1];
    const t = easeInOut(clamp01((p - a.p) / (b.p - a.p)));
    camPos.lerpVectors(a.pos, b.pos, t);
    camTgt.lerpVectors(a.tgt, b.tgt, t);
  }

  function update(p, dt) {
    // 01 — investigate
    boreholes.forEach((b, i) => {
      const a = easeOut(sub(p, 0.11 + i * 0.01, 0.2 + i * 0.01));
      b.scale.y = Math.max(a, EPS);
      b.visible = a > 0;
    });
    bhMat.opacity = 0.95 - 0.62 * sub(p, 0.45, 0.7);

    let pc = 0;
    piles.forEach((m, j) => {
      const a = easeOut(sub(p, 0.2 + j * 0.004, 0.27 + j * 0.004));
      m.scale.y = Math.max(a, EPS);
      m.visible = a > 0;
      if (a > 0.98) pc++;
    });
    pileMat.emissiveIntensity = 0.9 * heat(p, 0.2, 0.34);

    // 02 — found
    caps.forEach((m) => { const a = easeOut(sub(p, 0.3, 0.345)); m.scale.y = Math.max(a, EPS); m.visible = a > 0; });
    capMat.emissiveIntensity = 0.8 * heat(p, 0.3, 0.38);
    legs.forEach((m) => { const a = easeInOut(sub(p, 0.335, 0.49)); m.scale.y = Math.max(a, EPS); m.visible = a > 0; });
    lowBeams.forEach((m) => { const a = easeOut(sub(p, 0.37, 0.4)); m.scale.z = Math.max(a, EPS); m.visible = a > 0; });
    topBeams.forEach((m) => { const a = easeOut(sub(p, 0.475, 0.505)); m.scale.z = Math.max(a, EPS); m.visible = a > 0; });
    pylonMat.emissiveIntensity = 0.75 * heat(p, 0.33, 0.53);
    piers.forEach((grp, i) => {
      const st = 0.41 + (i % 3) * 0.012;
      const a = easeOut(sub(p, st, st + 0.07));
      grp.forEach((m) => { m.scale.y = Math.max(a, EPS); m.visible = a > 0; });
    });
    pierMat.emissiveIntensity = 0.6 * heat(p, 0.41, 0.52);

    // 03 — span: steel modules lifted in from above, glowing hot, then cooling to steel grey
    const q = sub(p, 0.535, 0.765);
    let built = 0;
    segs.forEach((s) => {
      const st = (s.d / dMax) * 0.8;
      const a = sub(q, st, st + 0.1);
      s.m.visible = a > 0;
      if (!s.m.visible) return;
      const e = easeOut(a);
      s.m.position.y = DECK_Y + (1 - e) * 6;
      s.m.scale.x = 0.35 + 0.65 * e;
      s.mat.emissiveIntensity = 0.95 * (1 - sub(q, st + 0.04, st + 0.3));
      if (a >= 0.5) built++;
    });

    // 04 — tension
    const c = sub(p, 0.765, 0.935);
    let cc = 0;
    cables.forEach((cb) => {
      const st = cb.k * 0.13;
      const a = easeInOut(sub(c, st, st + 0.22));
      cb.m.visible = a > 0;
      cb.m.scale.y = Math.max(cb.len * a, EPS);
      if (a > 0.98) cc++;
    });
    cableMats.forEach((m, k) => {
      const st = k * 0.13;
      m.emissiveIntensity = 1.3 * sub(c, st, st + 0.04) * (1 - sub(c, st + 0.2, st + 0.42));
    });

    ghostMat.opacity = 0.34 * (1 - sub(p, 0.8, 0.97));
    ghost.visible = ghostMat.opacity > 0.003;

    const tv = sub(p, 0.93, 0.985);
    carMat.opacity = tv;
    cars.visible = tv > 0;
    if (cars.visible) {
      carData.forEach((cd, i) => {
        if (!reduced) cd.x += cd.dir * cd.v * dt;
        if (cd.x > 134) cd.x = -134;
        if (cd.x < -134) cd.x = 134;
        dummy.position.set(cd.x, DECK_TOP + 0.32, cd.lane);
        dummy.updateMatrix();
        cars.setMatrixAt(i, dummy.matrix);
      });
      cars.instanceMatrix.needsUpdate = true;
    }
    beaconMat.opacity = sub(p, 0.5, 0.53) * (lastBlink === 0 ? 0.18 : 1);

    stats.phase = p < PHASE_AT[0] ? 0 : p < PHASE_AT[1] ? 1 : p < PHASE_AT[2] ? 2 : p < PHASE_AT[3] ? 3 : 4;
    stats.piles = pc;
    stats.deck = built * 6 * UNIT;
    stats.cables = cc;

    // camera
    cameraAt(p);
    off.subVectors(camPos, camTgt).multiplyScalar(distScale);
    camera.position.copy(camTgt).add(off);
    camera.position.x += ptr.x * 5;
    camera.position.y += ptr.y * 3;
    camera.lookAt(camTgt);
    camera.updateMatrixWorld();
    const dist = off.length();
    scene.fog.near = dist * 0.85;
    scene.fog.far = dist * 2.8;

    updateLabels(p);
  }

  function updateLabels(p) {
    for (const l of labels) {
      let o = Math.min(clamp01((p - l.win[0]) / 0.022), clamp01((l.win[1] - p) / 0.022));
      if (o > 0) {
        tmp.copy(l.v).project(camera);
        if (tmp.z > 1 || Math.abs(tmp.x) > 1.05 || Math.abs(tmp.y) > 1.05) o = 0;
        else {
          const x = (tmp.x * 0.5 + 0.5) * W;
          const flip = x > W * 0.58;
          if (flip !== l.flip) { l.el.classList.toggle('tag--flip', flip); l.flip = flip; }
          l.el.style.transform = `translate3d(${x.toFixed(1)}px, ${((-tmp.y * 0.5 + 0.5) * H).toFixed(1)}px, 0)`;
        }
      }
      if (o !== l.o) { l.el.style.opacity = o.toFixed(3); l.o = o; }
    }
  }

  function render(dt = 0) {
    update(cur, dt);
    if (renderer.shadowMap.enabled && cur !== lastShadowP) {
      renderer.shadowMap.needsUpdate = true;
      lastShadowP = cur;
    }
    renderer.render(scene, camera);
    if (onFrame) onFrame(cur, stats);
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    time += dt;

    const moving = Math.abs(target - cur) > 0.00015;
    if (moving) cur += (target - cur) * (1 - Math.exp(-dt * 9));
    else cur = target;

    const pointerMoving = Math.abs(ptr.tx - ptr.x) > 0.0005 || Math.abs(ptr.ty - ptr.y) > 0.0005;
    if (pointerMoving) {
      const k = 1 - Math.exp(-dt * 3);
      ptr.x += (ptr.tx - ptr.x) * k;
      ptr.y += (ptr.ty - ptr.y) * k;
    }

    const blink = cur > 0.5 ? (Math.sin(time * 2.6) > 0.55 ? 1 : 0) : -1;
    const blinkChanged = blink !== lastBlink;
    lastBlink = blink;

    // ambient-only frames (traffic) run at half rate; anything user-driven renders every frame
    const ambient = cur > 0.93 && ((frameParity = (frameParity + 1) % 2) === 0);
    if (moving || pointerMoving || blinkChanged || dirty || ambient) {
      dirty = false;
      render(ambient && !moving && !pointerMoving ? dt * 2 : dt);
    }
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (w === W && Math.abs(h - H) < 2) return;
    W = w; H = h;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    if (aspect < 1) {
      camera.fov = 44;
      distScale = Math.min(2.2, 1.0 / aspect);
      camera.setViewOffset(w, h, 0, h * 0.16, w, h);
    } else {
      camera.fov = 30;
      distScale = aspect < 1.45 ? 1.18 : 1;
      camera.setViewOffset(w, h, -w * 0.12, h * 0.02, w, h);
    }
    camera.updateProjectionMatrix();
    lastShadowP = -1;
    dirty = true;
    if (!running || reduced) render(0);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  return {
    setProgress(v) { target = clamp01(v); },
    setPointer(x, y) { ptr.tx = x; ptr.ty = y; },
    start() {
      if (reduced) { render(0); return; }
      if (running) return;
      running = true;
      dirty = true;
      clock.getDelta();
      raf = requestAnimationFrame(tick);
    },
    stop() { running = false; cancelAnimationFrame(raf); },
    get progress() { return cur; },
  };
}
