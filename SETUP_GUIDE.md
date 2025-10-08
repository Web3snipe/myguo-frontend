# MyGuo Portfolio Manager - Setup Guide

Complete step-by-step guide to get MyGuo running on your local machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [API Keys Setup](#api-keys-setup)
5. [Database Setup](#database-setup)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js 18+**
   ```bash
   # Check version
   node --version
   
   # Install via nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **PostgreSQL 14+**
   
   **macOS (Homebrew):**
   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   ```
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```
   
   **Windows:**
   - Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Use default port 5432

3. **Redis 7+**
   
   **macOS (Homebrew):**
   ```bash
   brew install redis
   brew services start redis
   ```
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt install redis-server
   sudo systemctl start redis-server
   ```
   
   **Windows:**
   - Download from [redis.io](https://redis.io/download)
   - Or use Docker: `docker run -d -p 6379:6379 redis:7-alpine`

### Verify Installation

```bash
# Check Node.js
node --version  # Should output v18.x.x or higher

# Check PostgreSQL
psql --version  # Should output psql (PostgreSQL) 14.x or higher

# Check Redis
redis-cli ping  # Should output PONG
```

---

## Quick Start

For experienced developers, use the automated setup script:

```bash
# Clone repository
git clone <repository-url>
cd v1_myguo

# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh

# Start development server
npm run dev
```

---

## Detailed Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd v1_myguo

# Install all npm packages
npm install
```

This will install:
- Next.js 14 and React
- Express and backend dependencies
- Prisma ORM
- All blockchain SDKs (Alchemy, Wagmi, Viem)
- Privy authentication
- Anthropic AI SDK
- And more...

### Step 2: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE myguo;

# Create user (optional)
CREATE USER myguo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE myguo TO myguo_user;

# Exit
\q
```

**Your connection string will be:**
```
postgresql://myguo_user:your_password@localhost:5432/myguo
```

Or for default user:
```
postgresql://postgres:postgres@localhost:5432/myguo
```

### Step 3: Set Up Environment Variables

Copy the example environment file:

```bash
cp env.local.example .env
```

Edit `.env` with your favorite editor:

```bash
# Use nano, vim, or any editor
nano .env
```

**Required Configuration:**

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myguo

# Redis
REDIS_URL=redis://localhost:6379

# Get these keys from the links in the next section
ANTHROPIC_API_KEY=sk-ant-api03-...
ALCHEMY_API_KEY=...
PRIVY_APP_ID=...
PRIVY_APP_SECRET=...
NEXT_PUBLIC_PRIVY_APP_ID=...

# Local URLs (don't change for development)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_PORT=3001
```

### Step 4: Run Database Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# Optional: Open Prisma Studio to view database
npm run prisma:studio
```

This creates the following tables:
- User
- Wallet
- Asset
- Transaction
- AIInsight

### Step 5: Start Development Server

```bash
# Start both frontend and backend
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

You should see:
```
✔ Starting...
✔ Ready in Xms
○ Compiling / ...
✓ Compiled / 
🚀 Backend API server running on port 3001
```

### Step 6: Open Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the MyGuo welcome screen with a "Connect Wallet" button.

---

## API Keys Setup

### 1. Anthropic (Claude AI) - REQUIRED

Used for generating AI insights and wallet analysis.

**Get your key:**
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Go to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-api03-`)

**Add to .env:**
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

**Pricing:** Free tier includes $5 credit, Claude Sonnet costs ~$3/$15 per 1M tokens

### 2. Alchemy - REQUIRED

Used for blockchain RPC connections (Base, Ethereum, Arbitrum, Polygon).

**Get your key:**
1. Go to [dashboard.alchemy.com](https://dashboard.alchemy.com/)
2. Sign up or log in
3. Click "Create App"
4. Select "All Networks" or choose specific chains
5. Copy the API key

**Add to .env:**
```env
ALCHEMY_API_KEY=your-alchemy-key-here
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-key-here
```

**Pricing:** Free tier includes 300M compute units/month (sufficient for development)

### 3. Privy - REQUIRED

Used for wallet authentication and connection.

**Get your credentials:**
1. Go to [dashboard.privy.io](https://dashboard.privy.io/)
2. Sign up or log in
3. Create a new app
4. Note your App ID
5. Go to "Settings" → "Basics" for App Secret

**Add to .env:**
```env
PRIVY_APP_ID=your-app-id-here
PRIVY_APP_SECRET=your-app-secret-here
NEXT_PUBLIC_PRIVY_APP_ID=your-app-id-here
```

**Pricing:** Free tier includes 1,000 MAUs (Monthly Active Users)

### 4. CoinGecko - OPTIONAL

Used for token price data. Free tier works but has rate limits.

**Get your key:**
1. Go to [coingecko.com/en/api](https://www.coingecko.com/en/api)
2. Sign up for free tier
3. Get your API key from dashboard

**Add to .env:**
```env
COINGECKO_API_KEY=your-coingecko-key-here
```

**Note:** App will work without this, but with limited price data accuracy.

---

## Database Setup

### Schema Overview

The database consists of 5 main tables:

1. **User** - Stores user accounts (linked to wallet addresses)
2. **Wallet** - Multiple wallets per user (1 primary + up to 4 additional)
3. **Asset** - Token holdings for each wallet
4. **Transaction** - Transaction history across all wallets
5. **AIInsight** - AI-generated recommendations for users

### Viewing Database

```bash
# Open Prisma Studio (GUI for database)
npm run prisma:studio
```

Opens at http://localhost:5555

### Common Database Commands

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Create new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Update Prisma Client after schema changes
npx prisma generate

# Seed database with test data
npx prisma db seed
```

### Database Backup

```bash
# Backup database
pg_dump myguo > backup.sql

# Restore database
psql myguo < backup.sql
```

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify connection string in `.env`:
   ```bash
   psql "postgresql://postgres:postgres@localhost:5432/myguo"
   ```

3. Check firewall isn't blocking port 5432

### Issue: "Redis connection refused"

**Solution:**
1. Check Redis is running:
   ```bash
   redis-cli ping  # Should return PONG
   ```

2. Start Redis if stopped:
   ```bash
   # macOS
   brew services start redis
   
   # Linux
   sudo systemctl start redis-server
   ```

3. Verify REDIS_URL in `.env`

### Issue: "Privy authentication fails"

**Solution:**
1. Verify `PRIVY_APP_ID` matches in `.env` and Privy dashboard
2. Check `NEXT_PUBLIC_PRIVY_APP_ID` is set (must have NEXT_PUBLIC_ prefix)
3. Ensure you're using http://localhost:3000 (not 127.0.0.1)
4. Clear browser cache and cookies

### Issue: "Alchemy API rate limit exceeded"

**Solution:**
1. Check usage in Alchemy dashboard
2. Reduce polling frequency in code
3. Upgrade Alchemy plan if needed
4. Implement request queuing

### Issue: "npm run dev" fails

**Solution:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```

3. Ensure ports 3000 and 3001 aren't in use:
   ```bash
   lsof -ti:3000 | xargs kill -9
   lsof -ti:3001 | xargs kill -9
   ```

### Issue: "Prisma migration fails"

**Solution:**
1. Reset database:
   ```bash
   npx prisma migrate reset
   ```

2. Regenerate client:
   ```bash
   npx prisma generate
   ```

3. Run migrations again:
   ```bash
   npx prisma migrate dev
   ```

### Issue: Port already in use

**Find and kill process:**
```bash
# Find process on port 3000
lsof -ti:3000

# Kill process
kill -9 <PID>

# Or kill all Node processes
killall node
```

### Issue: TypeScript errors

**Solution:**
```bash
# Regenerate TypeScript definitions
npm run prisma:generate

# Check for type errors
npx tsc --noEmit
```

---

## Development Workflow

### 1. Daily Development

```bash
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Start dev server
npm run dev
```

### 2. Making Database Changes

```bash
# Edit prisma/schema.prisma
nano prisma/schema.prisma

# Create migration
npm run prisma:migrate

# Generate new client
npm run prisma:generate
```

### 3. Testing API Endpoints

Use tools like:
- **Postman** - GUI for API testing
- **curl** - Command line
- **Insomnia** - Alternative to Postman

Example:
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x1234..."}'
```

### 4. Viewing Logs

```bash
# Backend logs are in console where you ran npm run dev

# Watch specific log file (if configured)
tail -f logs/backend.log
```

---

## Next Steps

Once everything is running:

1. **Connect a Wallet** - Click "Connect Wallet" and authenticate with Privy
2. **Add Additional Wallets** - Use the "+" button in sidebar to add more wallets
3. **View Portfolio** - See your aggregated portfolio value and charts
4. **Generate AI Insights** - Click to generate personalized recommendations
5. **Explore Transactions** - View transaction history with AI labels

---

## Getting Help

If you encounter issues not covered here:

1. Check the main [README.md](README.md)
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
3. Open an issue on GitHub
4. Check Privy/Alchemy/Anthropic documentation

---

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Privy Documentation](https://docs.privy.io/)
- [Alchemy Documentation](https://docs.alchemy.com/)
- [Anthropic Documentation](https://docs.anthropic.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

Happy coding! 🚀

