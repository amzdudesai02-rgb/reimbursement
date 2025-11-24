import { useMemo, useState } from "react";
import { Info, Filter, XCircle } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const currencyOptions = ["USD", "EUR", "GBP"];
const stores = ["All", "Cowell's Beach N' Bikini"];
const filterOptions = ["All", "Submitted", "Missing", "Pending"];

type Filters = {
  claimType: string;
  expiry: string;
  podBol: string;
  invoices: string;
  packingList: string;
  caseId: string;
  shipmentId: string;
  highPriority: boolean;
  newCaseNotes: boolean;
};

type FilterDropdownKey = "claimType" | "expiry" | "podBol" | "invoices" | "packingList";

interface FilterConfig {
  label: string;
  key: FilterDropdownKey;
  options: string[];
}

const filterConfig: FilterConfig[] = [
  { label: "Claim Type", key: "claimType", options: filterOptions },
  { label: "Expiry", key: "expiry", options: filterOptions },
  { label: "POD/BOL", key: "podBol", options: filterOptions },
  { label: "Invoices/PackingList", key: "invoices", options: filterOptions },
  { label: "PackingList Generator", key: "packingList", options: filterOptions },
];

export default function Documents() {
  const [currency, setCurrency] = useState("USD");
  const [store, setStore] = useState("All");
  const [filters, setFilters] = useState<Filters>({
    claimType: "All",
    expiry: "All",
    podBol: "All",
    invoices: "All",
    packingList: "All",
    caseId: "",
    shipmentId: "",
    highPriority: false,
    newCaseNotes: false,
  });
  const [entriesToShow, setEntriesToShow] = useState(5);

  const hasFilters = useMemo(() => {
    return (
      filters.claimType !== "All" ||
      filters.expiry !== "All" ||
      filters.podBol !== "All" ||
      filters.invoices !== "All" ||
      filters.packingList !== "All" ||
      filters.caseId !== "" ||
      filters.shipmentId !== "" ||
      filters.highPriority ||
      filters.newCaseNotes
    );
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      claimType: "All",
      expiry: "All",
      podBol: "All",
      invoices: "All",
      packingList: "All",
      caseId: "",
      shipmentId: "",
      highPriority: false,
      newCaseNotes: false,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inbound Documents</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
              Documentation FAQ
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg shadow hover:bg-teal-700">
              Request Assistance
            </button>
          </div>
        </div>

        {/* Top Summary Section */}
        <section className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap gap-4 justify-end">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {currencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {stores.map((option) => (
                <option key={option} value={option}>
                  Store: {option}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total amount recoverable</p>
              <p className="text-3xl font-semibold text-emerald-500 mt-2">$0.00</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                Active cases
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-3xl font-semibold text-gray-900 mt-2">0</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">Top Priority Cases (0)</h3>
            </div>
            <p className="text-sm text-gray-500">No priority cases found.</p>
          </div>
        </section>

        {/* Active Cases Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-6 pt-6">
            <div className="flex items-center gap-6 border-b border-gray-200">
              <button className="pb-4 text-sm font-semibold text-teal-600 border-b-2 border-teal-600">
                Active Cases
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-teal-600 bg-teal-50 rounded-full">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 flex flex-wrap items-center gap-3 text-sm">
            <button className="inline-flex items-center gap-2 text-teal-600 font-medium">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700">
                <XCircle className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {filterConfig.map((config) => (
                <div key={config.key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{config.label}</label>
                  <select
                    value={filters[config.key]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [config.key]: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {config.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Case ID</label>
                <input
                  type="text"
                  value={filters.caseId}
                  onChange={(e) => setFilters((prev) => ({ ...prev, caseId: e.target.value }))}
                  placeholder="Enter Case ID"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Shipment ID</label>
                <input
                  type="text"
                  value={filters.shipmentId}
                  onChange={(e) => setFilters((prev) => ({ ...prev, shipmentId: e.target.value }))}
                  placeholder="Enter Shipment ID"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.highPriority}
                  onChange={(e) => setFilters((prev) => ({ ...prev, highPriority: e.target.checked }))}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                High priority
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.newCaseNotes}
                  onChange={(e) => setFilters((prev) => ({ ...prev, newCaseNotes: e.target.checked }))}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                New case notes
              </label>
            </div>
          </div>

          {/* Table */}
          <div className="px-6 pb-6">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Store Name",
                      "FBA Shipment ID",
                      "Expires",
                      "Total Potential Value",
                      "POD/BOL",
                      "Brand Registry",
                      "Invoices/PackingList",
                      "PackingList Generator",
                      "Case Action",
                    ].map((heading) => (
                      <th key={heading} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500">
                      No data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 mt-4">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={entriesToShow}
                  onChange={(e) => setEntriesToShow(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {[5, 10, 25].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span>Entries</span>
              </div>
              <p>
                Showing 0 to 0 of 0 results
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-500 bg-white cursor-not-allowed" disabled>
                  Previous
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-500 bg-white cursor-not-allowed" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

