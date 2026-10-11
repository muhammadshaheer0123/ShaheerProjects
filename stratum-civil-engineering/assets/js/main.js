import { createBridge, PHASE_AT } from './bridge.js';
import { createTerrain } from './terrain.js';
import { drawings } from './drawings.js';

const root = document.documentElement;
const { gsap, ScrollTrigger } = window;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

root.classList.add('js');
const canAnimate = !!gsap && !!ScrollTrigger && !reduced;
if (reduced) root.classList.add('reduced');
if (canAnimate) root.classList.add('anim');
if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/* ---------- drawings ---------- */
$$('[data-dwg]').forEach((el) => { el.innerHTML = drawings[el.dataset.dwg](); });

/* ---------- smooth scroll ---------- */
let lenis = null;
if (canAnimate && window.Lenis) {
  lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
function scrollToY(y, immediate = false) {
  if (lenis) lenis.scrollTo(y, { duration: immediate ? 0 : 1.5, immediate });
  else window.scrollTo({ top: y, behavior: reduced || immediate ? 'auto' : 'smooth' });
}

/* ---------- 3D bridge stage ---------- */
const stage = $('.stage');
const hero = $('.hero');
const phaseEls = $$('.phase');
const railFill = $('.rail__fill');
const railSegs = $$('.rail__seg');
const ro = Object.fromEntries($$('[data-ro]').map((e) => [e.dataset.ro, e]));
const PHASE_NAMES = ['Site', 'Investigate', 'Found', 'Span', 'Tension'];
const PHASE_WIN = [[PHASE_AT[0], PHASE_AT[1]], [PHASE_AT[1], PHASE_AT[2]], [PHASE_AT[2], PHASE_AT[3]], [PHASE_AT[3], 2]];
const pad = (n) => String(n).padStart(2, '0');
let lastRO = '';
let heroO = -1, railO = '', activePhase = -1;
const phaseO = [-1, -1, -1, -1];

function updateStage(p, stats) {
  const h = +(1 - clamp01((p - 0.025) / 0.06)).toFixed(3);
  if (h !== heroO) {
    heroO = h;
    hero.style.opacity = h;
    hero.style.transform = `translate3d(0, ${(-(1 - h) * 48).toFixed(1)}px, 0)`;
    hero.style.visibility = h <= 0 ? 'hidden' : 'visible';
  }

  phaseEls.forEach((el, i) => {
    const [a, b] = PHASE_WIN[i];
    const o = +Math.min(clamp01((p - a - 0.005) / 0.035), clamp01((b - p) / 0.03)).toFixed(3);
    if (o === phaseO[i]) return;
    phaseO[i] = o;
    el.style.opacity = o;
    el.style.setProperty('--py', `${((1 - o) * 28).toFixed(1)}px`);
    el.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
  });

  const fill = clamp01((p - PHASE_AT[0]) / (1 - PHASE_AT[0])).toFixed(4);
  if (fill !== railO) { railO = fill; railFill.style.transform = `scaleX(${fill})`; }
  if (stats.phase !== activePhase) {
    activePhase = stats.phase;
    railSegs.forEach((s, i) => s.classList.toggle('is-active', stats.phase === i + 1));
  }

  const key = `${stats.phase}|${stats.piles}|${stats.deck}|${stats.cables}`;
  if (key !== lastRO) {
    lastRO = key;
    ro.phase.textContent = PHASE_NAMES[stats.phase];
    ro.piles.textContent = pad(stats.piles);
    ro.deck.textContent = stats.deck.toLocaleString('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    ro.cables.textContent = pad(stats.cables);
  }
}

let bridge = null;
try {
  bridge = createBridge($('#bridge'), {
    reduced: !canAnimate,
    labelsEl: $('.labels'),
    onFrame: canAnimate ? updateStage : null,
  });
} catch (err) {
  console.warn('WebGL unavailable, using static hero.', err);
  root.classList.add('no-webgl');
  $('#bridge').style.display = 'none';
}
const staticStage = !canAnimate || !bridge;
if (staticStage) root.classList.add('static-stage');

if (bridge) {
  new IntersectionObserver(([e]) => (e.isIntersecting ? bridge.start() : bridge.stop()), { rootMargin: '80px' }).observe(stage);
  if (finePointer && canAnimate) {
    stage.addEventListener('pointermove', (e) => {
      bridge.setPointer((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
    });
    stage.addEventListener('pointerleave', () => bridge.setPointer(0, 0));
  }
}

const stageScrollY = (p) => stage.offsetTop + (stage.offsetHeight - innerHeight) * p;
if (!staticStage) {
  ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => bridge.setProgress(self.progress),
  });
  railSegs.forEach((btn) => btn.addEventListener('click', () => scrollToY(stageScrollY(parseFloat(btn.dataset.goto)))));
}

/* ---------- loader + hero intro ---------- */
const loader = $('.loader');
// The CSS hides lines at translateY(110%); animate them back to 0 from that offset.
function runIntro() {
  if (!canAnimate) return;
  gsap.set('.hero .line > span', { y: 0, yPercent: 110 });
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to('.hero .line > span', { yPercent: 0, duration: 1.3, stagger: 0.09 }, 0)
    .to('.hero .eyebrow', { opacity: 1, duration: 1 }, 0.2)
    .fromTo('.hero__foot', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1 }, 0.4)
    .to('.hud', { opacity: 1, duration: 1.2, stagger: 0.1 }, 0.55);
}

if (canAnimate && loader) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);
  lenis?.stop();
  root.style.overflow = 'hidden';
  const countEl = $('[data-count]', loader);
  const bar = $('.loader__bar span', loader);
  const prog = { v: 0 };
  const draw = () => { countEl.textContent = String(Math.round(prog.v)).padStart(3, '0'); bar.style.transform = `scaleX(${prog.v / 100})`; };
  const crawl = gsap.to(prog, { v: 88, duration: 1.4, ease: 'power2.out', onUpdate: draw });
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const timeout = new Promise((r) => setTimeout(r, 1800));
  const minTime = new Promise((r) => setTimeout(r, 650));
  Promise.all([Promise.race([fonts, timeout]), minTime]).then(() => {
    crawl.kill();
    gsap.to(prog, {
      v: 100, duration: 0.35, ease: 'power1.in', onUpdate: draw,
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100, duration: 1.05, ease: 'expo.inOut',
          onComplete: () => { loader.remove(); },
        });
        gsap.delayedCall(0.45, runIntro);
        root.style.overflow = '';
        lenis?.start();
        ScrollTrigger.refresh();
      },
    });
  });
} else {
  loader?.remove();
}

/* ---------- nav ---------- */
const nav = $('.nav');
const burger = $('.nav__burger');
const menu = $('#menu');
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  menu.hidden = false;
  requestAnimationFrame(() => menu.classList.add('is-open'));
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Close menu');
  root.classList.add('menu-open');
  lenis?.stop();
  setTimeout(() => $('a', menu)?.focus({ preventScroll: true }), 300);
}
function closeMenu(returnFocus = true) {
  if (!menuOpen) return;
  menuOpen = false;
  menu.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
  root.classList.remove('menu-open');
  lenis?.start();
  if (returnFocus) burger.focus({ preventScroll: true });
  setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 700);
}
burger.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
  if (e.key === 'Tab' && menuOpen) {
    const items = [burger, ...$$('a', menu)];
    const i = items.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
    else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
  }
});
matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && closeMenu(false));

// in-page anchors
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  const target = $(id);
  if (!target) return;
  e.preventDefault();
  const wasOpen = menuOpen;
  closeMenu(false);
  const y = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
  if (wasOpen) setTimeout(() => scrollToY(y, true), 50); else scrollToY(y);
  history.replaceState(null, '', id);
  if (a.dataset.type) { const sel = $('#f-type'); sel.value = a.dataset.type; }
  setTimeout(() => {
    const focusEl = a.dataset.type ? $('#f-name') : target;
    if (!a.dataset.type) target.setAttribute('tabindex', '-1');
    focusEl.focus({ preventScroll: true });
  }, wasOpen ? 120 : reduced ? 0 : 1200);
}));

/* ---------- section animations ---------- */
if (canAnimate) {
  // Selected work: horizontal pinned scroll on desktop
  const cards = $$('.card:not(.card--end)');
  const idxEl = $('[data-work-idx]');
  const drawIn = (card) => {
    if (card.dataset.drawn) return;
    card.dataset.drawn = '1';
    const svgEl = $('svg', card);
    gsap.to($$('.d', svgEl), { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: { amount: 1.1 } });
    gsap.to($$('.t, .dl, .fill, .water', svgEl), { opacity: 1, duration: 0.8, delay: 0.9, stagger: 0.02 });
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    root.classList.add('is-hscroll');
    const track = $('.work__track');
    const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.work',
        start: 'top top',
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => { idxEl.textContent = pad(Math.min(cards.length, 1 + Math.floor(self.progress * cards.length))); },
      },
    });
    cards.forEach((c) => ScrollTrigger.create({ trigger: c, containerAnimation: tween, start: 'left 88%', onEnter: () => drawIn(c) }));
    ScrollTrigger.create({ trigger: '.work', start: 'top 55%', once: true, onEnter: () => drawIn(cards[0]) });
    return () => root.classList.remove('is-hscroll');
  });
  mm.add('(max-width: 1023.98px)', () => {
    cards.forEach((c, i) => ScrollTrigger.create({
      trigger: c, start: 'top 78%', once: true,
      onEnter: () => { drawIn(c); idxEl.textContent = pad(i + 1); },
    }));
  });

  // Split-line headings
  $$('.split').forEach((h) => {
    gsap.from($$('.line > span', h), {
      yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: h, start: 'top 86%', once: true },
    });
  });

  // Word-by-word statement
  $$('[data-words]').forEach((el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.append(part);
            else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.append(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    gsap.fromTo($$('.w', el), { opacity: 0.14 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true },
    });
  });

  // Simple reveals
  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // Counters
  $$('[data-to]').forEach((el) => {
    const to = parseFloat(el.dataset.to);
    const dec = +(el.dataset.dec || 0);
    const o = { v: 0 };
    el.textContent = (0).toFixed(dec);
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => gsap.to(o, { v: to, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = o.v.toFixed(dec); } }),
    });
  });

  // Discipline rows slide in
  gsap.from('.disc__row', {
    y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07,
    scrollTrigger: { trigger: '.disc__list', start: 'top 85%', once: true },
  });

  // Method steps rail
  gsap.fromTo('.steps__fill', { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.steps__list', start: 'top 60%', end: 'bottom 60%', scrub: true },
  });
}

/* ---------- method / terrain ---------- */
let terrain = null;
try { terrain = createTerrain($('#terrain'), { reduced: !canAnimate, gsap }); } catch (err) { console.warn(err); }
if (terrain) new IntersectionObserver(([e]) => (e.isIntersecting ? terrain.start() : terrain.stop()), { rootMargin: '60px' }).observe($('.terrain'));
const steps = $$('.step');
const tIdx = $('[data-terrain-idx]'), tName = $('[data-terrain-name]'), tData = $('[data-terrain-data]');
let activeStep = 0;
function setStep(i) {
  if (i === activeStep) return;
  activeStep = i;
  steps.forEach((s, j) => s.classList.toggle('is-active', i === j));
  terrain?.setMode(i);
  tIdx.textContent = pad(i + 1);
  tName.textContent = $('h3', steps[i]).textContent;
  tData.textContent = $('.step__spec', steps[i]).textContent;
}
if (ScrollTrigger) {
  steps.forEach((s, i) => ScrollTrigger.create({
    trigger: s, start: 'top 62%', end: 'bottom 62%',
    onToggle: (self) => self.isActive && setStep(i),
  }));
} else steps.forEach((s) => s.classList.add('is-active'));

/* ---------- nav theme + hide on scroll ---------- */
if (ScrollTrigger) {
  $$('[data-nav]').forEach((sec) => ScrollTrigger.create({
    trigger: sec, start: 'top 34px', end: 'bottom 34px',
    onToggle: (self) => {
      if (!self.isActive) return;
      nav.dataset.theme = sec.dataset.nav;
      nav.classList.toggle('is-solid', sec !== stage);
    },
  }));
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-hidden', !menuOpen && self.direction === 1 && y > 240);
    },
  });
}

/* ---------- contact form ---------- */
const form = $('.form');
const status = $('.form__status', form);
const rules = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Please tell us your name.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'That email doesn’t look complete — e.g. name@company.com'),
  brief: (v) => (v.trim().length >= 12 ? '' : 'A sentence or two about the site helps us reply usefully.'),
};
function check(input) {
  const rule = rules[input.name];
  if (!rule) return true;
  const msg = rule(input.value);
  const field = input.closest('.field');
  field.classList.toggle('is-invalid', !!msg);
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  $('.field__err', field).textContent = msg;
  return !msg;
}
$$('input, textarea', form).forEach((inp) => {
  inp.addEventListener('blur', () => { if (inp.value || inp.dataset.touched) { inp.dataset.touched = '1'; check(inp); } });
  inp.addEventListener('input', () => { if (inp.dataset.touched) check(inp); });
});
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fields = $$('[name="name"], [name="email"], [name="brief"]', form);
  fields.forEach((f) => { f.dataset.touched = '1'; });
  const bad = fields.filter((f) => !check(f));
  if (bad.length) { bad[0].focus(); status.textContent = ''; form.classList.remove('is-sent'); return; }
  const btn = $('button[type="submit"]', form);
  btn.disabled = true;
  btn.firstChild.textContent = 'Sending… ';
  setTimeout(() => {
    const first = $('[name="name"]', form).value.trim().split(' ')[0];
    form.classList.add('is-sent');
    status.textContent = `Thanks, ${first}. An engineer — not a sales team — will reply within two working days.`;
    btn.disabled = false;
    btn.firstChild.textContent = 'Send brief ';
    form.reset();
    $$('input, textarea', form).forEach((f) => { delete f.dataset.touched; f.removeAttribute('aria-invalid'); });
  }, 900);
});

/* ---------- office clocks + dates ---------- */
const clocks = $$('[data-tz]');
function tickClocks() {
  const now = new Date();
  clocks.forEach((el) => {
    el.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.tz }).format(now);
  });
}
tickClocks();
setInterval(tickClocks, 20000);
const today = new Date();
$$('[data-year]').forEach((el) => { el.textContent = today.getFullYear(); });
$$('[data-today]').forEach((el) => { el.textContent = today.toLocaleDateString('en-GB').replace(/\//g, '.'); });

/* ---------- refresh once everything has settled ---------- */
if (ScrollTrigger) {
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
