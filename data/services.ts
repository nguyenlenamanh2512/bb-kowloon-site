import {
  Anchor,
  Construction,
  Ship,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    number: "01",
    title: "Barge Transportation in the Mekong River",
    description:
      "For bulk and project cargo movements along the Cambodia-Vietnam river corridor.",
    icon: Ship,
  },
  {
    number: "02",
    title: "Port & Terminal Operations",
    description:
      "Terminal coordination, cargo-handling support, tally and on-site supervision.",
    icon: Anchor,
  },
  {
    number: "03",
    title: "Ship Chartering",
    description:
      "Chartering support for bulk cargo and project movements when required.",
    icon: Ship,
  },
  {
    number: "04",
    title: "Cross-Border Trucking",
    description:
      "Border trucking and delivery coordination between Cambodia and Vietnam.",
    icon: Truck,
  },
  {
    number: "05",
    title: "Equipment & Vehicle Rental",
    description:
      "Equipment and vehicle availability for port, cargo and project requirements.",
    icon: Construction,
  },
];

export const coreService = {
  title: "Ship Agency",
  description:
    "Port call coordination, PDA preparation, husbandry services, documentation, berth and cargo coordination, and local support for vessels calling Cambodia.",
};
