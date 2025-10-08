import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
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

// AI
export const generateInsights = async (userId: string) => {
  const { data } = await api.post('/ai/generate-insights', { userId });
  return data;
};

export const getInsights = async (userId: string) => {
  const { data } = await api.get('/ai/insights', { params: { userId } });
  return data;
};

export const executeInsightAction = async (insightId: string) => {
  const { data } = await api.post(`/ai/insights/${insightId}/execute`);
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

// Advanced AI
export const generateAdvancedInsights = async (userId: string) => {
  const { data } = await api.post('/ai/advanced-insights', { userId });
  return data;
};

export const getRebalancingPlan = async (userId: string) => {
  const { data } = await api.post('/ai/rebalancing-plan', { userId });
  return data;
};
