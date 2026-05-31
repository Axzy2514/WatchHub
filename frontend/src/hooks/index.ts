import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { watchlistApi, searchApi } from '../services/api';
import { CreateEntryDto, UpdateEntryDto, MediaType } from '../types';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';

// Watchlist hooks
export function useWatchlist(params?: Record<string, string | boolean | number | undefined>) {
  return useQuery({
    queryKey: ['watchlist', params],
    queryFn: () => watchlistApi.getAll(params),
  });
}

export function useWatchlistEntry(id: string) {
  return useQuery({
    queryKey: ['watchlist', id],
    queryFn: () => watchlistApi.getById(id),
    enabled: !!id,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: watchlistApi.getStats,
  });
}

export function useCreateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEntryDto) => watchlistApi.create(data),
    onSuccess: (entry) => {
      qc.invalidateQueries({ queryKey: ['watchlist'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success(`"${entry.title}" added to watchlist!`);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const msg = error?.response?.data?.error || 'Failed to add entry';
      if (msg.includes('already exists')) {
        toast.error('Already in your watchlist!');
      } else {
        toast.error(msg);
      }
    },
  });
}

export function useUpdateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntryDto }) =>
      watchlistApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watchlist'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Updated!');
    },
    onError: () => toast.error('Failed to update'),
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => watchlistApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watchlist'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Removed from watchlist');
    },
    onError: () => toast.error('Failed to delete'),
  });
}

// Search hooks
export function useAnimeSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ['search', 'anime', query],
    queryFn: ({ pageParam = 1 }) => searchApi.searchAnime(query, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last, _, lastPageParam) =>
      last.hasMore ? (lastPageParam as number) + 1 : undefined,
    enabled: query.length >= 2,
  });
}

export function useMovieSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ['search', 'movie', query],
    queryFn: ({ pageParam = 1 }) => searchApi.searchMovies(query, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last, _, lastPageParam) =>
      last.hasMore ? (lastPageParam as number) + 1 : undefined,
    enabled: query.length >= 2,
  });
}

export function useSeriesSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ['search', 'series', query],
    queryFn: ({ pageParam = 1 }) => searchApi.searchSeries(query, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last, _, lastPageParam) =>
      last.hasMore ? (lastPageParam as number) + 1 : undefined,
    enabled: query.length >= 2,
  });
}

export function useMediaDetails(type: MediaType | null, externalId: string | null) {
  return useQuery({
    queryKey: ['details', type, externalId],
    queryFn: () => {
      if (!type || !externalId) return null;
      if (type === 'anime') return searchApi.getAnimeDetails(externalId);
      if (type === 'movie') return searchApi.getMovieDetails(externalId);
      return searchApi.getSeriesDetails(externalId);
    },
    enabled: !!type && !!externalId,
  });
}

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const updateDebounced = useCallback((v: T) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(v), delay);
  }, [delay]);

  // Update when value changes
  useState(() => {
    updateDebounced(value);
  });

  return debounced;
}

// Simple debounce hook
export function useDebounceValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useState(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  });

  return debounced;
}
