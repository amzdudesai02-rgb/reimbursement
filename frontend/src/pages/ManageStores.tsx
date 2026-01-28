import { useEffect, useMemo, useState } from 'react'
import { Filter, Link2, Search } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../lib/api'
import {
  tableWrapperClass,
  tableClass,
  tableHeadClass,
  tableBodyClass,
  tableCellClass,
  tableFooterClass,
  emptyStateCellClass,
} from '../styles/tableTheme'

interface StoreFromApi {
  id: number
  store_name: string
  region: string | null
  marketplace_id: string | null
  is_active: boolean
  is_connected: boolean
  created_at: string
}

export default function ManageStores() {
  const [stores, setStores] = useState<StoreFromApi[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [entries, setEntries] = useState(10)
  const [connectLoading, setConnectLoading] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    api
      .get<StoreFromApi[]>('/stores')
      .then((res) => { if (mounted) setStores(res.data) })
      .catch(() => { if (mounted) setStores([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  async function handleConnectAmazon() {
    setConnectError(null)
    setConnectLoading(true)
    try {
      const { data } = await api.get<{ authorization_url: string; state: string }>('/auth/amazon/init')
      if (data.authorization_url) {
        window.location.href = data.authorization_url
        return
      }
      setConnectError('Could not start Amazon connection.')
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : null
      setConnectError(typeof msg === 'string' ? msg : 'Failed to connect. Please try again.')
    } finally {
      setConnectLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return stores
    return stores.filter((s) => s.store_name.toLowerCase().includes(q))
  }, [stores, search])

  const pageSize = Math.min(entries, filtered.length) || filtered.length
  const hasStores = stores.length > 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-teal-700">Stores</p>
            <h1 className="text-3xl font-semibold text-slate-900">Manage Stores</h1>
          </div>
          <button
            type="button"
            onClick={handleConnectAmazon}
            disabled={connectLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Link2 className="h-4 w-4" />
            {connectLoading ? 'Connecting…' : 'Connect Amazon'}
          </button>
        </section>
        {connectError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {connectError}
          </div>
        )}

        {!hasStores && !loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600 font-medium">No stores yet</p>
            <p className="mt-1 text-sm text-slate-500">Connect your Amazon Seller Central account to see your stores and reimbursement data here.</p>
            <button
              type="button"
              onClick={handleConnectAmazon}
              disabled={connectLoading}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-60"
            >
              <Link2 className="h-4 w-4" />
              Connect Amazon
            </button>
          </div>
        )}

        {hasStores && (
          <>
            <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Filter className="h-4 w-4 text-teal-600" />
                Filters
              </span>
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

            <div className={tableWrapperClass}>
              <div className="overflow-x-auto">
                <table className={tableClass}>
                  <thead className={tableHeadClass}>
                    <tr className="text-left">
                      <th className="px-6 py-4">Store Name</th>
                      <th className="px-6 py-4">Region</th>
                      <th className="px-6 py-4">Marketplace</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className={tableBodyClass}>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className={emptyStateCellClass}>
                          Loading…
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className={emptyStateCellClass}>
                          No stores match your search.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((store) => (
                        <tr key={store.id}>
                          <td className={`${tableCellClass} font-semibold text-white`}>{store.store_name}</td>
                          <td className={tableCellClass}>{store.region ?? '—'}</td>
                          <td className={tableCellClass}>{store.marketplace_id ?? '—'}</td>
                          <td className={tableCellClass}>
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                store.is_connected ? 'bg-emerald-400/20 text-emerald-100' : 'bg-amber-400/20 text-amber-100'
                              } border border-white/10`}
                            >
                              <span className={`h-2 w-2 rounded-full ${store.is_connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                              {store.is_connected ? 'Connected' : 'Not connected'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={entries}
                    onChange={(e) => setEntries(Number(e.target.value))}
                    className="rounded-xl border border-white/20 bg-transparent px-3 py-1.5 text-sm font-semibold text-white focus:border-teal-300 focus:outline-none"
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span>Entries</span>
                </div>
                <p>
                  Showing {filtered.length ? Math.min(pageSize, filtered.length) : 0} of {filtered.length} results
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
