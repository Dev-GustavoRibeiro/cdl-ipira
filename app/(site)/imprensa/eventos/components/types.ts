export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees?: number;
  status: 'upcoming' | 'ongoing' | 'past';
  gradient: string;
  fullDate?: string;
  /** false = entrada livre (sem inscrição) */
  registration_enabled?: boolean;
}

export const getStatusBadge = (status: Event['status']) => {
  switch (status) {
    case 'upcoming':
      return { text: 'Próximo', color: 'bg-[#00a859] text-[#001a3d]' }; // texto branco no verde dá 3,1:1
    case 'ongoing':
      return { text: 'Em Andamento', color: 'bg-[#ffd000] text-[#003f7f]' };
    case 'past':
      return { text: 'Realizado', color: 'bg-gray-600 text-white' };
  }
};



