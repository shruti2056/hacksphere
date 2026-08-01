import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Registration Open':
      case 'Approved':
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Ongoing':
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Pending':
      case 'Upcoming':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Rejected':
      case 'Closed':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${getStyle()} backdrop-blur-md inline-flex items-center gap-1`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};
