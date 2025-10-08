"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PortfolioHistory } from '@/types';

interface PortfolioChartProps {
  data: PortfolioHistory[];
  timePeriod: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';
  onTimePeriodChange: (period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y') => void;
}

const periods: Array<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'> = ['1D', '1W', '1M', '3M', '6M', '1Y'];

export default function PortfolioChart({
  data,
  timePeriod,
  onTimePeriodChange,
}: PortfolioChartProps) {
  const chartData = data.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    value: item.value,
  }));

  return (
    <div>
      {/* Time Period Selector */}
      <div className="flex items-center justify-end gap-2 mb-4">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => onTimePeriodChange(period)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              timePeriod === period
                ? 'bg-gradient-to-r from-[#E879F9] to-[#A855F7] text-white'
                : 'text-gray-400 hover:text-white bg-gray-800'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E879F9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                stroke="#374151"
                tick={{ fill: '#6B7280' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#374151"
                tick={{ fill: '#6B7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value > 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value.toFixed(0)}`}
                domain={[0, 'dataMax']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [
                  `$${value.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  'Value',
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#E879F9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                dot={false}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No chart data available
          </div>
        )}
      </div>
    </div>
  );
}

