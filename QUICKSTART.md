# Quick Start Guide

## Super Simple Setup (Recommended)

### Linux/Mac Users

1. **Start the Backend** (in one terminal):
```bash
./start-backend.sh
```

2. **Start the Frontend** (in a NEW terminal):
```bash
./start-frontend.sh
```

3. **Open your browser** and go to: http://localhost:3000

That's it! The scripts handle everything automatically.

### Windows Users

1. **Start the Backend** (in one terminal):
```cmd
start-backend.bat
```

2. **Start the Frontend** (in a NEW terminal):
```cmd
start-frontend.bat
```

3. **Open your browser** and go to: http://localhost:3000

---

## First Time Using the App?

Once the app is running at http://localhost:3000:

### 1. Add a Client
- Click the **"Clients"** tab
- Click **"Add New Client"**
- Fill in:
  - Name: "Acme Corp"
  - Email: "contact@acme.com"
  - Company: "Acme Corporation"
- Click **"Create Client"**

### 2. Create an Invoice
- Click the **"Accounting"** tab
- Make sure you're on the **"Invoices"** section
- Click **"Add invoice"**
- Fill in:
  - Invoice Number: "INV-001"
  - Client: Select "Acme Corp"
  - Amount: 1000
  - Status: "Sent"
  - Issue Date: Today's date
  - Due Date: 30 days from now
- Click **"Create Invoice"**

### 3. Record a Payment
- Still in the **"Accounting"** tab
- Click **"Payments"**
- Click **"Add payment"**
- Fill in:
  - Client: Select "Acme Corp"
  - Invoice: Select "INV-001"
  - Amount: 1000
  - Payment Method: "Bank Transfer"
  - Payment Date: Today's date
- Click **"Record Payment"**
- Go back to **"Invoices"** - notice the status changed to "Paid"!

### 4. Create a Marketing Campaign
- Click the **"Marketing Campaigns"** tab
- Click **"Add Campaign"**
- Fill in:
  - Campaign Name: "Q1 Social Media Blitz"
  - Client: Select "Acme Corp"
  - Campaign Type: "Social Media"
  - Status: "Active"
  - Budget: 5000
  - Start Date: Today's date
- Click **"Create Campaign"**

### 5. Add Campaign Metrics
- Click **"View Details"** on your new campaign
- Click **"Add Metric"**
- Fill in some sample data:
  - Date: Today's date
  - Impressions: 10000
  - Clicks: 500
  - Conversions: 50
  - Cost: 250
  - Revenue: 1500
  - Likes: 100
  - Shares: 25
  - Comments: 15
- Click **"Add Metric"**
- Watch the dashboard automatically calculate ROI, CTR, CPA, etc!

---

## What You Can Track

### Accounting
- **Revenue**: Total from paid invoices
- **Expenses**: All business costs
- **Net Profit**: Revenue minus expenses
- **Pending**: Outstanding invoice amounts

### Marketing
- **ROI** (Return on Investment): How profitable your campaigns are
- **CTR** (Click-Through Rate): What % of viewers click
- **CPA** (Cost Per Acquisition): How much each conversion costs
- **Conversion Rate**: What % of clicks turn into sales
- **Social Engagement**: Likes, shares, comments, followers

---

## Troubleshooting

**"Module not found" errors?**
- Delete the `venv` folder in `backend/`
- Run the startup script again

**"npm install" taking forever?**
- This is normal the first time - be patient!
- It downloads all frontend dependencies

**Port already in use?**
- Something else is using port 8000 or 3000
- Close other apps or change the port in the config files

**Still having issues?**
- Make sure Python 3.8+ is installed
- Make sure Node.js 16+ is installed
- Check the full README.md for detailed setup

---

## Next Steps

- Try tracking expenses
- Ingest a report from an external platform
- Create multiple campaigns and compare performance
- Add more clients and invoices

Enjoy your new CRM system!
