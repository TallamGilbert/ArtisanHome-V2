import { useState } from 'react'
import toast from 'react-hot-toast'

const ALL_ORDERS = [
  { id: 'AH-001284', customer: 'Sarah Mitchell', email: 'sarah@example.com', products: ['Oslo Lounge Chair'], amount: 2890, status: 'Delivered', date: '2024-03-05', city: 'New York, NY' },
  { id: 'AH-001283', customer: 'James Kowalski', email: 'james@example.com', products: ['Maren Sectional Sofa', 'Arc Floor Lamp'], amount: 7380, status: 'Shipped', date: '2024-03-04', city: 'Chicago, IL' },
  { id: 'AH-001282', customer: 'Emma Laurent', email: 'emma@example.com', products: ['Vela Dining Table'], amount: 4200, status: 'Processing', date: '2024-03-04', city: 'San Francisco, CA' },
  { id: 'AH-001281', customer: 'David Park', email: 'david@example.com', products: ['Haven Bed Frame'], amount: 3890, status: 'Pending', date: '2024-03-03', city: 'Seattle, WA' },
  { id: 'AH-001280', customer: 'Isabelle Torres', email: 'isa@example.com', products: ['Ember Coffee Table'], amount: 1280, status: 'Delivered', date: '2024-03-03', city: 'Miami, FL' },
  { id: 'AH-001279', customer: 'Michael Chen', email: 'mchen@example.com', products: ['Koru Armchair', 'Studio Writing Desk'], amount: 3570, status: 'Shipped', date: '2024-03-02', city: 'Austin, TX' },
  { id: 'AH-001278', customer: 'Olivia Ross', email: 'olivia@example.com', products: ['Oslo Lounge Chair'], amount: 2890, status: 'Processing', date: '2024-03-02', city: 'Boston, MA' },
]

const STATUS_STYLES = {
  Delivered: 'bg-green-50 text-green-700',
  Shipped: 'bg-blue-50 text-blue-700',
  Processing: 'bg-amber-50 text-amber-700',
  Pending: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-red-50 text-red-600',
}

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState(ALL_ORDERS)
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
    toast.success('Order status updated')
  }

  return (
    <div className="flex gap-6">
      {/* Orders List */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-400 text-artisan-charcoal">Orders</h1>
            <p className="font-body text-sm text-gray-500 mt-1">{orders.length} total orders</p>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['All', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 font-body text-xs transition-colors ${filter === s ? 'bg-artisan-brown text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-artisan-brown'}`}
            >
              {s}
              {s !== 'All' && <span className="ml-1 text-xs opacity-70">({orders.filter(o => o.status === s).length})</span>}
            </button>
          ))}
        </div>

        <div className="admin-card">
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === order.id ? 'bg-artisan-cream' : ''}`}
                    onClick={() => setSelected(order)}
                  >
                    <td><span className="font-body text-xs font-500 text-artisan-brown">{order.id}</span></td>
                    <td>
                      <div>
                        <p className="font-body text-sm font-500">{order.customer}</p>
                        <p className="font-body text-xs text-gray-400">{order.city}</p>
                      </div>
                    </td>
                    <td><span className="font-body text-sm font-500">${order.amount.toLocaleString()}</span></td>
                    <td>
                      <span className={`status-badge ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                    </td>
                    <td><span className="font-body text-xs text-gray-400">{order.date}</span></td>
                    <td>
                      <select
                        value={order.status}
                        onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value) }}
                        onClick={e => e.stopPropagation()}
                        className="font-body text-xs text-gray-600 border border-gray-200 px-2 py-1 focus:outline-none focus:border-artisan-brown"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Panel */}
      {selected && (
        <div className="w-72 flex-shrink-0">
          <div className="admin-card sticky top-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-body text-sm font-500 text-artisan-charcoal">Order Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">Order ID</p>
                <p className="font-body text-sm font-500 text-artisan-brown">{selected.id}</p>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">Customer</p>
                <p className="font-body text-sm font-500">{selected.customer}</p>
                <p className="font-body text-xs text-gray-400">{selected.email}</p>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">Location</p>
                <p className="font-body text-sm">{selected.city}</p>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">Products</p>
                {selected.products.map(p => (
                  <p key={p} className="font-body text-sm text-artisan-charcoal">· {p}</p>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <p className="font-body text-xs text-gray-400">Total</p>
                  <p className="font-display text-xl text-artisan-charcoal">${selected.amount.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-2">Update Status</p>
                <select
                  value={selected.status}
                  onChange={e => updateStatus(selected.id, e.target.value)}
                  className="input-field text-sm"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
