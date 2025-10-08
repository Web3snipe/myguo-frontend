import { prisma } from '../lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Generate portfolio rebalancing recommendations
export async function generateRebalancingPlan(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: {
          include: {
            assets: {
              orderBy: { valueUSD: 'desc' },
            },
          },
        },
      },
    });

    if (!user) return null;

    const allAssets = user.wallets.flatMap(w => w.assets);
    const totalValue = allAssets.reduce((sum, a) => sum + a.valueUSD, 0);

    // Calculate current allocation
    const allocation = allAssets.map(asset => ({
      symbol: asset.symbol,
      value: asset.valueUSD,
      percentage: (asset.valueUSD / totalValue) * 100,
      balance: asset.balance,
    }));

    const prompt = `You are an expert DeFi portfolio manager. Analyze this portfolio and provide specific rebalancing recommendations.

Current Portfolio:
Total Value: $${totalValue.toFixed(2)}
Assets:
${allocation.slice(0, 10).map(a => `- ${a.symbol}: $${a.value.toFixed(2)} (${a.percentage.toFixed(1)}%)`).join('\n')}

Rules:
1. Optimal portfolio: 40% stablecoins, 30% ETH, 20% BTC, 10% altcoins
2. Maximum single asset: 40% of portfolio
3. Minimum stablecoin buffer: 20%
4. Suggest specific swap amounts

Return JSON:
{
  "needsRebalancing": true/false,
  "riskLevel": "High" | "Medium" | "Low",
  "recommendations": [
    {
      "action": "sell" | "buy",
      "token": "ETH",
      "amount": "0.5",
      "valueUSD": 2000,
      "reason": "Reduce ETH concentration from 60% to 30%",
      "targetToken": "USDC",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "targetAllocation": {
    "USDC": 40,
    "ETH": 30,
    "BTC": 20,
    "Others": 10
  },
  "projectedBenefit": "Reduced risk by 40%, better diversification"
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
      : '{}';

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const plan = JSON.parse(jsonMatch[0]);

    // Store rebalancing plan as insight
    if (plan.needsRebalancing && plan.recommendations?.length > 0) {
      await prisma.aIInsight.create({
        data: {
          userId,
          type: 'portfolio_rebalance',
          title: `Rebalance Portfolio - ${plan.riskLevel} Risk Detected`,
          description: `Your portfolio needs rebalancing. ${plan.projectedBenefit}. ${plan.recommendations.length} recommended swaps.`,
          confidence: 'High',
          riskLevel: plan.riskLevel === 'High' ? 'High Risk' : plan.riskLevel === 'Medium' ? 'Medium Risk' : 'Low Risk',
          projectedGain: plan.projectedBenefit,
          actionButton: 'Rebalance Now',
          actionData: JSON.stringify({
            actionType: 'rebalance',
            params: plan,
          }),
          status: 'active',
        },
      });
    }

    return plan;
  } catch (error) {
    console.error('Error generating rebalancing plan:', error);
    return null;
  }
}

// Generate yield optimization recommendations with specific protocols
export async function generateYieldOptimization(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: {
          include: {
            assets: true,
          },
        },
      },
    });

    if (!user) return [];

    const allAssets = user.wallets.flatMap(w => w.assets);
    
    // Find stablecoins and idle assets
    const stablecoins = allAssets.filter(a => 
      ['USDC', 'USDT', 'DAI', 'FRAX'].includes(a.symbol)
    );
    const stablecoinValue = stablecoins.reduce((sum, a) => sum + a.valueUSD, 0);

    const ethAssets = allAssets.filter(a => a.symbol === 'ETH');
    const ethValue = ethAssets.reduce((sum, a) => sum + a.valueUSD, 0);

    const opportunities = [];

    // Stablecoin yield opportunities
    if (stablecoinValue > 100) {
      const bestProtocols = [
        { name: 'Aave', apy: 6.4, riskLevel: 'Low' },
        { name: 'Compound', apy: 5.8, riskLevel: 'Low' },
        { name: 'Moonwell (Base)', apy: 7.2, riskLevel: 'Low' },
        { name: 'Yearn Finance', apy: 8.1, riskLevel: 'Medium' },
      ];

      opportunities.push({
        type: 'stablecoin_yield',
        title: `Earn ${bestProtocols[0].apy}% APY on $${stablecoinValue.toFixed(0)} Stablecoins`,
        description: `Your ${stablecoins[0]?.symbol || 'stablecoins'} are idle. Deploy them to ${bestProtocols[0].name} to earn yield.`,
        projectedYield: (stablecoinValue * bestProtocols[0].apy / 100).toFixed(2),
        protocols: bestProtocols,
        actionData: {
          token: stablecoins[0]?.symbol || 'USDC',
          amount: stablecoinValue.toFixed(2),
          recommendedProtocol: bestProtocols[0].name,
          apy: bestProtocols[0].apy,
        },
      });
    }

    // ETH staking opportunities
    if (ethValue > 0.1) {
      opportunities.push({
        type: 'eth_staking',
        title: `Stake ETH for ${3.5}% APY`,
        description: `Stake your ETH via liquid staking protocols to earn rewards while maintaining liquidity.`,
        projectedYield: (ethValue * 3.5 / 100).toFixed(2),
        protocols: [
          { name: 'Lido', apy: 3.5, riskLevel: 'Low' },
          { name: 'Rocket Pool', apy: 3.3, riskLevel: 'Low' },
          { name: 'Coinbase Wrapped', apy: 3.1, riskLevel: 'Low' },
        ],
        actionData: {
          token: 'ETH',
          amount: ethValue.toFixed(4),
          recommendedProtocol: 'Lido',
          apy: 3.5,
        },
      });
    }

    // Create insights for each opportunity
    for (const opp of opportunities.slice(0, 2)) {
      await prisma.aIInsight.create({
        data: {
          userId,
          type: 'yield_optimization',
          title: opp.title,
          description: opp.description,
          confidence: 'High',
          riskLevel: opp.protocols[0].riskLevel === 'Low' ? 'Low Risk' : 'Medium Risk',
          projectedGain: `Est. +$${opp.projectedYield}/year`,
          actionButton: 'Deploy Now',
          actionData: JSON.stringify({
            actionType: 'stake',
            params: opp.actionData,
            protocols: opp.protocols,
          }),
          status: 'active',
        },
      });
    }

    return opportunities;
  } catch (error) {
    console.error('Error generating yield optimization:', error);
    return [];
  }
}

// Generate gas optimization recommendations
export async function generateGasOptimization(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: {
          include: {
            transactions: {
              orderBy: { timestamp: 'desc' },
              take: 50,
            },
          },
        },
      },
    });

    if (!user) return null;

    const allTxs = user.wallets.flatMap(w => w.transactions);
    
    // Calculate average gas costs
    const totalGas = allTxs.reduce((sum, tx) => {
      const gasInEth = parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice) / 1e18;
      return sum + gasInEth * 4500; // Approximate ETH price
    }, 0);

    const avgGasPerTx = totalGas / (allTxs.length || 1);

    // Estimate savings from L2s
    const potentialSavings = totalGas * 0.7; // 70% cheaper on L2s

    await prisma.aIInsight.create({
      data: {
        userId,
        type: 'gas_optimization',
        title: 'Save up to 70% on Gas Fees',
        description: `You've spent $${totalGas.toFixed(2)} on gas in recent transactions. Moving to Base or Arbitrum could save you $${potentialSavings.toFixed(2)} per month.`,
        confidence: 'High',
        riskLevel: 'Low Risk',
        projectedGain: `Est. savings: $${potentialSavings.toFixed(0)}/month`,
        actionButton: 'Switch to L2',
        actionData: JSON.stringify({
          actionType: 'bridge',
          params: {
            fromChain: 'Ethereum',
            toChain: 'Base',
            savings: potentialSavings.toFixed(2),
          },
          bridges: [
            { name: 'Base Bridge', url: 'https://bridge.base.org', fee: '$1-2' },
            { name: 'Hop Protocol', url: 'https://app.hop.exchange', fee: '$2-5' },
          ],
        }),
        status: 'active',
      },
    });

    return { totalGas, avgGasPerTx, potentialSavings };
  } catch (error) {
    console.error('Error generating gas optimization:', error);
    return null;
  }
}


