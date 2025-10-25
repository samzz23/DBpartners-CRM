import { useState } from 'react'
import ClientManagement from './pages/ClientManagement'
import AccountingDashboard from './pages/AccountingDashboard'
import CampaignDashboard from './pages/CampaignDashboard'

function App() {
  const [activeTab, setActiveTab] = useState('clients')

  return (
    <div className="container">
      <div className="header">
        <h1>DBpartners CRM</h1>
        <p>Accounting, Client Management & Marketing Analytics</p>
        <div className="nav">
          <button
            className={activeTab === 'clients' ? 'active' : ''}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </button>
          <button
            className={activeTab === 'accounting' ? 'active' : ''}
            onClick={() => setActiveTab('accounting')}
          >
            Accounting
          </button>
          <button
            className={activeTab === 'campaigns' ? 'active' : ''}
            onClick={() => setActiveTab('campaigns')}
          >
            Marketing Campaigns
          </button>
        </div>
      </div>

      {activeTab === 'clients' && <ClientManagement />}
      {activeTab === 'accounting' && <AccountingDashboard />}
      {activeTab === 'campaigns' && <CampaignDashboard />}
    </div>
  )
}

export default App
