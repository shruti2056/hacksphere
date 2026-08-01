import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-indigo-400" />
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-2 font-heading">404 - Page Not Found</h1>
      <p className="text-gray-400 max-w-md mb-6 text-sm">
        The requested page or hackathon URL does not exist or has been relocated.
      </p>
      <Link to="/" className="px-6 py-2.5 rounded-xl font-semibold text-white gradient-btn flex items-center gap-2">
        <Home className="w-4 h-4" /> Return to Home Page
      </Link>
    </div>
  );
};
