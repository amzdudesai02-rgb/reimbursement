import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, BarChart3, Filter } from "lucide-react";
import { api } from "../lib/api";
import type { Reimbursement, Summary } from "../types";

const currencyFormatter = (currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

const shimmerCard =
  "bg-white/80 border border-white/60 shadow-[0_25px_60px_rgba(15,23,42,0.08)] rounded-3xl";

type RegionalBreakdown = {
  title: string;
  amount: number;
  cases: number;
  rows: { label: string; amount: number; cases: number }[];
};

const regionalMock: RegionalBreakdown[] = [
  {
    title: "Total Recovered",
    amount: 4792,
    cases: 18,
    rows: [
      { label: "Inbound", amount: 4392, cases: 2 },
      { label: "Lost", amount: 275, cases: 12 },
      { label: "Damaged", amount: 125, cases: 4 },
    ],
  },
  {
    title: "Awaiting Amazon Decision",
    amount: 0,
    cases: 0,
    rows: [],
  },
  {
    title: "In the Pipeline",
    amount: 24531,
    cases: 164,
    rows: [
      { label: "Inbound", amount: 24325, cases: 152 },
      { label: "Damaged", amount: 206, cases: 3 },
      { label: "Returns", amount: 0, cases: 9 },
    ],
  },
];

const attentionItems = [
  { label: "Credit Card Issue", value: 1 },
  { label: "API Scopes", value: 1 },
];

const tabs = [
  "Summary",
  "Reimbursement Reports",
  "Reversal Reports",
  "Shipment Detail Report",
  "Detected Lost & Damaged",
];

const roles = [
  { name: "Rhea Anadeo", email: "rheaanadeo.professional@gmail.com", role: "Admin", store: "Cowell's Beach N' Bikini" },
  { name: "Harline Ledesma", email: "harlinegayledesma@yahoo.com", role: "User", store: "-" },
  { name: "Munaam Durrani", email: "projectmanager682@gmail.com", role: "User", store: "Cowell's Beach N' Bikini" },
];

const stores = [
  { name: "Cowell's Beach N' Bikini", region: "NA", fee: "-", payment: "---", status: "Audit Complete", users: ["Rhea Anadeo", "Munaam Durrani"] },
];

const removalOrders = [
  { id: "3035573", tracking: "1Z0F52710347881072", status: "Completed", items: 1 },
  { id: "79551", tracking: "1Z0F527103478878808", status: "Completed", items: 2 },
  { id: "79552", tracking: "1ZC6045K0301801395", status: "Completed", items: 1 },
];

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [cases, setCases] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [summaryRes, reimbursements] = await Promise.all([
          api.get<Summary>("/summary"),
          api.get<Reimbursement[]>("/reimbursements?limit=100"),
        ]);
        setSummary(summaryRes.data);
        setCases(reimbursements.data);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const currency = summary?.currency ?? "USD";
  const format = currencyFormatter(currency);
  const totalRecovered = summary ? format.format(summary.total_amount) : "—";
  const totalCases = summary?.row_count ?? cases.length;

  const highlightedCases = useMemo(() => cases.slice(0, 8), [cases]);

   return (
    <div className="space-y-10">
      <header className={`${shimmerCard} p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-[0.3em]">
              NA Region
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Reimbursement Overview
            </h1>
            <p className="text-slate-500">
              Track your audit across stores and automate recovery tasks.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium">
              <Filter className="h-4 w-4" /> Filters
            </button>
            <select className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium">
              <option>Date Range: All Time</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <select className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium">
              <option>Store: All</option>
              <option>Cowell&apos;s Beach N&apos; Bikini</option>
            </select>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-4">
        <div className={`${shimmerCard} p-5`}>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Total Recovered
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {totalRecovered}
              </p>
              <p className="text-xs text-slate-500">{totalCases} cases</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              +8.2% vs last month
            </span>
          </div>
        </div>
        <div className={`${shimmerCard} p-5`}>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Awaiting Amazon Decision
          </p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-semibold text-slate-900">N/A</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              0 cases
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            All submissions resolved within SLA.
          </p>
        </div>
        <div className={`${shimmerCard} p-5`}>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            In the Pipeline
          </p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-semibold text-slate-900">
              {format.format(24531)}
            </p>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
              164 cases
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Auto-tracked via SP-API.
          </p>
        </div>
        <div className={`${shimmerCard} p-5 bg-gradient-to-br from-rose-500 to-rose-600 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Action Required
              </p>
              <p className="mt-3 text-4xl font-semibold">
                {attentionItems.reduce((sum, item) => sum + item.value, 0)}
              </p>
              <p className="text-sm text-white/80">
                items need your attention
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-white/80" />
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {attentionItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2"
              >
                <span>{item.label}</span>
                <span className="text-lg font-semibold">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${shimmerCard} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              NA Region Snapshot
            </h2>
            <p className="text-sm text-slate-500">
              Breakdown of reimbursements and pipeline by claim type.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
            Export region report <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          {regionalMock.map((card) => (
            <div key={card.title} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {card.title}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {format.format(card.amount)}
              </p>
              <p className="text-xs text-slate-500">{card.cases} cases</p>
              <div className="mt-4 space-y-2 text-sm">
                {card.rows.length === 0 && (
                  <p className="text-slate-400">No cases pending.</p>
                )}
                {card.rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-2xl bg-white p-2 shadow-sm">
                    <span>{row.label}</span>
                    <span className="text-sm font-medium">
                      {format.format(row.amount)} · {row.cases}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${shimmerCard} p-6`}>
        <div className="flex flex-wrap items-center gap-4">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                idx === 0
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Case Status</th>
                <th className="px-4 py-3">Potential Value</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                    Loading latest cases...
                  </td>
                </tr>
              )}
              {!loading &&
                highlightedCases.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 text-slate-500">{row.id}</td>
                    <td className="px-4 py-3 font-medium">
                      {row.sku ?? "Cowell's Beach N' Bikini"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {row.date ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Resolved
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">$0.00</td>
                    <td className="px-4 py-3 font-semibold">
                      {format.format(row.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
                        View case
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${shimmerCard} p-6`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              User Roles & Permissions
            </h3>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
              Manage Users
            </button>
          </div>
          <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100">
            {roles.map((role) => (
              <div
                key={role.email}
                className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{role.name}</p>
                  <p className="text-slate-500">{role.email}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {role.role}
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500">
                  {role.store}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${shimmerCard} p-6`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Manage Stores
            </h3>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
              Add Store
            </button>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Store Name</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Users</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {stores.map((store) => (
                  <tr key={store.name}>
                    <td className="px-4 py-3 font-medium">{store.name}</td>
                    <td className="px-4 py-3 text-slate-500">{store.region}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        {store.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {store.users.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       </section>
      </div>

      <section className={`${shimmerCard} grid gap-6 p-6 lg:grid-cols-2`}>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Account & Payment Methods
          </h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <p>Account Owner: Prime Retail Solution</p>
            <p>Email: info@primeretailsolution.com</p>
            <p>Phone: 18313326237</p>
            <p>Billing Address: 95060</p>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
              Edit Profile
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Contact & Payment Method
          </h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              Email us at{" "}
              <a href="mailto:support@sellerinvestigators.com" className="text-slate-900 underline">
                support@sellerinvestigators.com
              </a>
            </p>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
              Book a Meeting
            </button>
            <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-slate-400">
              No payment methods on file.
            </div>
          </div>
        </div>
      </section>

      <section className={`${shimmerCard} p-6`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Removal Orders
          </h3>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
            <BarChart3 className="h-4 w-4" /> View Analytics
          </button>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {removalOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{order.tracking}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{order.items}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-sm font-medium text-rose-500">
                      Dispute
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}