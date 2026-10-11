// Line drawings for the project sheets. Every stroke is a <path pathLength="1"> so it can be "drawn" on reveal.
const P = (d, c = '') => `<path class="d ${c}" d="${d}" pathLength="1"/>`;
const PD = (d, c = '') => `<path class="dl ${c}" d="${d}"/>`;
const F = (d, c = 'fill') => `<path class="${c}" d="${d}"/>`;
const L = (x1, y1, x2, y2, c) => P(`M${x1} ${y1}L${x2} ${y2}`, c);
const R = (x, y, w, h, c) => P(`M${x} ${y}h${w}v${h}h${-w}Z`, c);
const T = (x, y, s, a = 'start', c = '') => `<text class="t ${c}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;
const C = (cx, cy, r, c) => P(`M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`, c);

function dimH(x1, x2, y, label) {
  return P(`M${x1} ${y}H${x2}M${x1} ${y - 6}V${y + 6}M${x2} ${y - 6}V${y + 6}M${x1 - 3} ${y + 3}l6 -6M${x2 - 3} ${y + 3}l6 -6`, 'dim') +
    T((x1 + x2) / 2, y - 6, label, 'middle', 'tdim');
}
function dimV(x, y1, y2, label) {
  const my = (y1 + y2) / 2;
  return P(`M${x} ${y1}V${y2}M${x - 6} ${y1}H${x + 6}M${x - 6} ${y2}H${x + 6}M${x - 3} ${y1 + 3}l6 -6M${x - 3} ${y2 + 3}l6 -6`, 'dim') +
    `<text class="t tdim" x="${x - 7}" y="${my}" text-anchor="middle" transform="rotate(-90 ${x - 7} ${my})">${label}</text>`;
}
const level = (x, y, label) => P(`M${x - 5} ${y - 8}H${x + 5}L${x} ${y}Z`, 'lvl') + T(x + 10, y - 2, label);
function hatch(x1, x2, y, step = 8, len = 6) {
  let d = '';
  for (let x = x1 + len; x <= x2; x += step) d += `M${x} ${y}l${-len} ${len}`;
  return P(d, 'thin');
}
const axis = (x, y1, y2, id) => PD(`M${x} ${y1 + 9}V${y2}`, 'axis') + C(x, y1, 9, 'thin') + T(x, y1 + 3.5, id, 'middle', 'tb');
const svg = (inner, label) => `<svg class="dwg" viewBox="0 0 640 360" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;

function bridge() {
  let s = '';
  s += F('M112 250H528C480 250 470 300 404 300H236C170 300 160 250 112 250Z', 'water');
  s += PD('M0 250H640');
  s += P('M0 236H112C160 236 178 300 236 300H404C462 300 480 236 528 236H640');
  s += hatch(0, 112, 236) + hatch(528, 640, 236);
  s += R(18, 166, 604, 3, 'bold') + L(18, 178, 622, 178);
  { let z = 'M18 169'; for (let x = 18; x < 622; x += 12) z += `L${x + 6} 178L${x + 12} 169`; s += P(z, 'thin'); }
  for (const px of [200, 440]) {
    s += axis(px, 18, 340, px === 200 ? 'P1' : 'P2');
    s += R(px - 4, 40, 8, 222);
    s += R(px - 16, 262, 32, 9);
    s += P(`M${px - 10} 271V330M${px} 271V330M${px + 10} 271V330`, 'thin');
    for (let k = 0; k < 5; k++) {
      const ay = 50 + k * 8, dx = 24 + k * 24;
      s += L(px, ay, px + dx, 168, 'cable') + L(px, ay, px - dx, 168, 'cable');
    }
  }
  for (const x of [60, 120, 520, 580]) s += R(x - 3, 178, 6, 58);
  s += dimH(200, 440, 350, 'Main span 412.0');
  s += level(330, 166, '+41.2');
  s += level(560, 250, '±0.00 MHW');
  return svg(s, 'Elevation of the Halden Strait cable-stayed bridge');
}

function tower() {
  let s = '';
  s += R(40, 226, 90, 60, 'thin') + R(140, 246, 70, 40, 'thin') + R(450, 236, 80, 50, 'thin') + R(540, 206, 70, 80, 'thin');
  s += L(0, 286, 640, 286) + hatch(0, 240, 286) + hatch(400, 640, 286);
  s += R(260, 46, 120, 240, 'bold');
  let floors = '';
  for (let y = 54; y < 286; y += 8) floors += `M260 ${y}H380`;
  s += P(floors, 'thin');
  s += R(270, 30, 100, 16) + L(320, 30, 320, 8);
  s += PD('M300 46V286M340 46V286');
  for (const y of [118, 206]) {
    s += P(`M260 ${y}L300 ${y + 16}M260 ${y + 16}L300 ${y}M340 ${y}L380 ${y + 16}M340 ${y + 16}L380 ${y}`, 'acc');
  }
  s += R(250, 286, 140, 26) + P('M250 295H390M250 303H390', 'thin');
  s += R(240, 312, 160, 10, 'acc');
  let piles = '';
  for (let x = 250; x <= 390; x += 14) piles += `M${x} 322V346`;
  s += P(piles, 'thin');
  s += dimV(228, 8, 286, '184.0');
  s += level(420, 286, '±0.00');
  s += level(420, 322, '−14.5');
  s += T(400, 122, 'Outrigger L12', 'start') + T(400, 210, 'Outrigger L24', 'start');
  return svg(s, 'North elevation of Kestrel Yard Tower with outriggers and piled raft');
}

function viaduct() {
  const y = (x) => 120 + 120 * Math.sin((Math.PI * x) / 640) ** 2;
  let s = '';
  let prof = 'M0 120', prof2 = 'M0 136';
  for (let x = 8; x <= 640; x += 8) { prof += `L${x} ${y(x).toFixed(1)}`; prof2 += `L${x} ${(y(x) + 16).toFixed(1)}`; }
  s += P(prof);
  s += PD(prof2);
  s += F(`M296 ${y(296).toFixed(1)}H344L340 ${y(340) + 2}H300Z`, 'water');
  s += R(0, 92, 640, 6, 'bold') + L(0, 86, 640, 86, 'thin');
  for (let i = 0; i < 8; i++) {
    const x = 40 + i * 80, gy = y(x);
    s += P(`M${x - 4} 98L${x + 4} 98L${x + 7} ${gy.toFixed(1)}L${x - 7} ${gy.toFixed(1)}Z`);
    s += R(x - 12, +gy.toFixed(1), 24, 8, 'thin');
  }
  s += dimH(40, 600, 46, '7 × 140.0 = 980.0');
  s += dimV(316, 98, y(280), '231.0');
  s += level(560, 92, '+262.4');
  s += T(320, 330, 'Río Orsa', 'middle');
  return svg(s, 'Long section of the Orsa Valley Viaduct');
}

function barrier() {
  let s = '';
  let wave = 'M0 118';
  for (let x = 0; x < 246; x += 20) wave += `q5 -4 10 0t10 0`;
  s += F('M0 118H246V290H0Z', 'water') + F('M394 196H640V290H394Z', 'water');
  s += P(wave, 'thin');
  s += L(394, 196, 640, 196, 'thin');
  s += R(246, 34, 28, 256) + R(366, 34, 28, 256);
  s += R(236, 20, 168, 14, 'bold');
  s += R(274, 96, 92, 176, 'acc');
  s += P('M274 96L366 140L274 184L366 228L274 272', 'acc');
  s += R(230, 272, 180, 18, 'bold');
  s += P('M0 290H230M410 290H640') + hatch(0, 230, 290) + hatch(410, 640, 290);
  s += P('M236 290V346M404 290V346', 'bold');
  s += dimH(274, 366, 324, '58.0');
  s += level(60, 118, '+4.80 mOD · 1:10,000 yr');
  s += level(470, 196, '+0.60 mOD');
  s += T(120, 230, 'Oosterschelde', 'middle') + T(520, 250, 'Linthe', 'middle');
  return svg(s, 'Section through the Linthe tidal barrier gate');
}

function station() {
  let s = '';
  s += R(20, 20, 80, 50, 'thin') + R(110, 34, 60, 36, 'thin') + R(470, 26, 70, 44, 'thin') + R(550, 40, 70, 30, 'thin');
  s += L(0, 70, 640, 70) + hatch(0, 150, 70) + hatch(490, 640, 70);
  s += R(150, 70, 12, 272, 'bold') + R(478, 70, 12, 272, 'bold');
  s += R(162, 86, 316, 12) + R(162, 170, 316, 9) + R(162, 296, 316, 18, 'bold');
  s += L(320, 98, 320, 170) + L(320, 179, 320, 296);
  s += PD('M162 130H478M162 240H478');
  s += R(282, 278, 76, 18, 'thin');
  const train = (x) => {
    const y = 224, w = 90, h = 52;
    let d = `M${x + 10} ${y}H${x + w - 10}Q${x + w} ${y} ${x + w} ${y + 10}V${y + h}H${x}V${y + 10}Q${x} ${y} ${x + 10} ${y}Z`;
    let win = '';
    for (let i = 0; i < 4; i++) win += `M${x + 10 + i * 20} ${y + 12}h12v10h-12Z`;
    return P(d) + P(win, 'thin');
  };
  s += train(186) + train(364);
  s += P('M340 179L304 276M350 179L314 276', 'thin');
  s += PD('M0 200H150M490 200H640');
  s += T(16, 194, 'London clay') + T(500, 194, 'Clay') + T(16, 230, 'Sand & gravel');
  s += level(60, 120, 'GWL +1.2');
  s += dimV(520, 70, 314, '28.0');
  s += T(320, 162, 'Concourse', 'middle') + T(320, 290, 'Platform', 'middle');
  return svg(s, 'Cross-section of Ferrow Street cut-and-cover station box');
}

export const drawings = { bridge, tower, viaduct, barrier, station };
