import { useMemo, useState } from "react";
import { Filter, Search, Download, ChevronDown, ExternalLink } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

type RemovalOrder = {
  caseId: string;
  trackingNumber: string;
  carrier: string;
  shipmentDate: string;
  lastUpdateDate: string;
  status: string;
  removalOrderStatus: string;
  removalOrderId: string;
  items: number;
  itemsStatus: string;
  qty: number;
};

const dateOptions = ["All Time", "Last 7 Days", "Last 30 Days", "Current Quarter"];
const statusOptions = ["Select Status", "Completed", "In Progress", "Dispute", "Closed"];

const mockRemovalOrders: RemovalOrder[] = [
  {
    caseId: "3035573",
    trackingNumber: "1Z0F52710347881072",
    carrier: "UPS",
    shipmentDate: "2024-05-26 12:27:49",
    lastUpdateDate: "2024-05-28 20:57:52",
    status: "Completed",
    removalOrderStatus: "Completed",
    removalOrderId: "2405221S2Q",
    items: 1,
    itemsStatus: "-",
    qty: 5,
  },
  {
    caseId: "79551",
    trackingNumber: "1Z0F52710347878808",
    carrier: "UPS",
    shipmentDate: "2024-05-26 12:27:39",
    lastUpdateDate: "2024-05-28 20:57:52",
    status: "Completed",
    removalOrderStatus: "Completed",
    removalOrderId: "2405221S2Q",
    items: 1,
    itemsStatus: "-",
    qty: 2,
  },
  {
    caseId: "79552",
    trackingNumber: "1ZC6045K0301801395",
    carrier: "UPS",
    shipmentDate: "2024-05-23 17:34:41",
    lastUpdateDate: "2024-10-12 14:06:45",
    status: "Completed",
    removalOrderStatus: "Completed",
    removalOrderId: "ahclflzmO9",
    items: 1,
    itemsStatus: "-",
    qty: 1,
  },
  {
    caseId: "79553",
    trackingNumber: "1Z13148X03066331571",
    carrier: "UPS",
    shipmentDate: "2024-04-23 08:14:57",
    lastUpdateDate: "2024-04-30 04:11:04",
    status: "Completed",
    removalOrderStatus: "Completed",
    removalOrderId: "CGbzo3YYY8",
    items: 1,
    itemsStatus: "-",
    qty: 1,
  },
  {
    caseId: "79554",
    trackingNumber: "1ZC6045K0301525505",
    carrier: "UPS",
    shipmentDate: "2024-04-29 17:21:45",
    lastUpdateDate: "2024-04-30 04:11:04",
    status: "Completed",
    removalOrderStatus: "Completed",
    removalOrderId: "CGbzo3YYY8",
    items: 1,
    itemsStatus: "-",
    qty: 1,
  },
];

export default function Orders() {
  const [dateRange, setDateRange] = useState("All Time");
  const [status, setStatus] = useState("Select Status");
  const [fnsku, setFnsku] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [removalOrderId, setRemovalOrderId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    return mockRemovalOrders.filter((order) => {
      if (status !== "Select Status" && order.status !== status) return false;
      if (fnsku && !order.removalOrderId.toLowerCase().includes(fnsku.toLowerCase())) return false;
      if (trackingNumber && !order.trackingNumber.toLowerCase().includes(trackingNumber.toLowerCase())) return false;
      if (removalOrderId && !order.removalOrderId.toLowerCase().includes(removalOrderId.toLowerCase())) return false;
      if (
        searchTerm &&
        !order.caseId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [status, fnsku, trackingNumber, removalOrderId, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + entriesPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Removal Orders</h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">MUNAAM DURRANI</p>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition">
              Viewing: Cowell's Beach N' Bikini
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 text-teal-600 font-semibold">
            <Filter className="h-4 w-4" />
            Filters
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Shipment Date</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {dateOptions.map((option) => (
                  <option key={option} value={option}>
                    Date Range: {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">FNSKU/SKU</label>
              <input
                value={fnsku}
                onChange={(e) => setFnsku(e.target.value)}
                placeholder="FNSKU/SKU"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Tracking Number</label>
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking Number"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Removal Order ID</label>
              <input
                value={removalOrderId}
                onChange={(e) => setRemovalOrderId(e.target.value)}
                placeholder="Removal Order ID"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-lg min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Product Name, ASIN"
                className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Case ID",
                    "Tracking Number Carrier",
                    "Shipment Date Shipment Last Update Date Status",
                    "Removal Order Status",
                    "Removal Order",
                    "Items",
                    "Items Status",
                    "Qty",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedOrders.map((order) => (
                  <tr key={order.caseId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-teal-600 font-semibold">
                      <a href="#" className="hover:underline">
                        {order.caseId}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <p className="font-semibold">{order.trackingNumber}</p>
                      <p className="text-xs text-gray-500">{order.carrier}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <p>{order.shipmentDate}</p>
                      <p>{order.lastUpdateDate}</p>
                      <p className="text-gray-500">{order.status}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.removalOrderStatus}</td>
                    <td className="px-6 py-4 text-sm text-teal-600">
                      <button className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800">
                        {order.removalOrderId}
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.items}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.itemsStatus}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.qty}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col gap-2 w-24">
                        <button className="px-3 py-1.5 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600">
                          Dispute
                        </button>
                        <button className="px-3 py-1.5 text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600">
                          Close
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500">
                      No removal orders found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap items-center gap-4 justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
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
              Showing {filteredOrders.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 2), currentPage + 1)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === page
                        ? "bg-teal-600 border-teal-600 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

