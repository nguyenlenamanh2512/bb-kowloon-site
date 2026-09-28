/** PPAP's July 2026 presentation. These are PPAP facilities and figures, not BB Kowloon assets. */
export const ppapPresentation = "/documents/ppap-2026-presentation.pdf";

export const ppapTimeline = [
  { year: "1905", event: "Port operations began in Phnom Penh city.", image: "/images/ppap-timeline/1905.webp", imageAlt: "Historical port operations in Phnom Penh" },
  { year: "2002", event: "Container handling operations began in Phnom Penh city.", image: "/images/ppap-timeline/2002.webp", imageAlt: "Container barge at a Phnom Penh river terminal" },
  { year: "2011", event: "Government announcement No. 41 permitted a network of river sub-feeder terminals.", image: "/images/ppap-timeline/2011.webp", imageAlt: "Government announcement concerning river terminals" },
  { year: "2013", event: "Container terminal expansion in Kandal Province developed after its 2011 start.", image: "/images/ppap-timeline/2013.webp", imageAlt: "Aerial view of a container terminal beside the river" },
  { year: "2015", event: "PPAP reached a public listing milestone following its 2014 initiation.", image: "/images/ppap-timeline/2015.webp", imageAlt: "Officials at PPAP's stock exchange bell ceremony" },
  { year: "2026", event: "Seven PPAP terminal sites are shown in operation.", image: "/images/ppap-timeline/2026.webp", imageAlt: "Map showing PPAP's seven river terminals" },
];

export type PpapTerminal = {
  code: string;
  name: string;
  kind: string;
  specs: { label: string; value: string }[];
};

export const ppapTerminals: PpapTerminal[] = [
  {
    code: "LM17", name: "Container Terminal LM17", kind: "Container",
    specs: [
      { label: "Jetty / pontoon", value: "22 × 300 m; 12 × 149 m; 16 × 149 m" },
      { label: "Berths", value: "9 berths" },
      { label: "River draft", value: "4.5 m" },
      { label: "Barge capacity", value: "3,000–4,000 tons (250–300 TEUs)" },
      { label: "Handling equipment", value: "4 TCC + 4 FCC: 20–25 MPH; 22 RTG: 20–25 MPH; 2 floating cranes: 15 MPH" },
      { label: "Port capacity", value: "1,000,000 TEUs/year" },
      { label: "Reefer plugs", value: "256 plugs" },
      { label: "Warehouse / facilities", value: "Warehouses: 24 × 60 m; 30 × 60 m" },
      { label: "Land size", value: "40 ha (33.22 ha operational)" },
      { label: "Navigation time", value: "Cai Mep 28–32 hrs · Cat Lai 21–25 hrs" },
      { label: "Distance", value: "Cai Mep 373 km · Cat Lai 345 km" },
    ],
  },
  {
    code: "UM2", name: "Sub-feeder Multipurpose Terminal UM2", kind: "Multipurpose",
    specs: [
      { label: "Jetty / pontoon", value: "12 × 46.9 m; 45 m general cargo berth" },
      { label: "Berths", value: "2 berths" },
      { label: "River draft", value: "4.5 m" },
      { label: "Barge capacity", value: "3,000–4,000 tons (250–300 TEUs)" },
      { label: "Handling equipment", value: "1 FCC: 15–20 MPH; crawler crane: 100 tons" },
      { label: "Port capacity", value: "70,000 TEUs/year" },
      { label: "Reefer plugs", value: "36 plugs" },
      { label: "Warehouse / facilities", value: "Warehouse: 40 × 150 m" },
      { label: "Land size", value: "24.04 ha (5.49 ha operational)" },
      { label: "Navigation time", value: "Cai Mep 31–42 hrs · Cat Lai 30–40 hrs" },
      { label: "Distance", value: "Cai Mep 503 km · Cat Lai 475 km" },
    ],
  },
  {
    code: "UM1", name: "Sub-feeder Multipurpose Terminal UM1", kind: "Multipurpose",
    specs: [
      { label: "Jetty / pontoon", value: "Jetty: 12 × 24 m" },
      { label: "Berths", value: "1 berth" },
      { label: "River draft", value: "4.5 m" },
      { label: "Barge capacity", value: "3,000–4,000 tons (250–300 TEUs)" },
      { label: "Handling equipment", value: "1 FCC: 15–20 MPH" },
      { label: "Port capacity", value: "60,000 TEUs/year" },
      { label: "Reefer plugs", value: "36 plugs" },
      { label: "Warehouse / facilities", value: "Warehouse: 30 × 130 m" },
      { label: "Land size", value: "4 ha" },
      { label: "Navigation time", value: "Cai Mep 32–43 hrs · Cat Lai 27–38 hrs" },
      { label: "Distance", value: "Cai Mep 513 km · Cat Lai 485 km" },
    ],
  },
  {
    code: "TS11", name: "Sub-feeder Multipurpose Terminal TS11", kind: "Multipurpose",
    specs: [
      { label: "Jetty / pontoon", value: "Jetty: 12 × 60 m" },
      { label: "Berths", value: "1 berth" },
      { label: "River draft", value: "4.5 m" },
      { label: "Barge capacity", value: "3,000–4,000 tons (250–300 TEUs)" },
      { label: "Handling equipment", value: "1 FCC: 15–20 MPH" },
      { label: "Port capacity", value: "60,000 TEUs/year" },
      { label: "Reefer plugs", value: "36 plugs" },
      { label: "Warehouse / facilities", value: "Warehouses: 1,848 m²; 2,854 m²" },
      { label: "Land size", value: "4 ha" },
      { label: "Navigation time", value: "Cai Mep 32–43 hrs · Cat Lai 27–38 hrs" },
      { label: "Distance", value: "Cai Mep 513 km · Cat Lai 485 km" },
    ],
  },
  {
    code: "TS3", name: "Multipurpose Terminal TS3", kind: "Multipurpose / passenger",
    specs: [
      { label: "Jetty / pontoon", value: "Jetty: 20 × 300 m; 2 floating piers: 42 × 12 m" },
      { label: "Berths", value: "6 berths" },
      { label: "River draft", value: "4.5 m" },
      { label: "Barge capacity", value: "Not stated in PPAP source" },
      { label: "Handling equipment", value: "Not stated in PPAP source" },
      { label: "Port capacity", value: "Not stated in PPAP source" },
      { label: "Reefer plugs", value: "Not stated in PPAP source" },
      { label: "Warehouse / facilities", value: "Passenger & tourist station hall: 52 × 17 m" },
      { label: "Land size", value: "8.58 ha (1.97 ha operational)" },
      { label: "Navigation time", value: "Ho Chi Minh City: approx. 31 hrs" },
      { label: "Distance", value: "Ho Chi Minh City: 470 km" },
    ],
  },
  {
    code: "TS1", name: "Passenger and Tourist Terminal TS1", kind: "Passenger",
    specs: [
      { label: "Jetty / pontoon", value: "Pontoons: 30 × 12 m; 45 × 15 m" },
      { label: "Berths", value: "2 berths" },
      { label: "River draft", value: "4.5 m" },
      { label: "Barge capacity", value: "Not stated in PPAP source" },
      { label: "Handling equipment", value: "Not stated in PPAP source" },
      { label: "Port capacity", value: "Not stated in PPAP source" },
      { label: "Reefer plugs", value: "Not stated in PPAP source" },
      { label: "Warehouse / facilities", value: "Not stated in PPAP source" },
      { label: "Land size", value: "0.60 ha (0.23 ha operational)" },
      { label: "Navigation time", value: "Ho Chi Minh City: approx. 31 hrs" },
      { label: "Distance", value: "Ho Chi Minh City: 470 km" },
    ],
  },
  {
    code: "LM26", name: "Sub-feeder Multipurpose Terminal LM26", kind: "Multipurpose / border",
    specs: [
      { label: "Jetty / pontoon", value: "Pontoon: 45 × 15 m" },
      { label: "Berths", value: "5 berths" },
      { label: "River draft", value: "4.5–5.5 m" },
      { label: "Barge capacity", value: "Not stated in PPAP source" },
      { label: "Handling equipment", value: "4 conveyors; 100- and 130-ton floating cranes: 15–20 MPH" },
      { label: "Port capacity", value: "Not stated in PPAP source" },
      { label: "Reefer plugs", value: "Not stated in PPAP source" },
      { label: "Warehouse / facilities", value: "Truck scale: 1; warehouse: 30 × 50 m; border gate at Koh Roka–Thuong Phuoc" },
      { label: "Land size", value: "21.90 ha (19.86 ha operational)" },
      { label: "Navigation time", value: "Cai Mep 17–23 hrs · Cat Lai 15–21 hrs" },
      { label: "Distance", value: "Cai Mep 275 km · Cat Lai 247 km" },
    ],
  },
];

export const ppapContext = [
  {
    title: "Cargo volume",
    text: "PPAP reports 600,023 TEUs handled in 2025 and 339,606 TEUs in the first six months of 2026.",
  },
  {
    title: "Port activities",
    text: "PPAP's activities include port authority services, terminal operations and logistics such as berthing, stevedoring, warehousing and customs clearance.",
  },
  {
    title: "Inland waterway access",
    text: "The Cambodia–Vietnam waterway agreement covers regulated Mekong, Tonle Sap, Bassac and Vam Nao routes, alongside selected canals.",
  },
  {
    title: "Planned development",
    text: "PPAP outlines LM17 expansion, a special economic zone, a Svay Rieng dry port, more sub-feeder terminals and channel improvements.",
  },
];

export const ppapConnectivity = [
  {
    eyebrow: "Overseas connections",
    title: "From the Mekong to regional and global markets",
    text: "PPAP illustrates onward sea connections through Cat Lai for intra-Asia cargo and Cai Mep for cargo headed to the United States and Europe.",
    image: "/images/ppap-connectivity/overseas-connections.webp",
    imageAlt: "PPAP diagrams of onward sea connections via Cat Lai and Cai Mep",
  },
  {
    eyebrow: "Road access to LM17",
    title: "Truck routes link the terminal with Phnom Penh",
    text: "The road map places LM17 beside National Road 1 and shows the surrounding national roads, ring roads, logistics sites and other PPAP terminals. Dashed lines on the map indicate proposed connections.",
    image: "/images/ppap-connectivity/trucking-lm17.webp",
    imageAlt: "Map of truck routes, national roads and planned links around LM17",
  },
  {
    eyebrow: "Rail connections",
    title: "A rail corridor towards Sihanoukville",
    text: "The railway map distinguishes the existing main line through Phnom Penh and Kampot to Sihanoukville from proposed branches and industrial extensions.",
    image: "/images/ppap-connectivity/railway-connections.webp",
    imageAlt: "Map of Cambodia's existing railway and proposed branches around Phnom Penh",
  },
];
