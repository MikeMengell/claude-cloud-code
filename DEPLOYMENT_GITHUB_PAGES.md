# Deploying StatementAI to GitHub Pages

This guide explains how to deploy the StatementAI application to GitHub Pages.

## Prerequisites

- GitHub account
- Repository with GitHub Pages enabled
- GitHub Actions enabled for your repository

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**, select:
   - **Source**: GitHub Actions

### 2. Configure for Subdirectory Deployment (if needed)

If you're deploying to `https://username.github.io/repo-name/` (not a custom domain), uncomment and update these lines in `next.config.js`:

```javascript
basePath: '/claude-cloud-code',
assetPrefix: '/claude-cloud-code/',
```

Replace `claude-cloud-code` with your actual repository name.

### 3. Deploy

The deployment workflow is triggered automatically:

- **On push to main branch**: Automatically builds and deploys
- **Manual trigger**: Go to Actions → Deploy to GitHub Pages → Run workflow

```bash
# Push to main branch to trigger deployment
git push origin main
```

### 4. Access Your Site

After successful deployment (2-3 minutes):

- **Custom domain**: `https://yourdomain.com`
- **GitHub subdomain**: `https://username.github.io/repo-name/`

## Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) performs:

1. **Checkout**: Gets the latest code
2. **Setup Node.js**: Installs Node.js 18
3. **Install dependencies**: Runs `npm ci`
4. **Build**: Runs `npm run build` (generates static export to `/out`)
5. **Deploy**: Uploads and deploys to GitHub Pages

## Important Limitations

### ⚠️ API Routes Not Supported

GitHub Pages hosts **static files only**. The following features will NOT work:

- ❌ `/api/convert` - File conversion endpoint
- ❌ `/api/trial` - Trial user registration
- ❌ `/api/usage` - Usage tracking
- ❌ `/api/webhook` - Webhook integrations

### Recommended Solutions

For full functionality with API routes, consider these alternatives:

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Pros:**
- Full Next.js support (API routes, SSR, ISR)
- Free tier available
- Automatic HTTPS
- Global CDN
- Zero configuration

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Pros:**
- Supports serverless functions
- Free tier available
- Form handling
- Analytics

#### Option 3: Docker + Cloud Platform

Deploy using Docker to AWS, GCP, or DigitalOcean:

```bash
# Build Docker image
docker build -t statement-ai .

# Run locally to test
docker run -p 3000:3000 statement-ai

# Deploy to your cloud platform
```

#### Option 4: Split Frontend/Backend

- **Frontend**: Deploy static site to GitHub Pages
- **Backend**: Deploy API routes to:
  - AWS Lambda
  - Google Cloud Functions
  - Railway
  - Render

Update API calls to point to your backend URL.

## Static Demo Mode

For a GitHub Pages demo (frontend only):

1. Mock the API responses in the frontend
2. Use localStorage for trial user data (already implemented)
3. Simulate file conversion with sample data

Example mock for `/api/convert`:

```javascript
// In FileUploader.tsx or similar
const mockConvert = async (file, format) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return mock data
  return {
    success: true,
    data: { /* mock transaction data */ },
    format
  };
};
```

## Troubleshooting

### Build Fails

Check the Actions tab for error logs:
```bash
# Test build locally
npm run build
```

### 404 on Navigation

If you get 404s when navigating:
1. Check `basePath` in `next.config.js`
2. Ensure `.nojekyll` exists in `public/`

### Assets Not Loading

Verify `assetPrefix` matches your deployment URL:
```javascript
// For repo deployment
assetPrefix: '/repo-name/'

// For custom domain
assetPrefix: '/'
```

## Environment Variables

GitHub Pages doesn't support server-side environment variables. For static export:

1. Create `.env.local` (not committed)
2. Use `NEXT_PUBLIC_` prefix for client-side variables
3. Build locally or use GitHub Secrets for build-time variables

Example:
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api.com
```

## Custom Domain

To use a custom domain:

1. Add a `CNAME` file to `public/`:
   ```
   yourdomain.com
   ```

2. Configure DNS:
   - Add A records pointing to GitHub Pages IPs
   - Or add CNAME record pointing to `username.github.io`

3. Enable HTTPS in GitHub Pages settings

## Monitoring

View deployment status:
- **Actions tab**: See build/deploy logs
- **Settings → Pages**: View current deployment URL
- **Deployments**: See deployment history

## Summary

✅ **Best for GitHub Pages:**
- Marketing/landing pages
- Documentation
- Portfolios
- Static demos

❌ **Not suitable for:**
- Applications requiring API routes
- Server-side rendering
- Database connections
- File uploads with processing

For StatementAI's full functionality, **Vercel or Netlify are recommended** over GitHub Pages.
