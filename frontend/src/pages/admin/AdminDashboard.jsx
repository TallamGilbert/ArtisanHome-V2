import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_PRODUCTS } from '../../services/mockData'

const STATS = [
  { label: 'Total Revenue', value: '$284,920', change: '+18.2%', up: true, icon: '◈' },
  { label: 'Total Orders', value: '1,284', change: '+12.5%', up: true, icon: '◷' },
  { label: 'Active Customers', value: '4,821', change: '+8.3%', up: true, icon: '◉' },
  { label: 'Products Listed', value: '148', change: '-2', up: false, icon: '◻' },
]

const RECENT_ORDERS = [
  { id: 'AH-001284', customer: 'Sarah Mitchell', product: 'Oslo Lounge Chair', amount: '$2,890', status: 'Delivered', date: '2024-03-05' },
  { id: 'AH-001283', customer: 'James Kowalski', product: 'Maren Sectional Sofa', amount: '$6,490', status: 'Shipped', date: '2024-03-04' },
  { id: 'AH-001282', customer: 'Emma Laurent', product: 'Vela Dining Table', amount: '$4,200', status: 'Processing', date: '2024-03-04' },
  { id: 'AH-001281', customer: 'David Park', product: 'Haven Bed Frame', amount: '$3,890', status: 'Pending', date: '2024-03-03' },
  { id: 'AH-001280', customer: 'Isabelle Torres', product: 'Ember Coffee Table', amount: '$1,280', status: 'Delivered', date: '2024-03-03' },
]

const STATUS_STYLES = {
  Delivered: 'bg-green-50 text-green-700',
  Shipped: 'bg-blue-50 text-blue-700',
  Processing: 'bg-amber-50 text-amber-700',
  Pending: 'bg-gray-100 text-gray-600',
}

const SALES_MONTHS = [
  { month: 'Oct', value: 65 },
  { month: 'Nov', value: 78 },
  { month: 'Dec', value: 92 },
  { month: 'Jan', value: 58 },
  { month: 'Feb', value: 84 },
  { month: 'Mar', value: 100 },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-400 text-artisan-charcoal">Dashboard</h1>
        <p className="font-body text-sm text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STATS.map(stat => (
          <div key={stat.label} className="admin-card">
            <div className="flex justify-between items-start mb-3">
              <p className="font-body text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <span className="text-artisan-brown text-lg">{stat.icon}</span>
            </div>
            <p className="font-display text-3xl text-artisan-charcoal mb-1">{stat.value}</p>
            <p className={`font-body text-xs ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
              {stat.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="admin-card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-body text-sm font-500 text-artisan-charcoal tracking-wide">Monthly Revenue</h3>
            <span className="font-body text-xs text-gray-400">Last 6 months</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {SALES_MONTHS.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-artisan-beige rounded-sm relative flex flex-col justify-end" style={{ height: '120px' }}>
                  <div
                    className="bg-artisan-brown rounded-sm transition-all duration-500"
                    style={{ height: `${m.value}%`, opacity: i === SALES_MONTHS.length - 1 ? 1 : 0.6 }}
                  />
                </div>
                <span className="font-body text-xs text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="admin-card">
          <h3 className="font-body text-sm font-500 text-artisan-charcoal mb-5">Top Products</h3>
          <div className="space-y-4">
            {MOCK_PRODUCTS.filter(p => p.is_best_seller).slice(0, 4).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="font-body text-xs text-gray-400 w-4">{i + 1}</span>
                <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 object-cover bg-artisan-cream flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs font-500 text-artisan-charcoal truncate">{p.name}</p>
                  <p className="font-body text-xs text-gray-400">${p.price?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-body text-sm font-500 text-artisan-charcoal">Recent Orders</h3>
          <Link to="/admin/orders" className="font-body text-xs text-artisan-brown hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td><span className="font-body text-xs font-500 text-artisan-brown">{order.id}</span></td>
                  <td><span className="font-body text-sm">{order.customer}</span></td>
                  <td><span className="font-body text-sm text-gray-600">{order.product}</span></td>
                  <td><span className="font-body text-sm font-500">{order.amount}</span></td>
                  <td>
                    <span className={`status-badge ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td><span className="font-body text-xs text-gray-400">{order.date}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
