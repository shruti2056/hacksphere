import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 font-heading">Access Denied (403 Forbidden)</h2>
        <p className="text-gray-400 max-w-md mb-6 text-sm">
          Your role (<span className="text-rose-400 font-semibold">{user.role}</span>) does not have permission to view this section.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
};
