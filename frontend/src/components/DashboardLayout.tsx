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
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import logo from '../assets/logo.png';

interface DashboardLayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
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
      {/* Left Sidebar with Tabs */}
      <aside className="w-64 bg-gray-800 flex flex-col py-4">
        {/* Logo */}
        <div className="px-4 mb-8">
          <img src={logo} alt="Logo" className="h-10 w-10" />
        </div>

        {/* Navigation Tabs with Icons and Labels */}
        <nav className="flex-1 space-y-1 px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Logout</span>
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

