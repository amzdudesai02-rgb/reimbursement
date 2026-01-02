import { Link } from 'react-router-dom';
import { Shield, Lock, Database, Eye, Trash2, Mail, FileText } from 'lucide-react';
import logo from '../assets/logo.png';

export default function PrivacyPolicy() {
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'data-collection', title: 'Amazon Data Collection' },
    { id: 'data-use', title: 'How We Use Your Data' },
    { id: 'data-security', title: 'Data Storage and Security' },
    { id: 'data-access', title: 'Data Access and Control' },
    { id: 'data-retention', title: 'Data Retention' },
    { id: 'data-deletion', title: 'Data Deletion' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'contact', title: 'Contact Information' },
    { id: 'changes', title: 'Changes to This Privacy Policy' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="AMZDUDES" className="h-8"/>
            <span className="text-xl font-semibold text-slate-900">AMZDUDES</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
            <Link to="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link to="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-slate-600 hover:text-slate-900 hover:font-medium transition-colors py-1"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Hero Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
                  <p className="text-sm text-slate-500 mt-1">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                At AMZDUDES, we are committed to protecting your privacy and ensuring the security of your Amazon Seller Central data. 
                This Privacy Policy explains how we collect, use, store, and protect information when you use our Reimbursement Dashboard service.
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              <section id="introduction" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">1.</span> Introduction
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700">
                  <p className="leading-relaxed">
                    AMZDUDES ("we," "our," or "us") operates the Reimbursement Dashboard application 
                    (the "Service"). This Privacy Policy explains how we collect, use, store, and protect 
                    information when you use our Service to connect your Amazon Seller Central account.
                  </p>
                </div>
              </section>

              <section id="data-collection" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">2.</span> Amazon Data Collection
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700">
                  <p className="mb-4 leading-relaxed">
                    When you connect your Amazon Seller Central account to our Service, we collect and 
                    process the following types of Amazon data through the Selling Partner API (SP-API):
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-2">Financial Data</h3>
                      <p className="text-sm text-slate-600">Reimbursement transactions, financial events, payment information, and related financial records</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-2">Orders Data</h3>
                      <p className="text-sm text-slate-600">Order information, order IDs, and order-related details</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-2">FBA Reports</h3>
                      <p className="text-sm text-slate-600">FBA inventory adjustment reports, shipment details, fee preview reports, and inventory data</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-2">Inventory Data</h3>
                      <p className="text-sm text-slate-600">SKU information, ASINs, product details, and inventory adjustments</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="data-use" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">3.</span> How We Use Your Data
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700">
                  <p className="mb-4 leading-relaxed">We use the collected Amazon data solely for the following purposes:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <div>
                        <strong className="text-slate-900">Analysis & Reporting:</strong> To analyze reimbursement transactions and identify missing reimbursements
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <div>
                        <strong className="text-slate-900">Dashboard Display:</strong> To display your reimbursement data, financial events, and inventory adjustments in the Service dashboard
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <div>
                        <strong className="text-slate-900">Case Filing:</strong> To assist in filing reimbursement cases with Amazon on your behalf (if you authorize such actions)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <div>
                        <strong className="text-slate-900">Service Improvement:</strong> To improve the functionality and accuracy of our Service
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <div>
                        <strong className="text-slate-900">Customer Support:</strong> To provide customer support and respond to your inquiries
                      </div>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-slate-900">
                      <strong>We do NOT:</strong> Sell, rent, or share your Amazon data with third parties for marketing purposes. 
                      We do not use your data for any purpose other than providing the Service.
                    </p>
                  </div>
                </div>
              </section>

              <section id="data-security" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-blue-600" />
                  <span className="text-blue-600">4.</span> Data Storage and Security
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Database className="w-5 h-5 text-slate-600" />
                      Storage Location
                    </h3>
                    <p className="leading-relaxed">
                      Your data is stored in secure databases hosted on cloud infrastructure. We use industry-standard 
                      hosting providers with robust security measures.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Encryption</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="font-semibold text-slate-900 mb-1">Encryption at Rest</div>
                        <div className="text-sm text-slate-600">AES-256 encryption</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="font-semibold text-slate-900 mb-1">Encryption in Transit</div>
                        <div className="text-sm text-slate-600">TLS 1.2+ protocols</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="font-semibold text-slate-900 mb-1">Token Security</div>
                        <div className="text-sm text-slate-600">Encrypted OAuth tokens</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Security Measures</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></div>
                        <span>Regular security audits and vulnerability assessments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></div>
                        <span>Access controls and authentication mechanisms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></div>
                        <span>Secure API communication with Amazon's SP-API</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></div>
                        <span>Regular backups and disaster recovery procedures</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="data-access" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-600" />
                  <span className="text-blue-600">5.</span> Data Access and Control
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Who Can Access Your Data</h3>
                    <p className="leading-relaxed">
                      Only authenticated sellers who own the data can access their own Amazon data through the Service. 
                      We implement role-based access control (RBAC) and authentication mechanisms to ensure data security.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Access Control Methods</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="font-semibold text-slate-900 mb-1">JWT Authentication</div>
                        <div className="text-sm text-slate-600">Secure token-based user sessions</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="font-semibold text-slate-900 mb-1">Role-Based Access</div>
                        <div className="text-sm text-slate-600">Restricted access to authorized users only</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="font-semibold text-slate-900 mb-1">User Authentication</div>
                        <div className="text-sm text-slate-600">Required for all data access</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="font-semibold text-slate-900 mb-1">Data Isolation</div>
                        <div className="text-sm text-slate-600">Separation between seller accounts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="data-retention" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">6.</span> Data Retention
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700">
                  <p className="mb-4 leading-relaxed">We retain your Amazon data for the following periods:</p>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Active Accounts</h4>
                        <p className="text-sm text-slate-600">Data is retained as long as your account is active and you continue to use the Service</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Compliance</h4>
                        <p className="text-sm text-slate-600">Financial and transactional data may be retained for up to 7 years to comply with legal and regulatory requirements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Account Deletion</h4>
                        <p className="text-sm text-slate-600">Upon account deletion or closure, data will be deleted within 30 days, except where legal retention requirements apply</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="data-deletion" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Trash2 className="w-6 h-6 text-blue-600" />
                  <span className="text-blue-600">7.</span> Data Deletion
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700">
                  <p className="mb-4 leading-relaxed">You can request deletion of your data at any time by:</p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span>Deleting your account through the Service settings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span>Disconnecting your Amazon Seller Central account from the Service</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      <span>Contacting us directly at the support email provided below</span>
                    </li>
                  </ul>
                  <p className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 leading-relaxed">
                    Upon request, we will delete your data within 30 days, except where we are required to retain 
                    certain data for legal, regulatory, or legitimate business purposes. Automated deletion processes 
                    are in place to remove data after the retention period expires.
                  </p>
                </div>
              </section>

              <section id="third-party" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">8.</span> Third-Party Services
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700">
                  <p className="leading-relaxed">
                    Our Service integrates with Amazon's Selling Partner API (SP-API) to access your Seller Central data. 
                    Your use of our Service is also subject to Amazon's Privacy Notice and Terms of Service. 
                    We are not responsible for Amazon's data practices.
                  </p>
                </div>
              </section>

              <section id="your-rights" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">9.</span> Your Rights
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700">
                  <p className="mb-4 leading-relaxed">You have the right to:</p>
                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    {['Access your personal data', 'Correct inaccurate data', 'Request deletion of your data', 'Disconnect your Amazon account at any time', 'Export your data'].map((right, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-slate-700">{right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="contact" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <span className="text-blue-600">10.</span> Contact Information
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700">
                  <p className="mb-6 leading-relaxed">
                    If you have questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Company Name</div>
                          <div className="font-semibold text-slate-900">AMZDUDES</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Support Email</div>
                          <a href="mailto:support@amzdudes.io" className="font-semibold text-blue-600 hover:text-blue-700">
                            support@amzdudes.io
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Website</div>
                          <a href="https://reimbursement.amzdudes.io" className="font-semibold text-blue-600 hover:text-blue-700">
                            https://reimbursement.amzdudes.io
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="changes" className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">11.</span> Changes to This Privacy Policy
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700">
                  <p className="leading-relaxed">
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

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-600">
              © {new Date().getFullYear()} AMZDUDES. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy-policy" className="text-slate-600 hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
