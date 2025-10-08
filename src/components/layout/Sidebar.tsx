"use client";

import { Wallet, PortfolioSummary } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddWalletModal from '@/components/wallet/AddWalletModal';
import WalletList from '@/components/wallet/WalletList';
import PortfolioTokenList from '@/components/portfolio/PortfolioTokenList';
import ActivityFeed from '@/components/activity/ActivityFeed';

interface SidebarProps {
  wallets: Wallet[];
  portfolio: PortfolioSummary | undefined;
  userId: string;
  onRefresh?: () => void;
}

export default function Sidebar({ wallets, portfolio, userId, onRefresh }: SidebarProps) {
  const [showAddWallet, setShowAddWallet] = useState(false);

  return (
    <>
      <aside className="w-96 bg-[#0F0F0F] border-l border-gray-800 p-6 overflow-y-auto h-screen">
        {/* Your Wallets */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Your Wallet</h2>
            {wallets.length < 5 && (
              <button
                onClick={() => setShowAddWallet(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-[#E879F9] to-[#A855F7] text-white text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Wallet</span>
              </button>
            )}
          </div>
          <WalletList wallets={wallets} userId={userId} onRefresh={onRefresh} />
          <p className="text-sm text-gray-500 mt-2">
            {wallets.length}/5 wallets connected
          </p>
        </div>

        {/* My Portfolio */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Portfolio</h2>
            <button className="text-sm text-primary hover:underline">
              See all
            </button>
          </div>
          <PortfolioTokenList assets={portfolio?.topAssets || []} />
        </div>

        {/* Last Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Last Activity</h2>
            <button className="text-sm text-primary hover:underline">
              See all
            </button>
          </div>
          <ActivityFeed wallets={wallets} />
        </div>
      </aside>

      {/* Add Wallet Modal */}
      {showAddWallet && (
        <AddWalletModal
          userId={userId}
          currentWalletCount={wallets.length}
          onClose={() => {
            setShowAddWallet(false);
            onRefresh?.();
          }}
        />
      )}
    </>
  );
}

