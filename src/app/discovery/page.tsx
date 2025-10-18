"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import LoadingScreen from '@/components/common/LoadingScreen';
import DiscoveryFeed from '@/components/discovery/DiscoveryFeed';
import DiscoveryInsights from '@/components/discovery/DiscoveryInsights';
import DiscoveryPreferencesModal from '@/components/discovery/DiscoveryPreferencesModal';

export default function DiscoveryPage() {
  const { ready, authenticated, login: privyLogin } = usePrivy();
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [filters, setFilters] = useState({
    riskTolerance: 'moderate',
    timeHorizon: 6,
    portfolioSize: 10,
    investmentThesis: [],
    signalFilters: {
      whaleActivity: false,
      technicalBreakouts: false,
      protocolUpdates: false,
      socialMomentum: false,
      newListings: false,
    },
    confidenceLevel: 50,
    marketCap: {
      large: false,
      mid: false,
      small: false,
      micro: false,
    },
  });

  // Check if user has set preferences before
  useEffect(() => {
    if (authenticated) {
      const savedPreferences = localStorage.getItem('discoveryPreferences');
      if (!savedPreferences) {
        // No preferences set - show modal
        setShowPreferencesModal(true);
        setHasPreferences(false);
      } else {
        // Has preferences - load them
        setFilters(JSON.parse(savedPreferences));
        setHasPreferences(true);
      }
    }
  }, [authenticated]);

  const handlePreferencesComplete = (preferences: any) => {
    setFilters(preferences);
    localStorage.setItem('discoveryPreferences', JSON.stringify(preferences));
    setShowPreferencesModal(false);
    setHasPreferences(true);
  };

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
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Preferences Modal - Shows on first visit */}
      <DiscoveryPreferencesModal
        isOpen={showPreferencesModal}
        onComplete={handlePreferencesComplete}
      />

      {/* Left Sidebar - Navigation */}
      <LeftSidebar />
      
      {/* Main Content Area - Clean, no filter sidebar */}
      <div className="flex-1 ml-64 mr-[360px]">
        {/* Header with Edit Preferences Button */}
        <div className="sticky top-0 bg-[#0F0F0F] border-b border-gray-800 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Discovery</h1>
            <p className="text-sm text-gray-400">
              AI-curated opportunities based on your preferences
            </p>
          </div>
          <button
            onClick={() => setShowPreferencesModal(true)}
            className="px-4 py-2 bg-[#1A1A1A] border border-gray-700 text-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all text-sm font-medium"
          >
            Edit Preferences
          </button>
        </div>

        {/* Discovery Feed - Only show if preferences are set */}
        {hasPreferences ? (
          <DiscoveryFeed filters={filters} />
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Set Your Preferences</h3>
              <p className="text-gray-400 mb-6">
                Configure your discovery preferences to get AI-powered personalized token recommendations
              </p>
              <button
                onClick={() => setShowPreferencesModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all"
              >
                Set Preferences Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Insights Sidebar - Market Intelligence */}
      <DiscoveryInsights />
    </div>
  );
}

// Optimize 6
// Optimize 16
// Optimize 26
// Optimize 36
// Optimize 46
// Optimize 56
// Optimize 66
