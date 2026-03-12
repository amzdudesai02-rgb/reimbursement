import axios from 'axios'

// Use relative /api in production so Vercel proxies to backend — avoids browser
// connecting to api.reimbursement.amzdudes.io directly (fixes "cannot connect"
// when that host is blocked or unreachable).
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (isLocalhost ? 'http://localhost:8000/api' : '/api')

export const api = axios.create({ baseURL: API_BASE })

// Attach JWT from localStorage (keeps user logged in across refreshes).
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Global 401 handler: if a request fails with Unauthorized *and* we currently
// have a token, clear it and send the user back to the login screen so they
// can obtain a fresh session instead of getting stuck on 401 errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      error?.response?.status === 401 &&
      localStorage.getItem('token')
    ) {
      localStorage.removeItem('token')
      // Avoid redirect loop if already on login page.
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?session=expired'
      }
    }
    return Promise.reject(error)
  },
)