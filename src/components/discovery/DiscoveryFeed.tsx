"use client";

import { TrendingUp, AlertTriangle, Target, Clock, Save, Eye, Info, Bell, BellRing } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveDiscovery, addToWatchlist } from '@/lib/api';
import { usePrivy } from '@privy-io/react-auth';

interface DiscoveryFeedProps {
  filters: any;
}

interface DiscoveryItem {
  tokenId: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
  liquidity?: number;
  confidence: string;
  overallScore: number;
  recommendation?: string;
  riskLevel?: string;
  matchScore?: number;
  categories?: string[];
  tags?: string[];
  reasons?: string[];
  insights?: string;
  risks?: string;
  catalysts?: string[];
  shortTermOutlook?: string;
  whaleActivity?: number;
  analyzedAt?: Date;
  // AI-generated narratives (TrueNorth-style)
  aiNarrative?: string;
  strategicGuidance?: string;
  marketContext?: string;
  sources?: string[];
  isNew?: boolean;
  hasVolSpike?: boolean;
  dexUrl?: string;
}

export default function DiscoveryFeed({ filters }: DiscoveryFeedProps) {
  const { user } = usePrivy();
  const [discoveries, setDiscoveries] = useState<DiscoveryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingToken, setSavingToken] = useState<string | null>(null);
  const [watchlistToken, setWatchlistToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Auto-fetch when filters change OR on first load after preferences are set
  useEffect(() => {
    // Auto-fetch on first load if preferences exist
    if (!discoveries.length && !loading && !error && filters.investmentThesis) {
      console.log('🚀 Auto-fetching discoveries based on saved preferences...');
      fetchDiscoveries();
    }
    // Also fetch when Submit is clicked (filters._refresh is updated)
    else if (filters._refresh) {
      fetchDiscoveries();
    }
  }, [filters]);

  const fetchDiscoveries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/discovery/feed`,
        {
          userPreferences: {
            riskTolerance: filters.riskTolerance,
            investmentThesis: filters.investmentThesis,
            timeHorizon: filters.timeHorizon,
            confidenceLevel: filters.confidenceLevel,
          },
          limit: 10,
        }
      );

      if (response.data.success) {
        const mappedDiscoveries = response.data.discoveries.map((token: any) => ({
          tokenId: token.id,
          name: token.name,
          symbol: token.symbol,
          price: token.price,
          priceChange24h: token.priceChange24h,
          volume24h: token.volume24h,
          marketCap: token.marketCap,
          liquidity: token.liquidity,
          confidence: token.confidence,
          overallScore: token.overallScore,
          tags: token.tags || [],
          category: token.category,
          aiNarrative: token.aiNarrative,
          strategicGuidance: token.strategicGuidance,
          marketContext: token.marketContext,
          analyzedAt: new Date(),
        }));
        setDiscoveries(mappedDiscoveries);
      }
    } catch (err: any) {
      console.error('Error fetching discoveries:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      setError(`Unable to fetch discoveries: ${errorMsg}`);
      setDiscoveries([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Save button
  const handleSave = async (item: DiscoveryItem) => {
    if (!user?.id) {
      alert('Please connect your wallet first');
      return;
    }

    setSavingToken(item.tokenId);
    try {
      await saveDiscovery(user.id, {
        id: item.tokenId,
        symbol: item.symbol,
        name: item.name,
        price: item.price,
        category: (item as any).category,
        aiNarrative: item.aiNarrative,
      });
      alert(`✅ ${item.symbol} saved successfully!`);
    } catch (error) {
      console.error('Save error:', error);
      alert(`❌ Failed to save ${item.symbol}`);
    } finally {
      setSavingToken(null);
    }
  };

  // Handle Watchlist button
  const handleWatchlist = async (item: DiscoveryItem) => {
    if (!user?.id) {
      alert('Please connect your wallet first');
      return;
    }

    setWatchlistToken(item.tokenId);
    try {
      await addToWatchlist(user.id, {
        id: item.tokenId,
        symbol: item.symbol,
        name: item.name,
      });
      alert(`✅ ${item.symbol} added to watchlist!`);
    } catch (error) {
      console.error('Watchlist error:', error);
      alert(`❌ Failed to add ${item.symbol} to watchlist`);
    } finally {
      setWatchlistToken(null);
    }
  };

  // Handle Details button
  const handleDetails = (item: DiscoveryItem) => {
    // Show detailed modal with full analysis
    alert(`📊 Details for ${item.symbol}\n\nPrice: $${item.price.toFixed(item.price < 1 ? 6 : 2)}\n24H Change: ${item.priceChange24h?.toFixed(2)}%\nVolume: $${((item.volume24h || 0) / 1_000_000).toFixed(2)}M\nScore: ${item.overallScore}/100\n\n${item.aiNarrative}`);
  };

  // Generate smart notifications based on discoveries
  const generateNotifications = (discoveries: DiscoveryItem[]) => {
    const newNotifications: any[] = [];
    
    discoveries.forEach((item, index) => {
      // 🚨 HIGH PRIORITY ALERTS
      if (item.category === 'AI_AGENT' && item.overallScore >= 95) {
        newNotifications.push({
          id: `ai-agent-${item.tokenId}`,
          type: 'high-priority',
          title: '🤖 New AI Agent Alert',
          message: `${item.symbol} - ${item.name} detected with ${item.overallScore}/100 score`,
          timestamp: new Date(),
          token: item,
        });
      }

      // 📈 MOMENTUM ALERTS
      if (Math.abs(item.priceChange24h || 0) > 20) {
        newNotifications.push({
          id: `momentum-${item.tokenId}`,
          type: 'momentum',
          title: '📈 Extreme Price Movement',
          message: `${item.symbol} ${item.priceChange24h! > 0 ? 'pumped' : 'dumped'} ${Math.abs(item.priceChange24h!).toFixed(1)}% in 24h`,
          timestamp: new Date(),
          token: item,
        });
      }

      // 🔥 VOLUME SPIKES
      if (item.volume24h && item.volume24h > 50_000_000) {
        newNotifications.push({
          id: `volume-${item.tokenId}`,
          type: 'volume',
          title: '🔥 High Volume Alert',
          message: `${item.symbol} trading at $${(item.volume24h / 1_000_000).toFixed(1)}M volume`,
          timestamp: new Date(),
          token: item,
        });
      }

      // 🎯 PERSONALIZED ALERTS
      if (item.overallScore >= 90 && filters.investmentThesis?.includes('ai-agents')) {
        newNotifications.push({
          id: `personalized-${item.tokenId}`,
          type: 'personalized',
          title: '🎯 Perfect Match Found',
          message: `${item.symbol} matches your AI agent preferences with ${item.overallScore}/100 score`,
          timestamp: new Date(),
          token: item,
        });
      }
    });

    // Limit to 5 most recent notifications
    const sortedNotifications = newNotifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);

    setNotifications(sortedNotifications);
    setNotificationCount(sortedNotifications.length);
  };

  // Update notifications when discoveries change
  useEffect(() => {
    if (discoveries.length > 0) {
      generateNotifications(discoveries);
      
      // Show browser notifications for high-priority alerts
      const highPriorityNotifications = notifications.filter(n => n.type === 'high-priority');
      highPriorityNotifications.forEach(notification => {
        showBrowserNotification(notification);
      });
    }
  }, [discoveries, filters]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Show browser notification for high priority alerts
  const showBrowserNotification = (notification: any) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/myguo-logo-new.png',
        tag: notification.id,
      });
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Low':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    const r = risk.toLowerCase();
    if (r.includes('high') || r.includes('extreme')) return 'text-red-400';
    if (r.includes('medium') || r.includes('moderate')) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1_000_000_000) return `$${(cap / 1_000_000_000).toFixed(2)}B`;
    if (cap >= 1_000_000) return `$${(cap / 1_000_000).toFixed(2)}M`;
    return `$${(cap / 1_000).toFixed(2)}K`;
  };

  if (loading) {
    return (
      <div className="py-12 px-6">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-6"></div>
            <p className="text-gray-300 text-lg font-medium">Analyzing Market Opportunities...</p>
            <p className="text-gray-500 text-sm mt-2">Scanning 1000+ tokens across multiple chains</p>
          </div>
        </div>
      </div>
    );
  }

  const thesisArray = Array.isArray(filters.investmentThesis) 
    ? filters.investmentThesis 
    : [filters.investmentThesis];

  return (
    <div className="py-8 px-6 max-w-6xl mx-auto">
      {/* Professional Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Discovery Feed
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              AI-powered alpha opportunities tailored to your strategy
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-purple-500 transition-all"
              >
                {notificationCount > 0 ? (
                  <BellRing className="w-5 h-5 text-purple-400" />
                ) : (
                  <Bell className="w-5 h-5 text-gray-400" />
                )}
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-14 w-80 bg-[#1A1A1A] border border-gray-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-800">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-purple-400" />
                      Smart Alerts ({notificationCount})
                    </h3>
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No alerts yet</p>
                      <p className="text-gray-500 text-xs mt-1">We'll notify you of important opportunities</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-800">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
                          onClick={() => {
                            // Scroll to the token in the feed
                            const tokenElement = document.querySelector(`[data-token-id="${notification.token.tokenId}"]`);
                            if (tokenElement) {
                              tokenElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'high-priority' ? 'bg-red-500' :
                              notification.type === 'momentum' ? 'bg-orange-500' :
                              notification.type === 'volume' ? 'bg-blue-500' :
                              'bg-purple-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm">{notification.title}</p>
                              <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {discoveries.length > 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-lg font-semibold text-purple-400">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{discoveries.length}</div>
              <div className="text-xs text-gray-400">Opportunities Found</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-gray-700"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white capitalize">{filters.riskTolerance}</div>
              <div className="text-xs text-gray-400">Risk Profile</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-gray-700"></div>
          
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">Focus Areas</div>
            <div className="flex flex-wrap gap-2">
              {thesisArray.slice(0, 3).map((thesis: string, idx: number) => (
                <span key={idx} className="text-xs px-2 py-1 bg-purple-500/10 text-purple-300 rounded border border-purple-500/20">
                  {thesis.replace('-', ' ').toUpperCase()}
                </span>
              ))}
              {thesisArray.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
                  +{thesisArray.length - 3} more
              </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5 mb-8 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-red-400 font-semibold mb-1">Connection Error</h4>
            <p className="text-red-300/80 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-2">
              Ensure backend is running on port 3002 and environment variables are set correctly.
            </p>
          </div>
        </div>
      )}

      {/* Empty State - Before First Generation */}
      {!loading && discoveries.length === 0 && !error && (
        <div className="flex items-center justify-center py-32">
          <div className="text-center max-w-2xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-8 border-4 border-purple-500/30">
              <TrendingUp className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Your AI Discovery Engine is Ready</h3>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Based on your preferences, our AI will scan <span className="text-purple-400 font-semibold">1000+ tokens</span> across <span className="text-pink-400 font-semibold">Solana, Base, Ethereum, and BSC</span> to find opportunities that match your exact investment thesis, risk tolerance, and timeframe.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/30 rounded-xl p-5 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-purple-300 font-semibold text-sm">Multi-Chain Coverage</span>
                </div>
                <p className="text-gray-400 text-xs">Solana, Base, Ethereum, BSC</p>
              </div>
              <div className="bg-gradient-to-br from-pink-900/30 to-pink-900/10 border border-pink-500/30 rounded-xl p-5 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <span className="text-pink-300 font-semibold text-sm">Real-Time On-Chain Data</span>
                </div>
                <p className="text-gray-400 text-xs">CoinGecko + DEXScreener + Helius</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30 rounded-xl p-5 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-blue-300 font-semibold text-sm">AI-Powered Scoring</span>
                </div>
                <p className="text-gray-400 text-xs">Claude 3.5 Sonnet analysis</p>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/30 rounded-xl p-5 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-300 font-semibold text-sm">Personalized Insights</span>
                </div>
                <p className="text-gray-400 text-xs">Tailored to your risk & thesis</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic">
              Discoveries are auto-generated based on your saved preferences. Click "Edit Preferences" above to adjust your criteria.
            </p>
          </div>
        </div>
      )}

      {/* Discovery Cards */}
      {discoveries.length === 0 ? (
        <div className="text-center py-32 px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Target className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Opportunities Found</h3>
          <p className="text-gray-400 text-lg mb-2">No tokens match your current criteria.</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Try adjusting your filters, lowering confidence threshold, or selecting different investment themes.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {discoveries.map((item, index) => (
            <div
              key={item.tokenId}
              data-token-id={item.tokenId}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#151515] border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 shadow-xl hover:shadow-purple-500/10"
            >
              {/* Card Header - Cleaner, More Compact */}
              <div className="p-5 border-b border-gray-800/50">
                <div className="flex items-start justify-between gap-4">
                  {/* Token Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-xl font-black">
                        {item.symbol.substring(0, 2)}
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white mb-0.5">{item.name}</h2>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 font-mono">${item.symbol}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Stats - More Compact */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-white mb-0.5">
                      {formatPrice(item.price)}
                    </div>
                    {item.priceChange24h !== undefined && (
                      <div className={`text-sm font-semibold ${item.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.priceChange24h >= 0 ? '+' : ''}{item.priceChange24h.toFixed(2)}% 24h
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.marketCap ? formatMarketCap(item.marketCap) + ' MC' : 'Micro-cap'}
                    </div>
                  </div>
                </div>

                {/* Metrics Row - Smaller, More Compact */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getConfidenceColor(item.confidence)}`}>
                    {item.confidence}
                  </span>
                  <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full font-semibold border border-purple-500/30">
                    {item.overallScore}/100
                  </span>
                  {item.volume24h && (
                    <span className="text-xs px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full font-medium border border-blue-500/20">
                      Vol: ${typeof item.volume24h === 'number' ? (item.volume24h / 1000).toFixed(0) + 'k' : 'N/A'}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body - More Compact */}
              <div className="p-5 space-y-4">
                {/* AI Analysis Tags - Smaller */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-0.5 bg-purple-500/10 text-purple-300 rounded border border-purple-500/20 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Market Context - Compact */}
                {item.marketContext && (
                  <div className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/30 rounded-lg">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                      Market Context
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.marketContext}</p>
                  </div>
                )}

                {/* AI Narrative - Compact */}
                <div className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/30 rounded-lg">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-purple-400"></div>
                    Alpha Insight
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.aiNarrative || item.insights || 'Analyzing opportunity...'}
                  </p>
                </div>

                {/* Strategic Guidance - Compact */}
                {item.strategicGuidance && (
                  <div className="p-4 bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/30 rounded-lg">
                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-green-400"></div>
                      Action Plan
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed font-medium">{item.strategicGuidance}</p>
                  </div>
                )}
              </div>

              {/* Card Footer - Functional Buttons */}
              <div className="p-4 border-t border-gray-800/50 bg-gray-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleSave(item)}
                    disabled={savingToken === item.tokenId}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Save className="w-3 h-3" />
                    {savingToken === item.tokenId ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => handleWatchlist(item)}
                    disabled={watchlistToken === item.tokenId}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-semibold transition-colors border border-gray-700 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Eye className="w-3 h-3" />
                    {watchlistToken === item.tokenId ? 'Adding...' : 'Watchlist'}
                  </button>
                  <button 
                    onClick={() => handleDetails(item)}
                    className="px-4 py-2 bg-transparent hover:bg-gray-800 rounded-lg text-xs font-semibold transition-colors border border-gray-700 text-gray-400 hover:text-white flex items-center gap-1.5"
                  >
                    <Info className="w-3 h-3" />
                    Details
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.analyzedAt).toLocaleTimeString()}</span>
                </div>
              </div>
          </div>
        ))}
      </div>
      )}

      {/* Bottom Info */}
      {discoveries.length > 0 && (
        <div className="mt-10 p-6 bg-gradient-to-r from-gray-900/50 to-purple-900/20 border border-gray-800 rounded-xl">
          <p className="text-sm text-gray-400 leading-relaxed">
            <span className="font-semibold text-purple-400">Disclaimer:</span> These discoveries are generated by AI analysis of on-chain data, market signals, and historical patterns. Always conduct your own research and never invest more than you can afford to lose. Past performance does not guarantee future results.
          </p>
        </div>
      )}
    </div>
  );
}
// Improve 8
// Improve 18
// Improve 28
// Improve 38
// Improve 48
// Improve 58
// Improve 68
