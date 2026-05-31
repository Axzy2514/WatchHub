import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useStats } from '../hooks';
import { Skeleton } from '../components/ui';

const STATUS_COLORS_MAP: Record<string, string> = {
  completed: '#06d6a0',
  watching: '#60a5fa',
  dropped: '#E50914',
  plan_to_watch: '#555',
};

const TYPE_COLORS_MAP: Record<string, string> = {
  anime: '#ff6b9d',
  movie: '#ffd166',
  series: '#06d6a0',
};

const STATUS_LABELS_MAP: Record<string, string> = {
  completed: 'Completed',
  watching: 'Watching',
  dropped: 'Dropped',
  plan_to_watch: 'Plan to Watch',
};

const tooltipStyle = {
  background: '#1e1e1e',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '12px',
};

export default function Statistics() {
  const { data: stats, isLoading } = useStats();

  const ratingData = stats?.ratingDistribution?.map((r) => ({
    rating: `${r._id}★`,
    count: r.count,
  })) || [];

  const typeData = stats?.typeDistribution?.map((t) => ({
    name: t._id.charAt(0).toUpperCase() + t._id.slice(1),
    value: t.count,
    fill: TYPE_COLORS_MAP[t._id] || '#888',
  })) || [];

  const statusData = stats?.statusDistribution?.map((s) => ({
    name: STATUS_LABELS_MAP[s._id] || s._id,
    value: s.count,
    fill: STATUS_COLORS_MAP[s._id] || '#888',
  })) || [];

  const totalCount = (stats?.totalAnime ?? 0) + (stats?.totalMovies ?? 0) + (stats?.totalSeries ?? 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-header">Statistics</h1>
        <p className="text-white/40 text-sm mt-1">Your viewing habits at a glance</p>
      </div>

      {/* Top stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Titles', value: totalCount, color: '#ffffff' },
          { label: 'Completed', value: stats?.completed ?? 0, color: '#06d6a0' },
          { label: 'Favorites', value: stats?.totalFavorites ?? 0, color: '#ff6b9d' },
          { label: 'Avg Rating', value: stats?.avgRating ? `${stats.avgRating.toFixed(1)}/10` : '—', color: '#ffd166' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#1a1a1a] rounded-lg border border-white/5 p-5">
            {isLoading ? (
              <div className="skeleton h-9 w-20 mb-2 rounded" />
            ) : (
              <div className="text-3xl font-bold" style={{ color }}>{value}</div>
            )}
            <div className="text-xs text-white/30 mt-1.5 font-medium uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Type Distribution */}
        <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-6">
          <h3 className="text-white font-semibold mb-1">By Type</h3>
          <p className="text-white/30 text-xs mb-5">{totalCount} total titles</p>
          {isLoading ? (
            <div className="skeleton h-48 w-full rounded" />
          ) : typeData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} strokeWidth={0} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => (
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{value}</span>
                  )}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/20 text-sm">No data yet</div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-6">
          <h3 className="text-white font-semibold mb-1">By Status</h3>
          <p className="text-white/30 text-xs mb-5">Watch progress breakdown</p>
          {isLoading ? (
            <div className="skeleton h-48 w-full rounded" />
          ) : statusData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} strokeWidth={0} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => (
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{value}</span>
                  )}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/20 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Rating Distribution bar chart */}
      <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-6">
        <h3 className="text-white font-semibold mb-1">Rating Distribution</h3>
        <p className="text-white/30 text-xs mb-5">
          {stats?.totalRated ?? 0} rated entries
          {stats?.avgRating ? ` · Average ${stats.avgRating.toFixed(2)}/10` : ''}
        </p>
        {isLoading ? (
          <div className="skeleton h-48 w-full rounded" />
        ) : ratingData.length ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingData} barSize={24}>
              <XAxis dataKey="rating" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#E50914" radius={[3, 3, 0, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-white/20 text-sm">
            No rated entries yet — rate some media to see distribution.
          </div>
        )}
      </div>

      {/* Detailed breakdown grid */}
      <div>
        <h2 className="text-xs font-bold tracking-widest uppercase text-white/25 mb-3">Detailed Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Watching', value: stats?.watching ?? 0, accent: '#60a5fa' },
            { label: 'Completed', value: stats?.completed ?? 0, accent: '#06d6a0' },
            { label: 'Dropped', value: stats?.dropped ?? 0, accent: '#E50914' },
            { label: 'Plan to Watch', value: stats?.planToWatch ?? 0, accent: '#555' },
            { label: 'Anime', value: stats?.totalAnime ?? 0, accent: '#ff6b9d' },
            { label: 'Movies', value: stats?.totalMovies ?? 0, accent: '#ffd166' },
            { label: 'Series', value: stats?.totalSeries ?? 0, accent: '#06d6a0' },
            { label: 'Favorites', value: stats?.totalFavorites ?? 0, accent: '#ff6b9d' },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              className="bg-[#1a1a1a] rounded-lg border border-white/5 p-4"
              style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
            >
              {isLoading ? (
                <div className="skeleton h-7 w-10 mb-1 rounded" />
              ) : (
                <div className="text-2xl font-bold text-white">{value}</div>
              )}
              <div className="text-xs text-white/30 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
