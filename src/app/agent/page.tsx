"use client";

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Bot, CheckCircle2, Clock, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import MultiAgentTeam from '@/components/agent/MultiAgentTeam';
import PortfolioStatusCard from '@/components/agent/PortfolioStatusCard';
import PerformanceMetrics from '@/components/agent/PerformanceMetrics';

export default function AgentDashboard() {
  const { authenticated, login } = usePrivy();
  const [agentActive, setAgentActive] = useState(false);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-gradient-to-br from-[#7C3AED]/20 to-[#6D28D9]/20 border border-[#7C3AED]/30 rounded-3xl inline-block mb-8">
            <Bot className="w-20 h-20 text-[#7C3AED]" />
          </div>
          <h2 className="text-3xl font-bold mb-4">AI Agent Dashboard</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            Connect your wallet to access autonomous portfolio management with advanced AI insights
          </p>
          <button
            onClick={login}
            className="px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="flex">
        <LeftSidebar />
        
        {/* Main Content */}
        <main className="flex-1 ml-64 mr-96 p-8 pt-8">
          {/* Page Header */}
          <div className="mb-8 mt-0">
            <h1 className="text-3xl font-bold text-white mb-2">🤖 Multi-Agent System</h1>
            <p className="text-gray-400">4 AI agents collaborating to manage your portfolio autonomously</p>
          </div>

          {/* Multi-Agent Team Component */}
          <MultiAgentTeam />

          {/* Performance Metrics */}
          <div className="mt-8">
            <PerformanceMetrics />
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-96 fixed right-0 top-0 h-screen bg-[#0F0F0F] border-l border-gray-800 p-6 pt-8 overflow-y-auto">
          <PortfolioStatusCard />
          
          {/* Team Benefits */}
          <div className="mt-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-5">
            <h3 className="text-lg font-bold text-white mb-3">Why Multi-Agent?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Better Decisions</p>
                  <p className="text-xs text-gray-400">Multiple perspectives reduce risk</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Specialization</p>
                  <p className="text-xs text-gray-400">Each agent masters one skill</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Consensus</p>
                  <p className="text-xs text-gray-400">Actions require team approval</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Enhance 7
// Enhance 17
// Enhance 27
// Enhance 37
// Enhance 47
// Enhance 57
// Enhance 67
