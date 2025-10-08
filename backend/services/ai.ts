import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../lib/prisma';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Generate AI label for transaction using Claude
export async function generateTransactionLabel(transaction: any): Promise<string> {
  try {
    const valueUSD = transaction.valueUSD || 0;
    const type = transaction.type || '';
    const token = transaction.fromToken || 'ETH';

    // Use Claude for smart labeling
    const prompt = `Analyze this crypto transaction and provide a SHORT insight label (max 4 words):

Transaction:
- Type: ${type}
- Token: ${token}
- Value: $${valueUSD.toFixed(2)}
- Amount: ${transaction.amount}

Return ONLY a short label like:
- "Smart Entry" / "Good Exit"
- "Gas Efficient" / "High Gas Cost"
- "Large Position" / "Small Test"
- "Potential Profit" / "Position Building"
- "DeFi Interaction" / "Wallet Funding"

Be specific and actionable. Focus on insights, not just stating the obvious.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 20,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const label = message.content[0].type === 'text' 
      ? message.content[0].text.trim().replace(/["']/g, '') 
      : (valueUSD > 1000 ? 'Large Transaction' : 'Standard Transaction');

    return label;
  } catch (error) {
    console.error('Error generating transaction label:', error);
    // Fallback to basic labels
    const valueUSD = transaction.valueUSD || 0;
    if (valueUSD > 10000) return 'Whale Activity';
    if (valueUSD > 1000) return 'Significant Move';
    return 'Standard Activity';
  }
}

// Batch label transactions for a wallet
export async function labelWalletTransactions(walletId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { 
        walletId,
        aiLabel: null, // Only label unlabeled transactions
      },
      take: 50,
    });

    console.log(`🏷️  Labeling ${transactions.length} transactions for wallet ${walletId}`);

    for (const tx of transactions) {
      const label = await generateTransactionLabel(tx);
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { aiLabel: label },
      });
    }

    console.log(`✅ Labeled ${transactions.length} transactions`);
  } catch (error) {
    console.error('Error labeling transactions:', error);
  }
}

// Generate AI wallet tag based on transaction patterns
export async function generateWalletTag(walletId: string): Promise<string> {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: {
        assets: true,
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 50,
        },
      },
    });

    if (!wallet) return 'Unknown Wallet';

    const txCount = wallet.transactions.length;
    const recentTxCount = wallet.transactions.filter(
      tx => tx.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    const stakeTxCount = wallet.transactions.filter(tx => tx.type === 'stake').length;
    const swapTxCount = wallet.transactions.filter(tx => tx.type === 'swap').length;
    const transferTxCount = wallet.transactions.filter(tx => tx.type === 'transfer').length;

    const prompt = `Analyze this wallet and provide a SHORT 2-3 word tag:

Wallet Stats:
- Total Value: $${wallet.totalValueUSD.toFixed(2)}
- Total Transactions: ${txCount}
- Recent Activity (30d): ${recentTxCount} transactions
- Stake Transactions: ${stakeTxCount}
- Swap Transactions: ${swapTxCount}
- Transfer Transactions: ${transferTxCount}
- Asset Count: ${wallet.assets.length}
- Dormant: ${recentTxCount === 0 ? 'Yes' : 'No'}

Return ONLY a short tag like "Yield Farmer", "Active Trader", "HODLer", "Dormant Capital", "Early Buyer", "DeFi Power User", "NFT Collector", "Whale Wallet", etc.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const tag = message.content[0].type === 'text' 
      ? message.content[0].text.trim().replace(/["']/g, '') 
      : 'Crypto Wallet';

    // Update wallet with AI tag
    await prisma.wallet.update({
      where: { id: walletId },
      data: { aiTag: tag },
    });

    return tag;
  } catch (error) {
    console.error('Error generating wallet tag:', error);
    return 'Crypto Wallet';
  }
}

// Generate AI insights for user's portfolio
export async function generateAIInsights(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: {
          include: {
            assets: true,
            transactions: {
              orderBy: { timestamp: 'desc' },
              take: 20,
            },
          },
        },
      },
    });

    if (!user) return [];

    const totalValue = user.wallets.reduce((sum, w) => sum + w.totalValueUSD, 0);
    const totalAssets = user.wallets.flatMap(w => w.assets);
    
    // Find idle assets
    const idleAssets = totalAssets.filter(
      asset => asset.valueUSD > 100 && !asset.aiAnnotation
    );

    // Check concentration risk
    const topAsset = totalAssets.sort((a, b) => b.valueUSD - a.valueUSD)[0];
    const concentration = topAsset ? (topAsset.valueUSD / totalValue) * 100 : 0;

    // Analyze gas fees
    const recentTxs = user.wallets.flatMap(w => w.transactions).slice(0, 10);
    const avgGasUSD = recentTxs.reduce((sum, tx) => {
      const gasInEth = parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice) / 1e18;
      return sum + gasInEth * 2500; // Approximate ETH price
    }, 0) / (recentTxs.length || 1);

    const prompt = `You are a DeFi portfolio analyst. Generate 3 actionable insights in JSON format.

Portfolio Data:
- Total Value: $${totalValue.toFixed(2)}
- Wallets: ${user.wallets.length}
- Total Assets: ${totalAssets.length}
- Idle Assets: ${idleAssets.length} (${idleAssets.reduce((s, a) => s + a.valueUSD, 0).toFixed(2)} USD)
- Top Asset Concentration: ${concentration.toFixed(1)}%
- Average Gas Fee: $${avgGasUSD.toFixed(2)}

Provide insights for:
1. Idle asset yield opportunities
2. Diversification if concentration > 60%
3. Gas optimization or cross-chain opportunities

Return JSON:
{
  "insights": [
    {
      "type": "idle_asset" | "concentration_risk" | "yield_opportunity" | "gas_optimization",
      "title": "Short actionable title",
      "description": "2-3 sentence description",
      "confidence": "High" | "Medium" | "Low",
      "riskLevel": "Low Risk" | "Medium Risk" | "High Risk",
      "projectedGain": "Est. +$XXX/year",
      "actionButton": "Optimize Now" | "Diversify" | "Learn More",
      "actionType": "stake" | "swap" | "bridge" | "info",
      "actionParams": {
        "token": "USDC",
        "amount": "1000",
        "protocol": "Aave",
        "apy": "6.4"
      }
    }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const response = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '{"insights": []}';

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { insights: [] };

    // Delete old active insights
    await prisma.aIInsight.deleteMany({
      where: { userId, status: 'active' },
    });

    // Create new insights
    const insights = [];
    for (const insight of parsed.insights.slice(0, 3)) {
      const created = await prisma.aIInsight.create({
        data: {
          userId,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          riskLevel: insight.riskLevel,
          projectedGain: insight.projectedGain || null,
          actionButton: insight.actionButton,
          actionData: JSON.stringify({
            actionType: insight.actionType,
            params: insight.actionParams,
          }),
          status: 'active',
        },
      });
      insights.push(created);
    }

    return insights;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Fallback insights
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallets: { include: { assets: true } } },
    });

    if (!user) return [];

    const totalValue = user.wallets.reduce((sum, w) => sum + w.totalValueUSD, 0);
    
    await prisma.aIInsight.deleteMany({
      where: { userId, status: 'active' },
    });

    const fallbackInsight = await prisma.aIInsight.create({
      data: {
        userId,
        type: 'yield_opportunity',
        title: 'Deploy idle stablecoins into yield',
        description: `You have $${(totalValue * 0.3).toFixed(2)} in stablecoins that could be earning 5-8% APY in DeFi protocols like Aave or Compound.`,
        confidence: 'High',
        riskLevel: 'Low Risk',
        projectedGain: `Est. +$${((totalValue * 0.3 * 0.06)).toFixed(0)}/year`,
        actionButton: 'Optimize Now',
        actionData: JSON.stringify({
          actionType: 'stake',
          params: { protocol: 'Aave', apy: '6.4' },
        }),
        status: 'active',
      },
    });

    return [fallbackInsight];
  }
}

// Execute AI insight action
export async function executeInsightAction(insightId: string) {
  try {
    const insight = await prisma.aIInsight.findUnique({
      where: { id: insightId },
    });

    if (!insight || !insight.actionData) {
      return { success: false, message: 'Insight not found' };
    }

    const actionData = JSON.parse(insight.actionData);

    // Mark insight as executed
    await prisma.aIInsight.update({
      where: { id: insightId },
      data: { status: 'executed' },
    });

    // Return action instructions
    return {
      success: true,
      actionType: actionData.actionType,
      params: actionData.params,
      message: 'Action prepared. Execute via your wallet.',
      instructions: generateActionInstructions(actionData),
    };
  } catch (error) {
    console.error('Error executing insight action:', error);
    return { success: false, message: 'Failed to execute action' };
  }
}

function generateActionInstructions(actionData: any) {
  const { actionType, params } = actionData;

  switch (actionType) {
    case 'stake':
      return {
        steps: [
          `Visit ${params.protocol || 'Aave'} protocol`,
          `Connect your wallet`,
          `Select ${params.token || 'USDC'} to supply`,
          `Enter amount: $${params.amount || 'desired amount'}`,
          `Current APY: ${params.apy || '6-8'}%`,
          `Confirm transaction`,
        ],
        protocols: [
          { name: 'Aave', url: 'https://app.aave.com', apy: '6.4%' },
          { name: 'Compound', url: 'https://app.compound.finance', apy: '5.8%' },
          { name: 'Moonwell', url: 'https://moonwell.fi', apy: '7.2%' },
        ],
      };

    case 'swap':
      return {
        steps: [
          `Visit 1inch or Uniswap`,
          `Connect your wallet`,
          `Swap ${params.fromToken || 'current token'} to ${params.toToken || 'target token'}`,
          `Review slippage settings`,
          `Confirm swap`,
        ],
        dexes: [
          { name: '1inch', url: 'https://app.1inch.io' },
          { name: 'Uniswap', url: 'https://app.uniswap.org' },
        ],
      };

    case 'bridge':
      return {
        steps: [
          `Visit bridge protocol`,
          `Select source chain: ${params.fromChain || 'Ethereum'}`,
          `Select destination: ${params.toChain || 'Base'}`,
          `Enter amount to bridge`,
          `Confirm transaction`,
        ],
        bridges: [
          { name: 'Base Bridge', url: 'https://bridge.base.org' },
          { name: 'Hop Protocol', url: 'https://app.hop.exchange' },
        ],
      };

    default:
      return {
        message: 'Learn more about this opportunity in our documentation.',
      };
  }
}


