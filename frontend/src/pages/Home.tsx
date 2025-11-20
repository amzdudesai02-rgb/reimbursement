import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Github,
  Link2,
  Linkedin,
  Lock,
  Percent,
  Play,
  Send,
  Shield,
  ShieldCheck,
  TrendingUp,
  Twitter,
  Zap,
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

const claims = [
  { id: "CLM-4782", type: "Lost Inventory", amount: "$847.23", status: "Approved", statusColor: "text-emerald-600 bg-emerald-50", date: "Nov 15, 2025" },
  { id: "CLM-4781", type: "Damaged Item", amount: "$1,247.50", status: "Approved", statusColor: "text-emerald-600 bg-emerald-50", date: "Nov 14, 2025" },
  { id: "CLM-4780", type: "Customer Return", amount: "$324.00", status: "Pending", statusColor: "text-amber-600 bg-amber-50", date: "Nov 13, 2025" },
  { id: "CLM-4779", type: "In-transit Damage", amount: "$592.17", status: "Processing", statusColor: "text-blue-600 bg-blue-50", date: "Nov 12, 2025" },
  { id: "CLM-4778", type: "Fee Audit", amount: "$1,089.45", status: "Approved", statusColor: "text-emerald-600 bg-emerald-50", date: "Nov 11, 2025" },
];

const analyticsTiles = [
  { icon: BarChart3, title: "Live Analytics", desc: "Real-time tracking of submissions, approvals, and recoveries." },
  { icon: FileText, title: "Export Reports", desc: "Download CSVs for accounting, audits, and BI tools." },
  { icon: Send, title: "Instant Alerts", desc: "Notifications the moment Amazon approves, denies, or needs info." },
];

const testimonialTabs = ["Amazon FBA Sellers", "7-Figure Brands", "Growing Sellers", "eCommerce Pros"];

const testimonials = [
  {
    quote: '"AMZDudes found over $34K we had no idea Amazon owed us. The 8% commission is unbeatable."',
    name: "Michael Chen",
    role: "Amazon Seller since 2018 • $3.2M/year",
  },
  {
    quote: '"Switched from a competitor charging 25%. In 6 months, AMZDudes saved us $8,400 in fees alone."',
    name: "Sarah Martinez",
    role: "FBA Seller • Electronics Category",
  },
  {
    quote: '"Finally, a reimbursement tool that doesn’t eat into margins. Recovered $19K in Q4 and paid <$2K."',
    name: "David Thompson",
    role: "Multi-channel Seller • 7 figures",
  },
];

const pricingComparison = [
  {
    title: "Other Services",
    rate: "20-25%",
    bullets: [
      "High commission fees eat into profits",
      "Hidden setup or monthly fees",
      "Limited dashboard features",
      "No clawback protection",
    ],
    color: "border-slate-200",
    pay: "$2,000-$2,500",
  },
  {
    title: "AMZDudes — Best Value",
    rate: "8%",
    bullets: [
      "Lowest commission in the market",
      "No hidden fees or setup costs",
      "Advanced real-time dashboard",
      "Full clawback protection included",
    ],
    color: "border-blue-500",
    pay: "$800",
  },
];

const heroBars = [55, 78, 65, 90];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_40px_120px_rgba(12,38,131,0.1)]">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Zap className="h-3.5 w-3.5" />
              Lowest commission in the market
            </span>
            <h1 className="text-4xl font-semibold text-slate-900 leading-tight">
              Recover Amazon FBA Reimbursements — Pay Less.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Automated audits, verified claims, and the lowest commission in the market. AMZDudes finds money you didn’t know you were owed.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-[#0B64FF] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#074cd3]">
                Start Free Audit
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400">
                <Play className="h-4 w-4" />
                See Dashboard
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <Shield className="h-5 w-5 text-blue-500" />
              <span>Amazon-safe. Your data is encrypted & secure.</span>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[36px] border border-slate-100 bg-white p-6 shadow-[0_35px_90px_rgba(12,38,131,0.15)]">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#0B64FF] text-white">AD</span>
                AMZDudes Dashboard
              </div>
              <div className="mt-6 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm text-slate-500 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Active Claims</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">47</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Pending</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">$12,847</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-600">Recovery Trend</p>
                <div className="mt-3 flex items-end gap-3">
                  {heroBars.map((height, idx) => (
                    <div
                      key={idx}
                      className="w-8 rounded-t-2xl bg-gradient-to-t from-[#0B64FF] to-[#54A3FF]"
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -right-6 -top-6 w-48 rounded-3xl bg-[#0B64FF] p-4 text-white shadow-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">You pay only</p>
              <p className="mt-2 text-4xl font-semibold">8%</p>
              <p className="text-xs text-white/80">vs. 25% competitors</p>
            </div>
            <div className="absolute -left-6 -bottom-8 w-56 rounded-3xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Latest Approval</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">+$1,247.50</p>
              <p>Damaged inventory claim</p>
              <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Approved
              </span>
            </div>
          </div>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
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

      <section className="space-y-8" id="visibility">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Complete visibility</p>
          <h2 className="text-4xl font-semibold text-slate-900">Complete visibility into your reimbursements</h2>
          <p className="text-base text-slate-500">
            Track claims, monitor recoveries, and analyze your Amazon FBA reimbursements with our advanced dashboard built specifically for sellers.
          </p>
        </div>
        <div className="relative rounded-[36px] border border-slate-100 bg-white p-6 shadow-[0_40px_120px_rgba(12,38,131,0.08)]">
          <div className="rounded-3xl border border-slate-100 bg-slate-900 text-white">
            <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 font-semibold">AD</div>
              <p className="text-lg font-semibold">Claims Dashboard</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.35em] text-white/60">
                  <tr>
                    <th className="px-6 py-3">Claim ID</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date Filed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {claims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="px-6 py-3 font-medium">{claim.id}</td>
                      <td className="px-6 py-3 text-white/80">{claim.type}</td>
                      <td className="px-6 py-3 font-semibold">{claim.amount}</td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${claim.statusColor}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-white/80">{claim.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="absolute right-8 -top-10 w-64 rounded-3xl bg-[#0B64FF] p-6 text-white shadow-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Total Recovered (90 days)</p>
            <p className="mt-4 text-4xl font-semibold">$48,392</p>
            <p className="text-xs text-white/70">73% approval rate this period</p>
            <div className="mt-4 h-2 rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white" style={{ width: "73%" }} />
            </div>
          </div>
          <div className="absolute left-8 -bottom-10 w-64 rounded-3xl border border-slate-100 bg-white p-5 text-sm text-slate-700 shadow-xl">
            <p className="text-base font-semibold">Audit Results</p>
            <div className="mt-3 space-y-2 text-slate-500">
              <div className="flex items-center justify-between">
                <span>Items Scanned</span>
                <span className="font-semibold text-slate-900">18,429</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Opportunities Found</span>
                <span className="font-semibold text-blue-600">147</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Est. Recovery</span>
                <span className="font-semibold text-emerald-600">$23,847</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 grid gap-6 border-t border-slate-100 pt-10 md:grid-cols-3">
          {analyticsTiles.map((tile) => (
            <div key={tile.title} className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <tile.icon className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold text-slate-900">{tile.title}</p>
              <p className="mt-2 text-sm text-slate-500">{tile.desc}</p>
            </div>
          ))}
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

      <section className="space-y-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Trusted by Amazon sellers worldwide</p>
          <h2 className="mt-2 text-4xl font-semibold text-slate-900">Trusted by Amazon Sellers Worldwide</h2>
          <p className="text-sm text-slate-500">Join thousands of sellers recovering what they’re owed with AMZDudes.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
          {testimonialTabs.map((tab, idx) => (
            <button
              key={tab}
              className={`rounded-full px-4 py-2 ${
                idx === 0 ? "bg-white text-slate-900 shadow" : "text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((card) => (
            <article key={card.name} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_25px_60px_rgba(12,38,131,0.08)]">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-600">{card.quote}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  {card.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{card.name}</p>
                  <p className="text-xs text-slate-500">{card.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="rounded-[36px] bg-gradient-to-r from-[#0B64FF] to-[#1134ff] p-10 text-center text-white shadow-lg">
          <div className="grid gap-6 md:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-semibold">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8 rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_25px_80px_rgba(12,38,131,0.08)]">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Stop paying 25%+</p>
          <h2 className="text-4xl font-semibold text-slate-900">Stop Paying 25%+ To Other Reimbursement Tools</h2>
          <p className="text-sm text-slate-500">
            AMZDudes charges only 8%, with no hidden fees. That’s the lowest in the industry.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-500">
          <button className="rounded-full bg-slate-900 px-4 py-2 text-white">Other Services</button>
          <button className="rounded-full bg-white px-4 py-2 shadow">AMZDudes — Best Value</button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {pricingComparison.map((plan, idx) => (
            <article
              key={plan.title}
              className={`rounded-[28px] border ${plan.color} p-8 shadow-sm ${idx === 1 ? "bg-blue-50/40" : "bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">{plan.title}</p>
                {idx === 1 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0B64FF] px-3 py-1 text-xs font-semibold text-white">
                    <Zap className="h-3.5 w-3.5" />
                    Best Value
                  </span>
                )}
              </div>
              <p className="mt-4 text-5xl font-semibold text-slate-900">{plan.rate}</p>
              <p className="mt-2 text-sm text-slate-500">Standard Commission</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                {plan.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span>{idx === 0 ? "✕" : "✓"}</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">On $10,000 recovered</p>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#0B64FF]"
                    style={{ width: idx === 0 ? "85%" : "30%" }}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">You pay: {plan.pay}</p>
              </div>
              {idx === 1 && (
                <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0B64FF] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#074cd3]">
                  Start Free Audit Now <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-10 text-center text-emerald-700 shadow-sm">
        <h2 className="text-3xl font-semibold">Save $1,200–$1,700 on every $10,000 recovered</h2>
        <p className="mt-2 text-sm text-emerald-600">
          That’s real money back in your pocket, not wasted on inflated commissions.
        </p>
      </section>

      <section className="rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_25px_80px_rgba(12,38,131,0.08)]">
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

      <footer className="rounded-[32px] border border-slate-200 bg-slate-900 p-10 text-white">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="space-y-4 md:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white text-slate-900">AD</span>
              AMZDudes
            </div>
            <p className="text-sm text-white/70">
              The lowest-commission Amazon FBA reimbursement tool. Automated audits, verified claims, and the best rates in the market.
            </p>
            <div className="rounded-2xl border border-white/10 bg-slate-800 p-4 text-sm text-white/80">
              <p className="font-semibold">Amazon-Safe & Secure</p>
              <p>Bank-level encryption. Fully compliant with Amazon TOS.</p>
            </div>
            <div className="flex items-center gap-4 text-white/70">
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <p className="font-semibold">Product</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Get Started</p>
            <p className="mt-4 text-sm text-white/70">
              Start recovering your Amazon reimbursements today. Free audit, no commitment.
            </p>
            <button className="mt-4 w-full rounded-full bg-[#0B64FF] px-4 py-2 text-sm font-semibold text-white shadow">
              Free Audit
            </button>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-4 text-xs text-white/60">
          © {new Date().getFullYear()} AMZDudes. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
