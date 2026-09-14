import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mithra — Bureau of Indian Standards Intelligence",
  description:
    "Official AI-driven standards and compliance intelligence platform for the Bureau of Indian Standards (BIS). Grounded guidance on 22,000+ Indian Standards (IS), mandatory QCOs, certification schemes, and hallmarking.",
  keywords:
    "Mithra, BIS, Indian Standards, Bureau of Indian Standards, ISI Mark, CRS, FMCS, Hallmarking, HUID, BIS Certification, IS Standards, NABL Labs",
  openGraph: {
    title: "Mithra — Bureau of Indian Standards Intelligence",
    description:
      "Instant, verified guidance on 22,000+ Indian Standards, certification schemes, gold hallmark verification, and accredited testing labs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
