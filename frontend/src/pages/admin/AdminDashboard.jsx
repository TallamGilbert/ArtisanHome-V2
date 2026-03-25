import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services'

const STATUS_STYLES = {
  delivered:  'bg-green-50 text-green-700',
  shipped:    'bg-blue-50 text-blue-700',
  processing: 'bg-amber-50 text-amber-700',
  pending:    'bg-gray-100 text-gray-600',
  cancelled:  'bg-red-50 text-red-600',
}

const STAT_ICONS = {
  'Total Revenue':    '◈',
  'Total Orders':     '◷',
  'Active Customers': '◉',
  'Products Listed':  '◻',
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Revenue',    value: `KSh${Number(stats.total_revenue || 0).toLocaleString('en-KE')}` },
    { label: 'Total Orders',     value: Number(stats.total_orders || 0).toLocaleString('en-KE') },
    { label: 'Active Customers', value: Number(stats.total_customers || 0).toLocaleString('en-KE') },
    { label: 'Products Listed',  value: Number(stats.total_products || 0).toLocaleString('en-KE') },
  ] : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-400 text-artisan-charcoal">Dashboard</h1>
        <p className="font-body text-sm text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="admin-card animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-8 bg-gray-200 rounded mb-2 w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))
          : statCards.map(stat => (
              <div key={stat.label} className="admin-card">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-body text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <span className="text-artisan-brown text-lg">{STAT_ICONS[stat.label]}</span>
                </div>
                <p className="font-display text-3xl text-artisan-charcoal mb-1">{stat.value}</p>
              </div>
            ))
        }
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="admin-card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-body text-sm font-500 text-artisan-charcoal">Recent Orders</h3>
            <Link to="/admin/orders" className="font-body text-xs text-artisan-brown hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
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
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recent_orders || []).slice(0, 5).map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td><span className="font-body text-xs font-500 text-artisan-brown">#{order.id}</span></td>
                      <td><span className="font-body text-sm">{order.user?.name || order.shipping_name || '—'}</span></td>
                      <td><span className="font-body text-sm font-500">KSh{Number(order.total).toLocaleString('en-KE')}</span></td>
                      <td>
                        <span className={`status-badge ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : '—'}
                        </span>
                      </td>
                      <td><span className="font-body text-xs text-gray-400">{order.created_at?.slice(0, 10)}</span></td>
                    </tr>
                  ))}
                  {!loading && !stats?.recent_orders?.length && (
                    <tr><td colSpan={5} className="text-center py-8 font-body text-sm text-gray-400">No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="admin-card">
          <h3 className="font-body text-sm font-500 text-artisan-charcoal mb-5">Top Products</h3>
          {loading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {(stats?.top_products || []).slice(0, 4).map((p, i) => {
                const img = Array.isArray(p.images) ? (p.images[0]?.url || p.images[0]) : null
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="font-body text-xs text-gray-400 w-4">{i + 1}</span>
                    {img && <img src={img} alt={p.name} className="w-10 h-10 object-cover bg-artisan-cream flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs font-500 text-artisan-charcoal truncate">{p.name}</p>
                      <p className="font-body text-xs text-gray-400">KSh{Number(p.price).toLocaleString('en-KE')}</p>
                    </div>
                  </div>
                )
              })}
              {!loading && !stats?.top_products?.length && (
                <p className="font-body text-sm text-gray-400 text-center py-4">No product data yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
