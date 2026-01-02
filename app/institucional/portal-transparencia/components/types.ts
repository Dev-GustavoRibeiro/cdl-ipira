export interface Documento {
  id: number;
  title: string;
  description?: string;
  type: string;
  category?: string;
  date: string;
  file_url: string;
  is_active: boolean;
}



