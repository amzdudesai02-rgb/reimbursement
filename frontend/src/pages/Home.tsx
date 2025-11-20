import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Link2,
  Lock,
  Percent,
  Send,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const heroStats = [
  { label: "Recovered for sellers", value: "$48M+" },
  { label: "Active users", value: "12K+" },
  { label: "Approval rate", value: "99%" },
];

const features = [
  { icon: ShieldCheck, title: "Automated FBA Audit", desc: "AI-powered scanning detects every eligible reimbursement across your inventory." },
  { icon: TrendingUp, title: "Hidden Opportunities", desc: "Find lost, damaged, and destroyed inventory money Amazon owes you." },
  { icon: BarChart3, title: "Real-time Dashboard", desc: "Track every claim status, approval, and recovered amount instantly." },
  { icon: Percent, title: "Only 8% Commission", desc: "Cheapest in the market — keep more of what you recover." },
  { icon: Send, title: "Recovery Tracking", desc: "Complete visibility into reimbursements, approvals, and revenue impact." },
  { icon: Lock, title: "Amazon-Compliant & Secure", desc: "TOS-compliant, bank-level encryption, AWS-backed infrastructure." },
];

const steps = [
  { icon: Link2, title: "Connect Amazon Account", desc: "Secure OAuth connection in under 60 seconds." },
  { icon: FileText, title: "Automated Audits", desc: "We detect every fee, inbound, or return discrepancy automatically." },
  { icon: Send, title: "File & Recover", desc: "Approve turnkey claim packets or let AMZDudes submit them for you." },
  { icon: Activity, title: "Track Results", desc: "Live dashboards, alerts, and exports for finance and ops teams." },
];

const securityPoints = [
  "OAuth-only Seller Central access",
  "SOC2-ready infrastructure",
  "24/7 fraud monitoring & SLA",
  "Encrypted data at rest and in transit",
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_40px_120px_rgba(12,38,131,0.1)]">
        <div className="flex flex-wrap items-center gap-12">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              ⚡ Lowest commission in the market
            </span>
            <h1 className="text-4xl font-semibold text-slate-900">
              Recover Amazon FBA Reimbursements — Pay Less.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Automated audits, verified claims, and the lowest commission in the market. AMZDudes finds money you didn’t know you were owed.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-[#0B64FF] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#074cd3]">
                Start Free Audit
              </button>
              <button className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400">
                See Dashboard
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span>Amazon-safe. Your data is encrypted & secure.</span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl bg-[#0B64FF] p-6 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">AMZDudes Dashboard</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Active Claims</p>
                  <p className="text-3xl font-semibold">47</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">Pending</p>
                  <p className="text-3xl font-semibold">$12,847</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm">
                <p className="text-white/70">You pay only</p>
                <p className="text-4xl font-semibold">8%</p>
                <p className="text-xs text-white/80">vs. 25% competitors</p>
              </div>
            </div>
            <div className="rounded-[32px] border border-slate-100 bg-slate-50 p-6 text-slate-700 shadow-inner">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Latest Approval</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">+$1,247.50</p>
              <p className="text-sm text-slate-500">Damaged inventory claim</p>
              <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Approved
              </span>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="space-y-6 text-center">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Built for Amazon sellers</p>
          <h2 className="text-3xl font-semibold text-slate-900">Powerful features built for Amazon sellers</h2>
          <p className="text-sm text-slate-500">
            Everything you need to maximize your FBA reimbursements, all in one automated platform.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-[0_30px_70px_rgba(12,38,131,0.08)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_35px_90px_rgba(12,38,131,0.08)]">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Complete visibility</p>
          <h2 className="text-3xl font-semibold text-slate-900">Complete visibility into your reimbursements</h2>
          <p className="text-sm text-slate-500">
            Track claims, monitor recoveries, and analyze your Amazon FBA reimbursements with dashboards built for sellers.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[36px] border border-slate-100 bg-slate-50/70 p-6">
            <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>AMZDudes dashboard</span>
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="mt-6 text-4xl font-semibold">$48,392</p>
              <p className="text-sm text-white/70">Awaiting Amazon decision</p>
            </div>
            <div className="mt-4 grid gap-3">
              {[
                { label: "Inbound", value: "$24,325 · 152 cases" },
                { label: "Damaged", value: "$206 · 3 cases" },
                { label: "Returns", value: "$0 · 9 cases" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p>✔ Live analytics & recovery pacing</p>
            <p>✔ Expert exports for accruals & audits</p>
            <p>✔ Alerts when cases are approved or denied</p>
            <p>✔ Slack + email digests for founders & finance</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="rounded-[32px] border border-slate-100 bg-slate-50 p-10 shadow-[0_20px_60px_rgba(12,38,131,0.08)]">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">How AMZDudes works</p>
          <h2 className="text-3xl font-semibold text-slate-900">How AMZDudes Works</h2>
          <p className="text-sm text-slate-500">
            From setup to recovery in 4 simple steps. Start finding hidden money in your Amazon account today.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((step, idx) => (
            <article key={step.title} className="rounded-3xl bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-blue-600">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="security" className="rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_25px_80px_rgba(12,38,131,0.08)]">
        <div className="flex flex-wrap items-center gap-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Security</p>
            <h2 className="text-3xl font-semibold text-slate-900">Enterprise-grade security & compliance</h2>
            <p className="text-sm text-slate-500">
              Built with AWS, encrypted end-to-end, and monitored 24/7 so your Seller Central data stays safe.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {securityPoints.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              <Lock className="mx-auto h-10 w-10 text-blue-500" />
              <p className="mt-3 text-slate-900 font-semibold">AWS + Cloudflare shield</p>
              <p>Multi-region backups, IP restrictions, and role-based controls.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-100 bg-gradient-to-r from-[#0B64FF] to-[#224CFF] p-10 text-white shadow-[0_35px_100px_rgba(12,38,131,0.4)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Ready to recover more?</p>
            <h2 className="mt-2 text-3xl font-semibold">Stop paying 25% to other reimbursement tools.</h2>
            <p className="text-sm text-white/80 mt-2">
              AMZDudes charges 8%, with no setup fees. We show every opportunity before you switch.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B64FF] shadow">
              Start Free Audit
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white">
              Schedule Call <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
