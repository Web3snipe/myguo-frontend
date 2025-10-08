# MyGuo Setup & Verification Checklist

Use this checklist to ensure everything is properly configured and working.

## 📋 Pre-Installation Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL running (`psql --version`)
- [ ] Redis running (`redis-cli ping`)
- [ ] Git installed (`git --version`)
- [ ] Code editor installed (VS Code, etc.)

## 📦 Installation Checklist

- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] No installation errors
- [ ] `node_modules/` folder created
- [ ] Lock file generated

## 🔑 API Keys Checklist

### Required Keys

- [ ] **Anthropic API Key** obtained from console.anthropic.com
  - [ ] Added to `.env` as `ANTHROPIC_API_KEY`
  - [ ] Key starts with `sk-ant-api03-`
  
- [ ] **Alchemy API Key** obtained from dashboard.alchemy.com
  - [ ] Added to `.env` as `ALCHEMY_API_KEY`
  - [ ] Added to `.env` as `NEXT_PUBLIC_ALCHEMY_API_KEY`
  - [ ] App created for all networks
  
- [ ] **Privy Credentials** obtained from dashboard.privy.io
  - [ ] Added to `.env` as `PRIVY_APP_ID`
  - [ ] Added to `.env` as `PRIVY_APP_SECRET`
  - [ ] Added to `.env` as `NEXT_PUBLIC_PRIVY_APP_ID`
  - [ ] App created and configured

### Optional Keys

- [ ] **CoinGecko API Key** (optional but recommended)
  - [ ] Added to `.env` as `COINGECKO_API_KEY`

## 🗄️ Database Checklist

- [ ] PostgreSQL server is running
- [ ] Database `myguo` created
- [ ] `DATABASE_URL` set in `.env`
- [ ] Connection string format correct
- [ ] Can connect to database (`psql $DATABASE_URL`)

### Prisma Setup

- [ ] `npm run prisma:generate` executed successfully
- [ ] Prisma Client generated in `node_modules/.prisma/client`
- [ ] `npm run prisma:migrate` executed successfully
- [ ] All 5 tables created (User, Wallet, Asset, Transaction, AIInsight)
- [ ] No migration errors
- [ ] Can open Prisma Studio (`npm run prisma:studio`)

## 🔴 Redis Checklist

- [ ] Redis server is running
- [ ] `REDIS_URL` set in `.env`
- [ ] Can ping Redis (`redis-cli ping` returns PONG)
- [ ] Default port 6379 is accessible

## ⚙️ Configuration Checklist

- [ ] `.env` file exists in project root
- [ ] All required variables are set
- [ ] No syntax errors in `.env`
- [ ] URLs are correct format
- [ ] No trailing spaces in values
- [ ] Quotes removed from values (if copied)

### Environment Variables Verification

```bash
# Run this to check if all required vars are set
cat .env | grep -E "ANTHROPIC_API_KEY|ALCHEMY_API_KEY|PRIVY_APP_ID|DATABASE_URL|REDIS_URL"
```

Expected output: All 5 variables should show with values

## 🚀 Launch Checklist

- [ ] `npm run dev` starts without errors
- [ ] Frontend starts on port 3000
- [ ] Backend starts on port 3001
- [ ] No TypeScript errors in console
- [ ] No database connection errors
- [ ] No Redis connection errors

### Console Output Verification

You should see:
```
✓ Ready in Xms
○ Compiling /
✓ Compiled /
✅ Redis connected successfully
🚀 Backend API server running on port 3001
```

## 🌐 Frontend Checklist

- [ ] Open http://localhost:3000 in browser
- [ ] Page loads without errors
- [ ] See "Welcome to MyGuo" message
- [ ] "Connect Wallet" button is visible
- [ ] Tailwind styles are applied (dark background)
- [ ] No console errors in browser DevTools

### Privy Authentication

- [ ] Click "Connect Wallet" button
- [ ] Privy modal appears
- [ ] Can connect with wallet or email
- [ ] Modal styling looks correct (dark theme)
- [ ] No authentication errors

### Dashboard Loading

- [ ] After connecting, dashboard loads
- [ ] See portfolio value (may be $0.00 initially)
- [ ] Chart renders without errors
- [ ] Sidebar shows wallet list
- [ ] Header shows connected wallet address
- [ ] Loading states work correctly

## 🔌 Backend API Checklist

### Health Check

- [ ] Visit http://localhost:3001/health
- [ ] Returns JSON: `{"status": "ok", "timestamp": "..."}`

### Test Endpoints

```bash
# Test login endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

- [ ] Login endpoint works
- [ ] Returns user object with ID
- [ ] No 500 errors

## 🤖 AI Features Checklist

### AI Insights

- [ ] Can click "Generate Insights" button
- [ ] Insights generate without errors
- [ ] See 3 AI insights displayed
- [ ] Insights have titles and descriptions
- [ ] Can click on insight to view details
- [ ] Modal opens with full insight
- [ ] Can dismiss insight

### Wallet Tagging

- [ ] Added wallets show AI tags
- [ ] Tags are relevant (e.g., "Active Trader", "HODLer")
- [ ] Tags appear in wallet list

## 💼 Portfolio Features Checklist

### Multi-Wallet Management

- [ ] Can click "+" to add wallet
- [ ] Modal opens for adding wallet
- [ ] Validation works (must start with 0x)
- [ ] Can add valid wallet address
- [ ] New wallet appears in list
- [ ] Wallet limit enforced (max 5)
- [ ] Can remove non-primary wallet
- [ ] Cannot remove primary wallet

### Portfolio Display

- [ ] Total value shows correctly
- [ ] Chart renders with data
- [ ] Can switch time periods (1D, 1W, 1M, etc.)
- [ ] Chart updates when period changes
- [ ] Percentage change shows correctly
- [ ] Colors match design (green for positive, red for negative)

### View Modes

- [ ] Can toggle between Aggregate and Individual view
- [ ] Aggregate shows combined portfolio
- [ ] Individual view shows dropdown
- [ ] Can select different wallet
- [ ] Values update when wallet selected

## 📊 Transaction Checklist

- [ ] Transaction table renders
- [ ] Shows recent transactions
- [ ] Columns display correctly (Token, Date, Action, Amount, Status, AI Label)
- [ ] Status badges show correct colors
- [ ] AI labels appear for transactions
- [ ] Dates format correctly ("Today 12:30", etc.)
- [ ] Can scroll through transactions

## 🎨 UI/UX Checklist

### Design Compliance

- [ ] Background is #0A0A0A (very dark)
- [ ] Primary purple is #7C3AED
- [ ] Success green is #10B981
- [ ] Buttons use gradient purple
- [ ] Cards have proper rounded corners
- [ ] Border colors match design
- [ ] Font sizes are consistent
- [ ] Spacing matches design

### Responsiveness

- [ ] Layout works on desktop (1920px)
- [ ] Layout works on laptop (1440px)
- [ ] Layout works on tablet (768px)
- [ ] Sidebar collapses on mobile
- [ ] No horizontal scroll
- [ ] Touch targets are large enough

### Interactions

- [ ] Buttons have hover states
- [ ] Loading states show correctly
- [ ] Modals open and close smoothly
- [ ] Form validation works
- [ ] Error messages display
- [ ] Success messages display

## 🔍 Testing Checklist

### Functional Testing

- [ ] Can complete full user flow (connect → add wallet → view portfolio)
- [ ] All buttons work
- [ ] All forms submit correctly
- [ ] All modals open/close
- [ ] Navigation works
- [ ] Logout works

### Edge Cases

- [ ] Invalid wallet address shows error
- [ ] Network errors show user-friendly message
- [ ] Empty states display correctly
- [ ] Loading states appear
- [ ] Can handle wallet with no balance
- [ ] Can handle wallet with no transactions

### Browser Testing

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Console has no errors

## 📈 Performance Checklist

- [ ] Page loads in < 3 seconds
- [ ] Smooth scrolling
- [ ] No layout shift
- [ ] Images load properly
- [ ] No memory leaks (check DevTools)
- [ ] API responses are fast (< 2s)

### Caching

- [ ] Blockchain data caches for 2 minutes
- [ ] Subsequent requests are faster
- [ ] Redis cache is being used (check logs)

## 🔒 Security Checklist

- [ ] No private keys in code
- [ ] No secrets in Git
- [ ] `.env` in `.gitignore`
- [ ] API keys not exposed in frontend
- [ ] CORS configured
- [ ] Rate limiting works
- [ ] Input validation works
- [ ] SQL injection prevented (Prisma)

## 📝 Documentation Checklist

- [ ] README.md is clear
- [ ] SETUP_GUIDE.md is helpful
- [ ] QUICKSTART.md works
- [ ] API_TESTING.md has correct examples
- [ ] DEPLOYMENT.md is comprehensive
- [ ] All code has comments where needed

## 🐛 Troubleshooting Checklist

If something doesn't work:

- [ ] Check console for errors
- [ ] Check network tab in DevTools
- [ ] Verify .env variables are correct
- [ ] Restart development server
- [ ] Clear browser cache
- [ ] Clear Redis cache (`redis-cli FLUSHALL`)
- [ ] Reset database (`npx prisma migrate reset`)
- [ ] Reinstall dependencies (`rm -rf node_modules && npm install`)
- [ ] Check documentation for solution
- [ ] Review troubleshooting sections

## ✅ Final Verification

Run through this complete user journey:

1. [ ] Open http://localhost:3000
2. [ ] Click "Connect Wallet"
3. [ ] Connect with Privy (email or wallet)
4. [ ] Dashboard loads with your primary wallet
5. [ ] Click "+" to add another wallet
6. [ ] Enter a valid address (use 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb for testing)
7. [ ] Wallet is added and shows data
8. [ ] Toggle to "Individual Wallet" view
9. [ ] Select different wallet from dropdown
10. [ ] Values update
11. [ ] Toggle back to "Aggregate View"
12. [ ] Click "Generate Insights" (if no insights)
13. [ ] View generated AI insights
14. [ ] Click on an insight to see details
15. [ ] Dismiss the insight
16. [ ] Scroll down to view transactions
17. [ ] Check transaction table displays correctly
18. [ ] Switch chart time period
19. [ ] Chart updates with new data
20. [ ] Everything works smoothly!

## 📊 Success Metrics

Your setup is successful if:

- ✅ All checklist items are complete
- ✅ No errors in browser console
- ✅ No errors in terminal
- ✅ Can complete full user journey
- ✅ UI matches Figma design
- ✅ Performance is acceptable
- ✅ All features work as expected

---

## 🎉 Congratulations!

If you've completed this checklist, your MyGuo Portfolio Manager is fully set up and ready to use!

**Next Steps:**
1. Explore all features
2. Test with real wallet data
3. Customize for your needs
4. Deploy to production (see DEPLOYMENT.md)

**Need Help?**
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Check [TROUBLESHOOTING](#troubleshooting-checklist) section
- Open an issue on GitHub
- Contact support team

Happy portfolio managing! 🚀


