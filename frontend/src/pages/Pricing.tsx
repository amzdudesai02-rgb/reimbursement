import { ArrowRight, CheckCircle2, Sparkles, Award } from "lucide-react";
import { pricingPlans } from "../data/pricingData";

const reasons = [
  "Live SP-API ingestion + automated drafts for every claim type.",
  "Playbooks for lost inbound, fees, returns, removals, and restock limits.",
  "White-glove onboarding plus Slack/WhatsApp escalation channel.",
];

const competitorRows = [
  ["Subscription + Commission", "✅ $29.99–$149.99 • 10%→7%", "❌ 25% fee only"],
  ["SP-API automation", "✅ Full coverage", "⚠️ Semi manual"],
  ["Fee + storage error detection", "✅ Included", "❌ Add-on"],
  ["Multi-store analytics", "✅ Unified dashboard", "⚠️ Extra license"],
  ["Priority SLA", "✅ < 2h response", "⚠️ 24–48h"],
];

const savingsRows = [
  ["$2k recovered / mo", "$500 fee (25%)", "$229 (Starter 10%)", "+$270 kept"],
  ["$5k recovered / mo", "$1,250 fee (25%)", "$495 (Growth 9%)", "+$755 kept"],
  ["$10k recovered / mo", "$2,500 fee (25%)", "$840 (Enterprise 7%)", "+$1,660 kept"],
];

export default function Pricing() {
  return (
    <div className="space-y-14">
      <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-700 p-10 text-white shadow-[0_40px_80px_rgba(15,23,42,0.4)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">
              Pricing built for Amazon operators
            </p>
            <h1 className="text-4xl font-semibold">
              Keep 93% of every reimbursement. Cancel anytime.
            </h1>
            <p className="text-sm text-white/80">
              Transparent subscription + industry-low commission. Plans scale
              with your monthly recovery volume, and you can switch between
              monthly or annual billing in one click.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {reasons.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-white/90"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 text-sm text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">
              Avg ROI
            </p>
            <h2 className="mt-2 text-5xl font-semibold">6.4x</h2>
            <p className="text-white/80">Within 60 days of onboarding</p>
            <div className="mt-4 rounded-2xl border border-white/30 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                All plans include
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Automated case drafts and audit evidence</li>
                <li>• Dedicated reimbursement strategist</li>
                <li>• Slack + WhatsApp escalation channel</li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <article
            key={plan.plan}
            className={`rounded-3xl border ${
              plan.highlight
                ? "border-indigo-200 bg-white shadow-[0_25px_60px_rgba(67,56,202,0.15)]"
                : "border-slate-100 bg-white/80 shadow-[0_15px_40px_rgba(15,23,42,0.08)]"
            } p-6`}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              {plan.plan}
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900">
              {plan.monthly}
            </h3>
            <p className="text-sm text-emerald-600">{plan.annualText}</p>
            <p className="mt-3 text-sm text-slate-500">{plan.ideal}</p>
            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <p dangerouslySetInnerHTML={{ __html: plan.feeHtml }} />
              <p>{plan.range}</p>
            </div>
            <button
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold ${
                plan.highlight
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {plan.highlight ? "Start 14-day pilot" : "Chat with sales"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>✔ Audit + Slack channel</li>
              <li>✔ Full claim automation</li>
              <li>✔ Reporting + white-label exports</li>
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_30px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Why operators switch
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Everything you need to run reimbursements like a revenue channel.
            </h2>
          </div>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
            Download feature sheet
          </button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="p-4">Feature</th>
                <th className="p-4 text-center">Starter</th>
                <th className="p-4 text-center">Growth</th>
                <th className="p-4 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                "Automated inbound shortage detection",
                "Warehouse lost/damaged claims",
                "Returns + removal order audit",
                "Fee & storage error monitoring",
                "Weekly recovery digest",
                "Dedicated strategist + SLA",
                "Slack / WhatsApp escalation",
                "Custom BI exports & webhooks",
              ].map((feature, idx) => (
                <tr key={feature} className="bg-white">
                  <td className="p-4 font-medium text-slate-700">{feature}</td>
                  <td className="p-4 text-center text-slate-500">
                    {idx < 5 ? "✔ Included" : idx === 5 ? "—" : "—"}
                  </td>
                  <td className="p-4 text-center text-slate-500">
                    {idx < 6 ? "✔ Included" : idx === 6 ? "✔" : "Add-on"}
                  </td>
                  <td className="p-4 text-center text-slate-500">
                    {idx === 7 ? "✔ Custom" : "✔ Included"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
          Feature matrix updated Oct 2025. All plans include onboarding, SP-API
          integration, and proactive claim drafting.
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Competitor teardown
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Pay for recoveries, not bureaucracy.
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="p-4">Factor</th>
                <th className="p-4 text-center text-indigo-600 border-l-4 border-indigo-500">
                  AMZDUDES
                </th>
                <th className="p-4 text-center">Legacy vendors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {competitorRows.map((row) => (
                <tr key={row[0]}>
                  <td className="p-4 font-medium text-slate-700">{row[0]}</td>
                  <td className="p-4 text-center font-semibold text-slate-900">
                    {row[1]}
                  </td>
                  <td className="p-4 text-center text-slate-500">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Rates audited Oct 2025 across GETIDA, Seller Investigators, Refunds
          Manager.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Seller keeps extra
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Compare what you actually keep.
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/60 text-center text-sm text-slate-700">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wide">
                <th className="p-4">Monthly recovery</th>
                <th className="p-4">Competitor fee (25%)</th>
                <th className="p-4">AMZDUDES subscription + commission</th>
                <th className="p-4">You keep extra</th>
              </tr>
            </thead>
            <tbody>
              {savingsRows.map((row) => (
                <tr key={row[0]} className="bg-white">
                  {row.map((cell) => (
                    <td key={cell} className="p-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Ready to recover more?
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Start with a free audit + action plan.
            </h2>
            <p className="text-sm text-slate-500">
              We’ll surface every open reimbursement opportunity and model the
              ROI before you commit.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg">
            Schedule strategy call
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Import marketplaces instantly", "No long-term contracts", "Instant Slack + email setup"].map(
            (item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-600"
              >
                <Award className="h-5 w-5 text-indigo-500" />
                <p className="mt-2 font-medium text-slate-900">{item}</p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
