import axios from 'axios';
import { WatchlistEntry, WatchlistResponse, Stats, CreateEntryDto, UpdateEntryDto, SearchResult, AnimeResult, TMDBResult, MediaType } from '../types';

const api = axios.create({ baseURL: '/api' });

// Watchlist API
export const watchlistApi = {
  getAll: async (params?: Record<string, string | boolean | number | undefined>): Promise<WatchlistResponse> => {
    const { data } = await api.get('/watchlist', { params });
    return data;
  },

  getById: async (id: string): Promise<WatchlistEntry> => {
    const { data } = await api.get(`/watchlist/${id}`);
    return data;
  },

  getByExternalId: async (externalId: string, type: MediaType): Promise<WatchlistEntry | null> => {
    try {
      const { data } = await api.get('/watchlist/by-external', { params: { externalId, type } });
      return data;
    } catch {
      return null;
    }
  },

  create: async (entry: CreateEntryDto): Promise<WatchlistEntry> => {
    const { data } = await api.post('/watchlist', entry);
    return data;
  },

  update: async (id: string, entry: UpdateEntryDto): Promise<WatchlistEntry> => {
    const { data } = await api.put(`/watchlist/${id}`, entry);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/watchlist/${id}`);
  },

  getStats: async (): Promise<Stats> => {
    const { data } = await api.get('/watchlist/stats');
    return data;
  },

  exportWatchlist: async (): Promise<void> => {
    const response = await api.get('/watchlist/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'watchvault-export.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  importWatchlist: async (file: File): Promise<{ imported: number; skipped: number }> => {
    const text = await file.text();
    const json = JSON.parse(text);
    const entries = json.entries || json;
    const { data } = await api.post('/watchlist/import', { entries });
    return data;
  },
};

// External media APIs
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const JIKAN_BASE = 'https://api.jikan.moe/v4';

function tmdbResultToSearchResult(item: TMDBResult, type: 'movie' | 'series'): SearchResult {
  const title = item.title || item.name || 'Unknown';
  const year = item.release_date
    ? parseInt(item.release_date.split('-')[0])
    : item.first_air_date
    ? parseInt(item.first_air_date.split('-')[0])
    : undefined;

  return {
    id: `${type}-${item.id}`,
    externalId: String(item.id),
    type,
    title,
    imageUrl: item.poster_path ? `${TMDB_IMG}${item.poster_path}` : undefined,
    year,
    rating: item.vote_average,
    synopsis: item.overview,
  };
}

function animeToSearchResult(anime: AnimeResult): SearchResult {
  return {
    id: `anime-${anime.mal_id}`,
    externalId: String(anime.mal_id),
    type: 'anime',
    title: anime.title_english || anime.title,
    imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
    year: anime.year,
    rating: anime.score,
    synopsis: anime.synopsis,
    genres: anime.genres?.map((g) => g.name),
    episodes: anime.episodes,
  };
}

export const searchApi = {
  searchAnime: async (query: string, page = 1): Promise<{ results: SearchResult[]; hasMore: boolean }> => {
    const { data } = await axios.get(`${JIKAN_BASE}/anime`, {
      params: { q: query, page, limit: 20 },
    });
    return {
      results: (data.data || []).map(animeToSearchResult),
      hasMore: data.pagination?.has_next_page || false,
    };
  },

  searchMovies: async (query: string, page = 1): Promise<{ results: SearchResult[]; hasMore: boolean }> => {
    const { data } = await axios.get(`${TMDB_BASE}/search/movie`, {
      params: { api_key: TMDB_KEY, query, page },
    });
    return {
      results: (data.results || []).map((r: TMDBResult) => tmdbResultToSearchResult(r, 'movie')),
      hasMore: page < data.total_pages,
    };
  },

  searchSeries: async (query: string, page = 1): Promise<{ results: SearchResult[]; hasMore: boolean }> => {
    const { data } = await axios.get(`${TMDB_BASE}/search/tv`, {
      params: { api_key: TMDB_KEY, query, page },
    });
    return {
      results: (data.results || []).map((r: TMDBResult) => tmdbResultToSearchResult(r, 'series')),
      hasMore: page < data.total_pages,
    };
  },

  getAnimeDetails: async (id: string): Promise<SearchResult & { genres: string[]; episodes?: number }> => {
    const { data } = await axios.get(`${JIKAN_BASE}/anime/${id}`);
    return animeToSearchResult(data.data) as SearchResult & { genres: string[]; episodes?: number };
  },

  getMovieDetails: async (id: string): Promise<SearchResult> => {
    const { data } = await axios.get(`${TMDB_BASE}/movie/${id}`, {
      params: { api_key: TMDB_KEY },
    });
    return {
      ...tmdbResultToSearchResult(data, 'movie'),
      genres: (data.genres || []).map((g: { name: string }) => g.name),
      runtime: data.runtime,
    };
  },

  getSeriesDetails: async (id: string): Promise<SearchResult> => {
    const { data } = await axios.get(`${TMDB_BASE}/tv/${id}`, {
      params: { api_key: TMDB_KEY },
    });
    return {
      ...tmdbResultToSearchResult(data, 'series'),
      genres: (data.genres || []).map((g: { name: string }) => g.name),
      episodes: data.number_of_episodes,
    };
  },
};
