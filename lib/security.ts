/**
 * Módulo de Segurança - CDL Ipirá
 * Implementa proteções contra diversos tipos de ataques
 */

import { NextRequest, NextResponse } from 'next/server';

// ==================== RATE LIMITING ====================

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

// Store de rate limiting em memória (em produção, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configurações de rate limiting por tipo de endpoint
export const RATE_LIMIT_CONFIG = {
  // Endpoints públicos (mais permissivos)
  public: {
    windowMs: 60 * 1000, // 1 minuto
    maxRequests: 100,    // 100 requests por minuto
    blockDurationMs: 5 * 60 * 1000, // 5 minutos de bloqueio
  },
  // Login: aqui só um freio contra rajadas (conta TODAS as requisições, inclusive logins certos). O bloqueio
  // por senha errada fica na rota /api/admin/auth (5 falhas por IP → 15 min), além do limite do próprio Supabase.
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 20,          // 20 requisições por 15 minutos
    blockDurationMs: 15 * 60 * 1000, // 15 minutos de bloqueio
  },
  // Endpoints de upload (moderado)
  upload: {
    windowMs: 60 * 1000,  // 1 minuto
    maxRequests: 10,      // 10 uploads por minuto
    blockDurationMs: 10 * 60 * 1000, // 10 minutos de bloqueio
  },
  // Endpoints administrativos (moderado)
  admin: {
    windowMs: 60 * 1000, // 1 minuto
    maxRequests: 60,     // 60 requests por minuto
    blockDurationMs: 5 * 60 * 1000, // 5 minutos de bloqueio
  },
} as const;

type RateLimitType = keyof typeof RATE_LIMIT_CONFIG;

/**
 * Obtém o IP do cliente da requisição.
 * Na Vercel estes cabeçalhos são reescritos pela plataforma, então o cliente não consegue forjá-los
 * (cf-connecting-ip não é usado: sem Cloudflare na frente ele chega direto do cliente).
 */
export function getClientIP(request: Pick<Request, 'headers'>): string {
  const ip =
    request.headers.get('x-vercel-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for');

  return ip?.split(',')[0].trim() || 'unknown';
}

/**
 * Verifica e aplica rate limiting
 * @returns null se permitido, NextResponse se bloqueado
 */
export function checkRateLimit(
  request: NextRequest,
  type: RateLimitType = 'public'
): NextResponse | null {
  const ip = getClientIP(request);
  const config = RATE_LIMIT_CONFIG[type];
  const key = `${type}:${ip}`;
  const now = Date.now();

  // Limpar entradas antigas periodicamente
  if (Math.random() < 0.01) { // 1% chance de limpeza
    cleanupRateLimitStore();
  }

  const entry = rateLimitStore.get(key);

  // Verificar se está bloqueado
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return NextResponse.json(
      { 
        error: 'Muitas requisições. Tente novamente mais tarde.',
        retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(entry.blockedUntil).toISOString(),
        }
      }
    );
  }

  // Resetar se a janela expirou
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null;
  }

  // Incrementar contador
  entry.count++;

  // Verificar se excedeu o limite
  if (entry.count > config.maxRequests) {
    entry.blockedUntil = now + config.blockDurationMs;
    rateLimitStore.set(key, entry);
    
    const retryAfter = Math.ceil(config.blockDurationMs / 1000);
    return NextResponse.json(
      { 
        error: 'Limite de requisições excedido. Você foi temporariamente bloqueado.',
        retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
        }
      }
    );
  }

  rateLimitStore.set(key, entry);
  return null;
}

/**
 * Limpa entradas antigas do store de rate limiting
 */
function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entradas que expiraram e não estão bloqueadas
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitStore.delete(key);
    }
  }
}

// ==================== VALIDAÇÃO DE INPUT ====================

/**
 * Limpa texto puro: remove tags HTML e caracteres de controle (mantém quebras de linha e tab).
 * Não escapa entidades: o React já escapa ao renderizar, e escapar aqui gravava "&amp;" no banco
 * (e "&amp;amp;" a cada nova edição).
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    // Remove tags HTML
    .replace(/<[^>]*>/g, '')
    // Remove caracteres de controle, exceto \t, \n e \r
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Valida se é um email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valida se é uma URL válida (absoluta ou relativa)
 */
export function isValidUrl(url: string): boolean {
  // Aceitar strings vazias
  if (!url || url.trim() === '') return true;

  // "//host" e "/\\host" parecem relativas, mas o navegador abre outro site; caracteres de controle também são recusados
  if (/^\/[\/\\]/.test(url) || /[\x00-\x1F\x7F]/.test(url)) return false;

  // Aceitar URLs relativas (começam com /)
  if (url.startsWith('/')) return true;
  
  // Validar URLs absolutas
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Link seguro para gravar e usar em href/src: URL http(s) ou caminho relativo do próprio site
 */
export function isSafeLink(value: unknown, maxLength: number = 500): value is string {
  return typeof value === 'string' && value.length <= maxLength && isValidUrl(value);
}

/**
 * Valida e sanitiza um objeto de dados
 */
export function validateAndSanitize<T extends Record<string, unknown>>(
  data: T,
  schema: {
    [K in keyof T]?: {
      type: 'string' | 'number' | 'boolean' | 'email' | 'url';
      required?: boolean;
      maxLength?: number;
      minLength?: number;
      min?: number;
      max?: number;
    };
  }
): { valid: boolean; errors: string[]; sanitized: Partial<T> } {
  const errors: string[] = [];
  const sanitized: Partial<T> = {};

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key as keyof T];

    // Verificar se é obrigatório
    if (rules?.required && (value === undefined || value === null || value === '')) {
      errors.push(`Campo '${key}' é obrigatório`);
      continue;
    }

    if (value === undefined || value === null) continue;

    switch (rules?.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`Campo '${key}' deve ser texto`);
        } else {
          const sanitizedValue = sanitizeString(value);
          if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
            errors.push(`Campo '${key}' excede o limite de ${rules.maxLength} caracteres`);
          }
          if (rules.minLength && sanitizedValue.length < rules.minLength) {
            errors.push(`Campo '${key}' deve ter pelo menos ${rules.minLength} caracteres`);
          }
          sanitized[key as keyof T] = sanitizedValue as T[keyof T];
        }
        break;

      case 'email':
        if (typeof value !== 'string' || !isValidEmail(value)) {
          errors.push(`Campo '${key}' deve ser um email válido`);
        } else {
          sanitized[key as keyof T] = value.toLowerCase().trim() as T[keyof T];
        }
        break;

      case 'url':
        if (typeof value !== 'string' || (value && !isValidUrl(value))) {
          errors.push(`Campo '${key}' deve ser uma URL válida`);
        } else {
          sanitized[key as keyof T] = value as T[keyof T];
        }
        break;

      case 'number':
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (typeof numValue !== 'number' || isNaN(numValue)) {
          errors.push(`Campo '${key}' deve ser um número`);
        } else {
          if (rules.min !== undefined && numValue < rules.min) {
            errors.push(`Campo '${key}' deve ser no mínimo ${rules.min}`);
          }
          if (rules.max !== undefined && numValue > rules.max) {
            errors.push(`Campo '${key}' deve ser no máximo ${rules.max}`);
          }
          sanitized[key as keyof T] = numValue as T[keyof T];
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          sanitized[key as keyof T] = Boolean(value) as T[keyof T];
        } else {
          sanitized[key as keyof T] = value as T[keyof T];
        }
        break;
    }
  }

  return { valid: errors.length === 0, errors, sanitized };
}

// ==================== VALIDAÇÃO DE ARQUIVOS ====================

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

// Magic bytes para validar tipos de arquivo
const FILE_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/jpg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
  'application/msword': [[0xD0, 0xCF, 0x11, 0xE0]],
  'application/vnd.ms-excel': [[0xD0, 0xCF, 0x11, 0xE0]],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0x50, 0x4B, 0x03, 0x04]],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [[0x50, 0x4B, 0x03, 0x04]],
};

const MIME_ALLOWED_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg', 'jpe', 'jfif'],
  'image/jpg': ['jpg', 'jpeg', 'jpe', 'jfif'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/gif': ['gif'],
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/vnd.ms-excel': ['xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
};

/**
 * Valida um arquivo de upload
 */
export async function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: readonly string[];
    validateMagicBytes?: boolean;
  } = {}
): Promise<{ valid: boolean; error?: string }> {
  const {
    maxSizeMB = 10,
    allowedTypes = ALLOWED_IMAGE_TYPES,
    validateMagicBytes = true,
  } = options;

  // Verificar tamanho
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `Arquivo excede o limite de ${maxSizeMB}MB` };
  }

  // Verificar tipo MIME
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Tipo de arquivo não permitido: ${file.type}` };
  }

  // Verificar extensão
  // Nota: SVG removido por segurança - pode conter scripts maliciosos
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = Array.from(
    new Set(allowedTypes.flatMap((type) => MIME_ALLOWED_EXTENSIONS[type] || []))
  );
  if (!extension || !validExtensions.includes(extension)) {
    return { valid: false, error: 'Extensão de arquivo não permitida' };
  }

  // Verificar magic bytes (assinatura do arquivo). Tipo sem assinatura conhecida é recusado: antes a checagem
  // era pulada e um HTML enviado como 'image/jpg' entrava no storage público
  if (validateMagicBytes) {
    const signatures = FILE_SIGNATURES[file.type];
    if (!signatures) {
      return { valid: false, error: `Tipo de arquivo não permitido: ${file.type}` };
    }
    const buffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const isValidSignature = signatures.some(sig => 
      sig.every((byte, index) => bytes[index] === byte)
    );
    
    if (!isValidSignature) {
      return { valid: false, error: 'Arquivo corrompido ou tipo não corresponde' };
    }
  }

  // Verificar nome do arquivo
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (sanitizedName.includes('..') || sanitizedName.startsWith('.')) {
    return { valid: false, error: 'Nome de arquivo inválido' };
  }

  return { valid: true };
}

// ==================== PROTEÇÃO CSRF ====================

// Double-submit: o cookie é legível pelo JS do painel, que o reenvia no header x-csrf-token
export const CSRF_COOKIE = 'csrf_token';
export const CSRF_COOKIE_OPTIONS = {
  path: '/',
  httpOnly: false,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
};

/**
 * Gera um token CSRF
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica se o token CSRF é válido
 */
export async function verifyCSRFToken(request: NextRequest): Promise<boolean> {
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get('x-csrf-token');
  
  if (!cookieToken || !headerToken) return false;
  
  // Comparação timing-safe
  if (cookieToken.length !== headerToken.length) return false;
  
  let result = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }
  
  return result === 0;
}

// ==================== HEADERS DE SEGURANÇA ====================

/**
 * Adiciona headers de segurança a uma response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cache control para APIs sensíveis
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  
  return response;
}

// ==================== LOGGING DE SEGURANÇA ====================

export interface SecurityEvent {
  type: 'rate_limit' | 'invalid_input' | 'auth_failure' | 'suspicious_activity';
  ip: string;
  path: string;
  details: Record<string, unknown>;
  timestamp: Date;
}

const securityLogs: SecurityEvent[] = [];
const MAX_SECURITY_LOGS = 1000;

/**
 * Registra um evento de segurança
 */
export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  securityLogs.push({
    ...event,
    timestamp: new Date(),
  });
  
  // Manter apenas os últimos N logs
  if (securityLogs.length > MAX_SECURITY_LOGS) {
    securityLogs.shift();
  }
  
  // Em produção, você enviaria isso para um serviço de logging
  if (process.env.NODE_ENV === 'production') {
    console.warn('[SECURITY]', JSON.stringify(event));
  }
}

/**
 * Obtém logs de segurança recentes
 */
export function getSecurityLogs(limit: number = 100): SecurityEvent[] {
  return securityLogs.slice(-limit);
}
