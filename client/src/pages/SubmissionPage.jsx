import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Send, Github, Globe, Youtube, Code, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export const SubmissionPage = () => {
  const { id } = useParams(); // hackathonId
  const { user } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // Form State
  const [projectName, setProjectName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [screenshotsInput, setScreenshotsInput] = useState('');

  const fetchDetails = async () => {
    setLoading(true);
    try {
      // Find my team for this hackathon
      const tRes = await API.get('/teams/my-teams');
      const myTeam = tRes.data.find(t => (t.hackathonId._id || t.hackathonId) === id);
      setTeam(myTeam || null);

      if (myTeam) {
        try {
          const sRes = await API.get(`/submissions/my/${id}`);
          const sub = sRes.data;
          if (sub) {
            setSubmission(sub);
            setProjectName(sub.projectName || '');
            setProblemStatement(sub.problemStatement || '');
            setSolution(sub.solution || '');
            setDescription(sub.description || '');
            setGithubUrl(sub.githubUrl || '');
            setLiveDemoUrl(sub.liveDemoUrl || '');
            setVideoUrl(sub.videoUrl || '');
            setTechStackInput(Array.isArray(sub.techStack) ? sub.techStack.join(', ') : '');
            setScreenshotsInput(Array.isArray(sub.screenshots) ? sub.screenshots.join(', ') : '');
          }
        } catch (e) {
          // No submission yet
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const techStack = techStackInput.split(',').map(s => s.trim()).filter(Boolean);
    const screenshots = screenshotsInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      if (submission) {
        // Edit existing submission
        await API.put(`/submissions/${submission._id}`, {
          projectName,
          problemStatement,
          solution,
          description,
          githubUrl,
          liveDemoUrl,
          videoUrl,
          techStack,
          screenshots,
        });
        setMsg({ type: 'success', text: 'Project submission updated successfully!' });
      } else {
        // Create new submission
        await API.post('/submissions', {
          teamId: team._id,
          hackathonId: id,
          projectName,
          problemStatement,
          solution,
          description,
          githubUrl,
          liveDemoUrl,
          videoUrl,
          techStack,
          screenshots,
        });
        setMsg({ type: 'success', text: 'Project submitted successfully for evaluation!' });
      }
      fetchDetails();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-gray-400">Loading submission portal...</div>;
  }

  if (!team) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Team Found</h2>
        <p className="text-xs text-gray-400">You must join or create a team before submitting a project.</p>
        <button onClick={() => navigate(`/hackathons/${id}/team`)} className="px-6 py-2.5 rounded-xl font-semibold text-white gradient-btn">
          Create / Join Team
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white font-heading flex items-center gap-3">
            <Send className="w-8 h-8 text-indigo-400" /> Project Submission Portal
          </h1>
          {submission && <StatusBadge status={submission.status} />}
        </div>
        <p className="text-xs text-gray-400">
          Submitting on behalf of team <span className="text-indigo-300 font-semibold">{team.name}</span>
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

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. NeuroFlow AI Diagnostics"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub Repository URL *</label>
            <div className="relative">
              <Github className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="url"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/organization/repo"
                className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Problem Statement *</label>
          <textarea
            rows="2"
            required
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="What real-world problem does your hackathon project solve?"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Proposed Solution & Key Features *</label>
          <textarea
            rows="3"
            required
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Detail how your code addresses the problem statement."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Live Demo / Deployment URL</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://myproject.vercel.app"
                className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Video Demo Link (YouTube / Loom)</label>
            <div className="relative">
              <Youtube className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Tech Stack Tags (Comma separated)</label>
          <div className="relative">
            <Code className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="React, Node.js, MongoDB, PyTorch, Tailwind CSS"
              className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Screenshot Image URLs (Comma separated)</label>
          <input
            type="text"
            value={screenshotsInput}
            onChange={(e) => setScreenshotsInput(e.target.value)}
            placeholder="https://images.unsplash.com/photo-1576091160399..."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-white gradient-btn shadow-lg flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> {submission ? 'Update Submission' : 'Submit Project For Judging'}
        </button>
      </form>
    </div>
  );
};
