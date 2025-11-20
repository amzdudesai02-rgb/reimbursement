import {
  Activity,
  ArrowRight,
  BarChart3,
  LineChart,
  ShieldCheck,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import hero from "../assets/home1.png";

const heroStats = [
  { label: "Recovered for sellers", value: "$48M+" },
  { label: "Monthly audits", value: "12K+ files" },
  { label: "Avg ROI", value: "6.4x" },
];

const featureCards = [
  {
    icon: ShieldCheck,
    title: "Automated FBA audit",
    desc: "SP-API ingestion surfaces inbound, fee, return, and lost claims automatically.",
  },
  {
    icon: LineChart,
    title: "Real-time dashboard",
    desc: "See every reimbursement, claim aging, and ROI on one blue-glass board.",
  },
  {
    icon: Zap,
    title: "One-click case packets",
    desc: "AI drafts Amazon-compliant evidence so you can approve & submit instantly.",
  },
  {
    icon: BarChart3,
    title: "Only 8% commission",
    desc: "Keep 92% of recovered revenue with flat subscription + 8% success fee.",
  },
];

const steps = [
  { title: "Connect Amazon Account", desc: "Secure OAuth connection, no developer keys needed." },
  { title: "Automated Audit", desc: "Backfill 18 months and highlight every reimbursement opportunity." },
  { title: "File & Recover", desc: "Approve pre-drafted cases or let our managed team submit." },
  { title: "Track Results", desc: "Live analytics, alerts, and exports built for finance teams." },
];

const testimonialCards = [
  {
    quote: "“amzDUDES recovered $148K in 45 days and replaced two VA roles. The Slack channel gives us answers instantly.”",
    name: "Micheal Chen",
    role: "Ops Lead, Volt Bikes",
  },
  {
    quote: "“The pricing is transparent, reporting is gorgeous, and the team fights for every dollar we’re owed.”",
    name: "Sara Wilkins",
    role: "Head of Finance, Lume Labs",
  },
  {
    quote: "“We tried GETIDA and Seller Investigators. Nobody matched amzDUDES’ automation plus human follow-through.”",
    name: "Dwight Thompson",
    role: "Co-founder, Bloomful",
  },
];

const comparison = [
  {
    title: "Other tools",
    percent: "20–25%",
    bullets: ["High recoveries taxed at 25%", "Manual spreadsheets", "Slow case follow-up", "Opaque pricing"],
  },
  {
    title: "AMZDUDES",
    percent: "8%",
    highlight: true,
    bullets: ["Flat subscription + 8% success fee", "Automated drafts & evidence", "Slack/WhatsApp escalation", "No long-term contracts"],
  },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_40px_120px_rgba(8,46,176,0.08)]">
        <div className="flex flex-wrap items-center gap-12">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              FBA reimbursements
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              Recover Amazon FBA reimbursements — pay less.
            </h1>
            <p className="text-lg text-slate-600">
              Automated audits, verified claims, and the lowest commission in the industry. AMZDUDES finds every dollar Amazon owes you and plugs straight into your workflow.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-[#0B64FF] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#044fe0]">
                Start free audit
              </button>
              <button className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400">
                Book live demo
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-[#0B64FF] p-6 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">Only 8% commission</p>
              <p className="mt-3 text-5xl font-semibold">8%</p>
              <p className="text-sm text-white/80">Industry-low fee backed by automation</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-inner">
              <img src={hero} alt="Dashboard mock" className="rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="space-y-6 text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-600">Powerful features</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">
            Everything you need to maximize FBA reimbursements.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-[0_20px_50px_rgba(10,35,130,0.08)]"
            >
              <card.icon className="h-10 w-10 text-[#0B64FF]" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{card.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="rounded-[32px] border border-slate-100 bg-gradient-to-br from-[#F6F8FF] via-white to-[#EEF2FF] p-10 shadow-[0_30px_80px_rgba(8,46,176,0.08)]"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-blue-600">How AMZDUDES works</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">Simple steps. Massive recovery.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-white bg-white/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-600">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_30px_80px_rgba(8,46,176,0.08)]">
        <div className="flex flex-wrap items-center gap-10">
          <div className="flex-1 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-600">Complete visibility</p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Track every claim, recoveries, and trends in one glance.
            </h2>
            <p className="text-sm text-slate-500">
              Live insights, finance-ready exports, and alerts built for Amazon-first operators.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✔ Live analytics & recovery pacing</li>
              <li>✔ Expert exports for accruals & audits</li>
              <li>✔ Alerts when cases are approved or denied</li>
            </ul>
          </div>
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
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-blue-600">Trusted by Amazon sellers worldwide</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">
            Thousands of sellers recover and retain more with AMZDudes.
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonialCards.map((card) => (
            <article
              key={card.name}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_25px_60px_rgba(10,35,130,0.08)]"
            >
              <Star className="h-8 w-8 text-blue-500" />
              <p className="mt-4 text-sm text-slate-600">{card.quote}</p>
              <div className="mt-4 text-sm">
                <p className="font-semibold text-slate-900">{card.name}</p>
                <p className="text-slate-500">{card.role}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "$48M+", desc: "Total recovered for sellers" },
            { label: "12,000+", desc: "Active seller accounts" },
            { label: "99%", desc: "Case win rate" },
          ].map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{metric.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">{metric.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_30px_80px_rgba(8,46,176,0.08)]">
        <div className="flex flex-wrap items-center gap-4">
          <Activity className="h-10 w-10 text-blue-500" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-blue-600">Stop paying 25%+</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              AMZDUDES charges 8% with no hidden fees. Lowest in the industry.
            </h2>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {comparison.map((plan) => (
            <article
              key={plan.title}
              className={`rounded-3xl border p-6 ${
                plan.highlight ? "border-blue-200 bg-blue-50/40" : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{plan.title}</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-semibold text-slate-900">{plan.percent}</span>
                <span className="text-sm text-slate-500">Avg fee</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-3xl bg-emerald-50 p-6 text-center text-sm text-emerald-700">
          Save $1,200–$1,700 on every $10,000 recovered compared to legacy tools charging 25%.
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-100 bg-gradient-to-r from-[#0C2CF8] to-[#1283FF] p-10 text-white shadow-[0_30px_90px_rgba(7,28,112,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Ready to recover more?</p>
            <h2 className="mt-2 text-3xl font-semibold">Stop paying 25% to other reimbursement tools.</h2>
            <p className="text-sm text-white/80">
              AMZDUDES charges 8%, with no setup fees. That’s real power to the seller.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B64FF] shadow">
              Start free audit
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white">
              Schedule call <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
