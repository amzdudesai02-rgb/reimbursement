import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Box,
  Package,
  Users,
  Settings,
  LogOut,
  FolderOpen,
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import logo from '../assets/logo.png';

interface DashboardLayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderOpen, label: 'Cases', path: '/cases' },
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar with Tabs */}
      <aside className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 flex-shrink-0 space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-8 w-8" />
        </div>

        {/* Navigation Tabs with Icons and Labels */}
        <nav className="flex-1 flex flex-col items-center space-y-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
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
                <span className="pointer-events-none absolute left-16 top-1/2 -translate-y-1/2 rounded-lg bg-gray-900 px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 whitespace-nowrap">
                  {item.label}
                </span>
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

