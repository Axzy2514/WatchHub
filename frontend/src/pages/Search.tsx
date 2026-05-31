import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Tv2 } from 'lucide-react';
import { useAnimeSearch, useMovieSearch, useSeriesSearch } from '../hooks';
import { MediaCardSkeleton, EmptyState, Spinner } from '../components/ui';
import SearchCard from '../components/cards/SearchCard';
import { MediaType, SearchResult, WatchlistEntry } from '../types';
import { watchlistApi } from '../services/api';

type Tab = 'anime' | 'movie' | 'series';

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: 'anime', label: 'Anime', color: '#ff6b9d' },
  { id: 'movie', label: 'Movies', color: '#ffd166' },
  { id: 'series', label: 'TV Series', color: '#06d6a0' },
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tab, setTab] = useState<Tab>('anime');
  const [existingEntries, setExistingEntries] = useState<Record<string, WatchlistEntry>>({});
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const animeQuery = useAnimeSearch(tab === 'anime' ? debouncedQuery : '');
  const movieQuery = useMovieSearch(tab === 'movie' ? debouncedQuery : '');
  const seriesQuery = useSeriesSearch(tab === 'series' ? debouncedQuery : '');

  const activeQuery = tab === 'anime' ? animeQuery : tab === 'movie' ? movieQuery : seriesQuery;
  const results: SearchResult[] = (activeQuery.data?.pages?.flatMap((p) => p.results) || []);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
          activeQuery.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [activeQuery]);

  useEffect(() => {
    if (!results.length) return;
    const check = async () => {
      const updates: Record<string, WatchlistEntry> = {};
      await Promise.allSettled(
        results.map(async (r) => {
          const key = `${r.externalId}-${r.type}`;
          if (existingEntries[key] !== undefined) return;
          const entry = await watchlistApi.getByExternalId(r.externalId, r.type as MediaType);
          if (entry) updates[key] = entry;
        })
      );
      if (Object.keys(updates).length) {
        setExistingEntries((prev) => ({ ...prev, ...updates }));
      }
    };
    check();
  }, [results.length, tab]);

  const isLoading = activeQuery.isLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-header">Search</h1>
        <p className="text-white/40 text-sm mt-1">Find anime, movies, and TV series to track</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${tab === 'anime' ? 'anime' : tab === 'movie' ? 'movies' : 'TV series'}...`}
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
          autoFocus
        />
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-[#1a1a1a] rounded-lg p-1 w-fit border border-white/5">
        {TABS.map(({ id, label, color }) => (
          <button
            key={id}
            id={`tab-${id}`}
            onClick={() => setTab(id)}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-150 ${
              tab === id
                ? 'bg-[#2a2a2a] text-white shadow-sm'
                : 'text-white/35 hover:text-white/70'
            }`}
            style={tab === id ? { color } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      {debouncedQuery.length < 2 ? (
        <EmptyState
          icon={<SearchIcon className="w-8 h-8" />}
          title="Start searching"
          description="Type at least 2 characters to search"
        />
      ) : isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
          {Array(16).fill(0).map((_, i) => <MediaCardSkeleton key={i} />)}
        </div>
      ) : !results.length ? (
        <EmptyState
          icon={<Tv2 className="w-8 h-8" />}
          title="No results found"
          description={`Nothing matched "${debouncedQuery}"`}
        />
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
            {results.map((result) => (
              <SearchCard
                key={result.id}
                result={result}
                existingEntry={existingEntries[`${result.externalId}-${result.type}`]}
                onEntryAdded={(entry) => {
                  setExistingEntries((prev) => ({
                    ...prev,
                    [`${result.externalId}-${result.type}`]: entry,
                  }));
                }}
              />
            ))}
          </div>

          <div ref={loadMoreRef} className="flex justify-center py-6">
            {activeQuery.isFetchingNextPage && <Spinner />}
            {!activeQuery.hasNextPage && results.length > 0 && (
              <p className="text-white/20 text-xs">All results loaded</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
