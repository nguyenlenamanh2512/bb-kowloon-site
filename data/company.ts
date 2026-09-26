export const company = {
  name: "BB Kowloon Company Limited",
  shortName: "BB Kowloon Co., Ltd",
  descriptor: "Barge & Breakbulk Logistics",
  tagline: "Efficiency, Innovation, and Competitive Advantage",
  overview:
    "BB Kowloon is first and foremost a local Cambodia ship agency. Our logistics capabilities are arranged to support the same port call, cargo movement or customer requirement.",
  approach:
    "Local coordination across Cambodia's seaports and Mekong River terminals supports safe, timely and cost-efficient cargo handling from arrival through completion.",
  commitment:
    "BB Kowloon is committed to reliable, safe and efficient port-call support and cargo logistics in Cambodia.",
  address:
    "House No. 339, Cluster Street, Boeng Chhouk Village, Sangkat Niroth, Khan Chbar Ampov, Phnom Penh (within Borey Peng Huoth Boeng Snor).",
  phone: "+855-186 776 656",
  email: "agency@bbkowloon.com",
  operationsEmail: "ops@bbkowloon.com",
  website: "www.BBkowloon.com",
  corridor: ["Vietnam", "Mekong River", "Cambodia"],
  cargoTypes: ["Bulk cargo", "Project cargo", "Agricultural products", "General commodities"],
};

export type PortRepresentative = {
  id: "thao-quyen" | "pongnarith-chorn" | "minh-son";
  name: string;
  role: string;
  languages: string;
  phones: string[];
  email: string;
};

export const portRepresentatives: PortRepresentative[] = [
  {
    id: "thao-quyen",
    name: "Ms. Thao Quyen",
    role: "Executive Assistant",
    languages: "Chinese / English speaking representative",
    phones: ["+84 979 648 679", "+855 186 776 656", "+855 81 260 983"],
    email: "ops@bbkowloon.com",
  },
  {
    id: "pongnarith-chorn",
    name: "Mr. Pongnarith Chorn",
    role: "Operation Executive",
    languages: "Khmer-speaking representative",
    phones: ["+855 77 716 127", "+855 93 558 070"],
    email: "ops@bbkowloon.com",
  },
  {
    id: "minh-son",
    name: "Mr. Minh Son",
    role: "General Director",
    languages: "Vietnamese-speaking representative",
    phones: ["+84 968 716 188"],
    email: "agency@bbkowloon.com",
  },
];

export type PortOption = {
  id: string;
  number: string;
  category: string;
  name: string;
  representativeId: PortRepresentative["id"];
};

export const portOptions: PortOption[] = [
  { id: "sihanoukville", number: "01", category: "Seaport", name: "Sihanoukville", representativeId: "thao-quyen" },
  { id: "phnom-penh", number: "02", category: "River port", name: "Phnom Penh", representativeId: "pongnarith-chorn" },
  { id: "kampot", number: "03", category: "Seaport", name: "Kampot", representativeId: "pongnarith-chorn" },
  { id: "oknha-mong", number: "04", category: "Seaport", name: "Oknha Mong", representativeId: "pongnarith-chorn" },
  { id: "mekong-river", number: "05", category: "River network", name: "Mekong River / Other", representativeId: "minh-son" },
];

export type RiverTerminal = {
  code: string;
  name: string;
  berths: string;
  draft: string;
  capacity: string;
  land: string;
  navigation: string;
  distance: string;
};

export const riverTerminals: RiverTerminal[] = [
  {
    code: "LM17",
    name: "Container Terminal LM17",
    berths: "9 berths",
    draft: "4.5 m",
    capacity: "1,000,000 TEUs/year",
    land: "40 ha (33.22 ha operational)",
    navigation: "Cai Mep 28-32 hrs · Cat Lai 21-25 hrs",
    distance: "Cai Mep 373 km · Cat Lai 345 km",
  },
  {
    code: "UM2",
    name: "Sub-feeder Multipurpose Terminal UM2",
    berths: "2 berths",
    draft: "4.5 m",
    capacity: "70,000 TEUs/year",
    land: "24.04 ha (5.49 ha operational)",
    navigation: "Cai Mep 31-42 hrs · Cat Lai 30-40 hrs",
    distance: "Cai Mep 503 km · Cat Lai 475 km",
  },
  {
    code: "UM1",
    name: "Sub-feeder Multipurpose Terminal UM1",
    berths: "1 berth",
    draft: "4.5 m",
    capacity: "60,000 TEUs/year",
    land: "4 ha",
    navigation: "Cai Mep 32-43 hrs · Cat Lai 27-38 hrs",
    distance: "Cai Mep 513 km · Cat Lai 485 km",
  },
  {
    code: "TS11",
    name: "Sub-feeder Multipurpose Terminal TS11",
    berths: "1 berth",
    draft: "4.5 m",
    capacity: "60,000 TEUs/year",
    land: "4 ha",
    navigation: "Cai Mep 32-43 hrs · Cat Lai 27-38 hrs",
    distance: "Cai Mep 513 km · Cat Lai 485 km",
  },
  {
    code: "LM26",
    name: "Sub-feeder Multipurpose Terminal LM26",
    berths: "5 berths",
    draft: "4.5-5.5 m",
    capacity: "3,000-4,000 ton barges",
    land: "21.90 ha (19.86 ha operational)",
    navigation: "Cai Mep 17-23 hrs · Cat Lai 15-21 hrs",
    distance: "Cai Mep 275 km · Cat Lai 247 km",
  },
];

export const operatingPrinciples = [
  {
    title: "Reliable",
    text: "Route-focused transport planning across the Vietnam–Cambodia corridor.",
  },
  {
    title: "Safe",
    text: "Secure loading, stable navigation and controlled cargo handling.",
  },
  {
    title: "Efficient",
    text: "Coordinated barge, port, warehousing and forwarding operations.",
  },
];

export const ports = [
  {
    name: "Kampot Port",
    image: "/images/profile/kampot-port.webp",
  },
  {
    name: "Sihanoukville Port",
    image: "/images/profile/sihanoukville-port.webp",
  },
  {
    name: "Container Terminal LM17",
    image: "/images/profile/container-terminal-lm17.webp",
  },
];
