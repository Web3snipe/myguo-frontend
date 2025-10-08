import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { generateAIInsights, generateWalletTag, executeInsightAction } from '../services/ai';
import { generateRebalancingPlan, generateYieldOptimization, generateGasOptimization } from '../services/rebalancing';

const router = Router();

// Get AI insights for user
router.get('/insights', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const insights = await prisma.aIInsight.findMany({
      where: {
        userId: userId as string,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    res.json(insights);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// Generate new AI insights
router.post('/generate-insights', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    console.log(`🤖 Generating AI insights for user ${userId}...`);

    const insights = await generateAIInsights(userId);

    res.json({
      success: true,
      insights,
      message: `Generated ${insights.length} insights`,
    });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Execute AI insight action
router.post('/insights/:insightId/execute', async (req, res) => {
  try {
    const { insightId } = req.params;

    const result = await executeInsightAction(insightId);

    res.json(result);
  } catch (error) {
    console.error('Error executing insight action:', error);
    res.status(500).json({ error: 'Failed to execute action' });
  }
});

// Dismiss an insight
router.patch('/insights/:insightId/dismiss', async (req, res) => {
  try {
    const { insightId } = req.params;

    await prisma.aIInsight.update({
      where: { id: insightId },
      data: { status: 'dismissed' },
    });

    res.json({ success: true, message: 'Insight dismissed' });
  } catch (error) {
    console.error('Error dismissing insight:', error);
    res.status(500).json({ error: 'Failed to dismiss insight' });
  }
});

// Get insight history
router.get('/insights/history', async (req, res) => {
  try {
    const { userId, limit = 20 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const insights = await prisma.aIInsight.findMany({
      where: {
        userId: userId as string,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
    });

    res.json(insights);
  } catch (error) {
    console.error('Error fetching insight history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Generate wallet tag
router.post('/tag-wallet', async (req, res) => {
  try {
    const { walletId } = req.body;

    if (!walletId) {
      return res.status(400).json({ error: 'Missing walletId' });
    }

    const tag = await generateWalletTag(walletId);

    res.json({
      success: true,
      tag,
    });
  } catch (error) {
    console.error('Error tagging wallet:', error);
    res.status(500).json({ error: 'Failed to tag wallet' });
  }
});

// Generate rebalancing plan
router.post('/rebalancing-plan', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    console.log(`📊 Generating rebalancing plan for user ${userId}...`);

    const plan = await generateRebalancingPlan(userId);

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error('Error generating rebalancing plan:', error);
    res.status(500).json({ error: 'Failed to generate rebalancing plan' });
  }
});

// Generate advanced insights (rebalancing + yield + gas)
router.post('/advanced-insights', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    console.log(`🚀 Generating advanced insights for user ${userId}...`);

    // Clear old insights
    await prisma.aIInsight.deleteMany({
      where: { userId, status: 'active' },
    });

    // Generate all insights in parallel
    const [rebalancing, yield_, gas] = await Promise.all([
      generateRebalancingPlan(userId),
      generateYieldOptimization(userId),
      generateGasOptimization(userId),
    ]);

    // Get all active insights
    const insights = await prisma.aIInsight.findMany({
      where: { userId, status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    res.json({
      success: true,
      insights,
      details: {
        rebalancing,
        yieldOpportunities: yield_,
        gasOptimization: gas,
      },
    });
  } catch (error) {
    console.error('Error generating advanced insights:', error);
    res.status(500).json({ error: 'Failed to generate advanced insights' });
  }
});

export default router;
