import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  LineChart,
  Link2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import tutorialShot from "../assets/home1.png";
import { pricingPlans } from "../data/pricingData";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../auth/useAuth";
import { api } from "../lib/api";
import type { Reimbursement, Summary, UploadReport } from "../types";
import {
  emptyStateCellClass,
  tableBodyClass,
  tableCellClass,
  tableClass,
  tableHeadClass,
  tableWrapperClass,
} from "../styles/tableTheme";

type StoreFromApi = {
  id: number;
  store_name: string;
  region?: string | null;
  is_connected: boolean;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Case Finder",
    desc: "Scans SP-API events hourly to detect lost, damaged, fee, and return errors automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-Ready Evidence",
    desc: "Generates Amazon-compliant case packets with document links, photos, and SKU-level notes.",
  },
  {
    icon: LineChart,
    title: "Live Recovery Dashboard",
    desc: "Tracks reimbursements, ROI, and claim aging so you see every dollar recovered in real time.",
  },
];

const differentiators = [
  "Flat subscription + low commission (10%→7%) so sellers keep more.",
  "Full claim coverage: inbound, warehouse, fee, return, chargeback, and restock errors.",
  "Automation-first workflow: no spreadsheets or VAs — just approve and submit.",
  "Human audit team verifies every auto-flag before a case is opened for higher win rates.",
];

const steps = [
  "Connect Amazon Seller Central via secure OAuth.",
  "Run the guided audit to surface immediate reimbursement opportunities.",
  "Approve or edit auto-generated case packets.",
  "Submit to Amazon or let our managed team file and monitor cases.",
];

const tutorials = [
  {
    type: "video" as const,
    title: "Full Walkthrough",
    url: "https://www.youtube.com/embed/VIDEO_ID",
  },
  {
    type: "image" as const,
    title: "Approve a case in 60 seconds",
    src: tutorialShot,
  },
];

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function showText(value?: string | number | null) {
  if (value == null) return "—";
  const text = String(value).trim();
  return text || "—";
}

function MarketingTool() {
  return (
    <div className="space-y-20">
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-gradient-to-br from-orange-50 to-white rounded-[32px] p-10 text-center shadow"
      >
        <p className="uppercase tracking-[0.3em] text-orange-500 text-sm font-semibold">
          Reimbursement Tool
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mt-4">
          Recover Every Amazon FBA Dollar{" "}
          <span className="bg-gradient-to-r from-[#FF9900] to-[#FF6A00] bg-clip-text text-transparent">
            Automatically
          </span>
        </h1>
        <p className="text-neutral-600 mt-4 max-w-3xl mx-auto">
          amzDUDES Reimbursement Tool combines AI detection with human verification to
          file bulletproof cases and help you keep 93%+ of recovered revenue.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link
            to="/signup"
            className="px-8 py-3 rounded-full text-white font-semibold shadow-lg transition-transform hover:scale-[1.02]"
            style={{ backgroundImage: "linear-gradient(135deg,#FF9900,#FF6A00)" }}
          >
            Start Free Audit
          </Link>
          <Link
            to="/contact"
            className="px-8 py-3 rounded-full border border-orange-200 text-orange-600 font-semibold transition-colors hover:bg-orange-50"
          >
            Book Live Demo
          </Link>
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-6"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-3xl p-6 shadow hover:shadow-xl transition"
          >
            <feature.icon className="text-orange-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-neutral-900">{feature.title}</h3>
            <p className="text-neutral-600 mt-2">{feature.desc}</p>
          </div>
        ))}
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-neutral-900 text-white rounded-[32px] p-10 shadow-lg"
      >
        <h2 className="text-3xl font-bold">Why Sellers Switch to amzDUDES</h2>
        <p className="text-neutral-300 mt-3 max-w-3xl">
          Built for Amazon-first operators who want transparent pricing, automation, and proactive
          human help.
        </p>
        <ul className="mt-8 grid md:grid-cols-2 gap-4 text-neutral-100">
          {differentiators.map((item) => (
            <li key={item} className="flex gap-3">
              <ArrowRight className="text-orange-400 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section variants={fadeUp} initial="hidden" animate="show">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step}
              className="bg-white rounded-3xl p-5 shadow text-center flex flex-col items-center"
            >
              <span className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-semibold flex items-center justify-center mb-3">
                {index + 1}
              </span>
              <p className="text-neutral-700">{step}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={fadeUp} initial="hidden" animate="show">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-3xl font-bold">Tutorials & Walkthroughs</h2>
          <Link to="/contact" className="text-orange-600 font-semibold">
            Need custom onboarding? → Talk to us
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {tutorials.map((item) =>
            item.type === "video" ? (
              <div
                key={item.title}
                className="rounded-3xl overflow-hidden shadow bg-black aspect-video"
              >
                <iframe
                  title={item.title}
                  src={item.url}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div
                key={item.title}
                className="rounded-3xl overflow-hidden shadow bg-white flex flex-col"
              >
                <img src={item.src} alt={item.title} className="object-cover h-64" />
                <p className="p-4 font-medium text-neutral-800">{item.title}</p>
              </div>
            )
          )}
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">
          Pricing (Final Structure from Munaam)
        </h2>
        <p className="text-center text-neutral-600">
          Transparent subscription + low recovery commission so you keep more of every reimbursement.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.plan}
              className={`rounded-3xl p-6 shadow border ${
                plan.highlight
                  ? "bg-gradient-to-br from-orange-50 to-white border-orange-300"
                  : "bg-white border-neutral-100"
              }`}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                {plan.plan}
              </p>
              <h3 className="text-2xl font-bold mt-2">{plan.monthly}</h3>
              <p className="text-sm text-green-600 mt-1">{plan.annualText}</p>
              <div className="mt-4 text-neutral-600 text-sm space-y-2">
                <p>{plan.ideal}</p>
                <p>{plan.feeText}</p>
                <p>{plan.range}</p>
              </div>
              <Link
                to="/signup"
                className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 rounded-full text-white font-semibold transition-transform hover:scale-[1.02]"
                style={{ backgroundImage: "linear-gradient(135deg,#FF9900,#FF6A00)" }}
              >
                Start Free Audit
              </Link>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-gradient-to-r from-[#FF9900]/15 to-[#FF6A00]/15 rounded-[32px] p-10 text-center shadow"
      >
        <h2 className="text-3xl font-bold text-neutral-900">
          Ready to recover more reimbursements?
        </h2>
        <p className="text-neutral-700 mt-3">
          Join sellers who boosted recovery by 35% in the first month. No risk, cancel anytime.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link
            to="/signup"
            className="px-8 py-3 rounded-full text-white font-semibold shadow transition-transform hover:scale-[1.02]"
            style={{ backgroundImage: "linear-gradient(135deg,#FF9900,#FF6A00)" }}
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 rounded-full border border-orange-200 text-orange-600 font-semibold transition-colors hover:bg-orange-50"
          >
            Already a member? Log in
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

function ReimbursementToolApp() {
  const [stores, setStores] = useState<StoreFromApi[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const connectedStores = useMemo(
    () => stores.filter((store) => store.is_connected),
    [stores]
  );

  const loadToolData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [storesRes, summaryRes, reimbursementsRes] = await Promise.all([
        api.get<StoreFromApi[]>(`/stores?_=${Date.now()}`),
        // All-time summary for connected stores (no days_back filter).
        api.get<Summary>(`/summary?_=${Date.now()}`),
        // Load recent reimbursements up to the configured limit for inspection.
        api.get<Reimbursement[]>(`/reimbursements?skip=0&limit=50000&_=${Date.now()}`),
      ]);
      setStores(storesRes.data);
      setSummary(summaryRes.data);
      setReimbursements(reimbursementsRes.data);
    } catch (error) {
      setStores([]);
      setSummary(null);
      setReimbursements([]);
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setErrorMessage(typeof message === "string" ? message : "Failed to load reimbursement tool data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadToolData();
  }, [loadToolData]);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setInfoMessage(null);
    setErrorMessage(null);
    try {
      const { data } = await api.post<{
        synced: boolean;
        stores_synced: number;
        reimbursements_added: number;
        shipments_updated: number;
        message?: string;
        errors?: string[];
      }>("/sync", { client_time: new Date().toISOString() });
      if (!data.synced && data.errors?.length) {
        setErrorMessage(data.errors[0]);
      } else {
        setInfoMessage(
          data.message ??
            `Sync complete. ${data.reimbursements_added} reimbursements added across ${data.stores_synced} connected store(s).`
        );
      }
      await loadToolData();
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setErrorMessage(typeof message === "string" ? message : "Failed to sync reimbursement data.");
    } finally {
      setSyncing(false);
    }
  }, [loadToolData]);

  const handleUpload = useCallback(async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    setInfoMessage(null);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<UploadReport>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setInfoMessage(
        `Upload complete. ${data.inserted_rows} rows inserted, ${data.skipped_rows} skipped. Dashboard totals now reflect the latest data.`
      );
      await loadToolData();
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setErrorMessage(typeof message === "string" ? message : "Failed to upload reimbursement file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [loadToolData]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section className="rounded-3xl bg-gradient-to-br from-orange-50 to-white p-8 shadow-sm border border-orange-100">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Reimbursement Tool
          </p>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Fully Working Reimbursement Console</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Sync Amazon reimbursements, upload report files, and verify the same data is loading into the dashboard.
                Dashboard totals below reflect all synced data for your connected stores.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSync}
                disabled={syncing}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Refresh Amazon Data"}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload CSV / TSV"}
              </button>
              <Link
                to="/stores"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <Link2 className="h-4 w-4" />
                Manage Stores
              </Link>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,text/csv,text/tab-separated-values"
            className="hidden"
            onChange={(event) => handleUpload(event.target.files?.[0])}
          />
        </section>

        {infoMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Connected Stores</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{connectedStores.length}</p>
            <p className="mt-2 text-sm text-slate-500">
              {connectedStores.length > 0
                ? connectedStores.map((store) => store.store_name).join(", ")
                : "Connect Amazon in Manage Stores to start syncing."}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Dashboard Rows (All Time)</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{summary?.row_count ?? 0}</p>
            <p className="mt-2 text-sm text-slate-500">These rows are what the dashboard is currently using.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Recovered Value (All Time)</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: summary?.currency ?? "USD",
                maximumFractionDigits: 2,
              }).format(summary?.total_amount ?? 0)}
            </p>
            <p className="mt-2 text-sm text-slate-500">Refresh data to load the newest Amazon reimbursement records.</p>
          </div>
        </section>

        {!loading && connectedStores.length === 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            No connected Amazon stores yet. Open `Manage Stores`, connect Amazon, then return here and click `Refresh Amazon Data`.
          </div>
        )}

        <section className={tableWrapperClass}>
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent Reimbursements Loaded Into Dashboard</h2>
              <p className="mt-1 text-sm text-white/60">Latest 180-day records currently available to the dashboard and cases pages.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className="px-6 py-4">Approval Date</th>
                  <th className="px-6 py-4">Reimbursement ID</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">ASIN</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className={tableBodyClass}>
                {loading ? (
                  <tr>
                    <td colSpan={6} className={emptyStateCellClass}>Loading reimbursement tool data...</td>
                  </tr>
                ) : reimbursements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={emptyStateCellClass}>No reimbursement records loaded yet.</td>
                  </tr>
                ) : (
                  reimbursements.slice(0, 12).map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-white/5">
                      <td className={tableCellClass}>{formatDate(item.approval_date ?? item.date)}</td>
                      <td className={`${tableCellClass} font-mono text-xs`}>{showText(item.reimbursement_id)}</td>
                      <td className={tableCellClass}>{showText(item.reason ?? item.issue_type).replace(/_/g, " ")}</td>
                      <td className={tableCellClass}>{showText(item.sku)}</td>
                      <td className={tableCellClass}>{showText(item.asin)}</td>
                      <td className={`${tableCellClass} text-right font-semibold text-teal-200`}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: item.currency_unit ?? item.currency ?? "USD",
                          maximumFractionDigits: 2,
                        }).format(item.amount_total ?? item.amount ?? 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default function ReimbursementTool() {
  const { token } = useAuth();
  return token ? <ReimbursementToolApp /> : <MarketingTool />;
}

