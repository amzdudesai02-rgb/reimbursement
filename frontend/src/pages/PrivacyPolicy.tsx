import { Link } from 'react-router-dom';
import { Shield, Lock, Database, Eye, Trash2, Mail, FileText, CheckCircle2, ArrowRight, Users, Clock, AlertCircle, Zap } from 'lucide-react';
import logo from '../assets/logo.png';

export default function PrivacyPolicy() {
  const sections = [
    { id: 'introduction', title: 'Introduction', icon: FileText, color: 'blue' },
    { id: 'data-collection', title: 'Amazon Data Collection', icon: Database, color: 'purple' },
    { id: 'data-use', title: 'How We Use Your Data', icon: Eye, color: 'green' },
    { id: 'data-security', title: 'Data Storage and Security', icon: Lock, color: 'red' },
    { id: 'data-access', title: 'Data Access and Control', icon: Shield, color: 'indigo' },
    { id: 'data-retention', title: 'Data Retention', icon: Clock, color: 'orange' },
    { id: 'data-deletion', title: 'Data Deletion', icon: Trash2, color: 'pink' },
    { id: 'third-party', title: 'Third-Party Services', icon: Users, color: 'cyan' },
    { id: 'your-rights', title: 'Your Rights', icon: CheckCircle2, color: 'emerald' },
    { id: 'contact', title: 'Contact Information', icon: Mail, color: 'blue' },
    { id: 'changes', title: 'Changes to This Policy', icon: AlertCircle, color: 'amber' },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Premium Header with Glass Effect */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} alt="AMZDUDES" className="h-10 w-auto transition-all duration-300 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </div>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
              AMZDUDES
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all hover:scale-105">
              Home
            </Link>
            <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all hover:scale-105">
              Pricing
            </Link>
            <Link to="/contact" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all hover:scale-105">
              Contact
            </Link>
            <Link 
              to="/signup" 
              className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Premium Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-slate-200/60 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-slate-200">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">Contents</h3>
              </div>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 rounded-xl px-3 py-3 transition-all group border border-transparent hover:border-slate-200"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClasses[section.color as keyof typeof colorClasses]} flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="flex-1">{section.title}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {/* Premium Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl border-2 border-blue-400/20 shadow-2xl p-10 lg:p-14 mb-12 overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
              <div className="relative z-10">
                <div className="flex items-start gap-5 mb-6">
                  <div className="p-5 bg-white/20 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-xl">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                      Privacy Policy
                    </h1>
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                      <Clock className="w-4 h-4 text-white/90" />
                      <p className="text-sm font-semibold text-white/90">
                        Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/20 shadow-xl">
                  <p className="text-xl text-white/95 leading-relaxed font-medium">
                    At <strong className="text-white">AMZDUDES</strong>, we are committed to protecting your privacy and ensuring the security of your Amazon Seller Central data. 
                    This Privacy Policy explains how we collect, use, store, and protect information when you use our Reimbursement Dashboard service.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
              {/* Section 1: Introduction */}
              <section id="introduction" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-blue-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-xl">1</span>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Introduction</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">
                    <strong className="text-slate-900 font-bold">AMZDUDES</strong> ("we," "our," or "us") operates the Reimbursement Dashboard application 
                    (the "Service"). This Privacy Policy explains how we collect, use, store, and protect 
                    information when you use our Service to connect your Amazon Seller Central account.
                  </p>
                </div>
              </section>

              {/* Section 2: Data Collection */}
              <section id="data-collection" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-purple-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Database className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Amazon Data Collection</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">
                    When you connect your Amazon Seller Central account to our Service, we collect and 
                    process the following types of Amazon data through the Selling Partner API (SP-API):
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-10">
                    {[
                      { title: 'Financial Data', desc: 'Reimbursement transactions, financial events, payment information, and related financial records', gradient: 'from-blue-500 to-blue-600', icon: '💰' },
                      { title: 'Orders Data', desc: 'Order information, order IDs, and order-related details', gradient: 'from-green-500 to-green-600', icon: '📦' },
                      { title: 'FBA Reports', desc: 'FBA inventory adjustment reports, shipment details, fee preview reports, and inventory data', gradient: 'from-purple-500 to-purple-600', icon: '📊' },
                      { title: 'Inventory Data', desc: 'SKU information, ASINs, product details, and inventory adjustments', gradient: 'from-orange-500 to-orange-600', icon: '📋' },
                    ].map((item, idx) => (
                      <div key={idx} className="group/item relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-400 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.gradient} opacity-5 rounded-bl-3xl`}></div>
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h3 className="font-black text-xl text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 3: Data Use */}
              <section id="data-use" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-green-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Eye className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">How We Use Your Data</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">We use the collected Amazon data solely for the following purposes:</p>
                  <div className="space-y-5 mt-8">
                    {[
                      { title: 'Analysis & Reporting', desc: 'To analyze reimbursement transactions and identify missing reimbursements', icon: Zap },
                      { title: 'Dashboard Display', desc: 'To display your reimbursement data, financial events, and inventory adjustments in the Service dashboard', icon: Eye },
                      { title: 'Case Filing', desc: 'To assist in filing reimbursement cases with Amazon on your behalf (if you authorize such actions)', icon: FileText },
                      { title: 'Service Improvement', desc: 'To improve the functionality and accuracy of our Service', icon: ArrowRight },
                      { title: 'Customer Support', desc: 'To provide customer support and respond to your inquiries', icon: Users },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex items-start gap-5 p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl border-2 border-slate-200 hover:border-green-400 transition-all shadow-md hover:shadow-xl">
                          <div className="mt-1 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-lg text-slate-900 mb-2">{item.title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-10 p-8 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-2xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500 rounded-xl shadow-lg">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-slate-900 mb-3">What We Don't Do</h4>
                        <p className="text-slate-800 leading-relaxed font-semibold text-base">
                          <strong>We do NOT:</strong> Sell, rent, or share your Amazon data with third parties for marketing purposes. 
                          We do not use your data for any purpose other than providing the Service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Data Security */}
              <section id="data-security" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-red-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Lock className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Data Storage and Security</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none space-y-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-5 flex items-center gap-3">
                      <Database className="w-6 h-6 text-blue-600" />
                      Storage Location
                    </h3>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                      Your data is stored in secure databases hosted on cloud infrastructure. We use industry-standard 
                      hosting providers with robust security measures.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6">Encryption Standards</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        { title: 'Encryption at Rest', desc: 'AES-256 encryption', gradient: 'from-blue-500 to-blue-600', icon: '🔒' },
                        { title: 'Encryption in Transit', desc: 'TLS 1.2+ protocols', gradient: 'from-green-500 to-green-600', icon: '🔐' },
                        { title: 'Token Security', desc: 'Encrypted OAuth tokens', gradient: 'from-purple-500 to-purple-600', icon: '🛡️' },
                      ].map((item, idx) => (
                        <div key={idx} className={`relative bg-gradient-to-br ${item.gradient} rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-transform`}>
                          <div className="text-5xl mb-4">{item.icon}</div>
                          <div className="font-black text-lg mb-2">{item.title}</div>
                          <div className="text-sm text-white/90 font-semibold">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6">Security Measures</h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      {[
                        'Regular security audits and vulnerability assessments',
                        'Access controls and authentication mechanisms',
                        'Secure API communication with Amazon\'s SP-API',
                        'Regular backups and disaster recovery procedures',
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border-2 border-slate-200 shadow-md">
                          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 font-semibold">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: Data Access */}
              <section id="data-access" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-indigo-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Data Access and Control</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none space-y-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-5">Who Can Access Your Data</h3>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                      Only authenticated sellers who own the data can access their own Amazon data through the Service. 
                      We implement role-based access control (RBAC) and authentication mechanisms to ensure data security.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6">Access Control Methods</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { title: 'JWT Authentication', desc: 'Secure token-based user sessions', gradient: 'from-blue-500 to-blue-600' },
                        { title: 'Role-Based Access', desc: 'Restricted access to authorized users only', gradient: 'from-purple-500 to-purple-600' },
                        { title: 'User Authentication', desc: 'Required for all data access', gradient: 'from-green-500 to-green-600' },
                        { title: 'Data Isolation', desc: 'Separation between seller accounts', gradient: 'from-orange-500 to-orange-600' },
                      ].map((item, idx) => (
                        <div key={idx} className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform`}>
                          <h4 className="font-black text-lg mb-2">{item.title}</h4>
                          <p className="text-sm text-white/90 font-semibold">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6: Data Retention */}
              <section id="data-retention" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-orange-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Data Retention</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">We retain your Amazon data for the following periods:</p>
                  <div className="space-y-5 mt-8">
                    {[
                      { num: '1', title: 'Active Accounts', desc: 'Data is retained as long as your account is active and you continue to use the Service', gradient: 'from-blue-500 to-blue-600' },
                      { num: '2', title: 'Compliance', desc: 'Financial and transactional data may be retained for up to 7 years to comply with legal and regulatory requirements', gradient: 'from-purple-500 to-purple-600' },
                      { num: '3', title: 'Account Deletion', desc: 'Upon account deletion or closure, data will be deleted within 30 days, except where legal retention requirements apply', gradient: 'from-green-500 to-green-600' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-6 p-8 bg-gradient-to-r from-slate-50 to-white rounded-2xl border-2 border-slate-200 hover:border-orange-400 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                        <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                          <span className="text-white font-black text-2xl">{item.num}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-xl text-slate-900 mb-3">{item.title}</h4>
                          <p className="text-base text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 7: Data Deletion */}
              <section id="data-deletion" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-pink-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Trash2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Data Deletion</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">You can request deletion of your data at any time by:</p>
                  <div className="space-y-4 mt-6">
                    {[
                      'Deleting your account through the Service settings',
                      'Disconnecting your Amazon Seller Central account from the Service',
                      'Contacting us directly at the support email provided below',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-5 p-6 bg-gradient-to-r from-pink-50 to-white rounded-xl border-2 border-pink-200 shadow-md">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-black text-lg">{idx + 1}</span>
                        </div>
                        <span className="text-slate-700 font-bold text-base">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 p-8 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border-2 border-slate-300 shadow-xl">
                    <p className="leading-relaxed text-base text-slate-800 font-semibold">
                      Upon request, we will delete your data within <strong className="text-slate-900 font-black">30 days</strong>, except where we are required to retain 
                      certain data for legal, regulatory, or legitimate business purposes. Automated deletion processes 
                      are in place to remove data after the retention period expires.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 8: Third-Party */}
              <section id="third-party" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-cyan-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Third-Party Services</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">
                    Our Service integrates with Amazon's Selling Partner API (SP-API) to access your Seller Central data. 
                    Your use of our Service is also subject to Amazon's Privacy Notice and Terms of Service. 
                    We are not responsible for Amazon's data practices.
                  </p>
                </div>
              </section>

              {/* Section 9: Your Rights */}
              <section id="your-rights" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-emerald-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Rights</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">You have the right to:</p>
                  <div className="grid md:grid-cols-2 gap-5 mt-8">
                    {[
                      'Access your personal data',
                      'Correct inaccurate data',
                      'Request deletion of your data',
                      'Disconnect your Amazon account at any time',
                      'Export your data',
                    ].map((right, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-6 bg-gradient-to-br from-emerald-50 to-white rounded-xl border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-md hover:shadow-xl transform hover:scale-105">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
                        <span className="text-slate-700 font-bold text-base">{right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 10: Contact - Premium Design */}
              <section id="contact" className="relative group bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl border-2 border-blue-400/30 shadow-2xl p-10 lg:p-14 scroll-mt-40 overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-xl">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">Contact Information</h2>
                  </div>
                  <div className="prose prose-lg prose-slate max-w-none">
                    <p className="text-xl text-white/95 leading-relaxed font-semibold mb-10">
                      If you have questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border-2 border-white/20 shadow-2xl">
                      <div className="space-y-8">
                        <div className="flex items-start gap-6">
                          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                            <Shield className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white/80 uppercase tracking-wider mb-2">Company Name</div>
                            <div className="text-3xl font-black text-white">AMZDUDES</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-6">
                          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                            <Mail className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white/80 uppercase tracking-wider mb-2">Support Email</div>
                            <a href="mailto:support@amzdudes.io" className="text-2xl font-black text-white hover:text-blue-200 transition-colors inline-flex items-center gap-3 group">
                              support@amzdudes.io
                              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-6">
                          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white/80 uppercase tracking-wider mb-2">Website</div>
                            <a href="https://reimbursement.amzdudes.io" className="text-2xl font-black text-white hover:text-blue-200 transition-colors inline-flex items-center gap-3 group">
                              https://reimbursement.amzdudes.io
                              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 11: Changes */}
              <section id="changes" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-amber-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <AlertCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Changes to This Privacy Policy</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes 
                    by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
                    You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="relative border-t-2 border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white mt-24">
        <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="AMZDUDES" className="h-10"/>
                <span className="text-2xl font-black text-slate-900">AMZDUDES</span>
              </div>
              <p className="text-base text-slate-600 leading-relaxed font-medium max-w-md">
                Automated Amazon reimbursement recovery platform helping sellers recover money they're owed. 
                Secure, compliant, and trusted by thousands of sellers.
              </p>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-6 text-lg uppercase tracking-wide">Legal</h4>
              <div className="space-y-3">
                <Link to="/privacy-policy" className="block text-base text-slate-600 hover:text-slate-900 font-semibold transition-colors hover:translate-x-1 transform">
                  Privacy Policy
                </Link>
                <Link to="/contact" className="block text-base text-slate-600 hover:text-slate-900 font-semibold transition-colors hover:translate-x-1 transform">
                  Contact Us
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-6 text-lg uppercase tracking-wide">Company</h4>
              <div className="space-y-3">
                <Link to="/pricing" className="block text-base text-slate-600 hover:text-slate-900 font-semibold transition-colors hover:translate-x-1 transform">
                  Pricing
                </Link>
                <a href="mailto:support@amzdudes.io" className="block text-base text-slate-600 hover:text-slate-900 font-semibold transition-colors hover:translate-x-1 transform">
                  support@amzdudes.io
                </a>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t-2 border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-base text-slate-600 font-semibold">
              © {new Date().getFullYear()} <strong className="text-slate-900 font-black">AMZDUDES</strong>. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-green-700">Secure</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-700">Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full border border-purple-200">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-700">Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
