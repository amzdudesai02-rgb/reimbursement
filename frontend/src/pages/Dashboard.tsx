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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Total Recovered */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  Total Recovered
                  <span title="Sum of all reimbursements from Amazon (Finances + FBA Reimbursements report)">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </span>
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full border-4 border-teal-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent -rotate-90" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">{format.format(totalAmount)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{format.format(totalAmount)}</div>
                    <div className="text-sm text-gray-500">{totalCount} Cases</div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 font-medium">
                        <th className="text-left py-1.5">Reason</th>
                        <th className="text-right py-1.5">Amount</th>
                        <th className="text-right py-1.5 w-14">Cases</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {breakdownByReason.length > 0 ? breakdownByReason.slice(0, 10).map(([reason, { amount, cases }]) => (
                        <tr key={reason} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="py-1.5 capitalize">{reason.replace(/_/g, " ")}</td>
                          <td className="text-right font-medium">{format.format(amount)}</td>
                          <td className="text-right text-gray-500">{cases}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={3} className="py-2 text-gray-400">No data yet</td></tr>
                      )}
                    </tbody>
                  </table>
                  <Link to="/cases" className="mt-4 block w-full py-2.5 text-center text-xs font-semibold text-teal-600 hover:text-white hover:bg-teal-600 border border-teal-200 rounded-lg transition-all">
                    View reimbursements
                  </Link>
                </div>
              </div>

              {/* 2. Awaiting Amazon Decision */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Awaiting Amazon Decision</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-20 w-20 rounded-full border-4 border-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-400">N/A</span>
                  </div>
                  <div className="text-sm text-gray-500">No cases are pending Amazon Decision for this time period.</div>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 font-medium">
                        <th className="text-left py-1.5">Type</th>
                        <th className="text-right py-1.5">Amount</th>
                        <th className="text-right py-1.5 w-14">Cases</th>
                      </tr>
                    </thead>
                    <tbody><tr><td colSpan={3} className="py-2 text-gray-400">—</td></tr></tbody>
                  </table>
                  <Link to="/cases" className="mt-4 block w-full py-2.5 text-center text-xs font-semibold text-teal-600 hover:text-white hover:bg-teal-600 border border-teal-200 rounded-lg transition-all">
                    View Stores
                  </Link>
                </div>
              </div>

              {/* 3. In the Pipeline */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">In the Pipeline</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-20 w-20 rounded-full border-4 border-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-400">N/A</span>
                  </div>
                  <div className="text-sm text-gray-500">Pipeline data is based on your synced reimbursements. Sync from Dashboard to update.</div>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 font-medium">
                        <th className="text-left py-1.5">Type</th>
                        <th className="text-right py-1.5">Amount</th>
                        <th className="text-right py-1.5 w-14">Cases</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdownByReason.length > 0 ? breakdownByReason.slice(0, 5).map(([reason, { amount, cases }]) => (
                        <tr key={reason} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="py-1.5 capitalize">{reason.replace(/_/g, " ")}</td>
                          <td className="text-right font-medium">{format.format(amount)}</td>
                          <td className="text-right text-gray-500">{cases}</td>
                        </tr>
                      )) : <tr><td colSpan={3} className="py-2 text-gray-400">—</td></tr>}
                    </tbody>
                  </table>
                  <Link to="/cases" className="mt-4 block w-full py-2.5 text-center text-xs font-semibold text-teal-600 hover:text-white hover:bg-teal-600 border border-teal-200 rounded-lg transition-all">
                    View Stores
                  </Link>
                </div>
              </div>

              {/* 4. Action Required */}
              <div className="bg-white rounded-xl shadow-md border-2 border-rose-200 p-6 flex flex-col">
                <h3 className="text-sm font-semibold text-rose-800 mb-4">Action Required</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-20 w-20 rounded-full border-4 border-rose-200 flex items-center justify-center flex-shrink-0 bg-rose-50">
                    <span className="text-lg font-bold text-rose-600">{!hasStores ? 1 : 0}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {!hasStores ? "1 item requires your attention: connect your Amazon store." : "0 items require your attention."}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 font-medium">
                        <th className="text-left py-1.5">Type</th>
                        <th className="text-right py-1.5">Amount</th>
                        <th className="text-right py-1.5 w-14">Cases</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-50"><td className="py-1.5">Other</td><td className="text-right">0</td><td className="text-right text-gray-500">0</td></tr>
                      <tr className="border-t border-gray-50"><td className="py-1.5">Documents Needed</td><td className="text-right">0</td><td className="text-right text-gray-500">0</td></tr>
                      <tr className="border-t border-gray-50"><td className="py-1.5">API / Permissions</td><td className="text-right">0</td><td className="text-right text-gray-500">{!hasStores ? "1" : "0"}</td></tr>
                    </tbody>
                  </table>
                  <Link to={hasStores ? "/cases" : "/stores"} className="mt-4 block w-full py-2.5 text-center text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-500 border border-rose-200 rounded-lg transition-all">
                    View Actions
                  </Link>
                </div>
              </div>

            </div>

          </>
        )}

        {!loading && totalCount === 0 && hasStores && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-amber-900 font-medium">No reimbursement data yet</p>
            <p className="text-sm text-amber-800 mt-1">Use Refresh data above to sync from Amazon (up to 180 days).</p>
            <button type="button" onClick={runSync} disabled={syncing} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Syncing…" : "Sync from Amazon"}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
