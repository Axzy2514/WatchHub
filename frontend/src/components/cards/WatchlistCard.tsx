import { useState } from 'react';
import { Trash2, Edit2, Star, Heart, Tv2 } from 'lucide-react';
import { WatchlistEntry } from '../../types';
import { StatusBadge, TypeBadge, ConfirmDialog, FavoriteButton } from '../ui';
import { useDeleteEntry, useUpdateEntry } from '../../hooks';
import DetailModal from '../modals/DetailModal';

export default function WatchlistCard({ entry }: { entry: WatchlistEntry }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const deleteEntry = useDeleteEntry();
  const updateEntry = useUpdateEntry();

  const handleDelete = () => {
    deleteEntry.mutate(entry._id, { onSuccess: () => setShowDelete(false) });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateEntry.mutate({ id: entry._id, data: { favorite: !entry.favorite } });
  };

  return (
    <>
      <div
        className="media-card group relative"
        onClick={() => setShowDetail(true)}
      >
        {/* Poster */}
        <div className="aspect-[2/3] relative overflow-hidden bg-[#1f1f1f]">
          {entry.imageUrl ? (
            <img
              src={entry.imageUrl}
              alt={entry.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Tv2 className="w-8 h-8 text-white/20" />
              <span className="text-[10px] text-white/20 text-center px-2 leading-tight">{entry.title}</span>
            </div>
          )}

          {/* Gradient overlay — always visible at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Top-left type badge */}
          <div className="absolute top-2 left-2">
            <TypeBadge type={entry.type} />
          </div>

          {/* Favorite button - top right */}
          <div className="absolute top-1.5 right-1.5" onClick={(e) => e.stopPropagation()}>
            <FavoriteButton active={entry.favorite} onClick={handleFavorite} size="sm" />
          </div>

          {/* Bottom overlay with title + actions - visible on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2.5 gap-1.5">
            <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{entry.title}</p>
            <div className="flex items-center justify-between">
              <StatusBadge status={entry.status} />
              {entry.personalRating && (
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-[10px] font-semibold">{entry.personalRating}</span>
                </div>
              )}
            </div>
            <div className="flex gap-1.5 mt-0.5">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDetail(true); }}
                className="flex-1 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-[10px] font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Edit2 className="w-2.5 h-2.5" /> Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setShowDelete(true); }}
                className="py-1 px-2 rounded bg-vault-accent/80 hover:bg-vault-accent text-white text-[10px] transition-colors"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetail && (
        <DetailModal
          entry={entry}
          onClose={() => setShowDetail(false)}
        />
      )}

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
