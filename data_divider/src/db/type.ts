export interface Keyword {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface NewsSource {
  id: number;
  media_id: string;
  media_name: string;
}