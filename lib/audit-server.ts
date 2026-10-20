/**
 * Utilitário para registrar ações de auditoria (server-side)
 * Use este arquivo em API routes
 */

import { supabaseAdmin } from './supabase-admin';
import { getAdminUser } from './supabase-server';
import { getClientIP } from './security';

export interface AuditLogEntry {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  table_name: string;
  record_id?: string;
  record_title?: string;
  user_id?: string;
  user_name?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
}

/**
 * Registra uma ação no log de auditoria (server-side)
 * O autor vem da sessão Supabase da requisição, nunca do corpo enviado pelo cliente.
 * Esta função não lança erros para não afetar a operação principal
 */
export async function logAuditServer(entry: AuditLogEntry, request?: Request): Promise<boolean> {
  try {
    const actor = entry.user_id || entry.user_name ? null : await getAdminUser();
    const ipAddress = entry.ip_address || (request ? getClientIP(request) : undefined);

    const { error } = await supabaseAdmin
      .from('audit_log')
      .insert({
        action: entry.action,
        table_name: entry.table_name,
        record_id: entry.record_id || null,
        record_title: entry.record_title || null,
        user_id: entry.user_id || actor?.id || null,
        user_name: entry.user_name || actor?.name || 'Admin',
        details: entry.details || null,
        ip_address: ipAddress || null,
      });

    if (error) {
      console.error('Erro ao registrar auditoria:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
    return false;
  }
}

/**
 * Helpers para ações comuns (server-side)
 */
export const auditServer = {
  create: (table_name: string, record_id: string, record_title?: string, details?: Record<string, unknown>, request?: Request) =>
    logAuditServer({ action: 'CREATE', table_name, record_id, record_title, details }, request),

  update: (table_name: string, record_id: string, record_title?: string, details?: Record<string, unknown>, request?: Request) =>
    logAuditServer({ action: 'UPDATE', table_name, record_id, record_title, details }, request),

  delete: (table_name: string, record_id: string, record_title?: string, details?: Record<string, unknown>, request?: Request) =>
    logAuditServer({ action: 'DELETE', table_name, record_id, record_title, details }, request),
};
