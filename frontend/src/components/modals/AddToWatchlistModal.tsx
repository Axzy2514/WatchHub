import { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { SearchResult, WatchStatus, STATUS_LABELS, WatchlistEntry } from '../../types';
import { useCreateEntry } from '../../hooks';
import { StarRating } from '../ui';

interface Props {
  result: SearchResult;
  onClose: () => void;
  onAdded: (entry: WatchlistEntry) => void;
}

export default function AddToWatchlistModal({ result, onClose, onAdded }: Props) {
  const [status, setStatus] = useState<WatchStatus>('plan_to_watch');
  const [rating, setRating] = useState<number | undefined>();
  const [notes, setNotes] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [watchedAt, setWatchedAt] = useState('');

  const createEntry = useCreateEntry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEntry.mutate(
      {
        externalId: result.externalId,
        type: result.type,
        title: result.title,
        imageUrl: result.imageUrl,
        year: result.year,
        status,
        personalRating: rating,
        notes: notes || undefined,
        favorite,
        watchedAt: watchedAt || undefined,
      },
      {
        onSuccess: (entry) => onAdded(entry),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1a1a] border border-white/8 rounded-xl w-full max-w-md shadow-2xl animate-scale-in">

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/6">
          <div className="flex gap-3 items-start">
            {result.imageUrl && (
              <img
                src={result.imageUrl}
                alt={result.title}
                className="w-10 h-14 rounded object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h2 className="text-white font-semibold text-base leading-tight line-clamp-2">{result.title}</h2>
              <div className="text-white/35 text-xs mt-0.5">{result.year}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white p-1 ml-2 flex-shrink-0 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Status */}
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold block mb-2">Status</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(STATUS_LABELS) as WatchStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                    status === s
                      ? 'bg-vault-accent/15 border-vault-accent/40 text-white'
                      : 'border-white/8 text-white/40 hover:text-white hover:border-white/20'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold block mb-2">
              Rating {rating ? `· ${rating}/10` : '· optional'}
            </label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Watch date */}
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold block mb-2">Watch Date · optional</label>
            <input
              type="date"
              value={watchedAt}
              onChange={(e) => setWatchedAt(e.target.value)}
              className="input-field text-sm"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold block mb-2">Notes · optional</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Your thoughts..."
              rows={2}
              className="input-field text-sm resize-none"
            />
          </div>

          {/* Favorite toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <button
              type="button"
              onClick={() => setFavorite(!favorite)}
              className={`p-1.5 rounded-lg transition-all ${
                favorite ? 'text-pink-500 bg-pink-500/10' : 'text-white/25 hover:text-pink-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
            <span className="text-sm text-white/50">Mark as favorite</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center text-sm">Cancel</button>
            <button type="submit" disabled={createEntry.isPending} className="btn-primary flex-1 justify-center text-sm">
              {createEntry.isPending ? 'Adding...' : 'Add to Watchlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
