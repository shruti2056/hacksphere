import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { HackathonCard } from '../components/HackathonCard';
import { 
  Trophy, 
  Rocket, 
  Users, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Star,
  Globe2,
  Zap
} from 'lucide-react';

export const HomePage = () => {
  const [featuredHackathons, setFeaturedHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await API.get('/hackathons');
        setFeaturedHackathons(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>The Premier Full-Stack Hackathon Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight font-heading">
            Build, Compete & Scale <br />
            On <span className="gradient-text">HackSphere</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Centralized platform for developers, organizers, judges, and admins. Manage team registrations, project submissions, rubric evaluations, and live leaderboards seamlessly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/hackathons" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white gradient-btn flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30"
            >
              Explore Hackathons <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-gray-200 glass-panel hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 border border-gray-700"
            >
              <Rocket className="w-4 h-4 text-indigo-400" /> Create Account
            </Link>
          </div>

          {/* Platform Key Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 glass-panel rounded-2xl p-6 border border-gray-800">
            <div className="text-center p-3">
              <div className="text-3xl font-extrabold text-white font-heading gradient-text">$50,000+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Prize Pool Awarded</div>
            </div>
            <div className="text-center p-3 border-l border-gray-800/80">
              <div className="text-3xl font-extrabold text-white font-heading gradient-text">1,200+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Global Hackers</div>
            </div>
            <div className="text-center p-3 border-l border-gray-800/80">
              <div className="text-3xl font-extrabold text-white font-heading gradient-text">350+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Projects Built</div>
            </div>
            <div className="text-center p-3 border-l border-gray-800/80">
              <div className="text-3xl font-extrabold text-white font-heading gradient-text">99.9%</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Judge Rubric Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hackathons Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white font-heading flex items-center gap-2">
              <Trophy className="w-7 h-7 text-indigo-400" /> Featured Hackathons
            </h2>
            <p className="text-gray-400 text-sm mt-1">Discover active competitions and register your team before deadline.</p>
          </div>
          <Link 
            to="/hackathons" 
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-96 rounded-2xl bg-gray-900/60 animate-pulse border border-gray-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredHackathons.map(hackathon => (
              <HackathonCard key={hackathon._id} hackathon={hackathon} />
            ))}
          </div>
        )}
      </section>

      {/* Why HackSphere Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white font-heading">
            Built For Every Stakeholder
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            No more scattered Google Forms, WhatsApp groups, or manual spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">1. Administrators</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Complete platform governance. Block suspicious users, delete invalid hackathons, and monitor global activity logs.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">2. Organizers</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Create hackathons, set deadlines & criteria, approve team registrations, assign judges, and publish winners.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">3. Participants</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Form teams with invite codes, submit project repositories & live demos, track review status, and check rankings.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">4. Expert Judges</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Review assigned projects using structured rubric matrices (Innovation, Complexity, UI/UX, Scalability).
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-gray-800 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center text-amber-400 gap-1">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-amber-400" />)}
            </div>
            <blockquote className="text-xl md:text-2xl font-medium text-white italic leading-relaxed">
              "HackSphere transformed our annual university hackathon. Managing 150+ teams and 40 judges used to take weeks of spreadsheet coordination—now it's instant and error-free."
            </blockquote>
            <div>
              <div className="font-bold text-white text-base">Marcus Vance</div>
              <div className="text-xs text-indigo-400">Head Organizer, Innovate AI Guild</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
