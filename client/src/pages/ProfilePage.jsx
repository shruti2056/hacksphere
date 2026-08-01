import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, FileText, Lock, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await updateUserProfile({
        name,
        bio,
        organization,
        avatar,
        ...(password ? { password } : {})
      });
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center gap-6">
        <img 
          src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'} 
          alt={name} 
          className="w-24 h-24 rounded-full border-2 border-indigo-500/40 object-cover shadow-lg"
        />
        <div className="text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-bold text-white font-heading">{user?.name}</h1>
            <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${
              user?.role === 'Administrator' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
              user?.role === 'Organizer' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
              user?.role === 'Judge' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
            }`}>
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-gray-400">{user?.email} • {user?.organization || 'Independent Hacker'}</p>
          <p className="text-xs text-indigo-300 italic pt-1">{user?.bio || 'No bio provided yet.'}</p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
        <h2 className="text-lg font-bold text-white font-heading border-b border-gray-800 pb-3">
          Edit Account Settings
        </h2>

        {msg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Avatar Image URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Organization / Campus</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Bio / Skills Summary</label>
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};
