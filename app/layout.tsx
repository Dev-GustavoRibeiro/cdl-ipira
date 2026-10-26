import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, TITLE_TEMPLATE } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Viewport deve ser exportado separadamente (Next.js 14+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // cover: libera env(safe-area-inset-*) no iPhone com notch (barra inferior, menu e rodapé usam essas margens)
  viewportFit: "cover",
  themeColor: "#003f7f",
};

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

// Padrão do site. As rotas públicas completam com pageMetadata (lib/seo.ts): canonical, Open Graph e Twitter da página.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  keywords: ["CDL Ipirá", "Câmara de Dirigentes Lojistas de Ipirá", "SPC Ipirá", "certificado digital Ipirá", "comércio de Ipirá", "Ipirá-BA"],
  // Rotas sem pageMetadata (ex.: 404) herdam este Open Graph; a imagem vem de app/opengraph-image.jpg
  openGraph: { type: "website", locale: "pt_BR", siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image" },
  // Search Console: só entra a meta quando a variável estiver configurada
  ...(googleVerification && { verification: { google: googleVerification } }),
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
        {/* Filtro da refração "líquida" do liquid glass (globals.css, html.lg-refract): ondulação suave no que passa
            por trás do vidro. Só o Chromium aplica filtro SVG no backdrop-filter. */}
        <svg aria-hidden="true" width="0" height="0" className="absolute">
          <filter id="lg-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
