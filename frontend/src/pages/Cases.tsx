import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Download, Link2, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { api } from "../lib/api";
import type { Reimbursement, ShipmentQueueRow } from "../types";
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
const LOAD_TIMEOUT_MS = 15000;

const CASE_TABS = [
  { id: "summary", label: "Summary" },
  { id: "reimbursement", label: "Reimbursement Reports" },
  { id: "shipment", label: "Shipment Detail Report" },
  { id: "detected", label: "Detected Lost and Damaged" },
] as const;

const COLUMN_COUNT_CASE = 9;
const COLUMN_COUNT_FULL = 19;
const COLUMN_COUNT_SHIPMENT = 8;
const COLUMN_COUNT_DETECTED = 10;

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

/** Show "—" when value is null, undefined, or empty/whitespace (so "no SKU" / "no ASIN" display clearly). */
function showText(val: string | number | undefined | null): string {
  if (val == null) return "—";
  const s = String(val).trim();
  return s === "" ? "—" : s;
}

export default function Cases() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [shipments, setShipments] = useState<ShipmentQueueRow[]>([]);
  const [stores, setStores] = useState<StoreFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof CASE_TABS)[number]["id"]>("summary");
  const [storeFilter, setStoreFilter] = useState("All");
  const [claimTypesFilter, setClaimTypesFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [caseIdFilter, setCaseIdFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  const loadData = useCallback(() => {
    setFetchError(null);
    setLoading(true);
    // All time: no date filter; cache-bust so we get fresh data after sync
    const reimbursementsUrl = `/reimbursements?skip=0&limit=50000&_=${Date.now()}`;
    Promise.allSettled([
      api.get<Reimbursement[]>(reimbursementsUrl, { timeout: LOAD_TIMEOUT_MS }).then((r) => r.data),
      api.get<ShipmentQueueRow[]>(`/shipping-queue?skip=0&limit=10000&_=${Date.now()}`, { timeout: LOAD_TIMEOUT_MS }).then((r) => r.data),
      api.get<StoreFromApi[]>(`/stores?_=${Date.now()}`, { timeout: LOAD_TIMEOUT_MS }).then((r) => r.data),
    ])
      .then(([r, sh, s]) => {
        setReimbursements(r.status === "fulfilled" && Array.isArray(r.value) ? r.value : []);
        setShipments(sh.status === "fulfilled" && Array.isArray(sh.value) ? sh.value : []);
        setStores(s.status === "fulfilled" && Array.isArray(s.value) ? s.value : []);

        const failedMessages = [
          r.status === "rejected" ? "reimbursements" : null,
          sh.status === "rejected" ? "shipment detail" : null,
          s.status === "rejected" ? "stores" : null,
        ].filter(Boolean);

        if (failedMessages.length > 0) {
          setFetchError(`Some case data could not load (${failedMessages.join(", ")}). Please try Refresh.`);
        }
      })
      .catch((err) => {
        const message = err?.response?.status === 401
          ? "Session expired. Please log in again."
          : err?.response?.data?.detail || err?.message || "Failed to load reimbursements.";
        setFetchError(message);
        setReimbursements([]);
        setShipments([]);
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

  const [caseSortBy, setCaseSortBy] = useState<"id" | "store" | "created" | "filed" | "status" | "potential" | "recovered" | "caseId" | "reimbId">("id");
  const [caseSortDir, setCaseSortDir] = useState<"asc" | "desc">("asc");

  const storeIdFromName = useMemo(() => {
    if (storeFilter === "All") return null;
    const s = stores.find((x) => x.store_name === storeFilter);
    return s?.id ?? null;
  }, [stores, storeFilter]);

  const filtered = useMemo(() => {
    let list = reimbursements;
    if (storeIdFromName != null) {
      list = list.filter((r) => r.store_id === storeIdFromName);
    }
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
  }, [reimbursements, searchQuery, storeIdFromName]);

  const getStoreName = useCallback((id: number | undefined) => {
    if (id == null) return "—";
    const s = stores.find((x) => x.id === id);
    return s?.store_name ?? String(id);
  }, [stores]);

  const filteredShipments = useMemo(() => {
    let list = shipments;
    if (storeIdFromName != null) {
      list = list.filter((row) => row.store_id === storeIdFromName);
    }
    if (statusFilter !== "All") {
      list = list.filter((row) => (row.status ?? "").toLowerCase() === statusFilter.toLowerCase());
    }
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (row) =>
          (row.shipment_id ?? "").toLowerCase().includes(q) ||
          (row.reference_id ?? "").toLowerCase().includes(q) ||
          (row.shipment_name ?? "").toLowerCase().includes(q) ||
          (row.ship_to ?? "").toLowerCase().includes(q) ||
          (row.status ?? "").toLowerCase().includes(q) ||
          getStoreName(row.store_id).toLowerCase().includes(q)
      );
    }
    return list;
  }, [shipments, storeIdFromName, statusFilter, searchQuery, getStoreName]);

  const caseTableRows = useMemo(() => {
    const rows = filtered.map((r) => ({
      id: r.id,
      storeName: getStoreName(r.store_id),
      createdDate: r.approval_date ?? r.date,
      filedDate: r.approval_date ?? r.date,
      caseStatus: "Recovered",
      potentialValue: r.amount_total ?? r.amount,
      actualRecovered: r.amount_total ?? r.amount,
      amazonCaseId: r.case_id,
      reimbursementIds: r.reimbursement_id,
    }));
    const mult = caseSortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      switch (caseSortBy) {
        case "id": return mult * (a.id - b.id);
        case "store": return mult * (a.storeName.localeCompare(b.storeName));
        case "created": return mult * ((a.createdDate ?? "").localeCompare(b.createdDate ?? ""));
        case "filed": return mult * ((a.filedDate ?? "").localeCompare(b.filedDate ?? ""));
        case "status": return mult * (a.caseStatus.localeCompare(b.caseStatus));
        case "potential": return mult * ((a.potentialValue ?? 0) - (b.potentialValue ?? 0));
        case "recovered": return mult * ((a.actualRecovered ?? 0) - (b.actualRecovered ?? 0));
        case "caseId": return mult * ((a.amazonCaseId ?? "").localeCompare(b.amazonCaseId ?? ""));
        case "reimbId": return mult * ((a.reimbursementIds ?? "").localeCompare(b.reimbursementIds ?? ""));
        default: return 0;
      }
    });
    return rows;
  }, [filtered, getStoreName, caseSortBy, caseSortDir]);

  const detectedRows = useMemo(() => {
    const rows = reimbursements
      .filter((r) => {
        const reason = (r.reason ?? r.issue_type ?? "").toLowerCase();
        return (
          reason.includes("lost") ||
          reason.includes("damaged") ||
          reason.includes("warehouse") ||
          reason.includes("inbound")
        );
      })
      .map((r) => ({
        id: r.id,
        storeName: getStoreName(r.store_id),
        transactionId: r.reimbursement_id ?? r.original_reimbursement_id ?? r.case_id,
        reason: r.reason ?? r.issue_type,
        eventDate: r.approval_date ?? r.date,
        asin: r.asin,
        sellerSku: r.sku,
        fnsku: r.fnsku,
        itemName: r.product_name ?? r.notes,
        totalUnits: r.quantity_reimbursed_total ?? r.quantity_reimbursed_cash ?? r.quantity_reimbursed_inventory,
        potentialValue: r.amount_total ?? r.amount,
      }));

    if (storeIdFromName != null) {
      return rows.filter((row) => {
        const s = stores.find((x) => x.store_name === row.storeName);
        return s?.id === storeIdFromName;
      });
    }
    return rows;
  }, [reimbursements, stores, storeIdFromName, getStoreName]);

  const filteredDetectedRows = useMemo(() => {
    let list = detectedRows;
    if (claimTypesFilter !== "All") {
      list = list.filter((row) =>
        (row.reason ?? "").toLowerCase().includes(claimTypesFilter.toLowerCase())
      );
    }
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (row) =>
          row.storeName.toLowerCase().includes(q) ||
          (row.transactionId ?? "").toLowerCase().includes(q) ||
          (row.reason ?? "").toLowerCase().includes(q) ||
          (row.asin ?? "").toLowerCase().includes(q) ||
          (row.sellerSku ?? "").toLowerCase().includes(q) ||
          (row.fnsku ?? "").toLowerCase().includes(q) ||
          (row.itemName ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [detectedRows, claimTypesFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const start = (currentPage - 1) * entriesPerPage;
  const pageRows = filtered.slice(start, start + entriesPerPage);
  const casePageRows = caseTableRows.slice(start, start + entriesPerPage);
  const shipmentPageRows = filteredShipments.slice(start, start + entriesPerPage);
  const detectedPageRows = filteredDetectedRows.slice(start, start + entriesPerPage);
  const hasStores = stores.length > 0;

  const toggleCaseSort = (col: typeof caseSortBy) => {
    if (caseSortBy === col) setCaseSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setCaseSortBy(col); setCaseSortDir("asc"); }
  };
  const SortIcon = ({ col }: { col: typeof caseSortBy }) =>
    caseSortBy !== col ? null : caseSortDir === "asc" ? <ChevronUp className="h-4 w-4 inline" /> : <ChevronDown className="h-4 w-4 inline" />;

  return (
    <DashboardLayout>
      <div className="space-y-0">
        <div className="bg-gray-100 border-b border-gray-200 -mx-4 px-4 py-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
          {!hasStores && !loading && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 flex flex-wrap items-center justify-between gap-4">
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

        <div className="flex flex-wrap gap-1 mb-4">
          {CASE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "bg-gray-100 text-gray-700 border border-transparent hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {hasStores && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Store</label>
                <select
                  value={storeFilter}
                  onChange={(e) => setStoreFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer min-w-[140px]"
                >
                  <option value="All">All</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.store_name}>{s.store_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Claim Types</label>
                <select value={claimTypesFilter} onChange={(e) => setClaimTypesFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[100px]">
                  <option value="All">{activeTab === "detected" ? "Select" : "All"}</option>
                  <option value="Lost">Lost</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Inbound">Inbound</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[100px]">
                  <option value="All">All</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Case ID</label>
                <select value={caseIdFilter} onChange={(e) => setCaseIdFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[100px]">
                  <option value="All">All</option>
                </select>
              </div>
              <div className="relative flex-1 min-w-[180px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <button type="button" onClick={downloadCsv} disabled={reimbursements.length === 0} title="Download CSV" className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <Download className="h-5 w-5" />
              </button>
              <button type="button" onClick={loadData} disabled={loading} title="Refresh data" className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2">
                <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        )}

        {activeTab === "summary" && (
          <div className={tableWrapperClass} style={{ overflowX: "auto" }}>
            <table className={tableClass} style={{ minWidth: "max-content" }}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => toggleCaseSort("id")}>ID <SortIcon col="id" /></th>
                  <th className="px-4 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => toggleCaseSort("store")}>Store Name <SortIcon col="store" /></th>
                  <th className="px-4 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => toggleCaseSort("created")}>Created Date <SortIcon col="created" /></th>
                  <th className="px-4 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => toggleCaseSort("filed")}>Filed Date <SortIcon col="filed" /></th>
                  <th className="px-4 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => toggleCaseSort("status")}>Case Status <SortIcon col="status" /></th>
                  <th className="px-4 py-3 text-right whitespace-nowrap cursor-pointer" onClick={() => toggleCaseSort("potential")}>Potential Value (net proceeds) <SortIcon col="potential" /></th>
                  <th className="px-4 py-3 text-right whitespace-nowrap cursor-pointer" onClick={() => toggleCaseSort("recovered")}>Actual Recovered <SortIcon col="recovered" /></th>
                  <th className="px-4 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => toggleCaseSort("caseId")}>Amazon Case ID <SortIcon col="caseId" /></th>
                  <th className="px-4 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => toggleCaseSort("reimbId")}>Reimbursement ID(s) <SortIcon col="reimbId" /></th>
                </tr>
              </thead>
              <tbody className={tableBodyClass}>
                {loading ? (
                  <tr><td colSpan={COLUMN_COUNT_CASE} className={emptyStateCellClass}>Loading…</td></tr>
                ) : casePageRows.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMN_COUNT_CASE} className={emptyStateCellClass}>
                      {filtered.length === 0 && reimbursements.length === 0 ? (hasStores ? "No case records yet. Sync from Dashboard then return here." : "Connect Amazon in Stores, then sync from Dashboard.") : "No results match your filters."}
                    </td>
                  </tr>
                ) : (
                  casePageRows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-white/5">
                      <td className={`${tableCellClass} whitespace-nowrap`}>{row.id}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{row.storeName}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{formatDate(row.createdDate)}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{formatDate(row.filedDate)}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{row.caseStatus}</td>
                      <td className={`${tableCellClass} text-right whitespace-nowrap`}>{row.potentialValue != null ? Number(row.potentialValue).toFixed(2) : "—"}</td>
                      <td className={`${tableCellClass} text-right font-semibold text-teal-200 whitespace-nowrap`}>{row.actualRecovered != null ? Number(row.actualRecovered).toFixed(2) : "—"}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(row.amazonCaseId)}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(row.reimbursementIds)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className="rounded-xl border border-white/20 bg-transparent px-3 py-1 text-white focus:border-teal-300 focus:outline-none">
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
                <span>Entries</span>
              </div>
              <div>Showing {filtered.length ? start + 1 : 0} to {Math.min(start + entriesPerPage, filtered.length)} of {filtered.length}</div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reimbursement" && (
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
                    <td colSpan={COLUMN_COUNT_FULL} className={emptyStateCellClass}>Loading…</td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMN_COUNT_FULL} className={emptyStateCellClass}>
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
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(r.reimbursement_id)}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(r.case_id)}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(r.amazon_order_id ?? r.order_id)}</td>
                      <td className={`${tableCellClass} whitespace-nowrap capitalize`}>{showText(r.reason ?? r.issue_type).replace(/_/g, " ")}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{showText(r.sku)}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(r.fnsku)}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(r.asin)}</td>
                      <td className={`${tableCellClass} max-w-[180px] truncate`} title={r.product_name ?? r.notes ?? ""}>{showText(r.product_name ?? r.notes)}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{showText(r.condition)}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{showText(r.currency_unit ?? r.currency) === "—" ? "USD" : showText(r.currency_unit ?? r.currency)}</td>
                      <td className={`${tableCellClass} text-right whitespace-nowrap`}>{r.amount_per_unit != null ? Number(r.amount_per_unit).toFixed(2) : "—"}</td>
                      <td className={`${tableCellClass} text-right font-semibold text-teal-200 whitespace-nowrap`}>{r.amount_total != null ? Number(r.amount_total).toFixed(2) : (typeof r.amount === "number" ? r.amount.toFixed(2) : "—")}</td>
                      <td className={`${tableCellClass} text-right whitespace-nowrap`}>{r.quantity_reimbursed_cash != null ? r.quantity_reimbursed_cash : "—"}</td>
                      <td className={`${tableCellClass} text-right whitespace-nowrap`}>{r.quantity_reimbursed_inventory != null ? r.quantity_reimbursed_inventory : "—"}</td>
                      <td className={`${tableCellClass} text-right whitespace-nowrap`}>{r.quantity_reimbursed_total != null ? r.quantity_reimbursed_total : "—"}</td>
                      <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(r.original_reimbursement_id)}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{showText(r.original_reimbursement_type)}</td>
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
        )}

        {activeTab === "shipment" && (
          <div className={tableWrapperClass} style={{ overflowX: "auto" }}>
            <table className={tableClass} style={{ minWidth: "max-content" }}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Store Name</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Shipment ID</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">ASIN</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Seller SKU</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Fulfillment Network SKU</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Shipped</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Received</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Discrepancies</th>
                </tr>
              </thead>
              <tbody className={tableBodyClass}>
                {loading ? (
                  <tr>
                    <td colSpan={COLUMN_COUNT_SHIPMENT} className={emptyStateCellClass}>Loading…</td>
                  </tr>
                ) : shipmentPageRows.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMN_COUNT_SHIPMENT} className={emptyStateCellClass}>
                      {filteredShipments.length === 0
                        ? "No shipment detail rows yet. Sync from Dashboard or Reimbursement Tool to load shipping queue data."
                        : "No shipment rows match your filters."}
                    </td>
                  </tr>
                ) : (
                  shipmentPageRows.map((row) => {
                    const shipped = row.expected_units ?? row.sku_count ?? null;
                    const received = row.expected_units ?? row.sku_count ?? null;
                    const discrepancies =
                      shipped != null && received != null ? Math.max(Number(shipped) - Number(received), 0) : null;

                    return (
                      <tr key={row.id} className="transition-colors hover:bg-white/5">
                        <td className={`${tableCellClass} whitespace-nowrap`}>{getStoreName(row.store_id)}</td>
                        <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(row.shipment_id)}</td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>—</td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>{showText(row.reference_id)}</td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>—</td>
                        <td className={`${tableCellClass} text-right whitespace-nowrap`}>{shipped ?? "—"}</td>
                        <td className={`${tableCellClass} text-right whitespace-nowrap`}>{received ?? "—"}</td>
                        <td className={`${tableCellClass} text-right whitespace-nowrap`}>{discrepancies ?? "--"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className="rounded-xl border border-white/20 bg-transparent px-3 py-1 text-white focus:border-teal-300 focus:outline-none">
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
                <span>Entries</span>
              </div>
              <div>Showing {filteredShipments.length ? start + 1 : 0} to {Math.min(start + entriesPerPage, filteredShipments.length)} of {filteredShipments.length}</div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                <button type="button" onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(filteredShipments.length / entriesPerPage)), p + 1))} disabled={currentPage === Math.max(1, Math.ceil(filteredShipments.length / entriesPerPage))} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "detected" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-sm text-gray-600 shadow-sm">
              These are transaction IDs proactively identified by Amazon. If they are in this list it means they have not yet been reimbursed. Seller Investigators will continue to monitor this queue and file a case on your behalf if no reimbursements are made in 15 business days from the event date.
            </div>
            <div className={tableWrapperClass} style={{ overflowX: "auto" }}>
              <table className={tableClass} style={{ minWidth: "max-content" }}>
                <thead className={tableHeadClass}>
                  <tr>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Store Name</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Transaction ID</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Reason</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Event Date</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">ASIN</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Seller SKU</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Fulfillment Network SKU</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Item Name</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Total Units</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Potential Value (net proceeds)</th>
                  </tr>
                </thead>
                <tbody className={tableBodyClass}>
                  {loading ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT_DETECTED} className={emptyStateCellClass}>Loading…</td>
                    </tr>
                  ) : detectedPageRows.length === 0 ? (
                    <tr>
                      <td colSpan={COLUMN_COUNT_DETECTED} className={emptyStateCellClass}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    detectedPageRows.map((row) => (
                      <tr key={row.id} className="transition-colors hover:bg-white/5">
                        <td className={`${tableCellClass} whitespace-nowrap`}>{row.storeName}</td>
                        <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(row.transactionId)}</td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>{showText(row.reason).replace(/_/g, " ")}</td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>{formatDate(row.eventDate)}</td>
                        <td className={`${tableCellClass} font-mono text-xs whitespace-nowrap`}>{showText(row.asin)}</td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>{showText(row.sellerSku)}</td>
                        <td className={`${tableCellClass} whitespace-nowrap`}>{showText(row.fnsku)}</td>
                        <td className={`${tableCellClass} max-w-[180px] truncate`} title={row.itemName ?? ""}>{showText(row.itemName)}</td>
                        <td className={`${tableCellClass} text-right whitespace-nowrap`}>{row.totalUnits ?? "—"}</td>
                        <td className={`${tableCellClass} text-right font-semibold text-teal-200 whitespace-nowrap`}>
                          {row.potentialValue != null ? Number(row.potentialValue).toFixed(2) : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className="rounded-xl border border-white/20 bg-transparent px-3 py-1 text-white focus:border-teal-300 focus:outline-none">
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                  </select>
                  <span>Entries</span>
                </div>
                <div>Showing {filteredDetectedRows.length ? start + 1 : 0} to {Math.min(start + entriesPerPage, filteredDetectedRows.length)} of {filteredDetectedRows.length}</div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                  <button type="button" onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(filteredDetectedRows.length / entriesPerPage)), p + 1))} disabled={currentPage === Math.max(1, Math.ceil(filteredDetectedRows.length / entriesPerPage))} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
