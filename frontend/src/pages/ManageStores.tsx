import { useMemo, useState } from 'react'
import { ChevronDown, Filter, RefreshCcw, Search, Users } from 'lucide-react'

type StoreStatus = 'all' | 'audit-complete' | 'pending' | 'onboarding'

interface StoreRecord {
  name: string
  region: string
  fee?: string
  paymentMethod?: string
  status: StoreStatus
  statusLabel: string
  statusTone: 'yellow' | 'blue' | 'teal'
  users: string[]
}

const storeData: StoreRecord[] = [
  {
    name: "Cowell's Beach N' Bikini",
    region: 'NA',
    fee: '-',
    paymentMethod: '---',
    status: 'audit-complete',
    statusLabel: 'Audit Complete',
    statusTone: 'yellow',
    users: ['Rhea Anadeo', 'Munaam Durrani'],
  },
]

const statusFilters = [
  { label: 'All statuses', value: 'all' satisfies StoreStatus },
  { label: 'Audit complete', value: 'audit-complete' satisfies StoreStatus },
  { label: 'In review', value: 'pending' satisfies StoreStatus },
  { label: 'Onboarding', value: 'onboarding' satisfies StoreStatus },
]

export default function ManageStores() {
  const [status, setStatus] = useState<StoreStatus>('all')
  const [storeScope, setStoreScope] = useState('all')
  const [search, setSearch] = useState('')
  const [entries, setEntries] = useState(5)

  const filtered = useMemo(() => {
    return storeData.filter((store) => {
      const matchesStatus = status === 'all' || store.status === status
      const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase().trim())
      return matchesStatus && matchesSearch
    })
  }, [status, search])

  const toneMap: Record<StoreRecord['statusTone'], string> = {
    yellow: 'bg-amber-50 text-amber-700',
    blue: 'bg-sky-50 text-sky-700',
    teal: 'bg-teal-50 text-teal-700',
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <p className="text-sm font-semibold text-teal-700">Stores</p>
        <h1 className="text-3xl font-semibold text-slate-900">Manage Stores</h1>
      </section>

      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="h-4 w-4 text-teal-600" />
          Filters
        </button>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</p>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StoreStatus)}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2 text-sm font-semibold text-slate-700 focus:border-teal-600 focus:bg-white focus:outline-none"
                >
                  {statusFilters.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <select
                  value={storeScope}
                  onChange={(e) => setStoreScope(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2 text-sm font-semibold text-slate-700 focus:border-teal-600 focus:bg-white focus:outline-none"
                >
                  <option value="all">Store: All</option>
                  <option value="priority">Priority stores</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-inner">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              className="w-48 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              placeholder="Search store name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <th className="px-6 py-4">Store Name</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Fee</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Users</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((store) => (
                <tr key={store.name} className="text-slate-700">
                  <td className="px-6 py-4 font-semibold">{store.name}</td>
                  <td className="px-6 py-4">{store.region}</td>
                  <td className="px-6 py-4">{store.fee ?? '-'}</td>
                  <td className="px-6 py-4">{store.paymentMethod ?? '---'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${toneMap[store.statusTone]}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                      {store.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {store.users.map((user) => (
                        <span
                          key={user}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          {user}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-teal-600 hover:text-teal-600">
                      <RefreshCcw className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No stores match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 focus:border-teal-600 focus:outline-none"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>Entries</span>
          </div>
          <p className="text-slate-500">
            Showing {Math.min(filtered.length, entries)} to {filtered.length} of {filtered.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled
              className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

