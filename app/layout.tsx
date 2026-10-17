import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luther John Allen Concepcion",
  description: "A project-first portfolio for a developer.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
