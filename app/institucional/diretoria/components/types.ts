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



