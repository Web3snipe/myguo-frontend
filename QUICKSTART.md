# QuickStart Guide - MyGuo Portfolio Manager

Get MyGuo running in 5 minutes!

## Prerequisites
- Node.js 18+
- PostgreSQL running on port 5432
- Redis running on port 6379

## 1. Install & Configure (2 minutes)

```bash
# Clone and install
git clone <repo-url>
cd v1_myguo
npm install

# Copy environment template
cp env.local.example .env

# Edit .env and add your API keys (see below)
nano .env
```

## 2. Minimum Required API Keys (1 minute)

You **MUST** have these three to run the app:

### Anthropic (AI insights)
- Get it: https://console.anthropic.com/ → "API Keys" → "Create Key"
- Add to .env: `ANTHROPIC_API_KEY=sk-ant-api03-...`

### Alchemy (blockchain data)
- Get it: https://dashboard.alchemy.com/ → "Create App" → Copy API Key
- Add to .env: `ALCHEMY_API_KEY=...` and `NEXT_PUBLIC_ALCHEMY_API_KEY=...`

### Privy (wallet auth)
- Get it: https://dashboard.privy.io/ → "Create App" → Copy App ID & Secret
- Add to .env:
  ```
  PRIVY_APP_ID=...
  PRIVY_APP_SECRET=...
  NEXT_PUBLIC_PRIVY_APP_ID=...
  ```

## 3. Database Setup (1 minute)

```bash
# Create database
psql postgres -c "CREATE DATABASE myguo;"

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myguo

# Run migrations
npm run prisma:generate
npm run prisma:migrate
```

## 4. Launch! (1 minute)

```bash
npm run dev
```

Open http://localhost:3000

## What You Should See

1. **Welcome screen** with "Connect Wallet" button
2. Click it → **Privy modal** appears
3. Connect wallet → **Dashboard loads** with:
   - Portfolio value
   - Charts
   - AI insights
   - Transaction history

## Troubleshooting

**Database connection error?**
```bash
psql postgres -c "SELECT version();"  # Is PostgreSQL running?
```

**Redis connection error?**
```bash
redis-cli ping  # Should return PONG
```

**Port already in use?**
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Prisma errors?**
```bash
rm -rf node_modules prisma/migrations
npm install
npm run prisma:migrate
```

## What's Next?

- **Add more wallets**: Click "+" in sidebar (up to 5 total)
- **Generate AI insights**: Click "Generate Insights" 
- **View transactions**: Scroll down to transaction table
- **Explore features**: Try aggregate vs individual wallet view

## Full Documentation

- [Complete Setup Guide](SETUP_GUIDE.md) - Detailed instructions
- [README](README.md) - Full feature documentation  
- [Deployment Guide](DEPLOYMENT.md) - Production deployment

## Common Issues

### "Cannot find module '@privy-io/react-auth'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Wallet won't connect
- Check `NEXT_PUBLIC_PRIVY_APP_ID` is set (with NEXT_PUBLIC_ prefix)
- Use http://localhost:3000 (not 127.0.0.1 or 0.0.0.0)
- Clear browser cache

### No blockchain data showing
- Verify `ALCHEMY_API_KEY` is correct
- Check Alchemy dashboard for rate limits
- Ensure wallet has some activity/balance

---

**Still stuck?** Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting.

