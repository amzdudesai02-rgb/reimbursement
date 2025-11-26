import { useState } from 'react'
import type { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Mail, ShieldCheck, User, Zap } from 'lucide-react'
import { api } from '../lib/api'

type ApiMessage = { detail?: string; message?: string }

const onboardingHighlights = [
  { label: 'Commission', value: 'Only 8%', desc: 'Pay after Amazon approves' },
  { label: 'Avg. recovery / mo', value: '$4,820', desc: 'Per mid-market seller' },
  { label: 'Cases auto-prepared', value: '32+', desc: 'Per account every cycle' },
]

const steps = [
  'Securely connect Amazon Seller Central via OAuth',
  'We audit inbound, fees, returns & lost/damaged inventory',
  'Approve ready-to-send claim packets in minutes',
]

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setSuccess(null)
    setResendMsg(null)
    setLoading(true)
    try {
      await api.post('/auth/signup', { name, email, password })
      setSuccess('Verification email sent! Check your inbox to activate your account.')
    } catch (error) {
      const axiosErr = error as AxiosError<ApiMessage>
      setErr(axiosErr.response?.data?.detail ?? 'Signup failed')
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
      const axiosErr = error as AxiosError<ApiMessage>
      setErr(axiosErr.response?.data?.detail ?? 'Unable to resend email')
    }
  }

  return (
    <div
      className="rounded-[36px] border border-slate-100 bg-white/85 p-6 shadow-[0_40px_120px_rgba(12,38,131,0.12)] backdrop-blur"
      style={{ colorScheme: 'light' }}
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50/70 p-10">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
              <Zap className="h-4 w-4 text-[#0B64FF]" />
              Start Free Audit
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0B64FF]">AMZDudes Platform</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Create your reimbursement workspace
              </h1>
              <p className="mt-3 text-base text-slate-600">
                Connect Seller Central, review auto-generated cases, and recover money Amazon owes you—without paying onboarding or hidden fees.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {onboardingHighlights.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white bg-white/70 p-4 shadow-[0_15px_45px_rgba(12,38,131,0.1)]">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 dark:bg-white p-5">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <BarChart3 className="h-5 w-5 text-[#0B64FF]" />
                <span>In three steps you’re live:</span>
              </div>
              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                {steps.map((step, idx) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0B64FF]/10 text-xs font-semibold text-[#0B64FF]">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute -right-10 top-10 h-32 w-32 rounded-full border border-[#0B64FF]/20" />
            <div className="absolute bottom-6 left-6 h-24 w-24 rounded-full border border-slate-200" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-100 bg-white dark:bg-white p-8 shadow-2xl sm:p-10">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#0B64FF]">Create account</p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Start recovering with AMZDudes
            </h2>
            <p className="text-sm text-slate-500">
              Already verified?{' '}
              <Link to="/login" className="font-semibold text-[#0B64FF] underline-offset-2 hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-600">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Founder"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-inner focus:border-[#0B64FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B64FF]/20 dark:bg-white dark:text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-slate-600">
                Work email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="text-sm font-medium text-slate-600">
                Password
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="signup-password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-inner focus:border-[#0B64FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B64FF]/20 dark:bg-white dark:text-slate-900"
                />
              </div>
              <p className="text-xs text-slate-400">
                At least 8 characters, include one number or symbol.
              </p>
            </div>

            {err && (
              <div className="rounded-xl bg-rose-50/70 p-3 text-sm text-rose-600" aria-live="polite">
                {err}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-emerald-50/80 p-3 text-sm text-emerald-700" aria-live="polite">
                {success}
              </div>
            )}
            {resendMsg && (
              <div className="rounded-xl bg-blue-50/80 p-3 text-sm text-[#0B64FF]" aria-live="polite">
                {resendMsg}
              </div>
            )}

            <button
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B64FF] to-[#54A3FF] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0B64FF]/30 transition hover:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Submitting…' : 'Send verification link'}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-6 text-xs text-slate-500">
            By continuing you agree to our{' '}
            <span className="font-semibold text-slate-700">Terms</span> and{' '}
            <span className="font-semibold text-slate-700">Privacy Policy</span>. We never share Seller Central data without consent.
          </div>

          <button
            type="button"
            disabled={!email}
            onClick={resend}
            className="mt-6 text-sm font-semibold text-[#0B64FF] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Resend verification email
          </button>
        </div>
      </div>
    </div>
  )
}