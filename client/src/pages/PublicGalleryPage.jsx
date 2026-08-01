import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Github, Globe, Code2, Star, Trophy } from 'lucide-react';

export const PublicGalleryPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tech, setTech] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (tech) params.tech = tech;

      const res = await API.get('/analytics/gallery', { params });
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [tech]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight flex items-center gap-3">
          <Code2 className="w-8 h-8 text-indigo-400" /> Public Project <span className="gradient-text">Gallery</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl">
          Explore real-world software, AI agents, and open-source hacks built by hackathon participants.
        </p>

        {/* Search Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={(e) => { e.preventDefault(); fetchGallery(); }} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by name, problem, tech stack..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </form>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Popular Tech:</span>
            {['React', 'Node.js', 'PyTorch', 'MongoDB', 'Docker'].map((t) => (
              <button
                key={t}
                onClick={() => setTech(tech === t ? '' : t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                  tech === t ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-gray-900 text-gray-400 border-gray-700 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Showcase */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-gray-900/60 animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border border-gray-800 text-gray-400 text-sm">
          No projects found matching query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {submissions.map((sub) => (
            <div key={sub._id} className="glass-card rounded-2xl p-6 border border-gray-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-1">
                  <span>{sub.hackathonId?.title}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {sub.totalScore || 0} pts
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-heading">{sub.projectName}</h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                  {sub.problemStatement}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-800/80">
                <div className="flex flex-wrap gap-1">
                  {sub.techStack?.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-gray-400 font-medium">Team: {sub.teamId?.name || 'Hackers Squad'}</span>
                  <div className="flex items-center gap-2">
                    {sub.githubUrl && (
                      <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-gray-900 hover:text-indigo-400 text-gray-300">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {sub.liveDemoUrl && (
                      <a href={sub.liveDemoUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-gray-900 hover:text-indigo-400 text-gray-300">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
