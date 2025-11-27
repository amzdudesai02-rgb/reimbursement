import { useState } from "react";
import { Search, Download, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import {
  tableWrapperClass,
  tableClass,
  tableHeadClass,
  tableBodyClass,
  tableCellClass,
  tableFooterClass,
  emptyStateCellClass,
} from "../styles/tableTheme";

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

type ShipmentDetailReport = {
  storeName: string;
  shipmentId: string;
  asin: string;
  sellerSku: string;
  fulfillmentNetworkSku: string;
  shipped: number;
  received: number;
  discrepancies: number;
};

type DetectedLostAndDamaged = {
  storeName: string;
  transactionId: string;
  reason: string;
  eventDate: string;
  asin: string;
  sellerSku: string;
  fulfillmentNetworkSku: string;
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

const mockShipmentDetailReports: ShipmentDetailReport[] = [
  { storeName: "Cowell's Beach N' Bikini", shipmentId: "FBA1799D429L", asin: "B00EE4DC6W", sellerSku: "PAUPILAU-16OZ", fulfillmentNetworkSku: "X003ATDFSN", shipped: 96, received: 96, discrepancies: 0 },
  { storeName: "Cowell's Beach N' Bikini", shipmentId: "FBA1799D429L", asin: "B000BYCO2U", sellerSku: "1058285955", fulfillmentNetworkSku: "X003U2IYCS3", shipped: 48, received: 48, discrepancies: 0 },
  { storeName: "Cowell's Beach N' Bikini", shipmentId: "FBA1799D430M", asin: "B00EE4DC7X", sellerSku: "PAUPILAU-32OZ", fulfillmentNetworkSku: "X003ATDFSO", shipped: 120, received: 118, discrepancies: 2 },
  { storeName: "Cowell's Beach N' Bikini", shipmentId: "FBA1799D431N", asin: "B000BYCO3V", sellerSku: "1058285956", fulfillmentNetworkSku: "X003U2IYCS4", shipped: 72, received: 72, discrepancies: 0 },
  { storeName: "Cowell's Beach N' Bikini", shipmentId: "FBA1799D432O", asin: "B00EE4DC8Y", sellerSku: "PAUPILAU-64OZ", fulfillmentNetworkSku: "X003ATDFSP", shipped: 60, received: 59, discrepancies: 1 },
  { storeName: "Cowell's Beach N' Bikini", shipmentId: "FBA1799D433P", asin: "B000BYCO4W", sellerSku: "1058285957", fulfillmentNetworkSku: "X003U2IYCS5", shipped: 84, received: 84, discrepancies: 0 },
  { storeName: "Cowell's Beach N' Bikini", shipmentId: "FBA1799D434Q", asin: "B00EE4DC9Z", sellerSku: "PAUPILAU-128OZ", fulfillmentNetworkSku: "X003ATDFSQ", shipped: 36, received: 35, discrepancies: 1 },
  { storeName: "Cowell's Beach N' Bikini", shipmentId: "FBA1799D435R", asin: "B000BYCO5X", sellerSku: "1058285958", fulfillmentNetworkSku: "X003U2IYCS6", shipped: 90, received: 90, discrepancies: 0 },
];

const mockDetectedLostAndDamaged: DetectedLostAndDamaged[] = [
  { storeName: "Cowell's Beach N' Bikini", transactionId: "TXN-2024-001234", reason: "Lost", eventDate: "2024-06-15", asin: "B00EE4DC6W", sellerSku: "PAUPILAU-16OZ", fulfillmentNetworkSku: "X003ATDFSN" },
  { storeName: "Cowell's Beach N' Bikini", transactionId: "TXN-2024-001235", reason: "Damaged", eventDate: "2024-06-16", asin: "B000BYCO2U", sellerSku: "1058285955", fulfillmentNetworkSku: "X003U2IYCS3" },
  { storeName: "Cowell's Beach N' Bikini", transactionId: "TXN-2024-001236", reason: "Lost", eventDate: "2024-06-17", asin: "B00EE4DC7X", sellerSku: "PAUPILAU-32OZ", fulfillmentNetworkSku: "X003ATDFSO" },
  { storeName: "Cowell's Beach N' Bikini", transactionId: "TXN-2024-001237", reason: "Damaged", eventDate: "2024-06-18", asin: "B000BYCO3V", sellerSku: "1058285956", fulfillmentNetworkSku: "X003U2IYCS4" },
  { storeName: "Cowell's Beach N' Bikini", transactionId: "TXN-2024-001238", reason: "Lost", eventDate: "2024-06-19", asin: "B00EE4DC8Y", sellerSku: "PAUPILAU-64OZ", fulfillmentNetworkSku: "X003ATDFSP" },
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

  // Filter shipment detail reports
  const filteredShipmentDetails = mockShipmentDetailReports.filter((report) => {
    if (store !== "All" && report.storeName !== store) return false;
    if (searchQuery && !report.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !report.asin.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !report.sellerSku.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !report.fulfillmentNetworkSku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Filter detected lost and damaged
  const filteredDetectedLostAndDamaged = mockDetectedLostAndDamaged.filter((item) => {
    if (store !== "All" && item.storeName !== store) return false;
    if (claimTypes !== "All" && claimTypes !== "Select" && item.reason.toLowerCase() !== claimTypes.toLowerCase()) return false;
    if (searchQuery && !item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.asin.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.sellerSku.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.fulfillmentNetworkSku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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

  const totalPagesShipment = Math.ceil(filteredShipmentDetails.length / entriesPerPage);
  const startIndexShipment = (currentPage - 1) * entriesPerPage;
  const endIndexShipment = startIndexShipment + entriesPerPage;
  const paginatedShipmentDetails = filteredShipmentDetails.slice(startIndexShipment, endIndexShipment);

  const totalPagesDetected = Math.ceil(filteredDetectedLostAndDamaged.length / entriesPerPage);
  const startIndexDetected = (currentPage - 1) * entriesPerPage;
  const endIndexDetected = startIndexDetected + entriesPerPage;
  const paginatedDetectedLostAndDamaged = filteredDetectedLostAndDamaged.slice(startIndexDetected, endIndexDetected);

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

            {/* Show additional filters for Summary tab */}
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

            {/* Show Status filter for Shipment Detail Report tab */}
            {activeTab === 3 && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Complete">Complete</option>
                <option value="Pending">Pending</option>
                <option value="Discrepancy">Discrepancy</option>
              </select>
            )}

            {/* Show Claim Types filter for Detected Lost and Damaged tab */}
            {activeTab === 4 && (
              <select
                value={claimTypes}
                onChange={(e) => setClaimTypes(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="All">Claim Types: Select</option>
                <option value="lost">Lost</option>
                <option value="damaged">Damaged</option>
              </select>
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
              <div className={tableWrapperClass}>
                <div className="overflow-x-auto">
                  <table className={tableClass}>
                    <thead className={tableHeadClass}>
                  <tr>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                        ID
                        <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                        </div>
                      </div>
                    </th>
                        <th className="px-6 py-3">
                      Store Name
                    </th>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                        Created Date
                        <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                        </div>
                      </div>
                    </th>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                        Filed Date
                        <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                        </div>
                      </div>
                    </th>
                        <th className="px-6 py-3">
                      Case Status
                    </th>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                        Potential Value (net proceeds)
                        <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                        </div>
                      </div>
                    </th>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                        Actual Recovered
                        <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                        </div>
                      </div>
                    </th>
                        <th className="px-6 py-3">
                      Amazon Case ID
                    </th>
                        <th className="px-6 py-3">
                      Reimbursement ID(s)
                    </th>
                  </tr>
                </thead>
                    <tbody className={tableBodyClass}>
                  {paginatedSummaryCases.map((caseItem) => (
                        <tr key={caseItem.id} className="transition-colors hover:bg-white/5">
                          <td className={`${tableCellClass} whitespace-nowrap font-semibold`}>
                        {caseItem.id}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {caseItem.storeName}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {caseItem.createdDate}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {caseItem.filedDate}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                            <span
                              className={`text-sm font-semibold ${
                                caseItem.caseStatus === "SUCCESS"
                                  ? "text-emerald-300"
                                  : caseItem.caseStatus === "RESOLVED"
                                  ? "text-sky-300"
                                  : "text-amber-300"
                              }`}
                            >
                          {caseItem.caseStatus}
                        </span>
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap font-semibold text-white`}>
                        {currencyFormatter.format(caseItem.potentialValue)}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {caseItem.actualRecovered !== null
                          ? currencyFormatter.format(caseItem.actualRecovered)
                          : "-"}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {caseItem.amazonCaseId || "-"}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {caseItem.reimbursementId ? (
                              <span className="text-white/80">{caseItem.reimbursementId}</span>
                        ) : (
                              <span className="text-rose-300">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

                {/* Pagination */}
                <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
                  <div className="flex items-center gap-2">
                    <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                      className="rounded-xl border border-white/20 bg-transparent px-3 py-1 text-white focus:border-teal-300 focus:outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                    <span>Entries</span>
              </div>
                  <div>
                Showing {startIndexSummary + 1} to {Math.min(endIndexSummary, filteredSummaryCases.length)} of{" "}
                {filteredSummaryCases.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPagesSummary }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                          currentPage === page ? "bg-teal-500 text-white" : "border border-white/20 text-white hover:bg-white/10"
                        }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPagesSummary, p + 1))}
                  disabled={currentPage === totalPagesSummary}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reimbursement Reports Table */}
            {activeTab === 1 && (
              <div className={tableWrapperClass}>
                <div className="overflow-x-auto">
                  <table className={tableClass}>
                    <thead className={tableHeadClass}>
                  <tr>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                        Case Summary ID
                        <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                        </div>
                      </div>
                    </th>
                        <th className="px-6 py-3">
                      Store Name
                    </th>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                        Case Date Success
                        <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                        </div>
                      </div>
                    </th>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                        Reimbursement Date
                        <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                        </div>
                      </div>
                    </th>
                        <th className="px-6 py-3">
                      Reimbursement ID
                    </th>
                        <th className="px-6 py-3">
                      Amazon Case ID
                    </th>
                        <th className="px-6 py-3">
                      Amazon Order ID
                    </th>
                        <th className="px-6 py-3">
                      Reason
                    </th>
                  </tr>
                </thead>
                    <tbody className={tableBodyClass}>
                  {paginatedReports.map((report) => (
                        <tr key={report.caseSummaryId} className="transition-colors hover:bg-white/5">
                          <td className={`${tableCellClass} whitespace-nowrap font-semibold`}>
                        {report.caseSummaryId}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {report.storeName}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {report.caseDateSuccess}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {report.reimbursementDate}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {report.reimbursementId}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {report.amazonCaseId ? (
                          <a
                            href={`https://sellercentral.amazon.com/cases/${report.amazonCaseId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                                className="text-teal-200 hover:text-teal-100 hover:underline"
                          >
                            {report.amazonCaseId}
                          </a>
                        ) : (
                              <span className="text-white/40">-</span>
                        )}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                        {report.amazonOrderId}
                      </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                            <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold capitalize tracking-wide text-white">
                          {report.reason}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

                {/* Pagination */}
                <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
                  <div className="flex items-center gap-2">
                    <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                      className="rounded-xl border border-white/20 bg-transparent px-3 py-1 text-white focus:border-teal-300 focus:outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                    <span>Entries</span>
              </div>
                  <div>
                Showing {startIndexReports + 1} to {Math.min(endIndexReports, filteredReports.length)} of{" "}
                {filteredReports.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPagesReports }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                          currentPage === page ? "bg-teal-500 text-white" : "border border-white/20 text-white hover:bg-white/10"
                        }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPagesReports, p + 1))}
                  disabled={currentPage === totalPagesReports}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reversal Reports Table */}
            {activeTab === 2 && (
              <div className={tableWrapperClass}>
                <div className="overflow-x-auto">
                  <table className={tableClass}>
                    <thead className={tableHeadClass}>
                      <tr>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                            Case No.
                            <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                            </div>
                          </div>
                        </th>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                            Store Name
                            <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                            </div>
                          </div>
                        </th>
                        <th className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                            Reversed Reimbursement Date
                            <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                            </div>
                          </div>
                        </th>
                        <th className="px-6 py-3">Reversed Reimbursement ID</th>
                        <th className="px-6 py-3">Origin Reimbursement ID</th>
                        <th className="px-6 py-3">Case ID</th>
                        <th className="px-6 py-3">SKU</th>
                      </tr>
                    </thead>
                    <tbody className={tableBodyClass}>
                      {paginatedReversalReports.map((report) => (
                        <tr key={report.caseNo} className="transition-colors hover:bg-white/5">
                          <td className={`${tableCellClass} whitespace-nowrap font-semibold`}>{report.caseNo}</td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>{report.storeName}</td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>{report.reversedReimbursementDate}</td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                            <a
                              href={`https://sellercentral.amazon.com/payments/reimbursement/view?reimbursementId=${report.reversedReimbursementId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-teal-200 hover:text-teal-100 hover:underline"
                            >
                              {report.reversedReimbursementId}
                              <ExternalLink className="h-3 w-3 text-amber-300" />
                            </a>
                          </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                            <a
                              href={`https://sellercentral.amazon.com/payments/reimbursement/view?reimbursementId=${report.originReimbursementId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-teal-200 hover:text-teal-100 hover:underline"
                            >
                              {report.originReimbursementId}
                              <ExternalLink className="h-3 w-3 text-amber-300" />
                            </a>
                          </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                            <a
                              href={`https://sellercentral.amazon.com/cases/${report.caseId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-teal-200 hover:text-teal-100 hover:underline"
                            >
                              {report.caseId}
                              <ExternalLink className="h-3 w-3 text-amber-300" />
                            </a>
                          </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>{report.sku}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
                  <div className="flex items-center gap-2">
                    <span>Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => {
                        setEntriesPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="rounded-xl border border-white/20 bg-transparent px-3 py-1 text-white focus:border-teal-300 focus:outline-none"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span>Entries</span>
                  </div>
                  <div>
                    Showing {startIndexReversal + 1} to {Math.min(endIndexReversal, filteredReversalReports.length)} of{" "}
                    {filteredReversalReports.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPagesReversal }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                          currentPage === page ? "bg-teal-500 text-white" : "border border-white/20 text-white hover:bg-white/10"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPagesReversal, p + 1))}
                      disabled={currentPage === totalPagesReversal}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

        {/* Shipment Detail Report Table */}
        {activeTab === 3 && (
          <div className={tableWrapperClass}>
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className={tableHeadClass}>
                  <tr>
                    {["Store Name", "Shipment ID", "ASIN", "Seller SKU", "Fulfillment Network SKU", "Shipped", "Received", "Discrepancies"].map(
                      (heading) => (
                        <th key={heading} className="px-6 py-3">
                          <div className="flex items-center gap-1 text-teal-50">
                            {heading}
                            <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-white/60" />
                              <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                            </div>
                          </div>
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className={tableBodyClass}>
                  {paginatedShipmentDetails.map((report, index) => (
                    <tr key={`${report.shipmentId}-${report.asin}-${index}`} className="transition-colors hover:bg-white/5">
                      <td className={`${tableCellClass} whitespace-nowrap`}>{report.storeName}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{report.shipmentId}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{report.asin}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{report.sellerSku}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{report.fulfillmentNetworkSku}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{report.shipped}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{report.received}</td>
                      <td className={`${tableCellClass} whitespace-nowrap`}>{report.discrepancies === 0 ? "--" : report.discrepancies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-xl border border-white/20 bg-transparent px-3 py-1 text-white focus:border-teal-300 focus:outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>Entries</span>
              </div>
              <div>
                Showing {startIndexShipment + 1} to {Math.min(endIndexShipment, filteredShipmentDetails.length)} of {filteredShipmentDetails.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPagesShipment }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      currentPage === page ? "bg-teal-500 text-white" : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPagesShipment, p + 1))}
                  disabled={currentPage === totalPagesShipment}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detected Lost and Damaged Tab */}
        {activeTab === 4 && (
          <>
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 text-blue-900">
              <p className="text-sm leading-relaxed">
                These are transaction IDs proactively identified by Amazon. If they are in this list it means they have not yet been reimbursed. Seller Investigators will continue to monitor this queue and file a case on your behalf if no reimbursements are made in 15 business days from the event date.
              </p>
            </div>

            <div className={tableWrapperClass}>
              <div className="overflow-x-auto">
                <table className={tableClass}>
                  <thead className={tableHeadClass}>
                    <tr>
                      {["Store Name", "Transaction ID", "Reason", "Event Date", "ASIN", "Seller SKU", "Fulfillment Network SKU"].map(
                        (heading) => (
                          <th key={heading} className="px-6 py-3">
                            <div className="flex items-center gap-1 text-teal-50">
                              {heading}
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-white/60" />
                                <ChevronDown className="h-3 w-3 -mt-1 text-white/60" />
                              </div>
                            </div>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className={tableBodyClass}>
                    {paginatedDetectedLostAndDamaged.length > 0 ? (
                      paginatedDetectedLostAndDamaged.map((item, index) => (
                        <tr key={`${item.transactionId}-${index}`} className="transition-colors hover:bg-white/5">
                          <td className={`${tableCellClass} whitespace-nowrap`}>{item.storeName}</td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>{item.transactionId}</td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>
                            <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                              {item.reason}
                            </span>
                          </td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>{item.eventDate}</td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>{item.asin}</td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>{item.sellerSku}</td>
                          <td className={`${tableCellClass} whitespace-nowrap`}>{item.fulfillmentNetworkSku}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className={emptyStateCellClass}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className={`${tableFooterClass} flex flex-wrap items-center justify-between gap-3`}>
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-xl border border-white/20 bg-transparent px-3 py-1 text-white focus:border-teal-300 focus:outline-none"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>Entries</span>
                </div>
                <div>
                  Showing {startIndexDetected + 1} to {Math.min(endIndexDetected, filteredDetectedLostAndDamaged.length)} of {filteredDetectedLostAndDamaged.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPagesDetected }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        currentPage === page ? "bg-teal-500 text-white" : "border border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPagesDetected, p + 1))}
                    disabled={currentPage === totalPagesDetected}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 0 && activeTab !== 1 && activeTab !== 2 && activeTab !== 3 && activeTab !== 4 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center">
            <p className="text-gray-600">{tabs[activeTab]} content coming soon...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
