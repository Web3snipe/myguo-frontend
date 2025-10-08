"use client";

import { Wallet, Transaction } from '@/types';
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getWalletTransactions } from '@/lib/api';

interface ActivityFeedProps {
  wallets: Wallet[];
}

export default function ActivityFeed({ wallets }: ActivityFeedProps) {
  // Fetch recent transactions from all wallets
  const primaryWallet = wallets.find((w) => w.isPrimary);

  const { data: transactionsData } = useQuery({
    queryKey: ['recent-transactions', primaryWallet?.address],
    queryFn: () =>
      primaryWallet
        ? getWalletTransactions(primaryWallet.address, 5)
        : Promise.resolve({ transactions: [] }),
    enabled: !!primaryWallet,
  });

  const transactions = transactionsData?.transactions || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'send':
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-danger" />;
      case 'receive':
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      default:
        return <RefreshCw className="w-4 h-4 text-primary" />;
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'send':
      case 'transfer':
        return 'Withdraw';
      case 'receive':
        return 'Deposit';
      case 'swap':
        return 'Swap';
      default:
        return 'Transaction';
    }
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      return `Today ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.slice(0, 3).map((tx: Transaction) => {
        const isPositive = tx.type === 'receive';

        return (
          <div
            key={tx.hash}
            className="bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-lg">
                  {getIcon(tx.type)}
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {getActionLabel(tx.type)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(tx.timestamp)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`font-semibold text-sm ${
                    isPositive ? 'text-success' : 'text-danger'
                  }`}
                >
                  {isPositive ? '+' : '-'}${tx.valueUSD.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

