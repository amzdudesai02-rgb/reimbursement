import { Link } from 'react-router-dom';
import { Shield, Lock, Database, Eye, Trash2, Mail, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

export default function PrivacyPolicy() {
  const sections = [
    { id: 'introduction', title: 'Introduction', icon: FileText },
    { id: 'data-collection', title: 'Amazon Data Collection', icon: Database },
    { id: 'data-use', title: 'How We Use Your Data', icon: Eye },
    { id: 'data-security', title: 'Data Storage and Security', icon: Lock },
    { id: 'data-access', title: 'Data Access and Control', icon: Shield },
    { id: 'data-retention', title: 'Data Retention', icon: FileText },
    { id: 'data-deletion', title: 'Data Deletion', icon: Trash2 },
    { id: 'third-party', title: 'Third-Party Services', icon: Shield },
    { id: 'your-rights', title: 'Your Rights', icon: CheckCircle2 },
    { id: 'contact', title: 'Contact Information', icon: Mail },
    { id: 'changes', title: 'Changes to This Policy', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="AMZDUDES" className="h-9 w-auto transition-transform group-hover:scale-105"/>
            <span className="text-xl font-bold text-slate-900">AMZDUDES</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </Link>
            <Link 
              to="/signup" 
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Enhanced Sidebar - Table of Contents */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Table of Contents</h3>
              </div>
              <nav className="space-y-1">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg px-3 py-2 transition-all group"
                    >
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      <span className="font-medium">{section.title}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50 rounded-2xl border border-slate-200/60 shadow-xl p-8 lg:p-12 mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-blue-600 rounded-2xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-5xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
                  <p className="text-base text-slate-600 flex items-center gap-2">
                    <span>Last Updated:</span>
                    <span className="font-semibold text-slate-900">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60">
                <p className="text-lg text-slate-700 leading-relaxed">
                  At <strong className="text-slate-900">AMZDUDES</strong>, we are committed to protecting your privacy and ensuring the security of your Amazon Seller Central data. 
                  This Privacy Policy explains how we collect, use, store, and protect information when you use our Reimbursement Dashboard service.
                </p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-10">
              {/* Section 1: Introduction */}
              <section id="introduction" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">1</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Introduction</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700">
                  <p className="leading-relaxed text-base">
                    <strong className="text-slate-900">AMZDUDES</strong> ("we," "our," or "us") operates the Reimbursement Dashboard application 
                    (the "Service"). This Privacy Policy explains how we collect, use, store, and protect 
                    information when you use our Service to connect your Amazon Seller Central account.
                  </p>
                </div>
              </section>

              {/* Section 2: Data Collection */}
              <section id="data-collection" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Amazon Data Collection</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700">
                  <p className="mb-6 leading-relaxed text-base">
                    When you connect your Amazon Seller Central account to our Service, we collect and 
                    process the following types of Amazon data through the Selling Partner API (SP-API):
                  </p>
                  <div className="grid md:grid-cols-2 gap-5 mt-8">
                    {[
                      { title: 'Financial Data', desc: 'Reimbursement transactions, financial events, payment information, and related financial records', color: 'blue' },
                      { title: 'Orders Data', desc: 'Order information, order IDs, and order-related details', color: 'green' },
                      { title: 'FBA Reports', desc: 'FBA inventory adjustment reports, shipment details, fee preview reports, and inventory data', color: 'purple' },
                      { title: 'Inventory Data', desc: 'SKU information, ASINs, product details, and inventory adjustments', color: 'orange' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border-2 border-slate-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 3: Data Use */}
              <section id="data-use" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">How We Use Your Data</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700">
                  <p className="mb-6 leading-relaxed text-base">We use the collected Amazon data solely for the following purposes:</p>
                  <div className="space-y-4 mt-6">
                    {[
                      { title: 'Analysis & Reporting', desc: 'To analyze reimbursement transactions and identify missing reimbursements' },
                      { title: 'Dashboard Display', desc: 'To display your reimbursement data, financial events, and inventory adjustments in the Service dashboard' },
                      { title: 'Case Filing', desc: 'To assist in filing reimbursement cases with Amazon on your behalf (if you authorize such actions)' },
                      { title: 'Service Improvement', desc: 'To improve the functionality and accuracy of our Service' },
                      { title: 'Customer Support', desc: 'To provide customer support and respond to your inquiries' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all">
                        <div className="mt-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">What We Don't Do</h4>
                        <p className="text-slate-700 leading-relaxed">
                          <strong>We do NOT:</strong> Sell, rent, or share your Amazon data with third parties for marketing purposes. 
                          We do not use your data for any purpose other than providing the Service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Data Security */}
              <section id="data-security" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Data Storage and Security</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      Storage Location
                    </h3>
                    <p className="leading-relaxed text-base">
                      Your data is stored in secure databases hosted on cloud infrastructure. We use industry-standard 
                      hosting providers with robust security measures.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-5">Encryption Standards</h3>
                    <div className="grid md:grid-cols-3 gap-5">
                      {[
                        { title: 'Encryption at Rest', desc: 'AES-256 encryption', icon: '🔒' },
                        { title: 'Encryption in Transit', desc: 'TLS 1.2+ protocols', icon: '🔐' },
                        { title: 'Token Security', desc: 'Encrypted OAuth tokens', icon: '🛡️' },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200 text-center">
                          <div className="text-3xl mb-3">{item.icon}</div>
                          <div className="font-bold text-slate-900 mb-2">{item.title}</div>
                          <div className="text-sm text-slate-600">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Security Measures</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        'Regular security audits and vulnerability assessments',
                        'Access controls and authentication mechanisms',
                        'Secure API communication with Amazon\'s SP-API',
                        'Regular backups and disaster recovery procedures',
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: Data Access */}
              <section id="data-access" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Data Access and Control</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Who Can Access Your Data</h3>
                    <p className="leading-relaxed text-base">
                      Only authenticated sellers who own the data can access their own Amazon data through the Service. 
                      We implement role-based access control (RBAC) and authentication mechanisms to ensure data security.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-5">Access Control Methods</h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      {[
                        { title: 'JWT Authentication', desc: 'Secure token-based user sessions' },
                        { title: 'Role-Based Access', desc: 'Restricted access to authorized users only' },
                        { title: 'User Authentication', desc: 'Required for all data access' },
                        { title: 'Data Isolation', desc: 'Separation between seller accounts' },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border-2 border-slate-200 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-600">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6: Data Retention */}
              <section id="data-retention" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Data Retention</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700">
                  <p className="mb-6 leading-relaxed text-base">We retain your Amazon data for the following periods:</p>
                  <div className="space-y-4 mt-6">
                    {[
                      { num: '1', title: 'Active Accounts', desc: 'Data is retained as long as your account is active and you continue to use the Service' },
                      { num: '2', title: 'Compliance', desc: 'Financial and transactional data may be retained for up to 7 years to comply with legal and regulatory requirements' },
                      { num: '3', title: 'Account Deletion', desc: 'Upon account deletion or closure, data will be deleted within 30 days, except where legal retention requirements apply' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-5 p-6 bg-gradient-to-r from-slate-50 to-white rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-xl">{item.num}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 7: Data Deletion */}
              <section id="data-deletion" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Data Deletion</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700">
                  <p className="mb-6 leading-relaxed text-base">You can request deletion of your data at any time by:</p>
                  <div className="space-y-4 mt-4">
                    {[
                      'Deleting your account through the Service settings',
                      'Disconnecting your Amazon Seller Central account from the Service',
                      'Contacting us directly at the support email provided below',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{idx + 1}</span>
                        </div>
                        <span className="text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
                    <p className="leading-relaxed text-base text-slate-700">
                      Upon request, we will delete your data within <strong className="text-slate-900">30 days</strong>, except where we are required to retain 
                      certain data for legal, regulatory, or legitimate business purposes. Automated deletion processes 
                      are in place to remove data after the retention period expires.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 8: Third-Party */}
              <section id="third-party" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Third-Party Services</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700">
                  <p className="leading-relaxed text-base">
                    Our Service integrates with Amazon's Selling Partner API (SP-API) to access your Seller Central data. 
                    Your use of our Service is also subject to Amazon's Privacy Notice and Terms of Service. 
                    We are not responsible for Amazon's data practices.
                  </p>
                </div>
              </section>

              {/* Section 9: Your Rights */}
              <section id="your-rights" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Your Rights</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700">
                  <p className="mb-6 leading-relaxed text-base">You have the right to:</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {[
                      'Access your personal data',
                      'Correct inaccurate data',
                      'Request deletion of your data',
                      'Disconnect your Amazon account at any time',
                      'Export your data',
                    ].map((right, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-100 hover:border-blue-300 transition-all">
                        <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">{right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 10: Contact */}
              <section id="contact" className="bg-gradient-to-br from-blue-50 via-white to-slate-50 rounded-2xl border-2 border-blue-200 shadow-xl p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Contact Information</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700">
                  <p className="mb-8 leading-relaxed text-base">
                    If you have questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
                    <div className="space-y-6">
                      <div className="flex items-start gap-5">
                        <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Company Name</div>
                          <div className="text-2xl font-bold text-slate-900">AMZDUDES</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-5">
                        <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Support Email</div>
                          <a href="mailto:support@amzdudes.io" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2">
                            support@amzdudes.io
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-5">
                        <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Website</div>
                          <a href="https://reimbursement.amzdudes.io" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2">
                            https://reimbursement.amzdudes.io
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 11: Changes */}
              <section id="changes" className="bg-white rounded-2xl border border-slate-200/60 shadow-lg p-8 lg:p-10 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Changes to This Privacy Policy</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none text-slate-700">
                  <p className="leading-relaxed text-base">
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

      {/* Professional Footer */}
      <footer className="border-t-2 border-slate-200 bg-gradient-to-b from-white to-slate-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="AMZDUDES" className="h-8"/>
                <span className="text-lg font-bold text-slate-900">AMZDUDES</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automated Amazon reimbursement recovery platform for sellers.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy-policy" className="block text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/contact" className="block text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <div className="space-y-2">
                <Link to="/pricing" className="block text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Pricing
                </Link>
                <a href="mailto:support@amzdudes.io" className="block text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  support@amzdudes.io
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-600">
              © {new Date().getFullYear()} <strong className="text-slate-900">AMZDUDES</strong>. All rights reserved.
            </div>
            <div className="text-sm text-slate-500">
              Secure • Compliant • Trusted
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
