import { BarChart3, ShieldCheck, Zap, PieChart, Star } from "lucide-react";
import hero from "../assets/home1.png";

const stats = [
  { label: "Recovered for sellers", value: "$48M+" },
  { label: "Monthly audit volume", value: "12K+ files" },
  { label: "Average ROI", value: "6.4x" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Automated FBA audit",
    desc: "SP-API ingestion surfaces every inbound, fee, return & lost claim automatically.",
  },
  {
    icon: PieChart,
    title: "Opportunity tracker",
    desc: "One dashboard shows pending Amazon decisions, drafts, and dollar impact.",
  },
  {
    icon: BarChart3,
    title: "White-glove escalation",
    desc: "Slack + WhatsApp channel to escalate denied claims within minutes.",
  },
  {
    icon: Zap,
    title: "Zero setup fees",
    desc: "Connect Seller Central in 60 seconds and start recovering instantly.",
  },
];

const steps = [
  { title: "Connect Seller Central", desc: "Secure OAuth connection, no developer keys needed." },
  { title: "Automated audit", desc: "We backfill 18 months of data and draft every open claim." },
  { title: "File & recover", desc: "Send ready-to-submit Amazon cases or let us handle filing." },
  { title: "Track results", desc: "Live dashboard, Slack alerts, and exports built for finance teams." },
];

const testimonials = [
  {
    name: "Micheal Chen",
    role: "Ops Lead, Volt Bikes",
    quote:
      "amzDUDES recovered $148K in 45 days and replaced two VA roles. The Slack channel gives us answers instantly.",
  },
  {
    name: "Sara Wilkins",
    role: "Head of Finance, Lume Labs",
    quote:
      "The pricing is transparent, the reporting is gorgeous, and the team fights for every dollar we're owed.",
  },
  {
    name: "Dwight Thompson",
    role: "Co-founder, Bloomful",
    quote:
      "We tried GETIDA and Seller Investigators. Nobody matched amzDUDES' automation plus human follow-through.",
  },
];

const comparisonPlans = [
  {
    title: "Other tools",
    percentage: "20–25%",
    bullets: [
      "High recoveries taxed at 25%",
      "Manual spreadsheets",
      "Slow case follow-up",
      "Opaque pricing tiers",
    ],
  },
  {
    title: "AMZDUDES",
    percentage: "8%",
    highlight: true,
    bullets: [
      "Transparent subscription + low commission",
      "Automated case drafts & evidence",
      "Slack + WhatsApp escalation",
      "No long-term contracts",
    ],
  },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="rounded-3xl border border-white/50 bg-gradient-to-br from-[#FF9551] via-[#ff7a18] to-[#F04900] p-10 text-white shadow-[0px_35px_80px_rgba(255,122,24,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-12">
          <div className="max-w-xl space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/80">
              Recover Amazon FBA reimbursements — pay less
            </p>
            <h1 className="text-4xl font-semibold leading-tight">
              Automated audits, verified drafts, and the lowest commission in
              the market.
            </h1>
            <p className="text-white/80 text-sm">
              AMZDUDES finds money Amazon owes you, drafts perfect claims, and
              plugs into your workflow with Slack + WhatsApp alerts.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#F04900] shadow-lg">
                Book audit review
              </button>
              <button className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white">
                See dashboard
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white/10 p-6 shadow-inner">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                Recovery rate
              </p>
              <p className="text-5xl font-semibold">8%</p>
              <p className="text-white/80 text-sm">Industry low commission</p>
            </div>
            <div className="rounded-3xl bg-white/20 p-6 shadow-inner">
              <img src={hero} alt="Dashboard" className="rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/10 p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
          Powerful features built for Amazon sellers
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">
          Everything you need to find FBA reimbursements, win claims, & scale.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-100 bg-white/80 p-6 text-left shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
            >
              <feature.icon className="h-10 w-10 text-orange-500" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-10 shadow-[0_30px_70px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
          How AMZDUDES works
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          Three steps to recovery in days, not weeks.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step.title} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-orange-500 shadow">
                {idx + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-10 shadow-[0_20px_50px_rgba(15,23,42,0.1)]">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
              Complete visibility
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Track claims, review recoveries, and align your Amazon finance.
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Build trust with finance & founders using executive-ready reports,
              exports, and alerts tailored to Amazon reimbursements.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>✔ Live analytics & recovery pacing</li>
              <li>✔ Expert exports for accruals & audits</li>
              <li>✔ Custom alerts when claims are approved or denied</li>
            </ul>
          </div>
          <div className="rounded-[40px] border border-white/80 bg-white p-6 shadow-[0_30px_70px_rgba(15,23,42,0.15)]">
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <p className="text-xs uppercase tracking-[0.4em] text-white/80">
                Claim dashboard
              </p>
              <p className="mt-2 text-4xl font-semibold">$48,392</p>
              <p className="text-sm text-white/70">Awaiting Amazon decision</p>
            </div>
            <div className="mt-4 grid gap-4 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span>Inbound</span>
                <span>$24,325 · 152 cases</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span>Damaged</span>
                <span>$206 · 3 cases</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span>Returns</span>
                <span>$0 · 9 cases</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
            Trusted by Amazon sellers worldwide
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">
            Brands trust us because we treat reimbursements like revenue.
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((card) => (
            <div
              key={card.name}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
            >
              <Star className="h-6 w-6 text-orange-500" />
              <p className="mt-4 text-sm text-slate-600">“{card.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">
                {card.name}
              </p>
              <p className="text-xs text-slate-500">{card.role}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-4 text-center shadow">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              $48M+
            </p>
            <p className="text-lg font-semibold text-slate-900">
              Recovered for sellers
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4 text-center shadow">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              12,000+
            </p>
            <p className="text-lg font-semibold text-slate-900">
              Active seller accounts
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4 text-center shadow">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              99%
            </p>
            <p className="text-lg font-semibold text-slate-900">
              Case win rate
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-10 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.4em] text-orange-500">
          Stop paying 25%+
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          AMZDUDES charges 8% with no hidden fees. That’s the lowest in the
          industry.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {comparisonPlans.map((plan) => (
            <div
              key={plan.title}
              className={`rounded-3xl border p-6 ${
                plan.highlight
                  ? "border-orange-200 bg-orange-50/40"
                  : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                {plan.title}
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-semibold text-slate-900">
                  {plan.percentage}
                </span>
                <span className="text-sm text-slate-500">Avg fee</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-3xl bg-emerald-50 p-6 text-center text-sm text-emerald-600">
          Save $1,200–$1,700 on every $10,000 recovered compared to legacy
          tools charging 25%.
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-gradient-to-br from-[#FF9551] via-[#FF7A18] to-[#F04900] p-10 text-white shadow-[0_30px_80px_rgba(255,122,24,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              Ready to recover more?
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              Start your free audit + strategy plan today.
            </h2>
            <p className="text-sm text-white/80">
              We’ll show you every reimbursement opportunity and model ROI
              before you switch.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#F04900] shadow-lg">
              Schedule demo
            </button>
            <button className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white">
              Download deck
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
