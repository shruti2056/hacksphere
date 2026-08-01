import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Users, 
  Trophy, 
  Layers, 
  FileCode, 
  ShieldAlert, 
  Ban, 
  CheckCircle, 
  Trash2, 
  RefreshCw,
  Activity,
  Award
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const sRes = await API.get('/analytics/admin');
      setStats(sRes.data);

      const uRes = await API.get('/users');
      setUsersList(uRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleBlock = async (userId) => {
    try {
      const res = await API.put(`/users/${userId}/block`);
      setMsg({ type: 'success', text: res.data.message });
      fetchAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update user block status' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user from the platform?')) return;
    try {
      const res = await API.delete(`/users/${userId}`);
      setMsg({ type: 'success', text: res.data.message });
      fetchAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete user' });
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto py-12 text-center text-gray-400">Loading Administrator Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            Platform Owner Governance
          </span>
          <h1 className="text-3xl font-extrabold text-white font-heading mt-2">
            Administrator <span className="gradient-text">Control Center</span>
          </h1>
        </div>

        <button 
          onClick={fetchAdminData}
          className="p-2.5 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-white transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
          msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        }`}>
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Total Platform Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white font-heading">{stats?.totalUsers || 0}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Total Hackathons</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white font-heading">{stats?.totalHackathons || 0}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Registered Teams</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white font-heading">{stats?.totalTeams || 0}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
            <span>Code Submissions</span>
            <FileCode className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-heading">{stats?.totalSubmissions || 0}</div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden space-y-4 p-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> User Accounts & Role Moderation ({usersList.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900/80 uppercase font-semibold text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-gray-700" />
                    <div>
                      <div className="font-bold text-white text-xs">{u.name}</div>
                      <div className="text-[10px] text-gray-400">{u.email}</div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      u.role === 'Administrator' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      u.role === 'Organizer' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                      u.role === 'Judge' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3 text-gray-400">{u.organization || '—'}</td>

                  <td className="p-3">
                    {u.isBlocked ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-semibold text-[10px]">Blocked</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">Active</span>
                    )}
                  </td>

                  <td className="p-3 text-right space-x-2">
                    {u.role !== 'Administrator' && (
                      <>
                        <button
                          onClick={() => handleToggleBlock(u._id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                            u.isBlocked ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                          }`}
                        >
                          {u.isBlocked ? 'Unblock' : 'Block User'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-950/40"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="glass-panel rounded-2xl border border-gray-800 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" /> Platform Audit & Activity Stream
        </h2>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {stats?.recentLogs?.map((log) => (
            <div key={log._id} className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex justify-between text-xs">
              <span className="text-gray-300">
                <strong className="text-indigo-400">{log.userName}</strong> [{log.action}]: {log.details}
              </span>
              <span className="text-[10px] text-gray-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
