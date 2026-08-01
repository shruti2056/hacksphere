import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({ targetDate, label = 'Deadline' }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const isExpired = !timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds;

  return (
    <div className="flex items-center justify-between text-xs bg-gray-900/60 rounded-lg p-2 border border-gray-800">
      <span className="text-gray-400 flex items-center gap-1.5 font-medium">
        <Clock className="w-3.5 h-3.5 text-indigo-400" />
        {label}
      </span>
      {isExpired ? (
        <span className="text-rose-400 font-semibold uppercase text-[10px] tracking-wider">Event Ended</span>
      ) : (
        <div className="flex gap-1.5 font-mono text-indigo-300 font-semibold text-[11px]">
          <span className="bg-gray-800 px-1.5 py-0.5 rounded">{timeLeft.days}d</span>
          <span className="bg-gray-800 px-1.5 py-0.5 rounded">{timeLeft.hours}h</span>
          <span className="bg-gray-800 px-1.5 py-0.5 rounded">{timeLeft.minutes}m</span>
          <span className="bg-gray-800 px-1.5 py-0.5 rounded">{timeLeft.seconds}s</span>
        </div>
      )}
    </div>
  );
};
