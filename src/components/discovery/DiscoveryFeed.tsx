"use client";

import { Sparkles, TrendingUp, Zap } from 'lucide-react';

interface DiscoveryFeedProps {
  filters: any;
}

const discoveryItems = [
  {
    id: 1,
    name: 'Story Protocol',
    symbol: 'STORY',
    price: '$8.95',
    marketCap: '$2.84B MC',
    confidence: 'High Confidence',
    confidenceColor: 'bg-green-500/20 text-green-500',
    category: 'PROTOCOL / AI X IP INFRASTRUCTURE',
    tags: ['AI Discoveries', 'Protocol Launches', 'Ecosystem Growth', 'AI Infrastructure'],
    description: 'Making IP programmable for AI',
    icon: '📖',
    reasons: [
      'Mainnet + token launched Feb 13, 2025 with strong VC backing',
      'Narrative momentum - Making IP programmable for AI applications',
      'Similar infra launches (ENS,Lens) showed post-launch momentum patterns',
      'On-chain adoption and integrations accelerating post-mainnet',
    ],
    learningStatus: 'Your AI model has analyzed 47 projects and identified 3 high-confidence opportunities matching your infrastructure investment thesis',
    timeAgo: '10 Min ago',
  },
  {
    id: 2,
    name: 'Virtuals Protocol',
    symbol: 'VIRTUAL',
    price: '$1.05',
    marketCap: '741.9M MC',
    confidence: 'Medium Confidence',
    confidenceColor: 'bg-yellow-500/20 text-yellow-500',
    category: 'AI AGENT LAUNCHPAD / ECOSYSTEM GROWTH',
    tags: ['AI Agents', 'Launchpad', 'Ecosystem'],
    description: 'AI agent launchpad platform',
    icon: '🤖',
    reasons: [
      'Platform facilitated ~17,000 agent token launches showing strong developer throughput',
      'Strong transaction volume and adoption signals in AI-agent space',
      'Launchpad models historically see bursts of token interest during ecosystem growth',
      'Integrations and TVL momentum building across AI applications',
    ],
    learningStatus: 'Launchpad ecosystems show high variance but strong upside during growth phases. Token quality dispersion means careful selection of derivative projects is critical',
    timeAgo: '30 Min ago',
  },
  {
    id: 3,
    name: 'Sahara AI',
    symbol: 'SAHARA',
    price: '$0.0809',
    marketCap: '$808M FDV',
    confidence: 'Medium Confidence',
    confidenceColor: 'bg-yellow-500/20 text-yellow-500',
    category: 'DECENTRALIZED AI INFRA / DATA & COMPUTE',
    tags: ['AI Infrastructure', 'Data Marketplace', 'Compute'],
    description: 'Data & compute marketplace',
    icon: '🏜️',
    reasons: [
      'Token live with exchange listing activity and growing liquidity',
      'Upcoming roadmap includes product launches like DePIN/CooPilot',
      'Infrastructure tokens tied to AI and compute often get speculation flows post-listing',
      'Positioning in decentralized AI infrastructure narrative gaining traction',
    ],
    learningStatus: 'Must execute on roadmap milestones to maintain momentum. Competition in AI infrastructure is intense making differentiation and adoption metrics key to watch',
    timeAgo: '1 hour ago',
  },
];

export default function DiscoveryFeed({ filters }: DiscoveryFeedProps) {
  return (
    <div className="py-8 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI-Powered Discovery Feed</h1>
        <p className="text-gray-400">
          Personalized insights based on your portfolio behavior and market patterns
        </p>
      </div>

      {/* AI Learning Banner */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 flex-wrap">
              AI LEARNING IN PROGRESS
              <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                Beta
              </span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your AI model has analyzed 47 projects and identified 3 high-confidence opportunities
              matching your infrastructure investment thesis
            </p>
          </div>
        </div>
      </div>

      {/* Discovery Cards */}
      <div className="space-y-6">
        {discoveryItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4 gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold">{item.price}</div>
                <div className="text-sm text-gray-400">{item.marketCap}</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${item.confidenceColor}`}>
                {item.confidence}
              </span>
              <span className="text-xs px-3 py-1 bg-gray-800 text-gray-400 rounded-full">
                {item.category}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Why AI Recommends Now */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                WHY AI RECOMMENDS NOW
              </h4>
              <ul className="space-y-2.5">
                {item.reasons.map((reason, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-3">
                    <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Learning Status */}
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 flex-shrink-0" />
                AI LEARNING IN PROGRESS
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">{item.learningStatus}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 bg-gradient-to-r from-[#E879F9] to-[#A855F7] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                  Save Insight
                </button>
                <button className="px-5 py-2.5 bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors whitespace-nowrap">
                  Add to Portfolio AI
                </button>
                <button className="px-5 py-2.5 bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors whitespace-nowrap">
                  Add to Watchlist
                </button>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">AI generated {item.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

