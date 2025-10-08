"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWallet } from '@/lib/api';

interface AddWalletModalProps {
  userId: string;
  currentWalletCount: number;
  onClose: () => void;
}

export default function AddWalletModal({
  userId,
  currentWalletCount,
  onClose,
}: AddWalletModalProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const addWalletMutation = useMutation({
    mutationFn: (address: string) => addWallet(userId, address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      onClose();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to add wallet');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError('Invalid wallet address format');
      return;
    }

    addWalletMutation.mutate(address);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add Wallet</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="input w-full"
              disabled={addWalletMutation.isPending}
            />
            {error && (
              <p className="text-danger text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-400">
              {currentWalletCount}/5 wallets connected
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={addWalletMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={
                addWalletMutation.isPending ||
                currentWalletCount >= 5 ||
                !address
              }
            >
              {addWalletMutation.isPending ? 'Adding...' : 'Add Wallet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

