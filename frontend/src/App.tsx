import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import Search from './pages/Search';
import Statistics from './pages/Statistics';

export default function App() {
  return (
    <div className="min-h-screen bg-vault-bg">
      <div className="noise-overlay" />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/search" element={<Search />} />
          <Route path="/stats" element={<Statistics />} />
        </Routes>
      </Layout>
    </div>
  );
}
