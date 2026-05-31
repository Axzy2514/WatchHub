import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, Search, BarChart3, Tv2, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/watchlist', icon: List, label: 'Watchlist' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/stats', icon: BarChart3, label: 'Statistics' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#141414]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#0d0d0d] fixed h-full z-20 border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-56 bg-[#0d0d0d] border-r border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-56 min-h-screen flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-[#0d0d0d] border-b border-white/5 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-vault-accent font-bold text-lg tracking-tight">WATCH</span>
            <span className="text-white font-bold text-lg tracking-tight">HUB</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-vault-muted hover:text-white p-1 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        <div className="flex-1 p-5 lg:p-8 max-w-screen-2xl mx-auto w-full animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-1">
          <span className="text-vault-accent font-bold text-xl tracking-tight">WATCH</span>
          <span className="text-white font-bold text-xl tracking-tight">HUB</span>
        </div>
        <div className="text-[11px] text-white/30 mt-0.5 tracking-widest uppercase">Media Tracker</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/5">
        <div className="text-[11px] text-white/20">WatchHub v1.0</div>
      </div>
    </div>
  );
}
