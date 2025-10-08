# MyGuo - AI Portfolio Manager

An AI-powered crypto portfolio manager with multi-wallet aggregation, intelligent insights, and comprehensive blockchain data integration.

![MyGuo Portfolio Manager](https://via.placeholder.com/800x400?text=MyGuo+AI+Portfolio+Manager)

## Features

- 🔐 **Privy Authentication** - Secure wallet connection with Privy SDK
- 🎯 **Multi-Wallet Management** - Connect up to 5 wallets with AI-generated tags
- 📊 **Portfolio Aggregation** - View combined portfolio or individual wallet performance
- 🤖 **AI Insights** - Get actionable recommendations powered by Anthropic Claude
- 📈 **Real-time Charts** - Beautiful portfolio performance visualization with Recharts
- 💼 **Transaction History** - Complete transaction tracking with AI-powered labels
- ⚡ **Multi-Chain Support** - Base, Ethereum, Arbitrum, and Polygon networks
- 🎨 **Modern UI** - Clean, dark-themed interface matching Figma design specifications

## Tech Stack

### Frontend
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for styling
- **Privy SDK** (@privy-io/react-auth) for authentication
- **Wagmi v2** and **Viem** for blockchain interactions
- **TanStack Query** for data fetching and caching
- **Recharts** for portfolio visualizations
- **Lucide React** for icons

### Backend
- **Node.js/Express** API server
- **PostgreSQL** with Prisma ORM
- **Redis** for caching
- **Anthropic Claude** for AI insights

### Blockchain & Data
- **Alchemy SDK** for multi-chain RPC connections
- **CoinGecko API** for token price data

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Redis server
- API Keys:
  - Privy App ID and Secret
  - Anthropic API Key
  - Alchemy API Key
  - CoinGecko API Key (optional)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd v1_myguo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/myguo

   # Redis
   REDIS_URL=redis://localhost:6379

   # Anthropic AI
   ANTHROPIC_API_KEY=sk-ant-...

   # Alchemy
   ALCHEMY_API_KEY=your_alchemy_api_key

   # CoinGecko
   COINGECKO_API_KEY=your_coingecko_api_key

   # Privy
   PRIVY_APP_ID=your_privy_app_id
   PRIVY_APP_SECRET=your_privy_app_secret
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

   # API
   NEXT_PUBLIC_API_URL=http://localhost:3001
   API_PORT=3001
   ```

4. **Set up the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Next.js frontend on `http://localhost:3000`
   - Express backend on `http://localhost:3001`

## Project Structure

```
v1_myguo/
├── backend/                 # Express API server
│   ├── lib/                # Utilities (Prisma, Redis, Alchemy, Anthropic)
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── server.ts           # Server entry point
├── prisma/                 # Database schema and migrations
│   └── schema.prisma
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   │   ├── activity/     # Activity feed
│   │   ├── ai/           # AI insights
│   │   ├── common/       # Shared components
│   │   ├── layout/       # Header, Sidebar
│   │   ├── portfolio/    # Portfolio charts and lists
│   │   ├── providers/    # Context providers
│   │   ├── transactions/ # Transaction table
│   │   └── wallet/       # Wallet management
│   ├── lib/              # Frontend utilities
│   └── types/            # TypeScript types
└── public/               # Static assets
```

## Key Features Explained

### 1. Multi-Wallet Management
- Connect your primary wallet via Privy authentication
- Add up to 4 additional wallets for monitoring
- Each wallet receives an AI-generated tag based on usage patterns
- View aggregate portfolio or individual wallet performance

### 2. AI-Powered Insights
The system analyzes your portfolio and generates actionable insights:
- **Idle Asset Detection** - Identifies tokens sitting idle and suggests yield opportunities
- **Concentration Risk** - Warns about over-concentration in single assets
- **Gas Optimization** - Analyzes transaction costs and suggests savings
- **Yield Opportunities** - Discovers cross-chain yield farming options

### 3. Portfolio Visualization
- Real-time portfolio value tracking
- Historical performance charts (1D, 1W, 1M, 3M, 6M, 1Y)
- Asset distribution breakdown
- Sparkline charts for individual tokens

### 4. Transaction Analysis
- Complete transaction history across all wallets
- AI-generated labels for optimization suggestions
- Status tracking (success, pending, failed)
- Gas cost analysis

### 5. Multi-Chain Support
Supports the following networks:
- **Base** (Chain ID: 8453)
- **Ethereum** (Chain ID: 1)
- **Arbitrum** (Chain ID: 42161)
- **Polygon** (Chain ID: 137)

## API Routes

### Authentication
- `POST /api/auth/login` - Login/register user with wallet address
- `GET /api/auth/me` - Get current user

### Wallets
- `POST /api/wallets/add` - Add new wallet
- `DELETE /api/wallets/:id` - Remove wallet
- `GET /api/wallets/:address/balance` - Get wallet balance
- `GET /api/wallets/:address/transactions` - Get transaction history

### Portfolio
- `GET /api/portfolio/summary` - Get aggregated portfolio
- `GET /api/portfolio/history` - Get historical values

### AI
- `POST /api/ai/generate-insights` - Generate AI insights
- `GET /api/ai/insights` - Get active insights
- `PATCH /api/ai/insights/:id` - Update insight status

## Caching Strategy

- **Blockchain Data**: 2 minutes cache in Redis
- **Token Prices**: 5 minutes cache
- **AI Insights**: 1 hour cache
- **Portfolio Summary**: 2 minutes cache

## Security Considerations

- All wallet connections are read-only
- No private keys or seed phrases are stored
- API rate limiting: 100 requests/minute per user
- All inputs are validated and sanitized
- CORS configured for production deployment

## Development Tips

1. **Database Migrations**
   ```bash
   npm run prisma:migrate
   ```

2. **View Database**
   ```bash
   npm run prisma:studio
   ```

3. **Type Generation**
   ```bash
   npm run prisma:generate
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Design Reference

The UI follows the Figma design specifications:
- **Background**: #0A0A0A
- **Primary (Purple)**: #7C3AED
- **Success (Green)**: #10B981
- **Danger (Red)**: #EF4444
- **Warning (Yellow)**: #F59E0B

[View Figma Design](https://www.figma.com/design/MUD4wte5FHS5mQNLYloE6I/Mygo?node-id=0-1&p=f&t=GiI4QSpGQ9l3GN4J-0)

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npm run prisma:generate`

### Redis Connection Issues
- Ensure Redis server is running
- Check REDIS_URL in .env

### Alchemy API Errors
- Verify ALCHEMY_API_KEY is correct
- Check rate limits on your Alchemy dashboard

### Privy Authentication Errors
- Ensure PRIVY_APP_ID and PRIVY_APP_SECRET are correct
- Check Privy dashboard for app configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team

---

Built with ❤️ using Next.js, Anthropic Claude, and Alchemy

