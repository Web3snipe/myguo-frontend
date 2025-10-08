import { SUPPORTED_CHAINS } from '../lib/alchemy';
import { cache } from '../lib/redis';
import axios from 'axios';
import { Utils } from 'alchemy-sdk';

export interface TokenBalance {
  tokenAddress: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  valueUSD: number;
}

export interface WalletBalance {
  address: string;
  nativeBalance: string;
  nativeValueUSD: number;
  tokens: TokenBalance[];
  totalValueUSD: number;
  lastUpdated: Date;
}

export interface Transaction {
  hash: string;
  type: string;
  fromToken?: string;
  toToken?: string;
  amount: string;
  valueUSD: number;
  gasUsed: string;
  gasPrice: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
}

// Fallback prices when CoinGecko is rate-limited or unavailable
const FALLBACK_PRICES: Record<string, number> = {
  'ETH': 2500,
  'MATIC': 0.70,
  'BTC': 65000,
  'USDC': 1,
  'USDT': 1,
  'DAI': 1,
  'ARB': 0.80,
  'WETH': 2500,
  'WBTC': 65000,
};

// Fetch token prices from CoinGecko
async function getTokenPrices(symbols: string[]): Promise<Record<string, number>> {
  const cacheKey = `prices:${symbols.sort().join(',')}`;
  const cached = await cache.get<Record<string, number>>(cacheKey);
  
  if (cached) {
    console.log('✅ Using cached prices');
    return cached;
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network,bitcoin,usd-coin,tether,dai,arbitrum,wrapped-bitcoin&vs_currencies=usd`,
      {
        headers: {
          'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '',
        },
        timeout: 5000,
      }
    );

    const prices: Record<string, number> = {
      'ETH': response.data.ethereum?.usd || FALLBACK_PRICES.ETH,
      'MATIC': response.data['matic-network']?.usd || FALLBACK_PRICES.MATIC,
      'BTC': response.data.bitcoin?.usd || FALLBACK_PRICES.BTC,
      'USDC': response.data['usd-coin']?.usd || FALLBACK_PRICES.USDC,
      'USDT': response.data.tether?.usd || FALLBACK_PRICES.USDT,
      'DAI': response.data.dai?.usd || FALLBACK_PRICES.DAI,
      'ARB': response.data.arbitrum?.usd || FALLBACK_PRICES.ARB,
      'WETH': response.data.ethereum?.usd || FALLBACK_PRICES.WETH,
      'WBTC': response.data['wrapped-bitcoin']?.usd || FALLBACK_PRICES.WBTC,
    };

    console.log('✅ Fetched prices from CoinGecko:', prices);
    await cache.set(cacheKey, prices, 300); // Cache for 5 minutes
    return prices;
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn('⚠️ CoinGecko rate limit hit, using fallback prices');
    } else {
      console.error('❌ Error fetching token prices:', error.message);
    }
    // Return fallback prices instead of empty object
    return FALLBACK_PRICES;
  }
}

// Fetch wallet balance across all chains
export async function fetchWalletBalance(address: string): Promise<WalletBalance> {
  const cacheKey = `balance:${address}`;
  const cached = await cache.get<WalletBalance>(cacheKey);
  
  if (cached) {
    console.log(`✅ Using cached balance for ${address}`);
    return cached;
  }

  console.log(`🔍 Fetching balance for wallet: ${address}`);
  let totalValueUSD = 0;
  let nativeBalance = '0';
  let nativeValueUSD = 0;
  const allTokens: TokenBalance[] = [];

  // Fetch balances from all supported chains
  for (const chain of SUPPORTED_CHAINS) {
    try {
      console.log(`  Checking ${chain.name}...`);
      
      // Fetch native token balance
      const balance = await chain.alchemy.core.getBalance(address);
      const balanceEther = Utils.formatEther(balance);
      console.log(`  ${chain.symbol} Balance: ${balanceEther}`);
      
      // Fetch ERC-20 token balances
      const tokenBalances = await chain.alchemy.core.getTokenBalances(address);
      console.log(`  Found ${tokenBalances.tokenBalances.length} tokens on ${chain.name}`);

      // Get prices
      const prices = await getTokenPrices([chain.symbol, 'USDC', 'USDT', 'DAI']);
      
      // Add native token
      const nativeValue = parseFloat(balanceEther) * (prices[chain.symbol] || 0);
      nativeBalance = (parseFloat(nativeBalance) + parseFloat(balanceEther)).toString();
      nativeValueUSD += nativeValue;
      totalValueUSD += nativeValue;

      if (parseFloat(balanceEther) > 0) {
        console.log(`  ${chain.symbol} value: $${nativeValue.toFixed(2)}`);
        // Add native token to assets list
        allTokens.push({
          tokenAddress: '0x0000000000000000000000000000000000000000', // Native token
          symbol: chain.symbol,
          name: `${chain.name} Native Token`,
          balance: balanceEther,
          decimals: 18,
          valueUSD: nativeValue,
        });
      }

      // Process ERC-20 tokens
      let processedTokens = 0;
      for (const token of tokenBalances.tokenBalances) {
        if (token.tokenBalance && token.tokenBalance !== '0x0') {
          try {
            const metadata = await chain.alchemy.core.getTokenMetadata(token.contractAddress);
            const balance = parseInt(token.tokenBalance, 16);
            const balanceFormatted = balance / Math.pow(10, metadata.decimals || 18);
            
            // Get token price - only for known tokens to avoid scam values
            const tokenPrice = prices[metadata.symbol || ''] || 0;
            const valueUSD = balanceFormatted * tokenPrice;

            // Save all tokens with balance > 0 (let frontend filter if needed)
            // But only count value for tokens we have prices for
            if (balanceFormatted > 0) {
              allTokens.push({
                tokenAddress: token.contractAddress,
                symbol: metadata.symbol || 'UNKNOWN',
                name: metadata.name || 'Unknown Token',
                balance: balanceFormatted.toString(),
                decimals: metadata.decimals || 18,
                valueUSD,
              });

              if (valueUSD > 0) {
                totalValueUSD += valueUSD;
                console.log(`  Token: ${metadata.symbol} - Balance: ${balanceFormatted.toFixed(6)} - Value: $${valueUSD.toFixed(2)}`);
                processedTokens++;
              }
            }
          } catch (error) {
            console.error(`  ❌ Error fetching token metadata for ${token.contractAddress}:`, error);
          }
        }
      }
      console.log(`  Processed ${processedTokens} tokens with non-zero balances`);
    } catch (error: any) {
      console.error(`❌ Error fetching balance from ${chain.name}:`, error.message);
    }
  }

  const result: WalletBalance = {
    address,
    nativeBalance,
    nativeValueUSD,
    tokens: allTokens.sort((a, b) => b.valueUSD - a.valueUSD),
    totalValueUSD,
    lastUpdated: new Date(),
  };

  console.log(`💰 Total portfolio value for ${address}: $${totalValueUSD.toFixed(2)}`);
  await cache.set(cacheKey, result, 120); // Cache for 2 minutes
  return result;
}

// Fetch transaction history
export async function fetchTransactionHistory(address: string, limit: number = 50): Promise<Transaction[]> {
  const cacheKey = `transactions:${address}:${limit}`;
  const cached = await cache.get<Transaction[]>(cacheKey);
  
  if (cached) {
    console.log(`✅ Using cached transactions for ${address}`);
    return cached;
  }

  console.log(`📜 Fetching transaction history for wallet: ${address}`);
  const allTransactions: Transaction[] = [];

  for (const chain of SUPPORTED_CHAINS) {
    try {
      console.log(`  Fetching transactions from ${chain.name}...`);
      
      // Fetch both incoming and outgoing transactions
      const categories = ['external', 'erc20', 'erc721', 'erc1155'];
      
      // Get outgoing transactions (from address)
      const fromResponse = await chain.alchemy.core.getAssetTransfers({
        fromAddress: address,
        category: categories as any,
        maxCount: Math.floor(limit / 2),
        order: 'desc',
        withMetadata: true,
        excludeZeroValue: true,
      });

      // Get incoming transactions (to address)
      const toResponse = await chain.alchemy.core.getAssetTransfers({
        toAddress: address,
        category: categories as any,
        maxCount: Math.floor(limit / 2),
        order: 'desc',
        withMetadata: true,
        excludeZeroValue: true,
      });

      const allTransfers = [...fromResponse.transfers, ...toResponse.transfers];
      console.log(`  Found ${allTransfers.length} transactions on ${chain.name}`);
      
      const prices = await getTokenPrices(['ETH', 'MATIC']);

      let validTx = 0;
      for (const tx of allTransfers) {
        // Skip if no timestamp data
        if (!tx.metadata?.blockTimestamp) continue;

        // Determine transaction type based on direction
        const isOutgoing = tx.from.toLowerCase() === address.toLowerCase();
        const txType = tx.category === 'erc20' 
          ? (isOutgoing ? 'transfer' : 'receive')
          : (isOutgoing ? 'send' : 'receive');

        const transaction: Transaction = {
          hash: tx.hash,
          type: txType,
          fromToken: tx.asset || chain.symbol,
          toToken: tx.asset || chain.symbol,
          amount: tx.value?.toString() || '0',
          valueUSD: (tx.value || 0) * (prices[tx.asset || chain.symbol] || 0),
          gasUsed: '0',
          gasPrice: '0',
          timestamp: new Date(tx.metadata.blockTimestamp),
          status: 'success',
        };

        allTransactions.push(transaction);
        validTx++;
      }
      console.log(`  Added ${validTx} valid transactions from ${chain.name}`);
    } catch (error: any) {
      console.error(`❌ Error fetching transactions from ${chain.name}:`, error.message);
    }
  }

  // Remove duplicates based on hash
  const uniqueTransactions = allTransactions.reduce((acc, tx) => {
    if (!acc.find(t => t.hash === tx.hash)) {
      acc.push(tx);
    }
    return acc;
  }, [] as Transaction[]);

  // Sort by timestamp descending
  const sorted = uniqueTransactions
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);

  console.log(`📊 Total unique transactions found: ${sorted.length}`);
  await cache.set(cacheKey, sorted, 120); // Cache for 2 minutes
  return sorted;
}

// Calculate portfolio historical values (mock for now)
export async function fetchPortfolioHistory(
  address: string,
  period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'
): Promise<Array<{ timestamp: Date; value: number }>> {
  const cacheKey = `history:${address}:${period}`;
  const cached = await cache.get<Array<{ timestamp: Date; value: number }>>(cacheKey);
  
  if (cached) {
    return cached;
  }

  // For MVP, generate mock historical data based on current value
  const currentBalance = await fetchWalletBalance(address);
  const currentValue = currentBalance.totalValueUSD;
  
  const dataPoints: Array<{ timestamp: Date; value: number }> = [];
  const now = new Date();
  
  let days = 1;
  let points = 24;
  
  switch (period) {
    case '1D':
      days = 1;
      points = 24;
      break;
    case '1W':
      days = 7;
      points = 7;
      break;
    case '1M':
      days = 30;
      points = 30;
      break;
    case '3M':
      days = 90;
      points = 30;
      break;
    case '6M':
      days = 180;
      points = 30;
      break;
    case '1Y':
      days = 365;
      points = 52;
      break;
  }

  const hoursPerPoint = (days * 24) / points;
  
  for (let i = points; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * hoursPerPoint * 60 * 60 * 1000);
    // Simulate price variation (±5%)
    const variation = 1 + (Math.random() - 0.5) * 0.1;
    const value = currentValue * variation;
    
    dataPoints.push({ timestamp, value });
  }

  await cache.set(cacheKey, dataPoints, 600); // Cache for 10 minutes
  return dataPoints;
}



