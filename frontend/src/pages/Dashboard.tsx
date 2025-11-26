import { useEffect, useMemo, useState } from 'react'
import { Menu } from 'lucide-react'
import { api } from '../lib/api'
import type { Summary } from '../types'
import DashboardLayout from '../components/DashboardLayout'

const currencyFormatter = (currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  })

type ClaimStatus = 'Approved' | 'Pending' | 'Processing'

const claimsData = [
  { id: 'CLM-4782', type: 'Lost Inventory', amount: 847.23, status: 'Approved', date: 'Nov 15, 2025' },
  { id: 'CLM-4781', type: 'Damaged Item', amount: 1247.5, status: 'Approved', date: 'Nov 14, 2025' },
  { id: 'CLM-4780', type: 'Customer Return', amount: 324, status: 'Pending', date: 'Nov 13, 2025' },
  { id: 'CLM-4779', type: 'Inbound Damage', amount: 592.17, status: 'Processing', date: 'Nov 12, 2025' },
  { id: 'CLM-4778', type: 'Lost In Transit', amount: 1089.45, status: 'Approved', date: 'Nov 11, 2025' },
]

const auditResults = [
  { label: 'Items Scanned', value: '18,429', accent: 'text-slate-900' },
  { label: 'Opportunities Found', value: '147', accent: 'text-indigo-600' },
  { label: 'Est. Recovery', value: '$23,847', accent: 'text-emerald-500' },
]

const statusStyles: Record<ClaimStatus, string> = {
  Approved: 'bg-emerald-200/20 text-emerald-200 border border-emerald-300/40',
  Pending: 'bg-amber-200/20 text-amber-200 border border-amber-300/40',
  Processing: 'bg-blue-200/20 text-blue-200 border border-blue-300/40',
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [dateRange, setDateRange] = useState('Last 90 days')
  const [store, setStore] = useState('All')

  useEffect(() => {
    async function bootstrap() {
      try {
        const summaryRes = await api.get<Summary>('/summary')
        setSummary(summaryRes.data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      }
    }
    bootstrap()
  }, [])

  const format = useMemo(() => currencyFormatter(summary?.currency ?? 'USD'), [summary?.currency])
  const totalRecovered = summary?.total_amount ?? 48392
  const approvalRate = summary ? Math.min(99, Math.round(summary.row_count / 250)) : 73

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value)
    console.log('Date range changed to:', e.target.value)
  }

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStore(e.target.value)
    console.log('Store changed to:', e.target.value)
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Overview</p>
              <h1 className="text-3xl font-semibold text-slate-900">Claims Dashboard</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-800">
                <Menu className="h-4 w-4" />
                Filters
              </button>
              <select
                value={dateRange}
                onChange={handleDateRangeChange}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-teal-500 focus:outline-none"
              >
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last 90 days">Last 90 days</option>
                <option value="All Time">All Time</option>
              </select>
              <select
                value={store}
                onChange={handleStoreChange}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-teal-500 focus:outline-none"
              >
                <option value="All">Store: All</option>
                <option value="Cowell's Beach N' Bikini">Cowell&apos;s Beach N&apos; Bikini</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-slate-500">North America Region · Updated just now</p>
        </header>

        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050E1F] p-8 text-white shadow-[0_25px_75px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-[#1a2f63] blur-[120px]" />
            <div className="absolute left-0 bottom-0 h-48 w-48 rounded-full bg-[#0f8fa3] blur-[120px]" />
          </div>

          <div className="relative flex flex-wrap items-start gap-6 pr-0 lg:pr-72">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">AD</div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">Claims Dashboard</p>
                  <h2 className="text-2xl font-semibold text-white">Opportunities recovered</h2>
                </div>
              </div>
              <p className="max-w-xl text-sm text-white/70">
                Monitor reimbursements and recovery progress across every active store. Keep an eye on approvals, pending
                cases, and pipeline movement in real-time.
              </p>
            </div>

            <div className="relative w-full flex-1 lg:absolute lg:right-8 lg:top-8 lg:w-64">
              <div className="rounded-3xl bg-gradient-to-br from-[#1C6CFF] to-[#1C3DFF] p-6 text-white shadow-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Total Recovered (90 days)</p>
                <p className="mt-4 text-4xl font-semibold">{format.format(totalRecovered)}</p>
                <p className="mt-2 text-sm text-white/80">{approvalRate}% approval rate this period</p>
                <div className="mt-5 h-2 rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-white" style={{ width: `${approvalRate}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                  <th className="px-6 py-4">Claim ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {claimsData.map((claim) => (
                  <tr key={claim.id} className="border-t border-white/5 text-base">
                    <td className="px-6 py-4 font-semibold text-white underline decoration-white/30 underline-offset-4">
                      {claim.id}
                    </td>
                    <td className="px-6 py-4 text-white/80">{claim.type}</td>
                    <td className="px-6 py-4 font-semibold text-white">{format.format(claim.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${statusStyles[claim.status as ClaimStatus]}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white/60">{claim.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="relative mt-8 flex flex-wrap gap-4">
            <div className="rounded-[28px] bg-white p-6 text-slate-900 shadow-xl sm:min-w-[240px]">
              <p className="text-sm font-semibold text-slate-800">Audit Results</p>
              <div className="mt-4 space-y-3 text-sm">
                {auditResults.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-slate-500">{item.label}</span>
                    <span className={`text-base font-semibold ${item.accent}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
