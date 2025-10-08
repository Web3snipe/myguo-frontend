"use client";

import { DollarSign, Zap, TrendingUp } from 'lucide-react';

const metrics = [
  {
    label: 'Total Gas Saved',
    value: '$247',
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    label: 'Actions Executed',
    value: '12',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    label: 'Yield Captured',
    value: '+$340',
    icon: TrendingUp,
    color: 'text-[#7C3AED]',
    bgColor: 'bg-[#7C3AED]/10',
  },
];

export default function PerformanceMetrics() {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Performance Metrics</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          
          return (
            <div
              key={metric.label}
              className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 hover:border-[#7C3AED]/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${metric.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <span className="text-sm text-gray-400">{metric.label}</span>
              </div>
              <div className="text-3xl font-bold text-white">{metric.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

