import type { Metadata, Viewport } from "next";
import { DM_Sans, Noto_Sans_Devanagari, Noto_Sans_Tamil } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { MiniChatProvider } from "@/context/MiniChatContext";
import { MiniChatbot } from "@/components/MiniChatbot";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#181816" },
  ],
};

export const metadata: Metadata = {
  title: "Mithraa — Bureau of Indian Standards Intelligence",
  description:
    "Official AI-driven standards and compliance intelligence platform for the Bureau of Indian Standards (BIS). Direct, citation-grounded guidance on 22,000+ Indian Standards (IS), mandatory QCOs, certification schemes, and hallmarking.",
  icons: {
    icon: "/mithra_logo.svg",
    shortcut: "/mithra_logo.svg",
    apple: "/mithra_logo.svg",
  },
  keywords:
    "Mithraa, BIS, Indian Standards, Bureau of Indian Standards, ISI Mark, CRS, FMCS, Hallmarking, HUID, BIS Certification, IS Standards, NABL Labs",
  openGraph: {
    title: "Mithraa — Bureau of Indian Standards Intelligence",
    description:
      "Direct, citation-grounded advisory on 22,000+ Indian Standards (IS), mandatory QCOs, certification schemes, gold HUID verification, and accredited laboratories.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var s = localStorage.getItem('mithraa-theme') || localStorage.getItem('mithra-theme') || localStorage.getItem('maanak-theme');
                if (s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${notoSansDevanagari.variable} ${notoSansTamil.variable} font-sans antialiased min-h-screen`}>
        <LanguageProvider>
          <AuthProvider>
            <ProjectProvider>
              <MiniChatProvider>
                {children}
                <MiniChatbot />
              </MiniChatProvider>
            </ProjectProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
