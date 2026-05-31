import { Star, Heart, Check } from 'lucide-react';
import { MediaType, WatchStatus, STATUS_COLORS, STATUS_LABELS, TYPE_COLORS } from '../../types';

// Rating Stars
export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: {
  value?: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}) {
  const sz = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          className={`${sz} transition-colors ${
            value && n <= value ? 'text-yellow-400' : 'text-white/20'
          } ${!readonly ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
        >
          <Star className={`${sz} fill-current`} />
        </button>
      ))}
    </div>
  );
}

// Status Badge
export function StatusBadge({ status }: { status: WatchStatus }) {
  return (
    <span className={`badge ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

// Type Badge
export function TypeBadge({ type }: { type: MediaType }) {
  const labels: Record<MediaType, string> = {
    anime: 'Anime',
    movie: 'Movie',
    series: 'Series',
  };
  return (
    <span className={`badge ${TYPE_COLORS[type]}`}>
      {labels[type]}
    </span>
  );
}

// Skeleton
export function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

// Card skeletons
export function MediaCardSkeleton() {
  return (
    <div className="rounded-md overflow-hidden">
      <div className="skeleton aspect-[2/3] w-full" />
    </div>
  );
}

// Empty state
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      {icon && (
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/20">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-white/60 font-medium">{title}</h3>
        {description && <p className="text-white/30 text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// Confirm dialog
export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#1e1e1e] border border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
        <h3 className="font-semibold text-white text-base">{title}</h3>
        {description && <p className="text-white/40 text-sm mt-2">{description}</p>}
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="btn-ghost text-sm">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger text-sm">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Favorite button
export function FavoriteButton({
  active,
  onClick,
  size = 'md',
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md';
}) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded transition-all duration-150 ${
        active ? 'text-pink-500' : 'text-white/30 hover:text-pink-400'
      }`}
    >
      <Heart className={`${sz} ${active ? 'fill-current' : ''}`} />
    </button>
  );
}

// In watchlist indicator
export function InWatchlistBadge() {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
      <Check className="w-3 h-3" />
      In Watchlist
    </div>
  );
}

// Loading spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' }[size];
  return (
    <svg className={`${sz} animate-spin text-vault-accent`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
