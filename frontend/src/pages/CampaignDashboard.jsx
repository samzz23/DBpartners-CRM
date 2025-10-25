import { useState, useEffect } from 'react'
import { campaignAPI, metricAPI, reportAPI, clientAPI } from '../services/api'

function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState([])
  const [clients, setClients] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [metrics, setMetrics] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [showMetricForm, setShowMetricForm] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    client_id: '',
    campaign_type: 'social_media',
    status: 'draft',
    budget: '',
    spent: '0',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    description: '',
    target_audience: ''
  })

  const [metricForm, setMetricForm] = useState({
    campaign_id: '',
    date: new Date().toISOString().split('T')[0],
    impressions: '0',
    clicks: '0',
    conversions: '0',
    cost: '0',
    revenue: '0',
    likes: '0',
    shares: '0',
    comments: '0',
    followers_gained: '0'
  })

  const [reportForm, setReportForm] = useState({
    campaign_id: '',
    report_name: '',
    report_date: new Date().toISOString().split('T')[0],
    source: '',
    notes: '',
    report_data: '{}'
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedCampaign) {
      fetchCampaignDetails(selectedCampaign.id)
    }
  }, [selectedCampaign])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [campaignsRes, clientsRes] = await Promise.all([
        campaignAPI.getAll(),
        clientAPI.getAll()
      ])
      setCampaigns(campaignsRes.data)
      setClients(clientsRes.data)
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCampaignDetails = async (campaignId) => {
    try {
      const [metricsRes, reportsRes] = await Promise.all([
        metricAPI.getAll(campaignId),
        reportAPI.getAll(campaignId)
      ])
      setMetrics(metricsRes.data)
      setReports(reportsRes.data)
    } catch (err) {
      console.error('Failed to fetch campaign details', err)
    }
  }

  const handleCampaignSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...campaignForm,
        client_id: parseInt(campaignForm.client_id),
        budget: parseFloat(campaignForm.budget),
        spent: parseFloat(campaignForm.spent),
        start_date: new Date(campaignForm.start_date).toISOString(),
        end_date: campaignForm.end_date ? new Date(campaignForm.end_date).toISOString() : null
      }
      await campaignAPI.create(data)
      setShowCampaignForm(false)
      fetchData()
    } catch (err) {
      console.error('Failed to create campaign', err)
    }
  }

  const handleMetricSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        campaign_id: parseInt(metricForm.campaign_id),
        date: new Date(metricForm.date).toISOString(),
        impressions: parseInt(metricForm.impressions),
        clicks: parseInt(metricForm.clicks),
        conversions: parseInt(metricForm.conversions),
        cost: parseFloat(metricForm.cost),
        revenue: parseFloat(metricForm.revenue),
        likes: parseInt(metricForm.likes),
        shares: parseInt(metricForm.shares),
        comments: parseInt(metricForm.comments),
        followers_gained: parseInt(metricForm.followers_gained)
      }
      await metricAPI.create(data)
      setShowMetricForm(false)
      if (selectedCampaign) {
        fetchCampaignDetails(selectedCampaign.id)
      }
    } catch (err) {
      console.error('Failed to create metric', err)
    }
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        campaign_id: parseInt(reportForm.campaign_id),
        report_name: reportForm.report_name,
        report_date: new Date(reportForm.report_date).toISOString(),
        source: reportForm.source,
        notes: reportForm.notes,
        report_data: JSON.parse(reportForm.report_data)
      }
      await reportAPI.ingest(data)
      setShowReportForm(false)
      if (selectedCampaign) {
        fetchCampaignDetails(selectedCampaign.id)
      }
    } catch (err) {
      console.error('Failed to ingest report', err)
    }
  }

  const calculateTotalMetrics = () => {
    if (!metrics.length) return null
    return {
      totalImpressions: metrics.reduce((sum, m) => sum + m.impressions, 0),
      totalClicks: metrics.reduce((sum, m) => sum + m.clicks, 0),
      totalConversions: metrics.reduce((sum, m) => sum + m.conversions, 0),
      totalCost: metrics.reduce((sum, m) => sum + m.cost, 0),
      totalRevenue: metrics.reduce((sum, m) => sum + m.revenue, 0),
      avgCTR: metrics.reduce((sum, m) => sum + m.ctr, 0) / metrics.length,
      avgROI: metrics.reduce((sum, m) => sum + m.roi, 0) / metrics.length,
      avgCPA: metrics.reduce((sum, m) => sum + m.cpa, 0) / metrics.length
    }
  }

  const totals = calculateTotalMetrics()

  if (loading) return <div className="loading">Loading campaigns...</div>

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Marketing Campaigns</h2>
          <button className="btn btn-primary" onClick={() => setShowCampaignForm(!showCampaignForm)}>
            {showCampaignForm ? 'Cancel' : 'Add Campaign'}
          </button>
        </div>

        {showCampaignForm && (
          <form onSubmit={handleCampaignSubmit} style={{ marginTop: '20px' }}>
            <div className="grid-2">
              <div className="form-group">
                <label>Campaign Name *</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Client *</label>
                <select
                  value={campaignForm.client_id}
                  onChange={(e) => setCampaignForm({ ...campaignForm, client_id: e.target.value })}
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Campaign Type *</label>
                <select
                  value={campaignForm.campaign_type}
                  onChange={(e) => setCampaignForm({ ...campaignForm, campaign_type: e.target.value })}
                >
                  <option value="social_media">Social Media</option>
                  <option value="email">Email</option>
                  <option value="ppc">PPC</option>
                  <option value="display">Display</option>
                  <option value="content">Content</option>
                  <option value="seo">SEO</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={campaignForm.status}
                  onChange={(e) => setCampaignForm({ ...campaignForm, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget *</label>
                <input
                  type="number"
                  step="0.01"
                  value={campaignForm.budget}
                  onChange={(e) => setCampaignForm({ ...campaignForm, budget: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={campaignForm.start_date}
                  onChange={(e) => setCampaignForm({ ...campaignForm, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Target Audience</label>
                <input
                  type="text"
                  value={campaignForm.target_audience}
                  onChange={(e) => setCampaignForm({ ...campaignForm, target_audience: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={campaignForm.description}
                onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-success">Create Campaign</button>
          </form>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Client</th>
              <th>Type</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Start Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(campaign => (
              <tr key={campaign.id}>
                <td>{campaign.name}</td>
                <td>{clients.find(c => c.id === campaign.client_id)?.name || 'Unknown'}</td>
                <td>{campaign.campaign_type.replace('_', ' ')}</td>
                <td><span className={`status status-${campaign.status}`}>{campaign.status}</span></td>
                <td>${campaign.budget.toFixed(2)}</td>
                <td>${campaign.spent.toFixed(2)}</td>
                <td>{new Date(campaign.start_date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedCampaign(campaign)}
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {campaigns.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No campaigns found. Create your first campaign to get started!
          </div>
        )}
      </div>

      {selectedCampaign && (
        <div className="card">
          <h2>{selectedCampaign.name} - Performance Metrics</h2>

          {totals && (
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Total Impressions</h3>
                <div className="value">{totals.totalImpressions.toLocaleString()}</div>
              </div>
              <div className="metric-card">
                <h3>Total Clicks</h3>
                <div className="value">{totals.totalClicks.toLocaleString()}</div>
              </div>
              <div className="metric-card">
                <h3>Total Conversions</h3>
                <div className="value">{totals.totalConversions.toLocaleString()}</div>
              </div>
              <div className="metric-card">
                <h3>Total Cost</h3>
                <div className="value">${totals.totalCost.toFixed(2)}</div>
              </div>
              <div className="metric-card">
                <h3>Total Revenue</h3>
                <div className="value">${totals.totalRevenue.toFixed(2)}</div>
              </div>
              <div className="metric-card">
                <h3>Avg CTR</h3>
                <div className="value">{totals.avgCTR.toFixed(2)}%</div>
              </div>
              <div className="metric-card">
                <h3>Avg ROI</h3>
                <div className="value">{totals.avgROI.toFixed(2)}%</div>
              </div>
              <div className="metric-card">
                <h3>Avg CPA</h3>
                <div className="value">${totals.avgCPA.toFixed(2)}</div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={() => setShowMetricForm(!showMetricForm)} style={{ marginRight: '10px' }}>
              {showMetricForm ? 'Cancel' : 'Add Metric'}
            </button>
            <button className="btn btn-primary" onClick={() => setShowReportForm(!showReportForm)}>
              {showReportForm ? 'Cancel' : 'Ingest Report'}
            </button>
          </div>

          {showMetricForm && (
            <form onSubmit={handleMetricSubmit} style={{ marginTop: '20px' }}>
              <input type="hidden" value={selectedCampaign.id} />
              <div className="grid-2">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={metricForm.date}
                    onChange={(e) => setMetricForm({ ...metricForm, date: e.target.value, campaign_id: selectedCampaign.id })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Impressions</label>
                  <input
                    type="number"
                    value={metricForm.impressions}
                    onChange={(e) => setMetricForm({ ...metricForm, impressions: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Clicks</label>
                  <input
                    type="number"
                    value={metricForm.clicks}
                    onChange={(e) => setMetricForm({ ...metricForm, clicks: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Conversions</label>
                  <input
                    type="number"
                    value={metricForm.conversions}
                    onChange={(e) => setMetricForm({ ...metricForm, conversions: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={metricForm.cost}
                    onChange={(e) => setMetricForm({ ...metricForm, cost: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Revenue</label>
                  <input
                    type="number"
                    step="0.01"
                    value={metricForm.revenue}
                    onChange={(e) => setMetricForm({ ...metricForm, revenue: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Likes</label>
                  <input
                    type="number"
                    value={metricForm.likes}
                    onChange={(e) => setMetricForm({ ...metricForm, likes: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Shares</label>
                  <input
                    type="number"
                    value={metricForm.shares}
                    onChange={(e) => setMetricForm({ ...metricForm, shares: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Comments</label>
                  <input
                    type="number"
                    value={metricForm.comments}
                    onChange={(e) => setMetricForm({ ...metricForm, comments: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Followers Gained</label>
                  <input
                    type="number"
                    value={metricForm.followers_gained}
                    onChange={(e) => setMetricForm({ ...metricForm, followers_gained: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">Add Metric</button>
            </form>
          )}

          {showReportForm && (
            <form onSubmit={handleReportSubmit} style={{ marginTop: '20px' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Report Name *</label>
                  <input
                    type="text"
                    value={reportForm.report_name}
                    onChange={(e) => setReportForm({ ...reportForm, report_name: e.target.value, campaign_id: selectedCampaign.id })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    placeholder="e.g., Google Ads, Facebook"
                    value={reportForm.source}
                    onChange={(e) => setReportForm({ ...reportForm, source: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Report Date *</label>
                  <input
                    type="date"
                    value={reportForm.report_date}
                    onChange={(e) => setReportForm({ ...reportForm, report_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Report Data (JSON) *</label>
                <textarea
                  value={reportForm.report_data}
                  onChange={(e) => setReportForm({ ...reportForm, report_data: e.target.value })}
                  placeholder='{"key": "value"}'
                  required
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={reportForm.notes}
                  onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-success">Ingest Report</button>
            </form>
          )}

          <h3 style={{ marginTop: '30px' }}>Detailed Metrics</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>Conversions</th>
                <th>CTR</th>
                <th>CPA</th>
                <th>ROI</th>
                <th>Cost</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(metric => (
                <tr key={metric.id}>
                  <td>{new Date(metric.date).toLocaleDateString()}</td>
                  <td>{metric.impressions.toLocaleString()}</td>
                  <td>{metric.clicks.toLocaleString()}</td>
                  <td>{metric.conversions.toLocaleString()}</td>
                  <td>{metric.ctr.toFixed(2)}%</td>
                  <td>${metric.cpa.toFixed(2)}</td>
                  <td>{metric.roi.toFixed(2)}%</td>
                  <td>${metric.cost.toFixed(2)}</td>
                  <td>${metric.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {metrics.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No metrics recorded yet. Add metrics to track campaign performance!
            </div>
          )}

          {reports.length > 0 && (
            <>
              <h3 style={{ marginTop: '30px' }}>Ingested Reports</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Source</th>
                    <th>Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id}>
                      <td>{report.report_name}</td>
                      <td>{report.source || '-'}</td>
                      <td>{new Date(report.report_date).toLocaleDateString()}</td>
                      <td>{report.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CampaignDashboard
