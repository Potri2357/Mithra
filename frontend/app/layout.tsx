import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Devanagari, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-noto-tamil",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mithra — Bureau of Indian Standards Intelligence",
  description:
    "Official AI-driven standards and compliance intelligence platform for the Bureau of Indian Standards (BIS). Direct, citation-grounded guidance on 22,000+ Indian Standards (IS), mandatory QCOs, certification schemes, and hallmarking.",
  keywords:
    "Mithra, BIS, Indian Standards, Bureau of Indian Standards, ISI Mark, CRS, FMCS, Hallmarking, HUID, BIS Certification, IS Standards, NABL Labs",
  openGraph: {
    title: "Mithra — Bureau of Indian Standards Intelligence",
    description:
      "Direct, citation-grounded advisory on 22,000+ Indian Standards (IS), mandatory QCOs, certification schemes, gold HUID verification, and accredited laboratories.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${notoSans.variable} ${notoSansDevanagari.variable} ${notoSansTamil.variable} font-sans antialiased min-h-screen bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
