import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { getPortfolioHistory, createPortfolioSnapshot } from '../services/portfolio';

const router = Router();

// Get portfolio summary (aggregate or individual wallet)
router.get('/summary', async (req, res) => {
  try {
    const { userId, walletId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: {
        wallets: {
          include: {
            assets: true,
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 6,
        },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (walletId) {
      // Individual wallet view
      const wallet = user.wallets.find(w => w.id === walletId);
      
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      res.json({
        type: 'individual',
        walletId: wallet.id,
        address: wallet.address,
        totalValue: wallet.totalValueUSD,
        aiTag: wallet.aiTag,
        lastSync: wallet.lastSync,
        assets: wallet.assets.sort((a, b) => b.valueUSD - a.valueUSD),
        recentTransactions: wallet.transactions,
      });
    } else {
      // Aggregate view
      const totalValue = user.wallets.reduce((sum, w) => sum + w.totalValueUSD, 0);
      const allAssets = user.wallets.flatMap(w => w.assets);
      
      // Get transactions from primary wallet only
      const primaryWallet = user.wallets.find(w => w.isPrimary);
      const allTransactions = primaryWallet?.transactions || [];

      // Aggregate assets by symbol
      const aggregatedAssets = allAssets.reduce((acc, asset) => {
        const existing = acc.find(a => a.symbol === asset.symbol);
        if (existing) {
          existing.balance = (parseFloat(existing.balance) + parseFloat(asset.balance)).toString();
          existing.valueUSD += asset.valueUSD;
        } else {
          acc.push({ ...asset });
        }
        return acc;
      }, [] as typeof allAssets);

      res.json({
        type: 'aggregate',
        walletCount: user.wallets.length,
        totalValue,
        assets: aggregatedAssets.sort((a, b) => b.valueUSD - a.valueUSD),
        recentTransactions: allTransactions,
        wallets: user.wallets.map(w => ({
          id: w.id,
          address: w.address,
          isPrimary: w.isPrimary,
          aiTag: w.aiTag,
          totalValueUSD: w.totalValueUSD,
          lastSync: w.lastSync,
        })),
      });
    }
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio summary' });
  }
});

// Get portfolio history for chart
router.get('/history', async (req, res) => {
  try {
    const { userId, walletId, period = '1M' } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const validPeriods = ['1D', '1W', '1M', '3M', '6M', '1Y'];
    const selectedPeriod = validPeriods.includes(period as string) 
      ? (period as '1D' | '1W' | '1M' | '3M' | '6M' | '1Y')
      : '1M';

    const history = await getPortfolioHistory(
      userId as string,
      selectedPeriod,
      walletId as string | undefined
    );

    // Calculate change percentage
    if (history.length > 1) {
      const firstValue = history[0].value;
      const lastValue = history[history.length - 1].value;
      const change = lastValue - firstValue;
      const changePercent = firstValue > 0 ? (change / firstValue) * 100 : 0;

      res.json({
        period: selectedPeriod,
        data: history.map(h => ({
          timestamp: h.timestamp,
          value: h.value,
        })),
        currentValue: lastValue,
        change,
        changePercent,
        startDate: history[0].timestamp,
        endDate: history[history.length - 1].timestamp,
      });
    } else {
      res.json({
        period: selectedPeriod,
        data: history,
        currentValue: history[0]?.value || 0,
        change: 0,
        changePercent: 0,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  } catch (error) {
    console.error('Error fetching portfolio history:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio history' });
  }
});

// Get top assets
router.get('/assets', async (req, res) => {
  try {
    const { userId, walletId, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: {
        wallets: {
          include: {
            assets: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let assets;

    if (walletId) {
      // Get assets from specific wallet
      const wallet = user.wallets.find(w => w.id === walletId);
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      assets = wallet.assets;
    } else {
      // Aggregate assets
      const allAssets = user.wallets.flatMap(w => w.assets);
      const aggregated = allAssets.reduce((acc, asset) => {
        const existing = acc.find(a => a.symbol === asset.symbol);
        if (existing) {
          existing.balance = (parseFloat(existing.balance) + parseFloat(asset.balance)).toString();
          existing.valueUSD += asset.valueUSD;
        } else {
          acc.push({ ...asset });
        }
        return acc;
      }, [] as typeof allAssets);
      assets = aggregated;
    }

    const sorted = assets
      .sort((a, b) => b.valueUSD - a.valueUSD)
      .slice(0, parseInt(limit as string));

    res.json(sorted);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Get transactions
router.get('/transactions', async (req, res) => {
  try {
    const { userId, walletId, limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: {
        wallets: {
          include: {
            transactions: {
              orderBy: { timestamp: 'desc' },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let transactions;

    if (walletId) {
      // Get transactions from specific wallet
      const wallet = user.wallets.find(w => w.id === walletId);
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      transactions = wallet.transactions;
    } else {
      // All transactions
      transactions = user.wallets
        .flatMap(w => w.transactions)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    const limited = transactions.slice(0, parseInt(limit as string));

    res.json(limited);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create portfolio snapshot
router.post('/snapshot', async (req, res) => {
  try {
    const { userId, walletId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    await createPortfolioSnapshot(userId, walletId);

    res.json({ success: true, message: 'Snapshot created' });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    res.status(500).json({ error: 'Failed to create snapshot' });
  }
});

export default router;
