"use client";

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Bot, CheckCircle2, Clock, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import AgentControls from '@/components/agent/AgentControls';
import ExecutionHistory from '@/components/agent/ExecutionHistory';
import PerformanceMetrics from '@/components/agent/PerformanceMetrics';
import PortfolioStatusCard from '@/components/agent/PortfolioStatusCard';
import AgentScheduleCard from '@/components/agent/AgentScheduleCard';
import AILearningCard from '@/components/agent/AILearningCard';

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
        
        {/* Left Control Panel */}
        <div className="ml-64 w-80 h-screen bg-[#0F0F0F] border-r border-gray-800 overflow-y-auto fixed left-64 top-0">
          <AgentControls agentActive={agentActive} onToggle={setAgentActive} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 ml-[336px] mr-96 p-8 pt-8">
          {/* Page Header */}
          <div className="mb-8 mt-0">
            <h1 className="text-3xl font-bold text-white mb-2">AI Agent Dashboard</h1>
            <p className="text-gray-400">Autonomous portfolio management based on your defined rules</p>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-[#7C3AED]/20 to-[#6D28D9]/20 border border-[#7C3AED]/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#7C3AED]/20 rounded-xl">
                <Bot className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">COMING SOON: Autonomous Execution</h3>
                <p className="text-gray-300">
                  Agent monitoring is active. Full autonomous execution launching in Phase 4 (January 2026)
                </p>
              </div>
            </div>
          </div>

          {/* Execution History */}
          <ExecutionHistory />

          {/* Performance Metrics */}
          <PerformanceMetrics />

          {/* Pending Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Awaiting Approval</h2>
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No pending actions</p>
              <p className="text-gray-600 text-sm mt-2">
                Approved actions will appear here before execution
              </p>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-96 fixed right-0 top-0 h-screen bg-[#0F0F0F] border-l border-gray-800 p-6 pt-8 overflow-y-auto">
          <PortfolioStatusCard />
          <AgentScheduleCard />
          <AILearningCard />
        </aside>
      </div>
    </div>
  );
}

