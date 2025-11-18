import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { pricingPlans } from "../data/pricingData";

export default function Pricing() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="space-y-20">
      {/* Section: Reimbursement Fee Tier */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-center"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF9900] to-[#FF6A00] bg-clip-text text-transparent">
          Reimbursement Fee Tier
        </h2>

        <p className="mt-2 text-neutral-600">
          Choose a flexible plan — pay <strong>monthly</strong> or{" "}
          <strong>annually (save more!)</strong>.
        </p>

        <div className="mt-8 overflow-x-auto">
          <div className="rounded-3xl shadow-lg p-6 bg-gradient-to-br from-orange-50 to-white hover:shadow-xl transition">
            <table className="min-w-full border border-gray-200 text-sm bg-white rounded-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-[#FF9900]/20 to-[#FF6A00]/20">
                <tr>
                  <th className="p-3 w-[200px] font-semibold text-center">Plan</th>
                  <th className="p-3 text-center">Ideal For</th>
                  <th className="p-3">Pay Monthly</th>
                  <th className="p-3">Pay Annually (Save More)</th>
                  <th className="p-3">Recovery Commission</th>
                  <th className="p-3">Monthly Sales Range</th>
                </tr>
              </thead>
              <tbody>
                {pricingPlans.map((r) => (
                  <tr
                    key={r.plan}
                    className={`border-t hover:bg-orange-50 transition text-neutral-700 ${
                      r.highlight
                        ? "bg-orange-50/70 border-l-4 border-orange-400"
                        : ""
                    }`}
                  >
                    <td
                      className={`p-3 font-semibold text-center ${
                        r.highlight ? "text-orange-700" : "text-neutral-900"
                      }`}
                    >
                      {r.plan}
                    </td>
                    <td className="p-3 text-center">{r.ideal}</td>
                    <td
                      className="p-3"
                      dangerouslySetInnerHTML={{ __html: r.monthly }}
                    />
                    <td
                      className="p-3"
                      dangerouslySetInnerHTML={{ __html: r.annualHtml }}
                    />
                    <td
                      className="p-3"
                      dangerouslySetInnerHTML={{ __html: r.feeHtml }}
                    />
                    <td className="p-3">{r.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {["Start Free Audit", "Get Started", "Book Demo"].map((cta, i) => (
                <button
                  key={i}
                  className="bg-gradient-to-r from-[#FF9900] to-[#FF6A00] text-white font-medium px-6 py-2 rounded-full shadow hover:shadow-md hover:scale-[1.02] transition-transform"
                >
                  {cta}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

{/* Feature Comparison (updated) */}
<motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  
  className="text-center"
>
  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF9900] to-[#FF6A00] bg-clip-text text-transparent">
    Feature Comparison
  </h2>

  <div className="mt-6 overflow-x-auto">
    <div className="rounded-3xl shadow-lg p-6 bg-gradient-to-br from-orange-50 to-white hover:shadow-xl transition">
      <table className="min-w-full border border-gray-200 text-sm bg-white rounded-xl overflow-hidden">
        {/* Higher-contrast header with plan context lines */}
        <thead className="bg-[#f6b351]/35 text-neutral-800">
          <tr className="text-center">
            <th className="p-4 text-left w-[320px] font-semibold">Feature</th>

            <th className="p-4 w-[200px] font-semibold">
              Starter
              <div className="text-xs text-neutral-600 mt-1">
                For small sellers &lt; $25k/mo • From $29.99
              </div>
            </th>

            <th className="p-4 w-[200px] font-semibold relative">
              <span className="inline-flex items-center gap-2">
                Growth
                <span className="ml-2 text-[10px] font-semibold text-white bg-[#FF8A00] px-2 py-0.5 rounded-full">
                  Most Popular
                </span>
              </span>
              <div className="text-xs text-neutral-600 mt-1">
                For $25k–$100k/mo • From $69.99
              </div>
            </th>

            <th className="p-4 w-[200px] font-semibold">
              Enterprise
              <div className="text-xs text-neutral-600 mt-1">
                For &gt; $100k/mo • From $149.99
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {[
            {
              label: "Demo Audit (First Review Free)",
              tip: "Initial account review to surface top reimbursement opportunities.",
              s: true, g: true, e: true,
            },
            {
              label: "Automated Inbound Shipment Tracking",
              tip: "Track FBA inbound shipments and auto-identify shortages/damages.",
              s: true, g: true, e: true,
            },
            {
              label: "Lost & Damaged Warehouse Reconciliation",
              tip: "Claims for units lost/damaged inside Amazon FCs.",
              s: false, g: true, e: true,
            },
            {
              label: "Customer Return Reconciliation",
              tip: "Detect unreturned or wrong-condition customer returns.",
              s: false, g: true, e: true,
            },
            {
              label: "FBA Fee & Storage Error Detection",
              tip: "Find overcharges in FBA fees, weights, dimensions, and storage.",
              s: false, g: true, e: true,
            },
            {
              label: "Performance Dashboard + Reports",
              tip: "KPIs, recovery tracking, and downloadable reports.",
              s: true, g: true, e: true,
            },
            {
              label: "Weekly / Monthly Summary Report",
              tip: "Auto summaries emailed to stakeholders.",
              s: true, g: true, e: true,
            },
            {
              label: "Dedicated Account Manager",
              tip: "Assigned AM for strategy, escalations, and priority handling.",
              s: false, g: false, e: true,
            },
            {
              label: "Multi-Account Integration",
              tip: "Manage multiple marketplaces/profiles in one view.",
              s: false, g: false, e: true,
            },
            {
              label: "Quarterly Performance Audit",
              tip: "Deeper quarterly analysis and recommendations.",
              s: false, g: false, e: true,
            },
            {
              label: "Priority Support & SLA",
              tip: "Faster response, SLA-backed support for enterprise.",
              s: false, g: false, e: true,
            },
            {
              label: "Custom Integrations / White Label",
              tip: "Custom data pipes, BI hooks, or private labeling.",
              s: false, g: false, e: true,
            },
          ].map((row, i) => (
            <tr
              key={row.label}
              className={`border-t ${
                i % 2 ? "bg-orange-50/30" : "bg-white"
              } hover:bg-orange-50/60 transition`}
            >
              {/* Feature name + tooltip */}
              <td className="px-4 py-4 text-left font-medium leading-relaxed">
                <span className="inline-flex items-start gap-2">
                  {row.label}
                  <span className="relative group cursor-help select-none text-neutral-400">
                    ℹ️
                    <span className="absolute z-10 hidden group-hover:block w-64 text-left text-xs text-neutral-700 bg-white border border-neutral-200 rounded-md p-2 shadow-md -left-1 top-5">
                      {row.tip}
                    </span>
                  </span>
                </span>
              </td>

              {/* Starter */}
              <td className="px-4 py-4 text-center align-middle h-14">
                {row.s ? (
                  <Check className="inline text-green-600" size={18} />
                ) : (
                  <X className="inline text-gray-300" size={18} />
                )}
              </td>

              {/* Growth (no shade, but has badge above) */}
              <td className="px-4 py-4 text-center align-middle h-14">
                {row.g ? (
                  <Check className="inline text-green-600" size={18} />
                ) : (
                  <X className="inline text-gray-300" size={18} />
                )}
              </td>

              {/* Enterprise (light shade to emphasize premium) */}
              <td className="px-4 py-4 text-center align-middle h-14 bg-orange-50/60">
                {row.e ? (
                  <Check className="inline text-green-600" size={18} />
                ) : (
                  <X className="inline text-gray-300" size={18} />
                )}
              </td>
            </tr>
          ))}

          {/* CTA Row */}
          <tr className="border-t bg-white">
            <td className="px-4 py-6 text-left text-neutral-600">
              Choose the plan that fits your current volume.
            </td>
            <td className="px-4 py-6 text-center">
              <button className="bg-gradient-to-r from-[#FF9900] to-[#FF6A00] text-white text-sm font-medium px-5 py-2 rounded-full shadow hover:scale-[1.02] transition">
                Choose Starter
              </button>
            </td>
            <td className="px-4 py-6 text-center">
              <button className="bg-gradient-to-r from-[#FF9900] to-[#FF6A00] text-white text-sm font-medium px-5 py-2 rounded-full shadow hover:scale-[1.02] transition">
                Choose Growth
              </button>
            </td>
            <td className="px-4 py-6 text-center bg-orange-50/60">
              <button className="bg-gradient-to-r from-[#FF9900] to-[#FF6A00] text-white text-sm font-medium px-5 py-2 rounded-full shadow hover:scale-[1.02] transition">
                Contact Sales
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Accessibility/credibility note */}
      <div className="mt-3 text-xs text-neutral-500">
        Feature definitions available via tooltips. Data verified as of Oct 2025.
      </div>
    </div>
  </div>
</motion.section>

{/* Competitor Comparison (updated) */}
<motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  className="text-center"
>
  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF9900] to-[#FF6A00] bg-clip-text text-transparent">
    Competitor Comparison
  </h2>

  <div className="mt-6 overflow-x-auto">
    <div className="rounded-3xl shadow-lg p-6 bg-gradient-to-br from-orange-50 to-white hover:shadow-xl transition">
      <table className="min-w-full border border-gray-200 text-sm bg-white rounded-xl overflow-hidden">
        {/* darker header contrast */}
        <thead className="bg-[#d97a00]/15 text-neutral-800">
          <tr className="text-center">
            <th className="p-3 text-left w-[260px]">Factor</th>
            <th className="p-3 w-[240px] text-orange-800 font-semibold border-l-4 border-orange-500">
              AMZDUDES
            </th>
            <th className="p-3">GETIDA</th>
            <th className="p-3">Seller Investigators</th>
            <th className="p-3">Refunds Manager</th>
          </tr>
        </thead>

        <tbody>
          {[
            // label tweaks + “Custom” instead of “No Plans”
            ["Subscription Model", "✅ $29.99–$149.99", "Custom", "Custom", "Custom"],
            ["Recovery Fee %", "✅ 10% → 7%", "❌ 25%", "❌ 25%", "❌ 25%"],
            ["Demo Audit", "✅ Included", "✅ Included", "✅ Included", "✅ Included"],
            // clearer labels
            ["Claim Processing Automation", "✅ SP-API (Real-Time)", "⚠️ Semi-Auto", "⚠️ Manual", "⚠️ Manual"],
            ["FBA Fee & Storage Error Detection", "✅ Yes", "❌ No", "❌ No", "❌ No"],
            // keep wording but add definition below in footnote
            ["Transparency", "✅ Clear Pricing", "⚠️ Hidden", "⚠️ Hidden", "⚠️ Hidden"],
            ["All Claim Types", "✅ Full Suite", "⚠️ Limited", "⚠️ Limited", "⚠️ Limited"],
          ].map((row, i) => (
            <tr
              key={row[0]}
              className={`border-t text-neutral-700 ${
                i % 2 ? "bg-orange-50/30" : "bg-white"
              } hover:bg-orange-50/60 transition`}
            >
              {/* first col left-aligned */}
              <td className="px-3 py-4 text-left font-medium leading-relaxed">
                {row[0]}
              </td>

              {/* other cols perfectly centered (icons + text) */}
              {row.slice(1).map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-4 text-center align-middle ${
                    j === 0
                      ? "bg-orange-50 font-semibold text-orange-800 border-2 border-orange-400"
                      : ""
                  }`}
                >
                  {/* lighter warning tint so it doesn’t clash with header */}
                  <span className={cell.startsWith("⚠️") ? "text-[#FFD966]" : ""}>
                    {cell}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend: bigger + separated */}
      <div className="mt-4 pt-4 border-t border-orange-200 flex flex-wrap justify-center gap-6 text-[15px] text-neutral-700">
        <span className="font-medium">✅ = Yes / Available</span>
        <span className="font-medium">⚠️ = Partial / Limited</span>
        <span className="font-medium">❌ = No / Not Available</span>
      </div>

      {/* Credibility note + transparency definition */}
      <div className="mt-2 text-xs text-neutral-500">
        Data verified as of Oct 2025. “Clear Pricing” = published subscription & recovery rates on the website or documentation.
      </div>
    </div>
  </div>
</motion.section>


      {/* 💰 Seller Keeps Extra Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-center"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF9900] to-[#FF6A00] bg-clip-text text-transparent mb-4">
          Seller Keeps Extra 💰
        </h2>
        <p className="text-neutral-600 mb-6">
          See how much more you keep using <strong>AMZDUDES</strong> compared to competitors charging 25%.
        </p>

        <div className="overflow-x-auto max-w-3xl mx-auto">
          <table className="min-w-full border border-gray-200 text-sm bg-white rounded-xl overflow-hidden shadow-lg">
            <thead className="bg-gradient-to-r from-[#FF9900]/20 to-[#FF6A00]/20 text-neutral-800">
              <tr>
                <th className="p-3 text-center">Monthly Recovery</th>
                <th className="p-3 text-center">Competitor (25%)</th>
                <th className="p-3 text-center">AMZDUDES</th>
                <th className="p-3 text-center">Seller Keeps Extra</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["$2,000", "$500 fee", "$229.99 (Starter 10%)", "💰 +$270"],
                ["$5,000", "$1,250 fee", "$494.99 (Growth 9–8%)", "💰 +$755"],
                ["$10,000", "$2,500 fee", "$849.99 (Enterprise 7%)", "💰 +$1,650"],
              ].map((r, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-orange-50 transition text-neutral-700"
                >
                  {r.map((c, j) => (
                    <td key={j} className="p-3 text-center font-medium">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}
