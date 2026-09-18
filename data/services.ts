import {
  Anchor,
  BadgeCheck,
  Construction,
  FileCheck2,
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
    title: "Barge Transportation",
    description:
      "River transport for bulk and project cargo along the Mekong River, with an emphasis on safety and on-time delivery.",
    icon: Ship,
  },
  {
    number: "02",
    title: "Port & Terminal Operations",
    description:
      "Port and terminal operations supporting cargo transfer across the company’s transport route.",
    icon: Anchor,
  },
  {
    number: "03",
    title: "Customs Brokerage",
    description:
      "Customs brokerage is included within BB Kowloon’s cross-border logistics service offering.",
    icon: FileCheck2,
  },
  {
    number: "04",
    title: "Cross-Border Trucking",
    description:
      "Road transport coordination for cross-border cargo movements between logistics points.",
    icon: Truck,
  },
  {
    number: "05",
    title: "Ship Agency & Chartering",
    description:
      "Ship agency and chartering services for vessel-based cargo operations.",
    icon: BadgeCheck,
  },
  {
    number: "06",
    title: "Equipment & Vehicle Rental",
    description:
      "Construction equipment and vehicle rental form part of the company’s listed services.",
    icon: Construction,
  },
];
