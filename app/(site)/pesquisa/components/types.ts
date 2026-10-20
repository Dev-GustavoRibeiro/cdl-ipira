import { FaNewspaper, FaCalendarAlt, FaBriefcase, FaVideo, FaFileAlt, FaBullhorn } from 'react-icons/fa';
import { parseDateOnly } from '@/lib/date';

export interface SearchResult {
  type: string;
  id: string | number;
  title: string;
  description: string;
  url: string;
  image?: string;
  date?: string;
  category?: string;
  relevance: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  error?: string;
}

export interface TypeConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export const typeConfig: Record<string, TypeConfig> = {
  noticia: { 
    label: 'Notícia', 
    icon: FaNewspaper, 
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  evento: { 
    label: 'Evento', 
    icon: FaCalendarAlt, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  vaga: { 
    label: 'Vaga', 
    icon: FaBriefcase, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  video: { 
    label: 'Vídeo', 
    icon: FaVideo, 
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  campanha: {
    label: 'Campanha',
    icon: FaBullhorn,
    color: 'text-[#00a859]',
    bgColor: 'bg-[#00a859]/10'
  },
  page: { 
    label: 'Página', 
    icon: FaFileAlt, 
    color: 'text-[#003f7f]',
    bgColor: 'bg-blue-50'
  }
};

// parseDateOnly evita que '2026-10-20' apareça como dia 19 no fuso do Brasil
export function formatDate(dateString: string | undefined): string {
  const date = parseDateOnly(dateString);
  if (!date) return dateString || '';
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}



