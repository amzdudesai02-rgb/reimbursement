import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Info, Menu, Link2, RefreshCw, LayoutGrid, BarChart3 } from "lucide-react";
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
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("Last 180 days");
  const [storeFilter, setStoreFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "bars">("grid");
  const hasAutoSynced = useRef(false);

  const daysBackParam = useMemo(() => {
    if (dateRange === "Last 180 days") return 180;
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
    setLoadError(null);
    try {
      const paramsSummary: Record<string, string> = {};
      if (augustSeptemberParams) {
        paramsSummary.date_after = augustSeptemberParams.date_after;
        paramsSummary.date_before = augustSeptemberParams.date_before;
      } else if (daysBackParam != null) paramsSummary.days_back = String(daysBackParam);
      if (storeIdParam != null) paramsSummary.store_id = String(storeIdParam);
      paramsSummary._ = String(Date.now()); // cache-bust so dashboard always gets fresh data
      const qsSummary = new URLSearchParams(paramsSummary).toString();

      const paramsReimb: Record<string, string> = { skip: "0", limit: "50000" };
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
    } catch (error) {
      setSummary(null);
      setReimbursements([]);
      setStores([]);
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setLoadError(typeof message === "string" ? message : "Failed to load dashboard data.");
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
    // Always allow user to click Refresh, even if stores have not finished loading yet.
    // Backend will respond with a helpful message when no stores are connected.
    if (syncing) return;
    setSyncing(true);
    setSyncMessage(null);
    setLoadError(null);
    try {
      const { data } = await api.post<{
        synced: boolean;
        reimbursements_added: number;
        stores_synced: number;
        errors: string[];
        message?: string;
      }>("/sync", { client_time: new Date().toISOString() });
      setSyncMessage(
        data.message ??
          `Sync complete. ${data.reimbursements_added} reimbursements added across ${data.stores_synced} store(s).`
      );
      await loadData();
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setLoadError(typeof message === "string" ? message : "Failed to refresh dashboard data.");
    } finally {
      setSyncing(false);
    }
  }, [syncing, loadData]);

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
          {syncMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {syncMessage}
            </div>
          )}
          {loadError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {loadError}
            </div>
          )}
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
                disabled={syncing}
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
              title="Last 180 days = default; All Time = all synced data"
            >
              <option value="Last 180 days">Date Range: Last 180 days</option>
              <option value="All Time">All Time (all synced data)</option>
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
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg border transition-colors ${viewMode === "grid" ? "bg-teal-50 border-teal-300 text-teal-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("bars")}
                className={`p-2 rounded-lg border transition-colors ${viewMode === "bars" ? "bg-teal-50 border-teal-300 text-teal-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                title="Chart view"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-4">NA Region</p>
          <p className="text-xs text-gray-500 mb-4">
            Dashboard is loading up to 50,000 reimbursement rows for the selected range, with summary totals based on the full database query.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-500">
            Loading…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* 1. Total Recovered */}
              <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  Total Recovered
                  <span title="Sum of all reimbursements from Amazon (Finances + FBA Reimbursements report)">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </span>
                </h3>
                <div className="flex flex-col items-center mb-4">
                  <div className="relative h-24 w-24 flex-shrink-0 mb-2">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent -rotate-90" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm font-bold text-teal-600 leading-tight">{format.format(totalAmount)}</span>
                      <span className="text-xs text-gray-500">{totalCount} Cases</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-auto">
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
                        <tr key={reason} className="border-t border-gray-100">
                          <td className="py-1.5 capitalize">{reason.replace(/_/g, " ")}</td>
                          <td className="text-right font-medium">{format.format(amount)}</td>
                          <td className="text-right text-gray-500">{cases}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={3} className="py-2 text-gray-400">No data yet</td></tr>
                      )}
                    </tbody>
                  </table>
                  <Link to="/cases" className="mt-4 block w-full py-2.5 text-center text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    View Stores
                  </Link>
                </div>
              </div>

              {/* 2. Awaiting Amazon Decision */}
              <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  Awaiting Amazon Decision
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </h3>
                <div className="flex flex-col items-center mb-4">
                  <div className="h-24 w-24 rounded-full border-4 border-gray-200 flex items-center justify-center flex-shrink-0 bg-white">
                    <span className="text-sm font-medium text-gray-400">N/A</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">No cases are pending Amazon Decision for this time period.</p>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-auto">
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
                  <Link to="/stores" className="mt-4 block w-full py-2.5 text-center text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    View Stores
                  </Link>
                </div>
              </div>

              {/* 3. In the Pipeline */}
              <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  In the Pipeline
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </h3>
                <div className="flex flex-col items-center mb-4">
                  <div className="relative h-24 w-24 flex-shrink-0 mb-2">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent -rotate-90" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm font-bold text-teal-600 leading-tight">{format.format(totalAmount)}</span>
                      <span className="text-xs text-gray-500">{totalCount} Cases</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 font-medium">
                        <th className="text-left py-1.5">Type</th>
                        <th className="text-right py-1.5">Amount</th>
                        <th className="text-right py-1.5 w-14">Cases</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {breakdownByReason.length > 0 ? breakdownByReason.slice(0, 10).map(([reason, { amount, cases }]) => (
                        <tr key={reason} className="border-t border-gray-100">
                          <td className="py-1.5 capitalize">{reason.replace(/_/g, " ")}</td>
                          <td className="text-right font-medium">{format.format(amount)}</td>
                          <td className="text-right text-gray-500">{cases}</td>
                        </tr>
                      )) : <tr><td colSpan={3} className="py-2 text-gray-400">—</td></tr>}
                    </tbody>
                  </table>
                  <Link to="/stores" className="mt-4 block w-full py-2.5 text-center text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    View Stores
                  </Link>
                </div>
              </div>

              {/* 4. Action Required */}
              <div className="bg-gray-50 rounded-xl shadow-sm border-2 border-red-200 p-0 flex flex-col overflow-hidden min-w-0">
                <div className="bg-red-600 text-white px-6 py-3 flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Action Required</h3>
                  <Info className="h-4 w-4 text-white/80 cursor-help" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-col items-center mb-4">
                    <div className="h-24 w-24 rounded-full border-4 border-red-200 flex items-center justify-center flex-shrink-0 bg-red-50">
                      <span className="text-2xl font-bold text-red-600">{!hasStores ? 2 : 0}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center font-medium">
                      {!hasStores ? "2 items require your attention" : "0 items require your attention"}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-500 font-medium">
                          <th className="text-left py-1.5">Type</th>
                          <th className="text-right py-1.5">Amount</th>
                          <th className="text-right py-1.5 w-14">Cases</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr className="border-t border-gray-100"><td className="py-1.5">Other</td><td className="text-right">0</td><td className="text-right text-gray-500">0</td></tr>
                        <tr className="border-t border-gray-100"><td className="py-1.5">Documents Needed</td><td className="text-right">0</td><td className="text-right text-gray-500">0</td></tr>
                        <tr className="border-t border-gray-100"><td className="py-1.5">Signature Needed</td><td className="text-right">0</td><td className="text-right text-gray-500">0</td></tr>
                        <tr className="border-t border-gray-100"><td className="py-1.5">Invoice Needed</td><td className="text-right">0</td><td className="text-right text-gray-500">0</td></tr>
                        <tr className="border-t border-gray-100"><td className="py-1.5">Permissions Revoked</td><td className="text-right">0</td><td className="text-right text-gray-500">0</td></tr>
                        <tr className="border-t border-gray-100"><td className="py-1.5">Credit Card Issue</td><td className="text-right">0</td><td className={`text-right ${!hasStores ? "text-red-600 font-semibold" : "text-gray-500"}`}>{!hasStores ? "1" : "0"}</td></tr>
                        <tr className="border-t border-gray-100"><td className="py-1.5">API Issue</td><td className="text-right">0</td><td className="text-right text-gray-500">0</td></tr>
                        <tr className="border-t border-gray-100"><td className="py-1.5">API Scopes</td><td className="text-right">0</td><td className={`text-right ${!hasStores ? "text-red-600 font-semibold" : "text-gray-500"}`}>{!hasStores ? "1" : "0"}</td></tr>
                      </tbody>
                    </table>
                    <Link to={hasStores ? "/cases" : "/stores"} className="mt-4 block w-full py-2.5 text-center text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      View Actions
                    </Link>
                  </div>
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
