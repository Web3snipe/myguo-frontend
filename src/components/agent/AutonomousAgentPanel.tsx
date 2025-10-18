"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, Pause, Activity, Award, TrendingUp, Zap } from 'lucide-react';

interface AgentPanelProps {
  userId: string;
}

export default function AutonomousAgentPanel({ userId }: AgentPanelProps) {
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = useState(false);

  // Fetch agent status
  const { data: statusData } = useQuery({
    queryKey: ['agent-status', userId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/agent/status?userId=${userId}`
      );
      return response.json();
    },
    enabled: !!userId,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Fetch agent stats
  const { data: statsData } = useQuery({
    queryKey: ['agent-stats', userId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/agent/stats?userId=${userId}`
      );
      return response.json();
    },
    enabled: !!userId,
    refetchInterval: 10000,
  });

  // Toggle agent mutation
  const toggleAgentMutation = useMutation({
    mutationFn: async (action: 'start' | 'stop') => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/agent/${action}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-status', userId] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats', userId] });
      setIsToggling(false);
    },
  });

  const handleToggle = async () => {
    setIsToggling(true);
    const action = statusData?.isActive ? 'stop' : 'start';
    toggleAgentMutation.mutate(action);
  };

  const isActive = statusData?.isActive || false;
  const stats = statsData?.stats || {};
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isActive 
              ? 'bg-green-500/20 border-2 border-green-500' 
              : 'bg-gray-700/50 border-2 border-gray-600'
          }`}>
            {isActive ? (
              <Activity className="w-6 h-6 text-green-400 animate-pulse" />
            ) : (
              <Pause className="w-6 h-6 text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-bold">Autonomous Agent</h3>
            <p className="text-sm text-gray-400">
              {isActive ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Active on Base
                </span>
              ) : (
                'Inactive'
              )}
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isActive
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isToggling ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              {isActive ? 'Stopping...' : 'Starting...'}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause Agent
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Activate Agent
                </>
              )}
            </span>
          )}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Managed Value</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${stats.managedValue?.toLocaleString() || '0'}
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Actions Today</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.actionsToday || 0}
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.successRate || 0}%
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Total Actions</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.totalActions || 0}
          </div>
        </div>
      </div>

      {/* Action Breakdown */}
      {stats.breakdown && (
        <div className="bg-black/20 rounded-lg p-4 border border-gray-700/30">
          <h4 className="text-sm font-semibold mb-3 text-gray-300">Recent Activity</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Rebalances:</span>
              <span className="text-blue-400 font-semibold">{stats.breakdown.rebalances || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stop-Losses:</span>
              <span className="text-red-400 font-semibold">{stats.breakdown.stopLosses || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Yield Deploys:</span>
              <span className="text-green-400 font-semibold">{stats.breakdown.yieldDeployments || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Analyses:</span>
              <span className="text-purple-400 font-semibold">{stats.breakdown.analyses || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Last Check */}
      {stats.lastCheck && (
        <div className="mt-4 text-center text-xs text-gray-500">
          Last check: {new Date(stats.lastCheck).toLocaleTimeString()}
        </div>
      )}

      {/* Agent Description */}
      {isActive && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-xs text-green-300 text-center">
            🤖 Agent is monitoring your Base wallet 24/7 and will execute trades autonomously when needed
          </p>
        </div>
      )}
    </div>
  );
}

function DollarSign({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

