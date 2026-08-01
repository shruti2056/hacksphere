import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { CountdownTimer } from '../components/CountdownTimer';
import { Modal } from '../components/Modal';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Award, 
  MapPin, 
  FileText, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Send,
  UserCheck,
  Edit3,
  Sliders,
  PlusCircle,
  FolderKanban
} from 'lucide-react';

export const HackathonDetailPage = () => {
  const { id } = useParams();
  const { user, isOrganizer, isAdmin } = useAuth();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // Assign Judges Modal State
  const [assignOpen, setAssignOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedJudgeIds, setSelectedJudgeIds] = useState([]);

  // Manage Projects (Submissions) State
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [subForm, setSubForm] = useState(null);

  // Edit Hackathon Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [mode, setMode] = useState('Online');
  const [prizePool, setPrizePool] = useState('$10,000');
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [rules, setRules] = useState('');
  const [status, setStatus] = useState('Registration Open');

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/hackathons/${id}`);
      setHackathon(res.data);
      setSelectedJudgeIds(res.data.judges?.map(j => j._id || j) || []);
      
      setTitle(res.data.title || '');
      setDescription(res.data.description || '');
      setTheme(res.data.theme || '');
      setMode(res.data.mode || 'Online');
      setPrizePool(res.data.prizePool || '$10,000');
      setMaxTeamSize(res.data.maxTeamSize || 4);
      setRules(res.data.rules || '');
      setStatus(res.data.status || 'Registration Open');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const openAssignJudgesModal = async () => {
    try {
      const uRes = await API.get('/users');
      const judgeEligible = uRes.data.filter((u) => u.role === 'Judge' || u.role === 'Administrator');
      setAllUsers(judgeEligible);
      setAssignOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAssignedJudges = async () => {
    try {
      await API.put(`/hackathons/${id}/assign-judges`, {
        judgeIds: selectedJudgeIds,
      });
      setMsg({ type: 'success', text: 'Official judges assigned successfully!' });
      setAssignOpen(false);
      fetchDetail();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to assign judges' });
    }
  };

  const toggleJudgeSelection = (userId) => {
    if (selectedJudgeIds.includes(userId)) {
      setSelectedJudgeIds(selectedJudgeIds.filter(i => i !== userId));
    } else {
      setSelectedJudgeIds([...selectedJudgeIds, userId]);
    }
  };

  const openProjectsPanel = async () => {
    try {
      const res = await API.get(`/submissions/hackathon/${id}`);
      setSubmissions(res.data);
      setProjectsOpen(true);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to load projects' });
    }
  };

  const openEditSubmission = (submission) => {
    setEditingSubmission(submission);
    setSubForm({
      projectName: submission.projectName || '',
      problemStatement: submission.problemStatement || '',
      solution: submission.solution || '',
      description: submission.description || '',
      githubUrl: submission.githubUrl || '',
      liveDemoUrl: submission.liveDemoUrl || '',
      videoUrl: submission.videoUrl || '',
      techStack: (submission.techStack || []).join(', '),
      status: submission.status || 'Under Review',
    });
  };

  const handleSaveSubmission = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...subForm,
        techStack: subForm.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const res = await API.put(`/submissions/${editingSubmission._id}`, payload);
      setSubmissions((prev) => prev.map((s) => (s._id === res.data._id ? res.data : s)));
      setEditingSubmission(null);
      setMsg({ type: 'success', text: 'Project updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update project' });
    }
  };

  const handleEditHackathonSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/hackathons/${id}`, {
        title,
        description,
        theme,
        mode,
        prizePool,
        maxTeamSize: Number(maxTeamSize),
        rules,
        status,
      });
      setMsg({ type: 'success', text: 'Hackathon event details updated successfully!' });
      setEditOpen(false);
      fetchDetail();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update hackathon' });
    }
  };

  const isOwnerOrAdmin = isAdmin || (isOrganizer && hackathon?.organizerId?._id === user?._id);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 rounded-2xl bg-gray-900/60 animate-pulse border border-gray-800" />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Hackathon Not Found</h2>
        <Link to="/hackathons" className="text-indigo-400 underline">Return to Listing</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Banner & Hero Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-gray-800">
        <div className="h-72 sm:h-96 w-full relative">
          <img 
            src={hackathon.bannerImage} 
            alt={hackathon.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>

        <div className="p-6 sm:p-10 relative -mt-32 z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={hackathon.status} />
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-900/80 text-gray-200 border border-gray-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {hackathon.mode} ({hackathon.venue})
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> {hackathon.prizePool}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            {hackathon.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {hackathon.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link 
              to={`/hackathons/${id}/team`} 
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-btn shadow-xl flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> Form & Manage Team
            </Link>

            <Link 
              to={`/hackathons/${id}/submit`} 
              className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-700 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-indigo-400" /> Submit Project
            </Link>

            <Link 
              to={`/hackathons/${id}/leaderboard`} 
              className="px-6 py-3 rounded-xl text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" /> Live Leaderboard
            </Link>

            {/* Organizer / Admin Actions */}
            {isOwnerOrAdmin && (
              <>
                <button
                  onClick={openAssignJudgesModal}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" /> Assign Judges
                </button>

                <button
                  onClick={() => setEditOpen(true)}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4 text-purple-400" /> Edit Event
                </button>

                <button
                  onClick={openProjectsPanel}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-sky-300 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 transition-colors flex items-center gap-2"
                >
                  <FolderKanban className="w-4 h-4 text-sky-400" /> Manage Projects
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Rules & Judging Criteria */}
        <div className="lg:col-span-2 space-y-8">
          {/* Rules */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" /> Competition Rules & Guidelines
            </h2>
            <div className="text-xs sm:text-sm text-gray-300 whitespace-pre-line leading-relaxed font-light">
              {hackathon.rules}
            </div>
          </div>

          {/* Judging Criteria Rubric */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Predefined Judging Criteria (10 Marks Each)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hackathon.criteria?.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-200">{c.name}</span>
                  <span className="text-xs font-mono text-indigo-400 font-bold">{c.maxMarks || 10} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Assigned Judges */}
        <div className="space-y-8">
          {/* Timeline Card */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading border-b border-gray-800 pb-3">
              Event Timeline
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> Start Date:</span>
                <span className="font-semibold">{new Date(hackathon.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> End Date:</span>
                <span className="font-semibold">{new Date(hackathon.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400 flex items-center gap-1"><Users className="w-3.5 h-3.5 text-indigo-400" /> Max Team Size:</span>
                <span className="font-semibold">{hackathon.maxTeamSize} Members</span>
              </div>
            </div>

            <div className="pt-2">
              <CountdownTimer targetDate={hackathon.endDate} label="Submissions Close In" />
            </div>
          </div>

          {/* Assigned Judges Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" /> Official Jury & Judges ({hackathon.judges?.length || 0})
              </h3>
              {isOwnerOrAdmin && (
                <button 
                  onClick={openAssignJudgesModal} 
                  className="text-[11px] font-semibold text-indigo-400 hover:underline"
                >
                  Manage
                </button>
              )}
            </div>

            {hackathon.judges?.length === 0 ? (
              <p className="text-xs text-gray-400">Judges are currently being assigned by host.</p>
            ) : (
              <div className="space-y-3">
                {hackathon.judges?.map((j) => (
                  <div key={j._id} className="flex items-center gap-3 p-2 rounded-xl bg-gray-900/60 border border-gray-800">
                    <img src={j.avatar} alt={j.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-semibold text-white">{j.name}</div>
                      <div className="text-[10px] text-gray-400">{j.organization} ({j.role})</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: Assign Judges */}
      <Modal isOpen={assignOpen} onClose={() => setAssignOpen(false)} title="Assign Official Judges">
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Select users or expert judges to evaluate submissions for this event:</p>

          {allUsers.length === 0 && (
            <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              No accounts with the "Judge" role exist yet. Ask an Administrator to create one, or promote an
              existing user to Judge from the Admin Dashboard.
            </p>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {allUsers.map((u) => {
              const isSelected = selectedJudgeIds.includes(u._id);
              return (
                <div
                  key={u._id}
                  onClick={() => toggleJudgeSelection(u._id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-semibold">{u.name}</div>
                      <div className="text-[10px] text-gray-400">{u.organization} • <span className="text-indigo-400">{u.role}</span></div>
                    </div>
                  </div>
                  {isSelected && <UserCheck className="w-4 h-4 text-emerald-400" />}
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

      {/* Modal 2: Edit Hackathon */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Hackathon Details">
        <form onSubmit={handleEditHackathonSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white"
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
              <label className="block text-xs font-semibold text-gray-300 mb-1">Lifecycle Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white font-semibold text-amber-300"
              >
                <option value="Registration Open">Registration Open</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Prize Pool</label>
            <input
              type="text"
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Rules</label>
            <textarea
              rows="2"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-md"
          >
            Save Event Changes
          </button>
        </form>
      </Modal>

      {/* Modal 3: Manage Projects (list of submissions) */}
      <Modal isOpen={projectsOpen} onClose={() => setProjectsOpen(false)} title="Manage Submitted Projects">
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {submissions.length === 0 ? (
            <p className="text-xs text-gray-400">No projects have been submitted yet.</p>
          ) : (
            submissions.map((s) => (
              <div
                key={s._id}
                className="p-3 rounded-xl border border-gray-800 bg-gray-900 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{s.projectName}</div>
                  <div className="text-[11px] text-gray-400">
                    Team: {s.teamId?.name || 'Unknown'} · <span className="text-indigo-400">{s.status}</span>
                  </div>
                </div>
                <button
                  onClick={() => openEditSubmission(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-300 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20"
                >
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal 4: Edit a single Project */}
      <Modal isOpen={!!editingSubmission} onClose={() => setEditingSubmission(null)} title="Edit Project">
        {subForm && (
          <form onSubmit={handleSaveSubmission} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={subForm.projectName}
                onChange={(e) => setSubForm({ ...subForm, projectName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Problem Statement</label>
              <textarea
                rows="2"
                required
                value={subForm.problemStatement}
                onChange={(e) => setSubForm({ ...subForm, problemStatement: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Solution</label>
              <textarea
                rows="2"
                required
                value={subForm.solution}
                onChange={(e) => setSubForm({ ...subForm, solution: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
              <textarea
                rows="2"
                required
                value={subForm.description}
                onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub URL</label>
                <input
                  type="url"
                  required
                  value={subForm.githubUrl}
                  onChange={(e) => setSubForm({ ...subForm, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={subForm.liveDemoUrl}
                  onChange={(e) => setSubForm({ ...subForm, liveDemoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Video URL</label>
                <input
                  type="url"
                  value={subForm.videoUrl}
                  onChange={(e) => setSubForm({ ...subForm, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Status</label>
                <select
                  value={subForm.status}
                  onChange={(e) => setSubForm({ ...subForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={subForm.techStack}
                onChange={(e) => setSubForm({ ...subForm, techStack: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-md"
            >
              Save Project Changes
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
