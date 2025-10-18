"use client";

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface DiscoveryFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function DiscoveryFilters({ filters, onFiltersChange }: DiscoveryFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    riskTolerance: false,
    investmentThesis: false,
    signalFilters: false,
    confidenceLevel: false,
    marketCap: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const riskLabels = {
    conservative: 'Conservative',
    moderate: 'Moderate',
    aggressive: 'Aggressive'
  };

  const thesisLabels = {
    'ai-agents': 'AI Agents',
    'defi': 'DeFi',
    'gaming': 'Gaming',
    'infrastructure': 'Infrastructure',
    'memes': 'Memes',
    'layer-1': 'Layer 1',
    'layer-2': 'Layer 2'
  };

  return (
    <div className="fixed left-64 top-0 w-[280px] h-screen bg-[#0A0A0A] border-r border-gray-800 overflow-y-auto">
      <div className="p-5">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Discovery</h2>
          <p className="text-xs text-gray-500">Configure your preferences</p>
        </div>

        {/* Risk Tolerance - Dropdown Style */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('riskTolerance')}
            className="flex items-center justify-between w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div>
              <div className="text-xs text-gray-500 mb-1">Risk Tolerance</div>
              <div className="text-sm font-medium text-white capitalize">
                {riskLabels[filters.riskTolerance as keyof typeof riskLabels]}
              </div>
            </div>
            {expandedSections.riskTolerance ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.riskTolerance && (
            <div className="mt-2 space-y-2 p-3 bg-gray-900/50 rounded-lg">
              {Object.entries(riskLabels).map(([value, label]) => (
                <label key={value} className="flex items-center cursor-pointer hover:bg-gray-800/50 p-2 rounded">
                  <input
                    type="radio"
                    name="riskTolerance"
                    checked={filters.riskTolerance === value}
                    onChange={() => {
                      onFiltersChange({ ...filters, riskTolerance: value });
                      toggleSection('riskTolerance');
                    }}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Investment Thesis - Multi-Select */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('investmentThesis')}
            className="flex items-center justify-between w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">Investment Thesis</div>
              <div className="text-sm font-medium text-white truncate">
                {Array.isArray(filters.investmentThesis) && filters.investmentThesis.length > 0
                  ? filters.investmentThesis.map((t: string) => thesisLabels[t as keyof typeof thesisLabels]).join(', ')
                  : 'Select themes'}
              </div>
            </div>
            {expandedSections.investmentThesis ? (
              <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
          </button>
          
          {expandedSections.investmentThesis && (
            <div className="mt-2 space-y-2 p-3 bg-gray-900/50 rounded-lg">
              {Object.entries(thesisLabels).map(([value, label]) => (
                <label key={value} className="flex items-center cursor-pointer hover:bg-gray-800/50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.investmentThesis) ? filters.investmentThesis.includes(value) : false}
                    onChange={(e) => {
                      const currentThesis = Array.isArray(filters.investmentThesis) ? filters.investmentThesis : [];
                      const newThesis = e.target.checked
                        ? [...currentThesis, value]
                        : currentThesis.filter((t: string) => t !== value);
                      onFiltersChange({ ...filters, investmentThesis: newThesis });
                    }}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Time Horizon - Simple Select */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Timeframe</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onFiltersChange({ ...filters, timeHorizon: 1 })}
              className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                filters.timeHorizon <= 3
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Short
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, timeHorizon: 6 })}
              className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                filters.timeHorizon > 3 && filters.timeHorizon <= 9
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Mid
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, timeHorizon: 12 })}
              className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                filters.timeHorizon > 9
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Long
            </button>
          </div>
        </div>

        {/* Confidence Level - Compact */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-white">Min Confidence</h3>
            <span className="text-sm text-purple-400 font-semibold">{filters.confidenceLevel}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="90"
            value={filters.confidenceLevel}
            onChange={(e) => onFiltersChange({ ...filters, confidenceLevel: Number(e.target.value) })}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>60%</span>
            <span>90%</span>
          </div>
        </div>

        {/* Signal Filters - Dropdown */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('signalFilters')}
            className="flex items-center justify-between w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div>
              <div className="text-xs text-gray-500 mb-1">Signal Filters</div>
              <div className="text-sm font-medium text-white">
                {Object.values(filters.signalFilters).filter(Boolean).length} active
              </div>
            </div>
            {expandedSections.signalFilters ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.signalFilters && (
            <div className="mt-2 space-y-2 p-3 bg-gray-900/50 rounded-lg">
              {Object.entries({
                whaleActivity: 'Whale Activity',
                technicalBreakouts: 'Technical Breakouts',
                protocolUpdates: 'Protocol Updates',
                socialMomentum: 'Social Momentum',
                newListings: 'New Listings',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center cursor-pointer hover:bg-gray-800/50 p-2 rounded">
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

        {/* Market Cap - Dropdown */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('marketCap')}
            className="flex items-center justify-between w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div>
              <div className="text-xs text-gray-500 mb-1">Market Cap</div>
              <div className="text-sm font-medium text-white">
                {Object.values(filters.marketCap).filter(Boolean).length} selected
              </div>
            </div>
            {expandedSections.marketCap ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {expandedSections.marketCap && (
            <div className="mt-2 space-y-2 p-3 bg-gray-900/50 rounded-lg">
              {Object.entries({
                large: 'Large (>$1B)',
                mid: 'Mid ($100M-$1B)',
                small: 'Small ($10M-$100M)',
                micro: 'Micro (<$10M)',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center cursor-pointer hover:bg-gray-800/50 p-2 rounded">
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

        {/* Submit Button */}
        <button 
          onClick={() => {
            // Force refresh by adding timestamp
            onFiltersChange({ ...filters, _refresh: Date.now() });
          }}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-purple-500/50"
        >
          Submit
        </button>

        {/* Info */}
        <div className="mt-6 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-gray-400 leading-relaxed">
            🤖 AI analyzes 100+ data points across 4 chains to surface alpha opportunities
          </p>
        </div>
      </div>
    </div>
  );
}



