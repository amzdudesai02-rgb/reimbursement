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
  const fbaSlotHeight = 40; // h-10 nav items

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
      {/* Premium sidebar: dark slate, subtle shadow, professional nav */}
      <aside className="relative w-20 flex flex-col items-center py-4 flex-shrink-0 min-h-0 overflow-visible bg-slate-800 border-r border-slate-700/80 shadow-xl">
        {/* Profile avatar - top */}
        <div className="flex items-center justify-center flex-shrink-0 mb-1">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-full"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-700 text-slate-200 text-sm font-semibold flex items-center justify-center ring-2 ring-slate-600">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  computedInitials
                )}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute left-16 top-1/2 z-30 w-56 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-2xl">
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

        {/* Navigation: all options visible, no visible scrollbar */}
        <nav className="flex-1 min-h-0 flex flex-col items-center space-y-1.5 overflow-y-auto overflow-x-visible w-full py-1 scrollbar-hide">
          {sidebarItems.map((item, index) => {
            if (item.type === 'fba') {
              return (
                <div key={`fba-${index}`} className="relative w-full flex justify-center">
                  {showFbaPanel ? (
                    <div className="relative flex flex-col items-stretch w-12 rounded-3xl overflow-visible shadow-2xl border border-[#0C4958]/30 bg-[#0E5A6A]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsFbaExpanded(false);
                          setUserCollapsedFba(true);
                        }}
                        className="h-10 flex items-center justify-center text-white/90 hover:bg-[#0C4A56]"
                      >
                        <Boxes className="h-4 w-4" />
                      </button>
                      <div className="flex flex-col">
                        {fbaSubItems.map((subItem, idx) => {
                          const isActive = location.pathname === subItem.path;
                          return (
                            <button
                              key={subItem.path}
                              type="button"
                              title={subItem.label}
                              className={`relative group h-10 flex items-center justify-center transition-colors ${
                                isActive
                                  ? 'bg-[#CFE4EC] text-[#0E5A6A]'
                                  : 'bg-transparent text-white/90 hover:bg-[#0C4A56]'
                              } ${idx !== fbaSubItems.length - 1 ? 'border-b border-white/10' : ''}`}
                              onClick={() => {
                                navigate(subItem.path);
                                setIsFbaExpanded(true);
                                setUserCollapsedFba(false);
                              }}
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[100] rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap border border-slate-700">
                                {subItem.label}
                              </span>
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
                      title="FBA"
                      className="relative group flex items-center justify-center w-10 h-10 rounded-xl transition-colors text-slate-400 hover:bg-slate-700 hover:text-white"
                      onClick={() => {
                        navigate(fbaSubItems[0].path);
                        setIsFbaExpanded(true);
                        setUserCollapsedFba(false);
                      }}
                    >
                      <Boxes className="h-4 w-4" />
                      <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[100] rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap border border-slate-700">
                        FBA
                      </span>
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
                title={item.label}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/40 ring-2 ring-teal-400/50'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {item.label && (
                  <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[100] rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap border border-slate-700">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout - always visible at bottom */}
        <div className="w-full flex items-center justify-center flex-shrink-0 pt-3 mt-auto border-t border-slate-700/80">
          <button
            type="button"
            onClick={logout}
            title="Logout"
            className="relative group flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="pointer-events-none absolute left-full ml-2 bottom-1/2 translate-y-1/2 z-[100] rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap border border-slate-700">
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

