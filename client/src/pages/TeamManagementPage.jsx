import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Key, Crown, UserX, Copy, Check, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TeamManagementPage = () => {
  const { id } = useParams(); // hackathonId
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [msg, setMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchTeamAndHackathon = async () => {
    setLoading(true);
    try {
      const hRes = await API.get(`/hackathons/${id}`);
      setHackathon(hRes.data);

      const tRes = await API.get('/teams/my-teams');
      const currentTeam = tRes.data.find(t => (t.hackathonId._id || t.hackathonId) === id);
      setTeam(currentTeam || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamAndHackathon();
  }, [id]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await API.post('/teams', { name: teamName, hackathonId: id });
      setMsg({ type: 'success', text: `Team '${res.data.name}' created! Code: ${res.data.code}` });
      fetchTeamAndHackathon();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create team' });
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await API.post('/teams/join', { code: joinCode });
      setMsg({ type: 'success', text: 'Joined team successfully!' });
      fetchTeamAndHackathon();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to join team' });
    }
  };

  const copyCode = () => {
    if (team?.code) {
      navigator.clipboard.writeText(team.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTransferLeader = async (memberUserId) => {
    try {
      await API.put(`/teams/${team._id}/transfer`, { newLeaderId: memberUserId });
      setMsg({ type: 'success', text: 'Team leadership transferred!' });
      fetchTeamAndHackathon();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to transfer leadership' });
    }
  };

  const handleRemoveMember = async (memberUserId) => {
    try {
      await API.put(`/teams/${team._id}/remove-member`, { memberUserId });
      setMsg({ type: 'success', text: 'Member removed from team' });
      fetchTeamAndHackathon();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to remove member' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white font-heading flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-400" /> Team Workspace
        </h1>
        <p className="text-xs text-gray-400">
          Hackathon: <span className="text-indigo-300 font-semibold">{hackathon?.title}</span> (Max Team Size: {hackathon?.maxTeamSize || 4})
        </p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="h-64 rounded-2xl bg-gray-900/60 animate-pulse border border-gray-800" />
      ) : team ? (
        /* Existing Team Workspace */
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Registered Team</span>
              <h2 className="text-2xl font-extrabold text-white font-heading">{team.name}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">CODE:</span>
                <span className="text-sm font-bold font-mono text-indigo-400">{team.code}</span>
                <button onClick={copyCode} className="text-gray-400 hover:text-white p-1">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                team.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {team.status}
              </span>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">
              Team Roster ({team.members.length} / {hackathon?.maxTeamSize || 4})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {team.members.map((m) => {
                const memberUser = m.userId;
                const isLeader = (m.role === 'Leader') || (team.leaderId._id || team.leaderId) === memberUser._id;
                const isMe = memberUser._id === user?._id;

                return (
                  <div key={memberUser._id} className="p-4 rounded-xl glass-card border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={memberUser.avatar} alt={memberUser.name} className="w-10 h-10 rounded-full object-cover border border-indigo-500/30" />
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          {memberUser.name} {isMe && <span className="text-[10px] text-gray-400">(You)</span>}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          {isLeader ? (
                            <span className="text-amber-400 font-semibold flex items-center gap-1"><Crown className="w-3 h-3" /> Team Leader</span>
                          ) : (
                            <span>Member</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Member Actions */}
                    {((team.leaderId._id || team.leaderId) === user?._id) && !isLeader && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTransferLeader(memberUser._id)}
                          className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded text-[10px] font-semibold border border-amber-500/30"
                          title="Make Team Leader"
                        >
                          Make Leader
                        </button>
                        <button
                          onClick={() => handleRemoveMember(memberUser._id)}
                          className="p-1 text-gray-400 hover:text-rose-400 rounded hover:bg-rose-950/30"
                          title="Remove Member"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <Link
              to={`/hackathons/${id}/submit`}
              className="px-6 py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-md"
            >
              Proceed to Submission Portal →
            </Link>
          </div>
        </div>
      ) : (
        /* Create or Join Options */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Team Form */}
          <form onSubmit={handleCreateTeam} className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-400" /> Create New Team
            </h3>
            <p className="text-xs text-gray-400">
              Start a new team as captain. An invite code will be generated automatically.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Team Name</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CyberPulse Neural"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-md"
            >
              Create Team
            </button>
          </form>

          {/* Join Team Form */}
          <form onSubmit={handleJoinTeam} className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" /> Join Existing Team
            </h3>
            <p className="text-xs text-gray-400">
              Have an invite code from a teammate? Paste it here to join their squad.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Team Invite Code</label>
              <input
                type="text"
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="e.g. HS-CYBER1"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white uppercase font-mono tracking-wider focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-semibold text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-700"
            >
              Join Squad
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
