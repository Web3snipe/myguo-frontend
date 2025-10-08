"use client";

import { TrendingUp, Users, Brain, Activity } from 'lucide-react';

export default function DiscoveryInsights() {
  return (
    <div className="fixed right-0 top-0 w-[360px] h-screen bg-[#0A0A0A] border-l border-gray-800 overflow-y-auto">
      <div className="p-6">
        {/* AI Market Intelligence */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">AI Market Intelligence</h3>
          
          {/* Pattern Detected Card */}
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Pattern Detected
            </h4>
            <p className="text-sm text-gray-300 mb-2">
              AI infrastructure tokens showing 3x volume increase across 12 projects in past 48 hours
            </p>
          </div>
        </div>

        {/* Your Behavior */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Your Behavior</h3>
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-300 mb-3">
              You favor early-stage protocol launches with infrastructure narratives. Avg hold: 3-6 months
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Early Stage Preference</span>
                <span className="text-purple-400">High</span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-[#E879F9] to-[#A855F7]" />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Wallets */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Similar Wallets</h3>
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" />
              <p className="text-sm text-gray-300">
                Wallets with similar patterns are allocating 25% to AI agent ecosystems
              </p>
            </div>
          </div>
        </div>

        {/* Trending Narratives */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Trending Narratives</h3>
          <div className="space-y-3">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium">AI Agent Ecosystems</h4>
                    <span className="text-xs text-green-500">Hot</span>
                  </div>
                  <p className="text-xs text-gray-400">47 projects tracked. Growing</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium">IP & Content Infrastructure</h4>
                    <span className="text-xs text-yellow-500">Emerging</span>
                  </div>
                  <p className="text-xs text-gray-400">12 Projects tracked. Hot</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium">Decentralized Compute</h4>
                    <span className="text-xs text-purple-500">Watch</span>
                  </div>
                  <p className="text-xs text-gray-400">23 Projects tracked. Emerging</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium">AI Data Marketplaces</h4>
                    <span className="text-xs text-blue-500">Watch</span>
                  </div>
                  <p className="text-xs text-gray-400">16 Projects tracked. watch</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Learning Status */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">AI Learning Status</h3>
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="text-sm font-medium mb-1">Agent Intelligence</h4>
                <p className="text-xs text-gray-400">
                  Your model has processed 340 signals this month and is improving recommendation
                  accuracy based on your interaction patterns
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Model Confidence</span>
                <span className="text-purple-400">82%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-[82%] bg-gradient-to-r from-[#E879F9] to-[#A855F7]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



