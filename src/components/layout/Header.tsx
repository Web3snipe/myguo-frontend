"use client";

import { usePrivy } from '@privy-io/react-auth';
import { Search, Bell, ChevronDown, TrendingUp, Wallet } from 'lucide-react';
import { User } from '@/types';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface HeaderProps {
  user: User;
  viewMode: 'aggregate' | 'individual';
  onViewModeChange: (mode: 'aggregate' | 'individual') => void;
}

interface SearchResult {
  type: 'token' | 'wallet' | 'address';
  address?: string;
  symbol?: string;
  name?: string;
  balance?: string;
  valueUSD?: number;
}

export default function Header({
  user,
  viewMode,
  onViewModeChange,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    const searchTokens = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      setShowResults(true);

      try {
        // Check if it's an Ethereum address
        if (/^0x[a-fA-F0-9]{40}$/.test(searchQuery)) {
          // Fetch token balances for the address
          const response = await axios.post(
            `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
            {
              id: 1,
              jsonrpc: '2.0',
              method: 'alchemy_getTokenBalances',
              params: [searchQuery, 'erc20'],
            }
          );

          const tokenBalances = response.data.result?.tokenBalances || [];
          const results: SearchResult[] = [{
            type: 'address',
            address: searchQuery,
            name: `${tokenBalances.length} tokens found`,
          }];

          // Fetch metadata for top 5 tokens with balance
          const tokensWithBalance = tokenBalances
            .filter((t: any) => t.tokenBalance && t.tokenBalance !== '0x0')
            .slice(0, 5);

          for (const token of tokensWithBalance) {
            try {
              const metadataResponse = await axios.post(
                `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
                {
                  id: 1,
                  jsonrpc: '2.0',
                  method: 'alchemy_getTokenMetadata',
                  params: [token.contractAddress],
                }
              );

              const metadata = metadataResponse.data.result;
              const balance = parseInt(token.tokenBalance, 16);
              const decimals = metadata.decimals || 18;
              const balanceFormatted = (balance / Math.pow(10, decimals)).toFixed(6);

              results.push({
                type: 'token',
                address: token.contractAddress,
                symbol: metadata.symbol || 'UNKNOWN',
                name: metadata.name || 'Unknown Token',
                balance: balanceFormatted,
              });
            } catch (error) {
              console.error('Error fetching token metadata:', error);
            }
          }

          setSearchResults(results);
        } else {
          // Search in user's existing wallets and assets
          const matchingWallets = user.wallets?.filter(w => 
            w.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.aiTag?.toLowerCase().includes(searchQuery.toLowerCase())
          ) || [];

          const results: SearchResult[] = matchingWallets.map(w => ({
            type: 'wallet' as const,
            address: w.address,
            name: w.aiTag || 'Wallet',
            valueUSD: w.totalValueUSD,
          }));

          setSearchResults(results);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchTokens, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, user.wallets]);

  return (
    <header className="bg-[#0F0F0F] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-white">Overview</span>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md mx-8" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search tokens, wallets, addresses"
            className="input w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
          />
          
          {/* Search Results Dropdown */}
          {showResults && searchQuery.length >= 3 && (
            <div className="absolute top-full mt-2 w-full bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center text-gray-400">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 hover:bg-gray-800 transition-colors flex items-center gap-3 text-left"
                      onClick={() => {
                        if ((result.type === 'address' || result.type === 'token') && result.address) {
                          // Copy address to clipboard
                          navigator.clipboard.writeText(result.address);
                          if (result.type === 'address') {
                            // Keep showing results for token breakdown
                            return;
                          } else {
                            setSearchQuery('');
                            setShowResults(false);
                          }
                        }
                      }}
                    >
                      {result.type === 'wallet' ? (
                        <>
                          <div className="w-10 h-10 bg-gradient-to-br from-[#E879F9]/20 to-[#A855F7]/20 rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-[#E879F9]" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-gray-400">{formatAddress(result.address || '')}</div>
                          </div>
                          {result.valueUSD !== undefined && (
                            <div className="text-sm font-semibold">
                              ${result.valueUSD.toLocaleString()}
                            </div>
                          )}
                        </>
                      ) : result.type === 'token' ? (
                        <>
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                            <div className="text-xs font-bold text-green-400">
                              {result.symbol?.substring(0, 3)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{result.symbol}</div>
                            <div className="text-sm text-gray-400">{result.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">{result.balance}</div>
                            <div className="text-xs text-gray-500">Balance</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Ethereum Address</div>
                            <div className="text-sm text-gray-400">{result.address}</div>
                            {result.name && (
                              <div className="text-xs text-gray-500 mt-1">{result.name}</div>
                            )}
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-xl p-4 z-50">
                <h3 className="font-semibold mb-3">Notifications</h3>
                <p className="text-sm text-gray-400">No new notifications</p>
              </div>
            )}
          </div>

          {/* User Menu */}
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-300">
                {formatAddress(user.primaryWalletAddress)}
              </div>
              <div className="text-xs text-gray-500">Connected</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}

