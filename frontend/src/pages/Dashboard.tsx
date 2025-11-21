import { useEffect, useState } from "react";
import { Info, Menu } from "lucide-react";
import { api } from "../lib/api";
import type { Summary } from "../types";
import DashboardLayout from "../components/DashboardLayout";

const currencyFormatter = (currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

// Donut Chart Component
function DonutChart({ value, label, color = "text-green-600" }: { value: string; label: string; color?: string }) {
  const percentage = 75; // Mock percentage for the donut
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const isGreen = color.includes('green');

  return (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <svg className="transform -rotate-90 w-32 h-32">
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={isGreen ? 'text-green-500' : 'text-blue-500'}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-xl font-bold ${isGreen ? 'text-green-600' : 'text-blue-600'}`}>{value}</div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
      </div>
    </div>
  );
}

type BreakdownRow = {
  label: string;
  amount: number;
  cases: number;
};

type CardData = {
  title: string;
  amount: number;
  cases: number;
  rows: BreakdownRow[];
  showChart: boolean;
};

const actionItems = [
  { label: "Other Documents", cases: 0 },
  { label: "Needed", cases: 0 },
  { label: "Signature Needed", cases: 0 },
  { label: "Invoice Needed", cases: 0 },
  { label: "Permissions Revoked", cases: 0 },
  { label: "Credit Card Issue", cases: 1 },
  { label: "API Issue", cases: 0 },
  { label: "API Scopes", cases: 1 },
];

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [dateRange, setDateRange] = useState("All Time");
  const [store, setStore] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const summaryRes = await api.get<Summary>("/summary");
        setSummary(summaryRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    }
    bootstrap();
  }, []);

  const currency = summary?.currency ?? "USD";
  const format = currencyFormatter(currency);

  // Create card data with state
  const [dashboardCards, setDashboardCards] = useState<CardData[]>([
    {
      title: "Total Recovered",
      amount: summary?.total_amount ?? 4792,
      cases: summary?.row_count ?? 18,
      showChart: true,
      rows: [
        { label: "Inbound", amount: 4392, cases: 2 },
        { label: "Cancelled", amount: 0, cases: 0 },
        { label: "Shipments", amount: 0, cases: 0 },
        { label: "Lost", amount: 275, cases: 12 },
        { label: "Damaged", amount: 125, cases: 4 },
        { label: "Returns", amount: 0, cases: 0 },
        { label: "Removal Orders", amount: 0, cases: 0 },
        { label: "Overcharged Fee", amount: 0, cases: 0 },
        { label: "Lost In Transit", amount: 0, cases: 0 },
        { label: "Awd Inbound", amount: 0, cases: 0 },
      ],
    },
    {
      title: "Awaiting Amazon Decision",
      amount: 0,
      cases: 0,
      showChart: false,
      rows: [],
    },
    {
      title: "In the Pipeline",
      amount: 24533,
      cases: 164,
      showChart: true,
      rows: [
        { label: "Inbound", amount: 24327, cases: 152 },
        { label: "Cancelled", amount: 0, cases: 9 },
        { label: "Shipments", amount: 0, cases: 0 },
        { label: "Lost", amount: 0, cases: 0 },
        { label: "Damaged", amount: 206, cases: 3 },
        { label: "Returns", amount: 0, cases: 0 },
        { label: "Removal Orders", amount: 0, cases: 0 },
        { label: "Overcharged Fee", amount: 0, cases: 0 },
        { label: "Lost In Transit", amount: 0, cases: 0 },
        { label: "Awd Inbound", amount: 0, cases: 0 },
      ],
    },
  ]);

  // Update card data when summary changes
  useEffect(() => {
    if (summary) {
      setDashboardCards((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          amount: summary.total_amount,
          cases: summary.row_count,
        };
        return updated;
      });
    }
  }, [summary]);

  const totalActionItems = actionItems.reduce((sum, item) => sum + item.cases, 0);

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
    // Here you would typically refetch data with the new date range
    console.log("Date range changed to:", e.target.value);
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStore(e.target.value);
    // Here you would typically refetch data with the new store filter
    console.log("Store changed to:", e.target.value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Title and Filters */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
            >
              <Menu className="h-4 w-4" />
              Filters
            </button>
            <select 
              value={dateRange}
              onChange={handleDateRangeChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer shadow-sm transition-all"
            >
              <option value="All Time">Date Range: All Time</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 90 days">Last 90 days</option>
            </select>
            <select 
              value={store}
              onChange={handleStoreChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer shadow-sm transition-all"
            >
              <option value="All">Store: All</option>
              <option value="Cowell's Beach N' Bikini">Cowell&apos;s Beach N&apos; Bikini</option>
            </select>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">NA Region</h2>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Three Main Cards */}
          {dashboardCards.map((card, index) => (
            <div key={card.title} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-800">{card.title}</h3>
                <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
              </div>

              {card.showChart && card.amount > 0 ? (
                <>
                  <DonutChart
                    value={format.format(card.amount)}
                    label={`${card.cases} Cases`}
                    color={index === 0 ? "text-green-600" : "text-blue-600"}
                  />
                  <div className="mt-5 space-y-2 max-h-64 overflow-y-auto">
                    {card.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between text-xs py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-600 font-medium">{row.label}</span>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-900 font-semibold w-20 text-right">{format.format(row.amount)}</span>
                          <span className="text-gray-500 w-10 text-right">{row.cases}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => console.log("View Stores clicked for", card.title)}
                    className="mt-5 w-full py-2.5 text-xs font-semibold text-teal-600 hover:text-white hover:bg-teal-600 border-2 border-teal-200 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    View Stores
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                    <div className="text-2xl font-bold text-gray-400">N/A</div>
                  </div>
                  <p className="text-sm text-gray-500 px-4">
                    No cases are pending Amazon Decision for time period.
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Action Required Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between shadow-sm">
              <h3 className="text-sm font-semibold text-white">Action Required</h3>
              <Info className="h-4 w-4 text-white/90 hover:text-white cursor-help transition-colors" />
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-5 text-center border border-gray-200 shadow-inner">
                <div className="text-5xl font-bold text-gray-900 mb-2">{totalActionItems}</div>
                <div className="text-sm text-gray-600 font-medium">items require your attention</div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {actionItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between text-sm py-2.5 px-3 rounded-lg transition-colors ${
                      item.cases > 0 
                        ? "bg-red-50 border border-red-100" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`font-medium ${item.cases > 0 ? "text-red-700" : "text-gray-600"}`}>
                      {item.label}
                    </span>
                    <span className={`font-bold text-base ${item.cases > 0 ? "text-red-600" : "text-gray-400"}`}>
                      {item.cases}
                    </span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => console.log("View Actions clicked")}
                className="mt-5 w-full py-2.5 text-sm font-semibold text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-200 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                View Actions
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
