/**
 * Utilitário para registrar ações de auditoria
 */

export interface AuditLogEntry {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  table_name: string;
  record_id?: string;
  record_title?: string;
  user_id?: string;
  user_name?: string;
  details?: Record<string, unknown>;
}

/**
 * Registra uma ação no log de auditoria
 * Esta função não lança erros para não afetar a operação principal
 */
export async function logAuditAction(entry: AuditLogEntry): Promise<boolean> {
  try {
    // Obter informações do usuário do localStorage (client-side)
    let userName = entry.user_name;
    if (typeof window !== 'undefined' && !userName) {
      const adminUser = localStorage.getItem('admin_user');
      if (adminUser) {
        try {
          const user = JSON.parse(adminUser);
          userName = user.name || user.username || 'Admin';
        } catch {
          userName = 'Admin';
        }
      }
    }

    const response = await fetch('/api/admin/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...entry,
        user_name: userName || entry.user_name,
      }),
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
    return false;
  }
}

/**
 * Helpers para ações comuns
 */
export const auditLog = {
  create: (table_name: string, record_id: string, record_title?: string, details?: Record<string, unknown>) =>
    logAuditAction({ action: 'CREATE', table_name, record_id, record_title, details }),
  
  update: (table_name: string, record_id: string, record_title?: string, details?: Record<string, unknown>) =>
    logAuditAction({ action: 'UPDATE', table_name, record_id, record_title, details }),
  
  delete: (table_name: string, record_id: string, record_title?: string, details?: Record<string, unknown>) =>
    logAuditAction({ action: 'DELETE', table_name, record_id, record_title, details }),
  
  login: (user_name: string, details?: Record<string, unknown>) =>
    logAuditAction({ action: 'LOGIN', table_name: 'auth', user_name, details }),
  
  logout: (user_name: string) =>
    logAuditAction({ action: 'LOGOUT', table_name: 'auth', user_name }),
};
