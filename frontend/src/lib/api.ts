import axios from 'axios'

// Use relative /api in production so Vercel proxies to backend — avoids browser connecting to api.reimbursement.amzdudes.io directly (fixes "cannot connect" when that host is blocked or unreachable).
const isLocalhost =
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (isLocalhost ? 'http://localhost:8000/api' : '/api')
export const api = axios.create({ baseURL: API_BASE })


api.interceptors.request.use((config)=>{
const token = localStorage.getItem('token')
if (token) config.headers.Authorization = `Bearer ${token}`
return config
})