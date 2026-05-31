export type MediaType = 'anime' | 'movie' | 'series';
export type WatchStatus = 'watching' | 'completed' | 'dropped' | 'plan_to_watch';

export interface WatchlistEntry {
  _id: string;
  externalId: string;
  type: MediaType;
  title: string;
  imageUrl?: string;
  year?: number;
  status: WatchStatus;
  personalRating?: number;
  notes?: string;
  favorite: boolean;
  watchedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistResponse {
  entries: WatchlistEntry[];
  total: number;
}

export interface Stats {
  totalAnime: number;
  totalMovies: number;
  totalSeries: number;
  totalFavorites: number;
  completed: number;
  watching: number;
  dropped: number;
  planToWatch: number;
  avgRating: number | null;
  totalRated: number;
  recentlyAdded: WatchlistEntry[];
  recentlyWatched: WatchlistEntry[];
  ratingDistribution: { _id: number; count: number }[];
  typeDistribution: { _id: string; count: number }[];
  statusDistribution: { _id: string; count: number }[];
}

// External API types
export interface AnimeResult {
  mal_id: number;
  title: string;
  title_english?: string;
  images: { jpg: { image_url: string; large_image_url: string } };
  score?: number;
  year?: number;
  synopsis?: string;
  genres?: { name: string }[];
  episodes?: number;
  status?: string;
  type?: string;
}

export interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  genre_ids?: number[];
  media_type?: string;
}

export interface SearchResult {
  id: string;
  externalId: string;
  type: MediaType;
  title: string;
  imageUrl?: string;
  year?: number;
  rating?: number;
  synopsis?: string;
  genres?: string[];
  episodes?: number;
  runtime?: number;
}

export interface CreateEntryDto {
  externalId: string;
  type: MediaType;
  title: string;
  imageUrl?: string;
  year?: number;
  status: WatchStatus;
  personalRating?: number;
  notes?: string;
  favorite?: boolean;
  watchedAt?: string;
}

export interface UpdateEntryDto {
  status?: WatchStatus;
  personalRating?: number;
  notes?: string;
  favorite?: boolean;
  watchedAt?: string;
}

export const STATUS_LABELS: Record<WatchStatus, string> = {
  watching: 'Watching',
  completed: 'Completed',
  dropped: 'Dropped',
  plan_to_watch: 'Plan to Watch',
};

export const STATUS_COLORS: Record<WatchStatus, string> = {
  watching: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  dropped: 'text-red-500 bg-red-500/10 border-red-500/20',
  plan_to_watch: 'text-white/40 bg-white/5 border-white/10',
};

export const TYPE_COLORS: Record<MediaType, string> = {
  anime: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  movie: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  series: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};
