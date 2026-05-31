import { Link } from 'react-router-dom';
import { Tv2, Film, Monitor, Heart, Star, Clock, Plus, TrendingUp } from 'lucide-react';
import { useStats } from '../hooks';
import { MediaCardSkeleton } from '../components/ui';
import WatchlistCard from '../components/cards/WatchlistCard';
import { WatchlistEntry } from '../types';

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Header */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#1a0a0a] via-[#1c1c1c] to-[#141414] border border-white/5 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(229,9,20,0.12),_transparent_60%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-vault-accent text-xs font-bold tracking-widest uppercase">Personal</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-1">Your Dashboard</h1>
          <p className="text-white/40 text-sm">Everything you've been watching, in one place.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div>
        <h2 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon={<Tv2 className="w-4 h-4" />} label="Anime" value={stats?.totalAnime ?? 0} accent="#ff6b9d" isLoading={isLoading} />
          <StatCard icon={<Film className="w-4 h-4" />} label="Movies" value={stats?.totalMovies ?? 0} accent="#ffd166" isLoading={isLoading} />
          <StatCard icon={<Monitor className="w-4 h-4" />} label="Series" value={stats?.totalSeries ?? 0} accent="#06d6a0" isLoading={isLoading} />
          <StatCard icon={<Heart className="w-4 h-4" />} label="Favorites" value={stats?.totalFavorites ?? 0} accent="#E50914" isLoading={isLoading} />
          <StatCard
            icon={<Star className="w-4 h-4" />}
            label="Avg Rating"
            value={stats?.avgRating ? `${stats.avgRating.toFixed(1)}/10` : '—'}
            accent="#ffd166"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Watching', value: stats?.watching ?? 0, color: '#3b82f6' },
          { label: 'Completed', value: stats?.completed ?? 0, color: '#06d6a0' },
          { label: 'Dropped', value: stats?.dropped ?? 0, color: '#E50914' },
          { label: 'Plan to Watch', value: stats?.planToWatch ?? 0, color: '#ffffff' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-[#1a1a1a] rounded-lg px-4 py-3 border border-white/5 flex items-center justify-between"
            style={{ borderLeftColor: color, borderLeftWidth: 3 }}
          >
            <span className="text-white/50 text-xs font-medium">{label}</span>
            {isLoading ? (
              <div className="skeleton h-5 w-8 rounded" />
            ) : (
              <span className="text-white font-bold text-lg">{value}</span>
            )}
          </div>
        ))}
      </div>

      {/* Recently Added */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-vault-accent" />
            <h2 className="text-base font-semibold text-white">Recently Added</h2>
          </div>
          <Link to="/watchlist" className="text-xs text-white/40 hover:text-white transition-colors">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
            {Array(8).fill(0).map((_, i) => <MediaCardSkeleton key={i} />)}
          </div>
        ) : stats?.recentlyAdded?.length ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
            {stats.recentlyAdded.map((entry) => (
              <WatchlistCard key={entry._id} entry={entry as unknown as WatchlistEntry} />
            ))}
          </div>
        ) : (
          <EmptyDash />
        )}
      </section>

      {/* Recently Watched */}
      {(stats?.recentlyWatched?.length ?? 0) > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-vault-accent" />
            <h2 className="text-base font-semibold text-white">Recently Watched</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
            {stats!.recentlyWatched.map((entry) => (
              <WatchlistCard key={entry._id} entry={entry as unknown as WatchlistEntry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: string;
  isLoading: boolean;
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 flex flex-col gap-2">
      <div className="flex items-center gap-2" style={{ color: accent }}>
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">{label}</span>
      </div>
      {isLoading ? (
        <div className="skeleton h-8 w-14 rounded" />
      ) : (
        <div className="text-2xl font-bold text-white">{value}</div>
      )}
    </div>
  );
}

function EmptyDash() {
  return (
    <div className="rounded-lg border border-dashed border-white/10 p-10 text-center">
      <Tv2 className="w-8 h-8 text-white/15 mx-auto mb-3" />
      <p className="text-white/30 text-sm mb-4">Nothing added yet.</p>
      <Link to="/search" className="btn-primary inline-flex">
        <Plus className="w-4 h-4" /> Browse &amp; Add
      </Link>
    </div>
  );
}
