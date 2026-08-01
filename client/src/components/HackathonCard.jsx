import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Award, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CountdownTimer } from './CountdownTimer';

export const HackathonCard = ({ hackathon }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group">
      {/* Cover Image & Status Badge Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-900">
        <img 
          src={hackathon.bannerImage} 
          alt={hackathon.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          <StatusBadge status={hackathon.status} />
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-gray-200 border border-white/10 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-400" />
            {hackathon.mode}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 text-xs bg-indigo-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-indigo-500/30 text-indigo-200 font-medium flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{hackathon.prizePool}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
            {hackathon.theme}
          </span>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 font-heading">
            {hackathon.title}
          </h3>
          <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
            {hackathon.description}
          </p>
        </div>

        {/* Live Countdown Target */}
        <div className="pt-2 border-t border-gray-800/60">
          <CountdownTimer targetDate={hackathon.endDate} label="Hackathon Ends In" />
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Max Team Size">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Max {hackathon.maxTeamSize}
            </span>
            <span className="flex items-center gap-1" title="Registration Deadline">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {new Date(hackathon.registrationDeadline).toLocaleDateString()}
            </span>
          </div>

          <Link 
            to={`/hackathons/${hackathon._id}`}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 group/btn"
          >
            Details <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
