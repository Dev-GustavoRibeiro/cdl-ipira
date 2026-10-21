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

// Cores da marca: bgColor pinta o quadrado do ícone, color pinta o ícone
export const typeConfig: Record<string, TypeConfig> = {
  noticia: {
    label: 'Notícia',
    icon: FaNewspaper,
    color: 'text-[#00a859]',
    bgColor: 'bg-[#00a859]/10'
  },
  evento: {
    label: 'Evento',
    icon: FaCalendarAlt,
    color: 'text-[#003f7f]',
    bgColor: 'bg-[#ffd000]/30'
  },
  vaga: {
    label: 'Vaga',
    icon: FaBriefcase,
    color: 'text-[#0066cc]',
    bgColor: 'bg-[#0066cc]/10'
  },
  video: {
    label: 'Vídeo',
    icon: FaVideo,
    color: 'text-white',
    bgColor: 'bg-[#003f7f]'
  },
  campanha: {
    label: 'Campanha',
    icon: FaBullhorn,
    color: 'text-[#003f7f]',
    bgColor: 'bg-[#ffd000]'
  },
  page: {
    label: 'Página',
    icon: FaFileAlt,
    color: 'text-[#003f7f]',
    bgColor: 'bg-[#003f7f]/10'
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




const stripAccents = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Divide o texto em trechos marcando os termos da busca, sem diferenciar acentos/maiúsculas
 * ("comercio" destaca "Comércio"). Termos com menos de 2 letras são ignorados.
 */
export function highlightParts(text: string, query: string): { text: string; match: boolean }[] {
  const terms = stripAccents(query.toLowerCase())
    .split(/\s+/)
    .filter((term) => term.length >= 2)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Sem acento cada letra continua ocupando uma posição; se não (caso raro), não destaca
  const plain = Array.from(text, (char) => stripAccents(char)).join('');
  if (!terms.length || plain.length !== text.length) return [{ text, match: false }];

  const parts: { text: string; match: boolean }[] = [];
  const pattern = new RegExp(terms.join('|'), 'gi');
  let last = 0;
  for (const found of plain.matchAll(pattern)) {
    const start = found.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start), match: false });
    parts.push({ text: text.slice(start, start + found[0].length), match: true });
    last = start + found[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), match: false });
  return parts;
}
