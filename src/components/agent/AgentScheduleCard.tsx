"use client";

import { Clock, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AgentScheduleCard() {
  const [timeUntilNext, setTimeUntilNext] = useState('14 minutes');

  useEffect(() => {
    // Update countdown every minute
    const interval = setInterval(() => {
      // Simulate countdown
      const minutes = 15 - (Math.floor(Date.now() / 60000) % 15);
      setTimeUntilNext(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Agent Schedule</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#7C3AED]/10 rounded-lg">
            <Clock className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Next Check</p>
            <p className="text-white font-medium">In {timeUntilNext}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#7C3AED]/10 rounded-lg">
            <Calendar className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Check Frequency</p>
            <p className="text-white font-medium">Every 15 minutes</p>
          </div>
        </div>
      </div>

      <button className="w-full mt-4 text-sm text-[#7C3AED] hover:text-[#6D28D9] transition-colors">
        View full schedule →
      </button>
    </div>
  );
}






