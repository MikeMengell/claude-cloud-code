# Deploying StatementAI to Vercel

This guide covers two deployment options for StatementAI on Vercel.

## Why Vercel?

✅ **Full Next.js Support**
- API routes work perfectly
- Server-side rendering (SSR)
- Incremental static regeneration (ISR)
- Edge functions
- Image optimization

✅ **Developer Experience**
- Zero configuration for Next.js
- Automatic HTTPS
- Global CDN
- Preview deployments for every PR
- Built-in analytics

✅ **Free Tier**
- Generous free tier
- Perfect for side projects and startups
- Upgrade as you scale

---

## Option 1: Vercel GitHub Integration (Recommended - 5 Minutes)

This is the **easiest and recommended approach**. Vercel automatically deploys on every push.

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub** (recommended)
4. Authorize Vercel to access your repositories

### Step 2: Import Your Project

1. Click **Add New...** → **Project**
2. Find `claude-cloud-code` in the repository list
3. Click **Import**

### Step 3: Configure Project (Use Defaults)

Vercel auto-detects Next.js:
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### Step 4: Add Environment Variables (Optional)

If you have environment variables:
```
NODE_ENV=production
# Add any other secrets here
```

### Step 5: Deploy!

1. Click **Deploy**
2. Wait 2-3 minutes for build
3. Your app is live! 🎉

**Your URLs:**
- **Production**: `https://your-project.vercel.app`
- **Custom Domain**: Add in Project Settings → Domains

### Automatic Deployments

Now every time you push to GitHub:
- **Push to `main`** → Deploys to production
- **Open a PR** → Creates preview deployment
- **Push to branch** → Updates preview

---

## Option 2: GitHub Actions Pipeline (Advanced Control)

Use this if you want to control deployments via GitHub Actions.

### Step 1: Get Vercel Credentials

1. Install Vercel CLI locally:
   ```bash
   npm i -g vercel
   ```

2. Login and link project:
   ```bash
   vercel login
   cd /path/to/your/project
   vercel link
   ```

3. Get your credentials:
   ```bash
   # This creates .vercel/project.json
   cat .vercel/project.json
   ```

   You'll see:
   ```json
   {
     "orgId": "team_xxxxxxxxxxxxx",
     "projectId": "prj_xxxxxxxxxxxxx"
   }
   ```

4. Get your Vercel token:
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Click **Create Token**
   - Name: `GitHub Actions`
   - Scope: Full Account
   - Copy the token (you won't see it again!)

### Step 2: Add GitHub Secrets

1. Go to your GitHub repo
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these three secrets:

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `VERCEL_TOKEN` | Your Vercel token | From Step 1.4 above |
| `VERCEL_ORG_ID` | Your org/team ID | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your project ID | From `.vercel/project.json` |

**Example:**
```
VERCEL_TOKEN: ABC123xyz...
VERCEL_ORG_ID: team_abc123xyz
VERCEL_PROJECT_ID: prj_abc123xyz
```

### Step 3: Enable the Workflow

The workflow is already created at `.github/workflows/vercel-deploy.yml`.

It will:
- ✅ Deploy to production on push to `main`
- ✅ Create preview deployment for PRs
- ✅ Comment deployment URL on PRs

### Step 4: Deploy

Push to `main` or open a PR:

```bash
git push origin main
```

Watch the deployment in the **Actions** tab!

---

## Configuration Files

### vercel.json

The `vercel.json` file configures:
- Build commands
- API CORS headers
- Region settings (currently `iad1` - Washington DC)

**Available regions:**
- `iad1` - Washington, D.C., USA
- `sfo1` - San Francisco, USA
- `gru1` - São Paulo, Brazil
- `lhr1` - London, UK
- `fra1` - Frankfurt, Germany
- `hnd1` - Tokyo, Japan
- `sin1` - Singapore

Update in `vercel.json`:
```json
"regions": ["sfo1"]
```

### next.config.js

Optimized for Vercel with:
- React strict mode
- Image optimization ready
- Full API route support

---

## Environment Variables

### Adding Environment Variables

**Option 1 Method (Vercel Dashboard):**
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add variables

**Option 2 Method (GitHub Actions):**
Variables are pulled from Vercel during deployment.

### Example Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Authentication (if using NextAuth)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app

# Stripe (if implementing payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (if implementing notifications)
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx
```

---

## Custom Domain

### Add Custom Domain

1. Go to your Vercel project
2. **Settings** → **Domains**
3. Click **Add**
4. Enter your domain: `statementai.com`
5. Follow DNS configuration instructions

### DNS Configuration

**Option A: Nameservers (Recommended)**
Point your domain's nameservers to Vercel:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B: A Record**
Add A record pointing to:
```
76.76.21.21
```

**Option C: CNAME**
For subdomains:
```
CNAME  www  cname.vercel-dns.com
```

Vercel automatically provisions SSL certificates!

---

## Deployment Workflow

### Production Deployment

```bash
# Push to main branch
git push origin main

# Or use Vercel CLI
vercel --prod
```

### Preview Deployment

Every PR automatically gets a preview URL:
- `https://your-project-git-branch-name.vercel.app`
- Perfect for testing before merging

### Rollback

If something breaks:
1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click **⋯** → **Promote to Production**

---

## Monitoring & Analytics

### View Logs

```bash
# Via CLI
vercel logs

# Via Dashboard
Project → Deployments → Click deployment → Logs
```

### Analytics

Vercel provides built-in analytics:
- Page views
- Top pages
- Devices
- Locations

Enable in: **Project → Analytics**

### Performance

Monitor in: **Project → Speed Insights**
- Core Web Vitals
- Performance scores
- Real user metrics

---

## Troubleshooting

### Build Fails

**Check the build logs:**
1. Go to Vercel Dashboard → Deployments
2. Click the failed deployment
3. View build logs

**Common issues:**
```bash
# Test build locally
npm run build

# Clear cache and rebuild
vercel --force
```

### API Routes Not Working

Ensure API files are in `app/api/` or `pages/api/`:
```
app/
  api/
    convert/
      route.ts    ✅ Correct
```

### Environment Variables Not Working

1. Check they're added in Vercel Dashboard
2. Redeploy after adding new variables
3. For client-side variables, use `NEXT_PUBLIC_` prefix:
   ```
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

### Memory or Timeout Issues

Upgrade your Vercel plan or optimize:
- Reduce bundle size
- Optimize images
- Use ISR instead of SSR where possible

---

## Cost Estimation

### Free Tier (Hobby)
- ✅ Personal projects
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ HTTPS included
- ✅ Preview deployments

### Pro Tier ($20/month)
- Everything in Free
- ✅ Commercial use
- ✅ 1 TB bandwidth
- ✅ Analytics
- ✅ Password protection
- ✅ Team collaboration

### Enterprise
- Custom pricing
- Dedicated support
- SLA guarantees
- Advanced security

**StatementAI fits perfectly in the Free tier to start!**

---

## Comparison: GitHub Actions vs Vercel Integration

| Feature | Vercel Integration | GitHub Actions |
|---------|-------------------|----------------|
| **Setup Time** | 5 minutes | 15 minutes |
| **Configuration** | Zero config | Need tokens/IDs |
| **Preview URLs** | Automatic | Manual setup |
| **Rollbacks** | One-click | Manual |
| **Build Cache** | Optimized | Standard |
| **Recommended For** | Most users | Advanced control |

**Recommendation:** Start with Vercel Integration. You can always switch to GitHub Actions later if needed.

---

## Next Steps After Deployment

1. **Test API Routes**
   ```bash
   curl https://your-app.vercel.app/api/usage?userId=test
   ```

2. **Add Custom Domain**
   - Makes your app look professional
   - Easier to remember

3. **Set Up Analytics**
   - Enable Vercel Analytics
   - Add Google Analytics if needed

4. **Implement Database**
   - Connect to Vercel Postgres
   - Or use external database (Supabase, PlanetScale)

5. **Add Authentication**
   - Implement NextAuth.js
   - Set up environment variables

6. **Enable Monitoring**
   - Set up error tracking (Sentry)
   - Performance monitoring

---

## Quick Start Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Open project in browser
vercel open

# List all deployments
vercel ls

# Remove a deployment
vercel rm deployment-url
```

---

## Support & Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js on Vercel**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status Page**: [vercel-status.com](https://vercel-status.com)

---

## Summary

**For Quick Deployment (Recommended):**
1. Sign up at vercel.com with GitHub
2. Import your repository
3. Click Deploy
4. Done! 🎉

**For GitHub Actions Control:**
1. Get Vercel token and IDs
2. Add GitHub secrets
3. Push to main
4. Automated deployments! 🚀

Both methods give you a production-ready deployment with full API support, HTTPS, and global CDN!
