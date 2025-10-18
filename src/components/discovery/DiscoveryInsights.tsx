"use client";

import { TrendingUp, Activity, Zap, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DiscoveryInsights() {
  const [prices, setPrices] = useState({
    virtual: { price: 0, change: 0 },
    game: { price: 0, change: 0 },
    aixbt: { price: 0, change: 0 },
    eth: { price: 0, change: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Fetch real-time prices from backend
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch from CoinGecko API via backend
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/discovery/market-intel`);
        if (response.data.success) {
          setPrices(response.data.prices);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch market intel:', error);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed right-0 top-0 w-[360px] h-screen bg-[#0A0A0A] border-l border-gray-800 overflow-y-auto">
      <div className="p-5">
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-base font-bold text-white mb-1">Market Intelligence</h3>
          <p className="text-xs text-gray-500">Base & Virtuals Protocol • Real-time</p>
        </div>

        {/* Virtuals Protocol Tokens */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Virtuals Protocol
          </h4>
          
          {loading ? (
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* VIRTUAL Token */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xs font-bold">
                      VI
                    </div>
                    <span className="text-sm font-semibold text-white">VIRTUAL</span>
                  </div>
                  <span className={`text-sm font-bold ${prices.virtual.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {prices.virtual.change >= 0 ? '+' : ''}{prices.virtual.change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">AI Agent Platform</span>
                  <span className="text-base font-bold text-white">
                    ${prices.virtual.price.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* GAME Token */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-xs font-bold">
                      GA
                    </div>
                    <span className="text-sm font-semibold text-white">GAME</span>
                  </div>
                  <span className={`text-sm font-bold ${prices.game.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {prices.game.change >= 0 ? '+' : ''}{prices.game.change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Framework SDK</span>
                  <span className="text-base font-bold text-white">
                    ${prices.game.price.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* AIXBT Token */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3 hover:border-green-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-xs font-bold">
                      AI
                    </div>
                    <span className="text-sm font-semibold text-white">AIXBT</span>
                  </div>
                  <span className={`text-sm font-bold ${prices.aixbt.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {prices.aixbt.change >= 0 ? '+' : ''}{prices.aixbt.change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">AI Trading Agent</span>
                  <span className="text-base font-bold text-white">
                    ${prices.aixbt.price.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Base Ecosystem */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Base Ecosystem
          </h4>
          
          {loading ? (
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">ETH (Base L2)</span>
                  <span className={`text-sm font-bold ${prices.eth.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {prices.eth.change >= 0 ? '+' : ''}{prices.eth.change.toFixed(2)}%
                  </span>
                </div>
                <div className="text-lg font-bold text-white">
                  ${prices.eth.price.toFixed(2)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-blue-400">LIVE ACTIVITY</span>
                </div>
                <p className="text-xs text-gray-300">
                  Base network processing 2.4M+ txns/day. AI agent deployments up 340% this month.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Agent Trends */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            AI Agent Economy
          </h4>
          
          <div className="space-y-2">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Active AI Agents</span>
                <span className="text-sm font-bold text-green-400">↑ 847</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-gradient-to-r from-green-500 to-emerald-500" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">24H Agent Volume</span>
                <span className="text-sm font-bold text-purple-400">$4.2M</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">ACP Transactions</span>
                <span className="text-sm font-bold text-blue-400">↑ 12.3K</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-[68%] bg-gradient-to-r from-blue-500 to-cyan-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-white mb-3">Market Sentiment</h4>
          <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">AI Agents Sector</span>
              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded font-bold">
                BULLISH
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Virtuals Protocol ecosystem showing strong momentum. Base L2 adoption accelerating. Key catalysts: ACP expansion, new agent launches, DeFi integrations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-600">
            Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
