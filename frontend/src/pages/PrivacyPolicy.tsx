export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <p className="text-sm text-slate-500">Last Updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Introduction</h2>
          <p>
            AMZDUDES ("we," "our," or "us") operates the Reimbursement Dashboard application 
            (the "Service"). This Privacy Policy explains how we collect, use, store, and protect 
            information when you use our Service to connect your Amazon Seller Central account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Amazon Data Collection</h2>
          <p>
            When you connect your Amazon Seller Central account to our Service, we collect and 
            process the following types of Amazon data through the Selling Partner API (SP-API):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Financial Data:</strong> Reimbursement transactions, financial events, payment information, and related financial records</li>
            <li><strong>Orders Data:</strong> Order information, order IDs, and order-related details</li>
            <li><strong>FBA Reports:</strong> Fulfillment by Amazon (FBA) inventory adjustment reports, shipment details, fee preview reports, and inventory data</li>
            <li><strong>Inventory Data:</strong> SKU information, ASINs, product details, and inventory adjustments</li>
            <li><strong>Account Information:</strong> Seller Partner ID, marketplace IDs, and store information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. How We Use Your Data</h2>
          <p>We use the collected Amazon data solely for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Analysis & Reporting:</strong> To analyze reimbursement transactions and identify missing reimbursements</li>
            <li><strong>Dashboard Display:</strong> To display your reimbursement data, financial events, and inventory adjustments in the Service dashboard</li>
            <li><strong>Case Filing:</strong> To assist in filing reimbursement cases with Amazon on your behalf (if you authorize such actions)</li>
            <li><strong>Service Improvement:</strong> To improve the functionality and accuracy of our Service</li>
            <li><strong>Customer Support:</strong> To provide customer support and respond to your inquiries</li>
          </ul>
          <p className="mt-4">
            <strong>We do NOT:</strong> Sell, rent, or share your Amazon data with third parties for marketing purposes. 
            We do not use your data for any purpose other than providing the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Data Storage and Security</h2>
          <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">Storage Location</h3>
          <p>
            Your data is stored in secure databases hosted on cloud infrastructure. We use industry-standard 
            hosting providers with robust security measures.
          </p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">Encryption</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Encryption at Rest:</strong> All stored data is encrypted using AES-256 encryption</li>
            <li><strong>Encryption in Transit:</strong> All data transmission is encrypted using TLS 1.2 or higher protocols</li>
            <li><strong>Token Security:</strong> Amazon OAuth tokens and access credentials are encrypted before storage</li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">Security Measures</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Secure API communication with Amazon's SP-API</li>
            <li>Regular backups and disaster recovery procedures</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Data Access and Control</h2>
          <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">Who Can Access Your Data</h3>
          <p>
            Only authenticated sellers who own the data can access their own Amazon data through the Service. 
            We implement role-based access control (RBAC) and authentication mechanisms to ensure data security.
          </p>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">Access Control Methods</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>JWT (JSON Web Token) authentication for user sessions</li>
            <li>Role-based access control to restrict data access to authorized users only</li>
            <li>User authentication required for all data access</li>
            <li>Data isolation between different seller accounts</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">6. Data Retention</h2>
          <p>
            We retain your Amazon data for the following periods:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Active Accounts:</strong> Data is retained as long as your account is active and you continue to use the Service</li>
            <li><strong>Compliance:</strong> Financial and transactional data may be retained for up to 7 years to comply with legal and regulatory requirements</li>
            <li><strong>Account Deletion:</strong> Upon account deletion or closure, data will be deleted within 30 days, except where legal retention requirements apply</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">7. Data Deletion</h2>
          <p>
            You can request deletion of your data at any time by:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Deleting your account through the Service settings</li>
            <li>Disconnecting your Amazon Seller Central account from the Service</li>
            <li>Contacting us directly at the support email provided below</li>
          </ul>
          <p className="mt-4">
            Upon request, we will delete your data within 30 days, except where we are required to retain 
            certain data for legal, regulatory, or legitimate business purposes. Automated deletion processes 
            are in place to remove data after the retention period expires.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">8. Third-Party Services</h2>
          <p>
            Our Service integrates with Amazon's Selling Partner API (SP-API) to access your Seller Central data. 
            Your use of our Service is also subject to Amazon's Privacy Notice and Terms of Service. 
            We are not responsible for Amazon's data practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">9. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Disconnect your Amazon account at any time</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">10. Contact Information</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="bg-slate-50 p-4 rounded-lg mt-4">
            <p className="mb-2"><strong>Company Name:</strong> AMZDUDES</p>
            <p className="mb-2"><strong>Support Email:</strong> support@amzdudes.io</p>
            <p><strong>Website:</strong> https://reimbursement.amzdudes.io</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes 
            by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
            You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
      </div>
    </div>
  );
}

