import { useState } from 'react'
import type { AxiosError } from 'axios'
import { api } from '../lib/api'


export default function Contact(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [message,setMessage]=useState('');
  const [sent,setSent]=useState(false); const [err,setErr]=useState<string|null>(null)
  async function submit(e: React.FormEvent){ e.preventDefault(); setErr(null)
    try{ await api.post('/contact',{name,email,message}); setSent(true)} catch(error){
      const axiosErr = error as AxiosError<{ detail?: string }>
      setErr(axiosErr.response?.data?.detail||'Failed') }
  }
  if (sent) return <div className="p-6 bg-white rounded-2xl shadow">Thanks! We’ll get back to you shortly.</div>
  return (
    <form onSubmit={submit} className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 space-y-4">
       <h2 className="text-xl font-semibold">Contact Us</h2>
       {err && <p className="text-sm text-red-600">{err}</p>}
       <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border rounded-lg p-2"/>
       <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg p-2"/>
       <textarea required value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message" className="w-full border rounded-lg p-2 h-32"/>
       <button className="px-4 py-2 rounded-lg text-white" style={{backgroundImage:'linear-gradient(135deg,#FF9900,#FF6A00)'}}>Send</button>
    </form>
  )
}