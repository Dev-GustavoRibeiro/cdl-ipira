import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Viewport deve ser exportado separadamente (Next.js 14+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#003f7f",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.cdlipira.com.br"),
  title: {
    default: "CDL Ipirá - Câmara de Dirigentes Lojistas",
    template: "%s - CDL Ipirá",
  },
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
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/icon-192.png",
    apple: { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
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
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
