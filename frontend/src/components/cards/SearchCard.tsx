import { useState } from 'react';
import { Plus, Star, Tv2, Check } from 'lucide-react';
import { SearchResult, WatchlistEntry, MediaType } from '../../types';
import { TypeBadge } from '../ui';
import AddToWatchlistModal from '../modals/AddToWatchlistModal';

interface SearchCardProps {
  result: SearchResult;
  existingEntry?: WatchlistEntry | null;
  onEntryAdded?: (entry: WatchlistEntry) => void;
}

export default function SearchCard({ result, existingEntry, onEntryAdded }: SearchCardProps) {
  const [showAdd, setShowAdd] = useState(false);
  const isInWatchlist = !!existingEntry;

  return (
    <>
      <div className="media-card group flex flex-col">
        {/* Poster */}
        <div className="aspect-[2/3] relative overflow-hidden bg-[#1f1f1f]">
          {result.imageUrl ? (
            <img
              src={result.imageUrl}
              alt={result.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Tv2 className="w-8 h-8 text-white/20" />
              <span className="text-[10px] text-white/20 text-center px-2 leading-tight">{result.title}</span>
            </div>
          )}

          {/* Always-visible bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Type badge top-left */}
          <div className="absolute top-2 left-2">
            <TypeBadge type={result.type} />
          </div>

          {/* Rating bottom-right - always visible */}
          {result.rating && result.rating > 0 && (
            <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
              <span className="text-yellow-400 text-[10px] font-bold">{result.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2.5 gap-1.5">
            <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{result.title}</p>
            {result.year && (
              <span className="text-white/50 text-[10px]">{result.year}</span>
            )}
            {result.episodes && (
              <span className="text-white/50 text-[10px]">{result.episodes} eps</span>
            )}

            {isInWatchlist ? (
              <div className="flex items-center justify-center gap-1 py-1.5 rounded bg-green-500/20 border border-green-500/30 text-green-400 text-[11px] font-semibold mt-1">
                <Check className="w-3 h-3" /> In Watchlist
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setShowAdd(true); }}
                className="flex items-center justify-center gap-1 py-1.5 rounded bg-vault-accent hover:bg-vault-accent-dim text-white text-[11px] font-semibold mt-1 transition-colors active:scale-95"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <AddToWatchlistModal
          result={result}
          onClose={() => setShowAdd(false)}
          onAdded={(entry) => {
            onEntryAdded?.(entry);
            setShowAdd(false);
          }}
        />
      )}
    </>
  );
}
