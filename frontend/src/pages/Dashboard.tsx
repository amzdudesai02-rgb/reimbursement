import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Info, Menu, Link2, RefreshCw } from "lucide-react";
import { api } from "../lib/api";
import type { Summary, Reimbursement } from "../types";
import DashboardLayout from "../components/DashboardLayout";

const currencyFormatter = (currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });

type StoreFromApi = { id: number; store_name: string; is_connected: boolean };

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [stores, setStores] = useState<StoreFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [dateRange, setDateRange] = useState("All Time");
  const [storeFilter, setStoreFilter] = useState("All");
  const hasAutoSynced = useRef(false);

  const daysBackParam = useMemo(() => {
    if (dateRange === "Last 30 days") return 30;
    if (dateRange === "Last 90 days") return 90;
    return undefined;
  }, [dateRange]);

  const augustSeptemberParams = useMemo(() => {
    if (dateRange !== "August & September") return null;
    const year = new Date().getFullYear() - 1;
    return { date_after: `${year}-08-01`, date_before: `${year}-09-30` };
  }, [dateRange]);

  const storeIdParam = useMemo(() => {
    if (storeFilter === "All") return undefined;
    const s = stores.find((x) => x.store_name === storeFilter);
    return s?.id;
  }, [storeFilter, stores]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const paramsSummary: Record<string, string> = {};
      if (augustSeptemberParams) {
        paramsSummary.date_after = augustSeptemberParams.date_after;
        paramsSummary.date_before = augustSeptemberParams.date_before;
      } else if (daysBackParam != null) paramsSummary.days_back = String(daysBackParam);
      if (storeIdParam != null) paramsSummary.store_id = String(storeIdParam);
      paramsSummary._ = String(Date.now()); // cache-bust so dashboard always gets fresh data
      const qsSummary = new URLSearchParams(paramsSummary).toString();

      const paramsReimb: Record<string, string> = { skip: "0", limit: "10000" };
      if (augustSeptemberParams) {
        paramsReimb.date_after = augustSeptemberParams.date_after;
        paramsReimb.date_before = augustSeptemberParams.date_before;
      } else if (daysBackParam != null) paramsReimb.days_back = String(daysBackParam);
      if (storeIdParam != null) paramsReimb.store_id = String(storeIdParam);
      paramsReimb._ = String(Date.now()); // cache-bust
      const qsReimb = new URLSearchParams(paramsReimb).toString();

      const [s, r, st] = await Promise.all([
        api.get<Summary>(`/summary?${qsSummary}`).then((res) => res.data),
        api.get<Reimbursement[]>(`/reimbursements?${qsReimb}`).then((res) => res.data),
        api.get<StoreFromApi[]>(`/stores?_=${Date.now()}`).then((res) => res.data),
      ]);
      setSummary(s);
      setReimbursements(r);
      setStores(st);
    } catch {
      setSummary(null);
      setReimbursements([]);
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [daysBackParam, storeIdParam, augustSeptemberParams]);

  const currency = summary?.currency ?? "USD";
  const format = currencyFormatter(currency);
  const totalAmount = summary?.total_amount ?? 0;
  const totalCount = summary?.row_count ?? 0;
  const hasStores = stores.length > 0;

  const runSync = useCallback(async () => {
    if (syncing || !hasStores) return;
    setSyncing(true);
    try {
      await api.post<{
        synced: boolean;
        reimbursements_added: number;
        stores_synced: number;
        errors: string[];
        message?: string;
      }>("/sync", { client_time: new Date().toISOString() });
      await loadData();
    } catch {
      // Do not show any update or error message
    } finally {
      setSyncing(false);
    }
  }, [syncing, hasStores, loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (loading || !hasStores || hasAutoSynced.current) return;
    if (stores.length > 0 && (summary?.row_count ?? 0) === 0) {
      hasAutoSynced.current = true;
      api.post("/sync", { client_time: new Date().toISOString() }).then(() => loadData());
    }
  }, [loading, hasStores, stores.length, summary?.row_count, loadData]);

  const breakdownByReason = useMemo(() => {
    const map: Record<string, { amount: number; cases: number }> = {};
    for (const r of reimbursements) {
      const key = r.issue_type ?? "Other";
      if (!map[key]) map[key] = { amount: 0, cases: 0 };
      map[key].amount += r.amount;
      map[key].cases += 1;
    }
    return Object.entries(map).sort((a, b) => b[1].amount - a[1].amount);
  }, [reimbursements]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          {!hasStores && !loading && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-amber-900">Connect your Amazon account</p>
                <p className="text-sm text-amber-800 mt-0.5">Link Seller Central to see your reimbursement data here.</p>
              </div>
              <Link
                to="/stores"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
              >
                <Link2 className="h-4 w-4" />
                Connect Amazon
              </Link>
            </div>
          )}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={runSync}
                disabled={!hasStores || syncing}
                className="flex items-center gap-2 px-4 py-2.5 border border-teal-200 rounded-lg text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 hover:border-teal-300 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing…" : "Refresh data"}
              </button>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-sm"
            >
              <Menu className="h-4 w-4" />
              Filters
            </button>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm"
              title="All Time = all synced data (Amazon provides up to 180 days)"
            >
              <option value="All Time">Date Range: All Time (all synced data)</option>
              <option value="August & September">August & September (last year)</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
            </select>
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm"
            >
              <option value="All">Store: All</option>
              {stores.map((s) => (
                <option key={s.id} value={s.store_name}>{s.store_name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-500">
            Loading…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold text-gray-800">Total Recovered</h3>
                  <span title="Sum of all reimbursements from Amazon (Finances + FBA Reimbursements report)">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </span>
                </div>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-green-600">{format.format(totalAmount)}</div>
                  <div className="text-sm text-gray-500 mt-1">{totalCount} reimbursements</div>
                </div>
                {breakdownByReason.length > 0 && (
                  <div className="mt-5 space-y-2 max-h-64 overflow-y-auto border-t border-gray-100 pt-4">
                    {breakdownByReason.map(([reason, { amount, cases }]) => (
                      <div
                        key={reason}
                        className="flex items-center justify-between text-xs py-2 px-2 rounded-md hover:bg-gray-50"
                      >
                        <span className="text-gray-600 font-medium capitalize">{reason.replace(/_/g, " ")}</span>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-900 font-semibold w-20 text-right">{format.format(amount)}</span>
                          <span className="text-gray-500 w-10 text-right">{cases}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  to="/cases"
                  className="mt-5 block w-full py-2.5 text-center text-xs font-semibold text-teal-600 hover:text-white hover:bg-teal-600 border-2 border-teal-200 rounded-lg transition-all"
                >
                  View reimbursements
                </Link>
              </div>

              {totalCount === 0 && hasStores && (
                <div className="md:col-span-2 rounded-xl border border-gray-100 bg-white p-8">
                  <p className="text-gray-600 font-medium text-center">No reimbursement data yet</p>
                  <p className="text-sm text-gray-500 mt-1 text-center">Data is loaded from Amazon when you sync. Use “Refresh data” to pull from your connected stores.</p>
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={runSync}
                      disabled={syncing}
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                      {syncing ? "Syncing…" : "Sync from Amazon"}
                    </button>
                  </div>
                  <Link to="/stores" className="inline-block mt-4 w-full text-center text-sm font-medium text-teal-600 hover:text-teal-700">
                    Manage stores →
                  </Link>
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </DashboardLayout>
  );
}
