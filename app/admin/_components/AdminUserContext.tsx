'use client';

import { createContext, useContext } from 'react';

export interface AdminUserInfo {
  id: string;
  email: string;
  name: string;
}

/** Administrador logado (vem de GET /api/admin/me no layout). null enquanto carrega ou se falhar. */
export const AdminUserContext = createContext<AdminUserInfo | null>(null);

export function useAdminUser() {
  return useContext(AdminUserContext);
}

/** "Gustavo Ribeiro" -> "GR"; e-mail -> primeira letra. */
export function getInitials(nameOrEmail: string) {
  const parts = nameOrEmail.split('@')[0].trim().split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? 'A') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}
