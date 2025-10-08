"use client";

import { Wallet, Transaction } from '@/types';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWalletTransactions } from '@/lib/api';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface TransactionTableProps {
  transactions?: Transaction[];
  userId: string;
}

export default function TransactionTable({ transactions = [], userId }: TransactionTableProps) {
  const [limit, setLimit] = useState(20);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-success/10 text-success rounded">
            <CheckCircle2 className="w-3 h-3" />
            Success
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-warning/10 text-warning rounded">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-danger/10 text-danger rounded">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-success/10 text-success rounded">
            <CheckCircle2 className="w-3 h-3" />
            Success
          </span>
        );
    }
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

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
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const getAILabel = (aiLabel?: string) => {
    if (!aiLabel) return (
      <span className="flex items-center gap-1 text-xs text-gray-500">
        <AlertCircle className="w-3 h-3" />
        No label
      </span>
    );

    let colorClass = 'text-gray-400';

    // Determine color based on label content
    if (aiLabel.includes('🐋') || aiLabel.includes('Large')) {
      colorClass = 'text-blue-400';
    } else if (aiLabel.includes('📥') || aiLabel.includes('Received')) {
      colorClass = 'text-green-400';
    } else if (aiLabel.includes('📤') || aiLabel.includes('Sent')) {
      colorClass = 'text-orange-400';
    } else if (aiLabel.includes('🔄') || aiLabel.includes('Transfer')) {
      colorClass = 'text-purple-400';
    } else if (aiLabel.includes('🔁') || aiLabel.includes('Swap')) {
      colorClass = 'text-pink-400';
    } else if (aiLabel.includes('✅')) {
      colorClass = 'text-green-400';
    }

    return (
      <span className={`flex items-center gap-1 text-xs ${colorClass}`}>
        {aiLabel}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <button className="text-sm text-primary hover:underline">
          See all
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No transactions found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  Token
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  Action
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  AI Label
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: Transaction) => (
                <tr
                  key={tx.hash}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold">
                          {tx.fromToken?.substring(0, 2) || 'TX'}
                        </span>
                      </div>
                      <span className="font-medium text-sm">
                        {tx.fromToken || 'ETH'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-400">
                    {formatDate(tx.timestamp)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm capitalize">{tx.type}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-semibold text-sm">
                      ${tx.valueUSD.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="py-4 px-4">
                    {getAILabel(tx.aiLabel)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

