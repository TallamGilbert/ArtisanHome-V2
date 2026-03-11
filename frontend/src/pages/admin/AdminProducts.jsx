import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import ImageManager from '../../components/admin/ImageManager'
import toast from 'react-hot-toast'

const EMPTY = {
  name: '', price: '', original_price: '', category_id: '',
  material: '', finish: '', dimensions: '', weight: '',
  stock: '', description: '', colors: '',
  is_featured: false, is_best_seller: false, images: [],
}

export default function AdminProducts() {
  const { products, categories, loading, addProduct, updateProduct, deleteProduct } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('')

  const filtered = products.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.material?.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || p.category?.id === parseInt(filterCat)
    return matchSearch && matchCat
  })

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name:           p.name           || '',
      price:          p.price          || '',
      original_price: p.original_price || '',
      category_id:    p.category?.id   || '',
      material:       p.material       || '',
      finish:         p.finish         || '',
      dimensions:     p.dimensions     || '',
      weight:         p.weight         || '',
      stock:          p.stock          ?? '',
      description:    p.description    || '',
      colors:         Array.isArray(p.colors) ? p.colors.join(', ') : '',
      is_featured:    p.is_featured    || false,
      is_best_seller: p.is_best_seller || false,
      images:         p.images         || [],
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim())   { toast.error('Product name is required'); return }
    if (!form.price)         { toast.error('Price is required'); return }
    if (!form.category_id)   { toast.error('Please select a category'); return }
    if (!form.images.length) { toast.error('At least one image URL is required'); return }

    setSaving(true)
    try {
      if (editing) {
        await updateProduct(editing.id, form)
        toast.success('Product updated')
      } else {
        await addProduct(form)
        toast.success('Product created')
      }
      setShowModal(false)
    } catch (err) {
      const msg = err?.response?.data?.message
        || Object.values(err?.response?.data?.errors || {}).flat().join(', ')
        || 'Failed to save product'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(product.id)
      toast.success('Product deleted')
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-400 text-artisan-charcoal">Products</h1>
          <p className="font-body text-sm text-gray-500 mt-1">
            {loading ? 'Loading…' : `${products.length} total · ${filtered.length} shown`}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Product</button>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6 flex flex-wrap gap-4 items-center">
        <input type="text" placeholder="Search by name or material…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="input-field flex-1 min-w-48" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="input-field w-48">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {(search || filterCat) && (
          <button onClick={() => { setSearch(''); setFilterCat('') }}
            className="font-body text-xs text-artisan-gray-soft hover:text-artisan-brown underline">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th>Product</th><th>Category</th><th>Price</th>
                <th>Stock</th><th>Flags</th><th>Images</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400 font-body text-sm">Loading products…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400 font-body text-sm">No products found</td></tr>
              ) : filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-artisan-cream flex-shrink-0 overflow-hidden border border-artisan-warm">
                        {product.images?.[0]
                          ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-sm font-500 text-artisan-charcoal truncate max-w-[160px]">{product.name}</p>
                        <p className="font-body text-xs text-gray-400 truncate max-w-[160px]">{product.material || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="font-body text-sm">{product.category?.name || '—'}</span></td>
                  <td>
                    <span className="font-body text-sm font-500">${Number(product.price).toLocaleString()}</span>
                    {product.original_price && (
                      <span className="font-body text-xs text-gray-400 line-through ml-1.5">${Number(product.original_price).toLocaleString()}</span>
                    )}
                  </td>
                  <td>
                    <span className={`font-body text-sm font-500 ${product.stock < 5 ? 'text-red-500' : product.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {product.is_featured    && <span className="status-badge bg-purple-50 text-purple-700">Featured</span>}
                      {product.is_best_seller && <span className="status-badge bg-artisan-beige text-artisan-brown">Best Seller</span>}
                      {!product.is_featured && !product.is_best_seller && <span className="text-gray-300 text-xs">—</span>}
                    </div>
                  </td>
                  <td><span className="font-body text-sm text-gray-500">{product.images?.length || 0}</span></td>
                  <td>
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(product)} className="font-body text-xs text-artisan-brown hover:underline font-500">Edit</button>
                      <button onClick={() => handleDelete(product)} className="font-body text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl my-8 shadow-2xl">

            <div className="flex justify-between items-center px-8 py-5 border-b border-artisan-warm sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-display text-2xl font-400">{editing ? 'Edit Product' : 'Add Product'}</h2>
                {editing && <p className="font-body text-xs text-gray-400 mt-0.5">{editing.name}</p>}
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            <div className="px-8 py-6 space-y-6">
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-3 font-500">Product Images — CDN URLs</label>
                <ImageManager images={form.images} onChange={imgs => f('images', imgs)} maxImages={6} />
              </div>

              <div className="border-t border-artisan-warm pt-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Product Name *</label>
                  <input type="text" value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Oslo Lounge Chair" className="input-field" />
                </div>
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Price ($) *</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={e => f('price', e.target.value)} placeholder="0.00" className="input-field" />
                </div>
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Original Price — if on sale ($)</label>
                  <input type="number" min="0" step="0.01" value={form.original_price} onChange={e => f('original_price', e.target.value)} placeholder="Leave blank if not on sale" className="input-field" />
                </div>
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Category *</label>
                  <select value={form.category_id} onChange={e => f('category_id', e.target.value)} className="input-field">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Stock Quantity</label>
                  <input type="number" min="0" value={form.stock} onChange={e => f('stock', e.target.value)} placeholder="0" className="input-field" />
                </div>
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Material</label>
                  <input type="text" value={form.material} onChange={e => f('material', e.target.value)} placeholder="e.g. Full-Grain Leather" className="input-field" />
                </div>
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Finish</label>
                  <input type="text" value={form.finish} onChange={e => f('finish', e.target.value)} placeholder="e.g. Walnut" className="input-field" />
                </div>
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Dimensions</label>
                  <input type="text" value={form.dimensions} onChange={e => f('dimensions', e.target.value)} placeholder='e.g. 32"W × 34"D × 33"H' className="input-field" />
                </div>
                <div>
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Weight</label>
                  <input type="text" value={form.weight} onChange={e => f('weight', e.target.value)} placeholder="e.g. 48 lbs" className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Colors / Finishes <span className="text-gray-400">(comma separated)</span></label>
                  <input type="text" value={form.colors} onChange={e => f('colors', e.target.value)} placeholder="e.g. Cognac, Midnight, Ivory" className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block font-body text-xs text-gray-500 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => f('description', e.target.value)} rows={4} placeholder="Describe the product…" className="input-field resize-none" />
                </div>
                <div className="col-span-2 flex gap-8">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={form.is_featured} onChange={e => f('is_featured', e.target.checked)} className="w-4 h-4 accent-artisan-brown" />
                    <div>
                      <p className="font-body text-sm text-artisan-charcoal">Featured on Homepage</p>
                      <p className="font-body text-xs text-gray-400">Shows in Featured Pieces</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={form.is_best_seller} onChange={e => f('is_best_seller', e.target.checked)} className="w-4 h-4 accent-artisan-brown" />
                    <div>
                      <p className="font-body text-sm text-artisan-charcoal">Best Seller</p>
                      <p className="font-body text-xs text-gray-400">Shows in Best Sellers</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-8 py-5 border-t border-artisan-warm bg-gray-50 sticky bottom-0">
              <button onClick={() => setShowModal(false)} className="btn-outline" disabled={saving}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}