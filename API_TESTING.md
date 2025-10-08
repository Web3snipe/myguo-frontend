# API Testing Guide

Test all MyGuo API endpoints with curl or Postman.

## Base URL

```
http://localhost:3001/api
```

## Authentication Endpoints

### 1. Login / Register User

Creates or retrieves a user by wallet address.

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "privyUserId": "user_123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "clxxxx",
    "primaryWalletAddress": "0x742d35cc...",
    "wallets": [...],
    "aiInsights": [...]
  }
}
```

### 2. Get Current User

Get user details (requires Privy auth token).

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_PRIVY_TOKEN"
```

## Wallet Endpoints

### 1. Add Wallet

Add a new wallet to user's account.

```bash
curl -X POST http://localhost:3001/api/wallets/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "clxxxx",
    "address": "0x1234567890123456789012345678901234567890"
  }'
```

**Response:**
```json
{
  "wallet": {
    "id": "clxxxx",
    "address": "0x1234...",
    "isPrimary": false,
    "aiTag": "Active Trader",
    "totalValueUSD": 5420.50
  }
}
```

### 2. Remove Wallet

Remove a non-primary wallet.

```bash
curl -X DELETE http://localhost:3001/api/wallets/clxxxx
```

**Response:**
```json
{
  "message": "Wallet removed successfully"
}
```

### 3. Get Wallet Balance

Fetch current balance and tokens for a wallet.

```bash
curl http://localhost:3001/api/wallets/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/balance
```

**Response:**
```json
{
  "address": "0x742d35cc...",
  "nativeBalance": "1.5",
  "nativeValueUSD": 3750.00,
  "tokens": [
    {
      "tokenAddress": "0xa0b8...",
      "symbol": "USDC",
      "name": "USD Coin",
      "balance": "1000.0",
      "decimals": 6,
      "valueUSD": 1000.00
    }
  ],
  "totalValueUSD": 4750.00,
  "lastUpdated": "2025-10-04T12:00:00Z"
}
```

### 4. Get Wallet Transactions

Fetch transaction history for a wallet.

```bash
curl http://localhost:3001/api/wallets/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/transactions?limit=10
```

**Response:**
```json
{
  "transactions": [
    {
      "hash": "0xabc123...",
      "type": "swap",
      "fromToken": "ETH",
      "toToken": "USDC",
      "amount": "0.5",
      "valueUSD": 1250.00,
      "gasUsed": "21000",
      "gasPrice": "50",
      "timestamp": "2025-10-04T10:30:00Z",
      "status": "success"
    }
  ]
}
```

## Portfolio Endpoints

### 1. Get Portfolio Summary

Get aggregated portfolio data for a user.

```bash
curl "http://localhost:3001/api/portfolio/summary?userId=clxxxx"
```

**Response:**
```json
{
  "totalValueUSD": 47250.50,
  "walletCount": 3,
  "topAssets": [
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "balance": 10.5,
      "valueUSD": 26250.00,
      "wallets": ["0x742d...", "0x1234..."]
    },
    {
      "symbol": "USDC",
      "name": "USD Coin",
      "balance": 15000.0,
      "valueUSD": 15000.00,
      "wallets": ["0x742d..."]
    }
  ],
  "lastUpdated": "2025-10-04T12:00:00Z"
}
```

### 2. Get Portfolio History

Get historical portfolio values for charts.

```bash
curl "http://localhost:3001/api/portfolio/history?userId=clxxxx&period=1W"
```

**Query Parameters:**
- `period`: 1D, 1W, 1M, 3M, 6M, 1Y

**Response:**
```json
{
  "history": [
    {
      "timestamp": "2025-09-27T00:00:00Z",
      "value": 45000.00
    },
    {
      "timestamp": "2025-09-28T00:00:00Z",
      "value": 46100.00
    },
    ...
  ]
}
```

## AI Endpoints

### 1. Generate AI Insights

Generate new AI insights for a user's portfolio.

```bash
curl -X POST http://localhost:3001/api/ai/generate-insights \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "clxxxx"
  }'
```

**Response:**
```json
{
  "insights": [
    {
      "type": "idle_asset",
      "title": "Deploy idle USDC into a 6.4% yield pool",
      "description": "You have $5,000 USDC sitting idle in your wallet...",
      "confidence": "High",
      "riskLevel": "Low Risk",
      "projectedGain": "Est. +$320/year",
      "actionButton": "Optimize Now"
    },
    {
      "type": "concentration_risk",
      "title": "Diversify your ETH holdings",
      "description": "ETH represents 82% of your portfolio...",
      "confidence": "High",
      "riskLevel": "Medium Risk",
      "projectedGain": null,
      "actionButton": "Diversify Now"
    }
  ],
  "generatedAt": "2025-10-04T12:00:00Z"
}
```

### 2. Get Active Insights

Retrieve active AI insights for a user.

```bash
curl "http://localhost:3001/api/ai/insights?userId=clxxxx"
```

**Response:**
```json
{
  "insights": [
    {
      "id": "clxxxx",
      "type": "yield_opportunity",
      "title": "Deploy idle USDC into a 6.4% yield pool",
      "description": "You have $5,000 USDC sitting idle...",
      "actionButton": "Optimize Now",
      "projectedGain": "Est. +$320/year",
      "confidence": "High",
      "riskLevel": "Low Risk",
      "status": "active",
      "createdAt": "2025-10-04T10:00:00Z"
    }
  ]
}
```

### 3. Update Insight Status

Dismiss or mark an insight as executed.

```bash
curl -X PATCH http://localhost:3001/api/ai/insights/clxxxx \
  -H "Content-Type: application/json" \
  -d '{
    "status": "dismissed"
  }'
```

**Valid Status Values:**
- `active` - Insight is active
- `dismissed` - User dismissed the insight
- `executed` - User acted on the insight

**Response:**
```json
{
  "insight": {
    "id": "clxxxx",
    "status": "dismissed",
    ...
  }
}
```

### 4. Generate Transaction Label

Generate AI label for a transaction.

```bash
curl -X POST http://localhost:3001/api/ai/label-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "transactionHash": "0xabc123...",
    "type": "swap",
    "gasUsed": "150000",
    "gasPrice": "100",
    "chain": "Ethereum"
  }'
```

**Response:**
```json
{
  "label": "High Gas Fee - Could save $12.50"
}
```

## Health Check

Check if backend is running.

```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-04T12:00:00Z"
}
```

## Postman Collection

### Import to Postman

1. Create new collection "MyGuo API"
2. Add all endpoints above
3. Set base URL as variable: `{{baseUrl}}` = `http://localhost:3001/api`
4. Add environment for local/production

### Sample Collection JSON

Save this as `MyGuo-API.postman_collection.json`:

```json
{
  "info": {
    "name": "MyGuo API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"walletAddress\": \"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

## Rate Limiting

API is rate limited to **100 requests per minute per IP**.

If you exceed the limit, you'll get:

```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

Wait 1 minute or implement request queuing in your client.

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here",
  "stack": "Stack trace (only in development)"
}
```

Common HTTP status codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid/missing auth token)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Testing Tips

### 1. Test Wallet Address

Use this test wallet (has public activity):
```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### 2. Generate Test User

```bash
USER_ID=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}' \
  | jq -r '.user.id')

echo "User ID: $USER_ID"
```

### 3. Full Workflow Test

```bash
# 1. Create user
USER_ID=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}' \
  | jq -r '.user.id')

# 2. Get portfolio
curl -s "http://localhost:3001/api/portfolio/summary?userId=$USER_ID" | jq

# 3. Generate insights
curl -s -X POST http://localhost:3001/api/ai/generate-insights \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\"}" | jq

# 4. Get insights
curl -s "http://localhost:3001/api/ai/insights?userId=$USER_ID" | jq
```

---

For frontend integration examples, see the `src/lib/api.ts` file.

