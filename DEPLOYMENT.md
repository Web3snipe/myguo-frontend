# Deployment Guide

This guide covers deploying MyGuo Portfolio Manager to production.

## Prerequisites

- Node.js 18+ installed on server
- PostgreSQL database (managed or self-hosted)
- Redis instance (managed or self-hosted)
- All required API keys

## Environment Setup

### Required Environment Variables

Create a `.env` file in production with these variables:

```env
# Database - Use your production PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host:5432/myguo?sslmode=require

# Redis - Use your production Redis connection string
REDIS_URL=redis://user:password@host:6379

# API Keys
ANTHROPIC_API_KEY=your-production-key
ALCHEMY_API_KEY=your-production-key
COINGECKO_API_KEY=your-production-key
PRIVY_APP_ID=your-production-app-id
PRIVY_APP_SECRET=your-production-secret
NEXT_PUBLIC_PRIVY_APP_ID=your-production-app-id

# Production URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
API_PORT=3001

NODE_ENV=production
```

## Deployment Options

### Option 1: Vercel (Frontend) + Self-hosted Backend

#### Deploy Frontend to Vercel

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Deploy

3. **Configure API Proxy**
   
   Update `next.config.js` to point to your backend:
   ```javascript
   async rewrites() {
     return [
       {
         source: '/api/:path*',
         destination: 'https://api.yourdomain.com/api/:path*',
       },
     ];
   }
   ```

#### Deploy Backend

1. **Set up server** (DigitalOcean, AWS EC2, etc.)
   ```bash
   # SSH into your server
   ssh user@your-server-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Clone repository
   git clone <your-repo-url>
   cd v1_myguo
   ```

2. **Install dependencies and build**
   ```bash
   npm install
   npm run prisma:generate
   npm run build
   ```

3. **Set up database**
   ```bash
   # Run migrations
   npm run prisma:migrate

   # Verify connection
   npm run prisma:studio
   ```

4. **Start with PM2**
   ```bash
   # Start backend server
   pm2 start dist/backend/server.js --name myguo-backend

   # Start Next.js (if hosting on same server)
   pm2 start npm --name myguo-frontend -- start

   # Save PM2 process list
   pm2 save

   # Set up PM2 to start on boot
   pm2 startup
   ```

5. **Configure Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Docker Deployment

#### Create Docker Files

**Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Build application
RUN npm run build

# Expose ports
EXPOSE 3000 3001

# Start application
CMD ["npm", "start"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myguo
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  app:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/myguo
      REDIS_URL: redis://redis:6379
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      ALCHEMY_API_KEY: ${ALCHEMY_API_KEY}
      PRIVY_APP_ID: ${PRIVY_APP_ID}
      PRIVY_APP_SECRET: ${PRIVY_APP_SECRET}
    ports:
      - "3000:3000"
      - "3001:3001"
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

#### Deploy with Docker

```bash
# Build and start containers
docker-compose up -d

# Run migrations
docker-compose exec app npm run prisma:migrate

# View logs
docker-compose logs -f app
```

### Option 3: Railway

1. **Push to GitHub**
2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Add PostgreSQL and Redis services
   - Configure environment variables
3. **Deploy**
   - Railway will automatically deploy on push

## Database Migrations in Production

```bash
# Always backup database before migrations
pg_dump $DATABASE_URL > backup.sql

# Run migrations
npm run prisma:migrate

# If issues occur, restore backup
psql $DATABASE_URL < backup.sql
```

## Monitoring

### Set up PM2 Monitoring (if using PM2)

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart if issues
pm2 restart all
```

### Application Monitoring

Consider setting up:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **New Relic** or **DataDog** for APM

## Security Checklist

- [ ] All API keys stored in environment variables
- [ ] Database uses SSL/TLS connection
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled
- [ ] Helmet.js middleware installed
- [ ] Regular security updates applied
- [ ] Database backups automated
- [ ] Redis password protected
- [ ] Server firewall configured
- [ ] HTTPS/SSL certificate installed

## Performance Optimization

1. **Enable Production Mode**
   ```env
   NODE_ENV=production
   ```

2. **Configure Redis Cache**
   - Increase cache duration for stable data
   - Monitor Redis memory usage
   - Set up Redis eviction policy

3. **Database Optimization**
   - Add indexes for frequently queried fields
   - Set up connection pooling
   - Monitor slow queries

4. **CDN for Static Assets**
   - Use Vercel's Edge Network
   - Or configure CloudFront/Cloudflare

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/myguo_$DATE.sql
```

### Redis Backup

```bash
# Redis automatically saves to dump.rdb
# Copy to backup location
cp /var/lib/redis/dump.rdb backups/redis_backup_$(date +%Y%m%d).rdb
```

## Troubleshooting Production Issues

### Check Logs

```bash
# PM2 logs
pm2 logs myguo-backend --lines 100

# Docker logs
docker-compose logs app --tail=100

# System logs
journalctl -u nginx -n 100
```

### Common Issues

1. **Database Connection Timeout**
   - Check if database is accessible
   - Verify connection string
   - Check firewall rules

2. **Redis Connection Failed**
   - Ensure Redis is running
   - Check REDIS_URL
   - Verify authentication

3. **API Rate Limiting**
   - Monitor Alchemy dashboard
   - Consider upgrading plan
   - Implement request queuing

## Scaling

### Horizontal Scaling

1. **Load Balancer Setup**
   - Use Nginx or AWS ALB
   - Distribute traffic across instances

2. **Database Scaling**
   - Read replicas for heavy read operations
   - Connection pooling with PgBouncer

3. **Redis Clustering**
   - Set up Redis Cluster for high availability
   - Use Redis Sentinel for automatic failover

## Support

For production issues:
- Check logs first
- Review monitoring dashboards
- Contact support team

---

Last updated: $(date)

