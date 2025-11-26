import { useState } from 'react'
import type { AxiosError } from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Lock, Mail, Shield, Zap } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../auth/useAuth'

type ApiErrorDetail = string | { code?: string; message?: string }
type ApiErrorResponse = { detail?: ApiErrorDetail }

const authStats = [
  { label: 'Avg. approval rate', value: '99.1%' },
  { label: 'Recovered since Sept', value: '$1.9M' },
  { label: 'Live dashboards', value: '12K sellers' },
]

const assurances = [
  'SOC2-ready infrastructure',
  'Seller Central OAuth only',
  'Bank-grade encryption & MFA',
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const detailToMessage = (detail?: ApiErrorDetail) => {
    if (!detail) return 'Login failed'
    if (typeof detail === 'string') return detail
    return detail.message ?? 'Login failed'
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setResendMsg(null)
    setShowResend(false)
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.access_token)
      nav('/dashboard')
    } catch (error) {
      const axiosErr = error as AxiosError<ApiErrorResponse>
      const detail = axiosErr.response?.data?.detail
      setErr(detailToMessage(detail))
      if (typeof detail === 'object' && detail?.code === 'EMAIL_NOT_VERIFIED') {
        setShowResend(true)
      }
    } finally {
      setLoading(false)
    }
  }

  async function resend() {
    if (!email) return
    setResendMsg(null)
    setErr(null)
    try {
      const { data } = await api.post('/auth/resend-verification', { email })
      setResendMsg(data.message ?? 'Verification email resent.')
    } catch (error) {
      const axiosErr = error as AxiosError<ApiErrorResponse>
      setErr(detailToMessage(axiosErr.response?.data?.detail))
    }
  }

  return (
    <div
      className="rounded-[36px] border border-slate-100 bg-white/80 p-6 shadow-[0_40px_120px_rgba(12,38,131,0.12)] backdrop-blur"
      style={{ colorScheme: 'light' }}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0B64FF] via-[#0645D6] to-[#021A62] p-10 text-white">
          <div className="relative space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              <Zap className="h-4 w-4" />
              Secure Access
            </span>
            <div>
              <p className="text-sm font-semibold text-white/80">AMZDudes Console</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight">
                Log in to monitor reimbursements in real time.
              </h1>
            </div>
            <p className="text-white/80">
              One-click visibility into every case, approval, and claim packet—
              built for FBA recovery operators who need instant clarity.
            </p>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-3">
              {authStats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {assurances.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <span className="text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-6 -top-8 h-24 w-24 rounded-full border border-white/30" />
            <div className="absolute bottom-2 right-4 h-32 w-32 rounded-full border border-white/30" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-100 bg-white dark:bg-white p-8 shadow-2xl sm:p-10">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#0B64FF]">Welcome back</p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Sign in to your dashboard
            </h2>
            <p className="text-sm text-slate-500">
              Need an account?{' '}
              <Link to="/signup" className="font-semibold text-[#0B64FF] underline-offset-2 hover:underline">
                Start free audit
              </Link>
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600" htmlFor="email">
                Work email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@brand.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-inner focus:border-[#0B64FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B64FF]/20 dark:bg-white dark:text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-inner focus:border-[#0B64FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B64FF]/20 dark:bg-white dark:text-slate-900"
                />
              </div>
            </div>

            {err && (
              <div className="rounded-xl bg-rose-50/70 p-3 text-sm text-rose-600" aria-live="polite">
                {err}
              </div>
            )}
            {resendMsg && (
              <div className="rounded-xl bg-emerald-50/80 p-3 text-sm text-emerald-700" aria-live="polite">
                {resendMsg}
              </div>
            )}

            <button
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B64FF] to-[#54A3FF] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0B64FF]/30 transition hover:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Log in'}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </form>

          {showResend && (
            <button
              type="button"
              onClick={resend}
              className="mt-4 text-sm font-semibold text-[#0B64FF] underline-offset-2 hover:underline"
            >
              Resend verification email
            </button>
          )}

          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 dark:bg-white p-4 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-[#0B64FF]" />
              <p className="font-semibold">Zero shared credentials</p>
            </div>
            <p className="mt-2 text-slate-500">
              AMZDudes only uses secure OAuth connections with Amazon Seller Central. MFA and per-user access controls keep your reimbursements safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}