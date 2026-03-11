import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import ImageManager from '../../components/admin/ImageManager'
import toast from 'react-hot-toast'

// ── CATEGORIES ────────────────────────────────────────────────────────────────

export function AdminCategories() {
  const { categories, products, loading, addCategory, updateCategory, deleteCategory } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [saving, setSaving]       = useState(false)
  const [form, setForm]           = useState({ name: '', description: '', images: [] })

  const productCount = (catId) => products.filter(p => p.category?.id === catId).length

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '', images: [] }); setShowModal(true) }

  const openEdit = (cat) => {
    setEditing(cat)
    setForm({ name: cat.name || '', description: cat.description || '', images: cat.image ? [cat.image] : [] })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Category name is required'); return }
    setSaving(true)
    try {
      const payload = { name: form.name.trim(), description: form.description, image: form.images[0] || null }
      if (editing) {
        await updateCategory(editing.id, payload)
        toast.success('Category updated')
      } else {
        await addCategory(payload)
        toast.success('Category created')
      }
      setShowModal(false)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (cat) => {
    const count = productCount(cat.id)
    if (count > 0) { toast.error(`Cannot delete — ${count} product${count > 1 ? 's are' : ' is'} in this category`); return }
    if (!confirm(`Delete category "${cat.name}"?`)) return
    try {
      await deleteCategory(cat.id)
      toast.success('Category deleted')
    } catch (err) {
      toast.error('Failed to delete category')
    }
  }

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-4xl font-400 text-artisan-charcoal">Categories</h1>
          <p className="font-body text-sm text-gray-500 mt-1">{loading ? 'Loading…' : `${categories.length} categories`}</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Category</button>
      </div>

      {loading ? (
        <p className="font-body text-sm text-gray-400 text-center py-16">Loading categories…</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(cat => {
            const count = productCount(cat.id)
            return (
              <div key={cat.id} className="admin-card relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-artisan-brown" />
                <div className="aspect-video overflow-hidden mb-4 bg-artisan-cream">
                  {cat.image
                    ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => e.target.style.display='none'} />
                    : <div className="w-full h-full flex items-center justify-center"><p className="font-body text-xs text-gray-400">No image</p></div>
                  }
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-body text-base font-500 text-artisan-charcoal">{cat.name}</h3>
                    <p className="font-body text-xs text-gray-400 mt-0.5">{count} product{count !== 1 ? 's' : ''}</p>
                    {cat.description && <p className="font-body text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{cat.description}</p>}
                  </div>
                  <div className="flex gap-3 flex-shrink-0 ml-3">
                    <button onClick={() => openEdit(cat)} className="font-body text-xs text-artisan-brown hover:underline font-500">Edit</button>
                    <button onClick={() => handleDelete(cat)} className="font-body text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center px-8 py-5 border-b border-artisan-warm">
              <h2 className="font-display text-2xl font-400">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-3 font-500">Category Image — CDN URL</label>
                <ImageManager images={form.images} onChange={imgs => f('images', imgs)} maxImages={1} />
              </div>
              <div className="border-t border-artisan-warm pt-5 space-y-4">
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Category Name *</label>
                  <input type="text" value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Living Room" className="input-field" />
                </div>
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => f('description', e.target.value)} rows={3} placeholder="Brief description…" className="input-field resize-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-8 py-5 border-t border-artisan-warm bg-gray-50">
              <button onClick={() => setShowModal(false)} className="btn-outline" disabled={saving}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── CUSTOMERS ─────────────────────────────────────────────────────────────────

const CUSTOMERS = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@example.com', city: 'New York, NY', orders: 4, totalSpent: 12480, joined: '2023-06-15' },
  { id: 2, name: 'James Kowalski', email: 'james@example.com', city: 'Chicago, IL', orders: 2, totalSpent: 7380, joined: '2023-09-22' },
  { id: 3, name: 'Emma Laurent', email: 'emma@example.com', city: 'San Francisco, CA', orders: 3, totalSpent: 9450, joined: '2023-11-08' },
  { id: 4, name: 'David Park', email: 'david@example.com', city: 'Seattle, WA', orders: 1, totalSpent: 3890, joined: '2024-01-15' },
  { id: 5, name: 'Isabelle Torres', email: 'isa@example.com', city: 'Miami, FL', orders: 5, totalSpent: 15280, joined: '2022-12-01' },
]

export function AdminCustomers() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = CUSTOMERS.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-400 text-artisan-charcoal">Customers</h1>
        <p className="font-body text-sm text-gray-500 mt-1">{CUSTOMERS.length} registered customers</p>
      </div>
      <div className="admin-card mb-6">
        <input type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} className="input-field max-w-md" />
      </div>
      <div className="admin-card">
        <table className="w-full admin-table">
          <thead><tr><th>Customer</th><th>Location</th><th>Orders</th><th>Total Spent</th><th>Since</th><th></th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-artisan-brown rounded-full flex items-center justify-center text-white font-body text-xs font-500 flex-shrink-0">{c.name[0]}</div>
                    <div>
                      <p className="font-body text-sm font-500 text-artisan-charcoal">{c.name}</p>
                      <p className="font-body text-xs text-gray-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td><span className="font-body text-sm">{c.city}</span></td>
                <td><span className="font-body text-sm">{c.orders}</span></td>
                <td><span className="font-body text-sm font-500">${c.totalSpent.toLocaleString()}</span></td>
                <td><span className="font-body text-xs text-gray-400">{c.joined}</span></td>
                <td>
                  <button onClick={() => setSelected(selected?.id === c.id ? null : c)}
                    className="font-body text-xs text-artisan-brown hover:underline">
                    {selected?.id === c.id ? 'Hide' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selected && (
          <div className="border-t border-artisan-warm p-6 bg-artisan-cream">
            <div className="flex justify-between mb-4">
              <h3 className="font-body text-sm font-500">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 text-sm">✕</button>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div><p className="font-body text-xs text-gray-400 mb-1">Email</p><p className="font-body text-sm">{selected.email}</p></div>
              <div><p className="font-body text-xs text-gray-400 mb-1">Location</p><p className="font-body text-sm">{selected.city}</p></div>
              <div><p className="font-body text-xs text-gray-400 mb-1">Orders</p><p className="font-display text-2xl">{selected.orders}</p></div>
              <div><p className="font-body text-xs text-gray-400 mb-1">Lifetime Value</p><p className="font-display text-2xl text-artisan-brown">${selected.totalSpent.toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}