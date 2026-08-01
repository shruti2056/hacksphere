import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Code, Users, Send, Trophy, ArrowRight, Star, Copy, Check } from 'lucide-react';

export const ParticipantDashboard = () => {
  const { user } = useAuth();
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const res = await API.get('/teams/my-teams');
        setMyTeams(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipantData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Hacker & Developer Workspace
          </span>
          <h1 className="text-3xl font-extrabold text-white font-heading mt-2">
            Welcome, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-xs text-gray-400">
            Track your registered hackathons, manage team members, and submit your code.
          </p>
        </div>

        <Link
          to="/hackathons"
          className="px-6 py-3 rounded-xl font-semibold text-white gradient-btn shadow-lg flex items-center gap-2"
        >
          <Trophy className="w-4 h-4" /> Explore Hackathons
        </Link>
      </div>

      {/* Registered Hackathons & Teams */}
      <div className="glass-panel rounded-2xl border border-gray-800 p-6 space-y-6">
        <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" /> My Hackathons & Squad Teams ({myTeams.length})
        </h2>

        {loading ? (
          <div className="h-48 rounded-xl bg-gray-900/60 animate-pulse" />
        ) : myTeams.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Code className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Hackathons Registered Yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Find an active hackathon, form a team or join using an invite code to start competing.
            </p>
            <Link to="/hackathons" className="inline-block px-5 py-2 rounded-xl text-xs font-semibold text-white gradient-btn">
              Browse Open Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myTeams.map((team) => {
              const hackathon = team.hackathonId;
              return (
                <div key={team._id} className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <StatusBadge status={hackathon?.status || 'Active'} />
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-gray-900 border border-gray-700 px-2 py-0.5 rounded">
                        CODE: {team.code}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading">{hackathon?.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">Team: <strong className="text-white">{team.name}</strong> ({team.members?.length} Members)</p>
                  </div>

                  <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between gap-2">
                    <Link
                      to={`/hackathons/${hackathon?._id || hackathon}/team`}
                      className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold border border-gray-700 flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5 text-cyan-400" /> Team Details
                    </Link>

                    <Link
                      to={`/hackathons/${hackathon?._id || hackathon}/submit`}
                      className="px-4 py-1.5 rounded-lg text-white gradient-btn text-xs font-semibold shadow-md flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Project Portal
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
