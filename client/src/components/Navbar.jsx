import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  LayoutDashboard, 
  Globe, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Zap, 
  PlusCircle, 
  Sparkles,
  ShieldAlert,
  Award
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, quickSwitchUser, isAdmin, isOrganizer, isJudge, isParticipant } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isOrganizer) return '/dashboard/organizer';
    if (isJudge) return '/dashboard/judge';
    return '/dashboard/participant';
  };

  const handleQuickRoleSelect = async (email) => {
    try {
      await quickSwitchUser(email);
      setDemoMenuOpen(false);
      navigate(getDashboardPath());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white font-heading flex items-center gap-1.5">
                Hack<span className="gradient-text">Sphere</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold -mt-1">
                Platform Enterprise
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              to="/hackathons" 
              className={`transition-colors hover:text-indigo-400 ${location.pathname.startsWith('/hackathons') ? 'text-indigo-400 font-semibold' : 'text-gray-300'}`}
            >
              Hackathons
            </Link>
            <Link 
              to="/gallery" 
              className={`transition-colors hover:text-indigo-400 ${location.pathname === '/gallery' ? 'text-indigo-400 font-semibold' : 'text-gray-300'}`}
            >
              Project Gallery
            </Link>

            {user && (
              <Link 
                to={getDashboardPath()} 
                className={`flex items-center gap-1.5 transition-colors hover:text-indigo-400 ${location.pathname.startsWith('/dashboard') ? 'text-indigo-400 font-semibold' : 'text-gray-300'}`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher (For Demo & Viva) */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                title="Switch Role instantly for demo testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Demo Roles</span>
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl shadow-2xl p-2 border border-gray-700 z-50 text-xs">
                  <div className="px-3 py-2 text-gray-400 font-semibold border-b border-gray-800">
                    Instant Switch Demo Role:
                  </div>
                  <button 
                    onClick={() => handleQuickRoleSelect('admin@hacksphere.io')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-900/40 text-rose-300 flex items-center justify-between mt-1"
                  >
                    <span className="font-semibold">👑 Administrator</span>
                    <span className="text-[10px] text-gray-400">Full Control</span>
                  </button>
                  <button 
                    onClick={() => handleQuickRoleSelect('organizer@hacksphere.io')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-900/40 text-purple-300 flex items-center justify-between"
                  >
                    <span className="font-semibold">🚀 Organizer</span>
                    <span className="text-[10px] text-gray-400">Manage Events</span>
                  </button>
                  <button 
                    onClick={() => handleQuickRoleSelect('judge@hacksphere.io')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-900/40 text-emerald-300 flex items-center justify-between"
                  >
                    <span className="font-semibold">⚖️ Judge</span>
                    <span className="text-[10px] text-gray-400">Rubric Scoring</span>
                  </button>
                  <button 
                    onClick={() => handleQuickRoleSelect('participant@hacksphere.io')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-900/40 text-cyan-300 flex items-center justify-between"
                  >
                    <span className="font-semibold">💻 Participant</span>
                    <span className="text-[10px] text-gray-400">Submit Code</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${
                  user.role === 'Administrator' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  user.role === 'Organizer' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  user.role === 'Judge' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {user.role}
                </span>

                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <img 
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover" 
                  />
                  <span className="text-sm font-medium text-gray-200">{user.name.split(' ')[0]}</span>
                </Link>

                <button 
                  onClick={logout} 
                  className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-sm font-medium text-white gradient-btn rounded-lg shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden glass-panel border-b border-gray-800 px-4 pt-2 pb-6 space-y-3">
          <Link 
            to="/hackathons" 
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base text-gray-200 hover:text-indigo-400"
          >
            Explore Hackathons
          </Link>
          <Link 
            to="/gallery" 
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base text-gray-200 hover:text-indigo-400"
          >
            Public Project Gallery
          </Link>
          {user ? (
            <>
              <Link 
                to={getDashboardPath()} 
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-base text-indigo-400 font-medium"
              >
                Dashboard ({user.role})
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-base text-gray-200"
              >
                My Profile
              </Link>
              <button 
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full text-left py-2 text-base text-rose-400"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link 
                to="/login" 
                onClick={() => setMobileOpen(false)}
                className="w-full py-2 text-center text-sm font-medium text-gray-200 bg-gray-800 rounded-lg"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                onClick={() => setMobileOpen(false)}
                className="w-full py-2 text-center text-sm font-medium text-white gradient-btn rounded-lg"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
