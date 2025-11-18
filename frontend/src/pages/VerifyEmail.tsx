import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthContext'

type ApiError = { detail?: string }

export default function VerifyEmail(){
  const [status,setStatus]=useState<'loading'|'success'|'error'>('loading')
  const [message,setMessage]=useState('Verifying your email...')
  const [searchParams]=useSearchParams()
  const token = searchParams.get('token')
  const { login } = useAuth()
  const nav = useNavigate()

  useEffect(()=>{
    async function verify(){
      if(!token){
        setStatus('error')
        setMessage('Missing verification token.')
        return
      }
      try{
        const { data } = await api.post('/auth/verify',{ token })
        login(data.access_token)
        setStatus('success')
        setMessage('Email verified! Redirecting to your dashboard...')
        setTimeout(()=> nav('/dashboard'), 1500)
      }catch(error){
        const axiosErr = error as AxiosError<ApiError>
        setStatus('error')
        setMessage(axiosErr.response?.data?.detail ?? 'Verification failed.')
      }
    }
    verify()
  },[token, login, nav])

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 text-center space-y-4">
      <h2 className="text-2xl font-semibold">Verify Email</h2>
      <p className={status === 'error' ? 'text-red-600' : status === 'success' ? 'text-green-600' : 'text-neutral-600'}>
        {message}
      </p>
      {status === 'error' && (
        <div className="text-sm text-neutral-600 space-y-2">
          <p>Need a new link? <Link to="/signup" className="text-orange-600 underline">Request verification again</Link></p>
          <p>
            Already verified? <Link to="/login" className="text-orange-600 underline">Login here</Link>
          </p>
        </div>
      )}
    </div>
  )
}

