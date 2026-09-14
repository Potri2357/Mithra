import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maanak Saathi (मानक साथी) — Bureau of Indian Standards Intelligence",
  description:
    "Official-grade AI Assistant for the Bureau of Indian Standards. Source-grounded guidance on Indian Standards (IS), certification schemes (ISI, CRS, FMCS), HUID hallmark verification, and accredited testing laboratories.",
  keywords:
    "Maanak Saathi, BIS, Indian Standards, Bureau of Indian Standards, ISI Mark, CRS, FMCS, Hallmarking, HUID, BIS Certification, IS Standards, NABL Labs",
  openGraph: {
    title: "Maanak Saathi (मानक साथी) — Bureau of Indian Standards Intelligence",
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
