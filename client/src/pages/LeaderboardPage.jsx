import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Trophy, Github, Globe, Star, Award, ShieldCheck } from 'lucide-react';

export const LeaderboardPage = () => {
  const { id } = useParams(); // hackathonId
  const [leaderboard, setLeaderboard] = useState([]);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const hRes = await API.get(`/hackathons/${id}`);
        setHackathon(hRes.data);

        const lRes = await API.get(`/analytics/leaderboard/${id}`);
        setLeaderboard(lRes.data.leaderboard || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Trophy className="w-4 h-4 text-amber-400" /> Official Hackathon Standings
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Live <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Hackathon: <span className="text-indigo-300 font-semibold">{hackathon?.title}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/hackathons/${id}`}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-xs font-semibold text-gray-300 rounded-xl transition-colors"
          >
            ← Back to Event
          </Link>
        </div>
      </div>

      {/* Rankings Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-gray-900/60 animate-pulse border border-gray-800" />
      ) : leaderboard.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border border-gray-800 space-y-2">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Scores Published Yet</h3>
          <p className="text-xs text-gray-400">Judges are currently reviewing project submissions.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-900/80 uppercase font-semibold text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Team Name</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Tech Stack</th>
                  <th className="p-4 text-center">Score</th>
                  <th className="p-4 text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {leaderboard.map((item) => (
                  <tr 
                    key={item.submissionId}
                    className={`hover:bg-gray-800/40 transition-colors ${
                      item.rank === 1 ? 'bg-amber-500/5' : 
                      item.rank === 2 ? 'bg-indigo-500/5' : 
                      item.rank === 3 ? 'bg-purple-500/5' : ''
                    }`}
                  >
                    <td className="p-4 font-bold">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-sm ${
                          item.rank === 1 ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30' :
                          item.rank === 2 ? 'bg-slate-300 text-black' :
                          item.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {item.rank}
                        </span>
                        <span className="text-[11px] text-gray-400 font-semibold">{item.position}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{item.teamName}</div>
                      <div className="text-[10px] font-mono text-gray-500">{item.teamCode}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-indigo-300 text-xs">{item.projectName}</div>
                      <div className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">{item.problemStatement}</div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {item.techStack?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-700 text-[10px] text-gray-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="text-lg font-extrabold text-amber-400 font-heading">
                        {item.totalScore} <span className="text-xs text-gray-500">pts</span>
                      </div>
                      <div className="text-[10px] text-gray-400">{item.evaluationsCount} Judge Reviews</div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.githubUrl && (
                          <a href={item.githubUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-gray-900 hover:text-indigo-400 text-gray-400">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {item.liveDemoUrl && (
                          <a href={item.liveDemoUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-gray-900 hover:text-indigo-400 text-gray-400">
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
