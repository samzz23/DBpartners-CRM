# DBpartners CRM

A comprehensive CRM system with accounting, client management, and marketing campaign performance tracking.

## Features

### Client Management
- Add, view, update, and delete clients
- Track client status (active, inactive, pending, suspended)
- Store client contact information and company details

### Accounting System
- **Invoices**: Create and manage invoices with automatic status tracking
- **Payments**: Record payments and link them to invoices
- **Expenses**: Track business expenses by category
- Real-time financial metrics (revenue, expenses, net profit)

### Marketing Campaign Analytics
- Create and manage marketing campaigns across multiple channels
- Track comprehensive performance metrics:
  - ROI (Return on Investment)
  - Conversion rates
  - Cost per acquisition (CPA)
  - Click-through rate (CTR)
  - Social media engagement metrics
- Ingest reports from external marketing platforms
- View detailed campaign performance dashboards

## Technology Stack

### Backend
- **Python 3.8+** with **FastAPI**
- **SQLAlchemy** ORM
- **SQLite** database
- RESTful API architecture

### Frontend
- **React 18**
- **Vite** build tool
- **Axios** for API communication
- Modern, responsive UI design

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python run.py
```

The API will be available at `http://localhost:8000`
API documentation available at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage Guide

### Client Management
1. Navigate to the "Clients" tab
2. Click "Add New Client" to create a client record
3. Fill in client details and select their status
4. View all clients in the table below

### Accounting
1. Navigate to the "Accounting" tab
2. View financial summary metrics at the top
3. Switch between Invoices, Payments, and Expenses tabs
4. Click "Add" buttons to create new records

**Creating an Invoice:**
- Enter invoice number, select client, and set amount
- Choose status (draft, sent, paid, overdue)
- Set issue and due dates

**Recording a Payment:**
- Select client and optionally link to an invoice
- Enter payment amount and method
- Payments automatically update invoice status

**Tracking Expenses:**
- Enter description and amount
- Categorize by type (marketing, operations, etc.)
- Add vendor and receipt information

### Marketing Campaigns
1. Navigate to the "Marketing Campaigns" tab
2. Click "Add Campaign" to create a new campaign
3. Select client, campaign type, and set budget
4. Click "View Details" on any campaign to see performance

**Adding Metrics:**
- Click "Add Metric" in campaign details
- Enter performance data (impressions, clicks, conversions, cost, revenue)
- System automatically calculates CTR, CPA, ROI, and conversion rates

**Ingesting Reports:**
- Click "Ingest Report" in campaign details
- Enter report name and source (e.g., "Google Ads", "Facebook")
- Paste JSON data from external platform
- Reports are stored for historical reference

## API Documentation

### Client Endpoints
- `GET /clients` - List all clients
- `POST /clients` - Create a new client
- `GET /clients/{id}` - Get client by ID
- `PUT /clients/{id}` - Update client
- `DELETE /clients/{id}` - Delete client

### Accounting Endpoints
- `GET /accounting/invoices` - List all invoices
- `POST /accounting/invoices` - Create invoice
- `GET /accounting/payments` - List all payments
- `POST /accounting/payments` - Record payment
- `GET /accounting/expenses` - List all expenses
- `POST /accounting/expenses` - Create expense

### Campaign Endpoints
- `GET /campaigns` - List all campaigns
- `POST /campaigns` - Create campaign
- `GET /campaigns/metrics` - Get campaign metrics
- `POST /campaigns/metrics` - Add campaign metric
- `POST /campaigns/reports` - Ingest campaign report

Full interactive API documentation available at `http://localhost:8000/docs` when running the backend.

## Database Schema

### Core Tables
- **clients**: Client information and status
- **invoices**: Invoice records with amounts and dates
- **payments**: Payment records linked to clients/invoices
- **expenses**: Business expense tracking
- **campaigns**: Marketing campaign information
- **campaign_metrics**: Detailed performance metrics
- **campaign_reports**: Ingested report data from external sources

## Development

### Project Structure
```
DBpartners-CRM/
├── backend/
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── database.py     # Database configuration
│   │   └── main.py         # FastAPI application
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Main page components
│   │   ├── services/       # API service layer
│   │   ├── App.jsx         # Main application
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Building for Production

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Future Enhancements

Potential features for future development:
- User authentication and authorization
- Multi-currency support
- Automated invoice generation
- Email notifications for due invoices
- Advanced financial reporting and charts
- Campaign budget alerts
- Data export functionality (CSV, PDF)
- Integration with popular marketing platforms APIs
- Multi-user collaboration features

## License

This project is proprietary software developed for DBpartners.

## Support

For support and questions, please contact the development team.
