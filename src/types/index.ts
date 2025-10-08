export interface User {
  id: string;
  primaryWalletAddress: string;
  wallets: Wallet[];
  aiInsights: AIInsight[];
}

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  isPrimary: boolean;
  aiTag?: string;
  totalValueUSD: number;
  lastSync: Date;
  assets?: Asset[];
  transactions?: Transaction[];
}

export interface Asset {
  id: string;
  walletId: string;
  tokenAddress: string;
  symbol: string;
  name: string;
  balance: string;
  valueUSD: number;
  aiAnnotation?: string;
  lastUpdated: Date;
}

export interface Transaction {
  id?: string;
  walletId?: string;
  hash: string;
  type: string;
  fromToken?: string;
  toToken?: string;
  amount: string;
  valueUSD: number;
  gasUsed: string;
  gasPrice: string;
  aiLabel?: string;
  timestamp: Date;
  status?: 'success' | 'pending' | 'failed';
}

export interface AIInsight {
  id: string;
  userId: string;
  type: 'idle_asset' | 'concentration_risk' | 'yield_opportunity' | 'gas_optimization';
  title: string;
  description: string;
  actionButton: string;
  projectedGain?: string;
  confidence: 'High' | 'Medium' | 'Low';
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  status: 'active' | 'dismissed' | 'executed';
  createdAt: Date;
}

export interface PortfolioSummary {
  totalValueUSD: number;
  walletCount: number;
  topAssets: Array<{
    symbol: string;
    name: string;
    balance: number;
    valueUSD: number;
    wallets: string[];
  }>;
  lastUpdated: Date;
}

export interface PortfolioHistory {
  timestamp: Date;
  value: number;
}

