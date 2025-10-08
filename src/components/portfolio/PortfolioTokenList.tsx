"use client";

import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  valueUSD: number;
}

interface PortfolioTokenListProps {
  assets: Asset[];
}

export default function PortfolioTokenList({ assets }: PortfolioTokenListProps) {
  // Generate mock sparkline data
  const generateSparkline = () => {
    return Array.from({ length: 7 }, () => ({
      value: Math.random() * 100 + 50,
    }));
  };

  return (
    <div className="space-y-3">
      {assets.slice(0, 5).map((asset) => {
        const changePercent = (Math.random() - 0.5) * 10; // Mock change
        const isPositive = changePercent >= 0;
        const sparklineData = generateSparkline();

        return (
          <div
            key={asset.symbol}
            className="bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium text-sm">{asset.symbol}</div>
                <div className="text-xs text-gray-400">
                  {asset.balance.toLocaleString('en-US', {
                    maximumFractionDigits: 4,
                  })}{' '}
                  {asset.symbol}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">
                  ${asset.valueUSD.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-xs flex items-center gap-1 ${
                    isPositive ? 'text-success' : 'text-danger'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(changePercent).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div className="h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isPositive ? '#10B981' : '#EF4444'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}

