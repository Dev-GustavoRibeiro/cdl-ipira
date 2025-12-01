import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

// Content Security Policy
// Em desenvolvimento, é mais permissivo para permitir acesso via IP
const ContentSecurityPolicy = isDev 
  ? `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google.com https://www.gstatic.com https://impostometro.com.br;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https: http:;
    font-src 'self' https://fonts.gstatic.com data:;
    frame-src 'self' https://www.youtube.com https://www.google.com https://impostometro.com.br;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googleapis.com ws: wss:;
    media-src 'self' https://*.supabase.co blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim()
  : `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google.com https://www.gstatic.com https://impostometro.com.br;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https: http:;
    font-src 'self' https://fonts.gstatic.com data:;
    frame-src 'self' https://www.youtube.com https://www.google.com https://impostometro.com.br;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googleapis.com;
    media-src 'self' https://*.supabase.co blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  // Desabilitar header X-Powered-By para não expor tecnologia usada
  poweredByHeader: false,
  
  // Permitir acesso de outros dispositivos na rede local durante desenvolvimento
  // Inclui IPs das interfaces de rede deste computador
  allowedDevOrigins: [
    'http://192.168.56.1',
    'http://192.168.1.108',
    'http://localhost',
  ],
  
  images: {
    // Domínios permitidos para imagens
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
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
