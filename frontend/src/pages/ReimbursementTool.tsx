import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import tutorialShot from "../assets/home1.png";
import { pricingPlans } from "../data/pricingData";

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

export default function ReimbursementTool() {
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

