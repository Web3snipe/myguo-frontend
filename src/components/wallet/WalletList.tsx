"use client";

import { Wallet as WalletType } from '@/types';
import { Wallet, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeWallet } from '@/lib/api';

interface WalletListProps {
  wallets: WalletType[];
  userId: string;
  onRefresh?: () => void;
}

export default function WalletList({ wallets, userId, onRefresh }: WalletListProps) {
  const queryClient = useQueryClient();

  const removeWalletMutation = useMutation({
    mutationFn: (walletId: string) => removeWallet(walletId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      onRefresh?.();
    },
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletTypeLabel = (tag?: string) => {
    if (!tag) return 'Portfolio Holder';
    return tag;
  };

  return (
    <div className="space-y-3">
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-r from-[#E879F9]/20 to-[#A855F7]/20 rounded-lg">
                <Wallet className="w-5 h-5 text-[#E879F9]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {formatAddress(wallet.address)}
                  </span>
                  {wallet.isPrimary && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {getWalletTypeLabel(wallet.aiTag)}
                </p>
                <p className="text-sm font-semibold mt-2">
                  ${wallet.totalValueUSD.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            {!wallet.isPrimary && (
              <button
                onClick={() => removeWalletMutation.mutate(wallet.id)}
                className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-danger"
                disabled={removeWalletMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

