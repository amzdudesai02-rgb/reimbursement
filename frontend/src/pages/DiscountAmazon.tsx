import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Link2, Percent } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { api } from '../lib/api'

type StoreFromApi = { id: number; store_name: string; is_connected: boolean }

export default function DiscountAmazon() {
  const [stores, setStores] = useState<StoreFromApi[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get<StoreFromApi[]>('/stores')
      .then((r) => { if (mounted) setStores(r.data) })
      .catch(() => { if (mounted) setStores([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const hasConnectedStore = stores.some((s) => s.is_connected)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider">After Connect</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Discount Amazon</h1>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500">
            Loading…
          </div>
        ) : !hasConnectedStore ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-12 text-center">
            <Percent className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="font-semibold text-amber-900">Connect Amazon first</p>
            <p className="text-sm text-amber-800 mt-1">
              Discount Amazon options are available after you connect your Seller Central account.
            </p>
            <Link
              to="/stores"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
            >
              <Link2 className="h-4 w-4" />
              Connect Amazon
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 flex-shrink-0">
                <Percent className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Discount Amazon</h2>
                <p className="mt-1 text-sm text-gray-600">
                  You’ve connected your Amazon account. Discount and partner offers for sellers will appear here when available.
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  Check back later or visit Manage Stores to sync your data.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
