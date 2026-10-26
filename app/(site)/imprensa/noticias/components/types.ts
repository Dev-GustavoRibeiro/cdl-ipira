export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  color: string;
  author: string;
  /** Campanha ligada (null quando não há ou ela está desativada) */
  campaign?: { slug: string; title: string } | null;
}



