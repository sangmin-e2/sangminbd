
export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  author: string;
  createdAt: number;
}

export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';

export const COLORS: Record<NoteColor, string> = {
  yellow: 'bg-yellow-100 border-yellow-200 text-yellow-900',
  blue: 'bg-blue-100 border-blue-200 text-blue-900',
  green: 'bg-green-100 border-green-200 text-green-900',
  pink: 'bg-pink-100 border-pink-200 text-pink-900',
  purple: 'bg-purple-100 border-purple-200 text-purple-900',
  orange: 'bg-orange-100 border-orange-200 text-orange-900',
};

export const SECRET_PASSWORD = "1212";
export const CLOUD_API_BASE = "https://jsonblob.com/api/jsonBlob";
