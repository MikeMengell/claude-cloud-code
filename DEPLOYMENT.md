# Deployment Guide

## Quick Deploy Options

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to your Vercel project settings
   - Add environment variables from `.env.example`
   - Redeploy

### Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

### Docker

1. **Build Image**
   ```bash
   docker build -t statement-ai .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 --env-file .env statement-ai
   ```

---

## Production Checklist

### Security

- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS policies
- [ ] Set up rate limiting
- [ ] Implement authentication (NextAuth.js recommended)
- [ ] Add webhook signature verification
- [ ] Set up API key management
- [ ] Configure Content Security Policy headers

### Database

- [ ] Set up PostgreSQL or MongoDB
- [ ] Configure connection pooling
- [ ] Set up automated backups
- [ ] Implement data retention policies
- [ ] Create database indexes for performance

### File Storage

- [ ] Configure AWS S3 or similar cloud storage
- [ ] Set up automatic file cleanup
- [ ] Implement virus scanning for uploads
- [ ] Configure CDN for downloads

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure logging (Winston, Pino)
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring (New Relic, Datadog)
- [ ] Set up alerting for critical errors

### Performance

- [ ] Enable caching (Redis)
- [ ] Configure CDN (Cloudflare, AWS CloudFront)
- [ ] Optimize images and assets
- [ ] Implement API response caching
- [ ] Set up load balancing

### Payment Integration

- [ ] Set up Stripe or payment processor
- [ ] Configure webhook endpoints
- [ ] Implement subscription management
- [ ] Set up usage-based billing
- [ ] Configure tax calculations

### Email

- [ ] Configure SMTP or email service (SendGrid, AWS SES)
- [ ] Set up email templates
- [ ] Configure transactional emails
- [ ] Set up email notifications

---

## Environment Variables

### Required for Production

```bash
# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Cloud Storage
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=statement-files
AWS_REGION=us-east-1

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-here

# Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# API
API_SECRET_KEY=your-api-secret
WEBHOOK_SECRET=your-webhook-secret
```

---

## Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

---

## Database Schema

### PostgreSQL

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage tracking
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  conversions_used INTEGER DEFAULT 0,
  conversions_limit INTEGER DEFAULT 10,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversions log
CREATE TABLE conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  file_name VARCHAR(255),
  file_size BIGINT,
  format VARCHAR(50),
  status VARCHAR(50),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  url VARCHAR(500) NOT NULL,
  events TEXT[] NOT NULL,
  secret VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_usage_user_id ON usage(user_id);
CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_created_at ON conversions(created_at);
CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);
```

---

## Scaling Considerations

### Horizontal Scaling

- Deploy multiple instances behind a load balancer
- Use Redis for session storage
- Implement job queue (Bull, BullMQ) for async processing
- Use database read replicas

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching strategies
- Use CDN for static assets

### Cost Optimization

- Implement intelligent caching
- Use serverless functions for sporadic tasks
- Optimize image sizes
- Implement lazy loading
- Use spot instances for batch processing

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

### Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  width={800}
  height={600}
  alt="Hero"
  priority
/>
```

### API Route Caching

```typescript
export async function GET(request: Request) {
  const data = await fetchData()

  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
```

---

## Monitoring Setup

### Sentry Integration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV
})
```

### Custom Analytics

```typescript
// lib/analytics.ts
export function trackConversion(userId: string, format: string) {
  // Send to your analytics platform
  analytics.track('Conversion', {
    userId,
    format,
    timestamp: new Date().toISOString()
  })
}
```

---

## Backup Strategy

### Database Backups

```bash
# Daily automated backups
0 2 * * * pg_dump -U user dbname | gzip > backup-$(date +\%Y\%m\%d).sql.gz
```

### File Backups

```bash
# Sync to backup bucket
aws s3 sync s3://primary-bucket s3://backup-bucket --storage-class GLACIER
```

---

## Support

For deployment assistance:
- Documentation: https://docs.your-domain.com/deployment
- Email: devops@your-domain.com
- Discord: https://discord.gg/your-server
