import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { fetchWalletBalance, fetchTransactionHistory } from '../services/blockchain';
import { generateWalletTag } from '../services/ai';
import { createPortfolioSnapshot } from '../services/portfolio';

const router = Router();

// Sync wallet data from blockchain
async function syncWalletData(walletId: string) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      console.log(`⚠️ Wallet ${walletId} not found, skipping sync`);
      return;
    }

    console.log(`🔄 Syncing wallet ${wallet.address}...`);

    // Fetch balance from blockchain
    const balance = await fetchWalletBalance(wallet.address);

    // Check if wallet still exists before updating
    const walletExists = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!walletExists) {
      console.log(`⚠️ Wallet ${walletId} was deleted during sync, skipping update`);
      return;
    }

    // Update wallet total value
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        totalValueUSD: balance.totalValueUSD,
        lastSync: new Date(),
      },
    });

    // Delete old assets
    await prisma.asset.deleteMany({
      where: { walletId },
    });

    // Save new assets - save top 50 by value to avoid spam
    const tokensToSave = balance.tokens
      .sort((a, b) => b.valueUSD - a.valueUSD)
      .slice(0, 50);
    
    for (const token of tokensToSave) {
      await prisma.asset.create({
        data: {
          walletId,
          tokenAddress: token.tokenAddress,
          symbol: token.symbol,
          name: token.name,
          balance: token.balance,
          valueUSD: token.valueUSD,
          aiAnnotation: null,
        },
      });
    }
    
    console.log(`💾 Saved ${tokensToSave.length} assets (total portfolio value: $${balance.totalValueUSD.toFixed(2)})`);

    // Fetch and save transactions
    const transactions = await fetchTransactionHistory(wallet.address, 20);
    
    for (const tx of transactions) {
      try {
        await prisma.transaction.upsert({
          where: { hash: tx.hash },
          update: {},
          create: {
            walletId,
            hash: tx.hash,
            type: tx.type,
            fromToken: tx.fromToken,
            toToken: tx.toToken,
            amount: tx.amount,
            valueUSD: tx.valueUSD,
            gasUsed: tx.gasUsed,
            gasPrice: tx.gasPrice,
            timestamp: tx.timestamp,
            aiLabel: null,
          },
        });
      } catch (error: any) {
        if (!error.message.includes('Unique constraint')) {
          console.error(`Error saving transaction ${tx.hash}:`, error);
        }
      }
    }

    // Generate AI tag for wallet
    await generateWalletTag(walletId);

    // Label transactions with AI
    const { labelWalletTransactions } = await import('../services/ai');
    await labelWalletTransactions(walletId);

    // Create portfolio snapshot
    await createPortfolioSnapshot(wallet.userId, walletId);

    console.log(`✅ Wallet ${wallet.address} synced successfully`);
  } catch (error) {
    console.error(`Error syncing wallet:`, error);
  }
}

// Get all wallets for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: userId as string },
      include: {
        assets: {
          orderBy: { valueUSD: 'desc' },
        },
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 6,
        },
      },
    });

    res.json(wallets);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({ error: 'Failed to fetch wallets' });
  }
});

// Add a new wallet
router.post('/add', async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (!userId || !address) {
      return res.status(400).json({ error: 'Missing userId or address' });
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Check wallet limit (5 wallets per user)
    const existingWallets = await prisma.wallet.count({
      where: { userId },
    });

    if (existingWallets >= 5) {
      return res.status(400).json({ error: 'Maximum 5 wallets per user' });
    }

    // Check if wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { address },
    });

    if (existingWallet) {
      return res.status(400).json({ error: 'Wallet already added' });
    }

    // Create wallet
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        address,
        isPrimary: false,
        totalValueUSD: 0,
      },
    });

    // Sync wallet data in background
    syncWalletData(wallet.id).catch(console.error);

    res.json({
      success: true,
      wallet,
      message: 'Wallet added successfully. Syncing data...',
    });
  } catch (error) {
    console.error('Error adding wallet:', error);
    res.status(500).json({ error: 'Failed to add wallet' });
  }
});

// Remove a wallet
router.delete('/:walletId', async (req, res) => {
  try {
    const { walletId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: userId as string,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (wallet.isPrimary) {
      return res.status(400).json({ error: 'Cannot remove primary wallet' });
    }

    await prisma.wallet.delete({
      where: { id: walletId },
    });

    res.json({ success: true, message: 'Wallet removed successfully' });
  } catch (error) {
    console.error('Error removing wallet:', error);
    res.status(500).json({ error: 'Failed to remove wallet' });
  }
});

// Sync wallet data
router.post('/:walletId/sync', async (req, res) => {
  try {
    const { walletId } = req.params;

    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Sync in background
    syncWalletData(walletId).catch(console.error);

    res.json({ success: true, message: 'Wallet sync started' });
  } catch (error) {
    console.error('Error syncing wallet:', error);
    res.status(500).json({ error: 'Failed to sync wallet' });
  }
});

// Get wallet transactions by address
router.get('/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 50 } = req.query;

    const wallet = await prisma.wallet.findUnique({
      where: { address },
      include: {
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: parseInt(limit as string),
        },
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ transactions: wallet.transactions });
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ error: 'Failed to fetch wallet transactions' });
  }
});

// Get wallet details with assets and transactions
router.get('/:walletId', async (req, res) => {
  try {
    const { walletId } = req.params;

    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: {
        assets: {
          orderBy: { valueUSD: 'desc' },
        },
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 50,
        },
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet details:', error);
    res.status(500).json({ error: 'Failed to fetch wallet details' });
  }
});

// Sync all user wallets
router.post('/sync-all', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId },
    });

    // Sync all wallets in background
    for (const wallet of wallets) {
      syncWalletData(wallet.id).catch(console.error);
    }

    res.json({
      success: true,
      message: `Syncing ${wallets.length} wallets...`,
    });
  } catch (error) {
    console.error('Error syncing all wallets:', error);
    res.status(500).json({ error: 'Failed to sync wallets' });
  }
});

export default router;
