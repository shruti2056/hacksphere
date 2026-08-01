import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, quickSwitchUser, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const u = await login(email, password);
      if (u.role === 'Administrator') navigate('/dashboard/admin');
      else if (u.role === 'Organizer') navigate('/dashboard/organizer');
      else if (u.role === 'Judge') navigate('/dashboard/judge');
      else navigate('/dashboard/participant');
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickDemo = async (roleEmail, targetDashboard) => {
    try {
      await quickSwitchUser(roleEmail);
      navigate(targetDashboard);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight">
            Welcome back to <span className="gradient-text">HackSphere</span>
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Sign in with your role credentials or use 1-click demo login below.
          </p>
        </div>

        {/* 1-Click Role Quick Switcher */}
        <div className="glass-panel rounded-2xl p-4 border border-indigo-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Sparkles className="w-4 h-4 animate-bounce" />
            <span>Viva & Demo Quick Switcher (1-Click Login):</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <button
              onClick={() => handleQuickDemo('admin@hacksphere.io', '/dashboard/admin')}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium text-left flex items-center justify-between"
            >
              <span>👑 Admin</span>
              <span className="text-[10px] text-rose-400 font-mono">click</span>
            </button>

            <button
              onClick={() => handleQuickDemo('organizer@hacksphere.io', '/dashboard/organizer')}
              className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium text-left flex items-center justify-between"
            >
              <span>🚀 Organizer</span>
              <span className="text-[10px] text-purple-400 font-mono">click</span>
            </button>

            <button
              onClick={() => handleQuickDemo('judge@hacksphere.io', '/dashboard/judge')}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium text-left flex items-center justify-between"
            >
              <span>⚖️ Judge</span>
              <span className="text-[10px] text-emerald-400 font-mono">click</span>
            </button>

            <button
              onClick={() => handleQuickDemo('participant@hacksphere.io', '/dashboard/participant')}
              className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-medium text-left flex items-center justify-between"
            >
              <span>💻 Participant</span>
              <span className="text-[10px] text-cyan-400 font-mono">click</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 shadow-xl" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white gradient-btn shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Authenticating...' : <><LogIn className="w-4 h-4" /> Sign In</>}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-indigo-400 font-semibold hover:underline">
              Create New Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
