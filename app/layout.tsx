import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Viewport deve ser exportado separadamente (Next.js 14+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#003f7f",
};

export const metadata: Metadata = {
  title: "CDL Ipirá - Câmara de Dirigentes Lojistas",
  description: "CDL Ipirá - Representando e fortalecendo o comércio de Ipirá. Serviços, consultas SPC, certificado digital e muito mais.",
  keywords: "CDL Ipirá, comércio, lojistas, SPC, certificado digital, Ipirá, Bahia",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CDL Ipirá",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/logo-cdl.png",
    shortcut: "/logo-cdl.png",
    apple: "/logo-cdl.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
