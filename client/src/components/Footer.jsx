import React from 'react';
import { Trophy, Github, Twitter, Linkedin, Heart, Shield, Code, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-800/80 bg-gray-950/80 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-heading">
                Hack<span className="gradient-text">Sphere</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The end-to-end full-stack platform for organizing, managing, competing in, and evaluating high-impact hackathons worldwide.
            </p>
            <div className="flex items-center gap-3 text-gray-400">
              <a href="#" className="p-2 rounded-lg bg-gray-900 hover:text-indigo-400 transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-lg bg-gray-900 hover:text-indigo-400 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-lg bg-gray-900 hover:text-indigo-400 transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-heading">Platform</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/hackathons" className="hover:text-indigo-400 transition-colors">Browse Hackathons</Link></li>
              <li><Link to="/gallery" className="hover:text-indigo-400 transition-colors">Public Project Showcase</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Role Dashboard Login</Link></li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-heading">User Roles</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Platform Administrator</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Event Organizer</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Expert Judge Rubric</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Student & Hacker Participant</li>
            </ul>
          </div>

          {/* Stack Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-heading">Tech Architecture</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-gray-300">MongoDB</span>
              <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-gray-300">Express.js</span>
              <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-gray-300">React 18</span>
              <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-gray-300">Node.js</span>
              <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-gray-300">Tailwind CSS</span>
              <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-gray-300">JWT & RBAC</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 HackSphere Enterprise. MERN Major Capstone Project.</p>
          <div className="flex items-center gap-2">
            <span>Engineered for scale & simplicity</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-indigo-400"><Code className="w-3.5 h-3.5" /> Ready for Evaluation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
