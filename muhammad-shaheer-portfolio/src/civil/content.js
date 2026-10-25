// All portfolio copy lives here. Edit this file to update the site —
// no component changes are needed.
// Profile, experience and activities follow Muhammad Shaheer's CV.
// NOTE: projects S-103 onwards are starter placeholders, not real work.

export const profile = {
  name: 'Muhammad Shaheer',
  firstName: 'Muhammad',
  lastName: 'Shaheer',
  initials: 'MS',
  title: 'Civil Engineer',
  focus: 'Structural analysis & design · Steel & RC structures · Construction supervision',
  location: 'Lahore, Pakistan',
  email: 'muhammad.shaheer26@hotmail.com',
  // Leave empty to hide the phone line on the Contact panel
  phone: '',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-shaheer-828336291' },
    { label: 'Email', href: 'mailto:muhammad.shaheer26@hotmail.com' },
  ],
  intro:
    'I design steel and reinforced-concrete structures, from oil and gas skids to high-rise frames, and check them against ACI and AISC.',
  greeting: "Hi, I'm Shaheer!",
  greetingSub: 'Scroll to walk the corridor',
  // Hallway figure behind the reception counter: a transparent cut-out from helmet to upper thigh
  avatar: '/avatar/shaheer-hallway.webp',
  portrait: '/avatar/shaheer-portrait.jpg',
  about: [
    'I am a civil engineering graduate from FAST-NUCES Lahore (2022–2026), now working as a Trainee Structural Engineer at Deomar Engineering. There I design oil and gas structures such as skids, platforms and sheds in STAAD Pro, design their foundations in STAAD Foundation, and prepare BOQs, material take-offs and bidding documents.',
    'Before that I saw construction up close: supervising excavation, reinforcement and concrete quality on a five-basement high-rise with Ittefaq Group, and supporting the Tarbela 5th Extension Project with WAPDA. I model in ETABS, SAP2000 and STAAD Pro, design to ACI and AISC, and like checking the numbers against reality. My final-year project measured a steel frame’s vibration with Arduino sensors and validated it against a finite element model.',
  ],
  stats: [
    { value: '15', label: 'Storey RC tower designed' },
    { value: '5', label: 'Basement high-rise supervised' },
    { value: '3', label: 'Industry roles' },
  ],
};

// The four doors along the corridor. `z` is the door's position down the
// corridor (metres, negative = further in); `side` is the wall it sits in.
// Walkable range of the corridor camera (metres along -z)
export const corridor = { start: 9, end: -47 };

export const rooms = [
  { id: 'about', number: '01', label: 'About Me', side: 'left', z: -7 },
  { id: 'projects', number: '02', label: 'Projects', side: 'right', z: -18 },
  { id: 'activities', number: '03', label: 'Extracurricular', side: 'left', z: -29 },
  { id: 'contact', number: '04', label: 'Contact', side: 'right', z: -40 },
];

export const expertise = [
  {
    code: 'C1',
    title: 'Structural analysis & design',
    body: 'Reinforced-concrete and steel buildings modelled, analysed and designed to ACI 318 and AISC 360, including slabs, frames, shear walls and foundations.',
    tools: ['ETABS', 'SAP2000', 'STAAD Pro', 'SAFE'],
  },
  {
    code: 'C2',
    title: 'Oil & gas structures',
    body: 'Skids, platforms and sheds for oil and gas facilities, with their foundations, designed to the applicable engineering standards.',
    tools: ['STAAD Pro', 'STAAD Foundation'],
  },
  {
    code: 'C3',
    title: 'Steel connection design',
    body: 'Base plates, bolted cleats and moment end plates verified with component-based finite element analysis to AISC LRFD.',
    tools: ['IDEA StatiCa'],
  },
  {
    code: 'C4',
    title: 'Construction supervision',
    body: 'Excavation, reinforcement fixing and concrete quality control (sampling, curing and cube testing), plus IFC drawing review.',
    tools: ['Concrete QC', 'Cube testing', 'IFC review'],
  },
  {
    code: 'C5',
    title: 'Planning, BOQ & bidding',
    body: 'Baselined schedules with WBS, activity sequencing and resources; BOQs, material take-offs and bidding documents.',
    tools: ['Primavera P6', 'MS Excel'],
  },
  {
    code: 'C6',
    title: 'Drafting, BIM & programming',
    body: 'Drawings, BIM models and GIS, plus Python, C++ and Arduino-based sensing for structural monitoring.',
    tools: ['AutoCAD', 'Revit', 'ArcGIS', 'Python', 'Arduino'],
  },
];

// `drawing` picks the line drawing shown for each project:
// frame | bridge | road | wall | tank | foundation
// Optional: `images` (first one becomes the card cover; `wide: true` spans the
// full gallery width), `abstract` paragraphs and a `conclusions` list.
// Leave `location` / `year` empty to hide them.
export const projects = [
  {
    id: 'etabs-15-storey-residential',
    sheet: 'S-100',
    title: '15-Storey RC Residential Building',
    category: 'Structural',
    location: '',
    year: '2026',
    role: 'Structural analysis & design (ETABS)',
    drawing: 'frame',
    summary:
      'Analysis and design of a fifteen-storey reinforced-concrete residential tower with one basement, modelled in ETABS and designed to ACI 318-19. A dual system of RC frames and shear walls carries gravity, wind and seismic loads.',
    abstract: [
      'The building uses a dual system of reinforced-concrete frames and shear walls to resist gravity, wind and seismic forces. Waffle, ribbed, flat and solid slab systems were used across different levels to suit both functional and structural needs. Initial sizes for slabs, beams, columns and shear walls came from standard span-to-depth ratios and practical design guidelines.',
      'The ETABS model defined material properties, load conditions, stiffness modifiers and serviceability criteria such as storey drift and deflection limits. Wind and earthquake analyses checked the building under lateral load, and the final design met the required strength, stiffness, safety and cost-effectiveness for every structural element, in full compliance with the relevant design standards.',
    ],
    scope: [
      'ETABS model with material properties, load cases and stiffness modifiers',
      'Dual system: RC moment frames with shear-wall cores and L-walls',
      'Waffle, ribbed, flat and solid slabs selected level by level',
      'Preliminary sizing of slabs, beams, columns and walls from span-to-depth ratios',
      'Wind and earthquake analysis with storey drift and displacement checks',
      'Design of all members to ACI 318-19',
      'Foundation design in SAFE',
    ],
    conclusions: [
      'The frame and shear-wall system performed well under gravity, wind and seismic loads, and every member met ACI 318-19 strength requirements.',
      'Maximum roof displacement was 51.28 mm in X and 41.13 mm in Y, well within the 126 mm (L/500) limit, with a smooth, stable profile from base to roof.',
      'Storey drift stayed within seismic code limits over the full height; the shear walls effectively controlled lateral movement.',
      'Base reactions of about 8,052 kN laterally (X and Y) and 222,842 kN vertically confirm a safe load path to the foundation, and base moments confirm resistance to overturning.',
      'Combining waffle, ribbed, flat and solid slabs gave a functional and economical layout.',
      'The final design is safe, stable and economical for high-rise residential use.',
    ],
    figures: [
      { label: 'Storeys', value: '15 + basement' },
      { label: 'Roof displacement X / Y', value: '51.3 / 41.1 mm' },
      { label: 'Allowable (L/500)', value: '126 mm' },
    ],
    images: [
      { src: '/projects/etabs-15-storey/plan-and-3d-model.png', caption: 'Story 1 plan and 3D ETABS model' },
      { src: '/projects/etabs-15-storey/shear-wall-layout.png', caption: 'Shear-wall layout: Story 16 plan and 3D view', wide: true },
      { src: '/projects/etabs-15-storey/deformed-shape.png', caption: 'Deformed shape under lateral load', wide: true },
      { src: '/projects/etabs-15-storey/story-displacement.png', caption: 'Maximum storey displacement profile, base to roof' },
      { src: '/projects/etabs-15-storey/story-drift.png', caption: 'Maximum storey drift: 0.001426 at Story 14' },
    ],
  },
  {
    id: 'sap2000-steel-industrial-building',
    sheet: 'S-101',
    title: 'Steel Industrial Building (Gable Frame)',
    category: 'Steel',
    location: '',
    year: '2025',
    role: 'Steel modelling, analysis & design check (SAP2000)',
    drawing: 'frame',
    summary:
      'Structural modelling and analysis of a steel gable-frame industrial building in SAP2000, with every member checked to AISC 360-16. The highest utilisation was 0.7343 in the corner columns.',
    abstract: [
      'The structure consists of steel portal frames with W18×50 columns, S24×106 rafters, W18×50 peripheral beams, cold-formed C-section purlins and 150 mm diameter steel-pipe lateral bracing. Roof dead and live loads, wall dead loads, wind and seismic loads were applied and analysed under the governing combination of 1.2DL + 1.6LL.',
      'The analysis produced bending-moment and shear-force diagrams and deformed-shape outputs, followed by a steel design check to AISC 360-16. All members showed utilisation ratios well below 1.0.',
    ],
    scope: [
      'SAP2000 model with material properties and frame sections assigned to every member',
      'Load patterns DR, DW, Lr, Wind, EQX and EQY, with ASCE 7-16 auto lateral loads',
      'Load combinations to AISC 360-16, governed by 1.2DL + 1.6LL',
      'Bending-moment, shear-force and deformed-shape review',
      'Steel member design check and utilisation-ratio evaluation',
    ],
    conclusions: [
      'All members are safe under 1.2DL + 1.6LL; maximum utilisation 0.7343 in the W18×50 corner columns.',
      'Maximum displacement occurs at the apex of the central rafters and stays within serviceability limits.',
      'Bending-moment and shear-force diagrams show classic portal-frame behaviour, validating the model.',
      'Bracing (max ratio 0.280) and rafters (max ratio 0.168) are well within safe limits.',
      'The structure is safe and adequate for industrial use under all considered loading conditions.',
    ],
    figures: [
      { label: 'Max utilisation', value: '0.734' },
      { label: 'Governing combo', value: '1.2D + 1.6L' },
      { label: 'Design code', value: 'AISC 360-16' },
    ],
    images: [
      { src: '/projects/sap2000-steel-shed/3d-frame-model.png', caption: '3D SAP2000 model of the steel gable frames' },
      { src: '/projects/sap2000-steel-shed/load-patterns.png', caption: 'Load patterns: self weight, DR, DW, Lr, wind, EQX and EQY', wide: true },
      { src: '/projects/sap2000-steel-shed/deformed-shape.png', caption: 'Deformed shape under roof dead load (Uz contours, mm)', wide: true },
      { src: '/projects/sap2000-steel-shed/moment-diagram.png', caption: 'Moment 3-3 diagram under roof dead load', wide: true },
    ],
  },
  {
    id: 'idea-statica-connections',
    sheet: 'S-102',
    title: 'Steel Connection Design',
    category: 'Steel',
    location: '',
    year: '2025',
    role: 'Connection modelling & verification (IDEA StatiCa)',
    drawing: 'frame',
    summary:
      'Finite-element verification of three steel connections in IDEA StatiCa using the Component-Based Finite Element Method (CBFEM), designed to AISC LRFD 2022 with A36 steel and A325M bolts. All three passed every check.',
    abstract: [
      'Three connection types were modelled: a steel anchor base plate joining a W10×22 column to a reinforced-concrete foundation, checked under two loading scenarios; a purlin-to-rafter bolted cleat connecting a cold-formed CFC150×80 channel purlin to a W10×22 rafter; and a moment-resisting beam-to-column joint between two W10×22 sections using a bolted flush end plate with welded stiffeners.',
      'Plate stresses, welds, bolts, anchors, concrete bearing and friction-based shear transfer were all verified, with every utilisation below 100%.',
    ],
    scope: [
      'Anchor base plate: W10×22 column to RC foundation, two load scenarios',
      'Purlin-to-rafter bolted cleat: CFC150×80 purlin to W10×22 rafter',
      'Beam-to-column bolted flush end plate with four web stiffeners',
      'Checks for plates, welds, bolts, anchors, concrete block and shear transfer',
    ],
    conclusions: [
      'All three connections passed every IDEA StatiCa verification, with no utilisation above 100%.',
      'The base plate is the most critical: anchor breakout in tension at 94.5% and friction shear at 91.0%, with the plate itself fully elastic.',
      'The purlin connection works at a modest 15.2% and stays elastic; CBFEM captures the secondary moment from the eccentric purlin that hand calculations miss.',
      'The moment connection has large reserve (welds 20.5%, bolts 16.8%); the web stiffeners protect the column panel zone.',
      'CBFEM reproduces real force distributions and local plate yielding that classical hand methods cannot fully quantify.',
    ],
    figures: [
      { label: 'Connections', value: '3' },
      { label: 'Most critical', value: 'Anchors 94.5%' },
      { label: 'Design code', value: 'AISC LRFD 2022' },
    ],
    images: [
      { src: '/projects/idea-statica-connections/anchor-base-plate.png', caption: 'Anchor base plate: all checks pass, anchors at 94.5%' },
      { src: '/projects/idea-statica-connections/purlin-to-rafter.png', caption: 'Purlin-to-rafter bolted cleat: bolts at 15.2%', wide: true },
      { src: '/projects/idea-statica-connections/beam-column-end-plate.png', caption: 'Beam-to-column bolted flush end plate (W10×22)', wide: true },
    ],
  },
  {
    id: 'g4-commercial',
    sheet: 'S-103',
    title: 'G+4 Commercial Plaza',
    category: 'Structural',
    location: 'Lahore',
    year: '2025',
    role: 'Structural design engineer',
    drawing: 'frame',
    summary:
      'Reinforced-concrete moment frame with flat slabs for a five-storey retail and office block.',
    scope: [
      'ETABS model with seismic and wind load combinations',
      'Flat slab punching-shear checks and drop-panel design in SAFE',
      'Column and beam schedules, bar bending schedule for the contractor',
    ],
    figures: [
      { label: 'Built-up area', value: '3,200 m²' },
      { label: 'Typical span', value: '7.5 m' },
      { label: 'Concrete', value: '4,000 psi' },
    ],
  },
  {
    id: 'residential-supervision',
    sheet: 'S-104',
    title: 'Residential Block Supervision',
    category: 'Site',
    location: 'Islamabad',
    year: '2024',
    role: 'Site engineer',
    drawing: 'foundation',
    summary:
      'Day-to-day supervision of a three-storey residential block from excavation to roof slab.',
    scope: [
      'Setting-out of grid lines and column positions with total station',
      'Reinforcement and formwork inspection before every pour',
      'Daily progress reports and material reconciliation',
    ],
    figures: [
      { label: 'Duration', value: '11 months' },
      { label: 'Pours inspected', value: '38' },
      { label: 'Footings', value: 'Isolated + strap' },
    ],
  },
  {
    id: 'box-culvert',
    sheet: 'S-105',
    title: 'Twin-Cell Box Culvert',
    category: 'Infrastructure',
    location: 'Punjab',
    year: '2024',
    role: 'Design & quantity engineer',
    drawing: 'bridge',
    summary:
      'Hydraulic sizing and structural design of a twin-cell RCC box culvert under a district road.',
    scope: [
      'Hydraulic check for 50-year design discharge',
      'Box section designed for earth pressure and AASHTO HL-93 live load',
      'Bill of quantities and rate analysis for tender',
    ],
    figures: [
      { label: 'Cells', value: '2 × 3.0 m' },
      { label: 'Fill depth', value: '1.8 m' },
      { label: 'Steel', value: 'Grade 60' },
    ],
  },
  {
    id: 'road-rehab',
    sheet: 'S-106',
    title: 'Rural Road Rehabilitation',
    category: 'Infrastructure',
    location: 'Khyber Pakhtunkhwa',
    year: '2023',
    role: 'Assistant quantity surveyor',
    drawing: 'road',
    summary:
      'Pavement rehabilitation with new sub-base, base course and asphalt wearing course.',
    scope: [
      'Cross-section take-offs for cut and fill',
      'Field density and CBR test coordination',
      'Interim payment certificates and measurement books',
    ],
    figures: [
      { label: 'Length', value: '6.4 km' },
      { label: 'Carriageway', value: '7.3 m' },
      { label: 'Wearing course', value: '50 mm' },
    ],
  },
  {
    id: 'retaining-wall',
    sheet: 'S-107',
    title: 'Cantilever Retaining Wall',
    category: 'Geotechnical',
    location: 'Murree',
    year: '2023',
    role: 'Structural design engineer',
    drawing: 'wall',
    summary:
      'RCC cantilever retaining wall stabilising a hillside access road cut.',
    scope: [
      'Stability checks for sliding, overturning and bearing',
      'Stem and base slab design with shear key',
      'Drainage detailing with weep holes and filter media',
    ],
    figures: [
      { label: 'Retained height', value: '5.5 m' },
      { label: 'FoS sliding', value: '1.62' },
      { label: 'Length', value: '85 m' },
    ],
  },
  {
    id: 'overhead-tank',
    sheet: 'S-108',
    title: 'Overhead Water Tank',
    category: 'Water',
    location: 'Faisalabad',
    year: '2022',
    role: 'Final-year design project',
    drawing: 'tank',
    summary:
      'Elevated RCC water tank on a braced column staging for a housing scheme.',
    scope: [
      'Container design to ACI 350 for crack control',
      'Staging analysed for wind and seismic loads',
      'Raft foundation sized against allowable bearing pressure',
    ],
    figures: [
      { label: 'Capacity', value: '50,000 gal' },
      { label: 'Staging height', value: '15 m' },
      { label: 'Columns', value: '8' },
    ],
  },
];

export const experience = [
  {
    elevation: '+10.00',
    period: 'Sep 2026 — Present',
    role: 'Trainee Structural Engineer',
    org: 'Deomar Engineering · Lahore',
    points: [
      'Design oil and gas structures, including skids, platforms and sheds, in STAAD Pro',
      'Design their foundations in STAAD Foundation',
      'Prepare BOQs, material take-offs and bidding documents',
    ],
  },
  {
    elevation: '+8.00',
    period: 'Jun — Jul 2025',
    role: 'Engineering Intern',
    org: 'Ittefaq Group · Lahore',
    points: [
      'Supervised a 5-basement high-rise: excavation, reinforcement fixing and concrete QC (sampling, curing, cube tests)',
      'Baselined the project schedule in Primavera P6 with WBS, sequencing, durations and resources',
      'Reviewed IFC drawings and bidding documents; coordinated procurement, contract bonds and dewatering safety plans',
    ],
  },
  {
    elevation: '+6.00',
    period: 'Jul — Aug 2024',
    role: 'Engineering Intern',
    org: 'WAPDA · Central Design Office, Lahore',
    points: [
      'Supported contract management and operations for the Tarbela 5th Extension Project',
      'Assisted with technical planning, feasibility assessments and quality control for hydropower infrastructure',
    ],
  },
  {
    elevation: '+4.00',
    period: '2022 — 2026',
    role: 'B.S. Civil Engineering',
    org: 'FAST-NUCES, Lahore',
    points: [
      'Final-year project: Arduino vibration sensing of a steel gable frame, validated against a STAAD Pro FE model',
      'Senior Vice President, ASCE-NUCES Chapter',
      'Primavera P6 Fundamentals, Alison (CPD certified), Jul 2025',
    ],
  },
  {
    elevation: '+2.00',
    period: '2020 — 2022',
    role: 'FSc Pre-Engineering',
    org: 'Govt. College of Science, Wahdat Road, Lahore',
    points: [],
  },
  {
    elevation: '±0.00',
    period: '2018 — 2020',
    role: 'Matriculation',
    org: 'Lahore Garrison Grammar School, Awan Town, Lahore',
    points: [],
  },
];

// ASCE-NUCES roles, newest first. `photo` is optional.
export const leadership = [
  {
    elevation: '+8.00',
    period: '2025 — 26 · Final year',
    role: 'Senior Vice President',
    org: 'ASCE-NUCES Chapter',
    photo: '/activities/senior-vice-president.webp',
    points: [
      'Planned and hosted technical workshops, events and chapter initiatives',
      'Led coordination with faculty, partners and volunteers so every event ran smoothly',
      'Head of Registration for an international geotechnical conference (see below)',
    ],
  },
  {
    elevation: '+4.00',
    period: '',
    role: 'Deputy Head Photography',
    org: 'ASCE-NUCES Chapter',
    photo: '/activities/deputy-head-photography.webp',
    points: [
      'Managed and photographed chapter events, seminars, technical workshops and site visits',
    ],
  },
  {
    elevation: '±0.00',
    period: '',
    role: 'Member',
    org: 'ASCE-NUCES Chapter',
    points: ['Joined the American Society of Civil Engineers student chapter at FAST-NUCES'],
  },
];

// Events, seminars and site visits. `photos` are optional; captions double as alt text.
// `featured: true` makes a card span the full width.
export const activities = [
  {
    icon: 'cert',
    title: '17th International Conference on Geotechnical Engineering & 8th International Symposium on Geohazards',
    role: 'Head of Registration',
    period: '4–5 Dec 2025',
    featured: true,
    body: 'Hosted at FAST-NUCES Lahore. I ran registration for authors, pre-registered and onsite delegates at an international event where specialists from many countries and fields presented their research, and was recognised with a shield and certificate.',
    photos: [
      { src: '/activities/geotech-conference/registration-desk.webp', caption: 'Registration desk for authors, onsite and pre-registered delegates' },
      { src: '/activities/geotech-conference/conference-banner.webp', caption: 'Conference banner at FAST-NUCES Lahore, 4–5 December 2025' },
      { src: '/activities/geotech-conference/conference-backdrop.webp', caption: 'At the 17ICGE & 8ISG sponsor wall' },
      { src: '/activities/geotech-conference/organising-team.webp', caption: 'With members of the organising team' },
      { src: '/activities/geotech-conference/international-delegates.webp', caption: 'International delegates between sessions' },
      { src: '/activities/geotech-conference/evening-group.webp', caption: 'Organising team on the conference evening' },
      { src: '/activities/geotech-conference/award.webp', caption: 'Receiving a shield and certificate for the conference' },
    ],
  },
  {
    icon: 'people',
    title: 'Exchange Ambassador Outreach Program',
    role: 'Managed & photographed',
    period: '',
    body: 'Outreach session with the U.S. Embassy Pakistan and the Pakistan–U.S. Alumni Network introducing students to international exchange programs.',
    photos: [
      { src: '/activities/exchange-ambassador-outreach.png', caption: 'Exchange Ambassador Outreach Program talk' },
      { src: '/activities/exchange-program-seminar.webp', caption: 'Exchange Program Seminar attendees' },
      { src: '/activities/exchange-program-audience.webp', caption: 'Audience at the exchange program seminar' },
    ],
  },
  {
    icon: 'people',
    title: 'AIT Scholarships Seminar',
    role: 'Managed & photographed',
    period: '',
    body: 'Seminar for civil engineering students on scholarship opportunities at the Asian Institute of Technology.',
    photos: [
      { src: '/activities/ait-scholarships-seminar.webp', caption: 'AIT Scholarships Seminar group photo' },
    ],
  },
  {
    icon: 'helmet',
    title: 'Site visit: Hydraulic Research Station, Nandipur',
    role: 'Managed & photographed',
    period: '',
    body: 'Student visit to the hydraulic research station in Nandipur, Gujranwala, including a site layout briefing and physical hydraulic models.',
    photos: [
      { src: '/activities/nandipur-site-visit.webp', caption: 'Students at Nandipur, Gujranwala' },
      { src: '/activities/nandipur-layout-briefing.webp', caption: 'Briefing at the station layout plan' },
      { src: '/activities/nandipur-hydraulic-model.webp', caption: 'Physical hydraulic model at the station' },
    ],
  },
  {
    icon: 'helmet',
    title: 'Site visit: Banu Mukhtar Steel',
    role: 'Managed & photographed',
    period: '',
    body: 'Factory visit for students to see industrial steel fabrication up close, from the shop floor to its overhead cranes.',
    photos: [
      { src: '/activities/banu-mukhtar-steel-visit.webp', caption: 'Students at Banu Mukhtar Steel' },
      { src: '/activities/banu-mukhtar-steel-shop.webp', caption: 'Inside the Banu Mukhtar Steel fabrication shop' },
    ],
  },
];

// Community and social work, shown under its own heading in the Extracurricular room.
export const community = [
  {
    icon: 'hands',
    title: 'Rescue 1122: emergency services volunteer',
    role: 'Volunteer',
    period: '22 Jul – 14 Aug 2025',
    featured: true,
    body: 'Three weeks of community service at Rescue 1122 (Punjab Emergency Service), Branch ERS-15, Dubai Chowk, Lahore, supporting emergency rescue, medical assistance and fire safety under trained professionals.',
    points: [
      'Trained in Basic Life Support (BLS) and PLSP, with 10 days of RSC training',
      'Practised CPR on dummies and in real-life scenarios',
      'Responded to road accident victims, checked vital signs (heart rate, oxygen levels) and moved patients by ambulance and stretcher',
      'Helped prioritise emergency calls alongside a senior officer',
      'Inspected fire-fighting vehicles, assisted fire drills and checked fire safety at public buildings, including a parking plaza in Dubai Chowk',
      'Secured open nallahs to prevent accidents, and helped with the 14 August Independence Day celebrations at the station',
      'Awarded a Certificate of Volunteer Service by Rescue 1122 Lahore',
    ],
    photos: [
      { src: '/activities/rescue-1122/team-ers-15.webp', caption: 'With the Rescue 1122 team at Branch ERS-15', wide: true },
      { src: '/activities/rescue-1122/cpr-practice.webp', caption: 'CPR practice on a training dummy' },
      { src: '/activities/rescue-1122/road-accident-response.webp', caption: 'Moving a road accident victim onto a stretcher' },
      { src: '/activities/rescue-1122/volunteer-certificate.png', caption: 'Certificate of Volunteer Service, Rescue 1122 Lahore' },
    ],
  },
];
