export type Project = {
  slug: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  route?: string;
  cargo?: string;
  client?: string;
  specification?: string;
  scope?: string;
};

export const projects: Project[] = [
  {
    slug: "fertilizer-mekong",
    title: "Fertilizer Shipments",
    category: "Bulk cargo",
    image: "/images/profile/fertilizer-loading.webp",
    summary:
      "Efficient river transport for fertilizer shipments between Vietnam and Cambodia.",
    route: "Vietnam → Cambodia via the Mekong River",
    cargo: "Fertilizer",
    scope: "Barge transportation",
  },
  {
    slug: "soybean-meal-cambodia",
    title: "Soybean Meal",
    category: "Agricultural cargo",
    image: "/images/profile/soybean-meal.webp",
    summary:
      "Agricultural cargo transported from Vietnam through the Mekong River route for delivery to a factory in Cambodia.",
    route: "Vietnam → Cambodia via the Mekong River",
    cargo: "Soybean meal",
    client: "CP Cambodia Co., Ltd",
    scope: "Barge transport, port operations, warehousing and cross-border forwarding",
  },
  {
    slug: "steel-transshipment",
    title: "Steel Cargo Transshipment",
    category: "Industrial cargo",
    image: "/images/profile/steel-cargo.webp",
    summary:
      "Transshipment of steel cargo from China to Cambodia through Phu My Port in Vietnam.",
    route: "China → Phu My Port, Vietnam → Cambodia",
    cargo: "Steel cargo",
  },
  {
    slug: "concrete-piles",
    title: "Concrete Piles Cargo",
    category: "Project cargo",
    image: "/images/profile/concrete-piles.webp",
    summary:
      "Barge loading and river transportation of concrete pile cargo.",
    cargo: "Concrete piles",
  },
  {
    slug: "bridge-construction-pipes",
    title: "Bridge Construction Pipes",
    category: "Oversized & overweight cargo",
    image: "/images/profile/oversized-pipes.webp",
    summary:
      "Over-dimensional steel pipe transportation supporting bridge construction projects in Phnom Penh.",
    route: "Mekong River route → Phnom Penh",
    cargo: "Steel pipes",
    specification: "47 metres total length",
    scope: "Specialized barging, secure loading and safe delivery",
  },
  {
    slug: "phnom-penh-port-pipes",
    title: "Phnom Penh Port Pipes",
    category: "Oversized & overweight cargo",
    image: "/images/profile/phnom-penh-port-pipes.webp",
    summary:
      "Over-dimensional steel pipes transported to support construction of the Phnom Penh port.",
    route: "Mekong River route → Phnom Penh port",
    cargo: "Steel pipes",
    specification: "46 metres total length",
    scope: "Tugboat and pontoon operation, loading, river navigation and delivery",
  },
  {
    slug: "steel-billets-breakbulk",
    title: "Steel Billets by Breakbulk Vessel",
    category: "Breakbulk vessel",
    image: "/images/profile/bulk-vessel.webp",
    summary:
      "Breakbulk vessel transportation supporting industrial and manufacturing operations in Cambodia.",
    route: "Can Tho Port, Vietnam → Kampot Port, Cambodia",
    cargo: "Steel billets",
    scope: "Loading, sea navigation and cross-border delivery",
  },
];
