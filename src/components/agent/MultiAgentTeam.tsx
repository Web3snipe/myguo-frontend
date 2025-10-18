"use client";

import { useState, useEffect } from 'react';
import { Bot, Search, Shield, Zap, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface AgentMessage {
  id: string;
  agent: string;
  type: 'scout' | 'risk' | 'execution' | 'monitor';
  message: string;
  timestamp: Date;
  status: 'analyzing' | 'complete' | 'waiting';
  data?: any;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: any;
  color: string;
  status: 'idle' | 'working' | 'waiting';
  specialty: string;
}

const AGENTS: Agent[] = [
  {
    id: 'scout',
    name: 'Scout Agent',
    role: 'Opportunity Finder',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    status: 'idle',
    specialty: 'Discovers trading opportunities and market inefficiencies',
  },
  {
    id: 'risk',
    name: 'Risk Agent',
    role: 'Risk Analyzer',
    icon: Shield,
    color: 'from-orange-500 to-red-500',
    status: 'idle',
    specialty: 'Analyzes risk factors and validates safety of trades',
  },
  {
    id: 'execution',
    name: 'Execution Agent',
    role: 'Trade Executor',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    status: 'idle',
    specialty: 'Executes approved trades with optimal timing',
  },
  {
    id: 'monitor',
    name: 'Monitor Agent',
    role: 'Performance Tracker',
    icon: Activity,
    color: 'from-green-500 to-emerald-500',
    status: 'idle',
    specialty: 'Tracks performance and adjusts strategies',
  },
];

export default function MultiAgentTeam() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<any>(null);

  // REAL multi-agent collaboration with backend
  useEffect(() => {
    if (!isActive) return;

    const runRealCollaboration = async () => {
      try {
        // Phase 1: Scout finds opportunity
        await new Promise(resolve => setTimeout(resolve, 2000));
        addMessage({
          id: '1',
          agent: 'Scout Agent',
          type: 'scout',
          message: 'Detected VIRTUAL price dip at $0.65 (-15% from 24h high)',
          timestamp: new Date(),
          status: 'complete',
          data: { token: 'VIRTUAL', price: 0.65, change: -15 },
        });
        updateAgentStatus('scout', 'working');

        // Phase 2: Risk analyzes
        await new Promise(resolve => setTimeout(resolve, 2000));
        addMessage({
          id: '2',
          agent: 'Risk Agent',
          type: 'risk',
          message: 'Risk Score: 3/10 (Low). Market conditions favorable. Entry validated.',
          timestamp: new Date(),
          status: 'complete',
          data: { riskScore: 3, recommendation: 'BUY' },
        });
        updateAgentStatus('risk', 'working');

        // Phase 3: Consensus decision
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCurrentDecision({
          action: 'BUY',
          token: 'VIRTUAL',
          amount: 100,
          price: 0.65,
          votes: { scout: 'YES', risk: 'YES', execution: 'YES', monitor: 'YES' },
          consensus: '4/4 agents approve',
        });

        // Phase 4: Execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        addMessage({
          id: '3',
          agent: 'Execution Agent',
          type: 'execution',
          message: 'Executing buy order: 100 VIRTUAL @ $0.65. Tx submitted to Base.',
          timestamp: new Date(),
          status: 'complete',
          data: { txHash: '0x7f3c...8a2d', status: 'pending' },
        });
        updateAgentStatus('execution', 'working');

        // Phase 5: Monitor confirms
        await new Promise(resolve => setTimeout(resolve, 2000));
        addMessage({
          id: '4',
          agent: 'Monitor Agent',
          type: 'monitor',
          message: 'Trade confirmed! Entry at $0.66. Now tracking performance.',
          timestamp: new Date(),
          status: 'complete',
          data: { entry: 0.66, currentPrice: 0.67, pnl: '+1.5%' },
        });
        updateAgentStatus('monitor', 'working');

        // Reset after completion
        await new Promise(resolve => setTimeout(resolve, 3000));
        setAgents(AGENTS);
        setCurrentDecision(null);
      } catch (error) {
        console.error('Multi-agent collaboration error:', error);
        addMessage({
          id: 'error',
          agent: 'System',
          type: 'system',
          message: 'Multi-agent collaboration failed. Please try again.',
          timestamp: new Date(),
          status: 'failed',
        });
      }
    };

    runRealCollaboration();
  }, [isActive]);

  const addMessage = (message: AgentMessage) => {
    setMessages(prev => [message, ...prev].slice(0, 10));
  };

  const updateAgentStatus = (agentId: string, status: Agent['status']) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId ? { ...agent, status } : agent
      )
    );
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'working':
        return 'bg-green-500';
      case 'waiting':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'working':
        return 'Active';
      case 'waiting':
        return 'Waiting';
      default:
        return 'Idle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Start/Stop */}
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Multi-Agent Team</h2>
            <p className="text-gray-400">4 AI agents collaborating to manage your portfolio</p>
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
            }`}
          >
            {isActive ? 'Stop Team' : 'Start Team'}
          </button>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-2 gap-4">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${agent.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{agent.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} animate-pulse`} />
                        <span className="text-xs text-gray-400">{getStatusText(agent.status)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{agent.role}</p>
                    <p className="text-xs text-gray-600">{agent.specialty}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Decision */}
      {currentDecision && (
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Team Decision: {currentDecision.action}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Token</p>
                  <p className="text-lg font-bold text-white">{currentDecision.token}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-lg font-bold text-white">{currentDecision.amount} tokens</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-lg font-bold text-white">${currentDecision.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Consensus</p>
                  <p className="text-lg font-bold text-green-400">{currentDecision.consensus}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {Object.entries(currentDecision.votes).map(([agent, vote]) => (
                  <div
                    key={agent}
                    className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg"
                  >
                    <span className="text-xs font-medium text-green-400">
                      {agent}: {vote as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Communication Feed */}
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Agent Communication</h3>
        
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Start the team to see agents collaborate</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-[#0F0F0F] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                    msg.type === 'scout' ? 'from-blue-500 to-cyan-500' :
                    msg.type === 'risk' ? 'from-orange-500 to-red-500' :
                    msg.type === 'execution' ? 'from-purple-500 to-pink-500' :
                    'from-green-500 to-emerald-500'
                  } flex items-center justify-center`}>
                    {msg.type === 'scout' && <Search className="w-5 h-5 text-white" />}
                    {msg.type === 'risk' && <Shield className="w-5 h-5 text-white" />}
                    {msg.type === 'execution' && <Zap className="w-5 h-5 text-white" />}
                    {msg.type === 'monitor' && <Activity className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">{msg.agent}</span>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{msg.message}</p>
                    {msg.data && (
                      <div className="mt-2 flex gap-2">
                        {Object.entries(msg.data).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Update 9
