"use client";

import { usePrivy } from '@privy-io/react-auth';
import LeftSidebar from '@/components/layout/LeftSidebar';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function Home() {
  const { ready, authenticated, login: privyLogin } = usePrivy();

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to MyGuo</h1>
          <p className="text-gray-400 mb-8">AI-powered crypto portfolio management</p>
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
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#E879F9] to-[#A855F7] rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#E879F9] to-[#A855F7] bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Coming Soon
              </p>
            </div>
            
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-4">What's Coming?</h2>
              <ul className="text-left space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#E879F9] mr-3">✦</span>
                  <span>Comprehensive overview of all your crypto activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E879F9] mr-3">✦</span>
                  <span>Advanced analytics and insights across all features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E879F9] mr-3">✦</span>
                  <span>Unified control center for managing your digital assets</span>
                </li>
              </ul>
            </div>

            <div className="text-sm text-gray-500">
              In the meantime, explore:
              <div className="flex justify-center gap-4 mt-4">
                <a href="/portfolio" className="text-[#E879F9] hover:text-[#A855F7] transition-colors">
                  Portfolio Manager →
                </a>
                <a href="/agent" className="text-[#E879F9] hover:text-[#A855F7] transition-colors">
                  AI Agent →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
