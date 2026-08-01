import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Building, FileText, ShieldAlert } from 'lucide-react';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Participant');
  const [organization, setOrganization] = useState('');
  const [bio, setBio] = useState('');

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const u = await register({ name, email, password, role, organization, bio });
      if (u.role === 'Administrator') navigate('/dashboard/admin');
      else if (u.role === 'Organizer') navigate('/dashboard/organizer');
      else if (u.role === 'Judge') navigate('/dashboard/judge');
      else navigate('/dashboard/participant');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight">
            Create Your <span className="gradient-text">HackSphere</span> Account
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Join thousands of developers, organizers, and judges across the world.
          </p>
        </div>

        <form className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 shadow-xl" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="Participant">💻 Participant (Student / Developer)</option>
                <option value="Organizer">🚀 Organizer (Create & Host)</option>
                <option value="Judge">⚖️ Judge (Evaluate Submissions)</option>
                <option value="Administrator">👑 Administrator (System Governance)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Organization / College</label>
            <div className="relative">
              <Building className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Stanford University / Tech Corp"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Short Bio</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <textarea
                rows="2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the hackathon community about your tech stack & background..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white gradient-btn shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Account...' : <><UserPlus className="w-4 h-4" /> Register Account</>}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
              Sign In Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
