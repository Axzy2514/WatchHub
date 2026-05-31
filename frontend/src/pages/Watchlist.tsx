import { useState } from 'react';
import { Search, SortAsc, Heart, Tv2 } from 'lucide-react';
import { useWatchlist } from '../hooks';
import { MediaType, WatchStatus, STATUS_LABELS } from '../types';
import { MediaCardSkeleton, EmptyState } from '../components/ui';
import WatchlistCard from '../components/cards/WatchlistCard';
import { watchlistApi } from '../services/api';
import toast from 'react-hot-toast';

type SortBy = 'createdAt' | 'watchedAt' | 'personalRating' | 'title';

export default function Watchlist() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<MediaType | ''>('');
  const [status, setStatus] = useState<WatchStatus | ''>('');
  const [favorite, setFavorite] = useState<boolean | undefined>();
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [importing, setImporting] = useState(false);

  const { data, isLoading } = useWatchlist({
    search: search || undefined,
    type: type || undefined,
    status: status || undefined,
    favorite,
    sortBy,
    sortOrder,
  });

  const handleExport = async () => {
    try {
      await watchlistApi.exportWatchlist();
      toast.success('Watchlist exported!');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const result = await watchlistApi.importWatchlist(file);
      toast.success(`Imported ${result.imported} entries (${result.skipped} skipped)`);
    } catch {
      toast.error('Import failed — invalid file format');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const clearFilters = () => {
    setSearch('');
    setType('');
    setStatus('');
    setFavorite(undefined);
  };

  const hasFilters = search || type || status || favorite !== undefined;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-header">Watchlist</h1>
          <p className="text-white/40 text-sm mt-1">
            {data ? `${data.total} titles` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="btn-ghost cursor-pointer text-xs">
            <input type="file" accept=".json" className="hidden" onChange={handleImport} disabled={importing} />
            {importing ? 'Importing...' : 'Import'}
          </label>
          <button onClick={handleExport} className="btn-ghost text-xs">Export</button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter your watchlist..."
            className="w-full bg-[#232323] border border-white/8 rounded-md pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MediaType | '')}
            className="bg-[#232323] border border-white/8 rounded-md px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-white/20 cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="anime">Anime</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WatchStatus | '')}
            className="bg-[#232323] border border-white/8 rounded-md px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-white/20 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {(Object.keys(STATUS_LABELS) as WatchStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="bg-[#232323] border border-white/8 rounded-md px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-white/20 cursor-pointer"
          >
            <option value="createdAt">Recently Added</option>
            <option value="watchedAt">Recently Watched</option>
            <option value="personalRating">Rating</option>
            <option value="title">Alphabetical</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1.5 bg-[#232323] border border-white/8 rounded-md px-3 py-2 text-xs text-white/60 hover:text-white transition-colors"
          >
            <SortAsc className={`w-3.5 h-3.5 transition-transform ${sortOrder === 'asc' ? '' : 'rotate-180'}`} />
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>

          <button
            onClick={() => setFavorite(favorite ? undefined : true)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
              favorite
                ? 'bg-pink-500/15 border border-pink-500/30 text-pink-400'
                : 'bg-[#232323] border border-white/8 text-white/60 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
            Favorites
          </button>

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-vault-accent hover:text-white transition-colors px-2">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
          {Array(16).fill(0).map((_, i) => <MediaCardSkeleton key={i} />)}
        </div>
      ) : !data?.entries?.length ? (
        <EmptyState
          icon={<Tv2 className="w-8 h-8" />}
          title={hasFilters ? 'No results found' : 'Your watchlist is empty'}
          description={hasFilters ? 'Try adjusting your filters' : 'Search and add anime, movies, and series to get started'}
        />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
          {data.entries.map((entry) => (
            <WatchlistCard key={entry._id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
