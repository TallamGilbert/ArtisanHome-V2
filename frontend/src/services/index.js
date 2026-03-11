import api from './api'

export const productService = {
  getAll:       (params) => api.get('/products', { params }),
  getById:      (id)     => api.get(`/products/${id}`),
  getFeatured:  ()       => api.get('/products/featured'),
  getBestSellers: ()     => api.get('/products/best-sellers'),
  search:       (q)      => api.get('/products/search', { params: { q } }),
  getByCategory:(slug, params) => api.get(`/categories/${slug}/products`, { params }),

  // Admin — JSON body (images are CDN URLs, not file uploads)
  create: (data) => api.post('/admin/products', data),
  update: (id, data) => api.put('/admin/products/{id}'.replace('{id}', id), data),
  delete: (id) => api.delete(`/admin/products/${id}`),
}

export const categoryService = {
  getAll:  ()         => api.get('/categories'),
  getById: (id)       => api.get(`/categories/${id}`),
  create:  (data)     => api.post('/admin/categories', data),
  update:  (id, data) => api.put(`/admin/categories/${id}`, data),
  delete:  (id)       => api.delete(`/admin/categories/${id}`),
}

export const orderService = {
  create:      (data)   => api.post('/orders', data),
  getMyOrders: ()       => api.get('/orders'),
  getById:     (id)     => api.get(`/orders/${id}`),
  getAll:      (params) => api.get('/admin/orders', { params }),
  updateStatus:(id, status) => api.put(`/admin/orders/${id}/status`, { status }),
}

export const reviewService = {
  getForProduct: (productId)       => api.get(`/products/${productId}/reviews`),
  create:        (productId, data) => api.post(`/products/${productId}/reviews`, data),
  delete:        (id)              => api.delete(`/admin/reviews/${id}`),
}

export const userService = {
  getProfile:   ()     => api.get('/user'),
  updateProfile:(data) => api.put('/user', data),
  getAddresses: ()     => api.get('/user/addresses'),
  addAddress:   (data) => api.post('/user/addresses', data),
  getAll:       (params) => api.get('/admin/users', { params }),
  getById:      (id)   => api.get(`/admin/users/${id}`),
}

export const wishlistService = {
  getAll: ()          => api.get('/wishlist'),
  add:    (productId) => api.post('/wishlist', { product_id: productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
}

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
}