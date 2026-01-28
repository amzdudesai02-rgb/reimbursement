import { useEffect, useMemo, useState } from "react";
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

export default function Cases() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [stores, setStores] = useState<StoreFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeFilter, setStoreFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get<Reimbursement[]>("/reimbursements?skip=0&limit=1000").then((r) => r.data),
      api.get<StoreFromApi[]>("/stores").then((r) => r.data),
    ])
      .then(([r, s]) => {
        if (mounted) {
          setReimbursements(r);
          setStores(s);
        }
      })
      .catch(() => {
        if (mounted) {
          setReimbursements([]);
          setStores([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = reimbursements;
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (r) =>
          (r.order_id ?? "").toLowerCase().includes(q) ||
          (r.sku ?? "").toLowerCase().includes(q) ||
          (r.asin ?? "").toLowerCase().includes(q) ||
          (r.issue_type ?? "").toLowerCase().includes(q) ||
          (r.notes ?? "").toLowerCase().includes(q)
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
                <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-2 cursor-not-allowed" title="Coming soon">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={tableWrapperClass}>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">ASIN</th>
                  <th className="px-6 py-3">Issue</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className={tableBodyClass}>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={emptyStateCellClass}>Loading…</td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={emptyStateCellClass}>
                      {filtered.length === 0 && reimbursements.length === 0
                        ? "No reimbursement data yet. Connect Amazon and sync your stores to see data here."
                        : "No results match your search."}
                    </td>
                  </tr>
                ) : (
                  pageRows.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-white/5">
                      <td className={tableCellClass}>{r.date ?? "—"}</td>
                      <td className={tableCellClass}>{r.order_id ?? "—"}</td>
                      <td className={tableCellClass}>{r.sku ?? "—"}</td>
                      <td className={tableCellClass}>{r.asin ?? "—"}</td>
                      <td className={tableCellClass}>
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold capitalize text-white">
                          {r.issue_type ?? "—"}
                        </span>
                      </td>
                      <td className={`${tableCellClass} text-right font-semibold text-white`}>
                        {r.currency ?? "USD"} {typeof r.amount === "number" ? r.amount.toFixed(2) : "—"}
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
              </select>
              <span>Entries</span>
            </div>
            <div>
              Showing {filtered.length ? start + 1 : 0} to {Math.min(start + entriesPerPage, filtered.length)} of {filtered.length} results
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
