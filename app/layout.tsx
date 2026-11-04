import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({ src: "../public/fonts/geist-latin.woff2", variable: "--font-geist", display: "swap", weight: "100 900" });
const editorial = localFont({ src: "../public/fonts/instrument-serif-latin.ttf", variable: "--font-editorial", display: "swap", weight: "400", preload: false });

export const metadata: Metadata = {
  title: "Luther John Allen Concepcion",
  description: "A project-first portfolio for a developer.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${editorial.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
