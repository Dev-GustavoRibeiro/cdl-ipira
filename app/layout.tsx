import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";

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
    <html lang="pt-BR">
      <body className={inter.className}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
