"use client";

import { AIInsight } from '@/types';
import { Sparkles, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { executeInsightAction, dismissInsight, generateInsights } from '@/lib/api';

interface AIInsightsSectionProps {
  insights: AIInsight[];
  userId: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function AIInsightsSection({ insights, userId, onRefresh, isLoading }: AIInsightsSectionProps) {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [actionResult, setActionResult] = useState<any>(null);
  const queryClient = useQueryClient();

  const dismissInsightMutation = useMutation({
    mutationFn: (insightId: string) => dismissInsight(insightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      onRefresh?.();
      setSelectedInsight(null);
      setActionResult(null);
    },
  });

  const executeInsightMutation = useMutation({
    mutationFn: (insightId: string) => executeInsightAction(insightId),
    onSuccess: (data) => {
      setActionResult(data);
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      onRefresh?.();
    },
  });

  const generateInsightsMutation = useMutation({
    mutationFn: () => generateInsights(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      onRefresh?.();
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
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
          <p className="text-gray-400 mb-4">No insights available yet</p>
          <button
            onClick={() => generateInsightsMutation.mutate()}
            className="btn-primary"
            disabled={generateInsightsMutation.isPending}
          >
            {generateInsightsMutation.isPending ? 'Generating...' : 'Generate Insights'}
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
          <button className="text-sm text-primary hover:underline">
            See all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.slice(0, 3).map((insight) => (
            <div
              key={insight.id}
              className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors cursor-pointer"
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-gray-900 rounded-lg">
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-2 leading-tight">
                    {insight.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className={`px-2 py-0.5 rounded ${
                      insight.confidence === 'High'
                        ? 'bg-success/10 text-success'
                        : insight.confidence === 'Medium'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {insight.confidence}
                    </span>
                    <span>•</span>
                    <span>{insight.riskLevel}</span>
                  </div>
                </div>
              </div>

              {insight.projectedGain && (
                <div className="text-success font-semibold text-sm mb-4">
                  {insight.projectedGain}
                </div>
              )}

              <button className="w-full bg-gradient-to-r from-[#E879F9] to-[#A855F7] text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                {insight.actionButton}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 bg-gray-800 rounded-lg">
                {getIcon(selectedInsight.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-2">
                  {selectedInsight.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className={`px-2 py-1 rounded ${
                    selectedInsight.confidence === 'High'
                      ? 'bg-success/10 text-success'
                      : selectedInsight.confidence === 'Medium'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {selectedInsight.confidence}
                  </span>
                  <span>•</span>
                  <span>{selectedInsight.riskLevel}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{selectedInsight.description}</p>

            {selectedInsight.projectedGain && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
                <div className="text-success font-semibold">
                  {selectedInsight.projectedGain}
                </div>
              </div>
            )}

            {actionResult ? (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2">Next Steps:</h4>
                {actionResult.instructions?.steps && (
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 mb-4">
                    {actionResult.instructions.steps.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                )}
                {actionResult.instructions?.protocols && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Recommended Protocols:</p>
                    {actionResult.instructions.protocols.map((protocol: any, idx: number) => (
                      <a
                        key={idx}
                        href={protocol.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-900 p-3 rounded hover:bg-gray-850 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{protocol.name}</span>
                          <span className="text-success">{protocol.apy}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedInsight(null);
                  setActionResult(null);
                }}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              {!actionResult && (
                <>
                  <button
                    onClick={() => dismissInsightMutation.mutate(selectedInsight.id)}
                    className="btn-secondary flex-1"
                    disabled={dismissInsightMutation.isPending}
                  >
                    {dismissInsightMutation.isPending ? 'Dismissing...' : 'Dismiss'}
                  </button>
                  <button
                    onClick={() => executeInsightMutation.mutate(selectedInsight.id)}
                    className="btn-primary flex-1"
                    disabled={executeInsightMutation.isPending}
                  >
                    {executeInsightMutation.isPending ? 'Loading...' : selectedInsight.actionButton}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

