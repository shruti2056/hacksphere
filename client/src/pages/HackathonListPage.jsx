import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { HackathonCard } from '../components/HackathonCard';
import { Search, Filter, RefreshCw, Trophy } from 'lucide-react';

export const HackathonListPage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('');
  const [status, setStatus] = useState('');

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (mode) params.mode = mode;
      if (status) params.status = status;

      const res = await API.get('/hackathons', { params });
      setHackathons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, [mode, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHackathons();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Filters */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight flex items-center gap-3">
          <Trophy className="w-8 h-8 text-indigo-400" /> Browse <span className="gradient-text">Hackathons</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl">
          Filter by competition format, registration availability, and technological themes.
        </p>

        {/* Search Bar & Dropdown Controls */}
        <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, theme, keywords..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Mode Filter */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Modes (Online & Offline)</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Lifecycle Statuses</option>
              <option value="Registration Open">Registration Open</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={fetchHackathons}
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-gray-900/60 animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : hackathons.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border border-gray-800">
          <p className="text-gray-400 text-sm">No hackathons matched your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon._id} hackathon={hackathon} />
          ))}
        </div>
      )}
    </div>
  );
};
