"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import LoadingScreen from '@/components/common/LoadingScreen';
import DiscoveryFilters from '@/components/discovery/DiscoveryFilters';
import DiscoveryFeed from '@/components/discovery/DiscoveryFeed';
import DiscoveryInsights from '@/components/discovery/DiscoveryInsights';

export default function DiscoveryPage() {
  const { ready, authenticated, login: privyLogin } = usePrivy();
  const [filters, setFilters] = useState({
    riskTolerance: 'moderate',
    timeHorizon: 6,
    portfolioSize: 50,
    investmentThesis: 'ai-agents',
    signalFilters: {
      whaleActivity: false,
      technicalBreakouts: true,
      protocolUpdates: true,
      socialMomentum: false,
      newListings: false,
    },
    confidenceLevel: 65,
    marketCap: {
      large: true,
      mid: false,
      small: true,
      micro: false,
    },
  });

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to MyGuo</h1>
          <p className="text-gray-400 mb-8">AI-powered crypto discovery and insights</p>
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

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Left Sidebar - Navigation */}
      <LeftSidebar />
      
      {/* Discovery Filters Sidebar */}
      <DiscoveryFilters filters={filters} onFiltersChange={setFilters} />
      
      {/* Main Content Area - with proper margins for both sidebars */}
      <div className="ml-[564px] mr-[360px] min-h-screen">
        <DiscoveryFeed filters={filters} />
      </div>

      {/* Right Insights Sidebar */}
      <DiscoveryInsights />
    </div>
  );
}

