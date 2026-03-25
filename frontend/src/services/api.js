import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true, // send the httpOnly artisan_token cookie automatically
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Response interceptor — redirect to login when an authenticated request expires.
// Requests can set _skipRedirect: true to suppress this (e.g. the initial auth check).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?._skipRedirect) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
