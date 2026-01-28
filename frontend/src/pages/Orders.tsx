import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Link2, Package } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { api } from "../lib/api";

type StoreFromApi = { id: number; store_name: string };

export default function Orders() {
  const [stores, setStores] = useState<StoreFromApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<StoreFromApi[]>("/stores")
      .then((r) => { if (mounted) setStores(r.data); })
      .catch(() => { if (mounted) setStores([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const hasStores = stores.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Removal Orders</h1>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500">
            Loading…
          </div>
        ) : !hasStores ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-12 text-center">
            <Package className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="font-semibold text-amber-900">Connect your Amazon account</p>
            <p className="text-sm text-amber-800 mt-1">Removal order data will appear here after you connect Seller Central.</p>
            <Link
              to="/stores"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
            >
              <Link2 className="h-4 w-4" />
              Connect Amazon
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="font-semibold text-gray-700">No removal orders yet</p>
            <p className="text-sm text-gray-500 mt-1">Removal order data will show here when available from your connected stores.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
