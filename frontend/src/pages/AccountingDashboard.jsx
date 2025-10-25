import { useState, useEffect } from 'react'
import { invoiceAPI, paymentAPI, expenseAPI, clientAPI } from '../services/api'

function AccountingDashboard() {
  const [activeSection, setActiveSection] = useState('invoices')
  const [invoices, setInvoices] = useState([])
  const [payments, setPayments] = useState([])
  const [expenses, setExpenses] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: '',
    client_id: '',
    amount: '',
    status: 'draft',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    description: '',
    notes: ''
  })
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'other',
    expense_date: new Date().toISOString().split('T')[0],
    vendor: '',
    receipt_number: '',
    notes: ''
  })
  const [paymentForm, setPaymentForm] = useState({
    client_id: '',
    invoice_id: '',
    amount: '',
    payment_method: 'bank_transfer',
    payment_date: new Date().toISOString().split('T')[0],
    reference_number: '',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [invoicesRes, paymentsRes, expensesRes, clientsRes] = await Promise.all([
        invoiceAPI.getAll(),
        paymentAPI.getAll(),
        expenseAPI.getAll(),
        clientAPI.getAll()
      ])
      setInvoices(invoicesRes.data)
      setPayments(paymentsRes.data)
      setExpenses(expensesRes.data)
      setClients(clientsRes.data)
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...invoiceForm,
        client_id: parseInt(invoiceForm.client_id),
        amount: parseFloat(invoiceForm.amount),
        issue_date: new Date(invoiceForm.issue_date).toISOString(),
        due_date: invoiceForm.due_date ? new Date(invoiceForm.due_date).toISOString() : null
      }
      await invoiceAPI.create(data)
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error('Failed to create invoice', err)
    }
  }

  const handleExpenseSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        expense_date: new Date(expenseForm.expense_date).toISOString()
      }
      await expenseAPI.create(data)
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error('Failed to create expense', err)
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...paymentForm,
        client_id: parseInt(paymentForm.client_id),
        invoice_id: paymentForm.invoice_id ? parseInt(paymentForm.invoice_id) : null,
        amount: parseFloat(paymentForm.amount),
        payment_date: new Date(paymentForm.payment_date).toISOString()
      }
      await paymentAPI.create(data)
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error('Failed to create payment', err)
    }
  }

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalPending = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + i.amount, 0)

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <div className="value">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <h3>Total Expenses</h3>
          <div className="value">${totalExpenses.toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <h3>Net Profit</h3>
          <div className="value">${(totalRevenue - totalExpenses).toFixed(2)}</div>
        </div>
        <div className="metric-card">
          <h3>Pending Invoices</h3>
          <div className="value">${totalPending.toFixed(2)}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="nav" style={{ marginTop: 0 }}>
          <button
            className={activeSection === 'invoices' ? 'active' : ''}
            onClick={() => { setActiveSection('invoices'); setShowForm(false) }}
          >
            Invoices
          </button>
          <button
            className={activeSection === 'payments' ? 'active' : ''}
            onClick={() => { setActiveSection('payments'); setShowForm(false) }}
          >
            Payments
          </button>
          <button
            className={activeSection === 'expenses' ? 'active' : ''}
            onClick={() => { setActiveSection('expenses'); setShowForm(false) }}
          >
            Expenses
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>
              {activeSection === 'invoices' && 'Invoices'}
              {activeSection === 'payments' && 'Payments'}
              {activeSection === 'expenses' && 'Expenses'}
            </h2>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : `Add ${activeSection.slice(0, -1)}`}
            </button>
          </div>

          {showForm && activeSection === 'invoices' && (
            <form onSubmit={handleInvoiceSubmit} style={{ marginTop: '20px' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Invoice Number *</label>
                  <input
                    type="text"
                    value={invoiceForm.invoice_number}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_number: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Client *</label>
                  <select
                    value={invoiceForm.client_id}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, client_id: e.target.value })}
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={invoiceForm.status}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Issue Date *</label>
                  <input
                    type="date"
                    value={invoiceForm.issue_date}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, issue_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={invoiceForm.due_date}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-success">Create Invoice</button>
            </form>
          )}

          {showForm && activeSection === 'expenses' && (
            <form onSubmit={handleExpenseSubmit} style={{ marginTop: '20px' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Description *</label>
                  <input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  >
                    <option value="marketing">Marketing</option>
                    <option value="operations">Operations</option>
                    <option value="salaries">Salaries</option>
                    <option value="utilities">Utilities</option>
                    <option value="supplies">Supplies</option>
                    <option value="travel">Travel</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Expense Date *</label>
                  <input
                    type="date"
                    value={expenseForm.expense_date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Vendor</label>
                  <input
                    type="text"
                    value={expenseForm.vendor}
                    onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Receipt Number</label>
                  <input
                    type="text"
                    value={expenseForm.receipt_number}
                    onChange={(e) => setExpenseForm({ ...expenseForm, receipt_number: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">Create Expense</button>
            </form>
          )}

          {showForm && activeSection === 'payments' && (
            <form onSubmit={handlePaymentSubmit} style={{ marginTop: '20px' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Client *</label>
                  <select
                    value={paymentForm.client_id}
                    onChange={(e) => setPaymentForm({ ...paymentForm, client_id: e.target.value })}
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Invoice (optional)</label>
                  <select
                    value={paymentForm.invoice_id}
                    onChange={(e) => setPaymentForm({ ...paymentForm, invoice_id: e.target.value })}
                  >
                    <option value="">No Invoice</option>
                    {invoices.map(i => <option key={i.id} value={i.id}>{i.invoice_number}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Date *</label>
                  <input
                    type="date"
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Reference Number</label>
                  <input
                    type="text"
                    value={paymentForm.reference_number}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference_number: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">Record Payment</button>
            </form>
          )}

          {activeSection === 'invoices' && (
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoice_number}</td>
                    <td>{clients.find(c => c.id === invoice.client_id)?.name || 'Unknown'}</td>
                    <td>${invoice.amount.toFixed(2)}</td>
                    <td><span className={`status status-${invoice.status}`}>{invoice.status}</span></td>
                    <td>{new Date(invoice.issue_date).toLocaleDateString()}</td>
                    <td>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSection === 'payments' && (
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{clients.find(c => c.id === payment.client_id)?.name || 'Unknown'}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>{payment.payment_method.replace('_', ' ')}</td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td>{payment.reference_number || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSection === 'expenses' && (
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                    <td><span className={`status status-active`}>{expense.category}</span></td>
                    <td>{expense.vendor || '-'}</td>
                    <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountingDashboard
