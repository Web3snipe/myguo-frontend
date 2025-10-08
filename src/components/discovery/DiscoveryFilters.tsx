"use client";

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface DiscoveryFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function DiscoveryFilters({ filters, onFiltersChange }: DiscoveryFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    riskTolerance: true,
    investmentThesis: true,
    signalFilters: true,
    confidenceLevel: true,
    marketCap: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="fixed left-64 top-0 w-[300px] h-screen bg-[#0A0A0A] border-r border-gray-800 overflow-y-auto">
      <div className="p-6">
        {/* Risk Tolerance */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('riskTolerance')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <span className="text-gray-400">◆</span> Risk Tolerance
            </h3>
            {expandedSections.riskTolerance ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.riskTolerance && (
            <div className="space-y-2">
              {['conservative', 'moderate', 'aggressive'].map((risk) => (
                <label key={risk} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="riskTolerance"
                    checked={filters.riskTolerance === risk}
                    onChange={() => onFiltersChange({ ...filters, riskTolerance: risk })}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300 capitalize">{risk}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Time Horizon */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <span className="text-gray-400">◆</span> Time Horizon
            </h3>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={filters.timeHorizon}
            onChange={(e) => onFiltersChange({ ...filters, timeHorizon: Number(e.target.value) })}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1M</span>
            <span className="text-purple-400">{filters.timeHorizon}M</span>
            <span>12M</span>
          </div>
        </div>

        {/* Portfolio Size Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-white">Portfolio Size Slider</h3>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.portfolioSize}
            onChange={(e) => onFiltersChange({ ...filters, portfolioSize: Number(e.target.value) })}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span>
            <span className="text-purple-400">${filters.portfolioSize}K</span>
            <span>$100K</span>
          </div>
        </div>

        {/* Investment Thesis */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('investmentThesis')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <span className="text-gray-400">💡</span> Investment Thesis
            </h3>
            {expandedSections.investmentThesis ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.investmentThesis && (
            <select
              value={filters.investmentThesis}
              onChange={(e) => onFiltersChange({ ...filters, investmentThesis: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="ai-agents">AI Agents</option>
              <option value="defi">DeFi</option>
              <option value="gaming">Gaming</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="memes">Memes</option>
            </select>
          )}
        </div>

        {/* Signal Filters */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('signalFilters')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <span className="text-gray-400">🔍</span> Signal Filters
            </h3>
            {expandedSections.signalFilters ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.signalFilters && (
            <div className="space-y-2">
              {Object.entries({
                whaleActivity: 'Whale Activity',
                technicalBreakouts: 'Technical Breakouts',
                protocolUpdates: 'Protocol Updates',
                socialMomentum: 'Social Momentum',
                newListings: 'New Listings',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.signalFilters[key as keyof typeof filters.signalFilters]}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        signalFilters: {
                          ...filters.signalFilters,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Confidence Level Slider */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('confidenceLevel')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <span className="text-gray-400">◆</span> Confidence Level Slider
            </h3>
          </button>
          
          {expandedSections.confidenceLevel && (
            <>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.confidenceLevel}
                onChange={(e) => onFiltersChange({ ...filters, confidenceLevel: Number(e.target.value) })}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>60%</span>
                <span className="text-purple-400">{filters.confidenceLevel}%</span>
                <span>90%</span>
              </div>
            </>
          )}
        </div>

        {/* Market Cap Toggles */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('marketCap')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <span className="text-gray-400">📊</span> Market Cap Toggles
            </h3>
            {expandedSections.marketCap ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.marketCap && (
            <div className="space-y-2">
              {Object.entries({
                large: 'Large (>$1B)',
                mid: 'Mid ($100M-$1B)',
                small: 'Small ($10M-$100M)',
                micro: 'Micro (<$10M)',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.marketCap[key as keyof typeof filters.marketCap]}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        marketCap: {
                          ...filters.marketCap,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Update Preferences Button */}
        <button className="w-full py-3 bg-gradient-to-r from-[#E879F9] to-[#A855F7] rounded-lg font-medium hover:opacity-90 transition-opacity">
          Update Preferences
        </button>
      </div>
    </div>
  );
}



