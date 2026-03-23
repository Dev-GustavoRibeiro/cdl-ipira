import { FaNewspaper, FaCalendarAlt, FaBriefcase, FaVideo, FaFileAlt } from 'react-icons/fa';

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
  page: { 
    label: 'Página', 
    icon: FaFileAlt, 
    color: 'text-[#003f7f]',
    bgColor: 'bg-blue-50'
  }
};

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}



