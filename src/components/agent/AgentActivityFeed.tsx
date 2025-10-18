"use client";

import { useQuery } from '@tanstack/react-query';
import { Clock, TrendingUp, Shield, DollarSign, BarChart3, ExternalLink } from 'lucide-react';

interface AgentAction {
  id: string;
  type: string;
  description: string;
  txHash?: string;
  status: string;
  metadata?: any;
  createdAt: string;
}

interface AgentActivityFeedProps {
  userId: string;
  limit?: number;
}

const getActionIcon = (type: string) => {
  switch (type) {
    case 'REBALANCE':
      return <BarChart3 className="w-5 h-5 text-blue-400" />;
    case 'STOP_LOSS':
      return <Shield className="w-5 h-5 text-red-400" />;
    case 'YIELD_DEPLOY':
      return <DollarSign className="w-5 h-5 text-green-400" />;
    case 'ANALYSIS':
      return <TrendingUp className="w-5 h-5 text-purple-400" />;
    case 'ACP_JOB':
      return <DollarSign className="w-5 h-5 text-yellow-400" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

const getActionColor = (type: string) => {
  switch (type) {
    case 'REBALANCE':
      return 'border-blue-500/30 bg-blue-500/5';
    case 'STOP_LOSS':
      return 'border-red-500/30 bg-red-500/5';
    case 'YIELD_DEPLOY':
      return 'border-green-500/30 bg-green-500/5';
    case 'ANALYSIS':
      return 'border-purple-500/30 bg-purple-500/5';
    case 'ACP_JOB':
      return 'border-yellow-500/30 bg-yellow-500/5';
    default:
      return 'border-gray-500/30 bg-gray-500/5';
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export default function AgentActivityFeed({ userId, limit = 20 }: AgentActivityFeedProps) {
  const { data: activityData, isLoading, refetch } = useQuery({
    queryKey: ['agent-activity', userId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/agent/activity?userId=${userId}&limit=${limit}`
      );
      return response.json();
    },
    enabled: !!userId,
    refetchInterval: 10000, // Refetch every 10 seconds for live updates
  });

  const actions: AgentAction[] = activityData?.actions || [];

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Agent Activity Feed
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-800/50 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Agent Activity Feed
        </h3>
        <div className="text-center py-8 text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No agent activity yet</p>
          <p className="text-sm mt-1">Start the agent to see autonomous actions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Agent Activity Feed
          <span className="text-sm font-normal text-gray-400">
            ({actions.length} actions)
          </span>
        </h3>
        <button
          onClick={() => refetch()}
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`border rounded-lg p-4 transition-all hover:shadow-md ${getActionColor(action.type)}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="mt-0.5">
                {getActionIcon(action.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-400">
                    {formatTimeAgo(action.createdAt)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    action.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' :
                    action.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {action.status}
                  </span>
                </div>

                <p className="text-sm text-gray-200 break-words">
                  {action.description}
                </p>

                {/* Metadata */}
                {action.metadata && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                    {action.metadata.fromToken && action.metadata.toToken && (
                      <span>
                        {action.metadata.fromToken} → {action.metadata.toToken}
                      </span>
                    )}
                    {action.metadata.amountOut && (
                      <span>
                        Received: {Number(action.metadata.amountOut).toFixed(2)}
                      </span>
                    )}
                    {action.metadata.gasUsed && (
                      <span>
                        Gas: ${(Number(action.metadata.gasUsed) * 0.000001).toFixed(4)}
                      </span>
                    )}
                    {action.metadata.payment && (
                      <span className="text-yellow-400">
                        💰 Earned: {action.metadata.payment}
                      </span>
                    )}
                  </div>
                )}

                {/* Transaction Link */}
                {action.txHash && (
                  <a
                    href={`https://sepolia.basescan.org/tx/${action.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    View on Basescan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

