import { useState } from "react";
import type { AxiosError } from "axios";
import { api } from "../lib/api";
import { Mail, MessageCircle, Phone, Clock, HelpCircle, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

const supportChannels = [
  {
    title: "Email Support",
    description: "24/7 email support with 2-hour SLA for critical reimbursement cases.",
    value: "support@amzdudes.io",
    icon: Mail,
    action: "Send email",
    href: "mailto:support@amzdudes.io",
    responseTime: "Response within 2 hours",
  },
  {
    title: "WhatsApp Hotline",
    description: "Direct escalation channel for API outages and case appeals.",
    value: "+1 (512) 543-0419",
    icon: Phone,
    action: "Message now",
    href: "https://wa.me/15125430419",
    responseTime: "Immediate response",
  },
  {
    title: "Live Chat",
    description: "Real-time support during business hours for quick questions.",
    icon: MessageCircle,
    action: "Start chat",
    href: "#",
    responseTime: "Mon–Fri, 8 AM – 10 PM PST",
  },
];

const faqs = [
  {
    question: "How do I connect my Amazon Seller Central account?",
    answer: "Navigate to Settings > Manage Stores, then click 'Connect Store'. You'll be redirected to Amazon to authorize our app. Make sure you have admin access to your Seller Central account.",
  },
  {
    question: "What data does the app collect from Amazon?",
    answer: "We only collect reimbursement-related data through Amazon SP-API: Finances API (settlement reports), Reports API (FBA inventory reports), and Orders API (order details). We never access your personal information or product listings. See our Privacy Policy for details.",
  },
  {
    question: "How long does it take to process reimbursement cases?",
    answer: "Automated cases are processed within 24-48 hours. Complex cases requiring manual review may take 3-5 business days. Priority plan members get expedited processing.",
  },
  {
    question: "What if Amazon rejects my reimbursement case?",
    answer: "If a case is rejected, our team will automatically review it and create an appeal. For priority cases, contact us via WhatsApp or email with your case ID for immediate escalation.",
  },
  {
    question: "Is my Amazon data secure?",
    answer: "Yes. All data is encrypted in transit (TLS 1.2+) and at rest (AES-256). We use AWS infrastructure and comply with Amazon SP-API security requirements. See our Security page for details.",
  },
  {
    question: "Can I disconnect my Amazon account?",
    answer: "Yes, you can disconnect your store at any time from Settings > Manage Stores. All your data will be deleted within 30 days as per our data retention policy.",
  },
];

const quickLinks = [
  {
    title: "Getting Started Guide",
    description: "Step-by-step onboarding instructions",
    icon: BookOpen,
    href: "#",
  },
  {
    title: "API Connection Issues",
    description: "Troubleshoot OAuth and API problems",
    icon: AlertCircle,
    href: "#",
  },
  {
    title: "Case Status Guide",
    description: "Understand your reimbursement case statuses",
    icon: CheckCircle2,
    href: "#",
  },
];

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSending(true);
    try {
      await api.post("/contact", { name, email, message });
      setSent(true);
    } catch (error) {
      const axiosErr = error as AxiosError<{ detail?: string }>;
      setErr(axiosErr.response?.data?.detail || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-8 text-white shadow-[0_25px_60px_rgba(59,130,246,0.4)]">
        <p className="text-xs uppercase tracking-[0.3em] text-white/80">
          We're here to help
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Support Center</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/90">
          Get help with your reimbursement cases, API connections, account setup, or any questions about our service. Our support team is available 24/7.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {supportChannels.map((channel) => {
          const Icon = channel.icon;
          return (
            <article
              key={channel.title}
              className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.07)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-indigo-100 p-2">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {channel.title}
                </p>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {channel.value || channel.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{channel.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{channel.responseTime}</span>
              </div>
              <a
                href={channel.href}
                className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {channel.action}
                <span className="ml-2 text-lg">↗</span>
              </a>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500">Find answers to common questions about our service</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left flex items-start justify-between gap-4"
                >
                  <h3 className="font-semibold text-slate-900 flex-1">{faq.question}</h3>
                  <HelpCircle className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <form
            onSubmit={submit}
            className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Need more help?
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Send us a message
            </h2>
            <p className="mb-6 mt-2 text-sm text-slate-500">
              We respond within 2 hours. Include your Amazon case ID or marketplace if applicable.
            </p>
            {sent ? (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                🎉 Thanks! We'll get back to you shortly.
              </div>
            ) : (
              <>
                {err && (
                  <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">
                    {err}
                  </div>
                )}
                <div className="mt-4 space-y-4">
                  <label className="block text-sm font-medium text-slate-600">
                    Full Name
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    Email Address
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    How can we help?
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your issue, include case IDs or marketplace if applicable..."
                      className="mt-2 h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>
                </div>
                <button
                  disabled={sending}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-500 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {sending ? "Sending..." : "Send message"}
                </button>
              </>
            )}
          </form>

          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">
              Quick Links
            </p>
            <div className="space-y-3">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Icon className="h-4 w-4 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-slate-900">{link.title}</p>
                      <p className="text-xs text-slate-500">{link.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Priority Case Escalation
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Use this process if Amazon revoked API scopes, rejected a reimbursement, or if you need the fraud team looped in.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-semibold">①</span>
                <span>Contact us via WhatsApp or email with your case ID and marketplace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-semibold">②</span>
                <span>Include settlement report and any relevant documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-semibold">③</span>
                <span>Our specialists will create a manual appeal or escalate to Amazon CAT within 30 minutes</span>
              </li>
            </ul>
            <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">Office Hours</p>
              <p>Mon–Fri, 8 AM – 10 PM PST</p>
              <p className="text-xs text-slate-500">Weekend coverage for priority plans</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

