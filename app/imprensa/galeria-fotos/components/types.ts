export interface AlbumPhoto {
  id: number;
  album_id: number;
  url: string;
  title?: string;
  display_order: number;
}

export interface Album {
  id: number;
  title: string;
  description?: string;
  cover_url?: string;
  cover?: string;
  date: string;
  location?: string;
  category: string;
  is_active?: boolean;
  photo_count?: number;
}



