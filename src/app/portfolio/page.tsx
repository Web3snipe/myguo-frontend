"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { login, getPortfolioSummary, getPortfolioHistory, getInsights, syncAllWallets } from '@/lib/api';
import { User, PortfolioSummary, PortfolioHistory, AIInsight } from '@/types';
import Header from '@/components/layout/Header';
import LeftSidebar from '@/components/layout/LeftSidebar';
import Sidebar from '@/components/layout/Sidebar';
import PortfolioChart from '@/components/portfolio/PortfolioChart';
import AIInsightsSection from '@/components/ai/AIInsightsSection';
import TransactionTable from '@/components/transactions/TransactionTable';
import LoadingScreen from '@/components/common/LoadingScreen';
import VirtualsEcosystemCard from '@/components/agent/VirtualsEcosystemCard';
import AutonomousAgentPanel from '@/components/agent/AutonomousAgentPanel';
import AgentActivityFeed from '@/components/agent/AgentActivityFeed';

export default function PortfolioPage() {
  const { ready, authenticated, user: privyUser, login: privyLogin } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'aggregate' | 'individual'>('aggregate');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1W');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Login user when authenticated
  useEffect(() => {
    if (authenticated && privyUser?.wallet?.address) {
      login(privyUser.wallet.address, privyUser.id).then((data) => {
        setUser(data.user);
        localStorage.setItem('userId', data.user.id);
      });
    }
  }, [authenticated, privyUser]);

  // Fetch portfolio data
  const { data: portfolio, isLoading: portfolioLoading, refetch: refetchPortfolio } = useQuery({
    queryKey: ['portfolio', user?.id, viewMode, selectedWallet],
    queryFn: async () => {
      if (!user?.id) return null;
      return await getPortfolioSummary(
        user.id, 
        viewMode === 'individual' && selectedWallet ? selectedWallet : undefined
      );
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Handle manual sync
  const handleSyncAll = async () => {
    if (!user?.id || isSyncing) return;
    
    setIsSyncing(true);
    setSyncMessage('Syncing wallets...');
    
    try {
      await syncAllWallets(user.id);
      setSyncMessage('🤖 Generating AI insights...');
      
      // Generate advanced AI insights
      const { generateAdvancedInsights } = await import('@/lib/api');
      await generateAdvancedInsights(user.id);
      
      setSyncMessage('✅ All wallets synced successfully!');
      await refetchPortfolio();
      await refetchHistory();
      setTimeout(() => setSyncMessage(''), 3000);
    } catch (error) {
      setSyncMessage('❌ Sync failed. Please try again.');
      setTimeout(() => setSyncMessage(''), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ['portfolio-history', user?.id, timePeriod, viewMode, selectedWallet],
    queryFn: async () => {
      if (!user?.id) return null;
      return await getPortfolioHistory(user.id, timePeriod);
    },
    enabled: !!user?.id,
  });

  const { data: insightsResponse, isLoading: insightsLoading, refetch: refetchInsights } = useQuery({
    queryKey: ['insights', user?.id, viewMode, selectedWallet],
    queryFn: async () => {
      if (!user?.id) return null;
      const walletIdParam = viewMode === 'individual' && selectedWallet ? selectedWallet : undefined;
      const data = await getInsights(user.id, walletIdParam);
      return data;
    },
    enabled: !!user?.id,
  });

  // Extract insights array from response
  const insights = insightsResponse?.insights || [];

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to MyGuo</h1>
          <p className="text-gray-400 mb-8">AI-powered onchain discovery and portfolio intelligence</p>
          <button
            onClick={privyLogin}
            className="btn-primary text-lg px-8 py-3"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!user || portfolioLoading) {
    return <LoadingScreen />;
  }

  // Handle portfolio data
  const currentValue = portfolio?.totalValue || 0;
  const walletCount = portfolio?.walletCount || user?.wallets?.length || 0;
  
  // Handle history data
  const historyChartData = historyData?.data || [];
  const changeValue = historyData?.change || 0;
  const changePercent = historyData?.changePercent || 0;

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        <Header
          user={user}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        <div className="flex">
          <main className="flex-1 p-6">
            {/* Sync Button & Toggle Switch */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Aggregate View</span>
                <button
                  onClick={() => {
                    const newMode = viewMode === 'aggregate' ? 'individual' : 'aggregate';
                    setViewMode(newMode);
                    if (newMode === 'individual' && user?.wallets && user.wallets.length > 0) {
                      setSelectedWallet(user.wallets[0].id);
                    } else {
                      setSelectedWallet(null);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    viewMode === 'aggregate' ? 'bg-gradient-to-r from-[#E879F9] to-[#A855F7]' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      viewMode === 'aggregate' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-400">Individual Wallet</span>

                {/* Wallet Selector for Individual Mode */}
                {viewMode === 'individual' && user?.wallets && user.wallets.length > 0 && (
                  <select
                    value={selectedWallet || ''}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                    className="ml-4 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm"
                  >
                    {user.wallets.map((wallet) => (
                      <option key={wallet.id} value={wallet.id}>
                        {wallet.address.substring(0, 6)}...{wallet.address.substring(38)} 
                        {wallet.aiTag ? ` (${wallet.aiTag})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Sync Button */}
              <button
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isSyncing ? 'Syncing...' : 'Sync All'}
              </button>
            </div>

            {/* Sync Message */}
            {syncMessage && (
              <div className={`mb-4 p-3 rounded-lg ${
                syncMessage.includes('✅') ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}>
                {syncMessage}
              </div>
            )}

            {/* Portfolio Summary */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm text-gray-400 mb-1">
                    Total Portfolio ({walletCount} {walletCount === 1 ? 'Wallet' : 'Wallets'})
                  </h2>
                  {historyData?.startDate && historyData?.endDate && (
                    <p className="text-xs text-gray-500">
                      {new Date(historyData.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(historyData.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline gap-4 mb-2">
                  <h1 className="text-4xl font-bold">
                    ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h1>
                  <span className={`text-xl font-semibold ${changeValue >= 0 ? 'text-success' : 'text-danger'}`}>
                    ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                  </span>
                </div>
                {changeValue !== 0 && (
                  <div className={`text-sm font-semibold ${changeValue >= 0 ? 'text-success' : 'text-danger'}`}>
                    {changeValue >= 0 ? '+' : ''}${Math.abs(changeValue).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Portfolio Chart */}
              <PortfolioChart
                data={historyChartData}
                timePeriod={timePeriod}
                onTimePeriodChange={setTimePeriod}
              />
            </div>

            {/* Virtuals Ecosystem Card - NEW */}
            {portfolio?.assets && (
              <VirtualsEcosystemCard
                tokens={portfolio.assets.map((a: any) => ({
                  symbol: a.symbol,
                  name: a.name,
                  balance: a.balance,
                  valueUSD: a.valueUSD,
                  change24h: Math.random() * 20 - 10, // Mock data for now
                }))}
                totalValue={currentValue}
                portfolioPercentage={100}
              />
            )}

            {/* Autonomous Agent Panel */}
            <AutonomousAgentPanel userId={user.id} />

            {/* AI Insights */}
            <AIInsightsSection 
              insights={insights} 
              userId={user.id}
              walletId={viewMode === 'individual' && selectedWallet ? selectedWallet : undefined}
              onRefresh={refetchInsights}
              isLoading={insightsLoading}
            />

            {/* Agent Activity Feed */}
            <AgentActivityFeed userId={user.id} limit={20} />

            {/* Transaction Table */}
            <TransactionTable 
              transactions={portfolio?.recentTransactions || []} 
              userId={user.id}
            />
          </main>

          <Sidebar
            wallets={user.wallets}
            portfolio={portfolio}
            userId={user.id}
            onRefresh={refetchPortfolio}
          />
        </div>
      </div>
    </div>
  );
}
// Refactor 5
// Refactor 15
// Refactor 25
// Refactor 35
