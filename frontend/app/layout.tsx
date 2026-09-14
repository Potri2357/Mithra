import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BIS Saathi — Bureau of Indian Standards AI Assistant",
  description:
    "Official-grade AI Assistant for the Bureau of Indian Standards (SIH PS 26107). Instant, source-grounded guidance on Indian Standards (IS), certification schemes, HUID hallmarking, and accredited laboratories.",
  keywords: "BIS, Indian Standards, Bureau of Indian Standards, ISI Mark, CRS, FMCS, Hallmarking, HUID, BIS Certification, IS Standards",
  openGraph: {
    title: "BIS Saathi — Bureau of Indian Standards AI Assistant",
    description: "Instant, source-grounded guidance on Indian Standards (IS), certification schemes, hallmarking, and accredited testing labs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${publicSans.variable} font-sans antialiased text-slate-100 bg-[#090D16] min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

