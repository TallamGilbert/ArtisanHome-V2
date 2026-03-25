import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { orderService } from '../../services'

const STATUS_STYLES = {
  delivered:  'bg-green-50 text-green-700',
  shipped:    'bg-blue-50 text-blue-700',
  processing: 'bg-amber-50 text-amber-700',
  pending:    'bg-gray-100 text-gray-600',
  cancelled:  'bg-red-50 text-red-600',
}

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }

export default function AdminOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    setLoading(true)
    orderService.getAll()
      .then(res => setOrders(res.data?.data || res.data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter.toLowerCase())

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      await orderService.updateStatus(id, status.toLowerCase())
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status.toLowerCase() } : o))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status: status.toLowerCase() }))
      toast.success('Order status updated')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(null)
    }
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
              {cap(s)}
              {s !== 'All' && (
                <span className="ml-1 text-xs opacity-70">
                  ({orders.filter(o => o.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="admin-card">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array(6).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (
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
                    <tr key={order.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === order.id ? 'bg-artisan-cream' : ''}`}
                      onClick={() => setSelected(order)}
                    >
                      <td><span className="font-body text-xs font-500 text-artisan-brown">#{order.id}</span></td>
                      <td>
                        <div>
                          <p className="font-body text-sm font-500">{order.user?.name || order.shipping_name || '—'}</p>
                          <p className="font-body text-xs text-gray-400">{order.shipping_city || '—'}</p>
                        </div>
                      </td>
                      <td><span className="font-body text-sm font-500">KSh{Number(order.total).toLocaleString('en-KE')}</span></td>
                      <td>
                        <span className={`status-badge ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {cap(order.status)}
                        </span>
                      </td>
                      <td><span className="font-body text-xs text-gray-400">{order.created_at?.slice(0, 10)}</span></td>
                      <td>
                        <select
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value) }}
                          onClick={e => e.stopPropagation()}
                          className="font-body text-xs text-gray-600 border border-gray-200 px-2 py-1 focus:outline-none focus:border-artisan-brown disabled:opacity-50"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{cap(s)}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr><td colSpan={6} className="text-center py-10 font-body text-sm text-gray-400">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
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
                <p className="font-body text-sm font-500 text-artisan-brown">#{selected.id}</p>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">Customer</p>
                <p className="font-body text-sm font-500">{selected.user?.name || selected.shipping_name || '—'}</p>
                <p className="font-body text-xs text-gray-400">{selected.user?.email || selected.shipping_email || '—'}</p>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">Shipping Address</p>
                <p className="font-body text-sm">{[selected.shipping_address, selected.shipping_city, selected.shipping_country].filter(Boolean).join(', ') || '—'}</p>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-1">Items</p>
                {(selected.items || []).map((item, i) => (
                  <p key={i} className="font-body text-sm text-artisan-charcoal">
                    · {item.product?.name || '—'} ×{item.quantity}
                  </p>
                ))}
                {!selected.items?.length && <p className="font-body text-sm text-gray-400">—</p>}
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <p className="font-body text-xs text-gray-400">Total</p>
                  <p className="font-display text-xl text-artisan-charcoal">KSh{Number(selected.total).toLocaleString('en-KE')}</p>
                </div>
              </div>
              <div>
                <p className="font-body text-xs text-gray-400 mb-2">Update Status</p>
                <select
                  value={selected.status}
                  disabled={updating === selected.id}
                  onChange={e => updateStatus(selected.id, e.target.value)}
                  className="input-field text-sm disabled:opacity-50"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{cap(s)}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
