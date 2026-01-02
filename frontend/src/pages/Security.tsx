import { Shield, Lock, Database, Eye, CheckCircle2, FileText, Server, Key, AlertTriangle, Users, Globe, Clock } from 'lucide-react';

export default function Security() {
  const sections = [
    { id: 'overview', title: 'Security Overview', icon: Shield, color: 'blue' },
    { id: 'data-protection', title: 'Data Protection', icon: Lock, color: 'green' },
    { id: 'encryption', title: 'Encryption', icon: Key, color: 'purple' },
    { id: 'infrastructure', title: 'Infrastructure', icon: Server, color: 'indigo' },
    { id: 'access-control', title: 'Access Control', icon: Users, color: 'orange' },
    { id: 'compliance', title: 'Compliance & Certifications', icon: CheckCircle2, color: 'emerald' },
    { id: 'monitoring', title: 'Monitoring & Incident Response', icon: Eye, color: 'red' },
    { id: 'best-practices', title: 'Security Best Practices', icon: AlertTriangle, color: 'amber' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-slate-200/60 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-slate-200">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Shield className="w-5 h-5 text-white" />
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
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl border-2 border-blue-400/20 shadow-2xl p-10 lg:p-14 mb-12 overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
              <div className="relative z-10">
                <div className="flex items-start gap-5 mb-6">
                  <div className="p-5 bg-white/20 backdrop-blur-lg rounded-2xl border-2 border-white/30 shadow-xl">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                      Security
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed font-medium">
                      Your data security is our top priority. Learn how we protect your Amazon Seller Central data with enterprise-grade security measures.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
              {/* Section 1: Overview */}
              <section id="overview" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-blue-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Security Overview</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
                    At <strong className="text-slate-900 font-bold">AMZDUDES</strong>, we take security seriously. Our platform is built with security-first principles, 
                    ensuring that your Amazon Seller Central data is protected with industry-leading security measures.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {[
                      { title: 'Bank-Level Encryption', desc: 'AES-256 encryption for all data at rest and in transit', icon: '🔐' },
                      { title: 'Secure Infrastructure', desc: 'AWS-backed infrastructure with redundant security layers', icon: '🛡️' },
                      { title: 'Regular Audits', desc: 'Continuous security monitoring and vulnerability assessments', icon: '✅' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h3 className="font-black text-xl text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 2: Data Protection */}
              <section id="data-protection" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-green-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Lock className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Data Protection</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">
                    We implement multiple layers of data protection to ensure your information remains secure:
                  </p>
                  <div className="space-y-5 mt-8">
                    {[
                      { title: 'Data Isolation', desc: 'Your data is completely isolated from other users. Each seller\'s data is stored in separate, encrypted databases with strict access controls.', icon: Database },
                      { title: 'Secure Storage', desc: 'All data is stored on secure cloud infrastructure with redundant backups and disaster recovery procedures in place.', icon: Server },
                      { title: 'Access Logging', desc: 'All data access is logged and monitored. We maintain comprehensive audit trails for compliance and security monitoring.', icon: FileText },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex items-start gap-5 p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl border-2 border-slate-200 hover:border-green-400 transition-all shadow-md hover:shadow-xl">
                          <div className="mt-1 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-lg text-slate-900 mb-2">{item.title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Section 3: Encryption */}
              <section id="encryption" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-purple-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Key className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Encryption</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-5">Encryption at Rest</h3>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
                      All data stored in our databases is encrypted using <strong className="text-slate-900">AES-256 encryption</strong>, 
                      the same encryption standard used by banks and government agencies. This ensures that even if unauthorized 
                      access to our storage systems occurs, your data remains protected.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-5">Encryption in Transit</h3>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
                      All data transmitted between your browser, our servers, and Amazon's SP-API is encrypted using 
                      <strong className="text-slate-900"> TLS 1.2 or higher</strong>. This ensures that data cannot be intercepted 
                      or read during transmission.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        { title: 'TLS 1.3', desc: 'Latest TLS protocol for maximum security', gradient: 'from-blue-500 to-blue-600' },
                        { title: 'Perfect Forward Secrecy', desc: 'Unique keys for each session', gradient: 'from-green-500 to-green-600' },
                        { title: 'Certificate Pinning', desc: 'Prevents man-in-the-middle attacks', gradient: 'from-purple-500 to-purple-600' },
                      ].map((item, idx) => (
                        <div key={idx} className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform`}>
                          <div className="font-black text-lg mb-2">{item.title}</div>
                          <div className="text-sm text-white/90 font-semibold">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-5">Token Encryption</h3>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                      OAuth tokens and access credentials are encrypted before storage using industry-standard encryption algorithms. 
                      These tokens are never stored in plain text and are only decrypted when needed for API calls.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4: Infrastructure */}
              <section id="infrastructure" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-indigo-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Server className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Infrastructure Security</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">
                    Our platform runs on enterprise-grade infrastructure with multiple security layers:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                      { title: 'Cloud Infrastructure', desc: 'Hosted on AWS (Amazon Web Services) with redundant data centers and automatic failover capabilities', icon: '☁️' },
                      { title: 'Network Security', desc: 'Firewalls, DDoS protection, and intrusion detection systems protect our network infrastructure', icon: '🛡️' },
                      { title: 'Backup & Recovery', desc: 'Automated daily backups with point-in-time recovery capabilities. Data is backed up to multiple geographic locations', icon: '💾' },
                      { title: 'Physical Security', desc: 'Data centers are protected with 24/7 security, biometric access controls, and environmental monitoring', icon: '🏢' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200 hover:border-indigo-400 transition-all shadow-lg hover:shadow-xl">
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h4 className="font-black text-lg text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 5: Access Control */}
              <section id="access-control" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-orange-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Access Control</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">
                    We implement strict access controls to ensure only authorized users can access your data:
                  </p>
                  <div className="space-y-5 mt-8">
                    {[
                      { title: 'Multi-Factor Authentication (MFA)', desc: 'Optional MFA adds an extra layer of security to your account. We recommend enabling MFA for enhanced protection.', icon: '🔐' },
                      { title: 'Role-Based Access Control', desc: 'Access permissions are based on user roles. Only authenticated users can access their own data.', icon: '👥' },
                      { title: 'Session Management', desc: 'Secure session tokens with automatic expiration. Sessions are invalidated after periods of inactivity.', icon: '⏱️' },
                      { title: 'API Authentication', desc: 'All API requests are authenticated using JWT tokens. Tokens are signed and verified to prevent tampering.', icon: '🔑' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-5 p-6 bg-gradient-to-r from-orange-50 to-white rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-all shadow-md hover:shadow-xl">
                        <div className="text-3xl">{item.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-black text-lg text-slate-900 mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 6: Compliance */}
              <section id="compliance" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-emerald-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Compliance & Certifications</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">
                    We adhere to industry standards and best practices for data security:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                      { title: 'GDPR Compliant', desc: 'We comply with GDPR requirements for data protection and user privacy', icon: '🇪🇺' },
                      { title: 'Amazon SP-API Compliant', desc: 'Our integration follows Amazon\'s SP-API security requirements and best practices', icon: '📦' },
                      { title: 'SOC 2 Ready', desc: 'Our infrastructure and processes are designed to meet SOC 2 Type II requirements', icon: '✅' },
                      { title: 'Data Residency', desc: 'We respect data residency requirements and can configure data storage based on your needs', icon: '🌍' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-lg hover:shadow-xl">
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h4 className="font-black text-lg text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 7: Monitoring */}
              <section id="monitoring" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-red-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Eye className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Monitoring & Incident Response</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4">24/7 Security Monitoring</h3>
                      <p className="text-lg text-slate-700 leading-relaxed font-medium">
                        We continuously monitor our systems for security threats, unusual activity, and potential vulnerabilities. 
                        Our security team uses automated tools and manual reviews to ensure the highest level of protection.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4">Incident Response</h3>
                      <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
                        In the event of a security incident, we have a comprehensive incident response plan:
                      </p>
                      <div className="grid md:grid-cols-3 gap-5">
                        {[
                          { step: '1', title: 'Detection', desc: 'Automated alerts and monitoring systems detect potential threats immediately' },
                          { step: '2', title: 'Response', desc: 'Security team responds within minutes to contain and investigate incidents' },
                          { step: '3', title: 'Notification', desc: 'Affected users are notified promptly with details and remediation steps' },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-red-50 to-white rounded-xl p-5 border-2 border-red-200">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-3">
                              <span className="text-white font-black text-lg">{item.step}</span>
                            </div>
                            <h4 className="font-black text-slate-900 mb-2">{item.title}</h4>
                            <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 8: Best Practices */}
              <section id="best-practices" className="group bg-white rounded-3xl border-2 border-slate-200/60 shadow-xl p-10 lg:p-12 scroll-mt-40 hover:shadow-2xl transition-all duration-300 hover:border-amber-300/60">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <AlertTriangle className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Security Best Practices</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">
                    While we handle security on our end, here are some recommendations for keeping your account secure:
                  </p>
                  <div className="space-y-4 mt-8">
                    {[
                      'Use a strong, unique password for your AMZDUDES account',
                      'Enable multi-factor authentication (MFA) when available',
                      'Never share your login credentials with anyone',
                      'Regularly review your account activity and connected stores',
                      'Keep your browser and operating system up to date',
                      'Log out of your account when using shared or public computers',
                      'Be cautious of phishing attempts and suspicious emails',
                    ].map((practice, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 bg-gradient-to-r from-amber-50 to-white rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-all shadow-md">
                        <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-semibold text-base">{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

