/**
 * Módulo de Segurança - CDL Ipirá
 * Implementa proteções contra diversos tipos de ataques
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase-admin';

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
  // Endpoints de autenticação (mais restritivos)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5,           // 5 tentativas por 15 minutos
    blockDurationMs: 30 * 60 * 1000, // 30 minutos de bloqueio
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
 * Obtém o IP do cliente da requisição
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (cfIP) return cfIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  
  return 'unknown';
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
 * Sanitiza string removendo caracteres perigosos
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove tags HTML
    .replace(/<[^>]*>/g, '')
    // Remove caracteres de controle
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Escapa caracteres especiais para prevenir XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Valida se é um email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valida se é uma URL válida
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
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

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
] as const;

// Magic bytes para validar tipos de arquivo
const FILE_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
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
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'];
  if (!extension || !validExtensions.includes(extension)) {
    return { valid: false, error: 'Extensão de arquivo não permitida' };
  }

  // Verificar magic bytes (assinatura do arquivo)
  if (validateMagicBytes && FILE_SIGNATURES[file.type]) {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const signatures = FILE_SIGNATURES[file.type];
    
    const isValidSignature = signatures.some(sig => 
      sig.every((byte, index) => bytes[index] === byte)
    );
    
    if (!isValidSignature) {
      return { valid: false, error: 'Arquivo corrompido ou tipo não corresponde' };
    }
  }

  // Verificar nome do arquivo
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_');
  if (sanitizedName.includes('..') || sanitizedName.startsWith('.')) {
    return { valid: false, error: 'Nome de arquivo inválido' };
  }

  return { valid: true };
}

// ==================== PROTEÇÃO CSRF ====================

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
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get('csrf_token')?.value;
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

// ==================== VALIDAÇÃO DE SESSÃO ====================

// Tamanho esperado do token de sessão (32 bytes = 64 caracteres hex)
export const SESSION_TOKEN_LENGTH = 64;

/**
 * Valida a sessão do administrador contra a tabela admin_sessions.
 * 
 * Aceita apenas tokens de sessão válidos (64 caracteres hexadecimais).
 * Não aceita mais IDs numéricos (modo legacy removido).
 */
export async function validateAdminSession(request: NextRequest): Promise<{
  valid: boolean;
  userId?: string;
  adminId?: number;
  error?: string;
}> {
  // Ler token do cookie da requisição (funciona no middleware)
  const sessionCookie = request.cookies.get('admin_session');
  
  if (!sessionCookie?.value) {
    return { valid: false, error: 'Sessão não encontrada' };
  }
  
  const token = sessionCookie.value;
  
  // Validar formato: deve ser exatamente 64 caracteres hexadecimais
  if (token.length !== SESSION_TOKEN_LENGTH || !/^[a-f0-9]+$/.test(token)) {
    return { valid: false, error: 'Formato de sessão inválido' };
  }
  
  // Validar token contra o banco
  try {
    const now = new Date().toISOString();
    
    // Buscar sessão no banco, verificando se não está expirada
    const { data, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('admin_id, expires_at')
      .eq('token', token)
      .gt('expires_at', now)
      .single();
    
    if (error || !data) {
      // Sessão não encontrada ou expirada
      return { valid: false, error: 'Sessão expirada ou inválida' };
    }
    
    return { 
      valid: true, 
      userId: String(data.admin_id),
      adminId: data.admin_id
    };
  } catch (err) {
    console.error('[Security] Erro ao validar sessão:', err);
    return { valid: false, error: 'Erro ao validar sessão' };
  }
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

// ==================== DETECÇÃO DE ATAQUES ====================

// Padrões suspeitos em inputs
const SUSPICIOUS_PATTERNS = [
  // SQL Injection
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b)/i,
  /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
  /(--|#|\/\*|\*\/)/,
  
  // XSS
  /<script\b[^>]*>/i,
  /javascript:/i,
  /on\w+\s*=/i,
  
  // Path Traversal
  /\.\.\//,
  /\.\.%2f/i,
  
  // Command Injection
  /[;&|`$]/,
];

/**
 * Verifica se um input contém padrões suspeitos
 */
export function detectSuspiciousInput(input: string): boolean {
  if (typeof input !== 'string') return false;
  
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Verifica todos os campos de um objeto em busca de inputs suspeitos
 */
export function scanForThreats(
  data: Record<string, unknown>,
  request: NextRequest
): { safe: boolean; threats: string[] } {
  const threats: string[] = [];
  
  function scan(obj: unknown, path: string = ''): void {
    if (typeof obj === 'string') {
      if (detectSuspiciousInput(obj)) {
        threats.push(`Padrão suspeito em ${path || 'root'}`);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => scan(item, `${path}[${index}]`));
    } else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        scan(value, path ? `${path}.${key}` : key);
      });
    }
  }
  
  scan(data);
  
  if (threats.length > 0) {
    logSecurityEvent({
      type: 'suspicious_activity',
      ip: getClientIP(request),
      path: request.nextUrl.pathname,
      details: { threats },
    });
  }
  
  return { safe: threats.length === 0, threats };
}

