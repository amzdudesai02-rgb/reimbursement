import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import { api } from '../lib/api'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'no-token' | 'no-code'

export default function AmazonAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string>('')

  const code = searchParams.get('spapi_oauth_code') || searchParams.get('code')
  const sellingPartnerId = searchParams.get('selling_partner_id')
  const state = searchParams.get('state')

  useEffect(() => {
    if (status !== 'idle') return

    if (!token) {
      setStatus('no-token')
      return
    }

    if (!code || !sellingPartnerId || !state) {
      setStatus('no-code')
      return
    }

    setStatus('loading')
    api
      .post<{ store_id: number; store_name: string; message: string }>('/auth/amazon/callback', {
        spapi_oauth_code: code,
        selling_partner_id: sellingPartnerId,
        state,
      })
      .then((res) => {
        setStatus('success')
        setMessage(res.data.message ?? 'Amazon store connected successfully!')
        if (window.opener) {
          window.opener.postMessage(
            { type: 'AMAZON_CONNECTED', store_id: res.data.store_id, store_name: res.data.store_name, message: res.data.message },
            window.location.origin
          )
          window.close()
        } else {
          // Same-tab flow: go to Manage Stores and trigger sync via query so data loads
          setTimeout(() => navigate('/stores?amazon_connected=1', { replace: true }), 1500)
        }
      })
      .catch((err: { response?: { data?: { detail?: string } }; message?: string }) => {
        setStatus('error')
        const detail = err.response?.data?.detail
        setMessage(typeof detail === 'string' ? detail : detail ?? err.message ?? 'Failed to connect Amazon account.')
      })
  }, [code, sellingPartnerId, state, token, status, navigate])

  // Minimal layout so it works when opened from redirect (no Shell)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {status === 'loading' && (
          <>
            <div className="flex justify-center text-teal-600 mb-4">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
            <p className="text-center text-slate-600 font-medium">Connecting your Amazon account…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center text-green-600 mb-4">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="text-lg font-semibold text-slate-900 text-center mb-2">Connected</h1>
            <p className="text-slate-600 text-center text-sm">{message}</p>
            <p className="text-slate-500 text-center text-xs mt-3">Redirecting to Manage Stores…</p>
            <Link to="/stores" className="mt-4 block text-center text-sm font-medium text-teal-600 hover:text-teal-700">
              Go to Manage Stores
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center text-red-500 mb-4">
              <XCircle className="h-12 w-12" />
            </div>
            <h1 className="text-lg font-semibold text-slate-900 text-center mb-2">Connection failed</h1>
            <p className="text-slate-600 text-center text-sm">{message}</p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/stores"
                className="rounded-xl bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-teal-700"
              >
                Back to Manage Stores
              </Link>
              <Link to="/login" className="text-center text-sm text-slate-500 hover:text-slate-700">
                Sign in again
              </Link>
            </div>
          </>
        )}

        {status === 'no-token' && (
          <>
            <h1 className="text-lg font-semibold text-slate-900 text-center mb-2">Sign in required</h1>
            <p className="text-slate-600 text-center text-sm mb-6">
              Please sign in, then use Connect Amazon from Manage Stores to link your account.
            </p>
            <Link
              to="/login"
              className="block w-full rounded-xl bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-teal-700"
            >
              Sign in
            </Link>
            <Link to="/" className="mt-3 block text-center text-sm text-slate-500 hover:text-slate-700">
              Back to home
            </Link>
          </>
        )}

        {status === 'no-code' && (
          <>
            <h1 className="text-lg font-semibold text-slate-900 text-center mb-2">No authorization data</h1>
            <p className="text-slate-600 text-center text-sm mb-6">
              This page is used after you authorize the app on Amazon. Start from Manage Stores and click Connect Amazon.
            </p>
            <Link
              to="/stores"
              className="block w-full rounded-xl bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-teal-700"
            >
              Go to Manage Stores
            </Link>
          </>
        )}

        {status === 'idle' && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        )}
      </div>
    </div>
  )
}
