import { useMemo, useState } from 'react'
import { Edit3 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
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

const paymentMethods: { storeName: string }[] = []

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')

  const renderTabContent = useMemo(() => {
    if (activeTab === 'account') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-[#f6f8fb] p-6 shadow-sm">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                <p>Account Owner: Prime Retail Solution</p>
                <button type="button" className="text-slate-400 transition hover:text-teal-700" aria-label="Edit account owner">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  Email: <span className="text-slate-900">info@primeretailsolution.com</span>
                </p>
                <p>
                  Phone: <span className="text-slate-900">18313326237</span>
                </p>
                <p>
                  Billing Address: <span className="text-slate-900">95060</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-[#f6f8fb] p-6 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-slate-900">Contact Us</p>
                <p className="mt-4 text-sm text-slate-600">
                  Email us at <span className="text-teal-700">support@sellerinvestigators.com</span>
                </p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
              >
                Book a Meeting
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">Payment Methods</p>
                <p className="text-sm text-slate-500">Manage your active stores</p>
              </div>
              <button type="button" className="flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800">
                <span className="text-xl leading-none">+</span>
                Add new payment method
              </button>
            </div>
            <div className="mt-6">
              <div className={tableWrapperClass}>
                <table className={tableClass}>
                  <thead className={tableHeadClass}>
                    <tr>
                      <th className="px-6 py-3">Store Name</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={tableBodyClass}>
                    {!paymentMethods.length && (
                      <tr>
                        <td colSpan={2} className={emptyStateCellClass}>
                          No data available
                        </td>
                      </tr>
                    )}
                    {paymentMethods.map((method) => (
                      <tr key={method.storeName}>
                        <td className={tableCellClass}>{method.storeName}</td>
                        <td className={`${tableCellClass} text-right text-teal-200`}>Manage</td>
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
  }, [activeTab])

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
