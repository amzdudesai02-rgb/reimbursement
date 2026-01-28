import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  Store,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { api } from '../lib/api';

const fallbackInitials = 'AD';

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
  { type: 'link', icon: Store, label: 'Manage Stores', path: '/stores' },
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
  const { token, logout } = useAuth();
  const [isFbaExpanded, setIsFbaExpanded] = useState(false);
  const [userCollapsedFba, setUserCollapsedFba] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeFbaIndex = fbaSubItems.findIndex((item) => location.pathname === item.path);
  const isFbaRoute = activeFbaIndex >= 0;
  const fbaSlotHeight = 48; // 12 (h-12) * 4 px base spacing

  useEffect(() => {
    if (isFbaRoute && !userCollapsedFba) {
      setIsFbaExpanded(true);
    }
    if (!isFbaRoute) {
      setIsFbaExpanded(false);
      setUserCollapsedFba(false);
    }
  }, [isFbaRoute, userCollapsedFba]);

  const showFbaPanel = isFbaExpanded && !userCollapsedFba;

  // Load current user profile for initials
  useEffect(() => {
    if (!token) {
      setProfileName(null);
      setProfileEmail(null);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => {
        setProfileName(res.data.name ?? null);
        setProfileEmail(res.data.email ?? null);
      })
      .catch(() => {
        // Silent failure – keep fallback initials
      });
  }, [token]);

  const computedInitials = (() => {
    const source = (profileName || profileEmail || '').trim();
    if (!source) return fallbackInitials;
    const parts = source.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    // Single word (e.g. email or single name)
    const word = parts[0];
    if (word.length >= 2) return (word[0] + word[1]).toUpperCase();
    return word[0]?.toUpperCase() ?? fallbackInitials;
  })();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar with Tabs */}
      <aside className="relative w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 flex-shrink-0 space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center justify-center focus:outline-none"
            >
              <div className="h-12 w-12 overflow-hidden rounded-full bg-white text-gray-900 font-semibold flex items-center justify-center shadow-md border border-gray-200">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  computedInitials
                )}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute left-16 top-1/2 z-30 w-56 -translate-y-1/2 rounded-xl border border-gray-100 bg-white p-3 text-xs shadow-xl">
                <div className="mb-3">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.18em]">
                    Signed in as
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {profileName || 'Reimbursement User'}
                  </p>
                  {profileEmail && (
                    <p className="mt-0.5 text-[11px] text-gray-500 truncate">{profileEmail}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                >
                  Change profile picture
                </button>
                <p className="mt-2 text-[11px] text-gray-500">
                  This updates your picture locally in the app. We can later link this to your account settings.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setAvatarUrl(url);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs with Icons and Labels */}
        <nav className="flex-1 flex flex-col items-center space-y-3">
          {sidebarItems.map((item, index) => {
            if (item.type === 'fba') {
              return (
                <div key={`fba-${index}`} className="relative w-full flex justify-center">
                  {showFbaPanel ? (
                    <div className="relative flex flex-col items-stretch w-12 rounded-3xl overflow-hidden shadow-2xl border border-[#0C4958]/30 bg-[#0E5A6A]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsFbaExpanded(false);
                          setUserCollapsedFba(true);
                        }}
                        className="h-12 flex items-center justify-center text-white/90 hover:bg-[#0C4A56]"
                      >
                        <Boxes className="h-5 w-5" />
                      </button>
                      <div className="flex flex-col">
                        {fbaSubItems.map((subItem, idx) => {
                          const isActive = location.pathname === subItem.path;
                          return (
                            <button
                              key={subItem.path}
                              type="button"
                              onClick={() => {
                                navigate(subItem.path);
                                setIsFbaExpanded(true);
                                setUserCollapsedFba(false);
                              }}
                              className={`h-12 flex items-center justify-center transition-colors ${
                                isActive
                                  ? 'bg-[#CFE4EC] text-[#0E5A6A]'
                                  : 'bg-transparent text-white/90 hover:bg-[#0C4A56]'
                              } ${idx !== fbaSubItems.length - 1 ? 'border-b border-white/10' : ''}`}
                            >
                              <subItem.icon className="h-5 w-5" />
                            </button>
                          );
                        })}
                      </div>

                      {activeFbaIndex >= 0 && (
                        <span
                          className="absolute -right-[10px] h-4 w-4 bg-white rotate-45 shadow-md"
                          style={{ top: `${(activeFbaIndex + 1) * fbaSlotHeight + fbaSlotHeight / 2 - 8}px` }}
                        />
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-expanded={showFbaPanel}
                      className="flex items-center justify-center w-12 h-12 rounded-xl transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => {
                        navigate(fbaSubItems[0].path);
                        setIsFbaExpanded(true);
                        setUserCollapsedFba(false);
                      }}
                    >
                      <Boxes className="h-5 w-5" />
                    </button>
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
            <span className="pointer-events-none absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:-translate-y-1 whitespace-nowrap">
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

