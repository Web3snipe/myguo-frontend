"use client";

import { AIInsight } from '@/types';
import { Sparkles, TrendingUp, AlertTriangle, Zap, Heart, Activity, Target } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generatePortfolioInsights } from '@/lib/api';

interface AIInsightsSectionProps {
  insights: AIInsight[];
  userId: string;
  walletId?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function AIInsightsSection({ insights, userId, walletId, onRefresh, isLoading }: AIInsightsSectionProps) {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const queryClient = useQueryClient();

  const generateInsightsMutation = useMutation({
    mutationFn: () => generatePortfolioInsights(userId, walletId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      onRefresh?.();
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <Heart className="w-5 h-5 text-success" />;
      case 'rebalancing':
        return <Activity className="w-5 h-5 text-primary" />;
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'performance':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'regime':
        return <Activity className="w-5 h-5 text-primary" />;
      case 'opportunity':
        return <Target className="w-5 h-5 text-primary" />;
      // Legacy types
      case 'yield_opportunity':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'concentration_risk':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'gas_optimization':
        return <Zap className="w-5 h-5 text-primary" />;
      default:
        return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500/50 bg-red-500/5';
      case 'high':
        return 'border-orange-500/50 bg-orange-500/5';
      case 'medium':
        return 'border-yellow-500/50 bg-yellow-500/5';
      case 'low':
        return 'border-gray-700 bg-gray-800/30';
      default:
        return 'border-gray-700 bg-gray-800/30';
    }
  };

  if (insights.length === 0) {
    return (
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Insights for You
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">
            {isLoading ? 'Analyzing your portfolio...' : 'No insights available yet'}
          </p>
          <button
            onClick={() => generateInsightsMutation.mutate()}
            className="btn-primary"
            disabled={generateInsightsMutation.isPending || isLoading}
          >
            {generateInsightsMutation.isPending || isLoading ? 'Generating...' : 'Generate AI Insights'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Insights for You
          </h2>
          <button 
            onClick={() => generateInsightsMutation.mutate()}
            className="text-sm text-primary hover:underline disabled:opacity-50"
            disabled={generateInsightsMutation.isPending}
          >
            {generateInsightsMutation.isPending ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.slice(0, 3).map((insight: any) => (
            <div
              key={insight.id}
              className={`border rounded-xl p-5 hover:border-gray-600 transition-all cursor-pointer ${getPriorityColor(insight.priority)}`}
              onClick={() => setSelectedInsight(insight)}
            >
              {/* Priority Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-900/50 rounded-lg">
                  {getIcon(insight.type)}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  insight.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                  insight.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  insight.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-700/50 text-gray-400'
                }`}>
                  {insight.priority}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm mb-2 leading-tight text-white">
                {insight.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                {insight.description}
              </p>

              {/* Metrics (if available) */}
              {insight.metrics && (
                <div className="mb-3 space-y-1">
                  {insight.metrics.score !== undefined && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Score</span>
                      <span className={`font-semibold ${
                        insight.metrics.score >= 70 ? 'text-success' : 
                        insight.metrics.score >= 50 ? 'text-warning' : 'text-danger'
                      }`}>
                        {insight.metrics.score}/100
                      </span>
                    </div>
                  )}
                  {insight.metrics.change && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Change</span>
                      <span className={`font-semibold ${
                        insight.metrics.change.startsWith('+') ? 'text-success' : 'text-danger'
                      }`}>
                        {insight.metrics.change}
                      </span>
                    </div>
                  )}
                  {insight.metrics.exposure && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Exposure</span>
                      <span className="font-semibold text-gray-300">{insight.metrics.exposure}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Related Tokens */}
              {insight.relatedTokens && insight.relatedTokens.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {insight.relatedTokens.slice(0, 3).map((token: string) => (
                    <span key={token} className="text-xs px-2 py-0.5 bg-gray-800/50 rounded text-gray-400">
                      {token}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-[#E879F9] to-[#A855F7] text-white py-2.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedInsight(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gray-800 rounded-lg">
                {getIcon((selectedInsight as any).type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-2xl mb-2 text-white">
                  {selectedInsight.title}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    (selectedInsight as any).priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    (selectedInsight as any).priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    (selectedInsight as any).priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-700/50 text-gray-400'
                  }`}>
                    {(selectedInsight as any).priority} priority
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                    {(selectedInsight as any).type}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Analysis</h4>
              <p className="text-gray-300 leading-relaxed">{selectedInsight.description}</p>
            </div>

            {/* Metrics */}
            {(selectedInsight as any).metrics && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  {(selectedInsight as any).metrics.score !== undefined && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Health Score</div>
                      <div className={`text-2xl font-bold ${
                        (selectedInsight as any).metrics.score >= 70 ? 'text-success' : 
                        (selectedInsight as any).metrics.score >= 50 ? 'text-warning' : 'text-danger'
                      }`}>
                        {(selectedInsight as any).metrics.score}/100
                      </div>
                    </div>
                  )}
                  {(selectedInsight as any).metrics.change && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Performance</div>
                      <div className={`text-2xl font-bold ${
                        (selectedInsight as any).metrics.change.startsWith('+') ? 'text-success' : 'text-danger'
                      }`}>
                        {(selectedInsight as any).metrics.change}
                      </div>
                    </div>
                  )}
                  {(selectedInsight as any).metrics.exposure && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Exposure</div>
                      <div className="text-xl font-bold text-gray-300">{(selectedInsight as any).metrics.exposure}</div>
                    </div>
                  )}
                  {(selectedInsight as any).metrics.impact && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Impact</div>
                      <div className={`text-xl font-bold ${
                        (selectedInsight as any).metrics.impact === 'high' ? 'text-danger' :
                        (selectedInsight as any).metrics.impact === 'medium' ? 'text-warning' : 'text-success'
                      }`}>
                        {(selectedInsight as any).metrics.impact}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actionable Guidance */}
            {(selectedInsight as any).actionable && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-primary uppercase mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Recommended Action
                </h4>
                <p className="text-gray-200 font-medium">{(selectedInsight as any).actionable}</p>
              </div>
            )}

            {/* Related Tokens */}
            {(selectedInsight as any).relatedTokens && (selectedInsight as any).relatedTokens.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Related Assets</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedInsight as any).relatedTokens.map((token: string) => (
                    <span key={token} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedInsight(null)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedInsight(null);
                  generateInsightsMutation.mutate();
                }}
                className="btn-primary flex-1"
              >
                Refresh Insights
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

