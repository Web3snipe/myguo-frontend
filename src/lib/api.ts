import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Auth
export const login = async (walletAddress: string, privyUserId?: string) => {
  const { data } = await api.post('/auth/login', { walletAddress, privyUserId });
  return data;
};

// Wallets
export const addWallet = async (userId: string, address: string) => {
  const { data } = await api.post('/wallets/add', { userId, address });
  return data;
};

export const removeWallet = async (walletId: string, userId?: string) => {
  const params = userId ? { userId } : {};
  const { data } = await api.delete(`/wallets/${walletId}`, { params });
  return data;
};

export const getWalletBalance = async (address: string) => {
  const { data } = await api.get(`/wallets/${address}/balance`);
  return data;
};

export const getWalletTransactions = async (address: string, limit: number = 50) => {
  const { data } = await api.get(`/wallets/${address}/transactions`, { params: { limit } });
  return data;
};

// Portfolio
export const getPortfolioSummary = async (userId: string, walletId?: string) => {
  const params: any = { userId };
  if (walletId) params.walletId = walletId;
  const { data } = await api.get('/portfolio/summary', { params });
  return data;
};

export const getPortfolioHistory = async (userId: string, period: string = '1W') => {
  const { data } = await api.get('/portfolio/history', { params: { userId, period } });
  return data;
};

// AI - Portfolio Insights (NEW - uses AI Portfolio Insights service)
export const getPortfolioInsights = async (userId: string, walletId?: string) => {
  const params: any = { userId };
  if (walletId) params.walletId = walletId;
  const { data } = await api.get('/portfolio/insights', { params });
  return data;
};

export const generatePortfolioInsights = async (userId: string, walletId?: string) => {
  const { data } = await api.post('/portfolio/insights/generate', { userId, walletId });
  return data;
};

// AI - Legacy (kept for backward compatibility)
export const generateInsights = async (userId: string) => {
  const { data } = await api.post('/ai/generate-insights', { userId });
  return data;
};

export const getInsights = async (userId: string, walletId?: string) => {
  // Use new portfolio insights endpoint
  return getPortfolioInsights(userId, walletId);
};

export const executeInsightAction = async (insightId: string) => {
  const { data } = await api.post(`/ai/insights/${insightId}/execute`);
  return data;
};

// Agent Control
export const startAgent = async (userId: string) => {
  const { data } = await api.post('/agent/start', { userId });
  return data;
};

export const stopAgent = async (userId: string) => {
  const { data } = await api.post('/agent/stop', { userId });
  return data;
};

export const getAgentStatus = async (userId: string) => {
  const { data } = await api.get('/agent/status', { params: { userId } });
  return data;
};

export const getAgentActivity = async (userId: string, limit: number = 20) => {
  const { data } = await api.get('/agent/activity', { params: { userId, limit } });
  return data;
};

export const getAgentStats = async (userId: string) => {
  const { data } = await api.get('/agent/stats', { params: { userId } });
  return data;
};

export const createStopLoss = async (
  userId: string,
  walletId: string,
  tokenSymbol: string,
  threshold: number = -15
) => {
  const { data } = await api.post('/agent/stop-loss', {
    userId,
    walletId,
    tokenSymbol,
    threshold,
  });
  return data;
};

export const getStopLossOrders = async (userId: string) => {
  const { data } = await api.get('/agent/stop-loss', { params: { userId } });
  return data;
};

export const dismissInsight = async (insightId: string) => {
  const { data } = await api.patch(`/ai/insights/${insightId}/dismiss`);
  return data;
};

// Wallets Management
export const getUserWallets = async (userId: string) => {
  const { data } = await api.get('/wallets', { params: { userId } });
  return data;
};

export const syncWallet = async (walletId: string) => {
  const { data } = await api.post(`/wallets/${walletId}/sync`);
  return data;
};

export const syncAllWallets = async (userId: string) => {
  const { data } = await api.post('/wallets/sync-all', { userId });
  return data;
};

// Discovery Functions
export const saveDiscovery = async (userId: string, token: any) => {
  const { data } = await api.post('/discovery/save', { userId, token });
  return data;
};

export const addToWatchlist = async (userId: string, token: any, targetPrice?: number, notes?: string) => {
  const { data } = await api.post('/discovery/watchlist/add', { userId, token, targetPrice, notes });
  return data;
};

export const getWatchlist = async (userId: string) => {
  const { data } = await api.get(`/discovery/watchlist/${userId}`);
  return data;
};

export const getSavedDiscoveries = async (userId: string) => {
  const { data} = await api.get(`/discovery/saved/${userId}`);
  return data;
};

// Advanced AI
export const generateAdvancedInsights = async (userId: string) => {
  const { data } = await api.post('/ai/advanced-insights', { userId });
  return data;
};

export const getRebalancingPlan = async (userId: string) => {
  const { data } = await api.post('/ai/rebalancing-plan', { userId });
  return data;
};
