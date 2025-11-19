import { useState } from 'react'
import type { AxiosError } from 'axios'
import { api } from '../lib/api'
import { useAuth } from '../auth/useAuth'
import { Link, useNavigate } from 'react-router-dom'

type ApiErrorDetail = string | { code?: string; message?: string }
type ApiErrorResponse = { detail?: ApiErrorDetail }

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState<string|null>(null)
  const [resendMsg,setResendMsg]=useState<string|null>(null)
  const [loading,setLoading]=useState(false)
  const [showResend,setShowResend]=useState(false)
  const { login } = useAuth(); const nav = useNavigate()

  const detailToMessage = (detail?: ApiErrorDetail) => {
    if (!detail) return 'Login failed'
    if (typeof detail === 'string') return detail
    return detail.message ?? 'Login failed'
  }

  async function submit(e: React.FormEvent){
    e.preventDefault(); setErr(null); setResendMsg(null); setShowResend(false); setLoading(true)
    try{
      const { data } = await api.post('/auth/login',{email,password})
      login(data.access_token); nav('/dashboard')
    }catch(error){
      const axiosErr = error as AxiosError<ApiErrorResponse>
      const detail = axiosErr.response?.data?.detail
      setErr(detailToMessage(detail))
      if (typeof detail === 'object' && detail?.code === 'EMAIL_NOT_VERIFIED'){
        setShowResend(true)
      }
    }finally{
      setLoading(false)
    }
  }

  async function resend(){
    if(!email) return
    setResendMsg(null); setErr(null)
    try{
      const { data } = await api.post('/auth/resend-verification',{ email })
      setResendMsg(data.message ?? 'Verification email resent.')
    }catch(error){
      const axiosErr = error as AxiosError<ApiErrorResponse>
      setErr(detailToMessage(axiosErr.response?.data?.detail))
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
       <h2 className="text-xl font-semibold">Welcome back</h2>
       {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
       {resendMsg && <p className="text-sm text-green-600 mt-2">{resendMsg}</p>}
       <form onSubmit={submit} className="space-y-3 mt-3">
         <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg p-2"/>
         <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-lg p-2"/>
         <button disabled={loading} className="w-full py-2 rounded-lg text-white disabled:opacity-70" style={{backgroundImage:'linear-gradient(135deg,#FF9900,#FF6A00)'}}>
          {loading ? 'Signing in...' : 'Login'}
         </button>
       </form>
       {showResend && (
        <button type="button" onClick={resend} className="text-xs text-orange-600 underline mt-2">
          Resend verification email
        </button>
       )}
       <p className="text-sm mt-3">No account? <Link to="/signup" className="underline">Sign up</Link></p>
   </div>
 )
}