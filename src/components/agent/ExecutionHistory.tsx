"use client";

import { CheckCircle2, TrendingUp, Clock, Zap } from 'lucide-react';

const demoActions = [
  {
    id: 1,
    time: '2 hours ago',
    action: 'Portfolio Rebalanced',
    details: 'Reduced ETH concentration from 85% to 68%',
    status: 'Success',
    metrics: [
      { label: 'Saved', value: '$47 in gas' },
      { label: 'Status', value: 'Success' },
    ],
    changes: [
      { label: 'ETH', before: '85%', after: '68%' },
      { label: 'USDC', before: '10%', after: '25%' },
    ],
  },
  {
    id: 2,
    time: 'Yesterday 14:30',
    action: 'Yield Optimization Executed',
    details: 'Deployed $2,400 idle USDC to Aave',
    status: 'Success',
    metrics: [
      { label: 'Now earning', value: '6.4% APY' },
      { label: 'Projected', value: '+$154/year' },
    ],
  },
  {
    id: 3,
    time: '3 days ago',
    action: 'Gas Optimization',
    details: 'Delayed rebalance for optimal gas price',
    status: 'Success',
    metrics: [
      { label: 'Waited', value: '45 gwei → 18 gwei' },
      { label: 'Saved', value: '$23' },
    ],
  },
];

export default function ExecutionHistory() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Agent Actions</h2>
      
      {demoActions.map((action) => (
        <div
          key={action.id}
          className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 hover:border-[#7C3AED]/30 transition-colors"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Clock className="w-4 h-4" />
                {action.time}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{action.action}</h3>
              <p className="text-gray-400">{action.details}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-sm">
              <CheckCircle2 className="w-4 h-4" />
              {action.status}
            </div>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-6 mb-4">
            {action.metrics.map((metric, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">{metric.label}:</span>
                <span className="text-white font-medium">{metric.value}</span>
              </div>
            ))}
          </div>

          {/* Before/After Changes (if applicable) */}
          {action.changes && (
            <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
              {action.changes.map((change, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{change.label}:</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                      {change.before}
                    </span>
                    <span className="text-gray-600">→</span>
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs">
                      {change.after}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {demoActions.length === 0 && (
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 text-center">
          <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No agent actions yet</p>
          <p className="text-gray-600 text-sm mt-2">
            Configure rules and activate agent to begin
          </p>
        </div>
      )}
    </div>
  );
}

