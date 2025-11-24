import { useState } from "react";
import { Info, Search, Filter } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

type TemplateProps = {
  title: string;
  subtitle: string;
  metricsLabel?: string;
};

function FbaTemplate({ title, subtitle, metricsLabel = "Total Savings" }: TemplateProps) {
  const [store, setStore] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-500 mt-1">{subtitle}</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow hover:bg-teal-700">
            Request Assistance
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              {metricsLabel}
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold text-emerald-500 mt-2">0</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Open Cases</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Pending Actions</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">0</p>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 pt-6">
            <div className="flex items-center gap-6 border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2 text-teal-600 font-semibold">
                <Filter className="h-4 w-4" />
                Filters
              </div>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="All">Store: All</option>
                <option value="Cowell's Beach N' Bikini">Cowell's Beach N' Bikini</option>
              </select>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search table..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Store", "Title", "SKU", "ASIN", "Status", "Updated"].map((heading) => (
                      <th key={heading} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                      No records found for the selected filters.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export function FbaFeesPage() {
  return <FbaTemplate title="FBA Fees" subtitle="Track reimbursement opportunities for incorrect FBA fee charges." />;
}

export function WeightDimsAlertPage() {
  return (
    <FbaTemplate
      title="Weight & Dims Alert NA"
      subtitle="Identify ASINs flagged by Amazon for mismatched weight and dimension data."
    />
  );
}

export function WdSuccessfulCasesPage() {
  return (
    <FbaTemplate
      title="W&D Successful Cases"
      subtitle="Review successful weight and dimension appeals and their outcomes."
      metricsLabel="Successful Recoveries"
    />
  );
}

export function ExportImportDimensionsPage() {
  return (
    <FbaTemplate
      title="Export/Import Dimensions"
      subtitle="Manage bulk exports or imports of weight & dimension data for auditing."
      metricsLabel="Pending Uploads"
    />
  );
}

export function FeeCalculatorPage() {
  return (
    <FbaTemplate
      title="Fee Calculator"
      subtitle="Simulate costs and recovery potential using the Amazon fee calculator."
      metricsLabel="Estimated Savings"
    />
  );
}

