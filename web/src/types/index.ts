export type Role = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Music {
  id: number;
  title: string;
  views: number;
  youtube_id: string;
  thumb: string;
  user_id: number;
  is_approved: boolean;
  count_to_approve: number;
  suggestion_reason?: string;
  created_at: string;
  updated_at: string;
  user?: Pick<User, 'id' | 'name'>;
}

// Alias para compatibilidade com o frontend existente
export type Song = Music;
export type Suggestion = Music;

export interface LogEntry {
  id: string;
  timestamp: string;
  entity: 'user' | 'song' | 'suggestion' | 'auth';
  action: 'create' | 'update' | 'delete' | 'login';
  actor?: Pick<User, 'id' | 'name' | 'email'>;
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  items: T[];
  total: number;
  page?: number;
  size?: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Language {
  code: 'en' | 'pt' | 'es';
  name: string;
  flag: string;
}

export interface Notification {
  id: number;
  user_id: number;
  music_id: number;
  type: 'approved' | 'rejected' | 'auto_approved';
  title: string;
  message: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
  music?: Pick<Music, 'id' | 'title' | 'youtube_id' | 'thumb'>;
}

export interface NotificationResponse {
  data: Notification[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  unread_count: number;
}