import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Layers,
  FileText,
  Box,
  Package,
  Users,
  Settings,
  LogOut,
  Grid3x3,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import logo from '../assets/logo.png';

interface DashboardLayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard', active: true },
  { icon: Layers, label: 'Reports', path: '/reports' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: Box, label: 'Inventory', path: '/inventory' },
  { icon: Package, label: 'Orders', path: '/orders' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-20 bg-gray-800 flex flex-col items-center py-4">
        {/* Logo */}
        <div className="mb-8">
          <img src={logo} alt="Logo" className="h-10 w-10" />
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 space-y-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-gray-400 hover:text-white hover:bg-gray-700 w-12 h-12 rounded-lg transition-colors flex items-center justify-center"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Grid3x3 className="h-5 w-5 text-gray-400" />
              <BarChart3 className="h-5 w-5 text-teal-500" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">MUNAAM DURRANI</span>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Viewing:</span>
                <select className="border-none bg-transparent text-gray-700 font-medium cursor-pointer focus:outline-none">
                  <option>Cowell&apos;s Beach N&apos; Bikini</option>
                </select>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

