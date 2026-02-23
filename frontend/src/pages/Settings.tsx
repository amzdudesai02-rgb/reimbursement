import { useEffect, useMemo, useState } from 'react'
import { Edit3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../lib/api'
import {
  tableWrapperClass,
  tableClass,
  tableHeadClass,
  tableBodyClass,
  tableCellClass,
  emptyStateCellClass,
} from '../styles/tableTheme'

type SettingsTab = 'account' | 'warehouse' | 'invoice' | 'reimbursement'

const tabs: { key: SettingsTab; label: string }[] = [
  { key: 'account', label: 'Account and Payment Methods' },
  { key: 'warehouse', label: 'Warehouse Information' },
  { key: 'invoice', label: 'Invoice History' },
  { key: 'reimbursement', label: 'Reimbursement Report' },
]

interface CurrentUser {
  id: number
  email: string
  name: string | null
}

interface StoreFromApi {
  id: number
  store_name: string
  region: string | null
  marketplace_id: string | null
  is_active: boolean
  is_connected: boolean
  created_at: string
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [stores, setStores] = useState<StoreFromApi[]>([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingStores, setLoadingStores] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get<CurrentUser>('/auth/me')
      .then((res) => { if (mounted) setUser(res.data) })
      .catch(() => { if (mounted) setUser(null) })
      .finally(() => { if (mounted) setLoadingUser(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    api
      .get<StoreFromApi[]>('/stores')
      .then((res) => { if (mounted) setStores(res.data) })
      .catch(() => { if (mounted) setStores([]) })
      .finally(() => { if (mounted) setLoadingStores(false) })
    return () => { mounted = false }
  }, [])

  const connectedStores = useMemo(() => stores.filter((s) => s.is_connected), [stores])

  const renderTabContent = useMemo(() => {
    if (activeTab === 'account') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-[#f6f8fb] p-6 shadow-sm">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                <p>
                  Account Owner: {loadingUser ? '…' : (user?.name || user?.email || 'Account')}
                </p>
                <button type="button" className="text-slate-400 transition hover:text-teal-700" aria-label="Edit account owner">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  Email: <span className="text-slate-900">{loadingUser ? '…' : (user?.email ?? '—')}</span>
                </p>
                <p>
                  Phone: <span className="text-slate-900">—</span>
                </p>
                <p>
                  Billing Address: <span className="text-slate-900">—</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-[#f6f8fb] p-6 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-slate-900">Contact Us</p>
                <p className="mt-4 text-sm text-slate-600">
                  Need help? Visit the Support page for FAQs and to get in touch.
                </p>
              </div>
              <Link
                to="/support"
                className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
              >
                Go to Support
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">Payment Methods</p>
                <p className="text-sm text-slate-500">Manage your active stores</p>
              </div>
              <Link
                to="/stores"
                className="flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                <span className="text-xl leading-none">+</span>
                Add new payment method
              </Link>
            </div>
            <div className="mt-6">
              <div className={tableWrapperClass}>
                <table className={tableClass}>
                  <thead className={tableHeadClass}>
                    <tr>
                      <th className="px-6 py-3">Store Name</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={tableBodyClass}>
                    {loadingStores && (
                      <tr>
                        <td colSpan={3} className={emptyStateCellClass}>
                          Loading…
                        </td>
                      </tr>
                    )}
                    {!loadingStores && !connectedStores.length && (
                      <tr>
                        <td colSpan={3} className={emptyStateCellClass}>
                          No stores connected. Connect an Amazon account from Manage Stores.
                        </td>
                      </tr>
                    )}
                    {!loadingStores && connectedStores.map((store) => (
                      <tr key={store.id}>
                        <td className={tableCellClass}>{store.store_name}</td>
                        <td className={tableCellClass}>
                          <span className={store.is_connected ? 'text-teal-600' : 'text-slate-400'}>
                            {store.is_connected ? 'Connected' : 'Disconnected'}
                          </span>
                        </td>
                        <td className={`${tableCellClass} text-right`}>
                          <Link to="/stores" className="text-teal-600 hover:text-teal-700 font-medium">
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const placeholderCopy: Record<Exclude<SettingsTab, 'account'>, string> = {
      warehouse: 'Warehouse information will appear here.',
      invoice: 'Invoice history will appear here.',
      reimbursement: 'Reimbursement reports will appear here.',
    }

    const titleMap: Record<Exclude<SettingsTab, 'account'>, string> = {
      warehouse: 'Warehouse Information',
      invoice: 'Invoice History',
      reimbursement: 'Reimbursement Report',
    }

    const key = activeTab as Exclude<SettingsTab, 'account'>
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">{titleMap[key]}</p>
        <p className="mt-4 text-sm">{placeholderCopy[key]}</p>
      </div>
    )
  }, [activeTab, user, loadingUser, connectedStores, loadingStores])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-600">Settings</p>
          <h1 className="text-3xl font-semibold text-slate-900">Account Info</h1>
        </div>

        <div className="rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key ? 'bg-[#eaf2ff] text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {renderTabContent}
      </div>
    </DashboardLayout>
  )
}
