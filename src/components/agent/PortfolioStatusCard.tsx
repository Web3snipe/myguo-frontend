"use client";

import { CheckCircle2, AlertTriangle } from 'lucide-react';

const allocationData = [
  { asset: 'ETH', current: 68, target: 70, status: 'good' },
  { asset: 'Stablecoins', current: 22, target: 20, status: 'good' },
  { asset: 'Other', current: 10, target: 10, status: 'good' },
];

export default function PortfolioStatusCard() {
  const isInBalance = allocationData.every(item => 
    Math.abs(item.current - item.target) <= 5
  );

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Current vs Target Allocation</h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
          isInBalance 
            ? 'bg-green-500/10 text-green-500' 
            : 'bg-yellow-500/10 text-yellow-500'
        }`}>
          {isInBalance ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              In Balance
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              Rebalance Needed
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {allocationData.map((item) => (
          <div key={item.asset}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{item.asset}</span>
              <span className="text-sm text-white font-medium">
                {item.current}% <span className="text-gray-600">(target &lt;{item.target}%)</span>
              </span>
            </div>
            <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full ${
                  item.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${item.current}%` }}
              />
              {/* Target marker */}
              <div
                className="absolute top-0 h-full w-0.5 bg-white/30"
                style={{ left: `${item.target}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

