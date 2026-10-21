import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

// Host do projeto Supabase (evita liberar *.supabase.co de qualquer pessoa)
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').host;
  } catch {
    return '';
  }
})() || '*.supabase.co';

// Content Security Policy
// Em desenvolvimento, é mais permissivo (HMR via websocket e eval do React Refresh)
const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https:;
    font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:;
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://challenges.cloudflare.com;
    connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://challenges.cloudflare.com ${isDev ? 'ws: wss:' : ''};
    media-src 'self' https://${supabaseHost} blob:;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    ${isDev ? '' : "frame-ancestors 'none'; upgrade-insecure-requests;"}
  `.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  // Desabilitar header X-Powered-By para não expor tecnologia usada
  poweredByHeader: false,

  // Desabilitar React Strict Mode para evitar double-mounting em desenvolvimento
  // NOTA: Em produção, isso não tem efeito. Considere reativar para debugging.
  reactStrictMode: false,

  // Configuração do Turbopack (Next.js 16+)
  turbopack: {},

  // Permitir acesso de outros dispositivos na rede local durante desenvolvimento
  // NOTA: Este warning pode aparecer mesmo com configuração correta (bug do Turbopack)
  // Para evitar reloads, use uma única aba ou acesse via localhost
  allowedDevOrigins: [
    'http://192.168.56.1:3000',
    'http://192.168.1.108:3000',
    'http://192.168.88.238:3000',
    'http://localhost:3000',
  ],

  images: {
    // Qualidades permitidas para imagens
    qualities: [75, 100],
    // Domínios permitidos para imagens
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },

  async headers() {
    // Headers base para todos os ambientes
    const baseHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
      },
      {
        key: 'Content-Security-Policy',
        value: ContentSecurityPolicy
      },
    ];

    // Headers adicionais apenas em produção (podem causar problemas em dev com acesso via IP)
    const productionHeaders = isDev ? [] : [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      },
      {
        key: 'Cross-Origin-Embedder-Policy',
        value: 'credentialless'
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin'
      },
      {
        key: 'Cross-Origin-Resource-Policy',
        value: 'cross-origin'  // Mudado de 'same-origin' para permitir recursos externos
      },
    ];

    return [
      {
        source: '/:path*',
        headers: [...baseHeaders, ...productionHeaders]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          },
        ]
      }
    ]
  }
};

export default nextConfig;
