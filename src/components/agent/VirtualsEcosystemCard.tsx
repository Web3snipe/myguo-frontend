"use client";

import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

interface VirtualsToken {
  symbol: string;
  name: string;
  balance: string;
  valueUSD: number;
  change24h?: number;
}

interface VirtualsEcosystemCardProps {
  tokens: VirtualsToken[];
  totalValue: number;
  portfolioPercentage: number;
}

export default function VirtualsEcosystemCard({
  tokens,
  totalValue,
  portfolioPercentage,
}: VirtualsEcosystemCardProps) {
  const virtualsTokenSymbols = ['VIRTUAL', 'GAME', 'AIXBT', 'VADER', 'LUNA'];
  const virtualsTokens = tokens.filter(t => virtualsTokenSymbols.includes(t.symbol));

  if (virtualsTokens.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Virtuals Ecosystem
          </h3>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-400 mb-3">No Virtuals Protocol tokens detected</p>
          <p className="text-sm text-gray-500">
            Consider adding VIRTUAL, GAME, or other AI agent tokens to your portfolio
          </p>
        </div>
      </div>
    );
  }

  const ecosystemValue = virtualsTokens.reduce((sum, t) => sum + t.valueUSD, 0);
  const ecosystemPercentage = (ecosystemValue / totalValue) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Virtuals Ecosystem Portfolio
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ${ecosystemValue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">
            {ecosystemPercentage.toFixed(1)}% of portfolio
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="space-y-3">
        {virtualsTokens.map((token) => {
          const tokenPercentage = (token.valueUSD / ecosystemValue) * 100;
          const isPositive = (token.change24h || 0) >= 0;
          
          return (
            <div
              key={token.symbol}
              className="bg-black/30 rounded-lg p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Token Icon/Badge */}
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {token.symbol.charAt(0)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{token.symbol}</span>
                      <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                        Virtuals
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {token.balance} tokens
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    ${token.valueUSD.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {tokenPercentage.toFixed(1)}%
                  </div>
                  {token.change24h !== undefined && (
                    <div className={`text-xs flex items-center gap-1 justify-end mt-1 ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${tokenPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700/50 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-gray-400 mb-1">Tokens</div>
          <div className="text-lg font-semibold text-purple-400">
            {virtualsTokens.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Value</div>
          <div className="text-lg font-semibold text-blue-400">
            ${ecosystemValue.toFixed(0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Allocation</div>
          <div className="text-lg font-semibold text-green-400">
            {ecosystemPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Agent Status Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>🤖 Agent actively managing Base wallet</span>
      </div>
    </div>
  );
}

