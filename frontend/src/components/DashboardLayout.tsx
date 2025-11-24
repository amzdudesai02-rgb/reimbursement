import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Package,
  Users,
  Settings,
  LogOut,
  FolderOpen,
  DollarSign,
  Scale,
  Upload,
  Boxes,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';
const brandInitials = 'AD';

interface DashboardLayoutProps {
  children: ReactNode;
}

type SidebarItem =
  | { type: 'link'; icon: LucideIcon; label: string; path: string }
  | { type: 'fba' };

const sidebarItems: SidebarItem[] = [
  { type: 'link', icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { type: 'link', icon: FolderOpen, label: 'Cases', path: '/cases' },
  { type: 'link', icon: FileText, label: 'Documents', path: '/documents' },
  { type: 'link', icon: Package, label: 'Orders', path: '/orders' },
  { type: 'fba' },
  { type: 'link', icon: Users, label: 'Users', path: '/users' },
  { type: 'link', icon: Settings, label: 'Settings', path: '/settings' },
];

const fbaSubItems = [
  { icon: DollarSign, label: 'FBA Fees', path: '/fba-fees' },
  { icon: Boxes, label: 'Weight & Dims Alert NA', path: '/weight-dims-alert' },
  { icon: Boxes, label: 'W&D Successful Cases', path: '/wd-successful-cases' },
  { icon: Upload, label: 'Export/Import Dimensions', path: '/export-import-dimensions' },
  { icon: Scale, label: 'Fee Calculator', path: '/fee-calculator' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isFbaExpanded, setIsFbaExpanded] = useState(false);
  const isFbaRoute = fbaSubItems.some((item) => location.pathname === item.path);

  useEffect(() => {
    if (isFbaRoute) {
      setIsFbaExpanded(true);
    }
  }, [isFbaRoute]);

  const showFbaPanel = isFbaExpanded || isFbaRoute;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar with Tabs */}
      <aside className="relative w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 flex-shrink-0 space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-white text-gray-900 font-semibold flex items-center justify-center shadow-md border border-gray-200">
            {brandInitials}
          </div>
        </div>

        {/* Navigation Tabs with Icons and Labels */}
        <nav className="flex-1 flex flex-col items-center space-y-3">
          {sidebarItems.map((item, index) => {
            if (item.type === 'fba') {
              return (
                <div key={`fba-${index}`} className="relative w-full flex justify-center">
                  <button
                    type="button"
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${
                      showFbaPanel
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      if (showFbaPanel) {
                        setIsFbaExpanded(false);
                      } else {
                        navigate(fbaSubItems[0].path);
                        setIsFbaExpanded(true);
                      }
                    }}
                  >
                    <Boxes className="h-5 w-5" />
                  </button>

                  {showFbaPanel && (
                    <>
                      <span className="absolute left-[60px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-teal-200 drop-shadow" />
                      <div className="absolute left-[74px] top-1/2 -translate-y-1/2 bg-white border border-teal-200 rounded-2xl px-2 py-3 flex flex-col items-center space-y-3 shadow-lg">
                        {fbaSubItems.map((subItem) => {
                          const Icon = subItem.icon;
                          const isActive = location.pathname === subItem.path;
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`group relative flex items-center justify-center h-11 w-11 rounded-xl transition ${
                                isActive
                                  ? 'bg-teal-600 text-white shadow shadow-teal-400/40'
                                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              <div className="absolute left-14 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                <span className="h-3 w-3 bg-teal-100 rotate-45 rounded-sm shadow-sm" />
                                <span className="px-3 py-1 rounded-lg bg-teal-100 text-xs font-semibold text-teal-900 shadow border border-teal-200 whitespace-nowrap">
                                  {subItem.label}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path!}
                className="relative group flex items-center justify-center w-full"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {item.label && (
                  <span className="pointer-events-none absolute left-16 top-1/2 -translate-y-1/2 rounded-lg bg-gray-900 px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="w-full flex items-center justify-center">
          <button
            onClick={logout}
            className="relative group flex items-center justify-center w-12 h-12 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="pointer-events-none absolute left-16 top-1/2 -translate-y-1/2 rounded-lg bg-gray-900 px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - No Header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

