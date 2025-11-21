import { useState } from "react";
import { Search, Download, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

type SummaryCase = {
  id: number;
  storeName: string;
  createdDate: string;
  filedDate: string;
  caseStatus: "RESOLVED" | "SUCCESS" | "PENDING";
  potentialValue: number;
  actualRecovered: number | null;
  amazonCaseId: string | null;
  reimbursementId: string | null;
};

type ReimbursementReport = {
  caseSummaryId: number;
  storeName: string;
  caseDateSuccess: string;
  reimbursementDate: string;
  reimbursementId: string;
  amazonCaseId: string;
  amazonOrderId: string;
  reason: string;
};

type ReversalReport = {
  caseNo: number;
  storeName: string;
  reversedReimbursementDate: string;
  reversedReimbursementId: string;
  originReimbursementId: string;
  caseId: string;
  sku: string;
};

const mockSummaryCases: SummaryCase[] = [
  { id: 2491975, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-07-02", filedDate: "-", caseStatus: "RESOLVED", potentialValue: 0.00, actualRecovered: null, amazonCaseId: null, reimbursementId: null },
  { id: 2340473, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-06-07", filedDate: "2024-05-09", caseStatus: "SUCCESS", potentialValue: 7.45, actualRecovered: 21.19, amazonCaseId: "15250064371", reimbursementId: "14961849691" },
  { id: 1538135, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-01-26", filedDate: "2024-05-03", caseStatus: "SUCCESS", potentialValue: 23.66, actualRecovered: 33.25, amazonCaseId: "15214472821", reimbursementId: "14940754861" },
  { id: 1538136, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-01-27", filedDate: "-", caseStatus: "RESOLVED", potentialValue: 1843.68, actualRecovered: 1648.32, amazonCaseId: "15363954821", reimbursementId: "15100436301" },
  { id: 1538137, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-02-15", filedDate: "-", caseStatus: "PENDING", potentialValue: 125.50, actualRecovered: null, amazonCaseId: null, reimbursementId: null },
  { id: 1538138, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-03-10", filedDate: "2024-03-05", caseStatus: "SUCCESS", potentialValue: 45.20, actualRecovered: 50.00, amazonCaseId: "15250064372", reimbursementId: "14961849692" },
  { id: 1538139, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-04-20", filedDate: "-", caseStatus: "RESOLVED", potentialValue: 0.00, actualRecovered: null, amazonCaseId: null, reimbursementId: null },
  { id: 1538140, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-05-12", filedDate: "2024-05-08", caseStatus: "SUCCESS", potentialValue: 89.30, actualRecovered: 95.50, amazonCaseId: "15250064373", reimbursementId: "14961849693" },
  { id: 1538141, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-06-01", filedDate: "-", caseStatus: "PENDING", potentialValue: 200.00, actualRecovered: null, amazonCaseId: null, reimbursementId: null },
  { id: 1538142, storeName: "Cowell's Beach N' Bikini", createdDate: "2024-06-15", filedDate: "2024-06-10", caseStatus: "SUCCESS", potentialValue: 156.75, actualRecovered: 175.00, amazonCaseId: "15250064374", reimbursementId: "14961849694" },
];

const mockReimbursementReports: ReimbursementReport[] = [
  { caseSummaryId: 1182093, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2023-11-28", reimbursementDate: "2023-11-27", reimbursementId: "13845284641", amazonCaseId: "14373324351", amazonOrderId: "N/A", reason: "lost" },
  { caseSummaryId: 1345469, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2023-12-29", reimbursementDate: "2023-12-28", reimbursementId: "14027108501", amazonCaseId: "14546203301", amazonOrderId: "N/A", reason: "damaged" },
  { caseSummaryId: 1538017, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-02-29", reimbursementDate: "2024-02-28", reimbursementId: "14464839611", amazonCaseId: "14718756021", amazonOrderId: "N/A", reason: "inbound" },
  { caseSummaryId: 1538018, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-03-15", reimbursementDate: "2024-03-14", reimbursementId: "14464839612", amazonCaseId: "14718756022", amazonOrderId: "N/A", reason: "lost" },
  { caseSummaryId: 1538019, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-03-20", reimbursementDate: "2024-03-19", reimbursementId: "14464839613", amazonCaseId: "14718756023", amazonOrderId: "N/A", reason: "damaged" },
  { caseSummaryId: 1538020, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-04-01", reimbursementDate: "2024-03-31", reimbursementId: "14464839614", amazonCaseId: "14718756024", amazonOrderId: "N/A", reason: "inbound" },
  { caseSummaryId: 1538021, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-04-10", reimbursementDate: "2024-04-09", reimbursementId: "14464839615", amazonCaseId: "14718756025", amazonOrderId: "N/A", reason: "lost" },
  { caseSummaryId: 1538022, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-04-15", reimbursementDate: "2024-04-14", reimbursementId: "14464839616", amazonCaseId: "14718756026", amazonOrderId: "N/A", reason: "damaged" },
  { caseSummaryId: 1538023, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-04-20", reimbursementDate: "2024-04-19", reimbursementId: "14464839617", amazonCaseId: "14718756027", amazonOrderId: "N/A", reason: "inbound" },
  { caseSummaryId: 1538024, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-05-01", reimbursementDate: "2024-04-30", reimbursementId: "14464839618", amazonCaseId: "14718756028", amazonOrderId: "N/A", reason: "lost" },
  { caseSummaryId: 1538025, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-05-05", reimbursementDate: "2024-05-04", reimbursementId: "14464839619", amazonCaseId: "14718756029", amazonOrderId: "N/A", reason: "damaged" },
  { caseSummaryId: 1538026, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-05-10", reimbursementDate: "2024-05-09", reimbursementId: "14464839620", amazonCaseId: "14718756030", amazonOrderId: "N/A", reason: "inbound" },
  { caseSummaryId: 1538027, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-05-15", reimbursementDate: "2024-05-14", reimbursementId: "14464839621", amazonCaseId: "14718756031", amazonOrderId: "N/A", reason: "lost" },
  { caseSummaryId: 1538028, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-05-20", reimbursementDate: "2024-05-19", reimbursementId: "14464839622", amazonCaseId: "14718756032", amazonOrderId: "N/A", reason: "damaged" },
  { caseSummaryId: 1538029, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-05-25", reimbursementDate: "2024-05-24", reimbursementId: "14464839623", amazonCaseId: "14718756033", amazonOrderId: "N/A", reason: "inbound" },
  { caseSummaryId: 1538030, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-06-01", reimbursementDate: "2024-05-31", reimbursementId: "14464839624", amazonCaseId: "14718756034", amazonOrderId: "N/A", reason: "lost" },
  { caseSummaryId: 1538031, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-06-05", reimbursementDate: "2024-06-04", reimbursementId: "14464839625", amazonCaseId: "14718756035", amazonOrderId: "N/A", reason: "damaged" },
  { caseSummaryId: 1538032, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-06-10", reimbursementDate: "2024-06-09", reimbursementId: "14464839626", amazonCaseId: "14718756036", amazonOrderId: "N/A", reason: "inbound" },
  { caseSummaryId: 1538033, storeName: "Cowell's Beach N' Bikini", caseDateSuccess: "2024-06-15", reimbursementDate: "2024-06-14", reimbursementId: "14464839627", amazonCaseId: "14718756037", amazonOrderId: "N/A", reason: "lost" },
];

const mockReversalReports: ReversalReport[] = [
  { caseNo: 1985268, storeName: "Cowell's Beach N' Bikini", reversedReimbursementDate: "2024-04-26", reversedReimbursementId: "14874910691", originReimbursementId: "14773564971", caseId: "15089847231", sku: "850030689252" },
  { caseNo: 1985269, storeName: "Cowell's Beach N' Bikini", reversedReimbursementDate: "2024-05-10", reversedReimbursementId: "14874910692", originReimbursementId: "14773564972", caseId: "15089847232", sku: "850030689253" },
  { caseNo: 1985270, storeName: "Cowell's Beach N' Bikini", reversedReimbursementDate: "2024-05-15", reversedReimbursementId: "14874910693", originReimbursementId: "14773564973", caseId: "15089847233", sku: "850030689254" },
  { caseNo: 1985271, storeName: "Cowell's Beach N' Bikini", reversedReimbursementDate: "2024-06-01", reversedReimbursementId: "14874910694", originReimbursementId: "14773564974", caseId: "15089847234", sku: "850030689255" },
  { caseNo: 1985272, storeName: "Cowell's Beach N' Bikini", reversedReimbursementDate: "2024-06-05", reversedReimbursementId: "14874910695", originReimbursementId: "14773564975", caseId: "15089847235", sku: "850030689256" },
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
  const [activeTab, setActiveTab] = useState(0); // Start with Summary tab
  const [store, setStore] = useState("All");
  const [claimTypes, setClaimTypes] = useState("All");
  const [status, setStatus] = useState("All");
  const [caseId, setCaseId] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  // Filter summary cases
  const filteredSummaryCases = mockSummaryCases.filter((caseItem) => {
    if (store !== "All" && caseItem.storeName !== store) return false;
    if (status !== "All" && caseItem.caseStatus !== status) return false;
    if (searchQuery && !caseItem.id.toString().includes(searchQuery) && 
        !caseItem.storeName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Filter reimbursement reports
  const filteredReports = mockReimbursementReports.filter((report) => {
    if (store !== "All" && report.storeName !== store) return false;
    if (searchQuery && !report.caseSummaryId.toString().includes(searchQuery) && 
        !report.reimbursementId.includes(searchQuery) &&
        !report.amazonCaseId.includes(searchQuery)) return false;
    return true;
  });

  // Filter reversal reports
  const filteredReversalReports = mockReversalReports.filter((report) => {
    if (store !== "All" && report.storeName !== store) return false;
    if (searchQuery && !report.caseNo.toString().includes(searchQuery) && 
        !report.reversedReimbursementId.includes(searchQuery) &&
        !report.originReimbursementId.includes(searchQuery) &&
        !report.caseId.includes(searchQuery) &&
        !report.sku.includes(searchQuery)) return false;
    return true;
  });

  const totalPagesSummary = Math.ceil(filteredSummaryCases.length / entriesPerPage);
  const startIndexSummary = (currentPage - 1) * entriesPerPage;
  const endIndexSummary = startIndexSummary + entriesPerPage;
  const paginatedSummaryCases = filteredSummaryCases.slice(startIndexSummary, endIndexSummary);

  const totalPagesReports = Math.ceil(filteredReports.length / entriesPerPage);
  const startIndexReports = (currentPage - 1) * entriesPerPage;
  const endIndexReports = startIndexReports + entriesPerPage;
  const paginatedReports = filteredReports.slice(startIndexReports, endIndexReports);

  const totalPagesReversal = Math.ceil(filteredReversalReports.length / entriesPerPage);
  const startIndexReversal = (currentPage - 1) * entriesPerPage;
  const endIndexReversal = startIndexReversal + entriesPerPage;
  const paginatedReversalReports = filteredReversalReports.slice(startIndexReversal, endIndexReversal);

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
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">Store: All</option>
              <option value="Cowell's Beach N' Bikini">Cowell's Beach N' Bikini</option>
            </select>

            {/* Show additional filters only for Summary tab */}
            {activeTab === 0 && (
              <>
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
                  <option value="PENDING">PENDING</option>
                </select>

                <select
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="All">Case ID: All</option>
                </select>
              </>
            )}

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

        {/* Summary Table */}
        {activeTab === 0 && (
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
                  {paginatedSummaryCases.map((caseItem) => (
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
                          className={`text-sm font-medium ${
                            caseItem.caseStatus === "SUCCESS"
                              ? "text-green-600"
                              : caseItem.caseStatus === "RESOLVED"
                              ? "text-blue-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {caseItem.caseStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {currencyFormatter.format(caseItem.potentialValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {caseItem.actualRecovered !== null
                          ? currencyFormatter.format(caseItem.actualRecovered)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {caseItem.amazonCaseId || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {caseItem.reimbursementId ? (
                          <span className="text-gray-700">{caseItem.reimbursementId}</span>
                        ) : (
                          <span className="text-red-600">N/A</span>
                        )}
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
                Showing {startIndexSummary + 1} to {Math.min(endIndexSummary, filteredSummaryCases.length)} of{" "}
                {filteredSummaryCases.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPagesSummary }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPagesSummary, p + 1))}
                  disabled={currentPage === totalPagesSummary}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reimbursement Reports Table */}
        {activeTab === 1 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Case Summary ID
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
                        Case Date Success
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3 text-gray-400" />
                          <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Reimbursement Date
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3 text-gray-400" />
                          <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reimbursement ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amazon Case ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amazon Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReports.map((report) => (
                    <tr key={report.caseSummaryId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.caseSummaryId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.storeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.caseDateSuccess}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.reimbursementDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.reimbursementId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.amazonCaseId ? (
                          <a
                            href={`https://sellercentral.amazon.com/cases/${report.amazonCaseId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                          >
                            {report.amazonCaseId}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.amazonOrderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
                          {report.reason}
                        </span>
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
                Showing {startIndexReports + 1} to {Math.min(endIndexReports, filteredReports.length)} of{" "}
                {filteredReports.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPagesReports }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPagesReports, p + 1))}
                  disabled={currentPage === totalPagesReports}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reversal Reports Table */}
        {activeTab === 2 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Case No.
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3 text-gray-400" />
                          <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Store Name
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3 text-gray-400" />
                          <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Reversed Reimbursement Date
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3 text-gray-400" />
                          <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reversed Reimbursement ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Origin Reimbursement ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Case ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      sku
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReversalReports.map((report) => (
                    <tr key={report.caseNo} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.caseNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.storeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.reversedReimbursementDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://sellercentral.amazon.com/reimbursements/${report.reversedReimbursementId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm inline-flex items-center gap-1"
                        >
                          {report.reversedReimbursementId}
                          <ExternalLink className="h-3 w-3 text-orange-500" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://sellercentral.amazon.com/reimbursements/${report.originReimbursementId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm inline-flex items-center gap-1"
                        >
                          {report.originReimbursementId}
                          <ExternalLink className="h-3 w-3 text-orange-500" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://sellercentral.amazon.com/cases/${report.caseId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm inline-flex items-center gap-1"
                        >
                          {report.caseId}
                          <ExternalLink className="h-3 w-3 text-orange-500" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.sku}
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
                Showing {startIndexReversal + 1} to {Math.min(endIndexReversal, filteredReversalReports.length)} of{" "}
                {filteredReversalReports.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPagesReversal }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPagesReversal, p + 1))}
                  disabled={currentPage === totalPagesReversal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 0 && activeTab !== 1 && activeTab !== 2 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center">
            <p className="text-gray-600">{tabs[activeTab]} content coming soon...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
