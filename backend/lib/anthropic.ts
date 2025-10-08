import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIInsightRequest {
  totalValue: number;
  walletCount: number;
  assets: Array<{
    symbol: string;
    name: string;
    valueUSD: number;
    percentage: number;
    lastActivity?: Date;
  }>;
  recentTransactions: Array<{
    type: string;
    amount: string;
    timestamp: Date;
  }>;
}

export interface AIInsight {
  type: 'idle_asset' | 'concentration_risk' | 'yield_opportunity' | 'gas_optimization';
  title: string;
  description: string;
  confidence: 'High' | 'Medium' | 'Low';
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  projectedGain?: string;
  actionButton: string;
}

export async function generatePortfolioInsights(data: AIInsightRequest): Promise<AIInsight[]> {
  const prompt = `You are an expert DeFi portfolio analyst. Analyze this portfolio data and generate 3 actionable insights.

Portfolio Data:
- Total Value: $${data.totalValue.toFixed(2)}
- Number of Wallets: ${data.walletCount}
- Asset Distribution: ${JSON.stringify(data.assets, null, 2)}
- Recent Transactions: ${JSON.stringify(data.recentTransactions.slice(0, 10), null, 2)}

Generate insights focusing on:
1. Idle asset detection → suggest specific yield opportunities with projected APY
2. Concentration risk → if any asset >80% of portfolio, recommend diversification
3. Gas optimization → analyze recent transactions for cost savings opportunities
4. Cross-chain yield → identify better yield rates on different chains

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "insights": [
    {
      "type": "idle_asset" | "concentration_risk" | "yield_opportunity" | "gas_optimization",
      "title": "Deploy idle USDC into a 6.4% yield pool",
      "description": "You have $X USDC sitting idle",
      "confidence": "High" | "Medium" | "Low",
      "riskLevel": "Low Risk" | "Medium Risk" | "High Risk",
      "projectedGain": "Est. +$120/year",
      "actionButton": "Optimize Now"
    }
  ]
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const parsed = JSON.parse(content.text);
      return parsed.insights.slice(0, 3);
    }

    return [];
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return [];
  }
}

export async function generateWalletTag(walletData: {
  transactionCount: number;
  stakeCount: number;
  swapCount: number;
  avgDaysBetweenTx: number;
  topTokens: string[];
}): Promise<string> {
  const prompt = `Analyze this wallet's transaction patterns and generate a single descriptive tag (2-3 words max).

Wallet Data:
- Total Transactions: ${walletData.transactionCount}
- Stake/Unstake Count: ${walletData.stakeCount}
- Swap Count: ${walletData.swapCount}
- Average Days Between Transactions: ${walletData.avgDaysBetweenTx}
- Top Tokens: ${walletData.topTokens.join(', ')}

Choose the most appropriate tag:
- "Yield Farmer": Many stake/unstake transactions, high DeFi protocol interaction
- "Dormant Capital": Low transaction frequency, assets sitting idle >90 days
- "Early Buyer": Old wallet with long-held positions, few trades
- "Active Trader": High swap frequency, diverse token history
- "HODLer": Minimal transactions, concentrated holdings, long positions

Return ONLY the tag name, nothing else.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text.trim().replace(/"/g, '');
    }

    return 'Portfolio Holder';
  } catch (error) {
    console.error('Error generating wallet tag:', error);
    return 'Portfolio Holder';
  }
}

export async function generateTransactionLabel(txData: {
  type: string;
  gasUsed: string;
  gasPrice: string;
  chain: string;
  optimalGas?: string;
}): Promise<string> {
  const prompt = `Analyze this transaction and provide an optimization insight if applicable:
- Transaction Type: ${txData.type}
- Gas Used: ${txData.gasUsed} at price ${txData.gasPrice}
- Current Optimal Gas: ${txData.optimalGas || 'unknown'}
- Chain: ${txData.chain}

If gas was >10% higher than optimal, suggest: "High Gas Fee - Could save $X"
If bridge was used, compare to alternatives and suggest cheaper option
If transaction enables yield, calculate and show: "Yield Optimization - Now earning X%"
If everything optimal, return: "No anomalies detected"

Return ONLY the label text, nothing else.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text.trim();
    }

    return 'No anomalies detected';
  } catch (error) {
    console.error('Error generating transaction label:', error);
    return 'No anomalies detected';
  }
}

export default anthropic;

