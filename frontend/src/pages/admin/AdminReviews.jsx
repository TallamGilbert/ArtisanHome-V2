import { useState, useEffect } from 'react'
import api from '../../services/api'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function AdminReviews() {
  const [reviews, setReviews]     = useState([])
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [filterProduct, setFilterProduct] = useState('')
  const [filterRating, setFilterRating]   = useState('')
  const [deleting, setDeleting]   = useState(null)
  const [toast, setToast]         = useState('')

  // Add review modal state
  const [showAdd, setShowAdd]     = useState(false)
  const [users, setUsers]         = useState([])
  const [newReview, setNewReview] = useState({ product_id: '', user_id: '', rating: 5, comment: '' })
  const [saving, setSaving]       = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [revRes, prodRes, userRes] = await Promise.all([
        api.get('/admin/reviews'),
        api.get('/admin/products?per_page=100'),
        api.get('/admin/users'),
      ])
      setReviews(revRes.data.data || revRes.data || [])
      setProducts(prodRes.data.data || [])
      setUsers(userRes.data.data || userRes.data || [])
    } catch (err) {
      showToast('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return
    setDeleting(id)
    try {
      await api.delete(`/admin/reviews/${id}`)
      setReviews(prev => prev.filter(r => r.id !== id))
      showToast('Review deleted')
    } catch {
      showToast('Failed to delete review')
    } finally {
      setDeleting(null)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newReview.product_id || !newReview.user_id || !newReview.comment.trim()) return
    setSaving(true)
    try {
      const res = await api.post(`/products/${newReview.product_id}/reviews`, {
        rating: newReview.rating,
        comment: newReview.comment,
        user_id: newReview.user_id,
      })
      await fetchAll() // refetch to get full data with relations
      setShowAdd(false)
      setNewReview({ product_id: '', user_id: '', rating: 5, comment: '' })
      showToast('Review added')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add review')
    } finally {
      setSaving(false)
    }
  }

  const filtered = reviews.filter(r => {
    if (filterProduct && String(r.product_id) !== filterProduct) return false
    if (filterRating && String(r.rating) !== filterRating) return false
    return true
  })

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-artisan-charcoal text-white px-6 py-3 rounded shadow-lg text-sm">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cormorant text-3xl text-artisan-charcoal">Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">{reviews.length} total reviews</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-6 py-2.5 bg-artisan-brown text-white text-sm tracking-widest uppercase hover:bg-artisan-charcoal transition-colors"
        >
          + Add Review
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterProduct}
          onChange={e => setFilterProduct(e.target.value)}
          className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-artisan-brown"
        >
          <option value="">All Products</option>
          {products.map(p => (
            <option key={p.id} value={String(p.id)}>{p.name}</option>
          ))}
        </select>
        <select
          value={filterRating}
          onChange={e => setFilterRating(e.target.value)}
          className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-artisan-brown"
        >
          <option value="">All Ratings</option>
          {[5,4,3,2,1].map(r => (
            <option key={r} value={String(r)}>{r} Stars</option>
          ))}
        </select>
        {(filterProduct || filterRating) && (
          <button
            onClick={() => { setFilterProduct(''); setFilterRating('') }}
            className="text-sm text-gray-400 hover:text-artisan-brown"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading reviews…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No reviews found</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-artisan-cream border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Customer</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Product</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Rating</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Comment</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(review => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-artisan-brown flex items-center justify-center text-white text-sm">
                        {review.user?.name?.[0] ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-artisan-charcoal">{review.user?.name ?? '—'}</p>
                        <p className="text-xs text-gray-400">{review.user?.email ?? ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-artisan-charcoal">{review.product?.name ?? `Product #${review.product_id}`}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-600 truncate">{review.comment}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deleting === review.id}
                      className="text-red-400 hover:text-red-600 text-sm disabled:opacity-50"
                    >
                      {deleting === review.id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Review Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-8">
            <h2 className="font-cormorant text-2xl text-artisan-charcoal mb-6">Add Review</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Product</label>
                <select
                  value={newReview.product_id}
                  onChange={e => setNewReview(r => ({ ...r, product_id: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-artisan-brown"
                >
                  <option value="">Select product…</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Customer</label>
                <select
                  value={newReview.user_id}
                  onChange={e => setNewReview(r => ({ ...r, user_id: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-artisan-brown"
                >
                  <option value="">Select customer…</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setNewReview(r => ({ ...r, rating: star }))}>
                      <svg className={`w-7 h-7 transition-colors ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                  rows={4}
                  required
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-artisan-brown resize-none"
                  placeholder="Review comment…"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-artisan-brown text-white text-sm tracking-widest uppercase hover:bg-artisan-charcoal transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Add Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 text-sm hover:border-artisan-brown transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}