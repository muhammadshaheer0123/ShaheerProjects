import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { profile, rooms, corridor, expertise, disciplines, projects, experience, education, leadership, activities, community } from './content';
import ProjectDrawing from './ProjectDrawing';

const CorridorScene = lazy(() => import('./CorridorScene'));

const STEPS = ['Surveying the site', 'Casting the floor slab', 'Erecting steel frames', 'Hanging the drawings', 'Opening the doors'];

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
const lowPower = typeof navigator !== 'undefined' && (
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
);

function waitForFonts() {
  if (!document.fonts?.load) return Promise.resolve();
  const fonts = Promise.all([
    document.fonts.load('600 64px "IBM Plex Mono"'),
    document.fonts.load('700 64px "Archivo"'),
    document.fonts.load('800 64px "Archivo"'),
  ]);
  return Promise.race([fonts, new Promise(r => setTimeout(r, 1800))]);
}

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const clampZ = z => Math.min(corridor.start, Math.max(corridor.end, z));

/* ------------------------------------------------------------------ */

function Preloader({ ready, onDone }) {
  const [pct, setPct] = useState(0);
  const [hidden, setHidden] = useState(false);
  const startRef = useRef(0);
  useEffect(() => {
    let raf;
    if (!startRef.current) startRef.current = performance.now();
    const start = startRef.current;
    const tick = now => {
      const timed = Math.min(1, (now - start) / 1800);
      const next = Math.min(timed, ready ? 1 : 0.9);
      setPct(next);
      if (next < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);
  useEffect(() => {
    if (pct < 1) return;
    const t = setTimeout(() => { setHidden(true); onDone(); }, 350);
    return () => clearTimeout(t);
  }, [pct, onDone]);

  const step = STEPS[Math.min(STEPS.length - 1, Math.floor(pct * STEPS.length))];
  return (
    <div className={`preloader ${pct >= 1 ? 'is-done' : ''} ${hidden ? 'is-hidden' : ''}`} role="status" aria-live="polite">
      <div className="preloader__inner">
        <div className="preloader__mark" aria-hidden="true">
          <span style={{ transform: `scaleY(${pct})` }} />
          {profile.initials}
        </div>
        <p className="mono preloader__step">{step}…</p>
        <div className="preloader__bar"><span style={{ transform: `scaleX(${pct})` }} /></div>
        <p className="mono preloader__pct">{String(Math.round(pct * 100)).padStart(3, '0')}%</p>
      </div>
    </div>
  );
}

function Header({ blueprint, onToggleBlueprint, onHome, onRoom, activeRoom }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={e => { e.preventDefault(); onHome(); }}>
        <span className="brand__mark" aria-hidden="true">{profile.initials}</span>
        <span className="brand__text">
          <strong>{profile.name}</strong>
          <span className="mono">{profile.title}</span>
        </span>
      </a>
      <nav className="site-nav" aria-label="Rooms">
        {rooms.map(r => (
          <a key={r.id} href={`#${r.id}`} aria-current={activeRoom === r.id ? 'page' : undefined}
            onClick={e => { e.preventDefault(); onRoom(r.id); }}>{r.label}</a>
        ))}
        <a className="nav-cv" href={profile.cv} download="Muhammad_Shaheer_CV.pdf" aria-label="Download CV (PDF)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" /></svg>
          <span className="nav-cv__long">Download CV</span><span className="nav-cv__short">CV</span>
        </a>
      </nav>
      <button type="button" className={`toggle ${blueprint ? 'is-on' : ''}`} onClick={onToggleBlueprint} aria-pressed={blueprint}>
        <span className="toggle__dot" aria-hidden="true" />
        <span className="mono">Blueprint</span>
      </button>
    </header>
  );
}

// Floor plan of the corridor. The camera marker is moved directly via a ref.
function FloorPlan({ camZ, onRoom, activeRoom }) {
  const marker = useRef(null);
  const W = 260, H = 96, pad = 12;
  const zToX = z => pad + ((corridor.start + 2 - z) / (corridor.start + 2 - (corridor.end - 4))) * (W - pad * 2);
  useEffect(() => {
    let raf;
    const tick = () => {
      if (marker.current) marker.current.setAttribute('transform', `translate(${zToX(camZ.current)} ${H / 2})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });
  return (
    <figure className="plan" aria-label="Floor plan">
      <svg viewBox={`0 0 ${W} ${H}`} role="group">
        <rect x={pad} y={H / 2 - 9} width={W - pad * 2} height={18} className="plan__corridor" />
        {rooms.map(r => {
          const x = zToX(r.z);
          const up = r.side === 'left';
          return (
            <g key={r.id} className={`plan__room ${activeRoom === r.id ? 'is-active' : ''}`} onClick={() => onRoom(r.id)}
              role="button" tabIndex={0} aria-label={`Enter ${r.label}`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRoom(r.id); } }}>
              <rect x={x - 22} y={up ? 6 : H / 2 + 11} width={44} height={H / 2 - 17} />
              <line x1={x - 6} x2={x + 6} y1={up ? H / 2 - 9 : H / 2 + 9} y2={up ? H / 2 - 9 : H / 2 + 9} className="plan__door" />
              <text x={x} y={up ? 22 : H - 14} textAnchor="middle">{r.number}</text>
            </g>
          );
        })}
        <g ref={marker} className="plan__cam"><path d="M5 -5 L-6 0 L5 5 Z" /></g>
      </svg>
      <figcaption className="mono">Ground floor plan · 1:500</figcaption>
    </figure>
  );
}

/* ---------------- room panels ---------------- */

function RoomHead({ room, title }) {
  return (
    <div className="section-head">
      <p className="eyebrow mono"><span className="tri" aria-hidden="true" />Room {room.number} · {room.label}</p>
      <h2>{title}</h2>
    </div>
  );
}

function AboutRoom({ room }) {
  return (
    <>
      <div className="about-top">
        <img src={profile.portrait} alt={`Portrait of ${profile.name}`} className="portrait" width="160" height="200" />
        <div>
          <RoomHead room={room} title="Every structure starts below ground." />
          <p className="mono about-focus">{profile.focus}</p>
        </div>
      </div>
      {profile.about.map(p => <p key={p.slice(0, 24)}>{p}</p>)}
      <dl className="stats">
        {profile.stats.map(s => <div key={s.label}><dt>{s.value}</dt><dd className="mono">{s.label}</dd></div>)}
      </dl>
      <h3 className="sub mono">Expertise</h3>
      <ul className="columns">
        {expertise.map(x => (
          <li key={x.code}>
            <div className="col-head">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="col-icon"><path d={EXPERTISE_ICONS[x.icon]} /></svg>
            </div>
            <h4>{x.title}</h4>
            <p>{x.body}</p>
            <ul className="chips">{x.tools.map(t => <li key={t} className="mono">{t}</li>)}</ul>
          </li>
        ))}
      </ul>
      <h3 className="sub mono">Experience</h3>
      <Timeline entries={experience} />
      <h3 className="sub mono">Education</h3>
      <Timeline entries={education} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Room panel motion: reveal-on-scroll, cursor lamp, hover lift        */
/* ------------------------------------------------------------------ */

const REVEAL_SELECTOR = '.about-top, .stats > div, .columns, .timeline > li, .register > li, .activities > li, .contact__list > li';
const LAMP_SELECTOR = '.columns > li, .project, .activities > li, .timeline > li, .stats > div, .contact-card';

function usePanelMotion(panelRef, progressRef, roomId) {
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const setProgress = p => {
      progressRef.current = p;
      panel.style.setProperty('--progress', p.toFixed(4));
    };
    setProgress(0);

    // the 3D camera pans along the room wall with the panel's scroll progress
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = panel.scrollHeight - panel.clientHeight;
        setProgress(max > 0 ? Math.min(1, panel.scrollTop / max) : 0);
      });
    };
    panel.addEventListener('scroll', onScroll, { passive: true });

    // blocks rise in as they enter the panel; siblings stagger by 60 ms, capped at four steps
    let io = null;
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      const items = [...panel.querySelectorAll(REVEAL_SELECTOR)];
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.dataset.reveal = 'in';
          io.unobserve(e.target);
        });
      }, { root: panel, rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
      items.forEach(el => {
        const i = [...el.parentElement.children].indexOf(el);
        el.style.setProperty('--reveal-delay', `${(i % 4) * 60}ms`);
        el.dataset.reveal = 'wait';
        io.observe(el);
      });
    }

    // site lamp: light follows the mouse across cards; project cards also tilt toward it
    let lit = null;
    const douse = () => {
      if (!lit) return;
      ['--mx', '--my', '--rx', '--ry'].forEach(v => lit.style.removeProperty(v));
      lit = null;
    };
    const onMove = e => {
      if (e.pointerType !== 'mouse') return;
      const card = e.target.closest?.(LAMP_SELECTOR);
      if (card !== lit) douse();
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      if (!prefersReducedMotion && card.classList.contains('project')) {
        card.style.setProperty('--rx', `${((0.5 - y / r.height) * 5).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${((x / r.width - 0.5) * 7).toFixed(2)}deg`);
      }
      lit = card;
    };
    panel.addEventListener('pointermove', onMove);
    panel.addEventListener('pointerleave', douse);

    // touch screens have no hover: cards rise continuously as they approach the middle of the
    // panel and settle as they leave, tracking the scroll itself (no on/off jumps)
    let popRaf = 0;
    let onPopScroll = null;
    if (!prefersReducedMotion && window.matchMedia('(hover: none)').matches) {
      const update = () => {
        popRaf = 0;
        // re-read each frame: filtering the Projects room swaps its cards
        const cards = [...panel.querySelectorAll(LAMP_SELECTOR)];
        const box = panel.getBoundingClientRect();
        const mid = box.top + box.height / 2;
        const reach = box.height * 0.55;
        // read every position first, then write, so the browser lays out once per frame
        const rects = cards.map(c => c.getBoundingClientRect());
        rects.forEach((r, i) => {
          const d = Math.min(1, Math.abs(r.top + r.height / 2 - mid) / reach);
          const p = 1 - d * d * (3 - 2 * d); // smoothstep: 1 at the middle, easing to 0 at the edges
          cards[i].style.setProperty('--pop', p.toFixed(3));
        });
      };
      onPopScroll = () => { if (!popRaf) popRaf = requestAnimationFrame(update); };
      panel.addEventListener('scroll', onPopScroll, { passive: true });
      update();
    }

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(popRaf);
      io?.disconnect();
      if (onPopScroll) panel.removeEventListener('scroll', onPopScroll);
      panel.removeEventListener('scroll', onScroll);
      panel.removeEventListener('pointermove', onMove);
      panel.removeEventListener('pointerleave', douse);
      douse();
      progressRef.current = 0;
    };
  }, [panelRef, progressRef, roomId]);
}

function Timeline({ entries }) {
  return (
    <ol className="timeline">
      {entries.map(e => (
        <li key={e.period + e.role}>
          <span className="timeline__elev mono"><span className="tri" aria-hidden="true" />{e.elevation}</span>
          <div>
            <p className="mono timeline__period">{e.period}</p>
            <h4>{e.role}</h4>
            <p className="timeline__org">{e.org}</p>
            {e.points.length > 0 && <ul>{e.points.map(pt => <li key={pt}>{pt}</li>)}</ul>}
            {e.photos?.length > 0 && (
              <div className="timeline__photos">
                {e.photos.map(ph => <PhotoLink key={ph.src} photo={ph} className={ph.fit === 'contain' ? 'is-contain' : undefined} />)}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

const metaLine = (...parts) => parts.filter(Boolean).join(' · ');

function ProjectsRoom({ room, onOpen }) {
  const [filter, setFilter] = useState('All');
  const sections = filter === 'All' ? disciplines : disciplines.filter(d => d.name === filter);
  return (
    <>
      <RoomHead room={room} title="Drawing register: selected work." />
      <div className="filters" role="group" aria-label="Filter projects by discipline">
        {['All', ...disciplines.map(d => d.name)].map(c => (
          <button key={c} type="button" className={`chip-btn mono ${filter === c ? 'is-on' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      {sections.map(d => {
        const list = projects.filter(p => p.category === d.name);
        return (
          <section key={d.name} className="discipline" aria-label={d.name}>
            <h3 className="sub mono">
              {d.name}
              <span className="discipline__count">{list.length ? `${list.length} ${list.length === 1 ? 'sheet' : 'sheets'}` : 'Reserved'}</span>
            </h3>
            {list.length ? (
              <ul className="register">
                {list.map(p => (
                  <li key={p.id}>
                    <button type="button" className="project" onClick={() => onOpen(p)}>
                      {p.images?.length
                        ? <img className="project__cover" src={p.images[0].src} alt="" loading="lazy" />
                        : <ProjectDrawing type={p.drawing} title={p.title} />}
                      <span className="project__sheet mono">{p.sheet}</span>
                      <span className="project__body">
                        <strong>{p.title}</strong>
                        <span className="mono">{metaLine(p.location, p.year)}</span>
                        <span className="project__role">{p.role}</span>
                      </span>
                      <span className="project__open mono" aria-hidden="true">Open sheet →</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="register-empty mono">Sheet {d.series} reserved for upcoming {d.name.toLowerCase()} work.</p>
            )}
          </section>
        );
      })}
    </>
  );
}

// Contact icons: outline marks on the same 24px grid and stroke as the rest
const CONTACT_ICONS = {
  mail: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM22 7.5l-10 6.5L2 7.5',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4a2 2 0 1 1 0-4z',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4zM17.5 6.5h.01',
};

// Expertise line icons: same 24px grid and stroke as the activity icons
const EXPERTISE_ICONS = {
  // gable portal frame with a tie beam
  frame: 'M2.5 21h19M5 21V10M19 21V10M3.5 11L12 4.5l8.5 6.5M5 14.5h14',
  // lattice platform / derrick on a skid
  platform: 'M3 21h18M6 21l3.5-15h5L18 21M9.5 6L12 2.5 14.5 6M8 13.5h8M7.2 17h9.6M8.4 13.5l7.2 3.5',
  // bolted end plate with four bolts
  connection: 'M5 3.5h14v17H5zM9 8a1 1 0 1 0 0 .01M15 8a1 1 0 1 0 0 .01M9 16a1 1 0 1 0 0 .01M15 16a1 1 0 1 0 0 .01M3 12h18',
  // hard hat
  helmet: 'M3 17.5h18M5 17.5a7 7 0 0 1 14 0M12 6.5V10M9 7.3l.9 3M15 7.3l-.9 3M4 20h16',
  // programme bars on a time axis
  schedule: 'M4 3.5v17h16.5M8 7.5h5M10.5 11.5h6.5M7 15.5h4.5M15 15.5h3',
  // drafting set square with its cut-out
  drafting: 'M4 20.5V4l16.5 16.5H4zM8 16.5v-4.3l4.3 4.3H8z',
};

const ACTIVITY_ICONS = {
  truss: 'M2 18h20M4 18l4-8 4 8 4-8 4 8M8 10h8',
  people: 'M8 11a3 3 0 100-6 3 3 0 000 6zM16 11a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5M12 20c0-3 2-5 4-5s6 2 6 5',
  helmet: 'M3 17h18M5 17a7 7 0 0114 0M12 6v4M9 7l1 3M15 7l-1 3',
  hands: 'M4 13l4 4 4-2 4 2 4-4M8 11l4-4 4 4M12 7v10',
  cricket: 'M4 20l9-9M13 11l3-3 4 4-3 3zM6 6a2 2 0 100-4 2 2 0 000 4z',
  cert: 'M5 3h14v12H5zM9 7h6M9 10h6M10 15l-2 6 4-2 4 2-2-6',
};

function PhotoLink({ photo, className }) {
  return (
    <a href={photo.src} target="_blank" rel="noreferrer" className={className} aria-label={`Open full size: ${photo.caption}`}>
      <img src={photo.src} alt={photo.caption} loading="lazy" />
    </a>
  );
}

function ActivitiesRoom({ room }) {
  return (
    <>
      <RoomHead room={room} title="Beyond the drawings." />
      <p>My years with the ASCE-NUCES student chapter, from member to senior vice president, the international conference, seminars and site visits I managed and photographed, and my volunteer work with Rescue 1122.</p>
      <h3 className="sub mono">ASCE-NUCES: member to senior vice president</h3>
      <ol className="timeline">
        {leadership.map(l => (
          <li key={l.role}>
            <span className="timeline__elev mono"><span className="tri" aria-hidden="true" />{l.elevation}</span>
            <div className={l.photo ? 'role role--photo' : 'role'}>
              <div>
                {l.period && <p className="mono timeline__period">{l.period}</p>}
                <h4>{l.role}</h4>
                <p className="timeline__org">{l.org}</p>
                <ul>{l.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
              </div>
              {l.photo && <PhotoLink photo={{ src: l.photo, caption: `${l.role}, ${l.org}` }} className="role__photo" />}
            </div>
          </li>
        ))}
      </ol>
      <h3 className="sub mono">Events & site visits</h3>
      <ul className="activities">{activities.map(a => <ActivityCard key={a.title} activity={a} />)}</ul>
      <h3 className="sub mono">Community service</h3>
      <ul className="activities">{community.map(a => <ActivityCard key={a.title} activity={a} />)}</ul>
    </>
  );
}

function ActivityCard({ activity: a }) {
  return (
    <li className={a.featured ? 'is-featured' : undefined}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="activity__icon"><path d={ACTIVITY_ICONS[a.icon]} /></svg>
      <div>
        <p className="mono activity__meta">{metaLine(a.role, a.period)}</p>
        <h4>{a.title}</h4>
        <p>{a.body}</p>
        {a.points && <ul className="scope activity__points">{a.points.map(pt => <li key={pt}>{pt}</li>)}</ul>}
      </div>
      {a.photos?.length > 0 && (
        <div className="activity__photos">
          {a.photos.map(ph => <PhotoLink key={ph.src} photo={ph} className={ph.wide ? 'is-wide' : undefined} />)}
        </div>
      )}
    </li>
  );
}

function ContactRoom({ room }) {
  const [sent, setSent] = useState(false);
  const onSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `${data.get('type')} enquiry from ${data.get('name')}`;
    const body = `${data.get('message')}\n\n${data.get('name')} (${data.get('email')})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <>
      <RoomHead room={room} title="Let's build what's next." />
      <p>Have a structure to design, a site that needs supervising, or quantities that need checking? Send the brief and I'll reply within two working days.</p>
      <ul className="contact-cards">
        {profile.links.map(l => {
          const external = !l.href.startsWith('mailto');
          return (
            <li key={l.label}>
              <a
                className="contact-card"
                href={l.href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={`${l.label}: ${l.handle}${external ? ' (opens in a new tab)' : ''}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="col-icon"><path d={CONTACT_ICONS[l.icon]} /></svg>
                <span className="contact-card__text">
                  <strong>{l.label}</strong>
                  <span className="mono">{l.handle}</span>
                </span>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="contact-card__go"><path d="M7 17L17 7M9 7h8v8" /></svg>
              </a>
            </li>
          );
        })}
      </ul>
      <ul className="contact__list">
        {profile.phone && <li><span className="mono">Phone</span><a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a></li>}
        <li><span className="mono">Based</span><span>{profile.location}</span></li>
      </ul>
      <form className="contact-form" onSubmit={onSubmit}>
        <div className="field-row">
          <label><span className="mono">Name</span><input name="name" required autoComplete="name" /></label>
          <label><span className="mono">Email</span><input name="email" type="email" required autoComplete="email" /></label>
        </div>
        <label>
          <span className="mono">Project type</span>
          <select name="type" defaultValue="Structural design">
            <option>Structural design</option>
            <option>Site supervision</option>
            <option>Quantity surveying / BOQ</option>
            <option>Planning & scheduling</option>
            <option>Full-time role</option>
            <option>Other</option>
          </select>
        </label>
        <label><span className="mono">Message</span><textarea name="message" rows={4} required placeholder="Site, scope, timeline…" /></label>
        <button type="submit" className="btn btn--accent">{sent ? 'Opening your mail app…' : 'Send enquiry'}</button>
      </form>
      <footer className="footer mono">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>3D experience adapted from <a href="https://github.com/ITomPoland/portfolio-itom" target="_blank" rel="noopener noreferrer">ITom's open-source portfolio</a> (MIT)</span>
      </footer>
    </>
  );
}

function ProjectSheet({ project, onClose }) {
  const closeRef = useRef(null);
  const images = project.images || [];
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <article className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" onClick={e => e.stopPropagation()}>
        <div className="sheet__top">
          <p className="mono">Sheet {project.sheet} · {project.category}</p>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close project">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        {images.length
          ? <img className="sheet__cover" src={images[0].src} alt={images[0].caption} />
          : <div className="sheet__drawing"><ProjectDrawing type={project.drawing} title={project.title} /></div>}
        <h3 id="sheet-title">{project.title}</h3>
        <p className="sheet__meta mono">{metaLine(project.location, project.year, project.role)}</p>
        <p>{project.summary}</p>
        <dl className="figures">
          {project.figures.map(f => <div key={f.label}><dt className="mono">{f.label}</dt><dd>{f.value}</dd></div>)}
        </dl>
        {project.abstract && (
          <>
            <h4 className="mono">Abstract</h4>
            {project.abstract.map(para => <p key={para.slice(0, 24)}>{para}</p>)}
          </>
        )}
        <h4 className="mono">Scope of work</h4>
        <ul className="scope">{project.scope.map(s => <li key={s}>{s}</li>)}</ul>
        {project.conclusions && (
          <>
            <h4 className="mono">Conclusions</h4>
            <ul className="scope">{project.conclusions.map(c => <li key={c}>{c}</li>)}</ul>
          </>
        )}
        {images.length > 1 && (
          <>
            <h4 className="mono">Model & results</h4>
            <div className="gallery">
              {images.slice(1).map(img => (
                <figure key={img.src} className={img.wide ? 'is-wide' : undefined}>
                  <a href={img.src} target="_blank" rel="noreferrer" aria-label={`Open full size: ${img.caption}`}>
                    <img src={img.src} alt={img.caption} loading="lazy" />
                  </a>
                  <figcaption className="mono">{img.caption}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
        <div className="title-block mono" aria-hidden="true">
          <span>Drawn: {profile.initials}</span><span>Checked: {profile.initials}</span><span>Rev: A</span><span>Scale: NTS</span>
        </div>
      </article>
    </div>
  );
}

const ROOM_VIEWS = { about: AboutRoom, projects: ProjectsRoom, activities: ActivitiesRoom, contact: ContactRoom };

/* ------------------------------------------------------------------ */

export default function CivilApp() {
  const [sceneReady, setSceneReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [blueprint, setBlueprint] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);   // room the camera is heading into / inside
  const [panelRoom, setPanelRoom] = useState(null);     // room whose panel is shown
  const [openProject, setOpenProject] = useState(null);
  const [sceneFailed, setSceneFailed] = useState(() => typeof window !== 'undefined' && !webglAvailable());
  const zTarget = useRef(corridor.start);
  const camZ = useRef(corridor.start + 3);
  const introRef = useRef(null);
  const shadeRef = useRef(null);
  const hintRef = useRef(null);
  const panelRef = useRef(null);
  const panelScroll = useRef(0);
  const lookYaw = useRef(0);                              // touch look-around in the corridor (radians)
  const [nearDoor, setNearDoor] = useState(null);         // room whose door the visitor is standing at
  const busy = activeRoom !== null;

  useEffect(() => { waitForFonts().then(() => setFontsReady(true)); }, []);

  // Walk the corridor: wheel, touch drag and keyboard move the camera target
  useEffect(() => {
    if (!started || busy || sceneFailed) return;
    const walk = d => { zTarget.current = clampZ(zTarget.current - d); };
    const onWheel = e => {
      if (e.target.closest?.('.panel, .sheet')) return;
      e.preventDefault();
      walk((e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) * 0.012);
    };
    // Touch: the first 10 px of a swipe lock its axis. Up/down walks; left/right looks around
    // (not from the outer 24 px, where the phone's own back gesture lives).
    let start = null;
    let last = null;
    let axis = null;
    const onTouchStart = e => {
      const t = e.touches[0];
      start = { x: t.clientX, y: t.clientY, edge: t.clientX < 24 || t.clientX > window.innerWidth - 24 };
      last = { x: t.clientX, y: t.clientY };
      axis = null;
    };
    const onTouchMove = e => {
      if (!start || e.target.closest?.('.panel, .sheet, .site-header, .door-pill')) return;
      const t = e.touches[0];
      if (!axis) {
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.hypot(dx, dy) < 10) return;
        axis = Math.abs(dx) > Math.abs(dy) * 1.2 && !start.edge ? 'x' : 'y';
      }
      if (axis === 'y') walk((last.y - t.clientY) * 0.035);
      else lookYaw.current = Math.max(-1.2, Math.min(1.2, lookYaw.current + (t.clientX - last.x) * 0.0045));
      last = { x: t.clientX, y: t.clientY };
    };
    const onKey = e => {
      if (e.target.closest?.('input, textarea, select')) return;
      if (['ArrowUp', 'w', 'W', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); walk(e.key === 'PageDown' || e.key === ' ' ? 6 : 1.5); }
      if (['ArrowDown', 's', 'S', 'PageUp'].includes(e.key)) { e.preventDefault(); walk(e.key === 'PageUp' ? -6 : -1.5); }
      if (e.key === 'Home') zTarget.current = corridor.start;
      if (e.key === 'End') zTarget.current = corridor.end;
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [started, busy, sceneFailed]);

  // Fade the intro (and the shade behind it) as the visitor walks away from the lobby.
  // On phones the walk hint takes the intro's place once it has faded.
  useEffect(() => {
    let raf;
    let near = null;
    const phone = window.matchMedia('(max-width: 760px)');
    const tick = () => {
      // which door, if any, the visitor is standing beside (drives the touch "Enter" button)
      const at = rooms.find(r => Math.abs(camZ.current - r.z) < 3.2)?.id ?? null;
      if (at !== near) { near = at; setNearDoor(at); }
      const o = Math.max(0, Math.min(1, (camZ.current - (corridor.start - 5)) / 4));
      if (introRef.current) {
        introRef.current.style.opacity = String(o);
        introRef.current.style.visibility = o < 0.02 ? 'hidden' : 'visible';
      }
      if (shadeRef.current) shadeRef.current.style.opacity = String(o);
      if (hintRef.current) hintRef.current.style.opacity = phone.matches ? String(1 - o) : '';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = blueprint ? 'blueprint' : 'site';
  }, [blueprint]);

  const enterRoom = useCallback(id => {
    setOpenProject(null);
    lookYaw.current = 0;
    if (sceneFailed) { setActiveRoom(id); setPanelRoom(id); return; }
    if (activeRoom === id) return;
    setPanelRoom(null);
    setActiveRoom(id);
  }, [activeRoom, sceneFailed]);

  const leaveRoom = useCallback(() => {
    setOpenProject(null);
    setPanelRoom(null);
    setActiveRoom(null);
  }, []);

  const goHome = useCallback(() => {
    if (activeRoom) leaveRoom();
    zTarget.current = corridor.start;
  }, [activeRoom, leaveRoom]);

  // Esc leaves the room
  useEffect(() => {
    if (!panelRoom) return;
    const onKey = e => { if (e.key === 'Escape') leaveRoom(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panelRoom, leaveRoom]);

  // Deep links (#about etc.) and hash sync
  useEffect(() => {
    if (!started) return;
    const id = window.location.hash.slice(1);
    if (rooms.some(r => r.id === id)) enterRoom(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);
  useEffect(() => {
    if (!started) return;
    history.replaceState(null, '', panelRoom ? `#${panelRoom}` : window.location.pathname);
  }, [panelRoom, started]);

  const onReady = useCallback(() => setSceneReady(true), []);
  const onFailure = useCallback(() => setSceneFailed(true), []);
  const onLoaded = useCallback(() => setStarted(true), []);
  const onArrive = useCallback(id => setPanelRoom(id), []);
  const onExited = useCallback(() => {}, []);

  const room = rooms.find(r => r.id === panelRoom);
  const RoomView = room ? ROOM_VIEWS[room.id] : null;
  usePanelMotion(panelRef, panelScroll, room?.id);

  return (
    <div className={`app ${started ? 'is-started' : ''} ${panelRoom ? 'in-room' : ''}`}>
      {!sceneFailed && fontsReady && (
        <Suspense fallback={null}>
          <CorridorScene
            blueprint={blueprint}
            lowPower={lowPower}
            reducedMotion={prefersReducedMotion}
            started={started}
            zTarget={zTarget}
            camZ={camZ}
            activeRoom={activeRoom}
            onSelectRoom={enterRoom}
            onArrive={onArrive}
            onExited={onExited}
            onReady={onReady}
            onFailure={onFailure}
            panelScroll={panelScroll}
            lookYaw={lookYaw}
          />
        </Suspense>
      )}
      {sceneFailed && <div className="scene scene--fallback" aria-hidden="true" />}
      <div ref={shadeRef} className="scene-shade" aria-hidden="true" />

      <Preloader ready={sceneReady || sceneFailed} onDone={onLoaded} />
      <Header blueprint={blueprint} onToggleBlueprint={() => setBlueprint(b => !b)} onHome={goHome} onRoom={enterRoom} activeRoom={panelRoom} />

      <main>
        <section ref={introRef} className="intro" aria-labelledby="intro-title">
          <p className="eyebrow mono"><span className="tri" aria-hidden="true" />Portfolio · {profile.title}</p>
          <h1 id="intro-title"><span>{profile.firstName}</span><span>{profile.lastName}</span></h1>
          <p className="intro__lede">{profile.intro}</p>
          <p className="intro__focus mono">{profile.focus}</p>
          <div className="intro__actions">
            <button type="button" className="btn btn--accent" onClick={() => { zTarget.current = clampZ(-3); }}>Start walking</button>
            <button type="button" className="btn btn--ghost" onClick={() => enterRoom('projects')}>View projects</button>
          </div>
        </section>

        {!panelRoom && !busy && started && !(coarsePointer && nearDoor) && (
          <div ref={hintRef} className="walk-hint mono" aria-hidden="true">
            <span className="walk-hint__mouse"><span /></span>
            {coarsePointer ? 'Swipe up to walk · swipe sideways to look' : 'Scroll or drag to walk · click a door to enter'}
          </div>
        )}
        {/* touch screens: a thumb-sized way in whenever the visitor is standing at a door */}
        {coarsePointer && started && !busy && nearDoor && (
          <button type="button" className="door-pill" onClick={() => enterRoom(nearDoor)}>
            <span className="mono">{rooms.find(r => r.id === nearDoor).number}</span>
            Enter {rooms.find(r => r.id === nearDoor).label}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </button>
        )}

        {room && (
          <section ref={panelRef} key={room.id} className={`panel panel--room room--${room.id}`} aria-labelledby="room-title" id={room.id}>
            <button type="button" className="back-btn mono" onClick={leaveRoom}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              Back to corridor
            </button>
            <div id="room-title" className="sr-only-seo">{room.label}</div>
            <RoomView room={room} onOpen={setOpenProject} />
          </section>
        )}
      </main>

      {started && <FloorPlan camZ={camZ} onRoom={enterRoom} activeRoom={panelRoom} />}
      {openProject && <ProjectSheet project={openProject} onClose={() => setOpenProject(null)} />}
    </div>
  );
}
