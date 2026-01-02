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
}

export const getStatusBadge = (status: Event['status']) => {
  switch (status) {
    case 'upcoming':
      return { text: 'Próximo', color: 'bg-[#00a859] text-white' };
    case 'ongoing':
      return { text: 'Em Andamento', color: 'bg-[#ffd000] text-[#003f7f]' };
    case 'past':
      return { text: 'Realizado', color: 'bg-gray-400 text-white' };
  }
};



