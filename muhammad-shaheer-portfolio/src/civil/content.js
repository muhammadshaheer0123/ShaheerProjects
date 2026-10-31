// All portfolio copy lives here. Edit this file to update the site —
// no component changes are needed.
// Profile, experience and activities follow Muhammad Shaheer's CV.

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
  // Shown as clickable cards in the Contact room
  links: [
    { label: 'Email', icon: 'mail', handle: 'muhammad.shaheer26@hotmail.com', href: 'mailto:muhammad.shaheer26@hotmail.com' },
    { label: 'LinkedIn', icon: 'linkedin', handle: 'in/muhammad-shaheer', href: 'https://www.linkedin.com/in/muhammad-shaheer-828336291/' },
    { label: 'Instagram', icon: 'instagram', handle: '@sheerizkheer', href: 'https://www.instagram.com/sheerizkheer/' },
  ],
  intro:
    'I design steel and reinforced-concrete structures, from oil and gas skids to high-rise frames, and check them against ACI and AISC.',
  greeting: "Hi, I'm Shaheer!",
  greetingSub: 'Scroll to walk the corridor',
  // Hallway figure behind the reception counter: a transparent cut-out from helmet to upper thigh
  avatar: '/avatar/shaheer-hallway.webp',
  portrait: '/avatar/shaheer-portrait.jpg',
  // CV download in the top bar (served with Content-Disposition: attachment, see vercel.json)
  cv: '/Muhammad_Shaheer_CV.pdf',
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
    code: 'C1', icon: 'frame',
    title: 'Structural analysis & design',
    body: 'Reinforced-concrete and steel buildings modelled, analysed and designed to ACI 318 and AISC 360, including slabs, frames, shear walls and foundations.',
    tools: ['ETABS', 'SAP2000', 'STAAD Pro', 'SAFE'],
  },
  {
    code: 'C2', icon: 'platform',
    title: 'Oil & gas structures',
    body: 'Skids, platforms and sheds for oil and gas facilities, with their foundations, designed to the applicable engineering standards.',
    tools: ['STAAD Pro', 'STAAD Foundation'],
  },
  {
    code: 'C3', icon: 'connection',
    title: 'Steel connection design',
    body: 'Base plates, bolted cleats and moment end plates verified with component-based finite element analysis to AISC LRFD.',
    tools: ['IDEA StatiCa'],
  },
  {
    code: 'C4', icon: 'helmet',
    title: 'Construction supervision',
    body: 'Excavation, reinforcement fixing and concrete quality control (sampling, curing and cube testing), plus IFC drawing review.',
    tools: ['Concrete QC', 'Cube testing', 'IFC review'],
  },
  {
    code: 'C5', icon: 'schedule',
    title: 'Planning, BOQ & bidding',
    body: 'Baselined schedules with WBS, activity sequencing and resources; BOQs, material take-offs and bidding documents.',
    tools: ['Primavera P6', 'MS Excel'],
  },
  {
    code: 'C6', icon: 'drafting',
    title: 'Drafting, BIM & programming',
    body: 'Drawings, BIM models and GIS, plus Python, C++ and Arduino-based sensing for structural monitoring.',
    tools: ['AutoCAD', 'Revit', 'ArcGIS', 'Python', 'Arduino'],
  },
];

// Sections of the Projects room, in order. Each project's `category` must match
// one `name`; a section with no projects yet shows as a reserved sheet.
export const disciplines = [
  { name: 'Structural', series: 'S-100' },
  { name: 'Highway & Transportation', series: 'T-200' },
  { name: 'Hydraulics & Hydrology', series: 'H-300' },
];

// `drawing` picks the line drawing shown for each project:
// frame | bridge | road | wall | tank | foundation
// Optional: `images` (first one becomes the card cover; `wide: true` spans the
// full gallery width), `abstract` paragraphs and a `conclusions` list.
// Leave `location` / `year` empty to hide them.
export const projects = [
  {
    id: 'shm-vibration-sensor',
    sheet: 'S-100',
    title: 'Structural Model Evaluation of a Steel Frame Using Acceleration-Based Field Monitoring',
    category: 'Structural',
    location: 'Izhar Construction warehouse, Lahore',
    year: '2026',
    role: 'Final-year project: IoT vibration sensor, field testing & operational modal analysis',
    drawing: 'frame',
    summary:
      'A low-cost IoT vibration monitoring system built from an ESP32 and an ADXL345 accelerometer, then field-tested on a working steel gable-frame warehouse. Operational modal analysis identified its natural frequencies, 4.604 Hz across the width and 5.716 Hz along the length, as a baseline for detecting future stiffness loss.',
    abstract: [
      'Steel structures in Pakistan are usually assessed by visual inspection and repaired only after problems appear. As a structure deteriorates it loses stiffness, and its natural frequencies drop. With a measured baseline, engineers can spot that change long before damage becomes visible.',
      'We designed and built a sensor around a NodeMCU ESP32 and an ADXL345 tri-axial MEMS accelerometer, moved it from a breadboard prototype onto a custom PCB, and made four units. Each streams live readings to a Firebase cloud dashboard with threshold alerts and runs for over 48 hours on battery, for under Rs 10,000.',
      'After validation on a vibrating table, the sensors recorded 103 minutes of ambient and crane-induced vibration at the Izhar Construction warehouse in Lahore. FFT analysis of the free-decay response in OriginPro gave the structure’s dynamic fingerprint. Team project with Muhammad Ramis Irfan and Syed Muhammad Shoaib, supervised by Dr. Tauqir Ahmad.',
    ],
    scope: [
      'Sensor design: ESP32, ADXL345 accelerometer, DS3231 real-time clock and micro SD logging',
      'Custom PCB with LiPo battery and battery management, under Rs 10,000',
      'Firmware: 3-axis gravity calibration at start-up, high-pass filtering, 200 Hz sampling',
      'Firebase real-time database and web dashboard with live X, Y, Z plots and vibration alerts',
      'Validation of two sensors side by side on a vibrating table',
      'Field deployment at the column–rafter connection under the ridge, crane used as excitation',
      'FFT of the free-decay response in OriginPro to identify natural frequencies',
    ],
    conclusions: [
      'Two sensors on the same vibrating table recorded peaks in phase and with similar amplitudes, confirming consistent, accurate measurement.',
      'The warehouse’s fundamental natural frequencies are 4.604 Hz across the width (X) and 5.716 Hz along the length (Y).',
      'The length direction is stiffer because several connected portal-frame bays act together, which gives the higher frequency.',
      'Both values fall in the 2–8 Hz range reported for pre-engineered steel gable frames, an independent check on the sensor and the analysis.',
      'The measured frequencies are now a reference for long-term monitoring: a future drop would signal stiffness loss.',
      'Professional-grade structural health monitoring is achievable at a fraction of the cost of commercial systems.',
    ],
    figures: [
      { label: 'Natural freq. X / Y', value: '4.60 / 5.72 Hz' },
      { label: 'Battery life', value: '48+ hours' },
      { label: 'System cost', value: '< Rs 10,000' },
    ],
    images: [
      { src: '/projects/shm-vibration-sensor/sensor-hardware.webp', caption: 'Developed hardware: ESP32, ADXL345, RTC, micro SD, BMS and battery on a custom PCB' },
      { src: '/projects/shm-vibration-sensor/breadboard-prototype.webp', caption: 'Breadboard prototype checked against the iDynamics phone app', wide: true },
      { src: '/projects/shm-vibration-sensor/sensor-comparison.webp', caption: 'Vibrating-table validation: two sensors record matching peaks', wide: true },
      { src: '/projects/shm-vibration-sensor/site-visit.webp', caption: 'Site visit at the Izhar Construction warehouse, Lahore' },
      { src: '/projects/shm-vibration-sensor/crane-excitation.webp', caption: 'Overhead crane used to excite the structure' },
      { src: '/projects/shm-vibration-sensor/sensor-mounted.webp', caption: 'Sensor 3 mounted at the column–rafter connection, axes marked', wide: true },
      { src: '/projects/shm-vibration-sensor/sensor-1-time-history.webp', caption: 'Sensor 1 acceleration over the 103-minute record, with crane events', wide: true },
      { src: '/projects/shm-vibration-sensor/fft-originpro.webp', caption: 'Free-decay window selected in OriginPro for FFT analysis', wide: true },
      { src: '/projects/shm-vibration-sensor/poster-and-team.webp', caption: 'Project showcase: live dashboard, three sensor units and poster, with the team', wide: true },
    ],
  },
  {
    id: 'etabs-15-storey-residential',
    sheet: 'S-101',
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
    sheet: 'S-102',
    title: 'Steel Industrial Building (Gable Frame)',
    category: 'Structural',
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
    sheet: 'S-103',
    title: 'Steel Connection Design',
    category: 'Structural',
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
    id: 'dubai-chowk-traffic-vissim',
    sheet: 'T-200',
    title: 'Dubai Chowk Congestion Mitigation',
    category: 'Highway & Transportation',
    location: 'Allama Iqbal Town, Lahore',
    year: '2025',
    role: 'Traffic micro-simulation & intersection design (PTV VISSIM)',
    drawing: 'road',
    summary:
      'Micro-simulation study of Dubai Chowk, a congested four-leg signalised junction in Lahore. The calibrated PTV VISSIM model showed the junction failing at LOS E; an east–west flyover with a two-phase signal brought it to LOS C and cut average delay from about 70 s to 26 s.',
    abstract: [
      'Dubai Chowk links Multan Road, Wahdat Road, Samanabad and Kareem Market, and runs at LOS E in the morning peak with long queues. Our four-member team recorded every approach at 8:00 AM, extracted turning-movement counts from the video, and documented lane geometry and the existing four-phase, 126-second signal plan.',
      'A base model was built and calibrated in PTV VISSIM with local vehicle types (motorbikes and rickshaws) and observed speed distributions. Two improvements were then simulated over ten runs each: widening the north–south approaches with retimed signals, and a grade-separated flyover for east–west through traffic with a simplified two-phase signal.',
    ],
    scope: [
      'Site survey and peak-hour video counts on all four legs',
      'Turning-movement counts, lane geometry and signal timings extracted from the footage',
      'PTV VISSIM base model: links, connectors, routes and fixed-time signal control',
      'Custom fleet with motorbikes and rickshaws, with speeds calibrated to the site',
      'Scenario 1: north–south approaches widened to two 3.5 m lanes, green times retimed',
      'Scenario 2: east–west flyover, 2-phase 70 s cycle and reworked conflict areas',
      'Node evaluation of delay, queue length and LOS over ten runs per scenario',
    ],
    conclusions: [
      'Existing junction: LOS E, average delay 65–70 s per vehicle, average maximum queue about 170 m.',
      'Scenario 1 (extra lane and signal retiming) left the junction at LOS E with almost no change in delay or queues; demand far exceeds what ground-level fixes can add.',
      'Scenario 2 (flyover) reached LOS C, cut average delay to 26 s (over 60% lower) and reduced the average maximum queue from 170 m to 77 m.',
      'Taking the heavy east–west through traffic off the junction allowed a 70 s two-phase cycle instead of 126 s and four phases.',
      'An east–west flyover is recommended as the only viable long-term solution for Dubai Chowk.',
    ],
    figures: [
      { label: 'Level of service', value: 'E → C' },
      { label: 'Average delay', value: '≈70 → 26 s' },
      { label: 'Max queue', value: '170 → 77 m' },
    ],
    images: [
      { src: '/projects/dubai-chowk-vissim/vehicle-routes.webp', caption: 'Vehicle routes of the base model in PTV VISSIM' },
      { src: '/projects/dubai-chowk-vissim/site-satellite.webp', caption: 'Dubai Chowk: four-leg signalised junction, Allama Iqbal Town', wide: true },
      { src: '/projects/dubai-chowk-vissim/site-visit.webp', caption: 'Site visit: recording peak-hour traffic at 8:00 AM' },
      { src: '/projects/dubai-chowk-vissim/phase-plan.webp', caption: 'Existing four-phase plan (126 s cycle)' },
      { src: '/projects/dubai-chowk-vissim/base-signal-program.webp', caption: 'Base model signal program: four phases, 126 s', wide: true },
      { src: '/projects/dubai-chowk-vissim/motorbikes-rickshaws.webp', caption: 'Motorbikes and rickshaws added to the VISSIM fleet', wide: true },
      { src: '/projects/dubai-chowk-vissim/baseline-evaluation.webp', caption: 'Baseline node evaluation: LOS E' },
      { src: '/projects/dubai-chowk-vissim/scenario-1-model.webp', caption: 'Scenario 1: widened north–south approaches' },
      { src: '/projects/dubai-chowk-vissim/scenario-2-flyover-model.webp', caption: 'Scenario 2: east–west through traffic on a flyover' },
      { src: '/projects/dubai-chowk-vissim/scenario-2-conflict-areas.webp', caption: 'Scenario 2: conflict areas reworked for the new flows' },
      { src: '/projects/dubai-chowk-vissim/scenario-2-signal-program.webp', caption: 'Scenario 2 signal program: two phases, 70 s cycle', wide: true },
    ],
  },
  {
    id: 'nullah-lai-hec-ras',
    sheet: 'H-300',
    title: 'Nullah Lai Steady-Flow Model',
    category: 'Hydraulics & Hydrology',
    location: 'I-10, Islamabad / Rawalpindi',
    year: '2026',
    role: '1D steady-flow river modelling (HEC-RAS 6.7, RAS Mapper)',
    drawing: 'bridge',
    summary:
      'One-dimensional steady-flow HEC-RAS model of a 3.3 km reach of Nullah Lai, the urban drainage channel behind Rawalpindi’s worst floods. Built on SRTM terrain with two bridges and a culvert, it shows every structure passing the 100 m³/s design flood without overtopping.',
    abstract: [
      'Nullah Lai floods regularly during the monsoon because of its steep upper catchment and a constrained urban channel. Our three-member team modelled the reach from Karnal Sher Khan Shaheed Road (RS 3331) to Hazara Colony (RS 323) in HEC-RAS 6.7, using SRTM 1 arc-second (30 m) terrain from USGS Earth Explorer processed in RAS Mapper on WGS84 UTM Zone 43N.',
      'The centerline was digitised over satellite imagery, ten cross-sections were cut from the terrain with Manning’s n of 0.035 in the channel and 0.08 on the overbanks, and two bridges and an elliptical culvert were placed at real road crossings. Low flow (15 m³/s), moderate flood (45 m³/s) and design flood (100 m³/s) were run under a mixed flow regime.',
    ],
    scope: [
      'SRTM DEM download, projection and terrain processing in RAS Mapper',
      'River centerline digitised over satellite imagery; ten cross-sections extracted from terrain',
      'Manning’s n assigned per cross-section: 0.035 channel, 0.08 overbanks',
      'Bridge 1 (RS 2470) and Bridge 2 (RS 1285): deck, pier and energy / pressure-weir methods',
      'Elliptical culvert (RS 2160): 25 m span, 3 m rise, FHWA concrete-pipe chart',
      'Three steady-flow profiles, critical-depth upstream and normal-depth downstream boundaries',
      'Water surface profiles, cross-section plots and bridge and culvert output tables',
    ],
    conclusions: [
      'Both bridges pass all three flows with no overtopping (weir flow zero); they switch from free-surface to pressure flow at the 100 m³/s design flood.',
      'At the design flood the water surface upstream of Bridge 1 is 500.37 m, below its 501.50 m minimum overtopping level.',
      'The culvert runs under outlet control in every profile with no roadway overtopping; its 1.72 m/s outlet velocity at the design flood calls for scour protection.',
      'Backwater builds upstream of each structure at higher flows; flow is mainly subcritical, with Froude ≈ 1.01 at RS 1484 and RS 637 under the design flood.',
      'The 30 m SRTM terrain suits a reach-scale study; LiDAR or survey data would be needed for detailed design.',
      'The model is a baseline for unsteady-flow, flood-frequency and flood-mitigation studies on Nullah Lai.',
    ],
    figures: [
      { label: 'Reach / sections', value: '3.3 km / 10' },
      { label: 'Design flood', value: '100 m³/s' },
      { label: 'Overtopping', value: 'None' },
    ],
    images: [
      { src: '/projects/nullah-lai-hec-ras/srtm-terrain.webp', caption: 'SRTM 30 m terrain of Rawalpindi / Islamabad in RAS Mapper' },
      { src: '/projects/nullah-lai-hec-ras/reach-geometry.webp', caption: 'Nullah Lai reach: centerline, cross-sections RS 323–3331, bridges and culvert', wide: true },
      { src: '/projects/nullah-lai-hec-ras/cross-section-editor.webp', caption: 'Cross-section from terrain with Manning’s n values' },
      { src: '/projects/nullah-lai-hec-ras/bridge-1-cross-section.webp', caption: 'Bridge 1 upstream face at low flow: water below the low chord' },
      { src: '/projects/nullah-lai-hec-ras/bridges-and-culvert.webp', caption: 'Bridge 1 (RS 2470), elliptical culvert (RS 2160) and Bridge 2 (RS 1285), upstream and downstream faces', wide: true },
      { src: '/projects/nullah-lai-hec-ras/water-surface-profiles.webp', caption: 'Water surface profiles for 15, 45 and 100 m³/s along the reach', wide: true },
      { src: '/projects/nullah-lai-hec-ras/profile-output-table.webp', caption: 'Profile output table, design flood (100 m³/s)', wide: true },
      { src: '/projects/nullah-lai-hec-ras/bridge-1-output-pf3.webp', caption: 'Bridge 1 output at the design flood: pressure flow, no weir flow', wide: true },
      { src: '/projects/nullah-lai-hec-ras/culvert-output-pf3.webp', caption: 'Culvert output at the design flood: outlet control, 1.72 m/s', wide: true },
    ],
  },
  {
    id: 'kalam-hec-hms',
    sheet: 'H-301',
    title: 'Kalam Watershed Rainfall–Runoff Model',
    category: 'Hydraulics & Hydrology',
    location: 'Kalam, Swat',
    year: '2024',
    role: 'Single-event hydrologic modelling (HEC-HMS 4.11)',
    drawing: 'bridge',
    summary:
      'Single-event rainfall–runoff model of the Kalam watershed in Swat, built in HEC-HMS from a USGS elevation model. Terrain processing delineated 15 sub-basins draining 1,065 km²; a 13-hour storm on 21 February 2024 produced a peak of 149.5 m³/s at the outlet.',
    abstract: [
      'This hydrology lab assignment applied the HEC-HMS basin-scale modelling workflow to the Kalam area. USGS elevation data was processed with the software’s built-in GIS tools: sinks were filled, flow direction and accumulation grids computed, streams identified at a 25 km² threshold, and the watershed and its sub-basins delineated from an outlet break point.',
      'Each sub-basin used SCS curve-number losses (CN 97) and an SCS unit hydrograph, with lag time taken as 0.6 Tc from flow length, basin slope and CN. Reaches were routed by the Muskingum method (K = 0.5, X = 0.25). An hourly rainfall hyetograph drove the meteorologic model and the run used a 10-minute time step. Team assignment with Muhammad Ramis Irfan and Muhammad Shoaib, under Sir Kashif Hameed.',
    ],
    scope: [
      'Basin model with SCS curve-number loss, SCS unit hydrograph and Muskingum routing',
      'Terrain pre-processing: fill sinks, flow direction and flow accumulation grids',
      'Stream network at a 25 km² threshold, outlet break point, watershed and 15 sub-basins',
      'Curve number of 97 for every sub-basin',
      'Lag times computed in Excel from flow length, basin slope and CN (lag = 0.6 Tc)',
      'Muskingum K = 0.5 and X = 0.25 for all reaches',
      'Rain gauge hyetograph, meteorologic model, 10-minute control specifications and simulation run',
    ],
    conclusions: [
      'The 1,064.9 km² watershed peaked at 149.5 m³/s at the outlet at 16:30 on 21 February 2024, two and a half hours after the rain stopped.',
      'Flows build downstream as reaches collect the sub-basins: 32 m³/s at Reach-7, 111 m³/s at Reach-4 and 147 m³/s at Reach-3.',
      'Sub-basin peaks range from 12:20 to 18:00 depending on size, slope and position in the network, showing the routing delay.',
      'Runoff depth was 5.17 mm for every element, as expected with a single curve number across the catchment.',
      'The workflow can be repeated for any watershed with a DEM, making it a practical basis for flood estimation and watershed planning.',
    ],
    figures: [
      { label: 'Catchment', value: '1,065 km²' },
      { label: 'Sub-basins', value: '15' },
      { label: 'Outlet peak', value: '149.5 m³/s' },
    ],
    images: [
      { src: '/projects/kalam-hec-hms/watershed-delineation.webp', caption: 'Kalam watershed delineated into 15 sub-basins and their reaches' },
      { src: '/projects/kalam-hec-hms/outlet-break-point.webp', caption: 'Outlet break point placed on the delineated stream network', wide: true },
      { src: '/projects/kalam-hec-hms/curve-numbers.webp', caption: 'Curve number 97 assigned to all 15 sub-basins' },
      { src: '/projects/kalam-hec-hms/lag-times.webp', caption: 'SCS unit-hydrograph lag times per sub-basin (minutes)' },
      { src: '/projects/kalam-hec-hms/rainfall-hyetograph.webp', caption: 'Hourly rainfall hyetograph, 21 February 2024' },
      { src: '/projects/kalam-hec-hms/subbasin-hydrograph.webp', caption: 'Sub-basin 11: rainfall, losses and outflow hydrograph' },
      { src: '/projects/kalam-hec-hms/global-summary.webp', caption: 'Global summary: peak discharge, timing and volume for every element', wide: true },
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
    photos: [
      { src: '/experience/ittefaq/basement-excavation.webp', caption: 'Five-basement excavation braced with steel struts' },
      { src: '/experience/ittefaq/basement-reinforcement.webp', caption: 'On site at the basement reinforcement' },
      { src: '/experience/ittefaq/concrete-cylinder-sampling.webp', caption: 'Concrete cylinder sampling for quality control' },
      { src: '/experience/ittefaq/site-office.webp', caption: 'Site offices on the Ittefaq project' },
      { src: '/experience/ittefaq/internship-certificate.webp', caption: 'Ittefaq internship experience certificate', fit: 'contain' },
    ],
  },
  {
    elevation: '+6.00',
    period: 'Jul — Aug 2024 · 8 weeks',
    role: 'Engineering Intern',
    org: 'WAPDA · Central Design Office, Lahore',
    points: [
      'Coordinated contract management and operational support for the Tarbela 5th Extension Project under the Central Design Office',
      'Assisted with technical planning, feasibility assessments, and quality control evaluations for hydropower infrastructure',
      'Visited Mangla Dam and Mangla Power Station; gained exposure to the operation and maintenance phase of a mega hydropower project including power generation systems and dam safety operations',
    ],
    photos: [
      { src: '/experience/wapda/tarbela-power-station.webp', caption: 'Tarbela Power Station (3,478 MW)' },
      { src: '/experience/wapda/mangla-power-station.webp', caption: 'Mangla Power Station' },
      { src: '/experience/wapda/dam-spillway-reservoir.webp', caption: 'Dam reservoir and spillway visit' },
      { src: '/experience/wapda/dam-inspection-gallery.webp', caption: 'Inside a dam inspection gallery' },
      { src: '/experience/wapda/certificate-ceremony.webp', caption: 'Receiving the internship certificate' },
      { src: '/experience/wapda/internship-certificate.webp', caption: 'WAPDA internship certificate, 2 Jul – 16 Aug 2024', fit: 'contain' },
    ],
  },
];

export const education = [
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
