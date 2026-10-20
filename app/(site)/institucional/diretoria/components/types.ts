export interface TeamMember {
  id: number;
  name: string;
  role: 'presidente' | 'vice_presidente' | 'diretor' | 'suplente' | 'colaborador';
  position: string;
  photo_url?: string;
  bio?: string;
  contribution?: string;
  function_description?: string;
  display_order: number;
  is_active: boolean;
}

// Fotos no Storage do Supabase passam pelo otimizador do Next (remotePatterns só libera esse host);
// URLs de outros hosts são exibidas como estão
const storageHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').host;
  } catch {
    return '';
  }
})();

export function isStorageImage(url: string): boolean {
  try {
    return Boolean(storageHost) && new URL(url).host === storageHost;
  } catch {
    return false;
  }
}
