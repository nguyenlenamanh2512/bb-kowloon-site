import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "BB Kowloon | Ship Agency & Logistics in Cambodia",
    template: "%s | BB Kowloon",
  },
  description:
    "Local ship agency, PDA preparation and supporting cargo logistics across Cambodia's seaports and Mekong River terminals.",
  openGraph: {
    title: "BB Kowloon | Ship Agency & Logistics in Cambodia",
    description:
      "Your trusted local ship agency and logistics partner in Cambodia.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
