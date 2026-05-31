import { useState } from 'react';
import { X, Star, Heart, Calendar, FileText, Trash2 } from 'lucide-react';
import { WatchlistEntry, WatchStatus, STATUS_LABELS, MediaType } from '../../types';
import { useUpdateEntry, useDeleteEntry, useMediaDetails } from '../../hooks';
import { StarRating, StatusBadge, TypeBadge, ConfirmDialog, Spinner } from '../ui';
import { format } from 'date-fns';

interface Props {
  entry: WatchlistEntry;
  onClose: () => void;
}

export default function DetailModal({ entry, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<WatchStatus>(entry.status);
  const [rating, setRating] = useState<number | undefined>(entry.personalRating);
  const [notes, setNotes] = useState(entry.notes || '');
  const [favorite, setFavorite] = useState(entry.favorite);
  const [watchedAt, setWatchedAt] = useState(
    entry.watchedAt ? format(new Date(entry.watchedAt), 'yyyy-MM-dd') : ''
  );
  const [showDelete, setShowDelete] = useState(false);

  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();

  const { data: details, isLoading: detailsLoading } = useMediaDetails(
    entry.type as MediaType,
    entry.externalId
  );

  const handleSave = () => {
    updateEntry.mutate(
      {
        id: entry._id,
        data: {
          status,
          personalRating: rating,
          notes: notes || undefined,
          favorite,
          watchedAt: watchedAt || undefined,
        },
      },
      { onSuccess: () => setEditing(false) }
    );
  };

  const handleDelete = () => {
    deleteEntry.mutate(entry._id, { onSuccess: onClose });
  };

  const displayData = details || entry;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-[#1a1a1a] border border-white/8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">

          {/* Hero banner */}
          <div className="relative h-52 overflow-hidden rounded-t-xl flex-shrink-0 bg-[#111]">
            {entry.imageUrl && (
              <>
                <img
                  src={entry.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
              </>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white/60 hover:text-white transition-colors backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="absolute inset-0 flex items-end p-6 gap-4">
              {entry.imageUrl && (
                <img
                  src={entry.imageUrl}
                  alt={entry.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-2xl flex-shrink-0 border border-white/10"
                />
              )}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <TypeBadge type={entry.type} />
                  {entry.year && <span className="text-white/35 text-xs">{entry.year}</span>}
                </div>
                <h2 className="text-white font-bold text-xl leading-tight line-clamp-2">{entry.title}</h2>
                {details?.rating && details.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm font-semibold">{(details.rating as number).toFixed(1)}</span>
                    <span className="text-white/30 text-xs">community</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Synopsis */}
            {detailsLoading ? (
              <div className="flex items-center gap-2 text-white/30 text-sm">
                <Spinner size="sm" /> Loading details...
              </div>
            ) : details?.synopsis ? (
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Synopsis</div>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-4">{details.synopsis}</p>
              </div>
            ) : null}

            {/* Meta pills */}
            {details && (details.genres?.length || details.episodes || details.runtime) && (
              <div className="flex flex-wrap gap-2 text-xs">
                {details.genres?.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-full bg-white/6 border border-white/8 text-white/50">
                    {g}
                  </span>
                ))}
                {details.episodes && (
                  <span className="px-2.5 py-1 rounded-full bg-white/6 border border-white/8 text-white/50">
                    {details.episodes} episodes
                  </span>
                )}
                {details.runtime && (
                  <span className="px-2.5 py-1 rounded-full bg-white/6 border border-white/8 text-white/50">
                    {details.runtime} min
                  </span>
                )}
              </div>
            )}

            <div className="border-t border-white/6" />

            {/* Personal data */}
            {editing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Edit Entry</h3>
                  <button onClick={() => setEditing(false)} className="text-white/30 hover:text-white text-sm transition-colors">Cancel</button>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold block mb-2">Status</label>
                  <div className="grid grid-cols-2 gap-2">
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
                    Rating {rating ? `(${rating}/10)` : ''}
                  </label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                {/* Watch date */}
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold block mb-2">Watch Date</label>
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
                  <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold block mb-2">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Your thoughts..."
                    rows={3}
                    className="input-field text-sm resize-none"
                  />
                </div>

                {/* Favorite */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setFavorite(!favorite)}
                    className={`p-1.5 rounded-lg transition-all ${favorite ? 'text-pink-500 bg-pink-500/10' : 'text-white/30 hover:text-pink-400'}`}
                  >
                    <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
                  </button>
                  <span className="text-sm text-white/60">Mark as favorite</span>
                </label>

                <button
                  onClick={handleSave}
                  disabled={updateEntry.isPending}
                  className="btn-primary w-full justify-center"
                >
                  {updateEntry.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Status</div>
                    <StatusBadge status={entry.status} />
                  </div>

                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Favorite</div>
                    <div className={entry.favorite ? 'text-pink-400 flex items-center gap-1.5 text-sm' : 'text-white/25 flex items-center gap-1.5 text-sm'}>
                      <Heart className={`w-3.5 h-3.5 ${entry.favorite ? 'fill-current' : ''}`} />
                      {entry.favorite ? 'Favorited' : 'Not favorited'}
                    </div>
                  </div>

                  {entry.personalRating && (
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">My Rating</div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 font-bold">{entry.personalRating}/10</span>
                      </div>
                    </div>
                  )}

                  {entry.watchedAt && (
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Watched</div>
                      <div className="flex items-center gap-1.5 text-sm text-white/60">
                        <Calendar className="w-3.5 h-3.5 text-white/25" />
                        {format(new Date(entry.watchedAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                  )}
                </div>

                {entry.notes && (
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
                      <FileText className="w-3 h-3" /> Notes
                    </div>
                    <p className="text-white/50 text-sm bg-[#232323] rounded-lg p-3 border border-white/6">{entry.notes}</p>
                  </div>
                )}

                <div className="text-xs text-white/20">
                  Added {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setEditing(true)} className="btn-primary flex-1 justify-center">Edit Entry</button>
                  <button onClick={() => setShowDelete(true)} className="btn-danger px-3">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Remove from watchlist?"
        description={`"${entry.title}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleteEntry.isPending}
      />
    </>
  );
}
