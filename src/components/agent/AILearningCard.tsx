"use client";

import { Brain, TrendingUp } from 'lucide-react';

export default function AILearningCard() {
  return (
    <div className="bg-gradient-to-br from-[#7C3AED]/10 to-[#6D28D9]/10 border border-[#7C3AED]/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#7C3AED]/20 rounded-lg">
          <Brain className="w-6 h-6 text-[#7C3AED]" />
        </div>
        <h3 className="text-lg font-semibold text-white">Agent Intelligence</h3>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">
        Learning from your approval patterns to improve recommendations
      </p>

      {/* Progress/Learning Metrics */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Pattern Recognition</span>
            <span className="text-[#7C3AED] font-medium">78%</span>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-full"
              style={{ width: '78%' }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Accuracy Score</span>
            <span className="text-[#7C3AED] font-medium">92%</span>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-full"
              style={{ width: '92%' }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
        <TrendingUp className="w-4 h-4" />
        <span>Improving daily</span>
      </div>
    </div>
  );
}

