# Quick Start Guide

Get StatementAI running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A code editor (VS Code recommended)

## Installation

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd claude-cloud-code
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Conversion

### Using the Web Interface

1. Click "Start Free Trial" button
2. Drag and drop a bank statement PDF
3. Select output format (try "AI-Optimized" first!)
4. Click "Convert Statement"
5. Download your converted file

### Using the API

```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@your-statement.pdf" \
  -F "format=ai-optimized" \
  > result.json
```

## Understanding Output Formats

### CSV (Universal)
Best for: Excel, Google Sheets, general use
```csv
Date,Description,Amount,Category
2024-01-15,Amazon Purchase,-45.99,shopping
```

### Excel (Spreadsheet Ready)
Best for: Detailed reports with metadata
- Includes summary header
- Transaction list
- Balance information

### JSON (Developer Friendly)
Best for: Custom processing, databases
```json
{
  "bank": "Chase Bank",
  "transactions": [...]
}
```

### AI-Optimized (Recommended for AI Tools)
Best for: GPT, Claude, LLMs - saves 80% tokens!
```json
{
  "statement": { ... },
  "metadata": {
    "confidence_score": 0.995,
    "processed_at": "2024-01-15T10:30:00Z"
  }
}
```

## Common Use Cases

### 1. Convert for Accounting Software

```bash
# Convert to CSV for QuickBooks
curl -X POST http://localhost:3000/api/convert \
  -F "file=@statement.pdf" \
  -F "format=csv" \
  -o transactions.csv
```

### 2. Analyze with AI

```python
import openai
import requests

# Convert statement
response = requests.post(
    'http://localhost:3000/api/convert',
    files={'file': open('statement.pdf', 'rb')},
    data={'format': 'ai-optimized'}
)

statement = response.json()['data']

# Analyze with GPT
analysis = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{
        "role": "user",
        "content": f"Analyze spending: {statement}"
    }]
)
```

### 3. Automate with Zapier

1. Create new Zap
2. Trigger: "Webhooks by Zapier" → Catch Hook
3. Action: "Google Sheets" → Create Row
4. Map transaction data to columns

## Environment Setup (Optional)

For production features, create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Project Structure

```
📁 app/
  📁 api/
    📁 convert/     ← Main conversion endpoint
    📁 webhook/     ← Low-code integrations
    📁 usage/       ← Track conversions
  📄 page.tsx       ← Landing page

📁 components/
  📄 FileUploader.tsx  ← Drag & drop upload
  📄 Features.tsx      ← Feature showcase
  📄 PricingCards.tsx  ← Pricing tiers

📁 lib/
  📄 pdfParser.ts    ← PDF extraction logic
  📄 converter.ts    ← Format conversion
  📁 types/          ← TypeScript definitions
```

## Testing

### Test the Web Interface
1. Visit http://localhost:3000
2. Upload a test PDF
3. Try different output formats

### Test the API

```bash
# Health check
curl http://localhost:3000/api/webhook

# Check usage
curl http://localhost:3000/api/usage?userId=test123

# Convert file
curl -X POST http://localhost:3000/api/convert \
  -F "file=@test.pdf" \
  -F "format=json"
```

## Customization

### Change Color Scheme

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
      }
    }
  }
}
```

### Add New Output Format

1. Add format type in `lib/types/index.ts`
2. Implement converter in `lib/converter.ts`
3. Add option in `FileUploader.tsx`

### Customize Pricing

Edit `components/PricingCards.tsx`:

```typescript
const plans = [
  {
    name: 'Your Plan',
    price: '$X',
    features: ['Feature 1', 'Feature 2']
  }
]
```

## Troubleshooting

### Port 3000 already in use?

```bash
# Use different port
PORT=3001 npm run dev
```

### Dependencies not installing?

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors?

```bash
# Check TypeScript
npm run lint

# Clear Next.js cache
rm -rf .next
npm run dev
```

## Next Steps

1. **Read the full docs**: Check `README.md` and `INTEGRATIONS.md`
2. **Try integrations**: Connect with Zapier or Make.com
3. **Customize**: Modify the UI to match your brand
4. **Deploy**: Use Vercel for instant deployment
5. **Add features**: Implement authentication, database, etc.

## Resources

- 📖 [Full Documentation](README.md)
- 🔌 [Integration Guide](INTEGRATIONS.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 📊 [Project Overview](PROJECT_OVERVIEW.md)

## Need Help?

- Check the README.md for detailed documentation
- Search GitHub issues
- Join our Discord community
- Email: support@your-domain.com

---

Happy converting! 🎉
