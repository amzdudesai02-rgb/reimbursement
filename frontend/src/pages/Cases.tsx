import { useState } from "react";
import { Search, Download, ChevronUp, ChevronDown } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

type CaseStatus = "RESOLVED" | "SUCCESS";

type Case = {
  id: number;
  storeName: string;
  createdDate: string;
  filedDate: string;
  caseStatus: CaseStatus;
  potentialValue: number;
  actualRecovered: number | null;
  amazonCaseId: string | null;
  reimbursementId: string | null;
};

const mockCases: Case[] = [
  { id: 2491975, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-07-02", filedDate: "2024-05-30", caseStatus: "RESOLVED", potentialValue: 0.00, actualRecovered: 5.75, amazonCaseId: "15363954821", reimbursementId: "15100436301" },
  { id: 2340473, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-06-07", filedDate: "2024-05-09", caseStatus: "SUCCESS", potentialValue: 7.45, actualRecovered: 21.19, amazonCaseId: "15250064371", reimbursementId: "14961849691" },
  { id: 1538135, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-01-26", filedDate: "2024-05-03", caseStatus: "SUCCESS", potentialValue: 23.66, actualRecovered: 33.25, amazonCaseId: "15214472821", reimbursementId: "14940754861" },
  { id: 1538136, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-01-27", filedDate: "-", caseStatus: "RESOLVED", potentialValue: 1843.68, actualRecovered: 1648.32, amazonCaseId: "", reimbursementId: "N/A" },
  // Add more mock data as needed
];

const tabs = [
  "Summary",
  "Reimbursement Reports",
  "Reversal Reports",
  "Shipment Detail Report",
  "Detected Lost and Damaged",
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function Cases() {
  const [activeTab, setActiveTab] = useState(0);
  const [store, setStore] = useState("All");
  const [claimTypes, setClaimTypes] = useState("All");
  const [status, setStatus] = useState("All");
  const [caseId, setCaseId] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  const filteredCases = mockCases.filter((caseItem) => {
    if (store !== "All" && caseItem.storeName !== store) return false;
    if (status !== "All" && caseItem.caseStatus !== status) return false;
    if (searchQuery && !caseItem.id.toString().includes(searchQuery)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredCases.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedCases = filteredCases.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cases</h1>
          
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 mb-6">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === index
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">Store: All</option>
              <option value="Cowell's Beach N' Bikini">Cowell's Beach N' Bikini</option>
            </select>

            <select
              value={claimTypes}
              onChange={(e) => setClaimTypes(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">Claim Types: All</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="SUCCESS">SUCCESS</option>
            </select>

            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">Case ID: All</option>
            </select>

            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      ID
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Store Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      Created Date
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      Filed Date
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Case Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      Potential Value (net proceeds)
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      Actual Recovered
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amazon Case ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reimbursement ID(s)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {caseItem.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.storeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.createdDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.filedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          caseItem.caseStatus === "SUCCESS"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {caseItem.caseStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {currencyFormatter.format(caseItem.potentialValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {caseItem.actualRecovered !== null
                        ? currencyFormatter.format(caseItem.actualRecovered)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.amazonCaseId || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.reimbursementId || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">Entries</span>
            </div>
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCases.length)} of{" "}
              {filteredCases.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-teal-600 text-white"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

