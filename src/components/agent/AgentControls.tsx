"use client";

import { useState } from 'react';
import { Bot, Save } from 'lucide-react';

interface AgentControlsProps {
  agentActive: boolean;
  onToggle: (active: boolean) => void;
}

export default function AgentControls({ agentActive, onToggle }: AgentControlsProps) {
  const [concentration, setConcentration] = useState(70);
  const [stablecoin, setStablecoin] = useState(20);
  const [gasPrice, setGasPrice] = useState(30);
  const [sensitivity, setSensitivity] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  const handleSaveRules = () => {
    // Save rules to backend
    console.log('Saving rules:', { concentration, stablecoin, gasPrice, sensitivity });
    alert('Agent rules updated successfully!');
  };

  return (
    <div className="p-6 space-y-6 pt-8">
      {/* Agent Status Card */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-[#7C3AED]" />
            <h3 className="text-lg font-semibold text-white">Agent Status</h3>
          </div>
          
          {/* Toggle Switch */}
          <button
            onClick={() => onToggle(!agentActive)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              agentActive ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                agentActive ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${agentActive ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span className={`font-medium ${agentActive ? 'text-green-500' : 'text-gray-400'}`}>
            {agentActive ? 'Active' : 'Paused'}
          </span>
        </div>

        <p className="text-sm text-gray-400">
          AI agent will execute optimizations based on rules below
        </p>
      </div>

      {/* Execution Rules Panel */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white mb-4">Execution Rules</h3>

        {/* Concentration Limits */}
        <div>
          <label className="text-sm font-medium text-white block mb-3">
            Maximum Single Asset Allocation
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={concentration}
            onChange={(e) => setConcentration(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${concentration}%, #374151 ${concentration}%, #374151 100%)`
            }}
          />
          <p className="text-sm text-gray-400 mt-2">&lt;{concentration}% in single asset</p>
        </div>

        {/* Stablecoin Target */}
        <div>
          <label className="text-sm font-medium text-white block mb-3">
            Minimum Stablecoin Allocation
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={stablecoin}
            onChange={(e) => setStablecoin(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${(stablecoin/50)*100}%, #374151 ${(stablecoin/50)*100}%, #374151 100%)`
            }}
          />
          <p className="text-sm text-gray-400 mt-2">Maintain {stablecoin}% in stables</p>
        </div>

        {/* Gas Price Threshold */}
        <div>
          <label className="text-sm font-medium text-white block mb-3">
            Maximum Gas Price for Execution
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={gasPrice}
            onChange={(e) => setGasPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${((gasPrice-10)/90)*100}%, #374151 ${((gasPrice-10)/90)*100}%, #374151 100%)`
            }}
          />
          <p className="text-sm text-gray-400 mt-2">Only execute below {gasPrice} gwei</p>
        </div>

        {/* Rebalance Sensitivity */}
        <div>
          <label className="text-sm font-medium text-white block mb-3">
            Rebalance Sensitivity
          </label>
          <div className="space-y-3">
            {(['conservative', 'moderate', 'aggressive'] as const).map((option) => (
              <label key={option} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="sensitivity"
                  value={option}
                  checked={sensitivity === option}
                  onChange={(e) => setSensitivity(e.target.value as any)}
                  className="mt-1 w-4 h-4 text-[#7C3AED] border-gray-600 focus:ring-[#7C3AED]"
                />
                <div>
                  <div className="text-white font-medium capitalize group-hover:text-[#7C3AED] transition-colors">
                    {option}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {option === 'conservative' && 'Only rebalance when deviation exceeds 15%'}
                    {option === 'moderate' && 'Rebalance when deviation exceeds 10%'}
                    {option === 'aggressive' && 'Rebalance when deviation exceeds 5%'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveRules}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Update Agent Rules
        </button>
      </div>
    </div>
  );
}

