import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import { PlusCircle, Trophy, Users, UserCheck, Trash2, Edit3, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // Create Hackathon Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [mode, setMode] = useState('Online');
  const [prizePool, setPrizePool] = useState('$10,000');
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [rules, setRules] = useState('');

  // Assign Judges Modal State
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [allJudges, setAllJudges] = useState([]);
  const [selectedJudgeIds, setSelectedJudgeIds] = useState([]);

  const fetchOrganizerData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/analytics/organizer');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const handleCreateHackathon = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await API.post('/hackathons', {
        title,
        description,
        theme,
        mode,
        prizePool,
        maxTeamSize: Number(maxTeamSize),
        rules: rules || 'Build innovative code adhering to event rules.',
      });
      setMsg({ type: 'success', text: `Hackathon '${title}' created successfully!` });
      setCreateOpen(false);
      fetchOrganizerData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create hackathon' });
    }
  };

  const openAssignJudgesModal = async (hackathon) => {
    setSelectedHackathon(hackathon);
    setSelectedJudgeIds(hackathon.judges?.map(j => j._id || j) || []);
    try {
      // Fetch user list to filter judges
      const uRes = await API.get('/users');
      const judges = uRes.data.filter(u => u.role === 'Judge');
      setAllJudges(judges);
      setAssignOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAssignedJudges = async () => {
    try {
      await API.put(`/hackathons/${selectedHackathon._id}/assign-judges`, {
        judgeIds: selectedJudgeIds,
      });
      setMsg({ type: 'success', text: 'Judges assigned successfully to hackathon!' });
      setAssignOpen(false);
      fetchOrganizerData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to assign judges' });
    }
  };

  const toggleJudgeSelection = (judgeId) => {
    if (selectedJudgeIds.includes(judgeId)) {
      setSelectedJudgeIds(selectedJudgeIds.filter(id => id !== judgeId));
    } else {
      setSelectedJudgeIds([...selectedJudgeIds, judgeId]);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto py-12 text-center text-gray-400">Loading Organizer Workspace...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            Event Management Hub
          </span>
          <h1 className="text-3xl font-extrabold text-white font-heading mt-2">
            Organizer <span className="gradient-text">Dashboard</span>
          </h1>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="px-5 py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-lg flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create Hackathon
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-semibold">Hosted Hackathons</div>
          <div className="text-3xl font-bold text-white font-heading">{data?.myHackathonsCount || 0}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-semibold">Total Teams Registered</div>
          <div className="text-3xl font-bold text-white font-heading">{data?.totalTeams || 0}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
          <div className="text-xs text-gray-400 font-semibold">Total Submissions Received</div>
          <div className="text-3xl font-bold text-white font-heading">{data?.totalSubmissions || 0}</div>
        </div>
      </div>

      {/* My Hackathons Grid */}
      <div className="glass-panel rounded-2xl border border-gray-800 p-6 space-y-6">
        <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-400" /> My Hackathons ({data?.hackathons?.length || 0})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.hackathons?.map((h) => (
            <div key={h._id} className="glass-card p-5 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <StatusBadge status={h.status} />
                  <span className="text-xs text-amber-400 font-bold">{h.prizePool}</span>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">{h.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{h.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Judges: {h.judges?.length || 0} Assigned</span>
                
                <button
                  onClick={() => openAssignJudgesModal(h)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Assign Judges
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Create Hackathon */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Hackathon">
        <form onSubmit={handleCreateHackathon} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CodeStorm Global Web3 Hackathon"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Theme / Category *</label>
            <input
              type="text"
              required
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. Artificial Intelligence & Generative Models"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Prize Pool</label>
              <input
                type="text"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                placeholder="$10,000"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Description *</label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed hackathon summary..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Rules & Guidelines</label>
            <textarea
              rows="2"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="1. Build during window..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-md"
          >
            Publish Hackathon Event
          </button>
        </form>
      </Modal>

      {/* Modal 2: Assign Judges */}
      <Modal isOpen={assignOpen} onClose={() => setAssignOpen(false)} title={`Assign Judges to '${selectedHackathon?.title}'`}>
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Select expert judges who will evaluate submissions for this event:</p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {allJudges.map((j) => {
              const isSelected = selectedJudgeIds.includes(j._id);
              return (
                <div
                  key={j._id}
                  onClick={() => toggleJudgeSelection(j._id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={j.avatar} alt={j.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-semibold">{j.name}</div>
                      <div className="text-[10px] text-gray-400">{j.organization}</div>
                    </div>
                  </div>
                  {isSelected && <UserCheck className="w-4 h-4 text-indigo-400" />}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSaveAssignedJudges}
            className="w-full py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-md"
          >
            Save Judge Assignments
          </button>
        </div>
      </Modal>
    </div>
  );
};
