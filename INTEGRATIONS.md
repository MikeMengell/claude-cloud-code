# Integration Guide

## Low-Code Platform Integrations

### Zapier

#### Quick Start

1. **Create a Zap**
   - Go to [zapier.com](https://zapier.com)
   - Click "Create Zap"

2. **Set up Trigger**
   - Choose "Webhooks by Zapier"
   - Select "Catch Hook"
   - Copy the webhook URL
   - Paste it in your StatementAI account settings

3. **Configure Action**
   - Choose your desired app (Google Sheets, Airtable, etc.)
   - Map the fields from the webhook payload:
     - `statement.bank` → Bank Name
     - `statement.account_number` → Account Number
     - `statement.transactions` → Transaction Data

4. **Test Your Zap**
   - Upload a test statement in StatementAI
   - Verify data appears in your connected app

#### Example Zap Workflows

**Bank Statement → Google Sheets**
```
Trigger: Webhook (StatementAI conversion completed)
Action: Google Sheets - Create Spreadsheet Row
Map: Each transaction to a new row
```

**Bank Statement → Accounting Software**
```
Trigger: Webhook (StatementAI conversion completed)
Action: QuickBooks - Create Transaction
Map: Transaction data to QuickBooks format
```

---

### Make.com (Integromat)

#### Setup Instructions

1. **Create a Scenario**
   - Go to [make.com](https://make.com)
   - Create a new scenario

2. **Add Webhook Module**
   - Add "Webhooks" → "Custom webhook"
   - Click "Create a webhook"
   - Name it "StatementAI Converter"
   - Copy the webhook URL

3. **Parse JSON Response**
   - Add "JSON" → "Parse JSON"
   - Use this schema:
   ```json
   {
     "event": "conversion.completed",
     "data": {
       "conversion_id": "",
       "file_name": "",
       "result": {
         "statement": {
           "bank": "",
           "account_number": "",
           "transactions": []
         }
       }
     }
   }
   ```

4. **Add Your Actions**
   - Process each transaction
   - Send to your desired app

#### Example Scenarios

**Automatic Expense Categorization**
```
1. Webhook receives statement data
2. Iterator loops through transactions
3. Filter by category (e.g., "dining")
4. Create expense in Expensify
5. Send notification to Slack
```

**Multi-Account Reconciliation**
```
1. Webhook receives statements from multiple banks
2. Aggregate all transactions
3. Remove duplicates
4. Update master spreadsheet in Airtable
5. Send weekly summary email
```

---

### n8n (Self-Hosted)

#### Workflow Setup

1. **Create Webhook Node**
   - Add "Webhook" node
   - Set path: `/statement-converter`
   - Method: POST
   - Response: "Immediately"

2. **Process Statement Data**
   ```javascript
   // Extract transactions
   const transactions = $json.data.result.statement.transactions

   // Transform for your needs
   return transactions.map(t => ({
     date: t.date,
     merchant: t.merchant,
     amount: t.amount,
     category: t.category
   }))
   ```

3. **Connect to Your Services**
   - PostgreSQL for storage
   - Notion for documentation
   - Discord for notifications

---

## AI Tool Integration

### OpenAI GPT Integration

#### Using AI-Optimized Format

```python
import openai
import json

# Get statement data from StatementAI
statement_data = convert_statement("statement.pdf", format="ai-optimized")

# Use with GPT for analysis
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {
            "role": "system",
            "content": "You are a financial analyst. Analyze the bank statement and provide insights."
        },
        {
            "role": "user",
            "content": f"Analyze this statement:\n\n{json.dumps(statement_data)}"
        }
    ]
)

print(response.choices[0].message.content)
```

**Token Savings Example:**
- Raw PDF text: ~4,000 tokens
- AI-Optimized JSON: ~800 tokens
- **Savings: 80%**

### Claude Integration

```python
import anthropic

client = anthropic.Client(api_key="your-api-key")

# Get structured statement
statement = get_statement_data()

# Use with Claude for categorization
message = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": f"""Categorize these transactions and suggest budget improvements:

        {json.dumps(statement['transactions'])}
        """
    }]
)
```

### LangChain Integration

```python
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI

# Create chain for expense analysis
template = """
Given these bank transactions:
{transactions}

Provide:
1. Top spending categories
2. Unusual transactions
3. Budget recommendations
"""

prompt = PromptTemplate(
    input_variables=["transactions"],
    template=template
)

chain = LLMChain(llm=OpenAI(), prompt=prompt)

# Process statement
statement = get_statement_data()
analysis = chain.run(
    transactions=json.dumps(statement['transactions'])
)
```

---

## REST API Integration

### JavaScript/TypeScript

```typescript
// Upload and convert statement
async function convertStatement(file: File, format: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('format', format)

  const response = await fetch('https://api.your-domain.com/api/convert', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    },
    body: formData
  })

  if (!response.ok) {
    throw new Error('Conversion failed')
  }

  return await response.json()
}

// Use the converted data
const result = await convertStatement(pdfFile, 'ai-optimized')
console.log(result.data.statement.transactions)
```

### Python

```python
import requests

def convert_statement(file_path, output_format='ai-optimized'):
    """Convert bank statement using StatementAI API"""

    url = 'https://api.your-domain.com/api/convert'

    with open(file_path, 'rb') as f:
        files = {'file': f}
        data = {'format': output_format}
        headers = {'Authorization': f'Bearer {API_KEY}'}

        response = requests.post(url, files=files, data=data, headers=headers)
        response.raise_for_status()

        return response.json()

# Example usage
result = convert_statement('statement.pdf', 'ai-optimized')
transactions = result['data']['statement']['transactions']

# Analyze with pandas
import pandas as pd
df = pd.DataFrame(transactions)
print(df.groupby('category')['amount'].sum())
```

### cURL

```bash
# Convert a statement
curl -X POST https://api.your-domain.com/api/convert \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@statement.pdf" \
  -F "format=ai-optimized"

# Check usage
curl https://api.your-domain.com/api/usage?userId=user123 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## Advanced Use Cases

### 1. Multi-Account Dashboard

Aggregate statements from multiple banks into a single dashboard.

```typescript
async function createDashboard(statements: File[]) {
  const converted = await Promise.all(
    statements.map(file => convertStatement(file, 'ai-optimized'))
  )

  const allTransactions = converted.flatMap(
    result => result.data.statement.transactions
  )

  return {
    total_accounts: converted.length,
    total_balance: allTransactions.reduce((sum, t) => sum + t.balance, 0),
    transactions: allTransactions,
    by_category: categorizeTransactions(allTransactions)
  }
}
```

### 2. Automated Expense Reports

Generate monthly expense reports automatically.

```python
def generate_expense_report(statement_data):
    """Generate expense report from statement data"""

    transactions = statement_data['statement']['transactions']

    # Group by category
    expenses = {}
    for t in transactions:
        if t['amount'] < 0:  # Debit
            category = t.get('category', 'uncategorized')
            expenses[category] = expenses.get(category, 0) + abs(t['amount'])

    # Generate report
    report = {
        'period': statement_data['statement']['period'],
        'total_expenses': sum(expenses.values()),
        'by_category': expenses,
        'largest_expense': max(transactions, key=lambda t: abs(t['amount']))
    }

    return report
```

### 3. Financial Forecasting

Use historical statement data for predictions.

```python
import openai

def forecast_spending(statements):
    """Use AI to forecast future spending based on past statements"""

    # Combine historical data
    all_transactions = []
    for statement in statements:
        all_transactions.extend(statement['transactions'])

    # Use GPT for forecasting
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"""
            Based on these historical transactions:
            {json.dumps(all_transactions)}

            Predict:
            1. Next month's total spending
            2. Category breakdown
            3. Any unusual patterns
            """
        }]
    )

    return response.choices[0].message.content
```

---

## Webhook Security

### Verifying Webhook Signatures

```typescript
import crypto from 'crypto'

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// In your webhook handler
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature']
  const payload = JSON.stringify(req.body)

  if (!verifyWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  // Process webhook
  processConversion(req.body)
  res.json({ success: true })
})
```

---

## Support

Need help with integration? Contact us:
- Email: integrations@your-domain.com
- Docs: https://docs.your-domain.com
- Discord: https://discord.gg/your-server
