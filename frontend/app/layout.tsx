import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BIS Saathi — AI Assistant for Indian Standards",
  description:
    "AI-powered assistant for Bureau of Indian Standards. Get instant, cited guidance on IS standards, BIS certification, hallmarking, testing labs — in English and Hindi.",
  keywords: "BIS, Indian Standards, ISI Mark, CRS, FMCS, Hallmarking, HUID, BIS Certification, IS Standards",
  openGraph: {
    title: "BIS Saathi — AI Assistant for Indian Standards",
    description: "Free, instant, source-backed BIS guidance for MSMEs, manufacturers, and consumers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
