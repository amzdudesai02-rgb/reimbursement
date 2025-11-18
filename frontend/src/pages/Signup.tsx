import { useState } from 'react'
import type { AxiosError } from 'axios'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

type ApiMessage = { detail?: string; message?: string }

export default function Signup(){
   const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('')
   const [err,setErr]=useState<string|null>(null)
   const [success,setSuccess]=useState<string | null>(null)
   const [loading,setLoading]=useState(false)
   const [resendMsg,setResendMsg]=useState<string | null>(null)

   async function submit(e: React.FormEvent){
      e.preventDefault(); setErr(null); setSuccess(null); setResendMsg(null); setLoading(true)
      try{
         await api.post('/auth/signup',{name,email,password})
         setSuccess('Verification email sent! Check your inbox and click the link to activate your account.')
      }catch(error){
         const axiosErr = error as AxiosError<ApiMessage>
         setErr(axiosErr.response?.data?.detail ?? 'Signup failed')
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
         const axiosErr = error as AxiosError<ApiMessage>
         setErr(axiosErr.response?.data?.detail ?? 'Unable to resend email')
      }
   }
return (
   <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
     <h2 className="text-xl font-semibold">Create account</h2>
     {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
     {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
     {resendMsg && <p className="text-sm text-green-600 mt-1">{resendMsg}</p>}
     <form onSubmit={submit} className="space-y-3 mt-3">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border rounded-lg p-2"/>
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg p-2"/>
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-lg p-2"/>
        <button disabled={loading} className="w-full py-2 rounded-lg text-white disabled:opacity-70" style={{backgroundImage:'linear-gradient(135deg,#FF9900,#FF6A00)'}}>
          {loading ? 'Submitting...' : 'Send verification link'}
        </button>
      </form>
      <div className="mt-4 text-sm space-y-2">
        <p>Already verified? <Link to="/login" className="underline text-orange-600">Log in</Link></p>
        <button type="button" disabled={!email} onClick={resend} className="text-xs text-neutral-500 underline disabled:opacity-50">
          Resend verification email
        </button>
      </div>
   </div>
 )
}