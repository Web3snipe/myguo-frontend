"use client";

import React, { useState, useEffect } from 'react';
import { X, Shield, Target, TrendingUp, Zap, DollarSign, CheckCircle2 } from 'lucide-react';

interface DiscoveryPreferencesModalProps {
  isOpen: boolean;
  onComplete: (preferences: any) => void;
}

export default function DiscoveryPreferencesModal({ isOpen, onComplete }: DiscoveryPreferencesModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [preferences, setPreferences] = useState({
    riskTolerance: 'aggressive',
    timeHorizon: 3,
    portfolioSize: 50, // in thousands
    investmentThesis: ['ai-agents', 'virtuals-ecosystem'],
    signalFilters: {
      whaleActivity: true,
      technicalBreakouts: true,
      protocolUpdates: true,
      socialMomentum: true,
      newListings: true,
    },
    confidenceLevel: 70,
    marketCap: {
      large: true,
      mid: true,
      small: true,
      micro: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      const savedPreferences = localStorage.getItem('discoveryPreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const toggleThesis = (thesis: string) => {
    setPreferences(prev => ({
      ...prev,
      investmentThesis: prev.investmentThesis.includes(thesis)
        ? prev.investmentThesis.filter(t => t !== thesis)
        : [...prev.investmentThesis, thesis],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl max-w-2xl w-full p-8 relative">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Set Your Discovery Preferences
          </h2>
          <p className="text-gray-400">
            Customize AI discovery to match your investment style
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < step ? 'bg-purple-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Step 1: Risk & Time Horizon */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-white font-medium mb-3 block flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Risk Tolerance
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['conservative', 'moderate', 'aggressive'].map((risk) => (
                  <button
                    key={risk}
                    onClick={() =>
                      setPreferences(prev => ({ ...prev, riskTolerance: risk as any }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      preferences.riskTolerance === risk
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <p className="text-white font-medium capitalize">{risk}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {risk === 'conservative' && '5-15% risk'}
                      {risk === 'moderate' && '15-30% risk'}
                      {risk === 'aggressive' && '30%+ risk'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white font-medium mb-3 block flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Time Horizon (months)
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={preferences.timeHorizon}
                onChange={(e) =>
                  setPreferences(prev => ({ ...prev, timeHorizon: parseInt(e.target.value) }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>1 month (Day trading)</span>
                <span className="text-purple-400 font-medium">
                  {preferences.timeHorizon} months
                </span>
                <span>12 months (Long-term)</span>
              </div>
            </div>

            <div>
              <label className="text-white font-medium mb-3 block">
                Portfolio Size (USD)
              </label>
              <input
                type="range"
                min="1"
                max="1000"
                step="10"
                value={preferences.portfolioSize}
                onChange={(e) =>
                  setPreferences(prev => ({ ...prev, portfolioSize: parseInt(e.target.value) }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>$1K (Small)</span>
                <span className="text-purple-400 font-medium">
                  ${preferences.portfolioSize}K
                </span>
                <span>$1M+ (Large)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Investment Thesis */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="text-white font-medium mb-3 block flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Investment Themes (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'ai-agents', label: 'AI Agents', desc: 'Autonomous AI tokens' },
                  { id: 'virtuals-ecosystem', label: 'Virtuals Ecosystem', desc: 'VIRTUAL, GAME, AIXBT' },
                  { id: 'defi', label: 'DeFi Protocols', desc: 'Yield, DEX, Lending' },
                  { id: 'gaming', label: 'Gaming & NFTs', desc: 'Web3 gaming' },
                  { id: 'meme', label: 'Meme Coins', desc: 'Community-driven assets' },
                  { id: 'infrastructure', label: 'Infrastructure', desc: 'L1/L2, Oracles' },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => toggleThesis(theme.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      preferences.investmentThesis.includes(theme.id)
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium">{theme.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{theme.desc}</p>
                      </div>
                      {preferences.investmentThesis.includes(theme.id) && (
                        <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Signal Filters */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="text-white font-medium mb-3 block flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Discovery Signals
              </label>
              <div className="space-y-3">
                {[
                  { key: 'whaleActivity', label: 'Whale Activity', desc: 'Large wallet movements' },
                  { key: 'technicalBreakouts', label: 'Technical Breakouts', desc: 'Price/volume patterns' },
                  { key: 'protocolUpdates', label: 'Protocol Updates', desc: 'Launches, upgrades' },
                  { key: 'socialMomentum', label: 'Social Momentum', desc: 'Trending discussions' },
                  { key: 'newListings', label: 'New Listings', desc: 'Recently launched tokens' },
                ].map((signal) => (
                  <label
                    key={signal.key}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-purple-500/50 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">{signal.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{signal.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(preferences.signalFilters as any)[signal.key]}
                      onChange={() =>
                        setPreferences(prev => ({
                          ...prev,
                          signalFilters: {
                            ...prev.signalFilters,
                            [signal.key]: !(prev.signalFilters as any)[signal.key],
                          },
                        }))
                      }
                      className="form-checkbox h-5 w-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white font-medium mb-3 block flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                Minimum Confidence Level (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={preferences.confidenceLevel}
                onChange={(e) =>
                  setPreferences(prev => ({ ...prev, confidenceLevel: parseInt(e.target.value) }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>0% (Explore all)</span>
                <span className="text-purple-400 font-medium">
                  {preferences.confidenceLevel}%
                </span>
                <span>100% (High conviction)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Market Cap & Summary */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="text-white font-medium mb-3 block flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Market Cap Focus
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['large', 'mid', 'small', 'micro'].map((cap) => (
                  <label
                    key={cap}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-purple-500/50 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium capitalize">{cap} Cap</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {cap === 'large' && '$10B+'}
                        {cap === 'mid' && '$1B - $10B'}
                        {cap === 'small' && '$100M - $1B'}
                        {cap === 'micro' && '< $100M'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(preferences.marketCap as any)[cap]}
                      onChange={() =>
                        setPreferences(prev => ({
                          ...prev,
                          marketCap: {
                            ...prev.marketCap,
                            [cap]: !(prev.marketCap as any)[cap],
                          },
                        }))
                      }
                      className="form-checkbox h-5 w-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-purple-400 font-medium mb-2">✅ Your Discovery Profile:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• {preferences.riskTolerance.toUpperCase()} risk tolerance</li>
                <li>• {preferences.timeHorizon} month time horizon</li>
                <li>• {preferences.investmentThesis.length} investment themes selected</li>
                <li>• Minimum {preferences.confidenceLevel}% confidence</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all flex items-center gap-2"
          >
            {step === totalSteps ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Start Discovery
              </>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}