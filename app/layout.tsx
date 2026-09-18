import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "BB Kowloon | Barge & Breakbulk Logistics",
    template: "%s | BB Kowloon",
  },
  description:
    "Cross-border barge, breakbulk vessel and cargo logistics between Vietnam and Cambodia via the Mekong River.",
  openGraph: {
    title: "BB Kowloon | Barge & Breakbulk Logistics",
    description:
      "Cross-border cargo transport between Vietnam and Cambodia via the Mekong River.",
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
