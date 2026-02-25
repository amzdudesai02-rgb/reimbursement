import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Download, Link2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { api } from "../lib/api";
import type { Reimbursement } from "../types";
import {
  tableWrapperClass,
  tableClass,
  tableHeadClass,
  tableBodyClass,
  tableCellClass,
  tableFooterClass,
  emptyStateCellClass,
} from "../styles/tableTheme";

type StoreFromApi = { id: number; store_name: string };

const COLUMN_COUNT = 19;

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function Cases() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [stores, setStores] = useState<StoreFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [storeFilter, setStoreFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  const loadData = useCallback(() => {
    setFetchError(null);
    setLoading(true);
    // All time: no date filter (no days_back, date_after, date_before); all stores; up to 10k rows
    const reimbursementsUrl = "/reimbursements?skip=0&limit=10000";
    Promise.all([
      api.get<Reimbursement[]>(reimbursementsUrl).then((r) => r.data),
      api.get<StoreFromApi[]>("/stores").then((r) => r.data),
    ])
      .then(([r, s]) => {
        setReimbursements(Array.isArray(r) ? r : []);
        setStores(Array.isArray(s) ? s : []);
      })
      .catch((err) => {
        const message = err?.response?.status === 401
          ? "Session expired. Please log in again."
          : err?.response?.data?.detail || err?.message || "Failed to load reimbursements.";
        setFetchError(message);
        setReimbursements([]);
        setStores([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const downloadCsv = useCallback(() => {
    if (reimbursements.length === 0) return;
    const headers = [
      "store-id", "approval-date", "reimbursement-id", "case-id", "amazon-order-id", "reason",
      "sku", "fnsku", "asin", "product-name", "condition", "currency-unit",
      "amount-per-unit", "amount-total",
      "quantity-reimbursed-cash", "quantity-reimbursed-inventory", "quantity-reimbursed-total",
      "original-reimbursement-id", "original-reimbursement-type",
    ];
    const escape = (v: string | number | undefined) => {
      const s = v == null ? "" : String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = reimbursements.map((r) =>
      [
        r.store_id ?? "",
        r.approval_date ?? r.date ?? "",
        r.reimbursement_id ?? "",
        r.case_id ?? "",
        r.amazon_order_id ?? r.order_id ?? "",
        r.reason ?? r.issue_type ?? "",
        r.sku ?? "",
        r.fnsku ?? "",
        r.asin ?? "",
        r.product_name ?? r.notes ?? "",
        r.condition ?? "",
        r.currency_unit ?? r.currency ?? "USD",
        r.amount_per_unit ?? "",
        r.amount_total ?? r.amount,
        r.quantity_reimbursed_cash ?? "",
        r.quantity_reimbursed_inventory ?? "",
        r.quantity_reimbursed_total ?? "",
        r.original_reimbursement_id ?? "",
        r.original_reimbursement_type ?? "",
      ].map(escape).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reimbursements-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [reimbursements]);

  const filtered = useMemo(() => {
    let list = reimbursements;
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (r) =>
          (r.order_id ?? "").toLowerCase().includes(q) ||
          (r.amazon_order_id ?? "").toLowerCase().includes(q) ||
          (r.sku ?? "").toLowerCase().includes(q) ||
          (r.asin ?? "").toLowerCase().includes(q) ||
          (r.issue_type ?? "").toLowerCase().includes(q) ||
          (r.reason ?? "").toLowerCase().includes(q) ||
          (r.notes ?? "").toLowerCase().includes(q) ||
          (r.product_name ?? "").toLowerCase().includes(q) ||
          (r.reimbursement_id ?? "").toLowerCase().includes(q) ||
          (r.case_id ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [reimbursements, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const start = (currentPage - 1) * entriesPerPage;
  const pageRows = filtered.slice(start, start + entriesPerPage);
  const hasStores = stores.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reimbursements</h1>
          {!hasStores && !loading && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-amber-900">Connect your Amazon account</p>
                <p className="text-sm text-amber-800 mt-0.5">Reimbursement data will appear here after you connect Seller Central.</p>
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
        </div>

        {fetchError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-red-800 font-medium">{fetchError}</p>
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {hasStores && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="All">Store: All</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.store_name}>{s.store_name}</option>
                ))}
              </select>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search order, SKU, ASIN, reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={downloadCsv}
                  disabled={reimbursements.length === 0}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Same 19 columns as CSV; horizontal scroll so all columns are visible */}
        <div className={tableWrapperClass} style={{ overflowX: "auto", overflowY: "hidden" }}>
          <table className={tableClass} style={{ minWidth: "max-content" }}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Store ID</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Approval date</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Reimbursement ID</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Case ID</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Amazon Order ID</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Reason</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">SKU</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">FNSKU</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">ASIN</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap min-w-[140px]">Product name</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Condition</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Currency</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Amount per unit</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Amount total</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Qty cash</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Qty inventory</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Qty total</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Original reimb. ID</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Original reimb. type</th>
                </tr>
              </thead>
              <tbody className={tableBodyClass}>
                {loading ? (
                  <tr>
                    <td colSpan={COLUMN_COUNT} className={emptyStateCellClass}>Loading…</td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMN_COUNT} className={emptyStateCellClass}>
                      {filtered.length === 0 && reimbursements.length === 0
                        ? (hasStores
                            ? "No reimbursement records yet. Go to Dashboard and use “Refresh data” to sync from Amazon (up to 180 days). Then return here to see all rows."
                            : "Connect your Amazon account in Stores, then sync from the Dashboard to see data here.")
                        : "No results match your search."}
                    </td>
                  </tr>
                ) : (
                  pageRows.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-white/5">
                      <td className={`${tableCellClass} whitespace-nowrap`}>{r.store_id ?? "—"}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{formatDate(r.approval_date ?? r.date)}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{r.reimbursement_id ?? "—"}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{r.case_id ?? "—"}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{r.amazon_order_id ?? r.order_id ?? "—"}</td>
                      <td className={`${tableCellClass} whitespace-nowrap capitalize`}>{(r.reason ?? r.issue_type ?? "—").replace(/_/g, " ")}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{r.sku ?? "—"}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{r.fnsku ?? "—"}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{r.asin ?? "—"}</td>
                      <td className={`${tableCellClass} max-w-[180px] truncate`} title={r.product_name ?? r.notes ?? ""}>{r.product_name ?? r.notes ?? "—"}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{r.condition ?? "—"}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{r.currency_unit ?? r.currency ?? "USD"}</td>
                      <td className={`${tableCellClass} text-right whitespace-nowrap`}>{r.amount_per_unit != null ? Number(r.amount_per_unit).toFixed(2) : "—"}</td>
                      <td className={`${tableCellClass} text-right font-semibold text-teal-200 whitespace-nowrap`}>{r.amount_total != null ? Number(r.amount_total).toFixed(2) : (typeof r.amount === "number" ? r.amount.toFixed(2) : "—")}</td>
                      <td className={`${tableCellClass} text-right whitespace-nowrap`}>{r.quantity_reimbursed_cash != null ? r.quantity_reimbursed_cash : "—"}</td>
                      <td className={`${tableCellClass} text-right whitespace-nowrap`}>{r.quantity_reimbursed_inventory != null ? r.quantity_reimbursed_inventory : "—"}</td>
                      <td className={`${tableCellClass} text-right whitespace-nowrap`}>{r.quantity_reimbursed_total != null ? r.quantity_reimbursed_total : "—"}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{r.original_reimbursement_id ?? "—"}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{r.original_reimbursement_type ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-white/20 bg-transparent px-3 py-1 text-white focus:border-teal-300 focus:outline-none"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
              <span>Entries</span>
            </div>
            <div>
              Showing {filtered.length ? start + 1 : 0} to {Math.min(start + entriesPerPage, filtered.length)} of {filtered.length} rows (same columns as CSV)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
